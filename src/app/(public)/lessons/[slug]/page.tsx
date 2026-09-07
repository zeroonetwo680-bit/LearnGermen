import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { LessonDetail } from "@/components/lessons/lesson-detail";
import { LessonHeader } from "@/components/lessons/lesson-header";
import { LessonNavigation } from "@/components/lessons/lesson-navigation";
import { SiteBreadcrumbs } from "@/components/layout/site-breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import {
  getLessonExercisesForServer,
  getLessonForServer,
  getLessonNavigationForServer,
  getLessonResourcesForServer,
  getLessonVocabularyForServer,
  listLessonsForServer,
} from "@/lib/api/modules/lessons/server";

export async function generateStaticParams() {
  const lessons = await listLessonsForServer({ pageSize: 100 });
  return lessons.items.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLessonForServer(slug).catch(() => null);
  if (!lesson) return { title: "الدرس غير موجود" };
  return { title: lesson.title, description: lesson.description };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await getLessonForServer(slug).catch(() => null);
  if (!lesson) notFound();

  const [resources, vocabulary, exercises, navigation] = await Promise.all([
    getLessonResourcesForServer(slug),
    getLessonVocabularyForServer(slug),
    getLessonExercisesForServer(slug),
    getLessonNavigationForServer(slug),
  ]);

  return (
    <PageContainer className="space-y-8 py-8 sm:py-10">
      <SiteBreadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "الدروس", href: "/lessons" },
          { label: lesson.unitTitle, href: `/units/${lesson.unitSlug}` },
          { label: lesson.title },
        ]}
      />
      <LessonHeader lesson={lesson} />
      <p className="premium-card inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
        <Sparkles className="size-4 text-amber-500" />
        المصدر: الصفحات {lesson.content.sourcePages.join("، ")} من الكتاب.
      </p>
      <LessonDetail lesson={lesson} vocabulary={vocabulary} exercises={exercises} resources={resources} />
      <LessonNavigation previous={navigation.previous} next={navigation.next} />
    </PageContainer>
  );
}
