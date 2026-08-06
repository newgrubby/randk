/**
 * Генератор временных изображений.
 *
 * ЗАЧЕМ: у проекта нет фотографий от клиента. Ставить стоковые фото людей
 * нельзя — посетитель воспримет их как снимки реальных классов RandK, а это
 * ложное впечатление о центре (и отдельный юридический вопрос, когда на фото
 * дети). Поэтому изображения генерируются: они держат композицию и ритм,
 * не притворяясь реальностью.
 *
 * Три типа композиций:
 *  • editorial — абстрактные арки и линии для программ, возрастов, hero;
 *  • language — то же плюс крупный код языка;
 *  • office — фирменная карточка с городом, адресом и линиями карты.
 *    Фасады и интерьеры НЕ рисуются: выдавать сгенерированное помещение
 *    за реальный офис недопустимо.
 *
 * Запуск: node scripts/generate-placeholders.mjs
 * Замена на реальные фото: тот же путь, см. docs/IMAGE_ASSETS.md
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

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Абстрактная редакционная композиция: слоистые арки, сетка, красный акцент. */
function editorial({ width, height, seed, badge = null }) {
  const random = rng(seed);
  const layers = [];

  const archCount = 3 + Math.floor(random() * 2);
  for (let i = 0; i < archCount; i += 1) {
    const w = width * (0.34 + random() * 0.34);
    const x = random() * (width - w * 0.4) - w * 0.15;
    const h = height * (0.55 + random() * 0.5);
    const y = height - h;
    const fill = i % 2 === 0 ? palette.clay : palette.paper;
    const opacity = (0.5 + random() * 0.35).toFixed(2);
    layers.push(
      `<path d="M${x} ${height} L${x} ${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L${x + w} ${height} Z" fill="${fill}" opacity="${opacity}"/>`,
    );
  }

  const lines = [];
  const step = height / 14;
  for (let y = step; y < height; y += step) {
    lines.push(`<path d="M0 ${y.toFixed(1)} H${width}"/>`);
  }

  const accentR = Math.min(width, height) * (0.16 + random() * 0.12);
  const accentX = width * (0.55 + random() * 0.3);
  const accentY = height * (0.28 + random() * 0.25);

  const badgeMarkup = badge
    ? `<text x="${(width * 0.08).toFixed(0)}" y="${(height * 0.88).toFixed(0)}" font-family="Georgia, 'Times New Roman', serif" font-size="${(Math.min(width, height) * 0.26).toFixed(0)}" fill="${palette.accent}" opacity="0.28">${escapeXml(badge)}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="presentation">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${palette.paper}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${palette.sand}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="frame"><rect width="${width}" height="${height}"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="${width}" height="${height}" fill="${palette.sand}"/>
    ${layers.join('\n    ')}
    <g stroke="${palette.ink}" stroke-width="0.75" opacity="0.1" fill="none">
      ${lines.join('\n      ')}
    </g>
    <path d="M${accentX - accentR} ${accentY} A${accentR} ${accentR} 0 0 1 ${accentX + accentR} ${accentY}" fill="none" stroke="${palette.accent}" stroke-width="${(accentR * 0.13).toFixed(1)}" stroke-linecap="round"/>
    <circle cx="${(accentX - accentR * 0.72).toFixed(1)}" cy="${(accentY + accentR * 0.95).toFixed(1)}" r="${(accentR * 0.17).toFixed(1)}" fill="${palette.accentDeep}" opacity="0.85"/>
    <rect width="${width}" height="${height}" fill="url(#wash)"/>
    ${badgeMarkup}
  </g>
</svg>`;
}

/**
 * Карточка офиса: город, адрес и абстрактные линии карты.
 * Намеренно не изображает здание — это была бы выдумка о реальном месте.
 */
function officeCard({ width, height, seed, city, address }) {
  const random = rng(seed);
  const roads = [];
  for (let i = 0; i < 7; i += 1) {
    const y = height * random();
    const x = width * random();
    roads.push(`<path d="M-20 ${y.toFixed(0)} H${width + 20}"/>`);
    roads.push(`<path d="M${x.toFixed(0)} -20 V${height + 20}"/>`);
  }

  const pinX = width * 0.72;
  const pinY = height * 0.42;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="presentation">
  <rect width="${width}" height="${height}" fill="${palette.sand}"/>
  <g stroke="${palette.ink}" stroke-width="1" opacity="0.12" fill="none">
    ${roads.join('\n    ')}
  </g>
  <path d="M${width * 0.55} ${height} L${width * 0.55} ${height * 0.4} A${width * 0.16} ${width * 0.16} 0 0 1 ${width * 0.87} ${height * 0.4} L${width * 0.87} ${height} Z" fill="${palette.clay}" opacity="0.55"/>
  <g transform="translate(${pinX.toFixed(0)} ${pinY.toFixed(0)})">
    <path d="M0 26 C0 26 14 12 14 1 A14 14 0 0 0-14 1 C-14 12 0 26 0 26 Z" fill="${palette.accent}"/>
    <circle cx="0" cy="1" r="5" fill="${palette.paper}"/>
  </g>
  <path d="M${width * 0.08} ${height * 0.72} h${width * 0.12}" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
  <text x="${(width * 0.08).toFixed(0)}" y="${(height * 0.62).toFixed(0)}" font-family="Georgia, 'Times New Roman', serif" font-size="${(height * 0.12).toFixed(0)}" fill="${palette.ink}">${escapeXml(city)}</text>
  <text x="${(width * 0.08).toFixed(0)}" y="${(height * 0.84).toFixed(0)}" font-family="Helvetica, Arial, sans-serif" font-size="${(height * 0.05).toFixed(0)}" fill="${palette.ink}" opacity="0.6">${escapeXml(address)}</text>
</svg>`;
}

const languageSeeds = [
  ['english', 'EN'],
  ['german', 'DE'],
  ['french', 'FR'],
  ['spanish', 'ES'],
  ['italian', 'IT'],
  ['chinese', '中文'],
  ['japanese', 'JA'],
  ['arabic', 'AR'],
  ['turkish', 'TR'],
  ['norwegian', 'NO'],
  ['russian-as-foreign', 'RU'],
];

const programSeeds = [
  'exams',
  'tutoring',
  'preschool',
  'development',
  'corporate',
  'speech-therapist',
  'psychologist',
];

const ageSeeds = ['preschool', 'primary', 'teens', 'adults'];

const officeSeeds = [
  ['pavlovsky-posad-kirova', 'Павловский Посад', 'ул. Кирова, д. 56 · ТЦ «КИМ», 2 этаж'],
  ['pavlovsky-posad-pokrovskaya', 'Павловский Посад', 'ул. Большая Покровская, д. 41 · 2 этаж'],
  ['orekhovo-zuevo-parkovskaya', 'Орехово-Зуево', 'ул. Парковская, д. 16/1'],
  ['elektrostal-nikolaeva', 'Электросталь', 'ул. Николаева, д. 46 · 2 этаж'],
];

async function write(path, content) {
  const file = join(publicDir, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content, 'utf8');
  console.log(`✓ ${path}`);
}

async function main() {
  // Общие изображения
  await write('images/generated/hero.svg', editorial({ width: 1200, height: 900, seed: 11 }));
  await write('images/generated/about.svg', editorial({ width: 1000, height: 750, seed: 71 }));

  // Языки
  for (const [index, [slug, code]] of languageSeeds.entries()) {
    await write(
      `images/languages/${slug}.svg`,
      editorial({ width: 800, height: 600, seed: 200 + index * 7, badge: code }),
    );
  }

  // Направления
  for (const [index, slug] of programSeeds.entries()) {
    await write(
      `images/programs/${slug}.svg`,
      editorial({ width: 800, height: 600, seed: 300 + index * 11 }),
    );
  }

  // Возрастные ступени
  for (const [index, slug] of ageSeeds.entries()) {
    await write(
      `images/ages/${slug}.svg`,
      editorial({ width: 600, height: 720, seed: 400 + index * 13 }),
    );
  }

  // Офисы
  for (const [index, [id, city, address]] of officeSeeds.entries()) {
    await write(
      `images/offices/${id}.svg`,
      officeCard({ width: 900, height: 640, seed: 500 + index * 17, city, address }),
    );
  }
  await write(
    'images/offices/placeholder.svg',
    officeCard({
      width: 900,
      height: 640,
      seed: 599,
      city: 'RandK Center',
      address: 'Адрес уточняется',
    }),
  );

  // Каталоги для будущих реальных материалов
  await write(
    'images/client/README.txt',
    'Сюда загружаются фотографии, предоставленные клиентом.\nПосле загрузки обновите путь в src/content/*.ts и поставьте isClientProvided: true.\n',
  );
  await write(
    'images/teachers/README.txt',
    'Портреты преподавателей. Вертикальный кадр, минимум 800x1000.\nВымышленные люди сюда не добавляются.\n',
  );
  await write('images/ui/README.txt', 'Служебная графика интерфейса.\n');

  // OG-изображение: растр, потому что часть соцсетей не рендерит SVG
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
