/* ===================== PAGE: pictures and tabs ===================== */
const { C } = DRILL;
const done = S.done;
const el = (tag, a, p) => DRILL.el(tag, a, p);
const AB = [{ v: 'A', label: 'A' }, { v: 'B', label: 'B' }];

/* 7-4-01 structure type */
const T_TYPE = S.classTab({
  id: 'type', code: '7-4-01', name: 'Type', sec: 1, q: 'What type of structure?', bank: MODEL.TYPE, cues: MODEL.TYPE_CUE,
  cats: [{ v: 'solid', label: 'Solid', means: 'solid all the way through' }, { v: 'frame', label: 'Frame', means: 'connected parts with open spaces' },
    { v: 'shell', label: 'Shell', means: 'a thin curved surface' }]
});

/* 7-4-02 load type */
const T_LOAD = S.classTab({
  id: 'load', code: '7-4-02', name: 'Load', sec: 2, q: 'What kind of load?', bank: MODEL.LOAD, cues: MODEL.LOAD_CUE,
  cats: [{ v: 'dead', label: 'Dead', means: "the structure's own weight" }, { v: 'live', label: 'Live', means: 'what it holds; comes and goes' },
    { v: 'dyn', label: 'Dynamic', means: 'sudden or changing, any direction' }]
});

/* Force arrows on a bar centred at (x, y) */
function forceBar(A, x, y, f, col, cls) {
  const w = 240, h = 54, g = el('g', { class: cls || null }, A.svg), k = col === C.green ? 'N' : 'Y';
  el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 6, fill: '#1d2a3b', stroke: '#8d9bb0', 'stroke-width': 2 }, g);
  const ar = (x1, y1, x2, y2) => S.arrow(g, x1, y1, x2, y2, col, k, { 'stroke-width': 5 });
  if (f === 'comp') { ar(x - w / 2 - 70, y, x - w / 2 - 8, y); ar(x + w / 2 + 70, y, x + w / 2 + 8, y); }
  if (f === 'tens') { ar(x - w / 2 - 6, y, x - w / 2 - 70, y); ar(x + w / 2 + 6, y, x + w / 2 + 70, y); }
  if (f === 'shear') { ar(x - 90, y - h / 2 - 16, x + 40, y - h / 2 - 16); ar(x + 90, y + h / 2 + 16, x - 40, y + h / 2 + 16); el('line', { x1: x - 30, x2: x + 30, y1: y - 8, y2: y + 8, stroke: '#8d9bb0', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, g); }
  if (f === 'tors') [[-1, 1], [1, -1]].forEach(([s, d]) => {
    const cx = x + s * (w / 2 + 26);
    S.curve(g, `M${cx - 12} ${y + 34}A14 34 0 1 ${d > 0 ? 1 : 0} ${cx + 12} ${y - 34}`, col, k, { 'stroke-width': 4 });
  });
  return g;
}

/* 7-4-02 internal forces */
const T_FORCE = {
  id: 'force', code: '7-4-02', name: 'Forces', sec: 3, q: it => it.form === 'arrows' ? 'Which internal force?' : 'Which force is acting?', kind: 'choice', cols: 2,
  gen: MODEL.genForce, typeOf: it => it.form + ':' + it.a,
  choices: () => MODEL.FORCES.map(f => ({ v: f, label: MODEL.FORCE_NAME[f] })),
  check: MODEL.checkForce, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    if (it.form === 'arrows') { forceBar(A, 320, 200, it.a, fin ? C.green : C.yellow); if (fin) S.chip(A.svg, 320, 350, MODEL.FORCE_NAME[it.a], C.green, { cls: 'pop', fs: 22 }); return; }
    S.card(A.svg, { x: 320, y: 110, w: 330, h: 170, icon: it.i, label: it.t, size: 64, fs: 21, n: 26, col: fin ? C.green : C.yellow, sw: 3 });
    if (fin) { forceBar(A, 320, 300, it.a, C.green, 'fade'); A.tx(A.svg, 320, 395, MODEL.FORCE_NAME[it.a], { 'font-size': 20, fill: C.green, class: 'fade' }); }
  }
};

/* 7-4-02 the loaded beam */
const BEAM_Q = { squeezed: 'Which side is squeezed?', stretched: 'Which side is stretched?', crack: 'Where does a crack start?', rebar: 'Where should steel rebar go?' };
const T_BEAM = {
  id: 'beam', code: '7-4-02', name: 'Beam', sec: 3, q: it => BEAM_Q[it.form], kind: 'choice',
  gen: MODEL.genBeam, typeOf: it => it.form,
  choices: () => [{ v: 'top', label: 'Top' }, { v: 'bottom', label: 'Bottom' }],
  check: MODEL.checkBeam, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), x0 = 100, x1 = 540, y = 230, lx = 320 + it.off;
    A.tx(A.svg, 320, 40, it.beam, { 'font-size': 20, fill: C.muted });
    [x0 + 30, x1 - 30].forEach(x => el('path', { d: `M${x} ${y + 20}l-22 38h44z`, fill: '#3a4658', stroke: C.axis, 'stroke-width': 2 }, A.svg));
    const sag = fin ? 22 : 0, top = `M${x0} ${y - 15}Q${lx} ${y - 15 + sag * 2} ${x1} ${y - 15}`, bot = `M${x1} ${y + 15}Q${lx} ${y + 15 + sag * 2} ${x0} ${y + 15}`;
    el('path', { d: top + 'L' + x1 + ' ' + (y + 15) + bot.slice(bot.indexOf('Q') - 0).replace(/^/, '') + 'Z', fill: it.beam === 'Concrete beam' ? '#4a4f58' : it.beam === 'Steel beam' ? '#5a6878' : '#7a5a33', stroke: C.axis, 'stroke-width': 2 }, A.svg);
    S.emo(A.svg, lx, y - 64 + sag, '📦', 46);
    S.arrow(A.svg, lx, y - 118, lx, y - 92, C.text, 'W', { 'stroke-width': 3 });
    A.tx(A.svg, lx + 50, y - 112, 'load', { 'font-size': 15, fill: C.muted, 'text-anchor': 'start' });
    if (!fin) { A.tx(A.svg, x1 + 34, y - 15, 'top', { 'font-size': 15, fill: C.muted, 'text-anchor': 'start' }); A.tx(A.svg, x1 + 34, y + 15, 'bottom', { 'font-size': 15, fill: C.muted, 'text-anchor': 'start' }); return; }
    const ty = y - 15 + sag * 1.05 - 18, by = y + 15 + sag * 1.05 + 18;
    S.arrow(A.svg, lx - 120, ty, lx - 40, ty, C.gold, 'G', { 'stroke-width': 3, class: 'fade' }); S.arrow(A.svg, lx + 120, ty, lx + 40, ty, C.gold, 'G', { 'stroke-width': 3, class: 'fade' });
    S.arrow(A.svg, lx - 40, by, lx - 120, by, C.teal, 'B', { 'stroke-width': 3, class: 'fade' }); S.arrow(A.svg, lx + 40, by, lx + 120, by, C.teal, 'B', { 'stroke-width': 3, class: 'fade' });
    A.tx(A.svg, 320, 330, 'top: squeezed (compression)', { 'font-size': 17, fill: C.gold, class: 'fade' });
    A.tx(A.svg, 320, 358, 'bottom: stretched (tension)', { 'font-size': 17, fill: C.teal, class: 'fade' });
    if (it.form === 'crack') el('path', { d: `M${lx - 4} ${y + 15 + sag * 2 - 2}l6 -8l-6 -6l5 -7`, stroke: C.red, 'stroke-width': 3, fill: 'none', class: 'pop' }, A.svg);
    if (it.form === 'rebar') el('line', { x1: x0 + 10, x2: x1 - 10, y1: y + 8 + sag, y2: y + 8 + sag, stroke: C.yellow, 'stroke-width': 4, 'stroke-dasharray': '10 5', class: 'fade' }, A.svg);
    if (it.form === 'crack' || it.form === 'rebar') A.tx(A.svg, 320, 392, it.form === 'crack' ? 'concrete is weak when stretched' : 'steel carries the tension', { 'font-size': 15, fill: C.muted, class: 'fade' });
  }
};

/* 7-4-03 stability */
function block(A, x, s, col, fin) {
  const gy = 352, pts = [[x - s.b / 2, gy], [x + s.b / 2, gy], [x + s.t / 2, gy - s.H], [x - s.t / 2, gy - s.H]];
  el('polygon', { points: pts.map(p => p.join(',')).join(' '), fill: '#1d2a3b', stroke: col, 'stroke-width': col === C.edge ? 2 : 3 }, A.svg);
  const cy = gy - s.hc;
  el('circle', { cx: x, cy, r: 9, fill: C.yellow, stroke: C.stage, 'stroke-width': 2 }, A.svg);
  A.tx(A.svg, x + 16, cy, 'CoG', { 'font-size': 13, fill: C.yellow, 'text-anchor': 'start' });
  el('line', { x1: x - s.b / 2, x2: x + s.b / 2, y1: gy + 7, y2: gy + 7, stroke: C.teal, 'stroke-width': 4 }, A.svg);
  if (!fin) return;
  el('line', { x1: x, y1: cy, x2: x, y2: gy, stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '5 5', class: 'fade' }, A.svg);
  el('line', { x1: x, y1: cy, x2: x + s.b / 2, y2: gy, stroke: C.gold, 'stroke-width': 2.5, class: 'fade' }, A.svg);
  A.tx(A.svg, x, 384, 'tips after ' + Math.round(s.ang) + '°', { 'font-size': 16, fill: col === C.green ? C.green : C.muted, class: 'fade' });
}
const T_STABLE = {
  id: 'stable', code: '7-4-03', name: 'Stable?', sec: 4, q: 'Which is more stable?', kind: 'choice',
  gen: MODEL.genStable, typeOf: it => it.A.kind + '-' + it.B.kind,
  choices: () => AB, check: MODEL.checkStable, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    el('line', { x1: 20, x2: 620, y1: 352, y2: 352, stroke: C.axis, 'stroke-width': 2 }, A.svg);
    [['A', it.A, 170], ['B', it.B, 470]].forEach(([nm, s, x]) => { block(A, x, s, fin && it.a === nm ? C.green : C.edge, fin); A.tx(A.svg, x - 120, 40, nm, { 'font-size': 22, fill: C.muted }); });
    A.tx(A.svg, 320, 410, fin ? 'Lower CoG and wider base: more stable' : 'teal = base of support', { 'font-size': 14, fill: fin ? C.gold : C.muted });
  }
};

/* Lever: bar, fulcrum, load and effort placed in order. pos: {F, L, E} as x; effort arrow up or down. */
function lever(A, y, pos, effUp, opt) {
  opt = opt || {};
  const g = el('g', { class: opt.cls || null }, A.svg);
  el('rect', { x: 80, y: y - 7, width: 480, height: 14, rx: 7, fill: '#7a5a33', stroke: C.axis, 'stroke-width': 1.5 }, g);
  el('path', { d: `M${pos.F} ${y + 7}l-24 40h48z`, fill: '#3a4658', stroke: C.axis, 'stroke-width': 2 }, g);
  el('rect', { x: pos.L - 30, y: y - 57, width: 60, height: 50, rx: 6, fill: '#3b2f1f', stroke: C.gold, 'stroke-width': 2 }, g);
  DRILL.tx(g, pos.L, y - 32, opt.loadText || 'Load', { 'font-size': 14, fill: C.gold });
  if (effUp) S.arrow(g, pos.E, y + 70, pos.E, y + 12, C.blue, 'L', { 'stroke-width': 5 }); else S.arrow(g, pos.E, y - 80, pos.E, y - 12, C.blue, 'L', { 'stroke-width': 5 });
  DRILL.tx(g, pos.E + 14, effUp ? y + 60 : y - 72, opt.effText || 'Effort', { 'font-size': 14, fill: C.blue, 'text-anchor': 'start' });
  DRILL.tx(g, pos.F, y + 64, 'Fulcrum', { 'font-size': 14, fill: C.muted });
  return g;
}
function leverPos(cls, flip, d) {
  const ends = [110, 530], mid = 320 + ((d || 0) - 1) * 40, [a, b] = flip ? [ends[1], ends[0]] : ends;
  if (cls === 1) return { F: mid, L: a, E: b, up: false };
  if (cls === 2) return { F: a, L: mid, E: b, up: true };
  return { F: a, E: mid, L: b, up: true };
}

/* 7-4-04 lever class */
const T_LEVER = {
  id: 'lever', code: '7-4-04', name: 'Lever class', sec: 5, q: 'Which class of lever?', kind: 'choice', cols: 3,
  gen: MODEL.genLever, typeOf: it => it.form + ':' + it.a,
  choices: () => [{ v: '1', label: '1st' }, { v: '2', label: '2nd' }, { v: '3', label: '3rd' }],
  check: MODEL.checkLever, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), p = leverPos(it.cls, it.flip, it.d), y = it.form === 'example' ? 300 : 220;
    if (it.form === 'example') S.card(A.svg, { x: 320, y: 92, w: 260, h: 150, icon: it.i, label: it.t, size: 60, fs: 21, col: fin ? C.green : C.yellow, sw: 3 });
    if (it.form === 'diagram' || fin) lever(A, y, p, p.up, { cls: it.form === 'example' ? 'fade' : null });
    if (!fin) return;
    const midX = it.cls === 1 ? p.F : it.cls === 2 ? p.L : p.E;
    el('circle', { cx: midX, cy: y - 10, r: 46, fill: 'none', stroke: C.green, 'stroke-width': 3, class: 'pop' }, A.svg);
    S.chip(A.svg, 320, it.form === 'example' ? 404 : 360, ['', 'Fulcrum in the middle: 1st class', 'Load in the middle: 2nd class', 'Effort in the middle: 3rd class'][it.cls], C.green, { cls: 'pop', fs: 16 });
  }
};

/* 7-4-04 mechanical advantage. The fulcrum sits where effort arm ÷ load arm = MA, so the picture is true. */
const T_MA = {
  id: 'ma', code: '7-4-04', name: 'MA', sec: 5, q: 'Mechanical advantage', kind: 'slots',
  gen: MODEL.genMA, typeOf: it => it.small ? 'below-1' : 'above-1',
  prompt: it => 'Load ' + it.L + ' N, effort ' + it.E + ' N',
  slots: () => ['MA =', { k: 'v', label: 'mechanical advantage' }],
  check: MODEL.checkMA, answer: it => ({ v: it.v }),
  draw(A, it, V) {
    const fin = done(V), ma = it.L / it.E, a = 420 / (ma + 1), F = 110 + a;
    lever(A, 230, { F, L: 110, E: 530 }, false, { loadText: it.L + ' N', effText: it.E + ' N' });
    if (V.phase === 'ask') return;
    el('line', { x1: 110, x2: F, y1: 318, y2: 318, stroke: C.gold, 'stroke-width': 3, class: 'fade' }, A.svg);
    el('line', { x1: F, x2: 530, y1: 318, y2: 318, stroke: C.blue, 'stroke-width': 3, class: 'fade' }, A.svg);
    A.tx(A.svg, (110 + F) / 2, 336, 'load arm', { 'font-size': 13, fill: C.gold, class: 'fade' }); A.tx(A.svg, (F + 530) / 2, 336, 'effort arm', { 'font-size': 13, fill: C.blue, class: 'fade' });
    A.tx(A.svg, 320, 374, 'MA = load ÷ effort = ' + it.L + ' ÷ ' + it.E + (fin ? ' = ' + Q.str(it.v).replace('1/2', '½').replace('1/4', '¼') : ''), { 'font-size': 20, fill: fin ? C.green : C.text, class: 'fade' });
    if (fin) A.tx(A.svg, 320, 404, ma >= 1 ? 'less force, but the effort moves ' + ma + '× farther' : 'more force, but the load moves farther and faster', { 'font-size': 15, fill: C.muted, class: 'fade' });
  }
};

/* 7-4-04 name the simple machine; afterwards a small diagram of that machine */
function machGlyph(A, k, x, y, col) {
  const g = el('g', { class: 'fade', stroke: col, 'stroke-width': 3, fill: 'none' }, A.svg);
  if (k === 'lever') { el('line', { x1: x - 70, y1: y - 10, x2: x + 70, y2: y + 4 }, g); el('path', { d: `M${x - 10} ${y - 2}l-16 28h32z` }, g); }
  if (k === 'wheel') { el('circle', { cx: x, cy: y, r: 36 }, g); el('circle', { cx: x, cy: y, r: 9, fill: col }, g); }
  if (k === 'pulley') { el('circle', { cx: x, cy: y - 14, r: 22 }, g); el('path', { d: `M${x - 22} ${y - 14}v52M${x + 22} ${y - 14}v40` }, g); el('rect', { x: x + 10, y: y + 26, width: 24, height: 18 }, g); }
  if (k === 'incline') el('path', { d: `M${x - 70} ${y + 30}h140v-60z` }, g);
  if (k === 'wedge') el('path', { d: `M${x - 26} ${y - 34}h52l-26 70z` }, g);
  if (k === 'screw') { el('rect', { x: x - 16, y: y - 36, width: 32, height: 72 }, g); for (let i = 0; i < 5; i++) el('line', { x1: x - 16, y1: y - 30 + i * 14, x2: x + 16, y2: y - 22 + i * 14 }, g); }
  return g;
}
const T_MACH = {
  id: 'machine', code: '7-4-04', name: 'Machines', sec: 5, q: 'Which simple machine?', kind: 'choice', cols: 2,
  gen: MODEL.genMach, typeOf: it => it.a,
  choices: it => it.opts.map(k => ({ v: k, label: MODEL.MACH_NAME[k] })),
  check: MODEL.checkMach, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    S.card(A.svg, { x: 320, y: 130, w: 300, h: 190, icon: it.i, label: it.t, size: 80, fs: 22, col: fin ? C.green : C.yellow, sw: 3 });
    if (!fin) return;
    machGlyph(A, it.a, 250, 320, C.green);
    A.tx(A.svg, 340, 320, MODEL.MACH_NAME[it.a], { 'font-size': 22, fill: C.green, 'text-anchor': 'start', class: 'fade' });
  }
};

const PAGE = {
  key: 'sci7-structures-forces-trainer-v1', course: 'Science 7 · Structures and Forces', title: 'Structures Trainer',
  notes: 'sci7-structures-forces-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_TYPE, T_LOAD, T_FORCE, T_BEAM, T_STABLE, T_LEVER, T_MA, T_MACH]
};
DRILL.boot(PAGE);
