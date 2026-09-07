"use client";

import { useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
      <div className="premium-card-strong rounded-[2rem] p-5">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <QuizProgress current={currentIndex + 1} total={questions.length} />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">تمت الإجابة على {answeredCount} من أصل {questions.length} سؤال.</p>
          </div>
          <div className="rounded-[1.35rem] border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
            <div className="flex items-center gap-2 font-semibold">
              <LayoutGrid className="size-4 text-sky-600 dark:text-sky-400" />
              التنقل السريع
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {questions.map((question, index) => {
                const isAnswered = (answers[question.id] ?? []).length > 0;
                const isCurrent = index === currentIndex;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full text-xs font-bold transition",
                      isCurrent
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : isAnswered
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                    )}
                    aria-label={`الانتقال إلى السؤال ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {gradeQuiz.isError ? <ApiQueryError error={gradeQuiz.error} /> : null}

      <QuestionCard
        question={currentQuestion}
        value={answers[currentQuestion.id] ?? []}
        onChange={(next) => setAnswers((current) => ({ ...current, [currentQuestion.id]: next }))}
        current={currentIndex + 1}
        total={questions.length}
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
