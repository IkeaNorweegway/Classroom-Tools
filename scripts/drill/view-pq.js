/* ===================== PAGE: pictures and tabs ===================== */
const { C, fracHTML, mathHTML } = DRILL;
const M = MODEL, LET = M.LET, $m = M.money;
const done = V => V.phase === 'right' || V.phase === 'show';
const after = V => V.phase !== 'ask';
const code = V => V.res && V.res.code;
const lab = (A, x, y, s, col, a) => A.tx(A.svg, x, y, s, Object.assign({ 'font-size': 18, fill: col || C.text }, a || {}));
const mlab = (A, x, y, s, col, a) => A.mtx(A.svg, x, y, s, Object.assign({ 'font-size': 22, fill: col || C.text }, a || {}));
const emo = (A, x, y, s, size) => A.tx(A.svg, x, y, s, { 'font-size': size || 34, class: 'emo' });
const box = (A, x, y, w, h, col, a) => A.el('rect', Object.assign({ x, y, width: Math.max(0, w), height: h, rx: 6, fill: col, 'fill-opacity': .22, stroke: col, 'stroke-width': 2 }, a || {}), A.svg);
const line = (A, x1, y1, x2, y2, col, w, a) => A.el('line', Object.assign({ x1, y1, x2, y2, stroke: col, 'stroke-width': w || 2 }, a || {}), A.svg);
const dot = (A, x, y, r, col, a) => A.el('circle', Object.assign({ cx: x, cy: y, r, fill: col }, a || {}), A.svg);
const fade = (i, a) => Object.assign({ class: 'fade', style: 'animation-delay:' + (i || 0) * 90 + 'ms' }, a || {});
const glow = { filter: 'url(#glow)', 'stroke-width': 4 };
function brace(A, x1, x2, y, s, col, up) {
  const d = up ? -1 : 1, m = (x1 + x2) / 2;
  A.el('path', { d: 'M' + x1 + ' ' + y + 'q0 ' + 8 * d + ' 8 ' + 8 * d + 'H' + (m - 8) + 'q8 0 8 ' + 8 * d + 'q0 ' + -8 * d + ' 8 ' + -8 * d + 'H' + (x2 - 8) + 'q8 0 8 ' + -8 * d, stroke: col || C.muted, 'stroke-width': 2, fill: 'none' }, A.svg);
  if (s != null) lab(A, m, y + 32 * d, s, col || C.muted, { 'font-size': 19 });
}
// A column of lines; k = how many to show. The last one shown can take its own colour.
function panel(A, x, y, lines, gap, size) {
  lines.forEach((l, i) => { if (!l) return; const [s, col] = Array.isArray(l) ? l : [l, C.text]; mlab(A, x, y + i * (gap || 34), s, col, fade(i, { 'font-size': size || 20 })); });
}

/* ---------- prompt text ---------- */
// a/b and (a)/(b) as stacked fractions; single letters in italics (outside tags).
function mathText(s) {
  s = String(s).replace(/\(([^()]+)\)\/\(([^()]+)\)/g, (m, a, b) => fracHTML(a, b)).replace(/([\w.]+)\/(\d+)/g, (m, a, b) => fracHTML(a, b));
  return s.split(/(<[^>]+>)/).map(p => p[0] === '<' ? p : mathHTML(p)).join('');
}

/* ---------- worked steps: the picture for a computation ---------- */
function steps(A, it, V) {
  const L = it.steps, k = done(V) ? L.length : after(V) ? Math.min(2, L.length) : 1, n = L.length;
  const long = Math.max(...L.map(s => s.length)), fs = Math.min(32, 560 / (long * .52)), gap = Math.min(fs * 1.8, 330 / n), y0 = 210 - gap * (n - 1) / 2;
  L.slice(0, k).forEach((s, i) => {
    const col = i === 0 ? C.text : done(V) && i === n - 1 ? C.green : !done(V) && i === k - 1 ? C.yellow : C.muted;
    mlab(A, 320, y0 + i * gap, s, col, fade(i, { 'font-size': fs }));
  });
  if (V.phase === 'wrong') lab(A, 320, 395, 'first step', C.yellow, { 'font-size': 15 });
}

/* ---------- number lines ---------- */
function axis(A, x0, x1, y, lo, hi, step, labEvery) {
  const X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
  line(A, x0 - 14, y, x1 + 14, y, C.axis, 2.5, { 'marker-end': 'url(#aA)', 'marker-start': 'url(#aAs)' });
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) {
    const big = Math.abs(v / labEvery - Math.round(v / labEvery)) < 1e-9;
    line(A, X(v), y - (big ? 9 : 5), X(v), y + (big ? 9 : 5), C.axis, 1.5);
    if (big) lab(A, X(v), y + 26, String(Math.round(v * 100) / 100).replace('-', '−'), C.tick, { 'font-size': 14 });
  }
  return X;
}
const PICS = {};
PICS.squares = (A, it, V) => {
  const lo0 = Math.max(0, Math.floor((it.lo - 12) / 10) * 10), hi0 = Math.ceil((it.hi + 12) / 10) * 10, span = hi0 - lo0;
  const X = axis(A, 50, 590, 240, lo0, hi0, span > 150 ? 10 : 5, span > 150 ? 50 : 20);
  [it.lo, it.hi].forEach((b, i) => {
    line(A, X(b), 150, X(b), 252, C.yellow, 3);
    lab(A, X(b), 130, String(b), C.yellow, { 'font-size': 22 });
    if (after(V)) lab(A, X(b), 300, '√' + b + ' ≈ ' + Math.sqrt(b).toFixed(1), C.muted, fade(i, { 'font-size': 16 }));
  });
  if (!done(V)) { lab(A, 320, 60, 'perfect squares between ' + it.lo + ' and ' + it.hi + '?', C.muted, { 'font-size': 17 }); return; }
  let k = 0, first = null, last = null;
  for (let r = 1; r * r <= hi0; r++) {
    const v = r * r; if (v < lo0) continue;
    const inside = v > it.lo && v < it.hi; if (inside) { first = first == null ? v : first; last = v; }
    dot(A, X(v), 240, 7, inside ? C.green : C.muted, fade(k, { 'fill-opacity': inside ? 1 : .5 }));
    lab(A, X(v), k % 2 ? 182 : 206, r + '²', inside ? C.green : C.muted, fade(k, { 'font-size': 14 }));
    k++;
  }
  if (first != null) brace(A, X(first) - 6, X(last) + 6, 330, it.a + ' perfect squares', C.green);
};
PICS.between = (A, it, V) => {
  const X = axis(A, 50, 590, 220, 45, 95, 1, 5), lo = it.lo * it.lo, hi = it.hi * it.hi;
  it.vals.forEach((v, i) => {
    const inside = v > lo && v < hi, col = done(V) ? (inside ? C.green : C.muted) : C.blue;
    dot(A, X(v), 220, 7, col);
    lab(A, X(v), i % 2 ? 158 : 182, '√' + v, col, { 'font-size': 17 });
  });
  if (!after(V)) { lab(A, 320, 70, 'each √ sits at its number', C.muted, { 'font-size': 16 }); return; }
  [[lo, it.lo], [hi, it.hi]].forEach(([b, r], i) => {
    line(A, X(b), 130, X(b), 232, C.yellow, 3, fade(i));
    lab(A, X(b), 290 + i * 30, r + '² = ' + Math.round(b * 100) / 100, C.yellow, fade(i, { 'font-size': 18 }));
  });
  if (done(V)) { const ins = it.vals.filter(v => v > lo && v < hi); brace(A, X(ins[0]) - 6, X(ins[ins.length - 1]) + 6, 100, ins.length + ' are between', C.green, true); }
};
PICS.order4 = (A, it, V) => {
  const cards = [['(−2)²', 4], ['−1²', -1], ['(−1)²', 1], ['−2²', -4]], X = axis(A, 80, 560, 290, -5, 5, 1, 1);
  cards.forEach(([s, v], i) => {
    const x = 125 + i * 130;
    A.el('rect', { x: x - 52, y: 70, width: 104, height: 50, rx: 10, fill: C.panel, stroke: C.edge, 'stroke-width': 2 }, A.svg);
    mlab(A, x, 95, s, C.text, { 'font-size': 26 });
    if (after(V)) mlab(A, x, 150, '= ' + String(v).replace('-', '−'), v < 0 && s[0] === '−' ? C.yellow : C.muted, fade(i, { 'font-size': 20 }));
    if (done(V)) { A.el('path', { d: 'M' + x + ' 166 L' + X(v) + ' 278', stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', fill: 'none' }, A.svg); dot(A, X(v), 290, 8, C.green, fade(i)); }
  });
  if (V.phase === 'wrong') mlab(A, 320, 370, '−2² = −(2 × 2) = −4', C.yellow, { 'font-size': 20 });
  if (done(V)) lab(A, 320, 370, 'least → greatest: −2², −1², (−1)², (−2)²', C.green, { 'font-size': 18 });
};
PICS.ineq = (A, it, V) => {
  panel(A, 320, 70, [['−3x + 7 > −17', C.text], after(V) ? ['−3x > −24', C.muted] : null, after(V) ? ['÷ (−3): the sign flips', C.yellow] : null, done(V) ? ['x < 8', C.green] : null], 38, 24);
  const X = axis(A, 70, 570, 300, 0, 14, 1, 2);
  if (!done(V)) return;
  line(A, X(8) - 10, 300, X(0) - 12, 300, C.green, 7, { 'marker-end': 'url(#aN)', class: 'fade' });
  dot(A, X(8), 300, 10, C.stage, { stroke: C.green, 'stroke-width': 3 });
  lab(A, X(8), 268, 'open: 8 is not in', C.green, { 'font-size': 14 });
};

/* ---------- money, trips and tapes ---------- */
PICS.trip = (A, it, V) => {
  const D = it.d[0] + it.d[1], x0 = 70, W = 500, px = W / D, y = 190, xm = x0 + it.d[0] * px, cols = [C.blue, C.gold];
  emo(A, x0 - 20, y - 50, it.icon, 36);
  [[x0, xm], [xm, x0 + W]].forEach(([a, b], i) => {
    line(A, a, y, b, y, cols[i], 12);
    const m = (a + b) / 2;
    lab(A, m, y - 30, it.sp[i] + ' km/h', cols[i], { 'font-size': 19 });
    lab(A, m, y + 32, it.tt[i], C.text, { 'font-size': 20 });
    if (after(V)) lab(A, m, y + 66, done(V) ? it.sp[i] + ' × ' + it.tt[i].replace(' h', '') + ' = ' + it.d[i] + ' km' : 'speed × time', done(V) ? cols[i] : C.muted, fade(i, { 'font-size': 18 }));
  });
  dot(A, x0, y, 9, C.text); line(A, x0 + W, y - 40, x0 + W, y + 10, C.text, 3);
  A.el('path', { d: 'M' + (x0 + W) + ' ' + (y - 40) + 'h26l-8 9l8 9h-26', fill: C.green }, A.svg);
  if (done(V)) brace(A, x0, x0 + W, y + 100, it.d[0] + ' + ' + it.d[1] + ' = ' + (it.d[0] + it.d[1]).toFixed(1) + ' km', C.green);
};
PICS.phone = (A, it, V) => {
  const segs = [['fee', '$5.00', 5, C.teal, ''], ['33 texts', '× $0.05', 1.65, C.gold, '$1.65'], ['47 minutes', '× $0.06', 2.82, C.blue, '$2.82']];
  const x0 = 60, W = 520, y = 150, h = 84, ws = [190, 160, 170];
  emo(A, 40, 60, '📱', 38);
  let x = x0;
  segs.forEach(([a, b, v, col, prod], i) => {
    const w = ws[i]; box(A, x, y, w, h, col, code(V) === [null, 'o2', 'o1'][i] ? glow : {});
    lab(A, x + w / 2, y + 28, a, col, { 'font-size': 17 }); lab(A, x + w / 2, y + 56, b, C.text, { 'font-size': 19 });
    if (i && after(V)) lab(A, x + w / 2, y + h + 30, '= ' + prod, done(V) ? col : C.yellow, fade(i, { 'font-size': 19 }));
    x += w;
  });
  if (code(V) === 'o0') lab(A, 320, y + h + 70, '0.05 + 0.06 counts one text, one minute', C.red, { 'font-size': 16 });
  brace(A, x0, x0 + W, y - 14, done(V) ? '5.00 + 1.65 + 2.82 = $9.47' : 'bill = ?', done(V) ? C.green : C.text, true);
};
// A goal bar: what you have, then chunks of the rate until you reach the goal.
function saveBar(A, V, o) {
  const x0 = 60, W = 500, y = o.y || 170, h = 60, top = Math.max(o.goal, o.have + o.n * o.rate), px = W / top;
  const gx = x0 + o.goal * px, hx = x0 + o.have * px, cw = o.rate * px;
  A.el('rect', { x: x0, y, width: gx - x0, height: h, rx: 6, fill: 'none', stroke: C.edge, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, A.svg);
  if (o.have) { box(A, x0, y, hx - x0, h, C.green, V.res && /Take off/.test(V.res.cue || '') ? glow : {}); if (hx - x0 > 40) lab(A, (x0 + hx) / 2, y + h / 2, $m(o.have), C.text, { 'font-size': 17 }); lab(A, (x0 + hx) / 2, y + h + 22, 'has', C.green, { 'font-size': 14 }); }
  line(A, gx, y - 40, gx, y + h + 10, C.yellow, 3);
  if (o.icon) emo(A, gx, y - 62, o.icon, 32);
  lab(A, gx, y + h + 28, $m(o.goal), C.yellow, { 'font-size': 18 });
  if (!done(V)) {
    box(A, hx, y, cw, h, C.gold, { 'stroke-dasharray': '5 4' });
    lab(A, hx + 10, y - 20, '+ ' + $m(o.rate) + ' each ' + o.each, C.gold, { 'font-size': 16, 'text-anchor': 'start' });
    brace(A, hx, gx, y + h + 44, after(V) ? $m(o.goal) + ' − ' + $m(o.have) + ' = ' + $m(M.r2(o.goal - o.have)) : '?', after(V) ? C.yellow : C.muted);
    return;
  }
  for (let i = 0; i < o.n; i++) {
    const last = i === o.n - 1;
    A.el('rect', { x: hx + i * cw + 1, y, width: Math.max(1, cw - 2), height: h, rx: 3, fill: last ? C.green : C.gold, 'fill-opacity': i % 2 ? .42 : .28, stroke: last ? C.green : C.gold, 'stroke-width': 1.5, class: 'fade', style: 'animation-delay:' + i * 35 + 'ms' }, A.svg);
  }
  lab(A, (hx + hx + o.n * cw) / 2, y - 20, o.n + ' ' + o.each + 's', C.green, { 'font-size': 18 });
  const q = (o.goal - o.have) / o.rate;
  brace(A, hx, gx, y + h + 44, $m(M.r2(o.goal - o.have)) + ' ÷ ' + $m(o.rate) + ' = ' + (Number.isInteger(q) ? q : q.toFixed(2) + ' → ' + o.n), C.green);
}
PICS.save = (A, it, V) => saveBar(A, V, it);
PICS.save20 = (A, it, V) => {
  const x0 = 60, y = 46, w = 330, h = 50, p = w * .2;
  lab(A, x0, y - 14, 'one week’s pay', C.blue, { 'font-size': 14, 'text-anchor': 'start' });
  box(A, x0, y, w, h, C.blue); box(A, x0, y, p, h, C.gold, { 'fill-opacity': .4 });
  lab(A, x0 + p / 2, y + h / 2, '20%', C.text, { 'font-size': 16 }); lab(A, x0 + w - 40, y + h / 2, '$576', C.text, { 'font-size': 17 });
  lab(A, x0 + w + 20, y + h / 2, after(V) ? '20% of $576 = $115.20' : 'saved: ?', after(V) ? C.gold : C.muted, { 'font-size': 17, 'text-anchor': 'start' });
  saveBar(A, V, { y: 220, have: 0, goal: 1200, rate: 115.2, n: 11, icon: '🎯', each: 'week' });
  if (done(V)) lab(A, 320, 395, '10 weeks is only $1152: round up', C.muted, { 'font-size': 15 });
};
PICS.dale = (A, it, V) => {
  const x0 = 60, W = 520, y = 170, h = 64, px = W / 180, cx = x0 + 45 * px;
  brace(A, x0, x0 + W, y - 14, '$180 earned', C.text, true);
  box(A, x0, y, cx - x0, h, C.teal, code(V) === 'm1' || code(V) === 'm2' ? glow : {}); lab(A, (x0 + cx) / 2, y + 22, 'cars', C.teal, { 'font-size': 15 }); lab(A, (x0 + cx) / 2, y + 44, '$45', C.text, { 'font-size': 18 });
  emo(A, (x0 + cx) / 2, y + h + 34, '🚗', 26);
  if (!done(V)) {
    A.el('rect', { x: cx, y, width: x0 + W - cx, height: h, rx: 6, fill: C.green, 'fill-opacity': .08, stroke: C.green, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, A.svg);
    lab(A, (cx + x0 + W) / 2, y + h / 2, after(V) ? '$180 − $45 = $135' : 'lawns × $9', after(V) ? C.yellow : C.green, { 'font-size': 19 });
  } else {
    for (let i = 0; i < 15; i++) A.el('rect', { x: cx + i * 9 * px + 1, y, width: 9 * px - 2, height: h, rx: 3, fill: C.green, 'fill-opacity': i % 2 ? .42 : .26, stroke: C.green, 'stroke-width': 1.5, class: 'fade', style: 'animation-delay:' + i * 40 + 'ms' }, A.svg);
    brace(A, cx, x0 + W, y + h + 16, '$135 ÷ $9 = 15 lawns', C.green);
  }
  emo(A, (cx + x0 + W) / 2, y - 60, '🌱', 26);
};
PICS.tix = (A, it, V) => {
  const x0 = 60, W = 520, y = 170, h = 70, aw = Math.max(150, Math.min(300, W * it.ap * it.ad / it.T)), sx = x0 + aw, ad = it.ap * it.ad, rest = it.T - ad;
  emo(A, 44, 66, '🎭', 34);
  brace(A, x0, x0 + W, y - 14, '$' + it.T + ' in all', C.text, true);
  box(A, x0, y, aw, h, C.teal); lab(A, x0 + aw / 2, y + 24, it.ad + ' adults', C.teal, { 'font-size': 16 }); lab(A, x0 + aw / 2, y + 48, '× $' + it.ap, C.text, { 'font-size': 18 });
  box(A, sx, y, x0 + W - sx, h, C.gold, done(V) ? {} : { 'stroke-dasharray': '6 5' });
  lab(A, (sx + x0 + W) / 2, y + 24, (done(V) ? it.st : '?') + ' students', C.gold, { 'font-size': 16 }); lab(A, (sx + x0 + W) / 2, y + 48, '× $' + it.sp, C.text, { 'font-size': 18 });
  if (after(V)) { lab(A, x0 + aw / 2, y + h + 30, '= $' + ad, C.teal, fade(0, { 'font-size': 18 })); lab(A, (sx + x0 + W) / 2, y + h + 30, '$' + it.T + ' − $' + ad + ' = $' + rest, C.yellow, fade(1, { 'font-size': 18 })); }
  if (done(V)) lab(A, 320, y + h + 90, '$' + rest + ' ÷ $' + it.sp + ' = ' + it.st + ' student tickets', C.green, fade(2, { 'font-size': 20 }));
};
PICS.plans2 = (A, it, V) => {
  const x0 = 90, W = 500, px = W / 750, rows = [[150, 25, 24, 'Plan 1'], [200, 55, 10, 'Plan 2']];
  brace(A, x0, x0 + W, 64, '$750 horse 🐴', C.text, true);
  rows.forEach(([down, r, n, name], i) => {
    const y = 100 + i * 130, h = 56, dx = x0 + down * px;
    lab(A, x0 - 12, y + h / 2, name, C.text, { 'font-size': 15, 'text-anchor': 'end' });
    box(A, x0, y, dx - x0, h, C.teal); lab(A, (x0 + dx) / 2, y + h / 2, '$' + down, C.text, { 'font-size': 16 });
    if (!done(V)) {
      A.el('rect', { x: dx, y, width: x0 + W - dx, height: h, rx: 6, fill: C.gold, 'fill-opacity': .08, stroke: C.gold, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, A.svg);
      lab(A, (dx + x0 + W) / 2, y + h / 2, '? × $' + r, C.gold, { 'font-size': 18 });
      if (after(V)) lab(A, (dx + x0 + W) / 2, y + h + 26, '$' + (750 - down) + ' ÷ $' + r, C.yellow, fade(i, { 'font-size': 18 }));
    } else {
      for (let k = 0; k < n; k++) A.el('rect', { x: dx + k * r * px + 1, y, width: r * px - 2, height: h, rx: 3, fill: C.gold, 'fill-opacity': k % 2 ? .42 : .26, stroke: C.gold, 'stroke-width': 1.2, class: 'fade', style: 'animation-delay:' + k * 30 + 'ms' }, A.svg);
      lab(A, (dx + x0 + W) / 2, y + h + 26, '$' + (750 - down) + ' ÷ $' + r + ' = ' + n + ' payments', C.gold, fade(i, { 'font-size': 18 }));
    }
  });
  if (done(V)) lab(A, 340, 392, '24 − 10 = 14 fewer payments', C.green, fade(2, { 'font-size': 21 }));
};
PICS.profit = (A, it, V) => {
  const x0 = 110, W = 440, y1 = 100, y2 = 230, h = 56, fw = 130, cw = W * .3 / 1.5;
  lab(A, x0 - 12, y1 + h / 2, 'money in', C.gold, { 'font-size': 15, 'text-anchor': 'end' });
  box(A, x0, y1, W, h, C.gold); mlab(A, x0 + W / 2, y1 + h / 2, '1.5c', C.text);
  lab(A, x0 + W / 2, y1 - 18, '$1.50 for each of c cupcakes', C.muted, { 'font-size': 14 });
  lab(A, x0 - 12, y2 + h / 2, 'costs', C.red, { 'font-size': 15, 'text-anchor': 'end' });
  box(A, x0, y2, fw, h, C.teal, code(V) === 'o1' || code(V) === 'o3' ? glow : {}); mlab(A, x0 + fw / 2, y2 + h / 2, '20', C.text);
  lab(A, x0 + fw / 2, y2 + h + 20, 'once a month', C.teal, { 'font-size': 14 });
  box(A, x0 + fw, y2, cw, h, C.red); mlab(A, x0 + fw + cw / 2, y2 + h / 2, '0.3c', C.text);
  lab(A, x0 + fw + cw / 2, y2 + h + 20, '$0.30 each', C.red, { 'font-size': 14 });
  const px = x0 + fw + cw;
  A.el('rect', { x: px, y: y2, width: x0 + W - px, height: h, rx: 6, fill: C.green, 'fill-opacity': done(V) ? .25 : .06, stroke: C.green, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, A.svg);
  lab(A, (px + x0 + W) / 2, y2 + h / 2, 'profit', C.green, { 'font-size': 18 });
  line(A, x0 + W, y1 + h, x0 + W, y2, C.muted, 1.5, { 'stroke-dasharray': '4 4' });
  if (after(V)) mlab(A, 320, 345, done(V) ? 'profit = 1.5c − (20 + 0.3c)' : 'profit = money in − costs', done(V) ? C.green : C.yellow, fade(0, { 'font-size': 22 }));
};
PICS.bars = (A, it, V) => {
  const rows = it.rows, t = it.t, u = it.unit, maxU = Math.max(...rows.map(r => r[1] * t + Math.max(0, r[2]))), px = 360 / maxU, bw = t * px, x0 = 160;
  const K = rows.reduce((a, r) => a + r[1], 0), adj = rows.reduce((a, r) => a + r[2], 0);
  rows.forEach(([name, k, d], i) => {
    const y = 56 + i * 74, h = 48;
    lab(A, x0 - 14, y + h / 2, name, C.text, { 'font-size': 16, 'text-anchor': 'end' });
    for (let j = 0; j < k; j++) { const cut = j === k - 1 && d < 0 ? -d * px : 0; box(A, x0 + j * bw, y, bw, h, C.gold); if (bw - cut > 40) lab(A, x0 + j * bw + (bw - cut) / 2, y + h / 2, done(V) ? u + t : '?', done(V) ? C.text : C.gold, { 'font-size': 17 }); }
    const end = x0 + k * bw;
    if (d > 0) { box(A, end, y, d * px, h, C.teal); lab(A, end + d * px / 2, y + h / 2, '+' + u + d, C.text, { 'font-size': 15 }); }
    if (d < 0) { A.el('rect', { x: end + d * px, y: y - 4, width: -d * px, height: h + 8, rx: 4, fill: C.stage, 'fill-opacity': .7, stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, A.svg); lab(A, end + d * px / 2, y + h / 2, '−' + u + -d, C.red, { 'font-size': 15 }); }
  });
  const yb = 56 + rows.length * 74;
  lab(A, x0, yb + 6, 'all together: ' + u + it.total, C.text, { 'font-size': 18, 'text-anchor': 'start' });
  if (!after(V)) return;
  const s = adj < 0 ? ' − ' + u + -adj : adj > 0 ? ' + ' + u + adj : '';
  panel(A, 320, yb + 46, [[K + ' blocks' + s + ' = ' + u + it.total, done(V) ? C.muted : C.yellow], done(V) ? [K + ' blocks = ' + u + (it.total - adj), C.muted] : null, done(V) ? ['one block = ' + u + t, C.green] : null], 32, 19);
};
PICS.member = (A, it, V) => {
  const P = A.plane(A.svg, { x0: 80, y0: 36, w: 500, h: 300, xmin: 0, xmax: 13, ymin: 0, ymax: 300, xstep: 1, ystep: 50, labx: 2, laby: 50 });
  lab(A, 560, 370, 'months', C.muted, { 'font-size': 14 }); lab(A, 92, 16, 'total ($)', C.muted, { 'font-size': 14, 'text-anchor': 'start' });
  if (after(V)) line(A, P.X(0), P.Y(75), P.X(12), P.Y(255), done(V) ? C.blue : C.yellow, done(V) ? 3 : 2, done(V) ? {} : { 'stroke-dasharray': '7 6' });
  [[4, 135], [6, 165], [12, 255]].forEach(([x, y], i) => { dot(A, P.X(x), P.Y(y), 7, C.blue); lab(A, P.X(x) + 10, P.Y(y) - 18, '$' + y, C.blue, { 'font-size': 15, 'text-anchor': 'start' }); });
  if (V.phase === 'wrong') lab(A, P.X(0) + 14, P.Y(40), 'back to 0 months?', C.yellow, { 'font-size': 16, 'text-anchor': 'start' });
  if (done(V)) {
    dot(A, P.X(0), P.Y(75), 9, C.green, { filter: 'url(#glow)' });
    lab(A, P.X(0) + 16, P.Y(75) + 2, '$75 at 0 months: the fee', C.green, { 'font-size': 16, 'text-anchor': 'start' });
    lab(A, P.X(8), P.Y(260), '135 − 4 × 15 = 75', C.green, fade(1, { 'font-size': 18 }));
  }
};
PICS.lines = (A, it, V) => {
  const xmax = Math.ceil(it.n * 1.6 / 2) * 2, top = Math.max(it.b1 + it.r1 * xmax, it.b2 + it.r2 * xmax), step = [10, 20, 25, 50, 100, 200, 250, 500].find(s => top / s <= 6), ymax = Math.ceil(top / step) * step;
  const P = A.plane(A.svg, { x0: 80, y0: 30, w: 470, h: 310, xmin: 0, xmax, ymin: 0, ymax, xstep: 1, ystep: step, labx: xmax > 20 ? 5 : 2, laby: step });
  lab(A, 540, 372, it.names[3], C.muted, { 'font-size': 14 });
  [[it.b1, it.r1, C.gold, it.names[0]], [it.b2, it.r2, C.teal, it.names[1]]].forEach(([b, r, col, nm], i) => {
    line(A, P.X(0), P.Y(b), P.X(xmax), P.Y(b + r * xmax), col, 3);
    lab(A, P.X(xmax) + 4, P.Y(b + r * xmax) + (i ? -14 : 14), nm, col, { 'font-size': 14, 'text-anchor': 'end' });
  });
  if (V.phase === 'wrong') lab(A, 320, 400, 'fee gap $' + (it.b1 - it.b2) + ', closes $' + (it.r2 - it.r1) + ' each time', C.yellow, { 'font-size': 16 });
  if (!done(V)) return;
  const cost = it.b1 + it.r1 * it.n;
  line(A, P.X(it.n), P.Y(cost), P.X(it.n), P.Y(0), C.green, 2, { 'stroke-dasharray': '5 4' });
  dot(A, P.X(it.n), P.Y(cost), 9, C.green, { filter: 'url(#glow)' });
  lab(A, P.X(it.n), P.Y(cost) - 22, 'same: $' + cost, C.green, { 'font-size': 16 });
  lab(A, 320, 400, '$' + (it.b1 - it.b2) + ' ÷ $' + (it.r2 - it.r1) + ' = ' + it.n + ' ' + it.names[3], C.green, { 'font-size': 18 });
};
PICS.garden = (A, it, V) => {
  const L = it.w + it.x, s = Math.min(330 / L, 210 / it.w), w = L * s, h = it.w * s, x0 = 250 - w / 2, y0 = 200 - h / 2;
  A.el('rect', { x: x0, y: y0, width: w, height: h, rx: 4, fill: C.green, 'fill-opacity': .14, stroke: C.green, 'stroke-width': 3 }, A.svg);
  emo(A, x0 + w / 2, y0 + h / 2, '🌻', Math.min(40, h * .5));
  mlab(A, x0 + w / 2, y0 - 20, done(V) ? L + ' m' : 'w + ' + it.x, C.gold); mlab(A, x0 + w / 2, y0 + h + 22, done(V) ? L + ' m' : 'w + ' + it.x, C.gold);
  mlab(A, x0 - 14, y0 + h / 2, done(V) ? it.w + ' m' : 'w', C.teal, { 'text-anchor': 'end' }); mlab(A, x0 + w + 14, y0 + h / 2, done(V) ? it.w + ' m' : 'w', C.teal, { 'text-anchor': 'start' });
  lab(A, 250, 385, 'all the way round: ' + it.P + ' m', C.text, { 'font-size': 17 });
  if (!after(V)) return;
  panel(A, 545, 130, [['4w + ' + 2 * it.x + ' = ' + it.P, done(V) ? C.muted : C.yellow], done(V) ? ['4w = ' + (it.P - 2 * it.x), C.muted] : null, done(V) ? ['w = ' + it.w + ' m', C.green] : null], 44, 21);
};

/* ---------- algebra: whose step is wrong ---------- */
PICS.error = (A, it, V) => {
  mlab(A, 320, 48, '3(x² + 4x − 1) − (2x + 5)', C.text, { 'font-size': 24 });
  const cols = [['Robert', ['3x² + 12x − 3', '3x² + 10x + 2'], 1, '−5, not +5'], ['Jacob', ['3x² + 12x − 1', '3x² + 10x − 6'], 0, '3 × (−1) = −3']];
  cols.forEach(([nm, st, bad, why], c) => {
    const x = 170 + c * 300;
    lab(A, x, 102, nm, C.blue, { 'font-size': 18 });
    st.forEach((s, i) => {
      const y = 160 + i * 80, wrong = after(V) && i === bad, first = done(V) && c === 1 && i === 0;
      lab(A, x - 150, y, 'Step ' + (i + 1), C.muted, { 'font-size': 13, 'text-anchor': 'start' });
      if (first) A.el('rect', { x: x - 82, y: y - 24, width: 200, height: 48, rx: 10, fill: 'none', stroke: C.green, 'stroke-width': 3, filter: 'url(#glow)' }, A.svg);
      mlab(A, x + 18, y, s, wrong ? C.red : C.text, { 'font-size': 22 });
      if (wrong) lab(A, x + 18, y + 38, why, C.red, fade(c, { 'font-size': 14 }));
    });
  });
  line(A, 320, 90, 320, 290, C.edge, 2);
  if (done(V)) { lab(A, 320, 335, 'right: 3x² + 12x − 3 − 2x − 5 = 3x² + 10x − 8', C.muted, { 'font-size': 16 }); lab(A, 320, 372, 'Jacob slips in Step 1, before Robert’s Step 2', C.green, { 'font-size': 17 }); }
};

/* ---------- shape and space ---------- */
PICS.rug = (A, it, V) => {
  const s = Math.min(330 / it.L, 260 / it.W), w = it.L * s, h = it.W * s, x0 = 60 + (360 - w) / 2, y0 = 70 + (270 - h) / 2, side = it.side * s;
  A.el('rect', { x: x0, y: y0, width: w, height: h, fill: C.blue, 'fill-opacity': .06, stroke: C.blue, 'stroke-width': 3 }, A.svg);
  lab(A, x0 + w / 2, y0 - 18, it.L + ' m', C.blue); lab(A, x0 - 12, y0 + h / 2, it.W + ' m', C.blue, { 'text-anchor': 'end' });
  const rx = x0 + 3, ry = y0 + h - side - 3;
  A.el('rect', { x: rx, y: ry, width: side, height: side, fill: C.yellow, 'fill-opacity': .22, stroke: C.yellow, 'stroke-width': 3 }, A.svg);
  if (done(V)) for (let i = 1; i < it.side; i++) { line(A, rx + i * s, ry, rx + i * s, ry + side, C.yellow, 1, { 'stroke-opacity': .35 }); line(A, rx, ry + i * s, rx + side, ry + i * s, C.yellow, 1, { 'stroke-opacity': .35 }); }
  lab(A, rx + side / 2, ry + side / 2, it.p + '%', C.yellow, { 'font-size': 18 });
  lab(A, rx + side / 2, y0 + h + 22, done(V) ? it.side + ' m' : '?', done(V) ? C.green : C.yellow, { 'font-size': 20 });
  if (!after(V)) return;
  panel(A, 530, 120, [['room: ' + it.L + ' × ' + it.W + ' = ' + it.L * it.W, C.blue], [it.p + '% of ' + it.L * it.W + ' = ' + it.area, C.yellow], done(V) ? ['√' + it.area + ' = ' + it.side + ' m', C.green] : null], 52, 20);
};
// Unit cubes in an isometric view; faces that touch another cube are not drawn.
PICS.cubes = (A, it, V) => {
  const cubes = it.shape === 'cross' ? [[1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [2, 1, 1], [1, 2, 1], [1, 1, 2]] : [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [0, 0, 1], [0, 0, 2], [0, 0, 3]];
  const has = (x, y, z) => cubes.some(c => c[0] === x && c[1] === y && c[2] === z), s = 46;
  const P = (x, y, z) => [(x - y) * s * .866, (x + y) * s * .5 - z * s];
  const all = []; cubes.forEach(([x, y, z]) => { for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) all.push(P(x + i, y + j, z + k)); });
  const mnx = Math.min(...all.map(p => p[0])), mxx = Math.max(...all.map(p => p[0])), mny = Math.min(...all.map(p => p[1])), mxy = Math.max(...all.map(p => p[1]));
  const ox = 215 - (mnx + mxx) / 2, oy = 215 - (mny + mxy) / 2, pt = (x, y, z) => { const p = P(x, y, z); return (p[0] + ox) + ',' + (p[1] + oy); };
  const face = (pts, fill) => A.el('polygon', { points: pts.map(p => pt(...p)).join(' '), fill, stroke: C.blue, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, A.svg);
  cubes.slice().sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2])).forEach(([x, y, z]) => {
    if (!has(x, y, z + 1)) face([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], '#2b5f6c');
    if (!has(x + 1, y, z)) face([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], '#1d4550');
    if (!has(x, y + 1, z)) face([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], '#163640');
  });
  const L = [['7 cubes, ' + (it.shape === 'cross' ? '56 cm³ in all' : '8 cm³ each'), C.text]];
  if (after(V)) L.push(['one cube: 8 cm³', C.muted], ['edge 2 cm, face 4 cm²', C.yellow]);
  if (done(V)) L.push(['7 × 6 = 42 faces', C.muted], ['6 joins hide 12', C.muted], ['30 faces × 4 = 120 cm²', C.green]);
  panel(A, 520, 70, L, 46, 18);
};
PICS.angles = (A, it, V) => {
  const O = { x: 210, y: 215 }, R = 150, c = 2 * it.ins, P = d => ({ x: O.x + R * Math.cos(d * Math.PI / 180), y: O.y - R * Math.sin(d * Math.PI / 180) });
  const Ap = P(270 - c / 2), Bp = P(270 + c / 2), Cp = P(90), arc = (Q, a1, a2, r, col) => { const p1 = { x: Q.x + r * Math.cos(a1), y: Q.y + r * Math.sin(a1) }, p2 = { x: Q.x + r * Math.cos(a2), y: Q.y + r * Math.sin(a2) }; A.el('path', { d: 'M' + p1.x + ' ' + p1.y + 'A' + r + ' ' + r + ' 0 0 1 ' + p2.x + ' ' + p2.y, stroke: col, 'stroke-width': 3, fill: 'none' }, A.svg); };
  const ang = (Q, T) => Math.atan2(T.y - Q.y, T.x - Q.x);
  A.el('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: C.muted, 'stroke-width': 2 }, A.svg);
  if (it.ctx === 'track') emo(A, Cp.x + 30, Cp.y - 20, '🏃', 28);
  [Ap, Bp].forEach(T => { line(A, O.x, O.y, T.x, T.y, C.gold, 3); line(A, Cp.x, Cp.y, T.x, T.y, C.teal, 3); });
  arc(O, ang(O, Bp), ang(O, Ap), 30, C.gold); arc(Cp, ang(Cp, Bp), ang(Cp, Ap), 46, C.teal);
  [[O, 'O', 0, -18], [Ap, 'A', -16, 14], [Bp, 'B', 16, 14], [Cp, 'C', 0, -20]].forEach(([Q, s, dx, dy]) => { dot(A, Q.x, Q.y, 5, C.text); mlab(A, Q.x + dx, Q.y + dy, s, C.text, { 'font-size': 20 }); });
  const knowC = it.mode === 'toIns', knowI = it.mode === 'toCen', sum = it.sum;
  lab(A, O.x, O.y + 52, done(V) || knowC ? c + '°' : '?', done(V) && !knowC ? C.green : C.gold, { 'font-size': 18 });
  lab(A, Cp.x, Cp.y + 70, done(V) || knowI ? it.ins + '°' : '?', done(V) && !knowI ? C.green : C.teal, { 'font-size': 18 });
  const L = [];
  if (sum) L.push(['∠AOB + ∠ACB = ' + sum + '°', C.text]);
  if (after(V)) L.push(['∠AOB = 2 × ∠ACB', C.yellow]);
  if (done(V) && sum) L.push(['2x + x = ' + sum + '°', C.muted], ['x = ' + it.ins + '°', C.green]);
  else if (done(V)) L.push([knowC ? c + '° ÷ 2 = ' + it.ins + '°' : '2 × ' + it.ins + '° = ' + c + '°', C.green]);
  panel(A, 510, 140, L, 44, 19);
  lab(A, 510, 330, 'central', C.gold, { 'font-size': 15 }); lab(A, 510, 356, 'inscribed', C.teal, { 'font-size': 15 });
};
PICS.gong = (A, it, V) => {
  const k = 8.4, G = { x: 300, y: 285 }, r = 15 * k, d = Math.sqrt(306) * k, N = { x: G.x, y: G.y - d }, sn = 9 / Math.sqrt(306), cs = 15 / Math.sqrt(306);
  const T = [-1, 1].map(s => ({ x: G.x + s * r * sn, y: G.y - r * cs }));
  A.el('circle', { cx: G.x, cy: G.y, r, fill: C.gold, 'fill-opacity': .14, stroke: C.gold, 'stroke-width': 3 }, A.svg);
  A.el('circle', { cx: G.x, cy: G.y, r: r * .55, fill: 'none', stroke: C.gold, 'stroke-opacity': .35, 'stroke-width': 2 }, A.svg);
  T.forEach(t => line(A, N.x, N.y, t.x, t.y, C.muted, 4, { 'stroke-dasharray': '6 3' }));
  A.el('rect', { x: N.x - 4, y: N.y - 16, width: 8, height: 14, fill: C.muted }, A.svg); dot(A, N.x, N.y, 5, C.text);
  lab(A, (N.x + T[0].x) / 2 - 22, (N.y + T[0].y) / 2 - 8, '9 cm', C.muted, { 'font-size': 15 });
  line(A, G.x - r, G.y, G.x + r, G.y, C.gold, 1.5, { 'stroke-dasharray': '5 5' }); lab(A, G.x, G.y + 22, '30 cm', C.gold, { 'font-size': 15 });
  line(A, N.x + 14, N.y + 2, N.x + 14, G.y - r - 2, C.yellow, 2.5, { 'marker-end': 'url(#aY)', 'marker-start': 'url(#aY)' });
  lab(A, N.x + 30, (N.y + G.y - r) / 2, done(V) ? '2.5' : '?', done(V) ? C.green : C.yellow, { 'font-size': 18, 'text-anchor': 'start' });
  if (after(V)) {
    const t = T[1];
    line(A, G.x, G.y, t.x, t.y, C.teal, 3.5, fade(0)); line(A, t.x, t.y, N.x, N.y, C.gold, 3.5, fade(1)); line(A, G.x, G.y, N.x, N.y, C.blue, 3, fade(2, { 'stroke-dasharray': '7 5' }));
    const ux = (G.x - t.x) / r, uy = (G.y - t.y) / r, vx = (N.x - t.x) / (9 * k), vy = (N.y - t.y) / (9 * k), q = 12;
    A.el('path', { d: 'M' + (t.x + ux * q) + ' ' + (t.y + uy * q) + 'l' + vx * q + ' ' + vy * q + 'l' + -ux * q + ' ' + -uy * q, stroke: C.text, 'stroke-width': 2, fill: 'none' }, A.svg);
    lab(A, (G.x + t.x) / 2 + 22, (G.y + t.y) / 2 + 8, '15', C.teal, { 'font-size': 16 });
  }
  const L = [['radius ⟂ tangent', after(V) ? C.yellow : C.muted]];
  if (done(V)) L.push(['9² + 15² = 306', C.muted], ['√306 ≈ 17.49', C.blue], ['17.49 − 15 ≈ 2.5 cm', C.green]);
  if (after(V)) panel(A, 540, 120, L, 44, 18);
};
PICS.sail = (A, it, V) => {
  const k = .93, by = 330, sails = [[110, 112 * k, 45], [330, 280 * k, 112]];
  sails.forEach(([x, h, b], i) => {
    A.el('polygon', { points: x + ',' + (by - h) + ' ' + x + ',' + by + ' ' + (x + b) + ',' + by, fill: C.blue, 'fill-opacity': .22, stroke: C.blue, 'stroke-width': 2.5 }, A.svg);
    A.el('path', { d: 'M' + (x - b * .3 - 10) + ' ' + (by + 6) + 'H' + (x + b + 14) + 'l-14 22H' + (x - b * .3 + 4) + 'z', fill: C.gold, 'fill-opacity': .3, stroke: C.gold, 'stroke-width': 2 }, A.svg);
    line(A, x - 16, by, x - 16, by - h, C.muted, 1.5, { 'marker-end': 'url(#aM)', 'marker-start': 'url(#aM)' });
    lab(A, x - 26, by - h / 2, i ? '280 cm' : done(V) ? '112 cm' : '?', i ? C.text : done(V) ? C.green : C.yellow, { 'font-size': 18, 'text-anchor': 'end' });
  });
  A.el('path', { d: 'M170 ' + (by - 130) + ' Q 240 ' + (by - 240) + ' 316 ' + (by - 250), stroke: C.gold, 'stroke-width': 2.5, fill: 'none', 'marker-end': 'url(#aG)' }, A.svg);
  lab(A, 230, by - 240, '× 2.5', C.gold, { 'font-size': 19 });
  if (V.phase === 'wrong') lab(A, 560, 150, 'going smaller: ÷', C.red, { 'font-size': 18 });
  if (done(V)) lab(A, 540, 200, '280 ÷ 2.5 = 112', C.green, fade(0, { 'font-size': 22 }));
};
PICS.similar = (A, it, V) => {
  const big = [[50, 340], [330, 340], [130, 100]], sm = big.map(([x, y]) => [400 + (x - 50) / 3, 340 - (340 - y) / 3]);
  [[big, ['A', 'B', 'C']], [sm, ['D', 'E', 'F']]].forEach(([T, n]) => {
    A.el('polygon', { points: T.map(p => p.join(',')).join(' '), fill: C.blue, 'fill-opacity': .07, stroke: C.muted, 'stroke-width': 2 }, A.svg);
    line(A, T[0][0], T[0][1], T[2][0], T[2][1], C.blue, 3.5); line(A, T[1][0], T[1][1], T[2][0], T[2][1], C.gold, 3.5);
    [[-14, 14], [14, 14], [0, -18]].forEach(([dx, dy], i) => mlab(A, T[i][0] + dx, T[i][1] + dy, n[i], C.text, { 'font-size': 19 }));
  });
  const mid = (T, a, b, dx, dy) => [(T[a][0] + T[b][0]) / 2 + dx, (T[a][1] + T[b][1]) / 2 + dy];
  mlab(A, ...mid(big, 0, 2, -22, 0), '18', C.blue); mlab(A, ...mid(big, 1, 2, 48, -4), done(V) ? '15' : '2y + 5', done(V) ? C.green : C.gold);
  mlab(A, ...mid(sm, 0, 2, -14, 0), '6', C.blue, { 'font-size': 19 }); mlab(A, ...mid(sm, 1, 2, 16, -2), done(V) ? '5' : 'y', C.gold, { 'font-size': 19 });
  if (!after(V)) return;
  panel(A, 520, 90, [['k = 18 ÷ 6 = 3', C.yellow], done(V) ? ['2y + 5 = 3y', C.muted] : null, done(V) ? ['y = 5', C.muted] : null, done(V) ? ['BC = 2(5) + 5 = 15', C.green] : null], 36, 18);
};
PICS.scale = (A, it, V) => {
  const k = 290 / it.big, hs = Math.max(14, it.o * k), hb = it.big * k, by = 350, show = done(V);
  const known = it.mode === 'sf' ? [true, true] : [show, true];
  [[110, hs, 70, 0], [330, hb, 130, 1]].forEach(([x, h, w, i]) => {
    if (it.mode === 'sf') {
      box(A, x, by - h, w, h, C.blue);
      if (h > 40) for (let r = 0; r < Math.floor(h / 28); r++) for (let c = 0; c < 2; c++) A.el('rect', { x: x + w * (.2 + c * .4), y: by - h + 10 + r * 28, width: w * .2, height: 12, fill: C.yellow, 'fill-opacity': .4 }, A.svg);
    } else {
      const ww = h * .75; box(A, x, by - h, ww, h, C.teal);
      A.el('path', { d: 'M' + (x + 6) + ' ' + (by - 6) + 'L' + (x + ww * .4) + ' ' + (by - h * .55) + 'L' + (x + ww * .6) + ' ' + (by - h * .3) + 'L' + (x + ww * .75) + ' ' + (by - h * .45) + 'L' + (x + ww - 6) + ' ' + (by - 6) + 'z', fill: C.green, 'fill-opacity': .35 }, A.svg);
    }
    lab(A, x - 12, by - h / 2, known[i] ? (i ? it.big : it.o) + ' cm' : '?', !known[i] ? C.yellow : i || !show || it.mode === 'sf' ? C.text : C.green, { 'font-size': 17, 'text-anchor': 'end' });
    lab(A, x + (it.mode === 'sf' ? w : h * .75) / 2, by + 22, i ? (it.mode === 'sf' ? 'real' : 'poster') : (it.mode === 'sf' ? 'model' : 'photo'), C.muted, { 'font-size': 15 });
  });
  lab(A, 250, 60, '× ' + (it.mode === 'sf' && !show ? '?' : it.sf), it.mode === 'sf' && show ? C.green : C.gold, { 'font-size': 22 });
  if (V.phase === 'wrong') lab(A, 320, 395, it.mode === 'sf' ? 'real ÷ model' : 'photo is smaller: ÷', C.yellow, { 'font-size': 17 });
  if (show) lab(A, 320, 395, it.mode === 'sf' ? it.big + ' ÷ ' + it.o + ' = ' + it.sf : it.big + ' ÷ ' + it.sf + ' = ' + it.o, C.green, { 'font-size': 20 });
};

/* ---------- statistics and probability ---------- */
PICS.envelope = (A, it, V) => {
  [[C.red, 140], [C.blue, 320], [C.green, 500]].forEach(([col, x], i) => {
    const w = 130, h = 86, y = 110;
    A.el('rect', { x: x - w / 2, y, width: w, height: h, rx: 6, fill: col, 'fill-opacity': .25, stroke: col, 'stroke-width': 2.5 }, A.svg);
    A.el('path', { d: 'M' + (x - w / 2) + ' ' + y + 'L' + x + ' ' + (y + h * .55) + 'L' + (x + w / 2) + ' ' + y, stroke: col, 'stroke-width': 2.5, fill: 'none' }, A.svg);
    if (!i) { emo(A, x, y - 30, '❤️', 28); lab(A, x, y + h + 24, 'his favourite', C.red, { 'font-size': 15 }); }
  });
  if (!after(V)) return;
  const L = [['theoretical: count the outcomes', 'o1'], ['experimental: run trials', 'o2'], ['a calculation: use numbers', 'o3'], ['subjective: a feeling or opinion', 'ok']];
  L.forEach(([s, k], i) => lab(A, 320, 262 + i * 34, s, k === 'ok' ? (done(V) ? C.green : C.muted) : code(V) === k ? C.red : C.muted, fade(i, { 'font-size': 17 })));
};
PICS.nina = (A, it, V) => {
  const y0 = 90, h = 220;
  lab(A, 320, 60, 'the whole school: 410 students', C.text, { 'font-size': 17 });
  box(A, 60, y0, 260, h, C.teal, { 'fill-opacity': .1 }); box(A, 320, y0, 260, h, C.blue, after(V) ? Object.assign({ 'fill-opacity': .1, stroke: C.red }, glow) : { 'fill-opacity': .1 });
  lab(A, 190, y0 + 24, 'girls', C.teal, { 'font-size': 16 }); lab(A, 450, y0 + 24, 'boys', after(V) ? C.red : C.blue, { 'font-size': 16 });
  for (let i = 0; i < 10; i++) dot(A, 140 + (i % 5) * 26, 180 + Math.floor(i / 5) * 28, 9, i < 6 ? C.yellow : C.muted);
  A.el('rect', { x: 118, y: 160, width: 148, height: 64, rx: 12, fill: 'none', stroke: C.yellow, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, A.svg);
  lab(A, 192, 250, 'Nina’s sample: 10 girls', C.yellow, { 'font-size': 15 });
  if (after(V)) lab(A, 450, 210, 'no one asked here', C.red, { 'font-size': 17 });
  if (done(V)) { lab(A, 320, 350, '6/10 × 410 = 246: the math is fine', C.muted, { 'font-size': 16 }); lab(A, 320, 382, 'but the sample is only girls', C.green, { 'font-size': 18 }); }
};
PICS.mascot = (A, it, V) => {
  lab(A, 320, 44, '🏫 the mascot is for the whole school', C.text, { 'font-size': 17 });
  [10, 11, 12].forEach((g, c) => {
    const x0 = 95 + c * 170, y0 = 100, asked = c === 0;
    box(A, x0 - 14, y0 - 14, 5 * 26 + 2, 5 * 26 + 2, asked ? C.gold : C.muted, !asked && after(V) ? { stroke: C.red, 'fill-opacity': .06 } : { 'fill-opacity': .06 });
    for (let i = 0; i < 25; i++) dot(A, x0 + (i % 5) * 26, y0 + Math.floor(i / 5) * 26, 8, asked && i < 12 ? C.gold : C.muted, { 'fill-opacity': asked && i < 12 ? 1 : .35 });
    lab(A, x0 + 52, y0 + 150, 'Grade ' + g, asked ? C.gold : after(V) ? C.red : C.muted, { 'font-size': 16 });
    if (!asked && after(V)) lab(A, x0 + 52, y0 + 176, 'not asked', C.red, fade(c, { 'font-size': 15 }));
  });
  lab(A, 147, 300, '120 asked', C.gold, { 'font-size': 15 });
  if (done(V)) lab(A, 320, 380, 'one grade can’t speak for every grade', C.green, { 'font-size': 18 });
};
PICS.rink = (A, it, V) => {
  const P = ['👶', '🧒', '👦', '🧑', '👩', '🧔', '👵', '👴'];
  emo(A, 320, 60, '⛸️', 36); lab(A, 320, 100, 'a new rink for the town', C.muted, { 'font-size': 16 });
  const narrow = code(V) === 'o2' || code(V) === 'o3';
  P.forEach((p, i) => { const x = 110 + i * 60; const on = !narrow || i === 3 || i === 4; A.tx(A.svg, x, 200, p, { 'font-size': 38, class: 'emo', opacity: on ? 1 : .25 }); });
  if (narrow) lab(A, 320, 260, 'only some people: skaters', C.red, { 'font-size': 17 });
  if (code(V) === 'o1') lab(A, 320, 260, 'other cities won’t use this rink', C.red, { 'font-size': 17 });
  if (done(V)) brace(A, 90, 550, 240, 'every age in the town', C.green);
};
PICS.predict = (A, it, V) => {
  const cols = it.n <= 25 ? 5 : 10, rowsN = Math.ceil(it.n / cols), gap = Math.min(30, 220 / cols, 200 / rowsN), x0 = 160 - (cols - 1) * gap / 2, y0 = 200 - (rowsN - 1) * gap / 2, hit = it.hit === 'bad' ? C.red : C.green;
  for (let i = 0; i < it.n; i++) dot(A, x0 + (i % cols) * gap, y0 + Math.floor(i / cols) * gap, gap * .36, i < it.h ? hit : C.muted, { 'fill-opacity': i < it.h ? .9 : .3 });
  lab(A, 160, 64, it.h + ' of ' + it.n, hit, { 'font-size': 20 }); emo(A, 46, 44, it.icon, 28);
  const gc = Math.min(8, it.m), gr = Math.ceil(it.m / gc), g = Math.min(34, 240 / gr, 250 / gc), X0 = 360 + (250 - gc * g) / 2;
  for (let i = 0; i < it.m; i++) {
    const x = X0 + (i % gc) * g, y = 200 - g / 2 + Math.floor(i / gc) * g - (gr - 1) * g / 2;
    A.el('rect', { x: x + 2, y: y + 2, width: g - 4, height: g - 4, rx: 4, fill: C.blue, 'fill-opacity': i === 0 ? .4 : .14, stroke: C.blue, 'stroke-width': 1.2 }, A.svg);
    if (done(V) && g > 22) lab(A, x + g / 2, y + g / 2, String(it.h), hit, { 'font-size': Math.min(14, g * .45) });
  }
  lab(A, 485, 64, it.N + ' in all', C.blue, { 'font-size': 20 });
  A.el('path', { d: 'M290 200H345', stroke: C.yellow, 'stroke-width': 3, 'marker-end': 'url(#aY)' }, A.svg);
  if (!after(V)) return;
  lab(A, 318, 178, '× ' + it.m, C.yellow, fade(0, { 'font-size': 20 }));
  lab(A, 320, 350, it.N + ' = ' + it.m + ' groups of ' + it.n, C.muted, fade(1, { 'font-size': 17 }));
  if (done(V)) lab(A, 320, 388, it.fmt === 'mc' ? '3/25 = 12% only if the sample is like all 750' : it.m + ' × ' + it.h + ' = ' + it.a, C.green, fade(2, { 'font-size': 19 }));
};
// A Grade 7–9 school: 3 classes per grade, 8 students per class. Each sample is a set of [grade, class, seat].
const SAMPLE = {
  fair: [[0, 0, 1], [0, 1, 6], [0, 2, 3], [1, 0, 4], [1, 1, 0], [1, 2, 7], [2, 0, 2], [2, 1, 5], [2, 2, 1]],
  g9: [0, 1, 2].flatMap(c => [0, 2, 4, 6].map(s => [2, c, s])),
  team: [[1, 0, 2], [1, 2, 5], [2, 0, 1], [2, 1, 3], [2, 1, 6], [2, 2, 4]],
  band: [[0, 1, 2], [1, 1, 3], [1, 1, 7], [2, 2, 0], [2, 2, 5]],
  friends: [[1, 1, 0], [1, 1, 1], [1, 1, 2], [1, 1, 3]],
  lib: [[0, 2, 0], [0, 2, 1], [1, 2, 6], [2, 1, 7], [2, 1, 4]],
  class: [0, 1, 2, 3, 4, 5, 6, 7].map(s => [1, 1, s])
};
PICS.bias = (A, it, V) => {
  const chosen = V.res && V.res.code && V.res.code[0] === 'o' ? it.groups[+V.res.code.slice(1)] : null, show = done(V) ? 'fair' : chosen;
  const inS = (g, c, s) => show && SAMPLE[show].some(p => p[0] === g && p[1] === c && p[2] === s), col = done(V) ? C.green : C.red;
  [7, 8, 9].forEach((gr, g) => {
    const x0 = 80 + g * 175;
    lab(A, x0 + 60, 58, 'Grade ' + gr, C.text, { 'font-size': 16 });
    [0, 1, 2].forEach(c => {
      const y0 = 84 + c * 88;
      A.el('rect', { x: x0 - 8, y: y0 - 8, width: 136, height: 70, rx: 10, fill: C.panel, stroke: C.edge, 'stroke-width': 1.5 }, A.svg);
      for (let s = 0; s < 8; s++) { const on = inS(g, c, s); dot(A, x0 + 12 + (s % 4) * 32, y0 + 12 + Math.floor(s / 4) * 30, 9, on ? col : C.muted, { 'fill-opacity': on ? 1 : .3, class: on ? 'pop' : null }); }
    });
  });
  if (V.phase === 'show' && chosen && chosen !== 'fair') lab(A, 320, 360, 'your pick misses most students', C.red, { 'font-size': 16 });
  if (!done(V) && chosen) lab(A, 320, 385, 'only these students are asked', C.red, { 'font-size': 17 });
  if (done(V)) lab(A, 320, 385, 'random from every grade: everyone has a chance', C.green, { 'font-size': 17 });
};

/* ---------- tabs ---------- */
const NOTES = {
  pe: 'powers-exponents/math9-powers-notes-v1.html', rn: 'rational-numbers/math9-rational-numbers-notes-v1.html', sr: 'square-roots/math9-square-roots-notes-v1.html',
  le: 'linear-equations/math9-linear-equations-notes-v1.html', lr: 'linear-relations/math9-linear-relations-notes-v1.html', po: 'polynomials/math9-polynomials-notes-v1.html',
  cg: 'circle-geometry/math9-circle-geometry-notes-v1.html', me: 'measurement/math9-measurement-notes-v1.html', si: 'similarity/math9-similarity-notes-v1.html',
  st: 'statistics/math9-statistics-notes-v1.html', pr: 'probability/math9-probability-notes-v1.html'
};
// About 7 in 10 items are released items, the rest generated. A released item does not come back until about
// 6 other items from its strand have been shown, so repeats in a round are rare; missed ones then
// come back more often through the shell's weighting.
const recent = [];
const windowOf = s => Math.min(6, M.BANK.filter(b => b.s === s).length - 2);
function shown(it) { if (!it.src) return; const i = recent.indexOf(it.id); if (i >= 0) recent.splice(i, 1); recent.push(it.id); }
function genStrand(s) {
  const pool = M.BANK.filter(b => b.s === s), skip = recent.filter(id => id[0] === pool[0].id[0]).slice(-windowOf(s));
  const fresh = pool.filter(b => skip.indexOf(b.id) < 0);
  return Q.chance(.7) ? Object.assign({}, Q.pick(fresh.length ? fresh : pool)) : Q.pick(M.GENS[s])();
}
const optHTML = (o, math) => math ? mathText(o) : o;
function makeTab(id, code, name, gen) {
  return {
    id, code, name, sec: 1, notes: '../notes/' + NOTES.rn, link: it => ({ notes: '../notes/' + NOTES[it.topic], sec: it.sec }),
    kind: it => it.fmt === 'mc' ? 'choice' : 'slots', gen, typeOf: it => it.code,
    q: it => { shown(it); return it.ask; },
    prompt: it => (it.src ? '<div class="src">' + it.src + '</div>' : '') + (it.story ? '<div class="story">' + it.stem + '</div>' : mathText(it.stem)),
    choices: it => it.opts.map((o, i) => ({ v: LET[i], label: '<span class="lt">' + LET[i] + '</span>' + optHTML(o, it.om), math: !!it.om, aria: o })),
    slots: it => [it.pre || null, { k: 'v', label: 'answer', wide: true }, it.unit ? { h: '<span style="font-family:inherit;font-size:.7em">' + it.unit + '</span>' } : null].filter(Boolean),
    check: M.check, answer: M.answer,
    draw: (A, it, V) => (PICS[it.pic] || steps)(A, it, V)
  };
}
const WEIGHT = [['num', 32], ['pat', 36], ['ss', 24], ['sp', 8]];
const PAGE = {
  key: 'math9-pat-questions-trainer-v1', course: 'Math 9 · PAT prep', title: 'PAT Questions',
  notes: '../notes/' + NOTES.rn,
  tabs: [
    makeTab('num', 'N', 'Number', () => genStrand('num')),
    makeTab('pat', 'PR', 'Patterns', () => genStrand('pat')),
    makeTab('ss', 'SS', 'Shape & Space', () => genStrand('ss')),
    makeTab('sp', 'SP', 'Stats & Prob', () => genStrand('sp')),
    makeTab('mix', 'PAT', 'Mixed', () => { let r = Q.rnd(0, 99); const s = WEIGHT.find(w => (r -= w[1]) < 0)[0]; return genStrand(s); })
  ]
};
DRILL.boot(PAGE);
