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

  /* ============ the unit's ideas (from v2): label (the choice) and hint (the cue when another is picked) ============ */
  const IDEAS = {
    eco: { bio: ['Biotic and abiotic factors', 'Sort living from non-living'], role: ['Producer, consumer, decomposer', 'How does it get food?'], flow: ['Energy flow in a food chain', 'Follow the energy from food'],
      ten: ['The 10% rule', 'Energy is lost at each level'], web: ['Links in a food web', 'Follow who eats whom'], div: ['Biodiversity', 'Count the kinds of species'],
      change: ['A change spreading along a chain', 'Follow the change link by link'], recover: ['Recovery after a disturbance', 'How ecosystems recover over time'], steward: ['Fixing the cause of a problem', 'Find the cause, then fix it'] }
  };
  // Ideas too close to offer as wrong choices for each other.
  const NEAR = [['flow', 'ten'], ['web', 'change'], ['div', 'recover'], ['chain', 'photo'], ['photo', 'mass'], ['poll', 'repro'], ['cond', 'mode'], ['cond', 'flow'], ['cond', 'insul'], ['flow', 'insul'], ['amount', 'cap'], ['stab', 'design'], ['design', 'mat'], ['design', 'beam'], ['beam', 'force'], ['mat', 'force'], ['cycle', 'rock'], ['cycle', 'surf'], ['crys', 'rock'], ['uplift', 'bound'], ['form', 'surf'], ['quake', 'bound'], ['web', 'flow'], ['change', 'steward'], ['recover', 'change']];
  const near = (a, b) => NEAR.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

  /* ============ building a scenario's parts ============ */
  const UNITS = { eco: [ecoBeaver, ecoSlough, ecoLake, ecoFire, ecoBeetle, ecoOwl, ecoElk, ecoMussel, ecoLitter, ecoDrought, ecoCaribou, ecoQuadrat] };
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
