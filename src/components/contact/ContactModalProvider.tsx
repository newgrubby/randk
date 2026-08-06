'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ContactPanel } from './ContactPanel';

type OpenOptions = {
  title?: string;
  description?: string;
  /** Открыть сразу на конкретном офисе (страница города, карточка офиса). */
  officeId?: string;
};

type ContactModalContextValue = {
  open: (options?: OpenOptions) => void;
  close: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function useContactModal(): ContactModalContextValue {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error('useContactModal должен использоваться внутри <ContactModalProvider>');
  }
  return context;
}

const defaults = {
  title: 'Связаться с центром',
  description:
    'Выберите удобный офис — позвоните напрямую или напишите в сообщество. Администратор подскажет расписание и подберёт программу.',
};

/**
 * Единое контактное окно вместо форм заявок.
 *
 * Клиенту неудобно обрабатывать заявки через собственную систему сайта,
 * поэтому сайт не собирает и не хранит персональные данные вовсе.
 * Все призывы к действию ведут сюда: выбор офиса → звонок, копирование
 * номера, сообщество или маршрут.
 */
export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<{
    title: string;
    description: string;
    officeId?: string;
  }>(defaults);

  const open = useCallback((options?: OpenOptions) => {
    setState({
      title: options?.title ?? defaults.title,
      description: options?.description ?? defaults.description,
      ...(options?.officeId ? { officeId: options.officeId } : {}),
    });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <Modal open={isOpen} onClose={close} title={state.title} description={state.description}>
        <ContactPanel initialOfficeId={state.officeId} />
      </Modal>
    </ContactModalContext.Provider>
  );
}
