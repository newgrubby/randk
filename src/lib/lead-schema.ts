import { z } from 'zod';

/**
 * Единая схема заявки.
 * Используется И на клиенте, И на сервере — расхождение валидации невозможно.
 */

export const leadSources = [
  'trial', // пробное занятие
  'consultation', // консультация
  'quiz', // подбор программы
  'branch', // форма на странице филиала
  'program', // форма на странице программы
  'contacts', // страница контактов
] as const;

export type LeadSource = (typeof leadSources)[number];

export const leadSourceLabels: Record<LeadSource, string> = {
  trial: 'Пробное занятие',
  consultation: 'Консультация',
  quiz: 'Подбор программы',
  branch: 'Заявка из филиала',
  program: 'Заявка со страницы программы',
  contacts: 'Страница контактов',
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Укажите имя — минимум 2 символа').max(80, 'Слишком длинное имя'),

  phone: z
    .string()
    .trim()
    .transform((value) => {
      const digits = value.replace(/\D/g, '');
      return digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
    })
    .refine((digits) => /^7\d{10}$/.test(digits), 'Введите корректный номер телефона')
    .transform((digits) => `+${digits}`),

  age: optionalText(40),
  city: optionalText(60),
  program: optionalText(120),
  goal: optionalText(120),
  message: optionalText(1000),

  source: z.enum(leadSources),

  consent: z.literal(true, {
    message: 'Без согласия на обработку данных заявку отправить нельзя',
  }),

  /**
   * Honeypot: реальные пользователи это поле не видят и не заполняют.
   * Схема его НЕ отклоняет намеренно — иначе бот получил бы понятную
   * ошибку и подсказку, какое поле чистить. Решение принимает сервер:
   * при непустом значении он отвечает как при успехе (см. api/lead/route.ts).
   */
  company: z.string().max(200).optional(),

  /** Технический контекст — заполняется автоматически на клиенте. */
  pageUrl: optionalText(500),
  utm: z.record(z.string(), z.string().max(200)).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadPayload = z.output<typeof leadSchema>;

/** Поля формы, которыми управляет пользователь. */
export type LeadFormValues = {
  name: string;
  phone: string;
  age: string;
  city: string;
  program: string;
  goal: string;
  message: string;
  consent: boolean;
  company: string;
};

export const emptyLeadForm: LeadFormValues = {
  name: '',
  phone: '',
  age: '',
  city: '',
  program: '',
  goal: '',
  message: '',
  consent: false,
  company: '',
};
