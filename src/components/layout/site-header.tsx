"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="premium-card-strong mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-[1.75rem] px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="animate-float-soft flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-500/20 transition group-hover:scale-105">
            <Languages className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-900 dark:text-white sm:text-lg">تعلم الألمانية</span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="size-3.5 text-amber-500" />
              تجربة تعليمية أكثر أناقة ووضوحاً
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/70 px-2 py-2 shadow-inner shadow-slate-200/60 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-none md:flex" aria-label="التنقل الرئيسي">
          {siteConfig.nav.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "button-shine nav-pill rounded-full px-4 py-2 text-sm font-semibold",
                  active
                    ? "nav-pill-active"
                    : "text-slate-600 hover:bg-sky-50 hover:text-sky-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
