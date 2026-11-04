/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const mk = (a, list) => list.map(([t, i, why]) => ({ t, i, a, why }));

  /* §1 1914 or 1939? */
  const WAR = mk('1914', [
    ['At war the moment Britain declared', '⚡'], ['No vote in Canada\'s Parliament on joining', '🚫'],
    ['Before the Statute of Westminster', '⏪'], ['Britain\'s declaration covered Canada too', '👑'],
    ['Britain still ran Canada\'s foreign policy', '🗣️']
  ]).concat(mk('1939', [
    ['Canada declared war a week after Britain', '📅'], ['Canada\'s Parliament debated first', '🏛️'],
    ['After the Statute of Westminster', '⏩'], ['Canada declared war on September 10', '🗓️'],
    ['A sign of Canada\'s sovereignty', '🍁']
  ]));
  const WAR_CUES = { '1914': 'Automatic, with Britain: 1914', '1939': 'Canada decided itself: 1939' };

  /* §1–2 timeline (y as a fraction of the year so September 3 and 10 sort) */
  const ORDER = [
    ['Statute of Westminster', '📜', 1931.9, '1931'], ['Britain declares war', '👑', 1939.672, 'Sept 3, 1939'],
    ['Canada declares war', '🍁', 1939.691, 'Sept 10, 1939'], ['Defence of Hong Kong', '🏯', 1941.95, '1941'],
    ['Dieppe Raid', '🌊', 1942.63, '1942'], ['Italian Campaign begins', '⛰️', 1943.53, '1943'],
    ['D-Day, Normandy', '🪖', 1944.43, '1944'], ['Liberation of the Netherlands', '🌷', 1945.3, '1944–45']
  ].map(([t, i, y, yl]) => ({ t, i, y, yl }));

  /* §3 Force 136, the Cree code talkers, or both */
  const WHO = mk('f136', [
    ['Chinese Canadians on secret missions in Asia', '🧭'], ['Worked behind enemy lines in Southeast Asia', '🌴'],
    ['A special operations unit', '🎯'], ['Their community won the federal vote in 1947', '🗳️']
  ]).concat(mk('cree', [
    ['Sent messages in the Cree language', '📻'], ['A code the enemy could not break', '🔐'],
    ['First Nations and Métis soldiers', '🪶'], ['Status First Nations waited until 1960 to vote', '🗳️']
  ])).concat(mk('both', [
    ['Served while denied full rights at home', '⚖️'], ['Their story is often left out', '📖'],
    ['Many could not vote when they enlisted', '🚫'], ['Showed loyalty to a country that excluded them', '🍁']
  ]));
  const WHO_CUES = { f136: 'Chinese Canadians: Force 136', cree: 'Cree language: code talkers', both: 'True of both groups' };

  /* §1–3 evidence for which part of the story */
  const EVID = mk('ind', [
    ['Canada\'s Parliament voted to go to war', '🏛️'], ['Canada declared war a week after Britain', '📅'],
    ['Canada used powers from the Statute of Westminster', '📜'], ['No one in London decided for Canada', '🍁']
  ]).concat(mk('mil', [
    ['More than one million Canadians served', '👥'], ['One of the world\'s largest navies by 1945', '⚓'],
    ['Canadians landed on D-Day', '🪖'], ['Ships escorted convoys across the Atlantic', '🚢'], ['Allies praised Canadian troops', '🎖️']
  ])).concat(mk('div', [
    ['Cree code talkers sent secret messages', '📻'], ['Chinese Canadians served in Force 136', '🧭'],
    ['Soldiers who could not vote at home still served', '🗳️'], ['First Nations and Métis soldiers enlisted', '🪶']
  ]));
  const EVID_CUES = { ind: 'Canada decided: independence', mil: 'Battles and forces: military role', div: 'Groups denied rights still served' };

  /* vocabulary */
  const TERMS = {
    sov: { label: 'Sovereignty', means: 'full power to decide for itself' }, all: { label: 'Allies', means: 'countries fighting on the same side' },
    con: { label: 'Convoy', means: 'ships sailing together, guarded' }, cam: { label: 'Campaign', means: 'a series of battles toward one goal' },
    ct: { label: 'Code talker', means: 'sent messages in an Indigenous language' }, f136: { label: 'Force 136', means: 'a special unit; Chinese Canadians served' }
  };
  const WORDS = mk('sov', [['Deciding for itself whether to go to war', '🍁'], ['No other country decides for it', '👑']])
    .concat(mk('all', [['Countries fighting on the same side', '🤝'], ['Canada, Britain and the United States together', '🌐']]))
    .concat(mk('con', [['Supply ships crossing the Atlantic with escorts', '🚢'], ['Navy ships guarding cargo ships', '⚓']]))
    .concat(mk('cam', [['A series of battles toward one goal', '🗺️'], ['The fighting in Italy, 1943–45', '⛰️']]))
    .concat(mk('ct', [['A soldier who sends messages in the Cree language', '📻'], ['Made a code from an Indigenous language', '🔐']]))
    .concat(mk('f136', [['Chinese Canadians on special missions in Asia', '🧭'], ['A secret unit behind enemy lines in Asia', '🌴']]));

  return { WAR, WAR_CUES, ORDER, WHO, WHO_CUES, EVID, EVID_CUES, TERMS, WORDS };
})();
/* ===================== MODEL END ===================== */
