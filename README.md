# RandK Center

Сайт сети языковых и образовательных центров **RandK Center**
(Орехово-Зуево · Павловский Посад · Электросталь — 3 офиса в 3 городах).

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4

---

## Требования

**Node.js 24.x** — версия зафиксирована в `package.json` (`engines.node`), `.nvmrc`
и `Dockerfile`. Эти три места должны совпадать.

```bash
nvm use
```

---

## Быстрый старт

```bash
npm install
```

```bash
npm run dev
```

Откроется на <http://localhost:3000>.

## Команды

| Команда                    | Что делает                                |
| -------------------------- | ----------------------------------------- |
| `npm run dev`              | сервер разработки                         |
| `npm run build`            | **статическая** сборка в папку `out/`     |
| `npm run build:standalone` | сборка для VPS / Node.js-хостинга         |
| `npm run start`            | запуск standalone-сборки                  |
| `npm run typecheck`        | проверка типов                            |
| `npm run lint`             | ESLint                                    |
| `npm run format`           | Prettier                                  |
| `npm run images`           | пересоздать временные изображения         |
| `npm run redirects`        | пересобрать .htaccess и vercel.json       |
| `npm test`                 | проверка правил редиректа и синхронизации |

Перед сдачей изменений: `npm run typecheck && npm run lint && npm test && npm run build`.

---

## Сайт не собирает персональные данные

Форм заявок, квиза с телефоном, API-маршрутов и базы данных в проекте **нет**.
Все кнопки открывают контактное окно: выбор города → контакты офиса → звонок,
копирование номера, сообщество или маршрут. Телефоны и ссылки — обычные
`tel:` и `href`, поэтому работают и без JavaScript.

Именно поэтому возможна статическая сборка (см. ниже).

---

## Где менять контент

Весь редактируемый контент — в `src/content/`. **Править компоненты не нужно.**

| Что изменить                                 | Файл                                  |
| -------------------------------------------- | ------------------------------------- |
| Адреса, телефоны, графики, координаты офисов | `src/content/centers.ts`              |
| Города и их описания                         | `src/content/centers.ts` → `cities`   |
| Языки                                        | `src/content/languages.ts`            |
| Образовательные направления                  | `src/content/programs.ts`             |
| Отзывы                                       | `src/content/reviews.ts`              |
| Основная ссылка VK, реквизиты                | `src/content/site.ts`                 |
| Ссылки офисов в MAX                          | `src/content/centers.ts`              |
| Тексты главной                               | `src/content/home.ts`                 |
| Вопросы и ответы                             | `src/content/faq.ts`                  |
| Меню и подвал                                | `src/content/navigation.ts`           |
| Редиректы                                    | `src/config/redirects.data.json`      |
| Цвета, шрифты, отступы                       | `src/app/globals.css` (блок `@theme`) |

### Изменить адрес или телефон

```ts
// src/content/centers.ts
{
  id: 'orekhovo-zuevo-parkovskaya',
  address: 'ул. Парковская, д. 16/1',
  addressDetails: '2 этаж',            // null, если уточнений нет
  phone: '+79629026275',               // формат +7XXXXXXXXXX
  maxUrl: null,                        // ссылка офиса в MAX; null — кнопки нет
  schedule: ['Пн–Пт: 10:00–20:00'],    // [] — график не выводится
  coordinates: [55.8069, 38.9781],     // включает карту и LocalBusiness
  confirmed: true,                     // подтверждено клиентом
}
```

Значение подхватится везде: карточки, страница города, контактное окно, подвал,
мобильная панель и микроразметка.

Основное сообщество VK подтверждено: `https://vk.ru/randkcenter`. MAX хранится
отдельно у каждого офиса: ссылка Павловского Посада подтверждена, ссылки
Орехово-Зуева и Электростали ожидаются позже.

### Добавить офис

Добавьте объект в массив `offices` (`src/content/centers.ts`) с уникальным `id`
и нужным `citySlug`. Город автоматически покажет его отдельным блоком.

### Добавить язык

Добавьте объект в массив `seeds` (`src/content/languages.ts`):

```ts
{ slug: 'korean', title: 'Корейский язык', shortTitle: 'Корейский',
  code: 'KO', description: '…', active: true, confirmed: false }
```

Страница, маршрут, меню, подвал, каталог и `sitemap.xml` обновятся сами.
Чтобы временно скрыть язык — `active: false`.

### Преподаватели

**Информация о преподавателях на сайте не публикуется по решению клиента.**

Раздела `/teachers`, блока на главной и данных о преподавателях в проекте нет.
Старые адреса `/prepodovateli` и `/teachers` ведут 301-редиректом на `/about`.

Общие формулировки о формате обучения («занятия с преподавателем»,
«индивидуальные занятия», «работа в группе») сохранены: они описывают формат,
а не профили конкретных сотрудников.

### Заменить изображение

Положите файл в `public/images/client/`, обновите `src` и `alt` в контенте,
поставьте `isClientProvided: true`. Подробности — [IMAGE_ASSETS.md](./docs/IMAGE_ASSETS.md).

---

## Флаги видимости

У языков и направлений есть четыре флага — они позволяют централизованно
скрыть спорное направление, не удаляя контент:

| Флаг               | Что делает                      |
| ------------------ | ------------------------------- |
| `active`           | показывать ли на сайте вообще   |
| `confirmed`        | подтверждены ли данные клиентом |
| `showInNavigation` | выводить ли в основное меню     |
| `showInSitemap`    | включать ли в `sitemap.xml`     |

Пример: логопед и психолог активны (страницы существуют и индексируются),
но `showInNavigation: false` — в меню их нет до подтверждения услуги.

---

## Переменные окружения

Полный список — в [`.env.example`](./.env.example).

| Переменная                      | Обязательна  | Назначение                               |
| ------------------------------- | ------------ | ---------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | в production | canonical, sitemap, Open Graph           |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | нет          | ID счётчика Метрики                      |
| `BUILD_TARGET`                  | нет          | `export` (по умолчанию) или `standalone` |

Без ID Метрики счётчик не загружается вообще.

`NEXT_PUBLIC_SITE_URL` разбирается в [`src/lib/site-url.ts`](./src/lib/site-url.ts)
и сборку не роняет. Пустое значение, пробелы и отсутствие переменной молча дают
адрес из `src/content/site.ts`; значение без схемы (`randkcenter.ru`), с чужим
протоколом (`ftp://`, `javascript:`) или с query и якорем отбрасывается — в лог
сборки печатается `[seo] NEXT_PUBLIC_SITE_URL проигнорирован: …`. Завершающий
слэш снимается, поэтому `https://example.vercel.app/` и `https://example.vercel.app`
равнозначны.

⚠️ На Vercel объявленная, но незаполненная переменная приходит **пустой строкой**,
а не `undefined`. Именно на этом сборка падала с `TypeError: Invalid URL, input: ''`.
Проверки на все случаи — `node scripts/validate-site-url.mjs` (входит в `npm test`).

---

## Публикация

Подробное сравнение вариантов — [HOSTING_OPTIONS.md](./docs/HOSTING_OPTIONS.md).

### Вариант 1 — обычный хостинг (рекомендуется)

```bash
npm ci && npm run build
```

Загрузить **содержимое** папки `out/` в корень сайта на REG.RU.
Node.js и PHP на сервере не нужны. Файл `.htaccess` (редиректы, заголовки,
кэширование) генерируется автоматически — проверьте, что он загрузился:
FTP-клиенты часто скрывают файлы, начинающиеся с точки.

### Вариант 2 — VPS или Node.js-хостинг

```bash
npm ci && npm run build:standalone
```

```bash
NODE_ENV=production PORT=3000 node .next/standalone/server.js
```

Или через Docker:

```bash
docker build -t randk-center --build-arg NEXT_PUBLIC_SITE_URL=https://randkcenter.ru .
```

⚠️ Обычный PHP shared-хостинг для этого варианта не подходит.

### Чек-лист перед переключением домена

- [ ] `npm run build` проходит без ошибок
- [ ] подтверждены адреса, телефоны и графики трёх офисов
- [ ] добавлены координаты — иначе нет карты и `LocalBusiness`
- [ ] юридические тексты проверены юристом
- [ ] список редиректов сверен с Яндекс Вебмастером
- [ ] `robots.txt` и `sitemap.xml` отдаются на боевом домене

---

## Структура проекта

```
src/
├── app/                     маршруты (App Router)
│   ├── languages/[slug]/    страницы языков
│   ├── centers/[slug]/      страницы городов
│   ├── exams|tutoring|…/    страницы направлений
│   ├── sitemap.ts robots.ts manifest.ts
├── components/
│   ├── contact/             контактное окно и кнопки
│   ├── layout/              шапка, подвал, меню, мобильная панель
│   ├── sections/            секции страниц
│   ├── templates/           единые шаблоны языка и направления
│   └── ui/                  кнопки, карточки, карта, аккордеон
├── config/redirects.ts      единый источник правил редиректа
├── content/                 ← ВЕСЬ РЕДАКТИРУЕМЫЙ КОНТЕНТ
└── lib/                     SEO, JSON-LD, аналитика, утилиты
```

---

## Документация

| Документ                                                               | О чём                                  |
| ---------------------------------------------------------------------- | -------------------------------------- |
| [PROJECT_BRIEF](./docs/PROJECT_BRIEF.md)                               | задачи, рамки, стек                    |
| [CURRENT_IMPLEMENTATION_AUDIT](./docs/CURRENT_IMPLEMENTATION_AUDIT.md) | аудит перед доработкой                 |
| [CONTENT_TODO](./docs/CONTENT_TODO.md)                                 | **что должен предоставить клиент**     |
| [IMAGE_ASSETS](./docs/IMAGE_ASSETS.md)                                 | изображения и их замена                |
| [DESIGN_SYSTEM](./docs/DESIGN_SYSTEM.md)                               | цвет, типографика, сетка, анимация     |
| [DECISIONS](./docs/DECISIONS.md)                                       | принятые решения и их причины          |
| [HOSTING_OPTIONS](./docs/HOSTING_OPTIONS.md)                           | размещение в российской инфраструктуре |
| [REDIRECT_PLAN](./docs/REDIRECT_PLAN.md)                               | перенос со старого сайта               |
| [ASSUMPTIONS](./docs/ASSUMPTIONS.md)                                   | временные допущения                    |
| [PROGRESS](./docs/PROGRESS.md)                                         | что сделано и что дальше               |

---

Разработка — [EO LABS](https://eolabs.ru/)
