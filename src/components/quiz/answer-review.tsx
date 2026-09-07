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
            className={`rounded-3xl border p-5 ${
              answer.isCorrect
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
            }`}
          >
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">السؤال {index + 1}</p>
            <h3 className="mt-2 text-lg font-black text-slate-900 dark:text-white">{question.question}</h3>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
              <span className="font-bold">إجابتك:</span>{" "}
              {answer.selectedOptionIds.length
                ? answer.selectedOptionIds.map((optionId) => labelFor(question, optionId)).join("، ")
                : "لم تتم الإجابة"}
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="font-bold">الإجابة الصحيحة:</span>{" "}
              {answer.correctOptionIds.map((optionId) => labelFor(question, optionId)).join("، ")}
            </p>
            {answer.explanation ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer.explanation}</p> : null}
          </section>
        );
      })}
    </div>
  );
}
