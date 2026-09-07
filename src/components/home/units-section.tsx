import Link from "next/link";
import { ArrowUpLeft, BookOpenCheck, HelpCircle, Layers3 } from "lucide-react";
import type { UnitDto } from "@/lib/api/contracts/unit";
import { unitColorStyles } from "@/lib/presentation";
import { DynamicIcon } from "@/components/shared/icon";

export function UnitsSection({ units }: { units: UnitDto[] }) {
  return (
    <section className="animate-fade-up animate-fade-up-delay-1 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="section-kicker">الوحدات التعليمية</span>
          <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">ابدأ بمسار واضح ومنظم</h2>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300">كل وحدة تجمع موضوعاً مركزياً: النطق، القواعد، الأعداد، أو مواقف الحياة اليومية.</p>
        </div>
        <Link href="/units" className="button-shine pressable inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 backdrop-blur transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-sky-800 dark:hover:text-sky-400">
          عرض الجميع
          <ArrowUpLeft className="size-4" />
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {units.map((unit) => {
          const palette = unitColorStyles[unit.color];
          return (
            <Link key={unit.id} href={`/units/${unit.slug}`} className={`premium-card interactive-lift group relative overflow-hidden rounded-[1.8rem] p-5 ${palette.border}`}>
              <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${palette.tint}`} />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <div className={`flex size-12 items-center justify-center rounded-2xl bg-white/85 shadow-md dark:bg-slate-900/80 ${palette.icon}`}>
                    <DynamicIcon name={unit.icon} className="size-6" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${palette.badge}`}>{unit.lessonCount} دروس</span>
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-white">{unit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{unit.description}</p>
                <div className="mt-5 grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="interactive-lift rounded-2xl bg-white/70 px-3 py-2 text-center dark:bg-slate-800/70">
                    <Layers3 className="mx-auto mb-1 size-3.5" />
                    {unit.vocabularyCount}
                  </div>
                  <div className="interactive-lift rounded-2xl bg-white/70 px-3 py-2 text-center dark:bg-slate-800/70">
                    <BookOpenCheck className="mx-auto mb-1 size-3.5" />
                    {unit.exerciseCount}
                  </div>
                  <div className="interactive-lift rounded-2xl bg-white/70 px-3 py-2 text-center dark:bg-slate-800/70">
                    <HelpCircle className="mx-auto mb-1 size-3.5" />
                    {unit.questionCount}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
