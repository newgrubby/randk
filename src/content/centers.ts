import type { City, CitySlug, Office } from './types';

/**
 * Города и физические офисы сети.
 *
 * КЛЮЧЕВОЕ ОТЛИЧИЕ ОТ ПЕРВОЙ ВЕРСИИ: офис — самостоятельная сущность,
 * а не синоним города. В Павловском Посаде два офиса с разными адресами,
 * телефонами и маршрутами, и модель обязана это выражать.
 *
 * Адреса и телефоны взяты с действующего сайта клиента randkcenter.ru
 * (снято 31.07.2026) и помечены `confirmed: false` — они показываются
 * посетителю, но не попадают в микроразметку LocalBusiness до подтверждения.
 * Никакой технической надписи «не подтверждено» на сайте нет.
 *
 * Уточнение из задания: в Орехово-Зуеве дом 16/1 (на старом сайте — «16»).
 *
 * Как подтвердить офис: сверить адрес, телефон и график с клиентом,
 * добавить `coordinates` и `yandexRouteUrl`, поставить `confirmed: true`.
 * После этого появятся карта и запись LocalBusiness.
 */

export const cities: City[] = [
  {
    slug: 'pavlovsky-posad',
    name: 'Павловский Посад',
    locative: 'в Павловском Посаде',
    intro:
      'В Павловском Посаде работают два офиса RandK. Языковые и образовательные программы распределены между ними, поэтому удобнее выбирать центр по расположению — администратор подскажет, в каком из них идёт набор в нужную группу.',
    seoTitle: 'Языковой центр в Павловском Посаде — два офиса',
    seoDescription:
      'RandK Center в Павловском Посаде: два офиса на улице Кирова и Большой Покровской. Иностранные языки, подготовка к ОГЭ и ЕГЭ, репетиторство, подготовка к школе.',
  },
  {
    slug: 'orekhovo-zuevo',
    name: 'Орехово-Зуево',
    locative: 'в Орехово-Зуеве',
    intro:
      'Центр в Орехово-Зуеве работает с детьми, подростками и взрослыми. Программу подбираем после разговора: уточняем возраст, текущий уровень и цель занятий.',
    seoTitle: 'Языковой центр в Орехово-Зуеве',
    seoDescription:
      'RandK Center в Орехово-Зуеве на улице Парковской: курсы иностранных языков, подготовка к ОГЭ и ЕГЭ, репетиторство по школьным предметам, подготовка к школе.',
  },
  {
    slug: 'elektrostal',
    name: 'Электросталь',
    locative: 'в Электростали',
    intro:
      'Центр в Электростали ведёт языковые и образовательные программы для разных возрастов. Расписание и набор в группы уточняются у администратора.',
    seoTitle: 'Языковой центр в Электростали',
    seoDescription:
      'RandK Center в Электростали на улице Николаева: иностранные языки, подготовка к ОГЭ и ЕГЭ, репетиторство, индивидуальные занятия.',
  },
];

/** Языки, доступные во всех офисах до уточнения клиентом. */
const baseLanguages = ['english', 'german', 'french', 'spanish', 'italian', 'chinese'];

/** Направления, доступные во всех офисах до уточнения клиентом. */
const basePrograms = ['exams', 'tutoring', 'preschool', 'development', 'corporate'];

export const offices: Office[] = [
  {
    id: 'pavlovsky-posad-kirova',
    citySlug: 'pavlovsky-posad',
    city: 'Павловский Посад',
    officeName: 'на улице Кирова',
    address: 'ул. Кирова, д. 56',
    addressDetails: 'ТЦ «КИМ», 2 этаж',
    phone: '+79096635360',
    schedule: [],
    yandexRouteUrl: 'https://yandex.ru/maps/?rtext=~55.780664%2C38.662987&rtt=auto',
    coordinates: { lat: 55.780664, lon: 38.662987 },
    availableLanguages: baseLanguages,
    availablePrograms: basePrograms,
    photos: [
      {
        src: '/images/offices/pavlovsky-posad-kirova.svg',
        alt: 'Центр RandK в Павловском Посаде на улице Кирова',
        width: 900,
        height: 640,
        isClientProvided: false,
      },
    ],
    confirmed: false,
  },
  {
    id: 'pavlovsky-posad-pokrovskaya',
    citySlug: 'pavlovsky-posad',
    city: 'Павловский Посад',
    officeName: 'на Большой Покровской',
    address: 'ул. Большая Покровская, д. 41',
    addressDetails: '2 этаж',
    phone: '+79261487871',
    schedule: [],
    yandexRouteUrl: 'https://yandex.ru/maps/?rtext=~55.770107%2C38.654417&rtt=auto',
    coordinates: { lat: 55.770107, lon: 38.654417 },
    availableLanguages: baseLanguages,
    availablePrograms: basePrograms,
    photos: [
      {
        src: '/images/offices/pavlovsky-posad-pokrovskaya.svg',
        alt: 'Центр RandK в Павловском Посаде на Большой Покровской',
        width: 900,
        height: 640,
        isClientProvided: false,
      },
    ],
    confirmed: false,
  },
  {
    id: 'orekhovo-zuevo-parkovskaya',
    citySlug: 'orekhovo-zuevo',
    city: 'Орехово-Зуево',
    officeName: 'на Парковской',
    address: 'ул. Парковская, д. 16/1',
    addressDetails: null,
    phone: '+79629026275',
    schedule: [],
    yandexRouteUrl: 'https://yandex.ru/maps/?rtext=~55.819090%2C38.997546&rtt=auto',
    coordinates: { lat: 55.81909, lon: 38.997546 },
    availableLanguages: baseLanguages,
    availablePrograms: basePrograms,
    photos: [
      {
        src: '/images/offices/orekhovo-zuevo-parkovskaya.svg',
        alt: 'Центр RandK в Орехово-Зуеве на Парковской улице',
        width: 900,
        height: 640,
        isClientProvided: false,
      },
    ],
    confirmed: false,
  },
  {
    id: 'elektrostal-nikolaeva',
    citySlug: 'elektrostal',
    city: 'Электросталь',
    officeName: 'на Николаева',
    address: 'ул. Николаева, д. 46',
    addressDetails: '2 этаж',
    phone: '+79263238438',
    schedule: [],
    yandexRouteUrl: 'https://yandex.ru/maps/?rtext=~55.780481%2C38.440833&rtt=auto',
    coordinates: { lat: 55.780481, lon: 38.440833 },
    availableLanguages: baseLanguages,
    availablePrograms: basePrograms,
    photos: [
      {
        src: '/images/offices/elektrostal-nikolaeva.svg',
        alt: 'Центр RandK в Электростали на улице Николаева',
        width: 900,
        height: 640,
        isClientProvided: false,
      },
    ],
    confirmed: false,
  },
];

export function getCity(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}

/** Офисы города в порядке объявления. */
export function getOfficesByCity(slug: string): Office[] {
  return offices.filter((office) => office.citySlug === slug);
}

/** Сколько офисов в городе — нужно для формулировок «два офиса». */
export function countOffices(slug: CitySlug): number {
  return getOfficesByCity(slug).length;
}

/** Полный адрес одной строкой: «ул. Кирова, д. 56, ТЦ «КИМ», 2 этаж». */
export function fullAddress(office: Office): string {
  return [office.address, office.addressDetails].filter(Boolean).join(', ');
}
