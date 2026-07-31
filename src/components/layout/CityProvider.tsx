'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { branches } from '@/content/branches';
import type { Branch } from '@/content/types';

const STORAGE_KEY = 'randk:city';

type CityContextValue = {
  /** Выбранный филиал или null, если пользователь ещё не выбирал. */
  branch: Branch | null;
  select: (slug: string) => void;
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
 * Хранится в localStorage и переживает переходы по сайту. Сейчас выбор
 * подставляется в формы заявок и в мобильную панель — администратор сразу
 * видит, о каком центре речь.
 *
 * Чего провайдер намеренно НЕ делает: не подменяет контент страницы.
 * У каждого города свой постоянный URL с собственным title и текстом —
 * это нужно для локального SEO, а подмена контента на одном адресе
 * сделала бы три города неразличимыми для поиска.
 *
 * Значение читается в useEffect, а не при инициализации состояния:
 * localStorage недоступен на сервере, и чтение при первом рендере
 * рассинхронизировало бы разметку сервера и клиента (ошибка гидратации).
 */
export function CityProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && branches.some((item) => item.slug === stored)) setSlug(stored);
    } catch {
      // Приватный режим браузера — просто не запоминаем выбор.
    }
  }, []);

  const select = useCallback((next: string) => {
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
      branch: branches.find((item) => item.slug === slug) ?? null,
      select,
      clear,
    }),
    [slug, select, clear],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}
