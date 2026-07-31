'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

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

export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </Component>
  );
}
