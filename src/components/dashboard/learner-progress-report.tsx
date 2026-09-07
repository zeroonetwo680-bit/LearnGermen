"use client";

import Link from "next/link";
import { Download, Printer, Sparkles } from "lucide-react";
import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";
import type { SkillCoverageVisual } from "@/components/dashboard/skill-coverage-chart";
import type { UnitProgressVisual } from "@/components/dashboard/unit-progress-chart";

interface ReportScoreEntry {
  lesson: LessonSummaryDto;
  score: {
    bestScore: number;
    attempts: number;
    lastScore: number;
    lastAttemptAt: string;
  };
}

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function LearnerProgressReport({
  learnerStage,
  startedAt,
  updatedAt,
  percent,
  completedLessons,
  totalLessons,
  averageBest,
  totalAttempts,
  weeklyStreak,
  activeDaysThisWeek,
  strongestSkills,
  focusSkills,
  unitProgress,
  topResults,
  recommendations,
}: {
  learnerStage: string;
  startedAt: string;
  updatedAt: string;
  percent: number;
  completedLessons: number;
  totalLessons: number;
  averageBest: number;
  totalAttempts: number;
  weeklyStreak: number;
  activeDaysThisWeek: number;
  strongestSkills: SkillCoverageVisual[];
  focusSkills: SkillCoverageVisual[];
  unitProgress: UnitProgressVisual[];
  topResults: ReportScoreEntry[];
  recommendations: string[];
}) {
  return (
    <section className="premium-card-strong rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/60 dark:bg-slate-950 dark:shadow-black/30 print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 print:hidden lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="section-kicker">
            <Download className="size-3.5" />
            تقرير قابل للطباعة
          </div>
          <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">تقرير تقدّم المتعلم</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">ملخص نظيف للطباعة أو الحفظ كملف PDF لمراجعة الحالة الحالية وخطة الخطوة التالية.</p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="button-shine pressable inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
        >
          <Printer className="size-4" />
          طباعة التقرير
        </button>
      </div>

      <div className="print-report mt-6 rounded-[1.8rem] border border-slate-200 bg-white p-6 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white print:mt-0 print:rounded-none print:border-0 print:bg-white print:p-0 print:text-slate-900">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 print:flex-row print:items-start print:justify-between">
          <div>
            <p className="text-sm font-bold text-sky-700 print:text-slate-600">منصة تعلم الألمانية</p>
            <h3 className="mt-2 text-3xl font-black">تقرير تقدم المتعلم</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 print:text-slate-700">
              هذا التقرير يلخص مستوى التقدم الحالي، اتجاه نتائج الاختبارات، والمهارات التي تحتاج متابعة أو تستحق الانتقال إلى تحديات أعلى.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-slate-600 print:min-w-56 print:text-slate-700">
            <p>تاريخ البداية: {formatDate(startedAt)}</p>
            <p>آخر تحديث: {formatDate(updatedAt)}</p>
            <p>مرحلة التعلم: {learnerStage}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-4">
          <ReportMetric label="نسبة الإنجاز" value={`${percent}%`} helper={`${completedLessons} من ${totalLessons} درس`} />
          <ReportMetric label="متوسط أفضل نتيجة" value={`${averageBest}%`} helper="أفضل أداء عبر الاختبارات" />
          <ReportMetric label="المحاولات الكلية" value={String(totalAttempts)} helper="كل محاولات الاختبارات المسجلة" />
          <ReportMetric label="نشاط هذا الأسبوع" value={`${activeDaysThisWeek}/7`} helper={`سلسلة حالية ${weeklyStreak} يوم`} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr] print:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.5rem] bg-slate-50 p-5 dark:bg-slate-900/60 print:border print:border-slate-200 print:bg-white">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 print:text-slate-900">
              <Sparkles className="size-4 text-amber-500" />
              نقاط القوة الحالية
            </div>
            <div className="mt-4 space-y-3">
              {strongestSkills.length ? strongestSkills.map((skill) => (
                <div key={skill.key} className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 print:break-inside-avoid">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{skill.label}</p>
                    <span className="text-sm font-black">{skill.masteryPercent}%</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600 print:text-slate-700">{skill.recommendation}</p>
                </div>
              )) : <p className="text-sm text-slate-600 print:text-slate-700">لا توجد مهارات بارزة بعد، لكن ذلك سيتضح فور تراكم محاولات أكثر.</p>}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-50 p-5 dark:bg-slate-900/60 print:border print:border-slate-200 print:bg-white">
            <p className="text-sm font-bold text-slate-900 print:text-slate-900">أولويات المتابعة</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 print:text-slate-700">
              {recommendations.map((item) => (
                <li key={item} className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 print:break-inside-avoid">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2 print:grid-cols-2">
          <div className="rounded-[1.5rem] bg-slate-50 p-5 dark:bg-slate-900/60 print:border print:border-slate-200 print:bg-white">
            <p className="text-sm font-bold text-slate-900 print:text-slate-900">الوحدات حسب التقدم</p>
            <div className="mt-4 space-y-3">
              {unitProgress.map((unit) => (
                <div key={unit.id} className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 print:break-inside-avoid">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{unit.title}</p>
                    <span className="text-sm font-black">{unit.percent}%</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 print:text-slate-700">{unit.completedLessons} من {unit.lessonCount} دروس — متوسط الاختبارات {unit.averageBest !== null ? `${unit.averageBest}%` : "غير متوفر"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-50 p-5 dark:bg-slate-900/60 print:border print:border-slate-200 print:bg-white">
            <p className="text-sm font-bold text-slate-900 print:text-slate-900">أفضل النتائج المسجلة</p>
            <div className="mt-4 space-y-3">
              {topResults.length ? topResults.map((entry, index) => (
                <div key={entry.lesson.id} className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 print:break-inside-avoid">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{index + 1}. {entry.lesson.title}</p>
                    <span className="text-sm font-black">{entry.score.bestScore}%</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 print:text-slate-700">آخر نتيجة {entry.score.lastScore}% — عدد المحاولات {entry.score.attempts}</p>
                </div>
              )) : <p className="text-sm text-slate-600 print:text-slate-700">لا توجد نتائج محفوظة بعد.</p>}
            </div>
          </div>
        </div>

        {focusSkills.length ? (
          <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5 dark:bg-slate-900/60 print:border print:border-slate-200 print:bg-white">
            <p className="text-sm font-bold text-slate-900 print:text-slate-900">مهارات تحتاج دعماً أكبر</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 print:grid-cols-2">
              {focusSkills.map((skill) => (
                <div key={skill.key} className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 print:break-inside-avoid">
                  <p className="font-bold">{skill.label}</p>
                  <p className="mt-2 text-sm text-slate-600 print:text-slate-700">{skill.recommendation}</p>
                  {skill.recommendedLesson ? (
                    <p className="mt-2 text-xs font-semibold text-slate-500 print:text-slate-600">الدرس المقترح: {skill.recommendedLesson.title}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 border-t border-slate-200 pt-4 text-xs leading-6 text-slate-500 print:text-slate-600">
          <p>يمكنك حفظ هذا التقرير كملف PDF من نافذة الطباعة للاحتفاظ بسجل تقدّمك أو مشاركته مع المدرّس.</p>
          <p className="mt-1 print:hidden">وللاستمرار مباشرة من المنصة، افتح لوحة التقدم أو ارجع إلى قائمة الدروس.</p>
          <div className="mt-3 flex flex-wrap gap-3 print:hidden">
            <Link href="/dashboard" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200">لوحة التقدم</Link>
            <Link href="/lessons" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-950">كل الدروس</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReportMetric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/60 print:break-inside-avoid print:bg-white">
      <p className="text-xs font-semibold text-slate-500 print:text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      <p className="mt-2 text-xs text-slate-500 print:text-slate-600">{helper}</p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormatter.format(date);
}
