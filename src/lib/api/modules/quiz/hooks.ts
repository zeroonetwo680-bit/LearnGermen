"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GradeQuizInput } from "@/lib/api/contracts/question";
import { studentApi } from "@/lib/api/client/scoped-client";
import { progressKeys } from "@/lib/api/modules/progress/keys";

export function useGradeQuiz(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GradeQuizInput) => studentApi.quiz.grade(slug, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: progressKeys.all });
    },
  });
}
