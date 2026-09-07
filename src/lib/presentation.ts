export const unitColorStyles = {
  blue: {
    tint: "from-sky-500/20 via-cyan-500/10 to-transparent",
    badge: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
    icon: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200/70 dark:border-sky-900/50",
    dot: "bg-sky-500",
  },
  green: {
    tint: "from-emerald-500/20 via-teal-500/10 to-transparent",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    icon: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200/70 dark:border-emerald-900/50",
    dot: "bg-emerald-500",
  },
  violet: {
    tint: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
    icon: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200/70 dark:border-violet-900/50",
    dot: "bg-violet-500",
  },
  amber: {
    tint: "from-amber-500/20 via-orange-500/10 to-transparent",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    icon: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200/70 dark:border-amber-900/50",
    dot: "bg-amber-500",
  },
  rose: {
    tint: "from-rose-500/20 via-pink-500/10 to-transparent",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
    icon: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200/70 dark:border-rose-900/50",
    dot: "bg-rose-500",
  },
} as const;

export const levelStyles = {
  A1: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-900/50",
  A2: "bg-amber-100 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-900/50",
  B1: "bg-violet-100 text-violet-800 ring-1 ring-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:ring-violet-900/50",
} as const;
