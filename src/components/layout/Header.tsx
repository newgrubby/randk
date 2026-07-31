'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mainNavigation } from '@/content/navigation';
import { site } from '@/content/site';
import { track } from '@/lib/analytics';
import { cn, displayPhone } from '@/lib/utils';
import { TrialButton } from '@/components/ui/TrialButton';
import { CitySwitcher } from './CitySwitcher';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showPhone = site.contacts.isConfirmed && site.contacts.phone;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-90 transition-all duration-500 ease-[var(--ease-out-quart)]',
        isScrolled
          ? 'border-border bg-background/85 border-b backdrop-blur-lg'
          : 'border-b border-transparent',
      )}
    >
      <a
        href="#main"
        className="sr-only-focusable bg-accent absolute top-3 left-4 z-10 rounded-full px-4 py-2 text-sm text-white"
      >
        Перейти к содержимому
      </a>

      <div className="container-page">
        <div
          className={cn(
            'flex items-center justify-between gap-6 transition-all duration-500 ease-[var(--ease-out-quart)]',
            isScrolled ? 'py-3' : 'py-5',
          )}
        >
          <div className="flex items-center gap-5">
            <Logo />
            <span className="text-muted border-border hidden max-w-[11rem] border-l pl-5 text-[0.6875rem] leading-tight xl:block">
              {site.tagline}
            </span>
          </div>

          {/* Основная навигация */}
          <nav aria-label="Основная навигация" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(item.children ? item.href : null)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'link-underline inline-flex items-center gap-1.5 py-2 text-sm transition-colors duration-300',
                        isActive ? 'text-accent' : 'text-text hover:text-accent',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                      {item.children ? (
                        <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-2.5">
                          <path
                            d="m3 6 5 5 5-5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : null}
                    </Link>

                    {item.children && openMenu === item.href ? (
                      <div className="absolute top-full left-1/2 z-50 w-64 -translate-x-1/2 pt-3">
                        <div className="bg-surface border-border shadow-lift animate-fade-up rounded-2xl border p-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => {
                                setOpenMenu(null);
                                track(
                                  item.href === '/branches' ? 'branch_select' : 'program_select',
                                  { href: child.href },
                                );
                              }}
                              className="text-text hover:bg-surface-muted hover:text-accent block rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-200"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <CitySwitcher />
            </div>

            {showPhone ? (
              <a
                href={`tel:${site.contacts.phone}`}
                onClick={() => track('phone_click', { place: 'header' })}
                className="text-text hover:text-accent hidden text-sm font-medium transition-colors duration-300 xl:block"
              >
                {site.contacts.phoneDisplay ?? displayPhone(site.contacts.phone ?? '')}
              </a>
            ) : null}

            <TrialButton label="Записаться" className="hidden md:inline-flex" />

            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
