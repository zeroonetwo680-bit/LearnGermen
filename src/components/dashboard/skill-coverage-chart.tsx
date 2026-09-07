import type { LessonSkill } from "@/lib/api/contracts/lesson";

export interface SkillCoverageVisual {
  key: LessonSkill;
  label: string;
  totalLessons: number;
  completedLessons: number;
  attemptedLessons: number;
  completionPercent: number;
  averageBest: number | null;
}

const skillTone: Record<LessonSkill, { track: string; fill: string; text: string }> = {
  alphabet: {
    track: "bg-sky-100 dark:bg-sky-950/40",
    fill: "from-sky-500 to-cyan-400",
    text: "text-sky-700 dark:text-sky-300",
  },
  pronunciation: {
    track: "bg-cyan-100 dark:bg-cyan-950/40",
    fill: "from-cyan-500 to-teal-400",
    text: "text-cyan-700 dark:text-cyan-300",
  },
  grammar: {
    track: "bg-emerald-100 dark:bg-emerald-950/40",
    fill: "from-emerald-500 to-teal-400",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  vocabulary: {
    track: "bg-violet-100 dark:bg-violet-950/40",
    fill: "from-violet-500 to-fuchsia-400",
    text: "text-violet-700 dark:text-violet-300",
  },
  numbers: {
    track: "bg-amber-100 dark:bg-amber-950/40",
    fill: "from-amber-500 to-orange-400",
    text: "text-amber-700 dark:text-amber-300",
  },
  conversation: {
    track: "bg-rose-100 dark:bg-rose-950/40",
    fill: "from-rose-500 to-pink-400",
    text: "text-rose-700 dark:text-rose-300",
  },
};

export function SkillCoverageChart({ skills }: { skills: SkillCoverageVisual[] }) {
  return (
    <section className="premium-card-strong rounded-[1.9rem] p-6">
      <div className="section-kicker">خريطة المهارات</div>
      <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">مستوى تقدمك داخل كل مهارة</h2>
      <div className="mt-6 space-y-4">
        {skills.map((skill) => {
          const tone = skillTone[skill.key];
          return (
            <div key={skill.key} className="rounded-[1.5rem] border border-white/70 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className={`font-bold ${tone.text}`}>{skill.label}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {skill.completedLessons} / {skill.totalLessons} دروس مكتملة — {skill.attemptedLessons} دروس مختبرة
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-lg font-black text-slate-950 dark:text-white">{skill.completionPercent}%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">متوسط أفضل نتيجة: {skill.averageBest !== null ? `${skill.averageBest}%` : "لا يوجد بعد"}</p>
                </div>
              </div>
              <div className={`mt-4 h-3 overflow-hidden rounded-full ${tone.track}`}>
                <div className={`h-full rounded-full bg-gradient-to-r ${tone.fill}`} style={{ width: `${skill.completionPercent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
