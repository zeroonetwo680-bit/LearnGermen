"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { LessonFilter } from "@/lib/api/contracts/lesson";
import { studentApi } from "@/lib/api/client/scoped-client";
import { lessonKeys } from "@/lib/api/modules/lessons/keys";

export function useLessons(filter: LessonFilter = {}) {
  return useQuery({
    queryKey: lessonKeys.list(filter),
    queryFn: () => studentApi.lessons.list(filter),
    placeholderData: keepPreviousData,
  });
}

export function useLesson(slug: string) {
  return useQuery({ queryKey: lessonKeys.detail(slug), queryFn: () => studentApi.lessons.get(slug), enabled: Boolean(slug) });
}

export function useLessonResources(slug: string) {
  return useQuery({ queryKey: lessonKeys.resources(slug), queryFn: () => studentApi.lessons.resources(slug), enabled: Boolean(slug) });
}

export function useLessonVocabulary(slug: string) {
  return useQuery({ queryKey: lessonKeys.vocabulary(slug), queryFn: () => studentApi.lessons.vocabulary(slug), enabled: Boolean(slug) });
}

export function useLessonExercises(slug: string) {
  return useQuery({ queryKey: lessonKeys.exercises(slug), queryFn: () => studentApi.lessons.exercises(slug), enabled: Boolean(slug) });
}

export function useLessonQuestions(slug: string) {
  return useQuery({ queryKey: lessonKeys.questions(slug), queryFn: () => studentApi.lessons.questions(slug), enabled: Boolean(slug) });
}

export function useLessonQuiz(slug: string) {
  return useQuery({ queryKey: lessonKeys.quiz(slug), queryFn: () => studentApi.lessons.quiz(slug), enabled: Boolean(slug) });
}

export function useLessonNavigation(slug: string) {
  return useQuery({ queryKey: lessonKeys.nav(slug), queryFn: () => studentApi.lessons.navigation(slug), enabled: Boolean(slug) });
}
