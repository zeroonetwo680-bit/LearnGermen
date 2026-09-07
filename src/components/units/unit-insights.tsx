import Link from "next/link";
import { ArrowUpLeft, BookMarked, Compass, Layers3, Sparkles, Target } from "lucide-react";
import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";

export function UnitInsights({ lessons }: { lessons: LessonSummaryDto[] }) {
  const firstLesson = lessons[0];
  const finalLesson = lessons.at(-1);
  const topTags = [...new Set(lessons.flatMap((lesson) => lesson.tags))].slice(0, 6);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="premium-card-strong rounded-[1.9rem] p-6">
        <div className="section-kicker">
          <Target className="size-3.5" />
          نواتج التعلّم
        </div>
        <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">ما الذي ستخرجه من هذه الوحدة؟</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {lessons.slice(0, 4).map((lesson) => (
            <div key={lesson.id} className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                <BookMarked className="size-3.5" />
                الدرس {lesson.number}
              </div>
              <h3 className="mt-4 font-black text-slate-950 dark:text-white">{lesson.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{lesson.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-6">
        <section className="premium-card-strong rounded-[1.9rem] p-6">
          <div className="section-kicker">
            <Compass className="size-3.5" />
            مسار سريع
          </div>
          <div className="mt-5 space-y-4">
            <QuickCard
              label="ابدأ من هنا"
              title={firstLesson?.title ?? "لا يوجد درس بعد"}
              description={firstLesson?.description ?? "سيظهر هنا أول درس في الوحدة عند توفره."}
              href={firstLesson ? `/lessons/${firstLesson.slug}` : undefined}
            />
            <QuickCard
              label="واختم هنا"
              title={finalLesson?.title ?? "لا يوجد درس ختامي بعد"}
              description={finalLesson?.description ?? "سيظهر هنا الدرس الأخير في الوحدة عند توفره."}
              href={finalLesson ? `/lessons/${finalLesson.slug}` : undefined}
            />
          </div>
        </section>

        <section className="premium-card-strong rounded-[1.9rem] p-6">
          <div className="section-kicker">
            <Layers3 className="size-3.5" />
            محاور الوحدة
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-5 rounded-[1.5rem] bg-slate-950 p-5 text-white dark:bg-slate-900">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="size-4 text-amber-300" />
              نصيحة للمذاكرة
            </div>
            <p className="mt-3 text-sm leading-7 text-white/80">اقرأ الدرس أولاً، ثم راجع المفردات، ثم حل التمرين، ثم أعد الاختبار لاحقاً. هذه الدورة القصيرة تجعل الوحدة أكثر ثباتاً وأسرع استرجاعاً.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickCard({ label, title, description, href }: { label: string; title: string; description: string; href?: string }) {
  const content = (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950/70">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <h3 className="mt-2 text-lg font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
      {href ? (
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
          فتح الدرس
          <ArrowUpLeft className="size-4" />
        </div>
      ) : null}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
