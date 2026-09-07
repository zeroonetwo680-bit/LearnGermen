"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QuizResultDto } from "@/lib/api/contracts/question";
import { getProgressRepository } from "@/lib/progress/progress-repository";
import { progressKeys } from "@/lib/api/modules/progress/keys";

const progressRepository = getProgressRepository();

export function useProgress() {
  return useQuery({ queryKey: progressKeys.root(), queryFn: () => progressRepository.get() });
}

export function useMarkLessonCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => progressRepository.markLessonCompleted(lessonId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: progressKeys.all }),
  });
}

export function useSaveQuizResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, result }: { lessonId: string; result: QuizResultDto }) =>
      progressRepository.saveQuizResult(lessonId, result),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: progressKeys.all }),
  });
}

export function useSetLastVisitedLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => progressRepository.setLastVisitedLesson(lessonId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: progressKeys.all }),
  });
}

export function useResetProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => progressRepository.reset(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: progressKeys.all }),
  });
}
