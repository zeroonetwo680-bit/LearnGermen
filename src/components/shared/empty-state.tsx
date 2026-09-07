export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
