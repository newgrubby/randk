'use client';

import { useEffect, useMemo, useState } from 'react';
import { cities, fullAddress, getOfficesByCity, offices } from '@/content/centers';
import { site } from '@/content/site';
import { track } from '@/lib/analytics';
import { buildYandexRouteUrl, cn, displayPhone } from '@/lib/utils';
import { useCity } from '@/components/layout/CityProvider';

/**
 * Содержимое контактного окна: выбор города → выбор офиса → действия.
 *
 * Все действия — обычные ссылки (`tel:`, VK, Яндекс Карты), поэтому
 * они работают и без JavaScript, если пользователь дошёл до них
 * на странице офиса. JavaScript нужен только для переключения между
 * офисами и копирования номера.
 */
export function ContactPanel({ initialOfficeId }: { initialOfficeId?: string }) {
  const { citySlug, setCitySlug } = useCity();

  const initialOffice = initialOfficeId
    ? offices.find((office) => office.id === initialOfficeId)
    : undefined;

  const [activeCity, setActiveCity] = useState(
    initialOffice?.citySlug ?? citySlug ?? cities[0]!.slug,
  );
  /*
   * useMemo обязателен: getOfficesByCity возвращает новый массив на каждый
   * рендер, и без мемоизации эффект ниже перезапускался бы бесконечно —
   * ссылка в зависимостях менялась бы всегда.
   */
  const cityOffices = useMemo(() => getOfficesByCity(activeCity), [activeCity]);

  const [activeOfficeId, setActiveOfficeId] = useState(
    initialOffice?.id ?? cityOffices[0]?.id ?? offices[0]!.id,
  );

  // При смене города переключаемся на первый офис этого города
  useEffect(() => {
    if (!cityOffices.some((office) => office.id === activeOfficeId)) {
      setActiveOfficeId(cityOffices[0]?.id ?? offices[0]!.id);
    }
  }, [cityOffices, activeOfficeId]);

  const office = offices.find((item) => item.id === activeOfficeId) ?? offices[0]!;
  const [isCopied, setIsCopied] = useState(false);

  async function copyPhone() {
    if (!office.phone) return;
    try {
      await navigator.clipboard.writeText(displayPhone(office.phone));
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Буфер обмена недоступен — номер всё равно виден и кликабелен.
    }
  }

  const routeUrl =
    office.yandexMapUrl ?? (office.coordinates ? buildYandexRouteUrl(office.coordinates) : null);

  return (
    <div className="flex flex-col gap-6">
      {/* Город */}
      <fieldset>
        <legend className="text-eyebrow text-muted mb-3 font-medium uppercase">Город</legend>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city.slug}
              type="button"
              aria-pressed={activeCity === city.slug}
              onClick={() => {
                setActiveCity(city.slug);
                setCitySlug(city.slug);
                track('city_select', { city: city.slug });
              }}
              className={cn(
                'rounded-pill min-h-10 border px-4 py-2 text-sm transition-colors duration-300',
                activeCity === city.slug
                  ? 'border-accent bg-accent text-white'
                  : 'border-border text-muted hover:border-accent hover:text-accent',
              )}
            >
              {city.name}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Офис — показываем выбор только там, где офисов больше одного */}
      {cityOffices.length > 1 ? (
        <fieldset>
          <legend className="text-eyebrow text-muted mb-3 font-medium uppercase">
            Офис — {cityOffices.length} в городе
          </legend>
          <div className="flex flex-col gap-2">
            {cityOffices.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={activeOfficeId === item.id}
                onClick={() => {
                  setActiveOfficeId(item.id);
                  track('office_select', { office: item.id });
                }}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors duration-300',
                  activeOfficeId === item.id
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-border hover:border-accent',
                )}
              >
                <span>
                  <span className="block font-medium">{item.address}</span>
                  {item.addressDetails ? (
                    <span className="text-muted mt-0.5 block text-xs">{item.addressDetails}</span>
                  ) : null}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'size-2 shrink-0 rounded-full',
                    activeOfficeId === item.id ? 'bg-accent' : 'bg-border-strong',
                  )}
                />
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="text-muted text-sm leading-relaxed">{fullAddress(office)}</p>
      )}

      {/* Телефон и действия */}
      <div className="border-border bg-surface-muted rounded-2xl border p-5">
        {office.phone ? (
          <>
            <p className="text-eyebrow text-muted font-medium uppercase">Телефон офиса</p>
            <a
              href={`tel:${office.phone}`}
              onClick={() => track('phone_click', { office: office.id, place: 'contact-modal' })}
              className="text-text hover:text-accent mt-2 block font-serif text-2xl transition-colors duration-300"
            >
              {displayPhone(office.phone)}
            </a>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href={`tel:${office.phone}`}
                onClick={() => track('phone_click', { office: office.id, place: 'contact-modal' })}
                className="bg-accent rounded-pill hover:bg-accent-dark inline-flex min-h-11 items-center justify-center px-6 text-sm font-medium text-white transition-colors duration-300"
              >
                Позвонить
              </a>
              <button
                type="button"
                onClick={copyPhone}
                className="rounded-pill border-border-strong text-text hover:border-accent hover:text-accent inline-flex min-h-11 items-center justify-center border px-6 text-sm font-medium transition-colors duration-300"
              >
                {isCopied ? 'Номер скопирован' : 'Скопировать номер'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-muted text-sm leading-relaxed">
            Телефон этого офиса уточняется. Напишите в сообщество — администратор ответит и
            подскажет расписание.
          </p>
        )}
      </div>

      {/* Сообщества и маршрут */}
      <div className="flex flex-wrap gap-2.5">
        <a
          href={site.social.vkPrimary}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('vk_click', { place: 'contact-modal' })}
          className="rounded-pill border-border-strong text-text hover:border-accent hover:text-accent inline-flex min-h-11 items-center justify-center gap-2 border px-5 text-sm transition-colors duration-300"
        >
          Написать во ВКонтакте
        </a>

        {/* Кнопка MAX появляется автоматически, когда клиент передаст ссылку */}
        {site.social.max ? (
          <a
            href={site.social.max}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('max_click', { place: 'contact-modal' })}
            className="rounded-pill border-border-strong text-text hover:border-accent hover:text-accent inline-flex min-h-11 items-center justify-center border px-5 text-sm transition-colors duration-300"
          >
            Написать в MAX
          </a>
        ) : null}

        {routeUrl ? (
          <a
            href={routeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('map_click', { office: office.id, kind: 'route' })}
            className="rounded-pill border-border-strong text-text hover:border-accent hover:text-accent inline-flex min-h-11 items-center justify-center border px-5 text-sm transition-colors duration-300"
          >
            Построить маршрут
          </a>
        ) : null}
      </div>

      <p className="text-muted text-xs leading-relaxed">
        Сайт не собирает и не хранит персональные данные: связь идёт напрямую по телефону или через
        сообщество.
      </p>
    </div>
  );
}
