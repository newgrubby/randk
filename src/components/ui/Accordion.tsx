'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/content/types';

/**
 * Аккордеон FAQ.
 * Реализован на кнопках с aria-expanded/aria-controls — доступен с клавиатуры.
 */
export function Accordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();

  return (
    <div className="border-border border-t">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <div key={item.id} className="border-border border-b">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className="text-h3 group-hover:text-accent font-serif transition-colors duration-300">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className="border-border-strong group-hover:border-accent group-hover:text-accent relative mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300"
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span
                    className="absolute h-3.5 w-px bg-current transition-transform duration-400 ease-[var(--ease-out-quart)]"
                    style={{ transform: isOpen ? 'scaleY(0)' : 'scaleY(1)' }}
                  />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-400 ease-[var(--ease-out-quart)] motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="text-muted max-w-3xl pr-10 pb-7 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
