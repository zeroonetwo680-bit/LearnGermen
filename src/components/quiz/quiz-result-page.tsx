"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLessonQuestions } from "@/lib/api/modules/lessons/hooks";
import { readAttemptResult } from "@/lib/quiz/attempt-storage";
import { AnswerReview } from "@/components/quiz/answer-review";
import { QuizResult } from "@/components/quiz/quiz-result";
import { ApiQueryError } from "@/components/shared/api-query-error";
import { EmptyState } from "@/components/shared/empty-state";

export function QuizResultPage({ lessonSlug, attemptId }: { lessonSlug: string; attemptId: string }) {
  const result = useMemo(() => readAttemptResult(attemptId), [attemptId]);
  const questionsQuery = useLessonQuestions(lessonSlug);

  if (!result) {
    return (
      <EmptyState
        title="لم نعثر على هذه المحاولة"
        description="ربما انتهت الجلسة الحالية. يمكنك إعادة حل الاختبار من جديد."
        action={<Link href={`/lessons/${lessonSlug}/quiz`} className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white">العودة للاختبار</Link>}
      />
    );
  }

  if (questionsQuery.isError) return <ApiQueryError error={questionsQuery.error} onRetry={() => questionsQuery.refetch()} />;
  if (!questionsQuery.data) return <div className="h-48 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />;

  return (
    <div className="space-y-6">
      <QuizResult lessonSlug={lessonSlug} result={result} />
      <section>
        <h2 className="mb-4 text-2xl font-black text-slate-900 dark:text-white">مراجعة الإجابات</h2>
        <AnswerReview questions={questionsQuery.data} result={result} />
      </section>
    </div>
  );
}
