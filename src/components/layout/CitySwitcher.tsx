'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { branches } from '@/content/branches';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'randk:city';

/**
 * Выбор города.
 *
 * Выбор запоминается в localStorage и подсвечивается при следующих визитах,
 * но не подменяет контент страницы — это осознанное решение ради
 * предсказуемых URL и корректного локального SEO (см. DECISIONS.md).
 */
export function CitySwitcher({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setCurrent(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      // localStorage недоступен — просто не запоминаем выбор.
    }
  }, []);

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

  function select(city: string, slug: string) {
    try {
      window.localStorage.setItem(STORAGE_KEY, city);
    } catch {
      // игнорируем
    }
    setCurrent(city);
    setIsOpen(false);
    track('branch_select', { branch: slug });
  }

  const label = current ?? 'Выбрать город';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-1.5 text-sm transition-colors duration-300',
          tone === 'dark' ? 'text-white/70 hover:text-white' : 'text-muted hover:text-accent',
        )}
      >
        <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-3.5">
          <path
            d="M8 14s5-4.2 5-7.6A5 5 0 0 0 3 6.4C3 9.8 8 14 8 14Z"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle cx="8" cy="6.4" r="1.7" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        {label}
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          fill="none"
          className={cn('size-3 transition-transform duration-300', isOpen && 'rotate-180')}
        >
          <path d="m3 6 5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen ? (
        <div className="bg-surface border-border shadow-lift absolute top-full left-0 z-50 mt-3 w-56 rounded-2xl border p-2">
          {branches.map((branch) => (
            <Link
              key={branch.slug}
              href={`/branches/${branch.slug}`}
              onClick={() => select(branch.city, branch.slug)}
              className={cn(
                'hover:bg-surface-muted flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-200',
                current === branch.city ? 'text-accent' : 'text-text',
              )}
            >
              {branch.city}
              {current === branch.city ? (
                <span aria-hidden className="bg-accent size-1.5 rounded-full" />
              ) : null}
            </Link>
          ))}
          <Link
            href="/branches"
            onClick={() => setIsOpen(false)}
            className="text-muted hover:text-accent border-border mt-1 block border-t px-3.5 pt-3 pb-1.5 text-xs"
          >
            Все центры сети
          </Link>
        </div>
      ) : null}
    </div>
  );
}
