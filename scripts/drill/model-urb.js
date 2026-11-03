/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const mk = (a, list) => list.map(([t, i, why]) => ({ t, i, a, why }));

  /* §1 push or pull. Paired on the same need (jobs, safety, family, land, faith, home). */
  const PUSH = mk('push', [
    ['No jobs in their home town', '📉'], ['War destroyed their village', '💥'], ['Their family was killed in the war', '🕯️'],
    ['No farmland left to work', '🏚️'], ['Jailed for their religion', '⛓️'], ['Living in a refugee camp', '⛺'],
    ['Not enough food after the war', '🍞'], ['A new government arrests critics', '🚨'], ['Their home was taken from them', '🔒'],
    ['Cannot safely return home', '🚧']
  ]).concat(mk('pull', [
    ['Factory jobs in Canadian cities', '🏭'], ['Peace and safety in Canada', '🕊️'], ['Family already living in Canada', '👪'],
    ['Farmland for sale on the Prairies', '🌾'], ['Freedom to worship in Canada', '🛐'], ['Canada agrees to take refugees', '🚪'],
    ['Good schools for their children', '🏫'], ['Oil jobs in Alberta', '🛢️'], ['New houses going up in the suburbs', '🏘️'],
    ['Higher wages in Canada', '💵']
  ]));
  const PUSH_CUES = { push: 'A reason to leave: push', pull: 'A reason to come: pull' };

  /* §1 displaced person: lost their home in the war and could not safely go back. */
  const DP = mk('yes', [
    ['A Holocaust survivor in a camp in Germany, 1947', '🕯️'], ['A family whose town was destroyed; they cannot go back', '🏚️'],
    ['A refugee who fled the war and has no home to return to', '⛺'], ['A war orphan with no home left', '🧒'],
    ['A family whose new government at home would jail them', '⛓️'], ['A survivor whose whole community was destroyed', '💔']
  ]).concat(mk('no', [
    ['A British engineer moving for a better job', '👷'], ['A Dutch farmer who chose to buy land in Alberta', '🚜'],
    ['A soldier coming home to Calgary', '🎖️'], ['A family moving from a farm to Edmonton', '🏙️'],
    ['A student who will go home after school', '🎓'], ['A tourist visiting Pier 21', '📷']
  ]));
  const DP_CUES = { yes: 'Lost home, cannot go back', no: 'They could safely go home' };

  /* §2 the four industries in the notes */
  const IND = mk('infra', [
    ['New sewer lines for a suburb', '🚧'], ['Paving roads to new neighbourhoods', '🛣️'], ['Building schools for new families', '🏫'],
    ['Water mains for new houses', '🚰'], ['A bridge to the new suburbs', '🌉'], ['Street lights on new streets', '💡']
  ]).concat(mk('oil', [
    ['Drilling a well near Leduc', '🛢️'], ['Refining crude oil into gasoline', '⛽'], ['Exploring for natural gas', '🔍'],
    ['A pipeline carrying oil to the coast', '🔧'], ['Gas to heat new homes', '🔥']
  ])).concat(mk('hydro', [
    ['Damming a river', '🌊'], ['A generating station at a dam', '⚡'], ['Electricity from falling water', '💧'],
    ['A new reservoir behind a dam', '🏞️']
  ])).concat(mk('manuf', [
    ['A car assembly plant', '🚗'], ['A paper mill', '📰'], ['Building trucks for a car-driving city', '🚚'],
    ['Making newsprint for city papers', '🗞️'], ['Turning logs into pulp', '🌲']
  ]));
  const IND_CUES = { infra: 'Roads, sewers, schools: infrastructure', oil: 'Drilling, refining: oil and gas', hydro: 'Power from a dammed river', manuf: 'A factory: cars and paper' };

  /* §2 the oil–city loop: each side fed the other */
  const LOOP = mk('city', [
    ['Furnace gas for new suburbs', '🔥'], ['Gasoline for more cars', '⛽'], ['Jobs for newcomers to Edmonton', '💼'],
    ['Asphalt for city roads', '🛣️'], ['Fuel for city factories', '🏭'], ['Royalties that pay for new schools', '🏫']
  ]).concat(mk('oil', [
    ['Workers for the refineries', '👷'], ['Engineers to plan new wells', '📐'], ['Office staff for Calgary oil companies', '🏢'],
    ['Welders to build pipelines', '🔧'], ['Truck drivers for the oil fields', '🚚'], ['Homes for oil workers\' families', '🏘️']
  ]));
  const LOOP_CUES = { city: 'The city is getting something', oil: 'The industry needs people' };

  /* §3 the four environmental impacts. Same-object pairs: highway, wetland. */
  const IMP = mk('poll', [
    ['Smog from car exhaust', '🌫️'], ['Factory waste in the river', '🏭'], ['Smoke from a refinery', '💨'],
    ['Oil seeping into a creek', '🛢️'], ['Sewage flowing into a lake', '🚱']
  ]).concat(mk('cons', [
    ['Farmland paved for a suburb', '🏘️'], ['A wetland filled in for a mall', '🏬'], ['Forest cleared for a factory', '🪓'],
    ['A field becomes a parking lot', '🅿️']
  ])).concat(mk('div', [
    ['A highway splits a forest into two pieces', '🛣️'], ['Prairie cut up into building lots', '📐'],
    ['A big natural area broken into small parcels', '🧩'], ['Fences divide a meadow into yards', '🏡']
  ])).concat(mk('route', [
    ['Elk can no longer cross the highway', '🦌'], ['Frogs can\'t reach their pond past the road', '🐸'],
    ['Ducks lose the wetland stop on their route', '🦆'], ['Coyotes forced around a new suburb', '🐺']
  ]));
  const IMP_CUES = { poll: 'Dirty air or water: pollution', cons: 'Land used up: consumption', div: 'Land cut into pieces: division', route: 'Animals\' paths are blocked' };

  /* §3 population, economy or environment */
  const AREA = mk('pop', [
    ['More people live in cities than on farms', '🏙️'], ['Newcomers make cities more diverse', '🌍'], ['Young families move to the suburbs', '👪'],
    ['Small rural towns shrink', '🏚️'], ['Edmonton\'s population quadruples', '📈']
  ]).concat(mk('econ', [
    ['New jobs in factories and offices', '💼'], ['Oil and gas royalties grow', '💰'], ['Builders sell more houses', '🏗️'],
    ['New stores open in malls', '🛍️'], ['Wages rise', '💵']
  ])).concat(mk('env', [
    ['Smog over the city', '🌫️'], ['Farmland lost to suburbs', '🌾'], ['Wildlife routes cut by roads', '🦌'],
    ['Rivers polluted by factories', '🏭'], ['Wetlands drained for building', '💧']
  ]));
  const AREA_CUES = { pop: 'Who lives where: population', econ: 'Jobs and money: economy', env: 'Land, air, water: environment' };

  return { PUSH, PUSH_CUES, DP, DP_CUES, IND, IND_CUES, LOOP, LOOP_CUES, IMP, IMP_CUES, AREA, AREA_CUES };
})();
/* ===================== MODEL END ===================== */
