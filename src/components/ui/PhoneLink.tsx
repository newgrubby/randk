'use client';

import { site } from '@/content/site';
import { track } from '@/lib/analytics';
import { cn, displayPhone } from '@/lib/utils';

/**
 * Кликабельный телефон.
 *
 * Пока номер не подтверждён клиентом, вместо цифр показывается
 * нейтральная формулировка — выдуманных номеров на сайте нет.
 */
export function PhoneLink({
  phone,
  place,
  tone = 'light',
  className,
}: {
  /** Телефон филиала. Если не передан — используется сетевой. */
  phone?: string | null;
  place: string;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const value = phone ?? (site.contacts.isConfirmed ? site.contacts.phone : null);

  if (!value) {
    return (
      <p className={cn('text-sm', tone === 'dark' ? 'text-white/45' : 'text-muted', className)}>
        Телефон уточняется — оставьте заявку, и мы перезвоним
      </p>
    );
  }

  return (
    <a
      href={`tel:${value}`}
      onClick={() => track('phone_click', { place })}
      className={cn(
        'text-lg font-medium transition-colors duration-300',
        tone === 'dark' ? 'text-white hover:text-white/70' : 'text-text hover:text-accent',
        className,
      )}
    >
      {displayPhone(value)}
    </a>
  );
}
