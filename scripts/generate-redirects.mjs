/**
 * Генератор конфигураций редиректа для двух площадок.
 *
 * Один источник — `src/config/redirects.data.json` — два выходных файла:
 *
 *  • `public/.htaccess` — Apache на обычном хостинге (REG.RU).
 *    Попадает в `out/` при статическом экспорте.
 *
 *  • `vercel.json` — редиректы на Vercel.
 *    ВАЖНО: файл лежит в репозитории, а не создаётся во время сборки.
 *    Vercel читает конфигурацию ДО запуска build, поэтому сгенерированный
 *    на лету файл был бы прочитан уже слишком поздно.
 *
 * Оба файла помечены как автогенерируемые: править нужно JSON, а не их.
 * Расхождение ловит `npm test` (scripts/validate-redirects.mjs).
 *
 * Запуск: node scripts/generate-redirects.mjs (входит в npm run build)
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  HTACCESS_FILE,
  VERCEL_FILE,
  hasParam,
  isGoneRule,
  loadNormalizedRules,
  root,
} from './lib/redirect-rules.mjs';

/* ============================================================
   Apache
   ============================================================ */

/** `/article_post/:id` → `article_post/([^/]+)` для RewriteRule. */
function toApachePattern(source) {
  return source
    .replace(/^\//, '')
    .replace(/:[a-zA-Z]\w*\*/g, '(.*)')
    .replace(/:[a-zA-Z]\w*/g, '([^/]+)');
}

/** `:id` в цели заменяется на обратную ссылку $1. */
function toApacheTarget(destination) {
  let index = 0;
  return destination.replace(/:[a-zA-Z]\w*\*?/g, () => {
    index += 1;
    return `$${index}`;
  });
}

function buildHtaccess(rules) {
  const redirectRules = rules.filter((rule) => !isGoneRule(rule));
  const goneRules = rules.filter(isGoneRule);
  const lines = [
    '# ============================================================',
    '# RandK Center — конфигурация Apache для статической сборки',
    '#',
    '# ФАЙЛ СГЕНЕРИРОВАН АВТОМАТИЧЕСКИ — не редактируйте вручную.',
    '# Источник правил: src/config/redirects.data.json',
    '# Пересборка:      node scripts/generate-redirects.mjs',
    '# Проверка:        npm test',
    '# ============================================================',
    '',
    '<IfModule mod_dir.c>',
    '  DirectoryIndex index.html',
    '</IfModule>',
    '',
    '<IfModule mod_rewrite.c>',
    '  RewriteEngine On',
    '',
    `  # --- Постоянные редиректы со старых адресов (${redirectRules.length}) ---`,
    '  # Абсолютная canonical-цель одновременно исправляет протокол/host.',
    '  # QSD удаляет старые query-параметры (например album_id), чтобы они',
    '  # не создавали индексируемые дубли. NE сохраняет якоря вроде #faq.',
  ];

  for (const rule of redirectRules) {
    const pattern = toApachePattern(rule.source);
    const target = hasParam(rule.source)
      ? toApacheTarget(rule.normalizedDestination)
      : rule.normalizedDestination;
    const code = rule.permanent ? 'R=301' : 'R=302';
    lines.push(`  RewriteRule ^${pattern}/?$ https://randkcenter.ru${target} [${code},L,NE,QSD]`);
  }

  if (goneRules.length > 0) {
    lines.push(
      '',
      `  # --- Удалённые legacy URL: HTTP 410 Gone (${goneRules.length}) ---`,
      '  # Нерелевантные страницы не перенаправляем на главную: поисковику',
      '  # явно сообщаем, что контент удалён и прямого аналога больше нет.',
    );
    for (const rule of goneRules) {
      const pattern = toApachePattern(rule.source);
      lines.push(`  RewriteRule ^${pattern}/?$ - [R=410,L]`);
    }
  }

  lines.push(
    '',
    '  # --- Canonical HTTPS + non-www + trailing slash за один переход ---',
    '  # REG.RU использует nginx перед Apache. Для HTTPS учитываем',
    '  # X-Forwarded-Proto, иначе Apache может видеть внутренний HTTP',
    '  # и создавать циклический редирект https://randkcenter.ru → itself.',
    '',
    '  # Неправильный host: сразу приводим к HTTPS + non-www.',
    '  RewriteCond %{HTTP_HOST} !^randkcenter\\.ru$ [NC]',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteCond %{REQUEST_URI} !/
    '',
    '  # Метка для immutable-кэша только у хешированных файлов Next.js.',
    '  RewriteRule ^_next/static/ - [E=IMMUTABLE_ASSET:1]',
    '',
    '  # --- Существующие файлы и каталоги отдаём как есть ---',
    '  RewriteCond %{REQUEST_FILENAME} -f [OR]',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteRule ^ - [L]',
    '',
    '  # --- Всё остальное получает реальный статус 404 ---',
    '  RewriteRule ^ - [R=404,L]',
    '</IfModule>',
    '',
    'ErrorDocument 404 /404.html',
    '',
    '# --- Заголовки безопасности ---',
    '<IfModule mod_headers.c>',
    '  Header set X-Content-Type-Options "nosniff"',
    '  Header set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header set X-Frame-Options "SAMEORIGIN"',
    '  Header set Cache-Control "public, max-age=31536000, immutable" env=IMMUTABLE_ASSET',
    '  <FilesMatch "^(?:.*\\.html|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest)$">',
    '    Header set Cache-Control "no-cache"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '# --- Безопасное кеширование нехешированных media assets ---',
    '<IfModule mod_expires.c>',
    '  ExpiresActive On',
    '  ExpiresByType image/svg+xml "access plus 7 days"',
    '  ExpiresByType image/png "access plus 7 days"',
    '  ExpiresByType image/x-icon "access plus 7 days"',
    '  ExpiresByType image/webp "access plus 7 days"',
    '  ExpiresByType image/avif "access plus 7 days"',
    '  ExpiresByType text/html "access plus 0 seconds"',
    '</IfModule>',
    '',
    '# --- MIME-типы для современных assets ---',
    '<IfModule mod_mime.c>',
    '  AddType image/avif .avif',
    '  AddType image/webp .webp',
    '  AddType image/svg+xml .svg',
    '  AddType font/woff2 .woff2',
    '  AddType application/manifest+json .webmanifest',
    '</IfModule>',
    '',
    '# --- Сжатие ---',
    '<IfModule mod_deflate.c>',
    '  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/json',
    '</IfModule>',
    '',
  );

  return lines.join('\n');
}

/* ============================================================
   Vercel
   ============================================================ */

function toVercelRoutePattern(source) {
  return `^${source
    .replace(/:[a-zA-Z]\\w*\\*/g, '(.*)')
    .replace(/:[a-zA-Z]\\w*/g, '([^/]+)')}/?/**
 * Генератор конфигураций редиректа для двух площадок.
 *
 * Один источник — `src/config/redirects.data.json` — два выходных файла:
 *
 *  • `public/.htaccess` — Apache на обычном хостинге (REG.RU).
 *    Попадает в `out/` при статическом экспорте.
 *
 *  • `vercel.json` — редиректы на Vercel.
 *    ВАЖНО: файл лежит в репозитории, а не создаётся во время сборки.
 *    Vercel читает конфигурацию ДО запуска build, поэтому сгенерированный
 *    на лету файл был бы прочитан уже слишком поздно.
 *
 * Оба файла помечены как автогенерируемые: править нужно JSON, а не их.
 * Расхождение ловит `npm test` (scripts/validate-redirects.mjs).
 *
 * Запуск: node scripts/generate-redirects.mjs (входит в npm run build)
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  HTACCESS_FILE,
  VERCEL_FILE,
  hasParam,
  isGoneRule,
  loadNormalizedRules,
  root,
} from './lib/redirect-rules.mjs';

/* ============================================================
   Apache
   ============================================================ */

/** `/article_post/:id` → `article_post/([^/]+)` для RewriteRule. */
function toApachePattern(source) {
  return source
    .replace(/^\//, '')
    .replace(/:[a-zA-Z]\w*\*/g, '(.*)')
    .replace(/:[a-zA-Z]\w*/g, '([^/]+)');
}

/** `:id` в цели заменяется на обратную ссылку $1. */
function toApacheTarget(destination) {
  let index = 0;
  return destination.replace(/:[a-zA-Z]\w*\*?/g, () => {
    index += 1;
    return `$${index}`;
  });
}

function buildHtaccess(rules) {
  const redirectRules = rules.filter((rule) => !isGoneRule(rule));
  const goneRules = rules.filter(isGoneRule);
  const lines = [
    '# ============================================================',
    '# RandK Center — конфигурация Apache для статической сборки',
    '#',
    '# ФАЙЛ СГЕНЕРИРОВАН АВТОМАТИЧЕСКИ — не редактируйте вручную.',
    '# Источник правил: src/config/redirects.data.json',
    '# Пересборка:      node scripts/generate-redirects.mjs',
    '# Проверка:        npm test',
    '# ============================================================',
    '',
    '<IfModule mod_dir.c>',
    '  DirectoryIndex index.html',
    '</IfModule>',
    '',
    '<IfModule mod_rewrite.c>',
    '  RewriteEngine On',
    '',
    `  # --- Постоянные редиректы со старых адресов (${redirectRules.length}) ---`,
    '  # Абсолютная canonical-цель одновременно исправляет протокол/host.',
    '  # QSD удаляет старые query-параметры (например album_id), чтобы они',
    '  # не создавали индексируемые дубли. NE сохраняет якоря вроде #faq.',
  ];

  for (const rule of redirectRules) {
    const pattern = toApachePattern(rule.source);
    const target = hasParam(rule.source)
      ? toApacheTarget(rule.normalizedDestination)
      : rule.normalizedDestination;
    const code = rule.permanent ? 'R=301' : 'R=302';
    lines.push(`  RewriteRule ^${pattern}/?$ https://randkcenter.ru${target} [${code},L,NE,QSD]`);
  }

  if (goneRules.length > 0) {
    lines.push(
      '',
      `  # --- Удалённые legacy URL: HTTP 410 Gone (${goneRules.length}) ---`,
      '  # Нерелевантные страницы не перенаправляем на главную: поисковику',
      '  # явно сообщаем, что контент удалён и прямого аналога больше нет.',
    );
    for (const rule of goneRules) {
      const pattern = toApachePattern(rule.source);
      lines.push(`  RewriteRule ^${pattern}/?$ - [R=410,L]`);
    }
  }

  lines.push(
    '',
    '  # --- Canonical HTTPS + non-www + trailing slash за один переход ---',
    '  # REG.RU использует nginx перед Apache. Для HTTPS учитываем',
    '  # X-Forwarded-Proto, иначе Apache может видеть внутренний HTTP',
    '  # и создавать циклический редирект https://randkcenter.ru → itself.',
    '',
    '  # Неправильный host: сразу приводим к HTTPS + non-www.',
    '  RewriteCond %{HTTP_HOST} !^randkcenter\\.ru$ [NC]',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteCond %{REQUEST_URI} !/
    '',
    '  # Метка для immutable-кэша только у хешированных файлов Next.js.',
    '  RewriteRule ^_next/static/ - [E=IMMUTABLE_ASSET:1]',
    '',
    '  # --- Существующие файлы и каталоги отдаём как есть ---',
    '  RewriteCond %{REQUEST_FILENAME} -f [OR]',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteRule ^ - [L]',
    '',
    '  # --- Всё остальное получает реальный статус 404 ---',
    '  RewriteRule ^ - [R=404,L]',
    '</IfModule>',
    '',
    'ErrorDocument 404 /404.html',
    '',
    '# --- Заголовки безопасности ---',
    '<IfModule mod_headers.c>',
    '  Header set X-Content-Type-Options "nosniff"',
    '  Header set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header set X-Frame-Options "SAMEORIGIN"',
    '  Header set Cache-Control "public, max-age=31536000, immutable" env=IMMUTABLE_ASSET',
    '  <FilesMatch "^(?:.*\\.html|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest)$">',
    '    Header set Cache-Control "no-cache"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '# --- Безопасное кеширование нехешированных media assets ---',
    '<IfModule mod_expires.c>',
    '  ExpiresActive On',
    '  ExpiresByType image/svg+xml "access plus 7 days"',
    '  ExpiresByType image/png "access plus 7 days"',
    '  ExpiresByType image/x-icon "access plus 7 days"',
    '  ExpiresByType image/webp "access plus 7 days"',
    '  ExpiresByType image/avif "access plus 7 days"',
    '  ExpiresByType text/html "access plus 0 seconds"',
    '</IfModule>',
    '',
    '# --- MIME-типы для современных assets ---',
    '<IfModule mod_mime.c>',
    '  AddType image/avif .avif',
    '  AddType image/webp .webp',
    '  AddType image/svg+xml .svg',
    '  AddType font/woff2 .woff2',
    '  AddType application/manifest+json .webmanifest',
    '</IfModule>',
    '',
    '# --- Сжатие ---',
    '<IfModule mod_deflate.c>',
    '  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/json',
    '</IfModule>',
    '',
  );

  return lines.join('\n');
}

/* ============================================================
   Vercel
   ============================================================ */

;
}

function buildVercelConfig(rules) {
  const redirectRules = rules.filter((rule) => !isGoneRule(rule));
  const goneRules = rules.filter(isGoneRule);

  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',

    /*
     * Файл сгенерирован из src/config/redirects.data.json.
     * Правьте JSON и выполняйте `node scripts/generate-redirects.mjs`.
     */
    redirects: redirectRules.map((rule) => ({
      source: rule.source,
      destination: rule.normalizedDestination,
      permanent: rule.permanent,
    })),
    routes: goneRules.map((rule) => ({
      src: toVercelRoutePattern(rule.source),
      status: 410,
    })),
  };
}

/* ============================================================ */

async function main() {
  const rules = await loadNormalizedRules();

  await writeFile(join(root, HTACCESS_FILE), buildHtaccess(rules), 'utf8');
  console.log(`✓ ${HTACCESS_FILE} — ${rules.length} правил`);

  const vercelConfig = buildVercelConfig(rules);
  await writeFile(join(root, VERCEL_FILE), `${JSON.stringify(vercelConfig, null, 2)}\n`, 'utf8');
  console.log(
    `✓ ${VERCEL_FILE} — ${vercelConfig.redirects.length} редиректов, ${vercelConfig.routes.length} Gone`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
,
    '  RewriteRule ^(.+)$ https://randkcenter.ru/$1/ [R=301,L,NE]',
    '',
    '  RewriteCond %{HTTP_HOST} !^randkcenter\\.ru$ [NC]',
    '  RewriteRule ^ https://randkcenter.ru%{REQUEST_URI} [R=301,L,NE]',
    '',
    '  # Настоящий HTTP за nginx: HTTPS уже завершён, когда X-Forwarded-Proto=https.',
    '  RewriteCond %{HTTPS} !=on',
    '  RewriteCond %{HTTP:X-Forwarded-Proto} !https [NC]',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteCond %{REQUEST_URI} !/
    '',
    '  # Метка для immutable-кэша только у хешированных файлов Next.js.',
    '  RewriteRule ^_next/static/ - [E=IMMUTABLE_ASSET:1]',
    '',
    '  # --- Существующие файлы и каталоги отдаём как есть ---',
    '  RewriteCond %{REQUEST_FILENAME} -f [OR]',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteRule ^ - [L]',
    '',
    '  # --- Всё остальное получает реальный статус 404 ---',
    '  RewriteRule ^ - [R=404,L]',
    '</IfModule>',
    '',
    'ErrorDocument 404 /404.html',
    '',
    '# --- Заголовки безопасности ---',
    '<IfModule mod_headers.c>',
    '  Header set X-Content-Type-Options "nosniff"',
    '  Header set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header set X-Frame-Options "SAMEORIGIN"',
    '  Header set Cache-Control "public, max-age=31536000, immutable" env=IMMUTABLE_ASSET',
    '  <FilesMatch "^(?:.*\\.html|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest)$">',
    '    Header set Cache-Control "no-cache"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '# --- Безопасное кеширование нехешированных media assets ---',
    '<IfModule mod_expires.c>',
    '  ExpiresActive On',
    '  ExpiresByType image/svg+xml "access plus 7 days"',
    '  ExpiresByType image/png "access plus 7 days"',
    '  ExpiresByType image/x-icon "access plus 7 days"',
    '  ExpiresByType image/webp "access plus 7 days"',
    '  ExpiresByType image/avif "access plus 7 days"',
    '  ExpiresByType text/html "access plus 0 seconds"',
    '</IfModule>',
    '',
    '# --- MIME-типы для современных assets ---',
    '<IfModule mod_mime.c>',
    '  AddType image/avif .avif',
    '  AddType image/webp .webp',
    '  AddType image/svg+xml .svg',
    '  AddType font/woff2 .woff2',
    '  AddType application/manifest+json .webmanifest',
    '</IfModule>',
    '',
    '# --- Сжатие ---',
    '<IfModule mod_deflate.c>',
    '  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/json',
    '</IfModule>',
    '',
  );

  return lines.join('\n');
}

/* ============================================================
   Vercel
   ============================================================ */

function buildVercelConfig(rules) {
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',

    /*
     * Файл сгенерирован из src/config/redirects.data.json.
     * Правьте JSON и выполняйте `node scripts/generate-redirects.mjs`.
     */
    redirects: rules.map((rule) => ({
      source: rule.source,
      destination: rule.normalizedDestination,
      permanent: rule.permanent,
    })),
  };
}

/* ============================================================ */

async function main() {
  const rules = await loadNormalizedRules();

  await writeFile(join(root, HTACCESS_FILE), buildHtaccess(rules), 'utf8');
  console.log(`✓ ${HTACCESS_FILE} — ${rules.length} правил`);

  const vercelConfig = buildVercelConfig(rules);
  await writeFile(join(root, VERCEL_FILE), `${JSON.stringify(vercelConfig, null, 2)}\n`, 'utf8');
  console.log(`✓ ${VERCEL_FILE} — ${vercelConfig.redirects.length} правил`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
,
    '  RewriteRule ^(.+)$ https://randkcenter.ru/$1/ [R=301,L,NE]',
    '',
    '  RewriteCond %{HTTPS} !=on',
    '  RewriteCond %{HTTP:X-Forwarded-Proto} !https [NC]',
    '  RewriteRule ^ https://randkcenter.ru%{REQUEST_URI} [R=301,L,NE]',
    '',
    '  # На canonical host нормализуем существующие каталоги без цепочек.',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteCond %{REQUEST_URI} !/
    '',
    '  # Метка для immutable-кэша только у хешированных файлов Next.js.',
    '  RewriteRule ^_next/static/ - [E=IMMUTABLE_ASSET:1]',
    '',
    '  # --- Существующие файлы и каталоги отдаём как есть ---',
    '  RewriteCond %{REQUEST_FILENAME} -f [OR]',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteRule ^ - [L]',
    '',
    '  # --- Всё остальное получает реальный статус 404 ---',
    '  RewriteRule ^ - [R=404,L]',
    '</IfModule>',
    '',
    'ErrorDocument 404 /404.html',
    '',
    '# --- Заголовки безопасности ---',
    '<IfModule mod_headers.c>',
    '  Header set X-Content-Type-Options "nosniff"',
    '  Header set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header set X-Frame-Options "SAMEORIGIN"',
    '  Header set Cache-Control "public, max-age=31536000, immutable" env=IMMUTABLE_ASSET',
    '  <FilesMatch "^(?:.*\\.html|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest)$">',
    '    Header set Cache-Control "no-cache"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '# --- Безопасное кеширование нехешированных media assets ---',
    '<IfModule mod_expires.c>',
    '  ExpiresActive On',
    '  ExpiresByType image/svg+xml "access plus 7 days"',
    '  ExpiresByType image/png "access plus 7 days"',
    '  ExpiresByType image/x-icon "access plus 7 days"',
    '  ExpiresByType image/webp "access plus 7 days"',
    '  ExpiresByType image/avif "access plus 7 days"',
    '  ExpiresByType text/html "access plus 0 seconds"',
    '</IfModule>',
    '',
    '# --- MIME-типы для современных assets ---',
    '<IfModule mod_mime.c>',
    '  AddType image/avif .avif',
    '  AddType image/webp .webp',
    '  AddType image/svg+xml .svg',
    '  AddType font/woff2 .woff2',
    '  AddType application/manifest+json .webmanifest',
    '</IfModule>',
    '',
    '# --- Сжатие ---',
    '<IfModule mod_deflate.c>',
    '  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/json',
    '</IfModule>',
    '',
  );

  return lines.join('\n');
}

/* ============================================================
   Vercel
   ============================================================ */

function buildVercelConfig(rules) {
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',

    /*
     * Файл сгенерирован из src/config/redirects.data.json.
     * Правьте JSON и выполняйте `node scripts/generate-redirects.mjs`.
     */
    redirects: rules.map((rule) => ({
      source: rule.source,
      destination: rule.normalizedDestination,
      permanent: rule.permanent,
    })),
  };
}

/* ============================================================ */

async function main() {
  const rules = await loadNormalizedRules();

  await writeFile(join(root, HTACCESS_FILE), buildHtaccess(rules), 'utf8');
  console.log(`✓ ${HTACCESS_FILE} — ${rules.length} правил`);

  const vercelConfig = buildVercelConfig(rules);
  await writeFile(join(root, VERCEL_FILE), `${JSON.stringify(vercelConfig, null, 2)}\n`, 'utf8');
  console.log(`✓ ${VERCEL_FILE} — ${vercelConfig.redirects.length} правил`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
,
    '  RewriteRule ^(.+)$ /$1/ [R=301,L,NE]',
    '',
    '  # Метка для immutable-кэша только у хешированных файлов Next.js.',
    '  RewriteRule ^_next/static/ - [E=IMMUTABLE_ASSET:1]',
    '',
    '  # --- Существующие файлы и каталоги отдаём как есть ---',
    '  RewriteCond %{REQUEST_FILENAME} -f [OR]',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteRule ^ - [L]',
    '',
    '  # --- Всё остальное получает реальный статус 404 ---',
    '  RewriteRule ^ - [R=404,L]',
    '</IfModule>',
    '',
    'ErrorDocument 404 /404.html',
    '',
    '# --- Заголовки безопасности ---',
    '<IfModule mod_headers.c>',
    '  Header set X-Content-Type-Options "nosniff"',
    '  Header set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header set X-Frame-Options "SAMEORIGIN"',
    '  Header set Cache-Control "public, max-age=31536000, immutable" env=IMMUTABLE_ASSET',
    '  <FilesMatch "^(?:.*\\.html|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest)$">',
    '    Header set Cache-Control "no-cache"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '# --- Безопасное кеширование нехешированных media assets ---',
    '<IfModule mod_expires.c>',
    '  ExpiresActive On',
    '  ExpiresByType image/svg+xml "access plus 7 days"',
    '  ExpiresByType image/png "access plus 7 days"',
    '  ExpiresByType image/x-icon "access plus 7 days"',
    '  ExpiresByType image/webp "access plus 7 days"',
    '  ExpiresByType image/avif "access plus 7 days"',
    '  ExpiresByType text/html "access plus 0 seconds"',
    '</IfModule>',
    '',
    '# --- MIME-типы для современных assets ---',
    '<IfModule mod_mime.c>',
    '  AddType image/avif .avif',
    '  AddType image/webp .webp',
    '  AddType image/svg+xml .svg',
    '  AddType font/woff2 .woff2',
    '  AddType application/manifest+json .webmanifest',
    '</IfModule>',
    '',
    '# --- Сжатие ---',
    '<IfModule mod_deflate.c>',
    '  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/json',
    '</IfModule>',
    '',
  );

  return lines.join('\n');
}

/* ============================================================
   Vercel
   ============================================================ */

function buildVercelConfig(rules) {
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',

    /*
     * Файл сгенерирован из src/config/redirects.data.json.
     * Правьте JSON и выполняйте `node scripts/generate-redirects.mjs`.
     */
    redirects: rules.map((rule) => ({
      source: rule.source,
      destination: rule.normalizedDestination,
      permanent: rule.permanent,
    })),
  };
}

/* ============================================================ */

async function main() {
  const rules = await loadNormalizedRules();

  await writeFile(join(root, HTACCESS_FILE), buildHtaccess(rules), 'utf8');
  console.log(`✓ ${HTACCESS_FILE} — ${rules.length} правил`);

  const vercelConfig = buildVercelConfig(rules);
  await writeFile(join(root, VERCEL_FILE), `${JSON.stringify(vercelConfig, null, 2)}\n`, 'utf8');
  console.log(`✓ ${VERCEL_FILE} — ${vercelConfig.redirects.length} правил`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
