/**
 * Проверка правил редиректа и синхронизации сгенерированных конфигов.
 *
 * Запуск: npm test
 *
 * Проверяется:
 *  1. дубликаты source;
 *  2. source === destination;
 *  3. циклы (A → B → A);
 *  4. цепочки (цель сама является источником — лишний хоп);
 *  5. формат путей и завершающие слэши;
 *  6. постоянные редиректы помечены permanent: true;
 *  7. существование целевых маршрутов (по содержимому out/, если он собран);
 *  8. редирект существующей новой страницы на саму себя;
 *  9. синхронизация: количество и содержимое правил в источнике,
 *     .htaccess и vercel.json.
 *
 * Скрипт намеренно без тестового фреймворка: одна зависимость меньше,
 * а вывод читается человеком без дополнительных инструментов.
 */

import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  HTACCESS_FILE,
  SOURCE_FILE,
  VERCEL_FILE,
  comparablePath,
  hasParam,
  isGoneRule,
  loadNormalizedRules,
  normalizeDestination,
  root,
} from './lib/redirect-rules.mjs';

let failures = 0;
let checks = 0;

function check(name, ok, detail = '') {
  checks += 1;
  if (!ok) failures += 1;
  console.log(`${ok ? '  OK  ' : ' FAIL '} ${name}${detail ? ` → ${detail}` : ''}`);
}

function section(title) {
  console.log(`\n### ${title}`);
}

/** Собирает список реально существующих маршрутов из статической сборки. */
async function collectBuiltRoutes() {
  const outDir = join(root, 'out');
  try {
    await access(outDir);
  } catch {
    return null;
  }

  const routes = new Set(['/']);

  async function walk(dir, prefix) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name.startsWith('_')) continue;
        const nextPrefix = `${prefix}/${entry.name}`;
        try {
          await access(join(dir, entry.name, 'index.html'));
          routes.add(nextPrefix);
        } catch {
          /* каталог без index.html — не маршрут */
        }
        await walk(join(dir, entry.name), nextPrefix);
      }
    }
  }

  await walk(outDir, '');
  return routes;
}

async function main() {
  const rules = await loadNormalizedRules();
  const redirectRules = rules.filter((rule) => !isGoneRule(rule));
  const goneRules = rules.filter(isGoneRule);

  console.log(`Источник правил: ${SOURCE_FILE}`);
  console.log(
    `Правил в источнике: ${rules.length} (${redirectRules.length} редиректов, ${goneRules.length} Gone)`,
  );

  /* ---------- 1. Дубликаты source ---------- */
  section('1. Дубликаты source');
  {
    const seen = new Map();
    const duplicates = [];
    for (const rule of rules) {
      const key = comparablePath(rule.source);
      if (seen.has(key)) duplicates.push(rule.source);
      seen.set(key, true);
    }
    check('дубликатов нет', duplicates.length === 0, duplicates.join(', '));
  }

  /* ---------- 2. source === destination ---------- */
  section('2. Редирект «сам на себя»');
  {
    const self = redirectRules.filter(
      (rule) => comparablePath(rule.source) === comparablePath(rule.destination),
    );
    check('таких правил нет', self.length === 0, self.map((r) => r.source).join(', '));
  }

  /* ---------- 3 и 4. Циклы и цепочки ---------- */
  section('3. Циклы и цепочки');
  {
    const sources = new Map(redirectRules.map((rule) => [comparablePath(rule.source), rule]));
    const chains = [];
    const cycles = [];

    for (const rule of redirectRules) {
      const target = comparablePath(rule.destination);
      const next = sources.get(target);
      if (!next) continue;

      chains.push(`${rule.source} → ${rule.destination} → ${next.destination}`);
      if (comparablePath(next.destination) === comparablePath(rule.source)) {
        cycles.push(`${rule.source} ⇄ ${next.source}`);
      }
    }

    check('циклов нет', cycles.length === 0, cycles.join('; '));
    check('цепочек из нескольких редиректов нет', chains.length === 0, chains.join('; '));
  }

  /* ---------- 5. Формат путей ---------- */
  section('5. Формат путей и завершающие слэши');
  {
    const badSource = rules.filter(
      (rule) => !rule.source.startsWith('/') || (rule.source !== '/' && rule.source.endsWith('/')),
    );
    check(
      'источники начинаются с / и без завершающего слэша',
      badSource.length === 0,
      badSource.map((r) => r.source).join(', '),
    );

    const badDestination = redirectRules.filter((rule) => !rule.destination.startsWith('/'));
    check(
      'цели начинаются с /',
      badDestination.length === 0,
      badDestination.map((r) => r.destination).join(', '),
    );

    const wrongSlash = redirectRules.filter(
      (rule) => rule.normalizedDestination !== normalizeDestination(rule.destination),
    );
    check('цели приведены к виду с завершающим слэшем', wrongSlash.length === 0);

    const rootOrHash = redirectRules.filter(
      (rule) => rule.destination === '/' || rule.destination.includes('#'),
    );
    check(
      `корень и якоря не получили лишний слэш (${rootOrHash.length} шт.)`,
      rootOrHash.every((rule) => !rule.normalizedDestination.startsWith('//')),
    );
  }

  /* ---------- 6. Постоянные редиректы ---------- */
  section('6. Тип редиректа');
  {
    const temporary = redirectRules.filter((rule) => rule.permanent !== true);
    check(
      'все правила помечены permanent: true',
      temporary.length === 0,
      temporary.map((r) => r.source).join(', '),
    );
  }

  /* ---------- 7 и 8. Существование маршрутов ---------- */
  section('7. Целевые маршруты существуют');
  {
    const routes = await collectBuiltRoutes();

    if (!routes) {
      console.log('  ПРОПУЩЕНО  папки out/ нет — выполните npm run build и повторите');
    } else {
      const missing = [];
      for (const rule of redirectRules) {
        if (hasParam(rule.destination)) continue;
        const target = comparablePath(rule.destination);
        const path = target === '' ? '/' : target;
        if (!routes.has(path)) missing.push(`${rule.source} → ${rule.destination}`);
      }
      check(
        `все цели ведут на существующие страницы (маршрутов в сборке: ${routes.size})`,
        missing.length === 0,
        missing.join('; '),
      );

      const shadowed = rules.filter((rule) => routes.has(comparablePath(rule.source)));
      check(
        'ни один источник не перекрывает существующую страницу',
        shadowed.length === 0,
        shadowed.map((r) => r.source).join(', '),
      );
    }
  }

  /* ---------- 9. Синхронизация конфигов ---------- */
  section('8. Синхронизация .htaccess и vercel.json с источником');
  {
    /* --- vercel.json --- */
    let vercel = null;
    try {
      vercel = JSON.parse(await readFile(join(root, VERCEL_FILE), 'utf8'));
    } catch {
      check(`${VERCEL_FILE} существует и читается`, false, 'файл отсутствует или повреждён');
    }

    if (vercel) {
      check(`${VERCEL_FILE} существует`, true);
      check(
        'указана секция $schema',
        vercel.$schema === 'https://openapi.vercel.sh/vercel.json',
        String(vercel.$schema),
      );
      check(
        `редиректов в vercel.json = ${redirectRules.length}`,
        Array.isArray(vercel.redirects) && vercel.redirects.length === redirectRules.length,
        String(vercel.redirects?.length),
      );

      const mismatched = [];
      for (const [index, rule] of redirectRules.entries()) {
        const actual = vercel.redirects?.[index];
        if (
          !actual ||
          actual.source !== rule.source ||
          actual.destination !== rule.normalizedDestination ||
          actual.permanent !== rule.permanent
        ) {
          mismatched.push(rule.source);
        }
      }
      check(
        'redirect source, destination и permanent совпадают',
        mismatched.length === 0,
        mismatched.join(', '),
      );

      check(
        `Gone routes в vercel.json = ${goneRules.length}`,
        Array.isArray(vercel.routes) && vercel.routes.length === goneRules.length,
        String(vercel.routes?.length),
      );
      const goneMismatch = goneRules.filter((rule) => {
        const fragment = rule.source.replace(/^\//, '').replace(/:[a-zA-Z]\w*/g, '');
        return !vercel.routes?.some(
          (route) => route.status === 410 && typeof route.src === 'string' && route.src.includes(fragment),
        );
      });
      check(
        'все Gone rules присутствуют в routes со статусом 410',
        goneMismatch.length === 0,
        goneMismatch.map((r) => r.source).join(', '),
      );
    }

    /* --- .htaccess --- */
    let htaccess = null;
    try {
      htaccess = await readFile(join(root, HTACCESS_FILE), 'utf8');
    } catch {
      check(`${HTACCESS_FILE} существует и читается`, false, 'файл отсутствует');
    }

    if (htaccess) {
      check(`${HTACCESS_FILE} существует`, true);

      const redirectSection = htaccess
        .split('# --- Постоянные редиректы со старых адресов')[1]
        ?.split('# --- Удалённые legacy URL')[0];
      const redirectLines = (redirectSection ?? '')
        .split('\n')
        .filter((line) => line.trim().startsWith('RewriteRule ^') && line.includes('R=30'));
      check(
        `правил редиректа в .htaccess = ${redirectRules.length}`,
        redirectLines.length === redirectRules.length,
        String(redirectLines.length),
      );

      const missingRedirects = redirectRules.filter((rule) => {
        const pattern = rule.source.replace(/^\//, '').replace(/:[a-zA-Z]\w*/g, '');
        return !redirectLines.some(
          (line) => line.includes(pattern) && line.includes(rule.normalizedDestination),
        );
      });
      check(
        'каждый redirect rule присутствует в .htaccess',
        missingRedirects.length === 0,
        missingRedirects.map((r) => r.source).join(', '),
      );
      check(
        'legacy query-параметры удаляются через QSD',
        redirectLines.every((line) => line.includes('QSD')),
      );
      check(
        'legacy-цели сразу ведут на canonical production host',
        redirectLines.every((line) => line.includes('https://randkcenter.ru/')),
      );

      const goneSection = htaccess
        .split('# --- Удалённые legacy URL')[1]
        ?.split('# --- Canonical HTTPS')[0];
      const goneLines = (goneSection ?? '')
        .split('\n')
        .filter((line) => line.trim().startsWith('RewriteRule ^') && line.includes('R=410'));
      check(
        `Gone rules в .htaccess = ${goneRules.length}`,
        goneLines.length === goneRules.length,
        String(goneLines.length),
      );
      const missingGone = goneRules.filter((rule) => {
        const pattern = rule.source.replace(/^\//, '').replace(/:[a-zA-Z]\w*/g, '');
        return !goneLines.some((line) => line.includes(pattern));
      });
      check(
        'каждый Gone rule присутствует в .htaccess',
        missingGone.length === 0,
        missingGone.map((r) => r.source).join(', '),
      );
      check(
        'HTTPS/non-www policy присутствует',
        htaccess.includes('HTTP_HOST} !^randkcenter\\.ru
      check(
        'неизвестный путь получает реальный 404',
        htaccess.includes('RewriteRule ^ - [R=404,L]'),
      );
    }
  }

  /* ---------- Обязательный минимум из задания ---------- */
  section('9. Контрольные адреса из задания');
  {
    const required = [
      '/nemeckiy_yazyk',
      '/francuzskiy_yazyk',
      '/inostrannye_yazyki1',
      '/address',
      '/uchebnyy_process',
      '/branches',
    ];
    for (const source of required) {
      const rule = rules.find((item) => item.source === source);
      check(
        `${source} → ${rule ? rule.normalizedDestination : '—'}`,
        Boolean(rule) && rule.permanent === true,
      );
    }
  }

  console.log(`\n=== Проверок: ${checks}, провалено: ${failures} ===`);

  if (failures > 0) {
    console.error('\nПравила и конфиги расходятся. Выполните: node scripts/generate-redirects.mjs');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
),
      );
      check(
        'REG.RU reverse-proxy HTTPS учитывает X-Forwarded-Proto',
        htaccess.includes('HTTP:X-Forwarded-Proto} !https'),
      );
      check(
        'неизвестный путь получает реальный 404',
        htaccess.includes('RewriteRule ^ - [R=404,L]'),
      );
    }
  }

  /* ---------- Обязательный минимум из задания ---------- */
  section('9. Контрольные адреса из задания');
  {
    const required = [
      '/nemeckiy_yazyk',
      '/francuzskiy_yazyk',
      '/inostrannye_yazyki1',
      '/address',
      '/uchebnyy_process',
      '/branches',
    ];
    for (const source of required) {
      const rule = rules.find((item) => item.source === source);
      check(
        `${source} → ${rule ? rule.normalizedDestination : '—'}`,
        Boolean(rule) && rule.permanent === true,
      );
    }
  }

  console.log(`\n=== Проверок: ${checks}, провалено: ${failures} ===`);

  if (failures > 0) {
    console.error('\nПравила и конфиги расходятся. Выполните: node scripts/generate-redirects.mjs');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
