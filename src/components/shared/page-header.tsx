import { Sparkles } from "lucide-react";

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
    <div className="animate-fade-up interactive-lift mb-8 rounded-[2rem] border border-white/70 bg-white/60 px-6 py-7 shadow-lg shadow-slate-200/50 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/60 dark:shadow-black/20 sm:px-8">
      {eyebrow ? (
        <p className="section-kicker">
          <Sparkles className="size-3.5" />
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        <span className="text-gradient">{title}</span>
      </h1>
      {description ? <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}
