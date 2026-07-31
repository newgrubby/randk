import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LeadForm } from '@/components/forms/LeadForm';
import { PageHero } from '@/components/layout/PageHero';
import { BranchActions } from '@/components/ui/BranchActions';
import { BranchMap } from '@/components/ui/BranchMap';
import { ArrowRight } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';
import { PhoneLink } from '@/components/ui/PhoneLink';
import { ProgramIcon } from '@/components/ui/ProgramIcon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { branches, getBranch } from '@/content/branches';
import { getProgram } from '@/content/programs';
import { branchJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return branches.map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = getBranch(slug);
  if (!branch) {
    return buildMetadata({
      title: 'Центр не найден',
      description: '',
      path: '/branches',
      noIndex: true,
    });
  }

  return buildMetadata({
    title: branch.seoTitle,
    ogTitle: `RandK Center ${branch.city}`,
    description: branch.seoDescription,
    path: `/branches/${branch.slug}`,
  });
}

export default async function BranchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = getBranch(slug);
  if (!branch) notFound();

  const localBusiness = branchJsonLd(branch.slug);
  const branchPrograms = branch.availablePrograms
    .map((programSlug) => getProgram(programSlug))
    .filter((program) => program !== undefined);

  return (
    <>
      {localBusiness ? <JsonLd data={localBusiness} /> : null}

      <PageHero
        eyebrow="Центр сети"
        title={`RandK Center ${branch.cityLocative}`}
        lead={branch.intro}
        breadcrumbs={[
          { name: 'Центры', path: '/branches' },
          { name: branch.city, path: `/branches/${branch.slug}` },
        ]}
        aside={<BranchActions branch={branch} />}
      />

      {/* Фотографии центра */}
      <div className="container-page">
        <Reveal>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] md:aspect-[21/9]">
            <Image
              src={branch.photos[0]?.src ?? '/images/hero.svg'}
              alt={branch.photos[0]?.alt ?? branch.displayName}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        {branch.photos.length > 1 ? (
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {branch.photos.slice(1).map((photo) => (
              <li
                key={photo.src}
                className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem]"
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="33vw" className="object-cover" />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/*
        Особенности центра выводятся только когда их подтвердил клиент.
        Пустой массив = секции нет: лучше короткая страница, чем убедительные
        утверждения, за которыми ничего не стоит.
      */}
      {branch.highlights.length > 0 ? (
        <Section spacing="tight">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Особенности" title="Чем полезен этот центр" />
            </div>
            <ul className="lg:col-span-7">
              {branch.highlights.map((item, index) => (
                <Reveal as="li" key={item} delay={index * 0.08}>
                  <div className="border-border flex gap-6 border-b py-6">
                    <span className="text-accent font-serif text-2xl leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-lead">{item}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {/* Направления филиала */}
      <Section tone="surface" spacing="tight">
        <SectionHeading
          eyebrow="Программы"
          title={`Направления ${branch.cityLocative}`}
          lead="Набор в группы идёт в течение года. Если нужного направления нет в списке — подскажем ближайший центр."
          aside={
            <Link
              href="/programs"
              className="group text-accent inline-flex items-center gap-2 text-sm font-medium"
            >
              Все программы
              <ArrowRight />
            </Link>
          }
        />

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {branchPrograms.map((program, index) => (
            <Reveal as="li" key={program.slug} delay={(index % 3) * 0.07}>
              <Link
                href={`/programs/${program.slug}`}
                className="group border-border hover:border-accent bg-background flex h-full flex-col gap-4 rounded-[1.25rem] border p-7 transition-colors duration-400"
              >
                <ProgramIcon name={program.icon} className="text-accent size-6" />
                <span className="text-h3 font-serif">{program.title}</span>
                <span className="text-muted text-sm">{program.age}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/*
        Блок преподавателей здесь убран намеренно: до подтверждения состава
        он показывал одни и те же четыре специализации на всех трёх страницах.
        Ссылка ведёт на общий раздел; когда появятся реальные педагоги
        по городам, блок вернётся с настоящими различиями.
      */}

      {/* Контакты и карта */}
      <Section id="contacts" tone="muted" spacing="tight">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Контакты" title={`Как связаться и добраться`} />

            <dl className="mt-10 flex flex-col gap-7">
              <div>
                <dt className="text-eyebrow text-muted font-medium uppercase">Адрес</dt>
                <dd className="mt-2 text-lg">
                  {branch.address ? (
                    `${branch.city}, ${branch.address}`
                  ) : (
                    <span className="text-muted text-base">
                      Точный адрес уточняется — оставьте заявку, администратор подскажет, как
                      добраться
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-eyebrow text-muted font-medium uppercase">Телефон</dt>
                <dd className="mt-2">
                  <PhoneLink phone={branch.phone} place={`branch-${branch.slug}`} />
                </dd>
              </div>

              <div>
                <dt className="text-eyebrow text-muted font-medium uppercase">График работы</dt>
                <dd className="text-muted mt-2 flex flex-col gap-1">
                  {branch.schedule.length > 0 ? (
                    branch.schedule.map((line) => <span key={line}>{line}</span>)
                  ) : (
                    <span>Расписание работы центра уточняется</span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-eyebrow text-muted font-medium uppercase">Сообщества</dt>
                <dd className="mt-3">
                  <SocialLinks vkUrl={branch.vkUrl} maxUrl={branch.maxUrl} />
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <BranchMap branch={branch} />
          </div>
        </div>
      </Section>

      {/* Форма записи */}
      <Section spacing="tight">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Запись"
              title={`Записаться ${branch.cityLocative}`}
              lead="Оставьте контакты — администратор свяжется, уточнит уровень и предложит удобное время."
            />
          </div>
          <div className="lg:col-span-7">
            <div className="bg-surface border-border shadow-soft rounded-[1.5rem] border p-7 md:p-10">
              <LeadForm
                source="branch"
                showCity={false}
                showMessage
                defaults={{ city: branch.city }}
              />
            </div>
          </div>
        </div>
      </Section>

      {/*
        Общий FAQ и блок преподавателей на страницу города не копируются:
        одинаковый текст на трёх URL — признак SEO-шаблона, а не полезной
        страницы. Вместо копий — ссылки на единые разделы.
      */}
      <Section spacing="tight">
        <ul className="border-border flex flex-col gap-px border-t pt-8 sm:flex-row sm:gap-10">
          {[
            { label: 'Преподаватели сети', href: '/teachers' },
            { label: 'Частые вопросы', href: '/#faq' },
            { label: 'Другие центры', href: '/branches' },
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
