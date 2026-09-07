import type { ApiProblem } from "@/lib/api/contracts/common";

export class ApiError extends Error {
  status: number;
  code: string;
  detail?: string;
  fields?: Record<string, string[]>;
  requestId?: string;

  constructor(problem: ApiProblem) {
    super(problem.title || problem.code);
    this.name = "ApiError";
    this.status = problem.status;
    this.code = problem.code;
    this.detail = problem.detail;
    this.fields = problem.fields;
    this.requestId = problem.requestId;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
