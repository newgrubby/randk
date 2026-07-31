import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'text-eyebrow inline-flex items-center gap-2 font-medium tracking-[0.16em] uppercase',
        className,
      )}
    >
      <span aria-hidden className="bg-accent inline-block h-px w-6" />
      {children}
    </span>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Правый слот — обычно ссылка «Все программы». */
  aside?: ReactNode;
  level?: 'h2' | 'h3';
  align?: 'left' | 'center';
  className?: string;
  tone?: 'light' | 'dark';
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  aside,
  level: Tag = 'h2',
  align = 'left',
  className,
  tone = 'light',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'md:mx-auto')}>
        {eyebrow ? (
          <Eyebrow className={tone === 'dark' ? 'text-white/60' : 'text-muted'}>{eyebrow}</Eyebrow>
        ) : null}
        <Tag className={cn('text-h2 mt-4', tone === 'dark' ? 'text-white' : 'text-text')}>
          {title}
        </Tag>
        {lead ? (
          <p
            className={cn(
              'text-lead mt-5',
              tone === 'dark' ? 'text-white/70' : 'text-muted',
              align === 'center' && 'md:mx-auto',
            )}
          >
            {lead}
          </p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
