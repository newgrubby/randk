'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { cities, getCity } from '@/content/centers';
import type { City, CitySlug } from '@/content/types';

const STORAGE_KEY = 'randk:city';

type CityContextValue = {
  citySlug: CitySlug | null;
  city: City | null;
  setCitySlug: (slug: CitySlug) => void;
  clear: () => void;
};

const CityContext = createContext<CityContextValue | null>(null);

export function useCity(): CityContextValue {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity должен использоваться внутри <CityProvider>');
  return context;
}

/**
 * Выбранный город.
 *
 * Хранится в localStorage и переживает переходы. Используется контактным
 * окном и мобильной панелью, чтобы посетитель сразу видел телефон своего
 * города, а не выбирал его заново на каждой странице.
 *
 * Провайдер намеренно НЕ подменяет контент страницы: у каждого города свой
 * постоянный URL с собственным title и текстом — это нужно для локального
 * SEO, а подмена контента на одном адресе сделала бы города неразличимыми
 * для поиска.
 *
 * Значение читается в useEffect, а не при инициализации состояния:
 * localStorage недоступен на сервере, и чтение при первом рендере
 * рассинхронизировало бы разметку сервера и клиента.
 */
export function CityProvider({ children }: { children: ReactNode }) {
  const [citySlug, setSlug] = useState<CitySlug | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && cities.some((city) => city.slug === stored)) {
        setSlug(stored as CitySlug);
      }
    } catch {
      // Приватный режим — просто не запоминаем выбор.
    }
  }, []);

  const setCitySlug = useCallback((next: CitySlug) => {
    setSlug(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // игнорируем
    }
  }, []);

  const clear = useCallback(() => {
    setSlug(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // игнорируем
    }
  }, []);

  const value = useMemo<CityContextValue>(
    () => ({
      citySlug,
      city: citySlug ? (getCity(citySlug) ?? null) : null,
      setCitySlug,
      clear,
    }),
    [citySlug, setCitySlug, clear],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}
