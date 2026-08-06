import Link from 'next/link';
import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { cities } from '@/content/centers';
import { activeLanguages } from '@/content/languages';
import { navigationPrograms } from '@/content/programs';

export const metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col justify-center py-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-accent font-serif text-[6rem] leading-none md:text-[9rem]">404</p>
          <h1 className="text-h2 mt-6 font-serif">Такой страницы нет</h1>
          <p className="text-lead text-muted mt-5 max-w-lg">
            Возможно, адрес изменился при обновлении сайта. Ниже — основные разделы, а если нужного
            не нашлось, позвоните в ближайший офис.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg">
              На главную
            </ButtonLink>
            <ButtonLink href="/contacts" variant="secondary" size="lg">
              Контакты офисов
              <ArrowRight />
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="text-eyebrow text-muted font-medium uppercase">Языки</p>
              <ul className="border-border mt-5 flex flex-col border-t">
                {activeLanguages.map((language) => (
                  <li key={language.slug} className="border-border border-b">
                    <Link
                      href={`/languages/${language.slug}`}
                      className="group hover:text-accent flex items-center justify-between gap-4 py-3 text-sm transition-colors"
                    >
                      {language.shortTitle}
                      <ArrowRight />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-eyebrow text-muted font-medium uppercase">Направления</p>
              <ul className="border-border mt-5 flex flex-col border-t">
                {navigationPrograms.map((program) => (
                  <li key={program.slug} className="border-border border-b">
                    <Link
                      href={program.href}
                      className="group hover:text-accent flex items-center justify-between gap-4 py-3 text-sm transition-colors"
                    >
                      {program.shortTitle}
                      <ArrowRight />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="text-eyebrow text-muted mt-8 font-medium uppercase">Центры</p>
              <ul className="border-border mt-5 flex flex-col border-t">
                {cities.map((city) => (
                  <li key={city.slug} className="border-border border-b">
                    <Link
                      href={`/centers/${city.slug}`}
                      className="group hover:text-accent flex items-center justify-between gap-4 py-3 text-sm transition-colors"
                    >
                      {city.name}
                      <ArrowRight />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
