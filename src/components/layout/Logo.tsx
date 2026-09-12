import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({
  variant = 'header',
  className,
}: {
  variant?: 'header' | 'extended';
  className?: string;
}) {
  const isExtended = variant === 'extended';

  return (
    <Link
      href="/"
      aria-label="Rand K — на главную"
      className={cn('group inline-flex shrink-0', className)}
    >
      <Image
        src={isExtended ? '/brand/randk-logo-extended.svg' : '/brand/randk-logo-header.svg'}
        alt="Rand K"
        width={isExtended ? 360 : 190}
        height={isExtended ? 126 : 56}
        priority
        unoptimized
        className={cn(
          'transition-opacity duration-300 group-hover:opacity-80',
          isExtended
            ? 'h-[6.3rem] w-72 max-w-full'
            : 'h-10 w-[8.5rem] sm:h-11 sm:w-[9.35rem]',
        )}
      />
    </Link>
  );
}
