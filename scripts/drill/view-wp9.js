/* ===================== PAGE: tabs (pictures and the step chain are in wp.js) ===================== */
const NOTES9 = {
  rn: { notes: '../notes/rational-numbers/math9-rational-numbers-notes-v1.html' },
  sr: { notes: '../notes/square-roots/math9-square-roots-notes-v1.html' },
  pe: { notes: '../notes/powers-exponents/math9-powers-notes-v1.html', sep: '·' }
};
// Each item opens the notes at its own section (RN2, SR3, PE5 ...).
const link9 = topic => it => Object.assign({ sec: +it.code.replace(/\D/g, '') }, NOTES9[it.topic || topic]);
const tab9 = (id, code, name) => WP.tab(Object.assign({ id, code, name, gen: n => MODEL.gen(id, n), link: link9(id) }, NOTES9[id]));
const PAGE = {
  key: 'math9-word-problems-trainer-v1', course: 'Math 9 · Word problems', title: 'Word Problems',
  notes: NOTES9.rn.notes,
  tabs: [
    tab9('rn', 'RN', 'Rational'), tab9('sr', 'SR', 'Roots'), tab9('pe', 'PE', 'Powers'),
    WP.tab({ id: 'mix', code: 'All', name: 'Mixed', gen: n => MODEL.genMix(n), link: link9('rn'), notes: NOTES9.rn.notes })
  ]
};
DRILL.boot(PAGE);
