/* ===================== PAGE: pictures and tabs ===================== */
const { C } = DRILL;
const done = S.done;
const el = (tag, a, p) => DRILL.el(tag, a, p);
const AB = [{ v: 'A', label: 'A' }, { v: 'B', label: 'B' }];
const tag = (A, x, y, s) => A.tx(A.svg, x, y, s, { 'font-size': 20, fill: C.muted });
// A small thermometer reading under a card.
const reading = (A, x, y, t, col) => A.tx(A.svg, x, y, '🌡️ ' + String(t).replace('-', '−') + ' °C', { 'font-size': 18, fill: col || C.text });

/* 7-3-01 °C and K */
const T_K = {
  id: 'kelvin', code: '7-3-01', name: '°C ↔ K', sec: 1, q: it => it.form === 'toK' ? 'Change to kelvin' : 'Change to degrees Celsius', kind: 'slots',
  gen: MODEL.genK, typeOf: it => it.form + (it.c < 0 ? '-neg' : ''),
  prompt: it => it.form === 'toK' ? String(it.c).replace('-', '−') + ' °C' : it.k + ' K',
  slots: it => ['=', { k: 'v', label: it.form === 'toK' ? 'kelvin' : 'degrees Celsius', wide: true }, it.form === 'toK' ? 'K' : '°C'],
  check: MODEL.checkK, answer: it => ({ v: Q.q(it.v) }),
  draw(A, it, V) {
    const fin = done(V), Y = c => 372 - (c + 273) * (320 / 473), xc = 210, xk = 430;
    [[xc, '°C'], [xk, 'K']].forEach(([x, u]) => {
      el('line', { x1: x, x2: x, y1: Y(-273) + 6, y2: Y(200) - 6, stroke: C.axis, 'stroke-width': 3 }, A.svg);
      A.tx(A.svg, x, 26, u === 'K' ? 'Kelvin' : 'Celsius', { 'font-size': 16, fill: C.muted });
    });
    [-273, -200, -100, 0, 100, 200].forEach(c => {
      const y = Y(c);
      el('line', { x1: xc - 8, x2: xc + 8, y1: y, y2: y, stroke: C.axis, 'stroke-width': 2 }, A.svg);
      el('line', { x1: xk - 8, x2: xk + 8, y1: y, y2: y, stroke: C.axis, 'stroke-width': 2 }, A.svg);
      A.tx(A.svg, xc - 16, y, String(c).replace('-', '−'), { 'font-size': 14, fill: C.tick, 'text-anchor': 'end' });
      A.tx(A.svg, xk + 16, y, String(c + 273), { 'font-size': 14, fill: C.tick, 'text-anchor': 'start' });
    });
    [[100, 'water boils'], [0, 'water freezes'], [-273, 'absolute zero']].forEach(([c, s]) => A.tx(A.svg, xk + 64, Y(c), s, { 'font-size': 13, fill: C.muted, 'text-anchor': 'start' }));
    const y = Y(it.c), giveX = it.form === 'toK' ? xc : xk, askX = it.form === 'toK' ? xk : xc;
    el('circle', { cx: giveX, cy: y, r: 9, fill: C.yellow }, A.svg);
    el('circle', { cx: askX, cy: y, r: 9, fill: fin ? C.green : 'none', stroke: fin ? C.green : C.yellow, 'stroke-width': 3 }, A.svg);
    if (V.phase === 'ask') return;
    el('line', { x1: xc + 14, x2: xk - 14, y1: y, y2: y, stroke: fin ? C.green : C.gold, 'stroke-width': 3, 'stroke-dasharray': fin ? null : '6 6', class: 'fade' }, A.svg);
    S.chip(A.svg, (xc + xk) / 2, y - 22, it.form === 'toK' ? '+ 273' : '− 273', C.gold, { cls: 'pop', fs: 17 });
    if (fin) A.tx(A.svg, askX + (askX === xk ? -16 : 16), y + 22, String(it.v).replace('-', '−') + (askX === xk ? ' K' : ' °C'), { 'font-size': 18, fill: C.green, 'text-anchor': askX === xk ? 'end' : 'start', class: 'pop' });
  }
};

/* Particles in a box: n of them, spacing grows with heat; wiggle marks show motion. */
function particles(A, x, y, n, opt) {
  opt = opt || {};
  const cols = Math.ceil(Math.sqrt(n)), gap = opt.gap || 26, r = opt.r || 8, g = el('g', { class: opt.cls || null }, A.svg);
  for (let i = 0; i < n; i++) {
    const cx = x + (i % cols - (cols - 1) / 2) * gap, cy = y + (Math.floor(i / cols) - (Math.ceil(n / cols) - 1) / 2) * gap;
    el('circle', { cx, cy, r, fill: opt.col || C.blue }, g);
    if (opt.wiggle) el('path', { d: `M${cx - r - 3} ${cy - 4}q-4 4 0 8M${cx + r + 3} ${cy - 4}q4 4 0 8`, stroke: C.muted, 'stroke-width': 1.5, fill: 'none' }, g);
  }
  return g;
}

/* 7-3-01 heat vs temperature */
const T_MORE = {
  id: 'more', code: '7-3-01', name: 'Heat or temp?', sec: 2, q: it => it.ask === 'temp' ? 'Higher temperature?' : 'More thermal energy?', kind: 'choice',
  gen: MODEL.genMore, typeOf: it => it.ask + ':' + it.kase,
  choices: () => AB.concat([{ v: 'same', label: 'Same' }]),
  check: MODEL.checkMore, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    [['A', it.A, 165], ['B', it.B, 475]].forEach(([nm, c, x]) => {
      const good = fin && (it.a === nm || it.a === 'same');
      S.card(A.svg, { x, y: 120, w: 250, h: 170, icon: c.o[1], label: c.o[0], size: c.big ? 76 : 44, fs: 19, col: good ? C.green : C.edge, sw: good ? 3 : 2 });
      tag(A, x - 108, 52, nm);
      reading(A, x, 228, c.t);
      if (!fin) return;
      particles(A, x, 320, c.big ? 24 : 6, { gap: c.big ? 22 : 24, r: 6, wiggle: c.t >= 60, cls: 'fade', col: c.t >= 60 ? C.red : C.blue });
      A.tx(A.svg, x, 395, (c.big ? 'many' : 'few') + ' particles · ' + (c.t >= 60 ? 'fast' : 'slower'), { 'font-size': 14, fill: C.muted, class: 'fade' });
    });
    if (fin) A.tx(A.svg, 320, 262, it.ask === 'temp' ? 'temperature = average particle speed' : 'thermal energy = all the particles', { 'font-size': 15, fill: C.gold, class: 'fade' });
  }
};

/* 7-3-01 which way does heat flow */
const T_FLOW = {
  id: 'flow', code: '7-3-01', name: 'Heat flow', sec: 2, q: 'Which way does heat flow?', kind: 'choice',
  gen: MODEL.genFlow, typeOf: it => it.a,
  choices: () => [{ v: 'l', label: '←', math: true, aria: 'left' }, { v: 'r', label: '→', math: true, aria: 'right' }, { v: 'none', label: 'No flow' }],
  check: MODEL.checkFlow, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V);
    [[it.L, 150], [it.R, 490]].forEach(([o, x]) => { S.card(A.svg, { x, y: 170, w: 200, h: 170, icon: o[1], label: o[0], size: 66, fs: 19 }); reading(A, x, 285, o[2]); });
    if (!fin) { A.tx(A.svg, 320, 170, '?', { 'font-size': 48, fill: C.yellow }); return; }
    if (it.a === 'none') { A.tx(A.svg, 320, 170, '=', { 'font-size': 52, fill: C.green, class: 'pop' }); S.chip(A.svg, 320, 360, 'Same temperature: no heat flows', C.green, { cls: 'pop', fs: 18 }); return; }
    const r = it.a === 'r';
    S.arrow(A.svg, r ? 258 : 382, 170, r ? 382 : 258, 170, C.green, 'N', { 'stroke-width': 6, class: 'draw', pathLength: 1 });
    A.tx(A.svg, 320, 140, 'heat', { 'font-size': 18, fill: C.green, class: 'fade' });
    S.chip(A.svg, 320, 360, 'Heat flows from hot to cold', C.green, { cls: 'pop', fs: 18 });
  }
};

/* 7-3-02 the particle model */
const T_PART = {
  id: 'particles', code: '7-3-02', name: 'Particles', sec: 3, q: it => it.form === 'scen' ? 'Expands or contracts?' : 'Its particles…', kind: 'choice',
  gen: MODEL.genPart, typeOf: it => it.form + ':' + it.a,
  choices: it => it.form === 'scen' ? [{ v: 'exp', label: 'Expands' }, { v: 'con', label: 'Contracts' }]
    : [{ v: 'apart', label: 'Move faster, spread apart' }, { v: 'closer', label: 'Slow down, move closer' }, { v: it.hot ? 'bigger' : 'smaller', label: it.hot ? 'Get bigger' : 'Get smaller' }],
  check: MODEL.checkPart, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), hot = it.hot;
    S.card(A.svg, { x: 320, y: 62, w: 520, h: 84, label: it.form === 'scen' ? it.t : hot ? 'A solid is heated' : 'A solid is cooled', fs: 21, n: 40, lb: 30, col: C.yellow, sw: 3 });
    const box = (x, lab) => { el('rect', { x: x - 100, y: 150, width: 200, height: 200, rx: 14, fill: C.panel, stroke: C.edge, 'stroke-width': 2 }, A.svg); A.tx(A.svg, x, 372, lab, { 'font-size': 15, fill: C.muted }); };
    box(170, 'before'); box(470, 'after');
    particles(A, 170, 250, 16, { gap: 34, r: 10, wiggle: true });
    const showHeat = fin || it.form === 'why';
    S.arrow(A.svg, 285, 250, 355, 250, C.text, 'W', { 'stroke-width': 3 });
    A.tx(A.svg, 320, 226, showHeat ? (hot ? '+ heat' : '− heat') : '?', { 'font-size': 17, fill: showHeat ? (hot ? C.red : C.blue) : C.yellow });
    if (!fin) { A.tx(A.svg, 470, 250, '?', { 'font-size': 44, fill: C.yellow }); return; }
    particles(A, 470, 250, 16, { gap: hot ? 44 : 27, r: 10, wiggle: true, cls: 'fade', col: hot ? C.red : C.blue });
    S.chip(A.svg, 320, 405, hot ? 'Faster, farther apart: expands' : 'Slower, closer together: contracts', C.green, { cls: 'pop', fs: 16 });
  }
};

/* 7-3-03 conduction, convection, radiation */
const T_MODE = S.classTab({
  id: 'mode', code: '7-3-03', name: 'Transfer', sec: 4, q: 'How does the heat move?', bank: MODEL.MODE, cues: MODEL.MODE_CUE,
  cats: [{ v: 'cond', label: 'Conduction', means: 'direct contact, particle to particle' }, { v: 'conv', label: 'Convection', means: 'a moving liquid or gas' },
    { v: 'rad', label: 'Radiation', means: 'waves; no matter needed' }]
});

/* 7-3-03 conductors, insulators; metal feels colder */
const COND_Q = { conductor: 'Better conductor?', insulator: 'Better insulator?', colder: 'Which one is colder?', faster: 'Takes heat from your hand faster?' };
const T_COND = {
  id: 'cond', code: '7-3-03', name: 'Conductors', sec: 4, q: it => COND_Q[it.ask], kind: 'choice',
  gen: MODEL.genCond, typeOf: it => it.ask,
  choices: () => AB.concat([{ v: 'same', label: 'Same' }]),
  check: MODEL.checkCond, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), hand = it.ask === 'colder' || it.ask === 'faster';
    [['A', it.A, 165, it.metalLeft], ['B', it.B, 475, !it.metalLeft]].forEach(([nm, o, x, metal]) => {
      const good = fin && (it.a === nm || it.a === 'same');
      S.card(A.svg, { x, y: 210, w: 230, h: 150, icon: o[1], label: o[0], size: 56, fs: 19, col: good ? C.green : C.edge, sw: good ? 3 : 2 });
      tag(A, x - 98, 152, nm);
      reading(A, x, 310, 21);
      if (hand) S.emo(A.svg, x, 70, '🖐️', 44);
      if (!fin) return;
      if (hand) S.arrow(A.svg, x, 98, x, 128, C.red, 'R', { 'stroke-width': metal ? 9 : 2.5, class: 'fade' });
      A.tx(A.svg, x, 350, metal ? 'conductor: heat moves fast' : 'insulator: heat moves slowly', { 'font-size': 15, fill: C.gold, class: 'fade' });
    });
    if (fin && it.ask === 'colder') S.chip(A.svg, 320, 395, 'Same temperature; metal pulls heat faster', C.green, { cls: 'pop', fs: 16 });
  }
};

/* 7-3-04 specific heat */
const T_SPEC = {
  id: 'spec', code: '7-3-04', name: 'Heats faster?', sec: 5, q: it => MODEL.SPEC[it.s].q, kind: 'choice',
  gen: MODEL.genSpec, typeOf: it => String(it.s),
  choices: it => { const s = MODEL.SPEC[it.s], L = it.loLeft ? s.lo : s.hi, R = it.loLeft ? s.hi : s.lo; return [{ v: 'A', label: L[0] }, { v: 'B', label: R[0] }]; },
  check: MODEL.checkSpec, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const s = MODEL.SPEC[it.s], fin = done(V);
    S.emo(A.svg, 320, 44, s.heat ? '☀️' : '🌙', 40);
    [[it.loLeft ? s.lo : s.hi, 165, it.loLeft], [it.loLeft ? s.hi : s.lo, 475, !it.loLeft]].forEach(([o, x, lo], k) => {
      const good = fin && lo;
      S.card(A.svg, { x, y: 160, w: 240, h: 160, icon: o[1], label: o[0], size: 60, fs: 18, col: good ? C.green : C.edge, sw: good ? 3 : 2 });
      tag(A, x - 102, 98, k ? 'B' : 'A');
      el('rect', { x: x - 80, y: 280, width: 160, height: 22, rx: 11, fill: C.panel, stroke: C.edge, 'stroke-width': 2 }, A.svg);
      const bar = el('rect', { x: x - 78, y: 282, width: 0, height: 18, rx: 9, fill: s.heat ? C.red : C.blue }, A.svg);
      if (!fin) return;
      const W = lo ? 150 : 40;
      A.tween(700, t => bar.setAttribute('width', W * t));
      A.tx(A.svg, x, 330, (s.heat ? 'warms ' : 'cools ') + (lo ? 'fast' : 'slowly'), { 'font-size': 16, fill: lo ? C.green : C.muted, class: 'fade' });
      A.tx(A.svg, x, 356, lo ? 'low specific heat' : 'high specific heat', { 'font-size': 14, fill: C.muted, class: 'fade' });
    });
    if (fin) A.tx(A.svg, 320, 400, 'Water takes a lot of energy to change temperature', { 'font-size': 15, fill: C.gold, class: 'fade' });
  }
};

/* 7-3-05 insulation */
const T_INS = {
  id: 'ins', code: '7-3-05', name: 'Insulation', sec: 6, q: it => it.form === 'rate' ? 'With insulation, it changes…' : MODEL.INS[it.k].t, kind: 'choice',
  gen: MODEL.genIns, typeOf: it => String(it.k),
  choices: it => { const x = MODEL.INS[it.k]; if (it.form === 'rate') return [{ v: 'slower', label: 'Slower' }, { v: 'faster', label: 'Faster' }, { v: 'same', label: 'Same' }];
    const L = it.swap ? x.B : x.A, R = it.swap ? x.A : x.B; return [{ v: 'A', label: L[0] }, { v: 'B', label: R[0] }]; },
  check: MODEL.checkIns, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const x = MODEL.INS[it.k], fin = done(V);
    if (it.form === 'rate') {
      if (!x.bare) { el('rect', { x: 200, y: 110, width: 240, height: 200, rx: 26, fill: 'none', stroke: '#c7a76a', 'stroke-width': 18, 'stroke-dasharray': '4 6' }, A.svg); A.tx(A.svg, 320, 92, 'insulation', { 'font-size': 14, fill: '#c7a76a' }); }
      else A.tx(A.svg, 320, 92, 'no insulation', { 'font-size': 14, fill: C.muted });
      S.card(A.svg, { x: 320, y: 210, w: 190, h: 160, icon: x.i, label: '', size: 70, col: C.yellow, sw: 3 });
      S.lines(A.svg, 320, 365, x.t, 44, { 'font-size': 19, fill: C.text });
      if (!fin) return;
      [[110, 140], [110, 280], [530, 140], [530, 280]].forEach(([px, py]) => {
        const inward = !x.hot, x1 = px < 320 ? (inward ? 70 : 205) : (inward ? 570 : 435), x2 = px < 320 ? (inward ? 180 : 95) : (inward ? 460 : 545);
        S.arrow(A.svg, x1, py, x2, py, C.red, 'R', { 'stroke-width': x.bare ? 8 : 2.5, class: 'fade' });
      });
      A.tx(A.svg, 90, 210, x.hot ? 'heat out' : 'heat in', { 'font-size': 15, fill: C.red, class: 'fade' });
      S.chip(A.svg, 320, 405, x.bare ? 'Faster: nothing slows the heat now' : 'Slower: insulation slows heat both ways', C.green, { cls: 'pop', fs: 15 });
      return;
    }
    const L = it.swap ? x.B : x.A, R = it.swap ? x.A : x.B;
    [[L, 165, 'A'], [R, 475, 'B']].forEach(([o, cx, nm]) => {
      const more = o[2] === 1, good = fin && more;
      if (more) el('rect', { x: cx - 128, y: 72, width: 256, height: 196, rx: 26, fill: 'none', stroke: '#c7a76a', 'stroke-width': 14, 'stroke-dasharray': '4 6' }, A.svg);
      S.card(A.svg, { x: cx, y: 170, w: 210, h: 160, icon: o[1], label: o[0], size: 54, fs: 17, n: 18, col: good ? C.green : C.edge, sw: good ? 3 : 2 });
      tag(A, cx - 112, 52, nm);
      if (!fin) return;
      S.arrow(A.svg, cx, 290, cx, 350, C.red, 'R', { 'stroke-width': more ? 2.5 : 9, class: 'fade' });
      A.tx(A.svg, cx, 378, more ? 'heat escapes slowly' : 'heat escapes fast', { 'font-size': 15, fill: more ? C.green : C.muted, class: 'fade' });
    });
  }
};

const PAGE = {
  key: 'sci7-heat-temperature-trainer-v1', course: 'Science 7 · Heat and Temperature', title: 'Heat Trainer',
  notes: 'sci7-heat-temperature-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_K, T_MORE, T_FLOW, T_PART, T_MODE, T_COND, T_SPEC, T_INS]
};
DRILL.boot(PAGE);
