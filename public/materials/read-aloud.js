/* Read aloud for guided-notes pages. Made by scripts/add_read_aloud.py, which also writes the
   manifest (#ra-manifest) and the data-ra attributes this file works from.

   A student presses Listen, hears one sentence (or question, or table row), and the page waits
   while they write. Space plays the next one. Bump ASSET_VERSION in the script when you change
   this file. */
(function () {
  'use strict';

  var mEl = document.getElementById('ra-manifest');
  if (!mEl) return;
  var M;
  try { M = JSON.parse(mEl.textContent); } catch (e) { return; }
  var probe = document.createElement('audio');
  if (!probe.canPlayType || !probe.canPlayType('audio/mpeg')) return;

  var F_CHAIN = 1, F_BLANK = 2, F_WRITE = 4;
  var RATES = [0.8, 1, 1.25];
  var RATE_NAMES = ['Slow', 'Normal', 'Fast'];

  // These must match add_read_aloud.py (atoms_of): the same text is skipped when counting characters.
  var SKIP_TAGS = { script: 1, style: 1, svg: 1, pre: 1, head: 1, noscript: 1, img: 1, hr: 1 };
  var SKIP_CLASSES = ['cover', 'key-link', 'key-check', 'name-line', 'al', 'al-short', 'al-pair', 'svg-wrap', 'viz-ak-note', 'ra-skip'];
  var OWN_SKIP = { ul: 1, ol: 1, div: 1, table: 1, figure: 1, p: 1, blockquote: 1 };

  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // ── The units, in reading order ──
  var units = [];
  var byBlock = new Map();
  (function build() {
    var blocks = {};
    Array.prototype.forEach.call(document.querySelectorAll('[data-ra]'), function (el) { blocks[el.getAttribute('data-ra')] = el; });
    M.b.forEach(function (entry, k) {
      var el = blocks[k];
      if (!el) return;
      var list = [];
      if (typeof entry[0] === 'string') {
        list.push({ el: el, hash: entry[0], flags: entry[1], a: null, b: null });
      } else {
        var rawlen = entry[entry.length - 1];
        el.classList.add('ra-ranged');
        for (var j = 0; j < entry.length - 1; j++) {
          list.push({ el: el, hash: entry[j][0], flags: entry[j][1], a: entry[j][2], b: entry[j][3], rawlen: rawlen });
        }
      }
      list.forEach(function (u) { u.i = units.length; units.push(u); });
      byBlock.set(el, list);
    });
  })();
  if (!units.length) return;
  var sections = Array.prototype.slice.call(document.querySelectorAll('h2.section-title'));

  // ── Preferences ──
  var prefs = { rate: 1, auto: false };
  try { var saved = JSON.parse(localStorage.getItem('ra-prefs') || '{}'); if (RATES.indexOf(saved.rate) >= 0) prefs.rate = saved.rate; prefs.auto = !!saved.auto; } catch (e) { /* private mode */ }
  function savePrefs() { try { localStorage.setItem('ra-prefs', JSON.stringify(prefs)); } catch (e) { /* ignore */ } }

  // ── State ──
  var active = false, cur = -1, state = 'idle';   // idle | loading | playing | done | error | end
  var timer = 0, audioFor = {};
  var dock, fab, els = {};
  var marked = [];

  // ── Finding text inside a block (mirrors atoms_of in the Python) ──
  function hasSkipClass(el) {
    for (var i = 0; i < SKIP_CLASSES.length; i++) if (el.classList.contains(SKIP_CLASSES[i])) return true;
    return false;
  }
  function atomsOf(block) {
    var out = [];
    (function walk(n) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) { out.push({ t: c, len: c.data.length }); continue; }
        if (c.nodeType !== 1) continue;
        var name = c.nodeName.toLowerCase();
        if (SKIP_TAGS[name] || hasSkipClass(c)) continue;
        if (name === 'span' && c.classList.contains('b')) out.push({ b: c, len: 1 });
        else if (OWN_SKIP[name]) continue;
        else if (name === 'br') out.push({ s: c, len: 1 });
        else walk(c);
      }
    })(block);
    return out;
  }
  function rangeFor(u) {
    var atoms = atomsOf(u.el), pos = 0, first = null, last = null, blanks = [], total = 0, i;
    for (i = 0; i < atoms.length; i++) total += atoms[i].len;
    if (total !== u.rawlen) return null;                         // page and manifest disagree: do not guess
    for (i = 0; i < atoms.length; i++) {
      var at = atoms[i], s = pos, e = pos + at.len;
      if (s < u.b && e > u.a) {
        if (!first) first = { at: at, off: Math.max(u.a - s, 0) };
        last = { at: at, off: Math.min(u.b - s, at.len) };
        if (at.b) blanks.push(at.b);
      }
      pos = e;
    }
    if (!first) return null;
    var r = document.createRange();
    if (first.at.t) r.setStart(first.at.t, first.off); else r.setStartBefore(first.at.b || first.at.s);
    if (last.at.t) r.setEnd(last.at.t, last.off); else r.setEndAfter(last.at.b || last.at.s);
    return { range: r, blanks: blanks };
  }
  function offsetAt(block, node, off) {
    var atoms = atomsOf(block), pos = 0;
    for (var i = 0; i < atoms.length; i++) {
      var at = atoms[i];
      if (at.t === node) return pos + off;
      if (at.b && at.b.contains(node)) return pos;
      pos += at.len;
    }
    return -1;
  }

  // ── Highlighting ──
  var haveHighlights = !!(window.CSS && CSS.highlights && typeof Highlight !== 'undefined');
  function clearHighlight() {
    if (haveHighlights) CSS.highlights.delete('ra-current');
    marked.forEach(function (m) { m.classList.remove('ra-on', 'ra-soft', 'ra-blank'); });
    marked = [];
    root.classList.remove('ra-await');
  }
  function mark(el, cls) { el.classList.add(cls); marked.push(el); }
  var curRect = null;
  function showHighlight(u) {
    clearHighlight();
    var blanks = [];
    curRect = null;
    if (u.a === null) {
      mark(u.el, 'ra-on');
      blanks = u.el.querySelectorAll('.b');
      curRect = function () { return u.el.getBoundingClientRect(); };
    } else {
      var rg = rangeFor(u);
      if (rg && haveHighlights) {
        CSS.highlights.set('ra-current', new Highlight(rg.range));
        blanks = rg.blanks;
        curRect = function () { return rg.range.getBoundingClientRect(); };
      } else {
        mark(u.el, 'ra-soft');                                   // no sentence highlight here: mark the paragraph
        blanks = rg ? rg.blanks : [];
        curRect = function () { return u.el.getBoundingClientRect(); };
      }
    }
    Array.prototype.forEach.call(blanks, function (b) { mark(b, 'ra-blank'); });
  }
  function ensureVisible() {
    if (!curRect || !dock) return;
    var r = curRect(), vh = window.innerHeight, top = 70, bottom = vh - dock.offsetHeight - 30;
    if (r.top >= top && r.bottom <= bottom) return;
    var want = window.scrollY + r.top - Math.min(vh * 0.25, 170);
    window.scrollTo({ top: Math.max(0, want), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  // ── Audio ──
  function urlFor(u) { return M.base + u.hash + '.mp3'; }
  function audioOf(i) {
    var u = units[i];
    if (!u) return null;
    if (!audioFor[i]) {
      var a = new Audio();
      a.preload = 'auto';
      a.src = urlFor(u);
      a.addEventListener('ended', function () { if (cur === i && state === 'playing') finished(i); });
      a.addEventListener('playing', function () { if (cur === i) setState('playing'); });
      a.addEventListener('error', function () { if (cur === i) setState('error'); });
      audioFor[i] = a;
    }
    return audioFor[i];
  }
  function trimAudio() {
    Object.keys(audioFor).forEach(function (k) {
      k = +k;
      if (k < cur - 2 || k > cur + 3) { var a = audioFor[k]; a.pause(); a.removeAttribute('src'); a.load(); delete audioFor[k]; }
    });
  }
  function stopAudio() {
    clearTimeout(timer);
    Object.keys(audioFor).forEach(function (k) { audioFor[k].pause(); });
  }

  function play(i) {
    if (i < 0 || i >= units.length) return;
    stopAudio();
    cur = i;
    var u = units[i];
    showHighlight(u);
    ensureVisible();
    var a = audioOf(i);
    try { a.currentTime = 0; } catch (e) { /* not loaded yet */ }
    a.playbackRate = prefs.rate;
    setState('loading');
    var p = a.play();
    if (p && p.catch) p.catch(function (err) {
      if (cur !== i) return;
      setState(err && err.name === 'NotAllowedError' ? 'idle' : 'error');
    });
    audioOf(i + 1); audioOf(i + 2);                             // warm the next two
    trimAudio();
  }
  function finished(i) {
    var u = units[i];
    if (u.flags & F_CHAIN && i + 1 < units.length) { timer = setTimeout(function () { play(i + 1); }, 260); return; }
    if (i + 1 >= units.length) { setState('end'); return; }
    setState('done');
    if (prefs.auto) timer = setTimeout(function () { if (cur === i && state === 'done') play(i + 1); }, (u.flags & F_WRITE) ? 3200 : 700);
  }
  function next() {
    if (cur < 0) return play(startIndex());
    if (cur + 1 >= units.length) { stopAudio(); return setState('end'); }
    play(cur + 1);
  }
  function prev() {
    if (cur < 0) return;
    var j = cur - 1;
    while (j > 0 && (units[j].flags & F_CHAIN)) j--;             // step over headings: they lead into the sentence after them
    play(Math.max(j, 0));
  }
  function repeat() { if (cur >= 0) play(cur); else next(); }

  function startIndex() {
    if (window.scrollY < 40) return 0;
    for (var i = 0; i < units.length; i++) {
      var r = units[i].el.getBoundingClientRect();
      if (r.bottom > 90 && r.top < window.innerHeight - 160) return i;
    }
    return 0;
  }

  // ── The dock ──
  var ICON = {
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 8.6a4.8 4.8 0 0 1 0 6.8M18.8 5.8a8.6 8.6 0 0 1 0 12.4"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M14.5 5l-7 7 7 7"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M19.5 12a7.5 7.5 0 1 1-2.4-5.5M19.5 4v5h-5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="M5 5l14 14M19 5L5 19"/></svg>'
  };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }

  function makeFab() {
    fab = el('button', 'ra-fab', ICON.speaker + '<span>Listen</span>');
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Listen to these notes read aloud, one sentence at a time');
    fab.addEventListener('click', function () { open(); });
    document.body.appendChild(fab);
  }
  function makeDock() {
    dock = el('div', 'ra-dock');
    dock.setAttribute('role', 'region');
    dock.setAttribute('aria-label', 'Read aloud');
    dock.innerHTML =
      '<div class="ra-top">' +
        '<div class="ra-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
        '<div class="ra-where"><span class="ra-msg"></span><span class="ra-sec"><span class="ra-secname"></span><span class="ra-count" aria-hidden="true"></span></span></div>' +
        '<div class="ra-opts">' +
          '<div class="ra-seg" role="group" aria-label="Speed"></div>' +
          '<button type="button" class="ra-auto" role="switch" aria-checked="false" title="After each sentence, wait a few seconds and then play the next one by itself"><span class="ra-sw"></span><span>Auto-continue</span></button>' +
        '</div>' +
        '<button type="button" class="ra-close" aria-label="Close read aloud (Escape)">' + ICON.close + '</button>' +
      '</div>' +
      '<div class="ra-bar" aria-hidden="true"><i></i></div>' +
      '<div class="ra-ctl">' +
        '<button type="button" class="ra-btn ra-back" aria-label="Back one sentence">' + ICON.back + '<span>Back</span> <span class="ra-key">←</span></button>' +
        '<button type="button" class="ra-btn ra-primary ra-next" aria-label="Next sentence">' + ICON.play + '<span class="ra-nextlabel">Next</span> <span class="ra-key">Space</span></button>' +
        '<button type="button" class="ra-btn ra-repeat" aria-label="Say it again">' + ICON.repeat + '<span>Again</span> <span class="ra-key">R</span></button>' +
      '</div>';
    document.body.appendChild(dock);
    els.msg = dock.querySelector('.ra-msg'); els.sec = dock.querySelector('.ra-secname'); els.count = dock.querySelector('.ra-count');
    els.bar = dock.querySelector('.ra-bar i'); els.next = dock.querySelector('.ra-next'); els.nextLabel = dock.querySelector('.ra-nextlabel');
    els.back = dock.querySelector('.ra-back'); els.auto = dock.querySelector('.ra-auto');
    var seg = dock.querySelector('.ra-seg');
    RATES.forEach(function (r, n) {
      var b = el('button', '', RATE_NAMES[n]);
      b.type = 'button'; b.setAttribute('aria-pressed', String(r === prefs.rate)); b.dataset.rate = r;
      b.addEventListener('click', function () {
        prefs.rate = r; savePrefs();
        Array.prototype.forEach.call(seg.children, function (x) { x.setAttribute('aria-pressed', String(+x.dataset.rate === r)); });
        if (cur >= 0 && audioFor[cur]) audioFor[cur].playbackRate = r;
      });
      seg.appendChild(b);
    });
    els.auto.setAttribute('aria-checked', String(prefs.auto));
    els.auto.addEventListener('click', function () {
      prefs.auto = !prefs.auto; savePrefs(); els.auto.setAttribute('aria-checked', String(prefs.auto));
      if (prefs.auto && state === 'done') finished(cur);
      if (!prefs.auto) clearTimeout(timer);
    });
    // Mouse and touch only: a key press on the big button is handled once, by the key handler.
    els.next.addEventListener('click', function (e) { if (e.detail === 0) return; next(); });
    els.back.addEventListener('click', prev);
    dock.querySelector('.ra-repeat').addEventListener('click', repeat);
    dock.querySelector('.ra-close').addEventListener('click', close);
  }

  var MSG = {
    idle: 'Press Space to start',
    loading: 'Getting it ready…',
    playing: 'Listening…',
    error: 'Could not play this one. Press Space to skip it.',
    end: 'That is the end of the notes.'
  };
  function sectionOf(u) {
    var name = '';
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].compareDocumentPosition(u.el) & Node.DOCUMENT_POSITION_FOLLOWING) name = sections[i].textContent.trim();
      else break;
    }
    return name || document.title.replace(/\s*[—–-].*$/, '');
  }
  function setState(s) {
    state = s;
    if (!dock) return;
    var u = cur >= 0 ? units[cur] : null;
    var msg = MSG[s];
    if (s === 'done') msg = (u && (u.flags & F_WRITE)) ? 'Your turn: write it, then press Space' : 'Press Space to keep going';
    els.msg.textContent = msg;
    els.sec.textContent = u ? sectionOf(u) : 'Guided notes';
    els.count.textContent = u ? ' · ' + (cur + 1) + ' of ' + units.length : '';
    els.bar.style.width = u ? ((cur + 1) / units.length * 100) + '%' : '0';
    dock.classList.toggle('is-playing', s === 'playing');
    dock.classList.toggle('is-your-turn', s === 'done' && !!(u && (u.flags & F_WRITE)));
    dock.classList.toggle('is-error', s === 'error');
    root.classList.toggle('ra-await', s === 'done' && !!(u && (u.flags & F_WRITE)) && !reduceMotion);
    els.nextLabel.textContent = (cur < 0 || s === 'idle') ? 'Start' : 'Next';
    els.next.setAttribute('aria-label', cur < 0 ? 'Start reading' : 'Next sentence');
    els.back.disabled = cur <= 0;
    els.next.disabled = false;
  }

  function open() {
    if (active) return;
    active = true;
    if (!dock) makeDock();
    dock.hidden = false;
    fab.hidden = true;
    root.classList.add('ra-open');
    cur = -1;
    setState('idle');
    els.next.focus({ preventScroll: true });
    play(startIndex());
  }
  function close() {
    if (!active) return;
    active = false;
    stopAudio();
    clearHighlight();
    Object.keys(audioFor).forEach(function (k) { audioFor[k].removeAttribute('src'); audioFor[k].load(); });
    audioFor = {};
    cur = -1; state = 'idle';
    dock.hidden = true;
    fab.hidden = false;
    root.classList.remove('ra-open');
    fab.focus({ preventScroll: true });
  }

  // ── Keys: Space/Enter/→ next, ← back, R again, Esc close ──
  document.addEventListener('keydown', function (e) {
    if (!active || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target, k = e.key;
    if (t && t.closest) {
      if (t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return;
      // Space or Enter on a small dock button does what that button says.
      if ((k === ' ' || k === 'Enter') && t.closest('.ra-dock button') && !t.closest('.ra-next')) return;
    }
    switch (k) {
      case ' ': case 'Spacebar': case 'Enter': case 'ArrowRight': case 'n': case 'N':
        e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'b': case 'B':
        e.preventDefault(); prev(); break;
      case 'r': case 'R':
        e.preventDefault(); repeat(); break;
      case 'Escape':
        e.preventDefault(); close(); break;
    }
  }, true);
  // Some browsers press a focused button again when Space is released.
  document.addEventListener('keyup', function (e) {
    if (active && (e.key === ' ' || e.key === 'Spacebar') && e.target.closest && e.target.closest('.ra-next')) e.preventDefault();
  }, true);

  // ── Click a sentence to start from there ──
  document.addEventListener('click', function (e) {
    if (!active || e.defaultPrevented) return;
    var t = e.target;
    if (!t.closest || t.closest('.ra-dock, .ra-fab, a, button, input, select, textarea')) return;
    var sel = window.getSelection && window.getSelection();
    if (sel && String(sel).length) return;
    var block = t.closest('[data-ra]');
    if (!block) return;
    var list = byBlock.get(block);
    if (!list) return;
    var pick = list[0];
    if (list.length > 1) {
      var node, off;
      if (document.caretPositionFromPoint) { var cp = document.caretPositionFromPoint(e.clientX, e.clientY); if (cp) { node = cp.offsetNode; off = cp.offset; } }
      else if (document.caretRangeFromPoint) { var cr = document.caretRangeFromPoint(e.clientX, e.clientY); if (cr) { node = cr.startContainer; off = cr.startOffset; } }
      var at = node ? offsetAt(block, node, off) : -1;
      if (at >= 0) for (var i = 0; i < list.length; i++) if (at >= list[i].a && at < list[i].b + 1) { pick = list[i]; break; }
    }
    play(pick.i);
  });

  window.addEventListener('pagehide', stopAudio);

  makeFab();
})();
