/* ===================== PAGE: tabs (pictures and the reasoning chain are in sw.js) ===================== */
const NOTES7 = {
  eco: 'sci7-interactions-ecosystems-notes-v1.html', pla: 'sci7-plants-food-fibre-notes-v1.html', hea: 'sci7-heat-temperature-notes-v1.html',
  str: 'sci7-structures-forces-notes-v1.html', ear: 'sci7-planet-earth-notes-v1.html'
};
// Each item opens its own unit's notes at its own section.
const link7 = it => ({ notes: NOTES7[it.unit], sec: it.sec });
const tab7 = (id, code, name) => SW.readTab({ id, code, name, notes: NOTES7[id], gen: n => MODEL.gen(id, n), link: link7 });
const PAGE = {
  key: 'sci7-word-problems-trainer-v2', course: 'Science 7 · Word problems', title: 'Word Problems',
  notes: NOTES7.eco, secText: t => 'Section ' + t.sec + ':', sans: true,
  tabs: [
    tab7('eco', '7-1', 'Ecosystems'), tab7('pla', '7-2', 'Plants'), tab7('hea', '7-3', 'Heat'),
    tab7('str', '7-4', 'Structures'), tab7('ear', '7-5', 'Earth'),
    SW.readTab({ id: 'mix', code: 'All', name: 'Mixed', notes: NOTES7.eco, gen: n => MODEL.genMix(n), link: link7 })
  ]
};
DRILL.boot(PAGE);
