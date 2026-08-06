import Link from 'next/link';
import { cities, countOffices, getOfficesByCity, offices } from '@/content/centers';
import { PageHero } from '@/components/layout/PageHero';
import { FinalCta } from '@/components/sections/FinalCta';
import { ArrowRight } from '@/components/ui/Button';
import { OfficeCard } from '@/components/ui/OfficeCard';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Центры сети — четыре офиса в трёх городах',
  description:
    'Офисы RandK Center: два в Павловском Посаде, по одному в Орехово-Зуеве и Электростали. Адреса, телефоны и маршруты.',
  path: '/centers',
});

export default function CentersPage() {
  return (
    <>
      <PageHero
        eyebrow="География сети"
        title="Четыре офиса в трёх городах"
        lead="Занятия проходят очно. В Павловском Посаде работают два офиса — выбирайте тот, до которого удобнее добираться."
        breadcrumbs={[{ name: 'Центры', path: '/centers' }]}
      />

      {/* Города, а внутри — их офисы. Так видно, что городов три, а офисов четыре. */}
      {cities.map((city, cityIndex) => {
        const cityOffices = getOfficesByCity(city.slug);
        const officeCount = countOffices(city.slug);

        return (
          <Section key={city.slug} tone={cityIndex % 2 === 0 ? 'default' : 'muted'} spacing="tight">
            <SectionHeading
              eyebrow={officeCount > 1 ? `${officeCount} офиса` : '1 офис'}
              title={city.name}
              lead={city.intro}
              aside={
                <Link
                  href={`/centers/${city.slug}`}
                  className="group text-accent inline-flex items-center gap-2 text-sm font-medium"
                >
                  Страница центра
                  <ArrowRight />
                </Link>
              }
            />

            <ul
              className={`mt-10 grid gap-5 ${officeCount > 1 ? 'md:grid-cols-2' : 'md:max-w-md'}`}
            >
              {cityOffices.map((office, index) => (
                <Reveal as="li" key={office.id} delay={index * 0.07}>
                  <OfficeCard office={office} showCityLink={false} />
                </Reveal>
              ))}
            </ul>
          </Section>
        );
      })}

      <Section spacing="tight">
        <p className="text-muted border-border max-w-2xl border-l-2 pl-4 text-sm leading-relaxed">
          Всего в сети {offices.length} офиса. Состав направлений в них может отличаться —
          актуальный набор в группы подскажет администратор.
        </p>
      </Section>

      <FinalCta />
    </>
  );
}
