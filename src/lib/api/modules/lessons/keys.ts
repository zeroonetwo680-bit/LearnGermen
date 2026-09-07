import type { LessonFilter } from "@/lib/api/contracts/lesson";

function normalizedFilter(filter: LessonFilter = {}) {
  return {
    page: filter.page ?? 1,
    pageSize: filter.pageSize ?? 12,
    search: filter.search ?? "",
    unitId: filter.unitId ?? "",
    level: filter.level ?? "",
    skill: filter.skill ?? "",
    status: filter.status ?? "published",
    sort: filter.sort ?? "default",
  };
}

export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (filter: LessonFilter = {}) => [...lessonKeys.lists(), normalizedFilter(filter)] as const,
  detail: (slug: string) => [...lessonKeys.all, "detail", slug] as const,
  resources: (slug: string) => [...lessonKeys.detail(slug), "resources"] as const,
  vocabulary: (slug: string) => [...lessonKeys.detail(slug), "vocabulary"] as const,
  exercises: (slug: string) => [...lessonKeys.detail(slug), "exercises"] as const,
  questions: (slug: string) => [...lessonKeys.detail(slug), "questions"] as const,
  quiz: (slug: string) => [...lessonKeys.detail(slug), "quiz"] as const,
  nav: (slug: string) => [...lessonKeys.all, "navigation", slug] as const,
};
