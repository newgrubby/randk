'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Modal } from '@/components/ui/Modal';
import type { LeadFormValues, LeadSource } from '@/lib/lead-schema';
import { LeadForm } from './LeadForm';

type OpenOptions = {
  source?: LeadSource;
  title?: string;
  description?: string;
  defaults?: Partial<LeadFormValues>;
};

type LeadModalContextValue = {
  open: (options?: OpenOptions) => void;
  close: () => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

/** Хук для открытия модального окна записи из любой точки интерфейса. */
export function useLeadModal(): LeadModalContextValue {
  const context = useContext(LeadModalContext);
  if (!context) {
    throw new Error('useLeadModal должен использоваться внутри <LeadModalProvider>');
  }
  return context;
}

const defaultState: Required<Omit<OpenOptions, 'defaults'>> & {
  defaults: Partial<LeadFormValues>;
} = {
  source: 'trial',
  title: 'Записаться на пробное занятие',
  description:
    'Оставьте контакты — администратор свяжется с вами, подберёт подходящую группу и удобное время.',
  defaults: {},
};

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(defaultState);

  const open = useCallback((options?: OpenOptions) => {
    setState({
      source: options?.source ?? defaultState.source,
      title: options?.title ?? defaultState.title,
      description: options?.description ?? defaultState.description,
      defaults: options?.defaults ?? {},
    });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <Modal open={isOpen} onClose={close} title={state.title} description={state.description}>
        <LeadForm
          key={`${state.source}-${JSON.stringify(state.defaults)}`}
          source={state.source}
          defaults={state.defaults}
          compact
          showMessage
        />
      </Modal>
    </LeadModalContext.Provider>
  );
}
