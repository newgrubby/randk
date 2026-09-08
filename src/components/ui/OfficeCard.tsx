'use client';

import Image from 'next/image';
import Link from 'next/link';
import { fullAddress } from '@/content/centers';
import type { Office } from '@/content/types';
import { track } from '@/lib/analytics';
import { cn, displayPhone } from '@/lib/utils';
import { useContactModal } from '@/components/contact/ContactModalProvider';
import { ArrowRight } from './Button';
import { YandexRouteLink } from './YandexRouteLink';

const officeCardImages: Record<string, { src: string; alt: string; position?: string }> = {
  'pavlovsky-posad-kirova': {
    src: '/images/generated/ages/age-4-6.webp',
    alt: 'Занятие педагога с детьми в светлом учебном классе',
  },
  'orekhovo-zuevo-parkovskaya': {
    src: '/images/generated/ages/age-7-12.webp',
    alt: 'Индивидуальное занятие школьника с преподавателем',
    position: 'center 42%',
  },
  'elektrostal-nikolaeva': {
    src: '/images/generated/ages/age-13-17.webp',
    alt: 'Подростки вместе работают над учебным заданием',
  },
};

/**
 * Карточка физического офиса.
 *
 * Один офис = одна карточка. Под городом выводится короткое уточнение расположения.
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
  const cardImage = officeCardImages[office.id] ?? office.photos[0];

  return (
    <article
      className={cn(
        'bg-surface border-border flex h-full flex-col overflow-hidden rounded-[1.25rem] border',
        className,
      )}
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <Image
          src={cardImage?.src ?? '/images/offices/placeholder.svg'}
          alt={cardImage?.alt ?? `Центр RandK — ${office.city}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          style={{ objectPosition: officeCardImages[office.id]?.position }}
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
              className="bg-accent hover:bg-accent-dark rounded-pill inline-flex min-h-11 items-center justify-center px-5 text-sm font-medium text-white transition-colors duration-300"
            >
              Связаться
            </button>

            <YandexRouteLink office={office} />
          </div>

          {showCityLink ? (
            <Link
              href={`/centers/${office.citySlug}`}
              className="group text-accent inline-flex min-h-11 items-center gap-2 text-sm font-medium"
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
