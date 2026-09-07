import "server-only";

import { serverStudentApi } from "@/lib/api/client/scoped-server-client";

export function listUnitsForServer() {
  return serverStudentApi.units.list();
}

export function getUnitForServer(idOrSlug: string) {
  return serverStudentApi.units.get(idOrSlug);
}
