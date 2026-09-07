export interface LessonScoreDto {
  bestScore: number;
  attempts: number;
  lastScore: number;
  lastAttemptAt: string;
}

export interface QuizHistoryEntryDto {
  attemptId: string;
  lessonId: string;
  score: number;
  total: number;
  percent: number;
  correctCount: number;
  incorrectCount: number;
  completedAt: string;
}

export interface LearningActivityEntryDto {
  id: string;
  lessonId: string;
  type: "visit" | "complete" | "quiz";
  occurredAt: string;
  percent?: number;
}

export interface ProgressDto {
  version: 1;
  startedAt: string;
  completedLessons: string[];
  quizScores: Record<string, LessonScoreDto>;
  quizHistory: QuizHistoryEntryDto[];
  activityLog: LearningActivityEntryDto[];
  lastVisitedLessonId?: string;
  updatedAt: string;
}
