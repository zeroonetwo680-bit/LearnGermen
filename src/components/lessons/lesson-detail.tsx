"use client";

import { useEffect } from "react";
import type { ExerciseDto } from "@/lib/api/contracts/exercise";
import type { LessonDto, ResourceDto } from "@/lib/api/contracts/lesson";
import type { VocabularyItemDto } from "@/lib/api/contracts/vocabulary";
import { useSetLastVisitedLesson } from "@/lib/api/modules/progress/hooks";
import { LessonTabs } from "@/components/lessons/lesson-tabs";

export function LessonDetail({
  lesson,
  vocabulary,
  exercises,
  resources,
}: {
  lesson: LessonDto;
  vocabulary: VocabularyItemDto[];
  exercises: ExerciseDto[];
  resources: ResourceDto[];
}) {
  const setLastVisitedLesson = useSetLastVisitedLesson();

  useEffect(() => {
    setLastVisitedLesson.mutate(lesson.id);
  }, [lesson.id, setLastVisitedLesson]);

  return <LessonTabs lesson={lesson} vocabulary={vocabulary} exercises={exercises} resources={resources} />;
}
