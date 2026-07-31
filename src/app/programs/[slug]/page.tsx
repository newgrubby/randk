import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { FaqSection } from '@/components/sections/FaqSection';
import { ArrowRight } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';
import { ProgramIcon } from '@/components/ui/ProgramIcon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LeadForm } from '@/components/forms/LeadForm';
import { branches } from '@/content/branches';
import { generalFaq } from '@/content/faq';
import { getProgram, programCategoryLabels, programs } from '@/content/programs';
import type { LessonFormat } from '@/content/types';
import { courseJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

const formatLabels: Record<LessonFormat, string> = {
  group: 'Группа',
  'mini-group': 'Мини-группа',
  individual: 'Индивидуально',
};

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program)
    return buildMetadata({
      title: 'Программа не найдена',
      description: '',
      path: '/programs',
      noIndex: true,
    });

  return buildMetadata({
    title: program.seoTitle,
    ogTitle: program.title,
    description: program.seoDescription,
    path: `/programs/${program.slug}`,
  });
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const availableBranches = branches.filter((branch) =>
    (program.cityAvailability as string[]).includes(branch.slug),
  );
  const otherPrograms = programs.filter((item) => item.slug !== program.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={courseJsonLd({
          name: program.title,
          description: program.seoDescription,
          path: `/programs/${program.slug}`,
        })}
      />

      <PageHero
        eyebrow={programCategoryLabels[program.category]}
        title={program.title}
        lead={program.description}
        breadcrumbs={[
          { name: 'Программы', path: '/programs' },
          { name: program.shortTitle, path: `/programs/${program.slug}` },
        ]}
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
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={0.08}>
              <h2 className="text-h2 mt-12 font-serif">Чему научится ученик</h2>
              <ul className="mt-7 flex flex-col gap-4">
                {program.goals.map((goal) => (
                  <li key={goal} className="border-border flex gap-4 border-b pb-4">
                    <span
                      aria-hidden
                      className="text-accent mt-1 flex size-5 shrink-0 items-center justify-center"
                    >
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

              {/* Длительность и цена показываются только после подтверждения клиентом */}
              <dl className="border-border mt-8 grid gap-6 border-t pt-8 sm:grid-cols-2">
                <div>
                  <dt className="text-eyebrow text-muted font-medium uppercase">Возраст</dt>
                  <dd className="mt-2 text-lg">{program.age}</dd>
                </div>
                <div>
                  <dt className="text-eyebrow text-muted font-medium uppercase">
                    Длительность и стоимость
                  </dt>
                  <dd className="text-muted mt-2 leading-relaxed">
                    {program.duration && program.price
                      ? `${program.duration} · ${program.price}`
                      : 'Зависит от формата и центра — уточним при консультации'}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <aside className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="bg-surface border-border shadow-soft sticky top-28 rounded-[1.5rem] border p-7 md:p-9">
                <h2 className="text-h3 font-serif">Записаться на направление</h2>
                <p className="text-muted mt-2.5 text-sm leading-relaxed">
                  Уточним уровень, подберём группу и предложим удобное расписание.
                </p>
                <div className="mt-7">
                  <LeadForm
                    source="program"
                    compact
                    showAge
                    showProgram={false}
                    defaults={{ program: program.title }}
                    submitLabel="Отправить заявку"
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
          title="Центры с этим направлением"
          lead="Состав групп и расписание отличаются по городам — подскажем, где сейчас идёт набор."
        />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {availableBranches.map((branch, index) => (
            <Reveal as="li" key={branch.slug} delay={index * 0.08}>
              <Link
                href={`/branches/${branch.slug}`}
                className="group bg-surface border-border hover:border-accent flex h-full flex-col justify-between gap-6 rounded-[1.25rem] border p-7 transition-colors duration-400"
              >
                <span className="text-h3 font-serif">{branch.city}</span>
                <span className="text-accent inline-flex items-center gap-2 text-sm font-medium">
                  Подробнее о центре
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section spacing="tight">
        <SectionHeading eyebrow="Смотрите также" title="Другие направления" />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {otherPrograms.map((item, index) => (
            <Reveal as="li" key={item.slug} delay={index * 0.08}>
              <Link
                href={`/programs/${item.slug}`}
                className="group border-border hover:border-accent flex h-full flex-col gap-4 rounded-[1.25rem] border p-7 transition-colors duration-400"
              >
                <ProgramIcon name={item.icon} className="text-accent size-6" />
                <span className="text-h3 font-serif">{item.title}</span>
                <span className="text-muted text-sm">{item.age}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <FaqSection items={generalFaq.slice(0, 4)} title="Вопросы о занятиях" />
    </>
  );
}
