
/* ===================== PAGE: pictures and tabs ===================== */
const M = MODEL;
const T_PARL = S.classTab({
  id: 'parl', code: '§1', name: 'Parliament', sec: 1, q: 'Which part of Parliament?', bank: M.PARL, cues: M.PARL_CUES,
  cats: [{ v: 'crown', label: 'The Crown', means: 'the Governor General' }, { v: 'house', label: 'House of Commons', means: 'elected MPs' },
    { v: 'senate', label: 'Senate', means: 'appointed; reviews bills' }]
});
const T_RG = S.classTab({
  id: 'rg', code: '§1', name: 'True?', sec: 1, q: 'True or false?', bank: M.RG, cues: M.RG_CUES,
  cats: [{ v: 't', label: 'True' }, { v: 'f', label: 'False' }]
});
const T_BILL = S.chainTab({ id: 'bill', code: '§2', name: 'Bill path', sec: 2, q: 'The missing step', steps: M.BILL });
const T_SHORT = S.classTab({
  id: 'short', code: '§2', name: 'Shortcut?', sec: 2, q: 'How is it made?', bank: M.SHORT, cues: M.SHORT_CUES,
  cats: [{ v: 'bill', label: 'A new bill', means: 'the full path through Parliament' }, { v: 'short', label: 'A shortcut', means: 'regulation or order under a law' }]
});
const T_FED = S.classTab({
  id: 'fed', code: '§3', name: 'Fed/prov', sec: 3, q: 'Federal or provincial?', bank: M.FED, cues: M.FED_CUES,
  cats: [{ v: 'fed', label: 'Federal', means: 'Ottawa, for all of Canada' }, { v: 'prov', label: 'Provincial', means: 'each province' }]
});
const T_COURT = S.classTab({
  id: 'court', code: '§4', name: 'Court', sec: 4, q: 'Which court?', bank: M.COURT, cues: M.COURT_CUES,
  cats: [{ v: 'low', label: 'Lower court', means: 'facts and first decision' }, { v: 'app', label: 'Appeal court', means: 'law applied correctly' },
    { v: 'sup', label: 'Supreme Court', means: 'final; the Constitution' }]
});
const T_WORDS = S.pickTab({ id: 'words', code: '§1–4', name: 'Words', sec: 1, q: 'Which word?', terms: M.TERMS, bank: M.WORDS });

const PAGE = {
  key: 'soc9-system-of-government-trainer-v1', course: 'Social Studies 9 · Canada’s System of Government', title: 'Government Trainer',
  notes: 'soc9-system-of-government-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_PARL, T_RG, T_BILL, T_SHORT, T_FED, T_COURT, T_WORDS]
};
DRILL.boot(PAGE);
