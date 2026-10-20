// CEFL 7–9 (Career Education and Financial Literacy) materials manifest.
// Each grade has the same five units; each unit is a project: a mini-workbook of short
// lessons used inside the project, the project brief, an answer key and a teacher guide.
// Unit slugs carry the grade ("7-income-tax") so they are unique across the course.
// Files live in public/materials/cefl/ (not flat), so the viewer reads from there.
import type { CourseManifest, CourseUnit } from './manifest';

export const ceflUnitSlugs = ['labour-market', 'post-secondary', 'experiences', 'income-tax', 'money-management'] as const;

const labels: Record<string, string> = {
  'labour-market': 'Careers and the Labour Market',
  'post-secondary': 'Post-Secondary Pathways',
  experiences: 'Experiences and Employment',
  'income-tax': 'Income and Tax',
  'money-management': 'Money, Interest, and Credit',
};

const projects: Record<number, Record<string, string>> = {
  7: { 'labour-market': 'Career Pathway Map', 'post-secondary': 'Two Roads', experiences: 'Experience Plan', 'income-tax': 'First Paycheque', 'money-management': 'Saving for Something Real' },
  8: { 'labour-market': 'Future-Proof Me', 'post-secondary': 'My High School Map', experiences: 'Open Doors', 'income-tax': 'Job Offer Showdown', 'money-management': 'Grow It' },
  9: { 'labour-market': 'Get Hired', 'post-secondary': 'Pathway Pitch', experiences: 'Pitch It', 'income-tax': 'Tax Clinic', 'money-management': 'Debt Detective' },
};

export const ceflGrades = [7, 8, 9] as const;

// CEFL Town missions: one shared town game, one mission per unit, one chapter after each project step
// (_games-context.md → CEFL Town). Keyed by unit slug; doc is the mission's thin entry page.
const games: Record<string, { label: string; doc: string }> = {
  '7-labour-market': { label: 'CEFL Town: Career Day (one chapter after each step)', doc: 'cefl7-labour-market-game-v1' },
  '7-post-secondary': { label: 'CEFL Town: Two Roads (one chapter after each step)', doc: 'cefl7-post-secondary-game-v1' },
  '7-experiences': { label: 'CEFL Town: The Garden Crew (one chapter after each step)', doc: 'cefl7-experiences-game-v1' },
  '7-income-tax': { label: 'CEFL Town: Payday (one chapter after each step)', doc: 'cefl7-income-tax-game-v2' },
  '7-money-management': { label: 'CEFL Town: Saving Up (one chapter after each step)', doc: 'cefl7-money-management-game-v1' },
  '8-labour-market': { label: 'CEFL Town: Future-Proof (one chapter after each step)', doc: 'cefl8-labour-market-game-v1' },
  '8-post-secondary': { label: 'CEFL Town: The Course Map (one chapter after each step)', doc: 'cefl8-post-secondary-game-v1' },
  '8-experiences': { label: 'CEFL Town: Open Doors (one chapter after each step)', doc: 'cefl8-experiences-game-v1' },
  '8-income-tax': { label: 'CEFL Town: Job Offer Showdown (one chapter after each step)', doc: 'cefl8-income-tax-game-v1' },
  '8-money-management': { label: 'CEFL Town: Grow It (one chapter after each step)', doc: 'cefl8-money-management-game-v1' },
  '9-labour-market': { label: 'CEFL Town: Get Hired (one chapter after each step)', doc: 'cefl9-labour-market-game-v1' },
  '9-post-secondary': { label: 'CEFL Town: Pathway Pitch (one chapter after each step)', doc: 'cefl9-post-secondary-game-v1' },
  '9-experiences': { label: 'CEFL Town: Pitch It (one chapter after each step)', doc: 'cefl9-experiences-game-v1' },
  '9-income-tax': { label: 'CEFL Town: Tax Clinic (one chapter after each step)', doc: 'cefl9-income-tax-game-v1' },
  '9-money-management': { label: 'CEFL Town: Debt Detective (one chapter after each step)', doc: 'cefl9-money-management-game-v1' },
};

function ceflUnit(grade: number, unit: string): CourseUnit {
  const p = `cefl${grade}-${unit}`;
  return {
    slug: `${grade}-${unit}`,
    label: labels[unit],
    path: [
      { hint: 'Short lessons with practice. Your teacher opens one each class, just before you need it.', items: [{ label: 'Mini-Workbook', doc: `${p}-workbook-v1`, type: 'workbook' }] },
      { hint: 'Your project, step by step. One step each class.', items: [{ label: `Project: ${projects[grade][unit]}`, doc: `${p}-project-v1`, type: 'project' }] },
    ],
    extras: games[`${grade}-${unit}`]
      ? [{ heading: 'Game', items: [{ ...games[`${grade}-${unit}`], badge: 'Game', type: 'interactive' }] }]
      : [],
    keys: [{ label: 'Workbook Answer Key', doc: `${p}-workbook-answers-v1` }],
    teacherGuide: `${p}-teacherguide-v1`,
    home: [],
  };
}

/** "7-income-tax" → { grade: 7, unit: "income-tax" } */
export const splitSlug = (slug: string) => {
  const [g, ...rest] = slug.split('-');
  return { grade: Number(g), unit: rest.join('-') };
};

export const ceflProject = (slug: string) => {
  const { grade, unit } = splitSlug(slug);
  return projects[grade]?.[unit] ?? '';
};

export const cefl: CourseManifest = {
  course: 'cefl',
  noun: 'unit',
  units: ceflGrades.flatMap((g) => ceflUnitSlugs.map((u) => ceflUnit(g, u))),
  studentHref: (slug) => {
    const { grade, unit } = splitSlug(slug);
    return `cefl/grade-${grade}/${unit}`;
  },
  parentHref: () => 'cefl/parents',
  teacherHref: (slug) => `cefl/teacher#${slug}`,
  viewHref: (slug, doc) => `cefl/view/${slug}/${doc}`,
};

export const unitsInGrade = (grade: number) => cefl.units.filter((u) => splitSlug(u.slug).grade === grade);
