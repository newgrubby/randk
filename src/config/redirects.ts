/**
 * 301-редиректы со старого сайта и с адресов первой версии нового сайта.
 *
 * Источники:
 *  • публичная навигация randkcenter.ru (снято 31.07.2026);
 *  • собственные маршруты первой версии, изменившиеся при доработке
 *    структуры (/branches → /centers, /programs/[slug] → отдельные разделы).
 *
 * Применение зависит от режима сборки:
 *  • standalone — правила подхватывает `next.config.ts → redirects()`;
 *  • статический экспорт — редиректы выполняет веб-сервер, файл
 *    `public/.htaccess` генерируется из этого же списка
 *    (`node scripts/generate-htaccess.mjs`).
 *
 * Единый источник истины: список правится только здесь.
 */

export type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
  note?: string;
};

const rules: RedirectRule[] = [
  // --- Старый сайт: информационные страницы ---
  { source: '/uchebnyy_process', destination: '/about', permanent: true },
  { source: '/prepodovateli', destination: '/teachers', permanent: true },
  { source: '/otzyvy_nashih_studentov', destination: '/reviews', permanent: true },
  { source: '/address', destination: '/contacts', permanent: true },
  { source: '/fotogalereya', destination: '/about', permanent: true, note: 'Галереи пока нет' },
  { source: '/voprosy_i_otvety', destination: '/#faq', permanent: true },

  // --- Старый сайт: языки (теперь у каждого своя страница) ---
  { source: '/inostrannye_yazyki1', destination: '/languages', permanent: true },
  { source: '/angliyskiy_yazyk', destination: '/languages/english', permanent: true },
  { source: '/nemeckiy_yazyk', destination: '/languages/german', permanent: true },
  { source: '/francuzskiy_yazyk', destination: '/languages/french', permanent: true },
  { source: '/ispanskiy-yazyk', destination: '/languages/spanish', permanent: true },
  { source: '/italyanskiy-yazyk', destination: '/languages/italian', permanent: true },
  { source: '/kitayskiy-yazyk', destination: '/languages/chinese', permanent: true },

  // --- Старый сайт: направления ---
  { source: '/podgotovka_k_ege', destination: '/exams', permanent: true },
  { source: '/repetitorstvo', destination: '/tutoring', permanent: true },
  { source: '/podgotovka_detey_k_shkole', destination: '/preschool', permanent: true },
  { source: '/ritmika_i_tancy', destination: '/development', permanent: true },
  { source: '/logoped', destination: '/speech-therapist', permanent: true },
  { source: '/psiholog', destination: '/psychologist', permanent: true },

  // --- Старый сайт: форматы и формы ---
  { source: '/gruppovyye-zanyatiya', destination: '/programs', permanent: true },
  { source: '/individualnyye-zanyatiya', destination: '/programs', permanent: true },
  { source: '/kursy-dlya-detey', destination: '/programs', permanent: true },
  { source: '/zapisatsya-na-kursy', destination: '/contacts', permanent: true },
  { source: '/zakazat-zvonok', destination: '/contacts', permanent: true },

  // --- Старый сайт: не переносится 1:1 ---
  { source: '/news', destination: '/', permanent: true, note: 'Новостей на сайте нет' },
  {
    source: '/article_post/:id',
    destination: '/',
    permanent: true,
    note: 'На старом сайте — шаблонный текст-заглушка платформы',
  },
  { source: '/vakansii', destination: '/contacts', permanent: true },

  // --- Первая версия нового сайта: филиалы стали центрами ---
  { source: '/branches', destination: '/centers', permanent: true },
  { source: '/branches/orekhovo-zuevo', destination: '/centers/orekhovo-zuevo', permanent: true },
  {
    source: '/branches/pavlovsky-posad',
    destination: '/centers/pavlovsky-posad',
    permanent: true,
  },
  { source: '/branches/elektrostal', destination: '/centers/elektrostal', permanent: true },

  // --- Первая версия: программы получили собственные маршруты ---
  { source: '/programs/inostrannye-yazyki', destination: '/languages', permanent: true },
  { source: '/programs/angliyskiy-yazyk', destination: '/languages/english', permanent: true },
  { source: '/programs/podgotovka-k-ege-oge', destination: '/exams', permanent: true },
  { source: '/programs/shkolnye-predmety', destination: '/tutoring', permanent: true },
  { source: '/programs/podgotovka-k-shkole', destination: '/preschool', permanent: true },
  { source: '/programs/razvivayushchie-zanyatiya', destination: '/development', permanent: true },
  { source: '/programs/individualnye-zanyatiya', destination: '/programs', permanent: true },

  // --- Первая версия: страница согласия на обработку ПДн больше не нужна ---
  {
    source: '/personal-data-consent',
    destination: '/privacy',
    permanent: true,
    note: 'Форм заявок нет, персональные данные не собираются',
  },
];

/**
 * Страховка от редиректа «сам на себя»: такое правило создаёт бесконечный
 * цикл и полностью выключает страницу. Проверка выполняется при сборке
 * конфига, поэтому ошибка видна сразу, а не в продакшене.
 */
const selfReferencing = rules.filter((rule) => rule.source === rule.destination);
if (selfReferencing.length > 0) {
  throw new Error(
    `redirects.ts: правило ведёт само на себя: ${selfReferencing.map((r) => r.source).join(', ')}`,
  );
}

export const redirects: RedirectRule[] = rules;
