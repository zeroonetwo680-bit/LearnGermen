import type { ApiScope } from "@/lib/api/contracts/common";
import { ApiError } from "@/lib/api/transport/errors";
import type { ApiClient, ApiTransport, RequestOptions } from "@/lib/api/transport/types";

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export function createApiClient(transport: ApiTransport, scope: ApiScope): ApiClient {
  return {
    scope,
    async request<TResponse, TBody = unknown>(request: RequestOptions<TBody, TResponse>) {
      if (request.requestSchema) {
        const parsed = request.requestSchema.safeParse(request.body);
        if (!parsed.success) {
          throw new ApiError({
            status: 422,
            code: "INVALID_API_REQUEST",
            title: "بيانات غير صالحة",
            fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
          });
        }
      }

      const response = await transport.request<TResponse, TBody>({
        ...request,
        headers: {
          "X-Client-Surface": scope,
          ...(request.headers ?? {}),
        },
      });

      const data = unwrapData<TResponse>(response);

      if (request.responseSchema) {
        const parsed = request.responseSchema.safeParse(data);
        if (!parsed.success) {
          throw new ApiError({
            status: 502,
            code: "INVALID_API_RESPONSE",
            title: "البيانات غير مطابقة للعقد",
            detail: parsed.error.message,
          });
        }
        return parsed.data;
      }

      return data;
    },
    async get(path, options) {
      return this.request({ ...options, method: "GET", path });
    },
    async post(path, body, options) {
      return this.request({ ...options, method: "POST", path, body });
    },
  };
}
