'use client';

import { useCity } from './CityProvider';
import { useLeadModal } from '@/components/forms/LeadModalProvider';
import { site } from '@/content/site';
import { track } from '@/lib/analytics';
import { displayPhone } from '@/lib/utils';

/**
 * Закреплённая панель действий на мобильных.
 *
 * Два ключевых действия всегда под большим пальцем, без прокрутки вверх.
 * Когда клиент подтвердит телефон, вторая кнопка автоматически становится
 * «Позвонить» — звонок для родителей короче пути через форму.
 */
export function MobileActionBar() {
  const { open } = useLeadModal();
  const { branch } = useCity();

  const phone = site.contacts.isConfirmed ? site.contacts.phone : null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-80 lg:hidden">
      {/* Отступ под системную панель жестов iOS */}
      <div className="border-border bg-background/92 flex gap-2.5 border-t px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-lg">
        <a
          href="#quiz"
          onClick={() => track('quiz_start', { place: 'mobile-bar' })}
          className="rounded-pill border-border-strong text-text flex min-h-12 flex-1 items-center justify-center border px-4 text-sm font-medium"
        >
          Подобрать программу
        </a>

        {phone ? (
          <a
            href={`tel:${phone}`}
            onClick={() => track('phone_click', { place: 'mobile-bar' })}
            className="bg-accent rounded-pill flex min-h-12 flex-1 items-center justify-center px-4 text-sm font-medium text-white"
            aria-label={`Позвонить ${displayPhone(phone)}`}
          >
            Позвонить
          </a>
        ) : (
          <button
            type="button"
            onClick={() => {
              track('trial_lesson_click', { place: 'mobile-bar' });
              open({
                source: 'trial',
                defaults: branch ? { city: branch.city } : undefined,
              });
            }}
            className="bg-accent rounded-pill flex min-h-12 flex-1 items-center justify-center px-4 text-sm font-medium text-white"
          >
            Записаться
          </button>
        )}
      </div>
    </div>
  );
}
