import { gradeQuiz } from "@/lib/quiz/grade-quiz";
import type { PageResult } from "@/lib/api/contracts/common";
import type { LessonDto, LessonSummaryDto } from "@/lib/api/contracts/lesson";
import { ApiError } from "@/lib/api/transport/errors";
import type { ApiTransport, RequestOptions } from "@/lib/api/transport/types";
import { getMockDatabase, saveAttempt } from "@/lib/api/mock/mock-store";
import { normalizeSearchValue } from "@/lib/utils";

function wait(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function notFound(path: string): never {
  throw new ApiError({ status: 404, code: "NOT_FOUND", title: "العنصر غير موجود", detail: path });
}

function paginate<T>(items: T[], page = 1, pageSize = 12): PageResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    meta: { page: safePage, pageSize, total, totalPages },
  };
}

function summarizeLesson(lesson: LessonDto): LessonSummaryDto {
  return {
    id: lesson.id,
    slug: lesson.slug,
    number: lesson.number,
    title: lesson.title,
    description: lesson.description,
    unitId: lesson.unitId,
    unitTitle: lesson.unitTitle,
    level: lesson.level,
    duration: lesson.duration,
    status: lesson.status,
    tags: lesson.tags,
    skillFocus: lesson.skillFocus,
    questionCount: lesson.questionCount,
    exerciseCount: lesson.exerciseCount,
    vocabularyCount: lesson.vocabularyCount,
    updatedAt: lesson.updatedAt,
  };
}

function buildSearchHaystack(lesson: LessonDto) {
  const db = getMockDatabase();
  const vocab = db.vocabulary.filter((item) => item.lessonId === lesson.id);
  const exerciseText = db.exercises
    .filter((item) => item.lessonId === lesson.id)
    .flatMap((item) => [item.title, item.instructions, item.prompt])
    .join(" ");
  return normalizeSearchValue(
    [
      lesson.title,
      lesson.description,
      lesson.tags.join(" "),
      lesson.content.introduction,
      lesson.content.summary ?? "",
      lesson.content.sections.map((section) => `${section.title} ${section.body}`).join(" "),
      lesson.content.examples.map((example) => `${example.german} ${example.meaningAr}`).join(" "),
      vocab.map((item) => `${item.german} ${item.transliterationAr} ${item.meaningAr}`).join(" "),
      exerciseText,
    ].join(" "),
  );
}

function lessonBySlug(slug: string) {
  const lesson = getMockDatabase().lessons.find((item) => item.slug === slug);
  if (!lesson) notFound(`/v1/lessons/${slug}`);
  return lesson;
}

export function createMockTransport(): ApiTransport {
  return {
    async request<TResponse, TBody = unknown>(request: RequestOptions<TBody, TResponse>) {
      await wait();
      const db = getMockDatabase();
      const { method, path, body, query } = request;

      if (method === "GET" && path === "/v1/home/content") {
        return db.home as TResponse;
      }

      if (method === "GET" && path === "/v1/units") {
        return [...db.units].sort((a, b) => a.order - b.order) as TResponse;
      }

      if (method === "GET" && /^\/v1\/units\/.+/.test(path)) {
        const idOrSlug = path.split("/").pop()!;
        const unit = db.units.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
        if (!unit) notFound(path);
        const lessons = db.lessons
          .filter((lesson) => lesson.unitId === unit.id)
          .sort((a, b) => a.number - b.number)
          .map(summarizeLesson);
        return { ...unit, lessons } as TResponse;
      }

      if (method === "GET" && path === "/v1/lessons") {
        const filter = (query ?? {}) as Record<string, string>;
        let items = db.lessons.filter((lesson) => lesson.status === (filter.status || "published"));
        if (filter.unitId) items = items.filter((lesson) => lesson.unitId === filter.unitId);
        if (filter.level) items = items.filter((lesson) => lesson.level === filter.level);
        if (filter.skill) {
          const skill = filter.skill as string;
          items = items.filter((lesson) => lesson.skillFocus.some((value) => value === skill));
        }
        if (filter.search) {
          const term = normalizeSearchValue(filter.search);
          items = items.filter((lesson) => buildSearchHaystack(lesson).includes(term));
        }

        const sort = filter.sort || "default";
        items = [...items].sort((a, b) => {
          if (sort === "newest") return b.updatedAt.localeCompare(a.updatedAt);
          if (sort === "duration") return a.duration - b.duration;
          if (sort === "level") return a.level.localeCompare(b.level);
          return a.number - b.number;
        });

        return paginate(
          items.map(summarizeLesson),
          Number(filter.page || 1),
          Number(filter.pageSize || 12),
        ) as TResponse;
      }

      if (method === "GET" && /^\/v1\/lessons\/next\/.+/.test(path)) {
        const slug = path.split("/").pop()!;
        const ordered = [...db.lessons].sort((a, b) => a.number - b.number);
        const index = ordered.findIndex((item) => item.slug === slug);
        if (index === -1) notFound(path);
        const previous = index > 0 ? summarizeLesson(ordered[index - 1]) : undefined;
        const next = index < ordered.length - 1 ? summarizeLesson(ordered[index + 1]) : undefined;
        return { previous, next } as TResponse;
      }

      const lessonMatch = path.match(/^\/v1\/lessons\/([^/]+)(?:\/(resources|vocabulary|exercises|questions|quiz))?$/);
      if (method === "GET" && lessonMatch) {
        const slug = lessonMatch[1];
        const segment = lessonMatch[2];
        const lesson = lessonBySlug(slug);
        if (!segment) return lesson as TResponse;
        if (segment === "resources") return db.resources.filter((item) => item.lessonId === lesson.id) as TResponse;
        if (segment === "vocabulary") return db.vocabulary.filter((item) => item.lessonId === lesson.id) as TResponse;
        if (segment === "exercises") return db.exercises.filter((item) => item.lessonId === lesson.id).sort((a, b) => a.order - b.order) as TResponse;
        if (segment === "questions") return db.questions.filter((item) => item.lessonId === lesson.id) as TResponse;
        if (segment === "quiz") {
          return db.questions.filter((item) => item.lessonId === lesson.id).map((item) => ({
            id: item.id,
            lessonId: item.lessonId,
            type: item.type,
            question: item.question,
            options: item.options,
            explanation: item.explanation,
            points: item.points,
          })) as TResponse;
        }
      }

      const gradeMatch = path.match(/^\/v1\/lessons\/([^/]+)\/quiz\/grade$/);
      if (method === "POST" && gradeMatch) {
        const slug = gradeMatch[1];
        const lesson = lessonBySlug(slug);
        const questions = db.questions.filter((item) => item.lessonId === lesson.id);
        const input = body as { lessonId: string; answers: Record<string, string[]> };
        const result = gradeQuiz(questions, input.answers, lesson.id);
        saveAttempt(result);
        return result as TResponse;
      }

      notFound(path);
    },
  };
}
