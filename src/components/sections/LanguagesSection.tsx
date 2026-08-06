import Link from 'next/link';
import { activeLanguages } from '@/content/languages';
import { ArrowRight } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Блок иностранных языков на главной.
 *
 * Языки показаны как равноправный ряд, а не как «английский и все
 * остальные»: в первой версии английский занимал карточку наравне с целым
 * направлением, из-за чего сайт читался как школа одного языка.
 *
 * Код языка (EN, DE, 中文) работает типографским акцентом — это дешевле и
 * честнее, чем флаги: флаг обозначает страну, а не язык.
 */
export function LanguagesSection() {
  return (
    <Section id="languages" tone="surface">
      <SectionHeading
        eyebrow="Иностранные языки"
        title="Шесть языков в одном центре"
        lead="Программа собирается под язык и уровень ученика. Занятия идут в группах, мини-группах и индивидуально."
        aside={
          <Link
            href="/languages"
            className="group text-accent inline-flex items-center gap-2 text-sm font-medium"
          >
            Все языки
            <ArrowRight />
          </Link>
        }
      />

      <ul className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {activeLanguages.map((language, index) => (
          <Reveal as="li" key={language.slug} delay={(index % 3) * 0.07} className="h-full">
            <Link
              href={`/languages/${language.slug}`}
              className="group border-border hover:bg-background relative flex h-full flex-col gap-4 border p-7 transition-colors duration-500 md:p-8"
            >
              <span
                aria-hidden
                className="text-accent/25 group-hover:text-accent font-serif text-4xl leading-none transition-colors duration-500"
              >
                {language.code}
              </span>

              <h3 className="text-h3 group-hover:text-accent font-serif transition-colors duration-300">
                {language.title}
              </h3>

              <p className="text-muted line-clamp-3 text-[0.9375rem] leading-relaxed">
                {language.description}
              </p>

              <span className="text-accent mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium">
                Подробнее
                <ArrowRight />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
