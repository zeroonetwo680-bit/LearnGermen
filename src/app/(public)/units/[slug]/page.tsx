import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import { getUnitForServer, listUnitsForServer } from "@/lib/api/modules/units/server";
import { SiteBreadcrumbs } from "@/components/layout/site-breadcrumbs";
import { LessonGrid } from "@/components/lessons/lesson-grid";
import { PageContainer } from "@/components/shared/page-container";
import { UnitHero } from "@/components/units/unit-hero";
import { UnitInsights } from "@/components/units/unit-insights";
import { UnitNavigation } from "@/components/units/unit-navigation";
import { UnitRoadmap } from "@/components/units/unit-roadmap";

export async function generateStaticParams() {
  const units = await listUnitsForServer();
  return units.map((unit) => ({ slug: unit.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const unit = await getUnitForServer(slug).catch(() => null);
  if (!unit) return { title: "الوحدة غير موجودة" };
  return { title: unit.title, description: unit.description };
}

export default async function UnitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [unit, units] = await Promise.all([getUnitForServer(slug).catch(() => null), listUnitsForServer()]);
  if (!unit) notFound();

  const totalDuration = unit.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  const unitIndex = units.findIndex((item) => item.id === unit.id);
  const previous = unitIndex > 0 ? units[unitIndex - 1] : undefined;
  const next = unitIndex >= 0 && unitIndex < units.length - 1 ? units[unitIndex + 1] : undefined;

  return (
    <PageContainer className="space-y-8 py-8 sm:py-10">
      <SiteBreadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "الوحدات", href: "/units" },
          { label: unit.title },
        ]}
      />

      <UnitHero unit={unit} totalDuration={totalDuration} />
      <UnitInsights lessons={unit.lessons} />
      <UnitRoadmap lessons={unit.lessons} unitTitle={unit.title} />

      <section className="space-y-5">
        <div className="premium-card-strong rounded-[1.9rem] p-6">
          <div className="section-kicker">
            <LayoutGrid className="size-3.5" />
            بطاقات الدروس
          </div>
          <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">استعرض كل دروس الوحدة بطريقة سريعة</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">إذا كنت تفضّل القفز مباشرة إلى درس معيّن، فهذه البطاقات تمنحك مدخلاً سريعاً مع عدد المفردات والتمارين والأسئلة.</p>
        </div>
        <LessonGrid lessons={unit.lessons} />
      </section>

      <UnitNavigation previous={previous} next={next} />
    </PageContainer>
  );
}
