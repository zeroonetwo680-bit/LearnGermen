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
      className="button-shine pressable group inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-2.5 py-2 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:shadow-black/20 sm:px-3.5"
      aria-label="تبديل الوضع الليلي"
      aria-pressed={isDark}
    >
      <span className="animate-pulse-soft flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </span>
      <span className="hidden sm:inline">{isDark ? "الوضع الفاتح" : "الوضع الداكن"}</span>
      <Sparkles className="hidden size-3.5 text-amber-500 opacity-70 transition group-hover:rotate-12 group-hover:opacity-100 sm:block" />
    </button>
  );
}
