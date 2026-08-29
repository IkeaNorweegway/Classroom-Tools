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

const math9Units = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    guidingQuestion: z.string(),
    learningOutcome: z.string(),
    order: z.number(),
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
  'social9-units': social9Units,
  lessons,
  'teacher-units': teacherUnits,
  'teacher-lessons': teacherLessons,
  materials,
};
