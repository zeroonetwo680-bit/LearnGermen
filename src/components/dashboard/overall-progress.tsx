export function OverallProgress({ percent }: { percent: number }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">تقدمك في المنصة</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">كل اختبار تنهيه يرفع نسبة الإكمال الخاصة بك.</p>
        </div>
        <span className="text-3xl font-black text-sky-700 dark:text-sky-400">{percent}%</span>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-sky-600" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}
