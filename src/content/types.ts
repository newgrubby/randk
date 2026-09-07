/**
 * Типы контентного слоя.
 *
 * Два сквозных принципа:
 *
 * 1. Сайт не показывает выдуманный факт. Неподтверждённое поле = `null`,
 *    сущность несёт флаг `confirmed`.
 * 2. Видимостью управляют флаги, а не удаление данных. Спорное направление
 *    можно убрать из навигации и карты сайта, не теряя заготовку.
 */

/** Слаг города — используется в URL раздела «Центры». */
export type CitySlug = 'orekhovo-zuevo' | 'pavlovsky-posad' | 'elektrostal';

/** Возрастная ступень. */
export type AgeGroupSlug = 'preschool' | 'primary' | 'teens' | 'adults';

/** Формат занятий. */
export type LessonFormat = 'group' | 'mini-group' | 'individual' | 'corporate';

/**
 * Флаги видимости — общие для языков и направлений.
 *
 * `active` — показывать ли сущность на сайте вообще.
 * `confirmed` — подтверждены ли данные клиентом (влияет на микроразметку).
 * `showInNavigation` — выводить ли в меню (спорные направления держим вне меню).
 * `showInSitemap` — включать ли в sitemap.xml.
 */
export type VisibilityFlags = {
  active: boolean;
  confirmed: boolean;
  showInNavigation: boolean;
  showInSitemap: boolean;
};

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** true — файл предоставлен клиентом. false — временная композиция. */
  isClientProvided: boolean;
};

/* ============================================================
   Города и офисы
   ============================================================ */

export type City = {
  slug: CitySlug;
  name: string;
  /** Предложный падеж: «в Орехово-Зуеве». */
  locative: string;
  /** Вводный текст страницы города. Без неподтверждённых утверждений. */
  intro: string;
  seoTitle: string;
  seoDescription: string;
};

/**
 * Физический офис.
 *
 * Отдельная сущность, а не синоним города: в Павловском Посаде два офиса
 * с разными адресами, телефонами и маршрутами. Каждый подтверждённый офис
 * даёт собственную запись LocalBusiness.
 */
export type Office = {
  id: string;
  citySlug: CitySlug;
  city: string;
  /** Короткое имя для различения офисов внутри города: «на Кирова». */
  officeName: string;
  /** Улица и дом. */
  address: string;
  /** Этаж, ТЦ, ориентиры. null — нет уточнений. */
  addressDetails: string | null;
  /** В формате +7XXXXXXXXXX. null — телефон не известен. */
  phone: string | null;
  /** Строки графика. Пустой массив — график не подтверждён, не выводится. */
  schedule: string[];
  /** Ссылка на карточку в Яндекс Картах. null — кнопка маршрута строится по координатам. */
  yandexMapUrl: string | null;
  /** [широта, долгота]. null — карта и координаты в разметке не выводятся. */
  coordinates: [number, number] | null;
  /** Слаги языков, доступных в офисе. Пустой массив = «уточняется». */
  availableLanguages: string[];
  /** Слаги направлений, доступных в офисе. */
  availablePrograms: string[];
  photos: Photo[];
  /**
   * Подтверждены ли адрес, телефон и график клиентом.
   * Данные показываются и при `false` (они взяты с сайта клиента),
   * но в JSON-LD такой офис не попадает.
   */
  confirmed: boolean;
};

/* ============================================================
   Языки
   ============================================================ */

export type Language = VisibilityFlags & {
  slug: string;
  title: string;
  shortTitle: string;
  /** Код для типографского акцента в карточке: EN, DE, FR… */
  code: string;
  description: string;
  ageGroups: AgeGroupSlug[];
  formats: LessonFormat[];
  availableCities: CitySlug[];
  availableOffices: string[];
  image: Photo | null;
  /** Смысловые преимущества направления. Без цифр и обещаний результата. */
  advantages: string[];
  seoTitle: string;
  seoDescription: string;
};

/* ============================================================
   Образовательные направления
   ============================================================ */

export type ProgramIconName =
  | 'globe'
  | 'certificate'
  | 'book'
  | 'sparkle'
  | 'pencil'
  | 'compass'
  | 'speech'
  | 'mind'
  | 'briefcase';

export type Program = VisibilityFlags & {
  slug: string;
  /** Собственный маршрут направления: /exams, /tutoring и т. д. */
  href: string;
  title: string;
  shortTitle: string;
  age: string;
  ageGroups: AgeGroupSlug[];
  description: string;
  goals: string[];
  formats: LessonFormat[];
  /** Длительность. null — не подтверждена, не выводится. */
  duration: string | null;
  /** Стоимость. null — не подтверждена, не выводится. */
  price: string | null;
  availableCities: CitySlug[];
  availableOffices: string[];
  image: Photo | null;
  icon: ProgramIconName;
  seoTitle: string;
  seoDescription: string;
};

/* ============================================================
   Прочее
   ============================================================ */

export type Review = {
  id: string;
  authorName: string;
  city: string | null;
  program: string | null;
  text: string;
  rating: number | null;
  sourceUrl: string | null;
  photo: Photo | null;
  confirmed: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type AgeGroup = {
  slug: AgeGroupSlug;
  label: string;
  caption: string;
  image: Photo;
};
