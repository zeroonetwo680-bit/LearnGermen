import { Sparkles } from "lucide-react";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="premium-card-strong rounded-[2rem] p-8 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-700 dark:from-sky-950/60 dark:to-cyan-950/50 dark:text-sky-300">
        <Sparkles className="size-6" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
