import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cities, fullAddress, getCity, getOfficesByCity } from '@/content/centers';
import { getLanguagesByCity } from '@/content/languages';
import { getProgramsByCity } from '@/content/programs';
import { officeJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';
import { displayPhone } from '@/lib/utils';
import { ContactButton } from '@/components/contact/ContactButton';
import { PageHero } from '@/components/layout/PageHero';
import { ArrowRight } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';
import { OfficeMap } from '@/components/ui/OfficeMap';
import { ProgramIcon } from '@/components/ui/ProgramIcon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialLinks } from '@/components/ui/SocialLinks';

export function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(slug);

  if (!city) {
    return buildMetadata({
      title: 'Центр не найден',
      description: '',
      path: '/centers',
      noIndex: true,
    });
  }

  return buildMetadata({
    title: city.seoTitle,
    ogTitle: `RandK Center ${city.locative}`,
    description: city.seoDescription,
    path: `/centers/${city.slug}`,
  });
}

/**
 * Страница города.
 *
 * Ключевое отличие от первой версии: город может содержать несколько офисов.
 * В Павловском Посаде их два, и каждый получает собственный блок с адресом,
 * телефоном, кнопкой звонка, маршрутом и картой — они не сливаются в один.
 */
export default async function CityRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const cityOffices = getOfficesByCity(city.slug);
  const cityLanguages = getLanguagesByCity(city.slug);
  const cityPrograms = getProgramsByCity(city.slug);

  /* LocalBusiness выводится только для подтверждённых офисов. */
  const officeSchemas = cityOffices
    .map((office) => officeJsonLd(office))
    .filter((schema): schema is Record<string, unknown> => schema !== null);

  return (
    <>
      {officeSchemas.length > 0 ? <JsonLd data={officeSchemas} /> : null}

      <PageHero
        eyebrow={cityOffices.length > 1 ? `${cityOffices.length} офиса в городе` : 'Центр сети'}
        title={`RandK Center ${city.locative}`}
        lead={city.intro}
        breadcrumbs={[
          { name: 'Центры', path: '/centers' },
          { name: city.name, path: `/centers/${city.slug}` },
        ]}
        aside={<ContactButton label="Показать телефоны" place={`city-${city.slug}`} />}
      />

      {/* Каждый офис — отдельный развёрнутый блок */}
      {cityOffices.map((office, index) => (
        <Section key={office.id} tone={index % 2 === 0 ? 'default' : 'muted'} spacing="tight">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="text-eyebrow text-accent font-medium uppercase">
                  Офис {index + 1} из {cityOffices.length}
                </p>
                <h2 className="text-h2 mt-4 font-serif">{office.officeName}</h2>

                <dl className="mt-8 flex flex-col gap-6">
                  <div>
                    <dt className="text-eyebrow text-muted font-medium uppercase">Адрес</dt>
                    <dd className="mt-2 text-lg">
                      {city.name}, {fullAddress(office)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-eyebrow text-muted font-medium uppercase">Телефон</dt>
                    <dd className="mt-2">
                      {office.phone ? (
                        <a
                          href={`tel:${office.phone}`}
                          className="text-text hover:text-accent text-lg font-medium transition-colors duration-300"
                        >
                          {displayPhone(office.phone)}
                        </a>
                      ) : (
                        <span className="text-muted">Уточняется</span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-eyebrow text-muted font-medium uppercase">График работы</dt>
                    <dd className="text-muted mt-2 flex flex-col gap-1">
                      {office.schedule.length > 0 ? (
                        office.schedule.map((line) => <span key={line}>{line}</span>)
                      ) : (
                        <span>Уточняется у администратора</span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-eyebrow text-muted font-medium uppercase">Сообщества</dt>
                    <dd className="mt-3">
                      <SocialLinks />
                    </dd>
                  </div>
                </dl>

                <div className="mt-8">
                  <ContactButton
                    label="Связаться с этим офисом"
                    size="lg"
                    officeId={office.id}
                    place={`office-${office.id}`}
                    title={`${office.city} — ${office.officeName}`}
                  />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={office.photos[0]?.src ?? '/images/offices/placeholder.svg'}
                    alt={office.photos[0]?.alt ?? `Центр RandK — ${office.city}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
                <OfficeMap office={office} />
              </Reveal>
            </div>
          </div>
        </Section>
      ))}

      {/* Языки города */}
      <Section tone="surface" spacing="tight">
        <SectionHeading
          eyebrow="Языки"
          title={`Языковые направления ${city.locative}`}
          aside={
            <Link
              href="/languages"
              className="group text-accent inline-flex min-h-11 items-center gap-2 text-sm font-medium"
            >
              Все языки
              <ArrowRight />
            </Link>
          }
        />
        <ul className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {cityLanguages.map((language, index) => (
            <Reveal as="li" key={language.slug} delay={(index % 3) * 0.06} className="h-full">
              <Link
                href={`/languages/${language.slug}`}
                className="group border-border hover:bg-background flex h-full items-center justify-between gap-4 border p-6 transition-colors duration-400"
              >
                <span className="flex items-center gap-4">
                  <span aria-hidden className="text-accent/35 w-12 shrink-0 font-serif text-xl">
                    {language.code}
                  </span>
                  <span className="font-serif text-lg">{language.title}</span>
                </span>
                <ArrowRight />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Направления города */}
      <Section spacing="tight">
        <SectionHeading
          eyebrow="Направления"
          title={`Что ещё есть ${city.locative}`}
          lead="Состав групп и расписание отличаются по офисам — подскажем, где сейчас идёт набор."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cityPrograms.map((program, index) => (
            <Reveal as="li" key={program.slug} delay={(index % 3) * 0.06}>
              <Link
                href={program.href}
                className="group border-border hover:border-accent bg-surface flex h-full flex-col gap-4 rounded-[1.25rem] border p-7 transition-colors duration-400"
              >
                <ProgramIcon name={program.icon} className="text-accent size-6" />
                <span className="text-h3 font-serif">{program.title}</span>
                <span className="text-muted text-sm">{program.age}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section spacing="tight">
        <ul className="border-border flex flex-col gap-px border-t pt-8 sm:flex-row sm:gap-10">
          {[
            { label: 'Направления сети', href: '/programs' },
            { label: 'Частые вопросы', href: '/#faq' },
            { label: 'Другие центры', href: '/centers' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group text-muted hover:text-accent inline-flex items-center gap-2 py-2 text-sm transition-colors duration-300"
              >
                {link.label}
                <ArrowRight />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
