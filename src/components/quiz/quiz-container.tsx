"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizQuestionDto } from "@/lib/api/contracts/question";
import { useGradeQuiz } from "@/lib/api/modules/quiz/hooks";
import { useSaveQuizResult } from "@/lib/api/modules/progress/hooks";
import { saveAttemptResult } from "@/lib/quiz/attempt-storage";
import { QuestionCard } from "@/components/quiz/question-card";
import { QuizNavigation } from "@/components/quiz/quiz-navigation";
import { QuizProgress } from "@/components/quiz/quiz-progress";
import { EmptyState } from "@/components/shared/empty-state";
import { ApiQueryError } from "@/components/shared/api-query-error";

export function QuizContainer({ lessonId, lessonSlug, questions }: { lessonId: string; lessonSlug: string; questions: QuizQuestionDto[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const gradeQuiz = useGradeQuiz(lessonSlug);
  const saveQuizResult = useSaveQuizResult();

  const currentQuestion = questions[currentIndex];
  const answeredCount = useMemo(
    () => questions.filter((question) => (answers[question.id] ?? []).length > 0).length,
    [answers, questions],
  );

  if (!questions.length) {
    return <EmptyState title="هذا الدرس لا يحتوي على أسئلة بعد" description="يمكنك مراجعة الشرح والتمارين أولاً ثم العودة لاحقاً." />;
  }

  const submit = async () => {
    const result = await gradeQuiz.mutateAsync({
      lessonId,
      answers,
      startedAt: new Date().toISOString(),
    });
    await saveQuizResult.mutateAsync({ lessonId, result });
    saveAttemptResult(result);
    router.push(`/lessons/${lessonSlug}/quiz/result/${result.attemptId}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <QuizProgress current={currentIndex + 1} total={questions.length} />
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">تمت الإجابة على {answeredCount} من أصل {questions.length} سؤال.</p>
      </div>

      {gradeQuiz.isError ? <ApiQueryError error={gradeQuiz.error} /> : null}

      <QuestionCard
        question={currentQuestion}
        value={answers[currentQuestion.id] ?? []}
        onChange={(next) => setAnswers((current) => ({ ...current, [currentQuestion.id]: next }))}
      />

      <QuizNavigation
        canGoBack={currentIndex > 0}
        canGoNext={currentIndex < questions.length - 1 && (answers[currentQuestion.id] ?? []).length > 0}
        isLast={currentIndex === questions.length - 1}
        onBack={() => setCurrentIndex((value) => Math.max(value - 1, 0))}
        onNext={() => setCurrentIndex((value) => Math.min(value + 1, questions.length - 1))}
        onSubmit={submit}
        isSubmitting={gradeQuiz.isPending || saveQuizResult.isPending}
      />
    </div>
  );
}
