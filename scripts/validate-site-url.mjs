/**
 * Проверка разбора NEXT_PUBLIC_SITE_URL.
 *
 * Запуск: npm test (вместе с проверкой редиректов)
 *
 * Зачем эти тесты. Production-сборка на Vercel падала с
 * `TypeError: Invalid URL / input: ''`: объявленная, но незаполненная
 * переменная приходит пустой строкой, а `??` перехватывает только
 * `undefined`. Итоговый `siteUrl` становился `''`, и `new URL('')`
 * в `src/app/layout.tsx` ронял сборку.
 *
 * Главная проверка здесь — последняя: `new URL(siteUrl)` обязан отработать
 * для ЛЮБОГО значения переменной. Именно это и уронило прод.
 *
 * Скрипт намеренно без тестового фреймворка — как и validate-redirects.mjs:
 * одна зависимость меньше, вывод читается человеком.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSiteUrl } from '../src/lib/site-url.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Запасной адрес — тот же, что в `src/content/site.ts`. */
const FALLBACK = 'https://randkcenter.ru';

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

/** Как значение переменной выглядит в отчёте. */
function label(raw) {
  return raw === undefined ? 'переменная не задана' : JSON.stringify(raw);
}

/*
 * Каждый случай: что подали, что должно получиться и должно ли значение
 * быть отклонено с предупреждением.
 */
const cases = [
  /* --- 1. Штатные случаи: тихий переход на запасной адрес --- */
  { raw: undefined, expect: FALLBACK, source: 'fallback', rejected: false },
  { raw: '', expect: FALLBACK, source: 'fallback', rejected: false },
  { raw: '   ', expect: FALLBACK, source: 'fallback', rejected: false },
  { raw: '\t\n ', expect: FALLBACK, source: 'fallback', rejected: false },

  /* --- 2. Корректные адреса --- */
  { raw: 'https://randkcenter.ru', expect: 'https://randkcenter.ru', source: 'env', rejected: false },
  {
    raw: 'https://example.vercel.app/',
    expect: 'https://example.vercel.app',
    source: 'env',
    rejected: false,
  },
  {
    raw: '  https://randkcenter.ru/  ',
    expect: 'https://randkcenter.ru',
    source: 'env',
    rejected: false,
  },
  { raw: 'http://localhost:3000', expect: 'http://localhost:3000', source: 'env', rejected: false },
  {
    raw: 'https://randkcenter.ru///',
    expect: 'https://randkcenter.ru',
    source: 'env',
    rejected: false,
  },
  {
    raw: 'https://example.com/sub/',
    expect: 'https://example.com/sub',
    source: 'env',
    rejected: false,
  },

  /* --- 3. Мусор: запасной адрес + предупреждение --- */
  { raw: 'randkcenter.ru', expect: FALLBACK, source: 'fallback', rejected: true },
  { raw: 'abc', expect: FALLBACK, source: 'fallback', rejected: true },
  { raw: '//', expect: FALLBACK, source: 'fallback', rejected: true },
  { raw: '//randkcenter.ru', expect: FALLBACK, source: 'fallback', rejected: true },
  { raw: 'https://', expect: FALLBACK, source: 'fallback', rejected: true },
  { raw: 'ftp://randkcenter.ru', expect: FALLBACK, source: 'fallback', rejected: true },
  { raw: 'javascript:alert(1)', expect: FALLBACK, source: 'fallback', rejected: true },
  { raw: 'https://randkcenter.ru?a=1', expect: FALLBACK, source: 'fallback', rejected: true },
  { raw: 'https://randkcenter.ru#top', expect: FALLBACK, source: 'fallback', rejected: true },
];

console.log('Разбор NEXT_PUBLIC_SITE_URL');
console.log(`Запасной адрес: ${FALLBACK}`);

section('0. Запасной адрес совпадает с контентом сайта');
{
  /*
   * Без этой проверки тесты продолжили бы гонять устаревший домен,
   * если бы адрес в контенте поменяли, а здесь забыли.
   */
  const siteSource = readFileSync(join(root, 'src/content/site.ts'), 'utf8');
  const match = siteSource.match(/^\s*url:\s*'([^']+)'/m);
  check('url найден в src/content/site.ts', Boolean(match), match?.[1] ?? '—');
  check(`site.url === ${FALLBACK}`, match?.[1] === FALLBACK, match?.[1] ?? '—');
}

section('1. Значение адреса');
for (const item of cases) {
  const actual = resolveSiteUrl(item.raw, FALLBACK);
  check(`${label(item.raw).padEnd(30)} → ${item.expect}`, actual.url === item.expect, actual.url);
}

section('2. Источник значения (env или запасной адрес)');
for (const item of cases) {
  const actual = resolveSiteUrl(item.raw, FALLBACK);
  check(`${label(item.raw).padEnd(30)} → ${item.source}`, actual.source === item.source, actual.source);
}

section('3. Предупреждение только на непригодных значениях');
for (const item of cases) {
  const actual = resolveSiteUrl(item.raw, FALLBACK);
  const got = actual.rejected !== undefined;
  check(
    `${label(item.raw).padEnd(30)} → ${item.rejected ? 'предупреждение' : 'без предупреждения'}`,
    got === item.rejected,
    actual.rejected ?? '',
  );
}

section('4. Функция никогда не бросает исключение');
{
  const hostile = [
    ...cases.map((item) => item.raw),
    'https://пример.рф',
    '   ',
    'HTTPS://RANDKCENTER.RU',
    'https://user:pass@randkcenter.ru',
    'data:text/html,<h1>x</h1>',
    'x'.repeat(5000),
  ];

  const thrown = [];
  for (const raw of hostile) {
    try {
      resolveSiteUrl(raw, FALLBACK);
    } catch (error) {
      thrown.push(`${label(raw)}: ${error.message}`);
    }
  }
  check(`ни одно из ${hostile.length} значений не уронило resolveSiteUrl`, thrown.length === 0, thrown.join('; '));
}

section('5. Главное: new URL(siteUrl) не падает — это и роняло production');
{
  const broken = [];
  for (const item of cases) {
    const { url } = resolveSiteUrl(item.raw, FALLBACK);
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        broken.push(`${label(item.raw)} → протокол ${parsed.protocol}`);
      }
    } catch (error) {
      broken.push(`${label(item.raw)} → ${error.message}`);
    }
  }
  check(
    `metadataBase собирается для всех ${cases.length} значений переменной`,
    broken.length === 0,
    broken.join('; '),
  );

  // Ровно тот вход, который ронял сборку на Vercel.
  const { url } = resolveSiteUrl('', FALLBACK);
  check('регрессия: пустая переменная больше не даёт new URL("")', url.length > 0 && url === FALLBACK, url);
}

section('6. Результат пригоден для склейки с путём');
{
  const bad = [];
  for (const item of cases) {
    const { url } = resolveSiteUrl(item.raw, FALLBACK);
    if (url.endsWith('/')) bad.push(`${label(item.raw)} → ${url}`);
    if (`${url}/sitemap.xml`.includes('//sitemap')) bad.push(`${label(item.raw)} → двойной слэш`);
  }
  check('адрес всегда без завершающего слэша', bad.length === 0, bad.join('; '));
}

console.log(`\n=== Проверок: ${checks}, провалено: ${failures} ===`);

if (failures > 0) {
  console.error('\nРазбор NEXT_PUBLIC_SITE_URL работает не так, как ожидается: src/lib/site-url.ts');
  process.exitCode = 1;
}
