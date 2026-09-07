import Link from "next/link";
import { Download, ExternalLink, FileText } from "lucide-react";
import type { ResourceDto } from "@/lib/api/contracts/lesson";
import { EmptyState } from "@/components/shared/empty-state";

export function LessonResources({ resources }: { resources: ResourceDto[] }) {
  if (!resources.length) {
    return <EmptyState title="لا توجد مصادر مرفقة" description="سيتم إرفاق ملفات ومراجع إضافية لاحقاً." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <article key={resource.id} className="premium-card-strong rounded-[1.75rem] p-5 transition hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-800 dark:from-sky-950/60 dark:to-cyan-950/50 dark:text-sky-300">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{resource.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{resource.fileName}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{resource.description}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="rounded-full border border-slate-200 bg-white/75 px-3 py-1 dark:border-slate-700 dark:bg-slate-900/80">{resource.type}</span>
            <span>{resource.size}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {resource.viewable ? (
              <Link href={resource.filePath} target="_blank" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-100">
                <ExternalLink className="size-4" /> عرض
              </Link>
            ) : null}
            {resource.downloadable ? (
              <Link href={resource.filePath} target="_blank" download className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-sky-800 dark:hover:text-sky-400">
                <Download className="size-4" /> تحميل
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
