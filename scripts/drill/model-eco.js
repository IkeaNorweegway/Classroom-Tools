/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { rnd, pick, chance, shuffle } = Q;

  /* 7-1-01 biotic or abiotic (notes: soil is abiotic) */
  const BIOTIC = [
    ['Wolf', '🐺'], ['Aspen tree', '🌳'], ['Mushroom', '🍄'], ['Bacteria', '🦠'], ['Grass', '🌾'], ['Beaver', '🦫'],
    ['Great horned owl', '🦉'], ['Wood frog', '🐸'], ['Bull trout', '🐟'], ['White spruce', '🌲'], ['Bumblebee', '🐝'],
    ['Snowshoe hare', '🐇'], ['Mosquito', '🦟'], ['Earthworm', '🪱'], ['Wild rose', '🌹']
  ].map(([t, i]) => ({ t, i, a: 'bio' })).concat([
    ['Sunlight', '☀️'], ['Water', '💧'], ['Soil', '🟫'], ['Temperature', '🌡️'], ['Air', '💨'], ['Rock', '🪨'],
    ['Snow', '❄️'], ['Rain', '🌧️'], ['Wind', '🌬️'], ['Minerals', '💎']
  ].map(([t, i]) => ({ t, i, a: 'abio' })));
  const BIOTIC_CUES = { bio: 'It is alive: biotic', abio: 'Not alive: abiotic' };

  /* 7-1-02 producer, consumer or decomposer */
  const ROLE = [
    ['Grass', '🌾'], ['Aspen tree', '🌳'], ['White spruce', '🌲'], ['Wild rose', '🌹'], ['Willow', '🌿'], ['Saskatoon bush', '🫐']
  ].map(([t, i]) => ({ t, i, a: 'prod' })).concat([
    ['Snowshoe hare', '🐇'], ['Lynx', '🐈'], ['Wolf', '🐺'], ['Elk', '🦌'], ['Great horned owl', '🦉'], ['Grasshopper', '🦗'],
    ['Red fox', '🦊'], ['Golden eagle', '🦅'], ['Beaver', '🦫'], ['Black bear', '🐻'], ['Bull trout', '🐟']
  ].map(([t, i]) => ({ t, i, a: 'cons' }))).concat([
    ['Mushroom', '🍄'], ['Bacteria', '🦠'], ['Shelf fungus', '🍄'], ['Soil bacteria', '🦠'], ['Mould', '🦠']
  ].map(([t, i]) => ({ t, i, a: 'decomp' })));
  const ROLE_CUES = { prod: 'Makes its own food: producer', cons: 'Eats other living things: consumer', decomp: 'Breaks down dead things: decomposer' };

  /* 7-1-02 food chains, food first. Arrows mean "is eaten by". */
  const CHAINS = [
    [['Grass', '🌾'], ['Grasshopper', '🦗'], ['Meadowlark', '🐦'], ['Hawk', '🦅']],
    [['Grass', '🌾'], ['Grasshopper', '🦗'], ['Frog', '🐸'], ['Garter snake', '🐍']],
    [['Grass', '🌾'], ['Mouse', '🐭'], ['Garter snake', '🐍'], ['Great horned owl', '🦉']],
    [['Aspen', '🌳'], ['Snowshoe hare', '🐇'], ['Lynx', '🐈']],
    [['Grass', '🌾'], ['Deer', '🦌'], ['Wolf', '🐺']],
    [['Aspen', '🌳'], ['Beaver', '🦫'], ['Wolf', '🐺']],
    [['Pond algae', '🌿'], ['Insect larva', '🐛'], ['Trout', '🐟'], ['Osprey', '🦅']],
    [['Clover', '🍀'], ['Ground squirrel', '🐿️'], ['Ferruginous hawk', '🦅']],
    [['Willow', '🌿'], ['Snowshoe hare', '🐇'], ['Red fox', '🦊']]
  ];
  const LEVELS = ['prod', 'pri', 'sec', 'ter'];
  function genLevel() { const c = rnd(0, CHAINS.length - 1), k = rnd(0, CHAINS[c].length - 1); return { c, k, a: LEVELS[k] }; }
  function checkLevel(it, r) {
    if (r.v === it.a) return { ok: true };
    const p = LEVELS.indexOf(r.v);
    if (it.k === 0) return { code: 'prod', cue: 'Plants make food: producer' };
    if (p === it.k + 1) return { code: 'counted-producer', cue: 'The producer is not a consumer' };
    if (p === 0) return { code: 'not-prod', cue: 'It eats something: a consumer' };
    return { code: 'count', cue: 'Count the eaters from the producer' };
  }

  /* 7-1-02 which way does the arrow point? Food on the left half the time. */
  function genArrow() {
    const c = rnd(0, CHAINS.length - 1), k = rnd(0, CHAINS[c].length - 2), foodLeft = chance(.5);
    return { c, k, foodLeft, a: foodLeft ? 'r' : 'l' };
  }
  const checkArrow = (it, r) => r.v === it.a ? { ok: true } : { code: 'eats', cue: 'Arrow points to the eater' };

  /* 7-1-02 food web: remove one, what happens to a directly linked one? */
  const WEB = {
    nodes: { lynx: ['Lynx', '🐈'], owl: ['Owl', '🦉'], wolf: ['Wolf', '🐺'], fox: ['Fox', '🦊'],
      hare: ['Hare', '🐇'], moose: ['Moose', '🦌'], beaver: ['Beaver', '🦫'], mouse: ['Mouse', '🐭'],
      aspen: ['Aspen', '🌳'], grass: ['Grass', '🌾'], willow: ['Willow', '🌿'] },
    rows: [['lynx', 'owl', 'wolf', 'fox'], ['hare', 'moose', 'beaver', 'mouse'], ['aspen', 'grass', 'willow']],
    edges: [['aspen', 'hare'], ['aspen', 'moose'], ['aspen', 'beaver'], ['grass', 'hare'], ['grass', 'moose'], ['grass', 'mouse'],
      ['willow', 'moose'], ['willow', 'beaver'], ['hare', 'lynx'], ['hare', 'owl'], ['hare', 'wolf'], ['hare', 'fox'],
      ['moose', 'wolf'], ['beaver', 'wolf'], ['mouse', 'owl'], ['mouse', 'fox']]
  };
  function genWeb() {
    const [food, eater] = pick(WEB.edges), lostFood = chance(.5);
    return lostFood ? { gone: food, who: eater, a: 'down' } : { gone: eater, who: food, a: 'up' };
  }
  const checkWeb = (it, r) => r.v === it.a ? { ok: true }
    : it.a === 'down' ? { code: 'lost-food', cue: 'It lost food: goes down' } : { code: 'lost-predator', cue: 'Fewer predators eat it: up' };

  /* 7-1-02 / §3 the 10% rule: one level up keeps 1/10 of the energy */
  const BASES = [1000, 2000, 5000, 8000, 10000, 20000, 30000, 40000, 50000, 60000, 100000];
  function genEnergy() {
    const base = pick(BASES); let g, a;
    do { g = rnd(0, 3); a = rnd(0, 3); } while (g === a || Math.abs(g - a) > (chance(.7) ? 1 : 2));
    return { base, g, a, given: base / Math.pow(10, g), v: base / Math.pow(10, a) };
  }
  function checkEnergy(it, r) {
    const x = Q.val(r.v);
    if (x === it.v) return { ok: true };
    const steps = it.a - it.g;
    if (x === it.given * Math.pow(10, steps)) return steps > 0 ? { code: 'up-times', cue: 'Energy shrinks going up' } : { code: 'down-div', cue: 'Lower levels have more energy' };
    if (steps > 0 && Math.abs(x - it.given * Math.pow(.9, steps)) < 1e-6) return { code: 'ninety', cue: 'Only 10% passes up' };
    if (Math.abs(steps) === 2 && (x === it.given / 10 || x === it.given * 10)) return { code: 'one-step', cue: '÷ 10 at every level' };
    return { code: 'other', cue: steps > 0 ? 'One level up: ÷ 10' : 'One level down: × 10' };
  }

  /* 7-1-03 biodiversity = number of different species. Trap: the poorer plot has more individuals. */
  const KINDS = ['🌼', '🐞', '🐝', '🦋', '🐜', '🍄', '🐌', '🌿', '🍀', '🦗', '🐛', '🌸', '🕷️', '🌾'];
  function genBio() {
    const rich = rnd(4, 7), poor = rnd(1, Math.min(3, rich - 2)), kinds = shuffle(KINDS);
    const richK = kinds.slice(0, rich), poorK = kinds.slice(rich, rich + poor);
    const richP = [], poorP = [];
    richK.forEach(k => { const m = rnd(1, 2); for (let j = 0; j < m; j++) richP.push(k); });
    const total = Math.min(16, Math.max(richP.length + rnd(2, 4), 10));
    for (let j = 0; j < total; j++) poorP.push(poorK[j % poor]);
    const richLeft = chance(.5);
    return { A: shuffle(richLeft ? richP : poorP), B: shuffle(richLeft ? poorP : richP), nA: richLeft ? rich : poor, nB: richLeft ? poor : rich, a: richLeft ? 'A' : 'B' };
  }
  const checkBio = (it, r) => r.v === it.a ? { ok: true } : { code: 'individuals', cue: 'Count kinds, not individuals' };

  /* 7-1-04 natural or human-caused */
  const CHANGE = [
    ['Lightning starts a forest fire', '⚡', 'Cause: lightning'], ['A spring flood covers a valley', '🌊', 'Cause: snowmelt and rain'],
    ['A summer drought dries a slough', '☀️', 'Cause: little rain'], ['A disease kills many hares', '🦠', 'Cause: a disease'],
    ['A beaver dam floods a meadow', '🦫', 'Cause: beavers'], ['A windstorm knocks down trees', '🌪️', 'Cause: wind'],
    ['Hail flattens prairie grass', '🌨️', 'Cause: a storm']
  ].map(([t, i, why]) => ({ t, i, why, a: 'nat' })).concat([
    ['A wetland is drained for a farm', '🚜', 'Cause: people'], ['A forest is cleared for a road', '🛣️', 'Cause: people'],
    ['Oil spills into a river', '🛢️', 'Cause: people'], ['Zebra mussels ride in on a boat', '🚤', 'Cause: people moved them'],
    ['A lake is overfished', '🎣', 'Cause: people'], ['A campfire left burning starts a fire', '🏕️', 'Cause: people'],
    ['Purple loosestrife escapes a garden', '🌸', 'Cause: people planted it'], ['Smoke from a factory', '🏭', 'Cause: people']
  ].map(([t, i, why]) => ({ t, i, why, a: 'hum' })));
  const CHANGE_CUES = { nat: 'Nature caused it: natural', hum: 'People caused it: human-caused' };

  return { BIOTIC, BIOTIC_CUES, ROLE, ROLE_CUES, CHAINS, LEVELS, genLevel, checkLevel, genArrow, checkArrow, WEB, genWeb, checkWeb,
    genEnergy, checkEnergy, KINDS, genBio, checkBio, CHANGE, CHANGE_CUES };
})();
/* ===================== MODEL END ===================== */

