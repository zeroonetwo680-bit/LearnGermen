import { apiConfig } from "@/lib/api/config";
import { createApiClient } from "@/lib/api/client/api-client";
import { createMockTransport } from "@/lib/api/mock/mock-transport";
import { createFetchTransport } from "@/lib/api/transport/fetch-transport";
import type { ApiScope } from "@/lib/api/contracts/common";

export function createBrowserApiClient(scope: ApiScope) {
  const transport =
    apiConfig.mode === "mock"
      ? createMockTransport()
      : createFetchTransport({ baseUrl: apiConfig.browserBasePath, timeoutMs: apiConfig.timeoutMs });

  return createApiClient(transport, scope);
}
