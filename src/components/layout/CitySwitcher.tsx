'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cities, countOffices } from '@/content/centers';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { useCity } from './CityProvider';

/**
 * Переключатель города.
 *
 * Показывает выбранный город прямо в шапке и подсказывает, где офисов
 * больше одного — иначе посетитель из Павловского Посада не узнает
 * о втором офисе, пока не дойдёт до страницы города.
 */
export function CitySwitcher({
  tone = 'light',
  className,
}: {
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { city, setCitySlug } = useCity();

  useEffect(() => {
    if (!isOpen) return;

    function handlePointer(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'flex min-h-11 items-center gap-1.5 text-sm whitespace-nowrap transition-colors duration-300',
          tone === 'dark' ? 'text-white/70 hover:text-white' : 'text-muted hover:text-accent',
        )}
      >
        <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-3.5 shrink-0">
          <path
            d="M8 14s5-4.2 5-7.6A5 5 0 0 0 3 6.4C3 9.8 8 14 8 14Z"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle cx="8" cy="6.4" r="1.7" stroke="currentColor" strokeWidth="1.3" />
        </svg>

        {city ? (
          <>
            <span className="hidden xl:inline">Ваш город:</span>
            <span className={tone === 'dark' ? 'text-white' : 'text-text'}>{city.name}</span>
          </>
        ) : (
          'Выбрать город'
        )}

        <svg
          aria-hidden
          viewBox="0 0 16 16"
          fill="none"
          className={cn(
            'size-3 shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        >
          <path d="m3 6 5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen ? (
        <div className="bg-surface border-border shadow-lift absolute top-full left-0 z-50 mt-3 w-64 rounded-2xl border p-2">
          <p className="text-eyebrow text-muted px-3.5 py-2 font-medium uppercase">
            Выберите город
          </p>
          {cities.map((item) => {
            const officeCount = countOffices(item.slug);
            return (
              <Link
                key={item.slug}
                href={`/centers/${item.slug}`}
                onClick={() => {
                  setCitySlug(item.slug);
                  setIsOpen(false);
                  track('city_select', { city: item.slug });
                }}
                className={cn(
                  'hover:bg-surface-muted flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-200',
                  city?.slug === item.slug ? 'text-accent' : 'text-text',
                )}
              >
                <span>
                  {item.name}
                  {officeCount > 1 ? (
                    <span className="text-muted mt-0.5 block text-xs">{officeCount} офиса</span>
                  ) : null}
                </span>
                {city?.slug === item.slug ? (
                  <span aria-hidden className="bg-accent size-1.5 shrink-0 rounded-full" />
                ) : null}
              </Link>
            );
          })}
          <Link
            href="/centers"
            onClick={() => setIsOpen(false)}
            className="text-muted hover:text-accent border-border mt-1 block border-t px-3.5 pt-3 pb-1.5 text-xs"
          >
            Все офисы сети
          </Link>
        </div>
      ) : null}
    </div>
  );
}
