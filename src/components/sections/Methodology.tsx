import { methodology } from '@/content/home';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Методика и подход.
 *
 * Описывает процесс работы, а не результаты: цифры (проценты сдачи,
 * количество учеников) клиентом не подтверждены и на сайте не публикуются.
 */
export function Methodology() {
  return (
    <Section id="methodology" tone="deep">
      <SectionHeading
        eyebrow={methodology.eyebrow}
        title={methodology.title}
        lead={methodology.lead}
        tone="dark"
      />

      <ol className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
        {methodology.steps.map((step, index) => (
          <Reveal as="li" key={step.title} delay={index * 0.08}>
            <div className="h-full border border-white/12 p-7 md:p-8">
              <span className="font-serif text-[2.25rem] leading-none text-white/25">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-serif text-xl text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
