// Single source of truth for the courses: nav tabs, subnavs, home page
// tiles, titles and footers all read from here. Accent colours live in
// src/styles/global.css under [data-course="<key>"].

import { strands as math9Strands, topicsInStrand, type StrandSlug } from './math9';

export type CourseKey = 'science' | 'math9' | 'science7' | 'social9' | 'social8' | 'steam' | 'cefl';

/** Who a page is written for. Each course has a student path and may add a
 *  teacher and a parent path; the nav switch offers only the ones that exist. */
export type Audience = 'student' | 'parent' | 'teacher';

export const audiences: { key: Audience; label: string }[] = [
  { key: 'student', label: 'Student' },
  { key: 'parent', label: 'Parent' },
  { key: 'teacher', label: 'Teacher' },
];

export interface SubnavItem {
  label: string;
  /** Path below BASE_URL, without a leading slash. */
  path: string;
  /** Returns true when this item is the current page. */
  match: (path: string) => boolean;
}

export interface Course {
  key: CourseKey;
  tab: string;
  name: string;
  grade: string;
  numeral: string;
  path: string;
  teacherPath?: string;
  parentPath?: string;
  blurb: string;
  facts: string[];
  subnav: SubnavItem[];
  /** Subnav shown on the course's parent pages; falls back to `subnav`. */
  parentSubnav?: SubnavItem[];
}

const endsWith = (suffix: string) => (p: string) => p.endsWith(suffix) || p.endsWith(`${suffix}/`);
const includes = (part: string) => (p: string) => p.includes(part);

// True on any Math 9 topic page in the strand, below the given route prefix.
const inTopicOf = (strand: StrandSlug, prefix: string) => (p: string) =>
  topicsInStrand(strand).some((t) => new RegExp(`/${prefix}${t.slug}/?$`).test(p));

const unitItems = (prefix: string, units: [string, string][]): SubnavItem[] =>
  units.map(([slug, label]) => ({ label, path: `${prefix}${slug}`, match: includes(slug) }));

// Parent subnav: the course's parent overview, then one tab per unit guide.
const parentItems = (prefix: string, units: [string, string][]): SubnavItem[] => [
  { label: 'Overview', path: prefix, match: endsWith(`/${prefix}`) },
  ...units.map(([slug, label]) => ({ label, path: `${prefix}/${slug}`, match: includes(`/${prefix}/${slug}`) })),
];

// Unit slugs and short tab labels, shared by the student and parent subnavs.
const sci6Units: [string, string][] = [
  ['matter', 'Matter'],
  ['forces', 'Forces'],
  ['living-systems', 'Living Systems'],
  ['climate', 'Climate'],
  ['energy-resources', 'Energy Resources'],
  ['space', 'Space'],
];
const sci7Units: [string, string][] = [
  ['interactions-ecosystems', 'Ecosystems'],
  ['plants-food-fibre', 'Plants'],
  ['heat-temperature', 'Heat'],
  ['structures-forces', 'Structures'],
  ['planet-earth', 'Planet Earth'],
];
const soc9Units: [string, string][] = [
  ['urbanization-industry', 'Urbanization'],
  ['independence-democratic-rights', 'Independence'],
  ['canada-in-wwii', 'WWII'],
  ['postwar-canada', 'Post-War'],
  ['modern-economy', 'Economy'],
  ['system-of-government', 'Government'],
  ['evolving-citizenship', 'Citizenship'],
];
const soc8Units: [string, string][] = [
  ['ideologies', 'Ideologies'],
  ['economic-systems', 'Economy'],
  ['political-systems', 'Politics'],
  ['civic-engagement', 'Citizenship'],
];
const ceflUnits: [string, string][] = [
  ['labour-market', 'Careers'],
  ['post-secondary', 'After High School'],
  ['experiences', 'Experiences'],
  ['income-tax', 'Pay & Tax'],
  ['money-management', 'Money'],
];
const steamGrades: [string, string][] = [
  ['grade-5', 'Gr. 5'],
  ['grade-6', 'Gr. 6'],
  ['grade-7', 'Gr. 7'],
  ['grade-8', 'Gr. 8'],
  ['grade-9', 'Gr. 9'],
];

export const courses: Course[] = [
  {
    key: 'science',
    tab: 'Gr. 6 Science',
    name: 'Science',
    grade: 'Grade 6',
    numeral: '6',
    path: 'materials',
    teacherPath: 'teacher',
    parentPath: 'science6/parents',
    blurb: 'Six units with guided notes, workbooks, and easy-read and French versions.',
    facts: ['6 units', '~28 weeks', 'EN · EF · FR'],
    subnav: [
      ...unitItems('units/', sci6Units),
      {
        label: 'All materials',
        path: 'materials',
        match: (p) => p.includes('/materials') && !p.includes('/materials/fr') && !p.includes('/units/'),
      },
      { label: 'Français', path: 'materials/fr', match: includes('/materials/fr') },
    ],
    parentSubnav: parentItems('science6/parents', sci6Units),
  },
  {
    key: 'math9',
    tab: 'Math 9',
    name: 'Mathematics',
    grade: 'Grade 9',
    numeral: '9',
    path: 'math9',
    teacherPath: 'math9/teacher',
    parentPath: 'math9/parents',
    blurb: 'Four strands and eleven topics. Notes, concept pages, worksheets and exit tickets.',
    facts: ['4 strands', '11 topics', '98 materials'],
    subnav: [
      // A strand tab is current on its strand page and on its topic pages.
      ...math9Strands.map((s) => ({
        label: s.short,
        path: `math9/materials/${s.slug}`,
        match: (p: string) => p.includes(`/materials/${s.slug}`) || inTopicOf(s.slug, 'math9/')(p),
      })),
      { label: 'Practice', path: 'math9/practice', match: includes('practice') },
      { label: 'PAT Prep', path: 'math9/pat-prep', match: includes('pat-prep') },
      { label: 'POTD', path: 'math9/potd', match: includes('potd') },
      { label: 'All materials', path: 'math9/materials', match: endsWith('/math9/materials') },
    ],
    parentSubnav: [
      { label: 'Overview', path: 'math9/parents', match: endsWith('/math9/parents') },
      ...math9Strands.map((s) => ({
        label: s.short,
        path: `math9/parents#${s.slug}`,
        match: inTopicOf(s.slug, 'math9/parents/'),
      })),
    ],
  },
  {
    key: 'science7',
    tab: 'Gr. 7 Science',
    name: 'Science',
    grade: 'Grade 7',
    numeral: '7',
    path: 'science7',
    teacherPath: 'science7/teacher',
    parentPath: 'science7/parents',
    blurb: 'Five units with notes, workbooks, quizzes, tests and answer keys.',
    facts: ['5 units', '~26 weeks', '40 materials'],
    subnav: [
      ...unitItems('science7/materials/', sci7Units),
      { label: 'Practice', path: 'science7/practice', match: includes('practice') },
      { label: 'All units', path: 'science7', match: endsWith('/science7') },
    ],
    parentSubnav: parentItems('science7/parents', sci7Units),
  },
  {
    key: 'social9',
    tab: 'Social 9',
    name: 'Social Studies',
    grade: 'Grade 9',
    numeral: '9',
    path: 'social9',
    teacherPath: 'social9/teacher',
    parentPath: 'social9/parents',
    blurb: 'Seven units across Time and Place, Systems, and Citizenship.',
    facts: ['7 units', '3 organizing ideas', '35 materials'],
    subnav: [
      ...unitItems('social9/materials/', soc9Units),
      { label: 'All units', path: 'social9', match: endsWith('/social9') },
    ],
    parentSubnav: parentItems('social9/parents', soc9Units),
  },
  {
    key: 'social8',
    tab: 'Social 8',
    name: 'Social Studies',
    grade: 'Grade 8',
    numeral: '8',
    path: 'social8',
    teacherPath: 'social8/teacher',
    parentPath: 'social8/parents',
    blurb: 'Four units across Time and Place, Systems, and Citizenship.',
    facts: ['4 units', '3 organizing ideas', '20 materials'],
    subnav: [
      ...unitItems('social8/materials/', soc8Units),
      { label: 'All units', path: 'social8', match: endsWith('/social8') },
    ],
    parentSubnav: parentItems('social8/parents', soc8Units),
  },
  {
    key: 'steam',
    tab: 'STEAM',
    name: 'STEAM',
    grade: 'Grades 5–9',
    numeral: '5–9',
    path: 'steam',
    parentPath: 'steam/parents',
    blurb: 'Robotics, circuits, design cycles and capstone builds, with notes and design journals for every grade.',
    facts: ['5 grades', '22 projects', '44 materials'],
    subnav: [
      ...unitItems('steam/materials/', steamGrades),
      { label: 'All grades', path: 'steam', match: endsWith('/steam') },
    ],
    parentSubnav: parentItems('steam/parents', steamGrades),
  },
  {
    key: 'cefl',
    tab: 'CEFL 7',
    name: 'Career & Financial Literacy',
    grade: 'Grade 7',
    numeral: '7',
    path: 'cefl',
    teacherPath: 'cefl/teacher',
    parentPath: 'cefl/parents',
    blurb: 'Five project-based units on careers, school after Grade 12, experiences, pay and money. Short lessons inside every project.',
    facts: ['5 units', '5 projects', '15 materials'],
    subnav: [
      ...unitItems('cefl/materials/', ceflUnits),
      { label: 'All units', path: 'cefl', match: endsWith('/cefl') },
    ],
    parentSubnav: [{ label: 'Overview', path: 'cefl/parents', match: endsWith('/cefl/parents') }],
  },
];

export const courseByKey = (key?: CourseKey) => courses.find((c) => c.key === key);

/** A course's landing path for an audience, or undefined when it has none. */
export const audiencePath = (course: Course, audience: Audience) =>
  audience === 'student' ? course.path : audience === 'teacher' ? course.teacherPath : course.parentPath;

export const footerNames: Record<CourseKey, string> = {
  science: 'Grade 6 Science',
  math9: 'Grade 9 Mathematics',
  science7: 'Grade 7 Science',
  social9: 'Grade 9 Social Studies',
  social8: 'Grade 8 Social Studies',
  steam: 'STEAM, Grades 5–9',
  cefl: 'Career Education and Financial Literacy 7',
};
