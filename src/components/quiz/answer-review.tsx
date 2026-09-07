import { CheckCircle2, XCircle } from "lucide-react";
import type { QuestionDto, QuizResultDto } from "@/lib/api/contracts/question";

function labelFor(question: QuestionDto, optionId: string) {
  return question.options.find((option) => option.id === optionId)?.text ?? optionId;
}

export function AnswerReview({ questions, result }: { questions: QuestionDto[]; result: QuizResultDto }) {
  return (
    <div className="space-y-4">
      {result.answers.map((answer, index) => {
        const question = questions.find((item) => item.id === answer.questionId);
        if (!question) return null;

        return (
          <section
            key={answer.questionId}
            className={`rounded-[1.8rem] border p-5 shadow-sm ${
              answer.isCorrect
                ? "border-emerald-200 bg-emerald-50/90 dark:border-emerald-900 dark:bg-emerald-950/30"
                : "border-red-200 bg-red-50/90 dark:border-red-900 dark:bg-red-950/30"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">السؤال {index + 1}</p>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${answer.isCorrect ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200" : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-200"}`}>
                {answer.isCorrect ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                {answer.isCorrect ? "إجابة صحيحة" : "إجابة تحتاج مراجعة"}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-black text-slate-900 dark:text-white">{question.question}</h3>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <p className="rounded-[1.15rem] bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:bg-slate-900/70 dark:text-slate-200">
                <span className="font-bold">إجابتك:</span>{" "}
                {answer.selectedOptionIds.length
                  ? answer.selectedOptionIds.map((optionId) => labelFor(question, optionId)).join("، ")
                  : "لم تتم الإجابة"}
              </p>
              <p className="rounded-[1.15rem] bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:bg-slate-900/70 dark:text-slate-200">
                <span className="font-bold">الإجابة الصحيحة:</span>{" "}
                {answer.correctOptionIds.map((optionId) => labelFor(question, optionId)).join("، ")}
              </p>
            </div>
            {answer.explanation ? <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer.explanation}</p> : null}
          </section>
        );
      })}
    </div>
  );
}
