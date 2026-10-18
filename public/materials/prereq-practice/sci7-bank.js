// Grade 7 Science prereq practice questions, used by sci7-<unit>-prereq-practice-v1.html.
// Each skill's gen() makes a new question: { question, answer, solution, hint, accept(input) }.
// Moved from the old site page src/pages/science7/practice (2026-10-18); the generators are unchanged.
(function () {

// ─── UTILITIES ───
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = randInt(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a;
}
function normalize(s) { return s.toLowerCase().replace(/[^a-z0-9]/g, ''); }
function acceptAny(...answers) {
  return i => {
    const n = normalize(i);
    return answers.some(a => normalize(a) === n || n.includes(normalize(a)));
  };
}

// ══════════════════════════════════════════════════
// UNIT 1: INTERACTIONS & ECOSYSTEMS
// Prereqs: Gr 5-6 vocab on habitats, food chains,
// living vs non-living, basic needs of organisms
// ══════════════════════════════════════════════════

function genBioticAbiotic() {
  const biotic = ['tree', 'mushroom', 'grass', 'bacteria', 'deer', 'eagle', 'worm', 'moss', 'algae', 'fish'];
  const abiotic = ['sunlight', 'water', 'temperature', 'soil minerals', 'wind', 'rocks', 'oxygen gas', 'rainfall'];
  const mode = randInt(0, 1);
  if (mode === 0) { const item = pick(biotic); return { question: `Is "${item}" biotic or abiotic?`, answer: 'biotic', solution: `"${item}" is biotic (living or once-living).\nBiotic = anything that is alive or was once alive.\nAbiotic = non-living physical or chemical factors.`, hint: 'Biotic means living or once-living. Abiotic means never alive.', accept: acceptAny('biotic') }; }
  const item = pick(abiotic);
  return { question: `Is "${item}" biotic or abiotic?`, answer: 'abiotic', solution: `"${item}" is abiotic (non-living).\nAbiotic factors are physical or chemical parts of the environment.\nExamples: sunlight, water, temperature, wind.`, hint: 'Biotic means living or once-living. Abiotic means never alive.', accept: acceptAny('abiotic') };
}

function genProducerConsumer() {
  const producers = [['grass', 'It makes its own food via photosynthesis.'], ['oak tree', 'Trees are producers — they photosynthesize.'], ['algae', 'Algae are photosynthetic organisms.'], ['cactus', 'Plants are producers.'], ['phytoplankton', 'Phytoplankton photosynthesize in water.']];
  const consumers = [['rabbit', 'Rabbits eat plants — they are consumers (herbivores).'], ['wolf', 'Wolves eat other animals — they are consumers (carnivores).'], ['hawk', 'Hawks hunt prey — they are consumers.'], ['frog', 'Frogs eat insects — they are consumers.'], ['bear', 'Bears eat both plants and animals — they are consumers (omnivores).']];
  const mode = randInt(0, 1);
  if (mode === 0) { const [org, why] = pick(producers); return { question: `Is a ${org} a producer or a consumer?`, answer: 'producer', solution: `A ${org} is a producer.\n${why}\nProducers make their own food using sunlight (photosynthesis).`, hint: 'Producers make their own food. Consumers eat other organisms.', accept: acceptAny('producer') }; }
  const [org, why] = pick(consumers);
  return { question: `Is a ${org} a producer or a consumer?`, answer: 'consumer', solution: `A ${org} is a consumer.\n${why}\nConsumers must eat other organisms for energy.`, hint: 'Producers make their own food. Consumers eat other organisms.', accept: acceptAny('consumer') };
}

function genFoodChainOrder() {
  const chains = [
    { chain: ['grass', 'grasshopper', 'frog', 'snake', 'hawk'], q: 'In the food chain grass → grasshopper → frog → snake → hawk, what is the tertiary consumer?', a: 'snake', sol: 'Primary consumer: grasshopper (eats producer)\nSecondary consumer: frog (eats primary)\nTertiary consumer: snake (eats secondary)\nQuaternary consumer: hawk (eats tertiary)' },
    { chain: ['algae', 'minnow', 'trout', 'bear'], q: 'In the food chain algae → minnow → trout → bear, what is the producer?', a: 'algae', sol: 'Producer: algae (makes own food)\nPrimary consumer: minnow\nSecondary consumer: trout\nTertiary consumer: bear' },
    { chain: ['grass', 'rabbit', 'fox'], q: 'In the food chain grass → rabbit → fox, what is the primary consumer?', a: 'rabbit', sol: 'Producer: grass\nPrimary consumer: rabbit (first to eat the producer)\nSecondary consumer: fox (eats the primary consumer)' },
    { chain: ['phytoplankton', 'zooplankton', 'herring', 'seal', 'orca'], q: 'In the food chain phytoplankton → zooplankton → herring → seal → orca, what is the secondary consumer?', a: 'herring', sol: 'Producer: phytoplankton\nPrimary consumer: zooplankton\nSecondary consumer: herring\nTertiary consumer: seal\nQuaternary consumer: orca' },
  ];
  const c = pick(chains);
  return { question: c.q, answer: c.a, solution: c.sol, hint: 'Count from the producer: 1st eater = primary consumer, 2nd = secondary, 3rd = tertiary.', accept: acceptAny(c.a) };
}

function genEcosystemVocab() {
  const terms = [
    { def: 'A group of organisms of the same species living in the same area', term: 'population', hint: 'Think about one species only.' },
    { def: 'All the populations of different species living and interacting in the same area', term: 'community', hint: 'Multiple species together.' },
    { def: 'A community of living things interacting with their non-living environment', term: 'ecosystem', hint: 'Living + non-living together.' },
    { def: 'The specific place where an organism lives and finds what it needs to survive', term: 'habitat', hint: 'An organism\'s "address" in nature.' },
    { def: 'An organism\'s role or job in its ecosystem, including what it eats and who eats it', term: 'niche', hint: 'An organism\'s "job description" in the ecosystem.' },
    { def: 'An organism that breaks down dead organisms and returns nutrients to the soil', term: 'decomposer', hint: 'Think fungi and bacteria breaking down dead material.' },
  ];
  const t = pick(terms);
  return { question: `What term matches this definition?\n"${t.def}"`, answer: t.term, solution: `Answer: ${t.term}\n${t.def}`, hint: t.hint, accept: acceptAny(t.term) };
}

function genEnergyFlow() {
  const questions = [
    { q: 'Where does the energy in most ecosystems originally come from?', a: 'the sun', sol: 'The sun provides energy to producers (plants) through photosynthesis.\nThis energy flows through the food chain to consumers.', accept: acceptAny('sun', 'sunlight', 'the sun', 'solar') },
    { q: 'As energy moves from one level of a food chain to the next, does the amount of available energy increase or decrease?', a: 'decrease', sol: 'Energy decreases at each level.\nAbout 90% of energy is lost as heat at each step.\nOnly about 10% is passed to the next consumer.', accept: acceptAny('decrease', 'decreases', 'less', 'goes down') },
    { q: 'What process do producers use to convert sunlight into food energy?', a: 'photosynthesis', sol: 'Photosynthesis: sunlight + CO₂ + water → glucose + oxygen\nThis is how producers make their own food.', accept: acceptAny('photosynthesis') },
    { q: 'In an energy pyramid, which level has the most energy — the bottom (producers) or the top (top predators)?', a: 'bottom', sol: 'The bottom level (producers) has the most energy.\nEnergy is lost at each level, so the top has the least.\nThis is why there are fewer top predators than producers.', accept: acceptAny('bottom', 'producers', 'base') },
  ];
  const q = pick(questions);
  return { question: q.q, answer: q.a, solution: q.sol, hint: 'Think about how energy flows through a food chain.', accept: q.accept };
}

// ══════════════════════════════════════════════════
// UNIT 2: PLANTS FOR FOOD AND FIBRE
// Prereqs: basic plant parts, needs of plants,
// cell basics, seed structure
// ══════════════════════════════════════════════════

function genPlantParts() {
  const parts = [
    { part: 'roots', fn: 'absorb water and minerals from the soil and anchor the plant' },
    { part: 'stem', fn: 'transport water and nutrients between roots and leaves, and support the plant' },
    { part: 'leaves', fn: 'capture sunlight and carry out photosynthesis to make food' },
    { part: 'flower', fn: 'produce seeds through pollination and fertilization (reproductive organ)' },
    { part: 'seeds', fn: 'contain the embryo of a new plant along with a food supply' },
  ];
  const p = pick(parts);
  const mode = randInt(0, 1);
  if (mode === 0) return { question: `What is the main function of the ${p.part} of a plant?`, answer: p.fn, solution: `${p.part}: ${p.fn}`, hint: 'Think about what this part does for the plant\'s survival.', accept: i => { const n = normalize(i); const keywords = p.fn.split(' ').filter(w=>w.length>4).map(normalize); return keywords.filter(k=>n.includes(k)).length >= 2; }};
  return { question: `Which plant part does this describe?\n"${p.fn}"`, answer: p.part, solution: `Answer: ${p.part}\n${p.fn}`, hint: 'Think about the main parts: roots, stem, leaves, flower, seeds.', accept: acceptAny(p.part) };
}

function genPlantNeeds() {
  const needs = ['water', 'sunlight', 'carbon dioxide', 'nutrients from soil', 'appropriate temperature'];
  const idx = randInt(0, needs.length - 1);
  const without = needs.filter((_, i) => i !== idx);
  return { question: `Name one thing that plants need to grow and survive (besides ${pick(without)} and ${pick(without.filter(x => x !== pick(without)))}).`, answer: needs[idx],
    solution: `Plants need: ${needs.join(', ')}\nAny of these would be correct.`,
    hint: 'Think about what goes into photosynthesis, plus basic survival needs.',
    accept: i => needs.some(n => normalize(i).includes(normalize(n))) };
}

function genCellBasics() {
  const terms = [
    { def: 'The basic unit of life — all living things are made of these', term: 'cell', hint: 'The smallest unit of life.' },
    { def: 'The thin outer boundary of a cell that controls what enters and leaves', term: 'cell membrane', hint: 'It acts like a gatekeeper for the cell.' },
    { def: 'The rigid outer layer of a plant cell that provides structure and support', term: 'cell wall', hint: 'Only plant cells have this. It\'s outside the membrane.' },
    { def: 'The green pigment in plant cells that captures sunlight for photosynthesis', term: 'chlorophyll', hint: 'It\'s what makes plants green.' },
    { def: 'The organelle in plant cells where photosynthesis takes place', term: 'chloroplast', hint: 'It contains the green pigment.' },
    { def: 'The control center of the cell that contains genetic information', term: 'nucleus', hint: 'Think of it as the "brain" of the cell.' },
  ];
  const t = pick(terms);
  return { question: `What term matches this definition?\n"${t.def}"`, answer: t.term, solution: `Answer: ${t.term}\n${t.def}`, hint: t.hint, accept: acceptAny(t.term) };
}

function genPhotosynthesisBasics() {
  const questions = [
    { q: 'What are the three inputs (reactants) needed for photosynthesis?', a: 'sunlight, water, carbon dioxide', sol: 'Photosynthesis: sunlight + water + CO₂ → glucose + oxygen\nInputs: sunlight, water, carbon dioxide', accept: i => { const n = normalize(i); return (n.includes('sun') || n.includes('light')) && n.includes('water') && (n.includes('carbon') || n.includes('co2')); }},
    { q: 'What are the two outputs (products) of photosynthesis?', a: 'glucose and oxygen', sol: 'Photosynthesis: sunlight + water + CO₂ → glucose + oxygen\nProducts: glucose (sugar/food) and oxygen', accept: i => { const n = normalize(i); return (n.includes('glucose') || n.includes('sugar') || n.includes('food')) && n.includes('oxygen'); }},
    { q: 'In which organelle does photosynthesis occur?', a: 'chloroplast', sol: 'Photosynthesis happens in the chloroplast.\nChloroplasts contain chlorophyll, the green pigment that absorbs sunlight.', accept: acceptAny('chloroplast', 'chloroplasts') },
    { q: 'What is the word equation for photosynthesis?\n(Format: ___ + ___ + ___ → ___ + ___)', a: 'sunlight + water + carbon dioxide → glucose + oxygen', sol: 'sunlight + water + carbon dioxide → glucose + oxygen\n(light energy + H₂O + CO₂ → C₆H₁₂O₆ + O₂)', accept: i => { const n = normalize(i); return (n.includes('sun') || n.includes('light')) && n.includes('water') && n.includes('oxygen') && (n.includes('glucose') || n.includes('sugar')); }},
  ];
  const q = pick(questions);
  return { question: q.q, answer: q.a, solution: q.sol, hint: 'Remember the photosynthesis equation: light + water + CO₂ → sugar + O₂.', accept: q.accept };
}

function genPollinationSeed() {
  const terms = [
    { def: 'The transfer of pollen from the male part (stamen) to the female part (pistil) of a flower', term: 'pollination' },
    { def: 'The joining of a sperm cell and egg cell to form a new organism', term: 'fertilization' },
    { def: 'The process of a seed beginning to grow into a new plant', term: 'germination' },
    { def: 'The male reproductive part of a flower that produces pollen', term: 'stamen' },
    { def: 'The female reproductive part of a flower that contains the ovary', term: 'pistil' },
  ];
  const t = pick(terms);
  return { question: `What term matches this definition?\n"${t.def}"`, answer: t.term, solution: `Answer: ${t.term}\n${t.def}`, hint: 'Think about the steps of plant reproduction.', accept: acceptAny(t.term) };
}

// ══════════════════════════════════════════════════
// UNIT 3: HEAT AND TEMPERATURE
// Prereqs: states of matter, thermometer reading,
// particle model basics, energy forms
// ══════════════════════════════════════════════════

function genStatesOfMatter() {
  const states = [
    { state: 'solid', desc: 'Particles are tightly packed in a fixed arrangement. They vibrate in place but don\'t move freely.', ex: 'ice, rock, wood' },
    { state: 'liquid', desc: 'Particles are close together but can slide past each other. They take the shape of their container.', ex: 'water, juice, oil' },
    { state: 'gas', desc: 'Particles are far apart and move quickly in all directions. They fill any container.', ex: 'steam, oxygen, helium' },
  ];
  const s = pick(states);
  const mode = randInt(0, 1);
  if (mode === 0) return { question: `What state of matter is described?\n"${s.desc}"`, answer: s.state, solution: `Answer: ${s.state}\n${s.desc}\nExamples: ${s.ex}`, hint: 'Think about how tightly the particles are packed and how they move.', accept: acceptAny(s.state) };
  const ex = pick(s.ex.split(', '));
  return { question: `What state of matter is ${ex} at room temperature?`, answer: s.state, solution: `${ex} is a ${s.state}.\n${s.desc}`, hint: 'Solid, liquid, or gas?', accept: acceptAny(s.state) };
}

function genParticleModel() {
  const questions = [
    { q: 'According to the particle model of matter, what happens to particles when they are heated?', a: 'They speed up and move faster', sol: 'When heated, particles gain kinetic energy.\nThey vibrate/move faster and spread farther apart.\nThis is why materials expand when heated.', accept: i => { const n=normalize(i); return (n.includes('fast') || n.includes('speed') || n.includes('move') || n.includes('energy')) && !n.includes('slow'); }},
    { q: 'According to the particle model, what happens to particles when they are cooled?', a: 'They slow down and move less', sol: 'When cooled, particles lose kinetic energy.\nThey vibrate/move slower and pack closer together.\nThis is why materials contract when cooled.', accept: i => { const n=normalize(i); return n.includes('slow') || n.includes('less') || n.includes('closer'); }},
    { q: 'Are there spaces between particles in a gas, liquid, or both?', a: 'both', sol: 'Both gases and liquids have spaces between particles.\nGases have large spaces (particles far apart).\nLiquids have small spaces (particles close but not fixed).\nSolids have the least space.', accept: acceptAny('both') },
    { q: 'In which state of matter do particles have the MOST kinetic energy?', a: 'gas', sol: 'Gas particles have the most kinetic energy.\nThey move the fastest and are the farthest apart.\nSolid < Liquid < Gas (in terms of particle energy)', accept: acceptAny('gas') },
  ];
  const q = pick(questions);
  return { question: q.q, answer: q.a, solution: q.sol, hint: 'The particle model says all matter is made of tiny particles that are always moving.', accept: q.accept };
}

function genHeatVsTemp() {
  const questions = [
    { q: 'What is the difference between heat and temperature?\nWhich one measures the AVERAGE kinetic energy of particles?', a: 'temperature', sol: 'Temperature: measures the average kinetic energy of particles.\nHeat: the total energy transferred from a warmer to a cooler object.\nTemperature is measured with a thermometer.\nHeat is measured in joules (J).', accept: acceptAny('temperature', 'temp') },
    { q: 'Heat always flows from a ______ object to a ______ object. (warmer/cooler or cooler/warmer?)', a: 'warmer to cooler', sol: 'Heat always flows from warmer → cooler.\nThis continues until both objects reach the same temperature (thermal equilibrium).', accept: i => { const n=normalize(i); return n.includes('warm') && n.indexOf('warm') < n.indexOf('cool'); }},
    { q: 'What unit is temperature measured in (in science)?', a: 'degrees Celsius', sol: 'In science, temperature is measured in degrees Celsius (°C).\nThe Kelvin scale (K) is also used in advanced science.\nFahrenheit (°F) is used in everyday life in the US.', accept: acceptAny('celsius', 'degrees celsius', 'kelvin', 'C') },
    { q: 'At what temperature does water freeze (in °C)?', a: '0°C', sol: 'Water freezes at 0°C (32°F).\nWater boils at 100°C (212°F).\nThese are key reference points on the Celsius scale.', accept: i => normalize(i).includes('0') },
  ];
  const q = pick(questions);
  return { question: q.q, answer: q.a, solution: q.sol, hint: 'Think about what a thermometer measures vs. what flows between objects.', accept: q.accept };
}

function genEnergyForms() {
  const forms = [
    { form: 'thermal', desc: 'energy related to the temperature of an object (heat energy)', ex: 'a hot stove, warm bathwater' },
    { form: 'chemical', desc: 'energy stored in the bonds of molecules, released by reactions', ex: 'food, gasoline, batteries' },
    { form: 'electrical', desc: 'energy from the flow of electric charges', ex: 'lightning, wall outlet, batteries in use' },
    { form: 'mechanical', desc: 'energy of motion or position of an object', ex: 'a moving car, a stretched spring' },
    { form: 'light', desc: 'energy that travels as electromagnetic waves and can be seen', ex: 'sunlight, a lamp, fire' },
    { form: 'sound', desc: 'energy that travels as vibrations through matter', ex: 'music, thunder, clapping' },
  ];
  const f = pick(forms);
  return { question: `What form of energy is described?\n"${f.desc}"\n(Examples: ${f.ex})`, answer: `${f.form} energy`, solution: `Answer: ${f.form} energy\n${f.desc}\nExamples: ${f.ex}`, hint: 'Main forms: thermal, chemical, electrical, mechanical, light, sound.', accept: acceptAny(f.form) };
}

function genStateChanges() {
  const changes = [
    { from: 'solid', to: 'liquid', name: 'melting', ex: 'ice melting into water' },
    { from: 'liquid', to: 'gas', name: 'evaporation', ex: 'water boiling into steam' },
    { from: 'gas', to: 'liquid', name: 'condensation', ex: 'steam forming water droplets on a mirror' },
    { from: 'liquid', to: 'solid', name: 'freezing', ex: 'water turning to ice' },
    { from: 'solid', to: 'gas', name: 'sublimation', ex: 'dry ice turning directly to gas' },
  ];
  const c = pick(changes);
  const mode = randInt(0, 1);
  if (mode === 0) return { question: `What is the change of state called when a ${c.from} turns into a ${c.to}?`, answer: c.name, solution: `${c.from} → ${c.to} = ${c.name}\nExample: ${c.ex}`, hint: `Think: solid ↔ liquid ↔ gas. What's the name for each arrow?`, accept: acceptAny(c.name) };
  return { question: `What change of state is this an example of?\n"${c.ex}"`, answer: c.name, solution: `${c.ex} = ${c.name}\n(${c.from} → ${c.to})`, hint: 'Is the material going from solid to liquid, liquid to gas, etc.?', accept: acceptAny(c.name) };
}

// ══════════════════════════════════════════════════
// UNIT 4: STRUCTURES AND FORCES
// Prereqs: basic forces, gravity, types of structures,
// materials, simple machines
// ══════════════════════════════════════════════════

function genForceBasics() {
  const questions = [
    { q: 'What is a force?', a: 'a push or pull on an object', sol: 'A force is a push or a pull that can change an object\'s motion, shape, or direction.\nForces are measured in Newtons (N).', accept: i => { const n=normalize(i); return n.includes('push') || n.includes('pull'); }},
    { q: 'What is the force that pulls objects toward Earth called?', a: 'gravity', sol: 'Gravity is the force that pulls all objects toward the center of the Earth.\nIt gives objects their weight.', accept: acceptAny('gravity') },
    { q: 'What unit is force measured in?', a: 'Newtons (N)', sol: 'Force is measured in Newtons (N).\nNamed after Sir Isaac Newton.\n1 N ≈ the force of gravity on a 100 g mass.', accept: acceptAny('newton', 'newtons', 'N') },
    { q: 'What is friction?', a: 'a force that opposes motion between surfaces', sol: 'Friction is a force that resists or opposes the motion of two surfaces sliding against each other.\nIt produces heat and slows things down.', accept: i => { const n=normalize(i); return n.includes('oppos') || n.includes('resist') || (n.includes('force') && n.includes('motion')); }},
  ];
  const q = pick(questions);
  return { question: q.q, answer: q.a, solution: q.sol, hint: 'Forces cause changes in motion. They are pushes and pulls.', accept: q.accept };
}

function genStructureTypes() {
  const types = [
    { type: 'solid (mass) structure', desc: 'Made of solid material with few or no hollow spaces', ex: 'a dam, a brick wall, a mountain', hint: 'Think thick and heavy — made of solid material.' },
    { type: 'frame structure', desc: 'Made of parts (members) joined together, often with open spaces', ex: 'a bicycle frame, a skeleton, the Eiffel Tower', hint: 'Think of a skeleton — connected parts with spaces between.' },
    { type: 'shell structure', desc: 'A hollow structure with a thin outer layer that provides strength', ex: 'an egg, a helmet, an igloo, a dome', hint: 'Think of a thin outer layer enclosing a space.' },
  ];
  const t = pick(types);
  const mode = randInt(0, 1);
  if (mode === 0) return { question: `What type of structure is described?\n"${t.desc}"\n(Examples: ${t.ex})`, answer: t.type, solution: `Answer: ${t.type}\n${t.desc}\nExamples: ${t.ex}`, hint: t.hint, accept: i => { const n=normalize(i); return normalize(t.type).split('structure')[0].trim().split(/\s+/).some(w => n.includes(w)); }};
  const ex = pick(t.ex.split(', '));
  return { question: `What type of structure is ${ex}? (solid/mass, frame, or shell)`, answer: t.type, solution: `${ex} is a ${t.type}.\n${t.desc}`, hint: t.hint, accept: i => { const n=normalize(i); return normalize(t.type).split('structure')[0].trim().split(/\s+/).some(w => n.includes(w)); }};
}

function genLoadTypes() {
  const loads = [
    { type: 'dead load', desc: 'The weight of the structure itself', ex: 'the weight of the bridge\'s steel and concrete' },
    { type: 'live load', desc: 'The weight of things that move on or in the structure', ex: 'people walking on a bridge, furniture in a building' },
    { type: 'dynamic load', desc: 'Forces that change or move, like wind, earthquakes, or vibrations', ex: 'wind pushing on a building, an earthquake shaking a bridge' },
  ];
  const l = pick(loads);
  return { question: `What type of load is described?\n"${l.desc}"\n(Example: ${l.ex})`, answer: l.type, solution: `Answer: ${l.type}\n${l.desc}\nExample: ${l.ex}`, hint: 'Three types: dead load (structure\'s own weight), live load (things on it), dynamic load (changing forces).', accept: i => normalize(i).includes(normalize(l.type.split(' ')[0])) };
}

function genInternalForces() {
  const forces = [
    { force: 'tension', desc: 'A stretching or pulling force that tries to pull a material apart', ex: 'a rope in tug-of-war, a cable supporting a bridge' },
    { force: 'compression', desc: 'A squeezing or pushing force that tries to crush a material', ex: 'a column supporting a roof, a person sitting on a chair' },
    { force: 'shear', desc: 'A force that pushes parts of a material in opposite directions (like scissors)', ex: 'cutting paper with scissors, wind pushing the top of a building one way while the base stays' },
    { force: 'torsion', desc: 'A twisting force', ex: 'wringing out a towel, turning a doorknob' },
  ];
  const f = pick(forces);
  return { question: `What internal force is described?\n"${f.desc}"`, answer: f.force, solution: `Answer: ${f.force}\n${f.desc}\nExample: ${f.ex}`, hint: 'Internal forces: tension (pull), compression (push), shear (opposite), torsion (twist).', accept: acceptAny(f.force) };
}

function genSimpleMachines() {
  const machines = [
    { machine: 'lever', desc: 'A bar that pivots on a fulcrum to lift or move a load', ex: 'seesaw, crowbar, scissors' },
    { machine: 'inclined plane', desc: 'A flat surface set at an angle, used to move objects to a higher level with less force', ex: 'ramp, slide, wedge' },
    { machine: 'pulley', desc: 'A wheel with a rope or chain, used to change the direction of a force', ex: 'flagpole, crane, blinds' },
    { machine: 'wheel and axle', desc: 'A wheel attached to a rod (axle) that turn together to reduce friction', ex: 'doorknob, steering wheel, screwdriver' },
    { machine: 'screw', desc: 'An inclined plane wrapped around a cylinder', ex: 'bolt, jar lid, drill bit' },
  ];
  const m = pick(machines);
  const ex = pick(m.ex.split(', '));
  return { question: `What simple machine is ${ex} an example of?`, answer: m.machine, solution: `${ex} is a ${m.machine}.\n${m.desc}\nOther examples: ${m.ex}`, hint: 'Six simple machines: lever, inclined plane, pulley, wheel & axle, screw, wedge.', accept: acceptAny(m.machine) };
}

// ══════════════════════════════════════════════════
// UNIT 5: PLANET EARTH
// Prereqs: layers of earth, rock types, weathering,
// erosion, minerals, geological processes
// ══════════════════════════════════════════════════

function genEarthLayers() {
  const layers = [
    { layer: 'crust', desc: 'The thin, solid outermost layer of the Earth that we live on', props: 'Thinnest layer, 5-70 km thick, made of rock' },
    { layer: 'mantle', desc: 'The thick middle layer made of hot, semi-solid rock that flows slowly', props: 'Thickest layer, ~2900 km, convection currents move tectonic plates' },
    { layer: 'outer core', desc: 'A liquid layer made mostly of iron and nickel', props: 'Liquid metal, ~2200 km thick, creates Earth\'s magnetic field' },
    { layer: 'inner core', desc: 'The solid center of the Earth made of iron and nickel under extreme pressure', props: 'Solid due to pressure, hottest layer (~5000°C)' },
  ];
  const l = pick(layers);
  return { question: `Which layer of the Earth is described?\n"${l.desc}"`, answer: l.layer, solution: `Answer: ${l.layer}\n${l.desc}\n${l.props}`, hint: 'From outside in: crust → mantle → outer core → inner core.', accept: acceptAny(l.layer) };
}

function genRockTypes() {
  const types = [
    { type: 'igneous', desc: 'Formed when melted rock (magma or lava) cools and hardens', ex: 'granite, basalt, obsidian', process: 'Magma cools slowly underground → large crystals. Lava cools quickly on surface → small crystals.' },
    { type: 'sedimentary', desc: 'Formed when layers of sediment are compacted and cemented together over time', ex: 'sandstone, limestone, shale', process: 'Erosion → deposition → compaction → cementation (over millions of years).' },
    { type: 'metamorphic', desc: 'Formed when existing rock is changed by intense heat and pressure (without melting)', ex: 'marble (from limestone), slate (from shale), quartzite (from sandstone)', process: 'Heat + pressure deep underground changes the rock\'s structure.' },
  ];
  const t = pick(types);
  const mode = randInt(0, 1);
  if (mode === 0) return { question: `What type of rock is described?\n"${t.desc}"`, answer: t.type, solution: `Answer: ${t.type}\n${t.desc}\nExamples: ${t.ex}\n${t.process}`, hint: 'Three rock types: igneous (fire/cooling), sedimentary (layers), metamorphic (changed by heat/pressure).', accept: acceptAny(t.type) };
  const ex = pick(t.ex.split(', '));
  return { question: `What type of rock is ${ex}? (igneous, sedimentary, or metamorphic)`, answer: t.type, solution: `${ex} is ${t.type}.\n${t.desc}\n${t.process}`, hint: 'Igneous = cooled magma/lava. Sedimentary = compacted layers. Metamorphic = changed by heat + pressure.', accept: acceptAny(t.type) };
}

function genWeatheringErosion() {
  const terms = [
    { def: 'The breaking down of rock into smaller pieces by natural forces (without moving it)', term: 'weathering', hint: 'Breaking down in place — not moving.' },
    { def: 'The process of moving weathered rock and soil from one place to another by wind, water, ice, or gravity', term: 'erosion', hint: 'This is about transport — picking up and carrying.' },
    { def: 'The process of eroded material being dropped or settled in a new location', term: 'deposition', hint: 'This is where eroded material ends up — it settles down.' },
    { def: 'The slow, continuous wearing away of rock by water, wind, or chemical reactions over time', term: 'weathering', hint: 'Think about what wind and rain do to mountains over millions of years.' },
  ];
  const t = pick(terms);
  return { question: `What geological process is described?\n"${t.def}"`, answer: t.term, solution: `Answer: ${t.term}\n${t.def}`, hint: t.hint, accept: acceptAny(t.term) };
}

function genMinerals() {
  const questions = [
    { q: 'What is a mineral?', a: 'a naturally occurring, inorganic solid with a crystal structure', sol: 'A mineral is:\n- Naturally occurring (not human-made)\n- Inorganic (not from living things)\n- Solid\n- Has a definite crystal structure\n- Has a specific chemical composition', accept: i => { const n=normalize(i); return (n.includes('natural') || n.includes('inorganic')) && n.includes('solid'); }},
    { q: 'What property of a mineral describes how it reflects light (metallic, glassy, dull, etc.)?', a: 'lustre', sol: 'Lustre describes how a mineral\'s surface reflects light.\nTypes: metallic, glassy (vitreous), dull (earthy), waxy, pearly, silky', accept: acceptAny('lustre', 'luster') },
    { q: 'What scale is used to rank the hardness of minerals from 1 (softest) to 10 (hardest)?', a: "Mohs scale", sol: "Mohs Hardness Scale:\n1 = Talc (softest)\n10 = Diamond (hardest)\nA mineral can scratch anything softer than it.", accept: acceptAny('mohs', "mohs scale") },
    { q: 'What is the colour of the powder a mineral leaves when rubbed on a porcelain plate called?', a: 'streak', sol: 'Streak is the colour of a mineral\'s powder.\nIt is found by rubbing the mineral on a streak plate (unglazed porcelain).\nStreak is more reliable than colour for identification.', accept: acceptAny('streak') },
  ];
  const q = pick(questions);
  return { question: q.q, answer: q.a, solution: q.sol, hint: 'Think about how we identify and classify minerals.', accept: q.accept };
}

function genRockCycle() {
  const questions = [
    { q: 'What is the rock cycle?', a: 'the continuous process of rocks changing from one type to another', sol: 'The rock cycle describes how rocks change between igneous, sedimentary, and metamorphic types.\nIt is driven by heat, pressure, weathering, erosion, and cooling.', accept: i => { const n=normalize(i); return n.includes('chang') && (n.includes('rock') || n.includes('type')); }},
    { q: 'What must happen to sedimentary or metamorphic rock for it to become igneous?', a: 'it must melt into magma and then cool', sol: 'To become igneous rock:\n1. Rock must melt into magma (deep underground)\n2. Magma must cool and solidify\nThis can happen on the surface (lava → volcanic rock) or underground.', accept: i => { const n=normalize(i); return n.includes('melt') || n.includes('magma') || n.includes('cool'); }},
    { q: 'What two forces change existing rock into metamorphic rock?', a: 'heat and pressure', sol: 'Metamorphic rock forms when existing rock is subjected to:\n- Heat (but not enough to melt it)\n- Pressure (from weight of overlying rock or tectonic forces)\nThe rock\'s minerals rearrange without melting.', accept: i => { const n=normalize(i); return n.includes('heat') && n.includes('pressure'); }},
    { q: 'What process turns loose sediments into sedimentary rock?', a: 'compaction and cementation', sol: 'Sedimentary rock formation:\n1. Compaction: layers of sediment are squeezed by weight above\n2. Cementation: minerals dissolved in water "glue" particles together\nThis process takes millions of years.', accept: i => { const n=normalize(i); return n.includes('compact') || n.includes('cement'); }},
  ];
  const q = pick(questions);
  return { question: q.q, answer: q.a, solution: q.sol, hint: 'The rock cycle connects igneous, sedimentary, and metamorphic rocks.', accept: q.accept };
}

// ─── TOPIC REGISTRY ───
const TOPICS = [
  { id: 'interactions-ecosystems', name: 'Interactions & Ecosystems', num: 1, color: '#059669',
    summary: 'Biotic/abiotic, producers, consumers, food chains, energy flow',
    skills: [
      { name: 'Biotic vs abiotic', gen: genBioticAbiotic },
      { name: 'Producers vs consumers', gen: genProducerConsumer },
      { name: 'Food chain roles', gen: genFoodChainOrder },
      { name: 'Ecosystem vocabulary', gen: genEcosystemVocab },
      { name: 'Energy flow', gen: genEnergyFlow },
    ]},
  { id: 'plants-food-fibre', name: 'Plants for Food & Fibre', num: 2, color: '#16a34a',
    summary: 'Plant parts, needs, cells, photosynthesis, pollination',
    skills: [
      { name: 'Plant parts & functions', gen: genPlantParts },
      { name: 'Plant needs', gen: genPlantNeeds },
      { name: 'Cell basics', gen: genCellBasics },
      { name: 'Photosynthesis', gen: genPhotosynthesisBasics },
      { name: 'Pollination & seeds', gen: genPollinationSeed },
    ]},
  { id: 'heat-temperature', name: 'Heat & Temperature', num: 3, color: '#ea580c',
    summary: 'States of matter, particles, heat vs temp, energy, state changes',
    skills: [
      { name: 'States of matter', gen: genStatesOfMatter },
      { name: 'Particle model', gen: genParticleModel },
      { name: 'Heat vs temperature', gen: genHeatVsTemp },
      { name: 'Forms of energy', gen: genEnergyForms },
      { name: 'State changes', gen: genStateChanges },
    ]},
  { id: 'structures-forces', name: 'Structures & Forces', num: 4, color: '#7c3aed',
    summary: 'Forces, structure types, loads, internal forces, simple machines',
    skills: [
      { name: 'Force basics', gen: genForceBasics },
      { name: 'Structure types', gen: genStructureTypes },
      { name: 'Load types', gen: genLoadTypes },
      { name: 'Internal forces', gen: genInternalForces },
      { name: 'Simple machines', gen: genSimpleMachines },
    ]},
  { id: 'planet-earth', name: 'Planet Earth', num: 5, color: '#d97706',
    summary: 'Earth layers, rock types, weathering, minerals, rock cycle',
    skills: [
      { name: 'Earth layers', gen: genEarthLayers },
      { name: 'Rock types', gen: genRockTypes },
      { name: 'Weathering & erosion', gen: genWeatheringErosion },
      { name: 'Minerals', gen: genMinerals },
      { name: 'Rock cycle', gen: genRockCycle },
    ]},
];

window.PracticeBank = {
  plain: true, // questions are text, not HTML
  units: TOPICS.map(function (t) { return { id: t.id, name: t.name, num: t.num, skills: t.skills }; }),
};
})();
