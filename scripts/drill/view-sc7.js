/* ===================== PAGE: one tab per unit with scenarios, then Mixed (the kit is sws.js) ===================== */
const NOTES7 = {
  eco: 'sci7-interactions-ecosystems-notes-v1.html', pla: 'sci7-plants-food-fibre-notes-v1.html', hea: 'sci7-heat-temperature-notes-v1.html',
  str: 'sci7-structures-forces-notes-v1.html', ear: 'sci7-planet-earth-notes-v1.html'
};
const UNIT7 = { eco: ['7-1', 'Ecosystems'], pla: ['7-2', 'Plants'], hea: ['7-3', 'Heat'], str: ['7-4', 'Structures'], ear: ['7-5', 'Earth'] };
// Each part opens its own unit's notes at its own section.
const link7 = it => ({ notes: NOTES7[it.unit], sec: it.sec });
const units7 = Object.keys(UNIT7).filter(u => MODEL.UNITS[u]);
const PAGE = {
  key: 'sci7-word-problems-trainer-v3', course: 'Science 7 · Word problems', title: 'Word Problems',
  notes: NOTES7.eco, secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: units7.map(u => SWS.tab({ id: u, code: UNIT7[u][0], name: UNIT7[u][1], notes: NOTES7[u], start: rem => MODEL.start(u, rem), link: link7 }))
    .concat(units7.length > 1 ? [SWS.tab({ id: 'mix', code: 'All', name: 'Mixed', notes: NOTES7.eco, start: rem => MODEL.startMix(rem), link: link7 })] : [])
};
DRILL.boot(PAGE);
