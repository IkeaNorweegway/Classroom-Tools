// Math 7 materials manifest (Alberta June 2026 draft curriculum): the one list
// of strands, topics and the files each one links to. Same shape as math8.ts,
// so the student, parent and teacher pages and the viewer work the same way.
//
// File paths are relative to public/materials/math-7/ and have no .html
// extension; they are also the viewer's route (math7/view/<path>).
// Every topic follows one naming pattern (math7-<topic>-…), so paths are derived.
// Sources and renderer: _courses/math-7/_context.md, scripts/render_math8.pl (it renders Math 7 too).

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

const wb = (s: StrandSlug) => `worksheets/${s}/math7-${s}-workbook-v1`;
const wbKey = (s: StrandSlug) => `worksheets/${s}/math7-${s}-workbook-answers-v1`;

export const strands: Strand[] = [
  { slug: 'number', label: 'Number', short: 'Number', blurb: 'Negative numbers, integers, squares and cubes, multiplying and dividing fractions and decimals, ratios and percents.', workbook: wb('number'), workbookKey: wbKey('number') },
  { slug: 'algebra', label: 'Algebra & Functions', short: 'Algebra', blurb: 'Solving equations with x on both sides, and reading functions from tables and graphs.', workbook: wb('algebra'), workbookKey: wbKey('algebra') },
  { slug: 'measurement-geometry', label: 'Geometry & Measurement', short: 'Geometry', blurb: 'Lines, angles and congruent shapes, circles and π, and the volume of prisms and cylinders.', workbook: wb('measurement-geometry'), workbookKey: wbKey('measurement-geometry') },
  { slug: 'statistics-probability', label: 'Statistics & Probability', short: 'Stats & Prob', blurb: 'Fair samples, mean, median, mode and range, and probability experiments.', workbook: wb('statistics-probability'), workbookKey: wbKey('statistics-probability') },
];

/** Every topic has the same set: notes, concepts, core, challenge, exits, quiz, keys, teacher notes. */
function topic(slug: string, label: string, strand: StrandSlug): Topic {
  const stem = `math7-${slug}`;
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
    ],
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
  topic('positive-negative', 'Positive & Negative Numbers', 'number'),
  topic('integers', 'Integers', 'number'),
  topic('squares-cubes', 'Squares & Cubes', 'number'),
  topic('fractions-decimals', 'Fractions & Decimals (× and ÷)', 'number'),
  topic('ratios-percents', 'Ratios & Percents', 'number'),
  topic('linear-equations', 'Linear Equations', 'algebra'),
  topic('functions', 'Functions', 'algebra'),
  topic('lines-angles', 'Lines, Angles & Congruence', 'measurement-geometry'),
  topic('circles', 'Circles', 'measurement-geometry'),
  topic('volume', 'Volume', 'measurement-geometry'),
  topic('samples-statistics', 'Samples & Statistics', 'statistics-probability'),
  topic('probability', 'Probability', 'statistics-probability'),
];

// Home practice sheets for the parent pages, by topic: [file name part, skill].
// Sources: worksheets/math-7/home/<topic>/; render with scripts/render_home_practice.pl.
const homeSheets: Record<string, [string, string][]> = {
  'positive-negative': [['absolute-value', 'Opposites and absolute value'], ['ordering', 'Comparing and ordering']],
  'integers': [['add-subtract', 'Adding and subtracting integers'], ['multiply-divide', 'Multiplying and dividing integers']],
  'squares-cubes': [['squares-roots', 'Squares and square roots'], ['cubes', 'Cubes and cube roots']],
  'fractions-decimals': [['fractions', 'Multiplying and dividing fractions'], ['decimals', 'Multiplying and dividing decimals']],
  'ratios-percents': [['equal-ratios', 'Equal ratios'], ['percents', 'Percent of a number']],
  'linear-equations': [['simplify', 'Simplifying expressions'], ['solve', 'Solving equations']],
  'functions': [['tables-graphs', 'Tables and graphs'], ['domain-range', 'Domain and range']],
  'lines-angles': [['angle-pairs', 'Angles where lines cross'], ['congruent', 'Congruent shapes']],
  'circles': [['circumference', 'Circumference'], ['area', 'Area of a circle']],
  'volume': [['rectangular-prisms', 'Volume of a box'], ['prisms-cylinders', 'Prisms and cylinders']],
  'samples-statistics': [['samples', 'Fair samples'], ['averages', 'Mean, median, mode and range']],
  'probability': [['theoretical', 'Finding a probability'], ['experiments', 'Experiments and theory']],
};
for (const t of topics) {
  t.home = (homeSheets[t.slug] ?? []).map(([name, skill]) => ({
    skill,
    path: `home/${t.slug}/math7-${t.slug}-home-${name}-v1`,
    keyPath: `home/${t.slug}/math7-${t.slug}-home-${name}-answers-v1`,
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
  if (parts[0] === 'home') return `math7/parents/${parts[1]}`;
  for (const t of topics) {
    if (t.teacherNotes === path) return `math7/teacher#${t.slug}`;
    const listed = [...Object.values(t.steps), t.prereq, ...t.extras.map((m) => m.path), ...t.keys.map((m) => m.path)];
    if (listed.includes(path) || path.includes(`/${t.slug}/`)) return `math7/${t.slug}`;
  }
  const strand = strands.find((s) => s.workbook === path || s.workbookKey === path);
  return strand ? `math7/materials/${strand.slug}` : 'math7/materials';
}

const stepHints = [
  'Start here. You fill these in during class.',
  'The key ideas on one page. Keep it open while you practise.',
  'The practice everyone does.',
  'Ready for more? Try these.',
  'Quick checks to see if you’ve got it.',
];

/** Math 7 in the shape the shared student and parent components use. */
export const math7Course: CourseManifest = {
  course: 'math7',
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
  studentHref: (slug) => `math7/${slug}`,
  parentHref: (slug) => `math7/parents/${slug}`,
  teacherHref: (slug) => `math7/teacher#${slug}`,
  viewHref: (_slug, doc) => `math7/view/${doc}`,
};
