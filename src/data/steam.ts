// STEAM (Grades 5–9) materials manifest. Each "unit" is a grade; its numbered
// path is the grade's four projects. Files are flat in public/materials/.
import { homeSheets, type CourseManifest, type CourseUnit, type Doc } from './manifest';

const notes = (doc: string, label = 'Notes'): Doc => ({ label, doc, type: 'notes' });
const journal = (doc: string, label = 'Design Journal'): Doc => ({ label, doc, type: 'journal' });
const trainer = (doc: string, label: string): Doc => ({ label, doc, type: 'interactive' });

function grade(n: number, label: string, projects: [string, Doc[]][], sheets: [string, string][]): CourseUnit {
  return {
    slug: `grade-${n}`,
    label,
    path: projects.map(([title, items], i) => ({ title: `Unit ${i + 1} · ${title}`, items })),
    extras: [],
    keys: [],
    home: homeSheets('steam', `grade-${n}`, sheets),
  };
}

export const steam: CourseManifest = {
  course: 'steam',
  noun: 'grade',
  units: [
    grade(5, 'Grade 5', [
      ['Dash Bot: Algorithms & Sensors', [notes('steam5-dash-notes-v1'), journal('steam5-dash-workbook-v1'), trainer('steam5-dash-trainer-v1', 'Dash Trainer (build with blocks, drive the robot)')]],
      ['The Slow Coaster', [notes('steam5-coaster-notes-v1'), journal('steam5-coaster-workbook-v1')]],
      ['Water Filter', [notes('steam5-waterfilter-notes-v1'), journal('steam5-waterfilter-workbook-v1')]],
      ['Capstone: Scratch Story', [notes('steam5-scratch-notes-v1'), journal('steam5-scratch-workbook-v1')]],
    ], [['algorithms', 'Writing algorithms'], ['design-cycle', 'The design cycle']]),
    grade(6, 'Grade 6', [
      ['littleBits: Circuits, Algorithms & Sensors', [notes('steam6-littlebits-notes-v1'), journal('steam6-littlebits-workbook-v1'), trainer('steam6-littlebits-trainer-v1', 'littleBits Trainer (snap bits together, watch the signal)')]],
      ['3D-Printed Bag Tag & Digital Portfolio', [notes('steam6-bagtag-notes-v1'), journal('steam6-bagtag-workbook-v1')]],
      ['Bridges & Structures', [notes('steam6-bridges-notes-v1'), journal('steam6-bridges-workbook-v1')]],
      ['Capstone: Glider / Airplane Build', [notes('steam6-glider-notes-v1'), journal('steam6-glider-workbook-v1')]],
    ], [['circuits', 'Simple circuits'], ['bridges', 'Strong shapes in bridges']]),
    grade(7, 'Grade 7', [
      ['Spike Prime: Foundations & Computational Thinking', [notes('steam7-spikeprime-notes-v1'), journal('steam7-spikeprime-workbook-v1')]],
      ['micro:bit Thermodynamics Box', [notes('steam7-thermobox-notes-v1'), journal('steam7-thermobox-workbook-v1')]],
      ['Choose Your Own Adventure', [notes('steam7-cyoa-notes-v1'), journal('steam7-cyoa-workbook-v1')]],
      ['Capstone: CO2 Dragster', [notes('steam7-dragster-notes-v1'), journal('steam7-dragster-workbook-v1')]],
    ], [['conditionals', 'If-then thinking'], ['motion', 'Forces and motion']]),
    grade(8, 'Grade 8', [
      ['Rube Goldberg: Class Chain Reaction', [notes('steam8-rubegoldberg-notes-v1'), journal('steam8-rubegoldberg-workbook-v1')]],
      ['Platform Game (Scratch)', [notes('steam8-platformgame-notes-v1'), journal('steam8-platformgame-workbook-v1')]],
      ['Mechanical Advantage & Powered Motor', [notes('steam8-motor-notes-v1'), journal('steam8-motor-workbook-v1')]],
      ['Capstone: Spike Prime Challenge Maze', [notes('steam8-maze-notes-v1'), journal('steam8-maze-workbook-v1')]],
    ], [['simple-machines', 'Simple machines'], ['debugging', 'Debugging step by step']]),
    grade(9, 'Grade 9', [
      ['Programming Foundations (choose a language)', [
        { ...notes('steam9-java-notes-v1', 'Java — Notes'), badge: 'Java' },
        { ...journal('steam9-java-workbook-v1', 'Java — Design Journal'), badge: 'Java' },
        { ...notes('steam9-python-notes-v1', 'Python — Notes'), badge: 'Python' },
        { ...journal('steam9-python-workbook-v1', 'Python — Design Journal'), badge: 'Python' },
        trainer('steam9-python-trainer-v1', 'Python — Trainer (write and run code)'),
      ]],
      ['REV Robotics (Intro)', [
        { ...notes('steam9-rev-notes-v1', 'Notes (Java path)'), badge: 'Java path' },
        { ...journal('steam9-rev-workbook-v1', 'Design Journal (Java path)'), badge: 'Java path' },
        { ...notes('steam9-rev-notes-python-path-v1', 'Notes (Python path)'), badge: 'Python path' },
        { ...journal('steam9-rev-workbook-python-path-v1', 'Design Journal (Python path)'), badge: 'Python path' },
      ]],
      ['Electrified Miniatures', [notes('steam9-miniatures-notes-v1'), journal('steam9-miniatures-workbook-v1')]],
      ['Capstone: Trebuchet', [notes('steam9-trebuchet-notes-v1'), journal('steam9-trebuchet-workbook-v1')]],
    ], [['code-reading', 'Reading code'], ['levers', 'Levers and mechanical advantage']]),
  ],
  studentHref: (slug) => `steam/materials/${slug}`,
  parentHref: (slug) => `steam/parents/${slug}`,
  viewHref: (slug, doc) => `steam/view/${slug}/${doc}`,
};
