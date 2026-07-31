/**
 * Глобальная конфигурация сайта: бренд, контакты, соцсети, реквизиты.
 *
 * ЭТО ЕДИНСТВЕННОЕ МЕСТО, где меняются телефон, почта, ссылки и реквизиты.
 * Ничего из этого не должно дублироваться в компонентах.
 */

export const site = {
  name: 'RandK Center',
  legalNameShort: 'RandK Center',
  /** Дескриптор бренда рядом с логотипом. */
  tagline: 'Сеть образовательных и языковых центров',
  description:
    'RandK Center — сеть образовательных и языковых центров для детей, подростков и взрослых в Орехово-Зуеве, Павловском Посаде и Электростали.',
  url: 'https://randkcenter.ru',
  locale: 'ru_RU',

  /**
   * Единый контакт сети.
   * Телефон и почта не подтверждены клиентом → на сайте не показываются.
   * Чтобы включить: заполните значение и переведите флаг в `true`.
   */
  contacts: {
    phone: null as string | null,
    phoneDisplay: null as string | null,
    email: null as string | null,
    isConfirmed: false,
  },

  /**
   * Соцсети.
   * VK: клиент передал два сообщества, основное пока не выбрано.
   * До решения в интерфейсе используется `vkPrimary` (см. CONTENT_TODO.md).
   */
  social: {
    vkPrimary: 'https://vk.ru/randkcenter1',
    vkAll: ['https://vk.ru/randk', 'https://vk.ru/randkcenter1'],
    /** MAX: ссылка не передана — кнопка скрыта, пока значение null. */
    max: null as string | null,
    isVkPrimaryConfirmed: false,
  },

  /**
   * Реквизиты организации.
   * Нужны для юридических страниц и микроразметки.
   * Пока не переданы — блоки реквизитов скрываются автоматически.
   */
  legal: {
    entityName: null as string | null,
    inn: null as string | null,
    ogrn: null as string | null,
    legalAddress: null as string | null,
    licenseNumber: null as string | null,
    /** Адрес для запросов по персональным данным. */
    privacyEmail: null as string | null,
    /** Дата последней редакции юридических документов. */
    documentsUpdatedAt: null as string | null,
    isConfirmed: false,
  },

  /** Куда уходят заявки — задаётся переменными окружения, не в коде. */
  leads: {
    /** Показывать ли в форме поле «Город». */
    askCity: true,
  },

  developer: {
    name: 'EO LABS',
    url: 'https://eolabs.ru/',
  },

  /** Год основания для копирайта. Не является фактом о сроке работы центра. */
  copyrightStartYear: 2026,
} as const;

/** true, если у сети есть подтверждённый общий телефон. */
export const hasNetworkPhone = Boolean(site.contacts.isConfirmed && site.contacts.phone);

/** true, если есть подтверждённая почта. */
export const hasNetworkEmail = Boolean(site.contacts.isConfirmed && site.contacts.email);
