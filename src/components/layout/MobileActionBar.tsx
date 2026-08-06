'use client';

import Link from 'next/link';
import { getOfficesByCity, offices } from '@/content/centers';
import { site } from '@/content/site';
import { track } from '@/lib/analytics';
import { useContactModal } from '@/components/contact/ContactModalProvider';
import { useCity } from './CityProvider';

/**
 * Закреплённая панель действий на мобильных: «Позвонить», «Центры», «Написать».
 *
 * Все три действия — обычные ссылки там, где это возможно: `tel:` и переход
 * в раздел центров работают без JavaScript. Телефон подставляется из
 * выбранного города; если город не выбран, берётся первый офис сети.
 *
 * Высота панели учтена отступом в layout, поэтому подвал ею не перекрывается.
 */
export function MobileActionBar() {
  const { citySlug } = useCity();
  const { open } = useContactModal();

  const cityOffices = citySlug ? getOfficesByCity(citySlug) : [];
  const office = cityOffices[0] ?? offices[0]!;

  return (
    <div className="fixed inset-x-0 bottom-0 z-80 lg:hidden">
      {/* Нижний отступ учитывает системную панель жестов iOS */}
      <div className="border-border bg-background/92 grid grid-cols-3 gap-2 border-t px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-lg">
        {office.phone ? (
          <a
            href={`tel:${office.phone}`}
            onClick={() => track('phone_click', { office: office.id, place: 'mobile-bar' })}
            className="bg-accent rounded-pill flex min-h-12 items-center justify-center px-3 text-sm font-medium text-white"
          >
            Позвонить
          </a>
        ) : (
          <button
            type="button"
            onClick={() => {
              track('contact_modal_open', { place: 'mobile-bar' });
              open();
            }}
            className="bg-accent rounded-pill flex min-h-12 items-center justify-center px-3 text-sm font-medium text-white"
          >
            Позвонить
          </button>
        )}

        <Link
          href="/centers"
          className="rounded-pill border-border-strong text-text flex min-h-12 items-center justify-center border px-3 text-sm font-medium"
        >
          Центры
        </Link>

        <a
          href={site.social.vkPrimary}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('vk_click', { place: 'mobile-bar' })}
          className="rounded-pill border-border-strong text-text flex min-h-12 items-center justify-center border px-3 text-sm font-medium"
        >
          Написать
        </a>
      </div>
    </div>
  );
}
