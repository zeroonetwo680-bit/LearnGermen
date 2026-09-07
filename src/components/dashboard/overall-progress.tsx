import { Award, BookOpenCheck } from "lucide-react";

export function OverallProgress({ percent }: { percent: number }) {
  return (
    <section className="premium-card-strong rounded-[2rem] p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="section-kicker">
            <Award className="size-3.5" />
            تقدمك في المنصة
          </div>
          <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">كل درس تنهيه يقربك من إتقان الأساسيات</h2>
          <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">اعتمد على التدرج: شرح، مفردات، تمرين، اختبار. كل ذلك ينعكس مباشرة في لوحة التقدم.</p>
        </div>
        <div className="rounded-[1.6rem] bg-[linear-gradient(135deg,#082f49_0%,#0f4c81_50%,#0891b2_100%)] p-6 text-white shadow-xl shadow-sky-900/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-sky-100">نسبة الإكمال</p>
              <p className="mt-2 text-5xl font-black">{percent}%</p>
            </div>
            <BookOpenCheck className="size-10 text-cyan-100" />
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e_0%,#34d399_50%,#67e8f9_100%)]" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
