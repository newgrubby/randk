import { results } from '@/content/home';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Результаты.
 *
 * До подтверждения статистики блок показывает процесс работы с результатом,
 * а не проценты и количество учеников. Структура под достижения
 * (экзамены, поступления, сертификаты) уже готова: как только массив
 * `results.achievements` будет заполнен, соответствующая часть появится.
 */
export function Results() {
  return (
    <Section id="results" tone="deep" spacing="default">
      <SectionHeading eyebrow="Результат" title={results.title} lead={results.lead} tone="dark" />

      <ol className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
        {results.items.map((item, index) => (
          <Reveal as="li" key={item.title} delay={index * 0.08}>
            <div className="h-full border border-white/12 p-7 md:p-8">
              <span className="font-serif text-[2.25rem] leading-none text-white/25">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-serif text-xl text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      {results.achievements.length > 0 ? (
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {results.achievements.map((item) => (
            <li key={item.title}>
              <h3 className="font-serif text-xl text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/65">{item.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 max-w-2xl border-l-2 border-white/20 pl-4 text-sm leading-relaxed text-white/50">
          Экзаменационные результаты, поступления и сертификаты учеников будут опубликованы после
          подтверждения данных центром. Мы не размещаем неподтверждённую статистику.
        </p>
      )}
    </Section>
  );
}
