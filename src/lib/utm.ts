const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'yclid',
  'gclid',
] as const;

const STORAGE_KEY = 'randk:utm';

/**
 * UTM-метки сохраняются при первом заходе и переживают переходы по сайту,
 * поэтому в заявку попадает исходный источник, а не последняя страница.
 */
export function captureUtm(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, 200);
  }

  if (Object.keys(found).length === 0) return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    // Приватный режим браузера — молча пропускаем, заявка всё равно уйдёт.
  }
}

export function readUtm(): Record<string, string> | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch {
    // Повреждённое значение игнорируем.
  }
  return undefined;
}
