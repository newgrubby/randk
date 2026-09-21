'use client';

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/**
 * Мягкое появление при попадании в вьюпорт.
 *
 * Единственный анимационный примитив проекта — чтобы движение
 * по всему сайту читалось как одна система, а не как набор эффектов.
 * При prefers-reduced-motion контент показывается сразу, без сдвига.
 */

type RevealProps = {
  children: ReactNode;
  /** Задержка в секундах — для stagger по карточкам. */
  delay?: number;
  /** Смещение по вертикали до появления. */
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'section';
};

let revealObserver: IntersectionObserver | null = null;

function getRevealObserver() {
  revealObserver ??= new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealVisible = '';
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -80px' },
  );
  return revealObserver;
}

export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: RevealProps) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = getRevealObserver();
    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  const style = {
    '--reveal-y': `${y}px`,
    '--reveal-delay': `${delay}s`,
  } as CSSProperties;

  return createElement(as, { ref: elementRef, className, style, 'data-reveal': '' }, children);
}
