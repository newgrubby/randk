# Передача сайта RandK Center

## Основные данные

- Production domain: `https://randkcenter.ru`
- Репозиторий: `https://github.com/newgrubby/randk`
- Production-ветка: `main`
- Хостинг: обычный виртуальный хостинг REG.RU
- Регистратор домена: NIC.RU
- Ожидаемый корень сайта: `/www/randkcenter.ru/`
- Node.js: 24.x

## Сборка и размещение

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run format:check
npm run audit:predeploy
```

Deploy artifact — **содержимое** локальной папки `out/`, а не сама папка.
Перед загрузкой сделайте архив текущего document root на хостинге с датой в
имени. Затем загрузите содержимое `out/` в `/www/randkcenter.ru/`.

Файл `out/.htaccess` обязателен: он отвечает за HTTPS, non-www, legacy
redirects, trailing slash, 404, MIME-типы, кэширование и сжатие. FTP-клиенты
могут скрывать dot-файлы, поэтому его наличие нужно проверить отдельно.

Полная пошаговая инструкция: [REG_RU_DEPLOYMENT.md](./REG_RU_DEPLOYMENT.md).

## Откат

1. Не удалять архив предыдущей production-версии после запуска.
2. При критической ошибке очистить только содержимое document root.
3. Восстановить содержимое последнего рабочего архива вместе с `.htaccess`.
4. Проверить главную, контакты, `robots.txt`, `sitemap.xml` и один legacy URL.

Откат файлов не требует изменения DNS.

## Где менять данные

- Контакты, адреса, телефоны, MAX, координаты и графики офисов:
  `src/content/centers.ts`
- Основной VK, реквизиты и production domain: `src/content/site.ts`
- Идентификатор Яндекс Метрики: переменная
  `NEXT_PUBLIC_YANDEX_METRIKA_ID`
- Контент направлений и языков: `src/content/programs.ts` и
  `src/content/languages.ts`
- Legacy redirects: `src/config/redirects.data.json`; после изменения выполнить
  `npm run redirects` и `npm test`

## SEO и аналитика

- Canonical URL формируются для `https://randkcenter.ru`.
- `robots.txt`, `sitemap.xml`, Open Graph и JSON-LD создаются сборкой.
- Метрика не загружается, если `NEXT_PUBLIC_YANDEX_METRIKA_ID` не задан.
- При миграции нужно сохранить все 40 legacy redirects без цепочек и циклов.

## Проверка после публикации

- Главная и основные разделы отвечают `200` по HTTPS без `www`.
- `http://` и `www` переходят на canonical URL одним `301`.
- Старые URL переходят одним `301`, конечная страница отвечает `200`.
- Несуществующий URL отвечает `404` и показывает страницу ошибки.
- Доступны `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`.
- Нет битых изображений, ошибок в консоли и горизонтальной прокрутки на
  мобильном экране.
- Телефоны, VK, MAX, маршруты и карта работают.

Для автоматической проверки опубликованного сайта используйте:

```bash
npm run check:deployment -- https://randkcenter.ru
```
