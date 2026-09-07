import Link from "next/link";
import { Dot } from "lucide-react";

type BreadcrumbItem = { label: string; href?: string };

export function SiteBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="مسار الصفحة" className="mb-6">
      <ol className="premium-card inline-flex flex-wrap items-center gap-2 rounded-full px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="font-medium hover:text-sky-700 dark:hover:text-sky-400">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-bold text-slate-900 dark:text-white" : undefined}>{item.label}</span>
              )}
              {!isLast ? <Dot className="size-4" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
