/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { rnd, pick, chance, shuffle } = Q;
  // Four choices from a fixed list: the answer plus three others, kept in list order.
  const four = (all, ans, not) => { const others = shuffle(all.filter(x => x !== ans && !(not || []).includes(x))).slice(0, 3); return all.filter(x => x === ans || others.includes(x)); };

  /* 7-2-01 plant cell parts (the five in the notes) */
  const CELL = ['wall', 'membrane', 'vacuole', 'chloro', 'nucleus'];
  const CELL_NAME = { wall: 'Cell wall', membrane: 'Cell membrane', vacuole: 'Vacuole', chloro: 'Chloroplast', nucleus: 'Nucleus' };
  const CELL_JOB = { wall: 'support and shape', membrane: 'controls what moves in and out', vacuole: 'stores water, keeps the cell firm', chloro: 'photosynthesis happens here', nucleus: 'control centre, holds DNA' };
  const CELL_CUE = { wall: 'Stiff outer layer: cell wall', membrane: 'Thin layer inside the wall: membrane', vacuole: 'Big water store: vacuole', chloro: 'Green ovals: chloroplasts', nucleus: 'Control centre: nucleus' };
  function genCell() { const a = pick(CELL); return { a, opts: four(CELL, a), lay: rnd(0, 2) }; }
  const checkCell = (it, r) => r.v === it.a ? { ok: true } : { code: 'is-' + it.a, cue: CELL_CUE[it.a] };

  /* 7-2-01 plant or animal cell. Onion skin cells are plant cells with no chloroplasts. */
  function genKind() { const a = chance(.5) ? 'plant' : 'animal'; return { a, onion: a === 'plant' && chance(.35), seed: rnd(1, 9999) }; }
  const checkKind = (it, r) => r.v === it.a ? { ok: true } : it.a === 'plant' ? { code: 'plant', cue: it.onion ? 'Cell wall, big vacuole: still plant' : 'Cell wall and chloroplasts: plant' } : { code: 'animal', cue: 'No cell wall: animal cell' };

  /* 7-2-02 which part does this job (root and shoot systems) */
  const PARTS = ['root', 'stem', 'leaf', 'flower'];
  const JOBS = [
    ['Absorbs water and minerals', 'root'], ['Anchors the plant', 'root'], ['Stores food, like a carrot', 'root'],
    ['Holds the leaves up to the light', 'stem'], ['Carries water up to the leaves', 'stem'], ['Supports the plant', 'stem'],
    ["Makes the plant's food", 'leaf'], ['Main place for photosynthesis', 'leaf'], ['Takes in carbon dioxide', 'leaf'],
    ['Makes seeds', 'flower'], ['Attracts pollinators', 'flower'], ['Makes pollen', 'flower']
  ].map(([t, a]) => ({ t, a }));
  const JOB_CUE = { root: 'Roots absorb, anchor, store', stem: 'Stems support and carry', leaf: 'Leaves make the food', flower: 'Flowers are for reproduction' };
  function genJob() { return Object.assign({}, pick(JOBS)); }
  function checkJob(it, r) {
    if (r.v === it.a) return { ok: true };
    if (it.a === 'leaf' && r.v === 'root' && /food/.test(it.t)) return { code: 'root-food', cue: 'Roots take water, not food' };
    return { code: 'is-' + it.a, cue: JOB_CUE[it.a] };
  }

  /* 7-2-02 xylem or phloem. Form 'cargo': what moves -> which tube. Form 'tube': tube -> what it carries. */
  const CARGO = [
    ['Water and minerals moving up from the roots', 'xylem'], ['Red dye climbing a celery stalk', 'xylem'], ['Water reaching the leaves', 'xylem'],
    ['Sugar moving out of the leaves', 'phloem'], ['Maple sap carrying sugar', 'phloem'], ['Food from the leaves going to the roots', 'phloem']
  ].map(([t, a]) => ({ t, a }));
  function genTube() {
    const left = chance(.5) ? 'xylem' : 'phloem';
    if (chance(.6)) return Object.assign({ form: 'cargo', left }, pick(CARGO));
    const tube = chance(.5) ? 'xylem' : 'phloem';
    return { form: 'tube', tube, left, a: tube === 'xylem' ? 'water' : 'sugar' };
  }
  function checkTube(it, r) {
    if (r.v === it.a) return { ok: true };
    if (r.v === 'soil') return { code: 'soil-food', cue: 'Plants make food; soil gives water' };
    const isX = it.form === 'cargo' ? it.a === 'xylem' : it.tube === 'xylem';
    return { code: isX ? 'xylem' : 'phloem', cue: isX ? 'Xylem: water up from roots' : 'Phloem: sugar from the leaves' };
  }

  /* 7-2-03 photosynthesis: carbon dioxide + water (+ light) -> glucose + oxygen. One box is blank. */
  const PHOTO = ['light', 'water', 'co2', 'glucose', 'oxygen', 'soil'];
  const PHOTO_NAME = { light: 'Light', water: 'Water', co2: 'Carbon dioxide', glucose: 'Glucose', oxygen: 'Oxygen', soil: 'Soil' };
  const PHOTO_CUE = { light: 'Light is the energy in', water: 'Water comes up from the soil', co2: 'Carbon dioxide comes from the air', glucose: 'Glucose is the food made', oxygen: 'Oxygen goes out into the air' };
  function genPhoto() {
    const a = pick(['light', 'water', 'co2', 'glucose', 'oxygen']), inSide = ['light', 'water', 'co2'].includes(a);
    // 'Soil' is offered often on the input side: the "food from soil" idea.
    const others = shuffle(PHOTO.filter(y => y !== a && y !== 'soil')).slice(0, 2);
    const opts = inSide && chance(.7) ? PHOTO.filter(x => x === a || x === 'soil' || others.includes(x)) : four(PHOTO, a);
    return { a, opts };
  }
  function checkPhoto(it, r) {
    if (r.v === it.a) return { ok: true };
    if (r.v === 'soil') return { code: 'soil', cue: 'Soil gives water, not food' };
    return { code: 'is-' + it.a, cue: PHOTO_CUE[it.a] };
  }

  /* 7-2-04 flower parts. A part and the whole it belongs to are never both offered. */
  const FLOWER = ['petal', 'sepal', 'stamen', 'anther', 'pistil', 'stigma', 'ovary'];
  const FLOWER_NAME = { petal: 'Petal', sepal: 'Sepal', stamen: 'Stamen', anther: 'Anther', pistil: 'Pistil', stigma: 'Stigma', ovary: 'Ovary' };
  const FLOWER_JOB = { petal: 'attracts pollinators', sepal: 'protects the bud', stamen: 'makes pollen', anther: 'makes the pollen', pistil: 'receives pollen, holds the ovules', stigma: 'catches pollen', ovary: 'holds ovules; becomes the fruit' };
  const CLASH = { stamen: ['anther'], anther: ['stamen'], pistil: ['stigma', 'ovary'], stigma: ['pistil'], ovary: ['pistil'] };
  function genFlower() { const a = pick(FLOWER); return { a, opts: four(FLOWER, a, CLASH[a]) }; }
  const checkFlower = (it, r) => r.v === it.a ? { ok: true } : { code: 'is-' + it.a, cue: FLOWER_NAME[it.a] + ': ' + FLOWER_JOB[it.a] };

  /* 7-2-04 sexual or asexual */
  const REPRO = [
    ['A bee carries pollen to another flower', '🐝'], ['Canola seeds form after pollination', '🌼'], ['Saskatoon berry seeds sprout', '🫐'],
    ['Apple seeds grow into new trees', '🍎'], ['Wind carries wheat pollen', '🌾'], ['Pollen joins an egg in the ovary', '🌸']
  ].map(([t, i]) => ({ t, i, a: 'sex', why: 'Two parents: offspring differ' })).concat([
    ['Strawberry runners root nearby', '🍓'], ['A potato tuber sprouts', '🥔'], ['A tulip bulb splits in two', '🌷'],
    ['A willow cutting grows roots', '🌿'], ['A garlic clove grows a new plant', '🧄'], ['Aspen roots send up new trees', '🌳']
  ].map(([t, i]) => ({ t, i, a: 'asex', why: 'One parent: identical offspring' })));
  const REPRO_CUE = { sex: 'Pollen and seeds: sexual', asex: 'One parent, a clone: asexual' };

  /* 7-2-05 selective breeding or genetic modification */
  const BIOTECH = [
    ['Farmers save seeds from their best wheat each year', '🌾'], ['Wild mustard bred into broccoli', '🥦'],
    ['Breeders cross two barleys and keep the best', '🌾'], ['Farmers kept seeds of the best corn for centuries', '🌽'],
    ['Only the biggest saskatoons are planted again', '🫐']
  ].map(([t, i]) => ({ t, i, a: 'breed', why: 'Choosing parents, many generations' })).concat([
    ['Scientists add a gene so canola resists a weed killer', '🧬'], ['A lab adds a drought gene to wheat', '🧪'],
    ['A bacteria gene makes corn resist insects', '🌽'], ["A gene is switched off so apples don't brown", '🍎']
  ].map(([t, i]) => ({ t, i, a: 'gmo', why: 'A gene changed directly' })));
  const BIOTECH_CUE = { breed: 'Choosing parents: selective breeding', gmo: 'Genes changed directly: GMO' };

  return { CELL, CELL_NAME, CELL_JOB, genCell, checkCell, genKind, checkKind, PARTS, JOBS, genJob, checkJob, CARGO, genTube, checkTube,
    PHOTO, PHOTO_NAME, genPhoto, checkPhoto, FLOWER, FLOWER_NAME, FLOWER_JOB, CLASH, genFlower, checkFlower, REPRO, REPRO_CUE, BIOTECH, BIOTECH_CUE };
})();
/* ===================== MODEL END ===================== */

