import Link from 'next/link';
import { programs } from '@/content/programs';
import { ArrowRight } from '@/components/ui/Button';
import { ProgramIcon } from '@/components/ui/ProgramIcon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** Основные направления. Состав полностью управляется файлом content/programs.ts. */
export function Directions() {
  return (
    <Section id="directions" tone="surface">
      <SectionHeading
        eyebrow="Направления"
        title="Чему учим в центрах RandK"
        lead="Программы можно совмещать: например, язык в группе и школьный предмет индивидуально."
      />

      <ul className="mt-12 grid gap-px overflow-hidden md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program, index) => (
          <Reveal as="li" key={program.slug} delay={(index % 3) * 0.08} className="h-full">
            <Link
              href={`/programs/${program.slug}`}
              className="group border-border hover:bg-background relative flex h-full flex-col gap-5 border p-7 transition-colors duration-500 md:p-8"
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
