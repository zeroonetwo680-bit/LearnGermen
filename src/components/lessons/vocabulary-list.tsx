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
        <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <GermanInlineText className="text-lg">{item.german}</GermanInlineText>
            {item.article ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">{item.article}</span> : null}
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.transliterationAr}</p>
          <p className="mt-3 font-semibold text-slate-800 dark:text-slate-100">{item.meaningAr}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.partOfSpeech}</p>
          {item.plural ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold">الجمع:</span> <GermanInlineText>{item.plural}</GermanInlineText></p> : null}
        </article>
      ))}
    </div>
  );
}
