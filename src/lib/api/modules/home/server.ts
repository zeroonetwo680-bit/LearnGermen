import "server-only";

import { serverStudentApi } from "@/lib/api/client/scoped-server-client";

export function getHomeContentForServer() {
  return serverStudentApi.home.content();
}
