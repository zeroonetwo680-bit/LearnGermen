import { describe, expect, beforeEach, test } from "vitest";
import { createApiClient } from "@/lib/api/client/api-client";
import type { ApiScope } from "@/lib/api/contracts/common";
import { createHomeEndpoint } from "@/lib/api/modules/home/endpoint";
import { createLessonsEndpoint } from "@/lib/api/modules/lessons/endpoint";
import { createUnitsEndpoint } from "@/lib/api/modules/units/endpoint";
import { createQuizEndpoint } from "@/lib/api/modules/quiz/endpoint";
import { createMockTransport } from "@/lib/api/mock/mock-transport";
import { resetMockDatabase } from "@/lib/api/mock/mock-store";
import { ApiError } from "@/lib/api/transport/errors";
import { createLocalProgressRepository } from "@/lib/progress/local-progress-repository";

function client(scope: ApiScope = "student") {
  const apiClient = createApiClient(createMockTransport(), scope);
  return {
    home: createHomeEndpoint(apiClient),
    units: createUnitsEndpoint(apiClient),
    lessons: createLessonsEndpoint(apiClient),
    quiz: createQuizEndpoint(apiClient),
  };
}

beforeEach(() => {
  resetMockDatabase();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe("mock workflows", () => {
  test("home content loads with Arabic hero and benefits", async () => {
    const data = await client().home.content();
    expect(data.heroTitle).toContain("تعلم الألمانية");
    expect(data.benefits.length).toBeGreaterThanOrEqual(4);
  });

  test("units load in order with computed counts", async () => {
    const units = await client().units.list();
    expect(units).toHaveLength(4);
    expect(units[0].slug).toBe("pronunciation-foundations");
    expect(units[0].lessonCount).toBe(3);
    expect(units[3].vocabularyCount).toBeGreaterThan(0);
  });

  test("lessons list supports Arabic and German search with pagination", async () => {
    const lessonsApi = client().lessons;
    const arabic = await lessonsApi.list({ search: "الحروف", pageSize: 20 });
    const german = await lessonsApi.list({ search: "Fahrkarte", pageSize: 20 });
    const paged = await lessonsApi.list({ page: 2, pageSize: 5 });

    expect(arabic.items.some((lesson) => lesson.slug === "alphabet-and-letter-sounds")).toBe(true);
    expect(german.items.some((lesson) => lesson.slug === "everyday-vocabulary-and-mini-dialogues")).toBe(true);
    expect(paged.meta.total).toBe(12);
    expect(paged.meta.totalPages).toBe(3);
  });

  test("lesson detail works and unknown slug throws 404", async () => {
    const lessonsApi = client().lessons;
    const lesson = await lessonsApi.get("articles-and-genders");
    expect(lesson.title).toContain("أدوات التعريف");

    await expect(lessonsApi.get("missing-lesson")).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    } satisfies Partial<ApiError>);
  });

  test("vocabulary and exercises endpoints return structured data", async () => {
    const lessonsApi = client().lessons;
    const vocabulary = await lessonsApi.vocabulary("common-verbs");
    const exercises = await lessonsApi.exercises("common-verbs");
    expect(vocabulary[0]).toMatchObject({ german: expect.any(String), transliterationAr: expect.any(String), meaningAr: expect.any(String) });
    expect(exercises).toHaveLength(3);
  });

  test("quiz endpoint strips correctAnswers and grade endpoint works", async () => {
    const api = client();
    const quizQuestions = await api.lessons.quiz("alphabet-and-letter-sounds");
    expect("correctAnswers" in quizQuestions[0]).toBe(false);

    const result = await api.quiz.grade("alphabet-and-letter-sounds", {
      lessonId: "lesson-01",
      startedAt: new Date().toISOString(),
      answers: {
        "q-01-1": ["a"],
        "q-01-2": ["b"],
        "q-01-3": ["a", "c"],
        "q-01-4": ["true"],
        "q-01-5": ["a"],
      },
    });

    expect(result.percent).toBe(100);
    expect(result.correctCount).toBe(5);
  });

  test("grade endpoint rejects malformed input", async () => {
    const api = client();
    await expect(
      api.quiz.grade("alphabet-and-letter-sounds", {
        lessonId: "lesson-01",
        startedAt: new Date().toISOString(),
        answers: { bad: "wrong-shape" as never },
      }),
    ).rejects.toMatchObject({ status: 422, code: "INVALID_API_REQUEST" });
  });

  test("progress repository stores completion and best score safely", async () => {
    const repo = createLocalProgressRepository();
    await repo.markLessonCompleted("lesson-01");
    await repo.markLessonCompleted("lesson-01");
    await repo.saveQuizResult("lesson-01", {
      attemptId: "a1",
      lessonId: "lesson-01",
      score: 3,
      total: 5,
      percent: 60,
      correctCount: 3,
      incorrectCount: 2,
      answers: [],
      completedAt: new Date().toISOString(),
    });
    await repo.saveQuizResult("lesson-01", {
      attemptId: "a2",
      lessonId: "lesson-01",
      score: 5,
      total: 5,
      percent: 100,
      correctCount: 5,
      incorrectCount: 0,
      answers: [],
      completedAt: new Date().toISOString(),
    });
    const progress = await repo.get();
    expect(progress.completedLessons).toHaveLength(1);
    expect(progress.quizScores["lesson-01"].bestScore).toBe(100);
    expect(progress.quizScores["lesson-01"].attempts).toBe(2);
    expect(progress.quizHistory).toHaveLength(2);
    expect(progress.activityLog.some((entry) => entry.type === "quiz")).toBe(true);
    expect(progress.startedAt).toEqual(expect.any(String));

    window.localStorage.setItem(
      "learngerman-progress-v1",
      JSON.stringify({
        version: 1,
        completedLessons: ["lesson-01"],
        quizScores: {
          "lesson-01": {
            bestScore: 100,
            attempts: 2,
            lastScore: 100,
            lastAttemptAt: new Date().toISOString(),
          },
        },
        updatedAt: new Date().toISOString(),
      }),
    );
    const migrated = await repo.get();
    expect(migrated.quizHistory.length).toBeGreaterThan(0);
    expect(migrated.activityLog.length).toBeGreaterThan(0);

    window.localStorage.setItem("learngerman-progress-v1", "not-json");
    const afterCorruption = await repo.get();
    expect(afterCorruption.completedLessons).toEqual([]);
    expect(afterCorruption.quizHistory).toEqual([]);
  });

  test("lesson navigation works across units", async () => {
    const nav = await client().lessons.navigation("prepositions-and-plurals");
    expect(nav.previous?.slug).toBe("pronouns-and-basic-sentence-order");
    expect(nav.next?.slug).toBe("cardinal-numbers");
  });
});
