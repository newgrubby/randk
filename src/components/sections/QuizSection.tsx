import { Quiz } from '@/components/forms/Quiz';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/SectionHeading';

export function QuizSection() {
  return (
    <Section id="quiz" tone="muted">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow className="text-muted">Подбор программы</Eyebrow>
            <h2 className="text-h2 mt-4 font-serif">
              Четыре вопроса — <span className="text-accent italic">и мы поймём задачу</span>
            </h2>
            <p className="text-lead text-muted mt-6">
              Это не тест и не автоматический алгоритм. Ответы помогают администратору сразу
              предложить подходящее направление, формат и центр — без лишних уточняющих звонков.
            </p>

            <ul className="text-muted mt-8 flex flex-col gap-3 text-sm">
              {['Город', 'Возраст ученика', 'Цель занятий', 'Контакты для ответа'].map(
                (item, index) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="border-border-strong text-muted flex size-6 items-center justify-center rounded-full border text-[0.6875rem]">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.12}>
            <Quiz />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
