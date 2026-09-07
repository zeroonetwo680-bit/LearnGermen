import Link from "next/link";
import { ArrowUpLeft, BookOpenCheck, CircleHelp, Layers3 } from "lucide-react";
import type { UnitDto } from "@/lib/api/contracts/unit";
import { unitColorStyles } from "@/lib/presentation";
import { DynamicIcon } from "@/components/shared/icon";

const unitBarFill = {
  blue: "from-sky-500 via-cyan-400 to-teal-300",
  green: "from-emerald-500 via-teal-400 to-lime-300",
  violet: "from-violet-500 via-fuchsia-400 to-pink-300",
  amber: "from-amber-500 via-orange-400 to-yellow-300",
  rose: "from-rose-500 via-pink-400 to-orange-300",
} as const;

export interface UnitProgressVisual extends UnitDto {
  completedLessons: number;
  percent: number;
  averageBest: number | null;
}

export function UnitProgressChart({ units }: { units: UnitProgressVisual[] }) {
  return (
    <section className="premium-card-strong rounded-[1.9rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="section-kicker">توزيع التقدم حسب الوحدات</div>
          <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">أين أنت الأقوى؟ وأين تحتاج متابعة؟</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {units.map((unit) => {
          const palette = unitColorStyles[unit.color];
          return (
            <Link
              key={unit.id}
              href={`/units/${unit.slug}`}
              className={`group premium-card relative overflow-hidden rounded-[1.6rem] p-5 transition hover:-translate-y-1 ${palette.border}`}
            >
              <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${palette.tint}`} />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-12 items-center justify-center rounded-2xl bg-white/85 shadow-md dark:bg-slate-950/80 ${palette.icon}`}>
                      <DynamicIcon name={unit.icon} className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-950 dark:text-white">{unit.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{unit.completedLessons} من {unit.lessonCount} دروس مكتملة</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${palette.badge}`}>{unit.percent}%</span>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80">
                  <div className={`h-full rounded-full bg-gradient-to-r ${unitBarFill[unit.color]}`} style={{ width: `${unit.percent}%` }} />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="rounded-2xl bg-white/80 px-3 py-3 text-center dark:bg-slate-950/80">
                    <Layers3 className="mx-auto mb-1 size-3.5" />
                    {unit.vocabularyCount} مفردة
                  </div>
                  <div className="rounded-2xl bg-white/80 px-3 py-3 text-center dark:bg-slate-950/80">
                    <BookOpenCheck className="mx-auto mb-1 size-3.5" />
                    {unit.exerciseCount} تمارين
                  </div>
                  <div className="rounded-2xl bg-white/80 px-3 py-3 text-center dark:bg-slate-950/80">
                    <CircleHelp className="mx-auto mb-1 size-3.5" />
                    {unit.averageBest !== null ? `${unit.averageBest}% اختبار` : "بدون نتائج"}
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  استكشاف الوحدة
                  <ArrowUpLeft className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
