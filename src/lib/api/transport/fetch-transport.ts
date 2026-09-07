import { ApiError } from "@/lib/api/transport/errors";
import type { ApiTransport, RequestOptions } from "@/lib/api/transport/types";
import { withQuery } from "@/lib/api/transport/query";

export function createFetchTransport(config: {
  baseUrl: string;
  timeoutMs: number;
  headers?: HeadersInit;
}): ApiTransport {
  return {
    async request<TResponse, TBody = unknown>(request: RequestOptions<TBody, TResponse>) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

      try {
        const response = await fetch(`${config.baseUrl}${withQuery(request.path, request.query)}`, {
          method: request.method,
          headers: {
            Accept: "application/json",
            ...(request.body ? { "Content-Type": "application/json" } : {}),
            ...(config.headers ?? {}),
            ...(request.headers ?? {}),
          },
          body: request.body === undefined ? undefined : JSON.stringify(request.body),
          credentials: "include",
          signal: request.signal ?? controller.signal,
          cache: request.cache,
          next: request.next,
        });

        const contentType = response.headers.get("content-type") || "";
        const payload = contentType.includes("application/json")
          ? await response.json().catch(() => null)
          : await response.text().catch(() => null);

        if (!response.ok) {
          throw new ApiError({
            status: response.status,
            code: typeof payload === "object" && payload?.code ? payload.code : "API_ERROR",
            title: typeof payload === "object" && payload?.title ? payload.title : "فشل الطلب",
            detail:
              typeof payload === "object" && payload?.detail
                ? payload.detail
                : typeof payload === "string"
                  ? payload
                  : undefined,
            fields: typeof payload === "object" && payload?.fields ? payload.fields : undefined,
            requestId: typeof payload === "object" && payload?.requestId ? payload.requestId : undefined,
          });
        }

        return payload as TResponse;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
