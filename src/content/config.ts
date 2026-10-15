import { defineCollection, z } from 'astro:content';

// Student intro shared by every course's unit pages: a fun one-line hook,
// three real-world connections and "I can" goals. The body is the short
// "big idea"; teacherSummary is the one-line scope note on the teacher hub.
const studentIntro = {
  hook: z.string(),
  realWorld: z.array(z.object({ title: z.string(), blurb: z.string() })).length(3),
  iCan: z.array(z.string()).min(3).max(4),
};
const teacherSummary = { teacherSummary: z.string() };

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
    ...studentIntro,
    ...teacherSummary,
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
    ...studentIntro,
    ...teacherSummary,
  }),
});

// Math 9 topic page (same intro fields as the other courses).
const math9Units = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    guidingQuestion: z.string(),
    learningOutcome: z.string(),
    order: z.number(),
    ...studentIntro,
    ...teacherSummary,
  }),
});

// STEAM grade pages (student intro per grade; STEAM has no teacher hub).
const steamGrades = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    ...studentIntro,
  }),
});

// Parent guides, one folder per course (parent-guides/<course>/<unit>.md).
// The body holds the worked examples.
const parentGuides = defineCollection({
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
    ...studentIntro,
    ...teacherSummary,
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
    ...studentIntro,
    ...teacherSummary,
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
  'steam-grades': steamGrades,
  'parent-guides': parentGuides,
  'social9-units': social9Units,
  'social8-units': social8Units,
  lessons,
  'teacher-units': teacherUnits,
  'teacher-lessons': teacherLessons,
  materials,
};
