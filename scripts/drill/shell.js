
/* ===== DRILL SHELL START (same in every narrow trainer: Math 9 and Science 7) =====
   A page gives PAGE = { key, course, title, notes, tabs: [TAB, …] } and calls DRILL.boot(PAGE).
   Optional: PAGE.sep (heading separator after "Section N", default —), PAGE.secText(tab) (the whole heading text
   for the 📖 link), PAGE.sans (prompts in the plain font, for science). TAB.cols (2 or 3) sets the choice grid.
   A TAB is one narrow skill:
     id, code (local outcome), name (1–2 words), sec (notes section number), q (short label above the prompt)
     gen()                 -> a new item (from MODEL)
     prompt(item)          -> HTML for the prompt (optional)
     kind: 'slots' | 'choice' | 'custom', or kind(item) -> one of those (a page that mixes typed and tap answers)
       slots(item)         -> ['y =', {k:'m', tint:'M'}, 'x +', {k:'b', tint:'B'}]   answer boxes inside the math
       choices(item)       -> [{v, label, math}]                                     tap to answer
       panel(box, item, A) -> builds controls; the stage can also set A.resp
     ready(resp, item)     -> a cue if the answer is not complete yet (optional)
     check(item, resp)     -> {ok, code, cue}       cue is six words or fewer
     answer(item)          -> the right answer, as resp, for Show me
     draw(A, item, V)      -> draws the picture. V.phase: ask | wrong | right | show; V.res from check; V.anim on a new phase
     link(item)            -> {notes, sec, sep} for this item's 📖 link (optional; a tab whose items span topics)
     typeOf(item)          -> the question type, for weighting (optional; default: the item's form/kind/shape/... fields)
   Rounds are 10 items. A dot is green (first try), yellow (second try) or red (shown).
   Weighting: each question type has a score, saved per tab. A first-try right answer lowers it (to half weight at
   most), a miss or Show me raises it (to about 2.5× at most). Each new item is picked from 8 generated candidates
   by weight, so missed types come back more often and types answered right still appear, less often. */
const DRILL = (() => {
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const RM = DEBUG || !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const COARSE = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  const ROUND = 10;
  const C = { stage: '#0b0f17', grid: '#18212f', grid2: '#222d3e', axis: '#c9d3e1', tick: '#8d9bb0', text: '#f5f7fb', muted: '#a7b4c8',
    blue: '#58c4dd', yellow: '#f7d96f', teal: '#5cd0b3', gold: '#f0ac5f', green: '#83c167', red: '#fc6255', pink: '#ef7fc6', edge: '#263246', panel: '#151d2b' };
  let PAGE, tab, item, resp = {}, att = 0, resolved = false, marks = [], phase = 'ask', lastRes = null, gen = 0, timers = [], lastKey = '';
  let save = { tab: null, best: {}, w: {} };
  function load() { if (DEBUG) return; try { const s = JSON.parse(localStorage.getItem(PAGE.key) || 'null'); if (s && typeof s === 'object') save = Object.assign(save, s); if (!save.w || typeof save.w !== 'object') save.w = {}; } catch (e) { /* storage blocked */ } }
  function store() { if (DEBUG) return; try { localStorage.setItem(PAGE.key, JSON.stringify(save)); } catch (e) { /* storage blocked */ } }

  /* ---------- SVG drawing kit ---------- */
  function el(tag, a, p) { const e = document.createElementNS(NS, tag); for (const k in a || {}) if (a[k] != null) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function tx(p, x, y, s, a) { const e = el('text', Object.assign({ x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: C.text }, a), p); e.textContent = s; return e; }
  // Math text: single letters in italics.
  function mtx(p, x, y, s, a) {
    const e = el('text', Object.assign({ x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: C.text, 'font-size': 26 }, a, { class: 'm' + (a && a.class ? ' ' + a.class : '') }), p);
    let prevItalic = false;
    String(s).split(/(\b[a-z]\b|(?<=\d)[a-z])/).forEach(part => {
      if (!part) return; const it = /^[a-z]$/.test(part);
      // an italic letter leans into a following ² or ³: nudge it right
      const t = el('tspan', it ? { 'font-style': 'italic' } : prevItalic && /^[²³]/.test(part) ? { dx: '0.12em' } : {}, e); t.textContent = part; prevItalic = it;
    });
    return e;
  }
  // A stacked fraction centred at (x, y).
  function frac(p, x, y, n, d, a) {
    a = Object.assign({ 'font-size': 24 }, a); const fs = +a['font-size'], g = el('g', {}, p);
    mtx(g, x, y - fs * .55, n, a); mtx(g, x, y + fs * .6, d, a);
    const w = Math.max(String(n).length, String(d).length) * fs * .55 + 8;
    el('line', { x1: x - w / 2, x2: x + w / 2, y1: y, y2: y, stroke: a.fill || C.text, 'stroke-width': 2 }, g);
    return g;
  }
  function later(ms, f) { const g0 = gen; if (RM) { f(); return; } timers.push(setTimeout(() => { if (g0 === gen) f(); }, ms)); }
  function tween(ms, f, done) {
    const g0 = gen; if (RM) { f(1); if (done) done(); return; }
    const t0 = performance.now();
    const step = now => { if (g0 !== gen) return; const t = Math.min(1, (now - t0) / ms); f(1 - Math.pow(1 - t, 3)); if (t < 1) requestAnimationFrame(step); else if (done) done(); };
    requestAnimationFrame(step);
  }
  // A coordinate grid. o: {x0, y0, w, h, xmin, xmax, ymin, ymax, lab (label every n), grid}
  function plane(p, o) {
    o = Object.assign({ lab: 2 }, o);
    const sx = o.w / (o.xmax - o.xmin), sy = o.h / (o.ymax - o.ymin);
    const X = x => o.x0 + (x - o.xmin) * sx, Y = y => o.y0 + (o.ymax - y) * sy;
    const g = el('g', {}, p), gs = o.ystep || 1, xs = o.xstep || 1;
    for (let x = Math.ceil(o.xmin / xs) * xs; x <= o.xmax + 1e-9; x += xs) el('line', { x1: X(x), x2: X(x), y1: Y(o.ymin), y2: Y(o.ymax), stroke: x === 0 ? C.axis : C.grid2, 'stroke-width': x === 0 ? 2 : 1 }, g);
    for (let y = Math.ceil(o.ymin / gs) * gs; y <= o.ymax + 1e-9; y += gs) el('line', { x1: X(o.xmin), x2: X(o.xmax), y1: Y(y), y2: Y(y), stroke: y === 0 ? C.axis : C.grid2, 'stroke-width': y === 0 ? 2 : 1 }, g);
    const lx = o.labx || o.lab * xs, ly = o.laby || o.lab * gs;
    const y0 = Math.min(Math.max(0, o.ymin), o.ymax), x0 = Math.min(Math.max(0, o.xmin), o.xmax);
    for (let x = Math.ceil(o.xmin / lx) * lx; x <= o.xmax + 1e-9; x += lx) if (x !== 0 && x !== o.xmin) tx(g, X(x), Y(y0) + 14, fmt(x), { 'font-size': 13, fill: C.tick });
    for (let y = Math.ceil(o.ymin / ly) * ly; y <= o.ymax + 1e-9; y += ly) if (y !== 0 && y !== o.ymin) tx(g, X(x0) - 8, Y(y), fmt(y), { 'font-size': 13, fill: C.tick, 'text-anchor': 'end' });
    if (o.xmin < 0 && o.ymin < 0) tx(g, X(0) - 8, Y(0) + 13, '0', { 'font-size': 13, fill: C.tick, 'text-anchor': 'end' });
    mtx(g, X(o.xmax) - 4, Y(y0) - 14, 'x', { 'font-size': 20, fill: C.muted });
    mtx(g, X(x0) + 14, Y(o.ymax) + 10, 'y', { 'font-size': 20, fill: C.muted });
    return { X, Y, sx, sy, o, g, inv: (px, py) => ({ x: o.xmin + (px - o.x0) / sx, y: o.ymax - (py - o.y0) / sy }) };
  }
  // A number line. o: {x0, x1, y, min, max}
  function numLine(p, o) {
    const s = (o.x1 - o.x0) / (o.max - o.min), X = v => o.x0 + (v - o.min) * s, g = el('g', {}, p);
    el('line', { x1: o.x0 - 18, x2: o.x1 + 18, y1: o.y, y2: o.y, stroke: C.axis, 'stroke-width': 2.5, 'marker-end': 'url(#aA)', 'marker-start': 'url(#aAs)' }, g);
    for (let v = o.min; v <= o.max; v++) {
      el('line', { x1: X(v), x2: X(v), y1: o.y - (v % 5 === 0 ? 10 : 6), y2: o.y + (v % 5 === 0 ? 10 : 6), stroke: C.axis, 'stroke-width': v === 0 ? 2.5 : 1.5 }, g);
      if (o.every === 1 || v % (o.every || 2) === 0) tx(g, X(v), o.y + 26, fmt(v), { 'font-size': 15, fill: v === 0 ? C.text : C.tick });
    }
    return { X, s, g, o };
  }
  const fmt = n => (n < 0 ? '−' : '') + Math.abs(Math.round(n * 1000) / 1000);
  function defs(svg) {
    const d = el('defs', {}, svg);
    const cols = { A: C.axis, W: C.text, G: C.gold, B: C.teal, Y: C.yellow, R: C.red, L: C.blue, N: C.green, M: C.muted };
    for (const k in cols) {
      const m = el('marker', { id: 'a' + k, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 15, markerHeight: 15, markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse' }, d);
      el('path', { d: 'M0 0L10 5L0 10z', fill: cols[k] }, m);
    }
    const ms = el('marker', { id: 'aAs', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 15, markerHeight: 15, markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse' }, d);
    el('path', { d: 'M0 0L10 5L0 10z', fill: C.axis }, ms);
    const f = el('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, d);
    el('feGaussianBlur', { stdDeviation: 4, result: 'b' }, f);
    const mg = el('feMerge', {}, f); el('feMergeNode', { in: 'b' }, mg); el('feMergeNode', { in: 'SourceGraphic' }, mg);
  }
  function pt(evt) {
    const svg = $('svg'), p = svg.createSVGPoint(); p.x = evt.clientX; p.y = evt.clientY;
    const m = svg.getScreenCTM(); return m ? p.matrixTransform(m.inverse()) : { x: 0, y: 0 };
  }
  const mathHTML = s => String(s).replace(/(^|[^a-z&;])([a-z])(?![a-z])/g, '$1<i>$2</i>');
  const fracHTML = (n, d) => '<span class="fr"><span>' + n + '</span><span>' + d + '</span></span>';
  // A fraction as HTML: whole numbers plain, others stacked.
  const qHTML = (v, opt) => { v = Q.of(v); const s = v.n < 0 ? '−' : ''; if (v.d === 1) return s + Math.abs(v.n); return s + fracHTML(Math.abs(v.n), v.d); };

  /* ---------- drawing the stage ---------- */
  const A = { el, tx, mtx, frac, plane, numLine, later, tween, C, fmt, pt, mathHTML, fracHTML, qHTML, get resp() { return resp; }, redraw: () => draw(phase, lastRes, false), set: (k, v) => { resp[k] = v; const back = phase === 'wrong'; if (back) setFb('', ''); draw(back ? 'ask' : phase, back ? null : lastRes, false); }, get locked() { return resolved; } };
  function draw(ph, res, anim) {
    gen++; timers.forEach(clearTimeout); timers = [];
    phase = ph; lastRes = res || null;
    const svg = $('svg'); svg.innerHTML = ''; defs(svg);
    A.svg = el('g', {}, svg);
    tab.draw(A, item, { phase: ph, res: lastRes, resp, anim: anim !== false });
  }

  const kindOf = (t, it) => typeof t.kind === 'function' ? t.kind(it) : t.kind;
  const K = () => kindOf(tab, item);

  /* ---------- the answer area ---------- */
  function buildAnswer() {
    const box = $('ans'); box.innerHTML = '';
    if (K() === 'slots') {
      const row = document.createElement('div'); row.className = 'slots';
      tab.slots(item).forEach(p => {
        if (typeof p === 'string') { const s = document.createElement('span'); s.innerHTML = mathHTML(p); row.appendChild(s); return; }
        if (p.h != null) { const s = document.createElement('span'); s.innerHTML = p.h; row.appendChild(s); return; }
        const inp = document.createElement('input');
        inp.className = 'slot' + (p.tint ? ' t' + p.tint : '') + (p.wide ? ' wide' : '') + (p.narrow ? ' n' : '') + (p.sup ? ' sup' : ''); inp.dataset.k = p.k;
        inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('aria-label', p.label || p.k);
        if (COARSE) inp.inputMode = 'none';
        inp.addEventListener('input', () => { inp.classList.remove('bad', 'ok'); });
        inp.addEventListener('focus', () => { lastSlot = inp; });
        row.appendChild(inp);
      });
      box.appendChild(row);
      if (COARSE) box.appendChild(keypad());
    } else if (K() === 'choice') {
      const row = document.createElement('div'); const chs = tab.choices(item), long = chs.some(c => String(c.aria || c.label).replace(/<[^>]*>/g, '').length > 8);
      row.className = 'choices' + (tab.cols === 2 ? ' two' : tab.cols === 3 ? ' three' : long ? ' one' : chs.length === 4 ? ' two' : chs.length === 3 ? ' three' : '');
      chs.forEach(c => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'choice' + (c.math ? ' math' : ''); b.dataset.v = c.v;
        b.innerHTML = c.label; b.setAttribute('aria-label', c.aria || c.v);
        b.addEventListener('click', () => { if (resolved) return; resp.v = c.v; check(); });
        row.appendChild(b);
      });
      box.appendChild(row);
    } else if (tab.panel) tab.panel(box, item, A);
    $('bCheck').hidden = K() === 'choice';
  }
  let lastSlot = null;
  function keypad() {
    const k = document.createElement('div'); k.className = 'keypad';
    ['7', '8', '9', '−', '⌫', '4', '5', '6', '/', '.', '1', '2', '3', '0', '±'].forEach(c => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = c;
      b.addEventListener('click', () => {
        const inp = lastSlot || $('ans').querySelector('.slot'); if (!inp || resolved) return;
        if (c === '⌫') inp.value = inp.value.slice(0, -1);
        else if (c === '±') inp.value = /^[−-]/.test(inp.value) ? inp.value.slice(1) : '−' + inp.value;
        else inp.value += c;
        inp.classList.remove('bad', 'ok'); inp.focus();
      });
      k.appendChild(b);
    });
    return k;
  }
  function readSlots() {
    const out = {}; let bad = false, any = false;
    $('ans').querySelectorAll('.slot').forEach(inp => {
      const v = Q.parse(inp.value);
      if (v === null) { bad = true; inp.classList.add('bad'); }
      else if (v !== '') any = true;
      out[inp.dataset.k] = v === '' ? null : v;
    });
    // A blank box counts as 0 once something is filled in.
    if (!bad && any) for (const k in out) if (out[k] === null) out[k] = Q.q(0);
    return bad ? 'bad' : any ? out : null;
  }
  function fillSlots(ans, cls) {
    $('ans').querySelectorAll('.slot').forEach(inp => { const v = ans[inp.dataset.k]; if (v != null) inp.value = typeof v === 'string' ? v : Q.str(v); inp.classList.remove('bad', 'ok'); inp.classList.add(cls); inp.readOnly = true; });
  }

  /* ---------- one item ---------- */
  /* ---------- weighting: missed question types come back more often ---------- */
  const TYPE_FIELDS = ['form', 'kind', 'shape', 'type', 'rep', 'ask', 'what', 'mode', 'rule', 'ans', 'useD', 'back', 'direct', 'flip', 'rat', 'idCol'];
  function keyOf(it) {
    if (tab.typeOf) return String(tab.typeOf(it));
    return TYPE_FIELDS.filter(k => typeof it[k] === 'string' || typeof it[k] === 'boolean').map(k => k + ':' + it[k]).join('|');
  }
  const scores = () => (save.w[tab.id] = save.w[tab.id] || {});
  const weightOf = k => Math.pow(2, scores()[k] || 0);
  function record(right) {
    const s = scores(), k = item.__key; if (k == null) return;
    s[k] = right ? Math.max(-1, (s[k] || 0) - .5) : Math.min(1.3, (s[k] || 0) + 1);
    store();
  }
  function newItem(given) {
    let it = given, key = '';
    if (!it) {
      const cands = [];
      for (let i = 0; i < 40 && cands.length < 8; i++) { const c = tab.gen(), k = JSON.stringify(c); if (k !== lastKey) cands.push(c); }
      if (!cands.length) cands.push(tab.gen());
      const ws = cands.map(c => weightOf(keyOf(c))), total = ws.reduce((a, b) => a + b, 0);
      let r = Q.rnd(0, 999999) / 1e6 * total, i = 0; while (i < cands.length - 1 && r >= ws[i]) { r -= ws[i]; i++; }
      it = cands[i]; key = JSON.stringify(it);
    }
    lastKey = key || JSON.stringify(it);
    Object.defineProperty(it, '__key', { value: keyOf(it), enumerable: false, configurable: true, writable: true });
    item = it; resp = {}; att = 0; resolved = false;
    if (tab.link) setNotes(linkOf());
    $('askBox').hidden = false; $('ans').hidden = false; $('acts').hidden = false; $('fb').hidden = false; $('done').hidden = true;
    $('q').textContent = typeof tab.q === 'function' ? tab.q(item) : tab.q;
    const pr = $('prompt'); pr.innerHTML = tab.prompt ? tab.prompt(item) : '';
    const plen = pr.textContent.length; pr.style.fontSize = plen > 24 ? '23px' : plen > 17 ? '27px' : '';
    buildAnswer(); setFb('', '');
    const bc = $('bCheck'); bc.textContent = 'Check'; bc.classList.remove('go'); $('bShow').disabled = false;
    dots(); draw('ask', null, true);
    const first = $('ans').querySelector('.slot');
    if (first && !COARSE) first.focus();
  }
  function setFb(kind, cue) {
    const f = $('fb'); f.className = 'fb' + (kind ? ' ' + kind : '');
    f.innerHTML = kind ? '<span class="mark">' + (kind === 'ok' ? '✓' : kind === 'bad' ? '✗' : '👁') + '</span><span>' + (cue || '') + '</span>' : '';
  }
  function check() {
    if (resolved) return nextOrFinish();
    let r = resp;
    if (K() === 'choice' && resp.v == null) return;
    if (K() === 'slots') {
      const s = readSlots();
      if (s === 'bad') return setFb('info', 'Numbers only: 3, −2, 3/4, 0.5');
      if (!s) return setFb('info', 'Type your answer');
      r = resp = s;
    }
    const need = tab.ready ? tab.ready(resp, item) : '';
    if (need) return setFb('info', need);
    const res = tab.check(item, r); att++;
    const tries = tab.tries || (K() === 'choice' ? 1 : 2);
    if (res.ok) {
      resolved = true; marks.push(att === 1 ? 'g' : 'y'); record(att === 1);
      setFb('ok', res.cue || pick(['Yes', 'Right', 'Correct', 'Nice']));
      markAnswer(true); draw('right', res, true); afterResolve();
    } else if (att >= tries) {
      resolved = true; marks.push('r'); record(false);
      setFb('bad', res.cue);
      markAnswer(false); reveal(); draw('show', res, true); afterResolve();
    } else {
      setFb('bad', res.cue);
      markAnswer(false); draw('wrong', res, true);
      const bad = $('ans').querySelector('.slot.bad') || $('ans').querySelector('.slot');
      if (bad && !COARSE) { bad.focus(); bad.select(); }
    }
    return res;
  }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function markAnswer(ok) {
    if (K() === 'slots') {
      const ans = tab.answer(item);
      $('ans').querySelectorAll('.slot').forEach(inp => { const v = resp[inp.dataset.k]; inp.classList.remove('ok', 'bad'); const a = ans[inp.dataset.k]; inp.classList.add(ok || Q.eq(v, typeof a === 'string' ? Q.parse(a) : a) ? 'ok' : 'bad'); });
    } else if (K() === 'choice') {
      $('ans').querySelectorAll('.choice').forEach(b => { if (b.dataset.v === String(resp.v)) b.classList.add(ok ? 'ok' : 'bad'); });
    }
  }
  function reveal() {
    const ans = tab.answer(item);
    if (K() === 'slots') fillSlots(ans, 'shown');
    else if (K() === 'choice') $('ans').querySelectorAll('.choice').forEach(b => { if (b.dataset.v === String(ans.v)) b.classList.add('ok'); });
    else resp.shown = ans;
  }
  function afterResolve() {
    $('ans').querySelectorAll('button, input').forEach(b => { if (b.classList.contains('slot')) b.readOnly = true; else b.disabled = true; });
    const bc = $('bCheck'); bc.hidden = false; bc.textContent = marks.length >= ROUND ? 'Finish' : 'Next →'; bc.classList.add('go'); $('bShow').disabled = true;
    dots(); if (!COARSE) bc.focus();
  }
  function show() {
    if (resolved) return;
    resolved = true; marks.push('r'); record(false); reveal();
    setFb('info', 'Watch');
    draw('show', { ok: false, code: 'shown' }, true); afterResolve();
  }
  function nextOrFinish() { if (marks.length >= ROUND) finish(); else newItem(); }
  function dots() {
    const d = $('dots'); d.innerHTML = '';
    for (let i = 0; i < ROUND; i++) { const s = document.createElement('span'); if (marks[i]) s.className = marks[i]; else if (i === marks.length) s.className = 'now'; d.appendChild(s); }
    d.setAttribute('aria-label', 'This round: ' + marks.filter(m => m === 'g').length + ' first try out of ' + marks.length);
  }
  function finish() {
    const score = marks.filter(m => m === 'g').length;
    save.best[tab.id] = Math.max(save.best[tab.id] || 0, score); store(); tabsBar();
    $('askBox').hidden = true; $('ans').hidden = true; $('acts').hidden = true; $('fb').hidden = true;
    const i = PAGE.tabs.indexOf(tab), nx = PAGE.tabs[i + 1];
    const d = $('done'); d.hidden = false;
    d.innerHTML = '<div class="score">' + score + '<small>/' + ROUND + '</small></div>' +
      '<button type="button" class="btn primary" id="bAgain">↻ Again</button>' +
      (nx ? '<button type="button" class="btn" id="bNextTab">' + nx.name + ' →</button>' : '') +
      (score < 7 ? '<a class="notes" style="justify-content:center" href="' + notesHref(linkOf()) + '" target="_blank" rel="noopener">📖 Notes §' + linkOf().sec + '</a>' : '');
    $('bAgain').onclick = () => setTab(tab.id);
    if (nx) $('bNextTab').onclick = () => setTab(nx.id);
    $('svg').innerHTML = ''; defs($('svg'));
    const g = el('g', {}, $('svg'));
    marks.forEach((m, k) => el('circle', { cx: 320 + (k - 4.5) * 46, cy: 210, r: 16, fill: m === 'g' ? C.green : m === 'y' ? C.yellow : C.red, class: 'pop', style: 'animation-delay:' + k * 60 + 'ms' }, g));
    if (!COARSE) $('bAgain').focus();
  }
  const notesHref = t => (t.notes || PAGE.notes) + '#:~:text=' + encodeURIComponent(PAGE.secText ? PAGE.secText(t) : 'Section ' + t.sec + ' ' + (t.sep || PAGE.sep || '—'));

  /* ---------- tabs ---------- */
  function tabsBar() {
    const bar = $('tabs'); bar.innerHTML = '';
    PAGE.tabs.forEach(t => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      b.innerHTML = '<small>' + t.code + '</small>' + t.name + ((save.best[t.id] || 0) >= 8 ? '<span class="star" aria-label="8 or more"></span>' : '');
      b.addEventListener('click', () => setTab(t.id));
      bar.appendChild(b);
    });
  }
  function setNotes(t) {
    const n = $('notes'); n.href = notesHref(t); $('notesTxt').textContent = '§' + t.sec;
    n.title = 'Notes, Section ' + t.sec; n.setAttribute('aria-label', 'Open the notes at Section ' + t.sec);
  }
  // A tab with link(item) points the 📖 button at the current item's own notes.
  const linkOf = () => tab.link ? Object.assign({}, tab, tab.link(item)) : tab;
  function setTab(id) {
    tab = PAGE.tabs.find(t => t.id === id) || PAGE.tabs[0];
    save.tab = tab.id; store(); marks = []; lastKey = '';
    tabsBar();
    setNotes(tab);
    newItem();
  }
  function boot(P) {
    PAGE = P; load();
    if (RM) document.body.classList.add('nomo');
    if (P.sans) document.body.classList.add('sans');
    $('course').textContent = P.course; $('title').textContent = P.title;
    $('bCheck').addEventListener('click', check);
    $('bShow').addEventListener('click', show);
    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || !$('done').hidden) return;
      e.preventDefault(); check();
    });
    setTab(save.tab);
    if (DEBUG) window.DRILL = { PAGE, MODEL: typeof MODEL !== 'undefined' ? MODEL : null, setTab, newItem, check, show,
      fill: vals => { $('ans').querySelectorAll('.slot').forEach(inp => { inp.value = vals[inp.dataset.k] != null ? vals[inp.dataset.k] : ''; }); },
      pickChoice: v => { const b = [...$('ans').querySelectorAll('.choice')].find(x => x.dataset.v === String(v)); if (b) b.click(); },
      setResp: o => { Object.assign(resp, o); draw(phase, lastRes, false); },
      state: () => ({ tab: tab.id, item, att, resolved, marks: marks.slice(), phase, fb: $('fb').textContent, resp }),
      keyOf: (it, t) => { const cur = tab; if (t) tab = t; try { return keyOf(it); } finally { tab = cur; } }, weights: () => Object.assign({}, scores()), resetWeights: () => { save.w[tab.id] = {}; }, setScore: (k, s) => { scores()[k] = s; } };
  }
  return { boot, kindOf, C, el, tx, mtx, frac, mathHTML, fracHTML, qHTML };
})();
/* ===== DRILL SHELL END ===== */

