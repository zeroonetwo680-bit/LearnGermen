import Link from "next/link";
import { BookOpenCheck, Languages, Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-6 pt-14 sm:px-6 lg:px-8">
      <div className="animate-fade-up premium-card-strong mx-auto grid w-full max-w-7xl gap-8 rounded-[2rem] px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="section-kicker">
            <Sparkles className="size-3.5" />
            تعلم الألمانية بالنطق المكتوب
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">من ملف PDF جامد إلى منصة أكثر فاعلية</h2>
          <p className="mt-4 max-w-xl text-sm leading-8 text-slate-600 dark:text-slate-300">
            هذه الواجهة تعيد تقديم محتوى الكتاب في صورة دروس منظمة ومفردات وتمارين واختبارات قصيرة، مع تجربة بصرية أنظف وأكثر راحة للمذاكرة اليومية.
          </p>
        </div>

        <div>
          <p className="text-sm font-black text-slate-900 dark:text-white">أقسام سريعة</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <Link href="/units" className="nav-pill inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:text-sky-700 dark:hover:text-sky-400">
              <Languages className="size-4" /> الوحدات التعليمية
            </Link>
            <Link href="/lessons" className="nav-pill inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:text-sky-700 dark:hover:text-sky-400">
              <BookOpenCheck className="size-4" /> كل الدروس
            </Link>
            <Link href="/dashboard" className="nav-pill inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:text-sky-700 dark:hover:text-sky-400">
              <Sparkles className="size-4" /> لوحة التقدم
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-black text-slate-900 dark:text-white">طريقة الاستخدام</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <li>ابدأ بدرس قصير ثم راجع المفردات.</li>
            <li>جرّب تمارين الدرس قبل الاختبار.</li>
            <li>أعد الاختبار لتحسين أفضل نتيجة.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
