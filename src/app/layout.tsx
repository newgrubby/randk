import type { Metadata, Viewport } from 'next';
import { YandexMetrika } from '@/components/analytics/YandexMetrika';
import { ContactModalProvider } from '@/components/contact/ContactModalProvider';
import { CityProvider } from '@/components/layout/CityProvider';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MobileActionBar } from '@/components/layout/MobileActionBar';
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
  manifest: '/manifest.webmanifest',
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
      <head>
        {/*
          Без JavaScript анимации появления никогда не запустятся, а их
          начальное состояние (opacity: 0) уже отрендерено в HTML. Этот стиль
          парсится только при отключённом скриптинге и возвращает контент
          в видимое состояние.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <CityProvider>
          <ContactModalProvider>
            <Header />
            <main id="main" className="pt-[4.75rem] lg:pt-[5.5rem]">
              {children}
            </main>
            {/* Отступ, чтобы подвал не уходил под закреплённую панель на мобильных */}
            <div className="pb-[4.75rem] lg:pb-0">
              <Footer />
            </div>
            <BackToTop />
            <MobileActionBar />
          </ContactModalProvider>
        </CityProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}
