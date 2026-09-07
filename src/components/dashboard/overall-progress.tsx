import type { ReactNode } from "react";
import { Award, BookOpenCheck, Flame, Flag, Target } from "lucide-react";
import type { WeeklyActivityPoint } from "@/lib/progress/analytics";

export function OverallProgress({
  percent,
  completedLessons,
  totalLessons,
  attemptedLessons,
  averageBest,
  weeklyStreak,
  weeklyActiveDays,
  bestWeek,
  streakDays,
}: {
  percent: number;
  completedLessons: number;
  totalLessons: number;
  attemptedLessons: number;
  averageBest: number;
  weeklyStreak: number;
  weeklyActiveDays: number;
  bestWeek: number;
  streakDays: WeeklyActivityPoint[];
}) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;
  const stage = percent >= 85 ? "إتقان قوي" : percent >= 60 ? "تقدم ثابت" : percent >= 30 ? "بداية ممتازة" : "جاهز للانطلاق";

  return (
    <section className="premium-card-strong rounded-[2rem] p-6 sm:p-8">
      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
        <div>
          <div className="section-kicker">
            <Award className="size-3.5" />
            تقدمك في المنصة
          </div>
          <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">كل درس تنهيه يحوّل التعلم من قراءة إلى مهارة حقيقية</h2>
          <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">اعتمد على التدرج: شرح، مفردات، تمرين، اختبار. والآن أضف إليها عادة أسبوعية ثابتة لتبني تقدماً لا يعتمد على الصدفة.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MiniMetric label="الدروس المكتملة" value={`${completedLessons}/${totalLessons}`} icon={<BookOpenCheck className="size-4" />} />
            <MiniMetric label="دروس مختبرة" value={String(attemptedLessons)} icon={<Target className="size-4" />} />
            <MiniMetric label="مرحلة التعلّم" value={stage} icon={<Flag className="size-4" />} compact />
            <MiniMetric label="السلسلة الأسبوعية" value={`${weeklyStreak} يوم`} icon={<Flame className="size-4" />} compact helper={`${weeklyActiveDays} أيام نشطة هذا الأسبوع`} />
          </div>

          <div className="mt-5 rounded-[1.6rem] border border-white/70 bg-white/75 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">خريطة نشاط الأسبوع</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">أفضل أسبوع لك حتى الآن: {bestWeek} / 7 أيام نشطة</p>
              </div>
              <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950/50 dark:text-amber-300">سلسلة حالية {weeklyStreak}</div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
              {streakDays.map((day) => (
                <div key={day.key} className={`rounded-[1rem] px-2 py-3 font-bold ${day.active ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500"}`}>
                  <p>{day.label}</p>
                  <p className="mt-1 text-[11px] font-semibold opacity-80">{day.active ? day.totalActivities : "—"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.8rem] bg-[linear-gradient(135deg,#082f49_0%,#0f4c81_50%,#0891b2_100%)] p-6 text-white shadow-xl shadow-sky-900/20">
          <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative grid place-items-center">
              <svg viewBox="0 0 160 160" className="size-40 -rotate-90">
                <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.14)" strokeWidth="14" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#dashboard-progress-gradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
                <defs>
                  <linearGradient id="dashboard-progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#67e8f9" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-xs tracking-[0.22em] text-sky-100">إكمال</p>
                  <p className="mt-1 text-4xl font-black">{percent}%</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-3 lg:max-w-[15rem]">
              <div className="rounded-[1.4rem] bg-white/10 px-4 py-4">
                <p className="text-xs text-sky-100/85">متوسط أفضل نتيجة</p>
                <p className="mt-2 text-3xl font-black">{averageBest}%</p>
              </div>
              <Milestone label="أول 25%" active={percent >= 25} />
              <Milestone label="منتصف المنهج" active={percent >= 50} />
              <Milestone label="مرحلة الإتقان" active={percent >= 75} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniMetric({
  label,
  value,
  icon,
  compact = false,
  helper,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  compact?: boolean;
  helper?: string;
}) {
  return (
    <div className="premium-card rounded-[1.4rem] px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{icon}{label}</div>
      <p className={`mt-3 font-black text-slate-950 dark:text-white ${compact ? "text-xl" : "text-3xl"}`}>{value}</p>
      {helper ? <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">{helper}</p> : null}
    </div>
  );
}

function Milestone({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-full px-4 py-3 text-sm font-semibold ${active ? "bg-white text-sky-950" : "bg-white/10 text-sky-100"}`}>
      <span>{label}</span>
      <span>{active ? "✓" : "…"}</span>
    </div>
  );
}
