// Math 8 materials manifest: the one list of strands, topics and the files
// each one links to. Same shape as math9.ts, so the student, parent and
// teacher pages and the viewer work the same way.
//
// File paths are relative to public/materials/math-8/ and have no .html
// extension; they are also the viewer's route (math8/view/<path>).
// Every topic follows one naming pattern (math8-<topic>-…), so paths are derived.
// Sources and renderer: _courses/math-8/_context.md, scripts/render_math8.pl.

import type { MaterialType } from './materialTypes';
import { getReady, type CourseManifest } from './manifest';

export type StrandSlug = 'number' | 'algebra' | 'measurement-geometry' | 'statistics-probability';

export interface Material {
  label: string;
  path: string;
  badge?: string;
  type?: MaterialType;
}

export interface HomeSheet {
  /** Short name of the one skill the sheet practises. */
  skill: string;
  path: string;
  keyPath: string;
}

export interface Topic {
  slug: string;
  label: string;
  strand: StrandSlug;
  /** The five steps a student works through, in order. */
  steps: { notes: string; concepts: string; core: string; challenge: string; exits: string };
  /** Prereq practice: the skills to check before the topic starts. */
  prereq: string;
  extras: Material[];
  keys: Material[];
  teacherNotes: string;
  home: HomeSheet[];
}

export interface Strand {
  slug: StrandSlug;
  label: string;
  short: string;
  /** One plain-language sentence for students. */
  blurb: string;
  workbook: string;
  workbookKey: string;
}

const wb = (s: StrandSlug) => `worksheets/${s}/math8-${s}-workbook-v1`;
const wbKey = (s: StrandSlug) => `worksheets/${s}/math8-${s}-workbook-answers-v1`;

export const strands: Strand[] = [
  { slug: 'number', label: 'Number', short: 'Number', blurb: 'Square roots, percents, ratios and rates, and multiplying and dividing fractions and integers.', workbook: wb('number'), workbookKey: wbKey('number') },
  { slug: 'algebra', label: 'Algebra', short: 'Algebra', blurb: 'Turning patterns into tables, equations and graphs, and solving equations with a balance.', workbook: wb('algebra'), workbookKey: wbKey('algebra') },
  { slug: 'measurement-geometry', label: 'Measurement & Geometry', short: 'M&G', blurb: 'Right triangles, wrapping and filling 3-D shapes, views of block buildings, and moving shapes on a grid.', workbook: wb('measurement-geometry'), workbookKey: wbKey('measurement-geometry') },
  { slug: 'statistics-probability', label: 'Statistics & Probability', short: 'Stats & Prob', blurb: 'Choosing fair graphs, catching misleading ones, and finding the chance of two things happening.', workbook: wb('statistics-probability'), workbookKey: wbKey('statistics-probability') },
];

/** Every topic has the same set: notes, concepts, core, challenge, exits, quiz, keys, teacher notes. */
function topic(slug: string, label: string, strand: StrandSlug): Topic {
  const stem = `math8-${slug}`;
  const ws = `worksheets/${strand}/${slug}/${stem}`;
  return {
    slug,
    label,
    strand,
    steps: {
      notes: `notes/${slug}/${stem}-notes-v1`,
      concepts: `${ws}-concepts-v1`,
      core: `${ws}-worksheet-core-v1`,
      challenge: `${ws}-worksheet-challenge-v1`,
      exits: `exits/${slug}/${stem}-exits-v1`,
    },
    prereq: `practice/${stem}-prereq-practice-v1`,
    extras: [{ label: 'Mid-Unit Quiz', path: `quizzes/${slug}/${stem}-quiz-v1`, type: 'assessment' }],
    keys: [
      { label: 'Notes Answer Key', path: `notes/${slug}/${stem}-notes-answers-v1` },
      { label: 'Core Practice Answer Key', path: `${ws}-worksheet-core-answers-v1` },
      { label: 'Challenge Answer Key', path: `${ws}-worksheet-challenge-answers-v1` },
    ],
    teacherNotes: `notes/${slug}/${stem}-teachernotes-v1`,
    home: [],
  };
}

export const topics: Topic[] = [
  topic('square-roots', 'Squares & Square Roots', 'number'),
  topic('percents', 'Percents', 'number'),
  topic('ratios-rates', 'Ratios & Rates', 'number'),
  topic('fractions', 'Fractions (× and ÷)', 'number'),
  topic('integers', 'Integers (× and ÷)', 'number'),
  topic('linear-relations', 'Linear Relations', 'algebra'),
  topic('linear-equations', 'Linear Equations', 'algebra'),
  topic('pythagorean', 'Pythagorean Theorem', 'measurement-geometry'),
  topic('surface-area-volume', 'Surface Area & Volume', 'measurement-geometry'),
  topic('views-transformations', '3-D Views & Transformations', 'measurement-geometry'),
  topic('data-displays', 'Data Displays', 'statistics-probability'),
  topic('probability', 'Probability', 'statistics-probability'),
];

// Home practice sheets for the parent pages, by topic: [file name part, skill].
// Sources: worksheets/math-8/home/<topic>/; render with scripts/render_home_practice.pl.
const homeSheets: Record<string, [string, string][]> = {
  'square-roots': [['squares-roots', 'Squares and square roots'], ['estimating', 'Estimating square roots']],
  'percents': [['percent-of', 'Percent of a number'], ['tax-tip', 'Tax, tips and sales']],
  'ratios-rates': [['equal-ratios', 'Equal ratios'], ['unit-price', 'Unit prices and best buys']],
  'fractions': [['multiply', 'Multiplying fractions'], ['divide', 'Dividing fractions']],
  'integers': [['multiply-divide', 'Multiplying and dividing integers'], ['order-of-operations', 'Order of operations with integers']],
  'linear-relations': [['table-to-equation', 'From patterns to equations'], ['graphs', 'Reading a relation']],
  'linear-equations': [['two-step', 'Two-step equations'], ['brackets', 'Equations with brackets']],
  'pythagorean': [['hypotenuse', 'Finding the hypotenuse'], ['leg', 'Finding a missing leg']],
  'surface-area-volume': [['surface-area', 'Surface area of a box'], ['volume', 'Volume of prisms and cylinders']],
  'views-transformations': [['views', 'Top, front and side views'], ['transformations', 'Slides, flips and turns']],
  'data-displays': [['choosing', 'Choosing a graph'], ['misleading', 'Spot the misleading graph']],
  'probability': [['outcomes', 'Listing outcomes'], ['multiply-rule', 'The multiply rule']],
};
for (const t of topics) {
  t.home = (homeSheets[t.slug] ?? []).map(([name, skill]) => ({
    skill,
    path: `home/${t.slug}/math8-${t.slug}-home-${name}-v1`,
    keyPath: `home/${t.slug}/math8-${t.slug}-home-${name}-answers-v1`,
  }));
}

export const topicBySlug = (slug: string) => topics.find((t) => t.slug === slug);
export const strandBySlug = (slug: string) => strands.find((s) => s.slug === slug);
export const topicsInStrand = (strand: StrandSlug) => topics.filter((t) => t.strand === strand);

/** The numbered student path, in the order it should be worked. */
export function studentSteps(t: Topic): Material[] {
  return [
    { label: 'Guided Notes', path: t.steps.notes, type: 'notes' },
    { label: 'Concept Reference', path: t.steps.concepts, type: 'reference' },
    { label: 'Core Practice', path: t.steps.core, badge: '★', type: 'workbook' },
    { label: 'Challenge', path: t.steps.challenge, badge: '★★', type: 'challenge' },
    { label: 'Exit Tickets', path: t.steps.exits, badge: 'Formative', type: 'exit' },
  ];
}

/** Every path the viewer pre-renders. */
export function allViewPaths(): string[] {
  const paths = strands.flatMap((s) => [s.workbook, s.workbookKey]);
  for (const t of topics) {
    paths.push(
      ...Object.values(t.steps),
      t.prereq,
      ...t.extras.map((m) => m.path),
      ...t.keys.map((m) => m.path),
      t.teacherNotes,
      ...t.home.flatMap((h) => [h.path, h.keyPath]),
    );
  }
  return [...new Set(paths)];
}

/** Where the viewer's back link goes for a document. */
export function backPathFor(path: string): string {
  const parts = path.split('/');
  if (parts[0] === 'home') return `math8/parents/${parts[1]}`;
  for (const t of topics) {
    if (t.teacherNotes === path) return `math8/teacher#${t.slug}`;
    const listed = [...Object.values(t.steps), t.prereq, ...t.extras.map((m) => m.path), ...t.keys.map((m) => m.path)];
    if (listed.includes(path) || path.includes(`/${t.slug}/`)) return `math8/${t.slug}`;
  }
  const strand = strands.find((s) => s.workbook === path || s.workbookKey === path);
  return strand ? `math8/materials/${strand.slug}` : 'math8/materials';
}

const stepHints = [
  'Start here. You fill these in during class.',
  'The key ideas on one page. Keep it open while you practise.',
  'The practice everyone does.',
  'Ready for more? Try these.',
  'Quick checks to see if you’ve got it.',
];

/** Math 8 in the shape the shared student and parent components use. */
export const math8Course: CourseManifest = {
  course: 'math8',
  noun: 'topic',
  units: topics.map((t) => ({
    slug: t.slug,
    label: t.label,
    path: studentSteps(t).map((m, i) => ({ hint: stepHints[i], items: [{ label: m.label, doc: m.path, badge: m.badge, type: m.type }] })),
    extras: [
      getReady(t.prereq),
      { heading: 'Check yourself', items: t.extras.map((m) => ({ label: m.label, doc: m.path, badge: m.badge, type: m.type })) },
    ],
    keys: t.keys.map((k) => ({ label: k.label, doc: k.path })),
    teacherGuide: t.teacherNotes,
    home: t.home.map((h) => ({ skill: h.skill, doc: h.path, keyDoc: h.keyPath })),
  })),
  studentHref: (slug) => `math8/${slug}`,
  parentHref: (slug) => `math8/parents/${slug}`,
  teacherHref: (slug) => `math8/teacher#${slug}`,
  viewHref: (_slug, doc) => `math8/view/${doc}`,
};
