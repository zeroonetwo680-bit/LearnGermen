"use client";

import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/lib/api/client/scoped-client";
import { unitKeys } from "@/lib/api/modules/units/keys";

export function useUnits() {
  return useQuery({ queryKey: unitKeys.lists(), queryFn: () => studentApi.units.list() });
}

export function useUnit(idOrSlug: string) {
  return useQuery({
    queryKey: unitKeys.detail(idOrSlug),
    queryFn: () => studentApi.units.get(idOrSlug),
    enabled: Boolean(idOrSlug),
  });
}
