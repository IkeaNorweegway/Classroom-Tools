/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const mk = (a, list) => list.map(([t, i, why]) => ({ t, i, a, why }));

  /* §1 Balfour Declaration (1926) or Statute of Westminster (1931) */
  const BW = mk('bal', [
    ['Said Britain and the Dominions are equal in status', '🤝'], ['Said no Dominion is under another', '⚖️'],
    ['Came first, in 1926', '1️⃣'], ['A statement, not yet a law', '💬'], ['Agreed at a conference of leaders in London', '🗣️']
  ]).concat(mk('wes', [
    ['Made equal status legally binding', '🔏'], ['Passed in 1931', '2️⃣'], ['A law passed by the British Parliament', '📜'],
    ['Made Canada a fully sovereign nation in law', '🍁'], ['Britain can no longer make laws for Canada on its own', '🚫']
  ]));
  const BW_CUES = { bal: '1926 statement: Balfour', wes: '1931 law: Westminster' };

  /* §1 the three forces behind the change */
  const WHY = mk('war', [
    ['Britain was worn out by the First World War', '😩'], ['Britain owed huge war debts', '💸'],
    ['Four years of war drained the empire', '⚔️'], ['Britain could not afford another fight', '🪙']
  ]).concat(mk('press', [
    ['Canada\'s prime minister demanded equal status', '📣'], ['Dominion leaders pushed hard at conferences', '🗣️'],
    ['Dominions asked to sign their own treaties', '✍️'], ['South Africa and Ireland pressed for more freedom', '🌍']
  ])).concat(mk('coop', [
    ['Britain kept influence by working with the Dominions', '🤝'], ['Partners by choice, not by force', '🕊️'],
    ['Better to share power than lose the Dominions', '🔗'], ['Friendly ties kept trade and loyalty going', '📦']
  ]));
  const WHY_CUES = { war: 'Tired from war: war exhaustion', press: 'Dominions pushed: diplomatic pressure', coop: 'Working together, not force' };

  /* §1 colony or sovereign nation: who decides? Pairs on the same decision. */
  const SOV = mk('col', [
    ['Britain declares war, so Canada is at war', '⚔️'], ['Britain signs treaties for Canada', '✍️'],
    ['A British law can override Canada\'s', '📜'], ['Canada needs London\'s OK for a trade deal', '📦'],
    ['Britain chooses Canada\'s allies', '🤝'], ['Britain speaks for Canada abroad', '🗣️']
  ]).concat(mk('nat', [
    ['Canada\'s Parliament decides on war', '🏛️'], ['Canada signs its own treaties', '🖊️'],
    ['Only Canada makes Canada\'s laws', '🍁'], ['Canada makes its own trade deals', '🚢'],
    ['Canada picks its own allies', '🌐'], ['Canada sends its own ambassadors', '🧳']
  ]));
  const SOV_CUES = { col: 'Britain decides: a colony', nat: 'Canada decides: sovereign nation' };

  /* §2 the vote or the right to hold office */
  const WON = mk('vote', [
    ['Most women win the federal vote (1918)', '🗳️'], ['Alberta women win the provincial vote (1916)', '🗳️'],
    ['Quebec women win the provincial vote (1940)', '🗳️'], ['First Nations vote federally, keeping status (1960)', '🗳️'],
    ['Chinese Canadians win the federal vote (1947)', '🗳️']
  ]).concat(mk('office', [
    ['The Persons Case (1929)', '⚖️', null], ['Women can be named to the Senate', '🏛️'],
    ['Cairine Wilson becomes the first woman senator (1930)', '🏛️'], ['Agnes Macphail elected the first woman MP (1921)', '🏛️'],
    ['Louise McKinney elected to Alberta\'s legislature (1917)', '🏛️']
  ]));
  WON.find(x => /Persons Case/.test(x.t)).cue = 'Persons Case: office, not voting';
  const WON_CUES = { vote: 'Choosing who governs: the vote', office: 'Serving in government: office' };

  /* §2 Persons Case: true or false */
  const PC = mk('t', [
    ['Five Alberta women brought the case', '👩'], ['It said women are legal persons', '⚖️'], ['It opened the Senate to women', '🏛️'],
    ['It was decided in 1929', '📅'], ['It set a precedent for equality', '📏'], ['Emily Murphy was one of the Famous Five', '✍️']
  ]).concat(mk('f', [
    ['It gave women the right to vote', '🗳️'], ['It gave every woman equal rights at once', '👥'],
    ['Women could already sit in the Senate before it', '🪑'], ['It came before women could vote federally', '⏪'],
    ['It reached Indigenous women right away', '⏩'], ['It was about Canada\'s independence from Britain', '🍁']
  ]));
  const PC_CUES = { t: 'True: check §2', f: 'False: check §2' };
  PC.find(x => /right to vote/.test(x.t)).cue = 'False: it was about office';
  PC.find(x => /before women could vote/.test(x.t)).cue = 'False: the vote came first';

  /* §1–2 timeline */
  const ORDER = [
    ['First World War begins', '⚔️', 1914], ['Alberta women win the provincial vote', '🗳️', 1916],
    ['Most women win the federal vote', '🗳️', 1918], ['Balfour Declaration', '🤝', 1926], ['Persons Case', '⚖️', 1929],
    ['Statute of Westminster', '📜', 1931], ['Newfoundland joins Canada', '🗺️', 1949],
    ['First Nations vote federally, keeping status', '🗳️', 1960]
  ].map(([t, i, y]) => ({ t, i, y, yl: String(y) }));

  /* §1–2 vocabulary */
  const TERMS = {
    sov: { label: 'Sovereignty', means: 'full power to govern itself' }, dom: { label: 'Dominion', means: 'a self-governing country of the Empire' },
    fp: { label: 'Foreign policy', means: 'how a country deals with others' }, suf: { label: 'Suffrage', means: 'the right to vote' },
    lp: { label: 'Legal person', means: 'someone the law gives rights to' }, pre: { label: 'Precedent', means: 'a ruling later cases follow' }
  };
  const WORDS = mk('sov', [['Full power to govern itself', '👑'], ['No other country makes its laws', '🍁']])
    .concat(mk('dom', [['A self-governing country in the British Empire', '🌐'], ['Canada, Australia and New Zealand in 1931', '🗺️']]))
    .concat(mk('fp', [['Deciding who to trade with and ally with', '🤝'], ['Choosing whether to go to war', '⚔️']]))
    .concat(mk('suf', [['The right to vote', '🗳️'], ['Votes for women: the long campaign', '📣']]))
    .concat(mk('lp', [['Someone the law gives rights to', '⚖️'], ['What the Famous Five said women are', '👩']]))
    .concat(mk('pre', [['A decision that later cases follow', '📏'], ['A first ruling that others build on', '🧱']]));

  return { BW, BW_CUES, WHY, WHY_CUES, SOV, SOV_CUES, WON, WON_CUES, PC, PC_CUES, ORDER, TERMS, WORDS };
})();
/* ===================== MODEL END ===================== */
