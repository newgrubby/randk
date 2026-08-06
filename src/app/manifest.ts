import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

/** Обязательно для статического экспорта: файл собирается один раз при сборке. */
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RandK Center — языковые и образовательные центры',
    short_name: 'RandK Center',
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f4ef',
    theme_color: '#f7f4ef',
    lang: 'ru',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
