import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { UnitDto } from "@/lib/api/contracts/unit";

export function UnitNavigation({ previous, next }: { previous?: UnitDto; next?: UnitDto }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="premium-card-strong rounded-[1.7rem] p-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <ArrowRight className="size-4" />
          الوحدة السابقة
        </p>
        {previous ? (
          <Link href={`/units/${previous.slug}`} className="mt-3 block text-lg font-bold text-slate-900 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
            {previous.title}
          </Link>
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">هذه أول وحدة في مسار التعلم.</p>
        )}
      </div>
      <div className="premium-card-strong rounded-[1.7rem] p-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          الوحدة التالية
          <ArrowLeft className="size-4" />
        </p>
        {next ? (
          <Link href={`/units/${next.slug}`} className="mt-3 block text-lg font-bold text-slate-900 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
            {next.title}
          </Link>
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">هذه آخر وحدة في النسخة الحالية.</p>
        )}
      </div>
    </div>
  );
}
