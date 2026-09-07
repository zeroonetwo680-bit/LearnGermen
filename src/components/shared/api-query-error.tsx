"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { isApiError } from "@/lib/api/transport/errors";

export function ApiQueryError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = isApiError(error)
    ? error.code === "INVALID_API_RESPONSE"
      ? "البيانات العائدة من المصدر لا تطابق العقد المتوقع."
      : error.detail || error.message
    : "حدث خطأ غير متوقع أثناء تحميل البيانات.";

  return (
    <div role="alert" className="premium-card-strong rounded-[1.8rem] border-red-200/70 p-5 text-red-900 dark:border-red-900/50 dark:text-red-100">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
          <AlertTriangle className="size-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">تعذر تحميل هذا الجزء</h3>
          <p className="mt-2 text-sm leading-7 text-red-900/80 dark:text-red-100/90">{message}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <RotateCcw className="size-4" />
              إعادة المحاولة
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
