
/* ===================== PAGE: pictures and tabs ===================== */
const { C, mathHTML } = DRILL;
const SUP = ['', '', '²', '³'], DCOL = { 3: C.pink, 2: C.blue, 1: C.teal, 0: C.yellow };
const vr = e => e === 0 ? '' : 'x' + SUP[e];
function termStr(t, first) { const a = Math.abs(t.c), body = (a === 1 && t.e > 0 ? '' : a) + vr(t.e); return first ? (t.c < 0 ? '−' : '') + body : (t.c < 0 ? '− ' : '+ ') + body; }
const polyStr = ts => ts.map((t, i) => termStr(t, i === 0)).join(' ');
const pStr = p => { const ts = [3, 2, 1, 0].filter(e => p[e]).map(e => ({ c: p[e], e })); return ts.length ? polyStr(ts) : '0'; };
const stdSlots = () => [{ k: 'c2', label: 'x squared coefficient', narrow: true }, 'x² +', { k: 'c1', label: 'x coefficient', narrow: true }, 'x +', { k: 'c0', label: 'constant', narrow: true }];

/* ---------- algebra tiles ---------- */
const SH = { 2: { w: 58, h: 58 }, 1: { w: 16, h: 58 }, 0: { w: 16, h: 16 } };
function tileEl(A, p, e, neg) {
  const s = SH[e], col = neg ? C.red : DCOL[e], g = A.el('g', {}, p);
  const r = A.el('rect', { x: 0, y: -s.h, width: s.w, height: s.h, rx: 3, fill: col, 'fill-opacity': .28, stroke: col, 'stroke-width': 2 }, g);
  const m = A.el('line', { x1: s.w / 2 - Math.min(6, s.w / 2 - 3), x2: s.w / 2 + Math.min(6, s.w / 2 - 3), y1: -s.h / 2, y2: -s.h / 2, stroke: C.text, 'stroke-width': 2, opacity: neg ? 1 : 0 }, g);
  return { g, recolor: n => { const c2 = n ? C.red : DCOL[e]; r.setAttribute('fill', c2); r.setAttribute('stroke', c2); m.setAttribute('opacity', n ? 1 : 0); } };
}
// Lay terms out left to right from x0, wrapping at x1. Returns tiles and a label per term.
function flowTerms(ts, x0, x1, y, rowH, startFirst) {
  const tiles = [], labels = []; let x = x0;
  ts.forEach((t, i) => {
    const s = SH[t.e], n = Math.abs(t.c), w = n * (s.w + 4) - 4;
    if (x + w > x1 && x > x0) { x = x0; y += rowH; }
    const a = x;
    for (let k = 0; k < n; k++) { tiles.push({ e: t.e, neg: t.c < 0, x, y }); x += s.w + 4; }
    labels.push({ x: (a + x - 4) / 2, y: y + 20, s: termStr(t, startFirst && i === 0) });
    x += 22;
  });
  return { tiles, labels };
}
// Sorted: one column per shape, positives then negatives; zero pairs are the first k of each.
function sortedSpots(tiles) {
  const cols = { 2: { x: 48, w: 236 }, 1: { x: 322, w: 132 }, 0: { x: 476, w: 132 } }, spots = new Map(), pairs = [];
  [2, 1, 0].forEach(e => {
    const s = SH[e], per = Math.max(1, Math.floor((cols[e].w + 4) / (s.w + 4))), pos = tiles.filter(t => t.e === e && !t.neg), neg = tiles.filter(t => t.e === e && t.neg);
    let y = 96 + (e === 0 ? 0 : 0);
    const place = (list, y0) => { list.forEach((t, i) => spots.set(t, { x: cols[e].x + (i % per) * (s.w + 4), y: y0 + s.h + Math.floor(i / per) * (s.h + 6) })); return y0 + Math.ceil(list.length / per) * (s.h + 6); };
    y = place(pos, y); place(neg, y + 12);
    for (let i = 0; i < Math.min(pos.length, neg.length); i++) pairs.push([pos[i], neg[i]]);
  });
  return { spots, pairs, cols };
}
function tileScene(A, it, V, mode) {
  const done = V.phase === 'right' || V.phase === 'show', wrong = V.phase === 'wrong';
  const flip = mode === 'sub' && (wrong || done), sortIt = (mode !== 'sub' && wrong) || done;
  let tiles = [], labels = [];
  const signs = [];
  if (mode === 'like') ({ tiles, labels } = flowTerms(it.groups[0], 40, 600, 110, 112, true));
  else {
    it.groups.forEach((ts, gi) => { const r = flowTerms(ts, 90, 610, gi ? 270 : 130, 0, true); r.tiles.forEach(t => { t.group = gi; }); tiles = tiles.concat(r.tiles); labels = labels.concat(r.labels); });
    signs.push({ x: 50, y: 240, s: mode === 'sub' ? '−' : '+' });
    A.el('rect', { class: 'grp', x: 76, y: 52, width: 548, height: 112, rx: 14, fill: 'none', stroke: C.edge, 'stroke-width': 1.5, 'stroke-dasharray': '6 6' }, A.svg);
    A.el('rect', { class: 'grp', x: 76, y: 192, width: 548, height: 112, rx: 14, fill: 'none', stroke: mode === 'sub' ? C.gold : C.edge, 'stroke-width': mode === 'sub' ? 2 : 1.5, 'stroke-dasharray': '6 6' }, A.svg);
  }
  const g = A.el('g', {}, A.svg), labG = A.el('g', {}, A.svg);
  tiles.forEach(t => { t.v = tileEl(A, g, t.e, t.neg); t.v.g.setAttribute('transform', 'translate(' + t.x + ' ' + t.y + ')'); });
  if (!sortIt) labels.forEach(l => A.mtx(labG, l.x, l.y + 6, l.s, { 'font-size': 20, fill: C.muted }));
  const signEls = signs.map(s => A.mtx(A.svg, s.x, s.y - 10, s.s, { 'font-size': 52, fill: mode === 'sub' ? C.gold : C.text }));
  // flip the second bracket's tiles
  const doFlip = () => {
    const B = tiles.filter(t => t.group === 1);
    A.tween(600, k => {
      B.forEach(t => { const w = SH[t.e].w, sx = Math.abs(1 - 2 * k) || .02; t.v.g.setAttribute('transform', 'translate(' + (t.x + w / 2) + ' ' + t.y + ') scale(' + sx + ' 1) translate(' + (-w / 2) + ' 0)'); if (k >= .5 && !t.flipped) { t.flipped = true; t.neg = !t.neg; t.v.recolor(t.neg); } });
      if (k >= .5 && signEls[0]) signEls[0].textContent = '+';
    });
  };
  const doSort = () => {
    labG.innerHTML = ''; A.svg.querySelectorAll('.grp').forEach(r => r.setAttribute('opacity', 0));
    const { spots, pairs, cols } = sortedSpots(tiles);
    A.tween(800, k => tiles.forEach(t => { const s = spots.get(t); t.v.g.setAttribute('transform', 'translate(' + (t.x + (s.x - t.x) * k) + ' ' + (t.y + (s.y - t.y) * k) + ')'); }), () => {
      if (signEls[0]) signEls[0].setAttribute('opacity', 0);
      if (!done) return;
      pairs.forEach(([a, b]) => { a.v.g.setAttribute('opacity', .18); b.v.g.setAttribute('opacity', .18); });
      [2, 1, 0].forEach(e => A.mtx(A.svg, cols[e].x + cols[e].w / 2 - 10, 392, it.p[e] ? termStr({ c: it.p[e], e }, true) : '0', { 'font-size': 28, fill: it.p[e] ? C.green : C.muted, class: 'pop' }));
    });
  };
  if (flip && sortIt) { doFlip(); A.later(V.anim ? 750 : 0, doSort); }
  else if (flip) doFlip();
  else if (sortIt) doSort();
}

/* ---------- area model ---------- */
function areaModel(A, tops, lefts, V, opt) {
  const W = { 2: 120, 1: 100, 0: 64 }, H = { 1: 100, 0: 64 };
  const tw = tops.reduce((s, t) => s + W[t.e], 0), lh = lefts.reduce((s, t) => s + H[t.e], 0);
  const x0 = Math.round((640 - tw) / 2) + 24, y0 = Math.max(70, Math.round((330 - lh) / 2) + 20);
  const done = V.phase === 'right' || V.phase === 'show', code = V.res && V.res.code;
  let x = x0; tops.forEach((t, i) => { A.mtx(A.svg, x + W[t.e] / 2, y0 - 24, termStr(t, true), { 'font-size': 26, fill: DCOL[t.e] }); x += W[t.e]; });
  let y = y0; lefts.forEach(t => { A.mtx(A.svg, x0 - 34, y + H[t.e] / 2, termStr(t, true), { 'font-size': 26, fill: DCOL[t.e], 'text-anchor': 'middle' }); y += H[t.e]; });
  let k = 0; y = y0;
  lefts.forEach(L => {
    x = x0;
    tops.forEach(T => {
      const e = L.e + T.e, c = L.c * T.c, col = DCOL[e], w = W[T.e], h = H[L.e];
      const hot = V.phase === 'wrong' && opt.hot && opt.hot(e, code);
      A.el('rect', { x, y, width: w, height: h, fill: col, 'fill-opacity': .13, stroke: hot ? C.red : col, 'stroke-width': hot ? 4 : 2, class: hot ? 'pulse' : null }, A.svg);
      if (done) A.mtx(A.svg, x + w / 2, y + h / 2, termStr({ c, e }, true), { 'font-size': 24, fill: col, class: V.anim ? 'pop' : null, style: 'animation-delay:' + (k * 180) + 'ms' });
      else if (V.phase === 'wrong') A.mtx(A.svg, x + w / 2, y + h / 2, '?' + vr(e), { 'font-size': 22, fill: C.muted });
      x += w; k++;
    });
    y += H[L.e];
  });
  if (done) A.mtx(A.svg, 320, Math.min(396, y + 46), pStr(opt.result), { 'font-size': 32, fill: C.green, class: V.anim ? 'fade' : null, style: 'animation-delay:' + (k * 180 + 200) + 'ms' });
}

/* ---------- term chips (parts of a polynomial) ---------- */
const PQ = { degree: 'Degree?', terms: 'How many terms?', constant: 'Constant term?', lead: 'Leading coefficient?' };
const T_PARTS = {
  id: 'parts', code: 'PO1', name: 'Parts', sec: 1, q: 'Parts', kind: 'slots',
  gen: MODEL.genParts,
  prompt: it => '<span style="font-family:inherit;font-size:25px;font-weight:650">' + (it.kind === 'coef' ? 'Coefficient of ' + mathHTML(vr(it.k)) + '?' : PQ[it.kind]) + '</span>',
  slots: () => [{ k: 'n', label: 'answer' }], check: MODEL.checkParts, answer: it => ({ n: Q.q(MODEL.partsAnswer(it)) }),
  draw(A, it, V) {
    const done = V.phase === 'right' || V.phase === 'show', wrong = V.phase === 'wrong', ts = it.ts, top = ts.reduce((a, t) => t.e > a.e ? t : a);
    const g = A.el('g', {}, A.svg), parts = ts.map((t, i) => ({ t, el: A.mtx(g, 0, 210, termStr(t, i === 0), { 'font-size': 50 }) }));
    let total = 0; parts.forEach(p => { p.w = (p.el.getComputedTextLength ? p.el.getComputedTextLength() : 80) + 26; total += p.w + 10; });
    let x = 320 - (total - 10) / 2;
    const showDeg = (done && (it.kind === 'degree' || it.kind === 'lead')) || (wrong && it.kind !== 'terms');
    parts.forEach((p, i) => {
      p.cx = x + p.w / 2; p.el.setAttribute('x', p.cx);
      const hl = done && ((it.kind === 'constant' && p.t.e === 0) || (it.kind === 'lead' && p.t === top) || (it.kind === 'coef' && p.t.e === it.k));
      const outline = hl || (it.kind === 'terms' && (done || wrong));
      const r = A.el('rect', { x, y: 168, width: p.w, height: 84, rx: 14, fill: hl ? '#1d2a3a' : 'none', stroke: hl ? C.gold : outline ? C.muted : 'none', 'stroke-width': hl ? 3 : 2, class: hl && V.anim ? 'pop' : null }, g);
      g.insertBefore(r, g.firstChild);
      if (showDeg) {
        const isTop = p.t === top && done && it.kind === 'degree';
        A.el('circle', { cx: p.cx, cy: 128, r: 17, fill: isTop ? C.gold : C.panel, stroke: isTop ? C.gold : DCOL[p.t.e], 'stroke-width': 2, class: V.anim ? 'pop' : null, style: 'animation-delay:' + i * 120 + 'ms' }, A.svg);
        A.tx(A.svg, p.cx, 129, String(p.t.e), { 'font-size': 18, fill: isTop ? C.stage : C.text, class: V.anim ? 'pop' : null, style: 'animation-delay:' + i * 120 + 'ms' });
      }
      if (it.kind === 'terms' && done) {
        A.el('circle', { cx: p.cx, cy: 292, r: 17, fill: C.gold, class: V.anim ? 'pop' : null, style: 'animation-delay:' + i * 150 + 'ms' }, A.svg);
        A.tx(A.svg, p.cx, 293, String(i + 1), { 'font-size': 18, fill: C.stage, class: V.anim ? 'pop' : null, style: 'animation-delay:' + i * 150 + 'ms' });
      }
      x += p.w + 10;
    });
  }
};

/* PO2 like terms, PO3 add, PO4 subtract (algebra tiles) */
const T_LIKE = {
  id: 'like', code: 'PO2', name: 'Like terms', sec: 2, q: 'Simplify', kind: 'slots',
  gen: MODEL.genLike, prompt: it => mathHTML(polyStr(it.groups[0])), slots: stdSlots, check: MODEL.checkCollect,
  answer: it => MODEL.toResp(it.p), draw: (A, it, V) => tileScene(A, it, V, 'like')
};
const T_ADD = {
  id: 'add', code: 'PO3', name: 'Add', sec: 3, q: 'Add', kind: 'slots',
  gen: MODEL.genAdd, prompt: it => it.groups.map(ts => '(' + mathHTML(polyStr(ts)) + ')').join(' + '), slots: stdSlots, check: MODEL.checkCollect,
  answer: it => MODEL.toResp(it.p), draw: (A, it, V) => tileScene(A, it, V, 'add')
};
const T_SUB = {
  id: 'sub', code: 'PO4', name: 'Subtract', sec: 4, q: 'Subtract', kind: 'slots',
  gen: MODEL.genSub, prompt: it => it.groups.map(ts => '(' + mathHTML(polyStr(ts)) + ')').join(' − '), slots: stdSlots, check: MODEL.checkSub,
  answer: it => MODEL.toResp(it.p), draw: (A, it, V) => tileScene(A, it, V, 'sub')
};

/* PO5 monomial × polynomial, PO6 binomial × binomial (area model) */
const T_MONO = {
  id: 'mono', code: 'PO5', name: 'Monomial ×', sec: 5, q: 'Multiply', kind: 'slots',
  gen: MODEL.genMono, typeOf: it => "e" + it.m.e + (it.m.c < 0 ? "-" : "+"), prompt: it => mathHTML(termStr(it.m, true)) + '(' + mathHTML(polyStr(it.P)) + ')',
  slots: () => [{ k: 'c3', label: 'x cubed coefficient', narrow: true }, 'x³ +', { k: 'c2', label: 'x squared coefficient', narrow: true }, 'x² +', { k: 'c1', label: 'x coefficient', narrow: true }, 'x +', { k: 'c0', label: 'constant', narrow: true }],
  check: MODEL.checkMono, answer: it => MODEL.toResp(it.p),
  draw: (A, it, V) => areaModel(A, it.P, [it.m], V, { result: it.p, hot: (e, code) => code === 'xx' && e >= 2 || code === 'firstonly' })
};
const T_BIN = {
  id: 'bin', code: 'PO6', name: 'Binomial ×', sec: 6, q: 'Multiply', kind: 'slots',
  gen: MODEL.genBin, typeOf: it => (it.p * it.s > 1 ? "coef" : "plain") + (it.a < 0 || it.b < 0 ? "-" : "+"),
  prompt: it => '(' + mathHTML(termStr({ c: it.p, e: 1 }, true) + ' ' + termStr({ c: it.a, e: 0 })) + ')(' + mathHTML(termStr({ c: it.s, e: 1 }, true) + ' ' + termStr({ c: it.b, e: 0 })) + ')',
  slots: stdSlots, check: MODEL.checkBin, answer: it => MODEL.toResp(it.r),
  draw: (A, it, V) => areaModel(A, [{ c: it.p, e: 1 }, { c: it.a, e: 0 }], [{ c: it.s, e: 1 }, { c: it.b, e: 0 }], V, { result: it.r, hot: (e, code) => (code === 'middle' || code === 'onemid') && e === 1 })
};

const PAGE = {
  key: 'math9-polynomials-trainer-v2', course: 'Math 9 · Algebra', title: 'Polynomials',
  notes: '../notes/polynomials/math9-polynomials-notes-v1.html',
  tabs: [T_PARTS, T_LIKE, T_ADD, T_SUB, T_MONO, T_BIN]
};
DRILL.boot(PAGE);
