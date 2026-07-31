import type { MetadataRoute } from 'next';
import { branches } from '@/content/branches';
import { programs } from '@/content/programs';
import { absoluteUrl } from '@/lib/seo';

/** Карта сайта строится из контента — новые программы и центры попадают в неё автоматически. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/programs', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/branches', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/teachers', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contacts', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'monthly' },
    { path: '/personal-data-consent', priority: 0.2, changeFrequency: 'monthly' },
  ];

  return [
    ...staticPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...programs.map((program) => ({
      url: absoluteUrl(`/programs/${program.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...branches.map((branch) => ({
      url: absoluteUrl(`/branches/${branch.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ];
}
