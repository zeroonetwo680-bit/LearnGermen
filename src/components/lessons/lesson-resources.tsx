import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import type { ResourceDto } from "@/lib/api/contracts/lesson";
import { EmptyState } from "@/components/shared/empty-state";

export function LessonResources({ resources }: { resources: ResourceDto[] }) {
  if (!resources.length) {
    return <EmptyState title="لا توجد مصادر مرفقة" description="سيتم إرفاق ملفات ومراجع إضافية لاحقاً." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <article key={resource.id} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{resource.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{resource.fileName}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{resource.description}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{resource.type}</span>
            <span>{resource.size}</span>
          </div>
          <div className="mt-5 flex gap-3">
            <Link href={resource.filePath} target="_blank" className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
              <ExternalLink className="size-4" /> عرض / تحميل
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
