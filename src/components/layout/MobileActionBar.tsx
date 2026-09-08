'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getOfficesByCity, offices } from '@/content/centers';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { useContactModal } from '@/components/contact/ContactModalProvider';
import { useCity } from './CityProvider';

/**
 * Нижняя навигация на мобильных.
 *
 * Четыре постоянных раздела вместо прежних трёх кнопок-действий: раньше
 * панель дублировала «Позвонить» и «Написать», но не давала перемещаться
 * по сайту — навигация жила только в шапке, под большой палец не попадала.
 *
 * «Связаться» — последним и акцентным: это конечное действие, а не раздел.
 * Открывает контактное окно, которое на мобильных ведёт себя как bottom sheet.
 * Прямой `tel:` здесь сознательно не используется: сначала посетитель уточняет город,
 * чтобы позвонить в нужный офис.
 *
 * Высота панели компенсируется отступом в layout, поэтому подвал не
 * перекрывается. Модальные окна лежат выше по z-index.
 */

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** true — совпадение только по точному пути (иначе «Главная» активна везде). */
  exact?: boolean;
};

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const items: Item[] = [
  {
    href: '/',
    label: 'Главная',
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="size-[22px]">
        <path
          d="M3.5 10.5 12 4l8.5 6.5V19a1 1 0 0 1-1 1h-4v-5.5h-7V20h-4a1 1 0 0 1-1-1z"
          {...stroke}
        />
      </svg>
    ),
  },
  {
    href: '/languages',
    label: 'Языки',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="size-[22px]">
        <circle cx="12" cy="12" r="8.5" {...stroke} />
        <path
          d="M3.5 12h17M12 3.5c2.2 2.3 3.3 5.2 3.3 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.3-5.2-3.3-8.5S9.8 5.8 12 3.5z"
          {...stroke}
        />
      </svg>
    ),
  },
  {
    href: '/centers',
    label: 'Центры',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="size-[22px]">
        <path d="M12 21s6.5-5.4 6.5-10a6.5 6.5 0 1 0-13 0c0 4.6 6.5 10 6.5 10z" {...stroke} />
        <circle cx="12" cy="10.8" r="2.4" {...stroke} />
      </svg>
    ),
  },
];

export function MobileActionBar() {
  const pathname = usePathname();
  const { citySlug } = useCity();
  const { open } = useContactModal();

  const cityOffices = citySlug ? getOfficesByCity(citySlug) : [];
  const office = cityOffices[0] ?? offices[0]!;

  return (
    <nav aria-label="Основные разделы" className="fixed inset-x-0 bottom-0 z-80 lg:hidden">
      <div className="border-border bg-background/92 grid grid-cols-4 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-lg">
        {items.map((item) => {
          const isActive = item.exact
            ? pathname === item.href || pathname === `${item.href}`
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-[3.75rem] flex-col items-center justify-center gap-1 px-1 pt-2 pb-1.5 transition-colors duration-300',
                isActive ? 'text-accent' : 'text-muted',
              )}
            >
              <span aria-hidden className="relative flex items-center justify-center">
                {item.icon}
                {/* Точка активного раздела — тише, чем заливка, и не ломает ритм */}
                <span
                  className={cn(
                    'bg-accent absolute -top-1.5 size-1 rounded-full transition-opacity duration-300',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </span>
              <span className="text-xs leading-none font-medium">{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => {
            track('contact_modal_open', { place: 'mobile-bar', office: office.id });
            open();
          }}
          className="text-accent flex min-h-[3.75rem] flex-col items-center justify-center gap-1 px-1 pt-2 pb-1.5"
        >
          <span
            aria-hidden
            className="bg-accent flex size-[22px] items-center justify-center rounded-full text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-[14px]">
              <path
                d="M6.5 4.5h3l1.5 3.7-2 1.4a11 11 0 0 0 5.4 5.4l1.4-2 3.7 1.5v3a1.5 1.5 0 0 1-1.6 1.5C11.4 18.6 5.4 12.6 5 6.1A1.5 1.5 0 0 1 6.5 4.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-xs leading-none font-medium">Связаться</span>
        </button>
      </div>
    </nav>
  );
}
