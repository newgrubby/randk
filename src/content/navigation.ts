import { branches } from './branches';
import { programs } from './programs';

export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

/** Основная навигация в шапке. */
export const mainNavigation: NavLink[] = [
  {
    label: 'Программы',
    href: '/programs',
    children: programs.map((program) => ({
      label: program.shortTitle,
      href: `/programs/${program.slug}`,
    })),
  },
  {
    label: 'Центры',
    href: '/branches',
    children: branches.map((branch) => ({
      label: branch.city,
      href: `/branches/${branch.slug}`,
    })),
  },
  { label: 'О центре', href: '/about' },
  { label: 'Преподаватели', href: '/teachers' },
  { label: 'Контакты', href: '/contacts' },
];

/** Колонки подвала. */
export const footerNavigation: { title: string; links: NavLink[] }[] = [
  {
    title: 'Направления',
    links: programs.map((program) => ({
      label: program.shortTitle,
      href: `/programs/${program.slug}`,
    })),
  },
  {
    title: 'Центры',
    links: branches.map((branch) => ({
      label: branch.city,
      href: `/branches/${branch.slug}`,
    })),
  },
  {
    title: 'О нас',
    links: [
      { label: 'О центре', href: '/about' },
      { label: 'Преподаватели', href: '/teachers' },
      { label: 'Контакты', href: '/contacts' },
      { label: 'Частые вопросы', href: '/#faq' },
    ],
  },
];

export const legalNavigation: NavLink[] = [
  { label: 'Политика конфиденциальности', href: '/privacy' },
  { label: 'Согласие на обработку персональных данных', href: '/personal-data-consent' },
];
