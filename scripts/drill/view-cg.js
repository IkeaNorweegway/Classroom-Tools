
/* ===================== PAGE: pictures and tabs ===================== */
const { C } = DRILL;
const done = V => V.phase === 'right' || V.phase === 'show';
const rad = d => d * Math.PI / 180;
function circle(A, cx, cy, R) {
  A.el('circle', { cx, cy, r: R, fill: 'none', stroke: C.blue, 'stroke-width': 3 }, A.svg);
  A.el('circle', { cx, cy, r: 5, fill: C.text }, A.svg);
  A.tx(A.svg, cx + 14, cy - 14, "O", { 'font-size': 18, fill: C.muted, 'font-style': 'italic', class: 'm' });
  return a => [cx + R * Math.cos(rad(a)), cy - R * Math.sin(rad(a))];
}
const seg = (A, p, q, col, w, a) => A.el('line', Object.assign({ x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: col, 'stroke-width': w || 3, 'stroke-linecap': 'round' }, a || {}), A.svg);
const pt = (A, p, col, lab, off) => { A.el('circle', { cx: p[0], cy: p[1], r: 6, fill: col || C.text, stroke: C.stage, 'stroke-width': 2 }, A.svg); if (lab) A.tx(A.svg, p[0] + (off ? off[0] : 0), p[1] + (off ? off[1] : -16), lab, { 'font-size': 18, fill: C.muted, 'font-style': 'italic', class: 'm' }); };
function rightMark(A, at, u, v, s) { s = s || 14; const p1 = [at[0] + u[0] * s, at[1] + u[1] * s], p2 = [p1[0] + v[0] * s, p1[1] + v[1] * s], p3 = [at[0] + v[0] * s, at[1] + v[1] * s]; A.el('path', { d: 'M' + p1 + 'L' + p2 + 'L' + p3, stroke: C.text, 'stroke-width': 2, fill: 'none' }, A.svg); }
// Angle mark at vertex V between rays to P and Q (the smaller turn), with a label.
function angleMark(A, Vx, P, Q, r, col, lab, cls) {
  let a1 = Math.atan2(-(P[1] - Vx[1]), P[0] - Vx[0]), a2 = Math.atan2(-(Q[1] - Vx[1]), Q[0] - Vx[0]);
  let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
  const s = [Vx[0] + r * Math.cos(a1), Vx[1] - r * Math.sin(a1)], e = [Vx[0] + r * Math.cos(a1 + d), Vx[1] - r * Math.sin(a1 + d)];
  A.el('path', { d: 'M' + s + 'A' + r + ' ' + r + ' 0 0 ' + (d > 0 ? 0 : 1) + ' ' + e, stroke: col, 'stroke-width': 3, fill: 'none', class: cls || null }, A.svg);
  const m = a1 + d / 2, L = r + 22;
  if (lab != null) A.mtx(A.svg, Vx[0] + L * Math.cos(m), Vx[1] - L * Math.sin(m), lab, { 'font-size': 20, fill: col, class: cls || null });
}
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

/* CG1 name the part */
const NAMES = { radius: 'Radius', diameter: 'Diameter', chord: 'Chord', tangent: 'Tangent' };
const T_NAME = {
  id: 'name', code: 'CG1', name: 'Name it', sec: 1, q: 'The yellow part is a…', kind: 'choice',
  gen: MODEL.genName,
  choices: () => MODEL.KINDS.map(k => ({ v: k, label: NAMES[k] })),
  check: MODEL.checkName, answer: it => ({ v: it.kind }),
  draw(A, it, V) {
    const cx = 300, cy = 215, R = 150, P = circle(A, cx, cy, R), O = [cx, cy];
    let p, q;
    if (it.kind === 'radius') { p = O; q = P(it.a); }
    else if (it.kind === 'diameter') { p = P(it.a); q = P(it.a + 180); }
    else if (it.kind === 'chord') { p = P(it.a); q = P(it.a + it.span); }
    else { const T = P(it.a), u = [-Math.sin(rad(it.a)), -Math.cos(rad(it.a))]; p = [T[0] - u[0] * 150, T[1] - u[1] * 150]; q = [T[0] + u[0] * 150, T[1] + u[1] * 150]; }
    seg(A, p, q, C.yellow, 5);
    if (it.kind !== 'tangent') { if (it.kind !== 'radius') pt(A, p, C.yellow); pt(A, q, C.yellow); } else pt(A, P(it.a), C.yellow);
    if (V.phase === 'ask') return;
    if (it.kind === 'chord') { const M = mid(p, q); seg(A, O, M, C.muted, 2, { 'stroke-dasharray': '5 5', class: 'fade' }); A.mtx(A.svg, (O[0] + M[0]) / 2 + 14, (O[1] + M[1]) / 2, 'misses O', { 'font-size': 16, fill: C.muted, 'text-anchor': 'start', class: 'fade' }); }
    if (it.kind === 'diameter') A.el('circle', { cx, cy, r: 13, fill: 'none', stroke: C.green, 'stroke-width': 3, class: 'pop' }, A.svg);
    if (it.kind === 'radius') A.el('circle', { cx, cy, r: 13, fill: 'none', stroke: C.green, 'stroke-width': 3, class: 'pop' }, A.svg);
    if (it.kind === 'tangent') { const T = P(it.a); seg(A, O, T, C.muted, 2, { 'stroke-dasharray': '5 5', class: 'fade' }); const ur = [(O[0] - T[0]) / R, (O[1] - T[1]) / R], ut = [-ur[1], ur[0]]; rightMark(A, T, ur, ut); }
    A.mtx(A.svg, 560, 60, NAMES[it.kind], { 'font-size': 30, fill: C.green, class: 'pop' });
  }
};

/* CG2 chords */
const T_CHORD = {
  id: 'chord', code: 'CG2', name: 'Chords', sec: 2, q: it => ({ chord: 'Length of the chord', dist: 'Distance from the centre', radius: 'The radius' })[it.form] + ' (one decimal)', kind: 'slots',
  gen: MODEL.genChord,
  slots: () => ['=', { k: 'v', label: 'answer', wide: true }], check: MODEL.checkChord, answer: it => ({ v: MODEL.ans1(it.v) }),
  draw(A, it, V) {
    const cx = 280, cy = 170, R = 150, s = R / it.r, hint = V.phase !== 'ask';
    circle(A, cx, cy, R);
    const y = cy + it.d * s, L = [cx - it.h * s, y], Rt = [cx + it.h * s, y], M = [cx, y], O = [cx, cy];
    if (hint) A.el('polygon', { points: [O, M, Rt].map(p => p.join(',')).join(' '), fill: C.gold, 'fill-opacity': .18, class: 'fade' }, A.svg);
    seg(A, L, Rt, C.yellow, 4); seg(A, O, M, C.teal, 3); seg(A, O, Rt, C.gold, 3);
    rightMark(A, M, [0, -1], [1, 0]);
    pt(A, L, C.yellow); pt(A, Rt, C.yellow);
    const show = k => done(V) || it.form !== k;
    A.mtx(A.svg, (O[0] + Rt[0]) / 2 + 16, (O[1] + Rt[1]) / 2 - 12, 'r = ' + (show('radius') ? MODEL.ans1(it.r) : '?'), { 'font-size': 20, fill: C.gold, 'text-anchor': 'start' });
    A.mtx(A.svg, cx - 16, Math.max((cy + y) / 2, cy + 22), "d = " + (show('dist') ? MODEL.ans1(it.d) : '?'), { 'font-size': 20, fill: C.teal, 'text-anchor': 'end' });
    A.mtx(A.svg, cx, y + 28, 'chord = ' + (show('chord') ? MODEL.ans1(2 * it.h) : '?'), { 'font-size': 20, fill: C.yellow });
    if (hint && it.form !== 'chord') A.mtx(A.svg, (M[0] + Rt[0]) / 2, y - 16, MODEL.ans1(it.h), { 'font-size': 18, fill: C.gold, class: 'fade' });
    if (hint) A.mtx(A.svg, 610, 390, "r² = d² + (½ chord)²", { 'font-size': 20, fill: C.muted, 'text-anchor': 'end', class: 'fade' });
  }
};

/* CG3 inscribed and central angles */
const T_ANGLE = {
  id: 'angle', code: 'CG3', name: 'Angles', sec: 3, q: 'Find the angle marked ?', kind: 'slots',
  gen: MODEL.genAngle,
  slots: () => ['=', { k: 'v', label: 'degrees' }, '°'], check: MODEL.checkAngle, answer: it => ({ v: Q.q(it.v) }),
  draw(A, it, V) {
    const cx = 300, cy = 215, R = 150, P = circle(A, cx, cy, R), O = [cx, cy];
    const c = it.form === 'diam' ? 180 : it.c, a0 = it.start, Ap = P(a0), Bp = P(a0 + c), Pp = P(a0 + c + (360 - c) / 2), Qp = P(a0 + c + (360 - c) * 0.25);
    const hint = V.phase !== 'ask';
    seg(A, Pp, Ap, C.text, 2.5); seg(A, Pp, Bp, C.text, 2.5);
    pt(A, Ap, C.text, 'A', [Ap[0] < cx ? -16 : 16, Ap[1] < cy ? -14 : 18]); pt(A, Bp, C.text, 'B', [Bp[0] < cx ? -16 : 16, Bp[1] < cy ? -14 : 18]); pt(A, Pp, C.text, 'P', [0, Pp[1] < cy ? -18 : 22]);
    const iv = it.c / 2, ins = it.form === 'toIns' || it.form === 'diam' ? (done(V) ? it.v + '°' : '?') : iv + '°';
    if (it.form === 'diam') { seg(A, Ap, Bp, C.gold, 3); if (hint) A.mtx(A.svg, cx, cy - 26, '180°', { 'font-size': 20, fill: C.gold, class: 'fade' }); }
    else if (it.form !== 'same' || hint) {
      seg(A, O, Ap, C.gold, 3); seg(A, O, Bp, C.gold, 3);
      angleMark(A, O, Ap, Bp, 30, C.gold, it.form === 'toCen' ? (done(V) ? it.c + '°' : '?') : it.c + '°', it.form === 'same' ? 'fade' : null);
    }
    angleMark(A, Pp, Ap, Bp, 34, C.yellow, it.form === 'same' ? iv + '°' : ins);
    if (it.form === 'same') { seg(A, Qp, Ap, C.teal, 2.5); seg(A, Qp, Bp, C.teal, 2.5); pt(A, Qp, C.teal, 'Q', [Qp[0] < cx ? -16 : 16, -12]); angleMark(A, Qp, Ap, Bp, 34, C.teal, done(V) ? it.v + '°' : '?'); }
    if (hint) A.mtx(A.svg, 600, 380, it.form === 'diam' ? '½ × 180° = 90°' : it.form === 'same' ? 'same arc AB, same angle' : 'inscribed = ½ × central', { 'font-size': 20, fill: C.muted, 'text-anchor': 'end', class: 'fade' });
  }
};

/* CG4 tangent and radius */
const T_TAN = {
  id: 'tan', code: 'CG4', name: 'Tangent', sec: 4, q: it => it.form === 'ang' ? 'Find the angle at P' : it.form === 'len' ? 'Length of the tangent PT (one decimal)' : 'Distance OP (one decimal)', kind: 'slots',
  gen: MODEL.genTan,
  slots: it => it.form === 'ang' ? ['=', { k: 'v', label: 'degrees' }, '°'] : ['=', { k: 'v', label: 'length', wide: true }],
  check: MODEL.checkTan, answer: it => ({ v: it.form === 'ang' ? Q.q(it.v) : MODEL.ans1(it.v) }),
  draw(A, it, V) {
    const r = it.form === 'ang' ? 5 : it.r, t = it.form === 'ang' ? 5 * Math.tan(rad(it.x)) : it.t, o = Math.hypot(r, t);
    const s = Math.min(130 / r, 380 / (r + t)), O = [150, 230], th = rad(100 + (it.a % 30) - 15);
    const T = [O[0] + r * s * Math.cos(th), O[1] - r * s * Math.sin(th)], ut = [Math.sin(th), Math.cos(th)];
    const Pp = [T[0] + ut[0] * t * s, T[1] + ut[1] * t * s];
    A.el('circle', { cx: O[0], cy: O[1], r: r * s, fill: 'none', stroke: C.blue, 'stroke-width': 3 }, A.svg);
    pt(A, O, C.text, 'O', [-14, 18]);
    seg(A, [T[0] - ut[0] * 60, T[1] - ut[1] * 60], [Pp[0] + ut[0] * 40, Pp[1] + ut[1] * 40], C.yellow, 3);
    seg(A, O, T, C.gold, 3); seg(A, O, Pp, C.teal, 2.5);
    rightMark(A, T, [(O[0] - T[0]) / (r * s), (O[1] - T[1]) / (r * s)], ut, 16);
    pt(A, T, C.text, 'T', [-4, -16]); pt(A, Pp, C.text, 'P', [16, -12]);
    const hint = V.phase !== 'ask';
    if (it.form === 'ang') {
      angleMark(A, O, T, Pp, 34, C.gold, it.x + '°');
      angleMark(A, Pp, O, T, 40, C.yellow, done(V) ? it.v + '°' : '?');
      if (hint) A.mtx(A.svg, 600, 380, '90° + ' + it.x + '° + ? = 180°', { 'font-size': 22, fill: C.muted, 'text-anchor': 'end', class: 'fade' });
      return;
    }
    A.mtx(A.svg, (O[0] + T[0]) / 2 - 18, (O[1] + T[1]) / 2, 'r = ' + it.r, { 'font-size': 20, fill: C.gold, 'text-anchor': 'end' });
    A.mtx(A.svg, (T[0] + Pp[0]) / 2 + 6, (T[1] + Pp[1]) / 2 - 22, it.form === 'len' ? (done(V) ? MODEL.ans1(it.t) : '?') : String(it.t), { 'font-size': 22, fill: C.yellow });
    A.mtx(A.svg, (O[0] + Pp[0]) / 2 + 10, (O[1] + Pp[1]) / 2 + 24, it.form === 'op' ? (done(V) ? MODEL.ans1(it.o) : '?') : MODEL.ans1(it.o), { 'font-size': 22, fill: C.teal });
    if (hint) A.mtx(A.svg, 600, 380, 'OP² = r² + PT²', { 'font-size': 22, fill: C.muted, 'text-anchor': 'end', class: 'fade' });
  }
};

const PAGE = {
  key: 'math9-circle-geometry-trainer-v1', course: 'Math 9 · Measurement & Geometry', title: 'Circle Geometry',
  notes: '../notes/circle-geometry/math9-circle-geometry-notes-v1.html',
  tabs: [T_NAME, T_CHORD, T_ANGLE, T_TAN]
};
DRILL.boot(PAGE);
