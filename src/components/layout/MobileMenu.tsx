'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { legalNavigation, mainNavigation } from '@/content/navigation';
import { site } from '@/content/site';
import { track } from '@/lib/analytics';
import { cn, displayPhone } from '@/lib/utils';
import { TrialButton } from '@/components/ui/TrialButton';
import { CitySwitcher } from './CitySwitcher';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  // Закрываем меню при переходе на другую страницу
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const showPhone = site.contacts.isConfirmed && site.contacts.phone;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Открыть меню"
        aria-expanded={isOpen}
        className="border-border-strong hover:border-accent hover:text-accent flex size-11 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden"
      >
        <span aria-hidden className="flex flex-col gap-[5px]">
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
        </span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="bg-background fixed inset-0 z-100 flex flex-col lg:hidden"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="container-page flex items-center justify-between py-5">
              {/* На узких экранах выбор города живёт здесь — в шапке для него нет места */}
              <CitySwitcher />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Закрыть меню"
                className="border-border-strong hover:border-accent hover:text-accent flex size-11 items-center justify-center rounded-full border transition-colors duration-300"
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
            </div>

            <nav
              aria-label="Мобильная навигация"
              className="container-page flex-1 overflow-y-auto pb-8"
            >
              <ul className="flex flex-col">
                {mainNavigation.map((item, index) => (
                  <motion.li
                    key={item.href}
                    className="border-border border-b py-4"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + index * 0.05, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'font-serif text-2xl',
                        pathname === item.href ? 'text-accent' : 'text-text',
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.children ? (
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="text-muted hover:text-accent text-sm transition-colors"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-4">
                <TrialButton size="lg" className="w-full" />

                {showPhone ? (
                  <a
                    href={`tel:${site.contacts.phone}`}
                    onClick={() => track('phone_click', { place: 'mobile-menu' })}
                    className="text-text text-center text-lg font-medium"
                  >
                    {site.contacts.phoneDisplay ?? displayPhone(site.contacts.phone ?? '')}
                  </a>
                ) : null}

                <ul className="text-muted mt-2 flex flex-col gap-2 text-xs">
                  {legalNavigation.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="link-underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
