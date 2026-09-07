import Link from "next/link";
import { ArrowUpLeft, ChartLine, Clock3, Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { QuizTrendPoint } from "@/lib/progress/analytics";

interface QuizTrendSummary {
  points: QuizTrendPoint[];
  latest: number | null;
  previous: number | null;
  average: number | null;
  delta: number | null;
  direction: "up" | "down" | "steady";
}

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function QuizTrendHistory({
  trend,
  attemptsThisWeek,
}: {
  trend: QuizTrendSummary;
  attemptsThisWeek: number;
}) {
  const linePoints = buildSparklinePoints(trend.points);

  return (
    <section className="premium-card-strong rounded-[1.9rem] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="section-kicker">
            <ChartLine className="size-3.5" />
            سجل نتائج الاختبارات
          </div>
          <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">اتجاه الأداء من محاولة إلى أخرى</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">منحنى سريع يوضح ما إذا كانت نتائجك تتصاعد بثبات، تتذبذب، أو تحتاج إلى مراجعة أقرب.</p>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <StatChip label="آخر نتيجة" value={trend.latest !== null ? `${trend.latest}%` : "—"} />
          <StatChip label="متوسط آخر المحاولات" value={trend.average !== null ? `${trend.average}%` : "—"} />
          <StatChip label="محاولات هذا الأسبوع" value={String(attemptsThisWeek)} />
        </div>
      </div>

      {trend.points.length ? (
        <>
          <div className="mt-6 rounded-[1.7rem] bg-[linear-gradient(135deg,#082f49_0%,#0f4c81_52%,#0891b2_100%)] p-5 text-white shadow-xl shadow-sky-900/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white/80">اتجاه آخر {trend.points.length} محاولات</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold">
                  {trend.direction === "up" ? <TrendingUp className="size-4 text-emerald-200" /> : trend.direction === "down" ? <TrendingDown className="size-4 text-rose-200" /> : <Minus className="size-4 text-sky-100" />}
                  {trend.delta === null ? "بانتظار محاولتين على الأقل" : trend.delta > 0 ? `تحسن +${trend.delta} نقطة` : trend.delta < 0 ? `انخفاض ${trend.delta} نقطة` : "مستوى ثابت"}
                </div>
              </div>
              <p className="text-sm text-white/80">{trend.previous !== null ? `المحاولة السابقة: ${trend.previous}%` : "لا توجد محاولة سابقة بعد"}</p>
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.35rem] bg-white/8 p-4">
              <svg viewBox="0 0 320 120" className="h-32 w-full" preserveAspectRatio="none" aria-label="منحنى نتائج الاختبارات الأخيرة">
                <defs>
                  <linearGradient id="quiz-trend-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                  </linearGradient>
                  <linearGradient id="quiz-trend-line" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#fde68a" />
                  </linearGradient>
                </defs>
                {Array.from({ length: 4 }).map((_, index) => (
                  <line key={index} x1="0" x2="320" y1={20 + index * 25} y2={20 + index * 25} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 6" />
                ))}
                <path d={`${linePoints.areaPath}`} fill="url(#quiz-trend-fill)" />
                <polyline fill="none" stroke="url(#quiz-trend-line)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={linePoints.polyline} />
                {linePoints.circles.map((circle) => (
                  <g key={circle.key}>
                    <circle cx={circle.x} cy={circle.y} r="5" fill="#ffffff" opacity="0.96" />
                    <circle cx={circle.x} cy={circle.y} r="10" fill="rgba(255,255,255,0.12)" />
                  </g>
                ))}
              </svg>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] text-white/75 sm:grid-cols-8">
                {trend.points.map((point) => (
                  <div key={point.attemptId}>{point.label}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {trend.points
              .slice()
              .reverse()
              .map((point) => (
                <div key={point.attemptId} className="rounded-[1.4rem] border border-white/70 bg-white/75 px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 print:break-inside-avoid">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      {point.lessonSlug ? (
                        <Link href={`/lessons/${point.lessonSlug}`} className="font-bold text-slate-950 hover:text-sky-700 dark:text-white dark:hover:text-sky-400">
                          {point.lessonTitle}
                        </Link>
                      ) : (
                        <p className="font-bold text-slate-950 dark:text-white">{point.lessonTitle}</p>
                      )}
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">نتيجة المحاولة {point.percent}% — سجلت في {formatDate(point.completedAt)}</p>
                      {point.lessonSlug ? (
                        <Link href={`/lessons/${point.lessonSlug}`} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-sky-700 dark:text-white dark:hover:text-sky-400 print:hidden">
                          افتح الدرس
                          <ArrowUpLeft className="size-4" />
                        </Link>
                      ) : null}
                    </div>
                    <div className="text-left">
                      <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-black text-slate-900 dark:bg-slate-900 dark:text-white">{point.percent}%</div>
                      <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock3 className="size-3.5" />
                        {point.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300/80 px-4 py-8 text-sm leading-7 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          لا توجد محاولات كافية بعد لرسم منحنى النتائج. بمجرد إنهاء اختبارين على الأقل، سيظهر اتجاه الأداء هنا.
        </div>
      )}
    </section>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/70 bg-white/75 px-4 py-3 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function buildSparklinePoints(points: QuizTrendPoint[]) {
  if (!points.length) {
    return { polyline: "", areaPath: "", circles: [] as Array<{ key: string; x: number; y: number }> };
  }

  const width = 320;
  const height = 120;
  const paddingX = 14;
  const paddingY = 12;
  const stepX = points.length === 1 ? 0 : (width - paddingX * 2) / (points.length - 1);

  const circles = points.map((point, index) => {
    const x = paddingX + index * stepX;
    const y = paddingY + ((100 - point.percent) / 100) * (height - paddingY * 2);
    return { key: point.attemptId, x, y };
  });

  const polyline = circles.map((circle) => `${circle.x},${circle.y}`).join(" ");
  const areaPath = `M ${circles[0].x} ${height - paddingY} L ${polyline.replace(/ /g, " L ")} L ${circles.at(-1)?.x ?? circles[0].x} ${height - paddingY} Z`;

  return { polyline, areaPath, circles };
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormatter.format(date);
}
