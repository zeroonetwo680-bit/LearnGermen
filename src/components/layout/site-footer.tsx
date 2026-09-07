import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200/70 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 dark:text-slate-300 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">تعلم الألمانية بالنطق المكتوب</p>
          <p>واجهة تعليمية عربية مبنية على محتوى الكتاب المحلي وتحويله إلى دروس وتمارين واختبارات.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-sky-700 dark:hover:text-sky-400">عن المنصة</Link>
          <Link href="/dashboard" className="hover:text-sky-700 dark:hover:text-sky-400">لوحة التقدم</Link>
        </div>
      </div>
    </footer>
  );
}
