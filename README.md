# RandK Center

Сайт сети образовательных и языковых центров **RandK Center**
(Орехово-Зуево · Павловский Посад · Электросталь).

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Zod

---

## Быстрый старт

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Откроется на <http://localhost:3000>.

> Без переменных окружения сайт полностью работает: заявки печатаются в консоль сервера,
> счётчик аналитики не загружается.

## Команды

| Команда             | Что делает                                   |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | сервер разработки                            |
| `npm run build`     | production-сборка                            |
| `npm run start`     | запуск собранного приложения (после `build`) |
| `npm run typecheck` | проверка типов (`tsc --noEmit`)              |
| `npm run lint`      | ESLint                                       |
| `npm run format`    | форматирование Prettier                      |

Перед сдачей изменений: `npm run typecheck && npm run lint && npm run build`.

---

## Переменные окружения

Полный список с пояснениями — в [`.env.example`](./.env.example).

| Переменная                      | Обязательна       | Назначение                     |
| ------------------------------- | ----------------- | ------------------------------ |
| `NEXT_PUBLIC_SITE_URL`          | в production      | canonical, sitemap, Open Graph |
| `TELEGRAM_BOT_TOKEN`            | для приёма заявок | токен бота                     |
| `TELEGRAM_CHAT_ID`              | для приёма заявок | чат, куда приходят заявки      |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | нет               | ID счётчика Метрики            |

### Telegram

1. Напишите [@BotFather](https://t.me/BotFather) → `/newbot` → скопируйте токен.
2. Добавьте бота в рабочий чат и отправьте туда любое сообщение.
3. Откройте `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и возьмите `result[0].message.chat.id`.
4. Впишите оба значения в `.env.local` (или в переменные окружения хостинга).

⚠️ **Важно:** если переменные не заданы, в production форма показывает пользователю ошибку и
заявка **не сохраняется**. Настройте канал до запуска.

---

## Где менять контент

Весь редактируемый контент лежит в `src/content/` — **править компоненты не нужно**.

| Что нужно изменить                             | Файл                                  |
| ---------------------------------------------- | ------------------------------------- |
| Телефон, почта, соцсети, реквизиты             | `src/content/site.ts`                 |
| Адреса, графики, карты, программы филиалов     | `src/content/branches.ts`             |
| Направления обучения, цены, описания           | `src/content/programs.ts`             |
| Преподаватели                                  | `src/content/teachers.ts`             |
| Отзывы                                         | `src/content/reviews.ts`              |
| Тексты главной, преимущества, блок результатов | `src/content/home.ts`                 |
| Вопросы и ответы                               | `src/content/faq.ts`                  |
| Меню и подвал                                  | `src/content/navigation.ts`           |
| Редиректы со старого сайта                     | `src/config/redirects.ts`             |
| Цвета, шрифты, отступы                         | `src/app/globals.css` (блок `@theme`) |

### Правило неподтверждённых данных

Сайт **никогда не показывает выдуманный факт**. Неподтверждённые поля равны `null`,
сущности имеют флаг `isConfirmed`.

Пример — включить контакты филиала:

```ts
// src/content/branches.ts
{
  slug: 'orekhovo-zuevo',
  address: 'ул. Парковская, д. 16',        // было null
  phone: '+79629026275',                   // было null
  schedule: ['Пн–Пт: 10:00–20:00', 'Сб: 10:00–17:00'],
  coordinates: [55.8069, 38.9781],
  isConfirmed: true,                       // ← включает публикацию
}
```

После этого автоматически появятся: адрес и телефон на странице и в карточке, кликабельный `tel:`,
карта Яндекса, кнопка «Построить маршрут» и микроразметка `LocalBusiness`.

Что ещё предстоит получить от клиента — [`docs/CONTENT_TODO.md`](./docs/CONTENT_TODO.md).

### Добавить программу

Один объект в массив `programs` (`src/content/programs.ts`) — страница, маршрут, карточки, фильтры,
меню, подвал и `sitemap.xml` обновятся сами.

### Заменить изображения

Положить файл в `public/images/` по тому же пути и обновить `src` в контенте.
Подробности — [`docs/IMAGE_SOURCES.md`](./docs/IMAGE_SOURCES.md).

---

## Структура проекта

```
src/
├── app/                    маршруты (App Router)
│   ├── api/lead/           приём заявок
│   ├── branches/[slug]/    страницы городов
│   ├── programs/[slug]/    страницы направлений
│   ├── sitemap.ts          карта сайта (строится из контента)
│   └── robots.ts
├── components/
│   ├── analytics/          Яндекс Метрика
│   ├── forms/              формы, квиз, модальное окно
│   ├── layout/             шапка, подвал, меню
│   ├── sections/           секции страниц
│   └── ui/                 кнопки, аккордеон, карта, иконки
├── config/redirects.ts     301-редиректы со старого сайта
├── content/                ← ВЕСЬ РЕДАКТИРУЕМЫЙ КОНТЕНТ
├── lib/                    схема заявки, SEO, JSON-LD, аналитика, утилиты
└── server/notifiers/       адаптеры доставки заявок
```

---

## Публикация

Приложение собирается в режиме `output: 'standalone'` — на сервере не нужен `node_modules`.

### Вариант 1 — Docker (рекомендуется)

```bash
docker build -t randk-center --build-arg NEXT_PUBLIC_SITE_URL=https://randkcenter.ru .
```

```bash
docker run -d -p 3000:3000 --env-file .env.production --restart unless-stopped randk-center
```

⚠️ `NEXT_PUBLIC_*` встраиваются в клиентский бандл **на этапе сборки**, поэтому передаются
через `--build-arg`, а не только через `--env-file`.

### Вариант 2 — Node-хостинг

```bash
npm ci && npm run build
```

Скопировать на сервер `.next/standalone`, `.next/static` и `public`, затем:

```bash
NODE_ENV=production PORT=3000 node server.js
```

Процесс держать под `pm2` или systemd.

### Вариант 3 — Vercel

Импортировать репозиторий, задать переменные окружения. Сборка настройки не требует.

### Nginx перед приложением

```nginx
server {
    server_name randkcenter.ru www.randkcenter.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`X-Forwarded-For` нужен для ограничения частоты заявок в `/api/lead`.

SSL — через `certbot --nginx -d randkcenter.ru -d www.randkcenter.ru`.

### Чек-лист перед переключением домена

- [ ] `npm run build` проходит без ошибок
- [ ] заданы `NEXT_PUBLIC_SITE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- [ ] тестовая заявка дошла в Telegram
- [ ] заполнены адреса, телефоны и реквизиты ([CONTENT_TODO](./docs/CONTENT_TODO.md))
- [ ] юридические тексты проверены юристом
- [ ] список редиректов сверен с Яндекс Вебмастером ([REDIRECT_PLAN](./docs/REDIRECT_PLAN.md))
- [ ] `robots.txt` и `sitemap.xml` отдаются на боевом домене
- [ ] сайт добавлен в Яндекс Вебмастер, отправлен sitemap

---

## Документация

| Документ                                 | О чём                              |
| ---------------------------------------- | ---------------------------------- |
| [PROJECT_BRIEF](./docs/PROJECT_BRIEF.md) | задачи, рамки, стек, структура     |
| [ASSUMPTIONS](./docs/ASSUMPTIONS.md)     | временные допущения и их риск      |
| [CONTENT_TODO](./docs/CONTENT_TODO.md)   | **что должен предоставить клиент** |
| [DESIGN_SYSTEM](./docs/DESIGN_SYSTEM.md) | цвет, типографика, сетка, анимация |
| [DECISIONS](./docs/DECISIONS.md)         | принятые решения и их причины      |
| [REDIRECT_PLAN](./docs/REDIRECT_PLAN.md) | перенос со старого сайта           |
| [IMAGE_SOURCES](./docs/IMAGE_SOURCES.md) | происхождение изображений          |
| [PROGRESS](./docs/PROGRESS.md)           | что сделано и что дальше           |

---

Разработка — [EO LABS](https://eolabs.ru/)
