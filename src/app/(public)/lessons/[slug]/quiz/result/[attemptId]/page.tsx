import { QuizResultPage } from "@/components/quiz/quiz-result-page";
import { SiteBreadcrumbs } from "@/components/layout/site-breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";

export default async function QuizResultRoute({ params }: { params: Promise<{ slug: string; attemptId: string }> }) {
  const { slug, attemptId } = await params;

  return (
    <PageContainer className="space-y-6 py-8 sm:py-10">
      <SiteBreadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الدروس", href: "/lessons" }, { label: "نتيجة الاختبار" }]} />
      <QuizResultPage lessonSlug={slug} attemptId={attemptId} />
    </PageContainer>
  );
}
