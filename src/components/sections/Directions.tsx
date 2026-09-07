import Link from 'next/link';
import { navigationPrograms } from '@/content/programs';
import { ArrowRight } from '@/components/ui/Button';
import { ProgramIcon } from '@/components/ui/ProgramIcon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Основные образовательные направления (кроме языков — у них свой блок).
 * Состав управляется флагами в content/programs.ts.
 */
export function Directions() {
  return (
    <Section id="directions">
      <SectionHeading
        eyebrow="Направления"
        title="Чему учим, кроме языков"
        lead="Направления можно совмещать: например, язык в группе и школьный предмет индивидуально."
        aside={
          <Link
            href="/programs"
            className="group text-accent inline-flex min-h-11 items-center gap-2 text-sm font-medium"
          >
            Все направления
            <ArrowRight />
          </Link>
        }
      />

      <ul className="mt-12 grid gap-px md:grid-cols-2 lg:grid-cols-3">
        {navigationPrograms.map((program, index) => (
          <Reveal as="li" key={program.slug} delay={(index % 3) * 0.08} className="h-full">
            <Link
              href={program.href}
              className="group border-border hover:bg-surface relative flex h-full flex-col gap-5 border p-7 transition-colors duration-500 md:p-8"
            >
              <span className="border-border-strong text-accent group-hover:border-accent group-hover:bg-accent flex size-12 items-center justify-center rounded-full border transition-all duration-500 ease-[var(--ease-out-quart)] group-hover:text-white">
                <ProgramIcon name={program.icon} />
              </span>

              <div>
                <h3 className="text-h3 group-hover:text-accent font-serif transition-colors duration-300">
                  {program.title}
                </h3>
                <p className="text-muted mt-1.5 text-sm">{program.age}</p>
              </div>

              <p className="text-muted line-clamp-3 text-[0.9375rem] leading-relaxed">
                {program.description}
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
