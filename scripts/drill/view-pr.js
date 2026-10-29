
/* ===================== PAGE: pictures and tabs ===================== */
const { C, qHTML } = DRILL;
const done = V => V.phase === 'right' || V.phase === 'show';
const lab = (A, x, y, s, col, a) => A.mtx(A.svg, x, y, s, Object.assign({ 'font-size': 20, fill: col || C.text }, a || {}));
const CC = { red: C.red, blue: C.blue, green: C.green };
const word = (c, s) => '<span style="color:' + (CC[c] || 'inherit') + ';font-family:inherit;font-weight:700">' + (s || c) + '</span>';
// A bag of marbles centred at cx. list = colour names. ring(i) marks a marble.
function bag(A, cx, cy, list, o) {
  o = o || {}; const per = 4, rows = Math.ceil(list.length / per), w = 4 * 40 + 40, h = rows * 40 + 50;
  A.el('path', { d: 'M' + (cx - w / 2) + ' ' + (cy - h / 2 + 20) + 'Q' + (cx - w / 2 - 14) + ' ' + (cy + h / 2) + ' ' + cx + ' ' + (cy + h / 2) + 'Q' + (cx + w / 2 + 14) + ' ' + (cy + h / 2) + ' ' + (cx + w / 2) + ' ' + (cy - h / 2 + 20), fill: C.panel, stroke: C.muted, 'stroke-width': 2 }, A.svg);
  A.el('path', { d: 'M' + (cx - w / 2 + 6) + ' ' + (cy - h / 2 + 18) + 'Q' + cx + ' ' + (cy - h / 2) + ' ' + (cx + w / 2 - 6) + ' ' + (cy - h / 2 + 18), stroke: C.muted, 'stroke-width': 2, fill: 'none' }, A.svg);
  list.forEach((c, i) => {
    const x = cx - (Math.min(per, list.length - Math.floor(i / per) * per) - 1) * 20 + (i % per) * 40, y = cy - h / 2 + 48 + Math.floor(i / per) * 40;
    const gone = o.gone && o.gone.includes(i);
    A.el('circle', { cx: x, cy: y, r: 15, fill: CC[c], 'fill-opacity': gone ? .12 : .85, stroke: gone ? CC[c] : C.stage, 'stroke-width': 2, 'stroke-dasharray': gone ? '4 4' : null }, A.svg);
    if (o.ring && o.ring(c, i)) A.el('circle', { cx: x, cy: y, r: 20, fill: 'none', stroke: C.yellow, 'stroke-width': 3, class: 'pop' }, A.svg);
  });
}
const bagList = counts => ['red', 'blue', 'green'].flatMap(c => Array(counts[c] || 0).fill(c));
const valSlot = () => ['=', { k: 'v', label: 'probability', wide: true }];

/* PR1 probability */
const T_PROB = {
  id: 'prob', code: 'PR1', name: 'Probability', sec: 1, q: 'Find the probability', kind: 'slots',
  gen: MODEL.genProb, prompt: it => 'P(' + (it.type === 'bag' ? word(it.ask) : '<span style="font-family:inherit;font-weight:700">' + it.ev + '</span>') + ')',
  slots: valSlot, check: MODEL.checkProb, answer: it => ({ v: it.v }),
  draw(A, it, V) {
    const hint = V.phase !== 'ask';
    if (it.type === 'bag') bag(A, 320, 190, bagList(it.counts), { ring: hint ? c => c === it.ask : null });
    else for (let k = 1; k <= 6; k++) { const x = 320 + (k - 3.5) * 80, fav = it.fav.includes(k); A.el('rect', { x: x - 30, y: 150, width: 60, height: 60, rx: 10, fill: C.panel, stroke: hint && fav ? C.yellow : C.muted, 'stroke-width': hint && fav ? 4 : 2 }, A.svg); lab(A, x, 181, String(k), C.text, { 'font-size': 28 }); }
    if (hint) lab(A, 320, 330, (it.type === 'bag' ? it.counts[it.ask] : it.fav.length) + ' favourable out of ' + it.n, C.muted, { class: 'fade' });
    if (done(V)) lab(A, 320, 372, 'P = ' + Q.str(it.v), C.green, { 'font-size': 26, class: 'fade' });
  }
};

/* PR1 complement */
const T_NOT = {
  id: 'not', code: 'PR1', name: 'Not', sec: 1, q: 'P(not A)', kind: 'slots',
  gen: MODEL.genNot, prompt: it => 'P(A) = ' + (it.form === 'dec' ? String(Q.val(it.p)) : qHTML(it.p)),
  slots: valSlot, check: MODEL.checkNot, answer: it => ({ v: it.form === 'dec' ? String(Q.val(it.v)) : it.v }),
  draw(A, it, V) {
    const x0 = 60, W = 520, p = Q.val(it.p), y = 180;
    A.el('rect', { x: x0, y, width: W * p, height: 60, fill: C.blue, 'fill-opacity': .35, stroke: C.blue, 'stroke-width': 2 }, A.svg);
    A.el('rect', { x: x0 + W * p, y, width: W * (1 - p), height: 60, fill: V.phase !== 'ask' ? C.gold : C.stage, 'fill-opacity': .3, stroke: C.gold, 'stroke-width': 2 }, A.svg);
    lab(A, x0 + W * p / 2, y + 31, 'A', C.blue); lab(A, x0 + W * p + W * (1 - p) / 2, y + 31, 'not A', C.gold);
    lab(A, x0, y + 90, '0', C.muted); lab(A, x0 + W, y + 90, '1', C.muted);
    lab(A, x0 + W * p / 2, y - 26, it.form === 'dec' ? String(p) : Q.str(it.p), C.blue);
    lab(A, x0 + W * p + W * (1 - p) / 2, y - 26, done(V) ? (it.form === 'dec' ? String(Q.val(it.v)) : Q.str(it.v)) : '?', done(V) ? C.green : C.gold);
    if (V.phase !== 'ask') lab(A, 320, 360, 'the two parts make 1 whole', C.muted, { class: 'fade' });
  }
};

/* PR1 expected count */
const T_EXP = {
  id: 'exp', code: 'PR1', name: 'Expected', sec: 1, q: 'Expected count in the long run', kind: 'slots',
  gen: MODEL.genExp, prompt: it => 'P = ' + qHTML(it.p) + ', ' + it.n + ' trials',
  slots: () => ['≈', { k: 'v', label: 'expected count', wide: true }], check: MODEL.checkExp, answer: it => ({ v: MODEL.EXPS && Number.isInteger(it.v) ? String(it.v) : (Math.round(it.v * 10) / 10).toString() }),
  draw(A, it, V) {
    const x0 = 80, W = 480, s = W / it.n, y = 200;
    A.el('rect', { x: x0, y: y - 20, width: W, height: 40, rx: 6, fill: 'none', stroke: C.muted, 'stroke-width': 2 }, A.svg);
    lab(A, x0, y + 46, '0', C.muted); lab(A, x0 + W, y + 46, String(it.n), C.muted); lab(A, x0 + W / 2, y + 74, 'trials', C.muted, { 'font-size': 16 });
    if (V.phase === 'ask') return;
    A.el('rect', { x: x0, y: y - 20, width: it.hits * s, height: 40, rx: 6, fill: C.blue, 'fill-opacity': .35, class: 'fade' }, A.svg);
    lab(A, x0 + it.hits * s, y - 40, 'one run: ' + it.hits, C.blue, { 'font-size': 17, class: 'fade' });
    A.el('line', { x1: x0 + it.v * s, x2: x0 + it.v * s, y1: y - 30, y2: y + 30, stroke: C.green, 'stroke-width': 3, class: 'fade' }, A.svg);
    lab(A, x0 + it.v * s, y + 110, done(V) ? 'expected ' + it.n + ' × ' + Q.str(it.p) + ' = ' + (Math.round(it.v * 10) / 10) : 'expected = ?', done(V) ? C.green : C.muted, { class: 'fade' });
  }
};

/* PR2 outcomes of two experiments */
const ICON = { coin: '🪙', die: '🎲', spin3: '◔', spin4: '◕', spin5: '⬠' };
function grid(A, a, b, V, mark) {
  const cw = Math.min(70, 440 / b.n), ch = Math.min(46, 260 / a.n), x0 = 320 - b.n * cw / 2 + 20, y0 = 80;
  b.labs.forEach((l, j) => lab(A, x0 + j * cw + cw / 2, y0 - 18, l, C.gold, { 'font-size': 18 }));
  a.labs.forEach((l, i) => lab(A, x0 - 22, y0 + i * ch + ch / 2, l, C.blue, { 'font-size': 18 }));
  a.labs.forEach((la, i) => b.labs.forEach((lb, j) => {
    const on = mark ? mark(la, lb) : V.phase !== 'ask';
    A.el('rect', { x: x0 + j * cw + 2, y: y0 + i * ch + 2, width: cw - 4, height: ch - 4, rx: 6, fill: on ? (mark ? C.green : C.teal) : C.stage, 'fill-opacity': on ? .35 : 1, stroke: C.edge, class: on ? 'fade' : null, style: on && !mark ? 'animation-delay:' + (i * b.n + j) * 25 + 'ms' : null }, A.svg);
    if (V.phase !== 'ask' && ch > 26) A.mtx(A.svg, x0 + j * cw + cw / 2, y0 + i * ch + ch / 2, la + lb, { 'font-size': 13, fill: C.muted });
  }));
  return { x0, y0, cw, ch };
}
const T_OUT = {
  id: 'out', code: 'PR2', name: 'Outcomes', sec: 2, q: 'How many outcomes?', kind: 'slots',
  gen: MODEL.genOut, prompt: it => ICON[it.a.id] + ' ' + it.a.n + ' and ' + ICON[it.b.id] + ' ' + it.b.n,
  slots: () => ['=', { k: 'v', label: 'outcomes' }], check: MODEL.checkOut, answer: it => ({ v: Q.q(it.v) }),
  draw(A, it, V) { grid(A, it.a, it.b, V); if (done(V)) lab(A, 320, 390, it.a.n + ' × ' + it.b.n + ' = ' + it.v, C.green, { 'font-size': 24, class: 'fade' }); }
};

/* PR3 independent events */
const T_AND = {
  id: 'and', code: 'PR3', name: 'And', sec: 3, q: 'Probability of both', kind: 'slots',
  gen: MODEL.genAnd, prompt: it => 'P(' + ICON[it.a.id] + ' ' + it.e1.name + ' and ' + ICON[it.b.id] + ' ' + it.e2.name + ')',
  slots: valSlot, check: MODEL.checkAnd, answer: it => ({ v: it.v }),
  draw(A, it, V) {
    grid(A, it.a, it.b, V, V.phase === 'ask' ? () => false : (la, lb) => it.e1.fav.includes(la) && it.e2.fav.includes(lb));
    if (V.phase !== 'ask') lab(A, 320, 390, Q.str(it.p1) + ' × ' + Q.str(it.p2) + (done(V) ? ' = ' + Q.str(it.v) : ''), done(V) ? C.green : C.muted, { 'font-size': 24, class: 'fade' });
  }
};

/* PR4 without replacement */
const T_NOREP = {
  id: 'norep', code: 'PR4', name: 'No replacement', sec: 4, q: 'Draw two, don’t put back', kind: 'slots',
  gen: MODEL.genNoRep, prompt: it => 'P(' + word(it.ask[0] === 'R' ? 'red' : 'blue') + ', then ' + word(it.ask[1] === 'R' ? 'red' : 'blue') + ')',
  slots: valSlot, check: MODEL.checkNoRep, answer: it => ({ v: it.v }),
  draw(A, it, V) {
    const list = bagList({ red: it.red, blue: it.blue }), first = it.ask[0] === 'R' ? 'red' : 'blue', second = it.ask[1] === 'R' ? 'red' : 'blue';
    bag(A, 170, 180, list);
    lab(A, 170, 330, 'first: ' + it.f1 + '/' + it.n, CC[first], { 'font-size': 22 });
    if (V.phase === 'ask') return;
    const gi = list.indexOf(first);
    A.el('path', { d: 'M300 180H360', stroke: C.muted, 'stroke-width': 2.5, 'marker-end': 'url(#aM)' }, A.svg);
    bag(A, 470, 180, list, { gone: [gi] });
    lab(A, 470, 330, 'second: ' + it.f2 + '/' + (it.n - 1), CC[second], { 'font-size': 22, class: 'fade' });
    if (done(V)) lab(A, 320, 385, it.f1 + '/' + it.n + ' × ' + it.f2 + '/' + (it.n - 1) + ' = ' + Q.str(it.v), C.green, { 'font-size': 24, class: 'fade' });
  }
};

/* PR3/PR4 does the chance change? */
const T_NEXT = {
  id: 'next', code: 'PR3–4', name: 'Next one?', sec: 3, q: 'The chance next time is…', kind: 'choice',
  gen: MODEL.genNext,
  prompt: it => ({ coin: '🪙 ' + 'H '.repeat(it.k) + '→ H?', die: '🎲 no 6 in ' + it.k + ' rolls → 6?', bagout: word('red') + ' × ' + it.k + ' drawn, kept out → ' + word('red') + '?', bagback: word('red') + ' × ' + it.k + ' drawn, put back → ' + word('red') + '?', bagother: word('blue') + ' × ' + it.k + ' drawn, kept out → ' + word('red') + '?' })[it.kind],
  choices: () => [{ v: 'higher', label: 'Higher' }, { v: 'same', label: 'Same' }, { v: 'lower', label: 'Lower' }],
  check: MODEL.checkNext, answer: it => ({ v: it.ans }),
  draw(A, it, V) {
    if (it.kind === 'coin' || it.kind === 'die') {
      const k = Math.min(it.k, 8);
      for (let i = 0; i < k; i++) { A.el('circle', { cx: 320 + (i - (k - 1) / 2) * 56, cy: 150, r: 24, fill: C.gold, 'fill-opacity': .25, stroke: C.gold, 'stroke-width': 2 }, A.svg); lab(A, 320 + (i - (k - 1) / 2) * 56, 151, it.kind === 'coin' ? 'H' : '–', C.gold); }
      if (V.phase !== 'ask') lab(A, 320, 280, (it.kind === 'coin' ? 'P(H) = 1/2' : 'P(6) = 1/6') + ' every time', C.green, { 'font-size': 26, class: 'fade' });
      return;
    }
    const before = bagList({ red: it.red, blue: it.blue }), removed = it.kind === 'bagother' ? 'blue' : 'red';
    bag(A, 170, 170, before);
    lab(A, 170, 315, 'red ' + it.red + '/' + (it.red + it.blue), C.red);
    if (V.phase === 'ask') return;
    const gone = it.kind === 'bagback' ? [] : before.map((c, i) => c === removed ? i : -1).filter(i => i >= 0).slice(0, it.k);
    bag(A, 470, 170, before, { gone });
    const r2 = it.kind === 'bagout' ? it.red - it.k : it.red, n2 = it.kind === 'bagback' ? it.red + it.blue : it.red + it.blue - it.k;
    lab(A, 470, 315, 'red ' + r2 + '/' + n2, C.red, { class: 'fade' });
    lab(A, 320, 372, Q.val(Q.q(r2, n2)) > Q.val(Q.q(it.red, it.red + it.blue)) + 1e-9 ? 'higher' : Q.val(Q.q(r2, n2)) < Q.val(Q.q(it.red, it.red + it.blue)) - 1e-9 ? 'lower' : 'the same', C.green, { 'font-size': 24, class: 'fade' });
  }
};

const PAGE = {
  key: 'math9-probability-trainer-v1', course: 'Math 9 · Statistics & Probability', title: 'Probability',
  notes: '../notes/probability/math9-probability-notes-v1.html',
  tabs: [T_PROB, T_NOT, T_EXP, T_OUT, T_AND, T_NOREP, T_NEXT]
};
DRILL.boot(PAGE);
