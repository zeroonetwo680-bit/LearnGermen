import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

export const metadata = {
  title: "عن المنصة",
};

export default function AboutPage() {
  return (
    <PageContainer className="py-8 sm:py-10">
      <PageHeader title="عن المنصة" description="هذا المشروع يحول كتاب تعلم الألمانية بالنطق المكتوب إلى تجربة تعلم تفاعلية داخل Next.js." eyebrow="الفكرة" />
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-8 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <p>المنصة موجهة للمتعلمين العرب الذين يريدون فهماً واضحاً للمفردات والنطق والقواعد الأساسية في الألمانية.</p>
        <p>بدلاً من عرض الكتاب كملف PDF فقط، قمنا بإعادة تنظيم محتواه إلى وحدات ودروس ومفردات وتمارين واختبارات قصيرة.</p>
        <p>كل درس يرتبط بصفحات من المصدر الأصلي، ويُعرض مع مفردات ألمانية بالنطق المكتوب بالعربية، إضافة إلى تمارين مراجعة واختبار تفاعلي.</p>
      </div>
    </PageContainer>
  );
}
