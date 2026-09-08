import Link from 'next/link';
import { offices } from '@/content/centers';
import { ArrowRight } from '@/components/ui/Button';
import { OfficeCard } from '@/components/ui/OfficeCard';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Три офиса сети: по одному в каждом городе.
 */
export function OfficesGrid({
  withHeading = true,
  officeList = offices,
  title = 'Три офиса в трёх городах',
  lead = 'Занятия проходят очно в Павловском Посаде, Орехово-Зуеве и Электростали.',
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
              className="group text-accent inline-flex min-h-11 items-center gap-2 text-sm font-medium"
            >
              Все центры
              <ArrowRight />
            </Link>
          }
        />
      ) : null}

      <ul className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${withHeading ? 'mt-12' : ''}`}>
        {officeList.map((office, index) => (
          <Reveal as="li" key={office.id} delay={(index % 3) * 0.07}>
            <OfficeCard office={office} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
