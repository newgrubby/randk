import { branches } from '@/content/branches';
import type { FaqItem } from '@/content/types';
import { site } from '@/content/site';
import { absoluteUrl, siteUrl } from './seo';

/**
 * Микроразметка.
 *
 * Жёсткое правило: в JSON-LD не попадает ничего неподтверждённого.
 * Адрес, телефон, рейтинг и отзывы добавляются только при isConfirmed.
 * Ложные данные в разметке — прямой риск санкций поисковых систем.
 */

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${siteUrl}/#organization`,
    name: site.name,
    description: site.description,
    url: siteUrl,
    areaServed: branches.map((branch) => ({ '@type': 'City', name: branch.city })),
  };

  const sameAs = [site.social.vkPrimary, site.social.max].filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );
  if (sameAs.length > 0) data.sameAs = sameAs;

  if (site.contacts.isConfirmed && site.contacts.phone) {
    data.telephone = site.contacts.phone;
  }
  if (site.contacts.isConfirmed && site.contacts.email) {
    data.email = site.contacts.email;
  }

  return data;
}

/** LocalBusiness — только для филиалов с подтверждённым адресом. */
export function branchJsonLd(slug: string): JsonLd | null {
  const branch = branches.find((item) => item.slug === slug);
  if (!branch || !branch.isConfirmed || !branch.address) return null;

  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absoluteUrl(`/branches/${branch.slug}#localbusiness`),
    name: branch.displayName,
    url: absoluteUrl(`/branches/${branch.slug}`),
    parentOrganization: { '@id': `${siteUrl}/#organization` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: branch.city,
      addressCountry: 'RU',
      streetAddress: branch.address,
    },
  };

  if (branch.phone) data.telephone = branch.phone;
  if (branch.coordinates) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: branch.coordinates[0],
      longitude: branch.coordinates[1],
    };
  }
  if (branch.schedule.length > 0) data.openingHours = branch.schedule;

  return data;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(items: FaqItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function courseJsonLd(input: { name: string; description: string; path: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { '@id': `${siteUrl}/#organization` },
  };
}
