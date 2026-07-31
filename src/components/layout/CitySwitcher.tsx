'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { branches } from '@/content/branches';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { useCity } from './CityProvider';

/**
 * Переключатель города в шапке.
 *
 * Показывает выбранный город прямо в интерфейсе («Ваш город: …»),
 * чтобы выбор не начинался только внутри квиза. Выбранное значение
 * подставляется в формы заявок и в мобильную панель действий.
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
  const { branch, select } = useCity();

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
          'flex items-center gap-1.5 text-sm whitespace-nowrap transition-colors duration-300',
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

        {branch ? (
          <>
            <span className="hidden xl:inline">Ваш город:</span>
            <span className={tone === 'dark' ? 'text-white' : 'text-text'}>{branch.city}</span>
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
        <div className="bg-surface border-border shadow-lift absolute top-full left-0 z-50 mt-3 w-60 rounded-2xl border p-2">
          <p className="text-eyebrow text-muted px-3.5 py-2 font-medium uppercase">
            Выберите центр
          </p>
          {branches.map((item) => (
            <Link
              key={item.slug}
              href={`/branches/${item.slug}`}
              onClick={() => {
                select(item.slug);
                setIsOpen(false);
                track('branch_select', { branch: item.slug });
              }}
              className={cn(
                'hover:bg-surface-muted flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-200',
                branch?.slug === item.slug ? 'text-accent' : 'text-text',
              )}
            >
              {item.city}
              {branch?.slug === item.slug ? (
                <span aria-hidden className="bg-accent size-1.5 rounded-full" />
              ) : null}
            </Link>
          ))}
          <Link
            href="/branches"
            onClick={() => setIsOpen(false)}
            className="text-muted hover:text-accent border-border mt-1 block border-t px-3.5 pt-3 pb-1.5 text-xs"
          >
            Сравнить все центры
          </Link>
        </div>
      ) : null}
    </div>
  );
}
