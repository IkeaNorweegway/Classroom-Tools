
/* ===================== PAGE: pictures and tabs ===================== */
const { C } = DRILL;
const done = V => V.phase === 'right' || V.phase === 'show';
const lab = (A, x, y, s, col, a) => A.mtx(A.svg, x, y, s, Object.assign({ 'font-size': 20, fill: col || C.text }, a || {}));
const BOX = { x0: 70, y0: 24, w: 520, h: 340, xmin: 0, xmax: 12, ymin: 0, ymax: 100, ystep: 10, xstep: 1, labx: 2, laby: 20 };
function scatter(A, pts, col) { const P = A.plane(A.svg, BOX); pts.forEach(([x, y]) => A.el('circle', { cx: P.X(x), cy: P.Y(y), r: 6, fill: col || C.yellow, stroke: C.stage, 'stroke-width': 2 }, A.svg)); return P; }
function lineXY(A, P, m, b, a, x1, x2) {
  let lo = x1 == null ? 0 : x1, hi = x2 == null ? 12 : x2;
  if (m !== 0) { const xa = (0 - b) / m, xb = (100 - b) / m; lo = Math.max(lo, Math.min(xa, xb)); hi = Math.min(hi, Math.max(xa, xb)); }
  return A.el('path', Object.assign({ d: 'M' + P.X(lo) + ' ' + P.Y(m * lo + b) + 'L' + P.X(hi) + ' ' + P.Y(m * hi + b), stroke: C.green, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, a), A.svg);
}

/* ST1 one variable or two? */
const T_VARS = {
  id: 'vars', code: 'ST1', name: '1 or 2 variables?', sec: 1, q: 'Univariate or bivariate?', kind: 'choice',
  gen: MODEL.genVars, choices: () => [{ v: 'uni', label: 'Univariate' }, { v: 'bi', label: 'Bivariate' }],
  check: MODEL.checkVars, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    const two = it.cols.length === 2, cw = two ? 130 : 180, x0 = V.phase === 'ask' ? 320 - (two ? cw : cw / 2) : 40, y0 = 80;
    it.cols.forEach((c, j) => { A.el('rect', { x: x0 + j * cw, y: y0 - 24, width: cw - 6, height: 44, rx: 8, fill: C.panel, stroke: C.edge }, A.svg); A.tx(A.svg, x0 + j * cw + cw / 2 - 3, y0, c, { 'font-size': 14, fill: C.text }); });
    it.rows.forEach((row, i) => row.forEach((v, j) => { A.el('rect', { x: x0 + j * cw, y: y0 + 28 + i * 50, width: cw - 6, height: 44, rx: 8, fill: C.stage, stroke: C.edge }, A.svg); A.mtx(A.svg, x0 + j * cw + cw / 2 - 3, y0 + 50 + i * 50, String(v), { 'font-size': 20, fill: (it.idCol && j === 0) ? C.muted : C.yellow }); }));
    if (V.phase === 'ask') return;
    const gx = 360, gy = 330, gw = 240, gh = 230;
    A.el('path', { d: 'M' + gx + ' ' + (gy - gh) + 'V' + gy + 'H' + (gx + gw), stroke: C.axis, 'stroke-width': 2, fill: 'none', class: 'fade' }, A.svg);
    if (it.ans === 'bi') {
      const xs = it.rows.map(r => r[0]), ys = it.rows.map(r => r[1]), [x1, x2, y1, y2] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      it.rows.forEach(([x, y]) => A.el('circle', { cx: gx + 20 + (x - x1) / ((x2 - x1) || 1) * (gw - 40), cy: gy - 20 - (y - y1) / ((y2 - y1) || 1) * (gh - 40), r: 7, fill: C.yellow, class: 'pop' }, A.svg));
      lab(A, gx + gw / 2, gy + 26, 'scatter plot: 1 dot per subject', C.green, { 'font-size': 16, class: 'fade' });
    } else {
      const vals = it.rows.map(r => r[r.length - 1]), mx = Math.max(...vals);
      vals.forEach((v, i) => A.el('rect', { x: gx + 14 + i * 44, y: gy - v / mx * (gh - 20), width: 32, height: v / mx * (gh - 20), fill: C.blue, 'fill-opacity': .35, stroke: C.blue, class: 'fade' }, A.svg));
      lab(A, gx + gw / 2, gy + 26, 'one value each: bar graph', C.green, { 'font-size': 16, class: 'fade' });
    }
  }
};

/* ST2 direction */
const T_DIR = {
  id: 'dir', code: 'ST2', name: 'Direction', sec: 2, q: 'What kind of correlation?', kind: 'choice',
  gen: MODEL.genDir, choices: () => [{ v: 'pos', label: 'Positive' }, { v: 'neg', label: 'Negative' }, { v: 'none', label: 'None' }],
  check: MODEL.checkDir, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    const P = scatter(A, it.pts);
    if (V.phase === 'ask') return;
    const { m, b } = MODEL.corr(it.pts);
    if (it.ans === 'none') { A.el('rect', { x: P.X(0.5), y: P.Y(85), width: P.X(11) - P.X(.5), height: P.Y(15) - P.Y(85), fill: C.muted, 'fill-opacity': .08, stroke: C.muted, 'stroke-dasharray': '6 6', class: 'fade' }, A.svg); lab(A, P.X(6), P.Y(92), 'no trend', C.muted, { class: 'fade' }); }
    else { lineXY(A, P, m, b, { 'marker-end': 'url(#aN)', class: V.anim ? 'draw' : null, pathLength: 1 }, 0.5, 11); lab(A, P.X(10.5), P.Y(m * 10.5 + b) + (m > 0 ? 28 : -28), m > 0 ? 'up ↗' : 'down ↘', C.green, { class: 'fade' }); }
  }
};

/* ST2 strength */
const T_STR = {
  id: 'str', code: 'ST2', name: 'Strength', sec: 2, q: 'Strong or weak?', kind: 'choice',
  gen: MODEL.genStrength, choices: () => [{ v: 'strong', label: 'Strong' }, { v: 'weak', label: 'Weak' }],
  check: MODEL.checkStrength, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    const P = scatter(A, it.pts);
    if (V.phase === 'ask') return;
    const { m, b } = MODEL.corr(it.pts), sd = Math.sqrt(MODEL.sse(it.pts, m, b) / it.pts.length) * 1.6;
    A.el('path', { d: 'M' + P.X(.5) + ' ' + P.Y(m * .5 + b + sd) + 'L' + P.X(11) + ' ' + P.Y(m * 11 + b + sd) + 'L' + P.X(11) + ' ' + P.Y(m * 11 + b - sd) + 'L' + P.X(.5) + ' ' + P.Y(m * .5 + b - sd) + 'Z', fill: C.green, 'fill-opacity': .12, class: 'fade' }, A.svg);
    lineXY(A, P, m, b, { 'stroke-width': 2, 'stroke-dasharray': '6 5' }, .5, 11);
    lab(A, 560, 50, it.ans === 'strong' ? 'narrow band' : 'wide band', C.green, { 'text-anchor': 'end', class: 'fade' });
  }
};

/* ST3 which line fits best? */
const LC = [C.blue, C.gold, C.pink], LN = ['A', 'B', 'C'];
const T_FIT = {
  id: 'fit', code: 'ST3', name: 'Best fit', sec: 3, q: 'Which line fits best?', kind: 'choice',
  gen: MODEL.genFit, choices: () => LN.map((n, i) => ({ v: String(i), label: '<span style="color:' + LC[i] + '">' + n + '</span>', aria: 'line ' + n })),
  check: MODEL.checkFit, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    const P = scatter(A, it.pts);
    it.lines.forEach((L, i) => {
      const best = String(i) === it.ans && V.phase !== 'ask';
      lineXY(A, P, L.m, L.b, { stroke: best ? C.green : LC[i], 'stroke-width': best ? 4 : 2.5, opacity: V.phase !== 'ask' && !best ? .55 : 1 });
      const xe = 11.4, ye = Math.max(4, Math.min(96, L.m * xe + L.b));
      lab(A, P.X(xe) + 12, P.Y(ye), LN[i], best ? C.green : LC[i], { 'font-size': 22 });
      if (V.phase !== 'ask') {
        const above = it.pts.filter(([x, y]) => y > L.m * x + L.b).length, below = it.pts.length - above;
        lab(A, 600, 40 + i * 28, LN[i] + ': ' + above + ' above, ' + below + ' below', best ? C.green : LC[i], { 'text-anchor': 'end', 'font-size': 16, class: 'fade' });
      }
    });
  }
};

/* ST4 read a prediction */
const T_PRED = {
  id: 'pred', code: 'ST4', name: 'Predict', sec: 4, q: it => 'Use the line: y when x = ' + it.x, kind: 'slots',
  gen: MODEL.genPredict, slots: () => ['y ≈', { k: 'v', label: 'y', wide: true }], check: MODEL.checkPredict, answer: it => ({ v: String(Math.round(it.v)) }),
  draw(A, it, V) {
    const P = scatter(A, it.pts, C.muted);
    lineXY(A, P, it.m, it.b, {}, 0, 12);
    A.el('line', { x1: P.X(it.x), x2: P.X(it.x), y1: P.Y(0), y2: P.Y(it.v), stroke: C.yellow, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, A.svg);
    lab(A, P.X(it.x), P.Y(0) + 34, 'x = ' + it.x, C.yellow, { 'font-size': 18 });
    if (V.phase === 'ask') return;
    A.el('circle', { cx: P.X(it.x), cy: P.Y(it.v), r: 7, fill: C.yellow, class: 'pop' }, A.svg);
    A.el('line', { x1: P.X(it.x), x2: P.X(0), y1: P.Y(it.v), y2: P.Y(it.v), stroke: C.yellow, 'stroke-width': 2.5, 'stroke-dasharray': '6 5', class: 'fade' }, A.svg);
    if (done(V)) lab(A, P.X(0) + 30, P.Y(it.v) - 16, '≈ ' + Math.round(it.v), C.green, { 'font-size': 22, class: 'pop' });
  }
};

/* ST4 interpolation or extrapolation */
const T_RANGE = {
  id: 'range', code: 'ST4', name: 'Inside or outside?', sec: 4, q: it => 'Predicting at x = ' + it.x + ' is…', kind: 'choice',
  gen: MODEL.genRange, choices: () => [{ v: 'inter', label: 'Interpolation' }, { v: 'extra', label: 'Extrapolation' }],
  check: MODEL.checkRange, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    const P = A.plane(A.svg, BOX);
    if (V.phase !== 'ask') { A.el('rect', { x: P.X(it.lo), y: P.Y(100), width: P.X(it.hi) - P.X(it.lo), height: P.Y(0) - P.Y(100), fill: C.green, 'fill-opacity': .1, class: 'fade' }, A.svg); lab(A, (P.X(it.lo) + P.X(it.hi)) / 2, P.Y(96), 'data', C.green, { class: 'fade' }); }
    lineXY(A, P, it.m, it.b, { 'stroke-width': 2, opacity: .7 }, 0, 12);
    it.pts.forEach(([x, y]) => A.el('circle', { cx: P.X(x), cy: P.Y(y), r: 6, fill: C.yellow, stroke: C.stage, 'stroke-width': 2 }, A.svg));
    A.el('line', { x1: P.X(it.x), x2: P.X(it.x), y1: P.Y(0), y2: P.Y(100), stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, A.svg);
    lab(A, P.X(it.x), P.Y(0) + 34, 'x = ' + it.x, C.blue, { 'font-size': 18 });
  }
};

const PAGE = {
  key: 'math9-statistics-trainer-v1', course: 'Math 9 · Statistics & Probability', title: 'Statistics',
  notes: '../notes/statistics/math9-statistics-notes-v1.html',
  tabs: [T_VARS, T_DIR, T_STR, T_FIT, T_PRED, T_RANGE]
};
DRILL.boot(PAGE);
