import Image from 'next/image';
import type { Teacher } from '@/content/types';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Блок преподавателей.
 *
 * Пока клиент не передал данные, карточки показывают только специализацию.
 * Вымышленные имена, фотографии и сертификаты не используются —
 * вместо портрета выводится нейтральный графический знак.
 */
export function Teachers({
  items,
  title = 'Кто ведёт занятия',
  lead = 'Состав преподавателей отличается по центрам и направлениям. Мы подбираем педагога под возраст и задачу ученика.',
  eyebrow = 'Команда',
  aside,
}: {
  items: Teacher[];
  title?: string;
  lead?: string;
  eyebrow?: string;
  aside?: React.ReactNode;
}) {
  if (items.length === 0) return null;

  const hasRealData = items.some((teacher) => teacher.confirmed && teacher.name);

  return (
    <Section id="teachers" tone="surface">
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} aside={aside} />

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((teacher, index) => (
          <Reveal as="li" key={teacher.id} delay={(index % 4) * 0.07}>
            <article className="border-border bg-background flex h-full flex-col overflow-hidden rounded-[1.25rem] border">
              <div className="bg-surface-muted relative aspect-[4/5] w-full overflow-hidden">
                {teacher.photo ? (
                  <Image
                    src={teacher.photo.src}
                    alt={teacher.photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <PortraitMark />
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                {teacher.name ? (
                  <h3 className="text-h3 font-serif">{teacher.name}</h3>
                ) : (
                  <h3 className="font-serif text-lg">{teacher.role}</h3>
                )}

                {teacher.name ? <p className="text-muted mt-1.5 text-sm">{teacher.role}</p> : null}

                <ul className="mt-4 flex flex-wrap gap-2">
                  {teacher.focus.map((item) => (
                    <li
                      key={item}
                      className="border-border text-muted rounded-full border px-3 py-1 text-xs"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      {!hasRealData ? (
        <p className="text-muted border-border mt-8 max-w-2xl border-l-2 pl-4 text-sm leading-relaxed">
          Карточки преподавателей заполняются: имена, фотографии и квалификация будут добавлены
          после подтверждения материалов центром.
        </p>
      ) : null}
    </Section>
  );
}

/** Нейтральный графический знак вместо портрета. */
function PortraitMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 250"
      className="text-border-strong absolute inset-0 size-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="200" height="250" fill="currentColor" opacity="0.18" />
      <path d="M40 250 V150 A60 60 0 0 1 160 150 V250 Z" fill="currentColor" opacity="0.3" />
      <circle cx="100" cy="92" r="34" fill="currentColor" opacity="0.38" />
      <path
        d="M100 58 A34 34 0 0 1 134 92"
        fill="none"
        stroke="#ad1f2b"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
