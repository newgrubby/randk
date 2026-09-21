# IMAGE_ASSETS — реестр фотографий

## Статус

Основная серия редакционных иллюстраций завершена и подключена: 19 WebP.
Общий вес — 1 510 744 байта
(1 475,3 KiB / 1,441 MiB). Самый тяжёлый файл — `hero/hero-main.webp`,
180 698 байт (176,5 KiB).

Все кадры проверены визуально на лица, руки и пальцы, псевдотекст, логотипы,
рамки, виньетку, цветовой сдвиг и краевые артефакты. Брака, требующего
перегенерации, не обнаружено. Геометрический inset не применялся. Фото людей —
редакционные иллюстрации; они не изображают сотрудников или учеников RandK.

## Общая спецификация серии

- premium editorial education photography;
- тёплый естественный свет, cream / beige / graphite / warm wood;
- мягкие burgundy accents, естественные эмоции и не постановочное действие;
- без текста, сторонних логотипов, флагов как главного элемента, film border,
  vintage tint и vignette;
- без выдуманных фасадов RandK и без выдачи сгенерированных людей за реальных
  преподавателей;
- статический экспорт: исходники заранее оптимизированы в WebP;
- `priority` используется только у hero; остальные фотографии — `loading="lazy"`;
- пропорции контейнеров заданы явно, визуальный кроп выполняется через
  `object-fit: cover`, а responsive-выбор — через `sizes`.

## Городские фотографии карточек центров

Три фотографии предоставлены пользователем в текущей задаче и используются
только в верхней зоне карточек на `/centers/`. Внешнего hotlinking нет. Из PNG
сделаны локальные WebP 1000×688 (≈16:11): применены аккуратный crop, лёгкое
снижение насыщенности и контраста и слабая тёплая cream-коррекция. Текст и
декоративные элементы поверх фотографий не добавлялись.

| Город            | Локальный файл                | Полученный исходник        | Автор / лицензия              | Размер исходника |          Итоговый WebP | `object-position` |
| ---------------- | ----------------------------- | -------------------------- | ----------------------------- | ---------------: | ---------------------: | ----------------- |
| Павловский Посад | `cities/pavlovsky-posad.webp` | вложение пользователя, № 1 | в переданном файле не указаны |          700×467 |  1000×688, 72 888 байт | `50% 50%`         |
| Орехово-Зуево    | `cities/orekhovo-zuevo.webp`  | вложение пользователя, № 3 | в переданном файле не указаны |         1278×719 | 1000×688, 105 588 байт | `54% 50%`         |
| Электросталь     | `cities/elektrostal.webp`     | вложение пользователя, № 2 | в переданном файле не указаны |          900×600 |  1000×688, 57 478 байт | `50% 50%`         |

Исходные URL, авторы и условия лицензий во вложениях отсутствуют, поэтому они
не приписаны прежним авторам Commons. Перед публичным использованием права на
эти конкретные файлы нужно подтвердить у предоставившей их стороны.

Привязка сюжетов к городам дополнительно проверена по самим объектам:

- Павловский Посад — Воскресенская колокольня, градостроительная доминанта
  исторического центра города;
- Орехово-Зуево — набережная Клязьмы вдоль комплекса Никольской мануфактуры;
- Электросталь — Вознесенская аллея с храмом Вознесения Господня.

## Финальные файлы и параметры интеграции

| Финальный файл                                     | Где используется             | Размер / aspect ratio |       Вес | Crop / object-position | Mobile crop                               |
| -------------------------------------------------- | ---------------------------- | --------------------- | --------: | ---------------------- | ----------------------------------------- |
| `generated/hero/hero-main.webp`                    | Главная, hero                | 1800×1200 / 3:2       | 176,5 KiB | `cover`, 52% 50%       | `cover`, 52% 50%; на 768–1023 px — center |
| `generated/ages/age-4-6.webp`                      | Главная, карточка 4–6 лет    | 900×675 / 4:3         |  40,9 KiB | `cover`, center        | `cover`, center                           |
| `generated/ages/age-7-12.webp`                     | Главная, карточка 7–12 лет   | 900×675 / 4:3         |  38,9 KiB | `cover`, center        | `cover`, center                           |
| `generated/ages/age-13-17.webp`                    | Главная, карточка 13–17 лет  | 900×675 / 4:3         |  36,0 KiB | `cover`, center        | `cover`, center                           |
| `generated/ages/age-adults.webp`                   | Главная, карточка «Взрослые» | 900×675 / 4:3         |  35,2 KiB | `cover`, center        | `cover`, center                           |
| `generated/programs/program-exams.webp`            | `/exams`                     | 1600×1000 / 8:5       | 100,0 KiB | `cover`, center        | `cover`, center                           |
| `generated/programs/program-tutoring.webp`         | `/tutoring`                  | 1600×1000 / 8:5       | 117,2 KiB | `cover`, center        | `cover`, center                           |
| `generated/programs/program-preschool.webp`        | `/preschool`                 | 1600×1000 / 8:5       |  76,5 KiB | `cover`, center        | `cover`, center                           |
| `generated/programs/program-development.webp`      | `/development`               | 1600×1000 / 8:5       | 108,2 KiB | `cover`, center        | `cover`, center                           |
| `generated/programs/program-corporate.webp`        | `/corporate`                 | 1586×992 / ≈8:5       |  69,4 KiB | `cover`, center        | `cover`, center                           |
| `generated/programs/program-speech-therapist.webp` | `/speech-therapist`          | 1600×1000 / 8:5       |  94,3 KiB | `cover`, center        | `cover`, center                           |
| `generated/programs/program-psychologist.webp`     | `/psychologist`              | 1586×992 / ≈8:5       |  84,0 KiB | `cover`, center        | `cover`, center                           |
| `generated/languages/language-english.webp`        | `/languages/english`         | 1586×992 / ≈8:5       |  79,1 KiB | `cover`, center        | `cover`, center                           |
| `generated/languages/language-german.webp`         | `/languages/german`          | 1586×992 / ≈8:5       |  75,1 KiB | `cover`, center        | `cover`, center                           |
| `generated/languages/language-french.webp`         | `/languages/french`          | 1586×992 / ≈8:5       |  63,1 KiB | `cover`, center        | `cover`, center                           |
| `generated/languages/language-spanish.webp`        | `/languages/spanish`         | 1586×992 / ≈8:5       |  66,4 KiB | `cover`, center        | `cover`, center                           |
| `generated/languages/language-italian.webp`        | `/languages/italian`         | 1586×992 / ≈8:5       |  69,6 KiB | `cover`, center        | `cover`, center                           |
| `generated/languages/language-chinese.webp`        | `/languages/chinese`         | 1586×992 / ≈8:5       |  65,1 KiB | `cover`, center        | `cover`, center                           |
| `generated/editorial/editorial-common-room.webp`   | `/about`, editorial-врезка   | 1672×941 / ≈16:9      |  80,0 KiB | `cover`, 50% 52%       | `cover`, center                           |

### Responsive-настройки

| Серия               | `sizes`                                                    | Загрузка   |
| ------------------- | ---------------------------------------------------------- | ---------- |
| Hero                | `(max-width: 1024px) 100vw, 50vw`                          | `priority` |
| Возрастные карточки | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw` | lazy       |
| Языки               | `(max-width: 1024px) 100vw, 58vw`                          | lazy       |
| Направления         | `(max-width: 1024px) 100vw, 58vw`                          | lazy       |
| About/editorial     | `100vw`                                                    | lazy       |

## Резервные SVG

Оставлены без изменений только SVG, которые используются динамически или
нужны как fallback:

- все `public/images/offices/*.svg` — реальные фасады не выдумываются;
- SVG пяти скрытых языков: `japanese`, `arabic`, `turkish`, `norwegian`,
  `russian-as-foreign`;

## Visual QA

Проверены viewport: 1440, 1280, 1024, 768, 430, 390 и 360 px. Проверены hero,
все четыре возрастные карточки, шесть языковых страниц, семь страниц
направлений и editorial-врезка `/about`.

- горизонтального overflow нет;
- на mobile ключевые лица и действия остаются в кадре;
- нижняя навигация не перекрывает фотографии;
- единый цвет, контраст и степень постановочности сохраняются между сериями;
- специальный mobile-кроп потребовался только как responsive object-position:
  hero 52% 50%, about — center; остальные изображения остаются center;
- ручной пиксельный crop/inset не применялся.

## Ограничения использования

Сгенерированные люди не являются сотрудниками, преподавателями или учениками
RandK. Фотографии не следует использовать как документальное подтверждение
реальных помещений или состава команды. Карточки центров на `/centers/`
используют перечисленные выше предоставленные городские фотографии. Hero
отдельных страниц центров продолжает использовать существующие офисные
фотографии без изменений.
