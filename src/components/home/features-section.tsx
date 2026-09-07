import type { HomeContentDto } from "@/lib/api/contracts/home";
import { DynamicIcon } from "@/components/shared/icon";

export function FeaturesSection({ content }: { content: HomeContentDto }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {content.features.map((feature) => (
        <article key={feature.id} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <DynamicIcon name={feature.icon} className="size-8 text-sky-700 dark:text-sky-400" />
          <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">{feature.title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
        </article>
      ))}
    </section>
  );
}
