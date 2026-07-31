'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { branches } from '@/content/branches';
import { ageGroups } from '@/content/programs';
import { learningGoals } from '@/content/home';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { LeadForm } from './LeadForm';

/**
 * Подбор программы в 4 шага.
 *
 * Сознательно не является «умным» подборщиком: цель — снизить порог
 * первого касания и передать администратору контекст (город, возраст, цель).
 * Итог уходит обычной заявкой через тот же /api/lead.
 */

const steps = [
  { id: 'city', label: 'Город' },
  { id: 'age', label: 'Возраст' },
  { id: 'goal', label: 'Цель' },
  { id: 'contacts', label: 'Контакты' },
] as const;

type Answers = { city: string; age: string; goal: string };

export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ city: '', age: '', goal: '' });
  const [started, setStarted] = useState(false);
  const reduceMotion = useReducedMotion();

  function choose(key: keyof Answers, value: string) {
    if (!started) {
      track('quiz_start');
      setStarted(true);
    }
    setAnswers((previous) => ({ ...previous, [key]: value }));
    setStep((previous) => Math.min(previous + 1, steps.length - 1));
    if (key === 'goal') track('quiz_complete', { ...answers, goal: value });
  }

  const progress = ((step + 1) / steps.length) * 100;
  const currentStep = steps[step];

  return (
    <div className="bg-surface shadow-soft overflow-hidden rounded-[1.75rem]">
      {/* Прогресс */}
      <div className="border-border flex flex-col gap-4 border-b px-6 py-5 sm:px-9 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-eyebrow text-muted font-medium uppercase">
            Шаг {step + 1} из {steps.length} · {currentStep?.label}
          </p>
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((previous) => Math.max(previous - 1, 0))}
              className="text-muted hover:text-accent link-underline text-sm transition-colors"
            >
              Назад
            </button>
          ) : null}
        </div>

        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          aria-label="Прогресс подбора программы"
          className="bg-surface-muted h-1 w-full overflow-hidden rounded-full"
        >
          <motion.div
            className="bg-accent h-full rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>
      </div>

      <div className="px-6 py-8 sm:px-9 sm:py-10">
        {/*
          Шаг перерисовывается по key: новый key = размонтирование старого
          и проигрывание initial → animate. Сознательно без AnimatePresence:
          с mode="wait" быстрые последовательные клики могли «потерять»
          входящий шаг, и прогресс уходил вперёд, а вопрос оставался прежним.
        */}
        <motion.div
          key={currentStep?.id}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        >
          {currentStep?.id === 'city' ? (
            <QuizStep
              title="В каком городе удобно заниматься?"
              options={branches.map((branch) => ({ value: branch.city, label: branch.city }))}
              extra={{ value: 'Пока не выбрал', label: 'Пока не выбрал' }}
              selected={answers.city}
              onSelect={(value) => choose('city', value)}
            />
          ) : null}

          {currentStep?.id === 'age' ? (
            <QuizStep
              title="Сколько лет ученику?"
              options={ageGroups.map((group) => ({ value: group.label, label: group.label }))}
              selected={answers.age}
              onSelect={(value) => choose('age', value)}
            />
          ) : null}

          {currentStep?.id === 'goal' ? (
            <QuizStep
              title="Какая цель занятий?"
              options={learningGoals.map((goal) => ({ value: goal.label, label: goal.label }))}
              selected={answers.goal}
              onSelect={(value) => choose('goal', value)}
              columns={2}
            />
          ) : null}

          {currentStep?.id === 'contacts' ? (
            <div>
              <h3 className="text-h3 font-serif">Куда отправить подобранные варианты?</h3>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                {[answers.city, answers.age, answers.goal].filter(Boolean).join(' · ') ||
                  'Мы уточним детали при звонке.'}
              </p>
              <div className="mt-7">
                <LeadForm
                  source="quiz"
                  compact
                  showCity={false}
                  showProgram={false}
                  showAge={false}
                  submitLabel="Получить подбор"
                  defaults={{
                    city: answers.city,
                    age: answers.age,
                    goal: answers.goal,
                    program: answers.goal,
                  }}
                />
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

function QuizStep({
  title,
  options,
  extra,
  selected,
  onSelect,
  columns = 3,
}: {
  title: string;
  options: { value: string; label: string }[];
  extra?: { value: string; label: string };
  selected: string;
  onSelect: (value: string) => void;
  columns?: 2 | 3;
}) {
  const all = extra ? [...options, extra] : options;

  return (
    <div>
      <h3 className="text-h3 font-serif">{title}</h3>
      <div
        className={cn(
          'mt-7 grid gap-3',
          columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {all.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            aria-pressed={selected === option.value}
            className={cn(
              'group flex min-h-14 items-center justify-between gap-3 rounded-xl border px-5 py-4 text-left text-[0.9375rem] transition-all duration-300 ease-[var(--ease-out-quart)]',
              selected === option.value
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border hover:border-accent hover:-translate-y-0.5',
            )}
          >
            {option.label}
            <span
              aria-hidden
              className={cn(
                'size-2 shrink-0 rounded-full transition-colors duration-300',
                selected === option.value ? 'bg-accent' : 'bg-border-strong group-hover:bg-accent',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
