
/* ===================== PAGE: pictures and tabs ===================== */
const { C } = DRILL;
const done = V => V.phase === 'right' || V.phase === 'show';
const A1 = MODEL.ans1;
const valSlot = () => ['=', { k: 'v', label: 'answer', wide: true }];
const poly = (A, pts, a) => A.el('polygon', Object.assign({ points: pts.map(p => p.join(',')).join(' '), 'stroke-linejoin': 'round' }, a), A.svg);
const lab = (A, x, y, s, col, a) => A.mtx(A.svg, x, y, s, Object.assign({ 'font-size': 20, fill: col || C.text }, a || {}));

/* ---------- 3D drawings (oblique) ---------- */
function oblique(x0, y0, s) { return (x, y, z) => [x0 + (x + z * .5) * s, y0 - (y + z * .36) * s]; }
function drawBox(A, it, o) {
  o = o || {}; const { l: L, w: W, h: H } = it, s = o.s || Math.min(320 / (L + W * .5), 260 / (H + W * .36)), P = oblique(o.x0 || 320 - (L + W * .5) * s / 2, o.y0 || 210 + (H + W * .36) * s / 2, s);
  const col = o.col || C.blue, fo = o.fill || .12;
  if (o.base) poly(A, [P(0, 0, 0), P(L, 0, 0), P(L, 0, W), P(0, 0, W)], { fill: C.gold, 'fill-opacity': .45, stroke: C.gold, 'stroke-width': 2 });
  poly(A, [P(0, 0, 0), P(L, 0, 0), P(L, H, 0), P(0, H, 0)], { fill: col, 'fill-opacity': fo, stroke: col, 'stroke-width': 2.5 });
  poly(A, [P(0, H, 0), P(L, H, 0), P(L, H, W), P(0, H, W)], { fill: col, 'fill-opacity': fo * 1.6, stroke: col, 'stroke-width': 2.5 });
  poly(A, [P(L, 0, 0), P(L, 0, W), P(L, H, W), P(L, H, 0)], { fill: col, 'fill-opacity': fo * .7, stroke: col, 'stroke-width': 2.5 });
  if (o.labels !== false) {
    const a = P(L / 2, 0, 0), b = P(L, 0, W / 2), c = P(0, H / 2, 0);
    lab(A, a[0], a[1] + 20, o.lL || 'l = ' + L); lab(A, b[0] + 12, b[1] + 8, o.lW || 'w = ' + W, null, { 'text-anchor': 'start' }); lab(A, c[0] - 12, c[1], o.lH || 'h = ' + H, null, { 'text-anchor': 'end' });
  }
  return P;
}
function drawCyl(A, r, h, o) {
  o = o || {}; const s = Math.min(150 / r, 270 / (h + r * .7)), cx = o.cx || 300, yb = 210 + (h * s) / 2 + 10, yt = yb - h * s, rx = r * s, ry = r * s * .32;
  if (o.base) A.el('ellipse', { cx, cy: yb, rx, ry, fill: C.gold, 'fill-opacity': .45, stroke: C.gold, 'stroke-width': 2 }, A.svg);
  A.el('path', { d: 'M' + (cx - rx) + ' ' + yt + 'V' + yb + 'A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + yb + 'V' + yt, fill: C.blue, 'fill-opacity': .12, stroke: C.blue, 'stroke-width': 2.5 }, A.svg);
  A.el('path', { d: 'M' + (cx - rx) + ' ' + yb + 'A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + yb, fill: 'none', stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '5 5' }, A.svg);
  A.el('ellipse', { cx, cy: yt, rx, ry, fill: C.blue, 'fill-opacity': .2, stroke: C.blue, 'stroke-width': 2.5 }, A.svg);
  if (o.labels !== false) {
    if (o.useD) { A.el('line', { x1: cx - rx, x2: cx + rx, y1: yt, y2: yt, stroke: C.gold, 'stroke-width': 2.5 }, A.svg); lab(A, cx, yt - 16, 'd = ' + 2 * r, C.gold); }
    else { A.el('line', { x1: cx, x2: cx + rx, y1: yt, y2: yt, stroke: C.gold, 'stroke-width': 2.5 }, A.svg); lab(A, cx + rx / 2, yt - 16, 'r = ' + r, C.gold); }
    lab(A, cx + rx + 14, (yt + yb) / 2, 'h = ' + h, null, { 'text-anchor': 'start' });
  }
  return { cx, yb, yt, rx, ry, s };
}
function drawTri(A, it, o) {
  o = o || {}; const { a, b, L } = it, s = Math.min(330 / (a + L * .5), 270 / (b + L * .36)), P = oblique(300 - (a + L * .5) * s / 2, 215 + (b + L * .36) * s / 2, s);
  poly(A, [P(0, 0, 0), P(a, 0, 0), P(0, b, 0)], { fill: o.base ? C.gold : C.blue, 'fill-opacity': o.base ? .45 : .2, stroke: o.base ? C.gold : C.blue, 'stroke-width': 2.5 });
  poly(A, [P(a, 0, 0), P(a, 0, L), P(0, b, L), P(0, b, 0)], { fill: C.blue, 'fill-opacity': .12, stroke: C.blue, 'stroke-width': 2.5 });
  poly(A, [P(0, b, 0), P(0, b, L), P(0, 0, L), P(0, 0, 0)], { fill: 'none', stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '5 5' });
  const pa = P(a / 2, 0, 0), pb = P(0, b / 2, 0), pc = P(a / 2, b / 2, 0), pl = P(a, 0, L / 2);
  lab(A, pa[0], pa[1] + 20, String(a)); lab(A, pb[0] - 14, pb[1], String(b), null, { 'text-anchor': 'end' }); lab(A, pc[0] + 6, pc[1] - 10, String(it.c), C.muted); lab(A, pl[0] + 14, pl[1] + 6, 'L = ' + L, null, { 'text-anchor': 'start' });
}
function drawSolid(A, it, o) { if (it.shape === 'box') drawBox(A, it, o); else if (it.shape === 'cyl') drawCyl(A, it.r, it.h, Object.assign({ useD: it.useD }, o)); else drawTri(A, it, o); }

/* ---------- nets for surface area ---------- */
function faceRect(A, x, y, w, h, val, V, col) {
  A.el('rect', { x, y, width: w, height: h, fill: col || C.blue, 'fill-opacity': .14, stroke: col || C.blue, 'stroke-width': 2, class: 'fade' }, A.svg);
  lab(A, x + w / 2, y + h / 2, done(V) ? A1(val) : '?', done(V) ? C.green : C.muted, { 'font-size': Math.max(13, Math.min(20, w / 4, h / 2)) });
}
function net(A, it, V) {
  if (it.shape === 'box') {
    const { l: L, w: W, h: H } = it, s = Math.min(560 / (2 * L + 2 * W), 360 / (H + 2 * W)), x0 = 320 - (L + W) * s, y0 = 210 - (H / 2 + W) * s;
    const xs = [x0, x0 + W * s, x0 + (W + L) * s, x0 + (2 * W + L) * s], ws = [W, L, W, L];
    xs.forEach((x, i) => faceRect(A, x, y0 + W * s, ws[i] * s, H * s, ws[i] * H, V));
    faceRect(A, xs[1], y0, L * s, W * s, L * W, V, C.teal); faceRect(A, xs[1], y0 + (W + H) * s, L * s, W * s, L * W, V, C.teal);
  } else if (it.shape === 'cyl') {
    const r = it.r, h = it.h, C2 = 2 * Math.PI * r, s = Math.min(480 / C2, 330 / (h + 4 * r)), x0 = 320 - C2 * s / 2, y0 = 210 - (h / 2) * s;
    faceRect(A, x0, y0, C2 * s, h * s, C2 * h, V);
    [y0 - r * s, y0 + h * s + r * s].forEach(cy => { A.el('circle', { cx: 320, cy, r: r * s, fill: C.teal, 'fill-opacity': .14, stroke: C.teal, 'stroke-width': 2, class: 'fade' }, A.svg); lab(A, 320, cy, done(V) ? A1(Math.PI * r * r) : '?', done(V) ? C.green : C.muted, { 'font-size': 16 }); });
    lab(A, 320, y0 + h * s / 2 + 24, '2πr × h', C.muted, { "font-size": 15 });
  } else {
    const { a, b, c, L } = it, s = Math.min(380 / (a + b + c), 300 / (L + Math.max(a, b))), x0 = 300 - (a + b + c) * s / 2, y0 = 230 - L * s / 2;
    let x = x0; [a, b, c].forEach(w => { faceRect(A, x, y0, w * s, L * s, w * L, V); x += w * s; });
    poly(A, [[x0, y0], [x0 + a * s, y0], [x0, y0 - b * s]], { fill: C.teal, 'fill-opacity': .14, stroke: C.teal, 'stroke-width': 2, class: 'fade' });
    poly(A, [[x0, y0 + L * s], [x0 + a * s, y0 + L * s], [x0, y0 + L * s + b * s]], { fill: C.teal, 'fill-opacity': .14, stroke: C.teal, 'stroke-width': 2, class: 'fade' });
    lab(A, x0 + a * s / 3, y0 - b * s / 3, done(V) ? A1(a * b / 2) : '?', done(V) ? C.green : C.muted, { 'font-size': 14 });
    lab(A, x0 + a * s / 3, y0 + L * s + b * s / 3, done(V) ? A1(a * b / 2) : '?', done(V) ? C.green : C.muted, { 'font-size': 14 });
  }
  if (done(V)) lab(A, 30, 34, "SA = " + A1(it.v), C.green, { "font-size": 24, "text-anchor": "start", class: "fade" });
}
const solidQ = it => ({ box: 'rectangular prism', cyl: 'cylinder', tri: 'triangular prism' })[it.shape];

/* ME1 area */
const T_AREA = {
  id: 'area', code: 'ME1', name: 'Area', sec: 1, q: 'Area (one decimal)', kind: 'slots',
  gen: MODEL.genArea, slots: valSlot, check: MODEL.checkArea, answer: it => ({ v: A1(it.v) }),
  draw(A, it, V) {
    const hint = V.phase !== 'ask';
    if (it.shape === 'circle') {
      const R = 140; A.el('circle', { cx: 300, cy: 210, r: R, fill: C.blue, 'fill-opacity': hint ? .2 : .08, stroke: C.blue, 'stroke-width': 3 }, A.svg);
      if (it.useD) { A.el('line', { x1: 160, x2: 440, y1: 210, y2: 210, stroke: C.gold, 'stroke-width': 3 }, A.svg); lab(A, 300, 192, 'd = ' + 2 * it.r, C.gold); if (hint) lab(A, 370, 236, 'r = ' + it.r, C.yellow, { class: 'fade' }); }
      else { A.el('line', { x1: 300, x2: 440, y1: 210, y2: 210, stroke: C.gold, 'stroke-width': 3 }, A.svg); lab(A, 370, 192, 'r = ' + it.r, C.gold); }
      A.el('circle', { cx: 300, cy: 210, r: 4, fill: C.text }, A.svg);
      if (hint) lab(A, 600, 380, 'A = π × ' + it.r + ' × ' + it.r + (done(V) ? ' ≈ ' + A1(it.v) : ''), done(V) ? C.green : C.muted, { 'text-anchor': 'end', class: 'fade' });
      return;
    }
    const w = it.shape === 'rect' ? it.l : it.b, h = it.shape === 'rect' ? it.w : it.h, s = Math.min(420 / (w + (it.shape === 'para' ? 3 : 0)), 280 / h), x0 = 300 - w * s / 2, y0 = 210 + h * s / 2;
    const off = it.shape === 'para' ? Math.sqrt(it.s * it.s - it.h * it.h) * s : 0;
    const pts = it.shape === 'rect' ? [[x0, y0], [x0 + w * s, y0], [x0 + w * s, y0 - h * s], [x0, y0 - h * s]] : it.shape === 'tri' ? [[x0, y0], [x0 + w * s, y0], [x0 + w * s * .3, y0 - h * s]] : [[x0, y0], [x0 + w * s, y0], [x0 + w * s + off, y0 - h * s], [x0 + off, y0 - h * s]];
    if (it.shape === 'tri' && hint) poly(A, [[x0, y0], [x0 + w * s, y0], [x0 + w * s, y0 - h * s], [x0, y0 - h * s]], { fill: 'none', stroke: C.muted, 'stroke-width': 1.5, 'stroke-dasharray': '6 5', class: 'fade' });
    poly(A, pts, { fill: C.blue, 'fill-opacity': hint ? .22 : .1, stroke: C.blue, 'stroke-width': 3 });
    lab(A, x0 + w * s / 2, y0 + 24, (it.shape === 'rect' ? 'l = ' : 'b = ') + w);
    if (it.shape !== 'rect') { const hx = it.shape === 'tri' ? x0 + w * s * .3 : x0 + off; A.el('line', { x1: hx, x2: hx, y1: y0, y2: y0 - h * s, stroke: C.gold, 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, A.svg); lab(A, hx + 10, y0 - h * s / 2, 'h = ' + h, C.gold, { 'text-anchor': 'start' }); }
    else lab(A, x0 + w * s + 12, y0 - h * s / 2, 'w = ' + h, null, { 'text-anchor': 'start' });
    if (it.shape === 'para') lab(A, x0 + w * s + off / 2 + 14, y0 - h * s / 2, String(it.s), C.muted, { 'text-anchor': 'start' });
    if (hint) lab(A, 600, 390, { rect: 'l × w', tri: '½ × b × h', para: 'b × h' }[it.shape] + (done(V) ? ' = ' + A1(it.v) : ''), done(V) ? C.green : C.muted, { 'text-anchor': 'end', class: 'fade' });
  }
};

/* ME2 surface area */
const T_SA = {
  id: 'sa', code: 'ME2', name: 'Surface area', sec: 2, q: it => 'Surface area of the ' + solidQ(it) + ' (one decimal)', kind: 'slots',
  gen: MODEL.genSA, slots: valSlot, check: MODEL.checkSA, answer: it => ({ v: A1(it.v) }),
  draw(A, it, V) { if (V.phase === 'ask') drawSolid(A, it); else net(A, it, V); }
};

/* ME3 volume */
const T_VOL = {
  id: 'vol', code: 'ME3', name: 'Volume', sec: 3, q: it => 'Volume of the ' + solidQ(it) + ' (one decimal)', kind: 'slots',
  gen: MODEL.genVol, slots: valSlot, check: MODEL.checkVol, answer: it => ({ v: A1(it.v) }),
  draw(A, it, V) {
    const hint = V.phase !== 'ask'; drawSolid(A, it, { base: hint });
    if (!hint) return;
    const B = it.shape === 'box' ? it.l * it.w : it.shape === 'cyl' ? Math.PI * it.r * it.r : it.a * it.b / 2, h = it.shape === 'tri' ? it.L : it.h;
    lab(A, 40, 40, 'B = ' + (done(V) ? A1(B) : '?'), C.gold, { 'text-anchor': 'start', 'font-size': 24, class: 'fade' });
    lab(A, 40, 76, 'V = B × ' + h + (done(V) ? ' = ' + A1(it.v) : ''), done(V) ? C.green : C.muted, { 'text-anchor': 'start', 'font-size': 24, class: 'fade' });
  }
};

/* ME4 one third */
const T_THIRD = {
  id: 'third', code: 'ME4', name: '⅓ rule', sec: 4, q: it => 'Volume of the ' + (it.shape === 'cone' ? 'cone' : 'pyramid') + ' (one decimal)', kind: 'slots',
  gen: MODEL.genThird, slots: valSlot, check: MODEL.checkThird, answer: it => ({ v: A1(it.v) }),
  draw(A, it, V) {
    const hint = V.phase !== 'ask', a = it.shape === 'cone' ? it.r : it.s / 2, s = Math.min((it.shape === "cone" ? 150 : 100) / a, 240 / it.h), cx = 280, yb = 330, yt = yb - it.h * s;
    if (it.shape === 'cone') {
      const rx = a * s, ry = rx * .3;
      if (hint) { A.el('path', { d: 'M' + (cx - rx) + ' ' + yt + 'V' + yb + 'M' + (cx + rx) + ' ' + yt + 'V' + yb, stroke: C.muted, 'stroke-dasharray': '6 5', 'stroke-width': 1.5, class: 'fade' }, A.svg); A.el('ellipse', { cx, cy: yt, rx, ry, fill: 'none', stroke: C.muted, 'stroke-dasharray': '6 5', class: 'fade' }, A.svg); }
      A.el('ellipse', { cx, cy: yb, rx, ry, fill: C.blue, 'fill-opacity': .18, stroke: C.blue, 'stroke-width': 2.5 }, A.svg);
      A.el('path', { d: 'M' + (cx - rx) + ' ' + yb + 'L' + cx + ' ' + yt + 'L' + (cx + rx) + ' ' + yb, fill: C.blue, 'fill-opacity': .12, stroke: C.blue, 'stroke-width': 2.5 }, A.svg);
      A.el('line', { x1: cx, x2: cx + rx, y1: yb, y2: yb, stroke: C.gold, 'stroke-width': 2.5 }, A.svg); lab(A, cx + rx / 2, yb + 26, 'r = ' + it.r, C.gold);
    } else {
      const P = oblique(cx - a * s * 1.25, yb + a * s * .36, s), S = 2 * a, top = P(a, it.h, a);
      if (hint) poly(A, [P(0, it.h, 0), P(S, it.h, 0), P(S, it.h, S), P(0, it.h, S)], { fill: 'none', stroke: C.muted, 'stroke-dasharray': '6 5', class: 'fade' });
      if (hint) [[0, 0], [S, 0], [S, S], [0, S]].forEach(([x, z]) => { const p = P(x, 0, z), t = P(x, it.h, z); A.el("line", { x1: p[0], y1: p[1], x2: t[0], y2: t[1], stroke: C.muted, "stroke-dasharray": "6 5", class: "fade" }, A.svg); });
      poly(A, [P(0, 0, 0), P(S, 0, 0), P(S, 0, S), P(0, 0, S)], { fill: C.blue, 'fill-opacity': .18, stroke: C.blue, 'stroke-width': 2 });
      [[0, 0, 0], [S, 0, 0], [S, 0, S]].forEach(q => A.el('line', { x1: P(...q)[0], y1: P(...q)[1], x2: top[0], y2: top[1], stroke: C.blue, 'stroke-width': 2.5 }, A.svg));
      const e = P(S / 2, 0, 0); lab(A, e[0], e[1] + 24, 's = ' + it.s, C.gold);
    }
    const base = it.shape === 'cone' ? [cx, yb] : oblique(cx - a * s * 1.25, yb + a * s * .36, s)(a, 0, a), apex = it.shape === 'cone' ? [cx, yt] : oblique(cx - a * s * 1.25, yb + a * s * .36, s)(a, it.h, a);
    A.el('line', { x1: base[0], y1: base[1], x2: apex[0], y2: apex[1], stroke: C.yellow, 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, A.svg);
    lab(A, base[0] - 10, (base[1] + apex[1]) / 2, 'h = ' + it.h, C.yellow, { 'text-anchor': 'end' });
    lab(A, 610, 110, "slant l = " + it.l, C.muted, { "text-anchor": "end", "font-size": 18 });
    if (hint) lab(A, 610, 392, "3 of them fill the dashed shape", C.muted, { "text-anchor": "end", "font-size": 18, class: "fade" });
    if (hint) lab(A, 40, 40, 'V = ⅓ × B × h' + (done(V) ? ' = ' + A1(it.v) : ''), done(V) ? C.green : C.muted, { 'text-anchor': 'start', 'font-size': 24, class: 'fade' });
  }
};

/* ME4 sphere */
const T_SPHERE = {
  id: 'sphere', code: 'ME4', name: 'Sphere', sec: 4, q: it => (it.what === 'V' ? 'Volume' : 'Surface area') + ' of the sphere (one decimal)', kind: 'slots',
  gen: MODEL.genSphere, slots: valSlot, check: MODEL.checkSphere, answer: it => ({ v: A1(it.v) }),
  draw(A, it, V) {
    const R = 150, cx = 280, cy = 215, hint = V.phase !== 'ask';
    A.el('circle', { cx, cy, r: R, fill: C.blue, 'fill-opacity': it.what === 'V' ? .22 : .06, stroke: C.blue, 'stroke-width': it.what === 'SA' ? 5 : 3 }, A.svg);
    A.el('ellipse', { cx, cy, rx: R, ry: R * .28, fill: 'none', stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }, A.svg);
    if (it.useD) { A.el('line', { x1: cx - R, x2: cx + R, y1: cy, y2: cy, stroke: C.gold, 'stroke-width': 3 }, A.svg); lab(A, cx, cy - 18, 'd = ' + 2 * it.r, C.gold); }
    else { A.el('line', { x1: cx, x2: cx + R, y1: cy, y2: cy, stroke: C.gold, 'stroke-width': 3 }, A.svg); lab(A, cx + R / 2, cy - 18, 'r = ' + it.r, C.gold); }
    if (hint) lab(A, 600, 60, it.what === 'V' ? 'V = ⁴⁄₃ π r³' : 'SA = 4 π r²', C.muted, { 'text-anchor': 'end', 'font-size': 24, class: 'fade' });
    if (hint && it.useD) lab(A, 600, 100, 'r = ' + it.r, C.yellow, { 'text-anchor': 'end', class: 'fade' });
    if (done(V)) lab(A, 600, 380, '≈ ' + A1(it.v), C.green, { 'text-anchor': 'end', 'font-size': 28, class: 'pop' });
  }
};

/* ME5 composite */
const T_COMP = {
  id: 'comp', code: 'ME5', name: 'Composite', sec: 5, q: 'Surface area of the whole object', kind: 'slots',
  gen: MODEL.genComp, slots: valSlot, check: MODEL.checkComp, answer: it => ({ v: A1(it.v) }),
  draw(A, it, V) {
    const hint = V.phase !== 'ask', s = Math.min(330 / (it.L + it.W * .5), 250 / (it.H + it.h + it.W * .36 + (hint ? 3 : 0))), x0 = 300 - (it.L + it.W * .5) * s / 2, y0 = 360;
    const P = drawBox(A, { l: it.L, w: it.W, h: it.H }, { s, x0, y0, lL: String(it.L), lW: String(it.W), lH: String(it.H) });
    const ox = (it.L - it.l) / 2, oz = (it.W - it.w) / 2, lift = hint ? 3 : 0;
    if (hint) poly(A, [P(ox, it.H, oz), P(ox + it.l, it.H, oz), P(ox + it.l, it.H, oz + it.w), P(ox, it.H, oz + it.w)], { fill: C.red, 'fill-opacity': .45, stroke: C.red, 'stroke-width': 2, class: 'pulse' });
    const b = P(ox, it.H + lift, oz);
    drawBox(A, { l: it.l, w: it.w, h: it.h }, { s, x0: b[0], y0: b[1], col: C.teal, lL: String(it.l), lW: String(it.w), lH: String(it.h) });
    if (hint) { const q = P(ox, it.H + lift, oz); poly(A, [[q[0], q[1]], P(ox + it.l, it.H + lift, oz), P(ox + it.l, it.H + lift, oz + it.w), P(ox, it.H + lift, oz + it.w)], { fill: C.red, 'fill-opacity': .3, stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '5 4', class: 'fade' }); }
    if (hint) lab(A, 30, 34, it.s1 + ' + ' + it.s2 + ' − 2 × ' + (it.l * it.w) + (done(V) ? ' = ' + it.v : ''), done(V) ? C.green : C.muted, { 'text-anchor': 'start', 'font-size': 22, class: 'fade' });
  }
};

/* SA or V? */
const T_JOB = {
  id: 'job', code: 'ME2–3', name: 'SA or V?', sec: 2, q: 'Surface area or volume?', kind: 'choice',
  gen: MODEL.genJob, prompt: it => '<span style="font-family:inherit;font-size:24px;font-weight:650">' + it.text + '</span>',
  choices: () => [{ v: 'sa', label: 'Surface area' }, { v: 'v', label: 'Volume' }], check: MODEL.checkJob, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    A.tx(A.svg, 320, V.phase === 'ask' ? 210 : 90, it.icon, { 'font-size': V.phase === 'ask' ? 120 : 60, stroke: 'none' });
    if (V.phase === 'ask') return;
    const it2 = { l: 6, w: 4, h: 4 };
    if (it.ans === 'v') {
      for (let k = 0; k < 4; k++) drawBox(A, { l: 6, w: 4, h: k + 1 }, { s: 40, x0: 160, y0: 360, labels: false, col: C.teal, fill: .1 });
      lab(A, 320, 395, 'fills the inside: cm³', C.green, { class: 'fade' });
    } else {
      drawBox(A, it2, { s: 40, x0: 160, y0: 360, labels: false, col: C.gold, fill: .05 });
      lab(A, 320, 395, 'covers the outside: cm²', C.green, { class: 'fade' });
    }
  }
};

const PAGE = {
  key: 'math9-measurement-trainer-v1', course: 'Math 9 · Measurement & Geometry', title: 'Surface Area & Volume',
  notes: '../notes/measurement/math9-measurement-notes-v1.html',
  tabs: [T_AREA, T_SA, T_VOL, T_THIRD, T_SPHERE, T_COMP, T_JOB]
};
DRILL.boot(PAGE);
