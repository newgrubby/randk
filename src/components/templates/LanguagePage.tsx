import Image from 'next/image';
import Link from 'next/link';
import { activeLanguages } from '@/content/languages';
import { offices } from '@/content/centers';
import type { Language } from '@/content/types';
import { courseJsonLd } from '@/lib/jsonld';
import { ContactButton } from '@/components/contact/ContactButton';
import { PageHero } from '@/components/layout/PageHero';
import { ArrowRight } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';
import { OfficeCard } from '@/components/ui/OfficeCard';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { formatLabels } from './DirectionPage';

/**
 * Единый шаблон страницы языка.
 *
 * Все языковые страницы рендерятся этим компонентом: правка макета
 * применяется сразу ко всем шести языкам, и ни один из них не может
 * визуально «перевесить» остальные.
 */
export function LanguagePage({ language }: { language: Language }) {
  const availableOffices = offices.filter((office) =>
    language.availableOffices.includes(office.id),
  );
  const otherLanguages = activeLanguages.filter((item) => item.slug !== language.slug).slice(0, 5);

  return (
    <>
      <JsonLd
        data={courseJsonLd({
          name: language.title,
          description: language.seoDescription,
          path: `/languages/${language.slug}`,
        })}
      />

      <PageHero
        eyebrow="Иностранный язык"
        title={language.title}
        lead={language.description}
        breadcrumbs={[
          { name: 'Языки', path: '/languages' },
          { name: language.shortTitle, path: `/languages/${language.slug}` },
        ]}
        aside={
          <ContactButton
            label="Узнать расписание"
            place={`language-${language.slug}`}
            title={`${language.title} — связаться`}
          />
        }
      />

      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {language.image ? (
              <Reveal>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={language.image.src}
                    alt={language.image.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={0.08}>
              <h2 className="text-h2 mt-12 font-serif">Как проходят занятия</h2>
              <ul className="mt-7 flex flex-col gap-4">
                {language.advantages.map((advantage) => (
                  <li key={advantage} className="border-border flex gap-4 border-b pb-4">
                    <span
                      aria-hidden
                      className="border-accent/35 text-accent mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border"
                    >
                      <svg viewBox="0 0 16 16" fill="none" className="size-3">
                        <path
                          d="m3 8.5 3.5 3.5L13 5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="leading-relaxed">{advantage}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <h2 className="text-h2 mt-14 font-serif">Форматы занятий</h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {language.formats.map((format) => (
                  <li
                    key={format}
                    className="border-border-strong rounded-pill border px-5 py-2.5 text-sm"
                  >
                    {formatLabels[format]}
                  </li>
                ))}
              </ul>

              <dl className="border-border mt-8 grid gap-6 border-t pt-8 sm:grid-cols-2">
                <div>
                  <dt className="text-eyebrow text-muted font-medium uppercase">Кто занимается</dt>
                  <dd className="mt-2 text-lg">Дети, подростки и взрослые</dd>
                </div>
                <div>
                  <dt className="text-eyebrow text-muted font-medium uppercase">
                    Расписание и стоимость
                  </dt>
                  <dd className="text-muted mt-2 leading-relaxed">
                    Зависят от формата и офиса — уточните у администратора
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <aside className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="bg-surface border-border shadow-soft sticky top-28 rounded-[1.5rem] border p-7 md:p-9">
                <h2 className="text-h3 font-serif">Другие языки</h2>
                <ul className="mt-5 flex flex-col">
                  {otherLanguages.map((item) => (
                    <li key={item.slug} className="border-border border-b last:border-0">
                      <Link
                        href={`/languages/${item.slug}`}
                        className="group hover:text-accent flex items-center justify-between gap-4 py-3 transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="text-accent/40 w-10 shrink-0 font-serif text-lg"
                          >
                            {item.code}
                          </span>
                          {item.shortTitle}
                        </span>
                        <ArrowRight />
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="border-border mt-7 border-t pt-6">
                  <ContactButton
                    label="Показать телефоны офисов"
                    size="lg"
                    className="w-full"
                    place={`language-aside-${language.slug}`}
                  />
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>

      <Section tone="muted" spacing="tight" className="mt-20">
        <SectionHeading
          eyebrow="Где заниматься"
          title={`Офисы, где есть ${language.title.toLowerCase()}`}
          lead="Позвоните в ближайший офис, чтобы узнать про набор в группы и уровень."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {availableOffices.map((office, index) => (
            <Reveal as="li" key={office.id} delay={(index % 4) * 0.07}>
              <OfficeCard office={office} />
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}
