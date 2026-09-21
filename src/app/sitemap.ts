import type { MetadataRoute } from 'next';
import { cities } from '@/content/centers';
import { languages } from '@/content/languages';
import { programs } from '@/content/programs';
import { canonicalUrl } from '@/lib/seo';

/** Обязательно для статического экспорта: файл собирается один раз при сборке. */
export const dynamic = 'force-static';

/**
 * Карта сайта строится из контента и уважает флаги `showInSitemap`,
 * поэтому скрытые языки и направления в неё не попадают автоматически.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/languages', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/programs', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/centers', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/reviews', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contacts', priority: 0.8, changeFrequency: 'monthly' },
  ];

  return [
    ...staticPages.map((page) => ({
      url: canonicalUrl(page.path),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...languages
      .filter((language) => language.active && language.showInSitemap)
      .map((language) => ({
        url: canonicalUrl(`/languages/${language.slug}`),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ...programs
      .filter((program) => program.active && program.showInSitemap)
      .map((program) => ({
        url: canonicalUrl(program.href),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ...cities.map((city) => ({
      url: canonicalUrl(`/centers/${city.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ];
}
