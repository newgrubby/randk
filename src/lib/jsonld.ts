import { cities, offices } from '@/content/centers';
import { site } from '@/content/site';
import type { FaqItem, Office } from '@/content/types';
import { absoluteUrl, siteUrl } from './seo';

/**
 * Микроразметка.
 *
 * Жёсткое правило: в JSON-LD не попадает ничего неподтверждённого.
 * Адрес, телефон, координаты, график, рейтинг и отзывы добавляются только
 * при `confirmed: true`. Ложные данные в разметке — прямой риск санкций
 * поисковых систем, и в отличие от текста на странице их не видно глазами.
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
    areaServed: cities.map((city) => ({ '@type': 'City', name: city.name })),
  };

  data.sameAs = [site.social.vkPrimary];

  return data;
}

/**
 * LocalBusiness для одного физического офиса.
 *
 * Каждый офис — самостоятельная запись и отдельная точка на карте.
 *
 * Возвращает null, пока офис не подтверждён клиентом.
 */
export function officeJsonLd(office: Office): JsonLd | null {
  if (!office.confirmed) return null;

  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absoluteUrl(`/centers/${office.citySlug}#${office.id}`),
    name: `${site.name} — ${office.city}, ${office.address}`,
    url: absoluteUrl(`/centers/${office.citySlug}`),
    parentOrganization: { '@id': `${siteUrl}/#organization` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: office.city,
      addressRegion: 'Московская область',
      addressCountry: 'RU',
      streetAddress: [office.address, office.addressDetails].filter(Boolean).join(', '),
    },
  };

  if (office.phone) data.telephone = office.phone;
  if (office.coordinates) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: office.coordinates.lat,
      longitude: office.coordinates.lon,
    };
  }
  if (office.schedule.length > 0) data.openingHours = office.schedule;

  return data;
}

/** Все подтверждённые офисы — для страницы «Контакты». */
export function allOfficesJsonLd(): JsonLd[] {
  return offices
    .map((office) => officeJsonLd(office))
    .filter((schema): schema is JsonLd => schema !== null);
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
