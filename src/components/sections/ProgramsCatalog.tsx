'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { cities } from '@/content/centers';
import { activeLanguages } from '@/content/languages';
import { activePrograms, ageGroups } from '@/content/programs';
import type { AgeGroupSlug } from '@/content/types';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { ArrowRight } from '@/components/ui/Button';
import { ProgramIcon } from '@/components/ui/ProgramIcon';
import { Reveal } from '@/components/ui/Reveal';

type AgeFilter = AgeGroupSlug | 'all';
type KindFilter = 'all' | 'languages' | 'programs';
type CityFilter = string | 'all';

/**
 * Единый каталог: языки и образовательные направления в одном списке.
 *
 * РЕНДЕРИНГ: компонент клиентский, но React рендерит его и на сервере,
 * поэтому все карточки попадают в исходный HTML — это важно и для
 * поисковых роботов, и для доступности.
 *
 * Начальный фильтр по возрасту читается из `?age=` в useEffect, а не на
 * сервере: сайт собирается статически, и серверных query-параметров у него
 * нет. До гидратации виден полный список — это корректное состояние,
 * а не «мигание пустотой».
 */
export function ProgramsCatalog() {
  const [age, setAge] = useState<AgeFilter>('all');
  const [kind, setKind] = useState<KindFilter>('all');
  const [city, setCity] = useState<CityFilter>('all');

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('age');
    if (requested && ageGroups.some((group) => group.slug === requested)) {
      setAge(requested as AgeFilter);
    }
  }, []);

  const items = useMemo(() => {
    const languageItems = activeLanguages.map((language) => ({
      key: `lang-${language.slug}`,
      href: `/languages/${language.slug}`,
      kind: 'languages' as const,
      badge: language.code,
      icon: 'globe' as const,
      title: language.title,
      description: language.description,
      age: 'Дети, подростки и взрослые',
      ageGroups: language.ageGroups,
      cities: language.availableCities as string[],
      category: 'Иностранный язык',
    }));

    const programItems = activePrograms.map((program) => ({
      key: `prog-${program.slug}`,
      href: program.href,
      kind: 'programs' as const,
      badge: null,
      icon: program.icon,
      title: program.title,
      description: program.description,
      age: program.age,
      ageGroups: program.ageGroups,
      cities: program.availableCities as string[],
      category: 'Направление',
    }));

    return [...languageItems, ...programItems].filter((item) => {
      if (kind !== 'all' && item.kind !== kind) return false;
      if (age !== 'all' && !(item.ageGroups as string[]).includes(age)) return false;
      if (city !== 'all' && !item.cities.includes(city)) return false;
      return true;
    });
  }, [age, kind, city]);

  return (
    <div>
      <div className="border-border flex flex-col gap-6 border-y py-7">
        <FilterRow label="Раздел">
          <FilterChip active={kind === 'all'} onClick={() => setKind('all')}>
            Всё
          </FilterChip>
          <FilterChip active={kind === 'languages'} onClick={() => setKind('languages')}>
            Языки
          </FilterChip>
          <FilterChip active={kind === 'programs'} onClick={() => setKind('programs')}>
            Направления
          </FilterChip>
        </FilterRow>

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

        <FilterRow label="Город">
          <FilterChip active={city === 'all'} onClick={() => setCity('all')}>
            Все города
          </FilterChip>
          {cities.map((item) => (
            <FilterChip
              key={item.slug}
              active={city === item.slug}
              onClick={() => setCity(item.slug)}
            >
              {item.name}
            </FilterChip>
          ))}
        </FilterRow>
      </div>

      <p aria-live="polite" className="text-muted mt-6 text-sm">
        {items.length > 0 ? `Показано: ${items.length}` : 'По выбранным условиям ничего нет'}
      </p>

      {items.length > 0 ? (
        <ul className="mt-8 grid gap-px md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal as="li" key={item.key} delay={(index % 3) * 0.06} className="h-full">
              <Link
                href={item.href}
                onClick={() =>
                  track(item.kind === 'languages' ? 'language_select' : 'program_select', {
                    href: item.href,
                  })
                }
                className="group border-border hover:bg-surface flex h-full flex-col gap-4 border p-7 transition-colors duration-500"
              >
                <div className="text-accent flex items-center justify-between gap-3">
                  <ProgramIcon name={item.icon} className="size-5" />
                  {item.badge ? (
                    <span className="font-serif text-2xl leading-none opacity-30">
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                <span className="text-eyebrow text-muted font-medium uppercase">
                  {item.category}
                </span>

                <h2 className="text-h3 group-hover:text-accent font-serif transition-colors duration-300">
                  {item.title}
                </h2>

                <p className="text-muted line-clamp-3 text-[0.9375rem] leading-relaxed">
                  {item.description}
                </p>

                <dl className="border-border mt-2 flex flex-col gap-1.5 border-t pt-4 text-sm">
                  <div className="flex gap-3">
                    <dt className="text-muted w-16 shrink-0">Возраст</dt>
                    <dd>{item.age}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="text-muted w-16 shrink-0">Города</dt>
                    <dd>
                      {item.cities.length === cities.length
                        ? 'все города'
                        : item.cities
                            .map((slug) => cities.find((c) => c.slug === slug)?.name ?? slug)
                            .join(', ')}
                    </dd>
                  </div>
                </dl>

                <span className="text-accent mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium">
                  Подробнее
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="border-border mt-8 rounded-[1.25rem] border border-dashed p-10 text-center">
          <p className="text-h3 font-serif">Подберём вариант вручную</p>
          <p className="text-muted mx-auto mt-3 max-w-md text-sm leading-relaxed">
            Сбросьте фильтры или позвоните в ближайший офис — администратор подскажет подходящее
            направление.
          </p>
          <button
            type="button"
            onClick={() => {
              setAge('all');
              setKind('all');
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
