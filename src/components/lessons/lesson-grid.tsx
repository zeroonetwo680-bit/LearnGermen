import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";
import { LessonCard } from "@/components/lessons/lesson-card";

export function LessonGrid({ lessons }: { lessons: LessonSummaryDto[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
