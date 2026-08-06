/**
 * Генератор public/.htaccess для статического хостинга (Apache).
 *
 * В режиме статического экспорта Next.js не может выполнять редиректы —
 * их делает веб-сервер. Файл собирается из того же списка правил
 * (`src/config/redirects.ts`), что и редиректы standalone-режима,
 * поэтому два режима не могут разойтись.
 *
 * Запуск: node scripts/generate-htaccess.mjs
 * Выполняется автоматически в npm run build.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Правила читаются из TypeScript-файла регулярным разбором, чтобы не
 * тянуть в сборку компилятор: формат объектов в нём фиксированный.
 */
async function readRules() {
  const source = await readFile(join(root, 'src/config/redirects.ts'), 'utf8');
  const pattern =
    /\{\s*source:\s*'([^']+)',\s*destination:\s*'([^']+)',\s*permanent:\s*(true|false)/g;

  const rules = [];
  let match;
  while ((match = pattern.exec(source)) !== null) {
    rules.push({ source: match[1], destination: match[2], permanent: match[3] === 'true' });
  }
  return rules;
}

/** `/article_post/:id` → `/article_post/(.+)` для RewriteRule. */
function toApachePattern(source) {
  return source.replace(/:[a-zA-Z]+\*/g, '(.*)').replace(/:[a-zA-Z]+/g, '([^/]+)');
}

function toApacheTarget(destination, hadParam) {
  return hadParam ? destination.replace(/:[a-zA-Z]+\*?/g, '$1') : destination;
}

async function main() {
  const rules = await readRules();

  const lines = [
    '# ============================================================',
    '# RandK Center — конфигурация Apache для статической сборки',
    '#',
    '# ФАЙЛ СГЕНЕРИРОВАН АВТОМАТИЧЕСКИ — не редактируйте вручную.',
    '# Источник правил: src/config/redirects.ts',
    '# Пересборка: node scripts/generate-htaccess.mjs',
    '# ============================================================',
    '',
    'Options -Indexes',
    'DirectoryIndex index.html',
    '',
    '<IfModule mod_rewrite.c>',
    '  RewriteEngine On',
    '',
    '  # --- 301-редиректы со старых адресов ---',
  ];

  for (const rule of rules) {
    const hasParam = /:[a-zA-Z]+/.test(rule.source);
    const pattern = toApachePattern(rule.source).replace(/^\//, '');
    const target = toApacheTarget(rule.destination, hasParam);
    const code = rule.permanent ? 'R=301' : 'R=302';
    lines.push(`  RewriteRule ^${pattern}/?$ ${target} [${code},L]`);
  }

  lines.push(
    '',
    '  # --- Статические файлы отдаём как есть ---',
    '  RewriteCond %{REQUEST_FILENAME} -f [OR]',
    '  RewriteCond %{REQUEST_FILENAME} -d',
    '  RewriteRule ^ - [L]',
    '',
    '  # --- Красивые адреса: /about → /about/index.html ---',
    '  RewriteCond %{REQUEST_FILENAME}/index.html -f',
    '  RewriteRule ^(.*)$ /$1/index.html [L]',
    '',
    '  # --- Всё остальное — страница 404 ---',
    '  RewriteCond %{REQUEST_FILENAME} !-f',
    '  RewriteCond %{REQUEST_FILENAME} !-d',
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

  await writeFile(join(root, 'public/.htaccess'), lines.join('\n'), 'utf8');
  console.log(`✓ public/.htaccess — ${rules.length} правил редиректа`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
