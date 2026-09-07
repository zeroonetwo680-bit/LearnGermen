import { notFound } from "next/navigation";
import { QuizContainer } from "@/components/quiz/quiz-container";
import { SiteBreadcrumbs } from "@/components/layout/site-breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { getLessonForServer, getLessonQuizForServer } from "@/lib/api/modules/lessons/server";

export default async function LessonQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await getLessonForServer(slug).catch(() => null);
  if (!lesson) notFound();
  const questions = await getLessonQuizForServer(slug);

  return (
    <PageContainer className="space-y-6 py-8 sm:py-10">
      <SiteBreadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الدروس", href: "/lessons" }, { label: lesson.title, href: `/lessons/${lesson.slug}` }, { label: "الاختبار" }]} />
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">اختبار: {lesson.title}</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">أجب عن الأسئلة التالية دون إظهار الحلول قبل الإرسال.</p>
      </div>
      <QuizContainer lessonId={lesson.id} lessonSlug={lesson.slug} questions={questions} />
    </PageContainer>
  );
}
