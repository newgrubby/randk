import Link from 'next/link';
import { advantageTheses } from '@/content/home';
import { ArrowRight } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Короткая версия преимуществ для главной.
 *
 * Раньше главная и /about показывали один и тот же развёрнутый список из
 * шести пунктов — страницы читались как копии друг друга. Теперь главная
 * даёт четыре тезиса и ссылку, а подробное раскрытие подхода живёт на /about.
 */
export function AdvantageTheses() {
  return (
    <Section id="advantages" spacing="tight">
      <SectionHeading
        eyebrow="Почему RandK"
        title="Коротко о подходе"
        aside={
          <Link
            href="/about"
            className="group text-accent inline-flex items-center gap-2 text-sm font-medium"
          >
            Подробнее о центре
            <ArrowRight />
          </Link>
        }
      />

      <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {advantageTheses.map((item, index) => (
          <Reveal as="li" key={item.title} delay={(index % 4) * 0.07}>
            <span aria-hidden className="bg-accent block h-px w-8" />
            <h3 className="mt-5 font-serif text-xl">{item.title}</h3>
            <p className="text-muted mt-2.5 text-[0.9375rem] leading-relaxed">{item.text}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
