import type { Metadata } from 'next';
import { site } from '@/content/site';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? site.url;

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
