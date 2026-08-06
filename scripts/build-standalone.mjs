/**
 * Сборка в режиме standalone (для VPS или Node.js-хостинга).
 *
 * Отдельный скрипт, а не `BUILD_TARGET=standalone next build` в package.json:
 * такая запись не работает в Windows-оболочках, а тянуть cross-env ради
 * одной переменной — лишняя зависимость.
 *
 * Запуск: npm run build:standalone
 */

import { spawn } from 'node:child_process';

const child = spawn('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BUILD_TARGET: 'standalone' },
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
