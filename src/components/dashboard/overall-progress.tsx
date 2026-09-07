import type { ReactNode } from "react";
import { Award, BookOpenCheck, Flag, Target } from "lucide-react";

export function OverallProgress({
  percent,
  completedLessons,
  totalLessons,
  attemptedLessons,
  averageBest,
}: {
  percent: number;
  completedLessons: number;
  totalLessons: number;
  attemptedLessons: number;
  averageBest: number;
}) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;
  const stage = percent >= 85 ? "إتقان قوي" : percent >= 60 ? "تقدم ثابت" : percent >= 30 ? "بداية ممتازة" : "جاهز للانطلاق";

  return (
    <section className="premium-card-strong rounded-[2rem] p-6 sm:p-8">
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
        <div>
          <div className="section-kicker">
            <Award className="size-3.5" />
            تقدمك في المنصة
          </div>
          <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">كل درس تنهيه يحوّل التعلم من قراءة إلى مهارة حقيقية</h2>
          <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">اعتمد على التدرج: شرح، مفردات، تمرين، اختبار. وتابع كيف تتحول هذه الخطوات إلى قراءة بصرية واضحة داخل لوحة التقدم.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <MiniMetric label="الدروس المكتملة" value={`${completedLessons}/${totalLessons}`} icon={<BookOpenCheck className="size-4" />} />
            <MiniMetric label="دروس مختبرة" value={String(attemptedLessons)} icon={<Target className="size-4" />} />
            <MiniMetric label="مرحلة التعلّم" value={stage} icon={<Flag className="size-4" />} compact />
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
}: {
  label: string;
  value: string;
  icon: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="premium-card rounded-[1.4rem] px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{icon}{label}</div>
      <p className={`mt-3 font-black text-slate-950 dark:text-white ${compact ? "text-xl" : "text-3xl"}`}>{value}</p>
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
