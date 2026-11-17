
/* ===================== MODEL START (no DOM) ===================== */
/* Science 7 word problems: science stories, not calculations. Each unit has three levels of reasoning:
   1 = one step (name the idea in the story), 2 = two steps (apply it: predict or explain one link),
   3 = three steps (a chain of cause and effect, or a fix that matches the cause).
   An item: { t (story type), lvl, code (LO, e.g. 7-1-02), sec (notes section), unit, story (HTML, key facts in <b>),
   q (2–4 words), opts: [{v, t}] (tap choices, shuffled; v 'a' is right, 'e0', 'e1', … are named misconceptions),
   errs: [{t, cue, s}] (the choice text, a cue of six words or fewer, the step it breaks), steps: [{l, m}],
   pic (a schematic, drawn by sw.js) }. Banks are large and items on the same object take opposite answers
   (rule 27), so an object never gives the answer away. */
const MODEL = (() => {
  const { rnd, pick, shuffle } = Q;
  const B = s => '<b>' + s + '</b>';
  const NAMES = ['Ava', 'Liam', 'Noah', 'Maya', 'Ethan', 'Zoe', 'Owen', 'Priya', 'Jayden', 'Hana', 'Lucas', 'Amara', 'Kai', 'Sofia', 'Mateo', 'Leah'];
  const cd = (c, r, i, t, o) => Object.assign({ c, r, i, t }, o || {});
  const row = (list, o) => ({ k: 'scene', cards: list.map((x, j) => cd(j, 0, x[0], x[1], x[2])), arrows: list.slice(1).map((x, j) => Object.assign({ a: j, b: j + 1 }, (o && o.arr && o.arr[j]) || {})) });

  function mk(t, lvl, code, sec, o) {
    const errs = o.errs.map(([tx, cue, s]) => ({ t: tx, cue, s }));
    const opts = shuffle([{ v: 'a', t: o.a }].concat(errs.map((e, k) => ({ v: 'e' + k, t: e.t }))));
    return { t, lvl, code, sec, story: o.story, q: o.q, a: o.a, opts, errs, steps: o.steps.map(([l, m]) => ({ l, m })), pic: o.pic };
  }
  // A tapped choice -> ok, or the misconception it names (its cue and the step it breaks).
  function check(it, r) {
    if (r.v === 'a') return r.miss ? { ok: true, partial: true, cue: 'Right; an earlier step slipped' } : { ok: true };
    const k = /^e(\d+)$/.test(r.v || '') ? +r.v.slice(1) : -1, e = it.errs[k];
    return e ? { code: 'e' + k, cue: e.cue, s: e.s } : { code: 'other', cue: 'Pick one answer', s: -1 };
  }

  /* ============ 7-1 · Interactions and Ecosystems ============ */
  const ECOS = [
    { p: 'wetland', bio: [['🦆', 'mallard'], ['🌾', 'cattail'], ['🐸', 'wood frog'], ['🦫', 'muskrat']], abio: [['💧', 'water depth'], ['🌡️', 'water temperature'], ['☀️', 'sunlight'], ['🟫', 'mud']] },
    { p: 'boreal forest', bio: [['🦌', 'moose'], ['🌲', 'black spruce'], ['🍄', 'mushroom'], ['🐿️', 'red squirrel']], abio: [['❄️', 'snow cover'], ['🌡️', 'air temperature'], ['☀️', 'sunlight'], ['🪨', 'rocky soil']] },
    { p: 'grassland', bio: [['🌾', 'fescue grass'], ['🦗', 'grasshopper'], ['🦅', 'hawk'], ['🐍', 'bull snake']], abio: [['💨', 'wind'], ['🌧️', 'rainfall'], ['☀️', 'sunlight'], ['🟤', 'soil minerals']] },
    { p: 'mountain meadow', bio: [['🐐', 'mountain goat'], ['🌼', 'alpine flower'], ['🦋', 'butterfly'], ['🌲', 'fir tree']], abio: [['⛰️', 'steep slope'], ['❄️', 'snowmelt'], ['🌡️', 'cold nights'], ['🪨', 'loose rock']] }
  ];
  function ecoBiotic() {
    const e = pick(ECOS), want = pick(['bio', 'abio']), other = want === 'bio' ? 'abio' : 'bio';
    const ans = pick(e[want]), others = shuffle(e[other]).slice(0, 2), all = shuffle([ans].concat(others)), n = pick(NAMES);
    const word = want === 'bio' ? 'biotic' : 'abiotic';
    return mk('ecoBiotic', 1, '7-1-01', 1, {
      story: 'At a ' + e.p + ', ' + n + ' records ' + all.map(x => B(x[1])).join(', ').replace(/, ([^,]*)$/, ' and $1') + '.',
      q: 'Which one is ' + word + '?', a: ans[1],
      errs: others.map(x => [x[1], want === 'bio' ? 'That was never alive' : 'That one is living', 0]),
      steps: [[word, ans[1] + (want === 'bio' ? ' is a living thing' : ' is a non-living factor')]],
      pic: { k: 'scene', cards: all.map((x, j) => cd(j, 0, x[0], x[1], x === ans ? { tag: word } : {})) }
    });
  }
  const ROLES = [
    ['P', '🌸', 'Fireweed', 'Fireweed grows in a burned forest. Its leaves use ' + B('sunlight to make sugar') + '.', '☀️', 'sunlight'],
    ['P', '🟢', 'Green algae', 'Green algae float near the top of a pond. They ' + B('make food from light') + ', water and air.', '☀️', 'sunlight'],
    ['P', '🌿', 'A willow', 'A willow grows on a riverbank. It ' + B('makes its own sugar') + ' in its leaves.', '☀️', 'sunlight'],
    ['C', '🦌', 'A moose', 'A moose wades into a lake. It ' + B('eats water plants') + ' from the bottom.', '🌿', 'water plants'],
    ['C', '🦅', 'A hawk', 'A red-tailed hawk circles a field. It ' + B('dives to catch a ground squirrel') + '.', '🐿️', 'ground squirrel'],
    ['C', '🦗', 'A grasshopper', 'A grasshopper ' + B('chews on prairie grass') + '. Then it hops away.', '🌾', 'grass'],
    ['C', '🐦', 'A chickadee', 'A chickadee ' + B('picks insects') + ' off spruce bark all winter.', '🐛', 'insects'],
    ['D', '🍄', 'Mushrooms', 'Mushrooms grow on a fallen aspen log. They ' + B('break the dead wood down') + ' into nutrients.', '🪵', 'dead log'],
    ['D', '🪱', 'Earthworms', 'Earthworms ' + B('feed on dead leaves') + ' in the soil. Their wastes return nutrients.', '🍂', 'dead leaves'],
    ['D', '🦠', 'Bacteria', 'Bacteria in a compost bin ' + B('break down old vegetables') + ' into rich soil.', '🥬', 'old vegetables']
  ];
  const RN = { P: 'Producer', C: 'Consumer', D: 'Decomposer' };
  const RCUE = { P: { C: 'It eats other living things', D: 'It eats living things, not dead' }, C: { P: 'It makes food from light', D: 'It breaks down dead matter' }, D: { P: 'It makes food from light', C: 'It breaks down dead matter' } };
  const RWHY = { P: 'makes its own food from light', C: 'eats other living things', D: 'breaks down dead matter' };
  function ecoRole() {
    const [r, i, nm, story, fi, ft] = pick(ROLES), wrong = ['P', 'C', 'D'].filter(x => x !== r);
    return mk('ecoRole', 1, '7-1-02', 2, {
      story, q: 'What is its role?', a: RN[r],
      errs: wrong.map(w => [RN[w], RCUE[w][r], 0]),
      steps: [['role', nm.replace(/^A /, '') + ' ' + RWHY[r] + ': ' + RN[r].toLowerCase()]],
      pic: { k: 'scene', cards: [cd(0, 0, fi, ft), cd(1, 0, i, '?', { q: true, d: RN[r] })], arrows: [{ a: 0, b: 1, t: r === 'P' ? 'light' : r === 'C' ? 'eaten' : 'broken down', k: 'G' }] }
    });
  }
  const EATS = [
    ['boreal forest', ['🐈', 'lynx'], ['🐇', 'hare']], ['aspen parkland', ['🦉', 'owl'], ['🐭', 'vole']], ['grassland', ['🦊', 'fox'], ['🐿️', 'gopher']],
    ['mountains', ['🐺', 'wolf'], ['🦌', 'elk']], ['wetland', ['🦩', 'heron'], ['🐟', 'minnow']], ['boreal forest', ['🐇', 'hare'], ['🌿', 'willow']],
    ['grassland', ['🦬', 'bison'], ['🌾', 'grass']], ['wetland', ['🦆', 'duck'], ['🐌', 'snail']]
  ];
  function ecoArrow() {
    const [pl, eat, food] = pick(EATS), left = rnd(0, 1), cards = left ? [food, eat] : [eat, food];
    const plant = /willow|grass/.test(food[1]);
    return mk('ecoArrow', 1, '7-1-02', 2, {
      story: 'In the ' + pl + ', ' + (/^[aeiou]/.test(eat[1]) ? 'an ' : 'a ') + B(eat[1]) + ' ' + (plant ? 'feeds on' : 'catches and eats') + ' ' + (plant ? '' : 'a ') + B(food[1]) + '.',
      q: 'Energy flows which way?', a: food[1] + ' → ' + eat[1],
      errs: [[eat[1] + ' → ' + food[1], 'Arrow points toward the eater', 0], ['No energy moves', 'Eating passes energy along', 0]],
      steps: [['energy flow', 'the ' + food[1] + '’s energy moves into the ' + eat[1]]],
      pic: { k: 'scene', cards: [cd(0, 0, cards[0][0], cards[0][1]), cd(1, 0, cards[1][0], cards[1][1])], arrows: [left ? { a: 0, b: 1, t: 'energy', k: 'N', dir: true } : { a: 1, b: 0, t: 'energy', k: 'N', dir: true }] }
    });
  }
  const PYR = [
    ['meadow', [['🌾', 'grass'], ['🦗', 'grasshoppers'], ['🐍', 'snakes'], ['🦅', 'hawks']]],
    ['boreal forest', [['🌿', 'willows'], ['🐇', 'hares'], ['🐈', 'lynx']]],
    ['lake', [['🟢', 'algae'], ['🦐', 'water fleas'], ['🐟', 'minnows'], ['🦆', 'loons']]],
    ['pasture', [['☘️', 'clover'], ['🐭', 'voles'], ['🦊', 'foxes']]],
    ['wetland', [['🌱', 'pond plants'], ['🐌', 'snails'], ['🐸', 'frogs'], ['🦩', 'herons']]]
  ];
  function ecoPyramid() {
    const [pl, ch] = pick(PYR), top = ch[ch.length - 1][1], low = ch[1][1];
    return mk('ecoPyramid', 2, '7-1-02', 3, {
      story: 'A ' + pl + ' has thousands of ' + B(low) + ' but only a few ' + B(top) + '. ' + B('The chain is ' + ch.map(x => x[1]).join(' → ')) + '.',
      q: 'Why so few ' + top + '?', a: 'Energy is lost at each level',
      errs: [['More energy reaches the top', 'Each level gets about 10%', 1], [low[0].toUpperCase() + low.slice(1) + ' are producers', 'They eat plants: consumers', 0]],
      steps: [['each level', 'only about 10% of the energy passes up'], ['top level', 'little energy is left, so only a few ' + top]],
      pic: { k: 'layers', bands: ch.slice().reverse().map((x, j) => ({ i: x[0], t: x[1], w: .38 + .62 * (j + 1) / ch.length, k: j === 0 ? 'Y' : 'G', tag: ['100%', '10%', '1%', '0.1%'][ch.length - 1 - j] })) }
    });
  }
  const WEB = [
    ['boreal forest', ['🐺', 'wolves'], ['🦌', 'moose']], ['boreal forest', ['🐈', 'lynx'], ['🐇', 'hares']], ['aspen parkland', ['🦉', 'owls'], ['🐭', 'voles']],
    ['grassland', ['🦊', 'foxes'], ['🐿️', 'gophers']], ['mountains', ['🐻', 'grizzlies'], ['🐟', 'trout']], ['wetland', ['🦩', 'herons'], ['🐸', 'frogs']],
    ['boreal forest', ['🐇', 'hares'], ['🌿', 'willows']], ['grassland', ['🦗', 'grasshoppers'], ['🌾', 'grasses']]
  ];
  function ecoWeb() {
    const [pl, eat, food] = pick(WEB), gone = pick(['eater', 'food']), X = gone === 'eater' ? eat : food, Y = gone === 'eater' ? food : eat;
    const up = gone === 'eater', Yc = Y[1][0].toUpperCase() + Y[1].slice(1);
    return mk('ecoWeb', 2, '7-1-02', 2, {
      story: (/^[aeiou]/.test(pl) ? 'In an ' : 'In a ') + pl + ' food web, ' + B(eat[1]) + ' eat ' + B(food[1]) + '. A disease kills most of the ' + B(X[1]) + '.',
      q: 'What happens to ' + Y[1] + '?', a: Yc + (up ? ' increase' : ' decrease'),
      errs: [[Yc + (up ? ' decrease' : ' increase'), up ? 'Fewer predators eat them' : 'They lose their food', 1], [Yc + ' stay the same', 'They are linked in the web', 0]],
      steps: [['the link', eat[1] + ' eat ' + food[1]], ['the effect', up ? 'fewer ' + eat[1] + ' eat them, so ' + food[1] + ' increase' : 'less food, so ' + eat[1] + ' decrease']],
      pic: { k: 'scene', cards: [cd(0, 0, eat[0], eat[1], gone === 'eater' ? { x: true } : { q: true, d: eat[1] + ' ↓' }), cd(0, 1, food[0], food[1], gone === 'food' ? { x: true } : { q: true, d: food[1] + ' ↑' })], arrows: [{ a: 1, b: 0, t: 'eaten by', k: 'G' }] }
    });
  }
  const PLOTS = [
    ['native prairie with ' + B('30 kinds') + ' of plants', 'all ' + B('wheat'), 'A beetle that eats only wheat', ['🌼', '🌾🌸🌿'], '🪲'],
    ['a mixed forest of ' + B('12 kinds') + ' of trees', 'all ' + B('lodgepole pine'), 'A beetle that kills only pines', ['🌳', '🌲🌳🍁'], '🪲'],
    ['a meadow of ' + B('25 kinds') + ' of plants', 'a lawn of ' + B('one grass'), 'A fungus that kills only that grass', ['🌼', '🌱🌼🌿'], '🍄'],
    ['a garden of ' + B('15 kinds') + ' of crops', 'all ' + B('canola'), 'A pest that eats only canola', ['🥕', '🥬🌽🫘'], '🐛']
  ];
  function ecoBiodiv() {
    const [div, mono, pest, ic, pi] = pick(PLOTS), dA = rnd(0, 1), D = dA ? 'A' : 'B', M = dA ? 'B' : 'A';
    const sA = dA ? div : mono, sB = dA ? mono : div;
    return mk('ecoBiodiv', 2, '7-1-03', 4, {
      story: 'Plot A is ' + sA + '. Plot B is ' + sB + '. ' + B(pest + ' arrives') + '.',
      q: 'Which recovers better?', a: 'Plot ' + D,
      errs: [['Plot ' + M, 'One kind: the pest hits everything', 1], ['Both the same', 'Count the kinds of species', 0]],
      steps: [['biodiversity', 'Plot ' + D + ' has many more kinds of species'], ['the pest', 'it hits one kind; the rest of Plot ' + D + ' carries on']],
      pic: { k: 'scene', cards: [cd(.5, 0, pi, 'pest'), cd(0, 1, dA ? ic[1] : '🌾', 'Plot A', dA ? { tag: 'many kinds', size: 30 } : { tag: 'one kind', tagk: 'R' }), cd(1, 1, dA ? '🌾' : ic[1], 'Plot B', dA ? { tag: 'one kind', tagk: 'R' } : { tag: 'many kinds', size: 30 })], arrows: [{ a: 0, b: 1, k: 'R', dash: true }, { a: 0, b: 2, k: 'R', dash: true }] }
    });
  }
  // A change ripples two links along a food chain. ud: up (+1) or down (−1) for X, Y and Z; st: the three steps.
  const CHAINS = [
    ['Purple loosestrife crowds out the ' + B('cattails') + ' in a marsh. ' + B('Muskrats eat cattails, and mink eat muskrats') + '.', ['🌸', 'loosestrife'], ['🌾', 'cattails'], ['🦫', 'muskrats'], ['🦦', 'mink'], [-1, -1, -1],
      ['loosestrife crowds out the cattails', 'muskrats lose their food, so they decrease', 'mink lose their food, so they decrease']],
    ['A wetland is ' + B('drained') + ' to build a parking lot. ' + B('Frogs live in it, and herons eat frogs') + '.', ['🚧', 'draining'], ['💧', 'wetland'], ['🐸', 'frogs'], ['🦩', 'herons'], [-1, -1, -1],
      ['draining removes the wetland', 'frogs lose their habitat, so they decrease', 'herons lose their food, so they decrease']],
    ['A new road is cut through a forest and many ' + B('aspens') + ' are removed. ' + B('Hares eat aspen shoots, and lynx eat hares') + '.', ['🚜', 'road'], ['🌳', 'aspens'], ['🐇', 'hares'], ['🐈', 'lynx'], [-1, -1, -1],
      ['the road removes many aspens', 'hares lose their food, so they decrease', 'lynx lose their food, so they decrease']],
    ['A pesticide kills most ' + B('grasshoppers') + ' on a prairie. ' + B('Meadowlarks eat grasshoppers, and hawks eat meadowlarks') + '.', ['🧴', 'pesticide'], ['🦗', 'grasshoppers'], ['🐦', 'meadowlarks'], ['🦅', 'hawks'], [-1, -1, -1],
      ['the pesticide kills the grasshoppers', 'meadowlarks lose food, so they decrease', 'hawks lose food, so they decrease']],
    ['Wolves are ' + B('brought back') + ' to a national park. ' + B('Wolves eat elk, and elk eat willows') + '.', ['🐺', 'reintroduced'], ['🐺', 'wolves'], ['🦌', 'elk'], ['🌿', 'willows'], [1, -1, 1],
      ['more wolves now hunt in the park', 'more elk are eaten, so elk decrease', 'fewer elk eat willows, so willows increase']],
    ['Ranchers ' + B('trap the coyotes') + ' in a valley. ' + B('Coyotes eat gophers, and gophers eat grass') + '.', ['🪤', 'trapping'], ['🐺', 'coyotes'], ['🐿️', 'gophers'], ['🌾', 'grass'], [-1, 1, -1],
      ['trapping removes the coyotes', 'fewer gophers are eaten, so they increase', 'more gophers eat grass, so grass decreases']]
  ];
  function ecoChain() {
    const [story, cause, X, Y, Z, ud, st] = pick(CHAINS);
    const [xUp, yUp, zUp] = ud.map(d => d > 0);
    const Zc = Z[1][0].toUpperCase() + Z[1].slice(1), w = up => Z[1] === 'grass' ? (up ? ' increases' : ' decreases') : (up ? ' increase' : ' decrease');
    return mk('ecoChain', 3, '7-1-04', 5, {
      story, q: 'What happens to ' + Z[1] + '?', a: Zc + w(zUp),
      errs: [[Zc + w(!zUp), 'Follow each link in turn', 2], ['No change to ' + Z[1], 'Effects spread through the web', 2]],
      steps: [['the change', st[0]], ['next link', st[1]], ['last link', st[2]]],
      pic: { k: 'scene', cards: [cd(0, 0, cause[0], cause[1], { k: 'R' }), cd(1, 0, X[0], X[1], { tag: xUp ? '↑ more' : '↓ fewer', tagk: xUp ? 'N' : 'R' }), cd(2, 0, Y[0], Y[1], { s: 1, tag: yUp ? '↑ more' : '↓ fewer', tagk: yUp ? 'N' : 'R' }), cd(3, 0, Z[0], '?', { q: true, d: Z[1] + (zUp ? ' ↑' : ' ↓') })],
        arrows: [{ a: 0, b: 1, k: 'R' }, { a: 1, b: 2, k: 'G' }, { a: 2, b: 3, k: 'G' }] }
    });
  }
  const RECOVER = [
    ['Lightning starts a fire in a ' + B('lodgepole pine') + ' forest. The heat opens pine cones, and ash covers the ground.', ['🔥', 'fire'], 'Plants return in stages',
      [['The forest never returns', 'Fire is a natural disturbance', 0], ['The forest is back in a year', 'Recovery takes many years', 2]],
      ['fire is a natural disturbance in the boreal', 'fireweed and grasses sprout in the sun and ash', 'shrubs, then pines return over many years'], ['🌸', 'fireweed'], ['🌲', 'pines']],
    ['A spring ' + B('flood') + ' covers a riverbank meadow with mud. The plants there are buried.', ['🌊', 'flood'], 'Plants return in stages',
      [['The meadow is gone for good', 'A flood is a natural disturbance', 0], ['It is all back in a week', 'Recovery takes seasons', 2]],
      ['a flood is a natural disturbance', 'grasses and willow shoots grow through the mud', 'over seasons the meadow fills in again'], ['🌱', 'grasses'], ['🌿', 'willows']],
    ['A native ' + B('prairie is plowed') + ' and farmed for 50 years. Then the farm is ' + B('left alone') + '.', ['🚜', 'plowing'], 'Prairie returns only slowly',
      [['Prairie returns in a season', 'Some changes pass a tipping point', 2], ['Wheat keeps growing wild', 'Crops need farmers to replant', 1]],
      ['plowing destroyed the prairie’s roots and soil', 'weeds and crops’ wild cousins move in first', 'native prairie needs decades and help to return'], ['🌾', 'weeds'], ['🌼', 'prairie']]
  ];
  function ecoRecover() {
    const [story, d, a, errs, st, s1, s2] = pick(RECOVER);
    return mk('ecoRecover', 3, '7-1-04', 5, {
      story, q: 'What happens over years?', a, errs,
      steps: [['disturbance', st[0]], ['first growth', st[1]], ['later', st[2]]],
      pic: row([[d[0], d[1], { k: 'R' }], [s1[0], s1[1], { s: 1 }], [s2[0], '?', { q: true, d: s2[1] }]], { arr: [{ s: 1, t: 'first' }, { s: 2, t: 'later' }] })
    });
  }
  const FIXES = [
    ['Ducks stop nesting at a farm pond. ' + B('Fertilizer runoff') + ' from the fields fills it with algae.', ['🦆', 'ducks leave'], ['🧪', 'runoff'], 'Plant a grass buffer strip',
      [['Bring in more ducks', 'Fix the cause, not the count', 2], ['Fence off the pond', 'A fence doesn’t stop runoff', 2]], ['ducks are leaving the pond', 'runoff adds fertilizer; algae take over', 'a grass strip soaks up runoff first'], ['🌾', 'buffer strip']],
    ['Trout vanish from a creek. ' + B('Cattle trample the banks') + ' and mud fills the water.', ['🐟', 'trout gone'], ['🐄', 'trampling'], 'Fence cattle off the banks',
      [['Stock more trout', 'Fix the cause, not the count', 2], ['Add fertilizer to the creek', 'That adds more pollution', 2]], ['trout are disappearing', 'trampled banks send mud into the water', 'a fence keeps cattle off the banks'], ['🚧', 'fence']],
    ['Wildflowers vanish from a park slope. ' + B('Hikers cut new paths') + ' that crush plants.', ['🌼', 'flowers gone'], ['🥾', 'new paths'], 'Keep hikers on one trail',
      [['Plant new flowers once', 'New paths would crush them', 2], ['Pave the whole slope', 'That destroys the habitat', 2]], ['wildflowers are disappearing', 'feet crush plants and wear away soil', 'one marked trail protects the rest'], ['🪧', 'one trail']],
    ['Burrowing owls lose their homes on a ranch. The ' + B('ground squirrels are poisoned') + ', and owls nest in old squirrel burrows.', ['🦉', 'owls leave'], ['☠️', 'poison'], 'Stop poisoning the squirrels',
      [['Hang nest boxes in trees', 'These owls nest in burrows', 1], ['Feed the owls', 'Food isn’t the problem', 1]], ['burrowing owls are leaving', 'no squirrels means no burrows to nest in', 'leaving squirrels keeps the burrows'], ['🐿️', 'squirrels stay']]
  ];
  function ecoSteward() {
    const [story, prob, cause, a, errs, st, fix] = pick(FIXES);
    return mk('ecoSteward', 3, '7-1-04', 6, {
      story, q: 'Best fix?', a, errs,
      steps: [['problem', st[0]], ['cause', st[1]], ['fix', st[2]]],
      pic: { k: 'scene', cards: [cd(0, 0, cause[0], cause[1], { k: 'R', s: 1 }), cd(1, 0, prob[0], prob[1], { x: false, hl: true }), cd(0, 1, fix[0], '?', { q: true, d: fix[1] })], arrows: [{ a: 0, b: 1, k: 'R', s: 1, t: 'causes' }, { a: 2, b: 0, k: 'N', s: 2, t: 'stops' }] }
    });
  }

  /* ============ 7-2 · Plants for Food and Fibre ============ */
  const PARTS = {
    chloroplast: ['Chloroplasts', 'small green ovals', 'Chloroplasts are small and green', 'they make food'],
    wall: ['Cell wall', 'a thick, stiff edge around each cell', 'The wall is the stiff edge', 'it gives the box shape'],
    vacuole: ['Vacuole', 'one large clear sac filling most of each cell', 'The vacuole is one big sac', 'it stores water'],
    nucleus: ['Nucleus', 'one dark, round body in each cell', 'The nucleus is one round body', 'it controls the cell'],
    membrane: ['Cell membrane', 'a thin layer just inside the wall', 'The membrane is a thin layer', 'it lets materials in and out']
  };
  function plCell() {
    const part = pick(Object.keys(PARTS)), P = PARTS[part], n = pick(NAMES);
    const spec = part === 'chloroplast' ? pick(['an elodea leaf', 'a moss leaf', 'a spinach leaf']) : pick(['onion skin', 'an elodea leaf', 'a moss leaf']);
    const others = shuffle(Object.keys(PARTS).filter(k => k !== part)).slice(0, 3);
    return mk('plCell', 1, '7-2-01', 1, {
      story: 'Under a microscope, ' + n + ' looks at ' + spec + '. ' + n + ' sees ' + B(P[1]) + '.',
      q: 'What are these?', a: P[0],
      errs: others.map(k => [PARTS[k][0], PARTS[part][2], 0]),
      steps: [['match', P[1].replace(/^(a|one) /, '') + ': ' + P[0].toLowerCase()]],
      pic: { k: 'cell', part, d: P[0], chl: spec !== 'onion skin' }
    });
  }
  const VESSEL = [
    ['x', 'A ' + B('carrot') + ' plant takes in water through its roots. The water must reach the leaves.', ['🥕', 'roots'], ['🍃', 'leaves'], 'water'],
    ['x', 'A ' + B('sunflower') + ' on a hot day loses water from its leaves. New water comes up from the soil.', ['🟤', 'roots'], ['🌻', 'leaves'], 'water'],
    ['x', 'A ' + B('wheat') + ' plant takes dissolved minerals in at its roots. They are needed in the leaves.', ['🟤', 'roots'], ['🌾', 'leaves'], 'minerals'],
    ['p', 'Leaves of a ' + B('sugar beet') + ' make sugar all summer. The sugar is stored in the big root.', ['🍃', 'leaves'], ['🟣', 'root'], 'sugar'],
    ['p', 'Leaves of a ' + B('potato') + ' plant make sugar. It is stored in the potatoes underground.', ['🍃', 'leaves'], ['🥔', 'potatoes'], 'sugar'],
    ['p', 'Leaves of a ' + B('wheat') + ' plant make sugar. It moves up to fill the kernels in the head.', ['🍃', 'leaves'], ['🌾', 'kernels'], 'sugar']
  ];
  function plVessel() {
    const [k, story, from, to, what] = pick(VESSEL), xy = k === 'x', down = !xy && from[1] === 'leaves' && to[1] !== 'kernels';
    return mk('plVessel', 1, '7-2-02', 2, {
      story, q: 'Which tissue carries it?', a: xy ? 'Xylem' : 'Phloem',
      errs: [[xy ? 'Phloem' : 'Xylem', xy ? 'Phloem carries sugar from leaves' : 'Xylem carries water up', 0], ['Root hairs', 'Root hairs absorb; they don’t carry', 0]],
      steps: [[xy ? 'xylem' : 'phloem', xy ? 'xylem carries water and minerals up from roots' : 'phloem carries sugar from leaves to where it’s used']],
      pic: { k: 'scene', cards: [cd(0, down ? 0 : 1, from[0], from[1]), cd(0, down ? 1 : 0, to[0], to[1])], arrows: [{ a: 0, b: 1, t: what + ': ?', q: true, d: what + ': ' + (xy ? 'xylem' : 'phloem'), k: 'L' }], w: 170 }
    });
  }
  const REPRO = [
    ['A', 'A strawberry plant sends out ' + B('runners') + '. New plants root where the runners touch soil.', ['🍓', 'strawberry'], 'one parent: runners grow copies'],
    ['A', 'A farmer cuts a ' + B('seed potato into pieces') + ' with eyes. Each piece grows a new plant.', ['🥔', 'potato'], 'one parent: each piece is a copy'],
    ['A', 'Aspens send up ' + B('new shoots from their roots') + '. A whole grove can be one plant.', ['🌳', 'aspen'], 'one parent: root shoots are copies'],
    ['A', 'Hana puts a ' + B('stem cutting') + ' from a spider plant in water. It grows roots.', ['🪴', 'spider plant'], 'one parent: the cutting is a copy'],
    ['A', 'A ' + B('tulip bulb splits') + ' into new bulbs underground. Each one flowers.', ['🌷', 'tulip'], 'one parent: new bulbs are copies'],
    ['S', 'Bees carry ' + B('pollen') + ' between apple blossoms. ' + B('Seeds') + ' form inside the apples.', ['🍎', 'apple'], 'pollen joins an egg: seeds from two parents'],
    ['S', 'Wind blows ' + B('pollen') + ' from corn tassels onto the silks. ' + B('Kernels') + ' form on the cob.', ['🌽', 'corn'], 'pollen joins an egg: seeds from two parents'],
    ['S', 'A farmer plants canola ' + B('seeds') + '. Each formed after ' + B('pollen') + ' reached a flower.', ['🌼', 'canola'], 'pollen joins an egg: seeds from two parents'],
    ['S', 'Pollen from one sunflower lands on the ' + B('stigma') + ' of another. ' + B('Seeds') + ' form in its head.', ['🌻', 'sunflower'], 'pollen joins an egg: seeds from two parents']
  ];
  function plRepro() {
    const [k, story, ic, why] = pick(REPRO), sx = k === 'S';
    return mk('plRepro', 1, '7-2-04', 4, {
      story, q: 'What kind of reproduction?', a: sx ? 'Sexual' : 'Asexual',
      errs: [[sx ? 'Asexual' : 'Sexual', sx ? 'Pollen joins two parents' : 'No pollen or seeds involved', 0], ['Photosynthesis', 'That makes food, not offspring', 0]],
      steps: [[sx ? 'sexual' : 'asexual', why]],
      pic: sx ? { k: 'scene', cards: [cd(0, 0, ic[0], 'parent 1'), cd(0, 1, ic[0], 'parent 2'), cd(1, .5, '🌰', '?', { q: true, d: 'seed: sexual' })], arrows: [{ a: 0, b: 2, t: 'pollen', k: 'Y' }, { a: 1, b: 2, t: 'egg', k: 'P' }] }
        : row([[ic[0], 'parent'], [ic[0], '?', { q: true, d: 'copy: asexual' }]], { arr: [{ t: 'one parent', k: 'T' }] })
    });
  }
  const NEEDS = [
    ['light', 'A bean plant is kept in a ' + B('dark closet') + ' for two weeks. It gets water and air.', 'no light', 'It can’t make food; it weakens'],
    ['water', 'A pot of wheat is ' + B('not watered') + ' for two weeks. It sits in a sunny window.', 'no water', 'It can’t make food; it wilts'],
    ['co2', 'A plant is sealed in a jar with a chemical that ' + B('removes all CO₂') + '. It has light and water.', 'no CO₂', 'It can’t make food; it weakens'],
    ['chl', 'A geranium has some ' + B('white leaves with no chlorophyll') + '. They get light, water and air.', 'no chlorophyll', 'Those leaves can’t make food']
  ];
  function plNeeds() {
    const [miss, story, gone, a] = pick(NEEDS);
    const ins = [['☀️', 'light', 'light'], ['💧', 'water', 'water'], ['💨', 'CO₂', 'co2']];
    return mk('plNeeds', 2, '7-2-03', 3, {
      story, q: 'What happens to it?', a,
      errs: [['It feeds on the soil instead', 'Soil has no food for it', 1], ['It makes extra oxygen', 'Missing input: no photosynthesis', 0], ['Nothing changes', 'Photosynthesis needs every input', 0]],
      steps: [['inputs', 'light + water + CO₂ → glucose + oxygen' + (miss === 'chl' ? ' (needs chlorophyll)' : '')], ['missing', gone + ', so no glucose is made']],
      pic: { k: 'scene', cards: ins.map((x, j) => cd(0, j, x[0], x[1], miss === x[2] ? { x: true } : {})).concat([cd(1, 1, miss === 'chl' ? '🤍' : '🍃', miss === 'chl' ? 'white leaf' : 'leaf', miss === 'chl' ? { k: 'R' } : {}), cd(2, 1, '🍬', '?', { q: true, d: 'no glucose' })]),
        arrows: [{ a: 0, b: 3, k: miss === 'light' ? 'R' : 'G' }, { a: 1, b: 3, k: miss === 'water' ? 'R' : 'G' }, { a: 2, b: 3, k: miss === 'co2' ? 'R' : 'G' }, { a: 3, b: 4, k: 'R', s: 1 }], h: 76, w: 128 }
    });
  }
  const MASS = [['willow', '🌳', [2, 3], [70, 80], [50, 90], 5], ['pumpkin plant', '🎃', [0, 0], [15, 25], [20, 40], 1], ['sunflower', '🌻', [0, 0], [2, 4], [10, 25], 1], ['spruce seedling', '🌲', [1, 1], [20, 30], [30, 60], 6]];
  function plMass() {
    const [nm, ic, s0, s1, lost, yrs] = pick(MASS), m0 = rnd(s0[0], s0[1]), m1 = rnd(s1[0], s1[1]), g = rnd(lost[0], lost[1]);
    const start = m0 ? m0 + ' kg' : 'a seed', yy = yrs === 1 ? 'one summer' : yrs + ' years';
    return mk('plMass', 2, '7-2-03', 3, {
      story: 'A ' + nm + ' grows from ' + B(start) + ' to ' + B(m1 + ' kg') + ' in ' + yy + '. The soil in its pot loses only ' + B(g + ' g') + '.',
      q: 'Source of the mass?', a: 'CO₂ from the air, and water',
      errs: [['The soil', 'Soil lost only a few grams', 0], ['Sunlight', 'Light is energy, not matter', 1], ['Fertilizer', 'Minerals are tiny amounts', 0]],
      steps: [['the soil', 'the soil lost only ' + g + ' g: not the source'], ['photosynthesis', 'glucose is built from CO₂ and water']],
      pic: { k: 'scene', cards: [cd(0, 0, '💨', 'CO₂ in air', { s: 1 }), cd(0, 1, '💧', 'water', { s: 1 }), cd(1, .5, ic, '+' + (m1 - m0) + ' kg', { hl: true }), cd(2, .5, '🟫', 'soil −' + g + ' g', { k: 'M' })], arrows: [{ a: 0, b: 2, k: 'N', s: 1 }, { a: 1, b: 2, k: 'N', s: 1 }] }
    });
  }
  const POLL = [['alfalfa seed', '🌸', 'leafcutter bees'], ['canola', '🌼', 'honeybees'], ['apple', '🍎', 'bees'], ['raspberry', '🍇', 'bumblebees'], ['clover seed', '☘️', 'honeybees']];
  function plPollin() {
    const [crop, ic, bees] = pick(POLL), more = rnd(0, 1);
    return mk('plPollin', 2, '7-2-04', 4, {
      story: more ? 'A farmer brings ' + B('hives of ' + bees) + ' to ' + (/^[aeiou]/.test(crop) ? 'an ' : 'a ') + crop + ' field in full bloom. The plants are healthy.'
        : 'A spray ' + B('kills most of the ' + bees) + ' near ' + (/^[aeiou]/.test(crop) ? 'an ' : 'a ') + crop + ' field. The plants still flower well.',
      q: 'What happens to seeds?', a: more ? 'More seeds form' : 'Fewer seeds form',
      errs: [[more ? 'Fewer seeds form' : 'More seeds form', 'Bees carry the pollen', 1], ['No change; flowers are fine', 'Flowers need pollen delivered', 0]],
      steps: [['pollination', bees + ' carry pollen from anther to stigma'], ['seeds', (more ? 'more' : 'fewer') + ' flowers pollinated, so ' + (more ? 'more' : 'fewer') + ' seeds']],
      pic: row([['🐝', bees, more ? { hl: true } : { x: true }], [ic, 'flowers'], ['🌰', '?', { q: true, d: more ? 'more seeds' : 'fewer seeds' }]], { arr: [{ t: 'pollen', k: more ? 'Y' : 'R', dash: !more }, { s: 1, t: 'seeds', k: 'G' }] })
    });
  }
  const BREED = [['barley', '🌾', 'grows well in ' + B('dry years'), 'did best in the dry years', 'drought'], ['wheat', '🌾', 'survives an ' + B('early frost'), 'survived the frost', 'frost'],
    ['oats', '🌾', 'has ' + B('short, stiff stems'), 'had the stiffest stems', 'stiff stems'], ['canola', '🌼', 'resists a ' + B('leaf disease'), 'stayed healthy', 'disease']];
  function plBreed() {
    if (rnd(0, 3) === 0) return mk('plBreed', 3, '7-2-05', 6, {
      story: 'Scientists ' + B('move a gene') + ' from a bacterium into canola cells. The new canola survives a weed spray.',
      q: 'What method is this?', a: 'Genetic modification (GMO)',
      errs: [['Selective breeding', 'A gene was moved by scientists', 0], ['Asexual reproduction', 'It changes genes; not a copy', 2]],
      steps: [['the gene', 'a gene is taken from a bacterium'], ['moved', 'scientists put it into canola cells'], ['result', 'GMO canola now resists the spray']],
      pic: row([['🦠', 'bacterium'], ['🧬', 'gene', { s: 1 }], ['🌼', '?', { q: true, d: 'GMO canola' }]], { arr: [{ t: 'gene out', k: 'P', s: 1 }, { t: 'into canola', k: 'P', s: 1 }] })
    });
    const [crop, ic, want, best, trait] = pick(BREED), n = pick(NAMES);
    return mk('plBreed', 3, '7-2-05', 6, {
      story: n + ' wants a ' + crop + ' crop that ' + want + '. Each year, ' + n + ' plants ' + B('seeds only from the plants that ' + best) + '.',
      q: 'What will happen?', a: 'The trait gets more common',
      errs: [['It becomes a GMO', 'No genes moved in a lab', 0], ['Every plant is tough next year', 'It takes many generations', 2]],
      steps: [['method', 'choosing the parents: selective breeding'], ['offspring', 'the seeds inherit the parents’ traits'], ['over time', 'year after year, ' + trait + ' gets more common']],
      pic: row([[ic, 'year 1'], [ic, 'year 5', { s: 1 }], [ic, '?', { q: true, d: 'year 20: ' + trait }]], { arr: [{ t: 'best seeds', k: 'G' }, { t: 'best seeds', k: 'G', s: 2 }] })
    });
  }
  const DARK = [
    ['Thick ' + B('wildfire smoke') + ' blocks sunlight over a lake for weeks. ' + B('Algae feed water fleas, and minnows eat the fleas') + '.', ['🌫️', 'smoke']],
    ['A storm washes ' + B('mud') + ' into a pond, making it murky for weeks. ' + B('Algae feed water fleas, and minnows eat the fleas') + '.', ['🟤', 'murky water']],
    ['Deep ' + B('snow covers the ice') + ' on a pond all winter. ' + B('Algae feed water fleas, and minnows eat the fleas') + '.', ['❄️', 'snow on ice']]
  ];
  function plLight() {
    const [story, cause] = pick(DARK);
    return mk('plLight', 3, '7-2-03', 3, {
      story, q: 'Effect on minnows?', a: 'Fewer minnows over time',
      errs: [['None: fish don’t need light', 'Their food chain starts with light', 1], ['More: algae grow in shade', 'Algae need light to make food', 0]],
      steps: [['producers', 'less light, so algae make less glucose'], ['next level', 'water fleas get less food and decrease'], ['top', 'minnows get less food and decrease']],
      pic: row([[cause[0], cause[1], { k: 'R' }], ['🟢', 'algae', { tag: '↓ less food', tagk: 'R' }], ['🦐', 'water fleas', { s: 1, tag: '↓ fewer', tagk: 'R' }], ['🐟', '?', { q: true, d: 'minnows ↓' }]], { arr: [{ t: 'blocks light', k: 'R' }, { k: 'G' }, { k: 'G' }] })
    });
  }
  const ROT = [['canola', '🌼', 'clubroot', 'a soil-borne disease'], ['wheat', '🌾', 'wheat midge', 'an insect'], ['potatoes', '🥔', 'potato beetle', 'a beetle']];
  function plFarm() {
    const [crop, ic, pest, kind] = pick(ROT);
    return mk('plFarm', 3, '7-2-05', 5, {
      story: 'A farm grows ' + B('only ' + crop) + ' in the same field every year. ' + B(pest[0].toUpperCase() + pest.slice(1)) + ', ' + kind + ' that attacks ' + crop + ', builds up there.',
      q: 'Best fix?', a: 'Rotate to a different crop',
      errs: [['Plant ' + crop + ' closer together', 'More host plants feed the pest', 1], ['Add more fertilizer', 'Fertilizer doesn’t stop pests', 2]],
      steps: [['practice', 'one crop every year: a monoculture'], ['pest', 'the ' + pest + ' always has food there'], ['fix', 'a different crop starves out the ' + pest]],
      pic: row([[ic, crop + ' every year', { k: 'R' }], ['🐛', pest, { s: 1, k: 'R' }], ['🔄', '?', { q: true, d: 'rotate crops' }]], { arr: [{ t: 'feeds', k: 'R', s: 1 }, { t: 'stopped by', k: 'N', s: 2 }] })
    });
  }

  /* ============ 7-3 · Heat and Temperature ============ */
  const MODES = [
    ['cd', 'stirs hot soup with a ' + B('metal spoon') + '. Soon the handle feels hot.', ['🍲', 'soup'], ['🥄', 'spoon handle']],
    ['cd', 'fries an egg. The ' + B('hot pan touches the egg') + ' and cooks it.', ['🍳', 'hot pan'], ['🥚', 'egg']],
    ['cd', 'holds an ' + B('ice cube in a bare hand') + '. It melts.', ['✋', 'hand'], ['🧊', 'ice cube']],
    ['cd', 'sits on a ' + B('cold metal bench') + ' at the bus stop. The bench warms where they sit.', ['🧍', 'body'], ['🪑', 'bench']],
    ['cv', 'turns on a heater by the floor. ' + B('Warm air rises') + ' and spreads across the room.', ['🔥', 'heater'], ['🏠', 'room air']],
    ['cv', 'heats a pot of water. The ' + B('hot water rises') + ' and cooler water sinks to the bottom.', ['🔥', 'burner'], ['🫕', 'water in pot']],
    ['cv', 'watches a hot-air balloon. A burner ' + B('heats the air inside') + ', and the warm air rises.', ['🔥', 'burner'], ['🎈', 'balloon air']],
    ['rd', 'stands in the ' + B('sunshine') + ' on a cold day. Their face feels warm.', ['☀️', 'sun'], ['🙂', 'face']],
    ['rd', 'holds hands out ' + B('beside a campfire') + ', a metre away. The hands warm up.', ['🔥', 'campfire'], ['🙌', 'hands']],
    ['rd', 'sees a ' + B('heat lamp') + ' shining down on fries. The fries stay warm.', ['💡', 'heat lamp'], ['🍟', 'fries']]
  ];
  const MN = { cd: 'Conduction', cv: 'Convection', rd: 'Radiation' };
  const MWHY = { cd: 'touching particles pass the energy along', cv: 'warm fluid rises and carries the heat', rd: 'energy travels as waves, with no contact' };
  const MCUE = { cd: 'Here it passes by touch', cv: 'A warm fluid moves here', rd: 'No contact; it travels as waves' };
  function heMode() {
    const [m, s, from, to] = pick(MODES), n = pick(NAMES), wrong = ['cd', 'cv', 'rd'].filter(x => x !== m);
    return mk('heMode', 1, '7-3-03', 4, {
      story: n + ' ' + s, q: 'Which heat transfer?', a: MN[m],
      errs: wrong.map(w => [MN[w], MCUE[m], 0]),
      steps: [[MN[m].toLowerCase(), MWHY[m]]],
      pic: row([[from[0], from[1], { k: 'R' }], [to[0], to[1]]], { arr: [{ t: 'heat: ?', q: true, d: MN[m].toLowerCase(), k: 'G' }] })
    });
  }
  const THINGS = [['🥤', 'can of pop', [3, 6]], ['🍦', 'tub of ice cream', [-15, -10]], ['☕', 'mug of cocoa', [60, 75]], ['🥔', 'baked potato', [80, 95]], ['🏒', 'puck from outside', [-20, -10]], ['🍲', 'bowl of soup', [55, 70]]];
  function heFlow() {
    const [ic, nm, tr] = pick(THINGS), room = rnd(19, 23), same = rnd(0, 3) === 0, T = same ? room : rnd(tr[0], tr[1]);
    const thing = same ? pick([['📕', 'book'], ['🪑', 'wooden chair'], ['🧸', 'teddy bear']]) : [ic, nm], hot = T > room;
    const nmT = thing[1], dirT = hot ? nmT + ' → room' : 'room → ' + nmT;
    return mk('heFlow', 1, '7-3-01', 2, {
      story: 'A ' + nmT + ' is at ' + B(T + ' °C') + (same ? ' after a day indoors' : '') + '. It sits in a room at ' + B(room + ' °C') + '.',
      q: 'Heat flows which way?', a: same ? 'No heat flows' : dirT,
      errs: same ? [[nmT + ' → room', 'Same temperature: no flow', 0], ['room → ' + nmT, 'Same temperature: no flow', 0]]
        : [[hot ? 'room → ' + nmT : nmT + ' → room', 'Heat moves from hot to cold', 0], ['No heat flows', 'Different temperatures: heat flows', 0]],
      steps: [['heat flow', same ? 'both at ' + T + ' °C, so no heat flows' : 'heat flows from the ' + (hot ? nmT : 'room') + ' (hotter) to the ' + (hot ? 'room' : nmT)]],
      pic: { k: 'scene', cards: [cd(0, 0, thing[0], nmT + ' · ' + T + ' °C', { k: hot ? 'R' : same ? 'M' : 'L' }), cd(1, 0, '🏠', 'room · ' + room + ' °C', { k: 'M' })],
        arrows: same ? [] : [hot ? { a: 0, b: 1, t: 'heat', k: 'R', dir: true } : { a: 1, b: 0, t: 'heat', k: 'R', dir: true }], w: 190 }
    });
  }
  const EXP = [
    ['e', 'A metal lid is stuck on a glass jar. ' + B('Hot water') + ' is run over the lid, and it twists off.', ['🫙', 'lid'], 'heated'],
    ['e', 'On a ' + B('hot summer day') + ', power lines between poles hang lower.', ['🔌', 'power lines'], 'heated'],
    ['e', 'The red liquid in a thermometer ' + B('rises') + ' when it is moved into the sun.', ['🌡️', 'liquid'], 'heated'],
    ['e', 'Gaps in a bridge deck get ' + B('narrower') + ' on a hot afternoon.', ['🌉', 'bridge deck'], 'heated'],
    ['c', 'A full balloon is put in a ' + B('freezer') + ' for an hour. It comes out smaller.', ['🎈', 'balloon air'], 'cooled'],
    ['c', 'A basketball left outside in ' + B('January') + ' feels soft and flat.', ['🏀', 'air inside'], 'cooled'],
    ['c', 'Gaps between sidewalk slabs get ' + B('wider') + ' on a very cold night.', ['🧱', 'slabs'], 'cooled'],
    ['c', 'A bike tire pumped up indoors looks ' + B('low') + ' after a cold night outside.', ['🚲', 'tire air'], 'cooled']
  ];
  function heExpand() {
    const [k, story, obj, how] = pick(EXP), e = k === 'e';
    return mk('heExpand', 1, '7-3-02', 3, {
      story, q: 'What did particles do?', a: e ? 'Spread apart: it expanded' : 'Moved closer: it contracted',
      errs: [[e ? 'Moved closer: it contracted' : 'Spread apart: it expanded', e ? 'Heating spreads particles apart' : 'Cooling lets particles move closer', 0], [e ? 'Each particle got bigger' : 'Each particle got smaller', 'Particles never change size', 0]],
      steps: [[e ? 'heated' : 'cooled', e ? 'particles move faster and spread apart: expands' : 'particles slow down and move closer: contracts']],
      pic: row([[obj[0], obj[1]], [e ? '↔️' : '➡️⬅️', '?', { q: true, d: e ? 'expands' : 'contracts' }]], { arr: [{ t: how, k: e ? 'R' : 'L' }] })
    });
  }
  const AMT = [[['🍵', 'teacup'], ['🛁', 'bathtub'], [38, 45]], [['🫖', 'kettle'], ['♨️', 'hot tub'], [37, 40]], [['🥄', 'spoonful of soup'], ['🍲', 'pot of soup'], [60, 80]], [['💧', 'drop of water'], ['🏞️', 'lake'], [15, 22]]];
  function heAmount() {
    const [sm, bg, tr] = pick(AMT), T = rnd(tr[0], tr[1]), sw = rnd(0, 1), A = sw ? bg : sm, Bb = sw ? sm : bg;
    return mk('heAmount', 2, '7-3-01', 2, {
      story: 'A ' + B(A[1]) + ' and a ' + B(Bb[1]) + ' are both at ' + B(T + ' °C') + '.',
      q: 'More thermal energy?', a: 'The ' + bg[1],
      errs: [['The ' + sm[1], 'More water: more total energy', 1], ['Same: same temperature', 'Temperature isn’t total energy', 0]],
      steps: [['temperature', 'same ' + T + ' °C: particles have the same average speed'], ['amount', 'the ' + bg[1] + ' has far more particles: more energy']],
      pic: { k: 'scene', cards: [cd(0, 0, A[0], A[1] + ' · ' + T + ' °C', A === bg ? { tag: 'more energy' } : {}), cd(1, 0, Bb[0], Bb[1] + ' · ' + T + ' °C', Bb === bg ? { tag: 'more energy' } : {})], w: 200 }
    });
  }
  const FEEL = [[['🪑', 'metal bench'], ['🪵', 'wooden bench'], 'sat outside all night', -8, -2], [['🔩', 'metal railing'], ['🪵', 'wooden railing'], 'are on the same deck', 10, 18],
    [['🔘', 'metal doorknob'], ['🚪', 'wooden door'], 'are in the same room', 20, 22], [['🛝', 'steel slide'], ['🟥', 'plastic slide'], 'sat in the shade all day', 8, 14]];
  function heFeel() {
    const [m, w, where, lo, hi] = pick(FEEL), T = rnd(lo, hi), Tt = (T < 0 ? '−' + (-T) : T) + ' °C';
    return mk('heFeel', 2, '7-3-03', 4, {
      story: 'A ' + B(m[1]) + ' and a ' + B(w[1]) + ' ' + where + ' at ' + B(Tt) + '. The metal one feels colder to touch.',
      q: 'Why the difference?', a: 'Metal pulls heat away faster',
      errs: [['Metal is at a lower temperature', 'Both are at ' + Tt, 0], ['Cold flows out of the metal', 'Heat flows; cold does not', 1]],
      steps: [['temperature', 'both are at ' + Tt + ', the same as the air'], ['conduction', 'metal conducts heat from your hand faster']],
      pic: { k: 'scene', cards: [cd(0, 1, m[0], m[1]), cd(1, 0, '✋', 'your hand'), cd(2, 1, w[0], w[1])], arrows: [{ a: 1, b: 0, t: 'fast', k: 'R', s: 1 }, { a: 1, b: 2, t: 'slow', k: 'M', s: 1, dash: true }] }
    });
  }
  // cards: two cards, the water one (wi) gets the heat-capacity tag
  const CAP = [
    ['On a sunny day at Sylvan Lake, the ' + B('sand') + ' gets too hot to walk on. The ' + B('lake water') + ' stays cool.', 'Why the difference?', 'Water needs more heat to warm',
      [['The lake gets less sunlight', 'Both get the same sunlight', 0], ['Sand is a better insulator', 'It’s about heat capacity', 1]], ['same heat', 'sand and water get the same sunlight'], ['heat capacity', 'water warms far less for the same heat'], [['🏖️', 'sand · hot'], ['🌊', 'water · cool']], 1],
    [B('Vancouver') + ' sits by the ocean; ' + B('Calgary') + ' is far inland. Vancouver’s winters are much milder.', 'Why milder winters?', 'The ocean stores heat',
      [['Vancouver is much farther south', 'They’re at about the same latitude', 0], ['Mountains make heat', 'Mountains don’t make heat', 0]], ['summer', 'the ocean soaks up lots of heat'], ['winter', 'it gives the heat back slowly: mild'], [['🌊', 'Vancouver · mild'], ['🏔️', 'Calgary · cold']], 0],
    ['Car engines are cooled by a ' + B('water mix') + ', not by air alone. It flows around the engine and carries heat to the radiator.', 'Why use water?', 'It soaks up lots of heat',
      [['Water is a good insulator', 'A coolant must carry heat', 1], ['Water is colder than air', 'It’s about heat capacity', 0]], ['engine', 'the engine makes lots of heat'], ['heat capacity', 'water absorbs lots of heat with little warming'], [['🚗', 'engine · hot'], ['💧', 'coolant']], 1]
  ];
  function heCapacity() {
    const [story, q, a, errs, s0, s1, cards, wi] = pick(CAP);
    return mk('heCapacity', 2, '7-3-04', 5, {
      story, q, a, errs, steps: [s0, s1],
      pic: { k: 'scene', cards: cards.map((x, j) => cd(j, 0, x[0], x[1], j === wi ? { tag: 'high heat capacity', tagk: 'L' } : {})), w: 210 }
    });
  }
  const INS = [
    [['🏠', 'cabin'], 'A cabin’s walls are filled with ' + B('fibreglass') + '. It stays warm in winter and cool in summer.', 'Why both seasons?', 'It slows heat flow both ways',
      [['It makes heat in winter', 'Insulation makes no heat', 2], ['It blocks cold coming in', 'Heat flows; cold does not', 0]], ['winter', 'heat flows out from the warm inside'], ['summer', 'heat flows in from the hot outside'], ['insulation', 'trapped air slows heat flow both ways']],
    [['🥤', 'thermos'], 'A thermos keeps ' + B('hot cocoa hot') + '. The same thermos keeps ' + B('iced tea cold') + '.', 'Why both drinks?', 'It slows heat flow both ways',
      [['It makes the cocoa hot', 'A thermos makes no heat', 2], ['It traps cold inside', 'Heat flows; cold does not', 0]], ['cocoa', 'heat would flow out of the hot cocoa'], ['iced tea', 'heat would flow into the cold tea'], ['thermos', 'its walls slow heat flow both ways']],
    [['🧥', 'jacket'], 'A ' + B('down jacket') + ' is put on a statue outside with a thermometer inside. The reading does not rise.', 'Why no warmer?', 'The statue makes no heat',
      [['The jacket is broken', 'Jackets only slow heat loss', 2], ['Cold is trapped inside', 'Heat flows; cold does not', 0]], ['you', 'your body makes its own heat'], ['statue', 'a statue makes no heat'], ['jacket', 'a jacket only slows heat loss']]
  ];
  function heInsul() {
    const [ic, story, q, a, errs, s0, s1, s2] = pick(INS);
    return mk('heInsul', 3, '7-3-05', 6, {
      story, q, a, errs, steps: [s0, s1, s2],
      pic: { k: 'scene', cards: [cd(0, 0, '🔥', 'hot side', { k: 'R' }), cd(1, 0, ic[0], ic[1], { hl: true, tag: 'slows heat' }), cd(2, 0, '❄️', 'cold side', { k: 'L' })], arrows: [{ a: 0, b: 1, t: 'heat', k: 'R', s: 0 }, { a: 1, b: 2, t: 'slowly', k: 'R', dash: true, s: 2 }] }
    });
  }
  const STATE = [
    ['Wet laundry hangs outside on a ' + B('sunny day') + '. By afternoon it is dry.', 'Where did water go?', 'It became water vapour (gas)',
      [['The water was destroyed', 'Matter is not destroyed', 2], ['Its particles grew and floated', 'Particles speed up, not grow', 1]], ['heat in', 'the sun adds heat to the water'], ['particles', 'water particles move faster and spread out'], ['state', 'they escape into the air as vapour'], ['👕', 'wet laundry'], ['☁️', 'vapour'], 1],
    ['A ' + B('cold can') + ' of pop sits out on a humid day. Drops of water form on the outside.', 'Source of the drops?', 'Water vapour in the air',
      [['The pop leaked through the can', 'The can is sealed', 0], ['The cold made new water', 'Cooling changes state; no new matter', 2]], ['heat out', 'air touching the can loses heat'], ['particles', 'vapour particles slow down and move closer'], ['state', 'they condense into liquid drops'], ['💨', 'humid air'], ['💧', 'drops'], 0],
    ['A pat of ' + B('butter') + ' is put in a hot pan. It turns to liquid.', 'What did particles do?', 'Moved faster and spread apart',
      [['The particles melted', 'Particles don’t melt; matter changes state', 1], ['Cold left the butter', 'Heat flowed in; cold doesn’t flow', 0]], ['heat in', 'heat flows from the pan into the butter'], ['particles', 'particles vibrate faster and pull apart'], ['state', 'solid butter becomes a liquid'], ['🧈', 'butter'], ['🫗', 'liquid'], 1]
  ];
  function heState() {
    const [story, q, a, errs, s0, s1, s2, A0, A1, hot] = pick(STATE);
    return mk('heState', 3, '7-3-02', 3, {
      story, q, a, errs, steps: [s0, s1, s2],
      pic: row([[A0[0], A0[1]], [hot ? '🔴' : '🔵', hot ? 'particles faster' : 'particles slower', { s: 1 }], [A1[0], '?', { q: true, d: A1[1] }]], { arr: [{ t: hot ? 'heat in' : 'heat out', k: hot ? 'R' : 'L' }, { k: 'G', s: 2 }] })
    });
  }
  const THERM = [['A power plant pumps ' + B('warm cooling water') + ' into a river.', ['🏭', 'power plant']], ['A factory sends ' + B('hot wastewater') + ' into a creek.', ['🏭', 'factory']],
    ['The trees shading a creek are ' + B('cut down') + ', and the sun beats on the water.', ['🪓', 'trees cut']], ['Rain runs off a ' + B('hot parking lot') + ' into a stream.', ['🅿️', 'hot pavement']]];
  function heThermal() {
    const [s, cause] = pick(THERM), d = rnd(3, 8);
    return mk('heThermal', 3, '7-3-05', 6, {
      story: s + ' Downstream, the water is ' + B(d + ' °C warmer') + '.',
      q: 'Effect on bull trout?', a: 'Fewer trout: less oxygen',
      errs: [['More trout: warmth helps', 'Trout need cold, oxygen-rich water', 2], ['None: the heat leaves fast', 'Water holds heat a long time', 0]],
      steps: [['warmer', 'the water downstream warms by ' + d + ' °C'], ['oxygen', 'warm water holds less dissolved oxygen'], ['trout', 'trout struggle, so there are fewer trout']],
      pic: row([[cause[0], cause[1], { k: 'R' }], ['🌡️', 'water +' + d + ' °C'], ['🫧', 'oxygen', { s: 1, tag: '↓ less', tagk: 'R' }], ['🐟', '?', { q: true, d: 'trout ↓' }]], { arr: [{ k: 'R' }, { k: 'G', s: 1 }, { k: 'G', s: 2 }] })
    });
  }

  /* ============ 7-4 · Structures and Forces ============ */
  const TYPES = [
    ['sh', '🛖', 'An ' + B('igloo') + ' is built of snow blocks curved into a thin dome.', 'thin curved shell holds its shape'],
    ['sh', '🥚', 'An ' + B('eggshell') + ' is thin and curved, yet strong when squeezed end to end.', 'a thin curved outer layer'],
    ['sh', '⛑️', 'A ' + B('bike helmet') + ' is a thin curved layer with nothing inside it but your head.', 'a thin curved outer layer'],
    ['sh', '🛶', 'A ' + B('canoe') + ' is one thin, curved hull with an open inside.', 'a thin curved outer layer'],
    ['fr', '🗼', 'A ' + B('power line tower') + ' is steel bars joined in triangles. You can see through it.', 'parts joined together, mostly open'],
    ['fr', '🚲', 'A ' + B('bicycle') + ' is metal tubes joined at the ends.', 'parts joined together, mostly open'],
    ['fr', '🏗️', 'The ' + B('wall studs') + ' of a new house are boards nailed into a skeleton.', 'parts joined together, mostly open'],
    ['so', '🧱', 'A ' + B('brick wall') + ' is built of bricks and mortar all the way through.', 'material all the way through'],
    ['so', '🌊', 'A ' + B('concrete dam') + ' is thick and filled in all the way. Its weight holds back the river.', 'material all the way through'],
    ['so', '🗿', 'A ' + B('stone pillar') + ' is carved from one solid block of rock.', 'material all the way through']
  ];
  const TN = { sh: 'Shell', fr: 'Frame', so: 'Solid' };
  const TCUE = { sh: 'A thin, curved outer layer', fr: 'Joined parts, mostly open space', so: 'Material all the way through' };
  function stType() {
    const [k, ic, story, why] = pick(TYPES);
    return mk('stType', 1, '7-4-01', 1, {
      story, q: 'Which structure type?', a: TN[k],
      errs: ['sh', 'fr', 'so'].filter(x => x !== k).map(w => [TN[w], TCUE[k], 0]),
      steps: [[TN[k].toLowerCase(), why]],
      pic: row([[ic, story.match(/<b>([^<]*)<\/b>/)[1]], ['🏛️', '?', { q: true, d: TN[k].toLowerCase() + ' structure' }]], { arr: [{ t: 'type', k: 'G' }] })
    });
  }
  const LOADS = [
    ['d', '🌉', 'A bridge crosses the Bow River. Think about ' + B('the weight of its own concrete deck') + '.', ['⚖️', 'its own deck']],
    ['d', '🏠', 'A house has a heavy roof. Think about ' + B('the weight of the roof’s own beams') + '.', ['⚖️', 'its own beams']],
    ['d', '🗼', 'A radio tower stands on a hill. Think about ' + B('the weight of its own steel') + '.', ['⚖️', 'its own steel']],
    ['l', '🌉', 'A bridge crosses the Bow River. Think about ' + B('the cars and trucks crossing it') + '.', ['🚗', 'cars and trucks']],
    ['l', '🏟️', 'A stadium has rows of seats. Think about ' + B('the people filling the stands') + '.', ['👥', 'people']],
    ['l', '🏠', 'A house has a flat roof. Think about ' + B('snow piling up on it') + ' all winter.', ['❄️', 'snow']],
    ['l', '📚', 'A shelf hangs on a wall. Think about ' + B('the books stacked on it') + '.', ['📚', 'books']],
    ['y', '🪧', 'A big sign stands by the highway. Think about ' + B('strong wind gusts shaking it') + '.', ['💨', 'wind gusts']],
    ['y', '🏢', 'An office tower stands in a city. Think about ' + B('an earthquake shaking it') + '.', ['💥', 'earthquake']],
    ['y', '🏟️', 'A stadium has rows of seats. Think about ' + B('fans jumping up and down together') + '.', ['🙌', 'jumping fans']]
  ];
  const LN = { d: 'Dead load', l: 'Live load', y: 'Dynamic load' };
  const LCUE = { d: 'Dead load: its own weight', l: 'Live load: weight it carries', y: 'Dynamic: sudden or changing force' };
  function stLoad() {
    const [k, ic, story, lc] = pick(LOADS);
    return mk('stLoad', 1, '7-4-02', 2, {
      story, q: 'What kind of load?', a: LN[k],
      errs: ['d', 'l', 'y'].filter(x => x !== k).map(w => [LN[w], LCUE[k], 0]),
      steps: [[LN[k].toLowerCase(), k === 'd' ? 'the structure’s own weight, always there' : k === 'l' ? 'weight the structure carries; it changes' : 'a sudden or shaking force that changes']],
      pic: row([[lc[0], lc[1], { k: 'R' }], [ic, '?', { q: true, d: LN[k].toLowerCase() }]], { arr: [{ t: 'acts on', k: 'R' }] })
    });
  }
  const FORCES = [
    ['te', '🪢', 'Two teams pull hard on a ' + B('rope') + ' in a tug of war.'], ['te', '🌉', 'Steel ' + B('cables') + ' hold up the deck of a bridge.'], ['te', '🎸', 'Kai tightens a ' + B('guitar string') + ' to tune it.'],
    ['co', '🥫', 'Leah stands on an ' + B('empty pop can') + ' and it crumples.'], ['co', '🪑', 'The ' + B('legs of a chair') + ' hold up a person sitting on it.'], ['co', '🏛️', 'A stone ' + B('pillar') + ' holds up a heavy roof.'],
    ['sh', '✂️', 'Owen cuts paper with ' + B('scissors') + '.'], ['sh', '🕳️', 'A ' + B('hole punch') + ' slices a circle out of paper.'], ['sh', '🔩', 'Two plates slide apart and ' + B('slice a bolt') + ' between them.'],
    ['to', '🧺', 'Noah ' + B('twists a wet towel') + ' to wring out the water.'], ['to', '🔑', 'Maya ' + B('turns a key') + ' in a stiff lock.'], ['to', '🍼', 'Zoe ' + B('twists the cap') + ' off a bottle.']
  ];
  const FN = { te: 'Tension', co: 'Compression', sh: 'Shear', to: 'Torsion' };
  const FWHY = { te: 'it is pulled and stretched', co: 'it is pushed and squeezed', sh: 'parts slide past each other', to: 'it is twisted' };
  const FCUE = { te: 'It is being stretched', co: 'It is being squeezed', sh: 'Parts slide past each other', to: 'It is being twisted' };
  function stForce() {
    const [k, ic, story] = pick(FORCES);
    return mk('stForce', 1, '7-4-02', 3, {
      story, q: 'Which internal force?', a: FN[k],
      errs: ['te', 'co', 'sh', 'to'].filter(x => x !== k).map(w => [FN[w], FCUE[k], 0]),
      steps: [[FN[k].toLowerCase(), FWHY[k] + ': ' + FN[k].toLowerCase()]],
      pic: row([[ic, story.match(/<b>([^<]*)<\/b>/)[1]], [k === 'te' ? '↔️' : k === 'co' ? '➡️⬅️' : k === 'sh' ? '⇅' : '🔄', '?', { q: true, d: FN[k].toLowerCase() }]], { arr: [{ t: 'inside it', k: 'G' }] })
    });
  }
  function stBeam() {
    const v = pick([
      ['simple', 'bottom', 'A wooden plank bridges a creek. ' + pick(NAMES) + ' stands ' + B('in the middle') + ', and it bends down.', 'Force on the bottom?', '🧍', 'person'],
      ['simple', 'top', 'A long shelf rests on brackets at each end. ' + B('Heavy books') + ' make it sag in the middle.', 'Force on the top?', '📚', 'books'],
      ['cantilever', 'top', 'A diver stands at the ' + B('tip of a diving board') + '. The board bends down.', 'Force on the top?', '🤽', 'diver'],
      ['cantilever', 'bottom', 'A ' + B('balcony') + ' sticks out from a wall with nothing under it. People stand at its edge.', 'Force on the bottom?', '👥', 'people'],
      ['simple', 'rebar', 'A concrete beam will span a garage door. Concrete ' + B('cracks easily when stretched') + '.', 'Where does rebar go?', '🏠', 'wall above'],
      ['cantilever', 'rebar', 'A concrete ' + B('balcony') + ' sticks out from a wall. Concrete cracks easily when stretched.', 'Where does rebar go?', '👥', 'people']
    ]);
    const [type, ask, story, q, ic, lt] = v, cant = type === 'cantilever', stretch = cant ? 'top' : 'bottom';
    const S1 = cant ? 'the top stretches; the bottom is squeezed' : 'the top is squeezed; the bottom stretches';
    if (ask === 'rebar') return mk('stBeam', 2, '7-4-02', 3, {
      story, q, a: 'Along the ' + stretch,
      errs: [['Along the ' + (cant ? 'bottom' : 'top'), 'Put steel where it stretches', 1], ['In the very middle', 'The middle barely stretches', 1]],
      steps: [['forces', S1], ['rebar', 'steel goes where concrete stretches: the ' + stretch]],
      pic: { k: 'beam', type, ask, i: ic, t: lt }
    });
    const ten = ask === stretch;
    return mk('stBeam', 2, '7-4-02', 3, {
      story, q, a: ten ? 'Tension (stretched)' : 'Compression (squeezed)',
      errs: [[ten ? 'Compression (squeezed)' : 'Tension (stretched)', cant ? 'Fixed at one end: top stretches' : 'Top squeezes; bottom stretches', 1], ['No force', 'Bending loads both sides', 0]],
      steps: [['load', 'the load bends the beam down'], ['forces', S1]],
      pic: { k: 'beam', type, ask, i: ic, t: lt }
    });
  }
  const PAIRS = [
    ['vase', '🏺', 'tall and narrow', 'short with a wide base', { w: 10, h: 40, cg: 18 }, { w: 22, h: 20, cg: 8 }],
    ['truck', '🚚', 'stacked high with hay bales', 'carrying one low layer of bales', { w: 24, h: 40, cg: 22 }, { w: 24, h: 18, cg: 9 }],
    ['bookshelf', '📚', 'loaded with heavy books on the top shelf', 'loaded with heavy books on the bottom shelf', { w: 16, h: 40, cg: 28 }, { w: 16, h: 40, cg: 12 }],
    ['lamp', '💡', 'on a light, narrow base', 'on a heavy, wide base', { w: 8, h: 40, cg: 22 }, { w: 18, h: 40, cg: 9 }],
    ['traffic cone', '🚧', 'tall with a small base', 'short with a wide base', { w: 10, h: 36, cg: 14 }, { w: 22, h: 22, cg: 7 }]
  ];
  function stStable() {
    const [nm, ic, un, st, U, Sx] = pick(PAIRS), uA = rnd(0, 1), Lu = uA ? 'A' : 'B', Ls = uA ? 'B' : 'A';
    const Nm = nm[0].toUpperCase() + nm.slice(1);
    return mk('stStable', 2, '7-4-03', 4, {
      story: Nm + ' A is ' + B(uA ? un : st) + '. ' + Nm + ' B is ' + B(uA ? st : un) + '.',
      q: 'Which tips more easily?', a: Nm + ' ' + Lu,
      errs: [[Nm + ' ' + Ls, 'High or narrow tips sooner', 1], ['Both the same', 'CoG height and base matter', 0]],
      steps: [['centre of gravity', Nm + ' ' + Lu + ' has a higher CoG or a narrower base'], ['tipping', 'its CoG passes the base edge at a smaller tilt']],
      pic: { k: 'tip', A: Object.assign({ t: Nm + ' A', i: ic }, uA ? U : Sx), B: Object.assign({ t: Nm + ' B', i: ic }, uA ? Sx : U) }
    });
  }
  const MACH = [
    [1, '🪨', 'uses a long steel bar to lift a heavy rock. The rock is near the pivot; ' + B('their hands are far out') + '.', 'hands far from the pivot'],
    [1, '🎹', 'pushes a piano up a ' + B('long ramp') + ' into a truck instead of lifting it.', 'a long ramp instead of straight up'],
    [1, '🛒', 'lifts a load of soil in a ' + B('wheelbarrow') + ', with hands far from the wheel.', 'hands far from the wheel (pivot)'],
    [1, '🍾', 'opens a bottle with a ' + B('bottle opener') + ', pushing on the far end of its handle.', 'hand far from the pivot'],
    [3, '🏒', 'swings a ' + B('hockey stick') + '. One hand is near the top; the other pushes close to it.', 'pushing hand close to the pivot'],
    [3, '🧹', 'sweeps with a ' + B('broom') + '. The top hand holds still while the lower hand pushes.', 'pushing hand close to the pivot'],
    [3, '🎣', 'flicks a ' + B('fishing rod') + '. The hands are near the bottom of the long rod.', 'hands close to the pivot']
  ];
  function stMachine() {
    const [cls, ic, s, arm] = pick(MACH), n = pick(NAMES), less = cls === 1;
    return mk('stMachine', 2, '7-4-04', 5, {
      story: n + ' ' + s, q: 'What is the trade?', a: less ? 'Push less, but farther' : 'Push more, but less far',
      errs: [[less ? 'Push more, but less far' : 'Push less, but farther', less ? 'Long effort arm: less force' : 'Effort near the pivot: more force', 0], ['Push less, and less far', 'Machines don’t create energy', 1]],
      steps: [['arms', arm], ['trade', less ? 'less force, but your end moves farther' : 'more force, but the far end moves farther, faster']],
      pic: row([['💪', 'your push'], [ic, 'machine'], ['🎯', '?', { q: true, d: less ? 'less force, more distance' : 'more force, more speed' }]], { arr: [{ t: less ? 'small force' : 'big force', k: 'G' }, { t: 'output', k: 'G', s: 1 }] })
    });
  }
  const IMPROVE = [
    ['A class’s popsicle-stick bridge sags and leans when loaded. Its sides are made of ' + B('squares') + '.', ['🌉', 'square sides'], 'Brace the squares into triangles',
      [['Add more glue only', 'The shape fails, not the glue', 1], ['Make the squares bigger', 'Squares still fold over', 2]], ['load', 'the load pushes the frame out of shape'], ['problem', 'squares can fold flat into diamonds'], ['fix', 'triangles can’t change shape: stiffer'], ['🔺', 'triangles']],
    ['A tall cardboard tower ' + B('tips over') + ' in a fan’s wind. It has a small base.', ['🗼', 'tower tips'], 'Widen the base',
      [['Make it taller', 'Taller raises the CoG', 2], ['Use stronger tape', 'It tips; it doesn’t break', 1]], ['load', 'wind is a dynamic load from the side'], ['problem', 'a high CoG over a small base tips easily'], ['fix', 'a wide base keeps the CoG over it'], ['🔻', 'wide base']],
    ['A long shelf ' + B('sags in the middle') + ' under heavy books. It rests on brackets at each end.', ['📚', 'shelf sags'], 'Add a support in the middle',
      [['Use a thinner board', 'Thinner beams bend more', 2], ['Pile the books in the middle', 'A centre load bends it most', 1]], ['load', 'the books are a live load on the shelf'], ['problem', 'a long span bends most in the middle'], ['fix', 'a middle support cuts the span in half'], ['📐', 'middle support']],
    ['A stone wall needs a top over its doorway. A ' + B('flat stone slab cracked') + ' there last time.', ['🧱', 'slab cracks'], 'Build an arch',
      [['Use a longer flat slab', 'Flat stone cracks when stretched', 1], ['Make the wall thinner', 'That doesn’t fix the top', 2]], ['load', 'the wall above presses down on the top'], ['problem', 'a flat slab’s bottom stretches and cracks'], ['fix', 'an arch turns the load into compression'], ['🌈', 'arch']]
  ];
  function stImprove() {
    const [story, prob, a, errs, s0, s1, s2, fix] = pick(IMPROVE);
    return mk('stImprove', 3, '7-4-05', 6, {
      story, q: 'Best improvement?', a, errs, steps: [s0, s1, s2],
      pic: row([['⬇️', 'load', { k: 'R' }], [prob[0], prob[1], { k: 'R', s: 1 }], [fix[0], '?', { q: true, d: fix[1] }]], { arr: [{ k: 'R' }, { t: 'fixed by', k: 'N', s: 2 }] })
    });
  }
  const COG = [
    ['A tall crane lifts a heavy beam far out on its arm. Big ' + B('concrete blocks') + ' sit on the back of the arm.', 'Why the blocks?', 'Keep the CoG over the base',
      [['Make the arm stronger', 'It would tip, not snap', 1], ['Make the load lighter', 'The load’s weight is the same', 2]], ['load', 'the load is far out on one side'], ['problem', 'the CoG shifts past the base: it tips'], ['blocks', 'weight at the back pulls the CoG back'], ['🏗️', 'crane'], ['🧱', 'blocks']],
    [pick(NAMES) + ' carries a ' + B('heavy backpack') + ' up a trail. ' + 'They lean forward as they walk.', 'Why lean forward?', 'Keep the CoG over the feet',
      [['To push the pack up', 'Leaning is about balance', 2], ['The pack gets lighter', 'The pack’s weight doesn’t change', 1]], ['load', 'the pack adds weight behind the hiker'], ['problem', 'the CoG moves back, past the heels'], ['lean', 'leaning brings the CoG over the feet'], ['🎒', 'backpack'], ['🚶', 'lean forward']],
    ['Two friends paddle a canoe on a windy lake. They ' + B('kneel low') + ' instead of sitting on the seats.', 'Why kneel low?', 'A lower CoG is harder to tip',
      [['The canoe gets lighter', 'Same weight, lower position', 1], ['Paddles reach farther', 'This is about stability', 2]], ['load', 'waves and wind rock the canoe'], ['CoG', 'kneeling lowers the centre of gravity'], ['stability', 'a low CoG must tilt far before it tips'], ['🛶', 'canoe'], ['🧎', 'kneel low']]
  ];
  function stCoG() {
    const [story, q, a, errs, s0, s1, s2, A0, A1] = pick(COG);
    return mk('stCoG', 3, '7-4-03', 4, {
      story, q, a, errs, steps: [s0, s1, s2],
      pic: row([[A0[0], A0[1]], ['🟡', 'CoG moves', { s: 1, k: 'Y' }], [A1[0], '?', { q: true, d: 'CoG over base' }]], { arr: [{ t: 'load', k: 'R' }, { t: 'fix', k: 'N', s: 2 }] })
    });
  }
  const MATS = [
    ['A bridge deck hangs from cables. Each cable is ' + B('pulled hard') + ' by the deck’s weight.', 'Best cable material?', 'Steel wire',
      [['Concrete', 'Concrete cracks when stretched', 1], ['Glass', 'Glass is brittle; it snaps', 1]], ['force', 'the cable is in tension'], ['property', 'it must be strong when pulled'], ['choice', 'steel wire is strong in tension'], ['🔗', 'cable']],
    ['A pillar holds up a heavy bridge deck. The deck ' + B('pushes straight down') + ' on it.', 'Best pillar material?', 'Concrete',
      [['Rope', 'Rope can’t push back', 1], ['Rubber', 'Rubber squashes too much', 1]], ['force', 'the pillar is in compression'], ['property', 'it must be strong when squeezed'], ['choice', 'concrete is strong in compression'], ['🏛️', 'pillar']],
    ['A diving board must ' + B('bend and spring back') + ' thousands of times.', 'Best board material?', 'Fibreglass',
      [['Brick', 'Brick is rigid and brittle', 1], ['Clay', 'Clay stays bent', 1]], ['force', 'the board bends with every dive'], ['property', 'it must be elastic: bend, then return'], ['choice', 'fibreglass bends and springs back'], ['🤽', 'board']],
    ['A hockey helmet’s shell must take ' + B('sharp hits') + ' without cracking.', 'Best shell material?', 'Tough plastic',
      [['Glass', 'Glass is brittle; it shatters', 1], ['Thin paper', 'Paper tears with no strength', 1]], ['force', 'sudden hits are a dynamic load'], ['property', 'it must be tough, not brittle'], ['choice', 'tough plastic flexes but won’t shatter'], ['⛑️', 'helmet']]
  ];
  function stMaterial() {
    const [story, q, a, errs, s0, s1, s2, part] = pick(MATS);
    return mk('stMaterial', 3, '7-4-05', 6, {
      story, q, a, errs, steps: [s0, s1, s2],
      pic: row([[part[0], part[1]], ['🧪', s1[1].replace(/^it must be /, ''), { s: 1, k: 'Y' }], ['🧰', '?', { q: true, d: a.toLowerCase() }]], { arr: [{ t: s0[1].replace(/^.* is in |^.* are /, '').replace(/^the board /, ''), k: 'R' }, { k: 'G', s: 2 }] })
    });
  }

  /* ============ 7-5 · Planet Earth ============ */
  const ROCKS = [
    ['ig', 'Lava from a volcano in Hawaii ' + B('cools quickly') + ' on the surface into dark rock.', ['🌋', 'lava']], ['ig', 'Magma deep under a mountain ' + B('cools slowly') + ' into granite.', ['🔥', 'magma']],
    ['ig', 'Frothy lava ' + B('cools and hardens') + ' so fast that it traps bubbles: pumice.', ['🌋', 'lava']],
    ['se', 'Sand settles in ' + B('layers') + ' on a lake bottom. Over millions of years it is ' + B('pressed and cemented') + '.', ['🏖️', 'sand']],
    ['se', 'Shells pile up on an ancient sea floor. They are ' + B('pressed together') + ' over time.', ['🐚', 'shells']],
    ['se', 'Mud in a river delta is ' + B('buried and squeezed') + ' into hard flat layers.', ['🟤', 'mud']],
    ['me', 'Limestone deep in the crust is ' + B('heated and squeezed') + ' but never melts.', ['⬜', 'limestone']],
    ['me', 'Shale is ' + B('pressed hard') + ' as mountains form. Its minerals change, but it stays solid.', ['⬛', 'shale']],
    ['me', 'Granite is ' + B('heated and squeezed') + ' deep down until its minerals line up in bands. It never melts.', ['🪨', 'granite']]
  ];
  const RKN = { ig: 'Igneous', se: 'Sedimentary', me: 'Metamorphic' };
  const RKWHY = { ig: 'melted rock that cooled and hardened', se: 'layers of bits pressed and cemented', me: 'existing rock changed by heat and pressure, no melting' };
  const RKCUE = { ig: 'Cooled from melted rock: igneous', se: 'Pressed layers of bits: sedimentary', me: 'Changed without melting: metamorphic' };
  function erRock() {
    const [k, story, src] = pick(ROCKS);
    return mk('erRock', 1, '7-5-02', 2, {
      story, q: 'Which rock type?', a: RKN[k],
      errs: ['ig', 'se', 'me'].filter(x => x !== k).map(w => [RKN[w], RKCUE[k], 0]),
      steps: [[RKN[k].toLowerCase(), RKWHY[k]]],
      pic: row([[src[0], src[1]], ['🪨', '?', { q: true, d: RKN[k].toLowerCase() }]], { arr: [{ t: k === 'ig' ? 'cools' : k === 'se' ? 'pressed' : 'heat + pressure', k: k === 'ig' ? 'L' : k === 'se' ? 'G' : 'R' }] })
    });
  }
  const BOUND = [
    ['dv', 'Two plates ' + B('pull apart') + ' in the middle of the Atlantic Ocean. New sea floor forms between them.'], ['dv', 'In East Africa, the land is slowly ' + B('splitting apart') + ' into a long rift valley.'],
    ['dv', 'Iceland sits where two plates ' + B('move away') + ' from each other.'], ['cv', 'India’s plate ' + B('pushes into') + ' Asia. The Himalayas keep rising.'],
    ['cv', 'An ocean plate ' + B('sinks under') + ' South America, raising the Andes.'], ['cv', 'Off the BC coast, the Juan de Fuca plate ' + B('slides under') + ' North America.'],
    ['tf', 'In California, two plates ' + B('grind past') + ' each other along the San Andreas Fault.'], ['tf', 'Off Haida Gwaii, two plates ' + B('slide sideways') + ' past each other.']
  ];
  const BN = { dv: 'Divergent', cv: 'Convergent', tf: 'Transform' };
  const BWHY = { dv: 'plates move apart', cv: 'plates push together', tf: 'plates slide past each other' };
  const BCUE = { dv: 'They are moving apart', cv: 'They are pushing together', tf: 'They slide past each other' };
  function erBound() {
    const [k, story] = pick(BOUND);
    const tg = { dv: ['← moves away', 'moves away →'], cv: ['pushes in →', '← pushes in'], tf: ['↑ slides past', '↓ slides past'] }[k];
    return mk('erBound', 1, '7-5-03', 3, {
      story, q: 'Which boundary type?', a: BN[k],
      errs: ['dv', 'cv', 'tf'].filter(x => x !== k).map(w => [BN[w], BCUE[k], 0]),
      steps: [[BN[k].toLowerCase(), BWHY[k]]],
      pic: { k: 'scene', cards: [cd(0, 0, '🟫', 'plate', { tag: tg[0], tagk: 'R' }), cd(1, 0, k === 'dv' ? '🌋' : k === 'cv' ? '⛰️' : '💥', '?', { q: true, d: BN[k].toLowerCase() }), cd(2, 0, '🟫', 'plate', { tag: tg[1], tagk: 'R' })] }
    });
  }
  const SURF = [
    ['w', 'Water seeps into a crack in a rock near Banff. It ' + B('freezes overnight') + ' and the crack widens.', ['🧊', 'frost']], ['w', 'Tree roots ' + B('grow into a crack') + ' in a boulder and split it.', ['🌳', 'roots']],
    ['w', 'Slightly acidic rain slowly ' + B('dissolves') + ' a limestone statue.', ['🌧️', 'acid rain']], ['e', 'The Red Deer River ' + B('carries sand and mud') + ' downstream after a storm.', ['🌊', 'river']],
    ['e', 'A glacier ' + B('scrapes and drags rocks') + ' along a mountain valley.', ['🏔️', 'glacier']], ['e', 'Strong wind ' + B('blows dry topsoil') + ' off a bare field.', ['💨', 'wind']],
    ['d', 'A river slows as it enters a lake. ' + B('Sand and mud settle') + ' on the bottom.', ['🏞️', 'lake']], ['d', 'A melting glacier ' + B('leaves a huge boulder') + ' on the prairie.', ['🪨', 'boulder']],
    ['d', 'Wind ' + B('drops sand') + ' behind a fence, building a small dune.', ['🏜️', 'dune']]
  ];
  const SN = { w: 'Weathering', e: 'Erosion', d: 'Deposition' };
  const SWHY = { w: 'rock is broken down where it is', e: 'broken pieces are carried away', d: 'carried pieces are dropped off' };
  const SCUE = { w: 'The rock breaks where it is', e: 'Pieces are being carried away', d: 'Pieces are being dropped off' };
  function erSurface() {
    const [k, story, ic] = pick(SURF);
    return mk('erSurface', 1, '7-5-05', 5, {
      story, q: 'Which process is this?', a: SN[k],
      errs: ['w', 'e', 'd'].filter(x => x !== k).map(w => [SN[w], SCUE[k], 0]),
      steps: [[SN[k].toLowerCase(), SWHY[k]]],
      pic: row([[ic[0], ic[1]], [k === 'w' ? '💥' : k === 'e' ? '➡️' : '⬇️', '?', { q: true, d: SN[k].toLowerCase() }]], { arr: [{ k: 'G' }] })
    });
  }
  const LAYERS = [['Crust', 'You stand on Earth’s ' + B('thin, rocky outer layer') + '. Under oceans it is only about 7 km thick.'],
    ['Mantle', 'This thick layer is ' + B('solid rock that flows very slowly') + '. Its currents move the plates.'],
    ['Outer core', B('Moving liquid iron') + ' deep inside Earth makes its magnetic field. A compass needs it.'],
    ['Inner core', 'At Earth’s centre, iron is extremely hot, but ' + B('huge pressure keeps it solid') + '.']];
  const LCUE2 = { Crust: 'Crust: thin, rocky outer skin', Mantle: 'Mantle: thick, slowly flowing rock', 'Outer core': 'Only the outer core is liquid', 'Inner core': 'Inner core: solid, at the centre' };
  function erInterior() {
    const [nm, story] = pick(LAYERS);
    return mk('erInterior', 1, '7-5-01', 1, {
      story, q: 'Which layer is it?', a: nm,
      errs: LAYERS.filter(x => x[0] !== nm).map(x => [x[0], LCUE2[nm], 0]),
      steps: [[nm.toLowerCase(), story.match(/<b>([^<]*)<\/b>/)[1].toLowerCase()]],
      pic: { k: 'layers', bands: LAYERS.map((x, j) => ({ t: '', d: x[0], w: [1, .9, .7, .45][j], k: 'M', tag: x[0] === nm ? 'this one' : null })) }
    });
  }
  const FOSS = [['🐚', 'clam'], ['🦕', 'dinosaur bone'], ['🐟', 'fish'], ['🌿', 'fern'], ['🐌', 'snail'], ['🦈', 'shark tooth'], ['🍃', 'leaf']];
  function erFossil() {
    const fs = shuffle(FOSS).slice(0, 3), first = rnd(0, 1), place = pick(['near Drumheller', 'in the Badlands', 'near Lethbridge', 'by the Red Deer River']);
    const ans = first ? fs[2] : fs[0], other = fs.filter(f => f !== ans);
    return mk('erFossil', 2, '7-5-06', 6, {
      story: 'Flat rock layers in a cliff ' + place + ' hold three fossils. The layers have ' + B('never been flipped') + '.',
      q: first ? 'Which lived first?' : 'Which is youngest?', a: 'The ' + ans[1],
      errs: [['The ' + other[0][1], first ? 'Top layers are the youngest' : 'Look at the top layer', 1], ['The ' + other[1][1], first ? 'Look at the lowest layer' : 'Bottom layers formed first', 1]],
      steps: [['layers', 'each layer settled on top of the one below'], ['superposition', (first ? 'the lowest layer is oldest: the ' : 'the top layer is youngest: the ') + ans[1]]],
      pic: { k: 'layers', bands: fs.map((f, j) => ({ i: f[0], t: f[1], k: ['Y', 'G', 'M'][j], tag: f === ans ? (first ? 'oldest' : 'youngest') : null })), side: { t: 'older', s: 1 } }
    });
  }
  const QUAKE = [['Chile', 'An ocean plate sinks under South America there.'], ['Japan', 'Several plates meet and push together there.'], ['California', 'Two plates grind past each other there.'], ['Iceland', 'Two plates pull apart there.']];
  function erQuake() {
    if (rnd(0, 3) === 0) return mk('erQuake', 2, '7-5-04', 4, {
      story: B('Alberta') + ' has very few strong earthquakes. ' + B('Japan') + ' has many every year.',
      q: 'Why so few here?', a: 'Far from a plate boundary',
      errs: [['There is no plate under Alberta', 'Alberta sits on a plate', 0], ['Prairie soil soaks up quakes', 'It’s about plate boundaries', 1]],
      steps: [['location', 'Alberta is in the middle of a plate'], ['quakes', 'most quakes happen where plates meet']],
      pic: row([['🌾', 'Alberta'], ['🧩', 'plate middle', { s: 0 }], ['🗾', 'Japan: plate edge', { k: 'R' }]], { arr: [{ k: 'M', dash: true }, { k: 'M', dash: true }] })
    });
    const [pl, how] = pick(QUAKE);
    return mk('erQuake', 2, '7-5-04', 4, {
      story: 'Earthquakes shake ' + B(pl) + ' often. ' + B(how.replace(/.$/, '')) + '.',
      q: 'Why so many quakes?', a: 'Plates stick, then slip',
      errs: [['The core is near the surface', 'Quakes start in the crust', 0], ['Plates move metres a day', 'Plates move cm per year', 1]],
      steps: [['boundary', pl + ' sits on a plate boundary'], ['quake', 'plates stick, stress builds, then they slip']],
      pic: row([['🟫', 'plate'], ['💥', '?', { q: true, d: 'stick, then slip' }], ['🟫', 'plate']], { arr: [{ k: 'R' }, { k: 'R' }] })
    });
  }
  const IGN = [['granite', 'pumice'], ['granite', 'basalt'], ['gabbro', 'obsidian'], ['diorite', 'basalt']];
  function erCrystal() {
    const [big, small] = pick(IGN), bA = rnd(0, 1), Lb = bA ? 'A' : 'B', Ls = bA ? 'B' : 'A', ask = pick(['deep', 'fast']);
    const ans = ask === 'deep' ? Lb : Ls, wr = ask === 'deep' ? Ls : Lb;
    return mk('erCrystal', 2, '7-5-02', 2, {
      story: 'Rock A ' + (bA ? 'has ' + B('large crystals') + ' you can see' : 'is ' + B('glassy, with tiny crystals')) + '. Rock B ' + (bA ? 'is ' + B('glassy, with tiny crystals') : 'has ' + B('large crystals') + ' you can see') + '.',
      q: ask === 'deep' ? 'Which cooled underground?' : 'Which cooled fastest?', a: 'Rock ' + ans,
      errs: [['Rock ' + wr, 'Slow cooling grows big crystals', 1], ['No way to tell', 'Crystal size shows cooling speed', 0]],
      steps: [['cooling', 'deep magma cools slowly; lava cools fast'], ['crystals', 'big crystals: slow and deep (Rock ' + Lb + ')']],
      pic: { k: 'scene', cards: [cd(0, 0, bA ? '💎' : '⬛', 'Rock A', { tag: bA ? 'deep · slow' : 'surface · fast', tagk: bA ? 'L' : 'R' }), cd(1, 0, bA ? '⬛' : '💎', 'Rock B', { tag: bA ? 'surface · fast' : 'deep · slow', tagk: bA ? 'R' : 'L' })], w: 190 }
    });
  }
  const UPLIFT = [['Fossils of ' + B('sea creatures') + ' are found near the top of ' + B('Mount Everest') + '.', '🏔️', 'Everest'],
    ['Peaks near ' + B('Banff') + ' are made of limestone full of ' + B('sea-lily fossils') + '.', '⛰️', 'Rockies'],
    ['The ' + B('Burgess Shale') + ', high in the Rockies, holds fossils of ' + B('ancient sea animals') + '.', '⛰️', 'Rockies']];
  function erUplift() {
    const [story, ic, where] = pick(UPLIFT);
    return mk('erUplift', 3, '7-5-03', 3, {
      story, q: 'Why up so high?', a: 'Plates pushed the sea floor up',
      errs: [['A great flood left them', 'The rock itself formed underwater', 0], ['One big earthquake lifted them', 'Uplift takes millions of years', 2]],
      steps: [['sea floor', 'the animals were buried in sea-floor mud'], ['rock', 'the mud hardened into sedimentary rock'], ['plates', 'plates collided and slowly pushed it up']],
      pic: row([['🐚', 'sea floor'], ['🪨', 'rock layers', { s: 1 }], [ic, '?', { q: true, d: where + ': uplift' }]], { arr: [{ t: 'buried', k: 'G', s: 1 }, { t: 'pushed up', k: 'R', s: 2 }] })
    });
  }
  const PATHS = [
    ['Granite on a mountain ' + B('weathers into sand') + '. Rivers carry the sand to a sea, where it is ' + B('buried and cemented') + '.', 'Sedimentary',
      [['Igneous', 'Nothing melted here', 2], ['Metamorphic', 'It was only pressed and cemented', 2]], ['weathering', 'granite breaks into sand grains'], ['erosion', 'rivers carry the sand; it settles in layers'], ['rock', 'pressed and cemented: sedimentary rock'], ['🪨', 'granite'], ['🏖️', 'sand']],
    ['Sandstone is dragged deep at a plate boundary. It ' + B('melts into magma') + ', which ' + B('cools underground') + '.', 'Igneous',
      [['Metamorphic', 'It melted: that makes igneous', 2], ['Sedimentary', 'No bits settled in layers', 2]], ['burial', 'the sandstone is carried deep into hot rock'], ['melting', 'it melts into magma'], ['cooling', 'magma cools and hardens: igneous rock'], ['🏖️', 'sandstone'], ['🔥', 'magma']],
    ['Basalt is buried as mountains form. ' + B('Heat and pressure') + ' change its minerals, but it ' + B('never melts') + '.', 'Metamorphic',
      [['Igneous', 'It never melted', 2], ['Sedimentary', 'It wasn’t broken into bits', 2]], ['burial', 'the basalt is buried deep in the crust'], ['change', 'heat and pressure change it, no melting'], ['rock', 'changed rock: metamorphic'], ['⬛', 'basalt'], ['🌡️', 'heat + pressure']]
  ];
  function erPath() {
    const [story, a, errs, s0, s1, s2, A0, A1] = pick(PATHS);
    return mk('erPath', 3, '7-5-02', 2, {
      story, q: 'What rock forms?', a, errs, steps: [s0, s1, s2],
      pic: row([[A0[0], A0[1]], [A1[0], A1[1], { s: 1 }], ['🪨', '?', { q: true, d: a.toLowerCase() }]], { arr: [{ t: s0[0], k: 'G', s: 1 }, { t: s2[0] === 'rock' ? s1[0] : s2[0], k: 'G', s: 2 }] })
    });
  }
  const FORMS = [
    ['A house-sized boulder sits alone on the prairie near ' + B('Okotoks') + '. Its rock ' + B('matches rock from the Rockies') + ' far west.', 'How did it arrive?', 'A glacier carried and dropped it',
      [['A volcano threw it there', 'Its rock matches the mountains', 0], ['A river rolled it there', 'Too big for a river', 1]], ['erosion', 'a glacier picked up the rock in the mountains'], ['transport', 'the ice carried it east over the prairie'], ['deposition', 'the ice melted and dropped the boulder'], ['🏔️', 'Rockies'], ['🧊', 'glacier'], ['🪨', 'Big Rock']],
    [B('Hoodoos') + ' near Drumheller are soft rock pillars with ' + B('hard caps') + '. The land around them has worn away.', 'Why do caps matter?', 'Hard caps shield soft rock',
      [['People placed the caps', 'They formed naturally', 0], ['Caps make pillars grow', 'Pillars shrink; they never grow', 2]], ['weathering', 'rain and frost break down the soft rock'], ['erosion', 'water and wind carry the bits away'], ['caps', 'hard caps protect the rock under them'], ['🌧️', 'rain + frost'], ['💨', 'erosion'], ['🍄', 'hoodoo']],
    ['The ' + B('Red Deer River valley') + ' is wide and deep. ' + B('Floods of glacier meltwater') + ' once poured through it.', 'What shaped the valley?', 'Meltwater eroded it',
      [['An earthquake cracked it open', 'It was carved by water', 1], ['Wind blew it out', 'Wind can’t carve that deep', 1]], ['ice age', 'glaciers melted at the end of the ice age'], ['erosion', 'huge floods of meltwater cut into the land'], ['valley', 'the deep valley was left behind'], ['🧊', 'glaciers'], ['🌊', 'meltwater'], ['🏞️', 'valley']]
  ];
  function erLandform() {
    const [story, q, a, errs, s0, s1, s2, A0, A1, A2] = pick(FORMS);
    return mk('erLandform', 3, '7-5-05', 5, {
      story, q, a, errs, steps: [s0, s1, s2],
      pic: row([[A0[0], A0[1]], [A1[0], A1[1], { s: 1 }], [A2[0], '?', { q: true, d: A2[1] }]], { arr: [{ t: s0[0], k: 'G', s: 1 }, { t: s2[0], k: 'G', s: 2 }] })
    });
  }

  /* ============ READING (v2): a longer passage, the key facts, the key idea, an assumption ============ */
  /* The passage is a setting sentence (never key), the story's sentences (a sentence with <b> must be found; one
     without is optional) and red-herring sentences (never key), then the question. Bold is not shown: the
     student finds the key facts. Then the key idea (from the unit's list), then (Levels 2–3) what we can assume,
     then the answer. */
  const SETTING = {
    eco: ['A park ranger tells this story to a Grade 7 class on a field trip.', 'Students are writing reports about Alberta ecosystems this week.', 'This entry comes from a nature club’s field notebook.', 'A wildlife biologist describes something seen last spring.'],
    pla: ['A Grade 7 class is studying plants in the science room this term.', 'This story comes up at a farm meeting near Lacombe, in central Alberta.', 'A gardener shares this story at a community garden meeting.', 'The class reads about it in a farm newsletter.'],
    hea: ['A Grade 7 class is testing heat ideas around the school.', 'This happens on an ordinary day in Red Deer.', 'A science teacher uses this story to start the lesson.', 'Students write it down in their lab journals.'],
    str: ['A Grade 7 class is studying how structures stand up.', 'An engineer visits the school and tells this story.', 'This story comes from a building site in Edmonton.', 'Students are planning a model for the science fair.'],
    ear: ['A geologist tells this story on a class trip.', 'The class is studying how Earth’s surface changes.', 'A guide at the Royal Tyrrell Museum tells this story.', 'Students read about it in a news story on Earth science.']
  };
  // More everyday details for each unit (never key), so the reading is long enough to need sorting. They must fit any
  // setting (no "the room" or "the class" that a setting may not have) and must not touch the unit's science.
  const UNOISE = {
    eco: ['Someone forgot to bring a hat.', 'Lunch is sandwiches at a picnic table.', 'A few people take photos on their phones.', 'The day ends with a stop for ice cream in town.'],
    pla: ['A poster about Alberta crops hangs on a wall nearby.', 'Someone brings muffins to share.', 'Notes are kept on a calendar each week.', 'Everyone signs their name on a list.'],
    hea: ['A bell rings for the next class.', 'Two people take turns writing notes.', 'Everyone is reminded to wear safety glasses.', 'It is the last day before the long weekend.'],
    str: ['Someone sketches a few ideas on a sheet of graph paper.', 'A visitor wears a bright orange vest and a hard hat.', 'Someone sets a timer for twenty minutes on a phone.', 'Everyone gets a name tag to wear on their shirt.'],
    ear: ['Everyone has a hand lens and a small notebook.', 'A hawk circles high overhead for a few minutes.', 'A gift shop nearby sells rock samples and posters.', 'Someone asks what time lunch will be.']
  };
  // The unit's science ideas: label (the choice) and hint (the cue when another idea is picked).
  const IDEAS = {
    eco: { bio: ['Biotic and abiotic factors', 'Sort living from non-living'], role: ['Producer, consumer, decomposer', 'How does it get food?'], flow: ['Energy flow in a food chain', 'Follow the energy from food'],
      ten: ['The 10% rule', 'Energy is lost at each level'], web: ['Links in a food web', 'Follow who eats whom'], div: ['Biodiversity', 'Count the kinds of species'],
      change: ['A change spreading along a chain', 'Follow the change link by link'], recover: ['Recovery after a disturbance', 'How ecosystems recover over time'], steward: ['Fixing the cause of a problem', 'Find the cause, then fix it'] },
    pla: { cell: ['Parts of a plant cell', 'Match the part to its look'], vessel: ['Xylem and phloem', 'What moves, and which way?'], repro: ['Sexual or asexual reproduction', 'One parent or two?'],
      photo: ['What photosynthesis needs', 'Light, water and CO₂ make glucose'], mass: ['Where a plant’s mass comes from', 'Plants build mass from air'], poll: ['Pollination and seeds', 'Pollen must reach the stigma'],
      breed: ['Selective breeding or GMO', 'How were the traits changed?'], chain: ['Producers start food chains', 'Every chain starts with light'], farm: ['Crop practices and pests', 'One crop feeds one pest'] },
    hea: { mode: ['Three ways heat moves', 'Touch, fluid, or waves?'], flow: ['Heat flows from hot to cold', 'Compare the two temperatures'], part: ['Particles and expansion', 'Heat spreads particles apart'],
      amount: ['Heat vs temperature', 'Total energy depends on amount'], cond: ['Conductors and insulators', 'How fast is heat pulled?'], cap: ['Heat capacity', 'Water warms and cools slowly'],
      insul: ['Insulation slows heat flow', 'Insulation slows heat; makes none'], state: ['Changes of state', 'Particles speed up or slow'], therm: ['Thermal pollution', 'Warm water holds less oxygen'] },
    str: { type: ['Solid, frame or shell', 'How is it built?'], load: ['Dead, live and dynamic loads', 'What kind of load acts?'], force: ['Internal forces', 'Push, pull, slide or twist?'],
      beam: ['Bending: tension and compression', 'One side squeezes, one stretches'], stab: ['Centre of gravity and stability', 'High CoG or narrow base tips'], mach: ['Levers and mechanical advantage', 'Force is traded for distance'],
      design: ['Improving a design', 'Match the fix to the failure'], mat: ['Choosing materials', 'Match the material to the force'] },
    ear: { rock: ['Rock types and how they form', 'Melted, layered, or changed?'], bound: ['Plate boundaries', 'Which way do plates move?'], surf: ['Weathering, erosion, deposition', 'Break, carry, or drop?'],
      layer: ['Earth’s layers', 'Match the layer to its property'], foss: ['Rock layers and fossil age', 'Lower layers are older'], quake: ['Earthquakes at plate boundaries', 'Quakes happen where plates meet'],
      crys: ['Cooling and crystal size', 'Slow cooling grows big crystals'], uplift: ['Mountain building', 'Plates push rock up slowly'], cycle: ['The rock cycle', 'Follow each change in order'], form: ['Ice and water shape Alberta', 'Glaciers and meltwater shaped it'] }
  };
  // Ideas too close to offer as wrong choices for each other.
  const NEAR = [['flow', 'ten'], ['web', 'change'], ['div', 'recover'], ['chain', 'photo'], ['photo', 'mass'], ['poll', 'repro'], ['cond', 'mode'], ['cond', 'flow'], ['cond', 'insul'], ['flow', 'insul'], ['amount', 'cap'], ['stab', 'design'], ['design', 'mat'], ['design', 'beam'], ['beam', 'force'], ['mat', 'force'], ['cycle', 'rock'], ['cycle', 'surf'], ['crys', 'rock'], ['uplift', 'bound'], ['form', 'surf'], ['quake', 'bound']];
  const near = (a, b) => NEAR.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  // Per story type: idea, red herrings (never key), and for Levels 2–3 what we can assume: [right, [wrong, cue], [wrong, cue]].
  // A red herring must fit every story of its type and must not be science that could change the answer.
  const READ = {
    ecoBiotic: { idea: 'bio', noise: ['The visit lasts about two hours.', 'Every entry gets a date at the top of the page.', 'The list is written in pencil.'] },
    ecoRole: { idea: 'role', noise: ['Someone writes it down on a clipboard.', 'A photo of it goes on a class website.', 'The spot is a short walk from the parking lot.'] },
    ecoArrow: { idea: 'flow', noise: ['A student sees this happen through binoculars.', 'It happens just before sunset.', 'Someone wishes they had brought a camera.'] },
    ecoPyramid: { idea: 'ten', noise: ['The count takes one week in July.', 'A student draws each kind in a notebook.', 'The numbers go into a class report.'],
      assume: ['Each level feeds mainly on the one below', ['Each animal eats the same amount', 'Not needed: energy loss explains it'], ['The top animals make their own food', 'Animals can’t make food']] },
    ecoWeb: { idea: 'web', noise: ['Biologists count the animals each spring.', 'The disease was first found in a nearby valley.', 'A map of the area hangs in the ranger station.'],
      assume: ['Nothing else in the web changes', ['The animals switch to new food', 'Stick to what the story says'], ['The disease kills all of them', 'The story says most, not all']] },
    ecoBiodiv: { idea: 'div', noise: ['A fence runs between the two plots.', 'Students visit the plots twice a month.', 'Each plot has a small sign with its letter.'],
      assume: ['The plots are alike in other ways', ['The pest eats every kind of plant', 'It eats only one kind'], ['One plot gets much more rain', 'The story says nothing about rain']] },
    ecoChain: { idea: 'change', noise: ['The area has been studied for ten years.', 'A biologist writes a report about it.', 'Pictures of the area appear in the newspaper.'],
      assume: ['Each animal eats mainly what is named', ['The animals easily find other food', 'Stick to the chain given'], ['Only the first species is affected', 'Effects spread along the chain']] },
    ecoRecover: { idea: 'recover', noise: ['The area is about 20 hectares.', 'A news crew films the area.', 'A biologist marks the spot on a map.'],
      assume: ['Nothing new disturbs the area', ['No seeds can ever reach it', 'Seeds blow or wash in'], ['Recovery happens all at once', 'Recovery comes in stages']] },
    ecoSteward: { idea: 'steward', ask: 'What is the best fix?', noise: ['A neighbour has lived nearby for 30 years.', 'The site is a short drive from town.', 'A local newspaper writes a story about it.'],
      assume: ['Fixing the cause fixes the problem', ['Nature will fix it on its own', 'It is already getting worse'], ['Any change at all will help', 'Only fixing the cause helps']] },
    plCell: { idea: 'cell', noise: ['The microscope is set to 400× magnification.', 'The slide was made the day before.', 'A drop of water keeps the sample from drying out.'] },
    plVessel: { idea: 'vessel', noise: ['The plant is labelled with a small stake.', 'Someone takes a photo of it.', 'It was planted in early May.'] },
    plRepro: { idea: 'repro', noise: ['This happens near Red Deer.', 'Someone takes a photo of it.', 'A friend asks about it the next day.'] },
    plNeeds: { idea: 'photo', noise: ['The pot is made of red clay.', 'The plant belongs to a Grade 7 class.', 'A student checks it every Monday.'],
      assume: ['Only the one thing named is missing', ['The soil can feed the plant', 'Soil gives water and minerals only'], ['Stored food lasts forever', 'Stored food runs out']] },
    plMass: { idea: 'mass', ask: 'Where did the plant’s new mass come from?', noise: ['The pot sits outside in the sun.', 'The pot has a student’s name on it.', 'The plant gets a little taller every week.'],
      assume: ['Only water was added to the pot', ['The soil was swapped for new soil', 'It’s the same soil'], ['The scale was broken', 'Trust the measurements given']] },
    plPollin: { idea: 'poll', noise: ['The field is next to a gravel road.', 'The crop has grown there for ten years.', 'The flowers bloom for about three weeks.'],
      assume: ['Bees are the main pollinators here', ['Wind carries all the pollen', 'Then bees wouldn’t matter'], ['Seeds form without pollen', 'Seeds need pollination']] },
    plBreed: { idea: 'breed', noise: ['The work is written up in a farm magazine.', 'The seeds are stored in paper bags.', 'Several neighbours want to see the results.'],
      assume: ['Genes pass traits to offspring', ['Plants change on purpose', 'Selection or genes change them'], ['Seeds don’t carry traits', 'Seeds inherit the parents’ traits']] },
    plLight: { idea: 'chain', ask: 'What will happen to the minnows?', noise: ['A cabin sits on the north shore.', 'A wooden dock reaches out from the shore.', 'A family has picnics there each summer.'],
      assume: ['Nothing else feeds the water fleas', ['Fish can make their own food', 'Animals can’t make food'], ['Algae grow well without light', 'Algae need light']] },
    plFarm: { idea: 'farm', ask: 'What is the best fix?', noise: ['The farm has a red barn.', 'The field is 160 acres.', 'The farmer sells the crop in the fall.'],
      assume: ['The pest attacks only this crop', ['Fertilizer kills pests', 'Fertilizer feeds plants only'], ['The pest dies off every winter', 'It builds up year to year']] },
    heMode: { idea: 'mode', noise: ['It happens late in the afternoon.', 'A radio plays in the background.', 'A friend watches and asks what is happening.'] },
    heFlow: { idea: 'flow', noise: ['The room has a blue door.', 'A clock on the wall reads 3:15.', 'Nobody else is in the room.'] },
    heExpand: { idea: 'part', noise: ['This happens in a town in central Alberta.', 'A student writes the date in a lab journal.', 'A friend points it out.'] },
    heAmount: { idea: 'amount', ask: 'Which one has more thermal energy?', noise: ['The thermometer is digital.', 'The readings are taken at noon.', 'A student records them in a table.'],
      assume: ['Both hold the same kind of liquid', ['A bigger thing is always hotter', 'Both are the same temperature'], ['Temperature measures total energy', 'Temperature is average particle speed']] },
    heFeel: { idea: 'cond', noise: ['One of them has a small scratch.', 'One is a bit older than the other.', 'A student writes their names in a table.'],
      assume: ['Both stayed at the air temperature', ['Metal makes its own cold', 'Objects don’t make cold'], ['One of them sat in the sun', 'Same place, same temperature']] },
    heCapacity: { idea: 'cap', noise: ['A student reads about it online.', 'The class talks about it after lunch.', 'A student made a chart of it.'],
      assume: ['Both get about the same heat', ['Water stores cold, not heat', 'Water stores heat, not cold'], ['Some things have no heat', 'Everything has thermal energy']] },
    heInsul: { idea: 'insul', noise: ['Someone writes about it in a journal.', 'A friend asks about it at lunch.', 'The owner has had it for three years.'],
      assume: ['Heat flows from hot to cold', ['Cold can flow like heat', 'Only heat flows'], ['Insulation works like a heater', 'Insulation makes no heat']] },
    heState: { idea: 'state', noise: ['It happens on a Tuesday.', 'A dog naps nearby.', 'A student notes the time: 2:30 p.m.'],
      assume: ['No matter is made or destroyed', ['Particles can grow or shrink', 'Particles keep their size'], ['Cold is a kind of energy', 'Only heat is energy']] },
    heThermal: { idea: 'therm', ask: 'What will happen to the bull trout?', noise: ['Canoeists often paddle there in summer.', 'A walking path runs along the bank.', 'The water still looks clear.'],
      assume: ['Trout need oxygen from the water', ['Warm water holds more oxygen', 'Warm water holds less'], ['Fish don’t need oxygen', 'Fish breathe dissolved oxygen']] },
    stType: { idea: 'type', noise: ['People have built things like it for a long time.', 'A student brings a photo of it to class.', 'A student sketches it in a notebook.'] },
    stLoad: { idea: 'load', noise: ['It was finished three years ago.', 'A student takes a photo of it.', 'Many people pass by it each day.'] },
    stForce: { idea: 'force', noise: ['It happens on a Saturday morning in the spring.', 'A friend watches from nearby and asks questions.', 'Someone takes a photo of it with a phone.'] },
    stBeam: { idea: 'beam', noise: ['The work happens in the summer.', 'It is painted white.', 'A friend helps with the job.'],
      assume: ['The beam is the same all through', ['Only the top feels any force', 'Bending affects both sides'], ['The load pulls the beam up', 'The load pushes down']] },
    stStable: { idea: 'stab', noise: ['One is blue and the other is red.', 'They were bought at the same store.', 'A student photographs them side by side.'],
      assume: ['Both stand on flat, level ground', ['Heavier things never tip', 'CoG and base matter most'], ['Colour changes how it tips', 'Colour doesn’t matter']] },
    stMachine: { idea: 'mach', noise: ['It is a sunny afternoon.', 'A friend watches nearby.', 'The tool was borrowed from a neighbour.'],
      assume: ['The load stays the same', ['Machines make extra energy', 'Machines don’t create energy'], ['Friction makes the job easier', 'Friction makes it harder']] },
    stImprove: { idea: 'design', ask: 'What is the best improvement?', noise: ['The work must be done in two weeks.', 'Someone suggests painting it a bright colour.', 'A friend offers to help.'],
      assume: ['The same materials are available', ['Any change will fix it', 'Match the fix to the failure'], ['It failed for no reason', 'Look for why it failed']] },
    stCoG: { idea: 'stab', noise: ['It is a cloudy morning.', 'A crowd is watching.', 'It happens on a Saturday.'],
      assume: ['The total weight stays the same', ['Heavier is always more stable', 'Where the weight is matters'], ['Strength stops tipping', 'Tipping isn’t breaking']] },
    stMaterial: { idea: 'mat', noise: ['The project starts early in the spring.', 'The parts arrive on a big flatbed truck.', 'Later, the design wins an award.'],
      assume: ['Each material behaves the usual way', ['The strongest material suits every job', 'Match the material to the force'], ['Cost is all that matters', 'It must handle the force']] },
    erRock: { idea: 'rock', noise: ['A geologist collects a sample for the lab.', 'The sample fits in the palm of a hand.', 'It is labelled with the date and place.'] },
    erBound: { idea: 'bound', noise: ['Scientists have studied it for many years.', 'It is shown on a map in the textbook.', 'A student reads about it in a magazine.'] },
    erSurface: { idea: 'surf', noise: ['A photographer takes pictures of it for a calendar.', 'The area is popular with hikers.', 'A student reads about it in a magazine.'] },
    erInterior: { idea: 'layer', noise: ['A poster of it hangs in the science room.', 'Earth is about 4.6 billion years old.', 'A student draws a diagram of it.'] },
    erFossil: { idea: 'foss', noise: ['The cliff is about 30 m high.', 'Visitors often stop to take photos.', 'The museum has a cast of each fossil.'],
      assume: ['The layers formed one after another', ['Fossils move between layers', 'Fossils stay where they formed'], ['All three lived at the same time', 'Layers form at different times']] },
    erQuake: { idea: 'quake', noise: ['Many tourists visit every year.', 'The region is known for its food.', 'The news reports on it often.'],
      assume: ['Plates are still moving slowly', ['Quakes come from the weather', 'Quakes start inside Earth'], ['Plates stopped moving long ago', 'Plates still move cm per year']] },
    erCrystal: { idea: 'crys', noise: ['Both rocks fit in a shoebox.', 'A student found them on a hike.', 'They have number labels on them.'],
      assume: ['Both rocks formed from melted rock', ['Crystal size shows a rock’s age', 'Size shows cooling speed'], ['Colour shows where it cooled', 'Look at crystal size']] },
    erUplift: { idea: 'uplift', noise: ['Tourists visit the area in summer.', 'Photos of the fossils hang in a museum.', 'A student reads about it in a magazine.'],
      assume: ['The animals were buried where they lived', ['The animals climbed the mountain', 'They were sea animals'], ['Mountains never change', 'Plates slowly lift rock']] },
    erPath: { idea: 'cycle', noise: ['A geologist writes it up in a report.', 'The area is near a highway.', 'Pictures of it appear in a textbook.'],
      assume: ['Each change takes a very long time', ['Rocks can never change type', 'The rock cycle changes them'], ['Pressing always melts rock', 'Melting needs far more heat']] },
    erLandform: { idea: 'form', noise: ['Many visitors take photos there.', 'A small café is open all summer.', 'The area is busy in July.'],
      assume: ['Nature shaped it over a long time', ['People shaped the land', 'Ice and water shaped it'], ['It formed in a single day', 'It took a very long time']] }
  };
  const strip = s => String(s).replace(/<[^>]*>/g, '');
  const sentences = s => String(s).split(/(?<=[.!?])\s+(?=[A-Z<])/);
  const choose = (a, ws) => { const errs = ws.map(([t, cue]) => ({ t, cue })); return { a, errs, opts: shuffle([{ v: 'a', t: a }].concat(errs.map((e, k) => ({ v: 'e' + k, t: e.t })))) }; };
  // Turn a story item into a reading item: passage chunks [{t, k: must | opt | no}], ask, idea, assume.
  function reading(it) {
    const R = READ[it.t], ideas = IDEAS[it.unit];
    const story = sentences(it.story).map(s => ({ t: strip(s), k: /<b>/.test(s) ? 'must' : 'opt' }));
    const p = [{ t: pick(SETTING[it.unit]), k: 'no' }].concat(story);
    shuffle(R.noise).concat([pick(UNOISE[it.unit])]).forEach(t => p.splice(rnd(2, p.length), 0, { t, k: 'no' }));
    const wrongIdeas = shuffle(Object.keys(ideas).filter(k => k !== R.idea && !near(k, R.idea))).slice(0, 2);
    it.read = {
      p, ask: R.ask || it.q,
      idea: choose(ideas[R.idea][0], wrongIdeas.map(k => [ideas[k][0], ideas[R.idea][1]])),
      assume: it.lvl > 1 && R.assume ? choose(R.assume[0], R.assume.slice(1)) : null
    };
    return it;
  }
  // The key-facts step: every must sentence tapped, and no red herring.
  function checkFacts(it, sel) {
    const p = it.read.p, s = new Set(sel || []);
    const extra = [...s].filter(i => p[i] && p[i].k === 'no'), missed = p.map((c, i) => c.k === 'must' && !s.has(i) ? i : -1).filter(i => i >= 0);
    if (!extra.length && !missed.length) return { ok: true, cue: 'You found the key facts' };
    return { ok: false, extra, missed, cue: extra.length ? 'A detail you picked doesn’t matter' : missed.length > 1 ? 'Some key facts are missing' : 'One key fact is missing' };
  }
  // A choice step (idea or assume): ok, or the cue for the wrong pick.
  function checkPick(step, v) {
    if (v === 'a') return { ok: true };
    const e = step.errs[+String(v).slice(1)];
    return { ok: false, cue: e ? e.cue : 'Pick one answer' };
  }

  const TOPICS = {
    eco: { 1: [ecoBiotic, ecoRole, ecoArrow], 2: [ecoPyramid, ecoWeb, ecoBiodiv], 3: [ecoChain, ecoRecover, ecoSteward] },
    pla: { 1: [plCell, plVessel, plRepro], 2: [plNeeds, plMass, plPollin], 3: [plBreed, plLight, plFarm] },
    hea: { 1: [heMode, heFlow, heExpand], 2: [heAmount, heFeel, heCapacity], 3: [heInsul, heState, heThermal] },
    str: { 1: [stType, stLoad, stForce], 2: [stBeam, stStable, stMachine], 3: [stImprove, stCoG, stMaterial] },
    ear: { 1: [erRock, erBound, erSurface, erInterior], 2: [erFossil, erQuake, erCrystal], 3: [erUplift, erPath, erLandform] }
  };
  // A round ramps: items 1–3 one step, 4–7 two steps, 8–10 three.
  const lvOf = n => n == null ? Q.rnd(1, 3) : n < 3 ? 1 : n < 7 ? 2 : 3;
  function gen(unit, n) { const it = pick(TOPICS[unit][lvOf(n)])(); it.unit = unit; return reading(it); }
  const genMix = n => gen(pick(Object.keys(TOPICS)), n);
  return { TOPICS, READ, IDEAS, gen, genMix, check, checkFacts, checkPick, reading, lvOf };
})();
/* ===================== MODEL END ===================== */
