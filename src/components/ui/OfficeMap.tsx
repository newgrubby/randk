'use client';

import { useEffect, useRef, useState } from 'react';
import type { Office } from '@/content/types';
import { track } from '@/lib/analytics';
import { buildYandexEmbedUrl } from '@/lib/utils';

/**
 * Карта офиса с ленивой загрузкой.
 *
 * Порядок: блок попал в вьюпорт → показываем превью с кнопкой →
 * пользователь нажимает → грузится iframe Яндекс Карт. Тяжёлый сторонний
 * виджет не влияет на скорость открытия страницы и не ставит cookie
 * третьих сторон без действия пользователя.
 *
 * Если координат нет, карта не подставляется вовсе: показать центр города
 * вместо реального адреса — значит дезинформировать. Вместо неё фирменная
 * композиция с названием города и адресом.
 */
export function OfficeMap({ office }: { office: Office }) {
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hasCoordinates = office.coordinates !== null;

  return (
    <div
      ref={containerRef}
      className="bg-surface-muted border-border relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border md:aspect-[16/10]"
    >
      {hasCoordinates && isLoaded && office.coordinates ? (
        <iframe
          src={buildYandexEmbedUrl(office.coordinates)}
          title={`Карта: ${office.city}, ${office.address}`}
          loading="lazy"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <MapDecor />
          <p className="text-h3 relative font-serif">{office.city}</p>
          <p className="text-muted relative text-sm">{office.address}</p>

          {hasCoordinates ? (
            <button
              type="button"
              disabled={!isNearViewport}
              onClick={() => {
                setIsLoaded(true);
                track('map_click', { office: office.id });
              }}
              className="bg-accent hover:bg-accent-dark rounded-pill relative mt-2 px-6 py-3 text-sm font-medium text-white transition-colors duration-300 disabled:opacity-50"
            >
              Показать карту
            </button>
          ) : (
            <p className="text-muted relative max-w-xs text-xs leading-relaxed">
              Интерактивная карта появится после уточнения точки на местности. Позвоните в офис —
              администратор подскажет, как добраться.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** Декоративная «сетка кварталов» — не имитирует скриншот карты. */
function MapDecor() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 300"
      className="text-border-strong absolute inset-0 size-full opacity-45"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M-20 70h440M-20 150h440M-20 230h440" />
        <path d="M70 -20v340M170 -20v340M270 -20v340M350 -20v340" />
        <path d="M-20 20 L200 240 M200 -20 L420 200" strokeWidth="1.5" />
      </g>
      <circle cx="200" cy="150" r="46" fill="none" stroke="currentColor" strokeDasharray="3 6" />
    </svg>
  );
}
