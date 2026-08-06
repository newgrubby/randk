'use client';

import Image from 'next/image';
import Link from 'next/link';
import { fullAddress } from '@/content/centers';
import type { Office } from '@/content/types';
import { track } from '@/lib/analytics';
import { buildYandexRouteUrl, cn, displayPhone } from '@/lib/utils';
import { useContactModal } from '@/components/contact/ContactModalProvider';
import { ArrowRight } from './Button';

/**
 * Карточка физического офиса.
 *
 * Один офис = одна карточка. В Павловском Посаде их две, поэтому под
 * заголовком выводится уточнение расположения («на улице Кирова»), иначе
 * два адреса одного города визуально сливаются.
 *
 * Телефон и маршрут — обычные ссылки: работают без JavaScript.
 */
export function OfficeCard({
  office,
  showCityLink = true,
  className,
}: {
  office: Office;
  showCityLink?: boolean;
  className?: string;
}) {
  const { open } = useContactModal();

  const routeUrl =
    office.yandexMapUrl ?? (office.coordinates ? buildYandexRouteUrl(office.coordinates) : null);

  return (
    <article
      className={cn(
        'bg-surface border-border flex h-full flex-col overflow-hidden rounded-[1.25rem] border',
        className,
      )}
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <Image
          src={office.photos[0]?.src ?? '/images/offices/placeholder.svg'}
          alt={office.photos[0]?.alt ?? `Центр RandK — ${office.city}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl">{office.city}</h3>
        <p className="text-accent mt-1 text-sm">{office.officeName}</p>

        <p className="text-muted mt-4 text-sm leading-relaxed">{fullAddress(office)}</p>

        {office.phone ? (
          <a
            href={`tel:${office.phone}`}
            onClick={() => track('phone_click', { office: office.id, place: 'office-card' })}
            className="text-text hover:text-accent mt-3 inline-block text-[0.9375rem] font-medium transition-colors duration-300"
          >
            {displayPhone(office.phone)}
          </a>
        ) : null}

        <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                track('contact_modal_open', { place: 'office-card', office: office.id });
                open({
                  officeId: office.id,
                  title: `${office.city} — ${office.officeName}`,
                });
              }}
              className="bg-accent hover:bg-accent-dark rounded-pill inline-flex min-h-10 items-center justify-center px-5 text-sm font-medium text-white transition-colors duration-300"
            >
              Связаться
            </button>

            {routeUrl ? (
              <a
                href={routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('map_click', { office: office.id, kind: 'route' })}
                className="rounded-pill border-border-strong text-text hover:border-accent hover:text-accent inline-flex min-h-10 items-center justify-center border px-5 text-sm transition-colors duration-300"
              >
                Маршрут
              </a>
            ) : null}
          </div>

          {showCityLink ? (
            <Link
              href={`/centers/${office.citySlug}`}
              className="group text-accent inline-flex items-center gap-2 text-sm font-medium"
            >
              Об этом центре
              <ArrowRight />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
