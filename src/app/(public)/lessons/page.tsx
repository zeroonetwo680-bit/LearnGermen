import { PageContainer } from "@/components/shared/page-container";
import { LessonsBrowser } from "@/components/lessons/lessons-browser";

export const metadata = {
  title: "الدروس",
};

export default function LessonsPage() {
  return (
    <PageContainer>
      <LessonsBrowser />
    </PageContainer>
  );
}
