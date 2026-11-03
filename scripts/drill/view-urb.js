
/* ===================== PAGE: pictures and tabs ===================== */
const M = MODEL;
const T_PUSH = S.classTab({
  id: 'push', code: '§1', name: 'Push/pull', sec: 1, q: 'Push or pull factor?', bank: M.PUSH, cues: M.PUSH_CUES,
  cats: [{ v: 'push', label: 'Push', means: 'a reason to leave home' }, { v: 'pull', label: 'Pull', means: 'a reason to come to Canada' }]
});
const T_DP = S.classTab({
  id: 'dp', code: '§1', name: 'DP?', sec: 1, q: 'A displaced person?', bank: M.DP, cues: M.DP_CUES,
  cats: [{ v: 'yes', label: 'Displaced person', means: 'lost home in the war, cannot safely go back' }, { v: 'no', label: 'Not displaced', means: 'could go home: another kind of move' }]
});
const T_IND = S.classTab({
  id: 'industry', code: '§2', name: 'Industry', sec: 2, q: 'Which industry?', bank: M.IND, cues: M.IND_CUES,
  cats: [{ v: 'infra', label: 'Infrastructure', means: 'roads, sewers, schools, utilities' }, { v: 'oil', label: 'Oil and gas', means: 'the petroleum industry' },
    { v: 'hydro', label: 'Hydro', means: 'electricity from dammed rivers' }, { v: 'manuf', label: 'Cars and paper', means: 'factories making goods' }]
});
const T_LOOP = S.classTab({
  id: 'loop', code: '§2', name: 'Loop', sec: 2, q: 'Which way round the loop?', bank: M.LOOP, cues: M.LOOP_CUES,
  cats: [{ v: 'city', label: 'Cities need oil and gas', means: 'energy, jobs, materials' },
    { v: 'oil', label: 'Oil and gas needs cities', means: 'a growing workforce' }]
});
const T_IMP = S.classTab({
  id: 'impact', code: '§3', name: 'Impact', sec: 3, q: 'Which environmental impact?', bank: M.IMP, cues: M.IMP_CUES,
  cats: [{ v: 'poll', label: 'Pollution', means: 'dirty air or water' }, { v: 'cons', label: 'Land consumption', means: 'land turned into city' },
    { v: 'div', label: 'Land division', means: 'land broken into pieces' }, { v: 'route', label: 'Wildlife route cut', means: 'animals can\'t travel' }]
});
const T_AREA = S.classTab({
  id: 'area', code: '§3', name: 'Area', sec: 3, q: 'Population, economy or environment?', bank: M.AREA, cues: M.AREA_CUES,
  cats: [{ v: 'pop', label: 'Population', means: 'who lives where' }, { v: 'econ', label: 'Economy', means: 'jobs, money, business' },
    { v: 'env', label: 'Environment', means: 'land, air, water, wildlife' }]
});

const PAGE = {
  key: 'soc9-urbanization-industry-trainer-v1', course: 'Social Studies 9 · Urbanization and the Growth of Industry', title: 'Urbanization Trainer',
  notes: 'soc9-urbanization-industry-notes-v1.html', secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [T_PUSH, T_DP, T_IND, T_LOOP, T_IMP, T_AREA]
};
DRILL.boot(PAGE);
