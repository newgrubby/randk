import { telegramNotifier } from './telegram';
import type { LeadNotifier, LeadRecord, NotifierResult } from './types';

export type { LeadRecord, NotifierResult };

/**
 * Реестр каналов доставки заявок.
 *
 * Чтобы подключить e-mail или CRM, достаточно написать адаптер по типу
 * `LeadNotifier` и добавить его в этот массив — API-маршрут и формы
 * менять не нужно.
 */
const notifiers: LeadNotifier[] = [telegramNotifier];

/** Настроен ли хотя бы один канал доставки. */
export function hasConfiguredNotifier(): boolean {
  return notifiers.some((notifier) => notifier.isConfigured());
}

/**
 * Отправляет заявку во все настроенные каналы.
 * Каналы независимы: падение одного не отменяет доставку в остальные.
 */
export async function deliverLead(lead: LeadRecord): Promise<NotifierResult[]> {
  const active = notifiers.filter((notifier) => notifier.isConfigured());
  if (active.length === 0) return [];

  return Promise.all(active.map((notifier) => notifier.send(lead)));
}
