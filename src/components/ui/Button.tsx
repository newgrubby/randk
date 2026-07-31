import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse';
type Size = 'md' | 'lg';

const base =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-pill font-medium ' +
  'transition-[transform,background-color,color,border-color,box-shadow] duration-300 ' +
  'ease-[var(--ease-out-quart)] active:translate-y-px disabled:pointer-events-none disabled:opacity-55 ' +
  // Комфортная зона нажатия на мобильных
  'min-h-11 text-center';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white shadow-soft hover:bg-accent-dark hover:shadow-lift',
  secondary:
    'bg-surface text-text border border-border-strong hover:border-accent hover:text-accent',
  ghost: 'text-text hover:text-accent',
  inverse: 'bg-white text-text hover:bg-accent hover:text-white',
};

const sizes: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-[0.9375rem]',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  external,
  ...rest
}: CommonProps & {
  href: string;
  external?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, variants[variant], sizes[size], className)}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}

/** Стрелка со сдвигом при наведении — общий микроакцент проекта. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        'size-4 shrink-0 transition-transform duration-300 ease-[var(--ease-out-quart)] group-hover:translate-x-1',
        className,
      )}
    >
      <path
        d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
