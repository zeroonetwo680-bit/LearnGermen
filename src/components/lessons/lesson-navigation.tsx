import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";

export function LessonNavigation({ previous, next }: { previous?: LessonSummaryDto; next?: LessonSummaryDto }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="premium-card-strong rounded-[1.7rem] p-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <ArrowRight className="size-4" />
          الدرس السابق
        </p>
        {previous ? (
          <Link href={`/lessons/${previous.slug}`} className="mt-3 block text-lg font-bold text-slate-900 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
            {previous.title}
          </Link>
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">أنت في أول درس حالياً.</p>
        )}
      </div>
      <div className="premium-card-strong rounded-[1.7rem] p-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          الدرس التالي
          <ArrowLeft className="size-4" />
        </p>
        {next ? (
          <Link href={`/lessons/${next.slug}`} className="mt-3 block text-lg font-bold text-slate-900 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
            {next.title}
          </Link>
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">وصلت إلى آخر درس في النسخة الحالية.</p>
        )}
      </div>
    </div>
  );
}
