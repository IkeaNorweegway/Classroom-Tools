
/* ===================== PAGE: pictures and tabs ===================== */
const { C, fracHTML } = DRILL;
const done = V => V.phase === 'right' || V.phase === 'show';
const rt = s => '√<span style="text-decoration:overline">' + s + '</span>';
const valSlot = () => ['=', { k: 'v', label: 'answer', wide: true }];

/* SR1 perfect squares: a square of n tiles has side √n */
function tileSquare(A, cells, shade, unit, V, o) {
  // cells × cells grid, shade × shade filled; unit = cells per 1 (for fraction and decimal roots)
  o = o || {}; const S = Math.min(320, Math.max(220, 26 * cells)), cs = S / cells, x0 = 320 - S / 2 + (o.dx || 0), y0 = 210 - S / 2;
  const grid = o.grid !== false;
  A.el('rect', { x: x0, y: y0 + S - shade * cs, width: shade * cs, height: shade * cs, fill: C.blue, 'fill-opacity': .3, stroke: C.blue, 'stroke-width': 2.5 }, A.svg);
  if (grid) for (let i = 1; i < cells; i++) {
    A.el('line', { x1: x0 + i * cs, x2: x0 + i * cs, y1: y0, y2: y0 + S, stroke: C.grid2, 'stroke-width': 1, class: 'fade' }, A.svg);
    A.el('line', { x1: x0, x2: x0 + S, y1: y0 + i * cs, y2: y0 + i * cs, stroke: C.grid2, 'stroke-width': 1, class: 'fade' }, A.svg);
  }
  if (unit) A.el('rect', { x: x0, y: y0 + S - unit * cs, width: unit * cs, height: unit * cs, fill: 'none', stroke: C.text, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, A.svg);
  return { x0, y0, S, cs };
}
const T_PERF = {
  id: 'perf', code: 'SR1', name: 'Perfect squares', sec: 1, q: 'Evaluate', kind: 'slots',
  gen: MODEL.genPerfect, prompt: it => (it.form === 'neg' ? '−' : '') + rt(it.n),
  slots: valSlot, check: MODEL.checkPerfect, answer: it => ({ v: Q.q(it.v) }),
  draw(A, it, V) {
    const g = tileSquare(A, it.k, it.k, 0, V, { grid: V.phase !== 'ask', dx: -40 });
    A.mtx(A.svg, g.x0 + g.S / 2, g.y0 + g.S / 2, String(it.n), { 'font-size': 40, fill: C.text });
    const side = done(V) ? String(it.k) : '?';
    A.mtx(A.svg, g.x0 + g.S / 2, g.y0 + g.S + 30, side, { 'font-size': 30, fill: done(V) ? C.green : C.yellow, class: done(V) ? 'pop' : null });
    A.mtx(A.svg, g.x0 - 30, g.y0 + g.S / 2, side, { 'font-size': 30, fill: done(V) ? C.green : C.yellow, class: done(V) ? 'pop' : null });
    if (done(V)) A.mtx(A.svg, 560, 210, (it.form === 'neg' ? '−' : '') + it.k, { 'font-size': 52, fill: C.green, class: 'pop' });
  }
};

/* SR2 between: the square ruler */
function ruler(A, lo, hi, n, V, mark) {
  const a = Math.max(0, lo - 2), b = Math.min(21, hi + 2), X = v => 70 + (v - a) / (b - a) * 500;
  A.el('line', { x1: 50, x2: 590, y1: 150, y2: 150, stroke: C.gold, 'stroke-width': 2 }, A.svg);
  A.el('line', { x1: 50, x2: 590, y1: 290, y2: 290, stroke: C.axis, 'stroke-width': 2.5 }, A.svg);
  A.tx(A.svg, 40, 118, 'n', { 'font-size': 18, fill: C.gold, 'font-style': 'italic', class: 'm' });
  A.tx(A.svg, 40, 322, '√n', { 'font-size': 18, fill: C.muted, class: 'm' });
  for (let k = a; k <= b; k++) {
    A.el('line', { x1: X(k), x2: X(k), y1: 142, y2: 158, stroke: C.gold, 'stroke-width': 2 }, A.svg);
    A.mtx(A.svg, X(k), 124, String(k * k), { 'font-size': 18, fill: C.gold });
    A.el('line', { x1: X(k), x2: X(k), y1: 280, y2: 300, stroke: C.axis, 'stroke-width': 2 }, A.svg);
    A.mtx(A.svg, X(k), 322, String(k), { 'font-size': 20 });
    A.el('line', { x1: X(k), x2: X(k), y1: 160, y2: 278, stroke: C.grid2, 'stroke-width': 1 }, A.svg);
  }
  if (mark) {
    const x = X(Math.sqrt(n));
    A.el('circle', { cx: x, cy: 150, r: 8, fill: C.yellow, class: 'pop' }, A.svg);
    A.mtx(A.svg, x, 82, String(n), { 'font-size': 26, fill: C.yellow, class: 'pop' });
    A.el('path', { d: 'M' + x + ' 160V280', stroke: C.yellow, 'stroke-width': 2, 'stroke-dasharray': '5 5', class: 'fade' }, A.svg);
    if (done(V)) {
      A.el('path', { d: 'M' + X(lo) + ' 290H' + X(hi), stroke: C.green, 'stroke-width': 8, 'stroke-linecap': 'round', class: 'draw', pathLength: 1 }, A.svg);
      A.el('circle', { cx: x, cy: 290, r: 8, fill: C.yellow, class: 'pop' }, A.svg);
      A.mtx(A.svg, 320, 372, lo + ' < √' + n + ' < ' + hi, { 'font-size': 30, fill: C.green, class: 'fade' });
    }
  }
  return X;
}
const T_BETWEEN = {
  id: 'between', code: 'SR2', name: 'Between', sec: 2, q: 'Between which whole numbers?', kind: 'slots',
  gen: MODEL.genBetween,
  slots: it => [{ k: 'a', label: 'lower whole number' }, { h: '&lt; ' + rt(it.n) + ' &lt;' }, { k: 'b', label: 'upper whole number' }],
  check: MODEL.checkBetween, answer: it => ({ a: Q.q(it.lo), b: Q.q(it.hi) }),
  draw(A, it, V) { ruler(A, it.lo, it.hi, it.n, V, V.phase !== 'ask'); }
};

/* SR2 estimate to one decimal: the tenths between, with their squares */
const T_EST = {
  id: 'est', code: 'SR2', name: 'Estimate', sec: 2, q: 'To one decimal place', kind: 'slots',
  gen: MODEL.genEst, prompt: it => rt(it.n),
  slots: () => ['≈', { k: 'v', label: 'estimate', wide: true }], check: MODEL.checkEst, answer: it => ({ v: (Math.round(it.x * 10) / 10).toFixed(1) }),
  draw(A, it, V) {
    const X = v => 70 + (v - it.lo) * 500, y = 230;
    A.el('line', { x1: 50, x2: 590, y1: y, y2: y, stroke: C.axis, 'stroke-width': 2.5 }, A.svg);
    for (let t = 0; t <= 10; t++) {
      const v = it.lo + t / 10, whole = t === 0 || t === 10;
      A.el('line', { x1: X(v), x2: X(v), y1: y - (whole ? 14 : 7), y2: y + (whole ? 14 : 7), stroke: C.axis, 'stroke-width': whole ? 2.5 : 1.2 }, A.svg);
      A.mtx(A.svg, X(v), y + 34, whole ? String(Math.round(v)) : v.toFixed(1).slice(-2), { 'font-size': whole ? 22 : 15, fill: whole ? C.text : C.tick });
      if (V.phase !== 'ask' || whole) {
        const sq = Math.round(v * v * 100) / 100, below = sq <= it.n;
        A.mtx(A.svg, X(v), y - 38 - (t % 2 ? 0 : 18), String(sq), { 'font-size': whole ? 18 : 14, fill: whole ? C.gold : (below ? C.gold : C.muted), class: whole ? null : 'fade' });
      }
    }
    A.tx(A.svg, 40, y - 60, 'x²', { 'font-size': 15, fill: C.gold, class: 'm' });
    A.mtx(A.svg, 320, 70, it.n + ' is between ' + it.lo * it.lo + ' and ' + it.hi * it.hi, { 'font-size': 22, fill: C.muted });
    const g = V.resp && V.resp.v; if (g && V.phase !== 'ask') { const gv = Q.val(g); if (gv >= it.lo - .2 && gv <= it.hi + .2) A.el('circle', { cx: X(gv), cy: y, r: 8, fill: C.yellow, stroke: C.stage, 'stroke-width': 2 }, A.svg); }
    if (done(V)) { A.el('circle', { cx: X(it.x), cy: y, r: 9, fill: C.green, stroke: C.stage, 'stroke-width': 2, class: 'pop' }, A.svg); A.mtx(A.svg, X(it.x), y + 80, '√' + it.n + ' ≈ ' + it.x.toFixed(2), { 'font-size': 24, fill: C.green, class: 'fade' }); }
  }
};

/* SR2/SR4 rational or irrational? */
const ratPrompt = it => it.kind === 'int' ? rt(it.n) : it.kind === 'frac' ? '√' + fracHTML(it.a, it.b) : rt(String(it.d));
const T_RAT = {
  id: 'rat', code: 'SR2', name: 'Rational?', sec: 2, q: 'Rational or irrational?', kind: 'choice',
  gen: MODEL.genRat, prompt: ratPrompt,
  choices: () => [{ v: 'rat', label: 'Rational' }, { v: 'irr', label: 'Irrational' }],
  check: MODEL.checkRat, answer: it => ({ v: it.rat ? 'rat' : 'irr' }),
  draw(A, it, V) {
    if (V.phase === 'ask') { A.mtx(A.svg, 320, 210, '?', { 'font-size': 90, fill: C.edge }); return; }
    if (it.kind === 'frac') {
      A.mtx(A.svg, 320, 110, '√' + it.a + ' ÷ √' + it.b, { 'font-size': 36 });
      const pa = MODEL.isSq(it.a), pb = MODEL.isSq(it.b);
      A.mtx(A.svg, 220, 190, pa ? '= ' + Math.sqrt(it.a) : '√' + it.a + ' never ends', { 'font-size': 24, fill: pa ? C.green : C.red, class: 'fade' });
      A.mtx(A.svg, 440, 190, pb ? '= ' + Math.sqrt(it.b) : '√' + it.b + ' never ends', { 'font-size': 24, fill: pb ? C.green : C.red, class: 'fade' });
    }
    const s = it.rat ? String(Math.round(it.x * 1e6) / 1e6) : it.x.toFixed(9) + '…';
    A.mtx(A.svg, 320, 280, '= ' + s, { 'font-size': 40, fill: it.rat ? C.green : C.gold, class: 'pop' });
    A.mtx(A.svg, 320, 345, it.rat ? 'ends' : 'never ends, never repeats', { 'font-size': 22, fill: C.muted, class: 'fade' });
  }
};

/* SR3 Pythagorean: squares on the three sides */
function triSquares(A, a, b, V, o) {
  const s = Math.min(560 / (a + 2 * b), 360 / (2 * a + b)), ox = 320 - (a / 2) * s, oy = 210 + (b / 2) * s - (a / 2) * s * 0;
  const P = (x, y) => [ox + x * s, oy - y * s], pts = arr => arr.map(p => P(p[0], p[1]).join(',')).join(' ');
  const sq = (arr, col, lab, labCol, cls) => {
    A.el('polygon', { points: pts(arr), fill: col, 'fill-opacity': .16, stroke: col, 'stroke-width': 2.5, class: cls || null }, A.svg);
    const cx = arr.reduce((t, p) => t + p[0], 0) / 4, cy = arr.reduce((t, p) => t + p[1], 0) / 4, [X, Y] = P(cx, cy);
    A.mtx(A.svg, X, Y, lab, { 'font-size': Math.max(18, Math.min(30, s * 2.2)), fill: labCol || col, class: cls || null });
  };
  sq([[0, 0], [a, 0], [a, -a], [0, -a]], C.blue, o.la, null);
  sq([[0, 0], [0, b], [-b, b], [-b, 0]], C.gold, o.lb, null);
  sq([[a, 0], [0, b], [b, a + b], [a + b, a]], C.green, o.lc, o.lcCol);
  A.el('polygon', { points: pts([[0, 0], [a, 0], [0, b]]), fill: C.stage, stroke: C.text, 'stroke-width': 3 }, A.svg);
  const [rx, ry] = P(0, 0), m = Math.min(14, s * a / 3);
  A.el('path', { d: 'M' + (rx + m) + ' ' + ry + 'V' + (ry - m) + 'H' + rx, stroke: C.text, 'stroke-width': 2, fill: 'none' }, A.svg);
  const [ax, ay] = P(a / 2, 0), [bx, by] = P(0, b / 2), [cx, cy] = P(a / 2, b / 2);
  A.mtx(A.svg, ax, ay - 16, o.sa, { 'font-size': 22, fill: C.blue });
  A.mtx(A.svg, bx + 18, by, o.sb, { 'font-size': 22, fill: C.gold });
  const c = Math.hypot(a, b); A.mtx(A.svg, cx - b / c * 18, cy + a / c * 18, o.sc, { 'font-size': 22, fill: C.green });
}
const T_HYP = {
  id: 'hyp', code: 'SR3', name: 'Hypotenuse', sec: 3, q: 'Hypotenuse, one decimal', kind: 'slots',
  gen: MODEL.genHyp, prompt: it => '<i>a</i> = ' + it.a + ', <i>b</i> = ' + it.b,
  slots: () => ['c =', { k: 'v', label: 'hypotenuse', wide: true }], check: MODEL.checkHyp, answer: it => ({ v: MODEL.ans1(it.c) }),
  draw(A, it, V) {
    const hint = V.phase !== 'ask', c2 = it.a * it.a + it.b * it.b;
    triSquares(A, it.a, it.b, V, { la: hint ? String(it.a * it.a) : '', lb: hint ? String(it.b * it.b) : '', lc: hint ? (done(V) ? String(c2) : '?') : '', lcCol: done(V) ? C.green : C.yellow, sa: String(it.a), sb: String(it.b), sc: done(V) ? MODEL.ans1(it.c) : 'c' });
    if (hint) A.mtx(A.svg, 112, 34, it.a * it.a + ' + ' + it.b * it.b + ' = ' + (done(V) ? c2 : '?'), { 'font-size': 22, fill: C.muted, class: 'fade' });
    if (done(V)) A.mtx(A.svg, 112, 70, 'c = √' + c2 + (MODEL.isSq(c2) ? ' = ' : ' ≈ ') + MODEL.ans1(it.c), { 'font-size': 22, fill: C.green, class: 'fade' });
  }
};
const T_LEG = {
  id: 'leg', code: 'SR3', name: 'Leg', sec: 3, q: 'Leg, one decimal', kind: 'slots',
  gen: MODEL.genLeg, prompt: it => '<i>c</i> = ' + it.c + ', <i>a</i> = ' + it.a,
  slots: () => ['b =', { k: 'v', label: 'leg', wide: true }], check: MODEL.checkLeg, answer: it => ({ v: MODEL.ans1(it.b) }),
  draw(A, it, V) {
    const hint = V.phase !== 'ask', b2 = it.c * it.c - it.a * it.a;
    triSquares(A, it.a, it.b, V, { la: hint ? String(it.a * it.a) : '', lb: hint ? (done(V) ? String(b2) : '?') : '', lc: hint ? String(it.c * it.c) : '', sa: String(it.a), sb: done(V) ? MODEL.ans1(it.b) : 'b', sc: String(it.c) });
    if (hint) A.mtx(A.svg, 112, 34, it.c * it.c + ' − ' + it.a * it.a + ' = ' + (done(V) ? b2 : '?'), { 'font-size': 22, fill: C.muted, class: 'fade' });
    if (done(V)) A.mtx(A.svg, 112, 70, 'b = √' + b2 + (MODEL.isSq(b2) ? ' = ' : ' ≈ ') + MODEL.ans1(it.b), { 'font-size': 22, fill: C.green, class: 'fade' });
  }
};

/* SR4 roots of fractions and decimals: the shaded square inside a unit square */
const T_FD = {
  id: 'fd', code: 'SR4', name: 'Fractions & decimals', sec: 4, q: 'Evaluate', kind: 'slots',
  gen: MODEL.genFD, prompt: it => it.kind === 'frac' ? '√' + fracHTML(it.p * it.p, it.q * it.q) : rt(String(it.d)),
  slots: valSlot, check: MODEL.checkFD, answer: it => ({ v: it.kind === 'frac' ? it.v : String(it.k / 10) }),
  draw(A, it, V) {
    const k = it.kind === 'frac' ? it.p : it.k, u = it.kind === 'frac' ? it.q : 10, cells = Math.max(k, u);
    const g = tileSquare(A, cells, k, u, V, { grid: V.phase !== 'ask', dx: -60 });
    const area = it.kind === 'frac' ? (it.p * it.p) + '/' + (it.q * it.q) : String(it.d);
    if (k * g.cs > 70) A.mtx(A.svg, g.x0 + k * g.cs / 2, g.y0 + g.S - k * g.cs / 2, area, { 'font-size': Math.min(30, 8 + k * g.cs / 5), fill: C.text });
    else { A.mtx(A.svg, g.x0 + k * g.cs + 40, g.y0 + g.S - k * g.cs - 30, area, { 'font-size': 22, fill: C.blue, 'text-anchor': 'start' }); A.el('path', { d: 'M' + (g.x0 + k * g.cs + 36) + ' ' + (g.y0 + g.S - k * g.cs - 24) + 'L' + (g.x0 + k * g.cs / 2 + 4) + ' ' + (g.y0 + g.S - k * g.cs / 2 - 4), stroke: C.blue, 'stroke-width': 1.5 }, A.svg); }
    A.mtx(A.svg, g.x0 + u * g.cs / 2, g.y0 + g.S - u * g.cs - 16, '1', { 'font-size': 20, fill: C.muted });
    const side = done(V) ? (it.kind === 'frac' ? it.p + '/' + it.q : String(it.k / 10)) : '?';
    A.mtx(A.svg, g.x0 + k * g.cs / 2, g.y0 + g.S + 30, side, { 'font-size': 28, fill: done(V) ? C.green : C.yellow, class: done(V) ? 'pop' : null });
    if (V.phase !== 'ask') A.mtx(A.svg, 560, 260, k + ' of ' + u + ' per side', { 'font-size': 20, fill: C.muted, class: 'fade' });
  }
};

const PAGE = {
  key: 'math9-square-roots-trainer-v1', course: 'Math 9 · Number', title: 'Square Roots',
  notes: '../notes/square-roots/math9-square-roots-notes-v1.html',
  tabs: [T_PERF, T_BETWEEN, T_EST, T_RAT, T_HYP, T_LEG, T_FD]
};
DRILL.boot(PAGE);
