"use client";

import { useState } from "react";
import type { ExerciseDto } from "@/lib/api/contracts/exercise";
import { EmptyState } from "@/components/shared/empty-state";
import { GermanInlineText } from "@/components/lessons/german-inline-text";

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
          <section key={exercise.id} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{exercise.order}. {exercise.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{exercise.instructions}</p>
              </div>
              <button
                type="button"
                onClick={() => setVisibleAnswers((current) => ({ ...current, [exercise.id]: !current[exercise.id] }))}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {visible ? "إخفاء الإجابة" : "عرض الإجابة"}
              </button>
            </div>

            <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">{exercise.prompt}</p>
            <div className="mt-4 space-y-3">
              {exercise.items.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  {item.left || item.right ? (
                    <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                      <GermanInlineText>{item.left}</GermanInlineText>
                      {" "}↔ {item.right}
                    </p>
                  ) : null}
                  {item.prompt ? <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">{item.prompt}</p> : null}
                  {item.text ? <GermanInlineText>{item.text}</GermanInlineText> : null}
                  {visible ? (
                    <p className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                      الإجابة: {Array.isArray(item.answer) ? item.answer.join("، ") : item.answer}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            {exercise.explanation ? <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{exercise.explanation}</p> : null}
          </section>
        );
      })}
    </div>
  );
}
