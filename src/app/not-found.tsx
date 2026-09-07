import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-black">الصفحة غير موجودة</h1>
      <p className="text-slate-600 dark:text-slate-300">قد يكون الرابط غير صحيح أو تم نقل المحتوى.</p>
      <Link href="/" className="rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white">العودة إلى الرئيسية</Link>
    </div>
  );
}
