import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">
          الانتقال إلى المحتوى
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
