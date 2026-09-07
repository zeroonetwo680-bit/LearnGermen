import Link from "next/link";
import { ArrowUpLeft, Clock3, History, PlayCircle } from "lucide-react";
import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";
import type { LessonScoreDto } from "@/lib/api/contracts/progress";

interface ScoreEntry {
  lesson: LessonSummaryDto;
  score: LessonScoreDto;
}

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function RecentLearningActivity({
  recentEntries,
  lastVisited,
  updatedAt,
}: {
  recentEntries: ScoreEntry[];
  lastVisited?: LessonSummaryDto;
  updatedAt: string;
}) {
  return (
    <section className="premium-card-strong rounded-[1.9rem] p-6">
      <div className="section-kicker">
        <History className="size-3.5" />
        نشاط التعلم
      </div>
      <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">آخر ما حدث في رحلتك</h2>
      <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">آخر مزامنة: {formatDate(updatedAt)}</p>

      <div className="mt-6 rounded-[1.6rem] bg-[linear-gradient(135deg,#082f49_0%,#0f4c81_50%,#0891b2_100%)] p-5 text-white shadow-xl shadow-sky-900/20">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
            <PlayCircle className="size-5" />
          </div>
          <div>
            <p className="text-sm text-white/80">العودة السريعة</p>
            <p className="mt-1 font-black">{lastVisited?.title ?? "لا يوجد درس مفتوح بعد"}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-7 text-sky-50/90">
          {lastVisited ? "استأنف من آخر درس زرته داخل المنصة بضغطة واحدة." : "ابدأ أي درس ليظهر هنا اختصار الرجوع السريع."}
        </p>
        {lastVisited ? (
          <Link href={`/lessons/${lastVisited.slug}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-sky-900">
            متابعة الدرس
            <ArrowUpLeft className="size-4" />
          </Link>
        ) : null}
      </div>

      <div className="mt-5 space-y-3">
        {recentEntries.length ? (
          recentEntries.map((entry) => (
            <div key={entry.lesson.id} className="rounded-[1.4rem] border border-white/70 bg-white/75 px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/lessons/${entry.lesson.slug}`} className="font-bold text-slate-950 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
                    {entry.lesson.title}
                  </Link>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    آخر نتيجة {entry.score.lastScore}% — أفضل نتيجة {entry.score.bestScore}%
                  </p>
                </div>
                <div className="text-left text-xs text-slate-500 dark:text-slate-400">
                  <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">
                    <Clock3 className="size-3.5" />
                    {formatDate(entry.score.lastAttemptAt)}
                  </div>
                  <p className="mt-2">{entry.score.attempts} محاولات</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.4rem] border border-dashed border-slate-300/80 px-4 py-6 text-sm leading-7 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            لا توجد محاولات اختبار بعد. ابدأ بأول اختبار لتظهر حركة التعلم هنا.
          </div>
        )}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormatter.format(date);
}
