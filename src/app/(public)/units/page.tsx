import Link from "next/link";
import { listUnitsForServer } from "@/lib/api/modules/units/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { DynamicIcon } from "@/components/shared/icon";

export const metadata = {
  title: "الوحدات",
};

export default async function UnitsPage() {
  const units = await listUnitsForServer();
  return (
    <PageContainer className="py-8 sm:py-10">
      <PageHeader title="الوحدات التعليمية" description="ابدأ من النطق، ثم القواعد، ثم الأعداد، ثم الاستعمال اليومي." eyebrow="مسار التعلم" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {units.map((unit) => (
          <Link key={unit.id} href={`/units/${unit.slug}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <DynamicIcon name={unit.icon} className="size-8 text-sky-700 dark:text-sky-400" />
            <h2 className="mt-4 text-xl font-black text-slate-900 dark:text-white">{unit.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{unit.description}</p>
            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">{unit.lessonCount} دروس • {unit.vocabularyCount} مفردة</div>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
