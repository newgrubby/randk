import type { ProgramIconName } from '@/content/types';
import { cn } from '@/lib/utils';

/**
 * Иконки направлений.
 * Нарисованы вручную одной линией толщиной 1.4 — чтобы не тянуть
 * иконочную библиотеку и сохранить единый графический язык.
 */

const paths: Record<ProgramIconName, React.ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18-2.5-2.6-2.5-15.4 0-18Z" />
    </>
  ),
  certificate: (
    <>
      <path d="M4 4h16v11H4zM8 19l4-2.5 4 2.5v-4H8z" />
      <path d="M8 8h8M8 11h5" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5h6a2.5 2.5 0 0 1 2 2.5v12a2 2 0 0 0-2-1.5H4zM20 4.5h-6a2.5 2.5 0 0 0-2 2.5v12a2 2 0 0 1 2-1.5h6z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.2l-1.8-5.6L4.5 10.8 10.2 9z" />
      <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20l1-4.5L16 4.6a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.5 19z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
};

export function ProgramIcon({ name, className }: { name: ProgramIconName; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-6', className)}
    >
      {paths[name]}
    </svg>
  );
}
