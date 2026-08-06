'use client';

import { site } from '@/content/site';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Кнопки сообществ.
 *
 * Ключевое правило: кнопки нет, если нет ссылки. MAX появится сам, как
 * только клиент передаст URL, и до этого момента на сайте не будет ни
 * «мёртвой» иконки, ни пустого места на её месте.
 */
export function SocialLinks({
  tone = 'light',
  className,
}: {
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const vk = site.social.vkPrimary;
  const max = site.social.max;

  if (!vk && !max) return null;

  const itemClass = cn(
    'flex size-11 items-center justify-center rounded-full border transition-all duration-300 ease-[var(--ease-out-quart)] hover:-translate-y-0.5',
    tone === 'dark'
      ? 'border-white/20 text-white/75 hover:border-white hover:text-white'
      : 'border-border-strong text-muted hover:border-accent hover:text-accent',
  );

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {vk ? (
        <a
          href={vk}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Сообщество RandK Center во ВКонтакте"
          onClick={() => track('vk_click')}
          className={itemClass}
        >
          <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M12.7 17.2c-5.3 0-8.6-3.7-8.7-9.8h2.7c.1 4.5 2.1 6.4 3.6 6.8V7.4h2.5v3.9c1.5-.2 3-1.9 3.6-3.9h2.5c-.4 2.4-2 4.1-3.2 4.8 1.2.6 3 2.1 3.7 5h-2.7c-.5-1.7-1.9-3.1-3.9-3.3v3.3z" />
          </svg>
        </a>
      ) : null}

      {max ? (
        <a
          href={max}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="RandK Center в MAX"
          onClick={() => track('max_click')}
          className={itemClass}
        >
          <span className="text-[0.6875rem] font-semibold tracking-[0.08em]">MAX</span>
        </a>
      ) : null}
    </div>
  );
}
