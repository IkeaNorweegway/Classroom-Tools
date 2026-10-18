// Grade 8 Social Studies materials manifest. Files are flat in public/materials/.
import { getReady, homeSheets, type CourseManifest, type CourseUnit } from './manifest';

export function socialUnit(prefix: string, slug: string, label: string, sheets: [string, string][]): CourseUnit {
  return {
    slug,
    label,
    path: [
      { hint: 'Start here. You fill these in during class.', items: [{ label: 'Guided Notes', doc: `${prefix}-${slug}-notes-v1`, type: 'notes' }] },
      { hint: 'Practice and thinking questions from the whole unit.', items: [{ label: 'Workbook', doc: `${prefix}-${slug}-workbook-v1`, type: 'workbook' }] },
      { hint: 'Quick checks on the unit so far.', items: [{ label: 'Exit Tickets', doc: `${prefix}-${slug}-exits-v1`, badge: 'Formative', type: 'exit' }] },
    ],
    extras: [
      getReady(`${prefix}-${slug}-prereq-practice-v1`),
      { heading: 'Quizzes', items: [{ label: 'Mid-Unit Quiz', doc: `${prefix}-${slug}-quiz-v1`, type: 'assessment' }] },
    ],
    keys: [
      { label: 'Notes Answer Key', doc: `${prefix}-${slug}-notes-answers-v1` },
      { label: 'Workbook Answer Key', doc: `${prefix}-${slug}-workbook-answers-v1` },
    ],
    teacherGuide: `${prefix}-${slug}-teacherguide-v1`,
    home: homeSheets(prefix, slug, sheets),
  };
}

export const social8: CourseManifest = {
  course: 'social8',
  noun: 'unit',
  units: [
    socialUnit('soc8', 'ideologies', 'Foundations and Influences of Ideologies', [['spectrum', 'The political spectrum'], ['sources', 'Reading a primary source']]),
    socialUnit('soc8', 'economic-systems', 'Economic Systems', [['economies', 'Types of economies'], ['budgets', 'Surplus, deficit and debt']]),
    socialUnit('soc8', 'political-systems', 'Political Systems', [['parliament', 'How Parliament works'], ['compare', 'Canada and the U.S. compared']]),
    socialUnit('soc8', 'civic-engagement', 'Civic Engagement', [['taking-action', 'Ways to take action'], ['issue', 'Looking closely at an issue']]),
  ],
  studentHref: (slug) => `social8/materials/${slug}`,
  parentHref: (slug) => `social8/parents/${slug}`,
  teacherHref: (slug) => `social8/teacher#${slug}`,
  viewHref: (slug, doc) => `social8/view/${slug}/${doc}`,
};
