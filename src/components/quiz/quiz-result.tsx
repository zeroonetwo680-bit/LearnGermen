import Link from "next/link";
import { PartyPopper, RotateCcw } from "lucide-react";
import type { QuizResultDto } from "@/lib/api/contracts/question";

export function QuizResult({ lessonSlug, result }: { lessonSlug: string; result: QuizResultDto }) {
  return (
    <section className="relative overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#065f46_0%,#0f766e_48%,#0891b2_100%)] p-8 text-white shadow-[0_30px_80px_rgba(6,95,70,0.35)]">
      <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-cyan-200/20 blur-3xl" />
      <div className="relative">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-50">
          <PartyPopper className="size-4 text-amber-300" />
          انتهى الاختبار بنجاح
        </p>
        <h1 className="mt-4 text-3xl font-black sm:text-4xl">النتيجة النهائية: {result.percent}%</h1>
        <p className="mt-3 text-sm leading-7 text-emerald-50/90">يمكنك الآن مراجعة كل سؤال ومعرفة أين كانت الإجابة صحيحة وأين تحتاج إلى تحسين.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-emerald-50">النقاط</p>
            <p className="mt-2 text-2xl font-black">{result.score} / {result.total}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-emerald-50">إجابات صحيحة</p>
            <p className="mt-2 text-2xl font-black">{result.correctCount}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-emerald-50">إجابات خاطئة</p>
            <p className="mt-2 text-2xl font-black">{result.incorrectCount}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/lessons/${lessonSlug}/quiz`} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-50">
            <RotateCcw className="size-4" />
            إعادة الاختبار
          </Link>
          <Link href={`/lessons/${lessonSlug}`} className="rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
            العودة إلى الدرس
          </Link>
        </div>
      </div>
    </section>
  );
}
