'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { legalNavigation, mainNavigation } from '@/content/navigation';
import { cn } from '@/lib/utils';
import { ContactButton } from '@/components/contact/ContactButton';
import { CitySwitcher } from './CitySwitcher';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Открыть меню"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        className="border-border-strong hover:border-accent hover:text-accent flex size-11 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden"
      >
        <span aria-hidden className="flex flex-col gap-[5px]">
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
        </span>
      </button>

      {isOpen ? (
        <div
          id="mobile-menu"
          className="animate-menu-enter bg-background fixed inset-0 z-100 flex flex-col lg:hidden"
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
            className="container-page flex-1 overflow-y-auto pb-28"
          >
            <ul className="flex flex-col">
              {mainNavigation.map((item, index) => (
                <li
                  key={item.href}
                  className="animate-menu-item border-border border-b py-4"
                  style={{ animationDelay: `${0.06 + index * 0.05}s` }}
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
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4">
              <ContactButton size="lg" className="w-full" place="mobile-menu" />

              <ul className="text-muted mt-2 flex flex-col text-[0.8125rem]">
                {legalNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-underline inline-flex min-h-11 items-center"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
