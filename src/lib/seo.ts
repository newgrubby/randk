import type { Metadata } from 'next';
import { site } from '@/content/site';
import { resolveSiteUrl } from './site-url';

/*
 * Адрес сайта.
 *
 * `process.env.NEXT_PUBLIC_SITE_URL` Next подставляет в код на этапе сборки,
 * поэтому обращение к переменной обязано остаться полным литералом —
 * вынести его в helper нельзя, подстановка перестанет работать.
 *
 * Разбор значения — в `./site-url.ts`, там же разобрано, почему прежний
 * вариант с `??` падал на пустой переменной.
 */
const resolution = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, site.url);

/*
 * Непригодное значение переменной не роняет сборку, но и молчать о нём
 * нельзя: без предупреждения canonical, sitemap и Open Graph тихо уедут
 * на запасной домен. Пишем только на сервере — в сборке и dev-режиме;
 * в браузере это лишний шум.
 */
if (resolution.rejected !== undefined && typeof window === 'undefined') {
  console.warn(
    `[seo] NEXT_PUBLIC_SITE_URL проигнорирован: ${resolution.rejected}. ` +
      `Используется адрес по умолчанию ${resolution.url}`,
  );
}

export const siteUrl = resolution.url;

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Отдельный OG-заголовок, если нужен более короткий. */
  ogTitle?: string;
  noIndex?: boolean;
};

/** Единая сборка метаданных: canonical + OG + Twitter в одном месте. */
export function buildMetadata({
  title,
  description,
  path,
  ogTitle,
  noIndex,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: site.locale,
      title: ogTitle ?? title,
      description,
      url,
      images: [{ url: absoluteUrl('/og.png'), width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle ?? title,
      description,
      images: [absoluteUrl('/og.png')],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
