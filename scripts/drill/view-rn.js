
/* ===================== PAGE: pictures and tabs ===================== */
const { C, qHTML, fracHTML } = DRILL;
const done = V => V.phase === 'right' || V.phase === 'show';
const valSlot = () => ['=', { k: 'v', label: 'answer', wide: true }];
const absQ = v => Q.q(Math.abs(v.n), v.d);
// A rational number as HTML, in one of its written forms.
function rnHTML(v, form) {
  v = Q.of(v); const neg = v.n < 0, a = Math.abs(v.n);
  if (v.d === 1) return (neg ? '−' : '') + a;
  if (form === 'dec') return MODEL.decStr(v);
  if (form === 'negden') return fracHTML(a, '−' + v.d);
  if (form === 'negnum') return fracHTML('−' + a, v.d);
  return (neg ? '−' : '') + fracHTML(a, v.d);
}
const par = (v, form) => Q.val(v) < 0 ? '(' + rnHTML(v, form) + ')' : rnHTML(v, form);
// The same in SVG.
function rnSVG(A, x, y, v, form, a) {
  v = Q.of(v); a = Object.assign({ 'font-size': 26 }, a || {}); const neg = v.n < 0, ab = Math.abs(v.n);
  if (v.d === 1 || form === 'dec') return A.mtx(A.svg, x, y, v.d === 1 ? (neg ? '−' : '') + ab : MODEL.decStr(v), a);
  const g = A.el('g', { class: a.class || null }, A.svg), fs = +a['font-size'];
  if (form === 'negden') A.frac(g, x, y, String(ab), '−' + v.d, a);
  else if (form === 'negnum') A.frac(g, x, y, '−' + ab, String(v.d), a);
  else { if (neg) A.mtx(g, x - fs * .55 - String(Math.max(ab, v.d)).length * fs * .25, y, '−', a); A.frac(g, x, y, String(ab), String(v.d), a); }
  return g;
}
// A number line from lo to hi with ticks every 1/sub.
function line(A, lo, hi, sub, y, o) {
  o = o || {}; const x0 = 60, x1 = 580, X = v => x0 + ((typeof v === 'number' ? v : Q.val(v)) - lo) / (hi - lo) * (x1 - x0);
  A.el('line', { x1: x0 - 16, x2: x1 + 16, y1: y, y2: y, stroke: C.axis, 'stroke-width': 2.5, 'marker-end': 'url(#aA)', 'marker-start': 'url(#aAs)' }, A.svg);
  for (let k = lo * sub; k <= hi * sub; k++) {
    const whole = k % sub === 0, x = X(k / sub);
    A.el('line', { x1: x, x2: x, y1: y - (whole ? 11 : 6), y2: y + (whole ? 11 : 6), stroke: whole ? C.axis : C.tick, 'stroke-width': whole ? 2 : 1 }, A.svg);
    if (whole && (o.every ? (k / sub) % o.every === 0 : true)) A.tx(A.svg, x, y + 28, A.fmt(k / sub), { 'font-size': 15, fill: k === 0 ? C.text : C.tick });
  }
  return X;
}
function dotAt(A, x, y, col, cls) { return A.el('circle', { cx: x, cy: y, r: 9, fill: col, stroke: C.stage, 'stroke-width': 2.5, class: cls || null }, A.svg); }
function jump(A, x1, x2, y, col, h) { return A.el('path', { d: 'M' + x1 + ' ' + y + 'Q' + (x1 + x2) / 2 + ' ' + (y - (h || 70)) + ' ' + x2 + ' ' + y, stroke: col, 'stroke-width': 3, fill: 'none', 'marker-end': col === C.gold ? 'url(#aG)' : col === C.green ? 'url(#aN)' : 'url(#aL)', class: 'draw', pathLength: 1 }, A.svg); }

/* RN1 compare */
const T_CMP = {
  id: 'cmp', code: 'RN1', name: 'Compare', sec: 1, q: 'Which sign?', kind: 'choice',
  gen: MODEL.genCmp, typeOf: it => it.ans + (Q.val(it.a) < 0 && Q.val(it.b) < 0 ? "bothneg" : ""),
  prompt: it => rnHTML(it.a, it.fa) + ' <span style="color:var(--yellow)">▢</span> ' + rnHTML(it.b, it.fb),
  choices: () => ['<', '=', '>'].map(v => ({ v, label: v, math: true })),
  check: MODEL.checkCmp, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    const X = line(A, -3, 3, 4, 250);
    rnSVG(A, 210, 100, it.a, it.fa, { 'font-size': 44, fill: C.blue }); rnSVG(A, 430, 100, it.b, it.fb, { 'font-size': 44, fill: C.gold });
    A.mtx(A.svg, 320, 100, V.phase === 'ask' ? '?' : it.ans, { 'font-size': 48, fill: V.phase === 'ask' ? C.yellow : C.green });
    if (V.phase === 'ask') return;
    const xa = X(it.a), xb = X(it.b), same = Q.eq(it.a, it.b);
    A.el('path', { d: 'M210 136L' + xa + ' 236', stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', class: 'fade' }, A.svg);
    A.el('path', { d: 'M430 136L' + xb + ' 236', stroke: C.gold, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', class: 'fade' }, A.svg);
    dotAt(A, xa, 250, C.blue, 'pop'); if (!same) dotAt(A, xb, 250, C.gold, 'pop'); else A.el('circle', { cx: xb, cy: 250, r: 14, fill: 'none', stroke: C.gold, 'stroke-width': 3, class: 'pop' }, A.svg);
    A.mtx(A.svg, 320, 340, same ? 'same point' : (Q.val(it.a) < Q.val(it.b) ? 'left' : 'right') + ' is ' + (Q.val(it.a) < Q.val(it.b) ? 'smaller' : 'bigger'), { 'font-size': 22, fill: C.muted, class: 'fade' });
  }
};

/* RN2 add or subtract fractions */
const T_ADDF = {
  id: 'addf', code: 'RN2', name: 'Add fractions', sec: 2, q: 'Calculate', kind: 'slots',
  gen: MODEL.genAddF,
  prompt: it => rnHTML(Q.q(it.a, it.b)) + ' ' + it.op + ' ' + par(Q.q(it.c, it.d)),
  slots: valSlot, check: MODEL.checkAddF, answer: it => ({ v: it.v }),
  draw(A, it, V) {
    const x = Q.q(it.a, it.b), y = Q.q(it.c, it.d), vals = [0, Q.val(x), Q.val(it.v)];
    let lo = Math.floor(Math.min(...vals)), hi = Math.ceil(Math.max(...vals)); if (hi - lo < 2) { lo -= 1; hi += hi - lo < 2 ? 1 : 0; }
    const sub = (hi - lo) * it.L <= 96 ? it.L : 1;
    const X = line(A, lo, hi, sub, 260);
    dotAt(A, X(x), 260, C.blue); rnSVG(A, X(x), 320, x, 'frac', { 'font-size': 22, fill: C.blue });
    if (V.phase === 'ask') return;
    const A1 = it.a * it.L / it.b, C1 = it.c * it.L / it.d, step = it.op === '+' ? C1 : -C1;
    if (it.b !== it.L) {
      A.frac(A.svg, X(x), 372, (A1 < 0 ? '−' : '') + Math.abs(A1), String(it.L), { 'font-size': 20, fill: C.blue, class: 'fade' });
      A.mtx(A.svg, X(x) - 30, 372, '=', { 'font-size': 20, fill: C.blue, class: 'fade' });
    }
    const end = X(it.v);
    jump(A, X(x), end, 248, C.gold, 90);
    A.frac(A.svg, (X(x) + end) / 2, 150, (step < 0 ? '−' : '+') + Math.abs(C1), String(it.L), { 'font-size': 22, fill: C.gold, class: 'fade' });
    A.tx(A.svg, 70, 40, 'LCD ' + it.L + ': ticks are 1/' + it.L + 's', { 'font-size': 16, fill: C.muted, 'text-anchor': 'start', class: 'fade' });
    if (done(V)) { dotAt(A, end, 260, C.green, 'pop'); A.frac(A.svg, end, 66, String(A1 + step).replace('-', '−'), String(it.L), { 'font-size': 26, fill: C.green, class: 'pop' }); }
  }
};

/* RN2 signs with decimals */
const T_SIGNS = {
  id: 'signs', code: 'RN2', name: 'Signs', sec: 2, q: 'Calculate', kind: 'slots',
  gen: MODEL.genSigns, typeOf: it => it.op + (Q.val(it.b) < 0 ? "neg" : "pos"),
  prompt: it => MODEL.decStr(it.a) + ' ' + it.op + ' ' + (Q.val(it.b) < 0 ? '(' + MODEL.decStr(it.b) + ')' : MODEL.decStr(it.b)),
  slots: valSlot, check: MODEL.checkSigns, answer: it => ({ v: MODEL.decStr(it.v).replace('−', '-') }),
  draw(A, it, V) {
    const vals = [0, Q.val(it.a), Q.val(it.v)]; let lo = Math.floor(Math.min(...vals)) - 1, hi = Math.ceil(Math.max(...vals)) + 1;
    const X = line(A, lo, hi, 1, 260, { every: hi - lo > 14 ? 2 : 1 });
    dotAt(A, X(it.a), 260, C.blue); A.mtx(A.svg, X(it.a), 312, MODEL.decStr(it.a), { 'font-size': 20, fill: C.blue });
    if (V.phase === 'ask') return;
    const move = it.op === '+' ? it.b : Q.neg(it.b), flip = it.op === '−' && Q.val(it.b) < 0;
    const lab = flip ? '− (' + MODEL.decStr(it.b) + ') → + ' + MODEL.decStr(Q.neg(it.b)) : (Q.val(move) < 0 ? '− ' : '+ ') + MODEL.decStr(absQ(move));
    const g = A.el('g', { class: 'pop' }, A.svg), w = 30 + lab.length * 11;
    A.el('rect', { x: 320 - w / 2, y: 54, width: w, height: 40, rx: 20, fill: '#2a2110', stroke: C.gold, 'stroke-width': 2 }, g);
    A.mtx(g, 320, 75, lab, { 'font-size': 22, fill: C.gold });
    jump(A, X(it.a), X(it.v), 248, C.gold, 100);
    A.el('path', { d: 'M320 96L' + (X(it.a) + X(it.v)) / 2 + ' 196', stroke: C.gold, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', class: 'fade' }, A.svg);
    if (done(V)) { dotAt(A, X(it.v), 260, C.green, 'pop'); A.mtx(A.svg, X(it.v), 340, MODEL.decStr(it.v), { 'font-size': 26, fill: C.green, class: 'pop' }); }
  }
};

/* RN3 multiply: sign rule beside an area model */
function signs(A, x, y, s1, s2, show) {
  const S = s => s < 0 ? '(−)' : '(+)';
  A.mtx(A.svg, x, y, S(s1) + ' × ' + S(s2) + ' = ' + (show ? S(s1 * s2) : '?'), { 'font-size': 26, fill: show ? (s1 * s2 < 0 ? C.red : C.green) : C.muted });
}
const T_MUL = {
  id: 'mul', code: 'RN3', name: 'Multiply', sec: 3, q: 'Calculate', kind: 'slots',
  gen: MODEL.genMul, typeOf: it => Math.sign(it.x.n) * Math.sign(it.y.n) < 0 ? "neg" : "pos", prompt: it => rnHTML(it.x) + ' × ' + par(it.y),
  slots: valSlot, check: MODEL.checkMul, answer: it => ({ v: it.v }),
  draw(A, it, V) {
    const x0 = 320, y0 = 80, S = 260, cx = Math.abs(it.x.n), dx = it.x.d, cy = Math.abs(it.y.n), dy = it.y.d, hint = V.phase !== 'ask';
    signs(A, 160, 210, Math.sign(it.x.n), Math.sign(it.y.n), hint);
    A.el('rect', { x: x0, y: y0, width: S, height: S, fill: 'none', stroke: C.text, 'stroke-width': 2 }, A.svg);
    for (let i = 1; i < dx; i++) A.el('line', { x1: x0 + i * S / dx, x2: x0 + i * S / dx, y1: y0, y2: y0 + S, stroke: C.grid2, 'stroke-width': 1 }, A.svg);
    for (let j = 1; j < dy; j++) A.el('line', { x1: x0, x2: x0 + S, y1: y0 + j * S / dy, y2: y0 + j * S / dy, stroke: C.grid2, 'stroke-width': 1 }, A.svg);
    A.frac(A.svg, x0 + cx * S / dx / 2, y0 - 30, String(cx), String(dx), { 'font-size': 20, fill: C.blue });
    A.frac(A.svg, x0 - 28, y0 + cy * S / dy / 2, String(cy), String(dy), { 'font-size': 20, fill: C.gold });
    if (!hint) return;
    A.el('rect', { x: x0, y: y0, width: cx * S / dx, height: S, fill: C.blue, 'fill-opacity': .18, class: 'fade' }, A.svg);
    A.el('rect', { x: x0, y: y0, width: S, height: cy * S / dy, fill: C.gold, 'fill-opacity': .18, class: 'fade' }, A.svg);
    A.el('rect', { x: x0, y: y0, width: cx * S / dx, height: cy * S / dy, fill: C.green, 'fill-opacity': .45, stroke: C.green, 'stroke-width': 2, class: 'fade' }, A.svg);
    if (done(V)) { A.frac(A.svg, 160, 300, String(cx * cy), String(dx * dy), { 'font-size': 28, fill: C.green, class: 'pop' }); A.mtx(A.svg, 160, 360, '= ' + Q.str(it.v), { 'font-size': 26, fill: C.green, class: 'fade' }); }
  }
};

/* RN4 divide: flip the second, and how many pieces fit */
const T_DIV = {
  id: 'div', code: 'RN4', name: 'Divide', sec: 4, q: 'Calculate', kind: 'slots',
  gen: MODEL.genDiv, typeOf: it => Math.sign(it.x.n) * Math.sign(it.y.n) < 0 ? "neg" : "pos", prompt: it => rnHTML(it.x) + ' ÷ ' + par(it.y),
  slots: valSlot, check: MODEL.checkDiv, answer: it => ({ v: it.v }),
  draw(A, it, V) {
    rnSVG(A, 150, 80, it.x, 'frac', { 'font-size': 34 }); A.mtx(A.svg, 220, 80, '÷', { 'font-size': 34 }); rnSVG(A, 290, 80, it.y, 'frac', { 'font-size': 34, fill: C.gold });
    if (V.phase === 'ask') return;
    const r = Q.div(1, it.y);
    A.mtx(A.svg, 360, 80, '→', { 'font-size': 32, fill: C.muted, class: 'fade' });
    rnSVG(A, 430, 80, it.x, 'frac', { 'font-size': 34, class: 'fade' }); A.mtx(A.svg, 494, 80, '×', { 'font-size': 34, fill: C.gold, class: 'fade' });
    rnSVG(A, 560, 80, r, 'frac', { 'font-size': 34, fill: C.gold, class: 'pop' });
    A.el('path', { d: 'M300 120Q430 170 556 122', stroke: C.gold, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '5 5', 'marker-end': 'url(#aG)', class: 'fade' }, A.svg);
    A.tx(A.svg, 430, 166, 'flip', { 'font-size': 16, fill: C.gold, class: 'fade' });
    // measuring bar: how many |y| fit in |x|
    const ax = Q.val(absQ(it.x)), ay = Q.val(absQ(it.y)), s = 480 / Math.max(ax, ay * Math.ceil(ax / ay)), y0 = 250;
    A.el('rect', { x: 80, y: y0, width: ax * s, height: 34, rx: 6, fill: C.blue, 'fill-opacity': .25, stroke: C.blue, 'stroke-width': 2 }, A.svg);
    const k = Math.ceil(ax / ay - 1e-9);
    A.mtx(A.svg, 66, y0 + 17, Q.str(absQ(it.x)), { 'font-size': 20, fill: C.blue, 'text-anchor': 'end' });
    A.mtx(A.svg, 66, y0 + 58, Q.str(absQ(it.y)), { 'font-size': 20, fill: C.gold, 'text-anchor': 'end' });
    for (let i = 0; i < k; i++) {
      const g = A.el('g', { class: 'pop', style: 'animation-delay:' + i * 120 + 'ms' }, A.svg), fit = Math.min(ay, ax - i * ay);
      A.el('rect', { x: 80 + i * ay * s, y: y0 + 44, width: ay * s - 3, height: 28, rx: 6, fill: 'none', stroke: C.gold, 'stroke-width': 2, 'stroke-dasharray': fit < ay - 1e-9 ? '5 4' : null }, g);
      A.el('rect', { x: 80 + i * ay * s, y: y0 + 44, width: Math.max(0, fit * s - 3), height: 28, rx: 6, fill: C.gold, 'fill-opacity': .35 }, g);
    }
    if (done(V)) A.mtx(A.svg, 320, 372, Q.str(absQ(it.x)) + ' holds ' + Q.str(absQ(it.v)) + ' of ' + Q.str(absQ(it.y)) + '  →  ' + Q.str(it.v), { 'font-size': 24, fill: C.green, class: 'fade' });
  }
};

/* RN4 bigger or smaller? */
const T_BIG = {
  id: 'big', code: 'RN4', name: 'Bigger?', sec: 4, q: it => 'Bigger or smaller than ' + it.n + '?', kind: 'choice',
  gen: MODEL.genBig, typeOf: it => it.op + (Q.val(it.f) < 1 ? "<1" : ">1"), prompt: it => it.n + ' ' + it.op + ' ' + rnHTML(it.f),
  choices: () => [{ v: 'bigger', label: 'Bigger' }, { v: 'smaller', label: 'Smaller' }],
  check: MODEL.checkBig, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    const vmax = Math.max(it.n, Q.val(it.v)), s = 480 / vmax, bar = (y, len, col, lab, cls) => {
      A.el('rect', { x: 80, y, width: len * s, height: 40, rx: 6, fill: col, 'fill-opacity': .22, stroke: col, 'stroke-width': 2, class: cls || null }, A.svg);
      for (let i = 1; i < len; i++) if (i * s < len * s - 2) A.el('line', { x1: 80 + i * s, x2: 80 + i * s, y1: y, y2: y + 40, stroke: col, 'stroke-opacity': .5 }, A.svg);
      A.mtx(A.svg, 70, y + 20, lab, { 'font-size': 24, fill: col, 'text-anchor': 'end' });
    };
    bar(140, it.n, C.blue, String(it.n));
    if (V.phase === 'ask') return;
    bar(240, Q.val(it.v), C.green, Q.str(it.v), 'fade');
    A.el('line', { x1: 80 + it.n * s, x2: 80 + it.n * s, y1: 120, y2: 300, stroke: C.blue, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, A.svg);
    A.mtx(A.svg, 320, 352, it.n + ' ' + it.op + ' ' + Q.str(it.f) + ' = ' + Q.str(it.v), { 'font-size': 26, fill: C.green, class: 'fade' });
  }
};

/* RN5 order of operations: which step first? */
const tokS = (ts, i) => { const t = ts[i]; if (t.t === '(') return '('; if (t.t === ')') return ')'; if (t.t === '^') return '²'; if (t.t === 'op') return t.o; const v = t.v, s = Q.str(v); return ts.length > 1 && ((Q.val(v) < 0 && i > 0) || v.d > 1) ? '(' + s + ')' : s; };
const optLabel = (ts, i) => ts[i].t === '^' ? tokS(ts, i - 1) + '²' : tokS(ts, i - 1) + ' ' + ts[i].o + ' ' + tokS(ts, i + 1);
function exprRow(A, ts, y, fs, hiFrom, hiTo, col, cls) {
  const g = A.el('g', { class: cls || null }, A.svg), parts = []; let x = 0;
  ts.forEach((t, i) => { const s = tokS(ts, i), e = A.mtx(g, 0, y, s, { 'font-size': t.t === '^' ? fs * .7 : fs, 'text-anchor': 'start', dy: t.t === '^' ? -fs * .35 : null }); const w = e.getComputedTextLength ? e.getComputedTextLength() : s.length * fs * .5; parts.push({ e, x, w }); x += w + (t.t === '(' || (ts[i + 1] && (ts[i + 1].t === ')' || ts[i + 1].t === '^')) ? 3 : fs * .3); });
  const total = x, off = 320 - total / 2;
  parts.forEach((p, i) => { p.e.setAttribute('x', off + p.x); if (ts[i].t === 'op') p.e.setAttribute('x', off + p.x); });
  if (hiFrom != null) {
    const a = parts[hiFrom], b = parts[hiTo];
    const r = A.el('rect', { x: off + a.x - 6, y: y - fs * .7, width: b.x + b.w - a.x + 12, height: fs * 1.4, rx: 8, fill: col, 'fill-opacity': .15, stroke: col, 'stroke-width': 2 }, g);
    g.insertBefore(r, g.firstChild);
  }
  return g;
}
const T_ORDER = {
  id: 'order', code: 'RN5', name: 'First step', sec: 5, q: 'Which step first?', kind: 'choice',
  gen: MODEL.genOrder, typeOf: it => it.ts.map(t => t.t === "op" ? t.o : t.t).join(""),
  choices: it => it.opts.map(i => ({ v: String(i), label: '<span class="math">' + optLabel(it.ts, i) + '</span>', aria: optLabel(it.ts, i) })),
  check: MODEL.checkOrder, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    const n = it.steps.length, gap = Math.min(66, 300 / Math.max(1, n - 1));
    if (V.phase === 'ask') { exprRow(A, it.ts, 120, 44); return; }
    const pick = V.resp.v != null ? +V.resp.v : null;
    it.steps.forEach((ts, k) => {
      if (k === n - 1) { exprRow(A, ts, 60 + k * gap, 34, 0, 0, C.green, 'fade'); return; }
      const i = MODEL.firstOp(ts), from = ts[i].t === '^' ? i - 1 : i - 1, to = ts[i].t === '^' ? i : i + 1;
      exprRow(A, ts, 60 + k * gap, k ? 30 : 36, from, to, C.yellow, k ? 'fade' : null);
    });
    if (pick != null && String(pick) !== it.ans) {
      const g = exprRow(A, it.ts, 60, 36, it.ts[pick].t === '^' ? pick - 1 : pick - 1, it.ts[pick].t === '^' ? pick : pick + 1, C.red);
      g.querySelectorAll('text').forEach(t => t.setAttribute('opacity', 0));
    }
  }
};

const PAGE = {
  key: 'math9-rational-numbers-trainer-v1', course: 'Math 9 · Number', title: 'Rational Numbers',
  notes: '../notes/rational-numbers/math9-rational-numbers-notes-v1.html',
  tabs: [T_CMP, T_ADDF, T_SIGNS, T_MUL, T_DIV, T_BIG, T_ORDER]
};
DRILL.boot(PAGE);
