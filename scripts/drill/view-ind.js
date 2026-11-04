
/* ===================== PAGE: pictures and tabs ===================== */
const M = MODEL;
const T_BW = S.classTab({
  id: 'bw', code: '§1', name: 'Which act?', sec: 1, q: 'Which one?', bank: M.BW, cues: M.BW_CUES,
  cats: [{ v: 'bal', label: 'Balfour Declaration', means: '1926: says Britain and Dominions are equal' }, { v: 'wes', label: 'Statute of Westminster', means: '1931: makes it law' }]
});
const T_WHY = S.classTab({
  id: 'why', code: '§1', name: 'Why?', sec: 1, q: 'Which force?', bank: M.WHY, cues: M.WHY_CUES,
  cats: [{ v: 'war', label: 'War exhaustion', means: 'worn out after the First World War' }, { v: 'press', label: 'Dominion pressure', means: 'Dominions pushed for equal status' },
    { v: 'coop', label: 'Cooperation, not force', means: 'keep influence by working together' }]
});
const T_SOV = S.classTab({
  id: 'sov', code: '§1', name: 'Who decides?', sec: 1, q: 'Who decides?', bank: M.SOV, cues: M.SOV_CUES,
  cats: [{ v: 'col', label: 'Colony', means: 'Britain decides for it' }, { v: 'nat', label: 'Sovereign nation', means: 'Canada decides for itself' }]
});
const T_WON = S.classTab({
  id: 'won', code: '§2', name: 'Vote/office', sec: 2, q: 'What did it win?', bank: M.WON, cues: M.WON_CUES,
  cats: [{ v: 'vote', label: 'The vote', means: 'choose who governs' }, { v: 'office', label: 'Hold office', means: 'be elected or appointed' }]
});
const T_PC = S.classTab({
  id: 'persons', code: '§2', name: 'Persons', sec: 2, q: 'The Persons Case: true or false?', bank: M.PC, cues: M.PC_CUES,
  cats: [{ v: 't', label: 'True' }, { v: 'f', label: 'False' }]
});
const T_ORDER = S.orderTab({ id: 'order', code: '§1–2', name: 'First?', sec: 1, bank: M.ORDER });
const T_WORDS = S.pickTab({ id: 'words', code: '§1–2', name: 'Words', sec: 1, q: 'Which word?', terms: M.TERMS, bank: M.WORDS });

const PAGE = {
  key: 'soc9-independence-democratic-rights-trainer-v1', course: 'Social Studies 9 · Canada’s Independence and Democratic Rights', title: 'Independence Trainer',
  notes: 'soc9-independence-democratic-rights-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_BW, T_WHY, T_SOV, T_WON, T_PC, T_ORDER, T_WORDS]
};
DRILL.boot(PAGE);
