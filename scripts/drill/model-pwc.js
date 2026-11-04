/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const mk = (a, list) => list.map(([t, i, why]) => ({ t, i, a, why }));

  /* §1 the two pressures behind the welfare state */
  const WHY = mk('dep', [
    ['Millions out of work in the 1930s', '📉'], ['Families lost farms and savings', '🏚️'], ['Seniors left with no income', '👵'],
    ['Lines for relief and soup kitchens', '🥣'], ['Wages and prices collapsed', '💸']
  ]).concat(mk('war', [
    ['Soldiers came home expecting a fair deal', '🎖️'], ['Government ran the economy for the war, so it could help', '🏭'],
    ['Everyone sacrificed, so everyone should share', '🤝'], ['Wartime jobs for all raised hopes', '💼'],
    ['Veterans got help with school and land', '🎓']
  ]));
  const WHY_CUES = { dep: 'Hardship of the 1930s: Depression', war: 'Wartime raised hopes: the war' };

  /* §1 a social program or not */
  const PROG = mk('yes', [
    ['Medicare (universal healthcare)', '🏥'], ['Old-age pensions', '👴'], ['Unemployment insurance', '📄'],
    ['Family allowance cheques', '👪'], ['Hospital insurance', '🩺'], ['Canada Pension Plan', '💰']
  ]).concat(mk('no', [
    ['NATO', '🛡️'], ['The Auto Pact', '🚗'], ['A new oil pipeline', '🛢️'], ['NORAD', '📡'], ['A hydro dam', '⚡'],
    ['Peacekeeping in Suez', '🕊️']
  ]));
  const PROG_CUES = { yes: 'Support for people: social program', no: 'Not support for people' };

  /* §2 Canada on the world stage */
  const WORLD = mk('nato', [
    ['Founded in 1949', '📅'], ['Alliance with Western Europe and the US', '🛡️'], ['Collective defence against the Soviet Union', '🤝'],
    ['An attack on one is an attack on all', '⚔️']
  ]).concat(mk('norad', [
    ['Joint Canada–US air defence', '✈️'], ['Guards North American skies', '📡'], ['Began in 1957–58', '🗓️'], ['Radar watching for bombers', '🛰️']
  ])).concat(mk('korea', [
    ['Battle of Kapyong', '⛰️'], ['Hill 355', '🏔️'], ['Fighting in Asia, 1950–53', '🌏'], ['Canadians fought under the UN flag', '🌐']
  ])).concat(mk('suez', [
    ['Egypt took over the canal', '🚢'], ['Pearson proposed UN peacekeepers', '🕊️'], ['Nobel Peace Prize, 1957', '🏅'],
    ['Britain, France and Israel invaded', '⚔️'], ['The first UN peacekeeping force', '🔵']
  ]));
  const WORLD_CUES = { nato: 'Alliance of 1949: NATO', norad: 'Canada–US air defence: NORAD', korea: 'War in Asia: Korea', suez: 'Pearson and peacekeeping: Suez' };

  /* §3 the 1967 points system */
  const PTS = mk('yes', [
    ['Education', '🎓'], ['Job skills', '🛠️'], ['Speaks English or French', '🗣️'], ['Years of schooling', '📚'],
    ['A trade or profession', '👩‍🔧'], ['Training for a job in demand', '📋']
  ]).concat(mk('no', [
    ['Race', '🚫'], ['Country of origin', '🌍'], ['Skin colour', '✋'], ['Coming from Europe', '🗺️'],
    ['Ethnic background', '👥'], ['Religion', '🛐']
  ]));
  const PTS_CUES = { yes: 'Skills, schooling, language: counted', no: 'Race and origin: not counted' };

  /* §4 Quebec or the West */
  const REG = mk('qc', [
    ['The October Crisis, 1970', '🚨'], ['The debate over Quebec separatism', '⚜️'], ['Meech Lake Accord tried to settle its status', '📜'],
    ['A vote on Quebec sovereignty, 1980', '🗳️'], ['Recognition as a distinct society', '🏰']
  ]).concat(mk('west', [
    ['The National Energy Program', '🛢️'], ['Western alienation', '🌾'], ['Feeling ignored by Ottawa over oil', '📞'],
    ['Alberta and Saskatchewan feel underrepresented', '🏔️'], ['Fights over who controls energy resources', '⚡']
  ]));
  const REG_CUES = { qc: 'Quebec\'s place in Canada', west: 'Oil, Ottawa and the West' };

  /* §5 before or after the Constitution Act (1982) */
  const CON = mk('before', [
    ['Changes needed a vote in London', '🏛️'], ['The British Parliament had the last word', '👑'],
    ['No Charter in the constitution', '📄'], ['Canada had to ask Britain to amend it', '✉️'], ['The constitution was a British law', '📕']
  ]).concat(mk('after', [
    ['Canada changes its constitution at home', '🍁'], ['The Charter is part of the constitution', '📜'],
    ['Canada uses its own amending formula', '🔧'], ['Courts can strike down laws that break the Charter', '⚖️'], ['No permission from London needed', '✅']
  ]));
  const CON_CUES = { before: 'London still had a say', after: 'Canada controls it: after 1982' };

  /* §1–5 timeline */
  const ORDER = [
    ['Unemployment insurance', '📄', 1940], ['Family allowance', '👪', 1944], ['Canada helps found NATO', '🛡️', 1949],
    ['Korean War begins', '🌏', 1950], ['Suez Crisis', '🚢', 1956], ['NORAD', '📡', 1957.5], ['Medicare', '🏥', 1966],
    ['Points system for immigration', '📋', 1967], ['October Crisis', '🚨', 1970], ['National Energy Program', '🛢️', 1980],
    ['Constitution Act and the Charter', '📜', 1982], ['Meech Lake Accord', '🤝', 1987]
  ].map(([t, i, y]) => ({ t, i, y, yl: y === 1957.5 ? '1957–58' : String(y) }));

  return { WHY, WHY_CUES, PROG, PROG_CUES, WORLD, WORLD_CUES, PTS, PTS_CUES, REG, REG_CUES, CON, CON_CUES, ORDER };
})();
/* ===================== MODEL END ===================== */
