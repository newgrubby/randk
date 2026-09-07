import { cities } from './centers';
import { navigationLanguages } from './languages';
import { navigationPrograms } from './programs';

export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

/**
 * Навигация собирается из контента и уважает флаги видимости.
 *
 * Направления с `showInNavigation: false` (логопед, психолог) в меню
 * не попадают, но их страницы существуют и индексируются.
 */
export const mainNavigation: NavLink[] = [
  {
    label: 'Языки',
    href: '/languages',
    children: navigationLanguages.map((language) => ({
      label: language.shortTitle,
      href: `/languages/${language.slug}`,
    })),
  },
  {
    label: 'Направления',
    href: '/programs',
    children: navigationPrograms.map((program) => ({
      label: program.shortTitle,
      href: program.href,
    })),
  },
  {
    label: 'Центры',
    href: '/centers',
    children: cities.map((city) => ({
      label: city.name,
      href: `/centers/${city.slug}`,
    })),
  },
  { label: 'О центре', href: '/about' },
  { label: 'Контакты', href: '/contacts' },
];

export const footerNavigation: { title: string; links: NavLink[] }[] = [
  {
    title: 'Языки',
    links: navigationLanguages.map((language) => ({
      label: language.shortTitle,
      href: `/languages/${language.slug}`,
    })),
  },
  {
    title: 'Направления',
    links: navigationPrograms.map((program) => ({
      label: program.shortTitle,
      href: program.href,
    })),
  },
  {
    title: 'Центры',
    links: [
      ...cities.map((city) => ({ label: city.name, href: `/centers/${city.slug}` })),
      { label: 'Все офисы', href: '/centers' },
    ],
  },
  {
    title: 'О нас',
    links: [
      { label: 'О центре', href: '/about' },
      { label: 'Отзывы', href: '/reviews' },
      { label: 'Контакты', href: '/contacts' },
    ],
  },
];

export const legalNavigation: NavLink[] = [
  { label: 'Политика конфиденциальности', href: '/privacy' },
  { label: 'Политика cookie', href: '/cookies' },
];
