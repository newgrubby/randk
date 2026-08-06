'use client';

import { useContactModal } from './ContactModalProvider';
import { track } from '@/lib/analytics';
import { ArrowRight, Button } from '@/components/ui/Button';

type ContactButtonProps = {
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse';
  size?: 'md' | 'lg';
  className?: string;
  withArrow?: boolean;
  title?: string;
  description?: string;
  /** Открыть окно сразу на нужном офисе. */
  officeId?: string;
  /** Метка места нажатия для аналитики. */
  place?: string;
};

/**
 * Кнопка, открывающая контактное окно.
 *
 * Заменяет прежние «Записаться» / «Получить консультацию» / «Подобрать
 * программу», которые вели в формы заявок. Текст кнопки меняется, поведение
 * одно — открыть контакты нужного офиса.
 */
export function ContactButton({
  label = 'Связаться с центром',
  variant = 'primary',
  size = 'md',
  className,
  withArrow = false,
  title,
  description,
  officeId,
  place = 'unknown',
}: ContactButtonProps) {
  const { open } = useContactModal();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        track('contact_modal_open', { place });
        open({ title, description, officeId });
      }}
    >
      {label}
      {withArrow ? <ArrowRight /> : null}
    </Button>
  );
}
