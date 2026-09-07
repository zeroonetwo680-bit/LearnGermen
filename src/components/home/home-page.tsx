"use client";

import { ArrowUpLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useHomeContent } from "@/lib/api/modules/home/hooks";
import { useLessons } from "@/lib/api/modules/lessons/hooks";
import { useUnits } from "@/lib/api/modules/units/hooks";
import { ApiQueryError } from "@/components/shared/api-query-error";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { FeaturesSection } from "@/components/home/features-section";
import { FeaturedLessonsSection } from "@/components/home/featured-lessons-section";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { UnitsSection } from "@/components/home/units-section";

export function HomePage() {
  const homeQuery = useHomeContent();
  const unitsQuery = useUnits();
  const lessonsQuery = useLessons({ pageSize: 4, sort: "default" });

  if (homeQuery.isError) return <PageContainer className="py-10"><ApiQueryError error={homeQuery.error} onRetry={() => homeQuery.refetch()} /></PageContainer>;
  if (unitsQuery.isError) return <PageContainer className="py-10"><ApiQueryError error={unitsQuery.error} onRetry={() => unitsQuery.refetch()} /></PageContainer>;
  if (lessonsQuery.isError) return <PageContainer className="py-10"><ApiQueryError error={lessonsQuery.error} onRetry={() => lessonsQuery.refetch()} /></PageContainer>;
  if (!homeQuery.data || !unitsQuery.data || !lessonsQuery.data) {
    return (
      <PageContainer className="py-10">
        <div className="premium-card h-80 animate-pulse rounded-[2rem]" />
      </PageContainer>
    );
  }

  const lessonCount = lessonsQuery.data.meta.total;
  const vocabularyCount = unitsQuery.data.reduce((sum, unit) => sum + unit.vocabularyCount, 0);
  const exerciseCount = unitsQuery.data.reduce((sum, unit) => sum + unit.exerciseCount, 0);

  return (
    <PageContainer className="space-y-10 py-8 sm:py-10">
      <HeroSection content={homeQuery.data} />
      <StatsSection
        lessonCount={lessonCount}
        vocabularyCount={vocabularyCount}
        exerciseCount={exerciseCount}
        unitCount={unitsQuery.data.length}
      />

      <section className="premium-card-strong grid gap-6 rounded-[2rem] px-6 py-7 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="section-kicker">لماذا هذه المنصة؟</span>
          <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">مذاكرة أسهل، أوضح، وأكثر تنظيمًا</h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300">
            أخذنا محتوى الكتاب، ثم أعدنا ترتيبه في تجربة تعلم حديثة: تبدأ بالشرح، ثم المفردات، ثم التمرين، ثم الاختبار والمراجعة.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/lessons" className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sky-700">
              ابدأ بأول درس
              <ArrowUpLeft className="size-4" />
            </Link>
            <Link href="/dashboard" className="rounded-full border border-slate-300 bg-white/70 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-sky-800 dark:hover:text-sky-400">
              راقب تقدمك
            </Link>
          </div>
        </div>

        <ul className="grid gap-3 md:grid-cols-2">
          {homeQuery.data.benefits.map((benefit) => (
            <li key={benefit} className="rounded-[1.5rem] border border-white/60 bg-white/70 px-4 py-4 text-sm leading-7 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500" />
                <span>{benefit}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <UnitsSection units={unitsQuery.data} />
      {lessonsQuery.data.items.length ? (
        <FeaturedLessonsSection lessons={lessonsQuery.data.items} />
      ) : (
        <EmptyState title="لا توجد دروس مميزة الآن" />
      )}
      <FeaturesSection content={homeQuery.data} />
    </PageContainer>
  );
}
