import homeFixture from "@/lib/api/mock/fixtures/home.json";
import unitsFixture from "@/lib/api/mock/fixtures/units.json";
import lessonsFixture from "@/lib/api/mock/fixtures/lessons.json";
import resourcesFixture from "@/lib/api/mock/fixtures/resources.json";
import vocabularyFixture from "@/lib/api/mock/fixtures/vocabulary.json";
import exercisesFixture from "@/lib/api/mock/fixtures/exercises.json";
import questionsFixture from "@/lib/api/mock/fixtures/questions.json";
import {
  exerciseSchema,
  homeContentSchema,
  lessonSchema,
  questionSchema,
  resourceSchema,
  unitSchema,
  vocabularyItemSchema,
} from "@/lib/api/schemas/course";
import type { ExerciseDto } from "@/lib/api/contracts/exercise";
import type { HomeContentDto } from "@/lib/api/contracts/home";
import type { LessonDto } from "@/lib/api/contracts/lesson";
import type { QuestionDto, QuizResultDto } from "@/lib/api/contracts/question";
import type { ResourceDto } from "@/lib/api/contracts/lesson";
import type { UnitDto } from "@/lib/api/contracts/unit";
import type { VocabularyItemDto } from "@/lib/api/contracts/vocabulary";

export type MockDatabase = {
  home: HomeContentDto;
  units: UnitDto[];
  lessons: LessonDto[];
  resources: ResourceDto[];
  vocabulary: VocabularyItemDto[];
  exercises: ExerciseDto[];
  questions: QuestionDto[];
  attempts: Record<string, QuizResultDto>;
};

declare global {
  var __learnGermanMockDb: MockDatabase | undefined;
}

function buildDatabase(): MockDatabase {
  return {
    home: homeContentSchema.parse(homeFixture),
    units: unitSchema.array().parse(unitsFixture),
    lessons: lessonSchema.array().parse(lessonsFixture),
    resources: resourceSchema.array().parse(resourcesFixture),
    vocabulary: vocabularyItemSchema.array().parse(vocabularyFixture),
    exercises: exerciseSchema.array().parse(exercisesFixture),
    questions: questionSchema.array().parse(questionsFixture),
    attempts: {},
  };
}

export function getMockDatabase() {
  if (!globalThis.__learnGermanMockDb) {
    globalThis.__learnGermanMockDb = buildDatabase();
  }
  return globalThis.__learnGermanMockDb;
}

export function saveAttempt(result: QuizResultDto) {
  const db = getMockDatabase();
  db.attempts[result.attemptId] = result;
  return result;
}

export function getAttempt(attemptId: string) {
  return getMockDatabase().attempts[attemptId];
}

export function resetMockDatabase() {
  globalThis.__learnGermanMockDb = buildDatabase();
}
