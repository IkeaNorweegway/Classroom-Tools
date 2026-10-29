
/* ===================== PAGE: pictures and tabs ===================== */
const { C, qHTML, fracHTML, mathHTML } = DRILL;
const { sg, SYM } = MODEL;
const fm = v => Q.str(v);
const coef = a => a === 1 ? 'x' : a === -1 ? '−x' : fm(a) + 'x';
function side(s) {
  const k = Q.of(s.k || 0), kv = Q.val(k);
  if (!s.x) return fm(k);
  return coef(s.x) + (kv === 0 ? '' : (kv < 0 ? ' − ' : ' + ') + fm(Q.q(Math.abs(k.n), k.d)));
}
const eqStr = (L, R) => side(L) + ' = ' + side(R);
const cHTML = a => a === 1 ? '' : a === -1 ? '−' : (a < 0 ? '−' : '') + Math.abs(a);
const kHTML = (k, first) => { k = Q.of(k); const v = Q.val(k); if (v === 0 && !first) return ''; const abs = Q.q(Math.abs(k.n), k.d); return (first ? (v < 0 ? '−' : '') : (v < 0 ? ' − ' : ' + ')) + qHTML(abs); };
function pill(A, p, x, y, s, col) {
  const g = A.el('g', { class: 'pop' }, p), w = 18 + String(s).length * 12;
  A.el('rect', { x: x - w / 2, y: y - 16, width: w, height: 32, rx: 16, fill: '#2a2110', stroke: col || C.gold, 'stroke-width': 2 }, g);
  A.mtx(g, x, y + 1, s, { 'font-size': 21, fill: col || C.gold });
  return g;
}

/* ---------- the balance, with the written steps beside it ---------- */
function blocks(A, p, cx, baseY, s) {
  const list = [], xn = s.x || 0, k = Q.of(s.k || 0), kv = Q.val(k);
  if (xn) { if (Math.abs(xn) <= 4) for (let i = 0; i < Math.abs(xn); i++) list.push({ w: 40, t: xn > 0 ? 'x' : '−x', c: xn > 0 ? C.blue : C.red }); else list.push({ w: 64, t: coef(xn), c: xn > 0 ? C.blue : C.red }); }
  if (kv !== 0 || !xn) { const t = fm(k); list.push({ w: 26 + t.length * 15, t, c: kv > 0 ? C.yellow : kv < 0 ? C.red : C.muted }); }
  const rows = [[]]; let w = 0;
  list.forEach(b => { if (w + b.w > 160 && rows[rows.length - 1].length) { rows.push([]); w = 0; } rows[rows.length - 1].push(b); w += b.w + 5; });
  rows.forEach((row, r) => {
    const tw = row.reduce((s2, b) => s2 + b.w + 5, -5); let x = cx - tw / 2; const y = baseY - 46 * (r + 1);
    row.forEach(b => {
      A.el('rect', { x, y, width: b.w, height: 40, rx: 7, fill: b.c, 'fill-opacity': .18, stroke: b.c, 'stroke-width': 2.5 }, p);
      A.mtx(p, x + b.w / 2, y + 20, b.t, { 'font-size': 24, fill: b.c });
      x += b.w + 5;
    });
  });
}
function balance(A, p, L, R, op) {
  const cx = 210, by = 118, py = 296;
  A.el('path', { d: 'M' + cx + ' ' + by + 'l-22 34h44z', fill: C.edge, stroke: C.muted, 'stroke-width': 2 }, p);
  A.el('line', { x1: cx, x2: cx, y1: by + 34, y2: 352, stroke: C.muted, 'stroke-width': 4 }, p);
  A.el('rect', { x: cx - 70, y: 352, width: 140, height: 9, rx: 4.5, fill: C.muted }, p);
  A.el('line', { x1: 48, x2: 372, y1: by, y2: by, stroke: C.text, 'stroke-width': 5, 'stroke-linecap': 'round' }, p);
  A.el('circle', { cx, cy: by, r: 6, fill: C.text }, p);
  [[92, L], [328, R]].forEach(([px, s]) => {
    A.el('path', { d: 'M' + px + ' ' + by + 'L' + (px - 78) + ' ' + py + 'M' + px + ' ' + by + 'L' + (px + 78) + ' ' + py, stroke: C.muted, 'stroke-width': 1.5, opacity: .5, fill: 'none' }, p);
    A.el('path', { d: 'M' + (px - 86) + ' ' + py + 'Q' + px + ' ' + (py + 30) + ' ' + (px + 86) + ' ' + py + 'Z', fill: C.panel, stroke: C.muted, 'stroke-width': 2 }, p);
    blocks(A, p, px, py - 2, s);
    if (op) pill(A, p, px, by - 40, op);
  });
}
// Play the steps: balance on the left, each line written on the right.
function playSteps(A, S, upto, anim) {
  const bal = A.el('g', {}, A.svg), tr = A.el('g', {}, A.svg), gap = Math.min(64, 300 / Math.max(1, S.length - 1));
  A.el('line', { x1: 425, x2: 425, y1: 30, y2: 390, stroke: C.edge, 'stroke-width': 1.5 }, A.svg);
  const frame = i => {
    bal.innerHTML = ''; balance(A, bal, S[i].L, S[i].R, S[i].op);
    const y = 60 + i * gap;
    if (S[i].op) pill(A, tr, 478, y - gap / 2, S[i].op);
    const t = A.mtx(tr, 532, y, eqStr(S[i].L, S[i].R), { 'font-size': 26, fill: i === S.length - 1 && upto === S.length - 1 ? C.green : C.text, class: anim && i ? 'fade' : null });
    if (t.getComputedTextLength && t.getComputedTextLength() > 190) t.setAttribute('font-size', 21);
  };
  for (let i = 0; i <= upto; i++) { if (i === 0 || !anim) frame(i); else A.later(i * 1100, () => frame(i)); }
}

/* LE1 two-step */
const T_TWO = {
  id: 'two', code: 'LE1', name: 'Two-step', sec: 1, q: 'Solve', kind: 'slots',
  gen: MODEL.genTwo, prompt: it => mathHTML(cHTML(it.a) + 'x') + kHTML(it.c) + ' = ' + kHTML(it.d, true),
  slots: () => ['x =', { k: 'x', label: 'x' }], check: MODEL.checkTwo, answer: it => ({ x: Q.q(it.x) }),
  draw(A, it, V) { const S = MODEL.steps(it.a, it.c, 0, it.d); playSteps(A, S, V.phase === 'ask' ? 0 : V.phase === 'wrong' ? 1 : S.length - 1, V.anim); }
};

/* LE2 expand a(px + c) */
const T_BR = {
  id: 'br', code: 'LE2', name: 'Brackets', sec: 2, q: 'Expand', kind: 'slots',
  gen: MODEL.genBr, prompt: it => cHTML(it.a) + '(' + mathHTML(cHTML(it.p) + 'x') + kHTML(it.c) + ')',
  slots: () => [{ k: 'k', label: 'x coefficient' }, 'x +', { k: 'c0', label: 'number' }], check: MODEL.checkBr,
  answer: it => ({ k: Q.q(it.a * it.p), c0: Q.q(it.a * it.c) }),
  draw(A, it, V) {
    const done = V.phase === 'right' || V.phase === 'show', code = V.res && V.res.code, aS = it.a === -1 ? '−' : fm(it.a);
    const t1 = coef(it.p), t2 = (it.c < 0 ? '− ' : '+ ') + Math.abs(it.c);
    // the bracket, with arrows from the outside number to each term
    const ex = A.el('text', { x: 320, y: 96, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'm', 'font-size': 50, fill: C.text }, A.svg);
    const sp = (s, a) => { const e = A.el('tspan', a || {}, ex); e.textContent = s; return e; };
    sp(aS, { fill: C.gold }); sp('(');
    if (it.p !== 1) sp(String(it.p), { fill: C.teal }); sp('x', { fill: C.teal, 'font-style': 'italic' });
    sp(' ' + t2, { fill: C.yellow }); sp(')');
    // centres of the outside number and each term, measured from the text
    const pos = i => ex.getStartPositionOfChar(i).x, end = i => ex.getEndPositionOfChar(i).x, la = aS.length, l1 = t1.length;
    let cA = 260, c1 = 320, c2 = 390;
    try { cA = (pos(0) + end(la - 1)) / 2; c1 = (pos(la + 1) + end(la + l1)) / 2; c2 = (pos(la + l1 + 2) + end(la + l1 + 1 + t2.length)) / 2; } catch (e) { /* not laid out */ }
    if (V.phase !== 'ask') [c1, c2].forEach((x2, i) => A.el('path', { d: 'M' + cA + ' 62Q' + (cA + x2) / 2 + ' ' + (i ? 0 : 18) + ' ' + x2 + ' 60', stroke: code === 'first' && i ? C.red : C.gold, 'stroke-width': 2.5, fill: 'none', 'marker-end': code === 'first' && i ? 'url(#aR)' : 'url(#aG)', class: 'fade' }, A.svg));
    // area model: height a, width (px | c)
    const x0 = 190, y0 = 160, h = 120, w1 = 190, w2 = 130;
    A.mtx(A.svg, x0 - 26, y0 + h / 2, aS, { 'font-size': 32, fill: C.gold });
    A.mtx(A.svg, x0 + w1 / 2, y0 - 22, t1, { 'font-size': 28, fill: C.teal });
    A.mtx(A.svg, x0 + w1 + w2 / 2, y0 - 22, fm(it.c), { 'font-size': 28, fill: C.yellow });
    const cells = [[x0, w1, C.teal, coef(it.a * it.p)], [x0 + w1, w2, C.yellow, fm(it.a * it.c)]];
    cells.forEach(([x, w, col, prod], i) => {
      const bad = V.phase === 'wrong' && ((code === 'first' && i === 1) || (code === 'xterm' && i === 0));
      A.el('rect', { x, y: y0, width: w, height: h, fill: col, 'fill-opacity': .12, stroke: bad ? C.red : col, 'stroke-width': bad ? 4 : 2, class: bad ? 'pulse' : null }, A.svg);
      if (done) A.mtx(A.svg, x + w / 2, y0 + h / 2, prod, { 'font-size': 34, fill: col, class: V.anim ? 'pop' : null, style: 'animation-delay:' + i * 250 + 'ms' });
      else if (V.phase === 'wrong') A.mtx(A.svg, x + w / 2, y0 + h / 2, '?', { 'font-size': 34, fill: C.muted });
    });
    if (done) A.mtx(A.svg, 320, 350, coef(it.a * it.p) + (it.a * it.c < 0 ? ' − ' : ' + ') + Math.abs(it.a * it.c), { 'font-size': 36, fill: C.green, class: V.anim ? 'fade' : null, style: 'animation-delay:600ms' });
  }
};

/* LE2 x on both sides */
const T_BOTH = {
  id: 'both', code: 'LE2', name: 'Both sides', sec: 2, q: 'Solve', kind: 'slots',
  gen: MODEL.genBoth, prompt: it => mathHTML(cHTML(it.a) + 'x') + kHTML(it.c) + ' = ' + mathHTML(cHTML(it.b) + 'x') + kHTML(it.d),
  slots: () => ['x =', { k: 'x', label: 'x' }], check: MODEL.checkBoth, answer: it => ({ x: Q.q(it.x) }),
  draw(A, it, V) { const S = MODEL.steps(it.a, it.c, it.b, it.d); playSteps(A, S, V.phase === 'ask' ? 0 : V.phase === 'wrong' ? 1 : S.length - 1, V.anim); }
};

/* LE3 clear the fractions */
function termTile(A, x, y, v, isX, signed, o) {
  o = o || {}; const g = A.el('g', { class: o.cls || null, style: o.delay ? 'animation-delay:' + o.delay + 'ms' : null }, A.svg);
  A.el('rect', { x: x - 58, y: y - 44, width: 116, height: 88, rx: 12, fill: C.stage, stroke: o.stroke || C.edge, 'stroke-width': o.stroke ? 3 : 1.5, class: o.pulse ? 'pulse' : null }, g);
  v = Q.of(v); const neg = Q.val(v) < 0, abs = Q.q(Math.abs(v.n), v.d), col = o.fill || (isX ? C.teal : C.yellow);
  const sign = neg ? '−' : signed ? '+' : '', sx = x - (abs.d === 1 ? 14 + String(abs.n).length * 6 : 28);
  if (sign) A.mtx(g, sx - (isX ? 6 : 0), y, sign, { 'font-size': 28, fill: col });
  const off = sign ? 8 : 0;
  if (abs.d === 1) A.mtx(g, x + off, y, isX ? (abs.n === 1 ? 'x' : abs.n + 'x') : String(abs.n), { 'font-size': 30, fill: col });
  else A.frac(g, x + off, y, isX ? (abs.n === 1 ? 'x' : abs.n + 'x') : String(abs.n), String(abs.d), { 'font-size': 26, fill: col });
  return g;
}
const T_FRAC = {
  id: 'frac', code: 'LE3', name: 'Fractions', sec: 3, q: 'Clear the fractions', kind: 'slots',
  gen: MODEL.genFrac,
  prompt: it => { const A_ = it.A; return (A_.n === 1 ? fracHTML('<i>x</i>', A_.d) : fracHTML(A_.n + '<i>x</i>', A_.d)) + kHTML(it.K) + ' = ' + kHTML(it.R, true); },
  slots: () => [{ k: 'A', label: 'x coefficient', narrow: true }, 'x +', { k: 'K', label: 'number on the left', narrow: true }, '=', { k: 'R', label: 'number on the right', narrow: true }],
  check: MODEL.checkFrac,
  answer: it => ({ A: Q.mul(it.A, it.L), K: Q.mul(it.K, it.L), R: Q.mul(it.R, it.L) }),
  draw(A, it, V) {
    const xs = [130, 290, 470], code = V.res && V.res.code, done = V.phase === 'right' || V.phase === 'show', ans = this.answer(it);
    const vals = [it.A, it.K, it.R];
    vals.forEach((v, i) => termTile(A, xs[i], 92, v, i === 0, i === 1, { stroke: V.phase === 'wrong' && code === 'lcd' && V.res.miss === i ? C.red : null, pulse: V.phase === 'wrong' && code === 'lcd' && V.res.miss === i }));
    A.mtx(A.svg, 380, 92, '=', { 'font-size': 34 });
    if (V.phase !== 'ask') {
      A.tx(A.svg, 70, 26, 'LCD = ' + it.L, { fill: C.gold, 'font-size': 18, 'text-anchor': 'start', class: 'fade' });
      xs.forEach((x, i) => {
        const miss = V.phase === 'wrong' && code === 'lcd' && V.res.miss === i, col = miss ? C.red : C.gold;
        A.el('path', { d: 'M' + x + ' 142V218', stroke: col, 'stroke-width': 2.5, 'marker-end': miss ? 'url(#aR)' : 'url(#aG)', class: 'fade' }, A.svg);
        pill(A, A.svg, x + 44, 180, '×' + it.L, col);
      });
    }
    if (done) {
      [ans.A, ans.K, ans.R].forEach((v, i) => termTile(A, xs[i], 272, v, i === 0, i === 1, { fill: C.green, cls: V.anim ? 'pop' : null, delay: i * 200 }));
      A.mtx(A.svg, 380, 272, '=', { 'font-size': 34, fill: C.green });
    } else if (V.phase === 'wrong') xs.forEach(x => A.mtx(A.svg, x, 272, '?', { 'font-size': 34, fill: C.muted }));
  }
};

/* LE4 does the sign flip? */
const T_FLIP = {
  id: 'flip', code: 'LE4', name: 'Flip?', sec: 4, q: 'Which sign?', kind: 'choice',
  gen: MODEL.genFlip,
  choices: it => it.rel.length === 2 ? [{ v: '<=', label: '≤', math: true, aria: 'less than or equal' }, { v: '>=', label: '≥', math: true, aria: 'greater than or equal' }] : [{ v: '<', label: '<', math: true, aria: 'less than' }, { v: '>', label: '>', math: true, aria: 'greater than' }],
  check: MODEL.checkFlip, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    const done = V.phase !== 'ask', pickd = V.resp.v, wrongPick = V.phase === 'show' && pickd && pickd !== it.ans;
    A.mtx(A.svg, 250, 62, it.start.lhs + ' ' + SYM[it.rel] + ' ' + fm(it.start.rhs), { 'font-size': 44 });
    A.el('path', { d: 'M250 98V150', stroke: C.gold, 'stroke-width': 3, 'marker-end': 'url(#aG)' }, A.svg);
    pill(A, A.svg, 330, 124, it.op);
    A.mtx(A.svg, 200, 190, 'x', { 'font-size': 44 });
    if (!done) A.el('rect', { x: 228, y: 166, width: 44, height: 48, rx: 8, fill: 'none', stroke: C.yellow, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, A.svg);
    else A.mtx(A.svg, 250, 190, SYM[it.ans], { 'font-size': 44, fill: C.green, class: V.anim ? 'pop' : null });
    A.mtx(A.svg, 290, 190, fm(it.v), { 'font-size': 44, 'text-anchor': 'start' });
    const lo = it.v - 10, N = A.numLine(A.svg, { x0: 60, x1: 580, y: 320, min: lo, max: it.v + 10, every: 2 });
    if (done) {
      // the answer on the number line
      const right = it.ans[0] === '>', X = N.X(it.v);
      A.el('path', { d: 'M' + X + ' 320H' + (right ? 598 : 42), stroke: C.blue, 'stroke-width': 7, 'stroke-linecap': 'round', 'marker-end': 'url(#aL)', class: V.anim ? 'draw' : null, pathLength: 1 }, A.svg);
      A.el('circle', { cx: X, cy: 320, r: 9, fill: it.ans.length === 2 ? C.blue : C.stage, stroke: C.blue, 'stroke-width': 3 }, A.svg);
      // test a point in both lines
      const t = it.t, lhs = MODEL.startAt(it, t), l1 = MODEL.holds(it.rel, Q.val(lhs), it.start.rhs);
      A.el('circle', { cx: N.X(t), cy: 320, r: 8, fill: C.yellow, stroke: C.stage, 'stroke-width': 2, class: 'pop' }, A.svg);
      A.mtx(A.svg, N.X(t), 288, 'x = ' + fm(t), { 'font-size': 18, fill: C.yellow, class: 'fade' });
      A.mtx(A.svg, 455, 62, fm(lhs) + ' ' + SYM[it.rel] + ' ' + fm(it.start.rhs) + (l1 ? ' ✓' : ' ✗'), { 'font-size': 22, fill: l1 ? C.green : C.red, class: 'fade', 'text-anchor': 'start' });
      A.mtx(A.svg, 455, 178, fm(t) + ' ' + SYM[it.ans] + ' ' + fm(it.v) + ' ✓', { 'font-size': 22, fill: C.green, class: 'fade', 'text-anchor': 'start' });
      if (wrongPick) A.mtx(A.svg, 455, 210, fm(t) + ' ' + SYM[pickd] + ' ' + fm(it.v) + ' ✗', { 'font-size': 22, fill: C.red, class: 'fade', 'text-anchor': 'start' });
    }
  }
};

/* LE4 graph an inequality */
const T_INEQ = {
  id: 'ineq', code: 'LE4', name: 'Graph it', sec: 4, q: 'Graph it', kind: 'custom',
  gen: MODEL.genIneq,
  prompt: it => it.back ? fm(it.b) + ' ' + SYM[MODEL.FLIP[it.rel]] + ' <i>x</i>' : '<i>x</i> ' + SYM[it.rel] + ' ' + fm(it.b),
  panel(box, it, A) {
    const mk = (k, opts) => {
      const s = document.createElement('div'); s.className = 'seg';
      opts.forEach(([v, lab, aria]) => {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = lab; b.setAttribute('aria-label', aria); b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => { if (A.locked) return; s.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); A.set(k, v); });
        s.appendChild(b);
      });
      box.appendChild(s);
    };
    mk('closed', [[true, '●', 'closed dot'], [false, '○', 'open dot']]);
    mk('dir', [['L', '←', 'shade left'], ['R', '→', 'shade right']]);
  },
  ready: r => r.at == null ? 'Tap the number line' : r.closed == null ? 'Pick ● or ○' : r.dir == null ? 'Pick ← or →' : '',
  check: MODEL.checkIneq, answer: it => MODEL.ineqAnswer(it),
  draw(A, it, V) {
    const N = A.numLine(A.svg, { x0: 70, x1: 570, y: 230, min: -8, max: 8, every: 1 }), r = V.resp, done = V.phase === 'right' || V.phase === 'show', code = V.res && V.res.code;
    const graph = (g, y, col, dash, anim) => {
      if (g.at == null) return;
      const X = N.X(g.at);
      if (g.dir) A.el('path', { d: 'M' + X + ' ' + y + 'H' + (g.dir === 'R' ? 588 : 52), stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-dasharray': dash || null, 'marker-end': col === C.red ? 'url(#aR)' : col === C.blue ? 'url(#aL)' : 'url(#aY)', class: anim ? 'draw' : null, pathLength: dash ? null : 1 }, A.svg);
      A.el('circle', { cx: X, cy: y, r: 10, fill: g.closed ? col : C.stage, stroke: col, 'stroke-width': 3.5, 'stroke-dasharray': g.closed == null ? '4 3' : null }, A.svg);
    };
    if (V.phase === 'show') { if (r.at != null) graph(r, 170, C.red, '9 7'); graph(this.answer(it), 230, C.blue, null, V.anim); }
    else graph(r, 230, V.phase === 'right' ? C.blue : C.yellow, null, V.phase === 'right' && V.anim);
    const test = dir => {
      const t = Math.max(-8, Math.min(8, it.b + (dir === 'R' ? 3 : -3))), holds = MODEL.holds(it.rel, t, it.b);
      A.el('circle', { cx: N.X(t), cy: 230, r: 7, fill: C.text, stroke: C.stage, 'stroke-width': 2, class: 'pop' }, A.svg);
      A.mtx(A.svg, N.X(t), 110, (it.back ? fm(it.b) + ' ' + SYM[MODEL.FLIP[it.rel]] + ' ' + fm(t) : fm(t) + ' ' + SYM[it.rel] + ' ' + fm(it.b)) + (holds ? ' ✓' : ' ✗'), { 'font-size': 24, fill: holds ? C.green : C.red, class: 'fade' });
      A.el('path', { d: 'M' + N.X(t) + ' 128V214', stroke: holds ? C.green : C.red, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, A.svg);
    };
    if (done) test(this.answer(it).dir);
    else if (V.phase === 'wrong' && (code === 'dir' || code === 'readback')) test(r.dir);
    if (!A.locked) for (let v = -8; v <= 8; v++) {
      const h = A.el('circle', { cx: N.X(v), cy: 230, r: 15, fill: 'transparent', class: 'hit' }, A.svg);
      h.addEventListener('click', () => A.set('at', v));
    }
  }
};

const PAGE = {
  key: 'math9-linear-equations-trainer-v2', course: 'Math 9 · Algebra', title: 'Equations & Inequalities',
  notes: '../notes/linear-equations/math9-linear-equations-notes-v1.html',
  tabs: [T_TWO, T_BR, T_BOTH, T_FRAC, T_FLIP, T_INEQ]
};
DRILL.boot(PAGE);
