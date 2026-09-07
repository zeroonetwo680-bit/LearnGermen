import { ArrowLeft, ArrowRight, CheckCheck } from "lucide-react";

export function QuizNavigation({
  canGoBack,
  canGoNext,
  isLast,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
}: {
  canGoBack: boolean;
  canGoNext: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}) {
  return (
    <div className="premium-card-strong flex flex-wrap items-center justify-between gap-3 rounded-[1.6rem] p-4">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
      >
        <ArrowRight className="size-4" />
        السابق
      </button>
      {isLast ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-60"
        >
          <CheckCheck className="size-4" />
          {isSubmitting ? "جارٍ التصحيح..." : "إرسال الإجابات"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-100"
        >
          التالي
          <ArrowLeft className="size-4" />
        </button>
      )}
    </div>
  );
}
