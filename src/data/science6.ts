// Grade 6 Science materials manifest. Student unit pages (units/[unit]),
// parent guides and the viewer read it. Files are flat in public/materials/.
import { homeSheets, type CourseManifest, type CourseUnit } from './manifest';

const ef = { badge: 'Easy Read' };
const fr = { badge: 'Français' };

// Teacher notes version per unit; every guide is v1 except climate, which is v2.
const teacherNotesVersion: Record<string, number> = { climate: 2 };

function unit(slug: string, label: string, notes: string, workbook: string, efWorkbook: string, sheets: [string, string][]): CourseUnit {
  return {
    slug,
    label,
    teacherGuide: `sci6-${slug}-teachernotes-v${teacherNotesVersion[slug] ?? 1}`,
    path: [
      { hint: 'Start here. You fill these in during class.', items: [{ label: 'Guided Notes', doc: notes, type: 'notes' }] },
      { hint: 'Practice that mixes up everything in the unit.', items: [{ label: 'Workbook', doc: workbook, type: 'workbook' }] },
      { hint: 'Quick checks on the unit so far.', items: [{ label: 'Exit Tickets', doc: `sci6-${slug}-exits-v1`, badge: 'Formative', type: 'exit' }] },
    ],
    extras: [
      { heading: 'Quizzes', items: [{ label: 'Mid-Unit Quiz', doc: `sci6-${slug}-quiz-v1`, type: 'assessment' }] },
      {
        heading: 'Other versions',
        items: [
          { label: 'Easy Read Notes', doc: notes.replace(/-notes-(gr6-)?v1$/, (_m, g) => `-notes-ef-${g ?? ''}v1`), type: 'notes', ...ef },
          { label: 'Easy Read Workbook', doc: efWorkbook, type: 'workbook', ...ef },
          { label: 'Notes guidées (français)', doc: `sci6-${slug}-notes-fr-v1`, type: 'notes', ...fr },
          { label: 'Cahier d’exercices (français)', doc: `sci6-${slug}-workbook-fr-v1`, type: 'workbook', ...fr },
        ],
      },
    ],
    keys: [
      { label: 'Notes Answer Key', doc: `sci6-${slug}-notes-answers-v1` },
      { label: 'Workbook Answer Key', doc: `sci6-${slug}-workbook-answers-v1` },
      { label: 'Easy Read Workbook Answer Key', doc: `sci6-${slug}-workbook-ef-answers-v1` },
    ],
    home: homeSheets('sci6', slug, sheets),
  };
}

const units: CourseUnit[] = [
  unit('matter', 'Matter', 'sci6-matter-notes-v1', 'sci6-matter-workbook-v1', 'sci6-matter-workbook-ef-v1',
    [['particles', 'Particles and states of matter'], ['phase-changes', 'Phase changes']]),
  unit('forces', 'Forces', 'sci6-forces-notes-v1', 'sci6-forces-workbook-v1', 'sci6-forces-workbook-ef-v1',
    [['force-diagrams', 'Drawing force diagrams'], ['action-reaction', 'Action and reaction pairs']]),
  unit('living-systems', 'Living Systems', 'sci6-living-systems-notes-gr6-v1', 'sci6-living-systems-workbook-gr6-v1', 'sci6-living-systems-workbook-ef-v1',
    [['food-webs', 'Reading food webs'], ['biotic-abiotic', 'Living and non-living factors']]),
  unit('climate', 'Climate', 'sci6-climate-notes-v1', 'sci6-climate-workbook-v1', 'sci6-climate-workbook-ef-v1',
    [['weather-climate', 'Weather or climate?'], ['greenhouse', 'The greenhouse effect']]),
  unit('energy-resources', 'Energy Resources', 'sci6-energy-resources-notes-v1', 'sci6-energy-resources-workbook-v1', 'sci6-energy-resources-workbook-ef-v1',
    [['renewable', 'Renewable or non-renewable?'], ['choosing', 'Choosing an energy source']]),
  unit('space', 'Space', 'sci6-space-notes-v1', 'sci6-space-workbook-v1', 'sci6-space-workbook-ef-v1',
    [['solar-system', 'Objects in the solar system'], ['orbits', 'Orbits and satellites']]),
  {
    slug: 'year-review',
    label: 'Year Review',
    path: [
      { hint: 'All six units in one package. Start here.', items: [{ label: 'Year Notes', doc: 'sci6-year-notes-v1', type: 'notes' }] },
      { hint: 'Mixed practice from the whole year.', items: [{ label: 'Year Review Workbook', doc: 'sci6-year-review-workbook-gr6-v1', type: 'workbook' }] },
    ],
    extras: [
      {
        heading: 'Other versions',
        items: [
          { label: 'Easy Read Year Notes', doc: 'sci6-year-notes-ef-v1', type: 'notes', ...ef },
          { label: 'Easy Read Year Review Workbook', doc: 'sci6-year-review-workbook-ef-v1', type: 'workbook', ...ef },
          { label: 'Notes annuelles (français)', doc: 'sci6-year-notes-fr-v1', type: 'notes', ...fr },
          { label: 'Cahier de révision annuelle (français)', doc: 'sci6-year-review-workbook-fr-v1', type: 'workbook', ...fr },
        ],
      },
    ],
    keys: [
      { label: 'Year Review Workbook Answer Key', doc: 'sci6-year-review-workbook-answers-v1' },
      { label: 'Easy Read Workbook Answer Key', doc: 'sci6-year-review-workbook-ef-answers-v1' },
    ],
    home: [],
  },
];

// Matter has the first lesson page built.
units[0].extras.unshift({ heading: 'Lessons', items: [{ label: 'Lesson 1', doc: '', href: 'units/matter/lesson-01', type: 'notes' }] });

export const science6: CourseManifest = {
  course: 'science',
  noun: 'unit',
  units,
  studentHref: (slug) => `units/${slug}`,
  parentHref: (slug) => `science6/parents/${slug}`,
  teacherHref: (slug) => (slug === 'year-review' ? 'teacher' : `teacher/${slug}`),
  viewHref: (slug, doc) => `materials/view/${slug}/${doc}`,
};
