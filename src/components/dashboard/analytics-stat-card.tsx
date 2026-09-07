import type { ReactNode } from "react";

export function AnalyticsStatCard({
  icon,
  label,
  value,
  subtitle,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="premium-card group relative overflow-hidden rounded-[1.7rem] p-5">
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accent} opacity-80`} />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-950 transition duration-300 group-hover:translate-x-0.5 dark:text-white">
              {value}
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/70 bg-white/85 text-slate-900 shadow-lg dark:border-slate-800 dark:bg-slate-950/80 dark:text-white">
            {icon}
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}
