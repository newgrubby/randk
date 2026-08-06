/** Склейка классов без внешних зависимостей. */
export function cn(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Человекочитаемый вид номера: +7 (999) 123-45-67.
 * В контенте номера хранятся в виде +7XXXXXXXXXX — так их принимает `tel:`.
 */
export function displayPhone(normalized: string): string {
  const digits = normalized.replace(/\D/g, '');
  if (digits.length !== 11) return normalized;
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
}

/** Ссылка на построение маршрута в Яндекс Картах. */
export function buildYandexRouteUrl(coordinates: [number, number]): string {
  const [lat, lon] = coordinates;
  return `https://yandex.ru/maps/?rtext=~${lat}%2C${lon}&rtt=auto`;
}

/** Встраиваемая карта Яндекса. Грузится только по действию пользователя. */
export function buildYandexEmbedUrl(coordinates: [number, number]): string {
  const [lat, lon] = coordinates;
  return `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=17&pt=${lon},${lat},pm2rdm`;
}
