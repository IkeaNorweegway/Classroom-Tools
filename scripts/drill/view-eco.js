/* ===================== PAGE: pictures and tabs ===================== */
const { C } = DRILL;
const done = S.done;
const LEVEL_NAME = { prod: 'Producer', pri: 'Primary consumer', sec: 'Secondary consumer', ter: 'Tertiary consumer' };

/* 7-1-01 biotic or abiotic */
const T_BIO = S.classTab({
  id: 'biotic', code: '7-1-01', name: 'Biotic?', sec: 1, q: 'Biotic or abiotic?',
  bank: MODEL.BIOTIC, cues: MODEL.BIOTIC_CUES,
  cats: [{ v: 'bio', label: 'Biotic', means: 'a living part of the ecosystem' }, { v: 'abio', label: 'Abiotic', means: 'a non-living part of the ecosystem' }]
});

/* 7-1-02 producer, consumer, decomposer */
const T_ROLE = S.classTab({
  id: 'role', code: '7-1-02', name: 'Role', sec: 2, q: 'Its role in the ecosystem', bank: MODEL.ROLE, cues: MODEL.ROLE_CUES,
  cats: [{ v: 'prod', label: 'Producer', means: 'makes its own food from sunlight' }, { v: 'cons', label: 'Consumer', means: 'eats other living things' },
    { v: 'decomp', label: 'Decomposer', means: 'breaks down dead things, returns nutrients' }]
});

/* A food chain in a row of cards, food first, arrows to the eater. Returns card centres. */
function chainRow(A, chain, y, opt) {
  opt = opt || {};
  const n = chain.length, w = n === 4 ? 122 : 140, gap = n === 4 ? 36 : 60, span = n * w + (n - 1) * gap, x0 = 320 - span / 2 + w / 2;
  const xs = chain.map((_, i) => x0 + i * (w + gap));
  chain.forEach(([t, i], k) => S.card(A.svg, { x: xs[k], y, w, h: 128, icon: i, label: t, size: 46, fs: 15, n: 12, col: opt.col && opt.col(k) || C.edge, sw: 3 }));
  for (let k = 0; k < n - 1; k++) S.arrow(A.svg, xs[k] + w / 2 + 4, y, xs[k + 1] - w / 2 - 6, y, C.text, 'W', { 'stroke-width': 3 });
  return { xs, w };
}

/* 7-1-02 trophic level in a chain */
const T_LEVEL = {
  id: 'level', code: '7-1-02', name: 'Level', sec: 2, q: 'The yellow one is a…', kind: 'choice', cols: 2,
  gen: MODEL.genLevel, typeOf: it => it.a,
  choices: () => [{ v: 'prod', label: 'Producer' }, { v: 'pri', label: 'Primary consumer' }, { v: 'sec', label: 'Secondary consumer' }, { v: 'ter', label: 'Tertiary consumer' }],
  check: MODEL.checkLevel, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const ch = MODEL.CHAINS[it.c], fin = done(V);
    const { xs } = chainRow(A, ch, 160, { col: k => k === it.k ? (fin ? C.green : C.yellow) : null });
    S.lines(A.svg, 320, 52, 'arrow = “is eaten by”', 30, { 'font-size': 16, fill: C.muted });
    if (!fin) { A.tx(A.svg, xs[it.k], 252, '?', { 'font-size': 34, fill: C.yellow }); return; }
    ch.forEach((_, k) => {
      const lab = k === 0 ? 'Producer' : ['', '1st eater', '2nd eater', '3rd eater'][k];
      A.tx(A.svg, xs[k], 250, lab, { 'font-size': 15, fill: k === it.k ? C.green : C.muted, class: 'fade' });
    });
    S.chip(A.svg, 320, 330, LEVEL_NAME[it.a], C.green, { cls: 'pop', fs: 22 });
    if (it.k > 0) A.tx(A.svg, 320, 378, 'Count eaters from the producer', { 'font-size': 16, fill: C.muted, class: 'fade' });
  }
};

/* 7-1-02 which way does the arrow point */
const T_ARROW = {
  id: 'arrow', code: '7-1-02', name: 'Arrow', sec: 2, q: 'Which way does the arrow point?', kind: 'choice',
  gen: MODEL.genArrow, typeOf: it => it.foodLeft ? 'food-left' : 'food-right',
  prompt: it => { const c = MODEL.CHAINS[it.c]; return c[it.k + 1][0] + ' eats ' + c[it.k][0].toLowerCase(); },
  choices: () => [{ v: 'l', label: '←', math: true, aria: 'left' }, { v: 'r', label: '→', math: true, aria: 'right' }],
  check: MODEL.checkArrow, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const c = MODEL.CHAINS[it.c], food = c[it.k], eater = c[it.k + 1], L = it.foodLeft ? food : eater, R = it.foodLeft ? eater : food, fin = done(V);
    S.card(A.svg, { x: 150, y: 190, w: 180, h: 170, icon: L[1], label: L[0], size: 70, fs: 19, n: 16 });
    S.card(A.svg, { x: 490, y: 190, w: 180, h: 170, icon: R[1], label: R[0], size: 70, fs: 19, n: 16 });
    if (!fin) { A.tx(A.svg, 320, 190, '?', { 'font-size': 48, fill: C.yellow }); return; }
    const fx = it.foodLeft ? 248 : 392, ex = it.foodLeft ? 392 : 248;
    S.arrow(A.svg, fx, 190, ex, 190, C.green, 'N', { 'stroke-width': 6, class: 'draw', pathLength: 1 });
    A.tx(A.svg, 320, 160, 'energy', { 'font-size': 17, fill: C.green, class: 'fade' });
    A.tx(A.svg, 150, 310, it.foodLeft ? 'food' : 'eater', { 'font-size': 18, fill: C.muted, class: 'fade' });
    A.tx(A.svg, 490, 310, it.foodLeft ? 'eater' : 'food', { 'font-size': 18, fill: C.muted, class: 'fade' });
    S.chip(A.svg, 320, 375, 'Arrow points to the eater', C.green, { cls: 'pop', fs: 18 });
  }
};

/* 7-1-02 food web: one species gone */
const T_WEB = {
  id: 'web', code: '7-1-02', name: 'Food web', sec: 2, q: it => 'No more ' + MODEL.WEB.nodes[it.gone][0].toLowerCase(), kind: 'choice',
  gen: MODEL.genWeb, typeOf: it => it.a,
  prompt: () => 'The yellow one will…',
  choices: () => [{ v: 'up', label: 'Go up ↑' }, { v: 'down', label: 'Go down ↓' }],
  check: MODEL.checkWeb, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const W = MODEL.WEB, pos = {}, fin = done(V), cw = 104, chh = 74, ys = [62, 210, 358];
    W.rows.forEach((row, r) => row.forEach((k, i) => { pos[k] = [320 + (i - (row.length - 1) / 2) * 140, ys[r]]; }));
    const key = (a, b) => (a === it.gone && b === it.who) || (b === it.gone && a === it.who);
    W.edges.forEach(([f, e]) => {
      const hot = fin && key(f, e), [x1, y1] = pos[f], [x2, y2] = pos[e];
      S.arrow(A.svg, x1, y1 - chh / 2, x2 + (x1 - x2) * .08, y2 + chh / 2 + 4, hot ? C.green : '#4a5870', hot ? 'N' : 'M', { 'stroke-width': hot ? 5 : 2 });
    });
    Object.keys(W.nodes).forEach(k => {
      const [t, i] = W.nodes[k], [x, y] = pos[k], gone = k === it.gone, who = k === it.who;
      S.card(A.svg, { x, y, w: cw, h: chh, icon: i, label: t, size: 30, fs: 14, lb: 8, col: who ? (fin ? C.green : C.yellow) : gone ? C.red : C.edge, sw: who || gone ? 3.5 : 2, fill: gone ? '#1a1012' : C.panel });
      if (gone) { A.el('line', { x1: x - 30, y1: y - 26, x2: x + 30, y2: y + 26, stroke: C.red, 'stroke-width': 6, 'stroke-linecap': 'round' }, A.svg); A.el('line', { x1: x + 30, y1: y - 26, x2: x - 30, y2: y + 26, stroke: C.red, 'stroke-width': 6, 'stroke-linecap': 'round' }, A.svg); }
    });
    if (!fin) return;
    const [x, y] = pos[it.who], up = it.a === 'up';
    A.tx(A.svg, x + cw / 2 + 22, y, up ? '↑' : '↓', { 'font-size': 40, fill: C.green, class: 'pop' });
    S.chip(A.svg, 320, 136, up ? 'Its predator is gone' : 'Its food is gone', C.green, { cls: 'pop', fs: 17 });
  }
};

/* 7-1-02 / §3 energy pyramid, the 10% rule */
const T_ENERGY = {
  id: 'energy', code: '7-1-02', name: '10% rule', sec: 3, q: 'Energy at the ? level', kind: 'slots',
  gen: MODEL.genEnergy, typeOf: it => 'steps' + (it.a - it.g),
  slots: () => ['=', { k: 'v', label: 'energy units', wide: true }, 'units'],
  check: MODEL.checkEnergy, answer: it => ({ v: Q.q(it.v) }),
  draw(A, it, V) {
    const fin = done(V), names = ['Producers', 'Primary consumers', 'Secondary consumers', 'Tertiary consumers'];
    const fmtN = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '), cx = 300, h = 74, yb = 392, w = [500, 380, 260, 140];
    for (let L = 0; L < 4; L++) {
      const y = yb - (L + 1) * h, wb = w[L], wt = L < 3 ? w[L + 1] : 40, show = fin || L === it.g, ask = L === it.a;
      A.el('polygon', { points: [[cx - wb / 2, y + h], [cx + wb / 2, y + h], [cx + wt / 2, y], [cx - wt / 2, y]].map(p => p.join(',')).join(' '), fill: ask ? (fin ? '#13301c' : '#262110') : C.panel, stroke: ask ? (fin ? C.green : C.yellow) : C.edge, 'stroke-width': ask ? 3 : 2 }, A.svg);
      A.tx(A.svg, cx, y + h / 2 - (L < 3 ? 12 : 0), show ? fmtN(L === it.a || fin ? it.base / Math.pow(10, L) : it.given) : ask ? '?' : '', { 'font-size': L < 3 ? 22 : 17, fill: ask ? (fin ? C.green : C.yellow) : C.text, class: fin && L !== it.g ? 'fade' : null });
      if (L < 3) A.tx(A.svg, cx, y + h / 2 + 14, names[L], { 'font-size': 13, fill: C.muted });
      else A.tx(A.svg, cx + 100, y + h / 2, names[L], { 'font-size': 13, fill: C.muted, 'text-anchor': 'start' });
    }
    if (V.phase === 'ask') return;
    for (let L = 0; L < 3; L++) {
      const y = yb - (L + 1) * h;
      A.tx(A.svg, cx + w[L] / 2 + 34, y + 2, '÷ 10', { 'font-size': 18, fill: C.gold, class: 'fade', 'text-anchor': 'start' });
      S.emo(A.svg, cx - w[L] / 2 - 26, y + 6, '🔥', 22, { class: 'fade' });
    }
    A.tx(A.svg, 18, 40, '🔥 about 90% lost as heat at each step', { 'font-size': 15, fill: C.muted, 'text-anchor': 'start', class: 'fade' });
  }
};

/* 7-1-03 which plot has more biodiversity */
const T_BIOD = {
  id: 'biodiv', code: '7-1-03', name: 'Biodiversity', sec: 4, q: 'More biodiversity?', kind: 'choice',
  gen: MODEL.genBio, typeOf: () => 'bio',
  choices: () => [{ v: 'A', label: 'A' }, { v: 'B', label: 'B' }],
  check: MODEL.checkBio, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    [['A', it.A, it.nA, 165], ['B', it.B, it.nB, 475]].forEach(([nm, list, n, x]) => {
      const good = fin && nm === it.a;
      A.el('rect', { x: x - 140, y: 30, width: 280, height: 270, rx: 18, fill: good ? '#13301c' : C.panel, stroke: good ? C.green : C.edge, 'stroke-width': good ? 3 : 2 }, A.svg);
      A.tx(A.svg, x - 118, 54, nm, { 'font-size': 22, fill: C.muted });
      const cols = 4, rows = Math.ceil(list.length / cols);
      list.forEach((k, j) => S.emo(A.svg, x - 96 + (j % cols) * 64 + ((Math.floor(j / cols) % 2) * 14), 92 + Math.floor(j / cols) * (rows > 4 ? 46 : 56), k, 34));
      if (!fin) return;
      const kinds = [...new Set(list)];
      kinds.forEach((k, j) => S.emo(A.svg, x - (kinds.length - 1) * 19 + j * 38, 330, k, 28, { class: 'pop' }));
      A.tx(A.svg, x, 370, n + (n === 1 ? ' kind' : ' kinds') + ' · ' + list.length + ' living things', { 'font-size': 17, fill: good ? C.green : C.muted, class: 'fade' });
    });
    if (fin) A.tx(A.svg, 320, 402, 'Biodiversity counts kinds (species)', { 'font-size': 15, fill: C.muted, class: 'fade' });
  }
};

/* 7-1-04 natural or human-caused change */
const T_CHANGE = S.classTab({
  id: 'change', code: '7-1-04', name: 'Change', sec: 5, q: 'What kind of change?', bank: MODEL.CHANGE, cues: MODEL.CHANGE_CUES,
  cats: [{ v: 'nat', label: 'Natural', means: 'a natural disturbance' }, { v: 'hum', label: 'Human-caused', means: 'people caused it' }]
});

const PAGE = {
  key: 'sci7-interactions-ecosystems-trainer-v1', course: 'Science 7 · Interactions and Ecosystems', title: 'Ecosystems Trainer',
  notes: 'sci7-interactions-ecosystems-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_BIO, T_ROLE, T_LEVEL, T_ARROW, T_WEB, T_ENERGY, T_BIOD, T_CHANGE]
};
DRILL.boot(PAGE);
