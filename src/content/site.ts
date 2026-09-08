/**
 * Глобальная конфигурация: бренд, соцсети, реквизиты.
 *
 * ЕДИНСТВЕННОЕ МЕСТО, где меняются ссылки и реквизиты.
 * Телефоны и адреса живут в `centers.ts` — они привязаны к офисам,
 * а не к сети в целом.
 */

export const site = {
  name: 'RandK Center',
  tagline: 'Сеть языковых и образовательных центров',
  description:
    'RandK Center — сеть языковых и образовательных центров для детей, подростков и взрослых в Орехово-Зуеве, Павловском Посаде и Электростали.',
  url: 'https://randkcenter.ru',
  locale: 'ru_RU',

  /**
   * Соцсети.
   * MAX хранится в данных конкретного офиса (`centers.ts`), поскольку
   * у каждого центра будет собственная ссылка.
   */
  social: {
    vkPrimary: 'https://vk.ru/randkcenter',
    vkAll: ['https://vk.ru/randkcenter'],
    isVkPrimaryConfirmed: true,
  },

  /**
   * Реквизиты организации для юридических страниц.
   * Не переданы → блок реквизитов скрывается автоматически.
   */
  legal: {
    entityName: null as string | null,
    inn: null as string | null,
    ogrn: null as string | null,
    legalAddress: null as string | null,
    licenseNumber: null as string | null,
    privacyEmail: null as string | null,
    documentsUpdatedAt: null as string | null,
    confirmed: false,
  },

  developer: {
    name: 'EO LABS',
    url: 'https://eolabs.ru/',
  },

  copyrightStartYear: 2026,
} as const;
