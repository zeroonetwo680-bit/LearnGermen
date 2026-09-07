import Link from "next/link";
import { ArrowUpLeft, Gauge, Sparkles, Target } from "lucide-react";
import type { LessonSkill, LessonSummaryDto } from "@/lib/api/contracts/lesson";
import type { SkillMasteryTier } from "@/lib/progress/analytics";

export interface SkillCoverageVisual {
  key: LessonSkill;
  label: string;
  totalLessons: number;
  completedLessons: number;
  attemptedLessons: number;
  completionPercent: number;
  averageBest: number | null;
  masteryPercent: number;
  masteryTier: SkillMasteryTier;
  thresholdLabel: string;
  recommendationTitle: string;
  recommendation: string;
  recommendedLesson?: LessonSummaryDto;
  recommendedLessonAction?: string;
}

const skillTone: Record<LessonSkill, { track: string; fill: string; text: string; soft: string }> = {
  alphabet: {
    track: "bg-sky-100 dark:bg-sky-950/40",
    fill: "from-sky-500 to-cyan-400",
    text: "text-sky-700 dark:text-sky-300",
    soft: "bg-sky-50 dark:bg-sky-950/30",
  },
  pronunciation: {
    track: "bg-cyan-100 dark:bg-cyan-950/40",
    fill: "from-cyan-500 to-teal-400",
    text: "text-cyan-700 dark:text-cyan-300",
    soft: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  grammar: {
    track: "bg-emerald-100 dark:bg-emerald-950/40",
    fill: "from-emerald-500 to-teal-400",
    text: "text-emerald-700 dark:text-emerald-300",
    soft: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  vocabulary: {
    track: "bg-violet-100 dark:bg-violet-950/40",
    fill: "from-violet-500 to-fuchsia-400",
    text: "text-violet-700 dark:text-violet-300",
    soft: "bg-violet-50 dark:bg-violet-950/30",
  },
  numbers: {
    track: "bg-amber-100 dark:bg-amber-950/40",
    fill: "from-amber-500 to-orange-400",
    text: "text-amber-700 dark:text-amber-300",
    soft: "bg-amber-50 dark:bg-amber-950/30",
  },
  conversation: {
    track: "bg-rose-100 dark:bg-rose-950/40",
    fill: "from-rose-500 to-pink-400",
    text: "text-rose-700 dark:text-rose-300",
    soft: "bg-rose-50 dark:bg-rose-950/30",
  },
};

const masteryTierStyles: Record<SkillMasteryTier, string> = {
  mastered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  building: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300",
  focus: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
};

const masteryTierLabel: Record<SkillMasteryTier, string> = {
  mastered: "متقنة",
  building: "تتقدم",
  focus: "تحتاج تركيز",
};

export function SkillCoverageChart({ skills }: { skills: SkillCoverageVisual[] }) {
  return (
    <section className="premium-card-strong rounded-[1.9rem] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="section-kicker">
            <Target className="size-3.5" />
            خريطة المهارات
          </div>
          <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">مستوى تقدمك داخل كل مهارة</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">نجمع بين الإنجاز الفعلي في الدروس ومتوسط نتائج الاختبارات لإعطاء مستوى إتقان أوضح.</p>
        </div>

        <div className="grid gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:grid-cols-3">
          <ThresholdPill label="متقنة" value="85%+" tone="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300" />
          <ThresholdPill label="تتقدم" value="70–84%" tone="bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300" />
          <ThresholdPill label="تركيز" value="أقل من 70%" tone="bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {skills.map((skill) => {
          const tone = skillTone[skill.key];
          return (
            <div key={skill.key} className="rounded-[1.5rem] border border-white/70 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 print:break-inside-avoid">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`font-bold ${tone.text}`}>{skill.label}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${masteryTierStyles[skill.masteryTier]}`}>{masteryTierLabel[skill.masteryTier]}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {skill.completedLessons} / {skill.totalLessons} دروس مكتملة — {skill.attemptedLessons} دروس مختبرة
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-lg font-black text-slate-950 dark:text-white">{skill.completionPercent}%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">عتبة الإتقان: {skill.thresholdLabel}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <MetricBar label="التقدم في الدروس" value={skill.completionPercent} track={tone.track} fill={tone.fill} />
                <MetricBar label="متوسط الإتقان" value={skill.masteryPercent} track={tone.track} fill={tone.fill} helper={skill.averageBest !== null ? `أفضل متوسط ${skill.averageBest}%` : "ابدأ أول اختبار لإظهار خط الإتقان"} />
              </div>

              <div className={`mt-4 rounded-[1.3rem] p-4 ${tone.soft}`}>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Sparkles className="size-4" />
                  {skill.recommendationTitle}
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{skill.recommendation}</p>
                {skill.recommendedLesson ? (
                  <Link href={`/lessons/${skill.recommendedLesson.slug}`} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
                    {skill.recommendedLessonAction ?? "افتح الدرس المقترح"}
                    <ArrowUpLeft className="size-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MetricBar({
  label,
  value,
  track,
  fill,
  helper,
}: {
  label: string;
  value: number;
  track: string;
  fill: string;
  helper?: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-white/70 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1"><Gauge className="size-3.5" /> {label}</span>
        <span className="font-black text-slate-900 dark:text-white">{value}%</span>
      </div>
      <div className={`mt-3 h-3 overflow-hidden rounded-full ${track}`}>
        <div className={`h-full rounded-full bg-gradient-to-r ${fill}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      {helper ? <p className="mt-2 text-[11px] leading-6 text-slate-500 dark:text-slate-400">{helper}</p> : null}
    </div>
  );
}

function ThresholdPill({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className={`rounded-full px-3 py-2 text-center ${tone}`}>{label} · {value}</div>;
}
