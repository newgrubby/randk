'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Модальное окно записи.
 *
 * Доступность: role="dialog" + aria-modal, закрытие по Escape и по клику
 * на подложку, блокировка скролла, ловушка фокуса и возврат фокуса
 * на элемент, который открыл окно.
 */
export function Modal({ open, onClose, title, description, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    document.addEventListener('keydown', handleKeyDown);

    // Фокус на первый интерактивный элемент окна
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(timer);
      restoreFocusRef.current?.focus();
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-[#1f1c1a]/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            aria-describedby={description ? 'modal-description' : undefined}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }}
            transition={{ duration: 0.42, ease: [0.25, 1, 0.5, 1] }}
            className="bg-surface relative max-h-[92vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-[1.75rem] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[var(--shadow-lift)] sm:rounded-[1.75rem] sm:p-9 sm:pb-9"
          >
            {/* Полоска-«ручка»: на мобильных сразу читается как шторка снизу */}
            <span
              aria-hidden
              className="bg-border-strong mx-auto mb-4 block h-1 w-10 rounded-full sm:hidden"
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть окно"
              className="text-muted hover:border-accent hover:text-accent absolute top-5 right-5 flex size-11 items-center justify-center rounded-full border border-transparent transition-colors duration-300"
            >
              <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-4">
                <path
                  d="M3.5 3.5l9 9m0-9l-9 9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <h2 className="text-h3 pr-10 font-serif">{title}</h2>
            {description ? (
              <p id="modal-description" className="text-muted mt-2.5 text-sm leading-relaxed">
                {description}
              </p>
            ) : null}

            <div className="mt-7">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
