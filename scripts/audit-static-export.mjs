/**
 * Полный read-only аудит папки out/ после `next build`.
 * Запуск: npm run audit:export
 */

import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'out');
const productionOrigin = 'https://randkcenter.ru';
const legalNoIndex = new Set(['/privacy/', '/cookies/']);
const requiredRootEntries = [
  '.htaccess',
  'index.html',
  '404.html',
  '_next',
  'images',
  'favicon.ico',
  'icon.svg',
  'apple-icon.png',
  'manifest.webmanifest',
  'sitemap.xml',
  'robots.txt',
];

let failures = 0;

function check(label, ok, detail = '') {
  if (!ok) failures += 1;
  console.log(`${ok ? '  OK  ' : ' FAIL '} ${label}${detail ? ` → ${detail}` : ''}`);
}

function canonicalForRoute(route) {
  return `${productionOrigin}${route}`;
}

function tagAttributes(tag) {
  return new Map(
    [...tag.matchAll(/([\w:-]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [
      match[1].toLowerCase(),
      match[2] ?? match[3] ?? '',
    ]),
  );
}

async function walkFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(path)));
    else files.push(path);
  }
  return files;
}

const files = await walkFiles(outDir);
const relativeFiles = files.map((file) => relative(outDir, file).split(sep).join('/'));
const exactEntries = new Set();
for (const file of relativeFiles) {
  const parts = file.split('/');
  for (let i = 1; i <= parts.length; i += 1) exactEntries.add(parts.slice(0, i).join('/'));
}

console.log('### Обязательная структура out/');
for (const entry of requiredRootEntries) {
  check(entry, exactEntries.has(entry), exactEntries.has(entry) ? '' : 'отсутствует');
}

const routeFiles = relativeFiles
  .filter((file) => file === 'index.html' || file.endsWith('/index.html'))
  .filter((file) => !file.startsWith('_next/') && !file.startsWith('404/'));
const routes = routeFiles
  .map((file) => (file === 'index.html' ? '/' : `/${file.slice(0, -'index.html'.length)}`))
  .sort();

const routeRows = [];
const titles = new Map();
const descriptions = new Map();
const localReferences = new Set();

console.log('\n### HTML, canonical, H1 и indexability');
for (const route of routes) {
  const file = route === '/' ? join(outDir, 'index.html') : join(outDir, route, 'index.html');
  const html = await readFile(file, 'utf8');
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => tagAttributes(match[0]));
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => tagAttributes(match[0]));
  const canonicals = links.filter((attrs) => attrs.get('rel') === 'canonical');
  const canonical = canonicals[0]?.get('href') ?? '';
  const robots = metas.find((attrs) => attrs.get('name') === 'robots')?.get('content') ?? '';
  const description =
    metas.find((attrs) => attrs.get('name') === 'description')?.get('content') ?? '';
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const shouldNoIndex = legalNoIndex.has(route);
  const isNoIndex = /(?:^|,)\s*noindex\b/i.test(robots);
  const canonicalOk = canonicals.length === 1 && canonical === canonicalForRoute(route);
  const indexabilityOk = shouldNoIndex === isNoIndex;
  const ok =
    canonicalOk && h1Count === 1 && Boolean(title) && Boolean(description) && indexabilityOk;

  check(
    route,
    ok,
    `canonical=${canonical || '—'}; h1=${h1Count}; ${isNoIndex ? 'noindex,follow' : 'index,follow'}`,
  );
  routeRows.push({
    route,
    canonical,
    indexability: isNoIndex ? 'noindex, follow' : 'index, follow',
  });

  if (!shouldNoIndex) {
    titles.set(title, [...(titles.get(title) ?? []), route]);
    descriptions.set(description, [...(descriptions.get(description) ?? []), route]);
  }

  for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)) {
    if (match[1]) localReferences.add(decodeURIComponent(match[1]));
  }
  for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const url = candidate.trim().split(/\s+/, 1)[0];
      if (url?.startsWith('/')) localReferences.add(decodeURIComponent(url));
    }
  }
}

const duplicateTitles = [...titles].filter(([title, usedBy]) => title && usedBy.length > 1);
const duplicateDescriptions = [...descriptions].filter(
  ([description, usedBy]) => description && usedBy.length > 1,
);
check(
  'уникальные title indexable-страниц',
  duplicateTitles.length === 0,
  JSON.stringify(duplicateTitles),
);
check(
  'уникальные description indexable-страниц',
  duplicateDescriptions.length === 0,
  JSON.stringify(duplicateDescriptions),
);

console.log('\n### Sitemap и robots');
const sitemap = await readFile(join(outDir, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
const expectedSitemapUrls = routeRows
  .filter((row) => row.indexability === 'index, follow')
  .map((row) => canonicalForRoute(row.route))
  .sort();
check(
  'sitemap содержит только indexable routes',
  JSON.stringify(sitemapUrls) === JSON.stringify(expectedSitemapUrls),
);
check('sitemap без фиктивного lastModified', !sitemap.includes('<lastmod>'));
check(
  'sitemap использует production host',
  sitemapUrls.every((url) => url.startsWith(productionOrigin)),
);

const robots = await readFile(join(outDir, 'robots.txt'), 'utf8');
check('robots разрешает crawl', /Allow:\s*\//i.test(robots));
check('robots указывает production sitemap', robots.includes(`${productionOrigin}/sitemap.xml`));
check('robots не блокирует assets', !/Disallow:\s*\/(?:_next|images)/i.test(robots));

console.log('\n### Assets, case sensitivity и production hygiene');
for (const width of [480, 640, 768, 960, 1280, 1600]) {
  for (const extension of ['avif', 'webp']) {
    const asset = `images/generated/hero/hero-main-${width}.${extension}`;
    check(asset, exactEntries.has(asset));
  }
}
const homeHtml = await readFile(join(outDir, 'index.html'), 'utf8');
check('hero содержит AVIF srcset', /<source[^>]+type="image\/avif"[^>]+srcset=/i.test(homeHtml));
check('hero содержит WebP fallback', /<source[^>]+type="image\/webp"[^>]+srcset=/i.test(homeHtml));

const missingOrWrongCase = [...localReferences]
  .map((url) => url.replace(/^\/+|\/+$/g, ''))
  .filter(Boolean)
  .filter((path) => !exactEntries.has(path));
check(
  'локальные ссылки совпадают с регистром файлов/каталогов',
  missingOrWrongCase.length === 0,
  missingOrWrongCase.join(', '),
);

const searchable = files.filter((file) => /\.(?:html|xml|txt|json|js|webmanifest)$/i.test(file));
const forbidden = [];
const forbiddenPatterns = [
  { label: 'Vercel URL', pattern: /https?:\/\/[^\s"']*vercel\.app/i },
  { label: 'localhost URL', pattern: /https?:\/\/localhost(?::\d+)?/i },
  { label: 'удалённый офис', pattern: /Большая Покровская|Покровская, д\. 41/i },
];
for (const file of searchable) {
  const content = await readFile(file, 'utf8');
  for (const { label, pattern } of forbiddenPatterns) {
    if (pattern.test(content)) forbidden.push(`${relative(outDir, file)}: ${label}`);
  }
}
check('нет Vercel/localhost/удалённого офиса в out/', forbidden.length === 0, forbidden.join('; '));

const htaccess = await readFile(join(outDir, '.htaccess'), 'utf8');
for (const marker of [
  'https://randkcenter.ru',
  'ErrorDocument 404 /404.html',
  '[R=404,L]',
  'image/avif .avif',
  'image/webp .webp',
  'font/woff2 .woff2',
  'application/manifest+json .webmanifest',
  'IMMUTABLE_ASSET',
  '<IfModule mod_deflate.c>',
]) {
  check(`.htaccess: ${marker}`, htaccess.includes(marker));
}
check('.htaccess не включает HSTS', !/Strict-Transport-Security/i.test(htaccess));

console.log('\n### Route matrix');
console.log('| route | expected HTTP | artifact HTTP | canonical | indexability |');
console.log('|---|---:|---:|---|---|');
for (const row of routeRows) {
  console.log(`| ${row.route} | 200 | 200 | ${row.canonical} | ${row.indexability} |`);
}

console.log(`\n=== Routes: ${routes.length}; failures: ${failures} ===`);
process.exitCode = failures > 0 ? 1 : 0;
