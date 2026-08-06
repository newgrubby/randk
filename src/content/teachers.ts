import { offices } from './centers';
import type { Teacher } from './types';

/**
 * Преподаватели.
 *
 * Реальные данные не переданы. Карточки нейтральные: показана только
 * специализация — без ФИО, фотографий, дипломов, сертификатов и стажа.
 * Вымышленных людей мы не создаём, поэтому портрет заменён графическим знаком.
 *
 * Как заполнить: указать `name`, `photo`, при необходимости уточнить `role`
 * и `focus`, ограничить `offices` и поставить `confirmed: true`.
 * См. /docs/CONTENT_TODO.md.
 */

const allOffices = offices.map((office) => office.id);

export const teachers: Teacher[] = [
  {
    id: 'languages',
    name: null,
    role: 'Преподаватель иностранных языков',
    focus: ['Группы для школьников', 'Разговорная практика'],
    offices: allOffices,
    photo: null,
    confirmed: false,
  },
  {
    id: 'exams',
    name: null,
    role: 'Преподаватель подготовки к ОГЭ и ЕГЭ',
    focus: ['Формат экзамена', 'Работа с критериями'],
    offices: allOffices,
    photo: null,
    confirmed: false,
  },
  {
    id: 'preschool',
    name: null,
    role: 'Педагог дошкольного направления',
    focus: ['Подготовка к школе', 'Развивающие занятия'],
    offices: allOffices,
    photo: null,
    confirmed: false,
  },
  {
    id: 'tutoring',
    name: null,
    role: 'Преподаватель школьных предметов',
    focus: ['Индивидуальные занятия', 'Работа с пробелами'],
    offices: allOffices,
    photo: null,
    confirmed: false,
  },
];

/** true, если у кого-то из преподавателей есть подтверждённые данные. */
export const hasConfirmedTeachers = teachers.some(
  (teacher) => teacher.confirmed && teacher.name !== null,
);

export function getTeachersByOffice(officeId: string): Teacher[] {
  return teachers.filter((teacher) => teacher.offices.includes(officeId));
}
