// STEAM (Grades 5–9) materials manifest. Each grade has four projects (units).
// `steam` is grade-level: one entry per grade, its path the four projects, read
// by the parent guides and the viewer. `steamUnits` is project-level: one entry
// per unit, read by the grade and unit pages. Files are flat in public/materials/.
import { homeSheets, type CourseManifest, type CourseUnit, type Doc } from './manifest';

const notes = (doc: string, label = 'Notes'): Doc => ({ label, doc, type: 'notes' });
const journal = (doc: string, label = 'Design Journal'): Doc => ({ label, doc, type: 'journal' });
const trainer = (doc: string, label: string): Doc => ({ label, doc, type: 'interactive' });

type Project = [slug: string, title: string, items: Doc[]];

export const steamGrades = [5, 6, 7, 8, 9] as const;

const projects: Record<number, Project[]> = {
  5: [
    ['dash-bot', 'Dash Bot: Algorithms & Sensors', [notes('steam5-dash-notes-v1'), journal('steam5-dash-workbook-v1'), trainer('steam5-dash-trainer-v1', 'Dash Trainer (build with blocks, drive the robot)')]],
    ['slow-coaster', 'The Slow Coaster', [notes('steam5-coaster-notes-v1'), journal('steam5-coaster-workbook-v1')]],
    ['water-filter', 'Water Filter', [notes('steam5-waterfilter-notes-v1'), journal('steam5-waterfilter-workbook-v1')]],
    ['scratch-story', 'Capstone: Scratch Story', [notes('steam5-scratch-notes-v1'), journal('steam5-scratch-workbook-v1')]],
  ],
  6: [
    ['littlebits', 'littleBits: Circuits, Algorithms & Sensors', [notes('steam6-littlebits-notes-v1'), journal('steam6-littlebits-workbook-v1'), trainer('steam6-littlebits-trainer-v1', 'littleBits Trainer (snap bits together, watch the signal)')]],
    ['bag-tag', '3D-Printed Bag Tag & Digital Portfolio', [notes('steam6-bagtag-notes-v1'), journal('steam6-bagtag-workbook-v1')]],
    ['bridges', 'Bridges & Structures', [notes('steam6-bridges-notes-v1'), journal('steam6-bridges-workbook-v1')]],
    ['glider', 'Capstone: Glider / Airplane Build', [notes('steam6-glider-notes-v1'), journal('steam6-glider-workbook-v1')]],
  ],
  7: [
    ['spike-prime', 'Spike Prime: Foundations & Computational Thinking', [notes('steam7-spikeprime-notes-v1'), journal('steam7-spikeprime-workbook-v1')]],
    ['thermo-box', 'micro:bit Thermodynamics Box', [notes('steam7-thermobox-notes-v1'), journal('steam7-thermobox-workbook-v1')]],
    ['adventure', 'Choose Your Own Adventure', [notes('steam7-cyoa-notes-v1'), journal('steam7-cyoa-workbook-v1')]],
    ['co2-dragster', 'Capstone: CO2 Dragster', [notes('steam7-dragster-notes-v1'), journal('steam7-dragster-workbook-v1')]],
  ],
  8: [
    ['rube-goldberg', 'Rube Goldberg: Class Chain Reaction', [notes('steam8-rubegoldberg-notes-v1'), journal('steam8-rubegoldberg-workbook-v1')]],
    ['platform-game', 'Platform Game (Scratch)', [notes('steam8-platformgame-notes-v1'), journal('steam8-platformgame-workbook-v1')]],
    ['motor', 'Mechanical Advantage & Powered Motor', [notes('steam8-motor-notes-v1'), journal('steam8-motor-workbook-v1')]],
    ['challenge-maze', 'Capstone: Spike Prime Challenge Maze', [notes('steam8-maze-notes-v1'), journal('steam8-maze-workbook-v1')]],
  ],
  9: [
    ['programming', 'Programming Foundations (choose a language)', [
      { ...notes('steam9-java-notes-v1', 'Java — Notes'), badge: 'Java' },
      { ...journal('steam9-java-workbook-v1', 'Java — Design Journal'), badge: 'Java' },
      { ...notes('steam9-python-notes-v1', 'Python — Notes'), badge: 'Python' },
      { ...journal('steam9-python-workbook-v1', 'Python — Design Journal'), badge: 'Python' },
      trainer('steam9-python-trainer-v1', 'Python — Trainer (write and run code)'),
    ]],
    ['rev-robotics', 'REV Robotics (Intro)', [
      { ...notes('steam9-rev-notes-v1', 'Notes (Java path)'), badge: 'Java path' },
      { ...journal('steam9-rev-workbook-v1', 'Design Journal (Java path)'), badge: 'Java path' },
      { ...notes('steam9-rev-notes-python-path-v1', 'Notes (Python path)'), badge: 'Python path' },
      { ...journal('steam9-rev-workbook-python-path-v1', 'Design Journal (Python path)'), badge: 'Python path' },
    ]],
    ['miniatures', 'Electrified Miniatures', [notes('steam9-miniatures-notes-v1'), journal('steam9-miniatures-workbook-v1')]],
    ['trebuchet', 'Capstone: Trebuchet', [notes('steam9-trebuchet-notes-v1'), journal('steam9-trebuchet-workbook-v1')]],
  ],
};

const homeSheetNames: Record<number, [string, string][]> = {
  5: [['algorithms', 'Writing algorithms'], ['design-cycle', 'The design cycle']],
  6: [['circuits', 'Simple circuits'], ['bridges', 'Strong shapes in bridges']],
  7: [['conditionals', 'If-then thinking'], ['motion', 'Forces and motion']],
  8: [['simple-machines', 'Simple machines'], ['debugging', 'Debugging step by step']],
  9: [['code-reading', 'Reading code'], ['levers', 'Levers and mechanical advantage']],
};

const twoLanguages = 'Pick one language, Java or Python, and use its version.';

function gradeUnit(g: number): CourseUnit {
  return {
    slug: `grade-${g}`,
    label: `Grade ${g}`,
    path: projects[g].map(([, title, items], i) => ({ title: `Unit ${i + 1} · ${title}`, items })),
    extras: [],
    keys: [],
    home: homeSheets('steam', `grade-${g}`, homeSheetNames[g]),
  };
}

// One project as a unit page: Notes first, then the Design Journal; trainers sit below.
function projectUnit(g: number, [slug, title, items]: Project): CourseUnit {
  const of = (type: Doc['type']) => items.filter((d) => d.type === type);
  const choose = of('notes').length > 1;
  const practice = of('interactive');
  return {
    slug: `${g}-${slug}`,
    label: title,
    path: [
      { hint: choose ? twoLanguages : 'Start here. The big ideas and new words for this project.', items: of('notes') },
      { hint: choose ? 'Use the journal that matches your notes.' : 'Your project log: plan, sketch, build, test and reflect.', items: of('journal') },
    ],
    extras: practice.length ? [{ heading: 'Practice', items: practice }] : [],
    keys: [],
    home: [],
  };
}

export const steam: CourseManifest = {
  course: 'steam',
  noun: 'grade',
  units: steamGrades.map(gradeUnit),
  studentHref: (slug) => `steam/materials/${slug}`,
  parentHref: (slug) => `steam/parents/${slug}`,
  viewHref: (slug, doc) => `steam/view/${slug}/${doc}`,
};

/** "5-dash-bot" → { grade: 5, unit: "dash-bot" } */
export const splitSteamSlug = (slug: string) => {
  const [g, ...rest] = slug.split('-');
  return { grade: Number(g), unit: rest.join('-') };
};

export const steamUnits: CourseManifest = {
  course: 'steam',
  noun: 'unit',
  units: steamGrades.flatMap((g) => projects[g].map((p) => projectUnit(g, p))),
  studentHref: (slug) => {
    const { grade, unit } = splitSteamSlug(slug);
    return `steam/materials/grade-${grade}/${unit}`;
  },
  parentHref: (slug) => `steam/parents/grade-${splitSteamSlug(slug).grade}`,
  viewHref: (slug, doc) => `steam/view/grade-${splitSteamSlug(slug).grade}/${doc}`,
};

export const steamUnitsInGrade = (g: number) => steamUnits.units.filter((u) => splitSteamSlug(u.slug).grade === g);
