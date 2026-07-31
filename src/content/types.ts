/**
 * Типы контентного слоя.
 *
 * Главный принцип проекта: сайт никогда не показывает неподтверждённые
 * факты. Любое поле, которое клиент ещё не подтвердил, объявлено
 * nullable, а сущность целиком помечена флагом `isConfirmed`.
 * Компоненты обязаны проверять флаг/значение перед отображением.
 */

/** Слаг города — используется в URL филиалов. */
export type CitySlug = 'orekhovo-zuevo' | 'pavlovsky-posad' | 'elektrostal';

/** Возрастная ступень. Используется для фильтрации программ и квиза. */
export type AgeGroupSlug = 'preschool' | 'primary' | 'teens' | 'adults';

/** Категория направления — для группировки в каталоге. */
export type ProgramCategory = 'languages' | 'exams' | 'school' | 'development' | 'individual';

/** Возможные форматы занятий. */
export type LessonFormat = 'group' | 'individual' | 'mini-group';

export type Photo = {
  src: string;
  alt: string;
  /** true — изображение предоставлено клиентом. false — временное. */
  isClientProvided: boolean;
};

export type Program = {
  slug: string;
  title: string;
  /** Короткое название для карточек, меню и хлебных крошек. */
  shortTitle: string;
  category: ProgramCategory;
  /** Человекочитаемый возраст, напр. «7–12 лет». */
  age: string;
  ageGroups: AgeGroupSlug[];
  /** Абзац-лид для страницы программы. */
  description: string;
  /** Чему научится ученик. */
  goals: string[];
  formats: LessonFormat[];
  /** Длительность/интенсивность. null — не подтверждено. */
  duration: string | null;
  /** Стоимость. null — не подтверждено, на сайте не показывается. */
  price: string | null;
  /** В каких городах доступна программа. */
  cityAvailability: CitySlug[];
  image: Photo | null;
  /** Ключ иконки из src/components/ui/ProgramIcon.tsx. */
  icon: ProgramIconName;
  /** Без названия бренда: « — RandK Center» добавляется шаблоном в layout.tsx. */
  seoTitle: string;
  seoDescription: string;
  /** Подтверждено ли клиентом наполнение программы. */
  isConfirmed: boolean;
};

export type ProgramIconName = 'globe' | 'certificate' | 'book' | 'sparkle' | 'pencil' | 'compass';

export type Branch = {
  slug: CitySlug;
  city: string;
  /** Город в предложном падеже: «в Орехово-Зуеве». */
  cityLocative: string;
  displayName: string;
  /** Адрес. null — не подтверждён, на сайте не показывается. */
  address: string | null;
  /** Телефон в формате +7XXXXXXXXXX. null — не подтверждён. */
  phone: string | null;
  /** Строки графика работы. Пустой массив — не подтверждён. */
  schedule: string[];
  /** Ссылка на карточку в Яндекс Картах. null — не подтверждена. */
  mapUrl: string | null;
  /** [широта, долгота]. null — карта не отображается. */
  coordinates: [number, number] | null;
  /** Слаги программ, доступных в филиале. */
  availablePrograms: string[];
  photos: Photo[];
  vkUrl: string | null;
  maxUrl: string | null;
  /** Уникальный вводный текст страницы города. */
  intro: string;
  /** Смысловые акценты филиала (без выдуманных фактов). */
  highlights: string[];
  seoTitle: string;
  seoDescription: string;
  /** Подтверждены ли клиентом адрес/телефон/график. */
  isConfirmed: boolean;
};

export type Teacher = {
  id: string;
  /** ФИО. null — реальные данные не переданы, карточка демонстрационная. */
  name: string | null;
  /** Роль/специализация — нейтральная формулировка. */
  role: string;
  /** Что ведёт преподаватель. */
  focus: string[];
  branches: CitySlug[];
  photo: Photo | null;
  isConfirmed: boolean;
};

export type Review = {
  id: string;
  authorName: string;
  city: string | null;
  program: string | null;
  text: string;
  /** 1–5. null — рейтинг не указан. */
  rating: number | null;
  /** Ссылка на первоисточник (VK, Яндекс Карты). */
  sourceUrl: string | null;
  photo: Photo | null;
  isConfirmed: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type AgeGroup = {
  slug: AgeGroupSlug;
  /** «4–6 лет» */
  label: string;
  /** Подпись под возрастом. */
  caption: string;
  image: Photo;
};
