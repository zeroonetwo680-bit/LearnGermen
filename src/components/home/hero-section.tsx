import Link from "next/link";
import { ArrowUpLeft, BookOpenCheck, Languages, Sparkles } from "lucide-react";
import type { HomeContentDto } from "@/lib/api/contracts/home";
import { DynamicIcon } from "@/components/shared/icon";

export function HeroSection({ content }: { content: HomeContentDto }) {
  return (
    <section className="animate-fade-up relative overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,#082f49_0%,#0f4c81_42%,#0891b2_100%)] px-6 py-10 text-white shadow-[0_30px_80px_rgba(8,47,73,0.35)] sm:px-10 sm:py-14">
      <div className="absolute -left-12 top-10 size-44 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 size-64 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="animate-fade-up animate-fade-up-delay-1 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-sky-50 backdrop-blur">
            <Sparkles className="size-4 text-amber-300" />
            تعلم الألمانية من كتابك المحلي لكن بتجربة أكثر فخامة
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{content.heroTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-9 text-sky-50/95">{content.heroSubtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/lessons" className="button-shine pressable inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-sky-900 shadow-lg shadow-sky-950/10 transition hover:bg-sky-50">
              {content.primaryCta}
              <ArrowUpLeft className="size-4" />
            </Link>
            <Link href="/units" className="pressable rounded-full border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              {content.secondaryCta}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sky-50">RTL عربية</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sky-50">نطق مكتوب</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sky-50">اختبارات سريعة</span>
          </div>
        </div>

        <div className="animate-fade-up animate-fade-up-delay-2 interactive-lift premium-card rounded-[1.75rem] border-white/10 bg-white/10 p-5 text-white dark:border-white/10 dark:bg-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-sky-100">المسار المقترح</p>
              <h2 className="mt-1 text-2xl font-black">ابدأ من النطق ثم انتقل إلى المحادثة</h2>
            </div>
            <div className="animate-float-soft flex size-12 items-center justify-center rounded-2xl bg-white/10">
              <Languages className="size-6 text-cyan-100" />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {content.features.slice(0, 4).map((feature, index) => (
              <div key={feature.id} className="interactive-lift rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-100">
                    <DynamicIcon name={feature.icon} className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-100">0{index + 1}</span>
                      <h3 className="font-bold text-white">{feature.title}</h3>
                    </div>
                    <p className="mt-1 text-sm leading-7 text-sky-50/90">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
            <BookOpenCheck className="size-5 text-emerald-200" />
            كل درس يحتوي على شرح + مفردات + تمرين + اختبار قصير.
          </div>
        </div>
      </div>
    </section>
  );
}
