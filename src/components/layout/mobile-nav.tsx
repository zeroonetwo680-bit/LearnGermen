"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        aria-expanded={open}
        aria-label="القائمة"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div className="absolute inset-x-4 top-20 z-50 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-2">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
