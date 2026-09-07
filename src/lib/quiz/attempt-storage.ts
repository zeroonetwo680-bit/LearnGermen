"use client";

import { z } from "zod";
import { quizResultSchema } from "@/lib/api/schemas/course";
import { readSessionStorage, writeSessionStorage } from "@/lib/progress/storage";
import type { QuizResultDto } from "@/lib/api/contracts/question";

const schema = z.object({ result: quizResultSchema });
const key = (attemptId: string) => `learngerman-attempt-${attemptId}`;

export function saveAttemptResult(result: QuizResultDto) {
  writeSessionStorage(key(result.attemptId), { result });
}

export function readAttemptResult(attemptId: string): QuizResultDto | null {
  return readSessionStorage(key(attemptId), schema)?.result ?? null;
}
