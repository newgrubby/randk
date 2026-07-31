'use client';

import Link from 'next/link';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const controlBase =
  'w-full rounded-xl border bg-surface px-4 py-3 text-[0.9375rem] text-text ' +
  'transition-colors duration-250 placeholder:text-muted/60 ' +
  'focus:border-accent focus:outline-none';

export function FieldWrapper({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-muted text-xs font-medium tracking-wide">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-accent text-xs">
          {error}
        </p>
      ) : hint ? (
        <p className="text-muted text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({
  error,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn(controlBase, error ? 'border-accent' : 'border-border', className)}
      aria-invalid={error || undefined}
      {...rest}
    />
  );
}

export function SelectField({
  error,
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <div className="relative">
      <select
        className={cn(
          controlBase,
          'cursor-pointer appearance-none pr-11',
          error ? 'border-accent' : 'border-border',
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        className="text-muted pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2"
      >
        <path d="m3 6 5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function ConsentField({
  id,
  checked,
  onChange,
  error,
}: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={Boolean(error) || undefined}
          className="accent-accent mt-0.5 size-4 shrink-0 cursor-pointer"
        />
        <span className="text-muted text-xs leading-relaxed">
          Я согласен на{' '}
          <Link href="/personal-data-consent" className="link-underline text-text">
            обработку персональных данных
          </Link>{' '}
          и ознакомлен с{' '}
          <Link href="/privacy" className="link-underline text-text">
            политикой конфиденциальности
          </Link>
          .
        </span>
      </label>
      {error ? (
        <p role="alert" className="text-accent text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Honeypot: скрыт от людей, но заполняется ботами.
 * Не используем display:none — часть ботов такие поля игнорирует.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="company">Компания</label>
      <input
        id="company"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
