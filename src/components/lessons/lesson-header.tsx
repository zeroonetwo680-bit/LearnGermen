import { BookOpenCheck, Clock3, HelpCircle, Layers3, Sparkles } from "lucide-react";
import type { LessonDto } from "@/lib/api/contracts/lesson";
import { levelStyles } from "@/lib/presentation";

export function LessonHeader({ lesson }: { lesson: LessonDto }) {
  const stats = [
    { label: "المدة", value: `${lesson.duration} دقيقة`, icon: Clock3 },
    { label: "المفردات", value: `${lesson.vocabularyCount} مفردة`, icon: Layers3 },
    { label: "التمارين", value: `${lesson.exerciseCount} تمارين`, icon: BookOpenCheck },
    { label: "الأسئلة", value: `${lesson.questionCount} أسئلة`, icon: HelpCircle },
  ];

  return (
    <section className="relative overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,#082f49_0%,#0f4c81_42%,#0891b2_100%)] p-8 text-white shadow-[0_30px_80px_rgba(8,47,73,0.35)] sm:p-10">
      <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-violet-300/15 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-sky-100">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${levelStyles[lesson.level]}`}>{lesson.level}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">الدرس {lesson.number}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">{lesson.unitTitle}</span>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{lesson.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-sky-50/95">{lesson.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {lesson.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-sky-50">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="premium-card rounded-[1.75rem] border-white/10 bg-white/10 p-5 text-white dark:border-white/10 dark:bg-white/10">
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-100">
            <Sparkles className="size-4 text-amber-300" />
            ملخص سريع للدرس
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-sky-100">
                    <Icon className="size-4" />
                    <span className="text-xs font-semibold">{stat.label}</span>
                  </div>
                  <p className="mt-3 text-sm font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
