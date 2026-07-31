import Image from 'next/image';
import Link from 'next/link';
import { branches } from '@/content/branches';
import { ArrowRight } from '@/components/ui/Button';
import { BranchActions } from '@/components/ui/BranchActions';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Филиалы.
 * Адрес и телефон выводятся только при `isConfirmed`; иначе показывается
 * нейтральная формулировка вместо выдуманных данных.
 */
export function BranchesGrid({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <Section id="branches" tone="muted">
      {withHeading ? (
        <SectionHeading
          eyebrow="География"
          title="Центры сети"
          lead="Занятия проходят очно. Выберите ближайший центр — состав направлений указан на его странице."
          aside={
            <Link
              href="/branches"
              className="group text-accent inline-flex items-center gap-2 text-sm font-medium"
            >
              Все центры
              <ArrowRight />
            </Link>
          }
        />
      ) : null}

      <ul className={`grid gap-5 md:grid-cols-3 ${withHeading ? 'mt-12' : ''}`}>
        {branches.map((branch, index) => (
          <Reveal as="li" key={branch.slug} delay={index * 0.08}>
            <article className="bg-surface border-border flex h-full flex-col overflow-hidden rounded-[1.25rem] border">
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <Image
                  src={branch.photos[0]?.src ?? '/images/hero.svg'}
                  alt={branch.photos[0]?.alt ?? branch.displayName}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-h3 font-serif">{branch.city}</h3>

                <dl className="text-muted mt-4 flex flex-col gap-2 text-sm">
                  <div className="flex gap-2">
                    <dt className="sr-only">Адрес</dt>
                    <dd>{branch.address ?? 'Адрес уточняется'}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="sr-only">График работы</dt>
                    <dd>
                      {branch.schedule.length > 0 ? branch.schedule[0] : 'График работы уточняется'}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-1 flex-col justify-end gap-4">
                  <BranchActions branch={branch} compact />
                  <Link
                    href={`/branches/${branch.slug}`}
                    className="group text-accent inline-flex items-center gap-2 text-sm font-medium"
                  >
                    Подробнее о центре
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
