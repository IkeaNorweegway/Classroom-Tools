// Math 9 materials manifest: the one list of strands, topics and the files
// each one links to. Student, parent and teacher pages and the document
// viewer all read from here, so a new or renamed file is changed in one place.
//
// File paths are relative to public/materials/math-9/ and have no .html
// extension; they are also the viewer's route (math9/view/<path>).
// File stems don't follow one pattern (Powers & Exponents files are
// math9-powers-*), so every path is written out rather than derived.

import type { MaterialType } from './materialTypes';

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
  steps: {
    notes: string;
    concepts: string;
    core: string;
    challenge: string;
    exits: string;
  };
  /** Optional extra help shown after the steps. */
  extras: Material[];
  keys: Material[];
  teacherNotes: string;
  /** Short at-home practice sheets for the parent page. */
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

export const strands: Strand[] = [
  { slug: 'number', label: 'Number', short: 'Number', blurb: 'Fractions, negatives, square roots and powers: the number skills every other topic leans on.', workbook: 'worksheets/number/math9-number-workbook-v1', workbookKey: 'worksheets/number/math9-number-workbook-answers-v1' },
  { slug: 'algebra', label: 'Algebra', short: 'Algebra', blurb: 'Using letters to stand for numbers so you can describe patterns, solve problems and predict what comes next.', workbook: 'worksheets/algebra/math9-algebra-workbook-v1', workbookKey: 'worksheets/algebra/math9-algebra-workbook-answers-v1' },
  { slug: 'measurement-geometry', label: 'Measurement & Geometry', short: 'M&G', blurb: "Circles, 3-D shapes and scale copies. Measuring the things you can see, and some you can't reach.", workbook: 'worksheets/measurement-geometry/math9-measurement-geometry-workbook-v1', workbookKey: 'worksheets/measurement-geometry/math9-measurement-geometry-workbook-answers-v1' },
  { slug: 'statistics-probability', label: 'Statistics & Probability', short: 'Stats & Prob', blurb: 'Reading data like a detective and working out the chances of things happening.', workbook: 'worksheets/statistics-probability/math9-statistics-probability-workbook-v1', workbookKey: 'worksheets/statistics-probability/math9-statistics-probability-workbook-answers-v1' },
];

/** The common shape: notes, concepts, core, challenge, exits and their keys. */
function standard(slug: string, label: string, strand: StrandSlug, stem: string): Topic {
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
    extras: [],
    keys: [
      { label: 'Notes Answer Key', path: `notes/${slug}/${stem}-notes-answers-v1` },
      { label: 'Core Worksheet Answer Key', path: `${ws}-worksheet-core-answers-v1` },
      { label: 'Challenge Answer Key', path: `${ws}-worksheet-challenge-answers-v1` },
    ],
    teacherNotes: `notes/${slug}/${stem}-teachernotes-v2`,
    home: [],
  };
}

const rational = standard('rational-numbers', 'Rational Numbers', 'number', 'math9-rational-numbers');
rational.extras = [
  { label: 'Fraction Simulator (equivalent fractions, simplifying, cross-cancelling)', path: 'practice/math9-fraction-sim-v1' },
  { label: 'Extra Practice', path: 'worksheets/number/rational-numbers/math9-rational-numbers-worksheet-extra-v1', badge: '★' },
  { label: 'Practice Test', path: 'tests/rational-numbers/math9-rational-numbers-practice-test-v1', badge: 'Test prep' },
];
rational.keys.splice(2, 0, { label: 'Extra Practice Answer Key', path: 'worksheets/number/rational-numbers/math9-rational-numbers-worksheet-extra-answers-v1' });
rational.keys.push({ label: 'Practice Test Answer Key', path: 'tests/rational-numbers/math9-rational-numbers-practice-test-answers-v1' });

export const topics: Topic[] = [
  rational,
  standard('square-roots', 'Square Roots', 'number', 'math9-square-roots'),
  standard('powers-exponents', 'Powers & Exponents', 'number', 'math9-powers'),
  standard('linear-relations', 'Linear Relations', 'algebra', 'math9-linear-relations'),
  standard('linear-equations', 'Linear Equations & Inequalities', 'algebra', 'math9-linear-equations'),
  standard('polynomials', 'Polynomials', 'algebra', 'math9-polynomials'),
  standard('circle-geometry', 'Circle Geometry', 'measurement-geometry', 'math9-circle-geometry'),
  standard('measurement', 'Surface Area & Volume', 'measurement-geometry', 'math9-measurement'),
  standard('similarity', 'Similarity & Scale', 'measurement-geometry', 'math9-similarity'),
  standard('statistics', 'Statistics & Scatter Plots', 'statistics-probability', 'math9-statistics'),
  standard('probability', 'Probability', 'statistics-probability', 'math9-probability'),
];

// Home practice sheets for the parent pages, by topic: [file name part, skill].
// Sources: worksheets/math-9/home/<topic>/; render with scripts/render_math9_home.py.
const homeSheets: Record<string, [string, string][]> = {
  'rational-numbers': [['add-subtract', 'Adding and subtracting with negatives'], ['multiply-divide', 'Multiplying and dividing with negatives']],
  'square-roots': [['estimating', 'Estimating square roots'], ['pythagorean', 'The Pythagorean theorem']],
  'powers-exponents': [['laws', 'The exponent laws'], ['zero-negative', 'Zero, negatives and brackets']],
  'linear-relations': [['table-to-equation', 'From tables to equations'], ['slope-meaning', 'What slope and intercept mean']],
  'linear-equations': [['both-sides', 'Variables on both sides'], ['inequalities', 'Solving inequalities']],
  'polynomials': [['add-subtract', 'Adding and subtracting polynomials'], ['multiply', 'Multiplying binomials']],
  'circle-geometry': [['tangents-chords', 'Tangents and chords'], ['angles', 'Angles in a circle']],
  'measurement': [['volume', 'Volume of cylinders, cones and spheres'], ['surface-area', 'Surface area of combined shapes']],
  'similarity': [['scale-factor', 'Scale factor and missing sides'], ['indirect', 'Measuring with similar triangles']],
  'statistics': [['trends', 'Reading trends in data'], ['trust', 'Can you trust the data?']],
  'probability': [['independent', 'Independent events'], ['dependent', 'Dependent events']],
};
for (const t of topics) {
  t.home = (homeSheets[t.slug] ?? []).map(([name, skill]) => ({
    skill,
    path: `home/${t.slug}/math9-${t.slug}-home-${name}-v1`,
    keyPath: `home/${t.slug}/math9-${t.slug}-home-${name}-answers-v1`,
  }));
}

/** Files the viewer serves that no page lists. */
const unlisted = ['worksheets/number/powers-exponents/math9-powers-repeated-mult-lesson-v1'];

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
      ...t.extras.map((m) => m.path),
      ...t.keys.map((m) => m.path),
      t.teacherNotes,
      ...t.home.flatMap((h) => [h.path, h.keyPath]),
    );
  }
  return [...new Set([...paths, ...unlisted])];
}

/** Where the viewer's back link goes for a document. */
export function backPathFor(path: string): string {
  const parts = path.split('/');
  if (parts[0] === 'home') return `math9/parents/${parts[1]}`;
  for (const t of topics) {
    if (t.teacherNotes === path) return `math9/teacher#${t.slug}`;
    const listed = [...Object.values(t.steps), ...t.extras.map((m) => m.path), ...t.keys.map((m) => m.path)];
    if (listed.includes(path) || path.includes(`/${t.slug}/`)) return `math9/${t.slug}`;
  }
  const strand = strands.find((s) => s.workbook === path || s.workbookKey === path);
  return strand ? `math9/materials/${strand.slug}` : 'math9/materials';
}
