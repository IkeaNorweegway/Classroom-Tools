
/* ===================== PAGE: pictures and tabs ===================== */
const M = MODEL;
const T_WAR = S.classTab({
  id: 'war', code: '§1', name: '1914/1939', sec: 1, q: '1914 or 1939?', bank: M.WAR, cues: M.WAR_CUES,
  cats: [{ v: '1914', label: '1914', means: 'at war when Britain was' }, { v: '1939', label: '1939', means: 'Canada\'s Parliament decided' }]
});
const T_ORDER = S.orderTab({ id: 'order', code: '§1–2', name: 'First?', sec: 2, bank: M.ORDER });
const T_WHO = S.classTab({
  id: 'who', code: '§3', name: 'Who?', sec: 3, q: 'Which group?', bank: M.WHO, cues: M.WHO_CUES,
  cats: [{ v: 'f136', label: 'Force 136', means: 'Chinese Canadians' }, { v: 'cree', label: 'Cree code talkers', means: 'First Nations and Métis' },
    { v: 'both', label: 'Both', means: 'served, denied rights at home' }]
});
const T_EVID = S.classTab({
  id: 'evid', code: '§1–3', name: 'Evidence', sec: 1, q: 'Evidence of…', bank: M.EVID, cues: M.EVID_CUES,
  cats: [{ v: 'ind', label: 'Independence', means: 'Canada decided for itself (§1)' }, { v: 'mil', label: 'Military role', means: 'battles, navy, air force (§2)' },
    { v: 'div', label: 'Diverse contributions', means: 'groups who served (§3)' }]
});
const T_WORDS = S.pickTab({ id: 'words', code: '§1–3', name: 'Words', sec: 3, q: 'Which word?', terms: M.TERMS, bank: M.WORDS });

const PAGE = {
  key: 'soc9-canada-in-wwii-trainer-v1', course: 'Social Studies 9 · Canada in the Second World War', title: 'Second World War Trainer',
  notes: 'soc9-canada-in-wwii-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_WAR, T_ORDER, T_WHO, T_EVID, T_WORDS]
};
DRILL.boot(PAGE);
