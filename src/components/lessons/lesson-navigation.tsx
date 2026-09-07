import Link from "next/link";
import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";

export function LessonNavigation({ previous, next }: { previous?: LessonSummaryDto; next?: LessonSummaryDto }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">الدرس السابق</p>
        {previous ? (
          <Link href={`/lessons/${previous.slug}`} className="mt-2 block text-lg font-bold text-slate-900 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
            {previous.title}
          </Link>
        ) : (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">أنت في أول درس حالياً.</p>
        )}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">الدرس التالي</p>
        {next ? (
          <Link href={`/lessons/${next.slug}`} className="mt-2 block text-lg font-bold text-slate-900 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
            {next.title}
          </Link>
        ) : (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">وصلت إلى آخر درس في النسخة الحالية.</p>
        )}
      </div>
    </div>
  );
}
