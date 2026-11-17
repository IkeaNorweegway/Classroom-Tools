
/* ===== WORD PROBLEMS KIT (Math 9 and Science 7 word-problem trainers) =====
   The picture has two parts: a schematic of the story at the top, and the step chain at the bottom
   (one numbered row per step, so Level 1 shows one row, Level 3 three or more).
     ask    the givens, and an empty row for each step
     wrong  every step's label (the plan), with the step the named mistake points to in red
     right / show   each step's working fades in, in order; the parts of the picture tied to a step (s) appear with it
   A picture part may carry s (the step it belongs to: hidden until solved) and q (the unknown: '?' until solved). */
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
  function qtext(s, d, V) { if (done(V) && d != null) return d; if (s !== '?') return s; return done(V) ? (ITEM.pre || '') + ITEM.ans + (ITEM.unit ? ' ' + ITEM.unit : '') : '?'; }
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
  }

  const PIC = { nl, rects, tri, chain, cube, bar };

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
  function tab(o) {
    return {
      id: o.id, code: o.code, name: o.name, sec: o.sec || 1, notes: o.notes, sep: o.sep,
      q: it => it.q, kind: 'slots', gen: o.gen, typeOf: it => it.t,
      prompt: it => '<div class="lvl l' + it.lvl + '">Level ' + it.lvl + ' · ' + LVN[it.lvl] + '</div><div class="story">' + it.story + '</div>',
      slots: it => [it.pre ? unit(it.pre) : null, { k: 'v', label: 'answer', wide: true }, it.unit ? unit(it.unit) : null].filter(Boolean),
      check: (it, r) => MODEL.check(it, r), answer: it => ({ v: it.ans }), link: o.link, draw
    };
  }
  return { tab, draw, PIC, LVN };
})();
