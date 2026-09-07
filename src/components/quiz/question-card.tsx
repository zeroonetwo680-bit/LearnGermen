import { CircleHelp, Sparkles } from "lucide-react";
import type { QuizQuestionDto } from "@/lib/api/contracts/question";
import { QuestionOption } from "@/components/quiz/question-option";

type Props = {
  question: QuizQuestionDto;
  value: string[];
  onChange: (next: string[]) => void;
  current: number;
  total: number;
};

export function QuestionCard({ question, value, onChange, current, total }: Props) {
  const toggle = (optionId: string) => {
    if (question.type === "multiple-choice") {
      onChange(value.includes(optionId) ? value.filter((item) => item !== optionId) : [...value, optionId]);
      return;
    }
    onChange([optionId]);
  };

  return (
    <section className="premium-card-strong overflow-hidden rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 dark:shadow-black/20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
            السؤال {current} / {total}
          </span>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950/50 dark:text-sky-300">
            {question.type === "single-choice" ? "اختيار واحد" : question.type === "multiple-choice" ? "اختيار متعدد" : "صح / خطأ"}
          </span>
        </div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Sparkles className="size-3.5 text-amber-500" />
          اختر الإجابة المناسبة ثم انتقل للسؤال التالي
        </span>
      </div>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-800 dark:from-sky-950/60 dark:to-cyan-950/50 dark:text-sky-300">
          <CircleHelp className="size-6" />
        </div>
        <h2 className="text-xl font-black leading-9 text-slate-900 dark:text-white">{question.question}</h2>
      </div>

      <div className="mt-6 space-y-3">
        {question.options.map((option) => (
          <QuestionOption
            key={option.id}
            type={question.type === "multiple-choice" ? "checkbox" : "radio"}
            checked={value.includes(option.id)}
            onChange={() => toggle(option.id)}
            label={option.text}
            name={question.id}
          />
        ))}
      </div>
    </section>
  );
}
