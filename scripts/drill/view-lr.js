
/* ===================== PAGE: pictures and tabs ===================== */
const { C, qHTML } = DRILL;
const SQ = { x0: 110, y0: 30, w: 420, h: 360, xmin: -7, xmax: 7, ymin: -6, ymax: 6, lab: 2 };
const NUM = v => Q.val(v);

// y = mx + b, cut to the grid.
function lineD(P, m, b, x1, x2) {
  m = NUM(m); b = NUM(b); const o = P.o;
  let lo = x1 == null ? o.xmin : x1, hi = x2 == null ? o.xmax : x2;
  if (m !== 0) { const xa = (o.ymin - b) / m, xb = (o.ymax - b) / m; lo = Math.max(lo, Math.min(xa, xb)); hi = Math.min(hi, Math.max(xa, xb)); }
  return 'M' + P.X(lo) + ' ' + P.Y(m * lo + b) + 'L' + P.X(hi) + ' ' + P.Y(m * hi + b);
}
function line(A, P, m, b, a) { return A.el('path', Object.assign({ d: lineD(P, m, b), stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none', pathLength: 1 }, a), A.svg); }
function dot(A, x, y, col, r, cls) { return A.el('circle', { cx: x, cy: y, r: r || 7, fill: col, stroke: C.stage, 'stroke-width': 2.5, class: cls || null }, A.svg); }
function yGlow(A, P) { A.el('line', { x1: P.X(0), x2: P.X(0), y1: P.Y(P.o.ymax), y2: P.Y(P.o.ymin), stroke: C.teal, 'stroke-width': 12, opacity: .35, class: 'pulse' }, A.svg); }
// Slope triangle from L to R: run across (white), rise up or down (gold).
function tri(A, P, L, R, o) {
  o = o || {}; const g = A.el('g', { class: o.anim ? 'fade' : null }, A.svg), cx = P.X(R.x), cy = P.Y(L.y), dash = o.dash ? '7 6' : null;
  const runC = o.red ? C.red : C.text, riseC = o.red ? C.red : C.gold;
  A.el('path', { d: 'M' + P.X(L.x) + ' ' + cy + 'H' + cx, stroke: runC, 'stroke-width': 3, fill: 'none', 'stroke-dasharray': dash, 'marker-end': o.red ? 'url(#aR)' : 'url(#aW)' }, g);
  if (R.y !== L.y) A.el('path', { d: 'M' + cx + ' ' + cy + 'V' + P.Y(R.y), stroke: riseC, 'stroke-width': 3, fill: 'none', 'stroke-dasharray': dash, 'marker-end': o.red ? 'url(#aR)' : 'url(#aG)' }, g);
  if (o.nums) {
    A.tx(g, (P.X(L.x) + cx) / 2, cy + (R.y > L.y ? 17 : -17), String(R.x - L.x), { fill: runC, 'font-size': 19 });
    if (R.y !== L.y) A.tx(g, cx + 10, (cy + P.Y(R.y)) / 2, (R.y > L.y ? '+' : '−') + Math.abs(R.y - L.y), { fill: riseC, 'font-size': 19, 'text-anchor': 'start' });
  }
  return g;
}
// m = rise/run in the right margin.
function slopeNote(A, rise, run, x) {
  const g = A.el('g', { class: 'fade' }, A.svg); x = x || 588;
  A.mtx(g, x, 120, 'm =', { 'font-size': 24, fill: C.gold });
  A.frac(g, x, 172, (rise < 0 ? '−' : '') + Math.abs(rise), String(run), { fill: C.gold, 'font-size': 24 });
  const s = Q.q(rise, run);
  if (s.d !== run || s.n !== rise) { A.mtx(g, x, 222, '=', { 'font-size': 24, fill: C.gold }); if (s.d === 1) A.mtx(g, x, 262, Q.str(s), { 'font-size': 26, fill: C.gold }); else A.frac(g, x, 268, (s.n < 0 ? '−' : '') + Math.abs(s.n), String(s.d), { fill: C.gold, 'font-size': 24 }); }
}
function eqHTML(m, b) {
  m = Q.of(m); const one = m.d === 1 && Math.abs(m.n) === 1;
  let s = '<i>y</i> = <span class="cM">' + (m.n === 0 ? '0' : one ? (m.n < 0 ? '−' : '') : qHTML(m)) + '</span><i>x</i>';
  if (b) s += ' <span class="cB">' + (b < 0 ? '− ' : '+ ') + Math.abs(b) + '</span>';
  return s;
}
const ruleSlots = () => ['y =', { k: 'm', tint: 'M', label: 'm, the slope' }, 'x +', { k: 'b', tint: 'B', label: 'b, the y-intercept' }];
function cell(A, x, y, w, s, o) {
  o = o || {}; const g = A.el('g', { class: o.cls || null }, A.svg);
  A.el('rect', { x: x - w / 2, y: y - 20, width: w, height: 40, rx: 8, fill: o.head ? C.panel : C.stage, stroke: o.stroke || C.edge, 'stroke-width': o.stroke ? 2.5 : 1.5, 'stroke-dasharray': o.dash ? '5 4' : null }, g);
  A.mtx(g, x, y + 1, s, { 'font-size': 22, fill: o.fill || C.text, 'font-style': o.head ? 'italic' : null });
  return g;
}
function arc(A, x1, x2, y, up, label, col) {
  const g = A.el('g', { class: 'fade' }, A.svg), h = up ? -10 : 10;
  A.el('path', { d: 'M' + (x1 + 8) + ' ' + y + 'Q' + (x1 + x2) / 2 + ' ' + (y + h * 2) + ' ' + (x2 - 8) + ' ' + y, stroke: col, 'stroke-width': 2.5, fill: 'none', 'marker-end': col === C.gold ? 'url(#aG)' : col === C.teal ? 'url(#aB)' : 'url(#aM)' }, g);
  A.tx(g, (x1 + x2) / 2, y + h * 2 + (up ? -9 : 9), label, { fill: col, 'font-size': 16 });
}
const sgn = n => (n < 0 ? '−' : '+') + Math.abs(n);

/* LR1 Table -> rule */
const T_TABLE = {
  id: 'table', code: 'LR1', name: 'Table', sec: 1, q: 'Write the rule', kind: 'slots',
  gen: MODEL.genTable, slots: ruleSlots, check: MODEL.checkRule,
  answer: it => ({ m: Q.q(it.m), b: Q.q(it.b) }),
  draw(A, it, V) {
    const cw = 70, X = i => 260 + i * cw, r1 = 64, r2 = 110, done = V.phase === 'right' || V.phase === 'show', code = V.res && V.res.code;
    it.xs.forEach((x, i) => { cell(A, X(i), r1, 62, A.fmt(x)); cell(A, X(i), r2, 62, A.fmt(it.ys[i]), { fill: C.yellow, stroke: done && it.x0 === 0 && i === 0 ? C.teal : null }); });
    const showChange = done || (V.phase === 'wrong' && ['m', 'sign', 'recip', 'other', 'swap'].includes(code));
    const showStart = done || (V.phase === 'wrong' && ['yval', 'b', 'bsign', 'swap', 'other'].includes(code));
    const hx = X(-(showStart && it.x0 > 0 ? it.x0 : 0) - 1);
    cell(A, hx, r1, 56, 'x', { head: true }); cell(A, hx, r2, 56, 'y', { head: true });
    if (showChange) for (let i = 0; i < 4; i++) { arc(A, X(i), X(i + 1), r1 - 21, true, '+1', C.muted); arc(A, X(i), X(i + 1), r2 + 21, false, sgn(it.m), C.gold); }
    if (showStart && it.x0 > 0) {
      for (let k = 1; k <= it.x0; k++) {
        const i = -k; cell(A, X(i), r1, 62, A.fmt(it.xs[0] - k), { dash: true, fill: C.muted, cls: 'fade' });
        const last = k === it.x0;
        cell(A, X(i), r2, 62, last ? (done ? A.fmt(it.b) : '?') : (done ? A.fmt(it.ys[0] - k * it.m) : '?'), { dash: true, fill: last ? C.teal : C.muted, stroke: last ? C.teal : null, cls: 'fade' });
        if (done) arc(A, X(i + 1), X(i), r2 + 21, false, sgn(-it.m), C.teal);
      }
    } else if (showStart && it.x0 === 0 && V.phase === 'wrong') cell(A, X(0), r2, 62, A.fmt(it.ys[0]), { fill: C.yellow, stroke: C.teal, cls: 'pulse' });
    // the same points on a grid
    const vals = it.ys.concat([it.b, 0]); let lo = Math.min(...vals) - 1, hi = Math.max(...vals) + 1;
    const ys = hi - lo > 30 ? 5 : hi - lo > 14 ? 2 : 1; lo = Math.floor(lo / ys) * ys; hi = Math.ceil(hi / ys) * ys;
    const P = A.plane(A.svg, { x0: 150, y0: 180, w: 420, h: 214, xmin: -1, xmax: 7, ymin: lo, ymax: hi, ystep: ys, lab: 2, labx: 1 });
    if (done) {
      line(A, P, it.m, it.b, { class: V.anim ? 'draw' : null });
      dot(A, P.X(0), P.Y(it.b), C.teal, 8, V.anim ? 'pop' : null);
      A.tx(A.svg, P.X(0) + (it.m < 0 ? 14 : -14), P.Y(it.b) - 14, 'b', { fill: C.teal, 'font-size': 18, 'font-style': 'italic', class: 'm' });
    }
    it.xs.forEach((x, i) => dot(A, P.X(x), P.Y(it.ys[i]), C.yellow, 6));
  }
};

/* LR2 Slope from two points */
const T_SLOPE = {
  id: 'slope', code: 'LR2', name: 'Slope', sec: 2, q: 'Find the slope', kind: 'slots',
  gen: MODEL.genSlope, slots: () => ['m =', { k: 'm', tint: 'M', wide: true, label: 'slope' }], check: MODEL.checkSlope,
  answer: it => ({ m: Q.q(it.rise, it.run) }),
  draw(A, it, V) {
    const P = A.plane(A.svg, SQ), L = it.P.x < it.Q.x ? it.P : it.Q, R = L === it.P ? it.Q : it.P, done = V.phase === 'right' || V.phase === 'show';
    if (V.phase === 'wrong') tri(A, P, L, R, { dash: true, anim: true });
    if (done) { tri(A, P, L, R, { nums: true, anim: V.anim }); slopeNote(A, it.rise, it.run); }
    [it.P, it.Q].forEach(p => {
      dot(A, P.X(p.x), P.Y(p.y), C.yellow, 8);
      A.tx(A.svg, P.X(p.x) + (p === L ? -10 : 10), P.Y(p.y) + (p.y >= (p === L ? R : L).y ? -18 : 18), '(' + A.fmt(p.x) + ', ' + A.fmt(p.y) + ')', { 'font-size': 15, fill: C.muted, 'text-anchor': p === L ? 'end' : 'start' });
    });
  }
};

/* LR3 Equation -> graph: tap two grid points */
const T_GRAPH = {
  id: 'graph', code: 'LR3', name: 'Graph it', sec: 3, q: 'Tap two points on the line', kind: 'custom',
  gen: MODEL.genGraph, prompt: it => eqHTML(it.m, it.b),
  panel(box, it, A) {
    const s = document.createElement('div'); s.className = 'seg';
    s.innerHTML = '<button type="button" aria-label="Clear points" title="Clear">⟲</button>';
    s.firstChild.addEventListener('click', () => { if (!A.locked) A.set('pts', []); });
    box.appendChild(s);
  },
  ready: r => (r.pts || []).length < 2 ? 'Tap 2 points' : '',
  check: (it, r) => MODEL.checkGraph(it, r.pts),
  answer: it => ({ pts: [{ x: 0, y: it.b }, { x: it.m.d, y: it.b + it.m.n }] }),
  draw(A, it, V) {
    const P = A.plane(A.svg, SQ), pts = V.resp.pts || [], code = V.res && V.res.code, done = V.phase === 'right' || V.phase === 'show';
    if (V.phase === 'wrong' && ['xaxis', 'b', 'bsign', 'other', 'vert'].includes(code)) yGlow(A, P);
    if (pts.length === 2 && pts[0].x !== pts[1].x && !(V.phase === 'right')) {
      const s = Q.q(pts[1].y - pts[0].y, pts[1].x - pts[0].x), b = Q.sub(Q.q(pts[0].y), Q.mul(s, pts[0].x));
      line(A, P, s, b, { stroke: V.phase === 'ask' ? C.muted : C.red, 'stroke-width': 3, 'stroke-dasharray': '8 7', pathLength: null });
      if (V.phase === 'wrong' && ['sign', 'recip', 'slope'].includes(code)) { const L = pts[0].x < pts[1].x ? pts[0] : pts[1], R = L === pts[0] ? pts[1] : pts[0]; tri(A, P, L, R, { red: true, nums: true, dash: true, anim: true }); }
    }
    if (done) {
      line(A, P, it.m, it.b, { class: V.anim ? 'draw' : null });
      tri(A, P, { x: 0, y: it.b }, { x: it.m.d, y: it.b + it.m.n }, { nums: true, anim: V.anim });
      dot(A, P.X(0), P.Y(it.b), C.teal, 8, V.anim ? 'pop' : null);
    }
    pts.forEach(p => dot(A, P.X(p.x), P.Y(p.y), C.yellow, 8));
    if (!A.locked) {
      const hit = A.el('rect', { x: SQ.x0 - 10, y: SQ.y0 - 10, width: SQ.w + 20, height: SQ.h + 20, fill: 'transparent', class: 'hit' }, A.svg);
      hit.addEventListener('click', e => {
        const c = A.pt(e), g = P.inv(c.x, c.y), p = { x: Math.max(-7, Math.min(7, Math.round(g.x))), y: Math.max(-6, Math.min(6, Math.round(g.y))) };
        const list = (A.resp.pts || []).slice(), i = list.findIndex(u => u.x === p.x && u.y === p.y);
        if (i >= 0) list.splice(i, 1); else if (list.length < 2) list.push(p); else list[1] = p;
        A.set('pts', list);
      });
    }
  }
};

/* LR3 Graph -> equation */
const T_READ = {
  id: 'read', code: 'LR3', name: 'Equation', sec: 3, q: 'Write the equation', kind: 'slots',
  gen: MODEL.genRead, slots: ruleSlots, check: MODEL.checkRule,
  answer: it => ({ m: it.m, b: Q.q(it.b) }),
  draw(A, it, V) {
    const P = A.plane(A.svg, SQ), code = V.res && V.res.code, done = V.phase === 'right' || V.phase === 'show';
    const [L, R] = it.pts;
    if (V.phase === 'wrong' && ['xaxis', 'b', 'bsign', 'swap', 'other', 'yval'].includes(code)) yGlow(A, P);
    line(A, P, it.m, it.b);
    if (V.phase === 'wrong' && ['sign', 'recip', 'm', 'other', 'swap'].includes(code)) tri(A, P, L, R, { dash: true, anim: true });
    if (done) {
      tri(A, P, L, R, { nums: true, anim: V.anim }); slopeNote(A, R.y - L.y, R.x - L.x);
      dot(A, P.X(0), P.Y(it.b), C.teal, 9, V.anim ? 'pop' : null);
      A.tx(A.svg, P.X(0) + (Q.val(it.m) < 0 ? 14 : -14), P.Y(it.b) - 16, 'b = ' + A.fmt(it.b), { fill: C.teal, 'font-size': 17, 'text-anchor': Q.val(it.m) < 0 ? 'start' : 'end' });
    }
    it.pts.forEach(p => dot(A, P.X(p.x), P.Y(p.y), C.text, 6));
  }
};

/* LR4 Direct or partial */
const T_VARY = {
  id: 'vary', code: 'LR4', name: 'Direct?', sec: 4, q: 'Direct or partial?', kind: 'choice',
  gen: MODEL.genVary,
  choices: () => [{ v: 'direct', label: 'Direct' }, { v: 'partial', label: 'Partial' }],
  check: MODEL.checkVary,
  answer: it => ({ v: it.direct ? 'direct' : 'partial' }),
  draw(A, it, V) {
    const done = V.phase !== 'ask';
    if (it.rep === 'graph') {
      const ys = [0, 10].map(x => it.m * x + it.b).concat([0, it.b]);
      let lo = Math.min(...ys), hi = Math.max(...ys); const st = hi - lo > 40 ? 10 : hi - lo > 20 ? 5 : 2;
      lo = Math.floor(lo / st) * st; hi = Math.ceil(hi / st) * st + (hi % st === 0 ? st : 0);
      const P = A.plane(A.svg, { x0: 120, y0: 26, w: 420, h: 360, xmin: -1, xmax: 10, ymin: Math.min(lo, -st), ymax: hi, ystep: st, lab: 1, labx: 2 });
      A.el('path', { d: lineD(P, it.m, it.b, 0, 10), stroke: C.blue, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, A.svg);
      dot(A, P.X(0), P.Y(it.b), C.blue, 6);
      if (done) {
        A.el('circle', { cx: P.X(0), cy: P.Y(it.b), r: 16, fill: 'none', stroke: C.teal, 'stroke-width': 3, class: V.anim ? 'pop' : null }, A.svg);
        A.tx(A.svg, P.X(0) + 22, P.Y(it.b) + (it.m > 0 ? 18 : -18), '(0, ' + A.fmt(it.b) + ')', { fill: C.teal, 'font-size': 18, 'text-anchor': 'start' });
      }
    } else if (it.rep === 'table') {
      const cw = 76, X = i => 260 + i * cw;
      cell(A, 110, 170, 60, 'x', { head: true }); cell(A, 110, 222, 60, 'y', { head: true });
      it.xs.forEach((x, i) => { cell(A, X(i), 170, 68, A.fmt(x)); cell(A, X(i), 222, 68, A.fmt(it.ys[i]), { fill: C.yellow }); });
      if (done) {
        if (it.xs[0] === 0) cell(A, X(0), 222, 68, A.fmt(it.ys[0]), { fill: C.teal, stroke: C.teal, cls: 'pop' });
        else { cell(A, 184, 170, 60, '0', { dash: true, fill: C.muted, cls: 'fade' }); cell(A, 184, 222, 60, A.fmt(it.b), { dash: true, fill: C.teal, stroke: C.teal, cls: 'pop' }); }
        A.tx(A.svg, 320, 300, '(0, ' + A.fmt(it.b) + ')', { fill: C.teal, 'font-size': 22, class: 'fade' });
      }
    } else {
      const t = A.el('text', { x: 320, y: 190, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'm', 'font-size': 54, fill: C.text }, A.svg);
      const span = (s, a) => { const e = A.el('tspan', a || {}, t); e.textContent = s; };
      const mx = (it.m === 1 ? '' : String(it.m)), bcol = done ? { fill: C.teal } : {};
      span('y', { 'font-style': 'italic' }); span(' = ');
      if (it.form === 'bmx') { span(A.fmt(it.b), bcol); span((it.m < 0 ? ' − ' : ' + ') + (Math.abs(it.m) === 1 ? '' : Math.abs(it.m))); span('x', { 'font-style': 'italic' }); }
      else { span(it.m < 0 ? '−' + (it.m === -1 ? '' : Math.abs(it.m)) : mx); span('x', { 'font-style': 'italic' }); if (it.b) span((it.b < 0 ? ' − ' : ' + ') + Math.abs(it.b), bcol); }
      if (done) A.mtx(A.svg, 320, 280, 'b = ' + A.fmt(it.b), { fill: C.teal, 'font-size': 30, class: 'm fade' });
    }
  }
};

const PAGE = {
  key: 'math9-linear-relations-trainer-v1', course: 'Math 9 · Algebra', title: 'Linear Relations',
  notes: '../notes/linear-relations/math9-linear-relations-notes-v1.html',
  tabs: [T_TABLE, T_SLOPE, T_GRAPH, T_READ, T_VARY]
};
DRILL.boot(PAGE);
