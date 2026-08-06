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
   *
   * Клиент передал два сообщества VK, основное пока не выбрано.
   * До решения в интерфейсе используется `vkPrimary` — меняется здесь,
   * одной строкой, и подхватывается везде (см. CONTENT_TODO.md).
   */
  social: {
    vkPrimary: 'https://vk.ru/randkcenter1',
    vkAll: ['https://vk.ru/randk', 'https://vk.ru/randkcenter1'],
    /**
     * MAX: ссылка не передана. Пока значение `null`, кнопка не отображается
     * вовсе — без пустого места и без «мёртвого» элемента.
     */
    max: null as string | null,
    isVkPrimaryConfirmed: false,
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

/** Ссылка MAX, если она задана. */
export const maxUrl: string | null = site.social.max;

/** Основное сообщество VK. */
export const vkUrl: string = site.social.vkPrimary;
