
/* ===================== PAGE: pictures and tabs ===================== */
const { C, fracHTML } = DRILL;
const M = MODEL, $c = M.$c;
const done = V => V.phase === 'right' || V.phase === 'show';
const after = V => V.phase !== 'ask';
const story = s => '<div class="story">' + s + '</div>';
const B = s => '<b>' + s + '</b>';
const lab = (A, x, y, s, col, a) => A.tx(A.svg, x, y, s, Object.assign({ 'font-size': 18, fill: col || C.text }, a || {}));
const mlab = (A, x, y, s, col, a) => A.mtx(A.svg, x, y, s, Object.assign({ 'font-size': 22, fill: col || C.text }, a || {}));
const emo = (A, x, y, s, size) => A.tx(A.svg, x, y, s, { 'font-size': size || 34, class: 'emo' });
const box = (A, x, y, w, h, col, a) => A.el('rect', Object.assign({ x, y, width: Math.max(0, w), height: h, rx: 6, fill: col, 'fill-opacity': .22, stroke: col, 'stroke-width': 2 }, a || {}), A.svg);
// A brace under (or over) a span, with a label.
function brace(A, x1, x2, y, s, col, up) {
  const d = up ? -1 : 1, m = (x1 + x2) / 2;
  A.el('path', { d: 'M' + x1 + ' ' + y + 'q0 ' + 8 * d + ' 8 ' + 8 * d + 'H' + (m - 8) + 'q8 0 8 ' + 8 * d + 'q0 ' + -8 * d + ' 8 ' + -8 * d + 'H' + (x2 - 8) + 'q8 0 8 ' + -8 * d, stroke: col || C.muted, 'stroke-width': 2, fill: 'none' }, A.svg);
  if (s != null) lab(A, m, y + 32 * d, s, col || C.muted, { 'font-size': 19 });
}
// Time as HTML (story) and as text (picture).
const tHTML = t => t.m ? t.m + ' min' : t.n > t.d ? '1' + fracHTML(t.n - t.d, t.d) + ' h' : fracHTML(t.n, t.d) + ' h';
const tTXT = t => t.m ? t.m + ' min' : ({ '1/4': '¼', '1/2': '½', '3/4': '¾', '1/3': '⅓', '2/3': '⅔', '3/2': '1½' })[t.n + '/' + t.d] + ' h';
const num = x => String(M.r2(x));
const kmS = x => num(x) + ' km/h';

/* RN3 Trip */
const T_TRIP = {
  id: 'trip', code: 'RN3', name: 'Trip', sec: 3, notes: '../notes/rational-numbers/math9-rational-numbers-notes-v1.html',
  q: 'How far in all?', kind: 'slots', gen: M.genTrip, typeOf: it => it.form + ':' + it.ctx,
  prompt: it => story(it.who + ' ' + it.ctx + ' at ' + B(kmS(it.s[0])) + ' for ' + B(tHTML(it.t[0])) + ', then at ' + B(kmS(it.s[1])) + ' for ' + B(tHTML(it.t[1])) + '.'),
  slots: () => [{ k: 'v', label: 'distance', wide: true }, { h: '<span style="font-family:inherit">km</span>' }],
  check: M.checkTrip, answer: it => ({ v: num(it.v) }),
  draw(A, it, V) {
    const D = it.d[0] + it.d[1], x0 = 70, W = 500, px = W / D, y = 190, xm = x0 + it.d[0] * px, cols = [C.blue, C.gold];
    emo(A, x0 - 22, y - 46, it.icon, 36);
    [[x0, xm], [xm, x0 + W]].forEach(([a, b], i) => {
      A.el('line', { x1: a, x2: b, y1: y, y2: y, stroke: cols[i], 'stroke-width': 12, 'stroke-linecap': 'butt' }, A.svg);
      const m = (a + b) / 2, red = V.res && V.res.code === 'min';
      lab(A, m, y - 30, kmS(it.s[i]), cols[i], { 'font-size': 19 });
      lab(A, m, y + 32, tTXT(it.t[i]), red && !done(V) ? C.red : C.text, { 'font-size': 20 });
      if (red || (done(V) && it.t[i].m)) lab(A, m, y + 60, it.t[i].m + '/60 h = ' + tTXT({ n: it.t[i].m / Q.gcd(it.t[i].m, 60), d: 60 / Q.gcd(it.t[i].m, 60) }), red ? C.red : C.muted, { 'font-size': 16, class: 'fade' });
      if (after(V)) lab(A, m, y + 92, done(V) ? num(it.d[i]) + ' km' : 'speed × time', done(V) ? cols[i] : C.muted, { 'font-size': 19, class: 'fade' });
    });
    A.el('circle', { cx: x0, cy: y, r: 9, fill: C.text }, A.svg); A.el('line', { x1: x0 + W, x2: x0 + W, y1: y - 40, y2: y + 10, stroke: C.text, 'stroke-width': 3 }, A.svg);
    A.el('path', { d: 'M' + (x0 + W) + ' ' + (y - 40) + 'h26l-8 9l8 9h-26', fill: C.green, stroke: 'none' }, A.svg);
    if (V.res && V.res.code === 'one') brace(A, x0, x0 + W, y + 118, 'both parts', C.red);
    else if (done(V)) brace(A, x0, x0 + W, y + 118, num(it.d[0]) + ' + ' + num(it.d[1]) + ' = ' + num(it.v) + ' km', C.green);
  }
};

/* SR1 Rug */
const T_RUG = {
  id: 'rug', code: 'SR1', name: 'Rug', sec: 1, notes: '../notes/square-roots/math9-square-roots-notes-v1.html',
  q: 'Side length of the square', kind: 'slots', gen: M.genRug, typeOf: it => it.w,
  prompt: it => story('A square ' + it.w + ' covers ' + B(it.p + '%') + ' of ' + it.place + ' ' + B(it.L + ' m') + ' by ' + B(it.W + ' m') + ' ' + it.what + '.'),
  slots: () => ['side =', { k: 'v', label: 'side', wide: true }, { h: '<span style="font-family:inherit">m</span>' }],
  check: M.checkRug, answer: it => ({ v: String(it.v) }),
  draw(A, it, V) {
    const s = Math.min(380 / it.L, 270 / it.W), w = it.L * s, h = it.W * s, x0 = 40 + (400 - w) / 2, y0 = 60 + (280 - h) / 2, side = it.v * s;
    A.el('rect', { x: x0, y: y0, width: w, height: h, fill: C.blue, 'fill-opacity': .06, stroke: C.blue, 'stroke-width': 3 }, A.svg);
    lab(A, x0 + w / 2, y0 - 18, it.L + ' m', C.blue); lab(A, x0 - 12, y0 + h / 2, it.W + ' m', C.blue, { 'text-anchor': 'end' });
    const rx = x0 + 3, ry = y0 + h - side - 3;
    A.el('rect', { x: rx, y: ry, width: side, height: side, fill: C.yellow, 'fill-opacity': .22, stroke: C.yellow, 'stroke-width': 3 }, A.svg);
    if (done(V)) for (let i = 1; i < it.v; i++) { A.el('line', { x1: rx + i * s, x2: rx + i * s, y1: ry, y2: ry + side, stroke: C.yellow, 'stroke-opacity': .35 }, A.svg); A.el('line', { x1: rx, x2: rx + side, y1: ry + i * s, y2: ry + i * s, stroke: C.yellow, 'stroke-opacity': .35 }, A.svg); }
    lab(A, rx + side / 2, ry + side / 2, it.p + '%', C.yellow, { 'font-size': side > 60 ? 20 : 14 });
    lab(A, rx + side / 2, y0 + h + 22, done(V) ? it.v + ' m' : '?', done(V) ? C.green : C.yellow, { 'font-size': 20 });
    if (!after(V)) return;
    const X = 470, code = V.res && V.res.code;
    lab(A, X + 70, 110, it.what + ' area', C.blue, { 'font-size': 15 });
    mlab(A, X + 70, 140, it.L + ' × ' + it.W + ' = ' + it.L * it.W, C.blue, { class: 'fade' });
    if (code === 'full') lab(A, X + 70, 190, 'only ' + it.p + '%', C.red, { class: 'pulse' });
    if (done(V) || code === 'area' || code === 'half' || code === 'perim') {
      lab(A, X + 70, 190, it.w + ' area', C.yellow, { 'font-size': 15 });
      mlab(A, X + 70, 220, it.p + '% → ' + it.area, C.yellow, { class: 'fade' });
      mlab(A, X + 70, 270, 'side × side = ' + it.area, code === 'area' || code === 'half' || code === 'perim' ? C.red : C.muted, { 'font-size': 19, class: 'fade' });
    }
    if (done(V)) mlab(A, X + 70, 320, '√' + it.area + ' = ' + it.v, C.green, { class: 'fade' });
  }
};

/* A tape: fee block, then rate blocks. segs = [{v, col, label}], px per unit. Returns the x where it ends. */
function tape(A, x, y, h, segs, px, a) {
  segs.forEach(s => { const w = s.v * px; box(A, x, y, w, h, s.col, Object.assign({}, a || {}, s.attr || {})); if (s.label && w > 18) lab(A, x + w / 2, y + h / 2, s.label, s.lc || C.text, { 'font-size': s.fs || (w > 70 ? 17 : 13) }); x += w; });
  return x;
}

/* LR4 Bill */
const T_BILL = {
  id: 'bill', code: 'LR4', name: 'Bill', sec: 4, notes: '../notes/linear-relations/math9-linear-relations-notes-v1.html',
  q: it => it.form === 'total' ? 'What is the total?' : 'How many ' + M.billCtx(it).units + '?', kind: 'slots', gen: M.genBill, typeOf: it => it.form + ':' + it.ctx,
  prompt: it => { const c = M.billCtx(it); return story(c.plan(B($c(it.fee)), B($c(it.rate))) + ' ' + (it.form === 'total' ? c.use(it.who, B(it.n)) : c.paid(it.who, B($c(it.T))))); },
  slots: it => it.form === 'total' ? ['$', { k: 'v', label: 'total in dollars', wide: true }] : [{ k: 'v', label: 'how many', wide: true }, { h: '<span style="font-family:inherit">' + M.billCtx(it).units + '</span>' }],
  check: M.checkBill, answer: it => ({ v: it.form === 'total' ? (it.T / 100).toFixed(2) : String(it.n) }),
  draw(A, it, V) {
    const c = M.billCtx(it), code = V.res && V.res.code, x0 = 60, W = 520, y = 150, h = 70;
    // keep both blocks readable: the fee at least 70 px, the usage at least 160 px
    let fw = W * it.fee / it.T; fw = Math.max(70, Math.min(W - 160, fw)); const uw = W - fw;
    emo(A, 52, 70, c.icon, 40);
    box(A, x0, y, fw, h, C.teal, code === 'nofee' || code === 'both' ? { filter: 'url(#glow)', 'stroke-width': 4 } : {});
    lab(A, x0 + fw / 2, y + h / 2 - 10, 'fee', C.teal, { 'font-size': 14 }); lab(A, x0 + fw / 2, y + h / 2 + 12, $c(it.fee), C.text, { 'font-size': 19 });
    box(A, x0 + fw, y, uw, h, C.gold);
    const nTxt = it.form === 'n' && !done(V) ? 'n' : String(it.n);
    lab(A, x0 + fw + uw / 2, y + h / 2 - 10, nTxt + ' × ' + $c(it.rate), C.gold, { 'font-size': 17 });
    if (done(V) || (it.form === 'n' && after(V))) lab(A, x0 + fw + uw / 2, y + h / 2 + 14, '= ' + $c(it.rate * it.n), it.form === 'n' && !done(V) ? C.muted : C.text, { 'font-size': 17, class: 'fade' });
    const tot = it.form === 'total' && !done(V) ? '$ ?' : $c(it.T);
    brace(A, x0, x0 + W, y - 14, 'total ' + tot, it.form === 'total' && done(V) ? C.green : C.text, true);
    if (it.form === 'n' && done(V)) lab(A, x0 + fw + uw / 2, y + h + 34, $c(it.T - it.fee) + ' ÷ ' + $c(it.rate) + ' = ' + it.n + ' ' + c.units, C.green, { 'font-size': 19, class: 'fade' });
    if (code === 'nofee') lab(A, x0 + fw / 2, y + h + 34, 'the fee counts', C.red, { 'font-size': 17 });
    if (code === 'both') lab(A, x0 + fw / 2, y + h + 34, 'paid once', C.red, { 'font-size': 17 });
    if (after(V)) mlab(A, 320, 360, 'C = ' + M.r2(it.fee / 100) + ' + ' + M.r2(it.rate / 100) + 'n', C.muted, { class: 'fade' });
  }
};

/* LE5 Save up and LE4 Budget share one picture: a money bar with a fee or "have" block, then rate chunks. */
function chunks(A, x, y, h, n, w, col, last) {
  for (let i = 0; i < n; i++) A.el('rect', { x: x + i * w + 1, y, width: Math.max(1, w - 2), height: h, rx: 4, fill: i === n - 1 && last ? last : col, 'fill-opacity': i % 2 ? .4 : .28, stroke: i === n - 1 && last ? last : col, 'stroke-width': 1.5, class: 'fade', style: 'animation-delay:' + i * 40 + 'ms' }, A.svg);
}
const T_SAVE = {
  id: 'save', code: 'LE5', name: 'Save up', sec: 5, notes: '../notes/linear-equations/math9-linear-equations-notes-v1.html',
  q: it => 'Fewest whole ' + M.saveCtx(it).unit, kind: 'slots', gen: M.genSave, typeOf: it => it.form,
  prompt: it => { const c = M.saveCtx(it); return story(it.who + ' has ' + B('$' + it.H) + ' and wants a ' + B('$' + it.G) + ' ' + it.thing + '. ' + it.who + ' ' + c.earn(B($c(it.rate))) + '.'); },
  slots: it => [{ k: 'v', label: 'how many', wide: true }, { h: '<span style="font-family:inherit">' + M.saveCtx(it).unit + '</span>' }],
  check: M.checkSave, answer: it => ({ v: String(it.n) }),
  draw(A, it, V) {
    const c = M.saveCtx(it), code = V.res && V.res.code, x0 = 60, W = 500, y = 170, h = 64;
    const top = Math.max(it.G * 100, it.H * 100 + it.n * it.rate), px = W / top, gx = x0 + it.G * 100 * px, hx = x0 + it.H * 100 * px, cw = it.rate * px;
    A.el('rect', { x: x0, y, width: gx - x0, height: h, rx: 6, fill: 'none', stroke: C.edge, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, A.svg);
    box(A, x0, y, hx - x0, h, C.green, code === 'nohave' ? { filter: 'url(#glow)', 'stroke-width': 4 } : {});
    if (hx - x0 > 40) lab(A, (x0 + hx) / 2, y + h / 2, '$' + it.H, C.text, { 'font-size': 17 });
    lab(A, (x0 + hx) / 2, y + h + 24, 'has', C.green, { 'font-size': 14 });
    A.el('line', { x1: gx, x2: gx, y1: y - 46, y2: y + h + 12, stroke: C.yellow, 'stroke-width': 3 }, A.svg);
    emo(A, gx, y - 70, it.ticon, 34); lab(A, gx, y + h + 30, '$' + it.G, C.yellow, { 'font-size': 18 });
    emo(A, 40, 60, c.icon, 30);
    if (!after(V)) {
      box(A, hx, y, cw, h, C.gold, { 'stroke-dasharray': '5 4' });
      lab(A, hx + Math.max(cw, 60) / 2 + 30, y - 22, '+ ' + $c(it.rate) + ' each ' + c.one, C.gold, { 'font-size': 16 });
      brace(A, hx, gx, y + h + 46, '?', C.muted);
      return;
    }
    if (!done(V) && code !== 'down') { brace(A, hx, gx, y + h + 46, '$' + it.G + ' − $' + it.H + ' = $' + (it.G - it.H), C.muted); box(A, hx, y, cw, h, C.gold, { 'stroke-dasharray': '5 4' }); lab(A, hx + cw / 2, y - 22, '$' + M.r2(it.rate / 100) + ' each', C.gold, { 'font-size': 16 }); return; }
    const shown = code === 'down' ? Math.floor(it.need / it.rate) : it.n;
    chunks(A, hx, y + 6, h - 12, shown, cw, C.gold, done(V) && !it.exact ? C.green : null);
    if (code === 'down') { lab(A, gx - 6, y + h + 62, 'still ' + $c(it.need - shown * it.rate) + ' short', C.red, { 'text-anchor': 'end', 'font-size': 18 }); A.el('rect', { x: hx + shown * cw, y: y + 6, width: gx - hx - shown * cw, height: h - 12, fill: C.red, 'fill-opacity': .35 }, A.svg); }
    else brace(A, hx, gx, y + h + 46, '$' + it.G + ' − $' + it.H + ' = $' + (it.G - it.H), C.muted);
    if (done(V)) lab(A, 320, 372, $c(it.need) + ' ÷ ' + $c(it.rate) + ' = ' + M.r2(it.need / it.rate) + (it.exact ? '' : ' → ' + it.n) + ' ' + c.unit, C.green, { 'font-size': 20, class: 'fade' });
  }
};

const T_BUDGET = {
  id: 'budget', code: 'LE4', name: 'Budget', sec: 4, notes: '../notes/linear-equations/math9-linear-equations-notes-v1.html',
  q: it => 'Greatest number of ' + M.budCtx(it).unit, kind: 'slots', gen: M.genBudget, typeOf: it => it.form,
  prompt: it => { const c = M.budCtx(it); return story(it.who + ' has ' + B('$' + it.B) + ' for ' + c.place + '. ' + c.fee + ' is ' + B($c(it.fee)) + ' and ' + c.each + ' costs ' + B($c(it.rate)) + '.'); },
  slots: it => [{ k: 'v', label: 'how many', wide: true }, { h: '<span style="font-family:inherit">' + M.budCtx(it).unit + '</span>' }],
  check: M.checkBudget, answer: it => ({ v: String(it.n) }),
  draw(A, it, V) {
    const c = M.budCtx(it), code = V.res && V.res.code, x0 = 60, W = 480, y = 170, h = 64, cap = it.B * 100 + it.rate * 2, px = W / cap;
    const bx = x0 + it.B * 100 * px, fx = x0 + it.fee * px, cw = it.rate * px;
    emo(A, 40, 60, c.icon, 30);
    box(A, x0, y, fx - x0, h, C.teal, code === 'nofee' ? { filter: 'url(#glow)', 'stroke-width': 4 } : {});
    lab(A, (x0 + fx) / 2, y + h + 24, $c(it.fee), C.teal, { 'font-size': 16 });
    A.el('line', { x1: bx, x2: bx, y1: y - 40, y2: y + h + 12, stroke: C.yellow, 'stroke-width': 3 }, A.svg);
    lab(A, bx, y - 56, 'budget $' + it.B, C.yellow, { 'font-size': 18 });
    if (!after(V)) { box(A, fx, y, cw, h, C.gold, { 'stroke-dasharray': '5 4' }); lab(A, fx + cw + 8, y + h + 24, '+ ' + $c(it.rate) + ' ' + c.each, C.gold, { 'font-size': 16, 'text-anchor': 'start' }); return; }
    if (!done(V) && code !== 'up') { box(A, fx, y, cw, h, C.gold, { 'stroke-dasharray': '5 4' }); brace(A, fx, bx, y + h + 46, '$' + it.B + ' − ' + $c(it.fee) + ' = ' + $c(it.B * 100 - it.fee) + ' for ' + c.unit, C.muted); mlab(A, 320, 360, M.r2(it.fee / 100) + ' + ' + M.r2(it.rate / 100) + 'n ≤ ' + it.B, C.text, { class: 'fade' }); return; }
    const shown = code === 'up' ? it.n + 1 : it.n;
    chunks(A, fx, y + 6, h - 12, shown, cw, C.gold, code === 'up' ? C.red : null);
    if (code === 'up') lab(A, bx + 6, y + h + 30, 'over by ' + $c(it.fee + shown * it.rate - it.B * 100), C.red, { 'font-size': 17, 'text-anchor': 'start' });
    else if (done(V)) lab(A, bx + 6, y + h + 30, $c(it.B * 100 - it.fee - it.n * it.rate) + ' left', C.muted, { 'font-size': 16, 'text-anchor': 'start' });
    mlab(A, 320, 330, M.r2(it.fee / 100) + ' + ' + M.r2(it.rate / 100) + 'n ≤ ' + it.B, C.text, { class: 'fade' });
    if (done(V)) mlab(A, 320, 372, 'n ≤ ' + M.r2((it.B * 100 - it.fee) / it.rate) + (it.exact ? '' : '  →  ' + it.n), C.green, { 'font-size': 20, class: 'fade' });
  }
};

/* LE5 Shares: a bar model */
const T_SHARES = {
  id: 'shares', code: 'LE5', name: 'Shares', sec: 5, notes: '../notes/linear-equations/math9-linear-equations-notes-v1.html',
  q: it => 'How much for ' + it.names[0] + '?', kind: 'slots', gen: M.genShares, typeOf: it => it.form + ':' + it.k,
  prompt: it => {
    const n = it.names, u = it.ctx.unit, amt = x => u === '$' ? '$' + x : x + ' ' + u, times = it.k === 2 ? 'twice as many' : 'three times as many', much = u === '$' ? (it.k === 2 ? 'twice as much' : 'three times as much') : times;
    const third = it.form === 'less' ? n[2] + ' ' + it.ctx.verb + ' ' + B(amt(it.d)) + ' less than ' + n[1] : it.form === 'more' ? n[2] + ' ' + it.ctx.verb + ' ' + B(amt(it.d)) + ' more than ' + n[0] : n[2] + ' ' + it.ctx.verb + ' ' + B(amt(it.d)) + ' more than ' + n[1];
    return story(n.join(', ').replace(/, ([^,]*)$/, ' and $1') + ' ' + it.ctx.verb + ' ' + B(amt(it.total)) + ' in all. ' + n[1] + ' ' + it.ctx.verb + ' ' + much + ' as ' + n[0] + '. ' + third + '.');
  },
  slots: it => it.ctx.unit === '$' ? ['$', { k: 'v', label: 'amount', wide: true }] : [{ k: 'v', label: 'amount', wide: true }, { h: '<span style="font-family:inherit">' + it.ctx.unit + '</span>' }],
  check: M.checkShares, answer: it => ({ v: String(it.t) }),
  draw(A, it, V) {
    const code = V.res && V.res.code, x0 = 130, W = 400, k = it.k, base = it.form === 'more' ? 1 : k, longest = it.form === 'less' ? k * it.t : base * it.t + it.d;
    const px = W / longest, bw = it.t * px, dw = Math.max(16, it.d * px), ys = [70, 170, 270], h = 56;
    const tLab = done(V) ? String(it.t) : 't';
    const row = (y, nb) => { for (let i = 0; i < nb; i++) { box(A, x0 + i * bw, y, bw, h, C.blue); lab(A, x0 + i * bw + bw / 2, y + h / 2, tLab, done(V) ? C.green : C.blue, { 'font-size': bw > 40 ? 20 : 14 }); } };
    it.names.forEach((nm, i) => lab(A, x0 - 14, ys[i] + h / 2, nm, C.text, { 'text-anchor': 'end', 'font-size': 18 }));
    row(ys[0], 1); row(ys[1], k); row(ys[2], base);
    const dTxt = (it.form === 'less' ? '−' : '+') + it.d, hot = code === 'ignore' || code === 'way';
    if (it.form === 'less') {
      const x = x0 + k * bw - dw;
      A.el('rect', { x, y: ys[2] - 4, width: dw, height: h + 8, fill: C.stage, 'fill-opacity': .85, stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, A.svg);
      lab(A, x + dw / 2, ys[2] + h + 20, dTxt, C.red, { 'font-size': 17, class: hot ? 'pulse' : '' });
    } else {
      const x = x0 + base * bw; box(A, x, ys[2], dw, h, C.teal, hot ? { filter: 'url(#glow)', 'stroke-width': 4 } : {});
      lab(A, x + dw / 2, ys[2] + h + 20, dTxt, C.teal, { 'font-size': 17 });
    }
    const right = x0 + W + 22;
    A.el('path', { d: 'M' + right + ' ' + ys[0] + 'q10 0 10 10V' + (ys[2] + h / 2 - 10) + 'q0 10 10 10q-10 0 -10 10V' + (ys[2] + h - 10) + 'q0 10 -10 10', stroke: C.yellow, 'stroke-width': 2, fill: 'none' }, A.svg);
    lab(A, right + 30, ys[1] + h / 2 + 12, String(it.total), C.yellow, { 'font-size': 20, 'text-anchor': 'start' });
    if (!after(V)) return;
    const sgn = it.form === 'less' ? 1 : -1, fixed = it.total + sgn * it.d;
    lab(A, 330, 386, it.parts + ' blocks = ' + it.total + (sgn > 0 ? ' + ' : ' − ') + it.d + ' = ' + fixed + (done(V) ? '   →   t = ' + fixed + ' ÷ ' + it.parts + ' = ' + it.t : ''), code === 'count' ? C.red : done(V) ? C.green : C.muted, { 'font-size': 18, class: 'fade' });
  }
};

/* LE5 Catch up: two plans as tapes; the cheaper-fee plan catches up rate-gap per unit */
const T_CATCH = {
  id: 'catch', code: 'LE5', name: 'Catch up', sec: 5, notes: '../notes/linear-equations/math9-linear-equations-notes-v1.html',
  q: it => 'Same cost after how many ' + M.catchCtx(it).unit + '?', kind: 'slots', gen: M.genCatch, typeOf: it => it.form,
  prompt: it => { const c = M.catchCtx(it); return story(c.who + ' A: ' + B('$' + it.fA) + ' ' + c.fee + ', then ' + B('$' + it.rA) + ' ' + c.each + '. ' + c.who + ' B: ' + B('$' + it.fB) + ' ' + c.fee + ', then ' + B('$' + it.rB) + ' ' + c.each + '.'); },
  slots: it => ['n =', { k: 'v', label: 'how many', wide: true }],
  check: M.checkCatch, answer: it => ({ v: String(it.n) }),
  draw(A, it, V) {
    const c = M.catchCtx(it), code = V.res && V.res.code, x0 = 90, W = 490, px = W / it.cost, ys = [100, 230], h = 58;
    emo(A, 40, 40, c.icon, 28);
    const plans = [[it.fA, it.rA, 'A'], [it.fB, it.rB, 'B']];
    plans.forEach(([f, r, nm], i) => {
      const y = ys[i]; lab(A, x0 - 30, y + h / 2, nm, C.text, { 'font-size': 22 });
      box(A, x0, y, f * px, h, C.teal); if (f * px > 34) lab(A, x0 + f * px / 2, y + h / 2, '$' + f, C.text, { 'font-size': 16 });
      const n = done(V) ? it.n : after(V) && code !== 'fee' ? Math.min(it.n, 3) : 1;
      for (let j = 0; j < n; j++) A.el('rect', { x: x0 + f * px + j * r * px + 1, y: y + 6, width: Math.max(1, r * px - 2), height: h - 12, rx: 3, fill: C.gold, 'fill-opacity': j % 2 ? .42 : .26, stroke: C.gold, 'stroke-width': 1.2, class: 'fade', style: 'animation-delay:' + j * 50 + 'ms' }, A.svg);
      lab(A, x0 + f * px + 4, y - 14, '+$' + r + ' ' + c.each, C.gold, { 'font-size': 15, 'text-anchor': 'start' });
    });
    if (!after(V)) return;
    const gx1 = x0 + it.fA * px, gx2 = x0 + it.fB * px;
    A.el('line', { x1: gx1, x2: gx1, y1: ys[0] + h, y2: ys[1], stroke: C.muted, 'stroke-dasharray': '4 4' }, A.svg);
    A.el('line', { x1: gx2, x2: gx2, y1: ys[0] + h, y2: ys[1], stroke: C.muted, 'stroke-dasharray': '4 4' }, A.svg);
    lab(A, (gx1 + gx2) / 2, (ys[0] + h + ys[1]) / 2, '$' + (it.fB - it.fA) + ' gap', code === 'fee' ? C.red : C.yellow, { 'font-size': 17 });
    lab(A, 330, 330, 'A gains $' + it.rA + ' − $' + it.rB + ' = $' + (it.rA - it.rB) + ' on B each time', code === 'sum' || code === 'one' || code === 'fee' ? C.red : C.muted, { 'font-size': 17, class: 'fade' });
    if (done(V)) {
      const ex = x0 + W; A.el('line', { x1: ex, x2: ex, y1: ys[0] - 4, y2: ys[1] + h + 4, stroke: C.green, 'stroke-width': 3 }, A.svg);
      lab(A, 330, 372, '$' + (it.fB - it.fA) + ' ÷ $' + (it.rA - it.rB) + ' = ' + it.n + ' ' + c.unit + ': both $' + it.cost, C.green, { 'font-size': 19, class: 'fade' });
    }
  }
};

/* SR3 Ladder: right triangles in scenes */
const T_LADDER = {
  id: 'ladder', code: 'SR3', name: 'Ladder', sec: 3, notes: '../notes/square-roots/math9-square-roots-notes-v1.html',
  q: it => ({ ladder: 'How high up the wall?', kite: 'How high is the kite?', screen: 'Length of the diagonal', park: 'How much shorter?' })[it.form] + (it.form === 'kite' ? '' : ' (one decimal)'),
  kind: 'slots', gen: M.genLadder, typeOf: it => it.form,
  prompt: it => story(({
    ladder: it => 'A ' + B(num(it.c) + ' m') + ' ladder leans on a wall. Its foot is ' + B(num(it.a) + ' m') + ' from the wall.',
    kite: it => 'A kite string is ' + B(num(it.c) + ' m') + ' long. The kite is right above a point ' + B(it.a + ' m') + ' away.',
    screen: it => 'A screen is ' + B(it.a + ' cm') + ' wide and ' + B(num(it.b) + ' cm') + ' tall.',
    park: it => 'A park is ' + B(it.a + ' m') + ' by ' + B(it.b + ' m') + '. Cut across the diagonal instead of walking two sides.'
  })[it.form](it)),
  slots: it => [{ k: 'v', label: 'answer', wide: true }, { h: '<span style="font-family:inherit">' + (it.form === 'screen' ? 'cm' : 'm') + '</span>' }],
  check: M.checkLadder, answer: it => ({ v: num(it.v) }),
  draw(A, it, V) {
    const code = V.res && V.res.code, { a, b, c } = it;
    const s = Math.min(380 / a, 270 / b), aw = a * s, bh = b * s, cols = { a: C.teal, b: C.gold, c: C.yellow };
    let P, Q_, R; // right angle at P, Q_ along a, R along b
    if (it.form === 'ladder' || it.form === 'kite') {
      const gx = it.form === 'ladder' ? 470 : 90, g = 360, dir = it.form === 'ladder' ? -1 : 1;
      A.el('line', { x1: 30, x2: 610, y1: g, y2: g, stroke: C.axis, 'stroke-width': 2 }, A.svg);
      P = [it.form === 'ladder' ? gx : gx + aw, g]; Q_ = [it.form === 'ladder' ? gx - aw : gx, g]; R = [P[0], g - bh];
      if (it.form === 'ladder') A.el('rect', { x: gx, y: 40, width: 26, height: g - 40, fill: C.edge }, A.svg);
      else { emo(A, R[0] + 6, R[1] - 12, '🪁', 34); emo(A, Q_[0] - 4, g - 18, '🧍', 30); }
      void dir;
    } else {
      const x0 = 320 - aw / 2, y0 = 60 + (270 - bh) / 2;
      A.el('rect', { x: x0, y: y0, width: aw, height: bh, rx: it.form === 'screen' ? 8 : 2, fill: it.form === 'park' ? C.green : C.blue, 'fill-opacity': .1, stroke: it.form === 'park' ? C.green : C.blue, 'stroke-width': 3 }, A.svg);
      P = [x0 + aw, y0 + bh]; Q_ = [x0, y0 + bh]; R = [x0 + aw, y0];
      if (it.form === 'park') { emo(A, Q_[0] - 18, Q_[1] + 16, '🚶', 26); A.el('path', { d: 'M' + Q_ + 'L' + P + 'L' + R, stroke: C.gold, 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '2 8', 'stroke-linecap': 'round' }, A.svg); }
    }
    const hyp = A.el('line', { x1: Q_[0], y1: Q_[1], x2: R[0], y2: R[1], stroke: cols.c, 'stroke-width': it.form === 'ladder' ? 7 : it.form === 'kite' ? 2 : 3, 'stroke-dasharray': it.form === 'park' ? '10 7' : null }, A.svg);
    void hyp;
    if (it.form !== 'park' && it.form !== 'screen') { A.el('line', { x1: P[0], y1: P[1], x2: R[0], y2: R[1], stroke: cols.b, 'stroke-width': 3, 'stroke-dasharray': it.form === 'kite' ? '6 5' : null }, A.svg); A.el('line', { x1: P[0], y1: P[1], x2: Q_[0], y2: Q_[1], stroke: cols.a, 'stroke-width': 4 }, A.svg); }
    const sq = 16, sx = P[0] > Q_[0] ? -1 : 1;
    A.el('path', { d: 'M' + (P[0] + sx * sq) + ' ' + P[1] + 'v' + -sq + 'h' + -sx * sq, stroke: C.text, 'stroke-width': 2, fill: 'none' }, A.svg);
    const askLeg = it.form === 'ladder' || it.form === 'kite', u = it.form === 'screen' ? ' cm' : ' m';
    lab(A, (P[0] + Q_[0]) / 2, P[1] + 22, num(a) + u, cols.a);
    lab(A, P[0] + (it.form === 'ladder' ? 44 : -sx * 40), (P[1] + R[1]) / 2, askLeg ? (done(V) ? num(it.v) + u : '?') : num(b) + u, askLeg && done(V) ? C.green : cols.b, { 'text-anchor': 'middle' });
    const hm = [(Q_[0] + R[0]) / 2, (Q_[1] + R[1]) / 2], nx = -(R[1] - Q_[1]), ny = R[0] - Q_[0], nl = Math.hypot(nx, ny), off = (nx * (P[0] - hm[0]) + ny * (P[1] - hm[1])) > 0 ? -26 : 26;
    const cTxt = askLeg ? num(c) + u : done(V) ? num(M.r1(c)) + u : '?';
    lab(A, hm[0] + nx / nl * off, hm[1] + ny / nl * off, cTxt, !askLeg && done(V) ? C.green : cols.c);
    if (!after(V)) return;
    const red = code === 'add' || code === 'noroot' || code === 'sub' || code === 'legadd';
    const f = askLeg ? 'b² = c² − a²' : it.form === 'park' ? 'path² = a² + b²' : 'c² = a² + b²';
    mlab(A, 320, 30, f, red ? C.red : C.muted, { 'font-size': 20, class: 'fade' });
    if (it.form === 'park') lab(A, 320, 395, 'walk ' + (a + b) + ' m' + (done(V) ? '  −  path ' + num(M.r1(c)) + ' m  =  ' + num(it.v) + ' m' : '  −  path'), code === 'diag' || code === 'around' ? C.red : done(V) ? C.green : C.muted, { 'font-size': 18, class: 'fade' });
    else if (done(V)) mlab(A, 320, 395, askLeg ? 'b = √(' + num(c * c) + ' − ' + num(a * a) + ') ≈ ' + num(it.v) : 'c = √(' + num(a * a) + ' + ' + num(b * b) + ') ≈ ' + num(M.r1(c)), C.green, { 'font-size': 19, class: 'fade' });
  }
};

/* ME2 Paint: an oblique box, then its faces listed */
const T_PAINT = {
  id: 'paint', code: 'ME2', name: 'Paint', sec: 2, notes: '../notes/measurement/math9-measurement-notes-v1.html',
  q: it => 'Area to cover (cm²)', kind: 'slots', gen: M.genPaint, typeOf: it => it.form,
  prompt: it => story('A ' + it.what + (it.form === 'open' ? ' with ' + B('no top') : '') + ' is ' + B(it.l + ' cm') + ' long, ' + B(it.w + ' cm') + ' wide and ' + B(it.h + ' cm') + ' tall. ' + it.job),
  slots: () => [{ k: 'v', label: 'area', wide: true }, { h: '<span style="font-family:inherit">cm²</span>' }],
  check: M.checkPaint, answer: it => ({ v: String(it.v) }),
  draw(A, it, V) {
    const code = V.res && V.res.code, wide = after(V), s = Math.min((wide ? 200 : 360) / (it.l + it.w * .5), 240 / (it.h + it.w * .5));
    const L = it.l * s, H = it.h * s, D = it.w * s * .5, x0 = wide ? 110 : 320 - (L + D) / 2, y0 = 340;
    const poly = (pts, a) => A.el('polygon', Object.assign({ points: pts.map(p => p.join(',')).join(' '), 'stroke-linejoin': 'round' }, a), A.svg);
    const fl = [x0, y0], fr = [x0 + L, y0], tl = [x0, y0 - H], tr = [x0 + L, y0 - H], o = [D, -D], add = p => [p[0] + o[0], p[1] + o[1]];
    poly([fr, add(fr), add(tr), tr], { fill: C.teal, 'fill-opacity': .22, stroke: C.teal, 'stroke-width': 2.5 });
    poly([tl, tr, add(tr), add(tl)], it.form === 'open' ? { fill: C.stage, stroke: code === 'all6' ? C.red : C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' } : { fill: C.gold, 'fill-opacity': .22, stroke: C.gold, 'stroke-width': 2.5 });
    poly([fl, fr, tr, tl], { fill: C.blue, 'fill-opacity': .22, stroke: C.blue, 'stroke-width': 2.5 });
    if (it.form === 'open') lab(A, (tl[0] + add(tr)[0]) / 2, (tl[1] + add(tr)[1]) / 2, 'no top', code === 'all6' ? C.red : C.muted, { 'font-size': 15 });
    emo(A, x0 + L / 2, y0 - H / 2, it.icon, Math.min(40, H * .6));
    lab(A, x0 + L / 2, y0 + 22, it.l + ' cm', C.blue); lab(A, x0 - 10, y0 - H / 2, it.h + ' cm', C.blue, { 'text-anchor': 'end' });
    lab(A, fr[0] + D / 2 + 30, fr[1] - D / 2 + 6, it.w + ' cm', C.teal, { 'text-anchor': 'start' });
    if (!wide) return;
    const rows = [['bottom', it.l + ' × ' + it.w, it.lw, 1, C.gold], [it.form === 'open' ? 'top: none' : 'top', it.l + ' × ' + it.w, it.lw, it.form === 'open' ? 0 : 1, C.gold], ['front, back', it.l + ' × ' + it.h, it.lh, 2, C.blue], ['two ends', it.w + ' × ' + it.h, it.wh, 2, C.teal]];
    const X = 360; let y = 70;
    rows.forEach(([nm, f, a, k, col]) => {
      const off = k === 0, warn = (off && code === 'all6') || (k === 2 && code === 'half') || (nm === 'bottom' && code === 'nobase') || (nm === 'top' && code === 'five');
      lab(A, X, y, nm, off ? C.muted : col, { 'font-size': 16, 'text-anchor': 'start' });
      lab(A, X + 250, y, off ? '—' : (k === 2 ? '2 × ' : '') + f + (done(V) ? ' = ' + k * a : ''), warn ? C.red : off ? C.muted : C.text, { 'font-size': 16, 'text-anchor': 'end', class: warn ? 'pulse' : '' });
      y += 44;
    });
    A.el('line', { x1: X, x2: X + 250, y1: y - 18, y2: y - 18, stroke: C.edge, 'stroke-width': 2 }, A.svg);
    lab(A, X + 250, y + 6, done(V) ? it.v + ' cm²' : (it.form === 'open' ? '5 faces' : '6 faces'), done(V) ? C.green : code === 'vol' ? C.red : C.muted, { 'font-size': 19, 'text-anchor': 'end', class: 'fade' });
    if (code === 'vol') lab(A, X + 125, y + 46, 'l × w × h is volume', C.red, { 'font-size': 16 });
  }
};

/* PR1 Predict: a sample grid, then the whole as copies of the sample */
const T_PREDICT = {
  id: 'predict', code: 'PR1', name: 'Predict', sec: 1, notes: '../notes/probability/math9-probability-notes-v1.html',
  q: it => M.predCtx(it).q, kind: 'slots', gen: M.genPredict, typeOf: it => it.form,
  prompt: it => { const c = M.predCtx(it); return story(c.s(B(it.n), B(it.h)) + ' ' + c.w(B(it.N.toLocaleString('en-CA')))); },
  slots: () => [{ k: 'v', label: 'how many', wide: true }],
  check: M.checkPredict, answer: it => ({ v: String(it.v) }),
  draw(A, it, V) {
    const code = V.res && V.res.code, cols = it.n <= 25 ? 5 : 10, rows = Math.ceil(it.n / cols), gap = Math.min(30, 220 / rows, 230 / cols), x0 = 40 + (240 - cols * gap) / 2 + gap / 2, y0 = 90;
    const hit = M.predCtx(it).id === 'watch' ? C.red : C.green;
    for (let i = 0; i < it.n; i++) {
      const on = i < it.h, x = x0 + (i % cols) * gap, y = y0 + Math.floor(i / cols) * gap;
      A.el('circle', { cx: x, cy: y, r: gap * .36, fill: on ? hit : C.muted, 'fill-opacity': on ? .9 : code === 'pp' ? .1 : .3, stroke: on ? hit : C.muted, 'stroke-width': code === 'pp' && !on ? 2 : 1 }, A.svg);
    }
    lab(A, 160, 58, it.h + ' of ' + it.n, hit, { 'font-size': 20 });
    emo(A, 40, 40, M.predCtx(it).icon, 28);
    const gc = Math.min(8, it.m), gr = Math.ceil(it.m / gc), g = Math.min(34, 240 / gr, 250 / gc), X0 = 360 + (250 - gc * g) / 2;
    for (let i = 0; i < it.m; i++) {
      const x = X0 + (i % gc) * g, y = y0 - g / 2 + Math.floor(i / gc) * g;
      A.el('rect', { x: x + 2, y: y + 2, width: g - 4, height: g - 4, rx: 4, fill: C.blue, 'fill-opacity': i === 0 ? .4 : .14, stroke: C.blue, 'stroke-width': 1.2, class: done(V) ? 'fade' : '', style: done(V) ? 'animation-delay:' + i * 25 + 'ms' : null }, A.svg);
      if (done(V) && g > 22) lab(A, x + g / 2, y + g / 2, String(it.h), hit, { 'font-size': Math.min(14, g * .45) });
    }
    lab(A, 485, 58, it.N.toLocaleString('en-CA') + ' in all', C.blue, { 'font-size': 20 });
    A.el('path', { d: 'M290 200H345', stroke: C.yellow, 'stroke-width': 3, 'marker-end': 'url(#aY)' }, A.svg);
    if (!after(V)) return;
    lab(A, 318, 178, '× ' + it.m, code === 'sample' || code === 'scale' ? C.red : C.yellow, { 'font-size': 20, class: 'fade' });
    lab(A, 320, 360, it.N.toLocaleString('en-CA') + ' = ' + it.m + ' groups of ' + it.n, code === 'pp' ? C.text : C.muted, { 'font-size': 18, class: 'fade' });
    if (code === 'pp') lab(A, 160, 330, 'out of all ' + it.n + ', not ' + (it.n - it.h), C.red, { 'font-size': 16 });
    if (done(V)) lab(A, 320, 395, it.m + ' × ' + it.h + ' = ' + it.v, C.green, { 'font-size': 22, class: 'fade' });
  }
};

const SUB = [T_TRIP, T_RUG, T_BILL, T_SAVE, T_BUDGET, T_SHARES, T_CATCH, T_LADDER, T_PAINT, T_PREDICT];
const sub = it => SUB.find(t => t.id === it.t);
/* Mixed: one of the ten at random, as on the PAT */
const T_MIX = {
  id: 'mix', code: 'PAT', name: 'Mixed', sec: 5, notes: '../notes/linear-equations/math9-linear-equations-notes-v1.html',
  q: it => { const t = sub(it); return typeof t.q === 'function' ? t.q(it.it) : t.q; }, kind: 'slots',
  gen: () => { const t = Q.pick(SUB); return { t: t.id, it: t.gen() }; }, typeOf: it => it.t,
  prompt: it => sub(it).prompt(it.it), slots: it => sub(it).slots(it.it),
  check: (it, r) => sub(it).check(it.it, r), answer: it => sub(it).answer(it.it), draw: (A, it, V) => sub(it).draw(A, it.it, V)
};

const PAGE = {
  key: 'math9-pat-trainer-v1', course: 'Math 9 · PAT prep', title: 'PAT Word Problems',
  notes: '../notes/linear-equations/math9-linear-equations-notes-v1.html',
  tabs: SUB.concat([T_MIX])
};
DRILL.boot(PAGE);
