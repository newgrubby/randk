'use client';

import Link from 'next/link';
import { finalCta } from '@/content/home';
import { ContactButton } from '@/components/contact/ContactButton';
import { ArrowRight } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export function FinalCta() {
  return (
    <Section spacing="loose">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-h1 font-serif">{finalCta.title}</h2>
        <p className="text-lead text-muted mx-auto mt-6 max-w-2xl">{finalCta.text}</p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ContactButton label={finalCta.primary.label} size="lg" place="final-cta" />
          <Link
            href={finalCta.secondary.href}
            className="group rounded-pill border-border-strong text-text hover:border-accent hover:text-accent inline-flex min-h-11 items-center justify-center gap-2.5 border px-8 py-4 text-[0.9375rem] font-medium transition-colors duration-300"
          >
            {finalCta.secondary.label}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </Section>
  );
}
