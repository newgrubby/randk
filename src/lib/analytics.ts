/**
 * Аналитика (Яндекс Метрика).
 *
 * Счётчик подключается ТОЛЬКО если задан NEXT_PUBLIC_YANDEX_METRIKA_ID.
 * Без переменной ни один скрипт не загружается — это важно и для
 * скорости на dev-стенде, и для соответствия закону о cookie.
 */

export const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? '';

/**
 * Цели.
 *
 * Сайт не собирает заявки, поэтому событий отправки формы нет.
 * Отслеживаются контактные действия и навигация по каталогу.
 * Персональные данные в аналитику не передаются — только слаги и метки мест.
 */
export const analyticsEvents = [
  'phone_click',
  'vk_click',
  'max_click',
  'map_click',
  'language_select',
  'program_select',
  'city_select',
  'office_select',
  'contact_modal_open',
  'gallery_open',
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
