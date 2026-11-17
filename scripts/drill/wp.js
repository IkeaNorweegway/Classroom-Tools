
/* ===== WORD PROBLEMS KIT (Math 9 and Science 7 word-problem trainers) =====
   The picture has two parts: a schematic of the story at the top, and the step chain at the bottom
   (one numbered row per step, so Level 1 shows one row, Level 3 three or more).
     ask    the givens, and an empty row for each step
     wrong  every step's label (the plan), with the step the named mistake points to in red
     right / show   each step's working fades in, in order; the parts of the picture tied to a step (s) appear with it
   A picture part may carry s (the step it belongs to: hidden until solved) and q (the unknown: '?' until solved).
   Pictures: nl (number line), bar, rects (rectangles, area models; foot = a label under them), tri (right triangle
   in a scene), chain (repeated × or ÷), cube, graph (lines, points, rise/run, a reading), table (values with their
   changes), flow (operations, with the undo arrows underneath; noundo for a plain chain), shape (a polygon with labelled
   sides), circ (a circle with chords, tangents and angles), solid (cylinders, cones, spheres, prisms, pyramids, stacked),
   pair (two similar triangles), scene (shadows, or a mirror on the ground).
   An item with poly (Algebra: polynomial answers) gets coefficient boxes instead of one answer box. */
const WP = (() => {
  const { C } = DRILL;
  const COL = { L: C.blue, Y: C.yellow, N: C.green, R: C.red, G: C.gold, T: C.teal, P: C.pink, M: C.muted, W: C.text };
  const col = k => COL[k] || k || C.text;
  const LVC = ['', C.teal, C.gold, C.pink], LVN = ['', 'one step', 'two steps', 'three steps'];
  const done = V => V.phase === 'right' || V.phase === 'show';
  const DLY = .45;                                                   // seconds between steps on Show me
  const nice = x => { const p = Math.pow(10, Math.floor(Math.log10(x))); return [1, 2, 2.5, 5, 10].map(k => k * p).find(k => k >= x) || 10 * p; };
  const fmt = x => (x < 0 ? '−' : '') + String(Math.abs(Math.round(x * 1000) / 1000));
  let ITEM = null;

  function lab(A, x, y, s, c, a) { return A.tx(A.svg, x, y, s, Object.assign({ 'font-size': 17, fill: c || C.text }, a || {})); }
  // Is a part of the picture on screen, and how is it styled?
  const on = (e, V) => e.s == null || done(V) || hot(e, V);
  const hot = (e, V) => V.phase === 'wrong' && V.res && e.s != null && V.res.s === e.s;
  const anim = (e, V) => e.s != null && done(V) && V.anim ? { class: 'fade', style: 'animation-delay:' + (e.s * DLY + .15) + 's' } : {};
  // A label that may be the unknown: '?' until solved, then the answer (or its own solved text d).
  function qtext(s, d, V) { if (done(V) && d != null) return d; if (s !== '?') return s; return done(V) ? (ITEM.pre || '') + ITEM.ans + (ITEM.unit ? (ITEM.unit === '°' ? '' : ' ') + ITEM.unit : '') : '?'; }
  const qcol = (s, V, c) => s === '?' ? (done(V) ? C.green : C.yellow) : c;

  /* ---------- number line (horizontal, or vertical for depth) ---------- */
  function nl(A, p, V, H) {
    const xs = []; (p.pts || []).forEach(e => xs.push(e.x)); (p.jumps || []).forEach(j => xs.push(j.a, j.b));
    let lo = Math.min(...xs), hi = Math.max(...xs); const pad = Math.max((hi - lo) * .12, .5); lo -= pad; hi += pad;
    const st = nice((hi - lo) / 8), vert = !!p.vert;
    const P0 = vert ? H - 22 : 50, P1 = vert ? 34 : 590, at = v => P0 + (v - lo) / (hi - lo) * (P1 - P0);
    const ax = vert ? 250 : 0, ay = vert ? 0 : Math.min(H * .58, H - 60);
    const pos = v => vert ? [ax, at(v)] : [at(v), ay];
    A.el('line', vert ? { x1: ax, x2: ax, y1: P0 + 10, y2: P1 - 14, stroke: C.axis, 'stroke-width': 2.5, 'marker-end': 'url(#aA)' } : { x1: P0 - 14, x2: P1 + 14, y1: ay, y2: ay, stroke: C.axis, 'stroke-width': 2.5, 'marker-end': 'url(#aA)' }, A.svg);
    for (let v = Math.ceil(lo / st) * st; v <= hi + 1e-9; v += st) {
      const [x, y] = pos(v), z = Math.abs(v) < 1e-9;
      A.el('line', vert ? { x1: x - (z ? 12 : 7), x2: x + (z ? 12 : 7), y1: y, y2: y } : { x1: x, x2: x, y1: y - (z ? 12 : 7), y2: y + (z ? 12 : 7) }, A.svg).setAttribute('stroke', z ? C.text : C.axis);
      lab(A, vert ? x - 18 : x, vert ? y : y + 24, fmt(v), z ? C.text : C.tick, { 'font-size': 14, 'text-anchor': vert ? 'end' : 'middle' });
    }
    if (p.unit) lab(A, vert ? ax : P1 + 6, vert ? P1 - 26 : ay - 22, p.unit, C.muted, { 'font-size': 15 });
    // jumps: up/right above (or right of) the line, down/left below
    (p.jumps || []).forEach((j, i) => {
      if (!on(j, V)) return;
      const [xa, ya] = pos(j.a), [xb, yb] = pos(j.b), fw = j.b >= j.a, d = Math.abs(vert ? yb - ya : xb - xa), h = Math.min(70, 18 + d * .35);
      const c = hot(j, V) ? C.red : col(j.c), side = fw ? -1 : 1, a = Object.assign({}, anim(j, V));
      const path = vert ? 'M' + (xa + 6) + ' ' + ya + 'Q' + (xa + 6 + h * 1.4) + ' ' + (ya + yb) / 2 + ' ' + (xb + 6) + ' ' + yb
        : 'M' + xa + ' ' + (ya + side * 6) + 'Q' + (xa + xb) / 2 + ' ' + (ya + side * h * 2) + ' ' + xb + ' ' + (yb + side * 6);
      A.el('path', Object.assign({ d: path, fill: 'none', stroke: c, 'stroke-width': 3, 'marker-end': 'url(#a' + (c === C.red ? 'R' : j.c === 'N' ? 'N' : j.c === 'R' ? 'R' : 'Y') + ')', 'stroke-dasharray': hot(j, V) ? '6 5' : null }, a), A.svg);
      const t = j.q ? qtext('?', null, V) : j.t;
      if (t && !(hot(j, V) && j.q)) lab(A, vert ? xa + 14 + h * .75 : (xa + xb) / 2, vert ? (ya + yb) / 2 : ya + side * (h + 14), t, j.q ? qcol('?', V, c) : c, Object.assign({ 'font-size': 16, 'text-anchor': vert ? 'start' : 'middle' }, a));
    });
    // points; labels alternate above and below so neighbours don't collide
    const labelled = (p.pts || []).filter(e => !e.dot).sort((a, b) => a.x - b.x);
    (p.pts || []).forEach(e => {
      if (!on(e, V)) return;
      const [x, y] = pos(e.x), c = hot(e, V) ? C.red : col(e.c), a = anim(e, V);
      A.el('circle', Object.assign({ cx: x, cy: y, r: e.dot ? 5 : 7, fill: c, stroke: C.stage, 'stroke-width': 2 }, a), A.svg);
      if (e.dot || !e.t) return;
      const k = labelled.indexOf(e), up = k % 2 === 0;
      if (vert) lab(A, x + 16, y, e.t + ' ' + fmt(e.x), c, Object.assign({ 'font-size': 15, 'text-anchor': 'start' }, a));
      else { lab(A, x, y + (up ? -40 : 46), e.t, c, Object.assign({ 'font-size': 15 }, a)); lab(A, x, y + (up ? -22 : 64), fmt(e.x), c, Object.assign({ 'font-size': 15 }, a)); }
    });
  }

  /* ---------- rectangles (units: x right, y down), scaled to fit ---------- */
  function rects(A, p, V, H) {
    const rs = p.rs, X0 = Math.min(...rs.map(r => r.x)), Y0 = Math.min(...rs.map(r => r.y)), X1 = Math.max(...rs.map(r => r.x + r.w)), Y1 = Math.max(...rs.map(r => r.y + r.h));
    const k = Math.min(440 / (X1 - X0), (H - 90) / (Y1 - Y0), (p.cap || 230) / Math.max(1e-9, Math.min(...rs.map(r => Math.max(r.w, r.h))))), w = (X1 - X0) * k, h = (Y1 - Y0) * k;
    const ox = 320 - w / 2 - X0 * k, oy = 40 + (H - 80 - h) / 2 - Y0 * k;
    rs.forEach(r => {
      const x = ox + r.x * k, y = oy + r.y * k, W = r.w * k, Hh = r.h * k, c = col(r.c);
      if (r.ring != null && on({ s: r.ring }, V)) A.el('rect', Object.assign({ x: x - 9, y: y - 9, width: W + 18, height: Hh + 18, rx: 4, fill: 'none', stroke: C.gold, 'stroke-width': 3, 'stroke-dasharray': '10 6' }, anim({ s: r.ring }, V)), A.svg);
      A.el('rect', { x, y, width: W, height: Hh, rx: 3, fill: c, 'fill-opacity': .16, stroke: c, 'stroke-width': 3 }, A.svg);
      if (r.t) lab(A, x + W / 2, y + Hh / 2, qtext(r.t, r.td, V), qcol(r.t, V, c), { 'font-size': Math.min(20, Math.max(13, W / 6)) });
      if (r.tw && on({ s: r.tws }, V)) lab(A, x + W / 2, y - (r.ring != null ? 30 : 18), qtext(r.tw, r.twd, V), qcol(r.tw, V, c), Object.assign({ 'font-size': 17 }, anim({ s: r.tws }, V)));
      if (r.lh) lab(A, x - 12, y + Hh / 2, qtext(r.lh, null, V), qcol(r.lh, V, c), { 'font-size': 17, 'text-anchor': 'end' });
      if (r.rh) lab(A, x + W + 12, y + Hh / 2, qtext(r.rh, null, V), qcol(r.rh, V, c), { 'font-size': 17, 'text-anchor': 'start' });
      if (r.bw) lab(A, x + W / 2, y + Hh + 20, qtext(r.bw, null, V), qcol(r.bw, V, c), { 'font-size': 17 });
    });
    if (p.foot) lab(A, 320, oy + Y1 * k + (rs.some(r => r.bw) ? 46 : 28), qtext(p.foot, null, V), qcol(p.foot, V, C.muted), { 'font-size': 18 });
    if (p.shared && on(p.shared, V)) { const s = p.shared, x = ox + s.x * k; A.el('line', Object.assign({ x1: x, x2: x, y1: oy + s.y0 * k, y2: oy + s.y1 * k, stroke: C.red, 'stroke-width': 6, 'stroke-dasharray': '8 6' }, anim(s, V)), A.svg); if (done(V)) lab(A, x + 12, oy + s.y0 * k - 14, 'inside: not perimeter', C.red, Object.assign({ 'font-size': 15, 'text-anchor': 'start' }, anim(s, V))); }
    return { ox, oy, k };
  }

  /* ---------- right triangle in a scene: legs a (across) and b (up), the hypotenuse c ---------- */
  function tri(A, p, V, H) {
    const k = Math.min(400 / p.a, (H - 90) / p.b), w = p.a * k, h = p.b * k, x0 = 320 - w / 2, y0 = H - 40, xR = x0 + w, yT = y0 - h;
    const L = (s, d, q) => qtext(s, d, V), lc = s => s === '?' || /\?/.test(s);
    if (p.scene === 'tv' || p.scene === 'park') {
      const fill = p.scene === 'tv' ? C.blue : C.green;
      A.el('rect', { x: x0, y: yT, width: w, height: h, rx: p.scene === 'tv' ? 8 : 2, fill, 'fill-opacity': .12, stroke: fill, 'stroke-width': p.scene === 'tv' ? 6 : 3 }, A.svg);
      if (p.scene === 'park') A.el('path', { d: 'M' + x0 + ' ' + y0 + 'H' + xR + 'V' + yT, fill: 'none', stroke: C.blue, 'stroke-width': 4, 'stroke-dasharray': '2 8', 'stroke-linecap': 'round' }, A.svg);
      A.el('line', { x1: x0, y1: y0, x2: xR, y2: yT, stroke: C.yellow, 'stroke-width': 4, 'stroke-dasharray': p.scene === 'park' ? '10 7' : null }, A.svg);
      if (p.scene === 'tv') A.el('rect', { x: x0 + w / 2 - 30, y: y0 + 6, width: 60, height: 8, rx: 3, fill: C.muted }, A.svg);
    } else {
      A.el('line', { x1: x0 - 40, x2: xR + 40, y1: y0, y2: y0, stroke: C.green, 'stroke-width': 3 }, A.svg);   // ground
      const upc = p.scene === 'ladder' ? C.muted : C.text;
      A.el('line', { x1: xR, x2: xR, y1: y0, y2: yT - (p.scene === 'ladder' ? 30 : 0), stroke: upc, 'stroke-width': p.scene === 'ladder' ? 10 : 6 }, A.svg);   // wall or mast
      if (p.scene === 'ladder') {
        const n = 9; A.el('line', { x1: x0, y1: y0, x2: xR - 5, y2: yT, stroke: C.gold, 'stroke-width': 4 }, A.svg);
        for (let i = 1; i < n; i++) { const t = i / n, x = x0 + (xR - 5 - x0) * t, y = y0 + (yT - y0) * t; A.el('line', { x1: x - 7, y1: y - 4, x2: x + 7, y2: y + 4, stroke: C.gold, 'stroke-width': 2 }, A.svg); }
      } else A.el('line', { x1: x0, y1: y0, x2: xR, y2: yT, stroke: C.yellow, 'stroke-width': 2.5 }, A.svg);
      A.el('path', { d: 'M' + (xR - 16) + ' ' + y0 + 'v-16h16', fill: 'none', stroke: C.muted, 'stroke-width': 2 }, A.svg);
    }
    if (p.mark) { const my = y0 - p.mark.y * k; A.el('rect', { x: xR + 6, y: my - 4, width: 46, height: 8, fill: C.teal }, A.svg); lab(A, xR + 58, my, p.mark.t, C.teal, { 'font-size': 15, 'text-anchor': 'start' }); if (done(V)) A.el('line', { x1: xR + 30, x2: xR + 30, y1: my - 6, y2: yT + 4, stroke: C.green, 'stroke-width': 3, 'marker-end': 'url(#aN)', class: 'fade', style: 'animation-delay:' + (2 * DLY + .15) + 's' }, A.svg); }
    lab(A, (x0 + xR) / 2, y0 + 22, L(p.la, p.lad), qcol(lc(p.la) ? '?' : '', V, C.text));
    if (p.lb || p.lbd) lab(A, xR + 14, p.mark ? (y0 + y0 - p.mark.y * k) / 2 : (y0 + yT) / 2, L(p.lb, p.lbd), qcol(lc(p.lb) ? '?' : '', V, C.text), { 'text-anchor': 'start' });
    lab(A, (x0 + xR) / 2 - 26, (y0 + yT) / 2 - 10, L(p.lc, p.lcd), qcol(lc(p.lc) ? '?' : '', V, p.scene === 'ladder' ? C.gold : C.yellow), { 'text-anchor': 'end' });
  }

  /* ---------- repeated × or ÷ (powers): start box, op arrows, end box ---------- */
  function chain(A, p, V, H) {
    const n = p.n, full = n <= 4, show = full ? n : 3, slots = full ? n + 1 : 5, bw = 84, gap = (580 - slots * bw) / (slots - 1), y = Math.min(H * .42, H - 110), xAt = i => 30 + i * (bw + gap);
    const boxes = [];
    for (let i = 0; i < slots; i++) boxes.push(i === 0 ? p.start : i === slots - 1 ? p.end : '');
    boxes.forEach((b, i) => {
      const x = xAt(i), last = i === slots - 1, q = last && p.end === '?', c = i === 0 ? C.blue : last ? (q ? C.yellow : C.blue) : C.edge;
      if (!full && i === slots - 2) { lab(A, x + bw / 2, y + 23, '…', C.muted, { 'font-size': 30 }); return; }
      A.el('rect', { x, y, width: bw, height: 46, rx: 8, fill: c, 'fill-opacity': .14, stroke: c, 'stroke-width': 2.5 }, A.svg);
      const t = last ? qtext(p.end, p.endd, V) : b; if (t) lab(A, x + bw / 2, y + 23, t, q ? qcol('?', V, c) : C.text, { 'font-size': t.length > 7 ? 15 : 18 });
      if (i < slots - 1 && !(!full && i === slots - 3)) {
        const xa = x + bw, xb = xAt(i + 1);
        A.el('line', { x1: xa + 5, x2: xb - 7, y1: y + 23, y2: y + 23, stroke: C.gold, 'stroke-width': 2.5, 'marker-end': 'url(#aG)' }, A.svg);
        lab(A, (xa + xb) / 2, y - 14, p.op, C.gold, { 'font-size': 16 });
        if (p.every) lab(A, (xa + xb) / 2, y + 66, p.every, C.muted, { 'font-size': 14 });
      }
    });
    // the count of steps under the chain
    const x1 = xAt(0) + bw / 2, x2 = xAt(slots - 1) + bw / 2, yb = y + (p.every ? 92 : 74);
    A.el('path', { d: 'M' + x1 + ' ' + yb + 'q0 10 10 10H' + ((x1 + x2) / 2 - 10) + 'q10 0 10 10q0 -10 10 -10H' + (x2 - 10) + 'q10 0 10 -10', fill: 'none', stroke: C.muted, 'stroke-width': 2 }, A.svg);
    const ct = p.cnt || n + ' × (' + p.op.replace(/\s/g, '') + ')', cd = p.cntd;
    lab(A, (x1 + x2) / 2, yb + 40, qtext(ct, cd, V), ct === '?' && !done(V) ? C.yellow : C.gold, Object.assign({ 'font-size': 18 }, ct === '?' && done(V) && V.anim ? { class: 'fade' } : {}));
    if (p.sum && done(V)) lab(A, 320, yb + 72, 'add every round: ' + p.start + ' + … + ' + (p.endd || p.end), C.green, { 'font-size': 16, class: 'fade', style: 'animation-delay:' + 2 * DLY + 's' });
  }

  /* ---------- a cube (with small cubes along an edge when packing) ---------- */
  function cube(A, p, V, H) {
    const s = Math.min(190, (H - 96) / 1.45), d = s * .45, x0 = 320 - (s + d) / 2, y0 = 22 + d + (H - 96 - s - d) / 2, c = C.blue;
    const face = (pts, op) => A.el('path', { d: 'M' + pts.map(q => q.join(' ')).join('L') + 'z', fill: c, 'fill-opacity': op, stroke: c, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, A.svg);
    face([[x0, y0], [x0 + s, y0], [x0 + s, y0 + s], [x0, y0 + s]], .14);
    face([[x0, y0], [x0 + d, y0 - d], [x0 + s + d, y0 - d], [x0 + s, y0]], .24);
    face([[x0 + s, y0], [x0 + s + d, y0 - d], [x0 + s + d, y0 + s - d], [x0 + s, y0 + s]], .08);
    if (p.n) {
      const n = p.n, g = s / n, show = done(V);
      if (show) for (let i = 1; i < n; i++) {
        A.el('line', { x1: x0 + i * g, x2: x0 + i * g, y1: y0, y2: y0 + s, stroke: c, 'stroke-opacity': .4, class: 'fade' }, A.svg);
        A.el('line', { x1: x0, x2: x0 + s, y1: y0 + i * g, y2: y0 + i * g, stroke: c, 'stroke-opacity': .4, class: 'fade' }, A.svg);
        A.el('line', { x1: x0 + i * g, x2: x0 + i * g + d, y1: y0, y2: y0 - d, stroke: c, 'stroke-opacity': .4, class: 'fade' }, A.svg);
        A.el('line', { x1: x0 + s + i * d / n, x2: x0 + s + i * d / n, y1: y0 - i * d / n, y2: y0 + s - i * d / n, stroke: c, 'stroke-opacity': .4, class: 'fade' }, A.svg);
      }
      A.el('rect', { x: x0, y: y0 + s - g, width: g, height: g, fill: C.yellow, 'fill-opacity': .5, stroke: C.yellow, 'stroke-width': 2 }, A.svg);
      lab(A, x0 - 10, y0 + s - g / 2, p.small, C.yellow, { 'font-size': 15, 'text-anchor': 'end' });
      if (show) lab(A, x0 + s / 2, y0 + s + 46, n + ' along each edge', C.green, { 'font-size': 15, class: 'fade' });
    }
    lab(A, x0 + s / 2, y0 + s + 22, p.edge, C.text);
    if (!p.n) lab(A, x0 + s / 2, y0 + s / 2, qtext('?', null, V), qcol('?', V, C.yellow), { 'font-size': 20 });
  }

  /* ---------- bar model: rows of segments ---------- */
  function bar(A, p, V, H) {
    const tot = r => r.segs.reduce((a, s) => a + s.v, 0), max = Math.max(...p.rows.map(tot)), px = 520 / max, rh = 54, gap = 46;
    const y0 = Math.max(46, (H - p.rows.length * (rh + gap)) / 2 + 20);
    p.rows.forEach((r, i) => {
      let x = 60; const y = y0 + i * (rh + gap);
      if (r.t) lab(A, 60, y - 16, r.t, C.muted, { 'font-size': 15, 'text-anchor': 'start' });
      r.segs.forEach(s => {
        const w = s.v * px; if (!on(s, V)) { x += w; return; }
        const c = hot(s, V) ? C.red : col(s.c), a = anim(s, V);
        A.el('rect', Object.assign({ x: x + 1, y, width: Math.max(0, w - 2), height: rh, rx: 5, fill: c, 'fill-opacity': s.q && !done(V) ? .06 : .2, stroke: c, 'stroke-width': 2, 'stroke-dasharray': s.q && !done(V) ? '6 5' : null }, a), A.svg);
        const t = s.q ? qtext('?', s.d, V) : s.t; if (t && w > 26) lab(A, x + w / 2, y + rh / 2, t, s.q ? qcol('?', V, c) : C.text, Object.assign({ 'font-size': w > 80 ? 16 : 13 }, a));
        x += w;
      });
      if (r.brace) { const b = r.brace; lab(A, 60 + tot(r) * px / 2, y + rh + 24, qtext(b, null, V), qcol(b, V, C.muted), { 'font-size': 16 }); }
    });
    footer(A, p, V, H - 16);
  }

  /* ---------- a graph in the first quadrant: lines, points, a rise/run triangle, a reading ---------- */
  // p: { xl, yl, lines: [{m, b, x0, x1, c, s, t}], pts: [{x, y, t, c, s, q, pos}], rr: {a:[x,y], b:[x,y], run, rise, s0, s1}, read: {x, s} }
  function graph(A, p, V, H) {
    const X0 = 86, X1 = 596, Y0 = H - 40, Y1 = 34, xs = [0], ys = [0];
    (p.pts || []).forEach(e => { xs.push(e.x); ys.push(e.y); });
    (p.lines || []).forEach(l => { xs.push(l.x0, l.x1); ys.push(l.m * l.x0 + l.b, l.m * l.x1 + l.b); });
    if (p.read) xs.push(p.read.x);
    const xhi = Math.max(...xs) * 1.1, yhi = Math.max(...ys) * 1.14;
    const sx = x => X0 + x / xhi * (X1 - X0), sy = y => Y0 - y / yhi * (Y0 - Y1);
    const tx = [1, 2, 5, 10, 20, 50, 100].find(k => k >= xhi / 8) || nice(xhi / 7), ty = nice(yhi / 5);   // whole-number steps across (hours, months)
    for (let v = tx; v <= xhi; v += tx) { A.el('line', { x1: sx(v), x2: sx(v), y1: Y0, y2: Y1, stroke: C.grid, 'stroke-width': 1 }, A.svg); lab(A, sx(v), Y0 + 18, fmt(v), C.tick, { 'font-size': 13 }); }
    for (let v = ty; v <= yhi; v += ty) { A.el('line', { x1: X0, x2: X1, y1: sy(v), y2: sy(v), stroke: C.grid, 'stroke-width': 1 }, A.svg); lab(A, X0 - 8, sy(v), fmt(v), C.tick, { 'font-size': 13, 'text-anchor': 'end' }); }
    A.el('line', { x1: X0, x2: X1 + 12, y1: Y0, y2: Y0, stroke: C.axis, 'stroke-width': 2.5, 'marker-end': 'url(#aA)' }, A.svg);
    A.el('line', { x1: X0, x2: X0, y1: Y0, y2: Y1 - 14, stroke: C.axis, 'stroke-width': 2.5, 'marker-end': 'url(#aA)' }, A.svg);
    lab(A, X0 - 8, Y0 + 18, '0', C.tick, { 'font-size': 13, 'text-anchor': 'end' });
    if (p.xl) lab(A, X1, Y0 + 34, p.xl, C.muted, { 'font-size': 14, 'text-anchor': 'end' });
    if (p.yl) lab(A, X0 + 10, Y1 - 12, p.yl, C.muted, { 'font-size': 14, 'text-anchor': 'start' });
    (p.lines || []).forEach(l => {
      if (!on(l, V)) return;
      const c = hot(l, V) ? C.red : col(l.c), a = anim(l, V);
      A.el('line', Object.assign({ x1: sx(l.x0), y1: sy(l.m * l.x0 + l.b), x2: sx(l.x1), y2: sy(l.m * l.x1 + l.b), stroke: c, 'stroke-width': 3.5, 'stroke-dasharray': l.dash ? '9 7' : null }, a), A.svg);
      if (l.t) lab(A, sx(l.x1) + 6, sy(l.m * l.x1 + l.b), l.t, c, Object.assign({ 'font-size': 15, 'text-anchor': 'start' }, a));
    });
    if (p.rr) {
      const r = p.rr, [ax, ay] = [sx(r.a[0]), sy(r.a[1])], [bx, by] = [sx(r.b[0]), sy(r.b[1])];
      [[r.s0, ax, ay, bx, ay, r.run, (ax + bx) / 2, ay + (by < ay ? 20 : -14), 'middle'], [r.s1, bx, ay, bx, by, r.rise, bx + 10, (ay + by) / 2, 'start']].forEach(([s, x1, y1, x2, y2, t, lx, ly, an]) => {
        const e = { s }; if (!on(e, V)) return;
        const c = hot(e, V) ? C.red : C.gold, a = anim(e, V);
        A.el('line', Object.assign({ x1, y1, x2, y2, stroke: c, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, a), A.svg);
        if (t) lab(A, lx, ly, t, c, Object.assign({ 'font-size': 15, 'text-anchor': an }, a));
      });
    }
    if (p.read && on(p.read, V)) {
      const r = p.read, l = p.lines[0], y = l.m * r.x + l.b, c = hot(r, V) ? C.red : C.green, a = anim(r, V);
      A.el('path', Object.assign({ d: 'M' + sx(r.x) + ' ' + Y0 + 'V' + sy(y) + 'H' + X0, fill: 'none', stroke: c, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, a), A.svg);
    }
    (p.pts || []).filter(e => e.dot).forEach(e => A.el('circle', { cx: sx(e.x), cy: sy(e.y), r: 4.5, fill: col(e.c), 'fill-opacity': .55, stroke: col(e.c), 'stroke-width': 1.5 }, A.svg));   // scatter data
    (p.pts || []).filter(e => !e.dot).forEach(e => {
      if (!on(e, V)) return;
      const x = sx(e.x), y = sy(e.y), c = hot(e, V) ? C.red : e.q ? qcol('?', V, col(e.c)) : col(e.c), a = anim(e, V);
      A.el('circle', Object.assign({ cx: x, cy: y, r: 7, fill: c, stroke: C.stage, 'stroke-width': 2 }, a), A.svg);
      const t = e.q ? qtext('?', e.d, V) : e.t, pos = e.pos || 'l';
      if (t) lab(A, x + (pos === 'r' ? 14 : pos === 'l' ? -14 : 0), y + (pos === 'b' ? 24 : pos === 'a' ? -20 : 0), t, c, Object.assign({ 'font-size': 15, 'text-anchor': pos === 'r' ? 'start' : pos === 'l' ? 'end' : 'middle' }, a));
    });
  }

  /* ---------- a table of values with the change between columns ---------- */
  // p: { xh, yh, cols: [{x, y, q, d, s, ghost}], dx: [{i, t, s}], dy: [{i, t, s}] }  (i = the gap after column i)
  function table(A, p, V, H) {
    const n = p.cols.length, hw = 104, cw = Math.min(100, 470 / n), rh = 50, X = 320 - (hw + n * cw) / 2 + hw, yA = (H - 2 * rh) / 2 + 6, yB = yA + rh;
    lab(A, X - 12, yA + rh / 2, p.xh, C.blue, { 'text-anchor': 'end' }); lab(A, X - 12, yB + rh / 2, p.yh, C.yellow, { 'text-anchor': 'end' });
    p.cols.forEach((e, i) => {
      if (!on(e, V)) return;
      const x = X + i * cw, a = anim(e, V), da = e.ghost ? '6 5' : null;
      [[yA, String(e.x), C.blue], [yB, e.q ? qtext('?', e.d, V) : String(e.y), e.q ? qcol('?', V, C.yellow) : C.yellow]].forEach(([y, t, c]) => {
        A.el('rect', Object.assign({ x: x + 2, y: y + 2, width: cw - 4, height: rh - 4, rx: 5, fill: c, 'fill-opacity': .1, stroke: c, 'stroke-width': 2, 'stroke-dasharray': da }, a), A.svg);
        lab(A, x + cw / 2, y + rh / 2, t, c, Object.assign({ 'font-size': t.length > 6 ? 15 : 18 }, a));
      });
    });
    const gap = (list, y, up) => (list || []).forEach(d => {
      if (!on(d, V)) return;
      const x1 = X + d.i * cw + cw / 2, x2 = x1 + (d.span || 1) * cw, c = hot(d, V) ? C.red : C.gold, a = anim(d, V), k = up ? -1 : 1;
      A.el('path', Object.assign({ d: 'M' + (x1 + 6) + ' ' + y + 'Q' + (x1 + x2) / 2 + ' ' + (y + k * 30) + ' ' + (x2 - 6) + ' ' + y, fill: 'none', stroke: c, 'stroke-width': 2.5, 'marker-end': 'url(#a' + (c === C.red ? 'R' : 'G') + ')' }, a), A.svg);
      lab(A, (x1 + x2) / 2, y + k * 30, d.t, c, Object.assign({ 'font-size': 15 }, a));
    });
    gap(p.dx, yA - 4, true); gap(p.dy, yB + rh + 4, false);
    footer(A, p, V, H - 16);
  }

  /* ---------- a flow of operations, with the undo steps underneath ---------- */
  // p: { boxes: [{t, d, s, q}], ops: ['+ 4', '× 3'], inv: [{t, s}] (right to left) }
  function flow(A, p, V, H) {
    const n = p.boxes.length, bw = 96, gap = (560 - n * bw) / (n - 1), y = H / 2 - 50, xAt = i => 40 + i * (bw + gap);
    p.boxes.forEach((b, i) => {
      const x = xAt(i), q = b.q, c = q ? qcol('?', V, C.yellow) : i === n - 1 ? C.blue : C.edge;
      A.el('rect', { x, y, width: bw, height: 50, rx: 8, fill: c, 'fill-opacity': .14, stroke: c, 'stroke-width': 2.5 }, A.svg);
      const t = q ? qtext('?', b.d, V) : on(b, V) ? (done(V) && b.d != null ? b.d : b.t) : '';
      if (t) lab(A, x + bw / 2, y + 25, t, q ? c : C.text, Object.assign({ 'font-size': 18 }, b.s != null ? anim(b, V) : {}));
      if (i < n - 1) {
        const xa = x + bw, xb = xAt(i + 1);
        A.el('line', { x1: xa + 5, x2: xb - 7, y1: y + 14, y2: y + 14, stroke: C.gold, 'stroke-width': 2.5, 'marker-end': 'url(#aG)' }, A.svg);
        lab(A, (xa + xb) / 2, y - 6, p.ops[i], C.gold, { 'font-size': 17 });
        const u = p.inv[n - 2 - i];
        if (u && on(u, V)) {
          const c2 = hot(u, V) ? C.red : C.green, a = anim(u, V);
          A.el('line', Object.assign({ x1: xb - 5, x2: xa + 7, y1: y + 38, y2: y + 38, stroke: c2, 'stroke-width': 2.5, 'marker-end': 'url(#a' + (c2 === C.red ? 'R' : 'N') + ')' }, a), A.svg);
          lab(A, (xa + xb) / 2, y + 70, u.t, c2, Object.assign({ 'font-size': 17 }, a));
        }
      }
    });
    lab(A, 320, y + 108, done(V) && !p.noundo ? 'undo in reverse order' : '', C.muted, { 'font-size': 15 });
  }

  /* ---------- a polygon with labelled sides (units: x right, y down) ---------- */
  function shape(A, p, V, H) {
    const P = p.pts, xs = P.map(q => q[0]), ys = P.map(q => q[1]), X0 = Math.min(...xs), Y0 = Math.min(...ys);
    const k = Math.min(380 / (Math.max(...xs) - X0), (H - 110) / (Math.max(...ys) - Y0)), w = (Math.max(...xs) - X0) * k, h = (Math.max(...ys) - Y0) * k;
    const pt = q => [320 - w / 2 + (q[0] - X0) * k, 50 + (H - 100 - h) / 2 + (q[1] - Y0) * k], S = P.map(pt);
    const cx = S.reduce((a, q) => a + q[0], 0) / S.length, cy = S.reduce((a, q) => a + q[1], 0) / S.length, c = col(p.c || 'L');
    A.el('path', { d: 'M' + S.map(q => q.join(' ')).join('L') + 'z', fill: c, 'fill-opacity': .14, stroke: c, 'stroke-width': 3, 'stroke-linejoin': 'round' }, A.svg);
    S.forEach((a, i) => {
      const b = S[(i + 1) % S.length], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = mx - cx, dy = my - cy, L = Math.hypot(dx, dy) || 1, sd = p.sides[i];
      const hc = hot(sd, V);
      if (hc) A.el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: C.red, 'stroke-width': 6, 'stroke-dasharray': '8 6' }, A.svg);
      lab(A, mx + dx / L * 26, my + dy / L * 22, sd.t, hc ? C.red : col(sd.c || 'W'), { 'text-anchor': Math.abs(dx / L) > .5 ? (dx > 0 ? 'start' : 'end') : 'middle' });
    });
    if (p.q) lab(A, cx, cy, qtext('?', null, V), qcol('?', V, C.yellow), { 'font-size': 18 });
  }

  // A caption under a picture: footl, then foot ('?' becomes the answer when solved).
  function footer(A, p, V, y) { if (p.foot) lab(A, 320, y, (p.footl ? p.footl + ' ' : '') + qtext(p.foot, p.footd, V), qcol(p.foot, V, C.muted), { 'font-size': 18 }); }
  // A small note in the top-left corner (a rate, a conversion).
  function note(A, p) { if (p.note) lab(A, 18, 16, p.note, C.muted, { 'font-size': 15, 'text-anchor': 'start' }); }

  /* ---------- a circle with points, segments and angles (units: radius 1, y up) ---------- */
  // p: { P: {A: 200 (degrees round the circle) or [x, y]}, segs: [{a, b, t, c, s, ts (step that shows the label), q, d, dash, at: l|r|a|b}],
  //      angs: [{v, a, b, t, c, s, q, d, right}] (off: a segment label's distance from its line), hide: ['M'] (no letter), foot, footl }
  function circ(A, p, V, H) {
    const P = { O: [0, 0] };
    for (const n in p.P) { const v = p.P[n]; P[n] = typeof v === 'number' ? [Math.cos(v * Math.PI / 180), Math.sin(v * Math.PI / 180)] : v; }
    const xs = [-1, 1], ys = [-1, 1]; for (const n in P) { xs.push(P[n][0]); ys.push(P[n][1]); }
    const X0 = Math.min(...xs), X1 = Math.max(...xs), Y0 = Math.min(...ys), Y1 = Math.max(...ys), fh = p.foot ? 30 : 0;
    const k = Math.min(500 / (X1 - X0), (H - 64 - fh) / (Y1 - Y0)), ox = 320 - (X0 + X1) / 2 * k, oy = (H - fh) / 2 + 2 + (Y0 + Y1) / 2 * k;
    const S = n => [ox + P[n][0] * k, oy - P[n][1] * k], [cx, cy] = S('O');
    A.el('circle', { cx, cy, r: k, fill: C.blue, 'fill-opacity': .06, stroke: C.blue, 'stroke-width': 3 }, A.svg);
    (p.angs || []).forEach(g => {
      if (!on(g, V)) return;
      const [vx, vy] = S(g.v), [ax, ay] = S(g.a), [bx, by] = S(g.b), ta = Math.atan2(ay - vy, ax - vx);
      let d = Math.atan2(by - vy, bx - vx) - ta; while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI;
      const hc = hot(g, V), c = hc ? C.red : g.q ? qcol('?', V, C.yellow) : col(g.c || 'G'), a = anim(g, V), u = t => [Math.cos(t), Math.sin(t)];
      const r = g.right ? 15 : g.r || 30, u1 = u(ta), u2 = u(ta + d), p1 = [vx + r * u1[0], vy + r * u1[1]], p2 = [vx + r * u2[0], vy + r * u2[1]];
      if (g.right) A.el('path', Object.assign({ d: 'M' + p1.join(' ') + 'L' + (p1[0] + r * u2[0]) + ' ' + (p1[1] + r * u2[1]) + 'L' + p2.join(' '), fill: 'none', stroke: c, 'stroke-width': 2.5 }, a), A.svg);
      else A.el('path', Object.assign({ d: 'M' + vx + ' ' + vy + 'L' + p1.join(' ') + 'A' + r + ' ' + r + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + p2.join(' ') + 'z', fill: c, 'fill-opacity': .22, stroke: c, 'stroke-width': 2 }, a), A.svg);
      const t = g.q ? qtext('?', g.d, V) : g.t, ub = u(ta + d / 2), rl = r + (g.right ? 16 : 22);
      if (t) lab(A, vx + rl * ub[0], vy + rl * ub[1], t, c, Object.assign({ 'font-size': 16 }, a));
    });
    (p.segs || []).forEach(g => {
      if (!on(g, V)) return;
      const [x1, y1] = S(g.a), [x2, y2] = S(g.b), hc = hot(g, V) || hot({ s: g.ts }, V), c = hc ? C.red : col(g.c || 'W'), a = anim(g, V);
      A.el('line', Object.assign({ x1, y1, x2, y2, stroke: c, 'stroke-width': 3, 'stroke-dasharray': g.dash || hc ? '8 6' : null, 'stroke-linecap': 'round' }, a), A.svg);
      const t = g.q ? qtext('?', g.d, V) : g.t; if (!t || !on({ s: g.ts }, V)) return;
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, L = Math.hypot(x2 - x1, y2 - y1) || 1, D = { l: [-1, 0], r: [1, 0], a: [0, -1], b: [0, 1] }[g.at];
      let nx = -(y2 - y1) / L, ny = (x2 - x1) / L; const dot = nx * (mx - cx) + ny * (my - cy);
      if (D) { nx = D[0]; ny = D[1]; } else if (dot < -1e-6 || (Math.abs(dot) <= 1e-6 && ny > 0)) { nx = -nx; ny = -ny; }
      const off = g.off || 15;
      lab(A, mx + nx * off, my + ny * off, t, g.q ? qcol('?', V, c) : c, Object.assign({ 'font-size': 16, 'text-anchor': nx > .45 ? 'start' : nx < -.45 ? 'end' : 'middle' }, g.ts != null ? anim({ s: g.ts }, V) : a));
    });
    // O's letter goes on the side away from the other points (out of the angle wedges); the rest go outward from O.
    let ux = 0, uy = 0; for (const n in P) if (n !== 'O') { const [x, y] = S(n), L = Math.hypot(x - cx, y - cy) || 1; ux += (x - cx) / L; uy += (y - cy) / L; }
    const uL = Math.hypot(ux, uy), oDir = uL > .3 ? [-ux / uL, -uy / uL] : [-.6, .8];
    for (const n in P) {
      const [x, y] = S(n); A.el('circle', { cx: x, cy: y, r: 4.5, fill: n === 'O' ? C.text : C.blue, stroke: C.stage, 'stroke-width': 1.5 }, A.svg);
      if ((p.hide || []).includes(n)) continue;
      const L = Math.hypot(x - cx, y - cy), dx = n === 'O' ? oDir[0] : (x - cx) / L, dy = n === 'O' ? oDir[1] : (y - cy) / L;
      lab(A, x + dx * 18, y + dy * 18, n, C.muted, { 'font-size': 15, 'font-style': 'italic' });
    }
    footer(A, p, V, H - 12);
  }

  /* ---------- solids, stacked bottom-up and centred: cyl, cone, sphere, hemi (a dome), box (square prism), pyr ---------- */
  // p: { parts: [{k, r, h, w, c, s, wrap, lab: {r, d, h, l, w}}], note, foot, footl }
  function solid(A, p, V, H) {
    const ps = p.parts, E = .28, sq = q => q.k === 'box' || q.k === 'pyr';
    const wOf = q => sq(q) ? q.w * 1.45 : 2 * q.r, hOf = q => q.k === 'sphere' ? 2 * q.r : q.k === 'hemi' ? q.r : q.h;
    const W = Math.max(...ps.map(wOf)), top = W * (sq(ps[0]) ? .32 : .16), Ht = ps.reduce((a, q) => a + hOf(q), 0) + top + W * .14, fh = p.foot ? 30 : 0;
    const k = Math.min(270 / W, (H - 70 - fh) / Ht), cx = 300;
    let yb = (H - fh) / 2 + Ht * k / 2 - W * .14 * k + 10;
    const T = (x, y, s, a) => lab(A, x, y, s, C.text, Object.assign({ 'font-size': 16 }, a || {}));
    const dim = (x, y1, y2, s, left) => { A.el('path', { d: 'M' + (x - 5) + ' ' + y1 + 'h10M' + x + ' ' + y1 + 'V' + y2 + 'M' + (x - 5) + ' ' + y2 + 'h10', stroke: C.muted, 'stroke-width': 1.8, fill: 'none' }, A.svg); T(x + (left ? -10 : 10), (y1 + y2) / 2, s, { 'text-anchor': left ? 'end' : 'start' }); };
    ps.forEach((q, i) => {
      const c = hot(q, V) ? C.red : col(q.c || 'L'), L = q.lab || {}, nx = ps[i + 1], st = { stroke: c, 'stroke-width': 2.5, fill: 'none' };
      const path = (d, a) => A.el('path', Object.assign({ d }, st, a || {}), A.svg);
      if (q.k === 'cyl' || q.k === 'cone' || q.k === 'hemi' || q.k === 'sphere') {
        const rx = q.r * k, ry = rx * E, Lx = cx - rx, Rx = cx + rx, base = 'M' + Lx + ' ' + yb, front = 'A' + rx + ' ' + ry + ' 0 0 0 ' + Rx + ' ' + yb, back = 'A' + rx + ' ' + ry + ' 0 0 1 ' + Rx + ' ' + yb;
        if (q.k === 'cyl') {
          const yt = yb - q.h * k;
          path('M' + Lx + ' ' + yt + 'V' + yb + front + 'V' + yt + 'A' + rx + ' ' + ry + ' 0 0 1 ' + Lx + ' ' + yt + 'z', { fill: c, 'fill-opacity': q.wrap ? .34 : .12, stroke: 'none' });
          if (!i) path(base + back, { 'stroke-dasharray': '6 6', 'stroke-width': 1.8 });
          path(base + front); path('M' + Lx + ' ' + yb + 'V' + yt + 'M' + Rx + ' ' + yb + 'V' + yt);
          A.el('ellipse', Object.assign({ cx, cy: yt, rx, ry, fill: c, 'fill-opacity': q.wrap ? .05 : .2 }, st), A.svg);
          if (L.h) dim(Rx + 20, yb, yt, L.h);
          yb = yt;
        } else if (q.k === 'cone') {
          const ya = yb - q.h * k;
          path(base + front + 'L' + cx + ' ' + ya + 'z', { fill: c, 'fill-opacity': .12, stroke: 'none' });
          path(base + back, { 'stroke-dasharray': '6 6', 'stroke-width': 1.8 }); path(base + front); path('M' + Lx + ' ' + yb + 'L' + cx + ' ' + ya + 'L' + Rx + ' ' + yb);
          if (L.h) { path('M' + cx + ' ' + yb + 'V' + ya, { stroke: C.muted, 'stroke-dasharray': '5 5', 'stroke-width': 1.8 }); dim(Lx - 20, yb, ya, L.h, true); }
          if (L.l) T((Rx + cx) / 2 + 14, (yb + ya) / 2, L.l, { 'text-anchor': 'start' });
          yb = ya;
        } else if (q.k === 'hemi') {
          path(base + 'A' + rx + ' ' + rx + ' 0 0 1 ' + Rx + ' ' + yb, { fill: c, 'fill-opacity': .12 });
          yb -= rx;
        } else {
          const yc = yb - rx;
          A.el('circle', Object.assign({ cx, cy: yc, r: rx, fill: c, 'fill-opacity': .12 }, st), A.svg);
          path('M' + Lx + ' ' + yc + 'A' + rx + ' ' + ry + ' 0 0 1 ' + Rx + ' ' + yc, { 'stroke-dasharray': '6 6', 'stroke-width': 1.6 });
          path('M' + Lx + ' ' + yc + 'A' + rx + ' ' + ry + ' 0 0 0 ' + Rx + ' ' + yc, { 'stroke-width': 1.6 });
          if (L.r) { path('M' + cx + ' ' + yc + 'H' + Rx, { stroke: C.yellow }); T(cx + rx / 2, yc - 14, L.r); }
          if (L.d) { path('M' + Lx + ' ' + yc + 'H' + Rx, { stroke: C.yellow }); T(cx, yc - 14, L.d); }
          yb -= 2 * rx;
        }
        if (q.k === 'cyl' || q.k === 'cone') {                 // radius or diameter on the bottom face
          const y0 = q.k === 'cyl' ? yb + q.h * k : yb + q.h * k;
          if (L.r) { path('M' + cx + ' ' + y0 + 'H' + Rx, { stroke: C.yellow }); T(cx + rx / 2, y0 + ry + 16, L.r); }
          if (L.d) { path('M' + Lx + ' ' + y0 + 'H' + Rx, { stroke: C.yellow }); T(cx, y0 + ry + 16, L.d); }
        }
      } else {
        const wk = q.w * k, dx = wk * .45, dy = wk * .3, x0 = cx - (wk + dx) / 2;
        if (q.k === 'box') {
          const yt = yb - q.h * k;
          A.el('rect', Object.assign({ x: x0, y: yt, width: wk, height: q.h * k, fill: c, 'fill-opacity': .12 }, st), A.svg);
          path('M' + (x0 + wk) + ' ' + yb + 'l' + dx + ' ' + -dy + 'V' + (yt - dy) + 'L' + (x0 + wk) + ' ' + yt, { fill: c, 'fill-opacity': .07 });
          path('M' + x0 + ' ' + yb + 'l' + dx + ' ' + -dy + 'h' + wk + 'M' + (x0 + dx) + ' ' + (yb - dy) + 'V' + (yt - dy), { 'stroke-dasharray': '6 6', 'stroke-width': 1.8 });
          if (!nx) path('M' + x0 + ' ' + yt + 'l' + dx + ' ' + -dy + 'h' + wk, { fill: 'none' });
          if (L.w) T(x0 + wk / 2, yb + 20, L.w);
          if (L.h) T(x0 - 10, (yb + yt) / 2, L.h, { 'text-anchor': 'end' });
          yb = yt;
        } else {
          const ax = x0 + wk / 2 + dx / 2, ay = yb - dy / 2 - q.h * k, bx = ax, by = yb - dy / 2, fx = x0 + wk / 2;
          path('M' + x0 + ' ' + yb + 'h' + wk + 'L' + ax + ' ' + ay + 'z', { fill: c, 'fill-opacity': .14 });
          path('M' + (x0 + wk) + ' ' + yb + 'l' + dx + ' ' + -dy + 'L' + ax + ' ' + ay + 'z', { fill: c, 'fill-opacity': .07 });
          path('M' + x0 + ' ' + yb + 'l' + dx + ' ' + -dy + 'h' + wk + 'M' + (x0 + dx) + ' ' + (yb - dy) + 'L' + ax + ' ' + ay, { 'stroke-dasharray': '6 6', 'stroke-width': 1.8 });
          if (L.h) { path('M' + bx + ' ' + by + 'V' + ay, { stroke: C.muted, 'stroke-dasharray': '5 5', 'stroke-width': 1.8 }); dim(x0 + wk + dx + 20, by, ay, L.h); }
          if (L.l) { path('M' + ax + ' ' + ay + 'L' + fx + ' ' + yb, { stroke: C.yellow, 'stroke-dasharray': '5 5', 'stroke-width': 2 }); T((ax + fx) / 2 - 10, (ay + yb) / 2 + 8, L.l, { 'text-anchor': 'end' }); }
          if (L.w) T(x0 + wk / 2, yb + 20, L.w);
          yb = ay;
        }
      }
    });
    note(A, p); footer(A, p, V, H - 12);
  }

  /* ---------- two similar triangles: the small one and the large one (× f); matching sides share a colour ---------- */
  // p: { pts: [[x, y] x3] (y up), f, cs: ['G', 'Y', 'T'] (side i joins point i and i+1), la: [{t, s}], lb: [{t, s, q}], na, nb (names) }
  function pair(A, p, V, H) {
    const T = p.pts, mx = Math.min(...T.map(q => q[0])), my = Math.min(...T.map(q => q[1])), w = Math.max(...T.map(q => q[0])) - mx, h = Math.max(...T.map(q => q[1])) - my;
    const f = p.f, gap = .5 * w, k = Math.min(500 / (w * (1 + f) + gap), (H - 96) / (h * f)), yb = (H + h * f * k) / 2 + 4, x0 = 320 - (w * (1 + f) + gap) * k / 2;
    [[1, p.la, x0, p.na], [f, p.lb, x0 + (w + gap) * k, p.nb]].forEach(([s, L, xo, nm]) => {
      const S = T.map(q => [xo + (q[0] - mx) * s * k, yb - (q[1] - my) * s * k]), gx = S.reduce((a, q) => a + q[0], 0) / 3, gy = S.reduce((a, q) => a + q[1], 0) / 3;
      A.el('path', { d: 'M' + S.map(q => q.join(' ')).join('L') + 'z', fill: C.blue, 'fill-opacity': .08, stroke: 'none' }, A.svg);
      S.forEach((a, i) => {
        const b = S[(i + 1) % 3], sd = (L || [])[i] || {}, hc = hot(sd, V), c = hc ? C.red : col(p.cs[i]), ex = (a[0] + b[0]) / 2, ey = (a[1] + b[1]) / 2, dx = ex - gx, dy = ey - gy, D = Math.hypot(dx, dy) || 1;
        A.el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: c, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-dasharray': hc ? '8 6' : null }, A.svg);
        const t = sd.q ? qtext('?', sd.d, V) : sd.t;
        if (t && on({ s: sd.ts }, V)) lab(A, ex + dx / D * 20, ey + dy / D * 18, t, sd.q ? qcol('?', V, c) : c, Object.assign({ 'text-anchor': Math.abs(dx / D) > .5 ? (dx > 0 ? 'start' : 'end') : 'middle' }, anim({ s: sd.ts }, V)));
      });
      if (nm) lab(A, gx, gy + 2, nm, C.muted, { 'font-size': 14 });
    });
  }

  /* ---------- an outdoor scene for indirect measurement: shadows, or a mirror on the ground ---------- */
  // shadow: { mode: 'shadow', h, s, H, S, lh, ls, lH, lS }  (a person and a pole, with sun rays)
  // mirror: { mode: 'mirror', h, d1, d2, H, lh, l1, l2, lH, barn, lb } (eye height, mirror, the tall object, a barn beside it)
  function scene(A, p, V, H) {
    const yG = H - 46 - (p.foot ? 24 : 0), Tx = (x, y, s, c, an, a) => lab(A, x, y, qtext(s, null, V), s === '?' ? qcol('?', V, c) : c, Object.assign({ 'font-size': 16, 'text-anchor': an || 'middle' }, a || {}));
    const ground = (x1, x2) => A.el('line', { x1, x2, y1: yG, y2: yG, stroke: C.green, 'stroke-width': 3 }, A.svg);
    const person = (x, hp) => { A.el('line', { x1: x, x2: x, y1: yG, y2: yG - hp + 12, stroke: C.gold, 'stroke-width': 8, 'stroke-linecap': 'round' }, A.svg); A.el('circle', { cx: x, cy: yG - hp + 6, r: 7, fill: C.gold }, A.svg); };
    if (p.mode === 'shadow') {
      const gap = Math.max(p.s, p.S) * .35, tot = p.s + gap + p.S, k = Math.min((H - 96) / p.H, 520 / tot), x0 = 320 - tot * k / 2 + 10, x1 = x0 + (p.s + gap) * k;
      ground(x0 - 40, x1 + p.S * k + 30);
      [[x0, p.h, p.s, p.lh, p.ls], [x1, p.H, p.S, p.lH, p.lS]].forEach(([x, hh, ss, lh, ls], i) => {
        A.el('line', { x1: x, x2: x + ss * k, y1: yG + 1, y2: yG + 1, stroke: C.muted, 'stroke-width': 8, 'stroke-opacity': .6 }, A.svg);
        if (i) { A.el('line', { x1: x, x2: x, y1: yG, y2: yG - hh * k, stroke: C.text, 'stroke-width': 5 }, A.svg); A.el('path', { d: 'M' + x + ' ' + (yG - hh * k) + 'h26v14h-26z', fill: C.red }, A.svg); }
        else person(x, hh * k);
        A.el('line', { x1: x, y1: yG - hh * k, x2: x + ss * k, y2: yG, stroke: C.yellow, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, A.svg);
        Tx(x - 14, yG - hh * k / 2, lh, i ? C.blue : C.gold, 'end');
        Tx(x + ss * k / 2, yG + 22, ls, C.muted);
      });
    } else {
      const tot = p.d1 + p.d2, k = Math.min((H - 110) / Math.max(p.H, p.barn || 0), 400 / tot), x0 = 320 - tot * k / 2 - 25, xm = x0 + p.d1 * k, xe = xm + p.d2 * k, ew = 34;
      ground(x0 - 30, xe + ew + 110);
      person(x0, p.h * k);
      A.el('rect', { x: xe, y: yG - p.H * k, width: ew, height: p.H * k, fill: C.blue, 'fill-opacity': .2, stroke: C.blue, 'stroke-width': 2.5 }, A.svg);
      if (p.barn) { const bh = p.barn * k; A.el('path', { d: 'M' + (xe + ew + 20) + ' ' + yG + 'v' + -bh * .7 + 'l' + 30 + ' ' + -bh * .3 + 'l30 ' + bh * .3 + 'v' + bh * .7 + 'z', fill: C.red, 'fill-opacity': .2, stroke: C.red, 'stroke-width': 2.5 }, A.svg); Tx(xe + ew + 50, yG - bh - 14, p.lb, C.red); }
      A.el('path', { d: 'M' + x0 + ' ' + (yG - p.h * k + 6) + 'L' + xm + ' ' + yG + 'L' + xe + ' ' + (yG - p.H * k), fill: 'none', stroke: C.yellow, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, A.svg);
      A.el('rect', { x: xm - 12, y: yG - 3, width: 24, height: 6, fill: C.teal }, A.svg);
      Tx(x0 - 14, yG - p.h * k / 2, p.lh, C.gold, 'end');
      Tx((x0 + xm) / 2, yG + 22, p.l1, C.muted); Tx((xm + xe) / 2, yG + 22, p.l2, C.muted);
      if (p.lH && on({ s: p.sH }, V)) Tx(xe - 10, yG - p.H * k / 2, p.lH, C.blue, 'end', anim({ s: p.sH }, V));
    }
    footer(A, p, V, H - 16);
  }

  /* ---------- a bag (or pile) of counters; out = one taken out and kept ---------- */
  // p: { items: [{c, n, t, l}], out: {c, s, t}, box (a pile of cards, not a bag), foot, footl }
  function bag(A, p, V, H) {
    const all = []; p.items.forEach(g => { for (let i = 0; i < g.n; i++) all.push(g); });
    const n = all.length, cols = Math.min(7, Math.ceil(Math.sqrt(n * 1.6))), rows = Math.ceil(n / cols), d = 34;
    const w = cols * d + 40, h = rows * d + 36, cx = p.out ? 250 : 320, x0 = cx - w / 2, y0 = Math.max(28, (H - h - 80) / 2 + 10);
    if (p.box) A.el('rect', { x: x0, y: y0, width: w, height: h, rx: 10, fill: C.edge, 'fill-opacity': .18, stroke: C.muted, 'stroke-width': 2 }, A.svg);
    else A.el('path', { d: 'M' + (x0 + 14) + ' ' + y0 + 'Q' + (x0 - 12) + ' ' + (y0 + h * .7) + ' ' + (x0 + 26) + ' ' + (y0 + h) + 'H' + (x0 + w - 26) + 'Q' + (x0 + w + 12) + ' ' + (y0 + h * .7) + ' ' + (x0 + w - 14) + ' ' + y0 + 'Z', fill: C.edge, 'fill-opacity': .18, stroke: C.muted, 'stroke-width': 2.5 }, A.svg);
    const out = p.out && on(p.out, V) ? p.out : null; let gone = null;
    all.forEach((g, i) => {
      const x = x0 + 20 + d / 2 + (i % cols) * d, y = y0 + 18 + d / 2 + Math.floor(i / cols) * d, miss = out && !gone && g.c === out.c;
      if (miss) gone = [x, y];
      A.el('circle', { cx: x, cy: y, r: 13, fill: col(g.c), 'fill-opacity': miss ? 0 : .8, stroke: col(g.c), 'stroke-width': 2, 'stroke-dasharray': miss ? '4 4' : null }, A.svg);
      if (g.l && !miss) lab(A, x, y + 1, g.l, C.stage, { 'font-size': 14, 'font-weight': 700, style: 'stroke:none' });
    });
    // the counts under the bag, each in its own colour (after the draw: one fewer)
    p.items.forEach((g, i) => {
      const k = out && g.c === out.c ? g.n - 1 : g.n, x = cx + (i - (p.items.length - 1) / 2) * 118;
      lab(A, x, y0 + h + 26, k + ' ' + g.t, out && g.c === out.c ? C.green : col(g.c), Object.assign({ 'font-size': 16 }, out ? anim(out, V) : {}));
    });
    if (out) {
      const c = hot(out, V) ? C.red : col(out.c), a = anim(out, V), xo = 500, yo = y0 + h / 2;
      A.el('path', Object.assign({ d: 'M' + (gone[0] + 16) + ' ' + gone[1] + 'Q' + (xo - 60) + ' ' + (y0 - 20) + ' ' + (xo - 20) + ' ' + yo, fill: 'none', stroke: hot(out, V) ? C.red : C.gold, 'stroke-width': 2.5, 'stroke-dasharray': '6 5', 'marker-end': 'url(#a' + (hot(out, V) ? 'R' : 'G') + ')' }, a), A.svg);
      A.el('circle', Object.assign({ cx: xo, cy: yo, r: 15, fill: c, 'fill-opacity': .85, stroke: c, 'stroke-width': 2 }, a), A.svg);
      lab(A, xo, yo + 34, out.t, c, Object.assign({ 'font-size': 15 }, a));
    }
    footer(A, p, V, H - 16);
  }

  /* ---------- a spinner with n equal sections, the first `hit` of them coloured ---------- */
  // p: { n, hit, c, lab (text in each coloured section), t (name of the coloured part), foot, footl }
  function spin(A, p, V, H) {
    const r = Math.min(112, (H - 70) / 2), cx = 220, cy = 18 + r + Math.max(0, (H - 60 - 2 * r) / 2), c = col(p.c);
    for (let i = 0; i < p.n; i++) {
      const a0 = (i / p.n - .25) * 2 * Math.PI, a1 = ((i + 1) / p.n - .25) * 2 * Math.PI, on1 = i < p.hit;
      A.el('path', { d: 'M' + cx + ' ' + cy + 'L' + (cx + r * Math.cos(a0)) + ' ' + (cy + r * Math.sin(a0)) + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)) + ' ' + (cy + r * Math.sin(a1)) + 'Z', fill: on1 ? c : C.edge, 'fill-opacity': on1 ? .6 : .3, stroke: C.stage, 'stroke-width': 2.5 }, A.svg);
      if (on1 && p.lab) { const am = (a0 + a1) / 2; lab(A, cx + r * .64 * Math.cos(am), cy + r * .64 * Math.sin(am), p.lab, C.text, { 'font-size': 12 }); }
    }
    A.el('circle', { cx, cy, r, fill: 'none', stroke: C.muted, 'stroke-width': 2 }, A.svg);
    A.el('line', { x1: cx, y1: cy, x2: cx + r * .55, y2: cy - r * .45, stroke: C.text, 'stroke-width': 4, 'stroke-linecap': 'round', 'marker-end': 'url(#aA)' }, A.svg);
    A.el('circle', { cx, cy, r: 6, fill: C.text }, A.svg);
    lab(A, 380, cy - 16, p.hit + ' ' + p.t, c, { 'font-size': 18, 'text-anchor': 'start' });
    lab(A, 380, cy + 14, p.n - p.hit + ' not ' + p.t, C.muted, { 'font-size': 18, 'text-anchor': 'start' });
    lab(A, 380, cy + 44, p.n + ' equal sections', C.muted, { 'font-size': 15, 'text-anchor': 'start' });
    footer(A, p, V, H - 16);
  }

  /* ---------- an outcome grid (a sample space), or an area model when rows and columns carry weights ---------- */
  // p: { rl, cl (row and column titles), rows: [{t, w}], cols: [{t, w}], hit: 'all' | [[i, j]], s (the step that shades them),
  //      dots (a dot per outcome), ct: {'i,j': {t, s}} (a cell label tied to a step), foot, footl }
  function grid(A, p, V, H) {
    const X0 = 190, X1 = 600, Y0 = 62, Y1 = H - 42, sw = a => a.reduce((s, e) => s + (e.w || 1), 0);
    const cut = (list, a, b) => { let acc = 0; const T = sw(list); return list.map(e => { const s = a + acc / T * (b - a); acc += e.w || 1; return [s, a + acc / T * (b - a)]; }); };
    const RX = cut(p.cols, X0, X1), RY = cut(p.rows, Y0, Y1), hit = (i, j) => p.hit === 'all' || p.hit.some(h => h[0] === i && h[1] === j);
    const shade = { s: p.s }, sOn = on(shade, V), hc = hot(shade, V);
    lab(A, (X0 + X1) / 2, Y0 - 40, p.cl, C.blue, { 'font-size': 15 });
    lab(A, X0 - 12, Y0 - 40, p.rl + ' ↓', C.yellow, { 'font-size': 15, 'text-anchor': 'end' });
    p.cols.forEach((e, j) => lab(A, (RX[j][0] + RX[j][1]) / 2, Y0 - 14, e.t, C.blue, { 'font-size': p.cols.length > 4 ? 14 : 15 }));
    p.rows.forEach((e, i) => lab(A, X0 - 12, (RY[i][0] + RY[i][1]) / 2, e.t, C.yellow, { 'font-size': 15, 'text-anchor': 'end' }));
    p.rows.forEach((_, i) => p.cols.forEach((__, j) => {
      const [xa, xb] = RX[j], [ya, yb] = RY[i], h = hit(i, j) && sOn, c = hc ? C.red : C.green;
      A.el('rect', Object.assign({ x: xa, y: ya, width: xb - xa, height: yb - ya, fill: h ? c : 'none', 'fill-opacity': .32, stroke: C.edge, 'stroke-width': 2 }, h ? anim(shade, V) : {}), A.svg);
      if (p.dots && h) A.el('circle', Object.assign({ cx: (xa + xb) / 2, cy: (ya + yb) / 2, r: 6, fill: c }, anim(shade, V)), A.svg);
      const ct = p.ct && p.ct[i + ',' + j];
      if (ct && on(ct, V)) lab(A, (xa + xb) / 2, (ya + yb) / 2, ct.t, hot(ct, V) ? C.red : C.text, Object.assign({ 'font-size': 15 }, anim(ct, V)));
    }));
    footer(A, p, V, H - 14);
  }

  const PIC = { nl, rects, tri, chain, cube, bar, graph, table, flow, shape, circ, solid, pair, scene, bag, spin, grid };

  /* ---------- the step chain ---------- */
  function steps(A, it, V, top) {
    const n = it.steps.length, rh = n > 3 ? 28 : 32, bad = V.phase === 'wrong' && V.res ? V.res.s : -2;
    it.steps.forEach((st, i) => {
      const y = top + i * rh + rh / 2, flag = i === bad, c = flag ? C.red : LVC[it.lvl], a = done(V) && V.anim ? { class: 'fade', style: 'animation-delay:' + (i * DLY) + 's' } : {};
      A.el('circle', { cx: 26, cy: y, r: 12, fill: c, 'fill-opacity': V.phase === 'ask' ? .25 : .9, stroke: c, 'stroke-width': 1.5 }, A.svg);
      lab(A, 26, y + 1, String(i + 1), V.phase === 'ask' ? c : C.stage, { 'font-size': 14, 'font-weight': 700, style: 'stroke:none' });
      if (V.phase === 'ask') { A.el('line', { x1: 48, x2: 610, y1: y, y2: y, stroke: C.edge, 'stroke-width': 2, 'stroke-dasharray': '4 8' }, A.svg); return; }
      lab(A, 46, y, st.l, flag ? C.red : C.muted, Object.assign({ 'font-size': 14, 'text-anchor': 'start', class: flag ? 'pulse' : '' }, done(V) ? a : {}));
      if (!done(V)) { if (flag) lab(A, 200, y, '← check this step', C.red, { 'font-size': 15, 'text-anchor': 'start' }); return; }
      const fs = Math.min(17, 430 / Math.max(1, st.m.length * .54));
      lab(A, 200, y, st.m, i === n - 1 ? C.green : C.text, Object.assign({ 'font-size': fs, 'text-anchor': 'start' }, a));
    });
  }

  function draw(A, it, V) {
    ITEM = it;
    const n = it.steps.length, rh = n > 3 ? 28 : 32, top = 420 - n * rh - 8;
    A.el('line', { x1: 14, x2: 626, y1: top - 8, y2: top - 8, stroke: C.edge, 'stroke-width': 1.5 }, A.svg);
    PIC[it.pic.k](A, it.pic, V, top - 12);
    steps(A, it, V, top);
  }

  /* ---------- a tab: one topic, a round ramping from one step to three ---------- */
  const unit = s => ({ h: '<span class="u">' + s + '</span>' });
  // A polynomial answer: one coefficient box per power of x, up to the item's degree (deg).
  const polySlots = it => (it.deg === 2 ? [{ k: 'c2', label: 'x squared coefficient', narrow: true }, 'x² +'] : [])
    .concat([{ k: 'c1', label: 'x coefficient', narrow: true }, 'x +', { k: 'c0', label: 'constant', narrow: true }], it.unit ? [unit(it.unit)] : []);
  function tab(o) {
    return {
      id: o.id, code: o.code, name: o.name, sec: o.sec || 1, notes: o.notes, sep: o.sep,
      q: it => it.q, kind: 'slots', gen: o.gen, typeOf: it => it.t,
      prompt: it => '<div class="lvl l' + it.lvl + '">Level ' + it.lvl + ' · ' + LVN[it.lvl] + '</div><div class="story">' + it.story + '</div>',
      slots: it => it.poly ? polySlots(it) : [it.pre ? unit(it.pre) : null, { k: 'v', label: 'answer', wide: true }, it.unit ? unit(it.unit) : null].filter(Boolean),
      check: (it, r) => MODEL.check(it, r), answer: it => it.poly ? MODEL.resp(it, it.poly) : { v: it.ans }, link: o.link, draw
    };
  }
  return { tab, draw, PIC, LVN };
})();
