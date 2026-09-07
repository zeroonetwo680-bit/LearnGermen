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
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-100"
      >
        السابق
      </button>
      {isLast ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {isSubmitting ? "جارٍ التصحيح..." : "إرسال الإجابات"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          التالي
        </button>
      )}
    </div>
  );
}
