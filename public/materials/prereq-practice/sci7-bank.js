// Science 7 prereq practice questions, used by sci7-<unit>-prereq-practice-v1.html.
// Question fields are described at the top of practice.js. Every skill needs at least two questions.
// Diagrams come from sci-visuals.js: a skill's visual shows with each of its questions, unless
// the question has its own. Every question shows one.
(function () {
'use strict';

// Prereqs for Science 7 are Grade 6 ideas (and earlier), kept to the simpler end of Grade 6:
// see "assumed" in src/content/parent-guides/science7/. Grade 7 content (consumer levels, cell
// parts, rock types, Earth's layers, load types, heat vs. temperature) belongs in the units, not here.

const V = window.SciVisuals;

const part = (thing, a, why) => ({
  q: `Is ${thing} a living (biotic) or non-living (abiotic) part of a pond?`, a, why,
  choices: ['living (biotic)', 'non-living (abiotic)'],
  visual: V.sortBins(thing, ['Living (biotic)', 'grows, eats, has young'], ['Non-living (abiotic)', 'never alive']),
});

const role = (thing, a, why) => ({
  q: `Is ${thing} a producer or a consumer?`, a, why, choices: ['producer', 'consumer'],
  visual: V.sortBins(thing, ['Producer', 'makes its own food'], ['Consumer', 'eats other living things']),
});

const state = (thing, a, why) =>
  ({ q: `Is ${thing} a solid, a liquid or a gas?`, a, choices: ['solid', 'liquid', 'gas'], why });

const pushPull = (action, a, why) => PrereqPractice.sortQ(action, ['a push', 'a pull'], `a ${a}`, why);

const CHANGES = ['melting', 'freezing', 'evaporating', 'condensing'];
const STRETCH = ['stretched (tension)', 'squashed (compression)'];

window.PracticeBank = { units: [
  {
    id: 'interactions-ecosystems', name: 'Interactions & Ecosystems', num: 1,
    summary: 'Living and non-living parts, producers and consumers, food chains, needs, decomposers',
    skills: [
      {
        name: 'Living and non-living parts',
        hint: 'Biotic parts are living things. Abiotic parts are non-living, like sunlight, water, rocks and air.',
        items: [
          part('a frog', 'living (biotic)', 'A frog grows, eats and has young. It is a living (biotic) part of the pond.'),
          part('sunlight', 'non-living (abiotic)', 'Sunlight is energy from the Sun. It is not alive, so it is abiotic, but the pond’s plants need it.'),
          part('the pond water', 'non-living (abiotic)', 'Water is not alive, so it is abiotic. Every living thing in the pond needs it.'),
          part('a cattail plant', 'living (biotic)', 'A cattail is a plant. It grows and makes seeds, so it is a living (biotic) part.'),
          part('a rock on the shore', 'non-living (abiotic)', 'A rock does not grow, eat or have young. It is abiotic.'),
        ],
      },
      {
        name: 'Producers and consumers',
        hint: 'A producer makes its own food using sunlight. A consumer eats other living things.',
        items: [
          role('grass', 'producer', 'Grass uses sunlight to make its own food, so it is a producer.'),
          role('an aspen tree', 'producer', 'Trees are plants. They make their own food from sunlight, so they are producers.'),
          role('a deer', 'consumer', 'A deer cannot make its own food. It eats plants, so it is a consumer.'),
          role('a hawk', 'consumer', 'A hawk eats mice and other animals, so it is a consumer.'),
          { q: 'Where do producers get the energy to make their food?', a: 'sunlight', choices: ['sunlight', 'the soil', 'rain', 'other animals'], why: 'Plants use the energy in sunlight to make food in their leaves.', visual: V.leafIO(['sunlight']) },
        ],
      },
      {
        name: 'Reading a food chain',
        hint: 'Each arrow points from the food to the living thing that eats it.',
        visual: V.chain(['grass', 'rabbit', 'fox']),
        items: [
          { q: 'grass → rabbit → fox\nWhat eats the rabbit?', a: 'the fox', accept: ['fox', 'a fox', 'foxes'], why: 'The arrow goes from rabbit to fox, so the fox eats the rabbit.' },
          { q: 'grass → grasshopper → frog → hawk\nWhat does the frog eat?', a: 'the grasshopper', accept: ['grasshopper', 'grasshoppers', 'a grasshopper'], why: 'The arrow goes from grasshopper to frog, so the frog eats the grasshopper.', visual: V.chain(['grass', 'grasshopper', 'frog', 'hawk']) },
          { q: 'grass → rabbit → fox\nWhich one is the producer?', a: 'grass', choices: ['grass', 'rabbit', 'fox'], why: 'Grass makes its own food from sunlight. Food chains start with a producer.' },
          { q: 'grass → rabbit → fox\nIf all the foxes left, what would most likely happen to the rabbits?', a: 'There would be more rabbits.', choices: ['There would be more rabbits.', 'There would be fewer rabbits.', 'Nothing would change.'], why: 'Foxes eat rabbits. With no foxes, fewer rabbits get eaten, so there would be more of them (until the grass runs short).' },
        ],
      },
      {
        name: 'What living things need',
        hint: 'Animals need water, air, food and shelter.',
        visual: V.animalNeeds(),
        items: [
          { q: 'Name one thing every animal needs to survive.', a: 'water, air, food or shelter', accept: ['water', 'air', 'oxygen', 'food', 'shelter', 'a home', 'home', 'space'], why: 'Animals need water, air, food and shelter (a safe place to live).' },
          { q: 'Which of these is NOT something a deer needs to survive?', a: 'a fence', choices: ['water', 'food', 'shelter', 'a fence'], why: 'A deer needs water, food, air and shelter. A fence is something people build.' },
          { q: 'In winter, a deer rests in thick spruce trees, out of the wind. Which need are the trees meeting?', a: 'shelter', choices: ['food', 'water', 'shelter', 'air'], why: 'The trees protect the deer from wind and cold. That is shelter.' },
        ],
      },
      {
        name: 'Decomposers',
        hint: 'Decomposers, like mushrooms, worms and bacteria, break down dead plants and animals.',
        visual: V.flow(['dead leaves', 'fallen log'], '?', 'nutrients in soil', { fromCls: 'v-pill-thing' }),
        items: [
          { q: 'Mushrooms and worms break down dead leaves on the forest floor. What do we call living things that do this?', a: 'decomposers', accept: ['decomposer'], why: 'Decomposers break down dead plants and animals.' },
          { q: 'When decomposers break down a dead log, what do they give back to the soil?', a: 'nutrients', choices: ['nutrients', 'plastic', 'rocks', 'sunlight'], why: 'Decomposers return nutrients to the soil. New plants use them to grow.', visual: V.flow(['fallen log'], 'mushrooms and worms', '?', { fromCls: 'v-pill-thing' }) },
          { q: 'Which of these is a decomposer?', a: 'a mushroom', choices: ['a mushroom', 'a deer', 'a dandelion', 'a robin'], why: 'A mushroom is a fungus that breaks down dead things. The deer and robin are consumers; the dandelion is a producer.' },
        ],
      },
    ],
  },
  {
    id: 'plants-food-fibre', name: 'Plants for Food & Fibre', num: 2,
    summary: 'What plants need, plant parts, plants make food, cells, seeds',
    skills: [
      {
        name: 'What plants need',
        hint: 'Plants need light, water, air and nutrients to grow.',
        visual: V.plantNeeds(),
        items: [
          { q: 'A plant is left in a dark closet for two weeks. What will most likely happen?', a: 'It turns pale and weak.', choices: ['It turns pale and weak.', 'It grows faster.', 'Nothing changes.', 'It grows flowers.'], why: 'Plants need light to make food. Without it they turn pale and weak, and can die.', visual: V.darkCloset() },
          { q: 'Name one thing a plant needs to grow.', a: 'light, water, air or nutrients', accept: ['light', 'sunlight', 'sun', 'water', 'air', 'carbon dioxide', 'co2', 'nutrients', 'soil', 'minerals', 'space'], why: 'Plants need light, water, air (carbon dioxide) and nutrients from the soil.' },
          { q: 'Which of these does a plant NOT need to grow?', a: 'darkness', choices: ['light', 'water', 'air', 'darkness'], why: 'Plants need light, not darkness. Light gives them the energy to make food.' },
        ],
      },
      {
        name: 'Parts of a plant',
        hint: 'Roots, stem, leaves and flowers each have a job.',
        items: [
          { q: 'Which part of a plant takes in water from the soil?', a: 'roots', choices: ['roots', 'stem', 'leaves', 'flower'], why: 'Roots take in water and nutrients from the soil. They also hold the plant in place.', visual: V.plantParts('roots') },
          { q: 'Which part holds the plant up and carries water to the leaves?', a: 'stem', choices: ['roots', 'stem', 'leaves', 'flower'], why: 'The stem holds the plant up and carries water from the roots to the leaves.', visual: V.plantParts('stem') },
          { q: 'Which part makes most of the plant’s food, using sunlight?', a: 'leaves', choices: ['roots', 'stem', 'leaves', 'flower'], why: 'Leaves catch sunlight and make the plant’s food.', visual: V.plantParts('leaves') },
          { q: 'Which part of a plant makes seeds?', a: 'flower', choices: ['roots', 'stem', 'leaves', 'flower'], why: 'Flowers make seeds, which grow into new plants.', visual: V.plantParts('flower') },
        ],
      },
      {
        name: 'Plants make their own food',
        hint: 'Plants use sunlight, water and air to make their own food (sugar) in their leaves.',
        items: [
          { q: 'Where does a plant get the energy to make its food?', a: 'sunlight', choices: ['sunlight', 'the soil', 'its roots', 'fertilizer'], why: 'The energy comes from sunlight. Leaves use it to make sugar.', visual: V.leafIO(['sunlight']) },
          { q: 'True or false: plants get their food from the soil.', a: 'false', choices: ['true', 'false'], why: 'Plants make their own food in their leaves, using sunlight, water and carbon dioxide from the air. Soil gives water and small amounts of nutrients, not food.', visual: V.leafIO([]) },
          { q: 'Plants give off a gas that people and animals need to breathe. Which gas is it?', a: 'oxygen', choices: ['oxygen', 'carbon dioxide', 'steam', 'smoke'], why: 'When plants make food, they give off oxygen.', visual: V.leafIO(['oxygen']) },
          { q: 'Plants take in a gas from the air to make their food. Which gas is it?', a: 'carbon dioxide', choices: ['carbon dioxide', 'oxygen', 'helium'], why: 'Leaves take in carbon dioxide from the air and use it to make sugar.', visual: V.leafIO(['carbon dioxide']) },
        ],
      },
      {
        name: 'Living things are made of cells',
        hint: 'Cells are the tiny building blocks of every living thing.',
        visual: V.cellsZoom(),
        items: [
          { q: 'All living things are made of tiny building blocks. What are they called?', a: 'cells', accept: ['cell'], why: 'Every living thing, from a moss to a moose, is made of cells.' },
          { q: 'Can you see a single plant cell with just your eyes?', a: 'no', choices: ['yes', 'no'], why: 'Most cells are far too small to see. You need a microscope.' },
          { q: 'What tool do scientists use to see cells?', a: 'a microscope', choices: ['a microscope', 'a telescope', 'a thermometer', 'a ruler'], why: 'A microscope makes tiny things look much bigger. A telescope is for faraway things, like planets.' },
        ],
      },
      {
        name: 'Seeds and new plants',
        hint: 'Flowers make seeds. A seed holds a tiny new plant and food for it.',
        visual: V.germinating(),
        items: [
          { q: 'A seed is planted in damp, warm soil. What will most likely happen?', a: 'It sprouts and grows a root and a shoot.', choices: ['It sprouts and grows a root and a shoot.', 'It turns into a rock.', 'It melts.', 'Nothing ever happens.'], why: 'With water and warmth, a seed sprouts. A root grows down and a shoot grows up.' },
          { q: 'Which comes out of a sprouting seed first?', a: 'the root', choices: ['the root', 'a flower', 'a fruit'], why: 'The root comes out first, to take in water and hold the seedling in place. Then the shoot grows up toward the light.' },
          { q: 'Which of these foods is the seed of a plant?', a: 'a pea', choices: ['a pea', 'a carrot', 'lettuce', 'celery'], why: 'Peas are seeds. Carrots are roots, lettuce is leaves, and celery is stems.', visual: V.plantParts('seeds') },
        ],
      },
    ],
  },
  {
    id: 'heat-temperature', name: 'Heat & Temperature', num: 3,
    summary: 'Reading a thermometer, states of matter, changes of state, particles, expanding',
    skills: [
      {
        name: 'Reading a thermometer',
        hint: 'Find a numbered line, then count the small lines up (warmer) or down (colder). Check how many degrees each small line is worth.',
        items: [
          { q: 'Each small line is 2 °C. The red liquid stops 2 lines above 10 °C. What is the temperature in °C?', a: '14 °C', n: 14, why: '2 lines × 2 °C = 4 °C.\n10 + 4 = 14 °C.', visual: V.thermometer({ min: 0, max: 40, step: 2, every: 10, value: 14 }) },
          { q: 'Each small line is 1 °C. The red liquid stops 3 lines below 0 °C. What is the temperature in °C?', a: '−3 °C', n: -3, why: 'Below zero means negative.\n3 lines × 1 °C = 3 °C below zero, so −3 °C.', visual: V.thermometer({ min: -10, max: 10, step: 1, every: 10, value: -3 }) },
          { q: 'Each small line is 5 °C. The red liquid stops 1 line above 20 °C. What is the temperature in °C?', a: '25 °C', n: 25, why: '1 line × 5 °C = 5 °C.\n20 + 5 = 25 °C.', visual: V.thermometer({ min: 0, max: 50, step: 5, every: 10, value: 25 }) },
          { q: 'Which is warmer: −8 °C or −2 °C?', a: '−2 °C', choices: ['−8 °C', '−2 °C'], why: '−2 °C is closer to zero, so it is warmer. −8 °C is 6 degrees colder.', visual: V.numberLine({ min: -10, max: 10, step: 1, every: 5, points: [[-8, '−8 °C'], [-2, '−2 °C']], ends: ['colder', 'warmer'] }) },
          { q: 'At what temperature does water freeze, in °C?', a: '0 °C', n: 0, why: 'Pure water freezes at 0 °C and boils at 100 °C.', visual: V.waterStrip() },
        ],
      },
      {
        name: 'Solids, liquids and gases',
        hint: 'A solid keeps its shape. A liquid takes the shape of its container. A gas spreads out to fill any space.',
        visual: V.statesJars(),
        items: [
          state('a rock', 'solid', 'A rock keeps its own shape, so it is a solid.'),
          state('milk', 'liquid', 'Milk pours and takes the shape of the glass, so it is a liquid.'),
          state('the air inside a soccer ball', 'gas', 'Air spreads out to fill the whole ball, so it is a gas.'),
          state('honey', 'liquid', 'Honey is thick, but it still pours and takes the shape of the jar. It is a liquid.'),
          state('an ice cube', 'solid', 'An ice cube keeps its own shape, so it is a solid.'),
        ],
      },
      {
        name: 'Changes of state',
        hint: 'Melting: solid → liquid. Freezing: liquid → solid. Evaporating: liquid → gas. Condensing: gas → liquid.',
        items: [
          { q: 'Ice cream left in the sun turns into a liquid. What is this change called?', a: 'melting', choices: CHANGES, why: 'Solid → liquid is melting.', visual: V.stateCycle('solid', 'liquid') },
          { q: 'Water in an ice-cube tray turns solid in the freezer. What is this change called?', a: 'freezing', choices: CHANGES, why: 'Liquid → solid is freezing.', visual: V.stateCycle('liquid', 'solid') },
          { q: 'A puddle slowly disappears on a sunny day. The water turns into a gas. What is this change called?', a: 'evaporating', choices: CHANGES, why: 'Liquid → gas is evaporating.', visual: V.stateCycle('liquid', 'gas') },
          { q: 'Water drops form on the outside of a cold glass. Water vapour in the air turned into liquid. What is this change called?', a: 'condensing', choices: CHANGES, why: 'Gas → liquid is condensing.', visual: V.stateCycle('gas', 'liquid') },
        ],
      },
      {
        name: 'Particles and heat',
        hint: 'All matter is made of tiny particles that are always moving. Heating makes them move faster; cooling makes them move slower.',
        items: [
          { q: 'You heat a pot of water. What happens to its particles?', a: 'They move faster.', choices: ['They move faster.', 'They move slower.', 'They stop moving.', 'They disappear.'], why: 'Heating gives particles more energy, so they move faster.', visual: V.particleHeat('heat') },
          { q: 'You put a jug of juice in the fridge. What happens to its particles?', a: 'They move slower.', choices: ['They move faster.', 'They move slower.', 'They stop moving.', 'They disappear.'], why: 'Cooling takes energy away, so the particles slow down. They never stop completely.', visual: V.particleHeat('cool') },
          { q: 'Are the particles in a solid ice cube still moving?', a: 'yes', choices: ['yes', 'no'], why: 'Particles never stop moving. In a solid they jiggle (vibrate) in place.', visual: V.particles('solid') },
          { q: 'In which state are the particles farthest apart?', a: 'gas', choices: ['solid', 'liquid', 'gas'], why: 'Gas particles are far apart and zoom around. That is why a gas spreads out to fill its container.', visual: V.particles() },
        ],
      },
      {
        name: 'Expanding and shrinking',
        hint: 'Most materials expand (get a little bigger) when heated and contract (shrink) when cooled.',
        visual: V.expandBar(),
        items: [
          { q: 'Most materials get a little bigger when they are heated. What is this called?', a: 'expanding', choices: ['expanding', 'contracting', 'melting', 'freezing'], why: 'Getting bigger when heated is expanding. Shrinking when cooled is contracting.' },
          { q: 'A metal lid is stuck on a glass jar. You run hot water over the lid and it comes off. Why?', a: 'The metal lid expanded.', choices: ['The metal lid expanded.', 'The lid melted.', 'The hot water made it slippery.', 'The jar shrank.'], why: 'The hot water heats the lid, so it expands a little and loosens.' },
          { q: 'Why do sidewalks have small gaps between the slabs?', a: 'To leave room for the concrete to expand when it is hot.', choices: ['To leave room for the concrete to expand when it is hot.', 'To let grass grow.', 'To save concrete.', 'To make it easier to shovel.'], why: 'Concrete expands in summer heat. Without gaps, the slabs would push on each other and crack.', visual: V.sidewalkGaps() },
          { q: 'The liquid in a thermometer goes up when it gets warmer. Why?', a: 'The liquid expands as it warms.', choices: ['The liquid expands as it warms.', 'More liquid is added.', 'The glass shrinks.', 'The liquid turns to gas.'], why: 'Warming makes the liquid expand, and the only place it can go is up the thin tube.', visual: V.thermometer({ min: 0, max: 40, step: 2, every: 10, value: 30 }) },
        ],
      },
    ],
  },
  {
    id: 'structures-forces', name: 'Structures & Forces', num: 4,
    summary: 'Pushes and pulls, gravity, friction, stretching and squashing, elastic materials, measuring',
    skills: [
      {
        name: 'Pushes and pulls',
        hint: 'A force is a push or a pull. A push moves something away from you; a pull moves it toward you.',
        visual: V.pushPull(),
        items: [
          pushPull('pulling a wagon', 'pull', 'You bring the wagon along toward you, so it is a pull.'),
          pushPull('pushing a shopping cart', 'push', 'You move the cart away from you, so it is a push.'),
          pushPull('a tug-of-war team hauling on the rope', 'pull', 'The team draws the rope toward themselves, so it is a pull.'),
          { q: 'What is a force?', a: 'a push or a pull', choices: ['a push or a pull', 'how fast something moves', 'how heavy something is', 'a kind of material'], why: 'A force is a push or a pull. Forces can start, stop or change the shape of things.' },
        ],
      },
      {
        name: 'Gravity',
        hint: 'Gravity pulls things toward Earth, all the time, even when they are not moving.',
        items: [
          { q: 'You let go of a ball. Which way does gravity pull it?', a: 'down, toward Earth', choices: ['down, toward Earth', 'up, toward the sky', 'sideways'], why: 'Gravity pulls everything down, toward the centre of Earth.', visual: V.dropBall() },
          { q: 'A book is sitting still on a table. Is gravity still pulling on it?', a: 'yes', choices: ['yes', 'no'], why: 'Gravity never switches off. The table pushes up on the book, so the book does not fall.', visual: V.bookTable() },
          { q: 'What force pulls you back down after you jump?', a: 'gravity', accept: ['the force of gravity', 'earths gravity', "earth's gravity"], why: 'Gravity pulls you back toward Earth.', visual: V.jumper() },
        ],
      },
      {
        name: 'Friction',
        hint: 'Friction happens when two surfaces rub. Rough surfaces make more friction than smooth ones.',
        visual: V.surfaces(),
        items: [
          { q: 'A hockey puck slides across the ice and slowly stops. Which force slows it down?', a: 'friction', choices: ['friction', 'gravity', 'magnetism'], why: 'The puck rubs on the ice. That rubbing is friction, and it slows the puck.', visual: V.puck() },
          { q: 'Which floor would a toy car roll farther on: smooth tile or thick carpet?', a: 'smooth tile', choices: ['smooth tile', 'thick carpet'], why: 'Smooth tile makes less friction than rough carpet, so the car rolls farther.' },
          { q: 'Why do people spread sand on icy sidewalks?', a: 'to make more friction so people don’t slip', choices: ['to make more friction so people don’t slip', 'to melt the ice', 'to make the sidewalk smooth', 'to keep the sidewalk warm'], why: 'Sand makes the surface rough. More friction means less slipping.' },
        ],
      },
      {
        name: 'Stretching and squashing',
        hint: 'Tension stretches or pulls a material apart. Compression squashes or pushes it together.',
        items: [
          { q: 'Two teams pull on a rope in tug-of-war. Is the rope being stretched or squashed?', a: STRETCH[0], choices: STRETCH, why: 'Both teams pull outward, so the rope is stretched. That is tension.', visual: V.internalForce('tension') },
          { q: 'You sit on a stool. Are its legs being stretched or squashed?', a: STRETCH[1], choices: STRETCH, why: 'Your weight pushes down on the legs, so they are squashed. That is compression.', visual: V.internalForce('compression') },
          { q: 'A swing hangs from two chains. When you sit on it, are the chains stretched or squashed?', a: STRETCH[0], choices: STRETCH, why: 'Your weight pulls down on the chains, so they are stretched. That is tension.', visual: V.internalForce('tension') },
          { q: 'A tall stack of books sits on a table. Is the bottom book being stretched or squashed?', a: STRETCH[1], choices: STRETCH, why: 'The books above press down on it, so it is squashed. That is compression.', visual: V.internalForce('compression') },
        ],
      },
      {
        name: 'Bouncing back or staying changed',
        hint: 'An elastic material goes back to its shape when you let go. A plastic material stays changed. ("Plastic" here means staying changed, not the material plastic.)',
        visual: V.elasticPlastic(),
        items: [
          { q: 'You stretch a rubber band and let go. It goes back to its shape. Is it elastic or plastic?', a: 'elastic', choices: ['elastic', 'plastic'], why: 'It goes back to its shape, so it is elastic.' },
          { q: 'You squash a ball of modelling clay and it stays flat. Is it elastic or plastic?', a: 'plastic', choices: ['elastic', 'plastic'], why: 'It stays changed, so it is plastic.' },
          { q: 'Which of these is the most elastic?', a: 'a spring', choices: ['a spring', 'a lump of clay', 'a piece of chalk', 'a cookie'], why: 'A spring bounces back after you stretch or squash it. Clay stays squashed, and chalk and cookies break.' },
        ],
      },
      {
        name: 'Measuring',
        hint: 'Length is measured in centimetres (cm) and metres (m). Mass is measured in grams (g) and kilograms (kg).',
        items: [
          { q: 'How long is the block, in cm?', a: '7 cm', n: 7, why: 'The block starts at 0 and ends at 7, so it is 7 cm long.', visual: V.rulerVis(7) },
          { q: 'What tool do we use to measure mass?', a: 'a balance or scale', choices: ['a balance or scale', 'a ruler', 'a thermometer', 'a clock'], why: 'A balance or scale measures mass. A ruler measures length.', visual: V.massApple() },
          { q: 'Which unit would you use for the length of a pencil?', a: 'centimetres', choices: ['centimetres', 'grams', 'degrees Celsius', 'litres'], why: 'Length is measured in centimetres. A pencil is about 18 cm long.', visual: V.rulerVis(5) },
        ],
      },
    ],
  },
  {
    id: 'planet-earth', name: 'Planet Earth', num: 5,
    summary: 'Describing rocks, water, wind and ice, fossils, reading a map, Earth in space',
    skills: [
      {
        name: 'Describing rocks',
        hint: 'You can sort rocks by what you see and feel: colour, texture (rough or smooth), shininess, layers and hardness.',
        visual: V.rockSamples(),
        items: [
          { q: 'You run your finger over a rock to feel if it is rough or smooth. Which property are you checking?', a: 'texture', choices: ['texture', 'colour', 'mass', 'temperature'], why: 'How a rock feels, rough or smooth, is its texture.' },
          { q: 'A hard rock and a soft rock are rubbed together. Which one gets scratched?', a: 'the soft rock', choices: ['the soft rock', 'the hard rock'], why: 'A harder rock scratches a softer one. That is one way to test hardness.' },
          { q: 'One rock has bits that sparkle in the light. Which property does this describe?', a: 'shininess', choices: ['shininess', 'texture', 'hardness', 'size'], why: 'Sparkling in the light is about how shiny the rock is.' },
        ],
      },
      {
        name: 'Water, wind and ice shape the land',
        hint: 'Moving water, wind and ice slowly break rock apart and carry the pieces away.',
        items: [
          { q: 'True or false: moving water, wind and ice can all wear away rock over a long time.', a: 'true', choices: ['true', 'false'], why: 'Water, wind and ice all wear away rock, slowly, over many years.', visual: V.weatheringVis('erosion') },
          { q: 'Water seeps into a crack in a rock and freezes. Ice takes up more space than water. What happens to the crack?', a: 'It gets bigger.', choices: ['It gets bigger.', 'It gets smaller.', 'It disappears.'], why: 'Freezing water expands and pushes the crack open. Over many winters the rock breaks apart.', visual: V.weatheringVis('weathering') },
          { q: 'A fast river carries sand and pebbles. What happens to the sand when the river slows down?', a: 'It drops and settles on the bottom.', choices: ['It drops and settles on the bottom.', 'It floats up into the air.', 'It melts.', 'It moves even faster.'], why: 'Slow water cannot carry as much, so the sand drops and settles.', visual: V.weatheringVis('deposition') },
        ],
      },
      {
        name: 'Fossils',
        hint: 'A fossil is the remains or traces of a living thing from long ago, kept in rock.',
        visual: V.fossilVis(),
        items: [
          { q: 'What is a fossil?', a: 'the remains or traces of a living thing from long ago', choices: ['the remains or traces of a living thing from long ago', 'a very old rock with no life in it', 'a shiny mineral', 'a living animal in a cave'], why: 'Fossils are bones, shells, footprints or prints of living things from long ago, kept in rock.' },
          { q: 'Which of these is a fossil?', a: 'a dinosaur footprint in rock', choices: ['a dinosaur footprint in rock', 'a plastic toy dinosaur', 'a shell from a beach today', 'a drawing of a dinosaur'], why: 'A footprint pressed into rock long ago is a trace fossil. The others were made recently.' },
          { q: 'The badlands near Drumheller, Alberta, are famous for fossils of which animals?', a: 'dinosaurs', accept: ['dinosaur', 'dinos', 'dino'], why: 'Alberta is one of the best places in the world to find dinosaur fossils.' },
        ],
      },
      {
        name: 'Reading a map',
        hint: 'North is usually at the top of a map. The key explains the symbols, and the scale tells you real distances.',
        items: [
          { q: 'On most maps, which direction is at the top?', a: 'north', choices: ['north', 'south', 'east', 'west'], why: 'Maps usually put north at the top. A compass rose shows the directions.', visual: V.mapVis({ north: '?' }) },
          { q: 'On a map, 1 cm stands for 1 km. Towns A and B are 4 cm apart on the map. How far apart are they really, in km?', a: '4 km', n: 4, why: 'Each 1 cm is 1 km, so 4 cm is 4 km.', visual: V.mapVis({ scale: true }) },
          { q: 'What is a map key for?', a: 'It tells you what the symbols mean.', choices: ['It tells you what the symbols mean.', 'It shows which way is north.', 'It unlocks the map.', 'It tells you the date.'], why: 'The key explains each symbol, like a triangle for a mountain.', visual: V.mapVis() },
        ],
      },
      {
        name: 'Earth in space',
        hint: 'Earth is a planet. It is the third planet from the Sun. The Sun is a star.',
        visual: V.innerPlanets(),
        items: [
          { q: 'Is the Sun a planet or a star?', a: 'a star', choices: ['a planet', 'a star'], why: 'The Sun is a star: a huge ball of hot gas that makes its own light.' },
          { q: 'Counting out from the Sun, which planet is Earth?', a: 'the third', choices: ['the first', 'the second', 'the third', 'the fourth'], why: 'Mercury, Venus, then Earth. Earth is the third planet from the Sun.' },
          { q: 'What does Earth travel around once a year?', a: 'the Sun', choices: ['the Sun', 'the Moon', 'Mars'], why: 'Earth orbits the Sun. One trip around takes one year.', visual: V.orbit({ center: '?' }) },
        ],
      },
    ],
  },
] };
})();
