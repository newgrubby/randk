/**
 * Разбор адреса сайта из переменной окружения.
 *
 * Почему отдельный файл и почему без импортов: модуль напрямую читает тест
 * `scripts/validate-site-url.mjs` — Node 24 срезает типы сам, но только если
 * в файле нечего резолвить (ни алиасов `@/`, ни зависимостей). Побочных
 * эффектов здесь тоже нет: предупреждение печатает вызывающий код.
 *
 * Что чинит. На Vercel объявленная, но незаполненная переменная приходит
 * ПУСТОЙ СТРОКОЙ, а не `undefined`. Оператор `??` реагирует только на
 * `undefined` и `null`, поэтому прежняя строка
 *
 *   process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? site.url
 *
 * возвращала `''`, и `new URL('')` в `app/layout.tsx` ронял production-сборку
 * с `TypeError: Invalid URL / input: ''`.
 */

/** Для canonical, sitemap и metadataBase годится только http(s). */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

export type SiteUrlResolution = {
  /** Адрес без завершающего слэша — готов к склейке с путём. */
  url: string;
  /** `env` — значение взято из переменной, `fallback` — из контента сайта. */
  source: 'env' | 'fallback';
  /** Причина отказа от значения переменной. Пусто, если отказа не было. */
  rejected?: string;
};

/** Убирает завершающие слэши, но никогда не возвращает пустую строку. */
function stripTrailingSlash(value: string): string {
  const trimmed = value.replace(/\/+$/, '');
  return trimmed.length > 0 ? trimmed : value;
}

function rejectValue(fallback: string, rejected: string): SiteUrlResolution {
  return { url: stripTrailingSlash(fallback), source: 'fallback', rejected };
}

/**
 * Приводит значение переменной к рабочему адресу сайта.
 *
 * Функция НИКОГДА не бросает исключение: любое непригодное значение
 * заменяется запасным адресом. Сборка не должна падать из-за опечатки
 * в панели хостинга — это задача предупреждения, а не краша.
 */
export function resolveSiteUrl(raw: string | undefined, fallback: string): SiteUrlResolution {
  const value = raw?.trim();

  /*
   * Переменной нет, она пустая или состоит из пробелов. Это не ошибка
   * конфигурации, а штатный случай, поэтому молча берём запасной адрес
   * и не шумим в логе сборки.
   */
  if (!value) {
    return { url: stripTrailingSlash(fallback), source: 'fallback' };
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    // `randkcenter.ru`, `abc`, `//` — без схемы это не абсолютный адрес.
    return rejectValue(fallback, `«${value}» — не абсолютный URL, нужна схема (https://…)`);
  }

  // `ftp://…` и `javascript:…` разбираются успешно, поэтому проверяем явно.
  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return rejectValue(
      fallback,
      `протокол «${parsed.protocol}» не поддерживается, нужен http или https`,
    );
  }

  if (parsed.hostname.length === 0) {
    return rejectValue(fallback, `в «${value}» нет домена`);
  }

  if (parsed.search.length > 0 || parsed.hash.length > 0) {
    return rejectValue(fallback, `адрес сайта не может содержать query или якорь: «${value}»`);
  }

  return { url: stripTrailingSlash(`${parsed.origin}${parsed.pathname}`), source: 'env' };
}
