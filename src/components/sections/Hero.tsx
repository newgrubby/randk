'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { hero } from '@/content/home';
import { ArrowRight } from '@/components/ui/Button';

/**
 * Первый экран.
 *
 * Композиция асимметричная: текстовый блок занимает левые 7 колонок,
 * изображение уходит в правый край с выносом за контейнер — это даёт
 * ощущение разворота журнала, а не типовой секции лендинга.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease: [0.25, 1, 0.5, 1] as const },
        };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20">
      {/* Мягкое тёплое пятно за изображением */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-[38rem] w-[46rem] translate-x-1/4 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(173,31,43,0.07),transparent_65%)]"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 xl:col-span-6">
            <motion.p
              {...rise(0.05)}
              className="text-eyebrow text-muted font-medium tracking-[0.16em] uppercase"
            >
              {hero.eyebrow}
            </motion.p>

            {/*
              Между строками заголовка стоит пробел: строки — блочные,
              поэтому визуально он не виден, но без него текстовая версия
              страницы (скринридер, поисковый робот, режим чтения)
              склеивает слова: «языки,экзамены и развитие».
            */}
            <motion.h1 {...rise(0.14)} className="text-display mt-6 font-serif">
              {hero.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}{' '}
                </span>
              ))}
              <span className="text-accent block italic">{hero.titleAccent}</span>
            </motion.h1>

            <motion.p {...rise(0.26)} className="text-lead text-muted mt-7 max-w-xl">
              {hero.lead}
            </motion.p>

            {/*
              Обе кнопки — обычные ссылки на разделы каталога, а не открытие
              формы: сайт больше не собирает заявки, а первый шаг посетителя —
              выбрать направление или ближайший офис.
            */}
            <motion.div {...rise(0.36)} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href={hero.primaryCta.href}
                className="group bg-accent rounded-pill shadow-soft hover:bg-accent-dark hover:shadow-lift inline-flex min-h-11 items-center justify-center gap-2.5 px-8 py-4 text-[0.9375rem] font-medium text-white transition-all duration-300"
              >
                {hero.primaryCta.label}
                <ArrowRight />
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="group rounded-pill border-border-strong text-text hover:border-accent hover:text-accent inline-flex min-h-11 items-center justify-center gap-2.5 border px-8 py-4 text-[0.9375rem] font-medium transition-colors duration-300"
              >
                {hero.secondaryCta.label}
                <ArrowRight />
              </Link>
            </motion.div>
          </div>

          <motion.div
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, scale: 1.04 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 1.1, delay: 0.1, ease: [0.25, 1, 0.5, 1] as const },
                })}
            className="lg:col-span-6 xl:col-span-6"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] md:aspect-[3/2] lg:-mr-[max(0px,calc((100vw-90rem)/2))] lg:aspect-[4/3]">
              <Image
                src="/images/generated/hero.svg"
                alt="Образовательная среда RandK Center"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Преимущества первого экрана */}
        <motion.ul
          {...rise(0.5)}
          className="border-border mt-14 grid gap-8 border-t pt-10 sm:grid-cols-3 md:mt-20"
        >
          {hero.highlights.map((item) => (
            <li key={item.title} className="flex items-start gap-4">
              <span
                aria-hidden
                className="border-accent/35 text-accent mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border"
              >
                <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                  <path
                    d="m3 8.5 3.5 3.5L13 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block text-[0.9375rem] font-medium">{item.title}</span>
                <span className="text-muted mt-1 block text-sm">{item.caption}</span>
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
