"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { BookOpenCheck, Home, Info, LayoutGrid, Menu, Sparkles, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navIcons = {
  "/": Home,
  "/units": LayoutGrid,
  "/lessons": BookOpenCheck,
  "/dashboard": Sparkles,
  "/about": Info,
} as const;

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  const primaryLinks = useMemo(() => siteConfig.nav.slice(0, 4), []);
  const secondaryLinks = useMemo(() => siteConfig.nav.slice(4), []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpenPath(open ? null : pathname)}
        className="button-shine pressable nav-pill inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:shadow-black/20"
        aria-expanded={open}
        aria-controls="mobile-navigation-drawer"
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </span>
        <span className="hidden sm:inline">القائمة</span>
      </button>

      {open ? (
        <div className="mobile-backdrop fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-[2px]">
          <button type="button" className="absolute inset-0 cursor-default" aria-label="إغلاق القائمة" onClick={() => setOpenPath(null)} />
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="التنقل في الموقع"
            className="mobile-sheet absolute inset-y-0 right-0 flex w-[min(92vw,24rem)] flex-col gap-5 border-l border-white/20 bg-[rgba(255,255,255,0.88)] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.22)] backdrop-blur-2xl dark:border-slate-800 dark:bg-[rgba(2,6,23,0.92)] dark:shadow-[0_24px_60px_rgba(2,6,23,0.68)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">
                  <Sparkles className="size-3.5" />
                  تنقل سريع
                </p>
                <h2 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">كل أقسام المنصة بين يديك</h2>
                <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">انتقل بين الوحدات والدروس ولوحة التقدم بسهولة على الجوال.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenPath(null)}
                className="pressable rounded-full border border-slate-200 bg-white/80 p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                aria-label="إغلاق القائمة"
              >
                <X className="size-4" />
              </button>
            </div>

            <nav className="space-y-2" aria-label="روابط الهاتف">
              {primaryLinks.map((item, index) => {
                const Icon = navIcons[item.href as keyof typeof navIcons] ?? Home;
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "animate-fade-up button-shine interactive-lift nav-pill flex items-center justify-between rounded-[1.5rem] border px-4 py-3.5 text-sm font-bold",
                      active
                        ? "nav-pill-active border-sky-200/70 dark:border-sky-900/60"
                        : "border-white/70 bg-white/75 text-slate-700 dark:border-slate-800 dark:bg-slate-950/75 dark:text-slate-100",
                      index === 0 && "animate-fade-up-delay-1",
                      index === 1 && "animate-fade-up-delay-2",
                      index >= 2 && "animate-fade-up-delay-3",
                    )}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenPath(null)}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn("flex size-10 items-center justify-center rounded-2xl", active ? "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300" : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300")}>
                        <Icon className="size-4" />
                      </span>
                      {item.label}
                    </span>
                    <span className={cn("text-xs", active ? "text-sky-700 dark:text-sky-300" : "text-slate-400 dark:text-slate-500")}>
                      {active ? "أنت هنا" : "فتح"}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {secondaryLinks.length ? (
              <div className="space-y-2 border-t border-slate-200/80 pt-4 dark:border-slate-800">
                {secondaryLinks.map((item) => {
                  const Icon = navIcons[item.href as keyof typeof navIcons] ?? Info;
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "nav-pill flex items-center gap-3 rounded-[1.35rem] px-4 py-3 text-sm font-semibold",
                        active ? "nav-pill-active" : "text-slate-600 dark:text-slate-300",
                      )}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpenPath(null)}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-auto rounded-[1.6rem] bg-[linear-gradient(135deg,#082f49_0%,#0f4c81_55%,#0891b2_100%)] p-5 text-white shadow-xl shadow-sky-900/20">
              <p className="text-sm font-bold text-white">ابدأ بسرعة</p>
              <p className="mt-2 text-sm leading-7 text-sky-50/90">اختر المسار المناسب لك: تصفح الدروس مباشرة أو تابع تقدمك داخل اللوحة.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link href="/lessons" className="button-shine pressable rounded-full bg-white px-4 py-2.5 text-center text-sm font-bold text-sky-900" onClick={() => setOpenPath(null)}>
                  ابدأ التعلم
                </Link>
                <Link href="/dashboard" className="pressable rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-center text-sm font-bold text-white" onClick={() => setOpenPath(null)}>
                  تقدمي الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
