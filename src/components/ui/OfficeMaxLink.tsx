'use client';

import type { Office } from '@/content/types';
import { track } from '@/lib/analytics';

export function OfficeMaxLink({ office }: { office: Office }) {
  if (!office.maxUrl) return null;

  return (
    <a
      href={office.maxUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Написать в MAX: офис RandK Center, ${office.city}`}
      onClick={() =>
        track('max_click', {
          city: office.citySlug,
          officeId: office.id,
          place: 'contacts',
        })
      }
      className="rounded-pill border-border-strong text-text hover:border-accent hover:text-accent inline-flex min-h-11 items-center justify-center border px-5 text-sm transition-colors duration-300"
    >
      Написать в MAX
    </a>
  );
}
