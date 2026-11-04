/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { rnd, pick, chance, shuffle } = Q;
  const val = Q.val;

  /* 7-3-01 Celsius and Kelvin: K = °C + 273 */
  const TEMPS = [-273, -200, -100, -40, -30, -20, -15, -10, -5, 0, 5, 10, 15, 20, 21, 22, 25, 30, 37, 40, 50, 60, 75, 80, 90, 100, 150, 200];
  function genK() { const c = pick(TEMPS), form = chance(.6) ? 'toK' : 'toC'; return { form, c, k: c + 273, v: form === 'toK' ? c + 273 : c }; }
  function checkK(it, r) {
    const x = val(r.v);
    if (x === it.v) return { ok: true };
    if (it.form === 'toK') {
      if (x < 0) return { code: 'neg-k', cue: 'No negative kelvin' };
      if (x === it.c - 273) return { code: 'sub', cue: 'K = °C + 273' };
      if (x === it.c) return { code: 'same', cue: 'Add 273 for kelvin' };
    } else {
      if (x === it.k + 273) return { code: 'add', cue: '°C = K − 273' };
      if (x === it.k) return { code: 'same', cue: 'Subtract 273 for °C' };
    }
    return { code: 'other', cue: 'Kelvin is 273 more than °C' };
  }

  /* 7-3-01 heat (thermal energy) vs temperature */
  const SMALL = [['Cup', '☕'], ['Mug', '☕'], ['Kettle', '🫖']], BIG = [['Bathtub', '🛁'], ['Swimming pool', '🏊'], ['Lake', '🏞️']];
  function genMore() {
    const ask = chance(.55) ? 'thermal' : 'temp', kase = pick(['sameT', 'sameSize', 'hotSmall']);
    let A, B;
    if (kase === 'sameT') { const t = pick([20, 30, 40, 60, 80, 90]); A = { o: pick(SMALL), t, big: false }; B = { o: pick(BIG), t, big: true }; }
    else if (kase === 'sameSize') { const o = pick(SMALL), t1 = pick([20, 30, 40]), t2 = pick([70, 80, 90]); A = { o, t: t1, big: false }; B = { o, t: t2, big: false }; }
    else { A = { o: pick(SMALL), t: pick([80, 85, 90, 95]), big: false }; B = { o: pick(BIG), t: pick([15, 20, 25]), big: true }; }
    if (chance(.5)) [A, B] = [B, A];
    let a;
    if (ask === 'temp') a = A.t === B.t ? 'same' : A.t > B.t ? 'A' : 'B';
    else a = A.big !== B.big ? (A.big ? 'A' : 'B') : A.t > B.t ? 'A' : 'B';
    return { ask, kase, A, B, a };
  }
  function checkMore(it, r) {
    if (r.v === it.a) return { ok: true };
    if (it.ask === 'temp') return it.a === 'same' ? { code: 'temp-amount', cue: 'Same reading: same temperature' } : { code: 'temp-amount', cue: 'Temperature ignores the amount' };
    if (it.kase === 'sameSize') return { code: 'hotter', cue: 'Same amount: hotter has more' };
    return { code: 'thermal-amount', cue: 'More particles: more thermal energy' };
  }

  /* 7-3-01 which way does heat flow (hot to cold; none at the same temperature) */
  const PAIRS = [
    [['Your hand', '🖐️', 34], ['Snowball', '⛄', 0]], [['Soup', '🍲', 80], ['Spoon', '🥄', 20]], [['Ice cube', '🧊', 0], ['Juice', '🧃', 22]],
    [['Warm house', '🏠', 21], ['Winter air', '❄️', -20]], [['Frozen peas', '🧊', -18], ['Your hand', '🖐️', 34]], [['Hot pan', '🍳', 150], ['Egg', '🥚', 5]],
    [['Hot cocoa', '☕', 70], ['Room air', '💨', 21]], [['Metal desk', '🔩', 21], ['Wood desk', '🪵', 21]], [['Drink', '🥤', 21], ['Room air', '💨', 21]]
  ];
  function genFlow() {
    let [L, R] = pick(PAIRS); if (chance(.5)) [L, R] = [R, L];
    return { L, R, a: L[2] === R[2] ? 'none' : L[2] > R[2] ? 'r' : 'l' };
  }
  function checkFlow(it, r) {
    if (r.v === it.a) return { ok: true };
    if (it.a === 'none') return { code: 'none', cue: 'Same temperature: no heat flows' };
    if (r.v === 'none') return { code: 'flows', cue: 'Different temperatures: heat flows' };
    return { code: 'cold-flows', cue: 'Heat flows hot to cold' };
  }

  /* 7-3-02 particle model: expand or contract, and why */
  const SCEN = [
    ['Power lines on a hot day', 'exp'], ['A bridge in July heat', 'exp'], ['Thermometer liquid in a warm room', 'exp'], ['Railroad tracks in summer sun', 'exp'],
    ['A jar lid under hot water', 'exp'], ['Air in a balloon in the sun', 'exp'],
    ['Power lines at −30 °C', 'con'], ['A balloon in a freezer', 'con'], ['A sidewalk on a cold night', 'con'], ['Thermometer liquid outside in winter', 'con'], ['A bridge in January', 'con']
  ];
  function genPart() {
    if (chance(.6)) { const [t, a] = pick(SCEN); return { form: 'scen', t, a, hot: a === 'exp' }; }
    const hot = chance(.6); return { form: 'why', hot, a: hot ? 'apart' : 'closer' };
  }
  function checkPart(it, r) {
    if (r.v === it.a) return { ok: true };
    if (r.v === 'bigger' || r.v === 'smaller') return { code: 'size', cue: 'Particles stay the same size' };
    if (it.form === 'scen') return it.a === 'exp' ? { code: 'exp', cue: 'Heated: particles spread apart' } : { code: 'con', cue: 'Cooled: particles move closer' };
    return it.hot ? { code: 'apart', cue: 'Heated: faster and farther apart' } : { code: 'closer', cue: 'Cooled: slower and closer together' };
  }

  /* 7-3-03 conduction, convection, radiation */
  const MODE = [
    ['A spoon in hot soup gets hot', '🥄'], ['A pan handle heats up', '🍳'], ['Bare feet on a cold tile floor', '🦶'], ['A hand on a cold metal railing', '🖐️'],
    ['Ironing a shirt', '👕'], ['An ice cube melts in your hand', '🧊']
  ].map(([t, i]) => ({ t, i, a: 'cond' })).concat([
    ['Warm air rises from a heater', '♨️'], ['Water circles in a boiling pot', '🍲'], ['A sea breeze blows onto land', '🌊'],
    ['Cool air sinks near a cold window', '🪟'], ['Warm air rises up a chimney', '🏠']
  ].map(([t, i]) => ({ t, i, a: 'conv' }))).concat([
    ['Feeling a campfire from 2 m away', '🔥'], ['The Sun warms Earth through space', '☀️'], ['A heat lamp keeps fries warm', '💡'],
    ['A dark car seat gets hot in the sun', '🚗'], ['Warmth from a glowing stove element', '🟠']
  ].map(([t, i]) => ({ t, i, a: 'rad' })));
  const MODE_CUE = { cond: 'Touching: conduction', conv: 'A moving fluid: convection', rad: 'Waves, no contact: radiation' };

  /* 7-3-03 conductors and insulators; metal and wood at room temperature */
  const MATS = [[['Metal spoon', '🥄'], ['Wooden spoon', '🪵']], [['Copper pot', '🍲'], ['Foam cup', '🥤']], [['Steel railing', '🔩'], ['Wooden bench', '🪑']],
    [['Aluminum pan', '🍳'], ['Oven mitt', '🧤']], [['Metal desk', '🔩'], ['Wooden desk', '🪵']]];
  function genCond() {
    const ask = pick(['conductor', 'insulator', 'colder', 'faster']), [m, w] = pick(ask === 'colder' ? MATS.filter(p => /desk|spoon|railing/i.test(p[0][0])) : MATS), metalLeft = chance(.5);
    const A = metalLeft ? m : w, B = metalLeft ? w : m;
    const a = ask === 'colder' ? 'same' : (ask === 'insulator') === metalLeft ? 'B' : 'A';
    return { ask, A, B, metalLeft, a };
  }
  function checkCond(it, r) {
    if (r.v === it.a) return { ok: true };
    if (it.ask === 'colder') return { code: 'metal-colder', cue: 'Same temperature; metal conducts faster' };
    if (r.v === 'same') return { code: 'same', cue: it.ask === 'insulator' ? 'Wood, foam and wool insulate' : 'Metals conduct heat fast' };
    return it.ask === 'insulator' ? { code: 'ins', cue: 'Wood, foam and wool insulate' } : { code: 'cond', cue: 'Metals conduct heat fast' };
  }

  /* 7-3-04 specific heat: water warms and cools slowly */
  const SPEC = [
    { q: 'Sunny afternoon: warms faster?', lo: ['Sand', '🏖️'], hi: ['Water', '🌊'], heat: true },
    { q: 'At night: cools faster?', lo: ['Sand', '🏖️'], hi: ['Water', '🌊'], heat: false },
    { q: 'On the stove: heats faster?', lo: ['Empty metal pot', '🍳'], hi: ['Pot of water', '🍲'], heat: true },
    { q: 'Bigger temperature swings?', lo: ['Calgary (inland)', '🏙️'], hi: ['Vancouver (ocean)', '🌊'], heat: true },
    { q: 'Changes temperature faster?', lo: ['Air', '💨'], hi: ['Lake', '🏞️'], heat: true },
    { q: 'Freezes first in the fall?', lo: ['Soil', '🟫'], hi: ['River', '🌊'], heat: false }
  ];
  function genSpec() { const s = pick(SPEC), loLeft = chance(.5); return { s: SPEC.indexOf(s), loLeft, a: loLeft ? 'A' : 'B' }; }
  const checkSpec = (it, r) => r.v === it.a ? { ok: true } : { code: 'water-slow', cue: SPEC[it.s].lo[0].indexOf('Calgary') === 0 ? 'No ocean nearby: bigger swings' : 'Water heats and cools slowly' };

  /* 7-3-05 insulation slows heat transfer both ways; it makes no heat */
  const INS = [
    { form: 'rate', t: 'A wool coat on a snowman. It melts…', i: '⛄', hot: false },
    { form: 'rate', t: 'Foam around an ice-cold drink. It warms up…', i: '🥤', hot: false },
    { form: 'rate', t: 'Hot soup in a thermos. It cools…', i: '🍲', hot: true },
    { form: 'rate', t: 'A blanket over a cooler of ice. The ice melts…', i: '🧊', hot: false },
    { form: 'rate', t: 'A tea cozy on a hot teapot. It cools…', i: '🫖', hot: true },
    { form: 'rate', t: 'Take the wool coat off the snowman. It melts…', i: '⛄', hot: false, bare: true },
    { form: 'rate', t: 'Hot soup poured out of the thermos into a bowl. It cools…', i: '🍲', hot: true, bare: true },
    { form: 'rate', t: 'The blanket comes off the cooler. The ice melts…', i: '🧊', hot: false, bare: true },
    { form: 'pick', t: 'Loses less heat?', A: ['Single-pane window', '🪟', 0], B: ['Double-pane window', '🪟', 1] },
    { form: 'pick', t: 'Loses less heat?', A: ['Thin attic insulation', '🏠', 0], B: ['Thick attic insulation', '🏠', 1] },
    { form: 'pick', t: 'Keeps cocoa hot longer?', A: ['Metal mug', '☕', 0], B: ['Foam cup', '🥤', 1] },
    { form: 'pick', t: 'Keeps a popsicle frozen longer?', A: ['Bare in a bag', '🍭', 0], B: ['In a foam cooler', '🧊', 1] }
  ];
  function genIns() {
    const k = rnd(0, INS.length - 1), x = INS[k];
    if (x.form === 'rate') return { k, form: 'rate', a: x.bare ? 'faster' : 'slower' };
    const swap = chance(.5); return { k, form: 'pick', swap, a: swap ? 'A' : 'B' };
  }
  function checkIns(it, r) {
    if (r.v === it.a) return { ok: true };
    if (it.form === 'rate' && INS[it.k].bare) return { code: 'bare', cue: 'No insulation: heat moves faster' };
    if (it.form === 'rate') return r.v === 'faster' && !INS[it.k].hot ? { code: 'makes-heat', cue: 'Insulation makes no heat' } : { code: 'slows', cue: 'Insulation slows heat both ways' };
    return { code: 'trapped-air', cue: 'More insulation: slower heat loss' };
  }

  return { TEMPS, genK, checkK, genMore, checkMore, PAIRS, genFlow, checkFlow, SCEN, genPart, checkPart, MODE, MODE_CUE,
    MATS, genCond, checkCond, SPEC, genSpec, checkSpec, INS, genIns, checkIns };
})();
/* ===================== MODEL END ===================== */

