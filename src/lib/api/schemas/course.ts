import { z } from "zod";
import { listFilterSchema, pageMetaSchema } from "@/lib/api/schemas/common";

export const homeFeatureSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const homeContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  primaryCta: z.string(),
  secondaryCta: z.string(),
  benefits: z.array(z.string()),
  features: z.array(homeFeatureSchema),
});

export const lessonLevelSchema = z.enum(["A1", "A2", "B1"]);
export const lessonStatusSchema = z.enum(["published", "draft"]);
export const lessonSortSchema = z.enum(["default", "newest", "duration", "level"]);
export const lessonSkillSchema = z.enum([
  "alphabet",
  "pronunciation",
  "grammar",
  "vocabulary",
  "numbers",
  "conversation",
]);
export const resourceTypeSchema = z.enum(["pdf", "worksheet", "image", "reference", "audio"]);

export const pronunciationExampleSchema = z.object({
  german: z.string(),
  transliterationAr: z.string(),
  meaningAr: z.string().optional(),
});

export const pronunciationRuleSchema = z.object({
  id: z.string(),
  pattern: z.string(),
  soundAr: z.string(),
  explanation: z.string(),
  examples: z.array(pronunciationExampleSchema),
});

export const languageExampleSchema = z.object({
  id: z.string(),
  german: z.string(),
  transliterationAr: z.string().optional(),
  meaningAr: z.string(),
  notes: z.string().optional(),
});

export const lessonContentSectionSchema = z.object({
  title: z.string(),
  body: z.string(),
  kind: z.enum(["overview", "grammar", "pronunciation", "usage"]),
});

export const lessonContentSchema = z.object({
  introduction: z.string(),
  objectives: z.array(z.string()),
  sections: z.array(lessonContentSectionSchema),
  pronunciationRules: z.array(pronunciationRuleSchema),
  examples: z.array(languageExampleSchema),
  summary: z.string().optional(),
  sourcePages: z.array(z.number().int().positive()),
});

export const lessonSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  number: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  unitId: z.string(),
  unitTitle: z.string(),
  level: lessonLevelSchema,
  duration: z.number().int().positive(),
  status: lessonStatusSchema,
  tags: z.array(z.string()),
  skillFocus: z.array(lessonSkillSchema),
  questionCount: z.number().int().nonnegative(),
  exerciseCount: z.number().int().nonnegative(),
  vocabularyCount: z.number().int().nonnegative(),
  updatedAt: z.string(),
});

export const lessonSchema = lessonSummarySchema.extend({
  unitSlug: z.string(),
  content: lessonContentSchema,
});

export const lessonFilterSchema = listFilterSchema.extend({
  unitId: z.string().optional(),
  level: lessonLevelSchema.optional(),
  skill: lessonSkillSchema.optional(),
  status: lessonStatusSchema.optional(),
  sort: lessonSortSchema.optional(),
});

export const resourceSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  title: z.string(),
  type: resourceTypeSchema,
  fileName: z.string(),
  filePath: z.string(),
  size: z.string(),
  description: z.string(),
  downloadable: z.boolean(),
  viewable: z.boolean(),
});

export const partOfSpeechSchema = z.enum([
  "noun",
  "verb",
  "adjective",
  "adverb",
  "phrase",
  "pronoun",
  "number",
  "other",
]);

export const vocabularyItemSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  german: z.string(),
  transliterationAr: z.string(),
  meaningAr: z.string(),
  article: z.enum(["der", "die", "das"]).optional(),
  plural: z.string().optional(),
  partOfSpeech: partOfSpeechSchema,
  notes: z.string().optional(),
  exampleGerman: z.string().optional(),
  exampleTransliterationAr: z.string().optional(),
  exampleMeaningAr: z.string().optional(),
  tags: z.array(z.string()),
});

export const exerciseItemSchema = z.object({
  id: z.string(),
  prompt: z.string().optional(),
  left: z.string().optional(),
  right: z.string().optional(),
  text: z.string().optional(),
  options: z.array(z.string()).optional(),
  answer: z.union([z.string(), z.array(z.string())]).optional(),
});

export const exerciseSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  order: z.number().int().positive(),
  type: z.enum(["fill-blank", "matching", "ordering", "translation"]),
  title: z.string(),
  instructions: z.string(),
  prompt: z.string(),
  items: z.array(exerciseItemSchema),
  explanation: z.string().optional(),
});

export const questionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export const questionSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  type: z.enum(["single-choice", "multiple-choice", "true-false"]),
  question: z.string(),
  options: z.array(questionOptionSchema),
  correctAnswers: z.array(z.string()),
  explanation: z.string().optional(),
  points: z.number().int().positive(),
});

export const quizQuestionSchema = questionSchema.omit({ correctAnswers: true });

export const gradeQuizInputSchema = z.object({
  lessonId: z.string(),
  answers: z.record(z.string(), z.array(z.string())),
  startedAt: z.string(),
});

export const gradedAnswerSchema = z.object({
  questionId: z.string(),
  selectedOptionIds: z.array(z.string()),
  correctOptionIds: z.array(z.string()),
  isCorrect: z.boolean(),
  explanation: z.string().optional(),
});

export const quizResultSchema = z.object({
  attemptId: z.string(),
  lessonId: z.string(),
  score: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  percent: z.number().int().nonnegative().max(100),
  correctCount: z.number().int().nonnegative(),
  incorrectCount: z.number().int().nonnegative(),
  answers: z.array(gradedAnswerSchema),
  completedAt: z.string(),
});

export const pageResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    meta: pageMetaSchema,
  });

export const unitSchema = z.object({
  id: z.string(),
  slug: z.string(),
  order: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.enum(["blue", "green", "violet", "amber", "rose"]),
  lessonCount: z.number().int().nonnegative(),
  questionCount: z.number().int().nonnegative(),
  vocabularyCount: z.number().int().nonnegative(),
  exerciseCount: z.number().int().nonnegative(),
});

export const unitDetailSchema = unitSchema.extend({
  lessons: z.array(lessonSummarySchema),
});

export const lessonScoreSchema = z.object({
  bestScore: z.number().int().nonnegative().max(100),
  attempts: z.number().int().nonnegative(),
  lastScore: z.number().int().nonnegative().max(100),
  lastAttemptAt: z.string(),
});

export const progressSchema = z.object({
  version: z.literal(1),
  completedLessons: z.array(z.string()),
  quizScores: z.record(z.string(), lessonScoreSchema),
  lastVisitedLessonId: z.string().optional(),
  updatedAt: z.string(),
});
