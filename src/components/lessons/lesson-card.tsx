import Link from "next/link";
import { ArrowUpLeft, BookOpen, Clock3, HelpCircle, Layers3 } from "lucide-react";
import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";
import { levelStyles } from "@/lib/presentation";

const skillLabels: Record<LessonSummaryDto["skillFocus"][number], string> = {
  alphabet: "الحروف",
  pronunciation: "النطق",
  grammar: "القواعد",
  vocabulary: "المفردات",
  numbers: "الأعداد",
  conversation: "المحادثة",
};

export function LessonCard({ lesson }: { lesson: LessonSummaryDto }) {
  return (
    <article className="premium-card group relative overflow-hidden rounded-[1.8rem] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_55px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_22px_48px_rgba(2,6,23,0.5)]">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-400" />
      <div className="absolute left-0 top-0 h-36 w-36 rounded-full bg-sky-500/10 blur-3xl transition group-hover:bg-sky-500/15" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
            الدرس {lesson.number}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${levelStyles[lesson.level]}`}>
            {lesson.level}
          </span>
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white">{lesson.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{lesson.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {lesson.skillFocus.map((skill) => (
            <span key={skill} className="rounded-full border border-slate-200 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
              {skillLabels[skill]}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-4">
          <span className="rounded-2xl bg-white/75 px-3 py-3 dark:bg-slate-900/80"><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {lesson.duration} د</span></span>
          <span className="rounded-2xl bg-white/75 px-3 py-3 dark:bg-slate-900/80"><span className="inline-flex items-center gap-1"><Layers3 className="size-3.5" /> {lesson.vocabularyCount} مفردة</span></span>
          <span className="rounded-2xl bg-white/75 px-3 py-3 dark:bg-slate-900/80"><span className="inline-flex items-center gap-1"><BookOpen className="size-3.5" /> {lesson.exerciseCount} تمارين</span></span>
          <span className="rounded-2xl bg-white/75 px-3 py-3 dark:bg-slate-900/80"><span className="inline-flex items-center gap-1"><HelpCircle className="size-3.5" /> {lesson.questionCount} أسئلة</span></span>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{lesson.unitTitle}</span>
          <Link href={`/lessons/${lesson.slug}`} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-100">
            عرض الدرس
            <ArrowUpLeft className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
