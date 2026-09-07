import { offices } from './centers';
import type { AgeGroup, CitySlug, Program } from './types';

/**
 * Образовательные направления (кроме языков — они в `languages.ts`).
 *
 * У каждого направления собственный маршрут верхнего уровня: /exams,
 * /tutoring и т. д. Страницы собираются одним шаблоном
 * `components/templates/DirectionPage.tsx`, а не копированием компонентов.
 *
 * Логопед и психолог присутствуют на старом сайте, но клиентом не
 * подтверждены: они активны (страницы существуют и индексируются), но
 * `showInNavigation: false` — в основное меню не выводятся. Так спорное
 * направление можно скрыть или показать одним флагом, не удаляя контент.
 */

const allCities: CitySlug[] = ['pavlovsky-posad', 'orekhovo-zuevo', 'elektrostal'];
const allOffices = offices.map((office) => office.id);

export const programs: Program[] = [
  {
    slug: 'exams',
    href: '/exams',
    title: 'Подготовка к ОГЭ и ЕГЭ',
    shortTitle: 'ОГЭ и ЕГЭ',
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
    availableCities: allCities,
    availableOffices: allOffices,
    image: {
      src: '/images/generated/programs/program-exams.webp',
      alt: 'Подросток готовится к экзаменам вместе с наставником',
      width: 1600,
      height: 1000,
      isClientProvided: false,
    },
    icon: 'certificate',
    seoTitle: 'Подготовка к ОГЭ и ЕГЭ в Подмосковье',
    seoDescription:
      'Подготовка к ОГЭ и ЕГЭ в центрах RandK: диагностика, работа с критериями, тренировка формата экзамена, групповые и индивидуальные занятия.',
    active: true,
    confirmed: false,
    showInNavigation: true,
    showInSitemap: true,
  },
  {
    slug: 'tutoring',
    href: '/tutoring',
    title: 'Репетиторство по школьным предметам',
    shortTitle: 'Репетиторство',
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
    availableCities: allCities,
    availableOffices: allOffices,
    image: {
      src: '/images/generated/programs/program-tutoring.webp',
      alt: 'Индивидуальное занятие по школьному предмету',
      width: 1600,
      height: 1000,
      isClientProvided: false,
    },
    icon: 'book',
    seoTitle: 'Репетитор по школьным предметам',
    seoDescription:
      'Репетиторство в центрах RandK: разбор сложных тем, работа над успеваемостью, индивидуальный и мини-групповой формат для школьников.',
    active: true,
    confirmed: false,
    showInNavigation: true,
    showInSitemap: true,
  },
  {
    slug: 'preschool',
    href: '/preschool',
    title: 'Подготовка к школе',
    shortTitle: 'Подготовка к школе',
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
    availableCities: allCities,
    availableOffices: allOffices,
    image: {
      src: '/images/generated/programs/program-preschool.webp',
      alt: 'Ребёнок занимается подготовкой к школе за светлым деревянным столом',
      width: 1600,
      height: 1000,
      isClientProvided: false,
    },
    icon: 'pencil',
    seoTitle: 'Подготовка детей к школе',
    seoDescription:
      'Подготовка к школе в центрах RandK: чтение, счёт, письмо, внимание и навыки работы в группе для детей 5–7 лет.',
    active: true,
    confirmed: false,
    showInNavigation: true,
    showInSitemap: true,
  },
  {
    slug: 'development',
    href: '/development',
    title: 'Развивающие занятия для детей',
    shortTitle: 'Развивающие занятия',
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
    availableCities: allCities,
    availableOffices: allOffices,
    image: {
      src: '/images/generated/programs/program-development.webp',
      alt: 'Ребёнок выполняет развивающее задание с деревянными материалами',
      width: 1600,
      height: 1000,
      isClientProvided: false,
    },
    icon: 'sparkle',
    seoTitle: 'Развивающие занятия для детей',
    seoDescription:
      'Развивающие занятия для детей 4–7 лет в центрах RandK: речь, мышление, внимание и работа в группе.',
    active: true,
    confirmed: false,
    showInNavigation: true,
    showInSitemap: true,
  },
  {
    slug: 'corporate',
    href: '/corporate',
    title: 'Корпоративное обучение',
    shortTitle: 'Корпоративное обучение',
    age: 'Взрослые',
    ageGroups: ['adults'],
    description:
      'Языковые программы для сотрудников компании. Формат, интенсивность и состав групп обсуждаются отдельно — от занятий на территории работодателя до небольших групп в центре.',
    goals: [
      'Подтянуть язык под рабочие задачи команды',
      'Выстроить регулярный формат без ущерба для графика',
      'Начать с оценки текущего уровня сотрудников',
      'Получать обратную связь о ходе обучения',
    ],
    formats: ['corporate', 'group', 'individual'],
    duration: null,
    price: null,
    availableCities: allCities,
    availableOffices: allOffices,
    image: {
      src: '/images/generated/programs/program-corporate.webp',
      alt: 'Небольшая группа взрослых на корпоративном языковом занятии',
      width: 1586,
      height: 992,
      isClientProvided: false,
    },
    icon: 'briefcase',
    seoTitle: 'Корпоративное обучение иностранным языкам',
    seoDescription:
      'Корпоративные языковые программы RandK: обучение сотрудников, гибкий формат и расписание, оценка уровня перед стартом.',
    active: true,
    confirmed: false,
    showInNavigation: true,
    showInSitemap: true,
  },

  /*
   * Логопед и психолог: услуги заявлены на старом сайте, но клиентом
   * не подтверждены. Страницы существуют и индексируются, в основное меню
   * не выводятся — до подтверждения хватает ссылок из каталога направлений.
   */
  {
    slug: 'speech-therapist',
    href: '/speech-therapist',
    title: 'Логопед',
    shortTitle: 'Логопед',
    age: 'Дошкольники и школьники',
    ageGroups: ['preschool', 'primary'],
    description:
      'Занятия с логопедом начинаются с диагностики: специалист определяет характер трудности и предлагает план работы. Дальнейший формат и продолжительность зависят от результатов первичной встречи.',
    goals: [
      'Определить характер речевой трудности',
      'Выстроить план занятий под конкретный случай',
      'Отработать проблемные звуки и речевые навыки',
      'Подключить родителей к работе дома',
    ],
    formats: ['individual'],
    duration: null,
    price: null,
    availableCities: allCities,
    availableOffices: allOffices,
    image: {
      src: '/images/generated/programs/program-speech-therapist.webp',
      alt: 'Индивидуальное речевое занятие ребёнка со специалистом',
      width: 1600,
      height: 1000,
      isClientProvided: false,
    },
    icon: 'speech',
    seoTitle: 'Логопед для детей',
    seoDescription:
      'Занятия с логопедом в центрах RandK: диагностика, индивидуальный план работы, отработка речевых навыков.',
    active: true,
    confirmed: false,
    showInNavigation: false,
    showInSitemap: true,
  },
  {
    slug: 'psychologist',
    href: '/psychologist',
    title: 'Психолог',
    shortTitle: 'Психолог',
    age: 'Дети, подростки и родители',
    ageGroups: ['primary', 'teens', 'adults'],
    description:
      'Консультации психолога по вопросам, связанным с учёбой и адаптацией: мотивация, тревога перед экзаменами, отношения в коллективе. Формат и количество встреч определяются после первой консультации.',
    goals: [
      'Разобраться в причинах учебных трудностей',
      'Снизить тревожность, связанную с экзаменами',
      'Наладить контакт между родителем и ребёнком',
      'Определить, нужна ли дальнейшая работа',
    ],
    formats: ['individual'],
    duration: null,
    price: null,
    availableCities: allCities,
    availableOffices: allOffices,
    image: {
      src: '/images/generated/programs/program-psychologist.webp',
      alt: 'Спокойная беседа подростка со специалистом по учебной адаптации',
      width: 1586,
      height: 992,
      isClientProvided: false,
    },
    icon: 'mind',
    seoTitle: 'Детский психолог',
    seoDescription:
      'Консультации психолога в центрах RandK: мотивация к учёбе, тревога перед экзаменами, вопросы адаптации.',
    active: true,
    confirmed: false,
    showInNavigation: false,
    showInSitemap: true,
  },
];

export const activePrograms = programs.filter((program) => program.active);

export const navigationPrograms = programs.filter(
  (program) => program.active && program.showInNavigation,
);

export function getProgram(slug: string): Program | undefined {
  return activePrograms.find((program) => program.slug === slug);
}

export function getProgramsByCity(citySlug: string): Program[] {
  return activePrograms.filter((program) =>
    (program.availableCities as string[]).includes(citySlug),
  );
}

/** Возрастные ступени для блока «Программы по возрасту» на главной. */
export const ageGroups: AgeGroup[] = [
  {
    slug: 'preschool',
    label: '4–6 лет',
    caption: 'Развивающие занятия и подготовка к школе',
    image: {
      src: '/images/generated/ages/age-4-6.webp',
      alt: 'Занятия для детей 4–6 лет',
      width: 900,
      height: 675,
      isClientProvided: false,
    },
  },
  {
    slug: 'primary',
    label: '7–12 лет',
    caption: 'Языки, школьные предметы и уверенность',
    image: {
      src: '/images/generated/ages/age-7-12.webp',
      alt: 'Занятия для детей 7–12 лет',
      width: 900,
      height: 675,
      isClientProvided: false,
    },
  },
  {
    slug: 'teens',
    label: '13–17 лет',
    caption: 'Экзамены, языки и будущая специальность',
    image: {
      src: '/images/generated/ages/age-13-17.webp',
      alt: 'Занятия для подростков',
      width: 900,
      height: 675,
      isClientProvided: false,
    },
  },
  {
    slug: 'adults',
    label: 'Взрослые',
    caption: 'Язык для учёбы, работы и жизни',
    image: {
      src: '/images/generated/ages/age-adults.webp',
      alt: 'Занятия для взрослых',
      width: 900,
      height: 675,
      isClientProvided: false,
    },
  },
];
