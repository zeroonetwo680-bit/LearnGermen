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
    { label: "الدروس", value: lessonCount },
    { label: "المفردات", value: vocabularyCount },
    { label: "التمارين", value: exerciseCount },
    { label: "الوحدات", value: unitCount },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
          <p className="mt-3 text-4xl font-black text-slate-900 dark:text-white">{formatArabicNumber(stat.value)}</p>
        </article>
      ))}
    </section>
  );
}
