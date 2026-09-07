import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpLeft, BookOpenCheck, Clock3, GraduationCap, HelpCircle, Layers3 } from "lucide-react";
import type { UnitDetailDto } from "@/lib/api/contracts/unit";
import type { LessonLevel, LessonSkill } from "@/lib/api/contracts/lesson";
import { levelStyles, unitColorStyles } from "@/lib/presentation";
import { DynamicIcon } from "@/components/shared/icon";

const skillLabels: Record<LessonSkill, string> = {
  alphabet: "الحروف",
  pronunciation: "النطق",
  grammar: "القواعد",
  vocabulary: "المفردات",
  numbers: "الأعداد",
  conversation: "المحادثة",
};

export function UnitHero({ unit, totalDuration }: { unit: UnitDetailDto; totalDuration: number }) {
  const palette = unitColorStyles[unit.color];
  const firstLesson = unit.lessons[0];
  const levels = [...new Set(unit.lessons.map((lesson) => lesson.level))] as LessonLevel[];
  const skills = [...new Set(unit.lessons.flatMap((lesson) => lesson.skillFocus))] as LessonSkill[];

  return (
    <section className={`premium-card-strong relative overflow-hidden rounded-[2.2rem] p-6 sm:p-8 ${palette.border}`}>
      <div className={`absolute inset-x-0 top-0 h-52 bg-gradient-to-br ${palette.tint}`} />
      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/40 blur-3xl dark:bg-white/10" />

      <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex size-14 items-center justify-center rounded-[1.4rem] bg-white/85 shadow-lg dark:bg-slate-950/80 ${palette.icon}`}>
              <DynamicIcon name={unit.icon} className="size-7" />
            </div>
            <span className={`rounded-full px-4 py-2 text-xs font-bold ${palette.badge}`}>الوحدة {unit.order}</span>
            <span className="rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-300">
              {unit.lessonCount} دروس متسلسلة
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">{unit.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">{unit.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {levels.map((level) => (
              <span key={level} className={`rounded-full px-3 py-1 text-xs font-bold ${levelStyles[level]}`}>
                {level}
              </span>
            ))}
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300"
              >
                {skillLabels[skill]}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {firstLesson ? (
              <Link
                href={`/lessons/${firstLesson.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-100"
              >
                ابدأ بأول درس
                <ArrowUpLeft className="size-4" />
              </Link>
            ) : null}
            <Link
              href="/lessons"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-sky-900/60 dark:hover:text-sky-400"
            >
              تصفح كل الدروس
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <StatCard icon={<Clock3 className="size-4" />} label="المدة التقديرية" value={`${totalDuration} دقيقة`} />
          <StatCard icon={<Layers3 className="size-4" />} label="إجمالي المفردات" value={`${unit.vocabularyCount}`} />
          <StatCard icon={<BookOpenCheck className="size-4" />} label="إجمالي التمارين" value={`${unit.exerciseCount}`} />
          <StatCard icon={<HelpCircle className="size-4" />} label="أسئلة الاختبارات" value={`${unit.questionCount}`} />
          <div className="sm:col-span-2 premium-card rounded-[1.6rem] p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <GraduationCap className="size-4" />
              خطة الدراسة المقترحة
            </div>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>1. ابدأ بالدروس بالترتيب لتحافظ على التدرج المنطقي داخل الوحدة.</li>
              <li>2. راجع المفردات والنطق قبل حل التمرين والاختبار.</li>
              <li>3. كرر الاختبار بعد المراجعة لتثبيت التقدم وتحسين النتيجة.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="premium-card rounded-[1.6rem] p-5">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{icon}{label}</div>
      <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
