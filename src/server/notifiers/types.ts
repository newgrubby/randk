import type { LeadPayload } from '@/lib/lead-schema';

export type LeadRecord = LeadPayload & {
  /** ISO-время получения заявки на сервере. */
  receivedAt: string;
};

export type NotifierResult = {
  channel: string;
  ok: boolean;
  error?: string;
};

/**
 * Адаптер доставки заявки.
 *
 * Абстракция нужна, чтобы позже подключить e-mail или CRM,
 * не трогая ни API-маршрут, ни формы: достаточно добавить новый
 * адаптер в `src/server/notifiers/index.ts`.
 */
export type LeadNotifier = {
  channel: string;
  /** Настроен ли адаптер (есть ли нужные переменные окружения). */
  isConfigured: () => boolean;
  send: (lead: LeadRecord) => Promise<NotifierResult>;
};
