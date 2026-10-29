// Math 9 materials manifest: the one list of strands, topics and the files
// each one links to. Student, parent and teacher pages and the document
// viewer all read from here, so a new or renamed file is changed in one place.
//
// File paths are relative to public/materials/math-9/ and have no .html
// extension; they are also the viewer's route (math9/view/<path>).
// File stems don't follow one pattern (Powers & Exponents files are
// math9-powers-*), so every path is written out rather than derived.

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
  steps: {
    notes: string;
    concepts: string;
    core: string;
    challenge: string;
    exits: string;
  };
  /** Prereq practice: the skills to check before the topic starts. */
  prereq: string;
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
  /** Strand inquiry project, once built: student brief, project journal, teacher guide. */
  project?: { brief: string; journal: string; guide: string };
}

export const strands: Strand[] = [
  { slug: 'number', label: 'Number', short: 'Number', blurb: 'Fractions, negatives, square roots and powers: the number skills every other topic leans on.', workbook: 'worksheets/number/math9-number-workbook-v1', workbookKey: 'worksheets/number/math9-number-workbook-answers-v1',
    project: { brief: 'worksheets/number/math9-number-project-v1', journal: 'worksheets/number/math9-number-project-journal-v1', guide: 'worksheets/number/math9-number-project-teacherguide-v1' } },
  { slug: 'algebra', label: 'Algebra', short: 'Algebra', blurb: 'Using letters to stand for numbers so you can describe patterns, solve problems and predict what comes next.', workbook: 'worksheets/algebra/math9-algebra-workbook-v1', workbookKey: 'worksheets/algebra/math9-algebra-workbook-answers-v1',
    project: { brief: 'worksheets/algebra/math9-algebra-project-v1', journal: 'worksheets/algebra/math9-algebra-project-journal-v1', guide: 'worksheets/algebra/math9-algebra-project-teacherguide-v1' } },
  { slug: 'measurement-geometry', label: 'Measurement & Geometry', short: 'M&G', blurb: "Circles, 3-D shapes and scale copies. Measuring the things you can see, and some you can't reach.", workbook: 'worksheets/measurement-geometry/math9-measurement-geometry-workbook-v1', workbookKey: 'worksheets/measurement-geometry/math9-measurement-geometry-workbook-answers-v1',
    project: { brief: 'worksheets/measurement-geometry/math9-measurement-geometry-project-v1', journal: 'worksheets/measurement-geometry/math9-measurement-geometry-project-journal-v1', guide: 'worksheets/measurement-geometry/math9-measurement-geometry-project-teacherguide-v1' } },
  { slug: 'statistics-probability', label: 'Statistics & Probability', short: 'Stats & Prob', blurb: 'Reading data like a detective and working out the chances of things happening.', workbook: 'worksheets/statistics-probability/math9-statistics-probability-workbook-v1', workbookKey: 'worksheets/statistics-probability/math9-statistics-probability-workbook-answers-v1',
    project: { brief: 'worksheets/statistics-probability/math9-statistics-probability-project-v1', journal: 'worksheets/statistics-probability/math9-statistics-probability-project-journal-v1', guide: 'worksheets/statistics-probability/math9-statistics-probability-project-teacherguide-v1' } },
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
    prereq: `practice/math9-${slug}-prereq-practice-v1`,
    extras: [{ label: 'Mid-Unit Quiz', path: `quizzes/${slug}/${stem}-quiz-v1`, type: 'assessment' }],
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
  { label: 'Rational Numbers Trainer (compare, add, signs, multiply, divide, order of operations)', path: 'practice/math9-rational-numbers-trainer-v1', type: 'interactive' },
  { label: 'Extra Practice', path: 'worksheets/number/rational-numbers/math9-rational-numbers-worksheet-extra-v1', badge: '★' },
  { label: 'Practice Test', path: 'tests/rational-numbers/math9-rational-numbers-practice-test-v1', badge: 'Test prep' },
  { label: 'How Written Answers Are Scored (Rubric)', path: 'tests/rational-numbers/math9-rational-numbers-rubric-v1', badge: 'Test prep' },
];
rational.keys.splice(2, 0, { label: 'Extra Practice Answer Key', path: 'worksheets/number/rational-numbers/math9-rational-numbers-worksheet-extra-answers-v1' });
rational.keys.push({ label: 'Practice Test Answer Key', path: 'tests/rational-numbers/math9-rational-numbers-practice-test-answers-v1' });

/** A standard topic plus its practice unit test and key (tests/<slug>/<stem>-practice-test-v1). */
function withPracticeTest(slug: string, label: string, strand: StrandSlug, stem: string): Topic {
  const t = standard(slug, label, strand, stem);
  t.extras.push({ label: 'Practice Test', path: `tests/${slug}/${stem}-practice-test-v1`, badge: 'Test prep' });
  t.keys.push({ label: 'Practice Test Answer Key', path: `tests/${slug}/${stem}-practice-test-answers-v1` });
  return t;
}

const squareRoots = withPracticeTest('square-roots', 'Square Roots', 'number', 'math9-square-roots');

// Narrow trainers: one per topic, listed first under Extra help. Rules: _sims-context.md (rules 19–25).
// The Fraction and Pythagorean Simulators they replaced stay in practice/, unlinked.
squareRoots.extras.unshift({ label: 'Square Roots Trainer (perfect squares, estimating, rational or irrational, Pythagorean theorem)', path: 'practice/math9-square-roots-trainer-v1', type: 'interactive' });
const powers = withPracticeTest('powers-exponents', 'Powers & Exponents', 'number', 'math9-powers');
powers.extras.unshift({ label: 'Powers Trainer (base, zero, the exponent laws, brackets, negative exponents)', path: 'practice/math9-powers-exponents-trainer-v1', type: 'interactive' });
const linearRelations = withPracticeTest('linear-relations', 'Linear Relations', 'algebra', 'math9-linear-relations');
linearRelations.extras.unshift({ label: 'Linear Relations Trainer (table, slope, graph it, equation, direct or partial)', path: 'practice/math9-linear-relations-trainer-v1', type: 'interactive' });
const linearEquations = withPracticeTest('linear-equations', 'Linear Equations & Inequalities', 'algebra', 'math9-linear-equations');
linearEquations.extras.unshift({ label: 'Equations Trainer (two-step, brackets, both sides, fractions, the sign flip, graphing)', path: 'practice/math9-linear-equations-trainer-v2', type: 'interactive' });
const polynomials = withPracticeTest('polynomials', 'Polynomials', 'algebra', 'math9-polynomials');
polynomials.extras.unshift({ label: 'Polynomials Trainer (parts, like terms, add, subtract, multiply)', path: 'practice/math9-polynomials-trainer-v2', type: 'interactive' });
const circles = withPracticeTest('circle-geometry', 'Circle Geometry', 'measurement-geometry', 'math9-circle-geometry');
circles.extras.unshift({ label: 'Circle Geometry Trainer (name the parts, chords, inscribed angles, tangents)', path: 'practice/math9-circle-geometry-trainer-v1', type: 'interactive' });
const measurement = withPracticeTest('measurement', 'Surface Area & Volume', 'measurement-geometry', 'math9-measurement');
measurement.extras.unshift({ label: 'Surface Area & Volume Trainer (area, nets, volume, cones and spheres, composite objects)', path: 'practice/math9-measurement-trainer-v1', type: 'interactive' });
const similarity = withPracticeTest('similarity', 'Similarity & Scale', 'measurement-geometry', 'math9-similarity');
similarity.extras.unshift({ label: 'Similarity Trainer (proportions, scale factor, similar triangles, shadows, map scale)', path: 'practice/math9-similarity-trainer-v1', type: 'interactive' });
const statistics = withPracticeTest('statistics', 'Statistics & Scatter Plots', 'statistics-probability', 'math9-statistics');
statistics.extras.unshift({ label: 'Statistics Trainer (variables, correlation, line of best fit, predicting)', path: 'practice/math9-statistics-trainer-v1', type: 'interactive' });
const probability = withPracticeTest('probability', 'Probability', 'statistics-probability', 'math9-probability');
probability.extras.unshift({ label: 'Probability Trainer (one event, complements, expected counts, two events, without replacement)', path: 'practice/math9-probability-trainer-v1', type: 'interactive' });

export const topics: Topic[] = [
  rational,
  powers,
  squareRoots,
  linearRelations,
  linearEquations,
  polynomials,
  circles,
  measurement,
  similarity,
  statistics,
  probability,
];

// Home practice sheets for the parent pages, by topic: [file name part, skill].
// Sources: worksheets/math-9/home/<topic>/; render with scripts/render_home_practice.py.
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
const unlisted = ['worksheets/number/powers-exponents/math9-powers-repeated-mult-lesson-v1', 'practice/math9-pat-trainer-v1'];

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
  const paths = strands.flatMap((s) => [s.workbook, s.workbookKey, ...(s.project ? Object.values(s.project) : [])]);
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
  return [...new Set([...paths, ...unlisted])];
}

/** Where the viewer's back link goes for a document. */
export function backPathFor(path: string): string {
  const parts = path.split('/');
  if (parts[0] === 'home') return `math9/parents/${parts[1]}`;
  if (path === 'practice/math9-pat-trainer-v1') return 'math9/pat-prep';
  for (const s of strands) {
    if (s.project?.guide === path) return `math9/teacher#${s.slug}-project`;
    if (s.project?.brief === path || s.project?.journal === path) return `math9/materials/${s.slug}`;
  }
  for (const t of topics) {
    if (t.teacherNotes === path) return `math9/teacher#${t.slug}`;
    const listed = [...Object.values(t.steps), t.prereq, ...t.extras.map((m) => m.path), ...t.keys.map((m) => m.path)];
    if (listed.includes(path) || path.includes(`/${t.slug}/`)) return `math9/${t.slug}`;
  }
  const strand = strands.find((s) => s.workbook === path || s.workbookKey === path);
  return strand ? `math9/materials/${strand.slug}` : 'math9/materials';
}

const stepHints = [
  'Start here. You fill these in during class.',
  'The key ideas on one page. Keep it open while you practise.',
  'The practice everyone does.',
  'Ready for more? Try these.',
  'Quick checks to see if you’ve got it.',
];

/** Math 9 in the shape the shared student and parent components use. */
export const math9Course: CourseManifest = {
  course: 'math9',
  noun: 'topic',
  units: topics.map((t) => ({
    slug: t.slug,
    label: t.label,
    path: studentSteps(t).map((m, i) => ({ hint: stepHints[i], items: [{ label: m.label, doc: m.path, badge: m.badge, type: m.type }] })),
    extras: [
      getReady(t.prereq),
      ...(t.extras.length ? [{ heading: 'Extra help', items: t.extras.map((m) => ({ label: m.label, doc: m.path, badge: m.badge, type: m.type })) }] : []),
    ],
    keys: t.keys.map((k) => ({ label: k.label, doc: k.path })),
    home: t.home.map((h) => ({ skill: h.skill, doc: h.path, keyDoc: h.keyPath })),
  })),
  studentHref: (slug) => `math9/${slug}`,
  parentHref: (slug) => `math9/parents/${slug}`,
  teacherHref: (slug) => `math9/teacher#${slug}`,
  viewHref: (_slug, doc) => `math9/view/${doc}`,
};
