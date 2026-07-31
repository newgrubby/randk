import type { Teacher } from './types';

/**
 * Преподаватели.
 *
 * СЕЙЧАС: реальные данные не переданы. Карточки ниже — демонстрационные:
 * без ФИО, без фотографий и без сертификатов. Они показывают вёрстку блока
 * и специализации, а не конкретных людей.
 *
 * Как заполнить: у каждой карточки указать `name`, `photo`,
 * при необходимости уточнить `role`/`focus` и поставить `isConfirmed: true`.
 * Карточки без `name` автоматически отображаются в нейтральном виде.
 * См. /docs/CONTENT_TODO.md, раздел «Преподаватели».
 */

export const teachers: Teacher[] = [
  {
    id: 'english-lead',
    name: null,
    role: 'Преподаватель английского языка',
    focus: ['Группы для школьников', 'Разговорная практика'],
    branches: ['orekhovo-zuevo', 'pavlovsky-posad', 'elektrostal'],
    photo: null,
    isConfirmed: false,
  },
  {
    id: 'exams',
    name: null,
    role: 'Преподаватель подготовки к ОГЭ и ЕГЭ',
    focus: ['Формат экзамена', 'Работа с критериями'],
    branches: ['orekhovo-zuevo', 'pavlovsky-posad', 'elektrostal'],
    photo: null,
    isConfirmed: false,
  },
  {
    id: 'preschool',
    name: null,
    role: 'Педагог дошкольного направления',
    focus: ['Подготовка к школе', 'Развивающие занятия'],
    branches: ['orekhovo-zuevo', 'pavlovsky-posad'],
    photo: null,
    isConfirmed: false,
  },
  {
    id: 'school-subjects',
    name: null,
    role: 'Преподаватель школьных предметов',
    focus: ['Индивидуальные занятия', 'Работа с пробелами'],
    branches: ['orekhovo-zuevo', 'pavlovsky-posad', 'elektrostal'],
    photo: null,
    isConfirmed: false,
  },
];

/** true, если хотя бы у одного преподавателя есть подтверждённые данные. */
export const hasConfirmedTeachers = teachers.some((teacher) => teacher.isConfirmed && teacher.name);

export function getTeachersByBranch(slug: string): Teacher[] {
  return teachers.filter((teacher) => (teacher.branches as string[]).includes(slug));
}
