# REDIRECT_PLAN — перенос со старого сайта

Цель: заменить сайт на `randkcenter.ru`, не потеряв позиции в поиске.

**Единый источник правил:** `src/config/redirects.data.json`.

Из него генератор `scripts/generate-redirects.mjs` собирает:

- `public/.htaccess` — редиректы на REG.RU и любом Apache (попадает в `out/`);
- `vercel.json` — редиректы на Vercel (лежит в корне репозитория);
- `next.config.ts → redirects()` — только в режиме standalone.

Синхронизацию проверяет `npm test`: количество и содержимое правил во всех
трёх местах должны совпадать.

## Источник данных

Список собран с публичной навигации `randkcenter.ru` (31.07.2026) и дополнен
адресами первой версии нового сайта, изменившимися при доработке структуры.

Перед переключением домена сверьте список с:

- Яндекс Вебмастер → «Страницы в поиске»;
- Яндекс Метрика → «Содержание → Популярные страницы» за 12 месяцев.

## Старый сайт → новый

### Информационные страницы

| Старый URL                 | Новый URL                           |
| -------------------------- | ----------------------------------- |
| `/about`                   | `/about` (совпал, правило не нужно) |
| `/uchebnyy_process`        | `/about`                            |
| `/prepodovateli`           | `/about`                            |
| `/otzyvy_nashih_studentov` | `/reviews`                          |
| `/address`                 | `/contacts`                         |
| `/fotogalereya`            | `/about`                            |
| `/voprosy_i_otvety`        | `/#faq`                             |

### Языки — теперь у каждого своя страница

| Старый URL             | Новый URL            |
| ---------------------- | -------------------- |
| `/inostrannye_yazyki1` | `/languages`         |
| `/angliyskiy_yazyk`    | `/languages/english` |
| `/nemeckiy_yazyk`      | `/languages/german`  |
| `/francuzskiy_yazyk`   | `/languages/french`  |
| `/ispanskiy-yazyk`     | `/languages/spanish` |
| `/italyanskiy-yazyk`   | `/languages/italian` |
| `/kitayskiy-yazyk`     | `/languages/chinese` |

Раньше все языки вели в один общий раздел. Теперь у каждого отдельная страница —
это отдельные поисковые запросы вида «курсы немецкого в Орехово-Зуеве».

### Направления

| Старый URL                   | Новый URL           |
| ---------------------------- | ------------------- |
| `/podgotovka_k_ege`          | `/exams`            |
| `/repetitorstvo`             | `/tutoring`         |
| `/podgotovka_detey_k_shkole` | `/preschool`        |
| `/ritmika_i_tancy`           | `/development`      |
| `/logoped`                   | `/speech-therapist` |
| `/psiholog`                  | `/psychologist`     |

### Форматы и формы

| Старый URL                  | Новый URL   |
| --------------------------- | ----------- |
| `/gruppovyye-zanyatiya`     | `/programs` |
| `/individualnyye-zanyatiya` | `/programs` |
| `/kursy-dlya-detey`         | `/programs` |
| `/zapisatsya-na-kursy`      | `/contacts` |
| `/zakazat-zvonok`           | `/contacts` |

### Не переносится 1:1

| Старый URL          | Новый URL   | Причина                                        |
| ------------------- | ----------- | ---------------------------------------------- |
| `/news`             | `/`         | новостей на сайте нет                          |
| `/article_post/:id` | `/`         | на старом сайте — шаблонная заглушка платформы |
| `/vakansii`         | `/contacts` | раздела вакансий нет                           |

## Первая версия нового сайта → текущая

Структура изменилась, старые адреса тестовой версии тоже перенаправляются.

| Было                                  | Стало                                       |
| ------------------------------------- | ------------------------------------------- |
| `/branches`                           | `/centers`                                  |
| `/branches/orekhovo-zuevo`            | `/centers/orekhovo-zuevo`                   |
| `/branches/pavlovsky-posad`           | `/centers/pavlovsky-posad`                  |
| `/branches/elektrostal`               | `/centers/elektrostal`                      |
| `/programs/inostrannye-yazyki`        | `/languages`                                |
| `/programs/angliyskiy-yazyk`          | `/languages/english`                        |
| `/programs/podgotovka-k-ege-oge`      | `/exams`                                    |
| `/programs/shkolnye-predmety`         | `/tutoring`                                 |
| `/programs/podgotovka-k-shkole`       | `/preschool`                                |
| `/programs/razvivayushchie-zanyatiya` | `/development`                              |
| `/programs/individualnye-zanyatiya`   | `/programs`                                 |
| `/personal-data-consent`              | `/privacy` (форм нет, данные не собираются) |

Всего 39 правил.

## Что намеренно не переносится

- **Цены** — актуальность не подтверждена;
- **Отзывы** («Ольга», «Виктор») — авторство не подтверждено;
- **Акция** «приведи друга — 10 % скидки» — срок не подтверждён;
- **Формулировка** «ПРИ СОДЕЙСТВИИ ПРАВИТЕЛЬСТВА МОСКОВСКОЙ ОБЛАСТИ» — статус не подтверждён;
- **Новости** — шаблонный текст платформы.

## Внешние ссылки старого сайта

| Ссылка                  | Комментарий                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| `http://detklub-rk.ru/` | «Развивающие занятия» вели на отдельный домен. Требуется решение клиента |
| `randk-oz.ru`           | Сторонний сайт, содержимое не используется без подтверждения владельца   |

## Порядок переключения

1. **До переключения:** дополнить список из Вебметрики, заполнить адреса и
   реквизиты, развернуть на тестовом домене.
2. **Переключение:** загрузить `out/` на хостинг, переключить DNS, выпустить SSL,
   проверить `/robots.txt` и `/sitemap.xml`.
3. **После:** проверить редиректы, добавить сайт в Вебмастер, отправить sitemap,
   1–2 месяца следить за отчётом «Страницы в поиске → Исключённые».

DNS и домен переключает клиент или его хостинг-провайдер.

## Проверка

Для статической сборки правила лежат в `out/.htaccess` — проверяются после
загрузки на хостинг:

```bash
curl -I https://randkcenter.ru/nemeckiy_yazyk
```

Ожидается `301` и `Location: /languages/german`.

Для standalone-режима то же проверяется локально:

```bash
node -e "const p=['/nemeckiy_yazyk','/address','/branches'];(async()=>{for(const x of p){const r=await fetch('http://localhost:3000'+x,{redirect:'manual'});console.log(x,r.status,r.headers.get('location'))}})()"
```
