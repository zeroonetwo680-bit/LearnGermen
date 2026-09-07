import type { QuestionDto, QuizResultDto } from "@/lib/api/contracts/question";
import { setEquals } from "@/lib/utils";

export function gradeQuiz(
  questions: QuestionDto[],
  answers: Record<string, string[]>,
  lessonIdOverride?: string,
): QuizResultDto {
  let score = 0;
  let correctCount = 0;

  const gradedAnswers = questions.map((question) => {
    const selectedOptionIds = answers[question.id] ?? [];
    const isCorrect =
      question.type === "multiple-choice"
        ? setEquals(selectedOptionIds, question.correctAnswers)
        : selectedOptionIds.length === 1 && selectedOptionIds[0] === question.correctAnswers[0];

    if (isCorrect) {
      score += question.points;
      correctCount += 1;
    }

    return {
      questionId: question.id,
      selectedOptionIds,
      correctOptionIds: question.correctAnswers,
      isCorrect,
      explanation: question.explanation,
    };
  });

  const total = questions.reduce((sum, question) => sum + question.points, 0);
  const incorrectCount = questions.length - correctCount;

  return {
    attemptId: `attempt-${Date.now()}`,
    lessonId: lessonIdOverride ?? questions[0]?.lessonId ?? "",
    score,
    total,
    percent: total === 0 ? 0 : Math.round((score / total) * 100),
    correctCount,
    incorrectCount,
    answers: gradedAnswers,
    completedAt: new Date().toISOString(),
  };
}
