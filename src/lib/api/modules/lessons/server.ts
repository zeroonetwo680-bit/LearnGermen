import "server-only";

import { serverStudentApi } from "@/lib/api/client/scoped-server-client";
import type { LessonFilter } from "@/lib/api/contracts/lesson";

export function listLessonsForServer(filter: LessonFilter = {}) {
  return serverStudentApi.lessons.list(filter);
}

export function getLessonForServer(slug: string) {
  return serverStudentApi.lessons.get(slug);
}

export function getLessonResourcesForServer(slug: string) {
  return serverStudentApi.lessons.resources(slug);
}

export function getLessonVocabularyForServer(slug: string) {
  return serverStudentApi.lessons.vocabulary(slug);
}

export function getLessonExercisesForServer(slug: string) {
  return serverStudentApi.lessons.exercises(slug);
}

export function getLessonQuestionsForServer(slug: string) {
  return serverStudentApi.lessons.questions(slug);
}

export function getLessonQuizForServer(slug: string) {
  return serverStudentApi.lessons.quiz(slug);
}

export function getLessonNavigationForServer(slug: string) {
  return serverStudentApi.lessons.navigation(slug);
}
