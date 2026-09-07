import type { ApiClient } from "@/lib/api/transport/types";
import type { HomeContentDto } from "@/lib/api/contracts/home";
import { homeContentSchema } from "@/lib/api/schemas/course";

export function createHomeEndpoint(client: ApiClient) {
  return {
    content(): Promise<HomeContentDto> {
      return client.get("/v1/home/content", { responseSchema: homeContentSchema });
    },
  };
}
