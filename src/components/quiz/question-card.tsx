import type { QuizQuestionDto } from "@/lib/api/contracts/question";
import { QuestionOption } from "@/components/quiz/question-option";

type Props = {
  question: QuizQuestionDto;
  value: string[];
  onChange: (next: string[]) => void;
};

export function QuestionCard({ question, value, onChange }: Props) {
  const toggle = (optionId: string) => {
    if (question.type === "multiple-choice") {
      onChange(value.includes(optionId) ? value.filter((item) => item !== optionId) : [...value, optionId]);
      return;
    }
    onChange([optionId]);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {question.type === "single-choice" ? "اختيار واحد" : question.type === "multiple-choice" ? "اختيار متعدد" : "صح / خطأ"}
      </span>
      <h2 className="mt-4 text-xl font-black leading-9 text-slate-900 dark:text-white">{question.question}</h2>
      <div className="mt-5 space-y-3">
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
