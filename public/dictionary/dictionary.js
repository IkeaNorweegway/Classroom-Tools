/* Word help: words that have a definition in glossary.txt get a soft dotted underline. Hover one
   (mouse) or tap it (touch screen) and a small card shows what it means. Only those words react;
   nothing happens on other words.

   The underline uses the CSS Custom Highlight API (CSS.highlights), so the page's text and
   markup are not changed. That keeps read-aloud (which indexes the page by character) safe.
   A browser without the API still gets the hover card, just not the underline.

   Two ways in:
   - Material pages: the viewer's DictionarySupport.astro injects this file into the iframe.
   - Site pages: BaseLayout adds it with data-mode="page", which also draws a small floating
     on/off pill. (In a viewer the on/off button is in the viewer's back bar.)

   The on/off choice is saved in localStorage ("wordhelp"), shared by the viewer and the iframe.
   Bump the ?v= on the script tag (DictionarySupport.astro, BaseLayout.astro) when you change
   this file or the glossary. */
(function () {
  'use strict';
  if (window.__wordHelp) return;
  window.__wordHelp = true;

  var doc = document;
  var root = doc.documentElement;
  var lang = (root.getAttribute('lang') || 'en').toLowerCase();
  if (lang.indexOf('en') !== 0) return; // English definitions only: skip the French pages

  var script = doc.currentScript;
  var src = script ? script.src : '';
  var baseUrl = src.replace(/[^/]*$/, '');
  var version = (src.match(/[?&]v=([^&]+)/) || [])[1] || '';
  var pageMode = script && script.getAttribute('data-mode') === 'page';
  var scope = (pageMode && doc.getElementById('main')) || doc.body;

  var KEY = 'wordhelp';
  var HOVER_MS = 350;       // how long the pointer rests on a word before the card shows
  var LEAVE_MS = 250;       // grace time to move from the word onto the card
  var MAX_PER_TERM = 3;     // underline a term only its first few times on a page, so pages stay calm
  var HL = 'wh-term';       // name of the highlight (see ::highlight(wh-term) in dictionary.css)

  // ── On / off ──
  function isOn() { try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; } }
  function setOn(v) { try { localStorage.setItem(KEY, v ? 'on' : 'off'); } catch (e) { /* private mode */ } apply(); }
  var enabled = isOn();
  window.addEventListener('storage', function (e) { if (e.key === KEY) apply(); });

  // ── Glossary ──
  // glossary.txt: one entry per line, "term, alias | definition | example (optional)".
  // Lines starting with # are comments.
  var gloss = null, glossLoading = null;
  function loadGlossary() {
    if (gloss) return Promise.resolve(gloss);
    if (glossLoading) return glossLoading;
    glossLoading = fetch(baseUrl + 'glossary.txt' + (version ? '?v=' + version : ''))
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (text) {
        var map = Object.create(null), quiet = false;
        text.split(/\r?\n/).forEach(function (line) {
          if (!line) return;
          if (line.charAt(0) === '#') { // "# @quiet" starts words that are defined but not shown; "# @loud" ends that
            if (/^#\s*@quiet\b/.test(line)) quiet = true; else if (/^#\s*@loud\b/.test(line)) quiet = false;
            return;
          }
          if (quiet) return;
          var p = line.split('|');
          if (p.length < 2) return;
          var entry = { word: '', def: p[1].trim(), ex: (p[2] || '').trim() };
          p[0].split(',').forEach(function (n, i) {
            n = norm(n);
            if (!n) return;
            if (i === 0) entry.word = n;
            map[n] = entry;
          });
        });
        gloss = map;
        return gloss;
      })
      .catch(function () { glossLoading = null; gloss = null; return null; });
    return glossLoading;
  }

  function norm(s) {
    return s.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
  }

  // Forms a word may be listed under: plurals, -ed, -ing, -ly, possessives.
  function forms(w) {
    var out = [w];
    function add(x) { if (x.length > 2 && out.indexOf(x) < 0) out.push(x); }
    if (/'s$/.test(w)) add(w.slice(0, -2));
    if (/s'$/.test(w)) add(w.slice(0, -1));
    if (/ies$/.test(w)) add(w.slice(0, -3) + 'y');
    if (/ves$/.test(w)) { add(w.slice(0, -3) + 'f'); add(w.slice(0, -3) + 'fe'); }
    if (/(ses|xes|zes|oes|ches|shes)$/.test(w)) add(w.slice(0, -2));
    if (/s$/.test(w) && !/ss$/.test(w)) add(w.slice(0, -1));
    if (/ed$/.test(w)) { add(w.slice(0, -2)); add(w.slice(0, -1)); if (/(.)\1ed$/.test(w)) add(w.slice(0, -3)); if (/ied$/.test(w)) add(w.slice(0, -3) + 'y'); }
    if (/ing$/.test(w)) { add(w.slice(0, -3)); add(w.slice(0, -3) + 'e'); if (/(.)\1ing$/.test(w)) add(w.slice(0, -4)); }
    if (/ly$/.test(w)) add(w.slice(0, -2));
    if (/ier$/.test(w)) add(w.slice(0, -3) + 'y');
    return out;
  }

  // ── Finding glossary words in the page ──
  var SKIP = 'a,button,input,textarea,select,label,summary,option,svg,script,style,pre,code,' +
    '[contenteditable],[data-no-define],.vocab-wrap,h1,h2,th,.section-title,.cover,.wh-pop,.wh-pill,.ra-fab,.ra-dock,.key-link,.name-line,.skip-link,nav';
  var WORD = /[A-Za-z][A-Za-z'’-]*/g;

  // Glossary matches in one piece of text, left to right, longest phrase (up to 3 words) first.
  // A phrase must be words separated by spaces only. Returns [{ s, e, entry }].
  function matchesIn(text) {
    var m, words = [], spans = [], out = [];
    WORD.lastIndex = 0;
    while ((m = WORD.exec(text))) { words.push(norm(m[0])); spans.push([m.index, m.index + m[0].length]); }
    var i = 0;
    while (i < words.length) {
      var hit = null;
      for (var len = Math.min(3, words.length - i); len >= 1 && !hit; len--) {
        var ok = true;
        for (var j = i + 1; j < i + len; j++) if (!/^\s+$/.test(text.slice(spans[j - 1][1], spans[j][0]))) { ok = false; break; }
        if (!ok) continue;
        var head = words.slice(i, i + len - 1).join(' ');
        var fs = forms(words[i + len - 1]);
        for (var f = 0; f < fs.length; f++) {
          var entry = gloss[head ? head + ' ' + fs[f] : fs[f]];
          if (entry && (len > 1 || words[i].length >= 3)) { hit = { s: spans[i][0], e: spans[i + len - 1][1], entry: entry, len: len }; break; }
        }
      }
      if (hit) { out.push(hit); i += hit.len; } else i++;
    }
    return out;
  }

  var index = new Map(); // text node -> [{ s, e, entry }]

  function clearHighlights() {
    index.clear();
    if (window.CSS && CSS.highlights) CSS.highlights['delete'](HL);
  }

  function scan() {
    clearHighlights();
    if (!enabled || !gloss || !scope) return;
    var seen = Object.create(null), ranges = [];
    var walker = doc.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || n.nodeValue.length < 3) return NodeFilter.FILTER_REJECT;
        var el = n.parentElement;
        return el && !el.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var node;
    while ((node = walker.nextNode())) {
      var found = matchesIn(node.nodeValue), keep = [];
      for (var k = 0; k < found.length; k++) {
        var key = found[k].entry.word;
        seen[key] = (seen[key] || 0) + 1;
        if (seen[key] > MAX_PER_TERM) continue;
        keep.push(found[k]);
        var r = doc.createRange();
        r.setStart(node, found[k].s);
        r.setEnd(node, found[k].e);
        ranges.push(r);
      }
      if (keep.length) index.set(node, keep);
    }
    if (window.CSS && CSS.highlights && window.Highlight && ranges.length) {
      var h = new Highlight();
      ranges.forEach(function (r) { h.add(r); });
      CSS.highlights.set(HL, h);
    }
  }

  // ── The glossary word under a point, if any ──
  function caretAt(x, y) {
    if (doc.caretPositionFromPoint) {
      var p = doc.caretPositionFromPoint(x, y);
      return p ? { node: p.offsetNode, off: p.offset } : null;
    }
    if (doc.caretRangeFromPoint) {
      var r = doc.caretRangeFromPoint(x, y);
      return r ? { node: r.startContainer, off: r.startOffset } : null;
    }
    return null;
  }

  function termAt(x, y) {
    var c = caretAt(x, y);
    if (!c || !c.node || c.node.nodeType !== 3) return null;
    var list = index.get(c.node);
    if (!list) return null;
    for (var i = 0; i < list.length; i++) {
      var t = list[i];
      if (c.off < t.s || c.off > t.e) continue;
      var rng = doc.createRange();
      rng.setStart(c.node, t.s);
      rng.setEnd(c.node, t.e);
      var rects = rng.getClientRects();
      for (var j = 0; j < rects.length; j++) {
        var q = rects[j];
        if (x >= q.left - 2 && x <= q.right + 2 && y >= q.top - 2 && y <= q.bottom + 2) return { t: t, range: rng };
      }
    }
    return null;
  }

  // ── The card ──
  var pop = null, popFor = null, pinned = false, hideTimer = 0;

  function build() {
    if (pop) return pop;
    pop = doc.createElement('div');
    pop.className = 'wh-pop';
    pop.setAttribute('role', 'status');
    pop.hidden = true;
    pop.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    pop.addEventListener('pointerenter', function () { clearTimeout(hideTimer); });
    pop.addEventListener('pointerleave', function () { if (!pinned) scheduleHide(); });
    pop.addEventListener('click', function (e) {
      e.stopPropagation();
      var t = e.target.closest && e.target.closest('[data-wh]');
      if (!t) return;
      if (t.getAttribute('data-wh') === 'close') hide();
      if (t.getAttribute('data-wh') === 'say') say(pop.getAttribute('data-say'));
    });
    doc.body.appendChild(pop);
    return pop;
  }

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function say(word) {
    var synth = window.speechSynthesis;
    if (!synth || !word) return;
    synth.cancel();
    var u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-CA';
    u.rate = 0.85;
    synth.speak(u);
  }

  function show(rng, entry, pin) {
    var p = build();
    clearTimeout(hideTimer);
    var html = '<div class="wh-head"><span class="wh-word">' + esc(entry.word) + '</span>';
    if (window.speechSynthesis) html += '<button type="button" class="wh-btn" data-wh="say" aria-label="Hear the word">\u{1F50A}</button>';
    html += '<button type="button" class="wh-btn" data-wh="close" aria-label="Close">×</button></div>';
    html += '<p class="wh-def">' + esc(entry.def) + '</p>';
    if (entry.ex) html += '<p class="wh-ex"><b>Example:</b> ' + esc(entry.ex) + '</p>';
    p.innerHTML = html;
    p.setAttribute('data-say', entry.word);
    p.hidden = false;
    pinned = !!pin;
    popFor = rng;
    place(rng);
  }

  function place(rng) {
    var p = pop, r = rng.getBoundingClientRect();
    var vw = root.clientWidth, vh = root.clientHeight;
    p.style.left = '0px'; p.style.top = '0px';
    var w = p.offsetWidth, h = p.offsetHeight, gap = 6;
    var left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), Math.max(8, vw - w - 8));
    var top = r.bottom + gap;
    if (top + h > vh - 8 && r.top - gap - h > 8) top = r.top - gap - h;
    p.style.left = left + 'px';
    p.style.top = Math.max(8, top) + 'px';
  }

  function hide() {
    clearTimeout(hideTimer);
    if (!pop || pop.hidden) return;
    pop.hidden = true; pinned = false; popFor = null;
    if (window.speechSynthesis) speechSynthesis.cancel();
  }
  function scheduleHide() { clearTimeout(hideTimer); hideTimer = setTimeout(hide, LEAVE_MS); }

  // ── Events ──
  var hoverT = null, hoverTimer = 0;

  // Pointer moves are handled once per frame, using the latest position, so a mouse that stops on
  // a word is never missed.
  var moveRaf = 0, moveX = 0, moveY = 0;
  function onMove(e) {
    if (!enabled || e.pointerType === 'touch' || pinned) return;
    if (pop && pop.contains(e.target)) return; // moving over the card keeps it open
    moveX = e.clientX; moveY = e.clientY;
    if (moveRaf) return;
    moveRaf = requestAnimationFrame(function () {
      moveRaf = 0;
      if (!enabled || pinned) return;
      var hit = termAt(moveX, moveY);
      root.classList.toggle('wh-over', !!hit);
      var t = hit ? hit.t : null;
      if (t === hoverT) return;
      hoverT = t;
      clearTimeout(hoverTimer);
      if (!t) { if (pop && !pop.hidden) scheduleHide(); return; }
      hoverTimer = setTimeout(function () { if (enabled && !pinned) show(hit.range, t.entry, false); }, HOVER_MS);
    });
  }

  // A tap on a touch screen (or a click) on an underlined word pins the card.
  function onClick(e) {
    if (!enabled || e.button > 0 || (pop && pop.contains(e.target))) return;
    var sel = doc.getSelection && doc.getSelection();
    if (sel && !sel.isCollapsed) return;
    var hit = termAt(e.clientX, e.clientY);
    if (hit) show(hit.range, hit.t.entry, true); else hide();
  }

  // Keyboard route: select a glossary word or phrase (Shift+arrows) and its card shows.
  var selTimer = 0;
  function onSelection() {
    if (!enabled || !gloss) return;
    clearTimeout(selTimer);
    selTimer = setTimeout(function () {
      var sel = doc.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return;
      var rng = sel.getRangeAt(0), host = rng.commonAncestorContainer;
      host = host.nodeType === 3 ? host.parentElement : host;
      if (!host || !scope.contains(host) || host.closest(SKIP)) return;
      var text = sel.toString().trim();
      if (!text || text.length > 40 || /\n/.test(text)) return;
      var found = matchesIn(text);
      if (found.length === 1 && found[0].s === 0 && found[0].e === text.length) show(rng.cloneRange(), found[0].entry, true);
    }, 350);
  }

  function onKey(e) { if (e.key === 'Escape') hide(); }
  function onDocDown(e) {
    if (!pop || pop.hidden || pop.contains(e.target)) return;
    if (pinned && !termAt(e.clientX, e.clientY)) hide();
  }
  function onScroll() { if (pop && !pop.hidden) { if (popFor && pinned) place(popFor); else hide(); } }

  // ── Wiring, and the floating on/off pill ──
  var pill = null, wired = false;
  function wire() {
    if (wired) return;
    wired = true;
    doc.addEventListener('click', onClick);
    doc.addEventListener('pointermove', onMove, { passive: true });
    doc.addEventListener('pointerdown', onDocDown);
    doc.addEventListener('selectionchange', onSelection);
    doc.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', function () { hide(); });
  }

  function drawPill() {
    if (!pageMode) return;
    if (!pill) {
      pill = doc.createElement('button');
      pill.type = 'button';
      pill.className = 'wh-pill';
      pill.addEventListener('click', function () { setOn(!enabled); });
      doc.body.appendChild(pill);
    }
    pill.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    pill.title = enabled ? 'Word help is on: hover an underlined word to see what it means. Click to turn off.' : 'Word help is off. Click to turn on.';
    pill.innerHTML = '<span aria-hidden="true">\u{1F4D6}</span> Word help ' + (enabled ? 'on' : 'off');
  }

  function apply() {
    enabled = isOn();
    clearTimeout(hoverTimer);
    hide();
    root.classList.remove('wh-over');
    if (!enabled) clearHighlights();
    else loadGlossary().then(scan);
    drawPill();
  }

  // Styles: the viewer injects dictionary.css beside this script; pages link it themselves.
  function ensureCss() {
    if (doc.querySelector('link[data-wh-css]') || !baseUrl) return;
    var l = doc.createElement('link');
    l.rel = 'stylesheet'; l.href = baseUrl + 'dictionary.css' + (version ? '?v=' + version : '');
    l.setAttribute('data-wh-css', '');
    doc.head.appendChild(l);
  }

  function start() {
    if (!doc.body) return;
    ensureCss();
    wire();
    apply();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
})();
