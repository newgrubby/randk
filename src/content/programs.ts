import type { AgeGroup, Program, ProgramCategory } from './types';

/**
 * Каталог направлений.
 *
 * Как редактировать:
 *  • добавить программу → добавить объект в массив `programs`;
 *  • убрать программу → удалить объект (маршрут и sitemap обновятся сами);
 *  • появилась подтверждённая цена → заполнить `price` и `isConfirmed: true`.
 *
 * Пока `price === null`, блок стоимости на сайте не выводится вовсе —
 * вместо цифр показывается призыв уточнить условия.
 */

export const programCategoryLabels: Record<ProgramCategory, string> = {
  languages: 'Языки',
  exams: 'Экзамены',
  school: 'Школа',
  development: 'Развитие',
  individual: 'Формат',
};

const allCities = ['orekhovo-zuevo', 'pavlovsky-posad', 'elektrostal'] as const;

export const programs: Program[] = [
  {
    slug: 'inostrannye-yazyki',
    title: 'Иностранные языки',
    shortTitle: 'Иностранные языки',
    category: 'languages',
    age: 'Дети, подростки и взрослые',
    ageGroups: ['primary', 'teens', 'adults'],
    description:
      'Языковые группы для тех, кто начинает с нуля, и для тех, кто возвращается к языку после перерыва. Работаем над речью, слухом и уверенностью — так, чтобы язык звучал в реальных ситуациях, а не только в упражнениях.',
    goals: [
      'Свободно говорить на бытовые и учебные темы',
      'Понимать речь на слух в естественном темпе',
      'Расширить словарный запас и грамматическую базу',
      'Снять языковой барьер и страх ошибки',
    ],
    formats: ['group', 'mini-group', 'individual'],
    duration: null,
    price: null,
    cityAvailability: [...allCities],
    image: {
      src: '/images/programs/languages.svg',
      alt: 'Композиция, символизирующая изучение иностранных языков',
      isClientProvided: false,
    },
    icon: 'globe',
    seoTitle: 'Курсы иностранных языков',
    seoDescription:
      'Курсы иностранных языков для детей, подростков и взрослых в центрах RandK. Группы, мини-группы и индивидуальные занятия.',
    isConfirmed: false,
  },
  {
    slug: 'angliyskiy-yazyk',
    title: 'Английский язык',
    shortTitle: 'Английский',
    category: 'languages',
    age: 'От дошкольников до взрослых',
    ageGroups: ['preschool', 'primary', 'teens', 'adults'],
    description:
      'Основное языковое направление центра. Программа выстраивается от текущего уровня ученика: разговорная практика, чтение, письмо и грамматика идут вместе, а не отдельными изолированными блоками.',
    goals: [
      'Выйти на уверенную устную речь',
      'Подтянуть школьную программу и оценки',
      'Подготовиться к продолжению обучения или работе',
      'Заниматься регулярно и видеть прогресс',
    ],
    formats: ['group', 'mini-group', 'individual'],
    duration: null,
    price: null,
    cityAvailability: [...allCities],
    image: {
      src: '/images/programs/english.svg',
      alt: 'Композиция, символизирующая курс английского языка',
      isClientProvided: false,
    },
    icon: 'compass',
    seoTitle: 'Английский язык для детей и взрослых',
    seoDescription:
      'Курсы английского языка в образовательных центрах RandK: подбор уровня, разговорная практика, занятия для детей, подростков и взрослых.',
    isConfirmed: false,
  },
  {
    slug: 'podgotovka-k-ege-oge',
    title: 'Подготовка к ОГЭ и ЕГЭ',
    shortTitle: 'ОГЭ и ЕГЭ',
    category: 'exams',
    age: '13–17 лет',
    ageGroups: ['teens'],
    description:
      'Системная подготовка к экзаменам: разбор формата, работа с критериями оценивания, тренировка на реальных заданиях и регулярный контроль результата. Программа строится от диагностики, а не от общего плана «для всех».',
    goals: [
      'Разобраться в структуре и критериях экзамена',
      'Закрыть пробелы в теории',
      'Научиться распределять время на экзамене',
      'Снизить тревожность за счёт привычки к формату',
    ],
    formats: ['group', 'mini-group', 'individual'],
    duration: null,
    price: null,
    cityAvailability: [...allCities],
    image: {
      src: '/images/programs/exams.svg',
      alt: 'Композиция, символизирующая подготовку к экзаменам',
      isClientProvided: false,
    },
    icon: 'certificate',
    seoTitle: 'Подготовка к ОГЭ и ЕГЭ',
    seoDescription:
      'Подготовка к ОГЭ и ЕГЭ в образовательных центрах RandK: диагностика, работа с критериями, тренировка формата, групповые и индивидуальные занятия.',
    isConfirmed: false,
  },
  {
    slug: 'shkolnye-predmety',
    title: 'Помощь по школьным предметам',
    shortTitle: 'Школьные предметы',
    category: 'school',
    age: '7–17 лет',
    ageGroups: ['primary', 'teens'],
    description:
      'Занятия для учеников, которым нужно догнать программу, разобрать сложную тему или выстроить регулярную работу по предмету. Начинаем с того, что именно вызывает трудность, и идём от этого.',
    goals: [
      'Закрыть конкретные пробелы по предмету',
      'Научиться работать с учебным материалом самостоятельно',
      'Выровнять текущую успеваемость',
      'Вернуть интерес к предмету',
    ],
    formats: ['individual', 'mini-group'],
    duration: null,
    price: null,
    cityAvailability: [...allCities],
    image: {
      src: '/images/programs/school.svg',
      alt: 'Композиция, символизирующая занятия по школьным предметам',
      isClientProvided: false,
    },
    icon: 'book',
    seoTitle: 'Помощь по школьным предметам',
    seoDescription:
      'Занятия по школьным предметам в центрах RandK: разбор сложных тем, работа над успеваемостью, индивидуальный и мини-групповой формат.',
    isConfirmed: false,
  },
  {
    slug: 'podgotovka-k-shkole',
    title: 'Подготовка к школе',
    shortTitle: 'Подготовка к школе',
    category: 'school',
    age: '5–7 лет',
    ageGroups: ['preschool'],
    description:
      'Мягкий переход к школьному ритму. Занятия развивают внимание, речь и умение работать в группе — чтобы первый класс начался спокойно, а не со стресса.',
    goals: [
      'Освоить чтение, счёт и письмо на стартовом уровне',
      'Привыкнуть к учебному формату и режиму',
      'Развить внимание, память и усидчивость',
      'Научиться общаться в группе сверстников',
    ],
    formats: ['group', 'mini-group'],
    duration: null,
    price: null,
    cityAvailability: [...allCities],
    image: {
      src: '/images/programs/preschool.svg',
      alt: 'Композиция, символизирующая подготовку к школе',
      isClientProvided: false,
    },
    icon: 'pencil',
    seoTitle: 'Подготовка к школе',
    seoDescription:
      'Подготовка детей к школе в центрах RandK: чтение, счёт, письмо, внимание и навыки работы в группе.',
    isConfirmed: false,
  },
  {
    slug: 'razvivayushchie-zanyatiya',
    title: 'Развивающие занятия для детей',
    shortTitle: 'Развивающие занятия',
    category: 'development',
    age: '4–7 лет',
    ageGroups: ['preschool'],
    description:
      'Программы для младшего возраста, где обучение идёт через игру и движение. Основной акцент — на речи, мышлении и умении удерживать внимание.',
    goals: [
      'Развить речь и словарный запас',
      'Тренировать логику и мышление',
      'Освоить работу в паре и в группе',
      'Сформировать привычку к регулярным занятиям',
    ],
    formats: ['group', 'mini-group'],
    duration: null,
    price: null,
    cityAvailability: [...allCities],
    image: {
      src: '/images/programs/development.svg',
      alt: 'Композиция, символизирующая развивающие занятия для детей',
      isClientProvided: false,
    },
    icon: 'sparkle',
    seoTitle: 'Развивающие занятия для детей',
    seoDescription:
      'Развивающие занятия для детей 4–7 лет в центрах RandK: речь, мышление, внимание, работа в группе.',
    isConfirmed: false,
  },
  {
    slug: 'individualnye-zanyatiya',
    title: 'Индивидуальные занятия',
    shortTitle: 'Индивидуально',
    category: 'individual',
    age: 'Любой возраст',
    ageGroups: ['preschool', 'primary', 'teens', 'adults'],
    description:
      'Формат для тех, кому нужен собственный темп: подготовка к конкретной цели, работа по нестандартному расписанию или сопровождение параллельно с группой.',
    goals: [
      'Двигаться в своём темпе',
      'Сфокусироваться на конкретной задаче',
      'Заниматься по удобному расписанию',
      'Получать подробную обратную связь по каждому занятию',
    ],
    formats: ['individual'],
    duration: null,
    price: null,
    cityAvailability: [...allCities],
    image: {
      src: '/images/programs/individual.svg',
      alt: 'Композиция, символизирующая индивидуальные занятия',
      isClientProvided: false,
    },
    icon: 'compass',
    seoTitle: 'Индивидуальные занятия',
    seoDescription:
      'Индивидуальные занятия в образовательных центрах RandK: собственный темп, гибкое расписание, работа под конкретную цель.',
    isConfirmed: false,
  },
];

/** Возрастные ступени для блока «Программы по возрасту». */
export const ageGroups: AgeGroup[] = [
  {
    slug: 'preschool',
    label: '4–6 лет',
    caption: 'Первые шаги в языке и подготовка к школе',
    image: {
      src: '/images/ages/preschool.svg',
      alt: 'Занятия для детей 4–6 лет',
      isClientProvided: false,
    },
  },
  {
    slug: 'primary',
    label: '7–12 лет',
    caption: 'Языки, школьные предметы и уверенность',
    image: {
      src: '/images/ages/primary.svg',
      alt: 'Занятия для детей 7–12 лет',
      isClientProvided: false,
    },
  },
  {
    slug: 'teens',
    label: '13–17 лет',
    caption: 'Экзамены, языки и будущая специальность',
    image: {
      src: '/images/ages/teens.svg',
      alt: 'Занятия для подростков',
      isClientProvided: false,
    },
  },
  {
    slug: 'adults',
    label: 'Взрослые',
    caption: 'Язык для учёбы, работы и жизни',
    image: { src: '/images/ages/adults.svg', alt: 'Занятия для взрослых', isClientProvided: false },
  },
];

export function getProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}

export function getProgramsByCity(city: string): Program[] {
  return programs.filter((program) => (program.cityAvailability as string[]).includes(city));
}

export function getProgramsByAgeGroup(age: string): Program[] {
  return programs.filter((program) => (program.ageGroups as string[]).includes(age));
}
