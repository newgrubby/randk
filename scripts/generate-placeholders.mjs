/**
 * Генератор временных изображений.
 *
 * ЗАЧЕМ ТАК: у проекта пока нет фотографий от клиента, а ставить случайные
 * стоковые фото людей нельзя — это создаёт ложное впечатление о центре.
 * Поэтому мы генерируем нейтральные редакционные композиции в фирменной
 * палитре: они держат вёрстку, задают ритм и не выдают себя за реальность.
 *
 * Запуск:  node scripts/generate-placeholders.mjs
 * После получения фотографий от клиента файлы просто заменяются
 * на реальные (те же пути) — см. /docs/IMAGE_SOURCES.md.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

const palette = {
  paper: '#f7f4ef',
  sand: '#efe9e0',
  clay: '#e2d8ca',
  ink: '#241f1d',
  accent: '#ad1f2b',
  accentDeep: '#7d1119',
};

/** Детерминированный ГПСЧ — композиции стабильны между сборками. */
function rng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

/**
 * Абстрактная редакционная композиция: слоистые арки, линейная сетка,
 * один красный акцент. Никаких людей, логотипов и надписей.
 */
function composition({ width, height, seed, mood = 'light' }) {
  const random = rng(seed);
  const base = mood === 'dark' ? palette.ink : palette.sand;
  const layers = [];

  // Крупные арки — «страницы» и «своды», отсылка к учебной среде
  const archCount = 3 + Math.floor(random() * 2);
  for (let i = 0; i < archCount; i += 1) {
    const w = width * (0.34 + random() * 0.34);
    const x = random() * (width - w * 0.4) - w * 0.15;
    const h = height * (0.55 + random() * 0.5);
    const y = height - h;
    const fill = i % 2 === 0 ? palette.clay : palette.paper;
    const opacity = (0.5 + random() * 0.35).toFixed(2);
    layers.push(
      `<path d="M${x} ${height} L${x} ${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${
        y + w / 2
      } L${x + w} ${height} Z" fill="${fill}" opacity="${opacity}"/>`,
    );
  }

  // Тонкая линейная сетка — «строки тетради»
  const lines = [];
  const step = height / 14;
  for (let y = step; y < height; y += step) {
    lines.push(`<path d="M0 ${y.toFixed(1)} H${width}"/>`);
  }

  // Красный акцент: одна дуга и один круг
  const accentR = Math.min(width, height) * (0.16 + random() * 0.12);
  const accentX = width * (0.55 + random() * 0.3);
  const accentY = height * (0.28 + random() * 0.25);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="presentation">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${palette.paper}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${base}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="frame"><rect width="${width}" height="${height}"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="${width}" height="${height}" fill="${base}"/>
    ${layers.join('\n    ')}
    <g stroke="${palette.ink}" stroke-width="0.75" opacity="0.1" fill="none">
      ${lines.join('\n      ')}
    </g>
    <path d="M${accentX - accentR} ${accentY} A${accentR} ${accentR} 0 0 1 ${
      accentX + accentR
    } ${accentY}" fill="none" stroke="${palette.accent}" stroke-width="${(accentR * 0.13).toFixed(
      1,
    )}" stroke-linecap="round"/>
    <circle cx="${(accentX - accentR * 0.72).toFixed(1)}" cy="${(accentY + accentR * 0.95).toFixed(
      1,
    )}" r="${(accentR * 0.17).toFixed(1)}" fill="${palette.accentDeep}" opacity="0.85"/>
    <rect width="${width}" height="${height}" fill="url(#wash)"/>
  </g>
</svg>`;
}

const targets = [
  { path: 'images/hero.svg', width: 1200, height: 900, seed: 11 },
  { path: 'images/about.svg', width: 1000, height: 750, seed: 71 },

  { path: 'images/programs/languages.svg', width: 800, height: 600, seed: 21 },
  { path: 'images/programs/english.svg', width: 800, height: 600, seed: 22 },
  { path: 'images/programs/exams.svg', width: 800, height: 600, seed: 23 },
  { path: 'images/programs/school.svg', width: 800, height: 600, seed: 24 },
  { path: 'images/programs/preschool.svg', width: 800, height: 600, seed: 25 },
  { path: 'images/programs/development.svg', width: 800, height: 600, seed: 26 },
  { path: 'images/programs/individual.svg', width: 800, height: 600, seed: 27 },

  { path: 'images/ages/preschool.svg', width: 600, height: 720, seed: 31 },
  { path: 'images/ages/primary.svg', width: 600, height: 720, seed: 32 },
  { path: 'images/ages/teens.svg', width: 600, height: 720, seed: 33 },
  { path: 'images/ages/adults.svg', width: 600, height: 720, seed: 34 },

  { path: 'images/branches/orekhovo-zuevo.svg', width: 900, height: 640, seed: 41 },
  { path: 'images/branches/pavlovsky-posad.svg', width: 900, height: 640, seed: 42 },
  { path: 'images/branches/elektrostal.svg', width: 900, height: 640, seed: 43 },
];

async function main() {
  for (const target of targets) {
    const file = join(publicDir, target.path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, composition(target), 'utf8');
    console.log(`✓ ${target.path}`);
  }

  // OG-изображение: растр, потому что часть соцсетей не рендерит SVG.
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <rect width="1200" height="630" fill="${palette.paper}"/>
    <path d="M760 630 L760 300 A190 190 0 0 1 1140 300 L1140 630 Z" fill="${palette.clay}" opacity="0.7"/>
    <path d="M900 630 L900 380 A120 120 0 0 1 1140 380 L1140 630 Z" fill="${palette.sand}"/>
    <path d="M120 470 A70 70 0 0 1 260 470" fill="none" stroke="${palette.accent}" stroke-width="10" stroke-linecap="round"/>
    <text x="96" y="250" font-family="Georgia, 'Times New Roman', serif" font-size="86" fill="${palette.accent}">RandK</text>
    <text x="100" y="300" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="12" fill="${palette.ink}">CENTER</text>
    <text x="96" y="378" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="${palette.ink}" opacity="0.72">Языковые и образовательные центры</text>
    <text x="96" y="416" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="${palette.ink}" opacity="0.72">для детей и взрослых</text>
  </svg>`;

  await sharp(Buffer.from(ogSvg)).png().toFile(join(publicDir, 'og.png'));
  console.log('✓ og.png');

  // Favicon-набор из монограммы
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <rect width="64" height="64" rx="14" fill="${palette.accent}"/>
    <text x="32" y="44" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="36" fill="#fff">R</text>
  </svg>`;

  await writeFile(join(publicDir, 'icon.svg'), iconSvg, 'utf8');
  await sharp(Buffer.from(iconSvg)).resize(180, 180).png().toFile(join(publicDir, 'apple-icon.png'));
  console.log('✓ icon.svg, apple-icon.png');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
