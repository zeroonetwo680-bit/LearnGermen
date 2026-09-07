import Link from "next/link";
import type { UnitDto } from "@/lib/api/contracts/unit";
import { DynamicIcon } from "@/components/shared/icon";

export function UnitsSection({ units }: { units: UnitDto[] }) {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">الوحدات التعليمية</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">ابدأ بالوحدة التي تناسب مستواك ثم انتقل تدريجياً إلى التالية.</p>
        </div>
        <Link href="/units" className="text-sm font-bold text-sky-700 dark:text-sky-400">عرض الجميع</Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {units.map((unit) => (
          <Link key={unit.id} href={`/units/${unit.slug}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <DynamicIcon name={unit.icon} className="size-8 text-sky-700 dark:text-sky-400" />
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{unit.lessonCount} دروس</span>
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">{unit.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{unit.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
