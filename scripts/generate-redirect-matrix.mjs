/** Генерирует проверяемую SEO-матрицу из единственного источника redirect rules. */

import { access, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { format } from 'prettier';
import {
  comparablePath,
  hasParam,
  isGoneRule,
  loadNormalizedRules,
  root,
} from './lib/redirect-rules.mjs';

const rules = await loadNormalizedRules();
const redirectRules = rules.filter((rule) => !isGoneRule(rule));
const sources = new Set(redirectRules.map((rule) => comparablePath(rule.source)));
const lines = [
  '# Legacy redirect validation matrix',
  '',
  '> Автоматически сгенерировано командой `npm run audit:redirects` из `src/config/redirects.data.json` и текущей папки `out/`.',
  '',
  '| source | expected destination | redirect status | final status | chain count |',
  '|---|---|---:|---:|---:|',
];

let failures = 0;
for (const rule of rules) {
  const probe = rule.source.replace(/:[a-zA-Z]\w*\*?/g, '12345');

  if (isGoneRule(rule)) {
    lines.push(`| \`${probe}\` | — | — | 410 | 0 |`);
    continue;
  }

  const destinationPath = comparablePath(rule.normalizedDestination);
  const destinationDir =
    destinationPath === '/' ? join(root, 'out') : join(root, 'out', destinationPath);
  let finalStatus = 200;
  try {
    await access(join(destinationDir, 'index.html'));
  } catch {
    finalStatus = 404;
    failures += 1;
  }

  const chainCount = sources.has(destinationPath) ? 2 : 1;
  if (chainCount !== 1 || !rule.permanent || hasParam(rule.destination)) failures += 1;
  lines.push(
    `| \`${probe}\` | \`${rule.normalizedDestination}\` | ${rule.permanent ? 301 : 302} | ${finalStatus} | ${chainCount} |`,
  );
}

lines.push('', `Всего правил: **${rules.length}**. Ошибок: **${failures}**.`, '');
const markdown = await format(lines.join('\n'), { parser: 'markdown' });
await writeFile(join(root, 'docs', 'REDIRECT_VALIDATION_MATRIX.md'), markdown, 'utf8');
console.log(`✓ docs/REDIRECT_VALIDATION_MATRIX.md — ${rules.length} правил, ошибок: ${failures}`);
process.exitCode = failures > 0 ? 1 : 0;
