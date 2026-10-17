// CEFL 7–9 (Career Education and Financial Literacy) materials manifest.
// Grade 7 is built. Each unit is a project: a mini-workbook of short lessons used
// inside the project, the project brief, an answer key and a teacher guide.
// Files live in public/materials/cefl/ (not flat), so the viewer reads from there.
import type { CourseManifest, CourseUnit } from './manifest';

function ceflUnit(grade: number, slug: string, label: string, project: string): CourseUnit {
  const p = `cefl${grade}-${slug}`;
  return {
    slug,
    label,
    path: [
      { hint: 'Short lessons with practice. Your teacher opens one each class, just before you need it.', items: [{ label: 'Mini-Workbook', doc: `${p}-workbook-v1`, type: 'workbook' }] },
      { hint: 'Your project, step by step. One step each class.', items: [{ label: `Project: ${project}`, doc: `${p}-project-v1`, type: 'project' }] },
    ],
    extras: [],
    keys: [{ label: 'Workbook Answer Key', doc: `${p}-workbook-answers-v1` }],
    teacherGuide: `${p}-teacherguide-v1`,
    home: [],
  };
}

export const cefl: CourseManifest = {
  course: 'cefl',
  noun: 'unit',
  units: [
    ceflUnit(7, 'labour-market', 'Careers and the Labour Market', 'Career Pathway Map'),
    ceflUnit(7, 'post-secondary', 'Post-Secondary Pathways', 'Two Roads'),
    ceflUnit(7, 'experiences', 'Experiences and Employment', 'Experience Plan'),
    ceflUnit(7, 'income-tax', 'Income and Tax', 'First Paycheque'),
    ceflUnit(7, 'money-management', 'Money, Interest, and Credit', 'Saving for Something Real'),
  ],
  studentHref: (slug) => `cefl/materials/${slug}`,
  parentHref: () => 'cefl/parents',
  teacherHref: (slug) => `cefl/teacher#${slug}`,
  viewHref: (slug, doc) => `cefl/view/${slug}/${doc}`,
};
