import type { HomeContentDto } from "@/lib/api/contracts/home";
import { DynamicIcon } from "@/components/shared/icon";

export function FeaturesSection({ content }: { content: HomeContentDto }) {
  return (
    <section className="space-y-6">
      <div>
        <span className="section-kicker">مزايا التجربة</span>
        <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">تفاصيل صغيرة تجعل التعلم أفضل</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {content.features.map((feature) => (
          <article key={feature.id} className="premium-card group rounded-[1.75rem] p-5 transition hover:-translate-y-1">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-800 shadow-sm dark:from-sky-950/70 dark:to-cyan-950/50 dark:text-sky-300">
              <DynamicIcon name={feature.icon} className="size-6" />
            </div>
            <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
