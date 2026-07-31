import type { Metadata, Viewport } from 'next';
import { YandexMetrika } from '@/components/analytics/YandexMetrika';
import { LeadModalProvider } from '@/components/forms/LeadModalProvider';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { BackToTop } from '@/components/ui/BackToTop';
import { JsonLd } from '@/components/ui/JsonLd';
import { site } from '@/content/site';
import { fontBody, fontDisplay } from '@/lib/fonts';
import { organizationJsonLd } from '@/lib/jsonld';
import { siteUrl } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RandK Center — языковые и образовательные центры в Подмосковье',
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: siteUrl,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#f7f4ef',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <LeadModalProvider>
          <Header />
          <main id="main" className="pt-[4.75rem] lg:pt-[5.5rem]">
            {children}
          </main>
          <Footer />
          <BackToTop />
        </LeadModalProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}
