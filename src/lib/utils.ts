/** Склейка классов без внешних зависимостей. */
export function cn(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Форматирование российского номера при вводе: +7 (999) 123-45-67.
 * Работает как «маска на лету» — пользователь может печатать как угодно.
 */
export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, '');

  // 8XXXXXXXXXX и 7XXXXXXXXXX приводим к единому виду
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith('7')) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const rest = digits.slice(1);
  if (rest.length === 0) return '+7 ';

  let out = '+7 ';
  out += `(${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += ')';
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

/** Нормализация телефона к виду +79991234567 — уходит в заявку и в `tel:`. */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  return digits ? `+${digits}` : '';
}

/** Человекочитаемый вид подтверждённого номера для отображения. */
export function displayPhone(normalized: string): string {
  const digits = normalized.replace(/\D/g, '');
  if (digits.length !== 11) return normalized;
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
}

/** Ссылка на маршрут в Яндекс Картах по координатам филиала. */
export function buildYandexRouteUrl(coordinates: [number, number]): string {
  const [lat, lon] = coordinates;
  return `https://yandex.ru/maps/?rtext=~${lat}%2C${lon}&rtt=auto`;
}

/** Встраиваемая карта Яндекса. Грузится только по требованию. */
export function buildYandexEmbedUrl(coordinates: [number, number]): string {
  const [lat, lon] = coordinates;
  return `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=17&pt=${lon},${lat},pm2rdm`;
}
