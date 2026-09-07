import Link from 'next/link';
import { cities, fullAddress, getOfficesByCity, offices } from '@/content/centers';
import { site } from '@/content/site';
import { allOfficesJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';
import { displayPhone } from '@/lib/utils';
import { ContactButton } from '@/components/contact/ContactButton';
import { PageHero } from '@/components/layout/PageHero';
import { ArrowRight } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { YandexRouteLink } from '@/components/ui/YandexRouteLink';

export const metadata = buildMetadata({
  title: 'Контакты — телефоны и адреса офисов',
  description:
    'Контакты RandK Center: телефоны и адреса четырёх офисов в Орехово-Зуеве, Павловском Посаде и Электростали.',
  path: '/contacts',
});

/**
 * Контакты.
 *
 * Сайт не собирает заявки, поэтому страница — это список офисов с прямыми
 * телефонами. Все ссылки обычные (`tel:`, VK), работают без JavaScript.
 */
export default function ContactsPage() {
  const schemas = allOfficesJsonLd();

  return (
    <>
      {schemas.length > 0 ? <JsonLd data={schemas} /> : null}

      <PageHero
        eyebrow="Связаться"
        title="Контакты"
        lead="Позвоните в удобный офис — администратор ответит на вопросы, расскажет о расписании и поможет выбрать программу."
        breadcrumbs={[{ name: 'Контакты', path: '/contacts' }]}
        aside={<ContactButton label="Выбрать офис" place="contacts-hero" />}
      />

      {cities.map((city, cityIndex) => {
        const cityOffices = getOfficesByCity(city.slug);

        return (
          <Section key={city.slug} tone={cityIndex % 2 === 0 ? 'default' : 'muted'} spacing="tight">
            <SectionHeading
              eyebrow={cityOffices.length > 1 ? `${cityOffices.length} офиса` : '1 офис'}
              title={city.name}
              aside={
                <Link
                  href={`/centers/${city.slug}`}
                  className="group text-accent inline-flex min-h-11 items-center gap-2 text-sm font-medium"
                >
                  Страница центра
                  <ArrowRight />
                </Link>
              }
            />

            <ul className="mt-10 grid gap-5 md:grid-cols-2">
              {cityOffices.map((office, index) => (
                <Reveal as="li" key={office.id} delay={index * 0.07}>
                  <div className="bg-surface border-border h-full rounded-[1.25rem] border p-7">
                    <p className="text-accent text-sm">{office.officeName}</p>
                    <p className="mt-2 font-serif text-xl">{fullAddress(office)}</p>

                    {office.phone ? (
                      <a
                        href={`tel:${office.phone}`}
                        className="text-text hover:text-accent mt-4 inline-block text-lg font-medium transition-colors duration-300"
                      >
                        {displayPhone(office.phone)}
                      </a>
                    ) : (
                      <p className="text-muted mt-4">Телефон уточняется</p>
                    )}

                    <p className="text-muted mt-4 text-sm">
                      {office.schedule.length > 0
                        ? office.schedule.join(' · ')
                        : 'График работы уточняется у администратора'}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <ContactButton
                        label="Связаться"
                        officeId={office.id}
                        place={`contacts-${office.id}`}
                        title={`${office.city} — ${office.officeName}`}
                      />
                      <YandexRouteLink office={office} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Section>
        );
      })}

      <Section tone="surface" spacing="tight">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Сообщества"
              title="Написать в мессенджере"
              lead="Если удобнее писать, а не звонить — напишите в сообщество. Отвечаем в рабочее время."
            />
          </div>
          <div className="lg:col-span-7">
            <SocialLinks />
            <p className="text-muted mt-6 max-w-xl text-sm leading-relaxed">
              Сайт не собирает и не хранит персональные данные: форм заявок на нём нет, связь идёт
              напрямую по телефону или через сообщество.
            </p>
            {!site.social.max ? (
              <p className="text-muted mt-3 max-w-xl text-xs leading-relaxed">
                Кнопка MAX появится автоматически, как только будет добавлена ссылка на сообщество.
              </p>
            ) : null}
          </div>
        </div>
      </Section>

      <Section spacing="tight">
        <p className="text-muted border-border max-w-2xl border-l-2 pl-4 text-sm leading-relaxed">
          Всего в сети {offices.length} офиса в {cities.length} городах Подмосковья.
        </p>
      </Section>
    </>
  );
}
