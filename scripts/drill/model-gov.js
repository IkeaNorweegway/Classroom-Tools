/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const mk = (a, list) => list.map(([t, i, why]) => ({ t, i, a, why }));

  /* §1 the three parts of Parliament */
  const PARL = mk('crown', [
    ['Gives royal assent to laws', '✍️'], ['The Governor General', '👑'], ['Represents the Monarch', '🤴'], ['Signs a bill into law', '🖋️']
  ]).concat(mk('house', [
    ['Elected Members of Parliament', '🗳️'], ['One member for each riding', '📍'], ['The government must keep its support', '🤝'],
    ['Where a confidence vote happens', '✋'], ['First debates and votes on most bills', '🗣️']
  ])).concat(mk('senate', [
    ['Appointed, not elected', '🎖️'], ['Reviews bills the House has passed', '🔍'], ['"Sober second thought"', '🧐'],
    ['Must approve a bill after the House', '✅']
  ]));
  const PARL_CUES = { crown: 'Governor General: the Crown', house: 'Elected MPs: House of Commons', senate: 'Appointed reviewers: the Senate' };

  /* §1 responsible government and ridings: true or false */
  const RG = mk('t', [
    ['The government must keep the House\'s support', '🤝'], ['Lose a confidence vote: resign or call an election', '🗳️'],
    ['The government answers to elected MPs', '👥'], ['Each riding elects one MP', '📍'], ['MPs act on behalf of citizens', '🙋']
  ]).concat(mk('f', [
    ['The government can ignore the House of Commons', '🙉'], ['The Senate can bring down the government', '🏛️'],
    ['The Governor General is elected', '👑'], ['A riding elects several MPs', '👨‍👩‍👧'], ['Senators are elected in ridings', '🎖️']
  ]));
  const RG_CUES = { t: 'True: check §1', f: 'False: check §1' };
  RG.find(x => /Senate can bring/.test(x.t)).cue = 'Only the House holds confidence';
  RG.find(x => /Senators are elected/.test(x.t)).cue = 'Senators are appointed';

  /* §2 the seven steps, in order (the notes table) */
  const BILL = [
    ['Bill drafting', '📝'], ['First reading (introduction)', '1️⃣'], ['Second reading (debate)', '🗣️'],
    ['Committee stage (detailed review)', '🔍'], ['Third reading (final approval)', '✅'], ['Approval by the Senate', '🏛️'],
    ['Royal assent by the Crown', '👑']
  ].map(([t, i]) => ({ t, i }));

  /* §2 a new bill, or a shortcut under a law that already exists */
  const SHORT = mk('bill', [
    ['A brand-new law creating a national holiday', '🎉'], ['Changing the Criminal Code', '⚖️'], ['Creating a new federal tax', '🧾'],
    ['A law on something no law covered before', '📜'], ['Changing who can become a citizen', '🍁']
  ]).concat(mk('short', [
    ['Cabinet sets the date a new law starts', '📅'], ['A minister approves a project under an existing act', '✔️'],
    ['New food-label details under the Food and Drugs Act', '🏷️'], ['An order in council naming a judge', '👩‍⚖️'],
    ['Updating fees under an existing law', '💲']
  ]));
  const SHORT_CUES = { bill: 'No law yet: a new bill', short: 'Under an existing law: shortcut' };

  /* §3 federal or provincial */
  const FED = mk('fed', [
    ['Defence', '🪖'], ['Banking and currency', '🏦'], ['Trade and commerce', '🚢'], ['Criminal law', '⚖️'], ['Citizenship', '🍁'],
    ['The navy and air force', '⚓'], ['Printing $20 bills', '💵'], ['The Criminal Code', '📕']
  ]).concat(mk('prov', [
    ['Education', '🏫'], ['Healthcare', '🏥'], ['Property and civil rights', '🏠'], ['Municipalities', '🏙️'], ['Natural resources', '🛢️'],
    ['Alberta\'s oil and gas royalties', '💰'], ['The Grade 9 curriculum', '📚'], ['Rules for city councils', '🏛️']
  ]));
  const FED_CUES = { fed: 'All of Canada: federal', prov: 'Each province decides: provincial' };

  /* §4 the three court levels */
  const COURT = mk('low', [
    ['Hears the case first', '1️⃣'], ['Finds the facts', '🔍'], ['Hears the witnesses', '🗣️'], ['Makes the first decision', '📄']
  ]).concat(mk('app', [
    ['Checks the law was applied correctly', '✔️'], ['Hears a case a lower court decided', '⬆️'], ['Keeps rulings consistent', '📏'],
    ['Reviews a trial for mistakes in the law', '🔎']
  ])).concat(mk('sup', [
    ['The final court: no higher appeal', '🏛️'], ['Checks laws follow the Constitution across Canada', '📜'],
    ['Nine judges in Ottawa', '👩‍⚖️'], ['Its decision binds every court in Canada', '🍁']
  ]));
  const COURT_CUES = { low: 'First hearing, the facts: lower', app: 'Checks the law used: appeal', sup: 'Final word: Supreme Court' };

  /* vocabulary */
  const TERMS = {
    rg: { label: 'Responsible government', means: 'the government needs the House\'s support' }, rid: { label: 'Riding', means: 'an area that elects one MP' },
    ra: { label: 'Royal assent', means: 'the Crown\'s final approval of a bill' }, fed: { label: 'Federalism', means: 'power split between federal and provincial' },
    roy: { label: 'Royalty', means: 'money paid to the province for resources' }, reg: { label: 'Regulation', means: 'a rule made under an existing law' },
    jud: { label: 'Judiciary', means: 'the courts' }
  };
  const WORDS = mk('rg', [['The government must keep the House\'s confidence', '🤝'], ['If the House says no, the government falls', '⬇️']])
    .concat(mk('rid', [['An area that elects one MP', '📍'], ['Also called a constituency', '🗺️']]))
    .concat(mk('ra', [['The last step before a bill becomes law', '👑'], ['The Governor General signs the bill', '✍️']]))
    .concat(mk('fed', [['Power divided between Ottawa and the provinces', '⚖️'], ['Why schools and the army have different governments', '🏫']]))
    .concat(mk('roy', [['Money an oil company pays Alberta', '💰'], ['A payment for taking a province\'s resources', '🛢️']]))
    .concat(mk('reg', [['A detailed rule made under a law', '📋'], ['Made without a brand-new bill', '⚡']]))
    .concat(mk('jud', [['The court system', '⚖️'], ['Interprets and applies the law', '👩‍⚖️']]));

  return { PARL, PARL_CUES, RG, RG_CUES, BILL, SHORT, SHORT_CUES, FED, FED_CUES, COURT, COURT_CUES, TERMS, WORDS };
})();
/* ===================== MODEL END ===================== */
