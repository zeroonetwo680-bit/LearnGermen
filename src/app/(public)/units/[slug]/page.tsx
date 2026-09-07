import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUnitForServer, listUnitsForServer } from "@/lib/api/modules/units/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { LessonGrid } from "@/components/lessons/lesson-grid";
import { SiteBreadcrumbs } from "@/components/layout/site-breadcrumbs";

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
  const unit = await getUnitForServer(slug).catch(() => null);
  if (!unit) notFound();

  return (
    <PageContainer className="py-8 sm:py-10">
      <SiteBreadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الوحدات", href: "/units" }, { label: unit.title }]} />
      <PageHeader title={unit.title} description={unit.description} eyebrow="تفاصيل الوحدة" />
      <LessonGrid lessons={unit.lessons} />
    </PageContainer>
  );
}
