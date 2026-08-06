/**
 * Проверка редиректов на развёрнутом сайте.
 *
 * Запуск:
 *   node scripts/check-deployment.mjs https://randk-git-<ветка>-<scope>.vercel.app
 *   node scripts/check-deployment.mjs https://randkcenter.ru
 *
 * Проверяется по каждому правилу из vercel.json:
 *  • ответ — постоянный редирект (301 или 308);
 *  • переход ровно один, без цепочек;
 *  • конечная страница отвечает 200, а не 404.
 *
 * Дополнительно: основные новые страницы открываются напрямую, без редиректа.
 *
 * Скрипт нужен потому, что локальная проверка не заменяет реальную площадку:
 * порядок применения правил и нормализация слэшей у Vercel и Apache свои.
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const base = process.argv[2]?.replace(/\/$/, '');
if (!base) {
  console.error('Укажите адрес: node scripts/check-deployment.mjs https://example.vercel.app');
  process.exit(1);
}

const config = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));

/** Проходит по цепочке переходов и возвращает её целиком. */
async function trace(path) {
  const hops = [];
  let current = path;

  for (let i = 0; i < 6; i += 1) {
    const response = await fetch(base + current, { redirect: 'manual' });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location') ?? '';
      hops.push({ status: response.status, to: location });
      current = location.startsWith('http') ? new URL(location).pathname : location;
      continue;
    }

    return { hops, final: current, status: response.status };
  }

  return { hops, final: current, status: 'ЦИКЛ' };
}

let failures = 0;

console.log(`Проверка: ${base}`);
console.log(`Правил в vercel.json: ${config.redirects.length}\n`);

console.log('### Старые адреса → постоянный редирект за один переход\n');

for (const rule of config.redirects) {
  const probe = rule.source.replace(/:[a-zA-Z]\w*/g, '12345');
  const { hops, final, status } = await trace(probe);

  const single = hops.length === 1;
  const permanent = hops[0] && (hops[0].status === 301 || hops[0].status === 308);
  const reached = status === 200;
  const ok = single && permanent && reached;

  if (!ok) failures += 1;

  const problems = [];
  if (!permanent) problems.push(`код ${hops[0]?.status ?? status}`);
  if (!single) problems.push(`переходов: ${hops.length}`);
  if (!reached) problems.push(`финал: ${status}`);

  console.log(
    `${ok ? '  OK  ' : ' FAIL '} ${probe.padEnd(32)} → ${final}${
      problems.length > 0 ? `  [${problems.join(', ')}]` : ''
    }`,
  );
}

console.log('\n### Новые страницы открываются напрямую\n');

const direct = [
  '/',
  '/languages/',
  '/languages/german/',
  '/programs/',
  '/exams/',
  '/centers/',
  '/centers/pavlovsky-posad/',
  '/teachers/',
  '/about/',
  '/reviews/',
  '/contacts/',
  '/privacy/',
  '/cookies/',
];

for (const path of direct) {
  const response = await fetch(base + path, { redirect: 'manual' });
  const ok = response.status === 200;
  if (!ok) failures += 1;
  console.log(`${ok ? '  OK  ' : ' FAIL '} ${path.padEnd(32)} ${response.status}`);
}

console.log('\n### Несуществующий адрес — 404, а не редирект\n');
{
  const { status } = await trace('/no-such-page-xyz');
  const ok = status === 404;
  if (!ok) failures += 1;
  console.log(`${ok ? '  OK  ' : ' FAIL '} /no-such-page-xyz → ${status}`);
}

console.log(`\n=== Провалено: ${failures} ===`);
process.exitCode = failures > 0 ? 1 : 0;
