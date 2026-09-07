import type { GradeQuizInput, QuizResultDto } from "@/lib/api/contracts/question";
import type { ApiClient } from "@/lib/api/transport/types";
import { gradeQuizInputSchema, quizResultSchema } from "@/lib/api/schemas/course";

export function createQuizEndpoint(client: ApiClient) {
  return {
    grade(slug: string, input: GradeQuizInput): Promise<QuizResultDto> {
      return client.post(`/v1/lessons/${slug}/quiz/grade`, input, {
        requestSchema: gradeQuizInputSchema,
        responseSchema: quizResultSchema,
      });
    },
  };
}
