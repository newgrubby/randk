import Link from 'next/link';
import { activeLanguages } from '@/content/languages';
import { PageHero } from '@/components/layout/PageHero';
import { FinalCta } from '@/components/sections/FinalCta';
import { OfficesGrid } from '@/components/sections/OfficesGrid';
import { ArrowRight } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Иностранные языки — курсы для детей и взрослых',
  description:
    'Курсы иностранных языков в центрах RandK: английский, немецкий, французский, испанский, итальянский и китайский. Группы, мини-группы и индивидуальные занятия.',
  path: '/languages',
});

export default function LanguagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Каталог"
        title="Иностранные языки"
        lead="Шесть языков для детей, подростков и взрослых. Программа собирается под язык, уровень и цель ученика."
        breadcrumbs={[{ name: 'Языки', path: '/languages' }]}
      />

      <div className="container-page pb-20 md:pb-28">
        <ul className="border-border grid gap-px border-t md:grid-cols-2 lg:grid-cols-3">
          {activeLanguages.map((language, index) => (
            <Reveal as="li" key={language.slug} delay={(index % 3) * 0.07} className="h-full">
              <Link
                href={`/languages/${language.slug}`}
                className="group border-border hover:bg-surface flex h-full flex-col gap-5 border-r border-b p-8 transition-colors duration-500"
              >
                <span
                  aria-hidden
                  className="text-accent/25 group-hover:text-accent font-serif text-5xl leading-none transition-colors duration-500"
                >
                  {language.code}
                </span>

                <h2 className="text-h3 group-hover:text-accent font-serif transition-colors duration-300">
                  {language.title}
                </h2>

                <p className="text-muted line-clamp-4 text-[0.9375rem] leading-relaxed">
                  {language.description}
                </p>

                <span className="text-accent mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium">
                  Подробнее
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <p className="text-muted border-border mt-10 max-w-2xl border-l-2 pl-4 text-sm leading-relaxed">
          Ищете язык, которого нет в списке? Позвоните в ближайший офис — возможно, направление
          открывается по набору группы.
        </p>
      </div>

      <OfficesGrid
        title="Где идут языковые занятия"
        lead="Языковые группы работают во всех офисах сети. Уточните расписание у администратора."
      />
      <FinalCta />
    </>
  );
}
