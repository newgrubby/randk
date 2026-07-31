import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Фон секции. Чередование задаёт ритм страницы. */
  tone?: 'default' | 'surface' | 'muted' | 'deep';
  /** Плотность вертикальных отступов. */
  spacing?: 'default' | 'tight' | 'loose';
  as?: 'section' | 'div' | 'footer';
};

const toneClass: Record<NonNullable<SectionProps['tone']>, string> = {
  default: '',
  surface: 'bg-surface',
  muted: 'bg-surface-muted',
  deep: 'surface-deep',
};

const spacingClass: Record<NonNullable<SectionProps['spacing']>, string> = {
  tight: 'py-14 md:py-20',
  default: 'py-20 md:py-28 lg:py-32',
  loose: 'py-24 md:py-36 lg:py-44',
};

export function Section({
  id,
  children,
  className,
  tone = 'default',
  spacing = 'default',
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag id={id} className={cn(toneClass[tone], spacingClass[spacing], className)}>
      <div className="container-page">{children}</div>
    </Tag>
  );
}
