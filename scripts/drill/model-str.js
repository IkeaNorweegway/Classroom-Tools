/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { rnd, pick, chance, shuffle } = Q;
  const four = (all, ans) => { const o = shuffle(all.filter(x => x !== ans)).slice(0, 3); return all.filter(x => x === ans || o.includes(x)); };

  /* 7-4-01 solid, frame or shell */
  const TYPE = [
    ['A brick', '🧱'], ['A concrete dam', '⬛'], ['A tree trunk', '🪵'], ['A stone statue', '🗿'], ['A block of ice', '🧊']
  ].map(([t, i]) => ({ t, i, a: 'solid' })).concat([
    ['A bicycle', '🚲'], ['A building frame', '🏗️'], ['A spider web', '🕸️'], ['A ladder', '🪜'], ['A transmission tower', '🗼'], ['The Lethbridge Viaduct', '🌉']
  ].map(([t, i]) => ({ t, i, a: 'frame' }))).concat([
    ['An egg', '🥚'], ['A bike helmet', '⛑️'], ['An oil storage tank', '🛢️'], ['A pop can', '🥫'], ['A turtle shell', '🐢'], ['A canoe', '🛶']
  ].map(([t, i]) => ({ t, i, a: 'shell' })));
  const TYPE_CUE = { solid: 'Solid all through: solid', frame: 'Connected parts, open spaces: frame', shell: 'Thin curved surface: shell' };

  /* 7-4-02 dead, live or dynamic load (snow is left out: the notes call it both) */
  const LOAD = [
    ['The steel and concrete of a bridge', '🌉'], ["A roof's own beams and shingles", '🏠'], ['The weight of the bleachers themselves', '🏟️'],
    ["A tower's own weight", '🗼'], ['The bricks of a wall', '🧱']
  ].map(([t, i]) => ({ t, i, a: 'dead' })).concat([
    ['People sitting in the bleachers', '👥'], ['Books on a shelf', '📚'], ['Furniture in a house', '🛋️'], ['Cars parked on a bridge', '🚗'],
    ['Water filling a tank', '💧'], ['Grain inside a grain elevator', '🌾']
  ].map(([t, i]) => ({ t, i, a: 'live' }))).concat([
    ['A wind gust hits a tower', '🌬️'], ['An earthquake shakes a building', '🏚️'], ['Moving traffic on a bridge', '🚚'],
    ['Fans jumping in a stadium', '🙌'], ['A chinook gust rocks a sign', '💨']
  ].map(([t, i]) => ({ t, i, a: 'dyn' })));
  const LOAD_CUE = { dead: "The structure's own weight: dead", live: 'What it holds: live load', dyn: 'Sudden or changing: dynamic' };

  /* 7-4-02 internal forces: from an arrow picture or an example */
  const FORCES = ['comp', 'tens', 'shear', 'tors'];
  const FORCE_NAME = { comp: 'Compression', tens: 'Tension', shear: 'Shear', tors: 'Torsion' };
  const FORCE_EX = {
    comp: [['A column holding up a roof', '🏛️'], ['Chair legs under a person', '🪑'], ['Squeezing a sponge', '🧽'], ['The bottom bricks of a wall', '🧱']],
    tens: [['A rope in tug-of-war', '🪢'], ['A suspension bridge cable', '🌉'], ['A stretched rubber band', '➰'], ['A guitar string', '🎸']],
    shear: [['Scissors cutting paper', '✂️'], ['A bolt holding two plates', '🔩'], ['A hole punch cutting paper', '📄'], ['Tearing a sheet of paper', '📃']],
    tors: [['Wringing out a towel', '🧺'], ['Turning a screwdriver', '🪛'], ['Twisting a bottle cap', '🍾'], ['Turning a key', '🔑']]
  };
  const FORCE_CUE = { comp: 'Squeezed together: compression', tens: 'Pulled apart: tension', shear: 'Sliding opposite ways: shear', tors: 'Twisted: torsion' };
  function genForce() { const a = pick(FORCES); if (chance(.45)) return { form: 'arrows', a, flip: chance(.5) }; const [t, i] = pick(FORCE_EX[a]); return { form: 'example', a, t, i }; }
  const checkForce = (it, r) => r.v === it.a ? { ok: true } : { code: 'is-' + it.a, cue: FORCE_CUE[it.a] };

  /* 7-4-02 a beam on two supports: compression on top, tension underneath */
  const BEAMS = ['Wooden shelf', 'Plank bridge', 'Concrete beam', 'Steel beam'];
  function genBeam() {
    const form = pick(['squeezed', 'squeezed', 'stretched', 'crack', 'rebar']);
    return { form, beam: form === 'crack' || form === 'rebar' ? 'Concrete beam' : pick(BEAMS), off: rnd(-60, 60), a: form === 'squeezed' ? 'top' : 'bottom' };
  }
  function checkBeam(it, r) {
    if (r.v === it.a) return { ok: true };
    if (it.form === 'squeezed') return { code: 'top', cue: 'Top is squeezed: compression' };
    if (it.form === 'stretched') return { code: 'bottom', cue: 'Bottom is stretched: tension' };
    if (it.form === 'crack') return { code: 'crack', cue: 'Concrete cracks where stretched: bottom' };
    return { code: 'rebar', cue: 'Steel goes on the stretched side' };
  }

  /* 7-4-03 stability: tipping angle = atan((base / 2) / CoG height). Shapes are uniform, so the CoG is exact. */
  // kind 'rect' | 'wide' (trapezoid, wide bottom) | 'narrow' (wide top). b = bottom width, t = top width, H = height (px).
  function shape() {
    const kind = pick(['rect', 'wide', 'narrow']), H = rnd(90, 250), b0 = rnd(50, 190);
    const b = kind === 'narrow' ? Math.round(b0 * .55) : b0, t = kind === 'rect' ? b : kind === 'wide' ? Math.round(b0 * .4) : b0;
    const hc = H * (b + 2 * t) / (3 * (b + t)), ang = Math.atan2(b / 2, hc) * 180 / Math.PI;
    return { kind, b, t, H, hc, ang };
  }
  function genStable() {
    let A, B, n = 0;
    do { A = shape(); B = shape(); n++; } while (Math.abs(A.ang - B.ang) < 12 && n < 200);
    return { A, B, a: A.ang > B.ang ? 'A' : 'B' };
  }
  const checkStable = (it, r) => r.v === it.a ? { ok: true } : { code: 'cog', cue: 'Lower CoG, wider base: more stable' };

  /* 7-4-04 lever class: what is in the middle */
  const LEVER_EX = [['Seesaw', '⚖️', 1], ['Scissors', '✂️', 1], ['Pliers', '🔧', 1], ['Nutcracker', '🌰', 2], ['Bottle opener', '🍾', 2],
    ['Fishing rod', '🎣', 3], ['Broom', '🧹', 3], ['Hockey stick', '🏒', 3], ['Baseball bat', '⚾', 3]];
  const CLASS_CUE = { 1: 'Fulcrum in the middle: 1st class', 2: 'Load in the middle: 2nd class', 3: 'Effort in the middle: 3rd class' };
  function genLever() {
    if (chance(.35)) { const [t, i, c] = pick(LEVER_EX); return { form: 'example', t, i, cls: c, a: String(c), flip: chance(.5) }; }
    const c = rnd(1, 3); return { form: 'diagram', cls: c, a: String(c), flip: chance(.5), d: rnd(0, 2) };
  }
  const checkLever = (it, r) => r.v === it.a ? { ok: true } : { code: 'class-' + it.a, cue: CLASS_CUE[it.cls] };

  /* 7-4-04 mechanical advantage = load force ÷ effort force */
  function genMA() {
    if (chance(.2)) { const L = pick([10, 20, 30, 40, 50]), k = pick([2, 4]); return { L, E: L * k, v: Q.q(1, k), small: true }; }
    const ma = pick([2, 3, 4, 5, 6, 8, 10]), E = pick([10, 20, 25, 30, 40, 50, 60, 100]); return { L: ma * E, E, v: Q.q(ma), small: false };
  }
  function checkMA(it, r) {
    const x = Q.val(r.v);
    if (Q.eq(r.v, it.v)) return { ok: true };
    if (Math.abs(x - it.E / it.L) < 1e-9) return { code: 'flip', cue: 'MA = load ÷ effort' };
    if (x === it.L - it.E || x === it.E - it.L) return { code: 'sub', cue: "Divide, don't subtract" };
    if (x === it.L * it.E) return { code: 'mul', cue: "Divide, don't multiply" };
    return { code: 'other', cue: 'MA = load ÷ effort' };
  }

  /* 7-4-04 name the simple machine */
  const MACH = ['lever', 'wheel', 'pulley', 'incline', 'wedge', 'screw'];
  const MACH_NAME = { lever: 'Lever', wheel: 'Wheel and axle', pulley: 'Pulley', incline: 'Inclined plane', wedge: 'Wedge', screw: 'Screw' };
  const MACH_EX = {
    lever: [['Seesaw', '⚖️'], ['Fishing rod', '🎣'], ['Nutcracker', '🌰'], ['Bottle opener', '🍾'], ['Broom', '🧹']],
    wheel: [['Doorknob', '🚪'], ['Steering wheel', '🚗'], ['Screwdriver', '🪛'], ['Water tap', '🚰'], ['Bike pedals and crank', '🚲']],
    pulley: [['Flagpole rope', '🏳️'], ['Window blind cord', '🪟'], ['Crane hook and rope', '🏗️'], ['Well bucket rope', '🪣']],
    incline: [['Wheelchair ramp', '♿'], ['Staircase', '🪜'], ['Switchback mountain road', '🏔️'], ['Loading ramp', '🚚']],
    wedge: [['Axe', '🪓'], ['Knife', '🔪'], ['Chisel', '🔨'], ['Nail tip', '📌'], ['Doorstop', '🛑']],
    screw: [['Wood screw', '🔩'], ['Jar lid', '🥫'], ['Lightbulb base', '💡'], ['Car jack', '🚘']]
  };
  const MACH_CUE = { lever: 'A bar on a pivot: lever', wheel: 'Big wheel turns small axle', pulley: 'Rope over a wheel: pulley', incline: 'A sloped surface: inclined plane', wedge: 'Two slopes that split: wedge', screw: 'Ramp wrapped around: screw' };
  function genMach() { const a = pick(MACH), [t, i] = pick(MACH_EX[a]); return { a, t, i, opts: four(MACH, a) }; }
  const checkMach = (it, r) => r.v === it.a ? { ok: true } : { code: 'is-' + it.a, cue: MACH_CUE[it.a] };

  return { TYPE, TYPE_CUE, LOAD, LOAD_CUE, FORCES, FORCE_NAME, FORCE_EX, genForce, checkForce, genBeam, checkBeam, shape, genStable, checkStable,
    LEVER_EX, genLever, checkLever, genMA, checkMA, MACH, MACH_NAME, MACH_EX, genMach, checkMach };
})();
/* ===================== MODEL END ===================== */

