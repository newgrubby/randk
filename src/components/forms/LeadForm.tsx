'use client';

import { useEffect, useId, useState } from 'react';
import { branches } from '@/content/branches';
import { learningGoals } from '@/content/home';
import { programs } from '@/content/programs';
import { track } from '@/lib/analytics';
import { emptyLeadForm, leadSchema, type LeadFormValues, type LeadSource } from '@/lib/lead-schema';
import { captureUtm, readUtm } from '@/lib/utm';
import { formatPhoneInput } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useCity } from '@/components/layout/CityProvider';
import { ConsentField, FieldWrapper, Honeypot, SelectField, TextField } from './fields';

type Status = 'idle' | 'loading' | 'success' | 'error';

type LeadFormProps = {
  source: LeadSource;
  /** Предзаполненные значения — напр. город на странице филиала. */
  defaults?: Partial<LeadFormValues>;
  /** Показывать ли выбор города. */
  showCity?: boolean;
  /** Показывать ли выбор направления. */
  showProgram?: boolean;
  /** Показывать ли поле возраста. */
  showAge?: boolean;
  /** Показывать ли свободное сообщение. */
  showMessage?: boolean;
  submitLabel?: string;
  /** Компактный режим: одна колонка. */
  compact?: boolean;
};

export function LeadForm({
  source,
  defaults,
  showCity = true,
  showProgram = true,
  showAge = true,
  showMessage = false,
  submitLabel = 'Отправить заявку',
  compact = false,
}: LeadFormProps) {
  const formId = useId();
  const { branch } = useCity();

  /**
   * Приоритет: явный `defaults` (страница филиала знает свой город точно) →
   * город, выбранный в шапке → пусто. Выбор в шапке подставляется через
   * useEffect, а не в начальном состоянии: он читается из localStorage
   * уже после гидратации.
   */
  const [values, setValues] = useState<LeadFormValues>({ ...emptyLeadForm, ...defaults });
  const [isCityTouched, setIsCityTouched] = useState(false);

  useEffect(() => {
    if (isCityTouched || defaults?.city || !branch) return;
    setValues((previous) => (previous.city ? previous : { ...previous, city: branch.city }));
  }, [branch, defaults?.city, isCityTouched]);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormValues, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    captureUtm();
  }, []);

  function setField<K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'loading') return;

    setServerError(null);

    const candidate = {
      ...values,
      source,
      consent: values.consent,
      pageUrl: typeof window === 'undefined' ? undefined : window.location.href,
      utm: readUtm(),
    };

    const parsed = leadSchema.safeParse(candidate);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LeadFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !(key in fieldErrors)) {
          fieldErrors[key as keyof LeadFormValues] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setStatus('idle');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const message =
          body && typeof body === 'object' && 'message' in body
            ? String((body as { message: unknown }).message)
            : 'Не удалось отправить заявку. Попробуйте ещё раз.';
        setServerError(message);
        setStatus('error');
        return;
      }

      track('lead_submit', { source });
      setStatus('success');
      setValues({ ...emptyLeadForm, ...defaults });
    } catch {
      setServerError('Проблема с соединением. Проверьте интернет и попробуйте ещё раз.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-start gap-4 py-2">
        <span className="bg-accent-soft text-accent flex size-12 items-center justify-center rounded-full">
          <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-6">
            <path
              d="m5 12.5 4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <p className="text-h3 font-serif">Заявка отправлена</p>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Администратор свяжется с вами, чтобы уточнить детали и подобрать удобное время.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="link-underline text-accent text-sm"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  const gridClass = compact ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-2';

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-5">
      <Honeypot value={values.company} onChange={(value) => setField('company', value)} />

      <div className={gridClass}>
        <FieldWrapper label="Имя" htmlFor={`${formId}-name`} error={errors.name}>
          <TextField
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Как к вам обращаться"
            value={values.name}
            error={Boolean(errors.name)}
            onChange={(event) => setField('name', event.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper label="Телефон" htmlFor={`${formId}-phone`} error={errors.phone}>
          <TextField
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={values.phone}
            error={Boolean(errors.phone)}
            onFocus={() => {
              if (!values.phone) setField('phone', '+7 ');
            }}
            onChange={(event) => setField('phone', formatPhoneInput(event.target.value))}
          />
        </FieldWrapper>

        {showCity ? (
          <FieldWrapper label="Город" htmlFor={`${formId}-city`}>
            <SelectField
              id={`${formId}-city`}
              name="city"
              value={values.city}
              onChange={(event) => {
                setIsCityTouched(true);
                setField('city', event.target.value);
              }}
            >
              <option value="">Выберите центр</option>
              {branches.map((branch) => (
                <option key={branch.slug} value={branch.city}>
                  {branch.city}
                </option>
              ))}
            </SelectField>
          </FieldWrapper>
        ) : null}

        {showAge ? (
          <FieldWrapper
            label="Возраст ученика"
            htmlFor={`${formId}-age`}
            error={errors.age}
            hint="Необязательно"
          >
            <TextField
              id={`${formId}-age`}
              name="age"
              type="text"
              inputMode="numeric"
              placeholder="Например, 9 лет"
              value={values.age}
              onChange={(event) => setField('age', event.target.value)}
            />
          </FieldWrapper>
        ) : null}

        {showProgram ? (
          <FieldWrapper
            label="Направление"
            htmlFor={`${formId}-program`}
            className={compact || !showAge ? undefined : 'sm:col-span-2'}
          >
            <SelectField
              id={`${formId}-program`}
              name="program"
              value={values.program}
              onChange={(event) => setField('program', event.target.value)}
            >
              <option value="">Помогите подобрать</option>
              {programs.map((program) => (
                <option key={program.slug} value={program.title}>
                  {program.title}
                </option>
              ))}
              {learningGoals
                .filter((goal) => goal.value === 'undecided')
                .map((goal) => (
                  <option key={goal.value} value={goal.label}>
                    {goal.label}
                  </option>
                ))}
            </SelectField>
          </FieldWrapper>
        ) : null}

        {showMessage ? (
          <FieldWrapper
            label="Комментарий"
            htmlFor={`${formId}-message`}
            error={errors.message}
            className={compact ? undefined : 'sm:col-span-2'}
            hint="Необязательно"
          >
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={3}
              placeholder="Что важно учесть при подборе программы"
              value={values.message}
              onChange={(event) => setField('message', event.target.value)}
              className="border-border bg-surface text-text placeholder:text-muted/60 focus:border-accent w-full resize-y rounded-xl border px-4 py-3 text-[0.9375rem] transition-colors duration-250 focus:outline-none"
            />
          </FieldWrapper>
        ) : null}
      </div>

      <ConsentField
        id={`${formId}-consent`}
        checked={values.consent}
        onChange={(value) => setField('consent', value)}
        error={errors.consent}
      />

      {status === 'error' && serverError ? (
        <p role="alert" className="bg-accent-soft text-accent rounded-xl px-4 py-3 text-sm">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' ? (
          <>
            <span
              aria-hidden
              className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
            />
            Отправляем…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
