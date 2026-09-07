import type { PronunciationRuleDto } from "@/lib/api/contracts/lesson";
import { GermanInlineText } from "@/components/lessons/german-inline-text";
import { EmptyState } from "@/components/shared/empty-state";

export function PronunciationRules({ rules }: { rules: PronunciationRuleDto[] }) {
  if (!rules.length) {
    return <EmptyState title="لا توجد قواعد نطق خاصة في هذا الدرس" description="يمكنك التركيز هنا على الشرح والمفردات والأمثلة." />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {rules.map((rule) => (
        <article key={rule.id} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <GermanInlineText className="text-xl">{rule.pattern}</GermanInlineText>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950/50 dark:text-sky-300">{rule.soundAr}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{rule.explanation}</p>
          <div className="mt-4 space-y-3">
            {rule.examples.map((example) => (
              <div key={`${rule.id}-${example.german}`} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">
                <GermanInlineText>{example.german}</GermanInlineText>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{example.transliterationAr}</p>
                {example.meaningAr ? <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{example.meaningAr}</p> : null}
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
