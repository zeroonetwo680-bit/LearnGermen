import type { PageResult } from "@/lib/api/contracts/common";
import type { ExerciseDto } from "@/lib/api/contracts/exercise";
import type { LessonDto, LessonFilter, LessonSummaryDto, ResourceDto } from "@/lib/api/contracts/lesson";
import type { QuestionDto, QuizQuestionDto } from "@/lib/api/contracts/question";
import type { VocabularyItemDto } from "@/lib/api/contracts/vocabulary";
import type { ApiClient } from "@/lib/api/transport/types";
import {
  exerciseSchema,
  lessonFilterSchema,
  lessonSchema,
  lessonSummarySchema,
  pageResultSchema,
  questionSchema,
  quizQuestionSchema,
  resourceSchema,
  vocabularyItemSchema,
} from "@/lib/api/schemas/course";
import { z } from "zod";

const lessonNavigationSchema = z.object({
  previous: lessonSummarySchema.optional(),
  next: lessonSummarySchema.optional(),
});

export function createLessonsEndpoint(client: ApiClient) {
  return {
    list(filter: LessonFilter = {}): Promise<PageResult<LessonSummaryDto>> {
      return client.get("/v1/lessons", {
        query: filter as Record<string, string | number | boolean | undefined>,
        responseSchema: pageResultSchema(lessonSummarySchema),
      });
    },
    get(slug: string): Promise<LessonDto> {
      return client.get(`/v1/lessons/${slug}`, { responseSchema: lessonSchema });
    },
    resources(slug: string): Promise<ResourceDto[]> {
      return client.get(`/v1/lessons/${slug}/resources`, { responseSchema: resourceSchema.array() });
    },
    vocabulary(slug: string): Promise<VocabularyItemDto[]> {
      return client.get(`/v1/lessons/${slug}/vocabulary`, { responseSchema: vocabularyItemSchema.array() });
    },
    exercises(slug: string): Promise<ExerciseDto[]> {
      return client.get(`/v1/lessons/${slug}/exercises`, { responseSchema: exerciseSchema.array() });
    },
    questions(slug: string): Promise<QuestionDto[]> {
      return client.get(`/v1/lessons/${slug}/questions`, { responseSchema: questionSchema.array() });
    },
    quiz(slug: string): Promise<QuizQuestionDto[]> {
      return client.get(`/v1/lessons/${slug}/quiz`, { responseSchema: quizQuestionSchema.array() });
    },
    navigation(slug: string) {
      return client.get(`/v1/lessons/next/${slug}`, { responseSchema: lessonNavigationSchema });
    },
    filtersSchema: lessonFilterSchema,
  };
}
