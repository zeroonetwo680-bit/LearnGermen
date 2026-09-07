"use client";

import { useState } from "react";
import { BookOpenCheck, Sparkles } from "lucide-react";
import type { ExerciseDto } from "@/lib/api/contracts/exercise";
import { EmptyState } from "@/components/shared/empty-state";
import { GermanInlineText } from "@/components/lessons/german-inline-text";

const typeLabels = {
  "fill-blank": "أكمل الفراغ",
  matching: "مطابقة",
  ordering: "ترتيب",
  translation: "ترجمة",
} as const;

export function ExerciseSection({ exercises }: { exercises: ExerciseDto[] }) {
  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});

  if (!exercises.length) {
    return <EmptyState title="لا توجد تمارين بعد" description="سيتم إضافة تمارين لهذا الدرس لاحقاً." />;
  }

  return (
    <div className="space-y-5">
      {exercises.map((exercise) => {
        const visible = visibleAnswers[exercise.id];
        return (
          <section key={exercise.id} className="premium-card-strong rounded-[1.8rem] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950/50 dark:text-sky-300">
                    {typeLabels[exercise.type]}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                    التمرين {exercise.order}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">{exercise.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{exercise.instructions}</p>
              </div>
              <button
                type="button"
                onClick={() => setVisibleAnswers((current) => ({ ...current, [exercise.id]: !current[exercise.id] }))}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-sky-800 dark:hover:text-sky-400"
              >
                <Sparkles className="size-4" />
                {visible ? "إخفاء الإجابة" : "عرض الإجابة"}
              </button>
            </div>

            <div className="mt-5 rounded-[1.35rem] border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm font-medium text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/20 dark:text-sky-100">
              {exercise.prompt}
            </div>

            <div className="mt-4 space-y-3">
              {exercise.items.map((item) => (
                <div key={item.id} className="rounded-[1.3rem] border border-white/70 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/75">
                  {item.left || item.right ? (
                    <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                      <GermanInlineText>{item.left}</GermanInlineText>
                      {" "}↔ {item.right}
                    </p>
                  ) : null}
                  {item.prompt ? <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">{item.prompt}</p> : null}
                  {item.text ? <GermanInlineText>{item.text}</GermanInlineText> : null}
                  {visible ? (
                    <p className="mt-3 rounded-[1rem] bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                      الإجابة: {Array.isArray(item.answer) ? item.answer.join("، ") : item.answer}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            {exercise.explanation ? (
              <div className="mt-4 flex items-start gap-2 rounded-[1.15rem] border border-amber-200 bg-amber-50/80 p-4 text-sm leading-7 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
                <BookOpenCheck className="mt-0.5 size-4 shrink-0" />
                <p>{exercise.explanation}</p>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
