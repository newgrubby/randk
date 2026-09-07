'use client';

import type { Office } from '@/content/types';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function YandexRouteLink({
  office,
  label = 'Маршрут',
  className,
}: {
  office: Office;
  label?: string;
  className?: string;
}) {
  if (!office.yandexRouteUrl) return null;

  return (
    <a
      href={office.yandexRouteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Построить маршрут до офиса: ${office.city}, ${office.address}`}
      onClick={() => track('map_route_click', { city: office.citySlug, officeId: office.id })}
      className={cn(
        'rounded-pill border-border-strong text-text hover:border-accent hover:text-accent inline-flex min-h-11 items-center justify-center gap-2 border px-5 text-center text-sm font-medium transition-colors duration-300',
        className,
      )}
    >
      <RouteIcon />
      {label}
    </a>
  );
}

function RouteIcon() {
  return (
    <svg aria-hidden viewBox="0 0 18 18" fill="none" className="size-4 shrink-0">
      <circle cx="4" cy="14" r="1.75" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M4 12.25V8.5a2 2 0 0 1 2-2h6.25M10 4.25l2.25 2.25L10 8.75"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
