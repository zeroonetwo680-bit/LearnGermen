export function QuizProgress({ current, total }: { current: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <span>السؤال {current} من {total}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-sky-600 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
