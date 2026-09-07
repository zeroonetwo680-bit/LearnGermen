import { PageContainer } from "@/components/shared/page-container";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata = {
  title: "لوحة التقدم",
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <DashboardShell />
    </PageContainer>
  );
}
