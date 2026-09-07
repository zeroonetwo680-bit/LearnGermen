import type { ReactNode } from "react";
import { BarChart3, Sparkles, Target, TrendingUp } from "lucide-react";
import type { LessonScoreDto } from "@/lib/api/contracts/progress";
import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";

interface ScoreEntry {
  lesson: LessonSummaryDto;
  score: LessonScoreDto;
}

export function MasteryBreakdown({
  scoreEntries,
  averageBest,
  averageLast,
  totalAttempts,
}: {
  scoreEntries: ScoreEntry[];
  averageBest: number;
  averageLast: number;
  totalAttempts: number;
}) {
  const excellent = scoreEntries.filter((entry) => entry.score.bestScore >= 85);
  const good = scoreEntries.filter((entry) => entry.score.bestScore >= 70 && entry.score.bestScore < 85);
  const review = scoreEntries.filter((entry) => entry.score.bestScore < 70);
  const total = Math.max(scoreEntries.length, 1);

  const strongest = scoreEntries[0];
  const weakest = [...scoreEntries].sort((left, right) => left.score.lastScore - right.score.lastScore)[0];

  return (
    <section className="premium-card-strong rounded-[1.9rem] p-6">
      <div className="section-kicker">
        <BarChart3 className="size-3.5" />
        تحليل الأداء
      </div>
      <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">ماذا تقول نتائج اختباراتك؟</h2>

      <div className="mt-6 rounded-[1.6rem] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/20 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3 text-sm text-white/80">
          <span>توزيع الإتقان</span>
          <span>{scoreEntries.length} دروس مختبرة</span>
        </div>
        <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-white/10">
          <div className="bg-gradient-to-r from-emerald-400 to-green-300" style={{ width: `${(excellent.length / total) * 100}%` }} />
          <div className="bg-gradient-to-r from-amber-400 to-orange-300" style={{ width: `${(good.length / total) * 100}%` }} />
          <div className="bg-gradient-to-r from-rose-400 to-pink-300" style={{ width: `${(review.length / total) * 100}%` }} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/8 px-4 py-3">
            <p className="text-xs text-white/70">متقن</p>
            <p className="mt-2 text-2xl font-black">{excellent.length}</p>
          </div>
          <div className="rounded-2xl bg-white/8 px-4 py-3">
            <p className="text-xs text-white/70">جيد</p>
            <p className="mt-2 text-2xl font-black">{good.length}</p>
          </div>
          <div className="rounded-2xl bg-white/8 px-4 py-3">
            <p className="text-xs text-white/70">يحتاج مراجعة</p>
            <p className="mt-2 text-2xl font-black">{review.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Metric label="متوسط أفضل نتيجة" value={`${averageBest}%`} icon={<Target className="size-4" />} />
        <Metric label="متوسط آخر نتيجة" value={`${averageLast}%`} icon={<TrendingUp className="size-4" />} />
        <Metric label="إجمالي المحاولات" value={String(totalAttempts)} icon={<Sparkles className="size-4" />} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <InsightCard
          title="أقوى درس حالياً"
          lessonTitle={strongest?.lesson.title}
          description={strongest ? `أفضل نتيجة وصلت إلى ${strongest.score.bestScore}%` : "ابدأ أول اختبار كي تظهر أقوى نقاطك هنا."}
          accent="from-emerald-500/20 via-teal-500/10 to-transparent"
        />
        <InsightCard
          title="أقرب درس للمراجعة"
          lessonTitle={weakest?.lesson.title}
          description={weakest ? `آخر نتيجة مسجلة ${weakest.score.lastScore}% — راجعه أولاً.` : "بمجرد وجود محاولات، سنقترح لك أولويات المراجعة."}
          accent="from-rose-500/20 via-orange-500/10 to-transparent"
        />
      </div>
    </section>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-[1.4rem] border border-white/70 bg-white/75 px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{icon}{label}</div>
      <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function InsightCard({
  title,
  lessonTitle,
  description,
  accent,
}: {
  title: string;
  lessonTitle?: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="premium-card relative overflow-hidden rounded-[1.6rem] p-5">
      <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-br ${accent}`} />
      <div className="relative">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</p>
        <h3 className="mt-3 text-lg font-black text-slate-950 dark:text-white">{lessonTitle ?? "بانتظار البيانات"}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}
