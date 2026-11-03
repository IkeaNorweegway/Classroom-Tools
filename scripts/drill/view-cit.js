/* ===================== PAGE: pictures and tabs ===================== */
const M = MODEL;
const T_STAT = S.classTab({
  id: 'stat', code: '§1', name: 'Status', sec: 1, q: 'Which status?', bank: M.STAT, cues: M.STAT_CUES,
  cats: [{ v: 'cit', label: 'Citizen', means: 'full status; votes' }, { v: 'pr', label: 'Permanent resident', means: 'stays for good; cannot vote' },
    { v: 'tr', label: 'Temporary resident', means: 'study, work or visitor permit' }, { v: 'ref', label: 'Refugee', means: 'fled danger' }]
});
const T_EXC = S.classTab({
  id: 'exc', code: '§2', name: 'Excluded', sec: 2, q: 'Shut out of the vote because of…', bank: M.EXC, cues: M.EXC_CUES,
  cats: [{ v: 'gen', label: 'Gender', means: 'women' }, { v: 'race', label: 'Race', means: 'Chinese, South Asian, Japanese' },
    { v: 'eth', label: 'Ethnic origin', means: 'First Nations' }, { v: 'age', label: 'Age', means: 'under 21' }]
});
const T_ORDER = S.orderTab({ id: 'order', code: '§2', name: 'First?', sec: 2, bank: M.ORDER });
const T_CH = S.classTab({
  id: 'charter', cols: 2, code: '§3', name: 'Which right?', sec: 3, q: 'Which group of Charter rights?', bank: M.CH, cues: M.CH_CUES,
  cats: [{ v: 'free', label: 'Freedoms', means: 'fundamental freedoms' }, { v: 'dem', label: 'Democratic', means: 'vote, run' },
    { v: 'mob', label: 'Mobility', means: 'move and work' }, { v: 'leg', label: 'Legal', means: 'trials, searches' }, { v: 'eq', label: 'Equality', means: 'fair treatment' }]
});
const T_CT = S.classTab({
  id: 'ctrue', code: '§3', name: 'True?', sec: 3, q: 'The Charter: true or false?', bank: M.CT, cues: M.CT_CUES,
  cats: [{ v: 't', label: 'True' }, { v: 'f', label: 'False' }]
});
const T_DUTY = S.classTab({
  id: 'duty', code: '§4', name: 'Responsibility', sec: 4, q: 'Which responsibility goes with it?', bank: M.DUTY, cues: M.DUTY_CUES,
  cats: [{ v: 'vote', label: 'Voting', means: 'in elections' }, { v: 'jury', label: 'Jury duty', means: 'serving on a jury' },
    { v: 'law', label: 'Obey the law', means: 'respect others\' rights' }, { v: 'help', label: 'Help others', means: 'community, environment, family' }]
});
const T_WORDS = S.pickTab({ id: 'words', code: '§1–3', name: 'Words', sec: 1, q: 'Which word?', terms: M.TERMS, bank: M.WORDS });

const PAGE = {
  key: 'soc9-evolving-citizenship-trainer-v1', course: 'Social Studies 9 · Evolving Citizenship and Rights', title: 'Citizenship Trainer',
  notes: 'soc9-evolving-citizenship-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_STAT, T_EXC, T_ORDER, T_CH, T_CT, T_DUTY, T_WORDS]
};
DRILL.boot(PAGE);
