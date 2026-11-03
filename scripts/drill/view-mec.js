
/* ===================== PAGE: pictures and tabs ===================== */
const M = MODEL, { C } = DRILL, done = S.done;

const T_SPIRAL = S.chainTab({ id: 'spiral', code: '§1', name: 'Spiral', sec: 1, q: 'The missing step', steps: M.SPIRAL, loop: true, hub: 'the downward spiral' });
const T_CAUSE = S.classTab({
  id: 'cause', code: '§1', name: 'Cause', sec: 1, q: 'Which cause?', bank: M.CAUSE, cues: M.CAUSE_CUES,
  cats: [{ v: 'over', label: 'Over-production', means: 'more made than people buy' }, { v: 'dem', label: 'Falling demand', means: 'people buy less' },
    { v: 'trade', label: 'Trade collapse', means: 'countries stop trading' }, { v: 'fin', label: 'Financial instability', means: 'banks and markets fail' }]
});
const T_TOOL = S.classTab({
  id: 'tool', code: '§2', name: 'Tool', sec: 2, q: 'Which government tool?', bank: M.TOOL, cues: M.TOOL_CUES,
  cats: [{ v: 'pw', label: 'Public works', means: 'building projects that make jobs' }, { v: 'sw', label: 'Social welfare', means: 'direct support for people' },
    { v: 'def', label: 'Deficit spending', means: 'spend more than it collects' }]
});

/* §2 two bars: collects and spends */
const T_DEF = {
  id: 'deficit', code: '§2', name: 'Deficit?', sec: 2, q: 'Deficit spending?', kind: 'choice',
  gen: M.genDef, typeOf: it => it.a + (it.sp === it.rev ? '-equal' : ''),
  choices: () => [{ v: 'def', label: 'Deficit spending' }, { v: 'no', label: 'No deficit' }],
  check: M.checkDef, answer: it => ({ v: it.a }),
  draw(A, it, V) {
    const fin = done(V), base = 360, k = 3.3, bw = 130, xs = [210, 430];
    [[it.rev, 'Collects', '💰', C.teal], [it.sp, 'Spends', '🧾', C.gold]].forEach(([v, lab, ic, col], j) => {
      const h = v * k, x = xs[j];
      A.el('rect', { x: x - bw / 2, y: base - h, width: bw, height: h, rx: 8, fill: col, opacity: .85 }, A.svg);
      A.tx(A.svg, x, base - h - 20, '$' + v + ' billion', { 'font-size': 19, fill: C.text });
      S.emo(A.svg, x - 46, base + 28, ic, 24);
      A.tx(A.svg, x + 10, base + 28, lab, { 'font-size': 18, fill: C.muted });
    });
    A.el('line', { x1: 110, y1: base, x2: 530, y2: base, stroke: C.axis, 'stroke-width': 2 }, A.svg);
    if (!fin) return;
    const top = Math.max(it.rev, it.sp) * k, low = Math.min(it.rev, it.sp) * k;
    A.el('line', { x1: xs[0] - bw / 2, y1: base - it.rev * k, x2: xs[1] + bw / 2 + 20, y2: base - it.rev * k, stroke: C.teal, 'stroke-width': 2, 'stroke-dasharray': '6 6', class: 'fade' }, A.svg);
    if (it.a === 'def') {
      A.el('rect', { x: xs[1] - bw / 2, y: base - top, width: bw, height: top - low, fill: 'none', stroke: C.red, 'stroke-width': 4, class: 'pop' }, A.svg);
      S.chip(A.svg, 320, 50, 'Deficit: $' + (it.sp - it.rev) + ' billion borrowed', C.red, { cls: 'pop', fs: 17 });
    } else S.chip(A.svg, 320, 50, it.sp === it.rev ? 'Spends exactly what it collects' : 'Spends less than it collects', C.green, { cls: 'pop', fs: 17 });
  }
};
const T_SECT = S.classTab({
  id: 'sector', code: '§3', name: 'Sector', sec: 3, q: 'Which sector?', bank: M.SECT, cues: M.SECT_CUES,
  cats: [{ v: 'auto', label: 'Cars', means: 'southern Ontario, the Auto Pact' }, { v: 'pet', label: 'Oil and gas', means: 'Alberta, after Leduc' },
    { v: 'paper', label: 'Paper and forestry', means: 'BC, Ontario, Quebec' }, { v: 'hydro', label: 'Hydro', means: 'electricity from dams' }]
});
const T_FT = S.classTab({
  id: 'free', code: '§4', name: 'Free trade?', sec: 4, q: 'Free trade?', bank: M.FT, cues: M.FT_CUES,
  cats: [{ v: 'yes', label: 'Free trade', means: 'no tariffs or limits at the border' }, { v: 'no', label: 'Not free trade', means: 'a tax, limit or ban' }]
});
const T_ORDER = S.orderTab({ id: 'order', code: '§1–4', name: 'First?', sec: 4, bank: M.ORDER });

const PAGE = {
  key: 'soc9-modern-economy-trainer-v1', course: 'Social Studies 9 · Building a Modern Economy', title: 'Modern Economy Trainer',
  notes: 'soc9-modern-economy-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_SPIRAL, T_CAUSE, T_TOOL, T_DEF, T_SECT, T_FT, T_ORDER]
};
DRILL.boot(PAGE);
