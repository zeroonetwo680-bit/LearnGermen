export function PageHeader({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-8 space-y-3">
      {eyebrow ? <p className="text-sm font-semibold text-sky-700 dark:text-sky-400">{eyebrow}</p> : null}
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h1>
      {description ? <p className="max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}
