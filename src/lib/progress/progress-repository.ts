import { apiConfig } from "@/lib/api/config";
import type { ProgressDto } from "@/lib/api/contracts/progress";
import type { QuizResultDto } from "@/lib/api/contracts/question";
import { createLocalProgressRepository } from "@/lib/progress/local-progress-repository";

export interface ProgressRepository {
  get(): Promise<ProgressDto>;
  markLessonCompleted(lessonId: string): Promise<ProgressDto>;
  saveQuizResult(lessonId: string, result: QuizResultDto): Promise<ProgressDto>;
  setLastVisitedLesson(lessonId: string): Promise<ProgressDto>;
  reset(): Promise<ProgressDto>;
}

export function getProgressRepository(): ProgressRepository {
  if (apiConfig.progressMode === "api") {
    return createLocalProgressRepository();
  }
  return createLocalProgressRepository();
}
