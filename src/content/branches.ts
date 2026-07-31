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
    availablePrograms: [
      'angliyskiy-yazyk',
      'inostrannye-yazyki',
      'podgotovka-k-ege-oge',
      'shkolnye-predmety',
      'podgotovka-k-shkole',
      'razvivayushchie-zanyatiya',
      'individualnye-zanyatiya',
    ],
    photos: [
      {
        src: '/images/branches/orekhovo-zuevo.svg',
        alt: 'Образовательный центр RandK в Орехово-Зуеве',
        isClientProvided: false,
      },
    ],
    vkUrl: null,
    maxUrl: null,
    intro:
      'Центр в Орехово-Зуеве работает с широким возрастным диапазоном: от дошкольников, которые только знакомятся с языком, до старшеклассников, готовящихся к экзаменам. Программу подбираем после разговора с родителями и короткой диагностики, чтобы ученик попал в подходящую по уровню группу.',
    highlights: [
      'Группы для дошкольников, школьников и взрослых',
      'Отдельное направление подготовки к ОГЭ и ЕГЭ',
      'Возможность заниматься индивидуально параллельно с группой',
    ],
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
    availablePrograms: [
      'angliyskiy-yazyk',
      'inostrannye-yazyki',
      'podgotovka-k-ege-oge',
      'shkolnye-predmety',
      'podgotovka-k-shkole',
      'razvivayushchie-zanyatiya',
      'individualnye-zanyatiya',
    ],
    photos: [
      {
        src: '/images/branches/pavlovsky-posad.svg',
        alt: 'Образовательный центр RandK в Павловском Посаде',
        isClientProvided: false,
      },
    ],
    vkUrl: null,
    maxUrl: null,
    intro:
      'В Павловском Посаде центр сочетает языковые группы и подготовку по школьным предметам. Такой формат удобен семьям, где нужно закрыть сразу несколько задач: подтянуть предмет, продолжить занятия языком и подготовиться к экзамену без переездов между разными школами.',
    highlights: [
      'Языковые группы и школьные предметы в одном центре',
      'Возможность совмещать несколько направлений для одного ученика',
      'Гибкие форматы: группа, мини-группа, индивидуально',
    ],
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
    availablePrograms: [
      'angliyskiy-yazyk',
      'inostrannye-yazyki',
      'podgotovka-k-ege-oge',
      'shkolnye-predmety',
      'individualnye-zanyatiya',
    ],
    photos: [
      {
        src: '/images/branches/elektrostal.svg',
        alt: 'Образовательный центр RandK в Электростали',
        isClientProvided: false,
      },
    ],
    vkUrl: null,
    maxUrl: null,
    intro:
      'Центр в Электростали ориентирован прежде всего на школьников и взрослых: языковые группы, работа по предметам и подготовка к экзаменам. Расписание составляем так, чтобы занятия совмещались со школой и работой.',
    highlights: [
      'Акцент на школьников среднего и старшего звена',
      'Занятия языком для взрослых в вечернее время',
      'Подготовка к ОГЭ и ЕГЭ с регулярным контролем результата',
    ],
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
