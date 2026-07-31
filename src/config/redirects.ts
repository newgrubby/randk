/**
 * 301-редиректы со старого сайта (Megagroup) на новую структуру.
 *
 * Источник списка старых URL — публичная навигация randkcenter.ru,
 * снятая 31.07.2026. Список подлежит сверке с реальными логами/Метрикой
 * перед переключением домена: см. /docs/REDIRECT_PLAN.md.
 *
 * Правило: если старая страница не имеет точного смыслового аналога,
 * ведём на ближайший раздел, а не на главную.
 */

export type RedirectRule = {
  /** Старый путь (в формате Next.js `source`). */
  source: string;
  /** Новый путь. */
  destination: string;
  /** true → 308/301, false → 307/302. Для SEO-переноса всегда true. */
  permanent: boolean;
  /** Комментарий для ревью клиентом. */
  note?: string;
};

const rules: RedirectRule[] = [
  // --- Информационные страницы ---
  // ВНИМАНИЕ: /about на старом сайте совпадает с новым адресом,
  // поэтому правило для него не нужно — редирект «сам на себя»
  // даёт бесконечный цикл 308.
  { source: '/uchebnyy_process', destination: '/about', permanent: true },
  { source: '/prepodovateli', destination: '/teachers', permanent: true },
  { source: '/otzyvy_nashih_studentov', destination: '/#reviews', permanent: true },
  { source: '/address', destination: '/contacts', permanent: true },
  { source: '/fotogalereya', destination: '/about', permanent: true, note: 'Галереи пока нет' },
  { source: '/voprosy_i_otvety', destination: '/#faq', permanent: true },

  // --- Языки ---
  { source: '/inostrannye_yazyki1', destination: '/programs/inostrannye-yazyki', permanent: true },
  { source: '/angliyskiy_yazyk', destination: '/programs/angliyskiy-yazyk', permanent: true },
  { source: '/nemeckiy_yazyk', destination: '/programs/inostrannye-yazyki', permanent: true },
  { source: '/francuzskiy_yazyk', destination: '/programs/inostrannye-yazyki', permanent: true },
  { source: '/ispanskiy-yazyk', destination: '/programs/inostrannye-yazyki', permanent: true },
  { source: '/italyanskiy-yazyk', destination: '/programs/inostrannye-yazyki', permanent: true },
  { source: '/kitayskiy-yazyk', destination: '/programs/inostrannye-yazyki', permanent: true },

  // --- Экзамены и школа ---
  { source: '/podgotovka_k_ege', destination: '/programs/podgotovka-k-ege-oge', permanent: true },
  { source: '/repetitorstvo', destination: '/programs/shkolnye-predmety', permanent: true },
  {
    source: '/podgotovka_detey_k_shkole',
    destination: '/programs/podgotovka-k-shkole',
    permanent: true,
  },
  {
    source: '/ritmika_i_tancy',
    destination: '/programs/razvivayushchie-zanyatiya',
    permanent: true,
  },

  // --- Форматы занятий ---
  { source: '/gruppovyye-zanyatiya', destination: '/programs', permanent: true },
  {
    source: '/individualnyye-zanyatiya',
    destination: '/programs/individualnye-zanyatiya',
    permanent: true,
  },
  { source: '/kursy-dlya-detey', destination: '/programs', permanent: true },

  // --- Формы ---
  { source: '/zapisatsya-na-kursy', destination: '/contacts', permanent: true },
  { source: '/zakazat-zvonok', destination: '/contacts', permanent: true },

  // --- Разделы, которые не переносятся 1:1 ---
  { source: '/news', destination: '/', permanent: true, note: 'Новостей на новом сайте нет' },
  {
    source: '/article_post/:id',
    destination: '/',
    permanent: true,
    note: 'Устаревшие новости не переносятся',
  },
  { source: '/vakansii', destination: '/contacts', permanent: true, note: 'Вакансий пока нет' },

  // --- Страницы, ожидающие решения клиента (см. REDIRECT_PLAN.md) ---
  {
    source: '/logoped',
    destination: '/programs',
    permanent: true,
    note: 'Услуга логопеда требует подтверждения — при подтверждении завести отдельную программу',
  },
  {
    source: '/psiholog',
    destination: '/programs',
    permanent: true,
    note: 'Услуга психолога требует подтверждения',
  },
];

/**
 * Страховка от редиректа «сам на себя»: такое правило создаёт
 * бесконечный цикл 308 и полностью выключает страницу.
 * Проверка выполняется при сборке конфига Next.js — ошибка видна сразу.
 */
const selfReferencing = rules.filter((rule) => rule.source === rule.destination);
if (selfReferencing.length > 0) {
  throw new Error(
    `redirects.ts: правило ведёт само на себя (бесконечный цикл): ${selfReferencing
      .map((rule) => rule.source)
      .join(', ')}`,
  );
}

export const redirects: RedirectRule[] = rules;
