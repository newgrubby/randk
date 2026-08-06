import Link from 'next/link';
import { offices } from '@/content/centers';
import { ArrowRight } from '@/components/ui/Button';
import { OfficeCard } from '@/components/ui/OfficeCard';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Четыре офиса сети.
 *
 * Сетка в четыре колонки на десктопе: города три, а офисов четыре, и это
 * должно читаться сразу — два офиса Павловского Посада стоят рядом и
 * различаются подписью расположения.
 */
export function OfficesGrid({
  withHeading = true,
  officeList = offices,
  title = 'Четыре офиса в трёх городах',
  lead = 'Занятия проходят очно. В Павловском Посаде работают два офиса — выбирайте тот, до которого удобнее добираться.',
}: {
  withHeading?: boolean;
  officeList?: typeof offices;
  title?: string;
  lead?: string;
}) {
  return (
    <Section id="centers" tone="muted">
      {withHeading ? (
        <SectionHeading
          eyebrow="География"
          title={title}
          lead={lead}
          aside={
            <Link
              href="/centers"
              className="group text-accent inline-flex items-center gap-2 text-sm font-medium"
            >
              Все центры
              <ArrowRight />
            </Link>
          }
        />
      ) : null}

      <ul className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-4 ${withHeading ? 'mt-12' : ''}`}>
        {officeList.map((office, index) => (
          <Reveal as="li" key={office.id} delay={(index % 4) * 0.07}>
            <OfficeCard office={office} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
