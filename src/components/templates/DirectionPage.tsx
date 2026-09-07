import Link from 'next/link';
import Image from 'next/image';
import { cities, offices } from '@/content/centers';
import type { LessonFormat, Program } from '@/content/types';
import { courseJsonLd } from '@/lib/jsonld';
import { ContactButton } from '@/components/contact/ContactButton';
import { PageHero } from '@/components/layout/PageHero';
import { ArrowRight } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';
import { OfficeCard } from '@/components/ui/OfficeCard';
import { ProgramIcon } from '@/components/ui/ProgramIcon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const formatLabels: Record<LessonFormat, string> = {
  group: 'Группа',
  'mini-group': 'Мини-группа',
  individual: 'Индивидуально',
  corporate: 'Корпоративная группа',
};

/**
 * Единый шаблон страницы образовательного направления.
 *
 * Все семь направлений (/exams, /tutoring, /preschool, /development,
 * /corporate, /speech-therapist, /psychologist) рендерятся этим компонентом.
 * Страница-маршрут только передаёт объект программы — компоненты не
 * копируются, и правка макета применяется сразу ко всем направлениям.
 */
export function DirectionPage({ program }: { program: Program }) {
  const availableOffices = offices.filter((office) => program.availableOffices.includes(office.id));

  return (
    <>
      <JsonLd
        data={courseJsonLd({
          name: program.title,
          description: program.seoDescription,
          path: program.href,
        })}
      />

      <PageHero
        eyebrow="Направление"
        title={program.title}
        lead={program.description}
        breadcrumbs={[
          { name: 'Направления', path: '/programs' },
          { name: program.shortTitle, path: program.href },
        ]}
        aside={
          <ContactButton
            label="Узнать расписание"
            place={`direction-${program.slug}`}
            title={`${program.title} — связаться`}
          />
        }
      />

      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {program.image ? (
              <Reveal>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={program.image.src}
                    alt={program.image.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center"
                  />
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={0.08}>
              <h2 className="text-h2 mt-12 font-serif">Что даёт направление</h2>
              <ul className="mt-7 flex flex-col gap-4">
                {program.goals.map((goal) => (
                  <li key={goal} className="border-border flex gap-4 border-b pb-4">
                    <span aria-hidden className="text-accent mt-1 shrink-0">
                      <ProgramIcon name={program.icon} className="size-4" />
                    </span>
                    <span className="leading-relaxed">{goal}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <h2 className="text-h2 mt-14 font-serif">Форматы занятий</h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {program.formats.map((format) => (
                  <li
                    key={format}
                    className="border-border-strong rounded-pill border px-5 py-2.5 text-sm"
                  >
                    {formatLabels[format]}
                  </li>
                ))}
              </ul>

              {/* Длительность и стоимость показываются только после подтверждения клиентом */}
              <dl className="border-border mt-8 grid gap-6 border-t pt-8 sm:grid-cols-2">
                <div>
                  <dt className="text-eyebrow text-muted font-medium uppercase">Возраст</dt>
                  <dd className="mt-2 text-lg">{program.age}</dd>
                </div>
                <div>
                  <dt className="text-eyebrow text-muted font-medium uppercase">
                    Расписание и стоимость
                  </dt>
                  <dd className="text-muted mt-2 leading-relaxed">
                    {program.duration && program.price
                      ? `${program.duration} · ${program.price}`
                      : 'Зависят от формата и офиса — уточните у администратора'}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <aside className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="bg-surface border-border shadow-soft sticky top-28 rounded-[1.5rem] border p-7 md:p-9">
                <h2 className="text-h3 font-serif">Узнать про набор в группы</h2>
                <p className="text-muted mt-2.5 text-sm leading-relaxed">
                  Позвоните в удобный офис — администратор расскажет о расписании, уровне групп и
                  ближайшем старте.
                </p>
                <div className="mt-7">
                  <ContactButton
                    label="Показать телефоны офисов"
                    size="lg"
                    className="w-full"
                    place={`direction-aside-${program.slug}`}
                  />
                </div>

                <ul className="border-border mt-7 flex flex-col gap-2 border-t pt-6 text-sm">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/centers/${city.slug}`}
                        className="group text-muted hover:text-accent inline-flex items-center gap-2 transition-colors"
                      >
                        {city.name}
                        <ArrowRight />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>

      <Section tone="muted" spacing="tight" className="mt-20">
        <SectionHeading
          eyebrow="Где заниматься"
          title="Офисы с этим направлением"
          lead="Набор в группы идёт в течение года. Позвоните в ближайший офис, чтобы уточнить актуальное расписание."
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
