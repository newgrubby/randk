import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Логотип-леттеринг.
 *
 * Клиент не передал векторный логотип, поэтому знак собран типографикой:
 * serif-начертание «RandK» + разрядка «CENTER». Когда появится оригинальный
 * логотип, достаточно заменить содержимое этого компонента.
 */
export function Logo({
  tone = 'light',
  className,
}: {
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <Link href="/" className={cn('group inline-flex flex-col leading-none', className)}>
      <span
        className={cn(
          'font-serif text-[1.6rem] tracking-[-0.01em] transition-colors duration-300 sm:text-[1.75rem]',
          tone === 'dark' ? 'text-white' : 'text-accent',
        )}
      >
        Rand<span className={tone === 'dark' ? 'text-white' : 'text-text'}>K</span>
      </span>
      <span
        className={cn(
          'mt-1 text-[0.5625rem] font-medium tracking-[0.42em] uppercase',
          tone === 'dark' ? 'text-white/55' : 'text-muted',
        )}
      >
        Center
      </span>
      <span className="sr-only"> — на главную</span>
    </Link>
  );
}
