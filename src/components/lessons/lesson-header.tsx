import type { LessonDto } from "@/lib/api/contracts/lesson";

export function LessonHeader({ lesson }: { lesson: LessonDto }) {
  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-sky-600 via-sky-700 to-cyan-700 p-8 text-white shadow-xl">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-sky-100">
        <span className="rounded-full bg-white/10 px-3 py-1">{lesson.level}</span>
        <span className="rounded-full bg-white/10 px-3 py-1">الدرس {lesson.number}</span>
        <span className="rounded-full bg-white/10 px-3 py-1">{lesson.unitTitle}</span>
      </div>
      <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">{lesson.title}</h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-sky-50/95">{lesson.description}</p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm text-sky-100">
        <span>{lesson.duration} دقيقة</span>
        <span>{lesson.vocabularyCount} مفردة</span>
        <span>{lesson.exerciseCount} تمارين</span>
        <span>{lesson.questionCount} أسئلة</span>
      </div>
    </div>
  );
}
