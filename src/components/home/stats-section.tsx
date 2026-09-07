import { BookOpenCheck, GraduationCap, Layers3, Sparkles } from "lucide-react";
import { formatArabicNumber } from "@/lib/utils";

export function StatsSection({
  lessonCount,
  vocabularyCount,
  exerciseCount,
  unitCount,
}: {
  lessonCount: number;
  vocabularyCount: number;
  exerciseCount: number;
  unitCount: number;
}) {
  const stats = [
    { label: "الدروس", value: lessonCount, icon: GraduationCap },
    { label: "المفردات", value: vocabularyCount, icon: Layers3 },
    { label: "التمارين", value: exerciseCount, icon: BookOpenCheck },
    { label: "الوحدات", value: unitCount, icon: Sparkles },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <article key={stat.label} className="premium-card group relative overflow-hidden rounded-[1.75rem] p-6 transition hover:-translate-y-1">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-400" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="mt-3 text-4xl font-black text-slate-900 dark:text-white">{formatArabicNumber(stat.value)}</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-800 transition group-hover:scale-105 dark:bg-sky-950/50 dark:text-sky-300">
                <Icon className="size-5" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
