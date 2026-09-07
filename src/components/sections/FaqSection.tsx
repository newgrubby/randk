import type { FaqItem } from '@/content/types';
import { faqJsonLd } from '@/lib/jsonld';
import { Accordion } from '@/components/ui/Accordion';
import { JsonLd } from '@/components/ui/JsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/SectionHeading';

export function FaqSection({
  items,
  title = 'Частые вопросы',
  eyebrow = 'FAQ',
  /** На странице должна быть одна разметка FAQPage — на вложенных отключаем. */
  withJsonLd = true,
}: {
  items: FaqItem[];
  title?: string;
  eyebrow?: string;
  withJsonLd?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <Section id="faq" tone="surface">
      {withJsonLd ? <JsonLd data={faqJsonLd(items)} /> : null}

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal>
            <Eyebrow className="text-muted">{eyebrow}</Eyebrow>
            <h2 className="text-h2 mt-4 font-serif">{title}</h2>
            <p className="text-muted mt-5 leading-relaxed">
              Не нашли ответ? Позвоните в удобный центр или напишите в сообщество — администратор
              ответит на вопросы и поможет с выбором.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal delay={0.1}>
            <Accordion items={items} />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
