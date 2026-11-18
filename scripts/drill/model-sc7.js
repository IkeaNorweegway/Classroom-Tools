/* ===================== MODEL START (no DOM) ===================== */
/* Science 7 word problems v3: scenarios like the workbook and unit-test application questions.
   A scenario: { p: passage, parts: [part, …], pic }. The passage is a list of sentences S(text, tag) and tables
   TB(head, [[cells, tag], …]). A tag says which parts need the chunk as a key fact:
     'ab'  a key fact for parts a and b      'B'  fine to tap for part b, not needed (evidence that rules a choice out)
     '*'   setup: fine to tap, never needed  ''   a detail to skip in every part (believable, but it changes no answer)
   A key fact for one part is fine to tap in the others. A part:
     { lvl: 'ap' (apply) | 'an' (analyze), code (LO), sec (notes section), ask, idea (key in IDEAS), a,
       errs: [[choice, cue (≤ 6 words), step it breaks]], steps: [[label, text]],
       assume: [right, [wrong, cue], [wrong, cue]], explain (last part): [best, [no reasoning, cue], [misconception, cue]],
       pic (else the scenario's) }
   Numbers change from play to play inside ranges where every answer still holds (all data is made up). */
const MODEL = (() => {
  const { rnd, pick, shuffle } = Q;
  const NAMES = ['Ava', 'Liam', 'Noah', 'Maya', 'Ethan', 'Zoe', 'Owen', 'Priya', 'Jayden', 'Hana', 'Lucas', 'Amara', 'Kai', 'Sofia', 'Mateo', 'Leah'];
  const S = (t, k) => ({ t, k: k || '' });
  const TB = (head, rows) => ({ head, rows: rows.map(([cells, k]) => ({ cells: cells.map(String), k: k || '' })) });
  const nf = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const cd = (c, r, i, t, o) => Object.assign({ c, r, i, t }, o || {});

  /* ============ 7-1 · Interactions and Ecosystems ============ */
  function ecoBeaver() {
    const d0 = rnd(3, 6) * 10, d1 = rnd(12, 18) * 10, n0 = rnd(1, 3), n1 = rnd(9, 15), w0 = rnd(70, 95), w1 = rnd(20, 40), cows = pick([35, 40, 45]);
    return {
      p: [S('A creek winds through a cattle pasture near Cold Lake.', '*'),
        S('Last fall, a family of beavers built a dam across it.', 'a'),
        S('Behind the dam, the water rose from ' + d0 + ' cm deep to ' + d1 + ' cm, and a pond formed.', 'a'),
        S('Beavers are most active at night.'),
        S('They eat the bark and twigs of willows, and they cut willow stems to build their dams.', 'b'),
        S('An adult beaver can weigh about 20 kg.'),
        TB(['Along the creek', 'Before the dam', 'One year later'], [[['Duck pairs nesting', n0, n1], 'a'], [['Willow shrubs', w0, w1], 'b'], [['Cattle in the pasture', cows, cows], 'AB']])],
      parts: [
        { lvl: 'ap', code: '7-1-01', sec: 1, idea: 'bio', ask: 'Why did more ducks nest after the dam was built?', a: 'The deeper pond gave them habitat',
          errs: [['Beavers bring the ducks food', 'Beavers feed only themselves', 1], ['Fewer cattle came near', 'The cattle count didn’t change', 0]],
          steps: [['abiotic change', 'the dam raised the water from ' + d0 + ' to ' + d1 + ' cm'], ['living things', 'ducks gained open water to nest and feed: ' + n0 + ' → ' + n1]],
          pic: { k: 'scene', cards: [cd(0, 0, '🦫', 'beaver dam'), cd(1, 0, '💧', 'deeper pond', { s: 0 }), cd(2, 0, '🦆', '?', { q: true, d: 'more ducks' })], arrows: [{ a: 0, b: 1, t: 'water rises', k: 'L', s: 0 }, { a: 1, b: 2, t: 'habitat', k: 'N', s: 1 }] } },
        { lvl: 'an', code: '7-1-02', sec: 2, idea: 'role', ask: 'Why did the willow shrubs drop from ' + w0 + ' to ' + w1 + '?', a: 'Beavers cut and ate them',
          errs: [['Cattle grazed them', 'The cattle count stayed the same', 1], ['The ducks ate them', 'Ducks don’t eat willow stems', 0]],
          assume: ['Nothing else changed in the pasture', ['Beavers also eat ducks', 'Beavers eat plants only'], ['The willows grow back in a year', 'Stick to the data given']],
          steps: [['beaver role', 'beavers are consumers of willow bark and twigs'], ['rule out', 'the cattle stayed at ' + cows + ', so grazing didn’t change'], ['conclusion', 'the beavers cut the willows: ' + w0 + ' → ' + w1]],
          explain: ['Beavers caused it: they eat willow bark and cut stems for the dam, and the cattle stayed at ' + cows + ', so grazing did not change.',
            ['Beavers caused it, because beavers live in the pond now.', 'Say how beavers use willows'],
            ['Beavers caused it: beavers are producers, so they need the willows to make their own food, and the cattle count stayed the same.', 'Beavers are consumers, not producers']],
          pic: { k: 'scene', cards: [cd(0, 0, '🦫', 'beavers'), cd(1, 0, '🌿', '?', { q: true, d: 'willows ' + w0 + ' → ' + w1 }), cd(2, 0, '🐄', 'cattle: ' + cows + ' → ' + cows, { s: 1 })], arrows: [{ a: 1, b: 0, t: 'eaten, cut', k: 'G', s: 0 }, { a: 2, b: 1, k: 'R', dash: true, x: true, s: 1 }] } }
      ]
    };
  }
  function ecoSlough() {
    const o0 = rnd(85, 95) / 10, o1 = rnd(70, 80) / 10, o2 = rnd(20, 35) / 10, f0 = rnd(110, 150), f1 = f0 - rnd(0, 8), f2 = rnd(5, 20);
    return {
      p: [S('A slough sits beside a canola field near Vermilion.', '*'),
        S('In June, heavy rain washed fertilizer from the field into the water.', 'ac'),
        S('The farmer had seeded the canola in early May.'),
        S('Two weeks later, the slough turned bright green with algae.', 'a'),
        S('In late July the algae died and sank, and bacteria began to break them down.', 'b'),
        S('Sticklebacks are small fish, about 5 cm long.'),
        TB(['Slough survey', 'Oxygen (mg/L)', 'Sticklebacks'], [[['June 1', o0, f0], 'B'], [['July 1', o1, f1], 'B'], [['August 15', o2, f2], 'b']])],
      parts: [
        { lvl: 'ap', code: '7-1-04', sec: 5, idea: 'change', ask: 'Why did the algae grow so fast?', a: 'The fertilizer added nutrients',
          errs: [['The rain cooled the water', 'The rain carried fertilizer in', 0], ['The fish stopped eating algae', 'The fish were still there', 0]],
          steps: [['cause', 'rain washed fertilizer into the slough'], ['effect', 'the extra nutrients fed a burst of algae']],
          pic: { k: 'scene', cards: [cd(0, 0, '🌧️', 'heavy rain'), cd(1, 0, '🧪', 'fertilizer', { s: 0 }), cd(2, 0, '🟢', '?', { q: true, d: 'algae boom' })], arrows: [{ a: 0, b: 1, t: 'washes in', k: 'L', s: 0 }, { a: 1, b: 2, t: 'nutrients', k: 'G', s: 1 }] } },
        { lvl: 'an', code: '7-1-02', sec: 2, idea: 'role', ask: 'Why did the oxygen drop to ' + o2 + ' mg/L by August?', a: 'Decomposers used it on dead algae',
          errs: [['Living algae used it all', 'Living algae add oxygen in light', 1], ['The fish breathed it all', 'The fish were there all summer', 1]],
          assume: ['The fish need oxygen from the water', ['Bacteria make oxygen', 'Decomposers use oxygen'], ['The fish died in June', 'The table shows them in July']],
          steps: [['dead algae', 'the algae died and sank in late July'], ['decomposers', 'bacteria used oxygen to break them down'], ['data', 'oxygen fell to ' + o2 + ' mg/L; fish fell to ' + f2]],
          pic: { k: 'chart', cats: ['June 1', 'July 1', 'August 15'], series: [{ t: 'oxygen (mg/L)', k: 'L', v: [o0, o1, o2] }], y: 'oxygen (mg/L)', hl: [2] } },
        { lvl: 'an', code: '7-1-04', sec: 6, idea: 'steward', ask: 'What is the best way to stop this next year?', a: 'Plant a grass strip beside the slough',
          errs: [['Add more fish to the slough', 'That doesn’t stop the cause', 0], ['Scoop out the dead fish', 'That treats the result only', 0]],
          steps: [['the cause', 'fertilizer washing in from the field'], ['the fix', 'a grass strip soaks it up first'], ['the result', 'fewer algae, so less oxygen used up']],
          explain: ['A grass strip soaks up fertilizer before it reaches the water, so fewer algae grow and die, and decomposers use up less oxygen.',
            ['A grass strip is the best fix, because it is good for the environment.', 'Say how it stops the cause'],
            ['A grass strip is best: the grass gives off extra oxygen into the slough, so the fish can still breathe when the algae die.', 'It works by blocking the fertilizer']],
          pic: { k: 'scene', cards: [cd(0, 0, '🌾', 'canola field'), cd(1, 0, '🌱', '?', { q: true, d: 'grass strip' }), cd(2, 0, '💧', 'slough', { s: 2 })], arrows: [{ a: 0, b: 1, t: 'fertilizer', k: 'G', s: 0 }, { a: 1, b: 2, t: 'blocked', k: 'R', dash: true, x: true, s: 1 }] } }
      ]
    };
  }
  function ecoLake() {
    const A = pick([10000, 20000, 30000, 50000]), extra = pick([300, 500, 800]);
    return {
      p: [S('Biologists measure the energy in a small lake in the boreal forest.', '*'),
        S('Algae are the producers. Water fleas eat algae, minnows eat water fleas, and northern pike eat minnows.', 'ab'),
        S('Northern pike can grow more than 1 m long.'),
        TB(['Level', 'Energy (kJ per m² per year)'], [[['Algae', nf(A)], 'a'], [['Water fleas', nf(A / 10)], 'a'], [['Minnows', nf(A / 100)], 'aB'], [['Northern pike', '?'], 'a']]),
        S('The lake is about 8 m deep in the middle.'),
        S('An angler wants to add ' + extra + ' more pike so there will be more to catch.', 'b')],
      parts: [
        { lvl: 'ap', code: '7-1-02', sec: 3, idea: 'ten', ask: 'About how much energy reaches the pike?', a: nf(A / 1000) + ' kJ',
          errs: [[nf(A / 100) + ' kJ', 'That is the minnows’ level', 1], [nf(A * 10) + ' kJ', 'Energy shrinks going up', 0]],
          steps: [['pattern', 'each level gets about 10% of the one below'], ['pike', '10% of ' + nf(A / 100) + ' = ' + nf(A / 1000) + ' kJ']],
          pic: { k: 'layers', bands: [{ i: '🐟', t: 'pike', q: true, d: 'pike: ' + nf(A / 1000) + ' kJ', w: .4, k: 'Y' }, { i: '🐠', t: 'minnows: ' + nf(A / 100) + ' kJ', w: .6, k: 'G' }, { i: '🦐', t: 'water fleas: ' + nf(A / 10) + ' kJ', w: .8, k: 'G' }, { i: '🟢', t: 'algae: ' + nf(A) + ' kJ', w: 1, k: 'N' }] } },
        { lvl: 'an', code: '7-1-02', sec: 3, idea: 'ten', ask: 'What will most likely happen to the extra pike?', a: 'Many will starve or leave',
          errs: [['They will all thrive', 'Little energy reaches the top', 1], ['They will eat the algae', 'Pike are carnivores', 0]],
          assume: ['No new food comes into the lake', ['Pike can eat algae', 'Pike eat other animals'], ['More pike means more energy', 'Energy comes from the level below']],
          steps: [['energy at the top', 'only about 1/1000 of the algae’s energy reaches pike'], ['food limit', 'the minnows can feed only a few pike'], ['prediction', 'many of the ' + extra + ' extra pike starve or leave']],
          explain: ['Many will starve, because only about 1/1000 of the algae’s energy reaches the pike level, so there are not enough minnows for ' + extra + ' more pike.',
            ['Many will starve, because the lake is too small.', 'Use the energy numbers'],
            ['Many will starve, because pike are the biggest animals in the lake, and the biggest animals always need the most energy in a chain.', 'Use the energy at each level']],
          pic: { k: 'scene', cards: [cd(0, 0, '🐠', 'minnows: ' + nf(A / 100) + ' kJ'), cd(1, 0, '🐟', '?', { q: true, d: 'too many pike' }), cd(2, 0, '➕', '+' + extra + ' pike', { s: 1 })], arrows: [{ a: 0, b: 1, t: 'only 10% passes', k: 'G', s: 0 }, { a: 2, b: 1, k: 'R', s: 2 }] } }
      ]
    };
  }
  function ecoFire() {
    const f = [rnd(40, 60), rnd(20, 30), rnd(2, 6)], j = [rnd(8, 14), rnd(26, 40), rnd(12, 18)], s = [0, rnd(2, 5), rnd(8, 14)];
    return {
      p: [S('A forest fire burned a stand of jack pine and spruce north of Lac La Biche.', '*'),
        S('Jack pine cones stay sealed with resin until the heat of a fire opens them.', 'a'),
        S('The fire burned for eleven days before rain put it out.'),
        S('Firefighters came from three provinces to help.'),
        S('Biologists then counted young plants in the same plots for 20 years.', '*'),
        TB(['Plants per 100 m²', 'Year 1', 'Year 5', 'Year 20'], [[['Fireweed', f[0], f[1], f[2]], 'b'], [['Jack pine', j[0], j[1], j[2]], 'aB'], [['White spruce', s[0], s[1], s[2]], 'b']])],
      parts: [
        { lvl: 'ap', code: '7-1-04', sec: 5, idea: 'recover', ask: 'Why do jack pines sprout so soon after the fire?', a: 'Fire opened their cones',
          errs: [['Fire makes new jack pine seeds', 'The seeds were in sealed cones', 0], ['People planted them', 'The cones open from fire heat', 0]],
          steps: [['the cones', 'sealed with resin until heated'], ['the fire', 'heat opened the cones and freed the seeds']],
          pic: { k: 'scene', cards: [cd(0, 0, '🔥', 'fire'), cd(1, 0, '🌰', 'sealed cones', { s: 0 }), cd(2, 0, '🌲', '?', { q: true, d: 'jack pine seedlings' })], arrows: [{ a: 0, b: 1, t: 'heat', k: 'R', s: 0 }, { a: 1, b: 2, t: 'seeds fall', k: 'N', s: 1 }] } },
        { lvl: 'an', code: '7-1-04', sec: 5, idea: 'recover', ask: 'What does the table show about the forest’s recovery?', a: 'Different plants take over in stages',
          errs: [['The forest is back in one year', 'Look at the Year 20 column', 1], ['The fire ended the forest for good', 'Plants returned in Year 1', 0]],
          assume: ['No new fire burns the plots', ['People planted the fireweed', 'It spreads on its own'], ['Spruce seeds can’t reach the plots', 'Spruce shows up by Year 5']],
          steps: [['first', 'fireweed spreads in the open sun: ' + f[0] + ' in Year 1'], ['next', 'jack pine peaks at ' + j[1] + ' in Year 5'], ['later', 'spruce grows to ' + s[2] + ' as the trees shade out fireweed']],
          explain: ['The forest recovers in stages: fireweed spreads first in the open sun, then jack pine and spruce grow and shade it out over 20 years.',
            ['The forest recovers because plants grow back after a fire.', 'Use the numbers in the table'],
            ['The forest recovers in stages: the fireweed slowly turns into jack pine as it grows, and the jack pine later turns into spruce.', 'Each grows from its own seeds']],
          pic: { k: 'chart', cats: ['Year 1', 'Year 5', 'Year 20'], series: [{ t: 'fireweed', k: 'P', v: f }, { t: 'jack pine', k: 'N', v: j }, { t: 'white spruce', k: 'T', v: s }], y: 'plants per 100 m²' } }
      ]
    };
  }
  function ecoBeetle() {
    const c = [-rnd(39, 43), -rnd(24, 29), -rnd(27, 31)], neg = v => String(v).replace('-', '−'), t = [rnd(20, 60), rnd(400, 700), 0]; t[2] = t[1] + rnd(300, 600);
    return {
      p: [S('Mountain pine beetles lay their eggs under the bark of lodgepole pines.', '*'),
        S('The young beetles feed under the bark all winter, and the tree can die.', 'a'),
        S('A long cold snap below −35 °C kills most of the young beetles.', 'ab'),
        S('Lodgepole pines can grow 30 m tall.'),
        S('An adult beetle is about the size of a grain of rice.'),
        TB(['Near Hinton', 'Coldest week (°C)', 'Pines attacked'], [[['Winter 1', neg(c[0]), t[0]], 'b'], [['Winter 2', neg(c[1]), t[1]], 'b'], [['Winter 3', neg(c[2]), t[2]], 'b']]),
        S('Forest A is almost all lodgepole pine. Forest B mixes pine with spruce, aspen and fir.', 'c'),
        S('Both forests are about the same size.', '*')],
      parts: [
        { lvl: 'ap', code: '7-1-01', sec: 1, idea: 'bio', ask: 'Which factor keeps the beetles in check?', a: 'Very cold winters (abiotic)',
          errs: [['The pines’ height (biotic)', 'Height doesn’t stop the beetles', 0], ['The bark (abiotic)', 'Bark is where they live', 0]],
          steps: [['the factor', 'a long cold snap below −35 °C'], ['its effect', 'it kills most young beetles under the bark']],
          pic: { k: 'scene', cards: [cd(0, 0, '❄️', 'below −35 °C'), cd(1, 0, '🪲', '?', { q: true, d: 'most beetles die' }), cd(2, 0, '🌲', 'pines saved', { s: 1 })], arrows: [{ a: 0, b: 1, t: 'kills', k: 'L', s: 0 }, { a: 1, b: 2, k: 'R', dash: true, x: true, s: 1 }] } },
        { lvl: 'an', code: '7-1-04', sec: 5, idea: 'change', ask: 'Why did attacks rise after Winter 1?', a: 'Milder winters let beetles survive',
          errs: [['The beetles got used to the cold', 'Too fast for beetles to adapt', 1], ['Cold weather helps the beetles', 'Look at Winter 1’s numbers', 0]],
          assume: ['Nothing changed but the cold', ['Beetles grew tougher on purpose', 'Beetles can’t adapt in one year'], ['Cold winters help pine beetles', 'Cold kills the young beetles']],
          steps: [['Winter 1', neg(c[0]) + ' °C: only ' + t[0] + ' pines attacked'], ['Winters 2–3', 'never below ' + neg(Math.min(c[1], c[2])) + ' °C, so most young beetles lived'], ['result', 'attacks rose to ' + nf(t[2])]],
          pic: { k: 'chart', cats: ['Winter 1 (' + neg(c[0]) + ' °C)', 'Winter 2 (' + neg(c[1]) + ' °C)', 'Winter 3 (' + neg(c[2]) + ' °C)'], series: [{ t: 'pines attacked', k: 'R', v: t }], y: 'pines attacked', hl: [1, 2] } },
        { lvl: 'an', code: '7-1-03', sec: 4, idea: 'div', ask: 'Which forest will lose a smaller share of its trees?', a: 'Forest B, the mixed forest',
          errs: [['Forest A, all pine', 'The beetles attack only pines', 1], ['Both lose the same share', 'Count the kinds of trees', 0]],
          assume: ['The beetles attack only pines', ['Beetles attack every kind of tree', 'They need lodgepole pine'], ['Forest B is colder', 'The story doesn’t say so']],
          steps: [['the pest', 'beetles kill only pines'], ['Forest B', 'most of its trees are spruce, aspen and fir'], ['result', 'Forest B keeps most of its trees']],
          explain: ['Forest B loses a smaller share, because the beetles attack only pines, and most of its trees are spruce, aspen and fir.',
            ['Forest B, because it has more biodiversity.', 'Say why biodiversity helps here'],
            ['Forest B loses a smaller share, because a mixed forest is always colder in winter, so more of the young beetles die there.', 'Nothing says Forest B is colder']],
          pic: { k: 'scene', cards: [cd(.5, 0, '🪲', 'pine beetle'), cd(0, 1, '🌲', 'Forest A', { tag: 'all pine', tagk: 'R' }), cd(1, 1, '🌳', '?', { q: true, d: 'Forest B', tag: 'mixed' })], arrows: [{ a: 0, b: 1, k: 'R', dash: true }, { a: 0, b: 2, k: 'R', dash: true }] } }
      ]
    };
  }
  function ecoOwl() {
    const y = rnd(3, 5), b1 = rnd(6, 14), o1 = rnd(0, 1), b2 = rnd(120, 190), o2 = rnd(4, 8);
    return {
      p: [S('Burrowing owls nest in the grasslands of southern Alberta.', '*'),
        S('They do not dig their own homes. They nest in old burrows dug by ground squirrels.', 'ab'),
        S('A burrowing owl stands about 25 cm tall on long legs.'),
        S('The owls eat grasshoppers, beetles and mice.', 'A'),
        S('Each fall they fly south to Texas and Mexico for the winter.'),
        S('On one ranch, the owner poisoned the ground squirrels. Over ' + y + ' years, their empty burrows caved in.', 'a'),
        TB(['After ' + y + ' years', 'Squirrel burrows', 'Owl pairs'], [[['Ranch with poison', b1, o1], 'ab'], [['Ranch next door', b2, o2], 'aB']])],
      parts: [
        { lvl: 'ap', code: '7-1-02', sec: 2, idea: 'web', ask: 'Why did the owl pairs drop on the poisoned ranch?', a: 'They lost the burrows they nest in',
          errs: [['Owls mainly eat ground squirrels', 'They eat insects and mice', 0], ['The winters got colder', 'The owls leave for winter', 0]],
          steps: [['the link', 'owls nest in burrows that squirrels dig'], ['the effect', 'no squirrels, burrows cave in: ' + b1 + ' left, ' + o1 + ' owl pair' + (o1 === 1 ? '' : 's')]],
          pic: { k: 'scene', cards: [cd(0, 0, '🐿️', 'ground squirrels', { x: true }), cd(1, 0, '🕳️', 'burrows: ' + b1, { s: 0 }), cd(2, 0, '🦉', '?', { q: true, d: 'owls ↓' })], arrows: [{ a: 0, b: 1, t: 'dig', k: 'G', s: 0 }, { a: 1, b: 2, t: 'nest in', k: 'G', s: 1 }] } },
        { lvl: 'an', code: '7-1-04', sec: 6, idea: 'steward', ask: 'Which plan best helps owls return to that ranch?', a: 'Stop the poison so squirrels return',
          errs: [['Leave out mice to feed the owls', 'Food isn’t what is missing', 1], ['Release more grasshoppers', 'Nesting sites are missing', 1]],
          assume: ['Owls need burrows to nest', ['Owls can dig burrows', 'They don’t dig their own'], ['Owls stay all winter', 'They fly south each fall']],
          steps: [['the cause', 'poison removed the squirrels that dig burrows'], ['the fix', 'stop the poison; squirrels dig again'], ['the result', 'new burrows give owls places to nest']],
          explain: ['Stopping the poison lets ground squirrels come back and dig burrows, so the owls get nesting places again. That fixes the cause.',
            ['Stop the poison, because poison is bad for animals.', 'Link squirrels to burrows'],
            ['Stopping the poison is best: the poison soaked into the grass, and the owls were getting sick from eating that grass.', 'Owls eat insects and mice']],
          pic: { k: 'scene', cards: [cd(0, 0, '☠️', 'poison stops'), cd(1, 0, '🐿️', 'squirrels return', { s: 0 }), cd(2, 0, '🕳️', 'new burrows', { s: 1 }), cd(3, 0, '🦉', '?', { q: true, d: 'owls nest again' })], arrows: [{ a: 0, b: 1, k: 'G', s: 0 }, { a: 1, b: 2, t: 'dig', k: 'G', s: 1 }, { a: 2, b: 3, t: 'nest in', k: 'N', s: 2 }] } }
      ]
    };
  }
  function ecoElk() {
    const e1 = rnd(8, 14), e2 = rnd(1, 3), a1 = rnd(2, 6), a2 = rnd(30, 50);
    return {
      p: [S('In Banff National Park, wolves hunt elk.', '*'),
        S('Wolves avoid the busy town, so many elk stay close to town, where they are safe.', 'aB'),
        S('Banff became Canada’s first national park in 1885.'),
        S('Elk eat young aspen trees and willow shoots.', 'ab'),
        S('An adult elk can weigh more than 300 kg.'),
        TB(['Area', 'Elk per km²', 'Young aspen per plot'], [[['Near town', e1, a1], 'ab'], [['Far from town', e2, a2], 'aB']]),
        S('Beavers need aspen and willow to eat and to build their dams.', 'b')],
      parts: [
        { lvl: 'ap', code: '7-1-02', sec: 2, idea: 'web', ask: 'Why are there so few young aspen near town?', a: 'Many elk eat them there',
          errs: [['Wolves eat the aspen', 'Wolves are carnivores', 0], ['Aspen don’t grow near towns', 'They grow far from town', 0]],
          steps: [['the elk', e1 + ' elk per km² near town, ' + e2 + ' far away'], ['the aspen', 'more elk eating them: ' + a1 + ' young aspen vs ' + a2]],
          pic: { k: 'chart', cats: ['Near town', 'Far from town'], series: [{ t: 'elk per km²', k: 'G', v: [e1, e2] }, { t: 'young aspen', k: 'N', v: [a1, a2] }], y: 'count', hl: [0] } },
        { lvl: 'an', code: '7-1-04', sec: 5, idea: 'change', ask: 'What will most likely happen to beavers near town?', a: 'Fewer beavers: less food and wood',
          errs: [['More beavers', 'Aspen and willow are their food', 1], ['No change: beavers don’t eat elk', 'Changes spread through the web', 0]],
          assume: ['Beavers near town rely on that aspen', ['Elk hunt beavers', 'Elk eat plants'], ['Beavers swim to far-off areas', 'Stick to what the story says']],
          steps: [['wolves', 'wolves stay away, so elk gather near town'], ['elk', 'the elk eat most young aspen and willow'], ['beavers', 'less food and wood, so fewer beavers']],
          explain: ['Fewer wolves near town means more elk there; the elk eat most young aspen and willow, so beavers have less food and wood and decrease.',
            ['Beavers decrease because of the elk.', 'Show each link in the chain'],
            ['Fewer beavers: the elk drink the same water as the beavers, so the beavers lose their ponds and have to leave town.', 'The link is food and wood']],
          pic: { k: 'scene', cards: [cd(0, 0, '🐺', 'wolves stay away'), cd(1, 0, '🦌', 'more elk', { s: 0 }), cd(2, 0, '🌳', 'fewer aspen', { s: 1 }), cd(3, 0, '🦫', '?', { q: true, d: 'fewer beavers' })], arrows: [{ a: 0, b: 1, k: 'G', s: 0 }, { a: 1, b: 2, t: 'eat', k: 'G', s: 1 }, { a: 2, b: 3, t: 'food', k: 'G', s: 2 }] } }
      ]
    };
  }
  function ecoMussel() {
    const m = rnd(15, 40) * 100, c0 = rnd(12, 18) / 10, c1 = rnd(32, 45) / 10, w0 = rnd(35, 50), w1 = rnd(8, 15);
    return {
      p: [S('Zebra mussels are a small invasive species from Europe. They are not yet in Alberta.', '*'),
        S('One mussel filters about 1 L of water a day and eats the algae in it.', 'a'),
        S('Their shells have dark zigzag stripes.'),
        S('In a lake in Manitoba, the mussels spread over the lake bottom in a few years.', 'a'),
        TB(['Lake survey', 'Mussels per m²', 'Water clarity (m)', 'Water fleas per L'], [[['Before', 0, c0, w0], 'aB'], [['3 years later', nf(m), c1, w1], 'ab']]),
        S('Water fleas eat algae, and young fish eat water fleas.', 'b'),
        S('Many people fish for walleye on the lake in summer.'),
        S('Mussels can ride from lake to lake stuck to boats or in the water inside them.', 'c')],
      parts: [
        { lvl: 'ap', code: '7-1-04', sec: 5, idea: 'change', ask: 'Why did the water get clearer?', a: 'The mussels filtered out the algae',
          errs: [['Water fleas ate more algae', 'The water fleas went down', 0], ['Fewer people fished there', 'Fishing wasn’t measured', 0]],
          steps: [['the mussels', nf(m) + ' per m², each filtering about 1 L a day'], ['clarity', 'less algae, so clarity rose: ' + c0 + ' → ' + c1 + ' m']],
          pic: { k: 'scene', cards: [cd(0, 0, '🐚', 'zebra mussels'), cd(1, 0, '🟢', 'algae ↓', { s: 0 }), cd(2, 0, '💧', '?', { q: true, d: 'clearer water' })], arrows: [{ a: 1, b: 0, t: 'filtered, eaten', k: 'G', s: 0 }, { a: 1, b: 2, k: 'L', s: 1 }] } },
        { lvl: 'an', code: '7-1-02', sec: 2, idea: 'web', ask: 'What will most likely happen to the young fish?', a: 'Fewer: less food for them',
          errs: [['More: clearer water helps them', 'Follow the food, not the view', 1], ['No change: they don’t eat algae', 'Their food eats algae', 1]],
          assume: ['Young fish rely on water fleas', ['Young fish eat mussels', 'Story: they eat water fleas'], ['Algae will come back soon', 'Stick to the data given']],
          steps: [['algae', 'the mussels eat the algae'], ['water fleas', 'less algae: water fleas ' + w0 + ' → ' + w1 + ' per L'], ['young fish', 'less food, so fewer young fish']],
          pic: { k: 'scene', cards: [cd(0, 0, '🐚', 'mussels'), cd(1, 0, '🟢', 'algae ↓'), cd(2, 0, '🦐', 'water fleas ↓', { s: 1 }), cd(3, 0, '🐟', '?', { q: true, d: 'young fish ↓' })], arrows: [{ a: 1, b: 0, t: 'eaten', k: 'G', s: 0 }, { a: 1, b: 2, t: 'food', k: 'G', s: 1 }, { a: 2, b: 3, t: 'food', k: 'G', s: 2 }] } },
        { lvl: 'an', code: '7-1-04', sec: 6, idea: 'steward', ask: 'What is Alberta’s best plan for its lakes?', a: 'Inspect and clean every boat',
          errs: [['Remove mussels once they arrive', 'Very hard once they spread', 1], ['Add water fleas to the lakes', 'That doesn’t stop the mussels', 0]],
          steps: [['the risk', 'mussels ride in on boats from other lakes'], ['the fix', 'clean, drain and dry every boat'], ['why first', 'stopping them is easier than removing them']],
          explain: ['Inspecting and cleaning boats stops mussels before they arrive, because once they spread they eat the algae that the lake’s food web depends on.',
            ['Inspect boats, because invasive species are bad.', 'Say how they arrive and harm'],
            ['Inspect and clean every boat: boats carry the algae that the mussels eat, so cleaning them starves out any mussels in the lake.', 'Boats carry the mussels themselves']],
          pic: { k: 'scene', cards: [cd(0, 0, '🚤', 'boat from Manitoba'), cd(1, 0, '🧽', '?', { q: true, d: 'clean, drain, dry' }), cd(2, 0, '🏞️', 'Alberta lake', { s: 2 })], arrows: [{ a: 0, b: 1, k: 'G', s: 0 }, { a: 1, b: 2, t: 'no mussels', k: 'N', s: 1 }] } }
      ]
    };
  }
  function ecoLitter() {
    const n = pick(NAMES), wk = pick([8, 10, 12]), a = rnd(6, 9), b = rnd(13, 16);
    return {
      p: [S(n + '’s class tests how fast dead leaves break down in an aspen forest.', '*'),
        S('They fill two mesh bags with 20 g of dry aspen leaves each.', 'a'),
        S('Bag A has big holes, so earthworms and insects can crawl in. Bag B has tiny holes, so only bacteria and fungi get in.', 'a'),
        S('Both bags lie side by side on the forest floor.', 'A'),
        S('Aspen leaves turn bright yellow in September.'),
        TB(['Leaves left', 'Start', 'After ' + wk + ' weeks'], [[['Bag A (big holes)', '20 g', a + ' g'], 'a'], [['Bag B (tiny holes)', '20 g', b + ' g'], 'a']]),
        S('The class uses a kitchen scale that reads to the nearest gram.'),
        S(n + ' says, “Without decomposers, the forest would slowly run out of nutrients.”', 'b')],
      parts: [
        { lvl: 'ap', code: '7-1-02', sec: 2, idea: 'role', ask: 'Why did Bag A lose more mass than Bag B?', a: 'More decomposers could get in',
          errs: [['Bag A got more sunlight', 'They lay side by side', 0], ['Bag B’s leaves grew back', 'Dead leaves can’t grow', 0]],
          steps: [['the difference', 'only Bag A let in earthworms and insects'], ['the data', 'Bag A fell to ' + a + ' g, Bag B to ' + b + ' g']],
          pic: { k: 'chart', cats: ['Bag A (big holes)', 'Bag B (tiny holes)'], series: [{ t: 'g left', k: 'G', v: [a, b], f: v => v + ' g' }], y: 'leaves left (g)', hl: [0] } },
        { lvl: 'an', code: '7-1-02', sec: 2, idea: 'role', ask: 'Is ' + n + ' right?', a: 'Yes: decomposers recycle nutrients',
          errs: [['No: plants make nutrients from light', 'Light makes sugar, not minerals', 1], ['No: decomposers only clean up', 'They return nutrients to the soil', 0]],
          assume: ['Plants take nutrients from the soil', ['Dead leaves vanish on their own', 'Something must break them down'], ['Rain brings all the nutrients', 'Nutrients come from dead matter']],
          steps: [['decomposers', 'break dead leaves down into nutrients'], ['soil', 'the nutrients return to the soil'], ['producers', 'aspens take them up to grow']],
          explain: ['Yes, because decomposers break dead leaves into nutrients in the soil, and producers like aspens take up those nutrients to grow.',
            ['Yes, because decomposers are important.', 'Say what decomposers return'],
            ['Yes: decomposers are producers that make food from sunlight, and they pass that food to the aspens through the soil.', 'Decomposers break down dead matter']],
          pic: { k: 'scene', cards: [cd(0, 0, '🍂', 'dead leaves'), cd(1, 0, '🪱', 'decomposers', { s: 0 }), cd(2, 0, '🟤', '?', { q: true, d: 'nutrients in soil' }), cd(1, 1, '🌳', 'aspen', { s: 2 })], arrows: [{ a: 0, b: 1, t: 'broken down', k: 'G', s: 0 }, { a: 1, b: 2, k: 'G', s: 1 }, { a: 2, b: 3, t: 'taken up', k: 'N', s: 2 }, { a: 3, b: 0, t: 'drops', k: 'M', dash: true }] } }
      ]
    };
  }
  function ecoDrought() {
    const k = rnd(25, 40), rain = rnd(140, 170), n1 = rnd(28, 34) / 100, n2 = rnd(40, 46) / 100, d1 = Math.round(n1 * rnd(75, 85)) / 100, d2 = Math.round(n2 * rnd(25, 35)) / 100;
    const kg = v => v.toFixed(2);
    return {
      p: [S('Two fields sit side by side near Hanna.', '*'),
        S('Field 1 is native prairie with about ' + k + ' kinds of grasses and flowers. Field 2 was planted with one kind of grass.', 'ab'),
        S('Both fields are fenced, and neither is grazed.', '*'),
        S('Field 2’s grass is a type often cut for hay.'),
        S('Then came a dry summer: only ' + rain + ' mm of rain fell, about half the usual amount.', 'b'),
        S('Hanna is known for its strong winds.'),
        TB(['Plant growth (kg per m²)', 'Normal year', 'Dry year'], [[['Field 1', kg(n1), kg(d1)], 'AB'], [['Field 2', kg(n2), kg(d2)], 'AB']])],
      parts: [
        { lvl: 'ap', code: '7-1-03', sec: 4, idea: 'div', ask: 'Which field has more biodiversity?', a: 'Field 1',
          errs: [['Field 2: it grows more', 'Biodiversity counts kinds, not mass', 0], ['They are the same', 'Count the kinds of species', 0]],
          steps: [['biodiversity', 'the number of kinds of living things'], ['compare', 'Field 1: about ' + k + ' kinds; Field 2: one kind']],
          pic: { k: 'scene', cards: [cd(0, 0, '🌼', 'Field 1', { tag: k + ' kinds' }), cd(1, 0, '🌾', 'Field 2', { tag: '1 kind', tagk: 'R' })] } },
        { lvl: 'an', code: '7-1-03', sec: 4, idea: 'div', ask: 'Which field held up better in the dry year?', a: 'Field 1: it lost a smaller share',
          errs: [['Field 2: it grew the most', 'Compare the dry-year column', 1], ['Both dropped the same', 'Work out each drop', 1]],
          assume: ['Both fields got the same rain', ['Field 2 was watered', 'The story doesn’t say so'], ['Wind hit only one field', 'They sit side by side']],
          steps: [['Field 1', kg(n1) + ' → ' + kg(d1) + ': a small drop'], ['Field 2', kg(n2) + ' → ' + kg(d2) + ': it lost more than half'], ['why', 'with many kinds, some cope with drought']],
          explain: ['Field 1 held up better: with many kinds of plants, some cope with drought, so its growth fell only a little while Field 2’s one grass fell by more than half.',
            ['Field 1, because native prairie is natural.', 'Use the data and biodiversity'],
            ['Field 1 held up better, because native prairie plants don’t need any water, so a dry summer can’t hurt them at all.', 'Field 1’s growth dropped too']],
          pic: { k: 'chart', cats: ['Field 1 (' + k + ' kinds)', 'Field 2 (1 kind)'], series: [{ t: 'normal year', k: 'N', v: [n1, n2], f: kg }, { t: 'dry year', k: 'G', v: [d1, d2], f: kg }], y: 'kg per m²', hl: [0] } }
      ]
    };
  }
  function ecoCaribou() {
    const m0 = rnd(20, 30), m1 = rnd(70, 110), w0 = rnd(4, 6), w1 = rnd(11, 16), c0 = rnd(90, 120), c1 = rnd(35, 55);
    return {
      p: [S('Woodland caribou live in old forests and peat bogs in northern Alberta.', '*'),
        S('Few moose or deer live there, so few wolves live there either.', 'a'),
        S('A caribou’s wide hooves help it walk on snow.'),
        S('Logging and oil work cut roads and long straight lines through the forest.', 'ab'),
        S('Young shrubs grow on the cleared ground, and moose and deer move in to eat them.', 'ab'),
        TB(['Per 1000 km²', 'Before', '20 years later'], [[['Moose', m0, m1], 'a'], [['Wolves', w0, w1], 'aB'], [['Caribou', c0, c1], 'B']]),
        S('Wolves also travel fast along the straight lines, so they reach caribou more easily.', 'b'),
        S('Caribou eat lichens, which grow slowly on old trees and on the ground.', 'B'),
        S('Caribou calves are born in late spring.')],
      parts: [
        { lvl: 'ap', code: '7-1-02', sec: 2, idea: 'web', ask: 'Why did the wolves increase?', a: 'More moose and deer to eat',
          errs: [['Wolves eat the new shrubs', 'Wolves are carnivores', 0], ['More caribou to eat', 'The caribou went down', 0]],
          steps: [['the change', 'clearings grow shrubs; moose rise ' + m0 + ' → ' + m1], ['wolves', 'more prey, so wolves rise ' + w0 + ' → ' + w1]],
          pic: { k: 'scene', cards: [cd(0, 0, '🛣️', 'roads, lines'), cd(1, 0, '🌿', 'shrubs'), cd(2, 0, '🫎', 'moose ' + m0 + ' → ' + m1, { s: 0 }), cd(3, 0, '🐺', '?', { q: true, d: 'wolves ' + w0 + ' → ' + w1 })], arrows: [{ a: 0, b: 1, k: 'G' }, { a: 1, b: 2, t: 'food', k: 'G', s: 0 }, { a: 2, b: 3, t: 'prey', k: 'G', s: 1 }] } },
        { lvl: 'an', code: '7-1-04', sec: 6, idea: 'steward', ask: 'Which plan best protects the caribou?', a: 'Replant the old lines and clearings',
          errs: [['Leave out lichen for the caribou', 'Hunger isn’t the main cause', 0], ['Cut more lines for patrols', 'The lines help wolves', 1]],
          assume: ['Wolves are the main threat', ['Caribou are running out of lichen', 'The story doesn’t say so'], ['Wolves eat shrubs', 'Wolves are carnivores']],
          steps: [['the cause', 'lines and clearings bring moose, then wolves'], ['the fix', 'replanting removes shrubs and wolf paths'], ['the result', 'fewer wolves reach the caribou']],
          explain: ['Replanting the lines removes the shrubs that draw in moose and deer and the paths wolves travel on, which fixes the cause of more wolves near caribou.',
            ['Replant the lines, because caribou like trees.', 'Link the lines to the wolves'],
            ['Replant the lines: the young trees will grow lichen for the caribou to eat right away, which ends their hunger.', 'Wolves, not hunger, are the cause']],
          pic: { k: 'chart', cats: ['Moose', 'Wolves', 'Caribou'], series: [{ t: 'before', k: 'M', v: [m0, w0, c0] }, { t: '20 years later', k: 'G', v: [m1, w1, c1] }], y: 'per 1000 km²', hl: [2] } }
      ]
    };
  }
  function ecoQuadrat() {
    const n = pick(NAMES), lA = rnd(10, 20), kA = rnd(1, 3), kB = rnd(8, 12), m = rnd(22, 28), mB = m + pick([-1, 1, 2]), e = rnd(20, 40), eB = e + rnd(-4, 4);
    return {
      p: [S(n + '’s class surveys two spots in a schoolyard in Edmonton.', '*'),
        S('Spot A is under a row of tall spruce trees. Spot B is an open lawn.', 'a'),
        S('The spruce trees were planted when the school opened in 1974.'),
        S('The class counts everything inside a 1 m square frame called a quadrat.', '*'),
        TB(['Survey', 'Light (% of full sun)', 'Soil moisture (%)', 'Kinds of plants'], [[['Spot A (spruce)', lA, m, kA], 'a'], [['Spot B (lawn)', 100, mB, kB], 'a']]),
        S('They also find about ' + e + ' earthworms per square metre in each spot.', 'A'),
        S('The spruce trees are about 15 m tall.'),
        S(n + ' thinks light is the cause and wants to test it.', 'b')],
      parts: [
        { lvl: 'ap', code: '7-1-01', sec: 1, idea: 'bio', ask: 'Which abiotic factor best explains fewer plants at Spot A?', a: 'Less sunlight',
          errs: [['Soil moisture', 'Moisture is about the same', 0], ['The earthworms', 'Earthworms are biotic and equal', 0]],
          steps: [['compare', 'light: ' + lA + '% vs 100%; moisture about the same'], ['the cause', 'less light, so fewer kinds of plants: ' + kA + ' vs ' + kB]],
          pic: { k: 'chart', cats: ['Spot A (spruce)', 'Spot B (lawn)'], series: [{ t: 'light (%)', k: 'Y', v: [lA, 100] }, { t: 'soil moisture (%)', k: 'L', v: [m, mB] }, { t: 'kinds of plants', k: 'N', v: [kA, kB] }], y: 'survey' } },
        { lvl: 'an', code: '7-1-01', sec: 1, idea: 'bio', ask: 'Which test of light is fair?', a: 'Shade part of the lawn only',
          errs: [['Count plants in winter too', 'That changes the season too', 1], ['Cut down the spruce trees', 'That changes more than light', 1]],
          assume: ['Only light changes in a fair test', ['Every factor should change', 'Change one factor only'], ['One quadrat is enough proof', 'Fair tests compare']],
          steps: [['one factor', 'change only the light'], ['keep the same', 'same lawn, soil and water for both parts'], ['compare', 'count kinds of plants in shaded vs open']],
          explain: ['Shade one part of the lawn and leave another part open, so light is the only factor that changes; if the shaded part grows fewer kinds, light is the cause.',
            ['Shade part of the lawn and see what happens.', 'Say what stays the same'],
            ['Shade part of the lawn and water that part more too, so two factors change and the difference in plants is bigger.', 'Change only one factor']],
          pic: { k: 'scene', cards: [cd(0, 0, '⛱️', 'shaded lawn'), cd(1, 0, '☀️', 'open lawn'), cd(.5, 1, '🌱', '?', { q: true, d: 'compare the plants' })], arrows: [{ a: 0, b: 2, k: 'G', s: 2 }, { a: 1, b: 2, k: 'G', s: 2 }] } }
      ]
    };
  }

  /* ============ 7-2 · Plants for Food and Fibre ============ */
  function plCells() {
    const n = pick(NAMES);
    return {
      p: [S(n + '’s class looks at cells under a microscope at a school in Red Deer.', '*'),
        S('Slide 1 is a thin leaf from Elodea, a pond plant that grows in sunlight.', 'a'),
        S('Slide 2 is skin peeled from inside an onion bulb, which grows underground.', 'a'),
        S('The class stains Slide 2 with iodine so the nucleus shows up.'),
        S('The microscope magnifies ' + pick([100, 400]) + ' times.'),
        TB(['Seen in the cells', 'Slide 1 (Elodea)', 'Slide 2 (onion)'], [[['Boxy outer edge (wall)', 'yes', 'yes'], 'B'], [['Large clear sac (vacuole)', 'yes', 'yes'], 'B'], [['Green ovals', 'many', 'none'], 'a']]),
        S('Then the teacher shows Slide 3, from a carrot root: boxy cells with a wall and a large vacuole, but no green ovals.', 'b'),
        S('Carrots are orange because of a pigment called carotene.')],
      parts: [
        { lvl: 'ap', code: '7-2-01', sec: 1, idea: 'cell', ask: 'Why do only the Elodea cells have green ovals?', a: 'Its chloroplasts catch light for food',
          errs: [['Onion cells are animal cells', 'Onion cells have walls too', 0], ['The iodine bleached the green', 'The bulb grows in the dark', 1]],
          steps: [['the green ovals', 'chloroplasts, where photosynthesis happens'], ['the onion', 'a bulb underground gets no light, so it has none']],
          pic: { k: 'cell', part: 'chloroplast', d: 'chloroplasts' } },
        { lvl: 'an', code: '7-2-01', sec: 1, idea: 'cell', ask: 'Is Slide 3 a plant cell?', a: 'Yes: it has a wall and a big vacuole',
          errs: [['No: plant cells must be green', 'Roots grow in the dark', 1], ['No: it is an animal cell', 'Animal cells have no wall', 0]],
          assume: ['A root gets no light underground', ['Every plant part is green', 'Only parts in light are green'], ['Carrots are not made of cells', 'All living things are cells']],
          steps: [['the clues', 'a cell wall and a large vacuole'], ['no chloroplasts', 'a root grows in the dark'], ['conclusion', 'a plant cell, from a part that gets no light']],
          explain: ['Yes: it has a cell wall and a large vacuole, which animal cells lack. It has no chloroplasts because a root grows in the dark.',
            ['Yes, because carrots are plants.', 'Use what the cells show'],
            ['No: every plant cell has chloroplasts to make its own food, so a cell with no green ovals must come from an animal.', 'Roots in the dark lack them']],
          pic: { k: 'cell', part: 'wall', chl: false, d: 'wall + vacuole: plant' } }
      ]
    };
  }
  function plCelery() {
    const n = pick(NAMES), h1 = rnd(2, 5);
    return {
      p: [S(n + ' puts a stalk of celery in a cup of water with blue food colouring.', 'a'),
        S('The celery came from a farmers’ market in Lethbridge.'),
        TB(['Time', 'How far the blue reached'], [[['After 1 hour', h1 + ' cm up the stalk'], 'a'], [['After 1 day', 'the tips of the leaves'], 'a']]),
        S('When ' + n + ' cuts across the stalk, the blue shows only in small dots near the outside, in tubes that run up the stalk.', 'ab'),
        S('Celery is about 95% water, so it is very crunchy.'),
        S('The leaves make sugar in sunlight. The roots, deep in the dark soil, need sugar to grow too.', 'b'),
        S('The teacher says sugar travels in a different set of tubes.', 'b'),
        S('Celery is often eaten with peanut butter.')],
      parts: [
        { lvl: 'ap', code: '7-2-02', sec: 2, idea: 'vessel', ask: 'What do the blue dots show?', a: 'Xylem tubes carry water up',
          errs: [['Phloem carries water down', 'The dye moved up', 0], ['Water soaks through every cell', 'The dye stayed in tubes', 1]],
          steps: [['the dye', 'blue rose from the cup to the leaf tips'], ['the tubes', 'only in small tubes: xylem carries water up']],
          pic: { k: 'scene', cards: [cd(0, 0, '🥤', 'blue water'), cd(1, 0, '🌿', 'stalk tubes', { s: 0 }), cd(2, 0, '🍃', '?', { q: true, d: 'xylem: up to leaves' })], arrows: [{ a: 0, b: 1, t: 'up', k: 'L', s: 0 }, { a: 1, b: 2, t: 'up', k: 'L', s: 1 }] } },
        { lvl: 'an', code: '7-2-02', sec: 2, idea: 'vessel', ask: 'Which way does sugar move, and in what?', a: 'Down from the leaves, in phloem',
          errs: [['Up from the roots, in xylem', 'Roots in the dark make none', 0], ['Down in the same blue tubes', 'Those tubes carry water up', 1]],
          assume: ['Roots can’t make their own sugar', ['Roots take sugar from the soil', 'Soil gives water and minerals'], ['Sugar moves with the dye', 'The dye only went up']],
          steps: [['where it’s made', 'leaves make sugar in the light'], ['where it’s needed', 'roots in the dark soil'], ['the tubes', 'phloem carries sugar down to them']],
          explain: ['Down in the phloem: the leaves make sugar in the light, the roots in dark soil can’t, and the xylem tubes carry water up, not sugar down.',
            ['Down in the phloem, because that is what phloem does.', 'Say where the sugar is made'],
            ['Up in the xylem: the roots take sugar out of the soil, and the same tubes that carried the blue dye carry it up to the leaves.', 'Leaves make sugar; soil doesn’t']],
          pic: { k: 'scene', cards: [cd(0, 0, '☀️', 'leaves make sugar'), cd(1, 0, '🌿', '?', { q: true, d: 'phloem: down' }), cd(2, 0, '🟫', 'roots in soil', { s: 1 })], arrows: [{ a: 0, b: 1, t: 'sugar', k: 'G', s: 0 }, { a: 1, b: 2, t: 'down', k: 'G', s: 2 }] } }
      ]
    };
  }
  function plMass() {
    const n = pick(NAMES), t1 = rnd(8, 14), gain = (t1 * 10 - 2) / 10, loss = rnd(1, 2) / 10, s1 = (500 - loss * 10) / 10;
    return {
      p: [S(n + ' plants a 0.2 kg poplar cutting in a tub of 50.0 kg of dry soil.', 'a'),
        S('For five years she adds only water. She covers the soil so nothing falls in.', 'a'),
        S('The tub sits in her backyard in Grande Prairie.'),
        TB(['Mass (kg)', 'Start', 'After 5 years'], [[['Poplar tree', '0.2', t1], 'ab'], [['Dry soil', '50.0', s1.toFixed(1)], 'ab']]),
        S('Poplars drop their leaves every fall, and she rakes them up.'),
        S('Each spring, the first leaves open in early May.'),
        S('Her brother says, “The tree must have eaten the soil.”', 'b')],
      parts: [
        { lvl: 'ap', code: '7-2-03', sec: 3, idea: 'mass', ask: 'Where did most of the tree’s new mass come from?', a: 'CO₂ from the air, plus water',
          errs: [['The soil it took in', 'The soil lost only ' + loss + ' kg', 0], ['Sunlight turned into wood', 'Light gives energy, not mass', 1]],
          steps: [['the soil', 'soil fell only 50.0 → ' + s1.toFixed(1) + ' kg'], ['the tree', 'CO₂ and water built ' + gain + ' kg of new tree']],
          pic: { k: 'scene', cards: [cd(0, 0, '💨', 'CO₂ from air'), cd(0, 1, '💧', 'water'), cd(1, .5, '🌳', '?', { q: true, d: '+' + gain + ' kg' }), cd(2, .5, '🟫', 'soil −' + loss + ' kg', { s: 0 })], arrows: [{ a: 0, b: 2, k: 'N', s: 1 }, { a: 1, b: 2, k: 'L', s: 1 }] } },
        { lvl: 'an', code: '7-2-03', sec: 3, idea: 'photo', ask: 'Is her brother right?', a: 'No: the soil barely changed',
          errs: [['Yes: plants eat soil for food', 'Plants make their own food', 1], ['Yes: roots take in food', 'Roots take in water, minerals', 1]],
          assume: ['No soil washed out of the tub', ['The tree ate its fallen leaves', 'She raked them up'], ['Soil turns into wood', 'The soil mass barely changed']],
          steps: [['the claim', 'the tree ate the soil'], ['the evidence', 'tree +' + gain + ' kg, soil −' + loss + ' kg'], ['conclusion', 'the mass came from air and water']],
          explain: ['No: the tree gained ' + gain + ' kg but the soil lost only ' + loss + ' kg, so the mass came from CO₂ and water, built into glucose by photosynthesis.',
            ['No, because plants make their own food.', 'Use the mass numbers'],
            ['No: the tree got its mass from the sunlight it soaked up, because light is the plant’s food and the soil barely changed.', 'Light gives energy, not mass']],
          pic: { k: 'chart', cats: ['Tree gained', 'Soil lost'], series: [{ t: 'kg', k: 'N', v: [gain, loss], f: v => v + ' kg' }], y: 'mass (kg)', hl: [1] } }
      ]
    };
  }
  function plGreenhouse() {
    const tA = rnd(300, 360), tB = tA + rnd(70, 110);
    return {
      p: [S('Greenhouses near Redcliff grow tomatoes all year.', '*'),
        S('A grower compares two of her greenhouses with the same plants, water, light and heat.', 'a'),
        S('In Greenhouse B, she pipes in extra carbon dioxide from her gas heaters.', 'a'),
        TB(['Over 4 weeks', 'CO₂ in the air (ppm)', 'Tomatoes picked (kg)'], [[['Greenhouse A', 420, tA], 'a'], [['Greenhouse B', 900, tB], 'a']]),
        S('Bumblebees from boxes pollinate the flowers.'),
        S('She turns the extra CO₂ off every night, when the greenhouse is dark.', 'b'),
        S('Workers pick the tomatoes by hand each morning.')],
      parts: [
        { lvl: 'ap', code: '7-2-03', sec: 3, idea: 'photo', ask: 'Why did Greenhouse B grow more tomatoes?', a: 'More CO₂ for photosynthesis',
          errs: [['The heaters made it warmer', 'The heat was the same', 0], ['More water reached B', 'The water was the same', 0]],
          steps: [['fair test', 'same plants, water, light and heat'], ['the difference', 'more CO₂: ' + tA + ' → ' + tB + ' kg']],
          pic: { k: 'chart', cats: ['A (420 ppm)', 'B (900 ppm)'], series: [{ t: 'kg picked', k: 'P', v: [tA, tB] }], y: 'tomatoes (kg)', hl: [1] } },
        { lvl: 'an', code: '7-2-03', sec: 3, idea: 'photo', ask: 'Why does she turn the extra CO₂ off at night?', a: 'No light, so no photosynthesis',
          errs: [['To keep the plants cool', 'The heat was kept the same', 0], ['Plants use more CO₂ at night', 'Photosynthesis needs light', 1]],
          assume: ['There are no grow lights at night', ['Plants make food in the dark', 'Light powers photosynthesis'], ['CO₂ harms tomatoes', 'B grew more tomatoes']],
          steps: [['the inputs', 'light, water and CO₂ make glucose'], ['at night', 'no light, so the extra CO₂ goes unused'], ['so', 'turning it off saves gas']],
          explain: ['At night there is no light, so the plants can’t do photosynthesis or use the extra CO₂; piping it in then would only waste gas.',
            ['She turns it off because it isn’t needed at night.', 'Say why it isn’t needed'],
            ['At night the plants fall asleep and stop needing any energy at all, so the extra CO₂ would just build up in the air.', 'Light is what’s missing']],
          pic: { k: 'scene', cards: [cd(0, 0, '☀️', 'light at night', { x: true }), cd(0, 1, '💨', 'extra CO₂'), cd(1, .5, '🍅', '?', { q: true, d: 'no photosynthesis' })], arrows: [{ a: 0, b: 2, k: 'Y', dash: true, x: true, s: 1 }, { a: 1, b: 2, t: 'unused', k: 'M', dash: true, s: 1 }] } }
      ]
    };
  }
  function plBerries() {
    const fl = rnd(180, 240), bn = rnd(4, 15), bo = rnd(110, 160);
    return {
      p: [S('A saskatoon berry farm near Leduc tests how much its bees matter.', '*'),
        S('In spring, workers tie fine net bags over some branches before the flowers open, so insects can’t reach them.', 'a'),
        S('Other branches are left open, and bees visit their flowers.', 'a'),
        TB(['Per branch', 'Flowers', 'Berries'], [[['Netted', fl, bn], 'a'], [['Open', fl, bo], 'aB']]),
        S('Saskatoon berries are an important food for many First Nations in Alberta.'),
        S('A berry forms only after pollen reaches the stigma of a flower.', 'ab'),
        S('The farm sells jam at a market in Edmonton.'),
        S('This year, a cold, rainy week kept the bees in their hives all through the bloom.', 'b')],
      parts: [
        { lvl: 'ap', code: '7-2-04', sec: 4, idea: 'poll', ask: 'Why did the netted branches make so few berries?', a: 'No bees carried pollen to them',
          errs: [['The nets blocked the flowers', 'Flower counts were the same', 0], ['Bees eat berries on open ones', 'Open branches had more', 1]],
          steps: [['pollination', 'bees carry pollen to the stigma'], ['the nets', 'no bees, so few berries: ' + bn + ' vs ' + bo]],
          pic: { k: 'chart', cats: ['Netted', 'Open'], series: [{ t: 'flowers', k: 'P', v: [fl, fl] }, { t: 'berries', k: 'L', v: [bn, bo] }], y: 'per branch', hl: [0] } },
        { lvl: 'an', code: '7-2-04', sec: 4, idea: 'poll', ask: 'What will the cold week most likely do to the harvest?', a: 'Fewer berries this year',
          errs: [['More berries: bees eat fewer', 'Bees carry pollen to flowers', 1], ['No change: the flowers bloomed', 'Flowers need visits to make fruit', 1]],
          assume: ['Few other insects flew that week', ['Wind carries saskatoon pollen', 'The nets showed insects matter'], ['Rain carries the pollen', 'The story doesn’t say so']],
          steps: [['the week', 'cold rain kept the bees inside'], ['the flowers', 'little pollen reached the stigmas'], ['prediction', 'fewer berries, like the netted branches']],
          explain: ['Fewer berries: the bees stayed in during the bloom, so little pollen reached the stigmas, just like the netted branches that made only ' + bn + ' berries.',
            ['Fewer berries, because the weather was bad.', 'Link the weather to pollen'],
            ['Fewer berries: the cold rain washed away the food the berries need from the flowers, so they had nothing to grow from.', 'Berries need pollination first']],
          pic: { k: 'scene', cards: [cd(0, 0, '🐝', 'cold week: bees stay in', { x: true, s: 0 }), cd(1, 0, '🌸', 'few pollinated', { s: 1 }), cd(2, 0, '🫐', '?', { q: true, d: 'fewer berries' })], arrows: [{ a: 0, b: 1, t: 'pollen', k: 'R', dash: true, x: true, s: 1 }, { a: 1, b: 2, k: 'G', s: 2 }] } }
      ]
    };
  }
  function plPotato() {
    const l1 = rnd(80, 95), l2 = rnd(15, 25);
    return {
      p: [S('A farm near Taber grows potatoes.', '*'),
        S('Each spring, the farmer plants pieces of last year’s potatoes. Each piece sprouts into a new plant.', 'a'),
        S('Potatoes are tubers: swollen underground stems that store starch.', 'A'),
        S('Southern Alberta has hot, dry summers, so the fields are watered by sprinklers.'),
        S('Field 1 grows one variety, so every plant there is a copy of the same parent plant.', 'b'),
        S('Field 2 grows a mix of four varieties.', 'b'),
        S('Potato flowers are white or purple.'),
        S('In July, a disease that attacks only one of these varieties spreads through the area.', 'b'),
        TB(['Plants lost', 'Field 1 (one variety)', 'Field 2 (four varieties)'], [[['Share lost to the disease', l1 + '%', l2 + '%'], 'b']])],
      parts: [
        { lvl: 'ap', code: '7-2-04', sec: 4, idea: 'repro', ask: 'What kind of reproduction does the farmer use?', a: 'Asexual: one parent, exact copies',
          errs: [['Sexual: the pieces are seeds', 'Tuber pieces aren’t seeds', 0], ['Sexual: flowers made the pieces', 'Tubers are stems, not flowers', 0]],
          steps: [['the method', 'pieces of potato sprout into plants'], ['the type', 'one parent, no seeds: asexual']],
          pic: { k: 'scene', cards: [cd(0, 0, '🥔', 'potato piece'), cd(1, 0, '🌱', 'sprout', { s: 0 }), cd(2, 0, '🥔', '?', { q: true, d: 'same as the parent' })], arrows: [{ a: 0, b: 1, k: 'N', s: 0 }, { a: 1, b: 2, t: 'one parent', k: 'N', s: 1 }] } },
        { lvl: 'an', code: '7-2-04', sec: 4, idea: 'repro', ask: 'Why did Field 1 lose a bigger share?', a: 'All its plants share one weakness',
          errs: [['Tuber plants are always weaker', 'Field 2 grew from tubers too', 1], ['Field 2 had more plants', 'Compare the shares lost', 2]],
          assume: ['Both fields were otherwise alike', ['The disease attacks every variety', 'It attacks only one'], ['Field 2 was sprayed', 'The story doesn’t say so']],
          steps: [['Field 1', 'identical copies: every plant can catch it'], ['Field 2', 'only one variety in four can catch it'], ['the data', 'lost ' + l1 + '% vs ' + l2 + '%']],
          explain: ['Field 1’s plants are identical copies, so all of them could catch the disease; in Field 2 only one variety in four could, so it lost only ' + l2 + '%.',
            ['Field 1 lost more because it had only one variety.', 'Say why one variety is risky'],
            ['Field 1 lost more because plants grown from tuber pieces are always weaker than plants from seeds, so they catch any disease.', 'Field 2 grew from tubers too']],
          pic: { k: 'chart', cats: ['Field 1 (one variety)', 'Field 2 (four varieties)'], series: [{ t: '% lost', k: 'R', v: [l1, l2], f: v => v + '%' }], y: 'share lost (%)', hl: [0] } }
      ]
    };
  }
  function plSprout() {
    const n = pick(NAMES), a = rnd(16, 19), b = rnd(16, 19), d = rnd(0, 3);
    return {
      p: [S(n + '’s class tests what wheat seeds need to sprout. All 80 seeds come from one bag.', '*'),
        S('Each dish gets 20 seeds on a paper towel.', '*'),
        TB(['Dish', 'Water', 'Place', 'Sprouted in 5 days'], [[['A', 'wet', 'warm, dark cupboard', a], 'a'], [['B', 'wet', 'warm, sunny window', b], 'a'], [['C', 'dry', 'warm, sunny window', 0], 'b'], [['D', 'wet', 'fridge (4 °C)', d], 'b']]),
        S('The seeds came from a farm near Olds.'),
        S('A seed stores food for the young plant until its first leaves open.', 'a'),
        S('Wheat is one of Alberta’s biggest crops.'),
        S('The class checks the dishes every morning at 9:00.')],
      parts: [
        { lvl: 'ap', code: '7-2-04', sec: 4, idea: 'germ', ask: 'Does a wheat seed need light to sprout?', a: 'No: Dish A sprouted in the dark',
          errs: [['Yes: plants need light for food', 'The seed has stored food', 1], ['Yes: Dish C was in the light', 'Dish C had no water', 0]],
          steps: [['compare A and B', 'only light differs: ' + a + ' vs ' + b], ['the reason', 'stored food feeds it until its leaves open']],
          pic: { k: 'chart', cats: ['A (dark)', 'B (light)', 'C (dry)', 'D (cold)'], series: [{ t: 'sprouted', k: 'N', v: [a, b, 0, d] }], y: 'seeds sprouted', hl: [0, 1] } },
        { lvl: 'an', code: '7-2-04', sec: 4, idea: 'germ', ask: 'What do Dishes C and D show?', a: 'Seeds need water and warmth',
          errs: [['Seeds need only light', 'C had light, no sprouts', 0], ['Only water matters', 'D had water but few sprouts', 1]],
          assume: ['All the seeds could sprout', ['The fridge light helped D', 'A shut fridge is dark'], ['Dish C’s seeds were dead', 'All came from one bag']],
          steps: [['Dish C', 'no water: 0 sprouted'], ['Dish D', 'too cold: only ' + d + ' sprouted'], ['conclusion', 'seeds need water and warmth to sprout']],
          explain: ['Seeds need water and warmth: Dish C was warm and bright but dry, and none sprouted; Dish D had water but was cold, so only ' + d + ' sprouted.',
            ['Seeds need water and warmth to grow.', 'Use the dishes as evidence'],
            ['Seeds need water and warmth: Dish C’s seeds had no water to do photosynthesis, so they could not make the food to sprout.', 'Seeds sprout on stored food']],
          pic: { k: 'chart', cats: ['A (dark)', 'B (light)', 'C (dry)', 'D (cold)'], series: [{ t: 'sprouted', k: 'N', v: [a, b, 0, d] }], y: 'seeds sprouted', hl: [2, 3] } }
      ]
    };
  }
  function plClubroot() {
    const x1 = rnd(55, 80), x2 = rnd(3, 10);
    return {
      p: [S('Clubroot is a disease that lives in soil and attacks only canola and its relatives.', 'ab'),
        S('Its spores ride in mud stuck to tractors, and they last in soil for many years.', 'b'),
        S('Canola has bright yellow flowers in July.'),
        TB(['Near Westlock', 'Crops in the last 4 years', 'Canola plants with clubroot'], [[['Field 1', 'canola every year', x1 + '%'], 'a'], [['Field 2', 'canola, wheat, peas, barley', x2 + '%'], 'a']]),
        S('Canola seeds are crushed to make cooking oil.'),
        S('The farmer will soon drive from Field 1 into a field that has never had clubroot.', 'b'),
        S('His tractor is green and about ten years old.')],
      parts: [
        { lvl: 'ap', code: '7-2-05', sec: 5, idea: 'farm', ask: 'Why does Field 2 have less clubroot?', a: 'Rotating crops starved the disease',
          errs: [['Wheat roots kill the spores', 'Wheat just isn’t a host', 1], ['More crops add more nutrients', 'The disease is the difference', 0]],
          steps: [['the disease', 'clubroot attacks only canola roots'], ['rotation', 'canola 1 year in 4: ' + x2 + '% vs ' + x1 + '%']],
          pic: { k: 'chart', cats: ['Field 1 (canola only)', 'Field 2 (rotation)'], series: [{ t: '% with clubroot', k: 'R', v: [x1, x2], f: v => v + '%' }], y: 'plants with clubroot (%)', hl: [1] } },
        { lvl: 'an', code: '7-2-05', sec: 5, idea: 'farm', ask: 'Which plan best keeps clubroot out of the clean field?', a: 'Wash the mud off the tractor first',
          errs: [['Plant canola there every year', 'That feeds the disease', 1], ['Spray the clean field after', 'The spores come in the mud', 0]],
          assume: ['Clubroot spores travel in soil', ['Clubroot spreads by air only', 'The spores ride in mud'], ['Spores die in one winter', 'They last for years']],
          steps: [['the risk', 'spores ride in mud on the tractor'], ['the fix', 'wash the tractor before it goes in'], ['why first', 'once there, spores last for years']],
          explain: ['Washing the mud off stops spores from riding into the clean field; once there, they last for years and attack every canola crop.',
            ['Wash the tractor, because clean machines are better.', 'Say how the spores travel'],
            ['Washing the tractor is best, because clubroot is carried by insects that live in the tractor mud and bite canola roots.', 'Spores, not insects, ride in mud']],
          pic: { k: 'scene', cards: [cd(0, 0, '🚜', 'muddy tractor'), cd(1, 0, '🧽', '?', { q: true, d: 'wash off the mud' }), cd(2, 0, '🌼', 'clean field', { s: 2 })], arrows: [{ a: 0, b: 1, t: 'spores', k: 'R', s: 0 }, { a: 1, b: 2, t: 'no spores', k: 'N', s: 1 }] } }
      ]
    };
  }
  function plCanola() {
    return {
      p: [S('Canola was developed in Canada in the 1970s from a plant called rapeseed.', '*'),
        S('Rapeseed oil tasted bitter. Scientists picked the few plants with the least bitter oil and bred them together, generation after generation.', 'a'),
        S('The name canola comes from “Canada” and “oil.”'),
        S('Later, scientists moved one gene from a soil bacterium into canola, so the plants survive a weed killer.', 'bc'),
        S('Today, most canola in Alberta grows from these seeds.', '*'),
        S('A canola field in bloom can be seen from far away.'),
        S('A shopper says, “All GMO food is unsafe, so this canola oil must be too.”', 'c')],
      parts: [
        { lvl: 'ap', code: '7-2-05', sec: 6, idea: 'breed', ask: 'How was rapeseed changed into canola?', a: 'Selective breeding',
          errs: [['Genetic modification', 'No gene was moved in', 0], ['Asexual cloning', 'They bred plants together', 0]],
          steps: [['the method', 'pick plants with the trait and breed them'], ['over time', 'many generations: oil that isn’t bitter']],
          pic: { k: 'scene', cards: [cd(0, 0, '🌼', 'rapeseed: bitter'), cd(1, 0, '👩‍🔬', 'pick the best, breed', { s: 0 }), cd(2, 0, '🌼', '?', { q: true, d: 'canola: mild oil' })], arrows: [{ a: 0, b: 1, k: 'G', s: 0 }, { a: 1, b: 2, t: 'generations', k: 'N', s: 1 }] } },
        { lvl: 'an', code: '7-2-05', sec: 6, idea: 'breed', ask: 'How is the weed-killer canola different?', a: 'It is a GMO: a gene was added',
          errs: [['It was selectively bred', 'A gene came from a bacterium', 1], ['It was grafted onto weeds', 'Nothing was grafted', 0]],
          assume: ['Canola can’t breed with bacteria', ['The plants chose the new gene', 'Scientists moved the gene'], ['Weed killer changed the seeds', 'The gene was put in first']],
          steps: [['breeding', 'mixes genes of the same kind of plant'], ['this change', 'one gene moved in from a bacterium'], ['so', 'a genetically modified organism (GMO)']],
          pic: { k: 'scene', cards: [cd(0, 0, '🦠', 'bacterium gene'), cd(1, 0, '🌼', 'canola', { s: 1 }), cd(2, 0, '🧪', '?', { q: true, d: 'GMO: survives weed killer' })], arrows: [{ a: 0, b: 1, k: 'P', s: 1 }, { a: 1, b: 2, k: 'N', s: 2 }] } },
        { lvl: 'an', code: '7-2-05', sec: 6, idea: 'breed', ask: 'The shopper says all GMO food is unsafe. Is that sound?', a: 'No: judge each change by testing',
          errs: [['Yes: every GMO is dangerous', 'A GMO is a method', 1], ['No: GMOs are always safe', 'Blanket claims fail both ways', 1]],
          assume: ['Each GMO change can be tested', ['Bacteria genes make food toxic', 'The story doesn’t say so'], ['Natural always means safe', 'Bitter rapeseed was natural']],
          steps: [['the claim', 'every GMO food is unsafe'], ['the problem', 'GMO is a method; risk depends on the change'], ['better', 'test each change on its own']],
          explain: ['Not sound: GMO is a method, not one product. Each added gene has to be judged by testing what it does, just as breeding can add good or bad traits.',
            ['Not sound, because GMOs are fine.', 'Say why one rule fails'],
            ['Not sound, because the new gene came from a soil bacterium, and anything that comes from nature is always safe to eat.', 'Natural isn’t always safe']],
          pic: { k: 'scene', cards: [cd(0, 0, '🧪', 'GMO: a method'), cd(1, 0, '🔬', 'test each change', { s: 1 }), cd(2, 0, '⚖️', '?', { q: true, d: 'judge case by case' })], arrows: [{ a: 0, b: 1, k: 'G', s: 1 }, { a: 1, b: 2, k: 'N', s: 2 }] } }
      ]
    };
  }
  function plFlax() {
    return {
      p: [S('Flax grows well in Alberta’s short, cool prairie summers.', 'b'),
        S('Its seeds are pressed for oil or eaten in bread and cereal.', 'a'),
        S('Long, strong strands inside its stem are spun into linen thread.', 'ab'),
        S('Flax has small sky-blue flowers that last only one day.'),
        S('Hemp grows here too: seeds for food, and stem strands for rope and cloth.', 'b'),
        TB(['Crop', 'Part used', 'Product'], [[['Canola', 'seed', 'cooking oil'], 'B'], [['Cotton', 'seed hairs', 'T-shirts'], 'b'], [['Barley', 'seed', 'animal feed, malt'], 'B']]),
        S('Cotton can’t grow in Alberta: it needs a long, hot season.', 'b'),
        S('Linen is one of the oldest cloths people have made.')],
      parts: [
        { lvl: 'ap', code: '7-2-05', sec: 5, idea: 'use', ask: 'Why is flax both a food crop and a fibre crop?', a: 'Seeds give food; stems give fibre',
          errs: [['Its flowers are spun into cloth', 'The strands are in the stem', 0], ['Its roots are eaten', 'The seeds are the food', 0]],
          steps: [['food', 'seeds: oil, bread and cereal'], ['fibre', 'stem strands spun into linen']],
          pic: { k: 'scene', cards: [cd(.5, 0, '🌾', 'flax'), cd(0, 1, '🍞', '?', { q: true, d: 'seeds: food' }), cd(1, 1, '🧵', '?', { q: true, d: 'stems: fibre' })], arrows: [{ a: 0, b: 1, k: 'G', s: 0 }, { a: 0, b: 2, k: 'L', s: 1 }] } },
        { lvl: 'an', code: '7-2-05', sec: 5, idea: 'use', ask: 'Which T-shirt fibre could an Alberta farm grow?', a: 'Flax or hemp, not cotton',
          errs: [['Cotton, in a hot summer', 'Cotton needs a long hot season', 1], ['Canola, from its oil', 'Oil is food, not fibre', 0]],
          assume: ['Alberta summers stay short and cool', ['Fibre comes only from cotton', 'Flax and hemp give fibre'], ['Any plant part makes cloth', 'Fibre needs long, strong strands']],
          steps: [['fibre crops', 'cotton, flax and hemp'], ['the climate', 'cotton needs a long, hot season'], ['the choice', 'flax or hemp stems give fibre here']],
          explain: ['Flax or hemp: their stems have long, strong strands for cloth, and they grow in Alberta’s cool summers, while cotton needs a long, hot season.',
            ['Flax or hemp, because they grow here.', 'Say which part gives fibre'],
            ['Flax or hemp: their seeds are full of oil, and that oil can be spun into thread for cloth the same way cotton is.', 'The fibre is in the stem']],
          pic: { k: 'scene', cards: [cd(0, 0, '🌡️', 'short, cool summer'), cd(1, 0, '🌿', 'flax, hemp', { s: 2 }), cd(2, 0, '👕', '?', { q: true, d: 'linen, hemp cloth' }), cd(1, 1, '☁️', 'cotton', { x: true, s: 1 })], arrows: [{ a: 0, b: 1, t: 'grow here', k: 'N', s: 1 }, { a: 1, b: 2, t: 'stem fibre', k: 'G', s: 2 }] } }
      ]
    };
  }
  function plFeedlot() {
    const E = pick([40000, 50000, 60000]);
    return {
      p: [S('A feedlot near Lethbridge raises beef cattle.', '*'),
        S('The cattle eat barley grown on nearby farms.', 'ab'),
        S('Barley plants make glucose in their leaves from sunlight, water and carbon dioxide.', 'a'),
        S('A feedlot steer can weigh about 600 kg.'),
        S('Lethbridge gets strong chinook winds in winter.'),
        TB(['From one hectare of barley', 'Food energy for people (MJ)'], [[['Barley eaten as food', nf(E)], 'b'], [['Beef from cattle fed that barley', nf(E / 10)], 'b']]),
        S('The cattle use most of the energy they eat to live, move and stay warm.', 'b'),
        S('The beef is sold to stores across Canada.')],
      parts: [
        { lvl: 'ap', code: '7-2-03', sec: 3, idea: 'chain', ask: 'Where did the energy in a beef burger first come from?', a: 'Sunlight, captured by barley',
          errs: [['The soil the barley grew in', 'Soil gives minerals, not energy', 0], ['The cattle made it themselves', 'Cattle are consumers', 1]],
          steps: [['producer', 'barley turns light energy into glucose'], ['consumers', 'cattle eat the barley; we eat the beef']],
          pic: { k: 'scene', cards: [cd(0, 0, '☀️', '?', { q: true, d: 'sunlight' }), cd(1, 0, '🌾', 'barley', { s: 0 }), cd(2, 0, '🐄', 'cattle', { s: 1 }), cd(3, 0, '🍔', 'burger', { s: 1 })], arrows: [{ a: 0, b: 1, k: 'Y', s: 0 }, { a: 1, b: 2, k: 'G', s: 1 }, { a: 2, b: 3, k: 'G', s: 1 }] } },
        { lvl: 'an', code: '7-2-03', sec: 3, idea: 'chain', ask: 'Why does the barley feed more people than its beef?', a: 'Cattle use most energy to live',
          errs: [['Cattle spill most of the barley', 'They eat it, then use it', 1], ['Barley has more minerals', 'The table is about energy', 0]],
          assume: ['People eat the barley or its beef', ['Cattle make new energy', 'Energy only passes along'], ['Beef gives more energy per hectare', 'The table shows less']],
          steps: [['barley', 'producer: ' + nf(E) + ' MJ'], ['cattle', 'use most of it to live, move and stay warm'], ['beef', 'only about ' + nf(E / 10) + ' MJ passes on']],
          explain: ['Barley feeds more: the cattle use most of its energy to live, move and stay warm, so only about a tenth, ' + nf(E / 10) + ' MJ, ends up in the beef.',
            ['Barley feeds more, because it is lower in the food chain.', 'Say where the energy goes'],
            ['Barley feeds more: the cattle turn most of the barley’s energy into minerals and water, which give people no energy at all.', 'Energy is used up living']],
          pic: { k: 'layers', bands: [{ i: '🍔', t: 'beef', q: true, d: 'beef: ' + nf(E / 10) + ' MJ', w: .55 }, { i: '🐄', t: 'cattle use most to live', w: .7, k: 'G', s: 1 }, { i: '🌾', t: 'barley: ' + nf(E) + ' MJ', w: 1, k: 'N' }] } }
      ]
    };
  }
  function plLettuce() {
    const m1 = rnd(140, 180), m2 = rnd(20, 40);
    return {
      p: [S('A vertical farm in a Calgary warehouse grows lettuce with no soil at all.', 'b'),
        S('The roots hang in water that flows past them.', 'a'),
        S('In a test, workers add dissolved minerals, such as nitrogen, to the water in Tank 1 only.', 'a'),
        S('LED lights shine on the leaves 16 hours a day, and fans bring in fresh air with carbon dioxide.', 'b'),
        S('The warehouse used to store furniture.'),
        TB(['Test tank', 'What the water has', 'Lettuce after 5 weeks (g)'], [[['Tank 1', 'water + minerals', m1], 'a'], [['Tank 2', 'plain water', m2], 'a']]),
        S('The lettuce is packed and sold to stores in the city.')],
      parts: [
        { lvl: 'ap', code: '7-2-02', sec: 2, idea: 'root', ask: 'Why did the Tank 1 lettuce grow bigger?', a: 'Its roots took in minerals it needs',
          errs: [['The minerals are its food', 'Minerals help; leaves make food', 0], ['Tank 1 got more light', 'Only the minerals differ', 0]],
          steps: [['the difference', 'only Tank 1’s water had minerals'], ['the roots', 'took in water and minerals: ' + m1 + ' vs ' + m2 + ' g']],
          pic: { k: 'chart', cats: ['Tank 1 (minerals)', 'Tank 2 (plain)'], series: [{ t: 'g', k: 'N', v: [m1, m2], f: v => v + ' g' }], y: 'lettuce (g)', hl: [0] } },
        { lvl: 'an', code: '7-2-03', sec: 3, idea: 'photo', ask: 'Where does this lettuce get its food?', a: 'It makes it from light, water, CO₂',
          errs: [['From the minerals in the water', 'Minerals aren’t food energy', 1], ['From the soil it grew in', 'There is no soil', 0]],
          assume: ['The lettuce gets nothing else', ['Roots take in sugar', 'Roots take in water, minerals'], ['Plants don’t use air', 'The fans bring in CO₂']],
          steps: [['no soil', 'the lettuce grows without any soil'], ['the inputs', 'LED light, water and CO₂ reach it'], ['its food', 'photosynthesis makes glucose in the leaves']],
          explain: ['It makes its own food: its leaves use LED light, water from the roots and CO₂ from the fans to make glucose. The minerals only help it grow.',
            ['It makes its own food, because plants are producers.', 'Name the inputs it uses'],
            ['It makes its own food: its roots soak up the minerals, and those minerals are the food that gives the lettuce its energy.', 'Minerals aren’t food energy']],
          pic: { k: 'scene', cards: [cd(0, 0, '💡', 'LED light'), cd(0, 1, '💨', 'CO₂ from fans'), cd(1, .5, '🥬', '?', { q: true, d: 'glucose: its own food' }), cd(2, .5, '💧', 'water + minerals', { s: 1 })], arrows: [{ a: 0, b: 2, k: 'Y', s: 1 }, { a: 1, b: 2, k: 'M', s: 1 }, { a: 3, b: 2, t: 'roots', k: 'L', s: 1 }] } }
      ]
    };
  }

  /* ============ the unit's ideas (from v2): label (the choice) and hint (the cue when another is picked) ============ */
  const IDEAS = {
    eco: { bio: ['Biotic and abiotic factors', 'Sort living from non-living'], role: ['Producer, consumer, decomposer', 'How does it get food?'], flow: ['Energy flow in a food chain', 'Follow the energy from food'],
      ten: ['The 10% rule', 'Energy is lost at each level'], web: ['Links in a food web', 'Follow who eats whom'], div: ['Biodiversity', 'Count the kinds of species'],
      change: ['A change spreading along a chain', 'Follow the change link by link'], recover: ['Recovery after a disturbance', 'How ecosystems recover over time'], steward: ['Fixing the cause of a problem', 'Find the cause, then fix it'] },
    // v2's nine, plus germ, root and use (v3 scenarios on sprouting, roots in water, and crop parts)
    pla: { cell: ['Parts of a plant cell', 'Match the part to its look'], vessel: ['Xylem and phloem', 'What moves, and which way?'], repro: ['Sexual or asexual reproduction', 'One parent or two?'],
      photo: ['What photosynthesis needs', 'Light, water and CO₂ make glucose'], mass: ['Where a plant’s mass comes from', 'Plants build mass from air'], poll: ['Pollination and seeds', 'Pollen must reach the stigma'],
      breed: ['Selective breeding or GMO', 'How were the traits changed?'], chain: ['Producers start food chains', 'Every chain starts with light'], farm: ['Crop practices and pests', 'Starve the pest of its host'],
      germ: ['What a seed needs to sprout', 'Water and warmth wake a seed'], root: ['What roots take in', 'Water and minerals, not food'], use: ['Food and fibre from plant parts', 'Which part gives which product?'] }
  };
  // Ideas too close to offer as wrong choices for each other.
  const NEAR = [['flow', 'ten'], ['web', 'change'], ['div', 'recover'], ['chain', 'photo'], ['photo', 'mass'], ['poll', 'repro'], ['cond', 'mode'], ['cond', 'flow'], ['cond', 'insul'], ['flow', 'insul'], ['amount', 'cap'], ['stab', 'design'], ['design', 'mat'], ['design', 'beam'], ['beam', 'force'], ['mat', 'force'], ['cycle', 'rock'], ['cycle', 'surf'], ['crys', 'rock'], ['uplift', 'bound'], ['form', 'surf'], ['quake', 'bound'], ['web', 'flow'], ['change', 'steward'], ['recover', 'change'], ['germ', 'poll'], ['germ', 'repro'], ['root', 'vessel'], ['root', 'mass'], ['use', 'farm']];
  const near = (a, b) => NEAR.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

  /* ============ building a scenario's parts ============ */
  const UNITS = { eco: [ecoBeaver, ecoSlough, ecoLake, ecoFire, ecoBeetle, ecoOwl, ecoElk, ecoMussel, ecoLitter, ecoDrought, ecoCaribou, ecoQuadrat],
    pla: [plCells, plCelery, plMass, plGreenhouse, plBerries, plPotato, plSprout, plClubroot, plCanola, plFlax, plFeedlot, plLettuce] };
  const choose = (a, ws) => { const errs = ws.map(([t, cue, s]) => ({ t, cue, s })); return { a, errs, opts: shuffle([{ v: 'a', t: a }].concat(errs.map((e, k) => ({ v: 'e' + k, t: e.t })))) }; };
  // A chunk's kind for part L: must (L in the tag), opt (setup, or a fact for another part), no (a detail to skip).
  const kindOf = (tag, L) => tag === '*' ? 'opt' : tag.includes(L) ? 'must' : tag ? 'opt' : 'no';
  function build(unit, f) {
    const sc = f(), N = sc.parts.length, flat = [];
    sc.p.forEach(c => c.rows ? c.rows.forEach((r, j) => flat.push({ body: j ? { cells: r.cells } : { cells: r.cells, head: c.head }, tag: r.k })) : flat.push({ body: { t: c.t }, tag: c.k }));
    const ideas = IDEAS[unit];
    const items = sc.parts.map((pt, j) => {
      const L = 'abc'[j], wrongIdeas = pt.idea ? shuffle(Object.keys(ideas).filter(k => k !== pt.idea && !near(k, pt.idea))).slice(0, 2) : [];
      const read = {
        p: flat.map(c => Object.assign({}, c.body, { k: kindOf(c.tag, L) })), ask: pt.ask, ideaKey: pt.idea,
        idea: pt.idea ? choose(ideas[pt.idea][0], wrongIdeas.map(k => [ideas[k][0], ideas[pt.idea][1]])) : null,
        assume: pt.assume ? choose(pt.assume[0], pt.assume.slice(1)) : null,
        explain: pt.explain ? choose(pt.explain[0], pt.explain.slice(1)) : null
      };
      const errs = pt.errs.map(([t, cue, s]) => ({ t, cue, s }));
      return { t: f.name, unit, part: j, of: N, lvl: pt.lvl, code: pt.code, sec: pt.sec, read, a: pt.a,
        opts: shuffle([{ v: 'a', t: pt.a }].concat(errs.map((e, k) => ({ v: 'e' + k, t: e.t })))), errs,
        steps: pt.steps.map(([l, m]) => ({ l, m })), pic: pt.pic || sc.pic, prev: sc.parts.slice(0, j).map(q => ({ ask: q.ask, a: q.a })) };
    });
    items.forEach(it => Object.defineProperty(it, 'all', { value: items, enumerable: false, configurable: true }));
    return items;
  }
  // Part a of a scenario whose parts fit in what is left of the round (rem), never leaving a single item over.
  function start(unit, rem) {
    const fits = k => k <= rem && rem - k !== 1;
    for (let i = 0; i < 40; i++) { const its = build(unit, pick(UNITS[unit])); if (fits(its.length)) return its; }
    const its = build(unit, pick(UNITS[unit])).slice(0, Math.max(1, rem));
    its.forEach(it => { it.of = its.length; Object.defineProperty(it, 'all', { value: its }); });
    return its;
  }
  const startMix = rem => start(pick(Object.keys(UNITS)), rem);

  // A part's answer -> ok (partial after a slip), or the misconception it names (its cue and the step it breaks).
  // On a part with a Best explanation step the page keeps the answer's tries (local): a retry or a weak explanation is a slip.
  function check(it, r) {
    if (r.v === 'a') {
      const ex = it.read.explain, eBad = ex && r.local && r.explain != null && r.explain !== 'a', retry = ex && r.local && (r.tried || []).length;
      if (!r.miss && !eBad && !retry) return { ok: true };
      return { ok: true, partial: true, cue: eBad ? ex.errs[+String(r.explain).slice(1)].cue : retry ? 'Right on the second try' : 'Right; an earlier step slipped' };
    }
    const k = /^e(\d+)$/.test(r.v || '') ? +r.v.slice(1) : -1, e = it.errs[k];
    return e ? { code: 'e' + k, cue: e.cue, s: e.s } : { code: 'other', cue: 'Pick one answer', s: -1 };
  }
  // The key-facts step: every must chunk tapped, and no detail to skip.
  function checkFacts(it, sel) {
    const p = it.read.p, s = new Set(sel || []);
    const extra = [...s].filter(i => p[i] && p[i].k === 'no'), missed = p.map((c, i) => c.k === 'must' && !s.has(i) ? i : -1).filter(i => i >= 0);
    if (!extra.length && !missed.length) return { ok: true, cue: 'You found the key facts' };
    return { ok: false, extra, missed, cue: extra.length ? 'A detail you picked doesn’t matter here' : missed.length > 1 ? 'Some key facts are missing' : 'One key fact is missing' };
  }
  function checkPick(step, v) {
    if (v === 'a') return { ok: true };
    const e = step.errs[+String(v).slice(1)];
    return { ok: false, cue: e ? e.cue : 'Pick one answer' };
  }
  return { UNITS, IDEAS, NEAR, build, start, startMix, check, checkFacts, checkPick };
})();
/* ===================== MODEL END ===================== */
