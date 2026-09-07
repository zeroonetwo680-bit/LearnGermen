import Link from "next/link";
import type { HomeContentDto } from "@/lib/api/contracts/home";

export function HeroSection({ content }: { content: HomeContentDto }) {
  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-sky-700 via-sky-800 to-cyan-800 px-6 py-10 text-white shadow-2xl sm:px-10 sm:py-14">
      <div className="max-w-3xl">
        <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-sky-100">تعلم الألمانية من الكتاب إلى التفاعل</span>
        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{content.heroTitle}</h1>
        <p className="mt-5 text-lg leading-9 text-sky-50/95">{content.heroSubtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/lessons" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-sky-800 hover:bg-sky-50">
            {content.primaryCta}
          </Link>
          <Link href="/units" className="rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
            {content.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
