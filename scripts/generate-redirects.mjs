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
    'Options -Indexes',
    'DirectoryIndex index.html',
    '',
    '<IfModule mod_rewrite.c>',
    '  RewriteEngine On',
    '',
    `  # --- Постоянные редиректы со старых адресов (${rules.length}) ---`,
    '  # Цели указаны сразу со слэшем: страницы лежат в about/index.html,',
    '  # и без слэша получился бы лишний переход.',
  ];

  for (const rule of rules) {
    const pattern = toApachePattern(rule.source);
    const target = hasParam(rule.source)
      ? toApacheTarget(rule.normalizedDestination)
      : rule.normalizedDestination;
    const code = rule.permanent ? 'R=301' : 'R=302';
    lines.push(`  RewriteRule ^${pattern}/?$ ${target} [${code},L]`);
  }

  lines.push(
    '',
    '  # --- Существующие файлы и каталоги отдаём как есть ---',
    '  RewriteCond %{REQUEST_FILENAME} -f [OR]',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteRule ^ - [L]',
    '',
    '  # --- Всё остальное — страница 404 ---',
    '  RewriteRule ^ /404.html [L]',
    '</IfModule>',
    '',
    'ErrorDocument 404 /404.html',
    '',
    '# --- Заголовки безопасности ---',
    '<IfModule mod_headers.c>',
    '  Header set X-Content-Type-Options "nosniff"',
    '  Header set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header set X-Frame-Options "SAMEORIGIN"',
    '</IfModule>',
    '',
    '# --- Кэширование статики ---',
    '<IfModule mod_expires.c>',
    '  ExpiresActive On',
    '  ExpiresByType text/css "access plus 1 year"',
    '  ExpiresByType application/javascript "access plus 1 year"',
    '  ExpiresByType image/svg+xml "access plus 6 months"',
    '  ExpiresByType image/webp "access plus 6 months"',
    '  ExpiresByType image/avif "access plus 6 months"',
    '  ExpiresByType font/woff2 "access plus 1 year"',
    '  ExpiresByType text/html "access plus 0 seconds"',
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
