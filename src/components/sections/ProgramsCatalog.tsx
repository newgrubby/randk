'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { branches } from '@/content/branches';
import { ageGroups, programCategoryLabels, programs } from '@/content/programs';
import type { AgeGroupSlug, LessonFormat, ProgramCategory } from '@/content/types';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { ArrowRight } from '@/components/ui/Button';
import { ProgramIcon } from '@/components/ui/ProgramIcon';
import { Reveal } from '@/components/ui/Reveal';

type AgeFilter = AgeGroupSlug | 'all';
type CategoryFilter = ProgramCategory | 'all';
type CityFilter = string | 'all';

const categories: CategoryFilter[] = [
  'all',
  ...(Object.keys(programCategoryLabels) as ProgramCategory[]),
];

const formatLabels: Record<LessonFormat, string> = {
  group: 'группа',
  'mini-group': 'мини-группа',
  individual: 'индивидуально',
};

/**
 * Каталог направлений с фильтрами.
 *
 * ВАЖНО про рендеринг: начальный фильтр приходит пропом `initialAge`,
 * который страница читает из query на сервере. Раньше здесь стоял
 * `useSearchParams()`, и это ломало SEO: хук переводит поддерево в
 * динамический режим, Next пропускал его пререндер, и в исходном HTML
 * вместо карточек уходила заглушка Suspense — каталог видели только
 * браузеры с выполненным JavaScript.
 *
 * Теперь карточки есть в серверном HTML, а переключение фильтров
 * остаётся чисто клиентским: локальный стейт, без навигации и перезагрузки.
 */
export function ProgramsCatalog({ initialAge = 'all' }: { initialAge?: string }) {
  const [age, setAge] = useState<AgeFilter>(
    ageGroups.some((group) => group.slug === initialAge) ? (initialAge as AgeFilter) : 'all',
  );
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [city, setCity] = useState<CityFilter>('all');

  const filtered = useMemo(
    () =>
      programs.filter((program) => {
        if (age !== 'all' && !program.ageGroups.includes(age)) return false;
        if (category !== 'all' && program.category !== category) return false;
        if (city !== 'all' && !(program.cityAvailability as string[]).includes(city)) return false;
        return true;
      }),
    [age, category, city],
  );

  return (
    <div>
      <div className="border-border flex flex-col gap-6 border-y py-7">
        <FilterRow label="Возраст">
          <FilterChip active={age === 'all'} onClick={() => setAge('all')}>
            Любой
          </FilterChip>
          {ageGroups.map((group) => (
            <FilterChip
              key={group.slug}
              active={age === group.slug}
              onClick={() => setAge(group.slug)}
            >
              {group.label}
            </FilterChip>
          ))}
        </FilterRow>

        <FilterRow label="Тип">
          {categories.map((item) => (
            <FilterChip key={item} active={category === item} onClick={() => setCategory(item)}>
              {item === 'all' ? 'Все' : programCategoryLabels[item]}
            </FilterChip>
          ))}
        </FilterRow>

        <FilterRow label="Город">
          <FilterChip active={city === 'all'} onClick={() => setCity('all')}>
            Все центры
          </FilterChip>
          {branches.map((branch) => (
            <FilterChip
              key={branch.slug}
              active={city === branch.slug}
              onClick={() => setCity(branch.slug)}
            >
              {branch.city}
            </FilterChip>
          ))}
        </FilterRow>
      </div>

      <p aria-live="polite" className="text-muted mt-6 text-sm">
        {filtered.length > 0
          ? `Показано направлений: ${filtered.length}`
          : 'По выбранным условиям направлений нет'}
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((program, index) => (
            <Reveal as="li" key={program.slug} delay={(index % 3) * 0.07}>
              <Link
                href={`/programs/${program.slug}`}
                onClick={() => track('program_select', { program: program.slug })}
                className="group bg-surface border-border hover:shadow-lift flex h-full flex-col overflow-hidden rounded-[1.25rem] border transition-all duration-500 ease-[var(--ease-out-quart)] hover:-translate-y-1"
              >
                {program.image ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={program.image.src}
                      alt={program.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-105"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-7">
                  <div className="text-accent flex items-center gap-3">
                    <ProgramIcon name={program.icon} className="size-5" />
                    <span className="text-eyebrow font-medium uppercase">
                      {programCategoryLabels[program.category]}
                    </span>
                  </div>

                  <h2 className="text-h3 group-hover:text-accent mt-4 font-serif transition-colors duration-300">
                    {program.title}
                  </h2>

                  <p className="text-muted mt-4 line-clamp-3 text-[0.9375rem] leading-relaxed">
                    {program.description}
                  </p>

                  {/* Структурные параметры: возраст, формат, города — считываются с одного взгляда */}
                  <dl className="border-border mt-5 flex flex-col gap-2 border-t pt-5 text-sm">
                    <div className="flex gap-3">
                      <dt className="text-muted w-20 shrink-0">Возраст</dt>
                      <dd>{program.age}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="text-muted w-20 shrink-0">Формат</dt>
                      <dd>{program.formats.map((format) => formatLabels[format]).join(' · ')}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="text-muted w-20 shrink-0">Города</dt>
                      <dd>
                        {program.cityAvailability.length === branches.length
                          ? 'все центры'
                          : program.cityAvailability
                              .map(
                                (slug) =>
                                  branches.find((branch) => branch.slug === slug)?.city ?? slug,
                              )
                              .join(', ')}
                      </dd>
                    </div>
                  </dl>

                  <span className="text-accent mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium">
                    Подробнее
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="border-border mt-8 rounded-[1.25rem] border border-dashed p-10 text-center">
          <p className="text-h3 font-serif">Подберём вариант вручную</p>
          <p className="text-muted mx-auto mt-3 max-w-md text-sm leading-relaxed">
            Сбросьте фильтры или оставьте заявку — администратор предложит подходящее направление и
            центр.
          </p>
          <button
            type="button"
            onClick={() => {
              setAge('all');
              setCategory('all');
              setCity('all');
            }}
            className="link-underline text-accent mt-5 text-sm"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
      <span className="text-eyebrow text-muted w-20 shrink-0 font-medium uppercase">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-pill min-h-9 border px-4 py-2 text-sm transition-all duration-300',
        active
          ? 'border-accent bg-accent text-white'
          : 'border-border text-muted hover:border-accent hover:text-accent',
      )}
    >
      {children}
    </button>
  );
}
