/**
 * Аналитика (Яндекс Метрика).
 *
 * Счётчик подключается ТОЛЬКО если задан NEXT_PUBLIC_YANDEX_METRIKA_ID.
 * Без переменной ни один скрипт не загружается — это важно и для
 * скорости на dev-стенде, и для соответствия закону о cookie.
 */

export const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? '';

export const analyticsEvents = [
  'lead_submit',
  'trial_lesson_click',
  'program_select',
  'branch_select',
  'phone_click',
  'vk_click',
  'max_click',
  'map_click',
  'quiz_start',
  'quiz_complete',
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];

type YmFunction = (
  counterId: number,
  action: string,
  target?: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    ym?: YmFunction;
  }
}

/**
 * Отправка цели. Безопасна к вызову где угодно:
 * без счётчика, на сервере или до загрузки скрипта просто ничего не делает.
 */
export function track(event: AnalyticsEvent, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!metrikaId || typeof window.ym !== 'function') return;

  const id = Number(metrikaId);
  if (!Number.isFinite(id)) return;

  window.ym(id, 'reachGoal', event, params);
}
