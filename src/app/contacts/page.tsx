import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';
import { PageHero } from '@/components/layout/PageHero';
import { ArrowRight } from '@/components/ui/Button';
import { PhoneLink } from '@/components/ui/PhoneLink';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { branches } from '@/content/branches';
import { site } from '@/content/site';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Контакты',
  description:
    'Контакты образовательных центров RandK в Орехово-Зуеве, Павловском Посаде и Электростали. Заявка на пробное занятие и консультацию.',
  path: '/contacts',
});

export default function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Связаться"
        title="Контакты"
        lead="Оставьте заявку — администратор свяжется с вами, ответит на вопросы и поможет подобрать программу и центр."
        breadcrumbs={[{ name: 'Контакты', path: '/contacts' }]}
      />

      <div className="container-page pb-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <dl className="flex flex-col gap-8">
                <div>
                  <dt className="text-eyebrow text-muted font-medium uppercase">Телефон</dt>
                  <dd className="mt-3">
                    <PhoneLink place="contacts" />
                  </dd>
                </div>

                {site.contacts.isConfirmed && site.contacts.email ? (
                  <div>
                    <dt className="text-eyebrow text-muted font-medium uppercase">Почта</dt>
                    <dd className="mt-3">
                      <a
                        href={`mailto:${site.contacts.email}`}
                        className="hover:text-accent text-lg transition-colors"
                      >
                        {site.contacts.email}
                      </a>
                    </dd>
                  </div>
                ) : null}

                <div>
                  <dt className="text-eyebrow text-muted font-medium uppercase">Сообщества</dt>
                  <dd className="mt-3">
                    <SocialLinks />
                  </dd>
                </div>

                <div>
                  <dt className="text-eyebrow text-muted font-medium uppercase">Центры сети</dt>
                  <dd className="mt-3 flex flex-col gap-2">
                    {branches.map((branch) => (
                      <Link
                        key={branch.slug}
                        href={`/branches/${branch.slug}`}
                        className="group hover:text-accent inline-flex items-center gap-2 transition-colors"
                      >
                        {branch.city}
                        <ArrowRight />
                      </Link>
                    ))}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="bg-surface border-border shadow-soft rounded-[1.5rem] border p-7 md:p-10">
                <h2 className="text-h3 font-serif">Оставить заявку</h2>
                <p className="text-muted mt-2.5 text-sm leading-relaxed">
                  Заполните форму — свяжемся, чтобы уточнить детали и подобрать программу.
                </p>
                <div className="mt-8">
                  <LeadForm source="contacts" showMessage />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <Section tone="muted" spacing="tight">
        <SectionHeading
          eyebrow="Адреса"
          title="Где находятся центры"
          lead="Точные адреса и графики работы центров публикуются после подтверждения. Актуальную информацию подскажет администратор."
        />

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {branches.map((branch, index) => (
            <Reveal as="li" key={branch.slug} delay={index * 0.08}>
              <Link
                href={`/branches/${branch.slug}`}
                className="group bg-surface border-border hover:border-accent flex h-full flex-col gap-4 rounded-[1.25rem] border p-7 transition-colors duration-400"
              >
                <span className="text-h3 font-serif">{branch.city}</span>
                <span className="text-muted text-sm leading-relaxed">
                  {branch.address ?? 'Адрес уточняется'}
                </span>
                <span className="text-accent mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium">
                  Страница центра
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}
