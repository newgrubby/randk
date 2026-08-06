/**
 * Общий модуль работы с правилами редиректа.
 *
 * Используется генератором (`generate-redirects.mjs`) и валидатором
 * (`validate-redirects.mjs`), чтобы оба читали ОДИН источник и одинаково
 * приводили пути к каноническому виду.
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const SOURCE_FILE = 'src/config/redirects.data.json';
export const HTACCESS_FILE = 'public/.htaccess';
export const VERCEL_FILE = 'vercel.json';

/**
 * В проекте включён `trailingSlash: true` (см. next.config.ts): статический
 * экспорт кладёт страницы в /about/index.html, и Next нормализует /about → /about/.
 *
 * Поэтому цель редиректа записывается сразу со слэшем. Иначе получилась бы
 * цепочка из двух переходов: /uchebnyy_process → /about → /about/ — лишний
 * хоп, потеря веса ссылки и явный запрет в требованиях.
 */
export const TRAILING_SLASH = true;

/** Читает единый источник правил. */
export async function loadRules() {
  const raw = await readFile(join(root, SOURCE_FILE), 'utf8');
  const rules = JSON.parse(raw);

  if (!Array.isArray(rules)) {
    throw new Error(`${SOURCE_FILE}: ожидался массив правил`);
  }

  return rules;
}

/**
 * Канонический вид цели с учётом trailingSlash.
 *
 *  /about        → /about/
 *  /             → /
 *  /#faq         → /#faq        (якорь на главной, слэш уже есть)
 *  /languages/en → /languages/en/
 */
export function normalizeDestination(destination) {
  if (!TRAILING_SLASH) return destination;
  if (destination === '/') return '/';
  if (destination.includes('#')) {
    const [path, hash] = destination.split('#');
    if (path === '/' || path === '') return destination;
    return `${path.replace(/\/$/, '')}/#${hash}`;
  }
  if (destination.endsWith('/')) return destination;
  return `${destination}/`;
}

/** Путь без завершающего слэша и без якоря — для сравнения адресов между собой. */
export function comparablePath(value) {
  const withoutHash = value.split('#')[0];
  if (withoutHash === '/') return '/';
  return withoutHash.replace(/\/+$/, '');
}

/** true, если в пути есть динамический параметр вида `:id`. */
export function hasParam(value) {
  return /:[a-zA-Z]\w*/.test(value);
}

/** Правила в виде, готовом для записи в конфиги. */
export async function loadNormalizedRules() {
  const rules = await loadRules();
  return rules.map((rule) => ({
    ...rule,
    normalizedDestination: normalizeDestination(rule.destination),
  }));
}
