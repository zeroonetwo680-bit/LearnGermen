import Link from "next/link";
import { ArrowUpLeft, BookOpen, Clock3, HelpCircle, Layers3 } from "lucide-react";
import type { LessonSummaryDto, LessonSkill } from "@/lib/api/contracts/lesson";
import { levelStyles } from "@/lib/presentation";

const skillLabels: Record<LessonSkill, string> = {
  alphabet: "الحروف",
  pronunciation: "النطق",
  grammar: "القواعد",
  vocabulary: "المفردات",
  numbers: "الأعداد",
  conversation: "المحادثة",
};

export function UnitRoadmap({ lessons, unitTitle }: { lessons: LessonSummaryDto[]; unitTitle: string }) {
  return (
    <section className="premium-card-strong rounded-[1.9rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="section-kicker">خريطة التعلّم داخل الوحدة</div>
          <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">ابدأ بهذه الخطوات بالترتيب</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">كل درس هنا يمثل محطة واضحة داخل وحدة {unitTitle}. التحرك من الأعلى للأسفل يمنحك أفضل تسلسل للمذاكرة.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {lessons.map((lesson, index) => (
          <article key={lesson.id} className="group relative overflow-hidden rounded-[1.7rem] border border-white/70 bg-white/75 p-5 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="absolute right-6 top-0 h-full w-px bg-slate-200 dark:bg-slate-800" />
            <div className="absolute right-[19px] top-7 flex size-4 items-center justify-center rounded-full bg-sky-500 ring-4 ring-sky-100 dark:ring-sky-950/60" />

            <div className="pr-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">الخطوة {index + 1}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${levelStyles[lesson.level]}`}>{lesson.level}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">الدرس {lesson.number}</span>
              </div>

              <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">{lesson.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{lesson.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {lesson.skillFocus.map((skill) => (
                  <span key={skill} className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                    {skillLabels[skill]}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-3 xl:grid-cols-4">
                <span className="rounded-2xl bg-slate-100/80 px-3 py-3 dark:bg-slate-900/80"><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {lesson.duration} د</span></span>
                <span className="rounded-2xl bg-slate-100/80 px-3 py-3 dark:bg-slate-900/80"><span className="inline-flex items-center gap-1"><Layers3 className="size-3.5" /> {lesson.vocabularyCount} مفردة</span></span>
                <span className="rounded-2xl bg-slate-100/80 px-3 py-3 dark:bg-slate-900/80"><span className="inline-flex items-center gap-1"><BookOpen className="size-3.5" /> {lesson.exerciseCount} تمارين</span></span>
                <span className="rounded-2xl bg-slate-100/80 px-3 py-3 dark:bg-slate-900/80"><span className="inline-flex items-center gap-1"><HelpCircle className="size-3.5" /> {lesson.questionCount} أسئلة</span></span>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ضمن مسار {lesson.unitTitle}</span>
                <Link href={`/lessons/${lesson.slug}`} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-100">
                  ادخل إلى الدرس
                  <ArrowUpLeft className="size-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
