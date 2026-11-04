
/* ===================== PAGE: pictures and tabs ===================== */
const { C, fracHTML } = DRILL;
const done = V => V.phase === 'right' || V.phase === 'show';
const F = MODEL.ans1;
const lab = (A, x, y, s, col, a) => A.mtx(A.svg, x, y, s, Object.assign({ 'font-size': 20, fill: col || C.text }, a || {}));
const poly = (A, pts, a) => A.el('polygon', Object.assign({ points: pts.map(p => p.join(',')).join(' '), 'stroke-linejoin': 'round' }, a), A.svg);
// A triangle from its three sides: A at origin, B along the x-axis, C above.
function triPts(ab, bc, ca) { const x = (ab * ab + ca * ca - bc * bc) / (2 * ab), y = Math.sqrt(Math.max(.01, ca * ca - x * x)); return [[0, 0], [ab, 0], [x, y]]; }
function triFromAngles(ab, A1, B1) { const a = A1 * Math.PI / 180, b = B1 * Math.PI / 180, ca = ab * Math.sin(b) / Math.sin(a + b); return [[0, 0], [ab, 0], [ca * Math.cos(a), ca * Math.sin(a)]]; }
// Draw a triangle (math coords) at x0, y0 (bottom-left) with scale s. Returns screen points.
function drawTri(A, pts, x0, y0, s, cols, labels, names) {
  const P = pts.map(p => [x0 + p[0] * s, y0 - p[1] * s]);
  poly(A, P, { fill: C.blue, 'fill-opacity': .08, stroke: 'none' });
  [[0, 1], [1, 2], [2, 0]].forEach(([i, j], k) => {
    A.el('line', { x1: P[i][0], y1: P[i][1], x2: P[j][0], y2: P[j][1], stroke: cols[k], 'stroke-width': 3.5, 'stroke-linecap': 'round' }, A.svg);
    if (labels && labels[k] != null) {
      const m = [(P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2], cx = (P[0][0] + P[1][0] + P[2][0]) / 3, cy = (P[0][1] + P[1][1] + P[2][1]) / 3;
      const dx = m[0] - cx, dy = m[1] - cy, d = Math.hypot(dx, dy) || 1;
      lab(A, m[0] + dx / d * 20, m[1] + dy / d * 20, labels[k], cols[k], { 'font-size': 19 });
    }
  });
  if (names) names.forEach((n, i) => { const cx = (P[0][0] + P[1][0] + P[2][0]) / 3, cy = (P[0][1] + P[1][1] + P[2][1]) / 3, dx = P[i][0] - cx, dy = P[i][1] - cy, d = Math.hypot(dx, dy) || 1; lab(A, P[i][0] + dx / d * 18, P[i][1] + dy / d * 18, n, C.muted, { 'font-size': 17, 'font-style': 'italic' }); });
  return P;
}
function angleArc(A, P, i, lab_, col) {
  const V = P[i], a = P[(i + 1) % 3], b = P[(i + 2) % 3], a1 = Math.atan2(a[1] - V[1], a[0] - V[0]), a2 = Math.atan2(b[1] - V[1], b[0] - V[0]);
  let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
  const r = 24, s = [V[0] + r * Math.cos(a1), V[1] + r * Math.sin(a1)], e = [V[0] + r * Math.cos(a1 + d), V[1] + r * Math.sin(a1 + d)];
  A.el('path', { d: 'M' + s + 'A' + r + ' ' + r + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + e, stroke: col || C.yellow, 'stroke-width': 3, fill: 'none' }, A.svg);
  if (lab_) { const m = a1 + d / 2; lab(A, V[0] + 44 * Math.cos(m), V[1] + 44 * Math.sin(m), lab_, col || C.yellow, { 'font-size': 16 }); }
}
const COLS = [C.blue, C.gold, C.teal];

/* SI1 proportion */
const T_PROP = {
  id: 'prop', code: 'SI1', name: 'Proportion', sec: 1, q: 'Solve for x', kind: 'slots',
  gen: MODEL.genProp,
  prompt: it => it.form === 'num' ? fracHTML(it.a, it.b) + ' = ' + fracHTML('<i>x</i>', it.d) : fracHTML(it.a, it.b) + ' = ' + fracHTML(it.c, '<i>x</i>'),
  slots: () => ['x =', { k: 'v', label: 'x', wide: true }], check: MODEL.checkProp, answer: it => ({ v: F(it.v) }),
  draw(A, it, V) {
    const hint = V.phase !== 'ask', k = it.form === 'num' ? it.d / it.b : it.c / it.a, top2 = it.form === 'num' ? (done(V) ? F(it.v) : 'x') : String(it.c), bot2 = it.form === 'num' ? String(it.d) : (done(V) ? F(it.v) : 'x');
    const cell = (x, y, s, col) => { A.el('rect', { x: x - 50, y: y - 32, width: 100, height: 64, rx: 12, fill: C.stage, stroke: col || C.edge, 'stroke-width': 2 }, A.svg); lab(A, x, y + 2, s, col || C.text, { 'font-size': 30 }); };
    cell(200, 150, String(it.a), C.blue); cell(200, 270, String(it.b), C.gold); cell(440, 150, top2, it.form === 'num' ? C.yellow : C.blue); cell(440, 270, bot2, it.form === 'num' ? C.gold : C.yellow);
    if (!hint) return;
    const known = it.form === 'num' ? 270 : 150, other = it.form === 'num' ? 150 : 270;
    [known, other].forEach((y, i) => { if (i && !done(V)) return; A.el('path', { d: 'M256 ' + y + 'H382', stroke: C.green, 'stroke-width': 2.5, 'marker-end': 'url(#aN)', class: 'fade' }, A.svg); lab(A, 320, y - 16, '× ' + F(k), C.green, { class: 'fade' }); });
    if (!done(V)) lab(A, 320, other - 16, '× same', C.muted, { class: 'fade' });
  }
};

/* SI1 scale factor */
const T_SCALE = {
  id: 'scale', code: 'SI1', name: 'Scale factor', sec: 1, q: it => it.form === 'k' ? 'Scale factor k' : it.form === 'img' ? 'Length on the image' : 'Length on the original', kind: 'slots',
  gen: MODEL.genScale, slots: it => [it.form === 'k' ? 'k =' : '=', { k: 'v', label: 'answer', wide: true }], check: MODEL.checkScale, answer: it => ({ v: F(it.v) }),
  draw(A, it, V) {
    const s = 240 / Math.max(it.o, it.i), w1 = it.o * s, w2 = it.i * s, y = 270;
    A.el('rect', { x: 60, y: y - w1 * .6, width: w1, height: w1 * .6, fill: C.muted, 'fill-opacity': .15, stroke: C.muted, 'stroke-width': 2.5 }, A.svg);
    A.el('rect', { x: 340, y: y - w2 * .6, width: w2, height: w2 * .6, fill: C.blue, 'fill-opacity': .18, stroke: C.blue, 'stroke-width': 2.5 }, A.svg);
    lab(A, 60 + w1 / 2, y + 26, it.form === 'orig' && !done(V) ? '?' : String(it.o), C.muted); lab(A, 340 + w2 / 2, y + 26, it.form === 'img' && !done(V) ? '?' : F(it.i), C.blue);
    lab(A, 60 + w1 / 2, 340, 'original', C.muted, { 'font-size': 16 }); lab(A, 340 + w2 / 2, 340, 'image', C.blue, { 'font-size': 16 });
    A.el('path', { d: 'M' + (60 + w1 / 2) + ' 80Q320 56 ' + (340 + w2 / 2) + ' 80', stroke: C.gold, 'stroke-width': 2.5, fill: 'none', 'marker-end': 'url(#aG)' }, A.svg);
    lab(A, 320, 34, '× ' + (it.form === 'k' && !done(V) ? 'k' : F(it.k)), C.gold, { 'font-size': 24 });
    if (V.phase !== 'ask') lab(A, 320, 390, 'image = k × original', C.muted, { class: 'fade' });
  }
};

/* SI2 missing side */
const T_SIDE = {
  id: 'side', code: 'SI2', name: 'Missing side', sec: 2, q: it => '△ABC ~ △DEF. Find ' + it.ask, kind: 'slots',
  gen: MODEL.genSide, slots: it => [it.ask + ' =', { k: 'v', label: it.ask, wide: true }], check: MODEL.checkSide, answer: it => ({ v: F(it.v) }),
  draw(A, it, V) {
    const pts = triPts(it.AB, it.BC, it.CA), big = Math.max(1, it.k), maxW = Math.max(it.AB, pts[2][0]) - Math.min(0, pts[2][0]), maxH = pts[2][1];
    const s = Math.min(230 / (maxW * big), 260 / (maxH * big), 230 / maxW);
    drawTri(A, pts, 50 - Math.min(0, pts[2][0]) * s, 330, s, COLS, [String(it.AB), String(it.BC), String(it.CA)], ['A', 'B', 'C']);
    const p2 = pts.map(p => [p[0] * it.k, p[1] * it.k]), ask = it.ask === 'EF' ? 1 : 2;
    const L2 = [F(it.DE), ask === 1 ? (done(V) ? F(it.v) : '?') : null, ask === 2 ? (done(V) ? F(it.v) : '?') : null];
    drawTri(A, p2, 340 - Math.min(0, p2[2][0]) * s, 330, s, COLS, L2, ['D', 'E', 'F']);
    if (V.phase !== 'ask') lab(A, 320, 386, 'k = DE ÷ AB = ' + F(it.DE) + ' ÷ ' + it.AB + ' = ' + F(it.k), C.green, { class: 'fade' });
  }
};

/* SI2 congruent, similar, neither */
const T_SIM = {
  id: 'sim', code: 'SI2', name: 'Similar?', sec: 2, q: 'Congruent, similar or neither?', kind: 'choice',
  gen: MODEL.genSim, choices: () => [{ v: 'cong', label: 'Congruent' }, { v: 'sim', label: 'Similar' }, { v: 'neither', label: 'Neither' }],
  check: MODEL.checkSim, answer: it => ({ v: it.kind }),
  draw(A, it, V) {
    const big = Math.max(...it.a, ...it.b), s = 200 / big;
    if (it.shape === 'rect') {
      [[it.a, 60, C.muted], [it.b, 340, C.blue]].forEach(([d, x, col]) => { A.el('rect', { x, y: 300 - d[1] * s, width: d[0] * s, height: d[1] * s, fill: col, 'fill-opacity': .15, stroke: col, 'stroke-width': 2.5 }, A.svg); lab(A, x + d[0] * s / 2, 324, F(d[0]), col); lab(A, x - 18, 300 - d[1] * s / 2, F(d[1]), col); });
    } else {
      const p1 = triPts(...it.a), p2 = triPts(...it.b), s2 = Math.min(s, 240 / Math.max(it.a[0], it.b[0]));
      drawTri(A, p1, 50, 300, s2, [C.muted, C.muted, C.muted], it.a.map(F)); drawTri(A, p2, 330, 300, s2, [C.blue, C.blue, C.blue], it.b.map(F));
    }
    if (V.phase === 'ask') return;
    const rs = it.b.map((x, i) => x / it.a[i]), same = rs.every(r => Math.abs(r - rs[0]) < 1e-9);
    rs.forEach((r, i) => lab(A, 320, 40 + i * 30, F(it.b[i]) + ' ÷ ' + F(it.a[i]) + ' = ' + F(r), Math.abs(r - rs[0]) < 1e-9 ? (same ? C.green : C.text) : C.red, { 'font-size': 18, class: 'fade' }));
  }
};

/* SI3 which test? */
const T_RULE = {
  id: 'rule', code: 'SI3', name: 'Which rule?', sec: 3, q: 'Which shows they are similar?', kind: 'choice',
  gen: MODEL.genRule, choices: () => [{ v: 'AA', label: 'AA' }, { v: 'SSS', label: 'SSS' }, { v: 'SAS', label: 'SAS' }, { v: 'none', label: 'Not enough' }],
  check: MODEL.checkRule, answer: it => ({ v: it.rule }),
  draw(A, it, V) {
    // side k joins vertex k and k + 1 (AB, BC, CA); vertex v sits between sides v + 2 and v
    const base = it.rule === 'AA' ? triFromAngles(5, it.A1, it.B1) : triPts(...it.s), k = it.k;
    const len = (P, i) => Math.hypot(P[(i + 1) % 3][0] - P[i][0], P[(i + 1) % 3][1] - P[i][1]);
    const ang = (P, i) => { const a = P[(i + 1) % 3], b = P[(i + 2) % 3], u = [a[0] - P[i][0], a[1] - P[i][1]], w = [b[0] - P[i][0], b[1] - P[i][1]]; return Math.round(Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))) * 180 / Math.PI); };
    // the copy: scaled, turned, maybe flipped, then moved so its lowest-left corner is at the origin
    const t = it.rot * Math.PI / 180, raw = base.map(([x, y]) => { const X = (it.flip ? -x : x) * k, Y = y * k; return [X * Math.cos(t) - Y * Math.sin(t), X * Math.sin(t) + Y * Math.cos(t)]; });
    const mx = Math.min(...raw.map(p => p[0])), my = Math.min(...raw.map(p => p[1])), p2 = raw.map(([x, y]) => [x - mx, y - my]);
    const size = P => Math.max(Math.max(...P.map(p => p[0])) - Math.min(...P.map(p => p[0])), Math.max(...P.map(p => p[1])) - Math.min(...P.map(p => p[1])));
    const s = Math.min(220 / size(base), 220 / size(p2)), bx = -Math.min(0, ...base.map(p => p[0]));
    const v = it.v, keep = [0, 1, 2].map(i => it.rule === 'SSS' || ((it.rule === 'SAS' || it.rule === 'none') && (i === v || i === (v + 2) % 3)));
    const L1 = [0, 1, 2].map(i => keep[i] && it.rule !== 'AA' ? F(len(base, i)) : null), L2 = [0, 1, 2].map(i => keep[i] && it.rule !== 'AA' ? F(len(base, i) * k) : null);
    const P1 = drawTri(A, base, 50 + bx * s, 330, s, [C.muted, C.muted, C.muted], L1, ['A', 'B', 'C']), P2 = drawTri(A, p2, 340, 330, s, [C.blue, C.blue, C.blue], L2, ['D', 'E', 'F']);
    if (it.rule === 'SAS' || it.rule === 'none') { const w = it.rule === 'SAS' ? v : (v + 1) % 3; angleArc(A, P1, w, ang(base, w) + '°'); angleArc(A, P2, w, ang(base, w) + '°'); }
    if (it.rule === 'AA') { [v, (v + 1) % 3].forEach((w, j) => { angleArc(A, P1, w, ang(base, w) + '°', j ? C.teal : null); angleArc(A, P2, w, ang(base, w) + '°', j ? C.teal : null); }); }
    if (V.phase !== 'ask') lab(A, 320, 390, { AA: '2 angles equal', SSS: '3 side ratios equal', SAS: '2 side ratios + the angle between', none: 'the angle is not between the sides' }[it.rule], C.green, { class: 'fade' });
  }
};

/* SI4 shadows */
const T_SHADOW = {
  id: 'shadow', code: 'SI4', name: 'Shadows', sec: 4, q: 'Height of the tree (m, one decimal)', kind: 'slots',
  gen: MODEL.genShadow, slots: () => ['H =', { k: 'v', label: 'height', wide: true }], check: MODEL.checkShadow, answer: it => ({ v: F(Math.round(it.v * 10) / 10) }),
  draw(A, it, V) {
    const H = it.v, s = Math.min(280 / H, 220 / it.S, 120 / it.s), g = 350, x1 = 60, x2 = 320;
    A.el('line', { x1: 30, x2: 620, y1: g, y2: g, stroke: C.axis, 'stroke-width': 2 }, A.svg);
    const tri = (x, h, sh, col) => { poly(A, [[x, g], [x, g - h * s], [x + sh * s, g]], { fill: col, 'fill-opacity': V.phase !== 'ask' ? .2 : .05, stroke: 'none' }); A.el('line', { x1: x, x2: x, y1: g, y2: g - h * s, stroke: col, 'stroke-width': 5 }, A.svg); A.el('line', { x1: x, x2: x + sh * s, y1: g + 6, y2: g + 6, stroke: C.muted, 'stroke-width': 5 }, A.svg); A.el('line', { x1: x, x2: x + sh * s, y1: g - h * s, y2: g, stroke: C.yellow, 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }, A.svg); };
    tri(x1, it.h, it.s, C.gold); tri(x2, H, it.S, C.green);
    A.el('circle', { cx: x2, cy: g - H * s - 10, r: 18, fill: C.green, 'fill-opacity': .4 }, A.svg);
    A.tx(A.svg, x1 - 8, g - it.h * s / 2, it.h + ' m', { fill: C.gold, 'text-anchor': 'end', 'font-size': 18 }); A.tx(A.svg, x1 + it.s * s / 2, g + 28, it.s + ' m', { fill: C.muted, 'font-size': 18 });
    A.tx(A.svg, x2 - 10, g - H * s / 2, done(V) ? F(Math.round(H * 10) / 10) + ' m' : 'H', { fill: done(V) ? C.green : C.yellow, 'text-anchor': 'end', 'font-size': 20 }); A.tx(A.svg, x2 + it.S * s / 2, g + 28, it.S + ' m', { fill: C.muted, 'font-size': 18 });
    A.tx(A.svg, 600, 40, '☀', { 'font-size': 40, fill: C.yellow, stroke: 'none' });
    if (V.phase !== 'ask') lab(A, 600, 90, 'H ÷ ' + it.S + ' = ' + it.h + ' ÷ ' + it.s, C.muted, { 'text-anchor': 'end', class: 'fade' });
  }
};

/* SI4 map scale */
const T_MAP = {
  id: 'map', code: 'SI4', name: 'Map scale', sec: 4, q: 'Real length in metres', kind: 'slots',
  gen: MODEL.genMap, prompt: it => '1 : ' + it.n.toLocaleString('en-CA'),
  slots: () => ['=', { k: 'v', label: 'metres', wide: true }, { h: '<span style="font-family:inherit">m</span>' }], check: MODEL.checkMap, answer: it => ({ v: F(it.v) }),
  draw(A, it, V) {
    const cm = 38;
    A.el('rect', { x: 40, y: 40, width: 560, height: 240, rx: 14, fill: '#0f1a14', stroke: C.edge }, A.svg);
    A.el('path', { d: 'M80 220C180 120 260 260 360 160S520 120 ' + (80 + it.m * cm > 560 ? 560 : 80 + it.m * cm) + ' 110', stroke: C.muted, 'stroke-width': 2, fill: 'none', opacity: .3 }, A.svg);
    const len = it.m * cm, x0 = 320 - len / 2;
    A.el('line', { x1: x0, x2: x0 + len, y1: 160, y2: 160, stroke: C.yellow, 'stroke-width': 5, 'stroke-linecap': 'round' }, A.svg);
    lab(A, 320, 136, it.m + ' cm on the map', C.yellow);
    for (let i = 0; i <= 4; i++) { A.el('line', { x1: 80 + i * cm, x2: 80 + i * cm, y1: 250, y2: 262, stroke: C.text, 'stroke-width': 2 }, A.svg); }
    A.el('line', { x1: 80, x2: 80 + 4 * cm, y1: 262, y2: 262, stroke: C.text, 'stroke-width': 2 }, A.svg); lab(A, 80 + 2 * cm, 240, '0 – 4 cm', C.muted, { 'font-size': 14 });
    if (V.phase === 'ask') return;
    A.tx(A.svg, 320, 320, '1 cm on the map = ' + it.n.toLocaleString('en-CA') + ' cm = ' + F(it.n / 100) + ' m', { fill: C.muted, 'font-size': 20, class: 'fade' });
    if (done(V)) A.tx(A.svg, 320, 362, it.m + ' × ' + F(it.n / 100) + ' = ' + F(it.v) + ' m', { fill: C.green, 'font-size': 24, class: 'fade' });
  }
};

const PAGE = {
  key: 'math9-similarity-trainer-v1', course: 'Math 9 · Measurement & Geometry', title: 'Similarity & Scale',
  notes: '../notes/similarity/math9-similarity-notes-v1.html',
  tabs: [T_PROP, T_SCALE, T_SIDE, T_SIM, T_RULE, T_SHADOW, T_MAP]
};
DRILL.boot(PAGE);
