import rules from './redirects.data.json';

/**
 * 301-редиректы со старого сайта и с адресов первой версии нового сайта.
 *
 * ЕДИНЫЙ ИСТОЧНИК ПРАВИЛ — `src/config/redirects.data.json`.
 * Второго списка, поддерживаемого вручную, в проекте нет.
 *
 * Из этого JSON формируются:
 *  • `public/.htaccess` — редиректы на обычном хостинге (REG.RU, Apache);
 *  • `vercel.json` — редиректы на Vercel;
 *  • `next.config.ts → redirects()` — только в режиме standalone.
 *
 * Генерация: `node scripts/generate-redirects.mjs` (входит в `npm run build`).
 * Проверка целостности и синхронизации: `npm test`.
 *
 * Почему JSON, а не массив в TypeScript: файл читают и сборка Next.js, и
 * обычные Node-скрипты. JSON понятен обоим напрямую, без разбора исходника
 * регулярными выражениями — раньше генератор работал именно так, и любая
 * правка форматирования могла тихо «потерять» правило.
 *
 * Источники списка:
 *  • публичная навигация randkcenter.ru (снято 31.07.2026);
 *  • маршруты первой версии нового сайта, изменившиеся при доработке
 *    структуры (/branches → /centers, /programs/[slug] → отдельные разделы).
 */

export type RedirectRule = {
  /** Старый путь. Без завершающего слэша. */
  source: string;
  /** Новый путь в канонической форме — без завершающего слэша. */
  destination: string;
  /** true → постоянный редирект (301/308). Для SEO-переноса всегда true. */
  permanent: boolean;
  /** Пояснение для ревью клиентом. На поведение не влияет. */
  note?: string;
};

const typedRules = rules as RedirectRule[];

/**
 * Страховка от редиректа «сам на себя»: такое правило создаёт бесконечный
 * цикл и полностью выключает страницу. Проверка выполняется при загрузке
 * конфига, поэтому ошибка видна сразу, а не в продакшене.
 *
 * Полный набор проверок (дубликаты, цепочки, существование маршрутов,
 * синхронизация с .htaccess и vercel.json) — в
 * `scripts/validate-redirects.mjs`, запускается через `npm test`.
 */
const selfReferencing = typedRules.filter((rule) => rule.source === rule.destination);
if (selfReferencing.length > 0) {
  throw new Error(
    `redirects.data.json: правило ведёт само на себя: ${selfReferencing
      .map((rule) => rule.source)
      .join(', ')}`,
  );
}

export const redirects: RedirectRule[] = typedRules;
