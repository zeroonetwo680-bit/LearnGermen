import { LessonGrid } from "@/components/lessons/lesson-grid";
import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";

export function FeaturedLessonsSection({ lessons }: { lessons: LessonSummaryDto[] }) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">ابدأ بهذه الدروس</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">اختر درساً تمهيدياً أو درساً عملياً للمراجعة السريعة.</p>
      </div>
      <LessonGrid lessons={lessons} />
    </section>
  );
}
