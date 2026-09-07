import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import { LessonGrid } from "@/components/lessons/lesson-grid";
import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";

export function FeaturedLessonsSection({ lessons }: { lessons: LessonSummaryDto[] }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="section-kicker">مختارات البداية</span>
          <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">أفضل دروس للانطلاق السريع</h2>
          <p className="mt-3 text-sm leading-8 text-slate-600 dark:text-slate-300">هذه الدروس تمنحك تصوراً واضحاً عن أسلوب المنصة: فهم، حفظ، تدريب، ثم اختبار.</p>
        </div>
        <Link href="/lessons" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 backdrop-blur transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-sky-800 dark:hover:text-sky-400">
          كل الدروس
          <ArrowUpLeft className="size-4" />
        </Link>
      </div>
      <LessonGrid lessons={lessons} />
    </section>
  );
}
