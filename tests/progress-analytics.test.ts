import { describe, expect, test } from "vitest";
import { buildQuizTrend, buildWeeklyStreak, getSkillMasteryTier } from "@/lib/progress/analytics";

describe("progress analytics", () => {
  test("buildWeeklyStreak counts consecutive active days inside the last week", () => {
    const referenceDate = new Date("2026-09-07T12:00:00+03:00");
    const streak = buildWeeklyStreak(
      [
        { id: "a", lessonId: "lesson-01", type: "quiz", occurredAt: "2026-09-05T10:00:00+03:00", percent: 80 },
        { id: "b", lessonId: "lesson-02", type: "visit", occurredAt: "2026-09-06T10:00:00+03:00" },
        { id: "c", lessonId: "lesson-03", type: "complete", occurredAt: "2026-09-07T09:00:00+03:00" },
      ],
      referenceDate,
    );

    expect(streak.currentStreak).toBe(3);
    expect(streak.activeDays).toBe(3);
    expect(streak.bestWindow).toBe(3);
    expect(streak.isActiveToday).toBe(true);
  });

  test("buildQuizTrend returns latest delta and direction", () => {
    const trend = buildQuizTrend(
      [
        { attemptId: "1", lessonId: "lesson-01", score: 2, total: 5, percent: 40, correctCount: 2, incorrectCount: 3, completedAt: "2026-09-01T12:00:00Z" },
        { attemptId: "2", lessonId: "lesson-01", score: 4, total: 5, percent: 80, correctCount: 4, incorrectCount: 1, completedAt: "2026-09-03T12:00:00Z" },
      ],
      new Map([
        [
          "lesson-01",
          {
            id: "lesson-01",
            slug: "alphabet-and-letter-sounds",
            number: 1,
            title: "أصوات الحروف",
            description: "",
            unitId: "unit-01",
            unitTitle: "الأساسيات",
            level: "A1",
            duration: 10,
            status: "published",
            tags: [],
            skillFocus: ["alphabet"],
            questionCount: 5,
            exerciseCount: 2,
            vocabularyCount: 6,
            updatedAt: "2026-09-01T12:00:00Z",
          },
        ],
      ]),
    );

    expect(trend.latest).toBe(80);
    expect(trend.previous).toBe(40);
    expect(trend.delta).toBe(40);
    expect(trend.direction).toBe("up");
    expect(trend.points[0].lessonSlug).toBe("alphabet-and-letter-sounds");
  });

  test("getSkillMasteryTier distinguishes mastered, building, and focus states", () => {
    expect(getSkillMasteryTier({ completionPercent: 70, averageBest: 90, attemptedLessons: 3, totalLessons: 4 })).toBe("mastered");
    expect(getSkillMasteryTier({ completionPercent: 50, averageBest: 72, attemptedLessons: 2, totalLessons: 4 })).toBe("building");
    expect(getSkillMasteryTier({ completionPercent: 20, averageBest: 55, attemptedLessons: 1, totalLessons: 5 })).toBe("focus");
  });
});
