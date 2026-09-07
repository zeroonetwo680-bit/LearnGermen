import Link from "next/link";
import type { QuizResultDto } from "@/lib/api/contracts/question";

export function QuizResult({ lessonSlug, result }: { lessonSlug: string; result: QuizResultDto }) {
  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-8 text-white shadow-2xl">
      <p className="text-sm font-semibold text-emerald-100">🎉 انتهى الاختبار</p>
      <h1 className="mt-3 text-3xl font-black">النتيجة: {result.percent}%</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm text-emerald-50">النقاط</p>
          <p className="mt-2 text-2xl font-black">{result.score} / {result.total}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm text-emerald-50">إجابات صحيحة</p>
          <p className="mt-2 text-2xl font-black">{result.correctCount}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm text-emerald-50">إجابات خاطئة</p>
          <p className="mt-2 text-2xl font-black">{result.incorrectCount}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/lessons/${lessonSlug}/quiz`} className="rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50">
          إعادة الاختبار
        </Link>
        <Link href={`/lessons/${lessonSlug}`} className="rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
          العودة إلى الدرس
        </Link>
      </div>
    </section>
  );
}
