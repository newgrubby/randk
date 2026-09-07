import Image from 'next/image';
import Link from 'next/link';
import { ageGroups } from '@/content/programs';
import { ArrowRight } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** Программы по возрасту — вход в каталог для тех, кто ещё не выбрал направление. */
export function AgeGroups() {
  return (
    <Section id="ages" spacing="tight">
      <SectionHeading
        eyebrow="С чего начать"
        title="Программы по возрасту"
        lead="Первый ориентир — возраст ученика. Дальше подберём направление и формат под конкретную цель."
        aside={
          <Link
            href="/programs"
            className="group text-accent inline-flex min-h-11 items-center gap-2 text-sm font-medium"
          >
            Все программы
            <ArrowRight />
          </Link>
        }
      />

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ageGroups.map((group, index) => (
          <Reveal as="li" key={group.slug} delay={index * 0.08}>
            <Link
              href={`/programs?age=${group.slug}`}
              className="group bg-surface border-border hover:shadow-lift relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border transition-all duration-500 ease-[var(--ease-out-quart)] hover:-translate-y-1"
            >
              <div className="p-6 pb-4">
                <p className="text-h3 text-accent font-serif">{group.label}</p>
                <p className="text-muted mt-2 text-sm leading-relaxed">{group.caption}</p>
              </div>

              <div className="relative mt-auto aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={group.image.src}
                  alt={group.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="bg-surface text-accent absolute bottom-4 left-4 flex size-10 items-center justify-center rounded-full transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
                >
                  <ArrowRight className="group-hover:translate-x-0" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
