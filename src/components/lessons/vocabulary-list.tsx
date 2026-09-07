import { BadgeInfo, BookText } from "lucide-react";
import type { VocabularyItemDto } from "@/lib/api/contracts/vocabulary";
import { GermanInlineText } from "@/components/lessons/german-inline-text";
import { EmptyState } from "@/components/shared/empty-state";

export function VocabularyList({ items }: { items: VocabularyItemDto[] }) {
  if (!items.length) {
    return <EmptyState title="لا توجد مفردات بعد" description="سيتم إضافة مفردات لهذا الدرس لاحقاً." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="premium-card-strong rounded-[1.65rem] p-5 transition hover:-translate-y-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-800 dark:from-sky-950/60 dark:to-cyan-950/50 dark:text-sky-300">
                <BookText className="size-5" />
              </div>
              <div>
                <GermanInlineText className="text-lg">{item.german}</GermanInlineText>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.transliterationAr}</p>
              </div>
            </div>
            {item.article ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">{item.article}</span> : null}
          </div>

          <p className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100">{item.meaningAr}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-slate-200 bg-white/75 px-3 py-1 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">{item.partOfSpeech}</span>
            {item.plural ? <span className="rounded-full border border-slate-200 bg-white/75 px-3 py-1 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">الجمع: {item.plural}</span> : null}
          </div>

          {item.exampleGerman ? (
            <div className="mt-4 rounded-[1.15rem] border border-sky-100 bg-sky-50/70 p-4 dark:border-sky-900/40 dark:bg-sky-950/20">
              <div className="flex items-start gap-2 text-sky-800 dark:text-sky-200">
                <BadgeInfo className="mt-0.5 size-4 shrink-0" />
                <div>
                  <GermanInlineText>{item.exampleGerman}</GermanInlineText>
                  {item.exampleTransliterationAr ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.exampleTransliterationAr}</p> : null}
                  {item.exampleMeaningAr ? <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{item.exampleMeaningAr}</p> : null}
                </div>
              </div>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
