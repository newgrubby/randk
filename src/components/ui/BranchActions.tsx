'use client';

import { useLeadModal } from '@/components/forms/LeadModalProvider';
import type { Branch } from '@/content/types';
import { track } from '@/lib/analytics';
import { buildYandexRouteUrl, cn } from '@/lib/utils';
import { Button, ButtonLink } from './Button';

/**
 * Кнопки филиала: запись и маршрут.
 * «Построить маршрут» появляется только при подтверждённых координатах
 * или готовой ссылке на карточку в Яндекс Картах.
 */
export function BranchActions({
  branch,
  compact = false,
  className,
}: {
  branch: Branch;
  compact?: boolean;
  className?: string;
}) {
  const { open } = useLeadModal();

  const routeUrl =
    branch.mapUrl ?? (branch.coordinates ? buildYandexRouteUrl(branch.coordinates) : null);

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <Button
        size={compact ? 'md' : 'lg'}
        onClick={() => {
          track('trial_lesson_click', { branch: branch.slug });
          open({
            source: 'branch',
            title: `Запись в центр — ${branch.city}`,
            description:
              'Оставьте контакты: администратор свяжется с вами, подберёт направление и удобное время занятий.',
            defaults: { city: branch.city },
          });
        }}
      >
        Записаться
      </Button>

      {routeUrl ? (
        <ButtonLink
          href={routeUrl}
          external
          variant="secondary"
          size={compact ? 'md' : 'lg'}
          onClick={() => track('map_click', { branch: branch.slug, kind: 'route' })}
        >
          Построить маршрут
        </ButtonLink>
      ) : null}
    </div>
  );
}
