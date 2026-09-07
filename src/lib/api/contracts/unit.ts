import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";

export interface UnitDto {
  id: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  icon: string;
  color: "blue" | "green" | "violet" | "amber" | "rose";
  lessonCount: number;
  questionCount: number;
  vocabularyCount: number;
  exerciseCount: number;
}

export interface UnitDetailDto extends UnitDto {
  lessons: LessonSummaryDto[];
}
