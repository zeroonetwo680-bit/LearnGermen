"use client";

import { isApiError } from "@/lib/api/transport/errors";

export function ApiQueryError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = isApiError(error)
    ? error.code === "INVALID_API_RESPONSE"
      ? "البيانات العائدة من المصدر لا تطابق العقد المتوقع."
      : error.detail || error.message
    : "حدث خطأ غير متوقع أثناء تحميل البيانات.";

  return (
    <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100">
      <h3 className="font-bold">تعذر تحميل هذا الجزء</h3>
      <p className="mt-2 text-sm leading-7">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      ) : null}
    </div>
  );
}
