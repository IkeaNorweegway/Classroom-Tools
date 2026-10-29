/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { rnd, pick, chance, shuffle } = Q;

  /* 7-5-01 Earth's layers: name the yellow layer, or match a property */
  const LAYERS = ['crust', 'mantle', 'outer', 'inner'];
  const LAYER_NAME = { crust: 'Crust', mantle: 'Mantle', outer: 'Outer core', inner: 'Inner core' };
  const LAYER_FACT = {
    crust: ['Thinnest layer', 'Has oceanic and continental parts', 'The rock we stand on'],
    mantle: ['Hot rock that flows very slowly', 'Convection currents move the plates', 'Thickest layer'],
    outer: ['Liquid iron and nickel', "Makes Earth's magnetic field"],
    inner: ['Solid iron and nickel ball', 'Solid because the pressure is extreme', "At Earth's centre"]
  };
  const LAYER_CUE = { crust: 'Thin outer rock: crust', mantle: 'Thick, slowly flowing rock: mantle', outer: 'Liquid iron and nickel: outer core', inner: 'Solid iron and nickel: inner core' };
  function genLayer() { const a = pick(LAYERS); return chance(.5) ? { form: 'pic', a } : { form: 'fact', a, t: pick(LAYER_FACT[a]) }; }
  const checkLayer = (it, r) => r.v === it.a ? { ok: true } : { code: 'is-' + it.a, cue: LAYER_CUE[it.a] };

  /* 7-5-02 igneous, sedimentary or metamorphic */
  const ROCK = [
    ['Lava cools at the surface', '🌋'], ['Magma cools slowly underground', '🔥'], ['Granite', '🪨'], ['Basalt', '⬛'], ['Obsidian (volcanic glass)', '🖤'], ['Rock melts, then cools', '🌋']
  ].map(([t, i]) => ({ t, i, a: 'ign' })).concat([
    ['Sand pressed and cemented', '🏖️'], ['Layers of shells cemented together', '🐚'], ['Sandstone', '🟫'], ['Shale', '🪨'], ['Limestone', '⬜'], ['Rock with fossils in its layers', '🦴']
  ].map(([t, i]) => ({ t, i, a: 'sed' }))).concat([
    ['Heat and pressure change a rock without melting it', '🔥'], ['Limestone changed into marble', '🏛️'], ['Shale changed into slate', '⬛'], ['Granite changed into gneiss', '🪨'], ['Marble', '🏛️'], ['Slate', '⬛']
  ].map(([t, i]) => ({ t, i, a: 'met' })));
  const ROCK_CUE = { ign: 'Melted rock that cooled: igneous', sed: 'Sediment pressed and cemented: sedimentary', met: 'Heat and pressure, no melting: metamorphic' };

  /* 7-5-02 crystal size: slow cooling underground gives large crystals */
  function genCrys() { const slow = chance(.5); return { form: chance(.6) ? 'pic' : 'cond', slow, seed: rnd(1, 99999), a: slow ? 'slow' : 'fast' }; }
  const checkCrys = (it, r) => r.v === it.a ? { ok: true } : it.slow ? { code: 'slow', cue: 'Slow cooling: crystals grow large' } : { code: 'fast', cue: 'Fast cooling: crystals stay small' };

  /* 7-5-03 plate boundaries */
  const BOUND = ['div', 'conv', 'trans'];
  const BOUND_NAME = { div: 'Divergent', conv: 'Convergent', trans: 'Transform' };
  const BOUND_FACT = {
    div: ['Mid-Atlantic Ridge', 'New seafloor forms', 'A rift opens in Iceland'],
    conv: ['Himalaya Mountains', 'An ocean trench with volcanoes', 'The Rocky Mountains form', 'Cascade volcanoes'],
    trans: ['San Andreas Fault', 'Plates grind past: earthquakes', 'No crust made or destroyed']
  };
  const BOUND_CUE = { div: 'Moving apart: divergent', conv: 'Moving together: convergent', trans: 'Sliding past: transform' };
  function genBound() { const a = pick(BOUND); return chance(.5) ? { form: 'arrows', a, flip: chance(.5) } : { form: 'fact', a, t: pick(BOUND_FACT[a]) }; }
  const checkBound = (it, r) => r.v === it.a ? { ok: true } : { code: 'is-' + it.a, cue: BOUND_CUE[it.a] };

  /* 7-5-04 focus, epicenter (the notes' spelling) or fault */
  const QUAKE = ['focus', 'epi', 'fault'];
  const QUAKE_NAME = { focus: 'Focus', epi: 'Epicenter', fault: 'Fault' };
  const QUAKE_CUE = { focus: 'Underground, where rock breaks: focus', epi: 'Surface point above: epicenter', fault: 'The break in the crust: fault' };
  function genQuake() { return { a: pick(QUAKE), x: rnd(220, 420), d: rnd(110, 200), lean: chance(.5) ? 1 : -1 }; }
  const checkQuake = (it, r) => r.v === it.a ? { ok: true } : { code: 'is-' + it.a, cue: QUAKE_CUE[it.a] };

  /* 7-5-04 shield or composite volcano */
  const VOLC_FACT = { shield: ['Runny lava flows out gently', 'Low-viscosity lava', 'Mauna Loa, Hawaii', 'Kilauea, Hawaii', 'Wide, with gentle slopes'],
    comp: ['Thick lava traps gas: it explodes', 'High-viscosity lava', 'Mt. St. Helens', 'Mt. Fuji', 'A steep cone'] };
  function genVolc() { const a = chance(.5) ? 'shield' : 'comp'; return chance(.5) ? { form: 'shape', a, w: rnd(0, 9), h: rnd(0, 9) } : { form: 'fact', a, t: pick(VOLC_FACT[a]), w: rnd(0, 9), h: rnd(0, 9) }; }
  const checkVolc = (it, r) => r.v === it.a ? { ok: true } : it.a === 'shield' ? { code: 'shield', cue: 'Runny lava, gentle slopes: shield' } : { code: 'comp', cue: 'Thick lava, steep, explosive: composite' };

  /* 7-5-05 weathering, erosion or deposition */
  const SURF = [
    ['Water freezes in a crack and splits a rock', '🧊'], ['Tree roots crack a rock', '🌳'], ['Acid rain dissolves limestone', '🌧️'], ['Iron in a rock rusts', '🟠'], ['Wind-blown sand wears down a hoodoo', '💨']
  ].map(([t, i]) => ({ t, i, a: 'weath' })).concat([
    ['A river carries sand downstream', '🏞️'], ['Wind blows soil off a field', '🌬️'], ['A glacier drags boulders along', '🏔️'], ['A landslide moves rock downhill', '⛰️']
  ].map(([t, i]) => ({ t, i, a: 'eros' }))).concat([
    ['A river drops sand at its mouth (a delta)', '🏝️'], ['A sandbar forms where a river slows', '🏖️'], ['A melting glacier leaves a boulder behind', '🪨'], ['Glacial till spread across the prairies', '🌾']
  ].map(([t, i]) => ({ t, i, a: 'depo' })));
  const SURF_CUE = { weath: 'Breaks rock where it sits: weathering', eros: 'Moves the pieces: erosion', depo: 'Drops them somewhere new: deposition' };

  /* 7-5-06 law of superposition: lower layers are older (undisturbed rock) */
  const FOSSILS = [['Trilobite', '🦐'], ['Ammonite', '🐚'], ['Fish', '🐟'], ['Leaf imprint', '🍃'], ['Dinosaur bone', '🦴'], ['Footprint', '🐾']];
  function genOld() {
    const n = rnd(4, 5), letters = shuffle(['A', 'B', 'C', 'D', 'E'].slice(0, n)), form = pick(['oldest', 'youngest', 'fossil']);
    const fos = shuffle(FOSSILS.slice()).slice(0, 2), spots = shuffle([...Array(n).keys()]).slice(0, 2);
    // letters[k] is the layer k from the top. For 'fossil', fossils sit in two different layers.
    const lower = spots[0] > spots[1] ? 0 : 1;
    const a = form === 'oldest' ? letters[n - 1] : form === 'youngest' ? letters[0] : fos[lower][0];
    return { n, letters, form, fos, spots, a };
  }
  function checkOld(it, r) {
    if (r.v === it.a) return { ok: true };
    if (it.form === 'youngest') return { code: 'young', cue: 'The top layer formed last' };
    return { code: 'old', cue: 'Lower layers are older' };
  }

  return { LAYERS, LAYER_NAME, LAYER_FACT, genLayer, checkLayer, ROCK, ROCK_CUE, genCrys, checkCrys, BOUND, BOUND_NAME, BOUND_FACT, genBound, checkBound,
    QUAKE, QUAKE_NAME, genQuake, checkQuake, VOLC_FACT, genVolc, checkVolc, SURF, SURF_CUE, FOSSILS, genOld, checkOld };
})();
/* ===================== MODEL END ===================== */

