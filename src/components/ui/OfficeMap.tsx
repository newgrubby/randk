'use client';

import { useState } from 'react';
import { fullAddress } from '@/content/centers';
import type { Office } from '@/content/types';
import { buildYandexEmbedUrl } from '@/lib/utils';
import { YandexRouteLink } from './YandexRouteLink';

/**
 * Лёгкий iframe Яндекс Карт. Пока карта загружается (или если загрузка
 * не удалась), под ней остаётся доступный fallback с адресом и маршрутом.
 */
export function OfficeMap({ office }: { office: Office }) {
  const [hasLoadError, setHasLoadError] = useState(false);

  return (
    <div className="bg-surface-muted border-border relative h-[340px] w-full min-w-0 overflow-hidden rounded-[1.5rem] border md:h-[460px]">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-h3 font-serif">{office.city}</p>
        <p className="text-muted max-w-sm text-sm leading-relaxed">
          {office.city}, {fullAddress(office)}
        </p>
        <YandexRouteLink office={office} label="Маршрут" />
      </div>

      {office.coordinates ? (
        <iframe
          src={buildYandexEmbedUrl(office.coordinates)}
          title={`Яндекс Карта: RandK Center, ${office.city}, ${fullAddress(office)}`}
          loading="lazy"
          allowFullScreen
          onError={() => setHasLoadError(true)}
          className={`absolute inset-0 size-full border-0 ${hasLoadError ? 'hidden' : 'block'}`}
          style={{ touchAction: 'pan-y' }}
        />
      ) : null}
    </div>
  );
}
