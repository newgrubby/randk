import Link from 'next/link';
import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { branches } from '@/content/branches';
import { programs } from '@/content/programs';

export const metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col justify-center py-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <p className="text-accent font-serif text-[6rem] leading-none md:text-[9rem]">404</p>
          <h1 className="text-h2 mt-6 font-serif">Такой страницы нет</h1>
          <p className="text-lead text-muted mt-5 max-w-lg">
            Возможно, адрес изменился при обновлении сайта. Ниже — основные разделы, а если нужного
            не нашлось, оставьте заявку: подскажем и подберём программу.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg">
              На главную
            </ButtonLink>
            <ButtonLink href="/contacts" variant="secondary" size="lg">
              Связаться с нами
              <ArrowRight />
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-8">
          <p className="text-eyebrow text-muted font-medium uppercase">Направления</p>
          <ul className="border-border mt-5 flex flex-col border-t">
            {programs.slice(0, 5).map((program) => (
              <li key={program.slug} className="border-border border-b">
                <Link
                  href={`/programs/${program.slug}`}
                  className="group hover:text-accent flex items-center justify-between gap-4 py-3.5 transition-colors"
                >
                  {program.title}
                  <ArrowRight />
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-eyebrow text-muted mt-10 font-medium uppercase">Центры</p>
          <ul className="border-border mt-5 flex flex-col border-t">
            {branches.map((branch) => (
              <li key={branch.slug} className="border-border border-b">
                <Link
                  href={`/branches/${branch.slug}`}
                  className="group hover:text-accent flex items-center justify-between gap-4 py-3.5 transition-colors"
                >
                  {branch.city}
                  <ArrowRight />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
