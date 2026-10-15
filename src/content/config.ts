import { defineCollection, z } from 'astro:content';

const units = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tier: z.number(),
    weeks: z.string(),
    guidingQuestion: z.string(),
    learningOutcome: z.string(),
    order: z.number(),
    misconceptions: z.array(z.string()).optional(),
    csConnection: z.string().optional(),
  }),
});

const science7Units = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tier: z.number(),
    weeks: z.string(),
    guidingQuestion: z.string(),
    learningOutcome: z.string(),
    order: z.number(),
    misconceptions: z.array(z.string()).optional(),
  }),
});

// Student-facing topic page. The body is the short "big idea" in kid
// language; teacherSummary is the one-line scope note on the teacher hub.
const math9Units = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    guidingQuestion: z.string(),
    learningOutcome: z.string(),
    order: z.number(),
    hook: z.string(),
    realWorld: z.array(z.object({ title: z.string(), blurb: z.string() })).length(3),
    iCan: z.array(z.string()).min(3).max(4),
    teacherSummary: z.string(),
  }),
});

// Parent-facing topic page. The body holds the worked examples.
const math9Parent = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    plainSummary: z.string(),
    comesFrom: z.array(z.object({ grade: z.string(), idea: z.string() })).min(1),
    assumed: z.array(z.string()).min(3),
    leadsTo: z.array(z.object({ course: z.string(), idea: z.string() })).min(1),
    watchFor: z.array(z.string()).min(2),
    tips: z.array(z.string()).min(2),
  }),
});

const social9Units = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    organizingIdea: z.string(),
    guidingQuestion: z.string(),
    learningOutcome: z.string(),
    order: z.number(),
  }),
});

const social8Units = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    organizingIdea: z.string(),
    guidingQuestion: z.string(),
    learningOutcome: z.string(),
    order: z.number(),
  }),
});

const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    unit: z.string(),
    lessonNumber: z.number(),
    objectives: z.array(z.string()),
    duration: z.string().default('60 min'),
    phase: z.enum(['engage', 'explain', 'elaborate', 'evaluate']).default('explain'),
  }),
});

const teacherUnits = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    unit: z.string(),
    totalLessons: z.number().optional(),
  }),
});

const teacherLessons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    unit: z.string(),
    lessonNumber: z.number(),
    timing: z.string().optional(),
  }),
});

const materials = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    unit: z.string(),
    materialType: z.enum(['workbook', 'quiz', 'test', 'project', 'entry-dump', 'exit-tickets']),
  }),
});

export const collections = {
  units,
  'science7-units': science7Units,
  'math9-units': math9Units,
  'math9-parent': math9Parent,
  'social9-units': social9Units,
  'social8-units': social8Units,
  lessons,
  'teacher-units': teacherUnits,
  'teacher-lessons': teacherLessons,
  materials,
};
