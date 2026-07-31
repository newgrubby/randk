'use client';

import { useLeadModal } from '@/components/forms/LeadModalProvider';
import { track } from '@/lib/analytics';
import type { LeadSource } from '@/lib/lead-schema';
import type { LeadFormValues } from '@/lib/lead-schema';
import { ArrowRight, Button } from './Button';

type TrialButtonProps = {
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse';
  size?: 'md' | 'lg';
  className?: string;
  withArrow?: boolean;
  source?: LeadSource;
  title?: string;
  description?: string;
  defaults?: Partial<LeadFormValues>;
};

/** Кнопка, открывающая модальное окно заявки. Сама шлёт цель в аналитику. */
export function TrialButton({
  label = 'Записаться на пробное занятие',
  variant = 'primary',
  size = 'md',
  className,
  withArrow = false,
  source = 'trial',
  title,
  description,
  defaults,
}: TrialButtonProps) {
  const { open } = useLeadModal();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        track('trial_lesson_click', { source });
        open({ source, title, description, defaults });
      }}
    >
      {label}
      {withArrow ? <ArrowRight /> : null}
    </Button>
  );
}
