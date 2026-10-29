/* ===================== PAGE: pictures and tabs ===================== */
const { C } = DRILL;
const done = S.done;
const el = (tag, a, p) => DRILL.el(tag, a, p);
const HL = { stroke: C.yellow, 'stroke-width': 5, filter: 'url(#glow)' };
// A small seeded random for drawing, so a picture stays the same on every redraw of the same item.
const rng = seed => { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

/* ---- a plant cell (schematic): wall, membrane, big vacuole, nucleus, chloroplasts ---- */
function plantCell(A, o) {
  const { cx, cy, w, h } = o, hl = o.hl, g = el('g', {}, A.svg), hc = o.hcol || C.yellow;
  const hlA = k => hl === k ? Object.assign({}, HL, { stroke: hc }) : {};
  el('rect', Object.assign({ x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 22, fill: '#121a24', stroke: '#6f8f5c', 'stroke-width': 12 }, hl === 'wall' ? { stroke: hc, filter: 'url(#glow)' } : {}), g);
  el('rect', Object.assign({ x: cx - w / 2 + 11, y: cy - h / 2 + 11, width: w - 22, height: h - 22, rx: 14, fill: 'none', stroke: '#c9d3e1', 'stroke-width': 2 }, hl === 'membrane' ? { stroke: hc, 'stroke-width': 5, filter: 'url(#glow)' } : {}), g);
  const lay = o.lay || 0, nx = [-1, 1, -1][lay], ny = [-1, 1, 1][lay];
  el('ellipse', Object.assign({ cx: cx - nx * w * .06, cy: cy - ny * h * .04, rx: w * .3, ry: h * .27, fill: '#17324b', stroke: '#58c4dd', 'stroke-width': 2.5 }, hlA('vacuole')), g);
  const nX = cx + nx * w * .33, nY = cy + ny * h * .28;
  el('circle', Object.assign({ cx: nX, cy: nY, r: Math.min(w, h) * .11, fill: '#3b2a52', stroke: '#b58ce0', 'stroke-width': 2.5 }, hlA('nucleus')), g);
  el('circle', { cx: nX + 4, cy: nY - 3, r: 6, fill: '#b58ce0' }, g);
  if (o.chloro !== false) {
    const spots = [[-.38, -.32], [-.1, -.38], [.2, -.37], [.4, -.1], [.36, .3], [.05, .38], [-.25, .36], [-.42, .08]];
    spots.forEach(([a, b], i) => {
      const x = cx + a * w, y = cy + b * h;
      if (Math.hypot(x - nX, y - nY) < Math.min(w, h) * .2) return;
      el('ellipse', Object.assign({ cx: x, cy: y, rx: 17, ry: 9, transform: 'rotate(' + ((i * 47) % 90 - 45) + ' ' + x + ' ' + y + ')', fill: '#2e6b2a', stroke: '#83c167', 'stroke-width': 2 }, hl === 'chloro' ? { stroke: hc, 'stroke-width': 4, filter: 'url(#glow)' } : {}), g);
    });
  }
  return g;
}
/* ---- an animal cell: wobbly outline, no wall, small vacuoles, no chloroplasts ---- */
function animalCell(A, o) {
  const r = rng(o.seed), g = el('g', {}, A.svg), ph = r() * 6, pts = [];
  for (let k = 0; k < 48; k++) { const t = k / 48 * Math.PI * 2, rr = 1 + .07 * Math.sin(3 * t + ph) + .04 * Math.sin(5 * t + ph * 2); pts.push([o.cx + Math.cos(t) * o.w / 2 * rr, o.cy + Math.sin(t) * o.h / 2 * rr]); }
  el('path', { d: 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join('L') + 'Z', fill: '#1a1622', stroke: '#c9d3e1', 'stroke-width': 2.5 }, g);
  el('circle', { cx: o.cx + o.w * .05, cy: o.cy - o.h * .03, r: Math.min(o.w, o.h) * .13, fill: '#3b2a52', stroke: '#b58ce0', 'stroke-width': 2.5 }, g);
  el('circle', { cx: o.cx + o.w * .05 + 4, cy: o.cy - o.h * .03 - 3, r: 6, fill: '#b58ce0' }, g);
  [[-.28, -.2], [.25, .22], [-.15, .27], [.3, -.18]].forEach(([a, b], i) => el('circle', { cx: o.cx + a * o.w, cy: o.cy + b * o.h, r: 8 + i * 2, fill: '#17324b', stroke: '#58c4dd', 'stroke-width': 1.5 }, g));
  return g;
}

/* 7-2-01 name the plant cell part */
const T_CELL = {
  id: 'cell', code: '7-2-01', name: 'Cell parts', sec: 1, q: 'The yellow part is the…', kind: 'choice', cols: 2,
  gen: MODEL.genCell, typeOf: it => it.a,
  choices: it => it.opts.map(k => ({ v: k, label: MODEL.CELL_NAME[k] })),
  check: MODEL.checkCell, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    plantCell(A, { cx: 320, cy: 190, w: 440, h: 300, hl: it.a, lay: it.lay, hcol: fin ? C.green : C.yellow });
    if (fin) S.chip(A.svg, 320, 385, MODEL.CELL_NAME[it.a] + ': ' + MODEL.CELL_JOB[it.a], C.green, { cls: 'pop', fs: 18 });
  }
};

/* 7-2-01 plant cell or animal cell */
const T_KIND = {
  id: 'kind', code: '7-2-01', name: 'Plant/animal', sec: 1, q: 'Plant cell or animal cell?', kind: 'choice',
  gen: MODEL.genKind, typeOf: it => it.a + (it.onion ? '-onion' : ''),
  choices: () => [{ v: 'plant', label: 'Plant' }, { v: 'animal', label: 'Animal' }],
  check: MODEL.checkKind, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), r = rng(it.seed), w = 300 + r() * 50, h = 220 + r() * 50, cx = fin ? 220 : 320;
    if (it.a === 'plant') plantCell(A, { cx, cy: 205, w, h, chloro: !it.onion, lay: Math.floor(r() * 3) });
    else animalCell(A, { cx, cy: 205, w, h, seed: it.seed });
    if (!fin) return;
    const has = it.a === 'plant' ? [true, true, !it.onion] : [false, false, false];
    ['Cell wall', 'Big vacuole', 'Chloroplasts'].forEach((t, k) => {
      const y = 130 + k * 62;
      A.tx(A.svg, 430, y, has[k] ? '✓' : '✗', { 'font-size': 28, fill: has[k] ? C.green : C.red, class: 'pop' });
      A.tx(A.svg, 458, y, t, { 'font-size': 19, fill: C.text, 'text-anchor': 'start', class: 'fade' });
    });
    S.chip(A.svg, 320, 385, it.a === 'plant' ? (it.onion ? 'Plant cell (onion: no chloroplasts)' : 'Plant cell') : 'Animal cell', C.green, { cls: 'pop', fs: 19 });
  }
};

/* 7-2-02 which part does this job */
const PART_ROW = { flower: ['Flower', '🌸', 62], leaf: ['Leaf', '🍃', 146], stem: ['Stem', '🌱', 230], root: ['Root', '🥕', 352] };
function rowCard(A, x, y, w, h, icon, label, col, fill) {
  el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 14, fill: fill || C.panel, stroke: col || C.edge, 'stroke-width': col ? 3 : 2 }, A.svg);
  S.emo(A.svg, x - w / 2 + 34, y + 2, icon, 32);
  A.tx(A.svg, x - w / 2 + 64, y, label, { 'font-size': 20, fill: C.text, 'text-anchor': 'start' });
}
const T_JOB = {
  id: 'job', code: '7-2-02', name: 'Jobs', sec: 2, q: 'Which part does this job?', kind: 'choice',
  gen: MODEL.genJob, typeOf: it => it.t,
  choices: () => MODEL.PARTS.map(k => ({ v: k, label: PART_ROW[k][0] })),
  check: MODEL.checkJob, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), x = 150;
    el('line', { x1: 30, x2: 300, y1: 296, y2: 296, stroke: '#8a6a45', 'stroke-width': 4 }, A.svg);
    A.tx(A.svg, 40, 312, 'ground', { 'font-size': 13, fill: C.muted, 'text-anchor': 'start' });
    Object.keys(PART_ROW).forEach(k => { const [t, i, y] = PART_ROW[k], good = fin && k === it.a, bad = fin && k === V.resp.v && k !== it.a; rowCard(A, x, y, 190, 66, i, t, good ? C.green : bad ? C.red : null, good ? '#13301c' : null); });
    [[24, 268, 'Shoot system'], [320, 390, 'Root system']].forEach(([y1, y2, t]) => {
      el('path', { d: 'M262 ' + y1 + 'h10V' + y2 + 'h-10', stroke: C.muted, 'stroke-width': 2, fill: 'none' }, A.svg);
      A.tx(A.svg, 280, (y1 + y2) / 2, t, { 'font-size': 14, fill: C.muted, 'text-anchor': 'start' });
    });
    S.card(A.svg, { x: 500, y: 200, w: 210, h: 150, label: it.t, fs: 19, n: 17, lb: 30, col: fin ? C.green : C.yellow, sw: 3 });
    if (!fin) { A.tx(A.svg, 500, 152, '?', { 'font-size': 30, fill: C.yellow }); return; }
    const y = PART_ROW[it.a][2];
    S.arrow(A.svg, 395, 200, 252, y, C.green, 'N', { class: 'draw', pathLength: 1 });
  }
};

/* 7-2-02 xylem and phloem */
const TUBE = { xylem: { name: 'Xylem', icon: '💧', what: 'water ↑ from roots', dir: -1, col: C.blue }, phloem: { name: 'Phloem', icon: '🍬', what: 'sugar from leaves', dir: 1, col: C.gold } };
const T_TUBE = {
  id: 'tube', code: '7-2-02', name: 'Xylem/phloem', sec: 2, q: it => it.form === 'cargo' ? 'Which tube carries it?' : TUBE[it.tube].name + ' carries…', kind: 'choice',
  gen: MODEL.genTube, typeOf: it => it.form + ':' + it.a,
  choices: it => it.form === 'cargo' ? [{ v: 'xylem', label: 'Xylem' }, { v: 'phloem', label: 'Phloem' }]
    : [{ v: 'water', label: 'Water up from the roots' }, { v: 'sugar', label: 'Sugar from the leaves' }, { v: 'soil', label: 'Food from the soil' }],
  check: MODEL.checkTube, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), sx = 190, other = it.left === 'xylem' ? 'phloem' : 'xylem', asked = it.form === 'cargo' ? it.a : it.tube;
    rowCard(A, sx, 42, 190, 58, '🍃', 'Leaves');
    rowCard(A, sx, 376, 190, 58, '🥕', 'Roots');
    el('rect', { x: sx - 70, y: 102, width: 140, height: 236, rx: 12, fill: '#16241a', stroke: '#3e5c3a', 'stroke-width': 2 }, A.svg);
    A.tx(A.svg, sx - 84, 220, 'Stem', { 'font-size': 15, fill: C.muted, 'text-anchor': 'end' });
    [[it.left, sx - 32], [other, sx + 32]].forEach(([k, x]) => {
      const T = TUBE[k], hot = k === asked, show = fin || (it.form === 'cargo' && hot);
      el('rect', { x: x - 15, y: 108, width: 30, height: 224, rx: 13, fill: '#0e1620', stroke: hot ? (fin ? C.green : C.yellow) : fin ? T.col : C.edge, 'stroke-width': hot ? 4 : 2.5 }, A.svg);
      if (show) [0, 1, 2].forEach(j => S.emo(A.svg, x, 140 + j * 76, T.icon, 22, { class: fin ? 'fade' : null }));
      if (show) S.arrow(A.svg, x, T.dir < 0 ? 312 : 126, x, T.dir < 0 ? 122 : 316, fin ? T.col : C.yellow, fin ? (k === 'xylem' ? 'L' : 'G') : 'Y', { 'stroke-width': 3, opacity: .7 });
      if ((it.form === 'tube' && hot) || fin) A.tx(A.svg, x, 88, T.name, { 'font-size': 15, fill: fin ? T.col : C.yellow, class: fin ? 'fade' : null });
    });
    if (it.form === 'cargo') S.card(A.svg, { x: 470, y: 160, w: 250, h: 160, label: it.t, fs: 19, n: 20, lb: 34, col: fin ? C.green : C.yellow, sw: 3 });
    else if (fin) S.chip(A.svg, 470, 160, it.a === 'water' ? 'Xylem: water and minerals' : 'Phloem: sugar (food)', C.green, { cls: 'pop', fs: 17 });
    if (!fin) return;
    A.tx(A.svg, 352, 300, '💧 Xylem: water up from roots', { 'font-size': 16, fill: C.blue, 'text-anchor': 'start', class: 'fade' });
    A.tx(A.svg, 352, 334, '🍬 Phloem: sugar from leaves', { 'font-size': 16, fill: C.gold, 'text-anchor': 'start', class: 'fade' });
    if (V.resp.v === 'soil') S.chip(A.svg, 470, 262, 'Soil gives water, not food', C.red, { cls: 'pop', fs: 16 });
  }

};

/* 7-2-03 photosynthesis flowchart with one blank */
const PH_BOX = { light: ['☀️', 'Light', 'from the Sun', 95, 80], water: ['💧', 'Water', 'from the soil', 95, 210], co2: ['☁️', 'Carbon dioxide', 'from the air', 95, 340],
  glucose: ['🍬', 'Glucose', 'food (sugar)', 545, 140], oxygen: ['💨', 'Oxygen', 'into the air', 545, 280] };
const T_PHOTO = {
  id: 'photo', code: '7-2-03', name: 'Photosynthesis', sec: 3, q: 'What goes in the yellow box?', kind: 'choice', cols: 2,
  gen: MODEL.genPhoto, typeOf: it => it.a,
  choices: it => it.opts.map(k => ({ v: k, label: MODEL.PHOTO_NAME[k] })),
  check: MODEL.checkPhoto, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    S.card(A.svg, { x: 320, y: 210, w: 150, h: 130, icon: '🍃', label: 'Leaf (chloroplasts)', fs: 15, n: 12, size: 46, col: C.green });
    Object.keys(PH_BOX).forEach(k => {
      const [icon, name, from, x, y] = PH_BOX[k], blank = k === it.a, out = x > 320;
      if (out) S.arrow(A.svg, 398, 210 + (y - 210) * .3, x - 82, y, C.text, 'W', { 'stroke-width': 3 });
      else S.arrow(A.svg, x + 78, y, 242, 210 + (y - 210) * .3, C.text, 'W', { 'stroke-width': 3 });
      if (blank && !fin) { S.card(A.svg, { x, y, w: 150, h: 100, label: '?', fs: 30, col: C.yellow, sw: 3, fill: '#262110', lb: 34 }); return; }
      S.card(A.svg, { x, y, w: 150, h: 100, icon, label: name, fs: 16, n: 15, size: 34, col: blank ? C.green : C.edge, sw: blank ? 3 : 2, fill: blank ? '#13301c' : C.panel, cls: blank ? 'pop' : null });
      if (fin) A.tx(A.svg, x, y + 62, from, { 'font-size': 14, fill: blank ? C.green : C.muted, class: 'fade' });
    });
    A.tx(A.svg, 320, 300, 'light energy', { 'font-size': 14, fill: C.muted });
    if (fin) A.tx(A.svg, 410, 405, 'carbon dioxide + water → glucose + oxygen', { 'font-size': 16, fill: C.text, class: 'fade' });
    if (fin && V.resp.v === 'soil') S.chip(A.svg, 320, 70, 'Soil gives water, not food', C.red, { cls: 'pop', fs: 16 });
  }
};

/* 7-2-04 flower parts (schematic side view) */
function flower(A, hl, hc) {
  const g = el('g', {}, A.svg), H = k => (hl === k || (hl === 'stamen' && k === 'anther') || (hl === 'pistil' && (k === 'stigma' || k === 'ovary' || k === 'style')) || (hl === 'stamen' && k === 'filament')) ? { stroke: hc, 'stroke-width': 5, filter: 'url(#glow)' } : {};
  el('path', { d: 'M320 335V410', stroke: '#4f8a3c', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
  [1, -1].forEach(s => {
    el('path', Object.assign({ d: `M320 338Q${320 - s * 50} 352 ${320 - s * 98} 312Q${320 - s * 46} 312 320 330Z`, fill: '#2e5e26', stroke: '#83c167', 'stroke-width': 2.5 }, H('sepal')), g);
    el('path', Object.assign({ d: `M316 326C${320 - s * 95} 326 ${320 - s * 165} 220 ${320 - s * 140} 108C${320 - s * 80} 140 ${320 - s * 20} 230 316 326Z`, transform: s < 0 ? 'translate(8 0)' : null, fill: 'rgba(239,127,198,.22)', stroke: '#ef7fc6', 'stroke-width': 2.5 }, H('petal')), g);
    el('line', Object.assign({ x1: 320 - s * 14, y1: 315, x2: 320 - s * 62, y2: 182, stroke: '#d9c27a', 'stroke-width': 3 }, H('filament')), g);
    el('ellipse', Object.assign({ cx: 320 - s * 64, cy: 172, rx: 17, ry: 9, transform: `rotate(${s * 20} ${320 - s * 64} 172)`, fill: '#b9852f', stroke: '#f0ac5f', 'stroke-width': 2 }, H('anther')), g);
  });
  el('ellipse', Object.assign({ cx: 320, cy: 300, rx: 26, ry: 22, fill: '#2c4a3a', stroke: '#5cd0b3', 'stroke-width': 2.5 }, H('ovary')), g);
  el('rect', Object.assign({ x: 316, y: 158, width: 8, height: 122, fill: '#2c4a3a', stroke: '#5cd0b3', 'stroke-width': 2 }, H('style')), g);
  el('ellipse', Object.assign({ cx: 320, cy: 150, rx: 19, ry: 10, fill: '#3f6b55', stroke: '#5cd0b3', 'stroke-width': 2.5 }, H('stigma')), g);
  return g;
}
const T_FLOWER = {
  id: 'flower', code: '7-2-04', name: 'Flower', sec: 4, q: 'The yellow part is the…', kind: 'choice', cols: 2,
  gen: MODEL.genFlower, typeOf: it => it.a,
  choices: it => it.opts.map(k => ({ v: k, label: MODEL.FLOWER_NAME[k] })),
  check: MODEL.checkFlower, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    flower(A, it.a, fin ? C.green : C.yellow);
    if (fin) S.chip(A.svg, 320, 40, MODEL.FLOWER_NAME[it.a] + ': ' + MODEL.FLOWER_JOB[it.a], C.green, { cls: 'pop', fs: 18 });
  }
};

/* 7-2-04 sexual or asexual */
const T_REPRO = S.classTab({
  id: 'repro', code: '7-2-04', name: 'Sexual?', sec: 4, q: 'Sexual or asexual?', bank: MODEL.REPRO, cues: MODEL.REPRO_CUE,
  cats: [{ v: 'sex', label: 'Sexual', means: 'pollen + egg → seed; two parents' }, { v: 'asex', label: 'Asexual', means: 'a plant part grows; one parent' }]
});

/* 7-2-05 selective breeding or GMO */
const T_BIOTECH = S.classTab({
  id: 'biotech', code: '7-2-05', name: 'Biotech', sec: 6, q: 'Which kind of biotechnology?', bank: MODEL.BIOTECH, cues: MODEL.BIOTECH_CUE,
  cats: [{ v: 'breed', label: 'Selective breeding', means: 'choose parents over many generations' }, { v: 'gmo', label: 'Genetically modified', means: 'genes changed directly in a lab' }]
});

const PAGE = {
  key: 'sci7-plants-food-fibre-trainer-v1', course: 'Science 7 · Plants for Food and Fibre', title: 'Plants Trainer',
  notes: 'sci7-plants-food-fibre-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_CELL, T_KIND, T_JOB, T_TUBE, T_PHOTO, T_FLOWER, T_REPRO, T_BIOTECH]
};
DRILL.boot(PAGE);
