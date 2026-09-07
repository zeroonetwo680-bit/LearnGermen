import type { ProgressDto } from "@/lib/api/contracts/progress";
import type { QuizResultDto } from "@/lib/api/contracts/question";
import { progressSchema } from "@/lib/api/schemas/course";
import { readStorage, writeStorage } from "@/lib/progress/storage";
import type { ProgressRepository } from "@/lib/progress/progress-repository";

const STORAGE_KEY = "learngerman-progress-v1";
const MAX_QUIZ_HISTORY = 60;
const MAX_ACTIVITY_LOG = 160;

function createDefaultProgress(): ProgressDto {
  const now = new Date().toISOString();
  return {
    version: 1,
    startedAt: now,
    completedLessons: [],
    quizScores: {},
    quizHistory: [],
    activityLog: [],
    updatedAt: now,
  };
}

function limitRecentEntries<T extends { completedAt?: string; occurredAt?: string }>(entries: T[], maxEntries: number) {
  return [...entries]
    .sort((left, right) => {
      const leftValue = left.completedAt ?? left.occurredAt ?? "";
      const rightValue = right.completedAt ?? right.occurredAt ?? "";
      return new Date(rightValue).getTime() - new Date(leftValue).getTime();
    })
    .slice(0, maxEntries);
}

function hydrateProgress(progress: ReturnType<typeof progressSchema.parse>): ProgressDto {
  const quizHistory = progress.quizHistory?.length
    ? limitRecentEntries(progress.quizHistory, MAX_QUIZ_HISTORY)
    : Object.entries(progress.quizScores)
        .map(([lessonId, score]) => ({
          attemptId: `legacy-${lessonId}`,
          lessonId,
          score: score.lastScore,
          total: 100,
          percent: score.lastScore,
          correctCount: score.lastScore,
          incorrectCount: Math.max(0, 100 - score.lastScore),
          completedAt: score.lastAttemptAt,
        }))
        .sort((left, right) => new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime())
        .slice(0, MAX_QUIZ_HISTORY);

  const activityLog = progress.activityLog?.length
    ? limitRecentEntries(progress.activityLog, MAX_ACTIVITY_LOG)
    : quizHistory.map((entry) => ({
        id: `legacy-quiz-${entry.attemptId}`,
        lessonId: entry.lessonId,
        type: "quiz" as const,
        occurredAt: entry.completedAt,
        percent: entry.percent,
      }));

  return {
    version: 1,
    startedAt: progress.startedAt ?? progress.updatedAt ?? new Date().toISOString(),
    completedLessons: [...new Set(progress.completedLessons)],
    quizScores: progress.quizScores,
    quizHistory,
    activityLog,
    lastVisitedLessonId: progress.lastVisitedLessonId,
    updatedAt: progress.updatedAt,
  };
}

function readProgress() {
  const fallback = createDefaultProgress();
  const parsed = readStorage(STORAGE_KEY, progressSchema, fallback);
  return hydrateProgress(parsed);
}

function writeProgress(progress: ProgressDto) {
  const hydrated = hydrateProgress(progress);
  writeStorage(STORAGE_KEY, hydrated);
  return hydrated;
}

function logActivity(progress: ProgressDto, entry: ProgressDto["activityLog"][number]) {
  progress.activityLog = limitRecentEntries([entry, ...progress.activityLog], MAX_ACTIVITY_LOG);
}

export function createLocalProgressRepository(): ProgressRepository {
  return {
    async get() {
      return readProgress();
    },
    async markLessonCompleted(lessonId: string) {
      const progress = readProgress();
      const isNewCompletion = !progress.completedLessons.includes(lessonId);
      if (isNewCompletion) {
        progress.completedLessons.push(lessonId);
        logActivity(progress, {
          id: `complete-${lessonId}-${Date.now()}`,
          lessonId,
          type: "complete",
          occurredAt: new Date().toISOString(),
        });
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

      progress.quizHistory = limitRecentEntries(
        [
          {
            attemptId: result.attemptId,
            lessonId,
            score: result.score,
            total: result.total,
            percent: result.percent,
            correctCount: result.correctCount,
            incorrectCount: result.incorrectCount,
            completedAt: result.completedAt,
          },
          ...progress.quizHistory,
        ],
        MAX_QUIZ_HISTORY,
      );

      logActivity(progress, {
        id: `quiz-${result.attemptId}`,
        lessonId,
        type: "quiz",
        occurredAt: result.completedAt,
        percent: result.percent,
      });

      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
      progress.updatedAt = new Date().toISOString();
      return writeProgress(progress);
    },
    async setLastVisitedLesson(lessonId: string) {
      const progress = readProgress();
      progress.lastVisitedLessonId = lessonId;
      const occurredAt = new Date().toISOString();
      logActivity(progress, {
        id: `visit-${lessonId}-${Date.now()}`,
        lessonId,
        type: "visit",
        occurredAt,
      });
      progress.updatedAt = occurredAt;
      return writeProgress(progress);
    },
    async reset() {
      return writeProgress(createDefaultProgress());
    },
  };
}
