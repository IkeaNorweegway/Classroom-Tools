// Math 8 materials manifest (Alberta June 2026 draft curriculum, rebuilt
// 2026-10-31): the one list of strands, topics and the files each one links to.
// The 2016-program files (old slugs) stay in public/materials/math-8/ unlinked. Same shape as math9.ts, so the student, parent and
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

const wb = (s: StrandSlug) => `worksheets/${s}/math8-${s}-workbook-v2`;
const wbKey = (s: StrandSlug) => `worksheets/${s}/math8-${s}-workbook-answers-v2`;

export const strands: Strand[] = [
  { slug: 'number', label: 'Number', short: 'Number', blurb: 'Rational and irrational numbers, square roots, and proportional reasoning.', workbook: wb('number'), workbookKey: wbKey('number') },
  { slug: 'algebra', label: 'Algebra & Functions', short: 'Algebra', blurb: 'Polynomials, equations with fractions and x on both sides, inequalities, and slope and straight-line graphs.', workbook: wb('algebra'), workbookKey: wbKey('algebra') },
  { slug: 'measurement-geometry', label: 'Geometry & Measurement', short: 'Geometry', blurb: 'Similar shapes and dilations, triangle facts and the Pythagorean theorem, and surface area.', workbook: wb('measurement-geometry'), workbookKey: wbKey('measurement-geometry') },
  { slug: 'statistics-probability', label: 'Statistics & Probability', short: 'Stats & Prob', blurb: 'The shape of data, histograms and circle graphs, and the chance of two events.', workbook: wb('statistics-probability'), workbookKey: wbKey('statistics-probability') },
];

/**
 * Topics with a posted practice test (tests/<slug>/math8-<slug>-practice-test-v1 and its key).
 * Unit tests are teacher only, kept out of the repo, and never listed here.
 */
const practiceTests = new Set(['rational-numbers', 'roots-irrationals', 'proportional-reasoning', 'polynomials', 'solving-equations', 'inequalities', 'linear-functions', 'similarity-dilations', 'triangle-theorems', 'surface-area', 'distributions', 'compound-probability']);

/** Every topic has the same set: notes, concepts, core, challenge, exits, quiz, keys, teacher notes; practice test and key where one is posted. */
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
    extras: [
      { label: 'Mid-Unit Quiz', path: `quizzes/${slug}/${stem}-quiz-v1`, type: 'assessment' },
      ...(practiceTests.has(slug) ? [{ label: 'Practice Test', path: `tests/${slug}/${stem}-practice-test-v1`, badge: 'Test prep', type: 'assessment' as const }] : []),
    ],
    keys: [
      { label: 'Notes Answer Key', path: `notes/${slug}/${stem}-notes-answers-v1` },
      { label: 'Core Practice Answer Key', path: `${ws}-worksheet-core-answers-v1` },
      { label: 'Challenge Answer Key', path: `${ws}-worksheet-challenge-answers-v1` },
      ...(practiceTests.has(slug) ? [{ label: 'Practice Test Answer Key', path: `tests/${slug}/${stem}-practice-test-answers-v1` }] : []),
    ],
    teacherNotes: `notes/${slug}/${stem}-teachernotes-v1`,
    home: [],
  };
}

export const topics: Topic[] = [
  topic('rational-numbers', 'Rational Numbers', 'number'),
  topic('roots-irrationals', 'Square Roots & Irrational Numbers', 'number'),
  topic('proportional-reasoning', 'Proportional Reasoning', 'number'),
  topic('polynomials', 'Polynomials', 'algebra'),
  topic('solving-equations', 'Solving Equations', 'algebra'),
  topic('inequalities', 'Inequalities', 'algebra'),
  topic('linear-functions', 'Linear Functions', 'algebra'),
  topic('similarity-dilations', 'Similarity & Dilations', 'measurement-geometry'),
  topic('triangle-theorems', 'Triangle Theorems', 'measurement-geometry'),
  topic('surface-area', 'Surface Area', 'measurement-geometry'),
  topic('distributions', 'Distributions & Circle Graphs', 'statistics-probability'),
  topic('compound-probability', 'Independent & Dependent Events', 'statistics-probability'),
];

// Home practice sheets for the parent pages, by topic: [file name part, skill].
// Sources: worksheets/math-8/home/<topic>/; render with scripts/render_home_practice.pl.
const homeSheets: Record<string, [string, string][]> = {
  'rational-numbers': [['kinds-order', 'Kinds of numbers and ordering'], ['operations', 'Operations with rational numbers']],
  'roots-irrationals': [['square-roots', 'Square roots, both signs'], ['estimating', 'Estimating roots and irrational numbers']],
  'proportional-reasoning': [['constant', 'The constant of proportionality'], ['direct-inverse', 'Direct and inverse proportion']],
  'polynomials': [['naming', 'Naming polynomials'], ['add-subtract', 'Adding and subtracting polynomials']],
  'solving-equations': [['fractions', 'Equations with fractions and decimals'], ['both-sides', 'Brackets and x on both sides']],
  'inequalities': [['number-line', 'Inequalities on a number line'], ['real-world', 'Writing and checking inequalities']],
  'linear-functions': [['slope', 'Finding slope'], ['equations', 'y = mx + b']],
  'similarity-dilations': [['scale-factor', 'Scale factor'], ['dilations', 'Dilations on a grid']],
  'triangle-theorems': [['angles-sides', 'Triangle angles and sides'], ['pythagorean', 'The Pythagorean theorem']],
  'surface-area': [['prisms', 'Surface area of prisms and pyramids'], ['cylinders-drawings', 'Cylinders and 3-D drawings']],
  'distributions': [['shape', 'The shape of data'], ['circle-graphs', 'Circle graphs']],
  'compound-probability': [['independent', 'Independent events'], ['dependent', 'Dependent events']],
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
