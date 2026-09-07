export type ExerciseType = "fill-blank" | "matching" | "ordering" | "translation";

export interface ExerciseItemDto {
  id: string;
  prompt?: string;
  left?: string;
  right?: string;
  text?: string;
  options?: string[];
  answer?: string | string[];
}

export interface ExerciseDto {
  id: string;
  lessonId: string;
  order: number;
  type: ExerciseType;
  title: string;
  instructions: string;
  prompt: string;
  items: ExerciseItemDto[];
  explanation?: string;
}
