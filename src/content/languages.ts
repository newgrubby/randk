import { offices } from './centers';
import type { CitySlug, Language } from './types';

/**
 * Каталог иностранных языков.
 *
 * ЗАЧЕМ ОТДЕЛЬНАЯ СУЩНОСТЬ: в первой версии языки жили внутри «программ»,
 * из-за чего английский занимал карточку наравне с целым направлением
 * «иностранные языки», а остальных языков не было вовсе. Каталог перекашивало
 * в сторону одного языка, хотя центр языковой.
 *
 * ФЛАГИ ВИДИМОСТИ:
 *  • active — показывать ли язык на сайте;
 *  • confirmed — подтверждён ли клиентом;
 *  • showInNavigation — выводить ли в меню;
 *  • showInSitemap — включать ли в sitemap.xml.
 *
 * Шесть основных языков активны. Японский, арабский, турецкий, норвежский и
 * русский как иностранный встречаются в текстах старого сайта, но не
 * подтверждены — заведены со всеми данными и выключены одним флагом.
 * Чтобы включить язык, достаточно поставить `active: true`.
 */

const allCities: CitySlug[] = ['pavlovsky-posad', 'orekhovo-zuevo', 'elektrostal'];
const allOffices = offices.map((office) => office.id);

/** Общие преимущества языкового направления — без обещаний результата и цифр. */
const commonAdvantages = [
  'Занятия от текущего уровня, а не «с общего начала»',
  'Разговорная практика на каждом занятии',
  'Группа, мини-группа или индивидуальный формат',
  'Программы для детей, подростков и взрослых',
];

type LanguageSeed = {
  slug: string;
  title: string;
  shortTitle: string;
  code: string;
  description: string;
  advantages?: string[];
  active: boolean;
  confirmed: boolean;
};

const seeds: LanguageSeed[] = [
  {
    slug: 'english',
    title: 'Английский язык',
    shortTitle: 'Английский',
    code: 'EN',
    description:
      'Основное языковое направление центра. Программа строится от текущего уровня: разговорная практика, аудирование, чтение и грамматика идут вместе, а не отдельными изолированными блоками. Подходит и тем, кто начинает с нуля, и тем, кто возвращается к языку после перерыва.',
    advantages: [
      'Уровни от начального до продвинутого',
      'Разговорная практика на каждом занятии',
      'Отдельные группы для детей, подростков и взрослых',
      'Возможность совмещать с подготовкой к экзаменам',
    ],
    active: true,
    confirmed: false,
  },
  {
    slug: 'german',
    title: 'Немецкий язык',
    shortTitle: 'Немецкий',
    code: 'DE',
    description:
      'Немецкий с нуля и продолжающий курс. Отдельное внимание — произношению и падежной системе: именно они обычно тормозят переход к свободной речи. Формат подбирается под цель: язык для учёбы, работы или поездок.',
    active: true,
    confirmed: false,
  },
  {
    slug: 'french',
    title: 'Французский язык',
    shortTitle: 'Французский',
    code: 'FR',
    description:
      'Французский для детей и взрослых. Работаем над фонетикой и слуховым восприятием с первых занятий — во французском разрыв между написанием и звучанием больше, чем в других европейских языках, и его лучше снимать сразу.',
    active: true,
    confirmed: false,
  },
  {
    slug: 'spanish',
    title: 'Испанский язык',
    shortTitle: 'Испанский',
    code: 'ES',
    description:
      'Испанский с нуля и для продолжающих. Один из самых быстрых языков по скорости выхода на бытовую речь, поэтому разговорную практику вводим рано и много.',
    active: true,
    confirmed: false,
  },
  {
    slug: 'italian',
    title: 'Итальянский язык',
    shortTitle: 'Итальянский',
    code: 'IT',
    description:
      'Итальянский для тех, кто учит его для поездок, работы или интереса к культуре. Программа строится вокруг живой речи и понятных бытовых ситуаций.',
    active: true,
    confirmed: false,
  },
  {
    slug: 'chinese',
    title: 'Китайский язык',
    shortTitle: 'Китайский',
    code: '中文',
    description:
      'Китайский с нуля: тоны, пиньинь и иероглифика вводятся последовательно, чтобы письмо не отставало от устной речи. Требует регулярности, поэтому формат занятий обсуждаем отдельно.',
    active: true,
    confirmed: false,
  },

  // --- Ниже: встречаются на старом сайте, но не подтверждены клиентом ---
  {
    slug: 'japanese',
    title: 'Японский язык',
    shortTitle: 'Японский',
    code: 'JA',
    description:
      'Японский с нуля: слоговые азбуки, базовая грамматика и постепенное введение иероглифики.',
    active: false,
    confirmed: false,
  },
  {
    slug: 'arabic',
    title: 'Арабский язык',
    shortTitle: 'Арабский',
    code: 'AR',
    description: 'Арабский с нуля: письмо, произношение и основы литературного языка.',
    active: false,
    confirmed: false,
  },
  {
    slug: 'turkish',
    title: 'Турецкий язык',
    shortTitle: 'Турецкий',
    code: 'TR',
    description: 'Турецкий для поездок, работы и общения. Логичная грамматика и быстрый старт.',
    active: false,
    confirmed: false,
  },
  {
    slug: 'norwegian',
    title: 'Норвежский язык',
    shortTitle: 'Норвежский',
    code: 'NO',
    description: 'Норвежский с нуля для учёбы, работы или переезда.',
    active: false,
    confirmed: false,
  },
  {
    slug: 'russian-as-foreign',
    title: 'Русский как иностранный',
    shortTitle: 'Русский как иностранный',
    code: 'RU',
    description:
      'Русский язык для иностранцев: бытовое общение, документы, подготовка к экзаменам и адаптация.',
    active: false,
    confirmed: false,
  },
];

export const languages: Language[] = seeds.map((seed) => ({
  slug: seed.slug,
  title: seed.title,
  shortTitle: seed.shortTitle,
  code: seed.code,
  description: seed.description,
  ageGroups: ['primary', 'teens', 'adults'],
  formats: ['group', 'mini-group', 'individual'],
  availableCities: allCities,
  availableOffices: allOffices,
  image: {
    src: `/images/languages/${seed.slug}.svg`,
    alt: `${seed.title} в центрах RandK`,
    width: 800,
    height: 600,
    isClientProvided: false,
  },
  advantages: seed.advantages ?? commonAdvantages,
  seoTitle: `${seed.title} — курсы в Подмосковье`,
  seoDescription: `Курсы «${seed.title.toLowerCase()}» в центрах RandK: занятия для детей, подростков и взрослых, группы, мини-группы и индивидуальный формат.`,
  active: seed.active,
  confirmed: seed.confirmed,
  showInNavigation: seed.active,
  showInSitemap: seed.active,
}));

/** Языки, показываемые на сайте. */
export const activeLanguages = languages.filter((language) => language.active);

/** Языки в меню. */
export const navigationLanguages = languages.filter(
  (language) => language.active && language.showInNavigation,
);

export function getLanguage(slug: string): Language | undefined {
  return activeLanguages.find((language) => language.slug === slug);
}

export function getLanguagesByCity(citySlug: string): Language[] {
  return activeLanguages.filter((language) =>
    (language.availableCities as string[]).includes(citySlug),
  );
}
