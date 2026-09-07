"use client";

import Link from "next/link";
import { Award, Clock3, RotateCcw, Trophy } from "lucide-react";
import { useLessons } from "@/lib/api/modules/lessons/hooks";
import { useProgress, useResetProgress } from "@/lib/api/modules/progress/hooks";
import { ApiQueryError } from "@/components/shared/api-query-error";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { OverallProgress } from "@/components/dashboard/overall-progress";

export function DashboardShell() {
  const progressQuery = useProgress();
  const lessonsQuery = useLessons({ pageSize: 100 });
  const resetProgress = useResetProgress();

  if (progressQuery.isError) return <ApiQueryError error={progressQuery.error} onRetry={() => progressQuery.refetch()} />;
  if (lessonsQuery.isError) return <ApiQueryError error={lessonsQuery.error} onRetry={() => lessonsQuery.refetch()} />;
  if (!progressQuery.data || !lessonsQuery.data) return <div className="premium-card h-60 animate-pulse rounded-[2rem]" />;

  const lessons = lessonsQuery.data.items;
  const completed = lessons.filter((lesson) => progressQuery.data.completedLessons.includes(lesson.id));
  const percent = lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0;
  const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const scoreEntries = Object.entries(progressQuery.data.quizScores)
    .map(([lessonId, score]) => ({ lesson: lessonMap.get(lessonId), score }))
    .filter((item) => item.lesson)
    .sort((a, b) => b.score.bestScore - a.score.bestScore);

  const lastVisited = progressQuery.data.lastVisitedLessonId ? lessonMap.get(progressQuery.data.lastVisitedLessonId) : undefined;

  return (
    <div className="py-8 sm:py-10">
      <PageHeader title="لوحة التقدم" description="تابع دروسك المكتملة، أفضل درجاتك، واستأنف من حيث توقفت." eyebrow="متابعة التعلم" />
      <div className="space-y-6">
        <OverallProgress percent={percent} />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="premium-card rounded-[1.6rem] p-5">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200"><Award className="size-5 text-sky-600 dark:text-sky-400" /><span className="text-sm font-semibold">الدروس المكتملة</span></div>
            <p className="mt-4 text-4xl font-black text-slate-900 dark:text-white">{completed.length}</p>
          </div>
          <div className="premium-card rounded-[1.6rem] p-5">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200"><Trophy className="size-5 text-amber-500" /><span className="text-sm font-semibold">أفضل الاختبارات</span></div>
            <p className="mt-4 text-4xl font-black text-slate-900 dark:text-white">{scoreEntries.length}</p>
          </div>
          <div className="premium-card rounded-[1.6rem] p-5">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200"><Clock3 className="size-5 text-emerald-500" /><span className="text-sm font-semibold">آخر توقف</span></div>
            <p className="mt-4 text-base font-black text-slate-900 dark:text-white">{lastVisited?.title ?? "لا يوجد بعد"}</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="premium-card-strong rounded-[1.8rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">الدروس المكتملة</h2>
              <button
                type="button"
                onClick={() => resetProgress.mutate()}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-red-300 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-red-900 dark:hover:text-red-300"
              >
                <RotateCcw className="size-3.5" />
                إعادة التقدم
              </button>
            </div>
            {completed.length ? (
              <ul className="mt-4 space-y-3">
                {completed.map((lesson) => (
                  <li key={lesson.id} className="rounded-[1.2rem] border border-white/70 bg-white/75 px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                    <Link href={`/lessons/${lesson.slug}`} className="font-semibold text-slate-900 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
                      {lesson.title}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lesson.unitTitle}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="لم تبدأ بعد" description="ابدأ من الدرس الأول أو ادخل إلى أي وحدة تعجبك." action={<Link href="/lessons" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white">ابدأ التعلم</Link>} />
            )}
          </section>

          <div className="space-y-6">
            <section className="premium-card-strong rounded-[1.8rem] p-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">أفضل الدرجات</h2>
              {scoreEntries.length ? (
                <ul className="mt-4 space-y-3">
                  {scoreEntries.slice(0, 5).map((entry) => (
                    <li key={entry.lesson!.id} className="rounded-[1.2rem] border border-white/70 bg-white/75 px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                      <Link href={`/lessons/${entry.lesson!.slug}`} className="font-semibold text-slate-900 dark:text-white">
                        {entry.lesson!.title}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">أفضل نتيجة: {entry.score.bestScore}% — المحاولات: {entry.score.attempts}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">لا توجد نتائج محفوظة بعد.</p>
              )}
            </section>

            <section className="premium-card-strong rounded-[1.8rem] p-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">أكمل من حيث توقفت</h2>
              {lastVisited ? (
                <div className="mt-4 rounded-[1.4rem] bg-[linear-gradient(135deg,#082f49_0%,#0f4c81_50%,#0891b2_100%)] p-5 text-white shadow-xl shadow-sky-900/20">
                  <p className="font-semibold text-white">{lastVisited.title}</p>
                  <p className="mt-2 text-sm leading-7 text-sky-50/90">آخر درس دخلته داخل المنصة.</p>
                  <Link href={`/lessons/${lastVisited.slug}`} className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-900">
                    متابعة الدرس
                  </Link>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">لم تقم بزيارة أي درس بعد.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
