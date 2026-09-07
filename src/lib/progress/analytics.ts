import type { LessonSkill, LessonSummaryDto } from "@/lib/api/contracts/lesson";
import type { LearningActivityEntryDto, QuizHistoryEntryDto } from "@/lib/api/contracts/progress";

export type SkillMasteryTier = "mastered" | "building" | "focus";

export interface WeeklyActivityPoint {
  key: string;
  label: string;
  active: boolean;
  totalActivities: number;
}

export interface WeeklyStreakSummary {
  currentStreak: number;
  activeDays: number;
  bestWindow: number;
  isActiveToday: boolean;
  days: WeeklyActivityPoint[];
}

export interface QuizTrendPoint {
  attemptId: string;
  lessonId: string;
  lessonSlug?: string;
  lessonTitle: string;
  percent: number;
  completedAt: string;
  label: string;
}

const dayFormatter = new Intl.DateTimeFormat("ar-EG", { weekday: "short" });
const trendFormatter = new Intl.DateTimeFormat("ar-EG", { month: "short", day: "numeric" });

function toDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

function dayKey(value: string | Date) {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayLabel(value: string | Date) {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dayFormatter.format(date);
}

function buildDayRange(days: number, referenceDate: Date) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(referenceDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(referenceDate.getDate() - (days - 1 - index));
    return date;
  });
}

function getDistinctActiveDays(activityLog: LearningActivityEntryDto[]) {
  return [...new Set(activityLog.map((entry) => dayKey(entry.occurredAt)).filter(Boolean))].sort();
}

export function buildWeeklyStreak(activityLog: LearningActivityEntryDto[], referenceDate = new Date()): WeeklyStreakSummary {
  const activityCountByDay = activityLog.reduce<Record<string, number>>((accumulator, entry) => {
    const key = dayKey(entry.occurredAt);
    if (!key) return accumulator;
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  const recentDays = buildDayRange(7, referenceDate).map((date) => {
    const key = dayKey(date);
    return {
      key,
      label: dayLabel(date),
      active: Boolean(activityCountByDay[key]),
      totalActivities: activityCountByDay[key] ?? 0,
    };
  });

  let currentStreak = 0;
  for (let index = recentDays.length - 1; index >= 0; index -= 1) {
    if (!recentDays[index].active) break;
    currentStreak += 1;
  }

  const distinctDays = getDistinctActiveDays(activityLog);
  const bestWindow = distinctDays.length
    ? distinctDays.reduce((best, startKey, index) => {
        const startDate = new Date(`${startKey}T12:00:00`);
        const windowEnd = new Date(startDate);
        windowEnd.setDate(startDate.getDate() + 6);
        const count = distinctDays.slice(index).filter((key) => {
          const current = new Date(`${key}T12:00:00`);
          return current >= startDate && current <= windowEnd;
        }).length;
        return Math.max(best, count);
      }, 0)
    : 0;

  return {
    currentStreak,
    activeDays: recentDays.filter((day) => day.active).length,
    bestWindow,
    isActiveToday: recentDays.at(-1)?.active ?? false,
    days: recentDays,
  };
}

export function buildQuizTrend(
  quizHistory: QuizHistoryEntryDto[],
  lessonMap: Map<string, LessonSummaryDto>,
  limit = 8,
) {
  const points = [...quizHistory]
    .sort((left, right) => new Date(left.completedAt).getTime() - new Date(right.completedAt).getTime())
    .slice(-limit)
    .map((entry) => ({
      attemptId: entry.attemptId,
      lessonId: entry.lessonId,
      lessonSlug: lessonMap.get(entry.lessonId)?.slug,
      lessonTitle: lessonMap.get(entry.lessonId)?.title ?? "درس غير معروف",
      percent: entry.percent,
      completedAt: entry.completedAt,
      label: trendFormatter.format(new Date(entry.completedAt)),
    }));

  const latest = points.at(-1)?.percent ?? null;
  const previous = points.length > 1 ? points.at(-2)?.percent ?? null : null;
  const average = points.length ? Math.round(points.reduce((sum, point) => sum + point.percent, 0) / points.length) : null;
  const delta = latest !== null && previous !== null ? latest - previous : null;
  const direction = delta === null ? "steady" : delta > 0 ? "up" : delta < 0 ? "down" : "steady";

  return {
    points,
    latest,
    previous,
    average,
    delta,
    direction: direction as "up" | "down" | "steady",
  };
}

export function getSkillMasteryTier({
  completionPercent,
  averageBest,
  attemptedLessons,
  totalLessons,
}: {
  completionPercent: number;
  averageBest: number | null;
  attemptedLessons: number;
  totalLessons: number;
}): SkillMasteryTier {
  if (averageBest !== null && averageBest >= 85 && completionPercent >= 60) return "mastered";
  if ((averageBest !== null && averageBest >= 70) || completionPercent >= 45 || attemptedLessons >= Math.ceil(totalLessons / 2)) {
    return "building";
  }
  return "focus";
}

export function getSkillRecommendation({
  skill,
  tier,
  attemptedLessons,
  averageBest,
  nextLesson,
  weakestLesson,
}: {
  skill: LessonSkill;
  tier: SkillMasteryTier;
  attemptedLessons: number;
  averageBest: number | null;
  nextLesson?: LessonSummaryDto;
  weakestLesson?: LessonSummaryDto;
}) {
  if (tier === "mastered") {
    return {
      title: "إتقان مستقر",
      description:
        skill === "conversation"
          ? "استمر على جلسة محادثة قصيرة أسبوعياً للحفاظ على الطلاقة وسرعة الاستدعاء."
          : "حافظ على هذا المستوى عبر مراجعة خاطفة وتمرين واحد فقط كل عدة أيام.",
      lesson: nextLesson,
      actionLabel: nextLesson ? "انتقل إلى التحدي التالي" : undefined,
    };
  }

  if (tier === "building") {
    return {
      title: "قريب من الإتقان",
      description:
        attemptedLessons > 0 && averageBest !== null
          ? `نتائجك الحالية حول ${averageBest}% — دفعة مراجعة واحدة مع إعادة الاختبار قد تنقلك إلى مستوى أعلى.`
          : "لديك أساس جيد، لكن تحتاج إلى توسيع عدد الدروس المختبرة داخل هذه المهارة.",
      lesson: nextLesson ?? weakestLesson,
      actionLabel: nextLesson ? "أكمل الدرس التالي" : weakestLesson ? "أعد هذا الدرس" : undefined,
    };
  }

  return {
    title: "أولوية هذا الأسبوع",
    description:
      attemptedLessons > 0
        ? "هذه المهارة تحتاج جولة مراجعة مركزة: أعد الشرح ثم نفّذ التمرين قبل إعادة الاختبار."
        : "ابدأ بأول درس في هذه المهارة ثم ثبّت الفهم باختبار قصير خلال نفس الجلسة.",
    lesson: weakestLesson ?? nextLesson,
    actionLabel: weakestLesson ? "ابدأ بالمراجعة" : nextLesson ? "ابدأ من هنا" : undefined,
  };
}
