import { Inter, Playfair_Display } from 'next/font/google';

/**
 * Типографическая пара проекта.
 *
 * Playfair Display — акцентный serif с высоким контрастом штриха.
 * Даёт «редакционное» звучание заголовков и поддерживает кириллицу.
 *
 * Inter — нейтральный гротеск для интерфейса и основного текста.
 *
 * Оба шрифта подключены через next/font: самохостинг, preload,
 * `display: swap` и отсутствие layout shift за счёт fallback-метрик.
 */

export const fontDisplay = Playfair_Display({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

export const fontBody = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
});
