export function QuizProgress({ current, total }: { current: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
        <span>التقدم داخل الاختبار</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#0ea5e9_0%,#22d3ee_50%,#8b5cf6_100%)] transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
