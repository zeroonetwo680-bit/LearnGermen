import "server-only";

import { apiConfig } from "@/lib/api/config";
import type { ApiScope } from "@/lib/api/contracts/common";
import { createApiClient } from "@/lib/api/client/api-client";
import { createMockTransport } from "@/lib/api/mock/mock-transport";
import { createFetchTransport } from "@/lib/api/transport/fetch-transport";

export function createServerApiClient(scope: ApiScope) {
  const transport =
    apiConfig.mode === "mock"
      ? createMockTransport()
      : createFetchTransport({ baseUrl: apiConfig.serverOrigin, timeoutMs: apiConfig.timeoutMs });

  return createApiClient(transport, scope);
}
