import type { MetadataRoute } from 'next';
import { cities } from '@/content/centers';
import { languages } from '@/content/languages';
import { programs } from '@/content/programs';
import { absoluteUrl } from '@/lib/seo';

/** Обязательно для статического экспорта: файл собирается один раз при сборке. */
export const dynamic = 'force-static';

/**
 * Карта сайта строится из контента и уважает флаги `showInSitemap`,
 * поэтому скрытые языки и направления в неё не попадают автоматически.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/languages', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/programs', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/centers', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/reviews', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contacts', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'monthly' },
    { path: '/cookies', priority: 0.2, changeFrequency: 'monthly' },
  ];

  return [
    ...staticPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...languages
      .filter((language) => language.active && language.showInSitemap)
      .map((language) => ({
        url: absoluteUrl(`/languages/${language.slug}`),
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ...programs
      .filter((program) => program.active && program.showInSitemap)
      .map((program) => ({
        url: absoluteUrl(program.href),
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ...cities.map((city) => ({
      url: absoluteUrl(`/centers/${city.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ];
}
