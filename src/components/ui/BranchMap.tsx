'use client';

import { useEffect, useRef, useState } from 'react';
import type { Branch } from '@/content/types';
import { track } from '@/lib/analytics';
import { buildYandexEmbedUrl, buildYandexRouteUrl } from '@/lib/utils';
import { ArrowRight, ButtonLink } from './Button';

/**
 * Карта филиала с ленивой загрузкой.
 *
 * Порядок: блок появился в вьюпорте → показываем превью с кнопкой →
 * пользователь нажимает → грузится iframe Яндекс Карт.
 * Так тяжёлый сторонний скрипт не влияет на LCP и не тянет
 * cookie третьих сторон без действия пользователя.
 *
 * Если координат нет, карта не подставляется вовсе — вместо неё
 * аккуратный блок с приглашением уточнить адрес.
 */
export function BranchMap({ branch }: { branch: Branch }) {
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

  const hasCoordinates = branch.coordinates !== null;

  return (
    <div
      ref={containerRef}
      className="bg-surface-muted border-border relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border md:aspect-[16/10]"
    >
      {hasCoordinates && isLoaded && branch.coordinates ? (
        <iframe
          src={buildYandexEmbedUrl(branch.coordinates)}
          title={`Карта: ${branch.displayName}`}
          loading="lazy"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <MapDecor />

          {hasCoordinates ? (
            <>
              <p className="text-muted relative max-w-xs text-sm leading-relaxed">
                Карта загрузится по нажатию — так страница открывается быстрее.
              </p>
              <button
                type="button"
                disabled={!isNearViewport}
                onClick={() => {
                  setIsLoaded(true);
                  track('map_click', { branch: branch.slug });
                }}
                className="bg-accent hover:bg-accent-dark relative rounded-full px-6 py-3 text-sm font-medium text-white transition-colors duration-300 disabled:opacity-50"
              >
                Показать карту
              </button>
            </>
          ) : (
            <>
              <p className="text-h3 relative font-serif">{branch.city}</p>
              <p className="text-muted relative max-w-xs text-sm leading-relaxed">
                Точный адрес центра уточняется. Оставьте заявку — администратор подскажет, как
                добраться, и подберёт удобное время.
              </p>
            </>
          )}
        </div>
      )}

      {hasCoordinates && branch.coordinates && !isLoaded ? (
        <div className="absolute right-4 bottom-4">
          <ButtonLink
            href={buildYandexRouteUrl(branch.coordinates)}
            external
            variant="secondary"
            size="md"
            onClick={() => track('map_click', { branch: branch.slug, kind: 'route' })}
          >
            Построить маршрут
            <ArrowRight />
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}

/** Декоративная «сетка кварталов» — заменяет скриншот карты, не имитируя его. */
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
