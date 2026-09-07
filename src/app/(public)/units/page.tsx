import Link from "next/link";
import { ArrowUpLeft, BookOpenCheck, HelpCircle, Layers3 } from "lucide-react";
import { listUnitsForServer } from "@/lib/api/modules/units/server";
import { unitColorStyles } from "@/lib/presentation";
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
        {units.map((unit) => {
          const palette = unitColorStyles[unit.color];
          return (
            <Link key={unit.id} href={`/units/${unit.slug}`} className={`premium-card group relative overflow-hidden rounded-[1.8rem] p-5 transition hover:-translate-y-1 ${palette.border}`}>
              <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${palette.tint}`} />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <div className={`flex size-12 items-center justify-center rounded-2xl bg-white/85 shadow-md dark:bg-slate-900/80 ${palette.icon}`}>
                    <DynamicIcon name={unit.icon} className="size-6" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${palette.badge}`}>{unit.lessonCount} دروس</span>
                </div>
                <h2 className="mt-4 text-xl font-black text-slate-900 dark:text-white">{unit.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{unit.description}</p>
                <div className="mt-5 grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="rounded-2xl bg-white/75 px-3 py-3 text-center dark:bg-slate-900/80">
                    <Layers3 className="mx-auto mb-1 size-3.5" />
                    {unit.vocabularyCount}
                  </div>
                  <div className="rounded-2xl bg-white/75 px-3 py-3 text-center dark:bg-slate-900/80">
                    <BookOpenCheck className="mx-auto mb-1 size-3.5" />
                    {unit.exerciseCount}
                  </div>
                  <div className="rounded-2xl bg-white/75 px-3 py-3 text-center dark:bg-slate-900/80">
                    <HelpCircle className="mx-auto mb-1 size-3.5" />
                    {unit.questionCount}
                  </div>
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  ادخل إلى الوحدة
                  <ArrowUpLeft className="size-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
