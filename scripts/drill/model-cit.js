/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const mk = (a, list) => list.map(([t, i, why]) => ({ t, i, a, why }));

  /* §1 the four statuses */
  const STAT = mk('cit', [
    ['Born in Canada', '🍼'], ['Can vote and hold a Canadian passport', '🛂'], ['Became a citizen through naturalization', '📜'], ['Full legal status as a Canadian', '🍁']
  ]).concat(mk('pr', [
    ['Lives in Canada for good, but cannot vote', '🏠'], ['Has most rights, with some restrictions', '⚖️'], ['Can apply for citizenship later', '📝'], ['Not a citizen, but may stay for good', '📇']
  ])).concat(mk('tr', [
    ['Has a study permit', '🎓'], ['Has a work permit', '💼'], ['Has a visitor permit', '🧳'], ['Here for a set time only', '⏳']
  ])).concat(mk('ref', [
    ['Fled danger in another country', '🏃'], ['Seeking protection and safety', '🛡️'], ['Cannot safely go home', '🚪'], ['Needs safety, not just a visit', '🕊️']
  ]));
  const STAT_CUES = { cit: 'Full status: citizen', pr: 'Stays for good, no vote: resident', tr: 'A permit with an end date', ref: 'Fled danger: refugee' };
  STAT.find(x => /Not a citizen, but/.test(x.t)).cue = 'Not a citizen: permanent resident';


  /* §2 what each group was excluded because of (the notes' vote timeline) */
  const EXC = mk('gen', [
    ['Women, before 1918', '👩'], ['Mothers and daughters, before they won the federal vote', '👪'], ['Women who wanted a say in government', '📣']
  ]).concat(mk('race', [
    ['Chinese Canadians, before 1947', '🏮'], ['South Asian Canadians, before 1947', '🧑'], ['Japanese Canadians, before 1948', '🌸'],
    ['A group shut out of the vote because of race', '🚫']
  ])).concat(mk('eth', [
    ['First Nations people, before 1960', '🪶'], ['Voting only by giving up status', '📉'], ['First Nations without a vote federally', '🗳️']
  ])).concat(mk('age', [
    ['Canadians aged 18 to 20, before 1970', '🎂'], ['Young adults under 21', '🧒'], ['Voting age was 21', '2️⃣']
  ]));
  const EXC_CUES = { gen: 'Notes: women, gender', race: 'Notes: Chinese, South Asian, Japanese: race', eth: 'Notes: First Nations: ethnic origin', age: 'Age: the vote at 18' };
  EXC.find(x => /giving up status/.test(x.t)).cue = 'Giving up status: ethnic origin';

  /* §2 milestones by year */
  const ORDER = [
    ['Women win the federal vote', '🗳️', 1918], ['Canadian Citizenship Act', '🍁', 1947], ['Canadian Bill of Rights', '📜', 1960],
    ['Royal Commission on Bilingualism and Biculturalism', '🗣️', 1963], ['Royal Commission on the Status of Women', '👩', 1967],
    ['Official Languages Act', '🇨🇦', 1969], ['Voting age lowered from 21 to 18', '🎂', 1970], ['Multiculturalism Policy', '🌍', 1971],
    ['Constitution Act and the Charter', '⚖️', 1982], ['Meech Lake Accord', '🤝', 1987]
  ].map(([t, i, y]) => ({ t, i, y, yl: String(y) }));

  /* §3 which group of Charter rights */
  const CH = mk('free', [
    ['Freedom of religion', '🕍'], ['Freedom of expression', '🗣️'], ['Peaceful assembly', '✊'], ['Freedom of association', '🤝']
  ]).concat(mk('dem', [
    ['Vote in an election', '🗳️'], ['Run for office', '🏛️'], ['Choose who governs', '🙋']
  ])).concat(mk('mob', [
    ['Live in any province', '🏠'], ['Work in any province', '💼'], ['Enter and leave Canada', '✈️']
  ])).concat(mk('leg', [
    ['A fair trial', '⚖️'], ['Protection from unfair searches', '🔍'], ['Innocent until proven guilty', '🕊️']
  ])).concat(mk('eq', [
    ['Treated equally under the law', '🧑‍⚖️'], ['No unfair treatment because of gender', '👩'], ['No unfair treatment because of age', '🎂']
  ]));
  const CH_CUES = { free: 'Fundamental freedoms', dem: 'Voting and office: democratic', mob: 'Moving around: mobility', leg: 'Courts and police: legal', eq: 'Fair treatment: equality' };

  /* §3 the Charter: true or false */
  const CT = mk('t', [
    ['Section 1 allows reasonable limits on rights', '📏'], ['Banning hate speech can be a reasonable limit', '🚫'],
    ['The Constitution Act (1982) entrenched the Charter', '📜'], ['Canada took control of its constitution step by step', '🍁'],
    ['A legislature can use the notwithstanding clause', '✋'], ['The clause lasts five years at a time', '5️⃣'],
    ['The Charter protects Indigenous peoples\' rights', '🪶'], ['The Charter protects individual and collective rights', '👥']
  ]).concat(mk('f', [
    ['Charter rights can never be limited', '🔒'], ['The notwithstanding clause covers every section', '🌐'],
    ['The notwithstanding clause lasts forever', '♾️'], ['The Charter came in 1960', '⏪'],
    ['Censoring hate speech breaks the Charter', '🙊'], ['The Charter protects only individual rights', '🧍'],
    ['The Charter has just one kind of right', '1️⃣'], ['Canada\'s constitution was brought home all at once in 1982', '🇬🇧']
  ]));
  const CT_CUES = { t: 'True: check §3', f: 'False: check §3' };
  CT.find(x => /never be limited/.test(x.t)).cue = 'Section 1: reasonable limits';
  CT.find(x => /covers every section/.test(x.t)).cue = 'Some sections only';
  CT.find(x => /lasts forever/.test(x.t)).cue = 'Five years at a time';
  CT.find(x => /came in 1960/.test(x.t)).cue = '1960 was the Bill of Rights';
  CT.find(x => /all at once/.test(x.t)).cue = 'Gradual patriation, ending in 1982';

  /* §4 which responsibility goes with it */
  const DUTY = mk('vote', [
    ['Democratic rights', '🗳️'], ['Choosing who governs us', '🏛️'], ['Every ballot helps decide', '📮']
  ]).concat(mk('jury', [
    ['The legal right to a fair trial', '⚖️'], ['Being judged by other citizens', '👥'], ['A jury of twelve citizens', '🪑']
  ])).concat(mk('law', [
    ['Freedoms protected by law', '📜'], ['Rights last only if the rules are followed', '🚦'], ['Respecting the rights of others', '🤝']
  ])).concat(mk('help', [
    ['Volunteering at a food bank', '🥫'], ['Protecting Canadian identity and the environment', '🌲'], ['Taking responsibility for your family', '👪']
  ]));
  const DUTY_CUES = { vote: 'Voting in elections', jury: 'Serving on a jury', law: 'Obeying the law', help: 'Helping the community' };
  DUTY.find(x => /Respecting the rights/.test(x.t)).cue = 'Obeying the law';
  DUTY.find(x => /your family/.test(x.t)).cue = 'Taking care of yourself and family';

  /* vocabulary */
  const TERMS = {
    nat: { label: 'Naturalization', means: 'becoming a citizen by the legal process' }, ref: { label: 'Refugee', means: 'someone who fled danger and seeks protection' },
    adv: { label: 'Advocacy', means: 'speaking up to change laws' }, pat: { label: 'Patriation', means: 'bringing the constitution home to Canada' },
    nwc: { label: 'Notwithstanding clause', means: 'lets a legislature override some sections' }, plu: { label: 'Pluralism', means: 'many cultures living together' }
  };
  const WORDS = mk('nat', [['Becoming a citizen through the legal process', '📜'], ['Not a citizen at birth, a citizen by application', '📝']])
    .concat(mk('ref', [['Someone who fled danger and needs safety', '🏃'], ['Seeking protection in Canada', '🛡️']]))
    .concat(mk('adv', [['Speaking up to change a law', '📣'], ['What the Famous Five did for the vote', '👩']]))
    .concat(mk('pat', [['Bringing the constitution home from Britain', '🏠'], ['Canada gaining control of its own constitution', '🍁']]))
    .concat(mk('nwc', [['Lets a legislature override some Charter sections', '✋'], ['Lasts five years at a time', '5️⃣']]))
    .concat(mk('plu', [['Many cultures living together in one country', '🌍'], ['A reason immigration laws were widened', '👥']]));

  return { STAT, STAT_CUES, EXC, EXC_CUES, ORDER, CH, CH_CUES, CT, CT_CUES, DUTY, DUTY_CUES, TERMS, WORDS };
})();
/* ===================== MODEL END ===================== */
