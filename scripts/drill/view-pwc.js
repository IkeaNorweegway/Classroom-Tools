
/* ===================== PAGE: pictures and tabs ===================== */
const M = MODEL;
const T_WHY = S.classTab({
  id: 'why', code: '§1', name: 'Why?', sec: 1, q: 'Which pressure?', bank: M.WHY, cues: M.WHY_CUES,
  cats: [{ v: 'dep', label: 'The Depression', means: 'hardship of the 1930s' }, { v: 'war', label: 'The war', means: 'raised hopes for government help' }]
});
const T_PROG = S.classTab({
  id: 'program', code: '§1', name: 'Program?', sec: 1, q: 'A social program?', bank: M.PROG, cues: M.PROG_CUES,
  cats: [{ v: 'yes', label: 'Social program', means: 'the welfare state: support for people' }, { v: 'no', label: 'Not a social program', means: 'defence, trade or industry' }]
});
const T_WORLD = S.classTab({
  id: 'world', code: '§2', name: 'World', sec: 2, q: 'Which one?', bank: M.WORLD, cues: M.WORLD_CUES,
  cats: [{ v: 'nato', label: 'NATO', means: 'alliance, 1949' }, { v: 'norad', label: 'NORAD', means: 'Canada–US air defence' },
    { v: 'korea', label: 'Korean War', means: 'Asia, 1950–53' }, { v: 'suez', label: 'Suez Crisis', means: '1956: Pearson, peacekeeping' }]
});
const T_PTS = S.classTab({
  id: 'points', code: '§3', name: 'Points', sec: 3, q: 'Judged by the 1967 points system?', bank: M.PTS, cues: M.PTS_CUES,
  cats: [{ v: 'yes', label: 'Counted', means: 'education, skills, language' }, { v: 'no', label: 'Not counted', means: 'race or country of origin' }]
});
const T_REG = S.classTab({
  id: 'region', code: '§4', name: 'Region', sec: 4, q: 'Which tension?', bank: M.REG, cues: M.REG_CUES,
  cats: [{ v: 'qc', label: 'Quebec', means: 'its status and future in Canada' }, { v: 'west', label: 'The West', means: 'resources and Western alienation' }]
});
const T_CON = S.classTab({
  id: 'con', code: '§5', name: '1982', sec: 5, q: 'Before or after 1982?', bank: M.CON, cues: M.CON_CUES,
  cats: [{ v: 'before', label: 'Before 1982', means: 'Britain\'s Parliament still involved' }, { v: 'after', label: 'After 1982', means: 'the Constitution Act' }]
});
const T_ORDER = S.orderTab({ id: 'order', code: '§1–5', name: 'First?', sec: 2, bank: M.ORDER });

const PAGE = {
  key: 'soc9-postwar-canada-trainer-v1', course: 'Social Studies 9 · Post-War Canada', title: 'Post-War Canada Trainer',
  notes: 'soc9-postwar-canada-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_WHY, T_PROG, T_WORLD, T_PTS, T_REG, T_CON, T_ORDER]
};
DRILL.boot(PAGE);
