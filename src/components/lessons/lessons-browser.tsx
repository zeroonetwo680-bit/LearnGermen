"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import type { LessonFilter } from "@/lib/api/contracts/lesson";
import { useLessons } from "@/lib/api/modules/lessons/hooks";
import { useUnits } from "@/lib/api/modules/units/hooks";
import { ApiQueryError } from "@/components/shared/api-query-error";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { LessonCardSkeleton } from "@/components/lessons/lesson-card-skeleton";
import { LessonGrid } from "@/components/lessons/lesson-grid";

export function LessonsBrowser() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [filter, setFilter] = useState<Omit<LessonFilter, "search">>({ status: "published", pageSize: 12, sort: "default" });

  const queryFilter = useMemo(() => ({ ...filter, search: debouncedSearch }), [debouncedSearch, filter]);
  const lessonsQuery = useLessons(queryFilter);
  const unitsQuery = useUnits();

  return (
    <div className="py-8 sm:py-10">
      <PageHeader title="كل الدروس" description="ابحث داخل الشرح أو المفردات أو الأمثلة الألمانية للعثور على الدرس المناسب." eyebrow="المحتوى التفاعلي" />

      <div className="premium-card-strong mb-8 rounded-[2rem] p-5">
        <div className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
          <SlidersHorizontal className="size-4 text-sky-600 dark:text-sky-400" />
          أدوات التصفية والبحث
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200 lg:col-span-2">
            <span>ابحث في الدروس</span>
            <div className="relative">
              <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="مثال: الحروف، Bahnhof، Zahlen..."
                className="w-full rounded-[1.25rem] border border-slate-300 bg-white/80 py-3 pr-10 pl-4 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950/80"
              />
            </div>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>الوحدة</span>
            <select
              value={filter.unitId ?? ""}
              onChange={(event) => setFilter((current) => ({ ...current, unitId: event.target.value || undefined }))}
              className="w-full rounded-[1.25rem] border border-slate-300 bg-white/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/80"
            >
              <option value="">كل الوحدات</option>
              {unitsQuery.data?.map((unit) => <option key={unit.id} value={unit.id}>{unit.title}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>المستوى</span>
            <select
              value={filter.level ?? ""}
              onChange={(event) => setFilter((current) => ({ ...current, level: (event.target.value || undefined) as LessonFilter['level'] }))}
              className="w-full rounded-[1.25rem] border border-slate-300 bg-white/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/80"
            >
              <option value="">كل المستويات</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>المهارة</span>
            <select
              value={filter.skill ?? ""}
              onChange={(event) => setFilter((current) => ({ ...current, skill: (event.target.value || undefined) as LessonFilter['skill'] }))}
              className="w-full rounded-[1.25rem] border border-slate-300 bg-white/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/80"
            >
              <option value="">كل المهارات</option>
              <option value="alphabet">الحروف</option>
              <option value="pronunciation">النطق</option>
              <option value="grammar">القواعد</option>
              <option value="vocabulary">المفردات</option>
              <option value="numbers">الأعداد</option>
              <option value="conversation">المحادثة</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>الترتيب</span>
            <select
              value={filter.sort ?? "default"}
              onChange={(event) => setFilter((current) => ({ ...current, sort: event.target.value as LessonFilter['sort'] }))}
              className="w-full rounded-[1.25rem] border border-slate-300 bg-white/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/80"
            >
              <option value="default">افتراضي</option>
              <option value="duration">حسب المدة</option>
              <option value="level">حسب المستوى</option>
              <option value="newest">الأحدث</option>
            </select>
          </label>
        </div>
      </div>

      {lessonsQuery.isError ? <ApiQueryError error={lessonsQuery.error} onRetry={() => lessonsQuery.refetch()} /> : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span className="section-kicker">وجدنا {lessonsQuery.data?.meta.total ?? 0} درساً</span>
        {debouncedSearch ? <span>نتائج البحث عن: «{debouncedSearch}»</span> : null}
      </div>

      {lessonsQuery.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <LessonCardSkeleton key={index} />)}
        </div>
      ) : lessonsQuery.data?.items.length ? (
        <LessonGrid lessons={lessonsQuery.data.items} />
      ) : (
        <EmptyState title="لم نجد أي نتائج" description="جرّب البحث بكلمة أخرى أو غيّر عوامل التصفية." />
      )}
    </div>
  );
}
