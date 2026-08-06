import type { NextConfig } from 'next';
import { redirects as legacyRedirects } from './src/config/redirects';

/**
 * Два режима сборки — переключаются переменной BUILD_TARGET.
 *
 *  • BUILD_TARGET=export (по умолчанию)
 *    Полностью статический сайт в папке `out/`. Подходит для обычного
 *    Linux-хостинга (REG.RU и подобные), Node.js на сервере не нужен.
 *    Стало возможно после удаления приёма заявок: API-маршрутов в проекте
 *    больше нет, серверный рендеринг по запросу тоже не требуется.
 *    Ограничения режима: не работают `redirects()` (их выполняет Apache
 *    через public/.htaccess) и встроенная оптимизация изображений.
 *
 *  • BUILD_TARGET=standalone
 *    Обычное Next.js-приложение для VPS или Node.js-хостинга.
 *    Работают редиректы средствами Next и оптимизация изображений.
 *
 * Подробное сравнение: /docs/HOSTING_OPTIONS.md
 */
const buildTarget = process.env.BUILD_TARGET ?? 'export';
const isStaticExport = buildTarget === 'export';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: isStaticExport ? 'export' : 'standalone',

  /**
   * Статический хостинг отдаёт файлы по путям вида /about/index.html,
   * поэтому в режиме экспорта включаем завершающий слэш — иначе часть
   * серверов вернёт 404 на /about.
   */
  trailingSlash: isStaticExport,

  images: {
    formats: ['image/avif', 'image/webp'],
    /*
     * В статическом экспорте оптимизатор изображений недоступен: он
     * требует серверного рантайма. Изображения отдаются как есть, поэтому
     * исходники должны быть подготовлены заранее (см. docs/IMAGE_ASSETS.md).
     */
    unoptimized: isStaticExport,
  },

  ...(isStaticExport
    ? {}
    : {
        async redirects() {
          return legacyRedirects.map((rule) => ({
            source: rule.source,
            destination: rule.destination,
            permanent: rule.permanent,
          }));
        },
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
