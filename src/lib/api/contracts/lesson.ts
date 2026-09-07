import type { ListFilter } from "@/lib/api/contracts/common";

export type LessonLevel = "A1" | "A2" | "B1";
export type LessonStatus = "published" | "draft";
export type LessonSort = "default" | "newest" | "duration" | "level";
export type LessonSkill =
  | "alphabet"
  | "pronunciation"
  | "grammar"
  | "vocabulary"
  | "numbers"
  | "conversation";
export type ResourceType = "pdf" | "worksheet" | "image" | "reference" | "audio";

export interface LessonSummaryDto {
  id: string;
  slug: string;
  number: number;
  title: string;
  description: string;
  unitId: string;
  unitTitle: string;
  level: LessonLevel;
  duration: number;
  status: LessonStatus;
  tags: string[];
  skillFocus: LessonSkill[];
  questionCount: number;
  exerciseCount: number;
  vocabularyCount: number;
  updatedAt: string;
}

export interface PronunciationExampleDto {
  german: string;
  transliterationAr: string;
  meaningAr?: string;
}

export interface PronunciationRuleDto {
  id: string;
  pattern: string;
  soundAr: string;
  explanation: string;
  examples: PronunciationExampleDto[];
}

export interface LanguageExampleDto {
  id: string;
  german: string;
  transliterationAr?: string;
  meaningAr: string;
  notes?: string;
}

export interface LessonContentSectionDto {
  title: string;
  body: string;
  kind: "overview" | "grammar" | "pronunciation" | "usage";
}

export interface LessonContentDto {
  introduction: string;
  objectives: string[];
  sections: LessonContentSectionDto[];
  pronunciationRules: PronunciationRuleDto[];
  examples: LanguageExampleDto[];
  summary?: string;
  sourcePages: number[];
}

export interface LessonDto extends LessonSummaryDto {
  unitSlug: string;
  content: LessonContentDto;
}

export interface LessonFilter extends ListFilter {
  unitId?: string;
  level?: LessonLevel;
  skill?: LessonSkill;
  status?: LessonStatus;
  sort?: LessonSort;
}

export interface ResourceDto {
  id: string;
  lessonId: string;
  title: string;
  type: ResourceType;
  fileName: string;
  filePath: string;
  size: string;
  description: string;
  downloadable: boolean;
  viewable: boolean;
}
