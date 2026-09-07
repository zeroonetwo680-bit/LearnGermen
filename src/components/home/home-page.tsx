"use client";

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
  if (!homeQuery.data || !unitsQuery.data || !lessonsQuery.data) return <PageContainer className="py-10"><div className="h-72 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" /></PageContainer>;

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
      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">لماذا هذه المنصة؟</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {homeQuery.data.benefits.map((benefit) => (
            <li key={benefit} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
              {benefit}
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
