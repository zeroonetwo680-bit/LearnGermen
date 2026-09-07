import type { ProgressDto } from "@/lib/api/contracts/progress";
import type { QuizResultDto } from "@/lib/api/contracts/question";
import { progressSchema } from "@/lib/api/schemas/course";
import { readStorage, writeStorage } from "@/lib/progress/storage";
import type { ProgressRepository } from "@/lib/progress/progress-repository";

const STORAGE_KEY = "learngerman-progress-v1";

function createDefaultProgress(): ProgressDto {
  return {
    version: 1,
    completedLessons: [],
    quizScores: {},
    updatedAt: new Date().toISOString(),
  };
}

function readProgress() {
  return readStorage(STORAGE_KEY, progressSchema, createDefaultProgress());
}

function writeProgress(progress: ProgressDto) {
  writeStorage(STORAGE_KEY, progress);
  return progress;
}

export function createLocalProgressRepository(): ProgressRepository {
  return {
    async get() {
      return readProgress();
    },
    async markLessonCompleted(lessonId: string) {
      const progress = readProgress();
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
      progress.updatedAt = new Date().toISOString();
      return writeProgress(progress);
    },
    async saveQuizResult(lessonId: string, result: QuizResultDto) {
      const progress = readProgress();
      const existing = progress.quizScores[lessonId];
      progress.quizScores[lessonId] = {
        bestScore: Math.max(existing?.bestScore ?? 0, result.percent),
        attempts: (existing?.attempts ?? 0) + 1,
        lastScore: result.percent,
        lastAttemptAt: result.completedAt,
      };
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
      progress.updatedAt = new Date().toISOString();
      return writeProgress(progress);
    },
    async setLastVisitedLesson(lessonId: string) {
      const progress = readProgress();
      progress.lastVisitedLessonId = lessonId;
      progress.updatedAt = new Date().toISOString();
      return writeProgress(progress);
    },
    async reset() {
      return writeProgress(createDefaultProgress());
    },
  };
}
