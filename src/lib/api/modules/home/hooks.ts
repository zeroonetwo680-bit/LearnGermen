"use client";

import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/lib/api/client/scoped-client";
import { homeKeys } from "@/lib/api/modules/home/keys";

export function useHomeContent() {
  return useQuery({
    queryKey: homeKeys.content(),
    queryFn: () => studentApi.home.content(),
  });
}
