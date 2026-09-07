"use client";

import Link from "next/link";
import { Award, BookOpenCheck, BrainCircuit, Flame, RotateCcw, Trophy } from "lucide-react";
import type { LessonSkill, LessonSummaryDto } from "@/lib/api/contracts/lesson";
import { useLessons } from "@/lib/api/modules/lessons/hooks";
import { useProgress, useResetProgress } from "@/lib/api/modules/progress/hooks";
import { useUnits } from "@/lib/api/modules/units/hooks";
import { buildQuizTrend, buildWeeklyStreak, getSkillMasteryTier, getSkillRecommendation } from "@/lib/progress/analytics";
import { formatArabicNumber } from "@/lib/utils";
import { ApiQueryError } from "@/components/shared/api-query-error";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsStatCard } from "@/components/dashboard/analytics-stat-card";
import { LearnerProgressReport } from "@/components/dashboard/learner-progress-report";
import { MasteryBreakdown } from "@/components/dashboard/mastery-breakdown";
import { OverallProgress } from "@/components/dashboard/overall-progress";
import { QuizTrendHistory } from "@/components/dashboard/quiz-trend-history";
import { RecentLearningActivity } from "@/components/dashboard/recent-learning-activity";
import { SkillCoverageChart } from "@/components/dashboard/skill-coverage-chart";
import { UnitProgressChart } from "@/components/dashboard/unit-progress-chart";

const skillLabels: Record<LessonSkill, string> = {
  alphabet: "الحروف",
  pronunciation: "النطق",
  grammar: "القواعد",
  vocabulary: "المفردات",
  numbers: "الأعداد",
  conversation: "المحادثة",
};

function getLearnerStage(percent: number) {
  if (percent >= 85) return "إتقان قوي";
  if (percent >= 60) return "تقدم ثابت";
  if (percent >= 30) return "بداية ممتازة";
  return "جاهز للانطلاق";
}

export function DashboardShell() {
  const progressQuery = useProgress();
  const lessonsQuery = useLessons({ pageSize: 100 });
  const unitsQuery = useUnits();
  const resetProgress = useResetProgress();

  if (progressQuery.isError) return <ApiQueryError error={progressQuery.error} onRetry={() => progressQuery.refetch()} />;
  if (lessonsQuery.isError) return <ApiQueryError error={lessonsQuery.error} onRetry={() => lessonsQuery.refetch()} />;
  if (unitsQuery.isError) return <ApiQueryError error={unitsQuery.error} onRetry={() => unitsQuery.refetch()} />;

  if (!progressQuery.data || !lessonsQuery.data || !unitsQuery.data) {
    return (
      <div className="space-y-6 py-8 sm:py-10">
        <div className="premium-card h-52 animate-pulse rounded-[2rem]" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="premium-card h-40 animate-pulse rounded-[1.7rem]" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="premium-card h-96 animate-pulse rounded-[1.9rem]" />
          <div className="premium-card h-96 animate-pulse rounded-[1.9rem]" />
        </div>
      </div>
    );
  }

  const progress = progressQuery.data;
  const lessons = [...lessonsQuery.data.items].sort((left, right) => left.number - right.number);
  const units = unitsQuery.data;

  const completed = lessons.filter((lesson) => progress.completedLessons.includes(lesson.id));
  const percent = lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0;
  const learnerStage = getLearnerStage(percent);
  const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));

  const scoreEntries = Object.entries(progress.quizScores)
    .map(([lessonId, score]) => {
      const lesson = lessonMap.get(lessonId);
      return lesson ? { lesson, score } : null;
    })
    .filter((entry): entry is { lesson: LessonSummaryDto; score: (typeof progress.quizScores)[string] } => Boolean(entry))
    .sort((left, right) => right.score.bestScore - left.score.bestScore);

  const totalAttempts = scoreEntries.reduce((sum, entry) => sum + entry.score.attempts, 0);
  const averageBest = scoreEntries.length
    ? Math.round(scoreEntries.reduce((sum, entry) => sum + entry.score.bestScore, 0) / scoreEntries.length)
    : 0;
  const averageLast = scoreEntries.length
    ? Math.round(scoreEntries.reduce((sum, entry) => sum + entry.score.lastScore, 0) / scoreEntries.length)
    : 0;
  const masteredCount = scoreEntries.filter((entry) => entry.score.bestScore >= 85).length;

  const unitProgress = units
    .map((unit) => {
      const unitLessons = lessons.filter((lesson) => lesson.unitId === unit.id);
      const completedLessons = unitLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
      const unitScoreEntries = unitLessons
        .map((lesson) => progress.quizScores[lesson.id])
        .filter((score): score is NonNullable<(typeof progress.quizScores)[string]> => Boolean(score));

      return {
        ...unit,
        completedLessons,
        percent: unitLessons.length ? Math.round((completedLessons / unitLessons.length) * 100) : 0,
        averageBest: unitScoreEntries.length
          ? Math.round(unitScoreEntries.reduce((sum, score) => sum + score.bestScore, 0) / unitScoreEntries.length)
          : null,
      };
    })
    .sort((left, right) => left.order - right.order);

  const skillStats = (Object.entries(skillLabels) as Array<[LessonSkill, string]>).map(([key, label]) => {
    const relevantLessons = lessons.filter((lesson) => lesson.skillFocus.includes(key));
    const completedLessons = relevantLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
    const attemptedLessons = relevantLessons.filter((lesson) => Boolean(progress.quizScores[lesson.id]));
    const averageSkillBest = attemptedLessons.length
      ? Math.round(
          attemptedLessons.reduce((sum, lesson) => sum + (progress.quizScores[lesson.id]?.bestScore ?? 0), 0) /
            attemptedLessons.length,
        )
      : null;
    const completionPercent = relevantLessons.length ? Math.round((completedLessons / relevantLessons.length) * 100) : 0;
    const masteryPercent = averageSkillBest !== null ? Math.round(averageSkillBest * 0.72 + completionPercent * 0.28) : completionPercent;
    const weakestLesson = [...attemptedLessons].sort(
      (left, right) => (progress.quizScores[left.id]?.lastScore ?? 0) - (progress.quizScores[right.id]?.lastScore ?? 0),
    )[0];
    const nextLesson = relevantLessons.find((lesson) => !progress.completedLessons.includes(lesson.id));
    const masteryTier = getSkillMasteryTier({
      completionPercent,
      averageBest: averageSkillBest,
      attemptedLessons: attemptedLessons.length,
      totalLessons: relevantLessons.length,
    });
    const recommendation = getSkillRecommendation({
      skill: key,
      tier: masteryTier,
      attemptedLessons: attemptedLessons.length,
      averageBest: averageSkillBest,
      nextLesson,
      weakestLesson,
    });

    return {
      key,
      label,
      totalLessons: relevantLessons.length,
      completedLessons,
      attemptedLessons: attemptedLessons.length,
      completionPercent,
      averageBest: averageSkillBest,
      masteryPercent,
      masteryTier,
      thresholdLabel:
        masteryTier === "mastered"
          ? "85%+ مع إنجاز فعلي جيد"
          : masteryTier === "building"
            ? "70%+ أو تقدم واضح"
            : "تحتاج جلسات مراجعة أقرب",
      recommendationTitle: recommendation.title,
      recommendation: recommendation.description,
      recommendedLesson: recommendation.lesson,
      recommendedLessonAction: recommendation.actionLabel,
    };
  });

  const recentEntries = [...scoreEntries]
    .sort((left, right) => new Date(right.score.lastAttemptAt).getTime() - new Date(left.score.lastAttemptAt).getTime())
    .slice(0, 4);

  const weeklyStreak = buildWeeklyStreak(progress.activityLog);
  const lastSevenStart = new Date();
  lastSevenStart.setHours(0, 0, 0, 0);
  lastSevenStart.setDate(lastSevenStart.getDate() - 6);
  const attemptsThisWeek = progress.quizHistory.filter((entry) => new Date(entry.completedAt) >= lastSevenStart).length;
  const quizTrend = buildQuizTrend(progress.quizHistory, lessonMap);

  const lastVisited = progress.lastVisitedLessonId ? lessonMap.get(progress.lastVisitedLessonId) : undefined;
  const strongestSkills = [...skillStats].sort((left, right) => right.masteryPercent - left.masteryPercent).slice(0, 3);
  const focusSkills = [...skillStats]
    .filter((skill) => skill.masteryTier !== "mastered")
    .sort((left, right) => left.masteryPercent - right.masteryPercent)
    .slice(0, 3);
  const reportRecommendations = [
    ...focusSkills.map((skill) =>
      `${skill.label}: ${skill.recommendation}${skill.recommendedLesson ? ` — ${skill.recommendedLessonAction ?? "الدرس المقترح"}: ${skill.recommendedLesson.title}` : ""}`,
    ),
    ...(weeklyStreak.currentStreak < 3 ? [`ارفع وتيرة الأسبوع القادم إلى 3 أيام نشطة على الأقل للحفاظ على التعلم المتدرج.`] : []),
  ].slice(0, 4);

  return (
    <div className="py-8 sm:py-10">
      <div className="space-y-6 print:hidden">
        <PageHeader
          title="لوحة التقدم والتحليلات"
          description="مؤشرات مرئية لتقدمك، نتائجك، وسلوك التعلم الأسبوعي عبر الوحدات والمهارات والاختبارات."
          eyebrow="متابعة التعلم"
        />

        <OverallProgress
          percent={percent}
          completedLessons={completed.length}
          totalLessons={lessons.length}
          attemptedLessons={scoreEntries.length}
          averageBest={averageBest}
          weeklyStreak={weeklyStreak.currentStreak}
          weeklyActiveDays={weeklyStreak.activeDays}
          bestWeek={weeklyStreak.bestWindow}
          streakDays={weeklyStreak.days}
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <AnalyticsStatCard
            label="الدروس المكتملة"
            value={formatArabicNumber(completed.length)}
            subtitle="عدد الدروس التي وصلت فيها إلى مرحلة الإنهاء أو حفظ النتيجة."
            icon={<Award className="size-5 text-sky-600 dark:text-sky-400" />}
            accent="from-sky-500/25 via-cyan-500/15 to-transparent"
          />
          <AnalyticsStatCard
            label="إجمالي المحاولات"
            value={formatArabicNumber(totalAttempts)}
            subtitle="كل محاولة اختبار تمنحك إشارة أوضح عن مدى ثباتك في التذكر."
            icon={<BrainCircuit className="size-5 text-violet-600 dark:text-violet-400" />}
            accent="from-violet-500/25 via-fuchsia-500/15 to-transparent"
          />
          <AnalyticsStatCard
            label="متوسط أفضل النتائج"
            value={`${formatArabicNumber(averageBest)}%`}
            subtitle="أفضل أداء وصلت إليه عبر الدروس التي جربت اختباراتها."
            icon={<Trophy className="size-5 text-amber-500" />}
            accent="from-amber-500/25 via-orange-500/15 to-transparent"
          />
          <AnalyticsStatCard
            label="السلسلة الحالية"
            value={`${formatArabicNumber(weeklyStreak.currentStreak)} يوم`}
            subtitle={`نشطت خلال ${formatArabicNumber(weeklyStreak.activeDays)} من آخر 7 أيام، وأفضل أسبوع لك ${formatArabicNumber(weeklyStreak.bestWindow)} أيام.`}
            icon={<Flame className="size-5 text-rose-600 dark:text-rose-400" />}
            accent="from-rose-500/25 via-orange-500/15 to-transparent"
          />
          <AnalyticsStatCard
            label="دروس متقنة"
            value={formatArabicNumber(masteredCount)}
            subtitle="الدروس التي حققت فيها 85% أو أكثر في أفضل نتيجة محفوظة."
            icon={<BookOpenCheck className="size-5 text-emerald-600 dark:text-emerald-400" />}
            accent="from-emerald-500/25 via-teal-500/15 to-transparent"
          />
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
          <UnitProgressChart units={unitProgress} />
          <MasteryBreakdown
            scoreEntries={scoreEntries}
            averageBest={averageBest}
            averageLast={averageLast}
            totalAttempts={totalAttempts}
          />
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1fr_1fr]">
          <QuizTrendHistory trend={quizTrend} attemptsThisWeek={attemptsThisWeek} />
          <SkillCoverageChart skills={skillStats} />
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1fr_0.92fr]">
          <RecentLearningActivity recentEntries={recentEntries} lastVisited={lastVisited} updatedAt={progress.updatedAt} />
          <section className="premium-card-strong rounded-[1.8rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">الدروس المكتملة</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">بطاقات سريعة للعودة إلى ما أنهيته ومراجعته مرة أخرى.</p>
              </div>
              <button
                type="button"
                onClick={() => resetProgress.mutate()}
                className="button-shine pressable inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-red-300 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-red-900 dark:hover:text-red-300"
              >
                <RotateCcw className="size-3.5" />
                إعادة التقدم
              </button>
            </div>

            {completed.length ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {completed.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.slug}`}
                    className="interactive-lift rounded-[1.35rem] border border-white/70 bg-white/75 px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-sky-900/50"
                  >
                    <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">{lesson.unitTitle}</p>
                    <p className="mt-2 font-bold text-slate-950 dark:text-white">{lesson.title}</p>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{lesson.duration} دقيقة — {lesson.level}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="لم تبدأ بعد"
                description="ابدأ من الدرس الأول أو ادخل إلى أي وحدة تعجبك، وستبدأ التحليلات بالظهور هنا تلقائياً."
                action={<Link href="/lessons" className="button-shine pressable rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white">ابدأ التعلم</Link>}
              />
            )}
          </section>
        </div>

        <section className="premium-card-strong rounded-[1.8rem] p-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">أفضل الدرجات</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">لوحة ترتيب صغيرة تساعدك على معرفة أقوى نتائجك الحالية.</p>

          {scoreEntries.length ? (
            <div className="mt-5 grid gap-3 xl:grid-cols-2">
              {scoreEntries.slice(0, 6).map((entry, index) => (
                <div key={entry.lesson.id} className="rounded-[1.35rem] border border-white/70 bg-white/75 px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">المركز {index + 1}</p>
                      <Link href={`/lessons/${entry.lesson.slug}`} className="mt-2 block font-bold text-slate-950 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
                        {entry.lesson.title}
                      </Link>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">أفضل نتيجة: {entry.score.bestScore}% — المحاولات: {entry.score.attempts}</p>
                    </div>
                    <div className="rounded-full bg-amber-100 px-3 py-2 text-sm font-black text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                      {entry.score.bestScore}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">لا توجد نتائج محفوظة بعد. جرّب أول اختبار لتبدأ لوحة الأداء.</p>
          )}
        </section>
      </div>

      <div className="mt-6 print:mt-0">
        <LearnerProgressReport
          learnerStage={learnerStage}
          startedAt={progress.startedAt}
          updatedAt={progress.updatedAt}
          percent={percent}
          completedLessons={completed.length}
          totalLessons={lessons.length}
          averageBest={averageBest}
          totalAttempts={totalAttempts}
          weeklyStreak={weeklyStreak.currentStreak}
          activeDaysThisWeek={weeklyStreak.activeDays}
          strongestSkills={strongestSkills}
          focusSkills={focusSkills}
          unitProgress={unitProgress}
          topResults={scoreEntries.slice(0, 5)}
          recommendations={reportRecommendations.length ? reportRecommendations : ["ابدأ أول اختبارين على الأقل لتوليد توصيات أدق داخل التقرير."]}
        />
      </div>
    </div>
  );
}
