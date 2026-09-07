import Link from "next/link";
import { BookOpen, Clock3, HelpCircle, Layers3 } from "lucide-react";
import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";

export function LessonCard({ lesson }: { lesson: LessonSummaryDto }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
          الدرس {lesson.number}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {lesson.level}
        </span>
      </div>
      <h3 className="text-lg font-black text-slate-900 dark:text-white">{lesson.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{lesson.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-4">
        <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {lesson.duration} د</span>
        <span className="inline-flex items-center gap-1"><Layers3 className="size-3.5" /> {lesson.vocabularyCount} مفردة</span>
        <span className="inline-flex items-center gap-1"><BookOpen className="size-3.5" /> {lesson.exerciseCount} تمارين</span>
        <span className="inline-flex items-center gap-1"><HelpCircle className="size-3.5" /> {lesson.questionCount} أسئلة</span>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400">{lesson.unitTitle}</span>
        <Link href={`/lessons/${lesson.slug}`} className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
          عرض الدرس
        </Link>
      </div>
    </article>
  );
}
