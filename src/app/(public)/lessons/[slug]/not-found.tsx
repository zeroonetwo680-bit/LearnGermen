import Link from "next/link";

export default function LessonNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-black">الدرس غير موجود</h1>
      <p className="text-slate-600 dark:text-slate-300">تحقق من الرابط أو عد إلى صفحة الدروس.</p>
      <Link href="/lessons" className="rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white">العودة إلى الدروس</Link>
    </div>
  );
}
