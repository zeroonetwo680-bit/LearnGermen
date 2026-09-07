"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-3xl font-black">حدث خطأ غير متوقع</h2>
      <p className="text-slate-600 dark:text-slate-300">يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية.</p>
      <div className="flex gap-3">
        <button type="button" onClick={reset} className="rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white">إعادة المحاولة</button>
        <Link href="/" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold dark:border-slate-700">الرئيسية</Link>
      </div>
    </div>
  );
}
