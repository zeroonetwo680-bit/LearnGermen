import type { ApiClient } from "@/lib/api/transport/types";
import type { UnitDetailDto, UnitDto } from "@/lib/api/contracts/unit";
import { unitDetailSchema, unitSchema } from "@/lib/api/schemas/course";

export function createUnitsEndpoint(client: ApiClient) {
  return {
    list(): Promise<UnitDto[]> {
      return client.get("/v1/units", { responseSchema: unitSchema.array() });
    },
    get(idOrSlug: string): Promise<UnitDetailDto> {
      return client.get(`/v1/units/${idOrSlug}`, { responseSchema: unitDetailSchema });
    },
  };
}
