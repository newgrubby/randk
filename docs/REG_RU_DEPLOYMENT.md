# Размещение RandK Center на виртуальном хостинге REG.RU

Production: `https://randkcenter.ru`
Формат: полностью статический экспорт Next.js, без Node.js, PHP и MySQL.

## 1. Перед началом

- Получить доступ к панели REG.RU и File Manager либо FTP/SFTP.
- Уточнить document root именно домена `randkcenter.ru` (часто `public_html`, но имя зависит от тарифа и привязки домена).
- Убедиться, что для домена можно включить SSL-сертификат.
- Зафиксировать текущую дату миграции и ответственного.
- Не включать HSTS до завершения проверки HTTPS на production.

### Backup старого сайта

До замены файлов:

1. Скачать полный текущий document root в отдельный архив.
2. Отдельно сохранить старый `.htaccess` (это скрытый файл).
3. Экспортировать или сделать скриншоты текущих DNS-записей и nameservers.
4. Проверить, что архив открывается и содержит старую главную страницу и assets.
5. Не удалять backup после запуска; указать в имени архива дату миграции.

## 2. Production-сборка

В корне проекта `E:\projects\Randk` выполнить:

```powershell
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run audit:predeploy
npm run format:check
git diff --check
```

Готовый сайт находится в:

```text
E:\projects\Randk\out
```

Перед загрузкой проверить, что внутри есть как минимум:

```text
.htaccess
index.html
404.html
_next/
images/
favicon.ico
icon.svg
apple-icon.png
manifest.webmanifest
robots.txt
sitemap.xml
```

`NEXT_PUBLIC_SITE_URL` при production-сборке должен быть пустым/не заданным либо равным `https://randkcenter.ru`. `NEXT_PUBLIC_YANDEX_METRIKA_ID` задаётся только подтверждённым ID клиента; придумывать ID нельзя.

## 3. Загрузка на REG.RU

1. Открыть File Manager или подключиться по FTP/SFTP.
2. Открыть document root сайта `randkcenter.ru`.
3. Убедиться, что backup старого сайта уже сохранён.
4. Загрузить **содержимое** `E:\projects\Randk\out`, а не саму папку `out`.
5. Проверить, что `index.html` лежит непосредственно в document root, а не в `public_html/out/index.html`.
6. Отдельно убедиться, что скрытый файл `.htaccess` загружен.
7. Для каталогов обычно подходят права `755`, для файлов — `644`. Не ставить `777`.
8. В панели REG.RU привязать домен к этому document root, если он ещё не привязан.
9. Подключить SSL-сертификат и дождаться его активации.
10. Выполнить весь post-deploy checklist ниже.

`.htaccess` использует только типичные директивы Apache. Опциональные headers, expires, MIME и gzip обёрнуты в `<IfModule>`; Brotli и HSTS намеренно не включены. Если REG.RU вернёт HTTP 500, сначала посмотреть error log и проверить разрешённые директивы `.htaccess`, не удаляя файл целиком: без него пропадут SEO-редиректы, canonical host и реальный custom 404.

## 4. DNS и безопасность почты

DNS сейчас менять не нужно.

- Если домен уже использует DNS и hosting REG.RU, обычно достаточно привязать домен к нужному document root.
- Если nameservers или DNS находятся у другого провайдера, сначала полностью зафиксировать текущее состояние и только потом планировать изменения.
- Не менять и не удалять MX-записи при переносе сайта.
- До любых будущих DNS-изменений сохранить и перепроверить `MX`, `TXT`, `SPF`, `DKIM`, `DMARC`.
- Если используется почта на `@randkcenter.ru`, после любых будущих DNS-изменений отдельно проверить отправку и получение писем.

## 5. Post-deploy checklist

### HTTP и маршруты

- `/` и все 25 маршрутов из вывода `npm run audit:export` возвращают `200`.
- `/contacts` возвращает один `301` на `/contacts/`, затем `200`.
- `/languages` возвращает один `301` на `/languages/`, затем `200`.
- Случайный URL, например `/qa-404-2026-xyz`, возвращает настоящий HTTP `404` и показывает custom 404, без редиректа на главную.

### HTTPS и host

- `http://randkcenter.ru/path?x=1` → один `301` → `https://randkcenter.ru/path?x=1`.
- `http://www.randkcenter.ru/path?x=1` → один `301` → `https://randkcenter.ru/path?x=1`.
- `https://www.randkcenter.ru/path?x=1` → один `301` → `https://randkcenter.ru/path?x=1`.
- Для каталога без слэша host/protocol и trailing slash нормализуются за один переход.
- HSTS не включать, пока все варианты HTTPS не проверены и сертификат не стабилен.

### Legacy SEO redirects

- Выполнить `npm run check:deployment -- https://randkcenter.ru` после upload.
- Сверить результат с `docs/REDIRECT_VALIDATION_MATRIX.md`.
- Каждое legacy-правило должно дать один `301`, затем целевую страницу `200`.
- Проверить `/fotogalereya?album_id=123`: переход должен вести сразу на canonical destination без старого query.
- Не допускаются `302`, `307`, цепочки и циклы.

### Assets и MIME

- JS и CSS из `/_next/static/` возвращают `200` и имеют долгий immutable cache.
- AVIF, WebP, SVG, WOFF2 и `manifest.webmanifest` возвращаются с корректными Content-Type.
- HTML, `robots.txt`, `sitemap.xml` и manifest не имеют immutable cache.
- Проверить favicon, SVG/PNG icons и theme color.
- Проверить, что gzip включается сервером при доступном `mod_deflate`; отсутствие Brotli не является ошибкой.

### SEO

- На каждой indexable странице один H1, один self-canonical на `https://randkcenter.ru/.../`, уникальные title и description.
- `/privacy/` и `/cookies/` имеют `noindex, follow` и отсутствуют в sitemap.
- `https://randkcenter.ru/sitemap.xml` содержит только production URL и страницы `200`.
- `https://randkcenter.ru/robots.txt` разрешает crawl и указывает production sitemap.
- Проверить JSON-LD и отсутствие удалённого офиса.

### Функциональность и responsive

- Mobile menu, нижняя навигация, FAQ, contact modal, кнопка «Наверх».
- Телефонные `tel:`-ссылки, VK, три отдельные ссылки MAX, кнопки маршрута.
- Яндекс Карты/маршруты, lazy loading и fallback.
- События Яндекс Метрики — только если передан реальный production ID; ошибок в console нет.
- Проверить viewport: `1440`, `1024`, `768`, `430`, `390`, `360` px.
- На первом экране сразу видны H1/LCP-контент; браузер выбирает AVIF или WebP из responsive `srcset`.

## 6. Demo на Vercel

После запуска production demo `randk1.vercel.app` должен оставаться закрытым от индексации. Предпочтительный вариант — Vercel Deployment Protection (пароль/авторизация). Если публичный demo необходим, добавить для него response header `X-Robots-Tag: noindex, nofollow` и проверить его через `curl -I`; не переносить этот header на `randkcenter.ru`. Одного `robots.txt` недостаточно для надёжного исключения уже известных поисковику URL.

## 7. Search migration

После успешного запуска:

1. Добавить/проверить `https://randkcenter.ru/sitemap.xml` в Яндекс Вебмастере.
2. Дождаться обработки sitemap и проверить ошибки.
3. Проверить несколько старых URL инструментом ответа сервера.
4. Отправить главную, основные языки, программы и страницы центров на переобход.
5. Если используется Google Search Console, повторить те же действия там.
6. Контролировать redirects, 404, canonical, coverage и органический трафик в Day 0, 1, 3, 7, 14 и 30.

## 8. Rollback

Если production QA выявил критическую проблему:

1. Прекратить дальнейшую загрузку файлов.
2. Вернуть содержимое предыдущего document root из проверенного backup.
3. Вернуть старый `.htaccess`.
4. Не менять DNS, если во время миграции он не менялся.
5. Очистить серверный cache, если он включён хостингом.
6. Повторно проверить главную, основные страницы, старые URL и почту.
7. Зафиксировать причину rollback и не удалять неудачный пакет до разбора.

## 9. Данные, требующие подтверждения клиента

- Production ID Яндекс Метрики, если аналитика должна быть включена.
- Актуальность телефонов, адресов, графиков и трёх ссылок MAX.
- Юридические реквизиты и контакт по вопросам privacy (сейчас в контенте не подтверждены).
- Фактический document root и доступный набор Apache-модулей на тарифе REG.RU.
- Наличие и схема работы почты на `@randkcenter.ru`.

Флаги `confirmed` у офисов не менять без отдельного подтверждения клиента.
