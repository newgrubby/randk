import { programs } from './programs';
import type { Branch, CitySlug } from './types';

/**
 * Филиалы сети.
 *
 * ВАЖНО: адреса, телефоны, графики и координаты пока НЕ подтверждены клиентом.
 * Значения, найденные на старом сайте, вынесены в `legacy-data.ts` и намеренно
 * НЕ подставлены сюда — их нужно сверить с клиентом (см. /docs/CONTENT_TODO.md).
 *
 * Как включить контакты филиала:
 *   1. заполнить `address`, `phone`, `schedule`, `mapUrl`, `coordinates`;
 *   2. поставить `isConfirmed: true`.
 * После этого адрес, телефон, карта, кнопка маршрута и микроразметка
 * LocalBusiness появятся автоматически.
 */

/**
 * Общий безопасный вводный текст для всех городов.
 *
 * Раньше у каждого филиала был свой текст, но он утверждал непроверенное:
 * «отдельное направление подготовки к экзаменам», «сочетает языки и школьные
 * предметы», «вечерние занятия для взрослых». Звучало убедительно, но
 * источником этих фактов были не данные клиента, а домысел.
 *
 * Осознанный компромисс: до брифа три страницы городов используют одинаковый
 * вводный абзац. Уникальность текстов важна для локального SEO, но публиковать
 * выдуманные отличия ради уникальности нельзя. Как только клиент подтвердит
 * реальные особенности центров — тексты снова расходятся, а `highlights`
 * наполняются фактами (см. /docs/CONTENT_TODO.md).
 */
const safeBranchIntro =
  'В центре представлены языковые и образовательные программы для разных возрастов. ' +
  'Актуальные направления, расписание и набор в группы уточняются у администратора.';

/**
 * Программы города выводятся из `programs.cityAvailability` — единственного
 * источника истины о доступности.
 *
 * Раньше список дублировался вручную здесь и расходился с каталогом:
 * фильтр «Электросталь» показывал 7 направлений, а страница центра — 5.
 * Расхождение возникало из ничем не подтверждённого предположения, что
 * в Электростали нет дошкольных групп.
 *
 * Теперь достаточно поменять `cityAvailability` у программы — и каталог,
 * и страница филиала обновятся согласованно.
 */
function programsForCity(slug: CitySlug): string[] {
  return programs
    .filter((program) => (program.cityAvailability as string[]).includes(slug))
    .map((program) => program.slug);
}

export const branches: Branch[] = [
  {
    slug: 'orekhovo-zuevo',
    city: 'Орехово-Зуево',
    cityLocative: 'в Орехово-Зуеве',
    displayName: 'RandK Center Орехово-Зуево',
    address: null,
    phone: null,
    schedule: [],
    mapUrl: null,
    coordinates: null,
    availablePrograms: programsForCity('orekhovo-zuevo'),
    photos: [
      {
        src: '/images/branches/orekhovo-zuevo.svg',
        alt: 'Образовательный центр RandK в Орехово-Зуеве',
        isClientProvided: false,
      },
    ],
    vkUrl: null,
    maxUrl: null,
    intro: safeBranchIntro,
    highlights: [],
    seoTitle: 'Языковая школа и образовательный центр в Орехово-Зуеве',
    seoDescription:
      'RandK Center в Орехово-Зуеве: курсы иностранных языков, подготовка к ОГЭ и ЕГЭ, помощь по школьным предметам, подготовка к школе. Запись на пробное занятие.',
    isConfirmed: false,
  },
  {
    slug: 'pavlovsky-posad',
    city: 'Павловский Посад',
    cityLocative: 'в Павловском Посаде',
    displayName: 'RandK Center Павловский Посад',
    address: null,
    phone: null,
    schedule: [],
    mapUrl: null,
    coordinates: null,
    availablePrograms: programsForCity('pavlovsky-posad'),
    photos: [
      {
        src: '/images/branches/pavlovsky-posad.svg',
        alt: 'Образовательный центр RandK в Павловском Посаде',
        isClientProvided: false,
      },
    ],
    vkUrl: null,
    maxUrl: null,
    intro: safeBranchIntro,
    highlights: [],
    seoTitle: 'Языковая школа и образовательный центр в Павловском Посаде',
    seoDescription:
      'RandK Center в Павловском Посаде: иностранные языки, подготовка к ОГЭ и ЕГЭ, школьные предметы, подготовка к школе и развивающие занятия.',
    isConfirmed: false,
  },
  {
    slug: 'elektrostal',
    city: 'Электросталь',
    cityLocative: 'в Электростали',
    displayName: 'RandK Center Электросталь',
    address: null,
    phone: null,
    schedule: [],
    mapUrl: null,
    coordinates: null,
    availablePrograms: programsForCity('elektrostal'),
    photos: [
      {
        src: '/images/branches/elektrostal.svg',
        alt: 'Образовательный центр RandK в Электростали',
        isClientProvided: false,
      },
    ],
    vkUrl: null,
    maxUrl: null,
    intro: safeBranchIntro,
    highlights: [],
    seoTitle: 'Языковая школа и образовательный центр в Электростали',
    seoDescription:
      'RandK Center в Электростали: курсы иностранных языков, подготовка к ОГЭ и ЕГЭ, помощь по школьным предметам, индивидуальные занятия.',
    isConfirmed: false,
  },
];

export function getBranch(slug: string): Branch | undefined {
  return branches.find((branch) => branch.slug === slug);
}

export function getBranchCityName(slug: CitySlug): string {
  return getBranch(slug)?.city ?? '';
}

/** Филиалы с подтверждёнными адресом и координатами — только для них строим LocalBusiness/карту. */
export const confirmedBranches = branches.filter(
  (branch) => branch.isConfirmed && branch.address !== null,
);
