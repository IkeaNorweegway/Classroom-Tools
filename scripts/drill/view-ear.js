/* ===================== PAGE: pictures and tabs ===================== */
const { C } = DRILL;
const done = S.done;
const el = (tag, a, p) => DRILL.el(tag, a, p);
const rng = seed => { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const HLA = col => ({ stroke: col, 'stroke-width': 6, filter: 'url(#glow)' });

/* 7-5-01 Earth's layers (radii not to scale: the crust is drawn thicker) */
const LAYER_R = { crust: 1, mantle: .94, outer: .55, inner: .2 }, LAYER_FILL = { crust: '#7a5a33', mantle: '#8a3b2a', outer: '#c9702a', inner: '#f2c14e' };
const T_LAYER = {
  id: 'layers', code: '7-5-01', name: 'Layers', sec: 1, q: it => it.form === 'pic' ? 'The yellow layer is the…' : 'Which layer?', kind: 'choice', cols: 2,
  gen: MODEL.genLayer, typeOf: it => it.form + ':' + it.a,
  choices: () => MODEL.LAYERS.map(k => ({ v: k, label: MODEL.LAYER_NAME[k] })),
  check: MODEL.checkLayer, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), cx = 200, cy = 212, R = 182;
    MODEL.LAYERS.forEach(k => el('circle', { cx, cy, r: R * LAYER_R[k], fill: LAYER_FILL[k], stroke: C.stage, 'stroke-width': 2 }, A.svg));
    if (it.form === 'pic' || fin) {
      const r1 = R * LAYER_R[it.a], idx = MODEL.LAYERS.indexOf(it.a), r0 = idx < 3 ? R * LAYER_R[MODEL.LAYERS[idx + 1]] : 0;
      el('circle', Object.assign({ cx, cy, r: r1, fill: 'none' }, HLA(fin ? C.green : C.yellow)), A.svg);
      if (r0) el('circle', Object.assign({ cx, cy, r: r0, fill: 'none' }, HLA(fin ? C.green : C.yellow), { 'stroke-width': 3 }), A.svg);
    }
    if (it.form === 'fact') S.card(A.svg, { x: 500, y: 140, w: 230, h: 150, label: it.t, fs: 20, n: 18, lb: 40, col: fin ? C.green : C.yellow, sw: 3 });
    if (!fin) return;
    const r1 = R * LAYER_R[it.a], idx = MODEL.LAYERS.indexOf(it.a), r0 = idx < 3 ? R * LAYER_R[MODEL.LAYERS[idx + 1]] : 0, px = cx + (r0 + r1) / 2 * .7, py = cy + (r0 + r1) / 2 * .7;
    S.arrow(A.svg, 420, 330, px + 6, py + 6, C.green, 'N', { 'stroke-width': 3, class: 'fade' });
    A.tx(A.svg, 425, 345, MODEL.LAYER_NAME[it.a], { 'font-size': 22, fill: C.green, 'text-anchor': 'start', class: 'pop' });
    A.tx(A.svg, 425, 375, MODEL.LAYER_FACT[it.a][0], { 'font-size': 15, fill: C.muted, 'text-anchor': 'start', class: 'fade' });
  }
};

/* 7-5-02 rock type */
const T_ROCK = S.classTab({
  id: 'rock', code: '7-5-02', name: 'Rock type', sec: 2, q: 'Which kind of rock?', bank: MODEL.ROCK, cues: MODEL.ROCK_CUE,
  cats: [{ v: 'ign', label: 'Igneous', means: 'melted rock that cooled' }, { v: 'sed', label: 'Sedimentary', means: 'sediment pressed and cemented' },
    { v: 'met', label: 'Metamorphic', means: 'changed by heat and pressure, no melting' }]
});

/* 7-5-02 crystal size. A jittered grid of crystals: big cells for slow cooling, tiny for fast. */
function texture(A, x0, y0, size, slow, seed, cls) {
  const r = rng(seed), n = slow ? 6 : 26, s = size / n, P = [], g = el('g', { class: cls || null }, A.svg);
  const pal = slow ? ['#e9d8c8', '#c98f8f', '#3c3c44', '#d9d9d9', '#b56b6b', '#f2efe9'] : ['#3a3d45', '#2e3138', '#4a4e57', '#565b66', '#41454d'];
  for (let i = 0; i <= n; i++) { P.push([]); for (let j = 0; j <= n; j++) { const edge = i === 0 || j === 0 || i === n || j === n, jt = edge ? 0 : s * .32; P[i].push([x0 + i * s + (r() - .5) * 2 * jt, y0 + j * s + (r() - .5) * 2 * jt]); } }
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const q = [P[i][j], P[i + 1][j], P[i + 1][j + 1], P[i][j + 1]];
    el('polygon', { points: q.map(p => p.map(v => v.toFixed(1)).join(',')).join(' '), fill: pal[Math.floor(r() * pal.length)], stroke: '#1a1d22', 'stroke-width': slow ? 2 : .6 }, g);
  }
  el('rect', { x: x0, y: y0, width: size, height: size, fill: 'none', stroke: C.edge, 'stroke-width': 2 }, g);
  return g;
}
const T_CRYS = {
  id: 'crystals', code: '7-5-02', name: 'Crystals', sec: 2, q: it => it.form === 'pic' ? 'How did this igneous rock cool?' : 'What size are the crystals?', kind: 'choice',
  gen: MODEL.genCrys, typeOf: it => it.form + ':' + it.a,
  choices: it => it.form === 'pic' ? [{ v: 'slow', label: 'Slowly, underground' }, { v: 'fast', label: 'Fast, at the surface' }] : [{ v: 'slow', label: 'Large crystals' }, { v: 'fast', label: 'Small crystals' }],
  check: MODEL.checkCrys, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    if (it.form === 'pic' || fin) texture(A, 40, 60, 300, it.slow, it.seed, it.form === 'cond' ? 'fade' : null);
    if (it.form === 'cond') S.card(A.svg, { x: 490, y: 130, w: 240, h: 130, icon: it.slow ? '🐢' : '⚡', label: it.slow ? 'Magma cools slowly, deep underground' : 'Lava cools fast at the surface', fs: 18, n: 20, size: 40, col: fin ? C.green : C.yellow, sw: 3 });
    if (!fin) return;
    const y = it.form === 'cond' ? 260 : 150;
    A.tx(A.svg, 380, y, it.slow ? 'Large crystals' : 'Small crystals', { 'font-size': 22, fill: C.green, 'text-anchor': 'start', class: 'pop' });
    A.tx(A.svg, 380, y + 32, it.slow ? 'cooled slowly underground' : 'cooled fast at the surface', { 'font-size': 16, fill: C.text, 'text-anchor': 'start', class: 'fade' });
    A.tx(A.svg, 380, y + 58, it.slow ? '(intrusive: time to grow)' : '(extrusive: no time to grow)', { 'font-size': 15, fill: C.muted, 'text-anchor': 'start', class: 'fade' });
  }
};

/* 7-5-03 plate boundaries, top view: two plates and their arrows */
function plates(A, kind, y0, h, opt) {
  opt = opt || {};
  const g = el('g', { class: opt.cls || null }, A.svg), ym = y0 + h / 2, fin = opt.fin;
  el('rect', { x: 70, y: y0, width: 245, height: h, rx: 10, fill: '#22324a', stroke: C.edge, 'stroke-width': 2 }, g);
  el('rect', { x: 325, y: y0, width: 245, height: h, rx: 10, fill: '#2f3a28', stroke: C.edge, 'stroke-width': 2 }, g);
  const col = opt.col || C.yellow, key = col === C.green ? 'N' : 'Y', ar = (x1, y1, x2, y2) => S.arrow(g, x1, y1, x2, y2, col, key, { 'stroke-width': 7 });
  if (kind === 'div') { ar(250, ym, 140, ym); ar(390, ym, 500, ym); }
  if (kind === 'conv') { ar(140, ym, 250, ym); ar(500, ym, 390, ym); }
  if (kind === 'trans') { ar(192, ym + h * .3, 192, ym - h * .3); ar(448, ym - h * .3, 448, ym + h * .3); }
  if (!fin) return g;
  if (kind === 'div') { el('rect', { x: 312, y: y0, width: 16, height: h, fill: C.red, class: 'fade' }, g); DRILL.tx(g, 320, y0 + h + 18, 'magma rises: new crust', { 'font-size': 15, fill: C.red, class: 'fade' }); }
  if (kind === 'conv') { el('path', { d: `M300 ${y0 + h * .2}l20 -30l20 30M300 ${y0 + h * .55}l20 -30l20 30M300 ${y0 + h * .9}l20 -30l20 30`, stroke: C.gold, 'stroke-width': 3, fill: 'none', class: 'fade' }, g); DRILL.tx(g, 320, y0 + h + 18, 'crumple or sink: mountains, volcanoes', { 'font-size': 15, fill: C.gold, class: 'fade' }); }
  if (kind === 'trans') { el('path', { d: `M320 ${y0}l-7 20l14 20l-14 20l14 20l-14 20l14 20l-14 20l14 20l-7 ${Math.max(0, h - 160)}`, stroke: C.red, 'stroke-width': 3, fill: 'none', class: 'fade' }, g); DRILL.tx(g, 320, y0 + h + 18, 'grinding past: earthquakes', { 'font-size': 15, fill: C.red, class: 'fade' }); }
  return g;
}
const T_BOUND = {
  id: 'bound', code: '7-5-03', name: 'Boundaries', sec: 3, q: it => it.form === 'arrows' ? 'Which kind of boundary?' : 'Where does this happen?', kind: 'choice',
  gen: MODEL.genBound, typeOf: it => it.form + ':' + it.a,
  choices: () => MODEL.BOUND.map(k => ({ v: k, label: MODEL.BOUND_NAME[k] })),
  check: MODEL.checkBound, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    if (it.form === 'arrows') { plates(A, it.a, 60, 270, { fin, col: fin ? C.green : C.yellow }); if (fin) S.chip(A.svg, 320, 395, MODEL.BOUND_NAME[it.a], C.green, { cls: 'pop', fs: 20 }); return; }
    S.card(A.svg, { x: 320, y: 90, w: 360, h: 120, label: it.t, fs: 22, n: 28, lb: 40, col: fin ? C.green : C.yellow, sw: 3 });
    if (fin) { plates(A, it.a, 190, 170, { fin, col: C.green, cls: 'fade' }); }
  }
};

/* 7-5-04 focus, epicenter, fault in a cross-section */
const T_QUAKE = {
  id: 'quake', code: '7-5-04', name: 'Earthquake', sec: 4, q: 'The yellow part is the…', kind: 'choice',
  gen: MODEL.genQuake, typeOf: it => it.a,
  choices: () => MODEL.QUAKE.map(k => ({ v: k, label: MODEL.QUAKE_NAME[k] })),
  check: MODEL.checkQuake, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), gy = 110, fx = it.x, fy = gy + it.d, L = it.lean, hc = fin ? C.green : C.yellow;
    el('rect', { x: 20, y: gy, width: 600, height: 300, fill: '#3a2c20' }, A.svg);
    [0, 1, 2].forEach(k => el('line', { x1: 20, x2: 620, y1: gy + 70 + k * 80, y2: gy + 70 + k * 80, stroke: '#4a3a2b', 'stroke-width': 2 }, A.svg));
    el('line', { x1: 20, x2: 620, y1: gy, y2: gy, stroke: '#83c167', 'stroke-width': 5 }, A.svg);
    A.tx(A.svg, 30, gy - 16, 'surface', { 'font-size': 14, fill: C.muted, 'text-anchor': 'start' });
    const tx0 = fx + L * it.d * .55, bx = fx - L * (410 - fy) * .55;
    el('line', Object.assign({ x1: tx0, y1: gy, x2: bx, y2: 410, stroke: '#c9d3e1', 'stroke-width': 3, 'stroke-dasharray': '10 6' }, it.a === 'fault' ? HLA(hc) : {}), A.svg);
    [40, 75, 110].forEach(r => el('circle', { cx: fx, cy: fy, r, fill: 'none', stroke: '#8d9bb0', 'stroke-width': 1.5, opacity: .5 }, A.svg));
    el('path', Object.assign({ d: `M${fx} ${fy - 16}l5 11l12 -3l-7 10l9 8l-12 1l-1 12l-6 -10l-6 10l-1 -12l-12 -1l9 -8l-7 -10l12 3z`, fill: it.a === 'focus' ? hc : C.red, stroke: C.stage, 'stroke-width': 1.5 }, it.a === 'focus' ? { filter: 'url(#glow)' } : {}), A.svg);
    el('circle', Object.assign({ cx: fx, cy: gy, r: 10, fill: it.a === 'epi' ? hc : '#f5f7fb', stroke: C.stage, 'stroke-width': 2 }, it.a === 'epi' ? { filter: 'url(#glow)' } : {}), A.svg);
    if (!fin) return;
    el('line', { x1: fx, x2: fx, y1: gy + 12, y2: fy - 18, stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '4 5', class: 'fade' }, A.svg);
    const lab = (x, y, s, on) => A.tx(A.svg, x, y, s, { 'font-size': on ? 19 : 15, fill: on ? C.green : C.text, class: 'fade', 'text-anchor': 'start' });
    lab(fx + 16, gy - 20, 'Epicenter (on the surface)', it.a === 'epi');
    lab(fx + 24, fy + 2, 'Focus (rock breaks here)', it.a === 'focus');
    lab(Math.min(bx, 470) + 12, 390, 'Fault', it.a === 'fault');
  }
};

/* 7-5-04 shield or composite volcano */
function volcano(A, a, w, h, cls) {
  const gy = 370, W = a === 'shield' ? 470 + w * 10 : 230 + w * 8, H = a === 'shield' ? 70 + h * 4 : 200 + h * 5, x = 320, c = a === 'shield' ? 40 : 26;
  const d = a === 'shield' ? `M${x - W / 2} ${gy}Q${x - W * .3} ${gy - H * .9} ${x - c} ${gy - H}h${2 * c}Q${x + W * .3} ${gy - H * .9} ${x + W / 2} ${gy}Z`
    : `M${x - W / 2} ${gy}Q${x - W * .2} ${gy - H * .25} ${x - c} ${gy - H}l${c} 14l${c} -14Q${x + W * .2} ${gy - H * .25} ${x + W / 2} ${gy}Z`;
  const g = el('g', { class: cls || null }, A.svg);
  el('path', { d, fill: '#4a3a33', stroke: '#c9d3e1', 'stroke-width': 2.5 }, g);
  return { g, H, W, gy };
}
const T_VOLC = {
  id: 'volcano', code: '7-5-04', name: 'Volcano', sec: 4, q: it => it.form === 'shape' ? 'Which type of volcano?' : 'Shield or composite?', kind: 'choice',
  gen: MODEL.genVolc, typeOf: it => it.form + ':' + it.a,
  choices: () => [{ v: 'shield', label: 'Shield' }, { v: 'comp', label: 'Composite' }],
  check: MODEL.checkVolc, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    el('line', { x1: 20, x2: 620, y1: 370, y2: 370, stroke: C.axis, 'stroke-width': 2 }, A.svg);
    if (it.form === 'fact') S.card(A.svg, { x: 320, y: 62, w: 380, h: 84, label: it.t, fs: 22, n: 30, lb: 26, col: fin ? C.green : C.yellow, sw: 3 });
    if (it.form === 'shape' || fin) volcano(A, it.a, it.w, it.h, it.form === 'fact' ? 'fade' : null);
    if (!fin) return;
    A.tx(A.svg, 320, 398, it.a === 'shield' ? 'Shield: runny lava, wide gentle slopes, gentle flows' : 'Composite: thick lava traps gas, steep, explosive', { 'font-size': 16, fill: C.green, class: 'fade' });
  }
};

/* 7-5-05 weathering, erosion, deposition */
const T_SURF = S.classTab({
  id: 'surface', code: '7-5-05', name: 'Surface', sec: 5, q: 'Which process is this?', bank: MODEL.SURF, cues: MODEL.SURF_CUE,
  cats: [{ v: 'weath', label: 'Weathering', means: 'breaks rock down where it is' }, { v: 'eros', label: 'Erosion', means: 'carries the pieces away' },
    { v: 'depo', label: 'Deposition', means: 'drops them in a new place' }]
});

/* 7-5-06 oldest layer (law of superposition) */
const LAYER_COL = ['#c9a46a', '#8a6a45', '#b5835a', '#6f7d5c', '#9c8f7a'];
const T_OLD = {
  id: 'oldest', code: '7-5-06', name: 'Oldest?', sec: 6, q: it => ({ oldest: 'Which layer is oldest?', youngest: 'Which layer is youngest?', fossil: 'Which lived first?' })[it.form], kind: 'choice',
  gen: MODEL.genOld, typeOf: it => it.form,
  choices: it => it.form === 'fossil' ? it.fos.map(f => ({ v: f[0], label: f[0] })) : it.letters.slice().sort().map(l => ({ v: l, label: l })),
  check: MODEL.checkOld, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), top = 50, H = 320, h = H / it.n;
    for (let k = 0; k < it.n; k++) {
      const y = top + k * h, ans = fin && it.form !== 'fossil' && it.letters[k] === it.a;
      el('path', { d: `M130 ${y}Q320 ${y + (k % 2 ? 6 : -6)} 510 ${y}V${y + h}H130Z`, fill: LAYER_COL[k], stroke: ans ? C.green : '#1a1d22', 'stroke-width': ans ? 4 : 2 }, A.svg);
      if (it.form !== 'fossil') A.tx(A.svg, 104, y + h / 2, it.letters[k], { 'font-size': 24, fill: ans ? C.green : C.text });
    }
    if (it.form === 'fossil') it.spots.forEach((k, j) => {
      const y = top + k * h + h / 2, good = fin && it.fos[j][0] === it.a;
      S.emo(A.svg, 250 + j * 140, y, it.fos[j][1], 34);
      A.tx(A.svg, 250 + j * 140, y + 26, it.fos[j][0], { 'font-size': 14, fill: good ? C.green : C.text });
    });
    if (!fin) return;
    S.arrow(A.svg, 560, 70, 560, 360, C.gold, 'G', { 'stroke-width': 4, class: 'draw', pathLength: 1 });
    A.tx(A.svg, 560, 50, 'younger', { 'font-size': 14, fill: C.gold });
    A.tx(A.svg, 560, 390, 'older', { 'font-size': 14, fill: C.gold });
    A.tx(A.svg, 320, 400, 'Lower layers formed first', { 'font-size': 16, fill: C.green, class: 'fade' });
  }
};

const PAGE = {
  key: 'sci7-planet-earth-trainer-v1', course: 'Science 7 · Planet Earth', title: 'Planet Earth Trainer',
  notes: 'sci7-planet-earth-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_LAYER, T_ROCK, T_CRYS, T_BOUND, T_QUAKE, T_VOLC, T_SURF, T_OLD]
};
DRILL.boot(PAGE);
