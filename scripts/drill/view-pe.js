
/* ===================== PAGE: pictures and tabs ===================== */
const { C, qHTML, fracHTML, mathHTML } = DRILL;
const SUP = s => '<sup>' + s + '</sup>';
const neg = n => (n < 0 ? '−' : '') + Math.abs(n);
const bH = b => b.letter ? '<i>' + b.s + '</i>' : b.s;
const pH = (b, e) => bH(b) + (e === 1 ? '' : SUP(neg(e)));
// A power drawn in SVG: base with a raised exponent.
function pw(A, p, x, y, base, exp, a) {
  a = Object.assign({ 'font-size': 40 }, a || {});
  const fs = +a['font-size'], t = A.el('text', Object.assign({ x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'm', fill: C.text }, a), p);
  const sp = (s, at) => { const e = A.el('tspan', at || {}, t); e.textContent = s; return e; };
  String(base).split(/([a-z])/).forEach(s => { if (s) sp(s, /^[a-z]$/.test(s) ? { 'font-style': 'italic' } : {}); });
  if (exp !== '' && exp != null) sp(String(exp), { dy: -fs * .42, 'font-size': fs * .62, fill: a.expFill || a.fill || C.text });
  return t;
}
// A row of factor chips centred on cx. Returns the chip centres.
function chipRow(A, p, cx, y, labels, o) {
  o = o || {}; const n = labels.length, gap = 6, maxW = o.maxW || 560;
  let w = Math.max(...labels.map(s => 18 + String(s).length * 14)); w = Math.min(w, (maxW - gap * (n - 1)) / n);
  const fs = Math.min(24, w * .55), total = n * w + gap * (n - 1), xs = [];
  labels.forEach((s, i) => {
    const x = cx - total / 2 + i * (w + gap) + w / 2, col = Array.isArray(o.col) ? o.col[i] : (o.col || C.blue);
    const g = A.el('g', { class: o.cls || null, style: o.cls ? 'animation-delay:' + (i * (o.step || 50)) + 'ms' : null }, p);
    A.el('rect', { x: x - w / 2, y: y - 22, width: w, height: 44, rx: 9, fill: col, 'fill-opacity': .16, stroke: col, 'stroke-width': 2 }, g);
    A.mtx(g, x, y + 1, s, { 'font-size': fs, fill: col });
    xs.push(x);
  });
  return { xs, w };
}
const strike = (A, x, y, w) => A.el('path', { d: 'M' + (x - w / 2 + 4) + ' ' + (y + 18) + 'L' + (x + w / 2 - 4) + ' ' + (y - 18), stroke: C.red, 'stroke-width': 3, class: 'fade' }, A.svg);
const done = V => V.phase === 'right' || V.phase === 'show';
const valSlot = () => ['=', { k: 'v', label: 'value', wide: true }];
const lawSlots = it => it.b.letter ? [{ h: '<i>' + it.b.s + '</i>' }, { k: 'e', sup: true, label: 'exponent' }] : [{ k: 'b', label: 'base' }, { k: 'e', sup: true, label: 'exponent' }];
const lawAns = it => it.b.letter ? { e: Q.q(it.e) } : { b: Q.q(it.b.v), e: Q.q(it.e) };

/* PE1 what a power means */
const T_BASE = {
  id: 'base', code: 'PE1', name: 'Base', sec: 1, q: 'Evaluate', kind: 'slots',
  gen: MODEL.genBase,
  prompt: it => (it.form === 'paren' ? '(−' + it.a + ')' : it.form === 'neg' ? '−' + it.a : it.a) + SUP(it.n),
  slots: valSlot, check: MODEL.checkBase, answer: it => ({ v: Q.q(it.v) }),
  draw(A, it, V) {
    pw(A, A.svg, 320, 80, it.form === 'paren' ? '(−' + it.a + ')' : it.form === 'neg' ? '−' + it.a : String(it.a), it.n, { 'font-size': 56, expFill: C.gold });
    if (V.phase === 'ask') return;
    const labs = Array(it.n).fill(it.form === 'paren' ? '(−' + it.a + ')' : String(it.a));
    const col = it.form === 'paren' ? C.red : C.blue;
    if (it.form === 'neg') {
      A.mtx(A.svg, 160, 210, '−', { 'font-size': 56, fill: C.red, class: 'fade' });
      A.el('rect', { x: 196, y: 172, width: 330, height: 76, rx: 16, fill: 'none', stroke: C.muted, 'stroke-dasharray': '6 5', 'stroke-width': 2, class: 'fade' }, A.svg);
    }
    const r = chipRow(A, A.svg, it.form === 'neg' ? 361 : 320, 210, labs, { col, cls: 'pop', maxW: it.form === 'neg' ? 300 : 520 });
    if (it.form === 'paren' && done(V)) {
      for (let i = 0; i + 1 < it.n; i += 2) {
        const x1 = r.xs[i], x2 = r.xs[i + 1];
        A.el('path', { d: 'M' + x1 + ' 238Q' + (x1 + x2) / 2 + ' 290 ' + x2 + ' 238', stroke: C.green, 'stroke-width': 2.5, fill: 'none', class: 'fade' }, A.svg);
        A.mtx(A.svg, (x1 + x2) / 2, 286, '+', { 'font-size': 26, fill: C.green, class: 'fade' });
      }
      if (it.n % 2) A.mtx(A.svg, r.xs[it.n - 1], 286, '−', { 'font-size': 30, fill: C.red, class: 'pop' });
    }
    if (done(V)) A.mtx(A.svg, 320, 352, '= ' + neg(it.v), { 'font-size': 44, fill: C.green, class: V.anim ? 'pop' : null, style: 'animation-delay:400ms' });
  }
};

/* PE2 zero exponent: the pattern ladder */
function ladder(A, B, top, bottom, V, target) {
  const rows = [], h = Math.min(54, 330 / (top - bottom + 1)), y0 = 210 - (top - bottom) * h / 2;
  for (let e = top; e >= bottom; e--) rows.push(e);
  const bs = Q.of(B), bLab = bs.d === 1 ? (bs.n < 0 ? '(' + neg(bs.n) + ')' : String(bs.n)) : '(' + Q.str(bs) + ')';
  rows.forEach((e, i) => {
    const y = y0 + i * h, isT = e === target, v = MODEL.pow ? powQ(bs, e) : null;
    pw(A, A.svg, 220, y, bLab, neg(e), { 'font-size': 30, fill: isT ? C.yellow : C.text });
    A.mtx(A.svg, 300, y, '=', { 'font-size': 28, fill: C.muted });
    const showV = !isT || done(V);
    A.mtx(A.svg, 390, y, showV ? Q.str(v) : '?', { 'font-size': 30, fill: isT ? (showV ? C.green : C.yellow) : C.text, class: isT && done(V) ? 'pop' : null });
    if (i) { A.el('path', { d: 'M470 ' + (y - h + 8) + 'Q500 ' + (y - h / 2) + ' 470 ' + (y - 8), stroke: C.gold, 'stroke-width': 2, fill: 'none', 'marker-end': 'url(#aG)' }, A.svg); A.mtx(A.svg, 530, y - h / 2, '÷ ' + bLab, { 'font-size': 20, fill: C.gold }); }
  });
}
function powQ(b, e) { let r = Q.q(1); for (let i = 0; i < Math.abs(e); i++) r = Q.mul(r, b); return e < 0 ? Q.div(1, r) : r; }
const T_ZERO = {
  id: 'zero', code: 'PE2', name: 'Zero', sec: 2, q: 'Evaluate', kind: 'slots',
  gen: MODEL.genZero,
  prompt: it => ({ plain: it.a + SUP(0), paren: '(−' + it.a + ')' + SUP(0), neg: '−' + it.a + SUP(0), times: it.k + ' × ' + it.a + SUP(0), sum: it.a + SUP(0) + ' + ' + it.b + SUP(0), mono: '(' + it.k + '<i>x</i>' + SUP(it.e) + ')' + SUP(0) })[it.form],
  slots: valSlot, check: MODEL.checkZero, answer: it => ({ v: Q.q(it.v) }),
  draw(A, it, V) {
    const B = it.form === 'paren' ? -Math.min(it.a, 9) : Math.min(it.a, 12);
    ladder(A, B, 3, 0, V, 0);
    if (done(V) && it.form !== 'plain' && it.form !== 'paren') {
      const s = { neg: '−(1) = −1', times: it.k + ' × 1 = ' + it.k, sum: '1 + 1 = 2', mono: '(anything)⁰ = 1' }[it.form];
      A.mtx(A.svg, 320, 392, s, { 'font-size': 30, fill: C.green, class: 'fade' });
    }
  }
};

/* PE3 product, PE4 quotient, PE5 power of a power */
function prodPic(A, b, m, n, V, y) {
  y = y || 140; const w = 560 * m / (m + n);
  const r1 = chipRow(A, A.svg, 50 + w / 2 - 10, y, Array(m).fill(b.s), { col: C.blue, maxW: w - 30 });
  A.mtx(A.svg, 50 + w + 4, y, '×', { 'font-size': 30, fill: C.muted });
  const r2 = chipRow(A, A.svg, 50 + w + 30 + (560 - w) / 2 - 10, y, Array(n).fill(b.s), { col: C.gold, maxW: 560 - w - 40 });
  A.mtx(A.svg, (r1.xs[0] + r1.xs[m - 1]) / 2, y + 46, String(m), { 'font-size': 22, fill: C.blue });
  A.mtx(A.svg, (r2.xs[0] + r2.xs[n - 1]) / 2, y + 46, String(n), { 'font-size': 22, fill: C.gold });
  if (done(V)) {
    chipRow(A, A.svg, 320, y + 130, Array(m).fill(b.s).concat(Array(n).fill(b.s)), { col: Array(m).fill(C.blue).concat(Array(n).fill(C.gold)), cls: 'pop', step: 40 });
    A.mtx(A.svg, 320, y + 190, m + ' + ' + n + ' = ' + (m + n) + ' factors', { 'font-size': 24, fill: C.green, class: 'fade' });
  }
}
function quotPic(A, b, m, n, V) {
  const top = chipRow(A, A.svg, 320, 120, Array(m).fill(b.s), { col: C.blue }), bot = chipRow(A, A.svg, 320, 230, Array(n).fill(b.s), { col: C.gold, maxW: 560 * n / Math.max(m, 1) + 20 });
  A.el('line', { x1: 40, x2: 600, y1: 175, y2: 175, stroke: C.text, 'stroke-width': 3 }, A.svg);
  if (V.phase !== 'ask') {
    for (let i = 0; i < n; i++) { strike(A, top.xs[i], 120, top.w); strike(A, bot.xs[i], 230, bot.w); A.el('path', { d: 'M' + top.xs[i] + ' 144L' + bot.xs[i] + ' 206', stroke: C.red, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', class: 'fade' }, A.svg); }
  }
  if (done(V)) A.mtx(A.svg, 320, 330, m + ' − ' + n + ' = ' + (m - n) + ' left', { 'font-size': 28, fill: C.green, class: 'fade' });
}
function powPic(A, b, m, n, V) {
  const h = Math.min(58, 250 / n);
  for (let row = 0; row < n; row++) {
    const y = 90 + row * h;
    const r = chipRow(A, A.svg, 320, y, Array(m).fill(b.s), { col: C.blue, maxW: 420 }), L = r.xs[0] - r.w / 2 - 12, R = r.xs[m - 1] + r.w / 2 + 12;
    A.el("path", { d: "M" + L + " " + (y - 22) + "q-12 22 0 44M" + R + " " + (y - 22) + "q12 22 0 44", stroke: C.muted, "stroke-width": 2, fill: "none" }, A.svg);
    A.mtx(A.svg, R + 22, y - 14, String(m), { "font-size": 18, fill: C.gold });
  }
  if (V.phase !== 'ask') {
    A.mtx(A.svg, 320, 90 + n * h + 6, n + " rows of " + m, { "font-size": 24, fill: C.gold, class: "fade" });
  }
  if (done(V)) A.mtx(A.svg, 320, 90 + n * h + 58, n + ' × ' + m + ' = ' + (n * m) + ' factors', { 'font-size': 28, fill: C.green, class: 'fade' });
}
const T_PROD = {
  id: 'prod', code: 'PE3', name: 'Multiply', sec: 3, q: 'One power', kind: 'slots',
  gen: MODEL.genProd, prompt: it => pH(it.b, it.m) + ' × ' + pH(it.b, it.n), slots: lawSlots, check: MODEL.checkProd, answer: lawAns,
  draw: (A, it, V) => prodPic(A, it.b, it.m, it.n, V)
};
const T_QUOT = {
  id: 'quot', code: 'PE4', name: 'Divide', sec: 4, q: 'One power', kind: 'slots',
  gen: MODEL.genQuot, prompt: it => pH(it.b, it.m) + ' ÷ ' + pH(it.b, it.n), slots: lawSlots, check: MODEL.checkQuot, answer: lawAns,
  draw: (A, it, V) => quotPic(A, it.b, it.m, it.n, V)
};
const T_POW = {
  id: 'pow', code: 'PE5', name: 'Power of a power', sec: 5, q: 'One power', kind: 'slots',
  gen: MODEL.genPow, prompt: it => '(' + pH(it.b, it.m) + ')' + SUP(it.n), slots: lawSlots, check: MODEL.checkPow, answer: lawAns,
  draw: (A, it, V) => powPic(A, it.b, it.m, it.n, V)
};

/* PE6 power of a product */
const T_BR = {
  id: 'br', code: 'PE6', name: 'Brackets', sec: 6, q: 'Simplify', kind: 'slots',
  gen: MODEL.genBr,
  prompt: it => '(' + neg(it.k) + '<i>' + it.L + '</i>' + (it.m > 1 ? SUP(it.m) : '') + ')' + SUP(it.n),
  slots: it => [{ k: 'c', label: 'number' }, { h: '<i>' + it.L + '</i>' }, { k: 'e', sup: true, label: 'exponent' }],
  check: MODEL.checkBr, answer: it => ({ c: Q.q(it.c), e: Q.q(it.e) }),
  draw(A, it, V) {
    const h = Math.min(56, 230 / it.n), kS = it.k < 0 ? '(' + neg(it.k) + ')' : String(it.k), xS = it.L + (it.m > 1 ? ['', '', '²', '³', '⁴'][it.m] : '');
    for (let r = 0; r < it.n; r++) {
      const y = 70 + r * h;
      chipRow(A, A.svg, 190, y, [kS], { col: C.gold, maxW: 90 });
      chipRow(A, A.svg, 330, y, [xS], { col: C.teal, maxW: 90 });
      A.el('path', { d: 'M126 ' + (y - 22) + 'q-12 22 0 44M394 ' + (y - 22) + 'q12 22 0 44', stroke: C.muted, 'stroke-width': 2, fill: 'none' }, A.svg);
    }
    const yb = 70 + it.n * h + 20;
    if (V.phase !== 'ask') {
      [190, 330].forEach(x => A.el('path', { d: 'M' + x + ' ' + (yb - 14) + 'v26', stroke: C.muted, 'stroke-width': 2, 'marker-end': 'url(#aM)', class: 'fade' }, A.svg));
      A.mtx(A.svg, 190, yb + 44, done(V) ? neg(it.c) : '?', { 'font-size': 32, fill: done(V) ? C.gold : C.muted, class: 'fade' });
      pw(A, A.svg, 330, yb + 44, it.L, done(V) ? it.e : '?', { 'font-size': 32, fill: done(V) ? C.teal : C.muted, class: 'm fade' });
      A.mtx(A.svg, 520, 70 + (it.n - 1) * h / 2, it.n + ' copies', { 'font-size': 22, fill: C.muted, class: 'fade' });
    }
    if (done(V)) {
      A.mtx(A.svg, 190, yb + 92, Array(it.n).fill(kS).join('·'), { 'font-size': 18, fill: C.gold, class: 'fade' });
      A.mtx(A.svg, 330, yb + 92, it.m + ' × ' + it.n, { 'font-size': 18, fill: C.teal, class: 'fade' });
    }
  }
};

/* PE7 negative exponents: the ladder keeps going */
const T_NEG = {
  id: 'neg', code: 'PE7', name: 'Negative', sec: 7, q: 'Evaluate', kind: 'slots',
  gen: MODEL.genNeg,
  prompt: it => (it.form === 'frac' ? '(' + fracHTML(it.p, it.d) + ')' : it.form === 'negbase' ? '(' + neg(it.a) + ')' : it.a) + SUP('−' + it.n),
  slots: valSlot, check: MODEL.checkNeg, answer: it => ({ v: it.v }),
  draw(A, it, V) { const B = it.form === 'frac' ? Q.q(it.p, it.d) : Q.q(it.a); ladder(A, B, Math.min(2, 4 - it.n), -it.n, V, -it.n); }
};

/* Which law? */
const T_WHICH = {
  id: 'which', code: 'PE3–5', name: 'Which law?', sec: 3, q: 'The exponents…', kind: 'choice',
  gen: MODEL.genWhich,
  prompt: it => { const x = '<i>' + it.L + '</i>'; return it.kind === 'add' ? x + SUP(it.m) + ' × ' + x + SUP(it.n) : it.kind === 'sub' ? x + SUP(it.m) + ' ÷ ' + x + SUP(it.n) : it.kind === 'mul' ? '(' + x + SUP(it.m) + ')' + SUP(it.n) : it.form === 'plus' ? x + SUP(it.m) + ' + ' + x + SUP(it.n) : x + SUP(it.m) + ' × <i>' + it.other + '</i>' + SUP(it.n); },
  choices: () => [{ v: 'add', label: 'Add' }, { v: 'sub', label: 'Subtract' }, { v: 'mul', label: 'Multiply' }, { v: 'none', label: 'No law' }],
  check: MODEL.checkWhich, answer: it => ({ v: it.kind }),
  draw(A, it, V) {
    const b = { s: it.L, letter: true }, m = it.m, n = it.n;
    if (V.phase === 'ask') { A.mtx(A.svg, 320, 210, '?', { 'font-size': 90, fill: C.edge }); return; }
    const V2 = { phase: 'show', anim: V.anim };
    if (it.kind === 'add') prodPic(A, b, m, n, V2, 120);
    else if (it.kind === 'sub') quotPic(A, b, m, n, V2);
    else if (it.kind === 'mul') powPic(A, b, m, n, V2);
    else {
      chipRow(A, A.svg, 180, 180, Array(Math.min(m, 4)).fill(it.L), { col: C.blue, maxW: 220 });
      A.mtx(A.svg, 320, 180, it.form === 'plus' ? '+' : '×', { 'font-size': 36, fill: C.muted });
      chipRow(A, A.svg, 460, 180, Array(Math.min(n, 4)).fill(it.form === 'plus' ? it.L : it.other), { col: it.form === 'plus' ? C.blue : C.pink, maxW: 220 });
      A.mtx(A.svg, 320, 290, it.form === 'plus' ? 'adding powers: no exponent law' : 'different bases: no exponent law', { 'font-size': 24, fill: C.gold, class: 'fade' });
    }
  }
};

const PAGE = {
  key: 'math9-powers-exponents-trainer-v1', course: 'Math 9 · Number', title: 'Powers & Exponents', sep: '·',
  notes: '../notes/powers-exponents/math9-powers-notes-v1.html',
  tabs: [T_BASE, T_ZERO, T_PROD, T_QUOT, T_POW, T_BR, T_NEG, T_WHICH]
};
DRILL.boot(PAGE);
