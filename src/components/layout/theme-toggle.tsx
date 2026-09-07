"use client";

import { Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/60 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:shadow-black/20 dark:hover:bg-slate-900"
      aria-label="تبديل الوضع الليلي"
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </span>
      <span>{isDark ? "الوضع الفاتح" : "الوضع الداكن"}</span>
      <Sparkles className="size-3.5 text-amber-500 opacity-70 transition group-hover:rotate-12 group-hover:opacity-100" />
    </button>
  );
}
