import { cn } from "@/lib/utils";

export function GermanInlineText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span lang="de" dir="ltr" className={cn("inline-flex font-semibold tracking-wide text-slate-900 dark:text-white", className)}>
      {children}
    </span>
  );
}
