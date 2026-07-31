'use client';

import Link from 'next/link';
import { finalCta } from '@/content/home';
import { useLeadModal } from '@/components/forms/LeadModalProvider';
import { track } from '@/lib/analytics';
import { ArrowRight, Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export function FinalCta() {
  const { open } = useLeadModal();

  return (
    <Section spacing="loose">
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-h1 font-serif">{finalCta.title}</h2>
          <p className="text-lead text-muted mx-auto mt-6 max-w-2xl">{finalCta.text}</p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => {
                track('trial_lesson_click', { source: 'final-cta' });
                open({
                  source: 'consultation',
                  title: 'Получить консультацию',
                  description:
                    'Расскажите о возрасте и цели занятий — предложим направление, формат и удобный центр.',
                });
              }}
            >
              {finalCta.primary.label}
            </Button>

            <Link
              href={finalCta.secondary.href}
              className="group rounded-pill border-border-strong text-text hover:border-accent hover:text-accent inline-flex min-h-11 items-center justify-center gap-2.5 border px-8 py-4 text-[0.9375rem] font-medium transition-colors duration-300"
            >
              {finalCta.secondary.label}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
