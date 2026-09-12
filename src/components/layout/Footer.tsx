import Link from 'next/link';
import { fullAddress, offices } from '@/content/centers';
import { footerNavigation, legalNavigation } from '@/content/navigation';
import { site } from '@/content/site';
import { displayPhone } from '@/lib/utils';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();
  const copyrightRange =
    year > site.copyrightStartYear ? `${site.copyrightStartYear}—${year}` : `${year}`;

  return (
    <footer id="site-footer" className="surface-deep">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div className="max-w-sm">
            <Logo variant="extended" />
            <p className="mt-6 text-sm leading-relaxed text-white/60">{site.description}</p>
            <div className="mt-8">
              <SocialLinks tone="dark" />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerNavigation.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-eyebrow font-sans font-medium tracking-[0.16em] text-white/45 uppercase">
                  {column.title}
                </h2>
                <ul className="mt-3 flex flex-col gap-0.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="link-underline inline-block py-1.5 text-sm text-white/75 transition-colors duration-300 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/*
          Телефоны всех офисов в подвале: это самый частый способ связи,
          и он должен быть доступен с любой страницы без открытия окна.
          Ссылки обычные — работают без JavaScript.
        */}
        <ul className="mt-14 grid gap-6 border-t border-white/12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {offices.map((office) => (
            <li key={office.id}>
              <p className="text-sm text-white/80">{office.city}</p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-white/50">
                {fullAddress(office)}
              </p>
              {office.phone ? (
                <a
                  href={`tel:${office.phone}`}
                  className="mt-1 inline-flex min-h-11 items-center text-sm text-white transition-colors duration-300 hover:text-white/70"
                >
                  {displayPhone(office.phone)}
                </a>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-col gap-0.5 text-sm text-white/50 sm:flex-row sm:gap-6">
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-underline inline-block py-1.5 transition-colors duration-300 hover:text-white/85"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-sm text-white/50">
            © {copyrightRange} {site.name}
          </p>
        </div>
      </div>

      {/*
        Подпись разработчика — отдельной полосой, а не мелким шрифтом в углу
        копирайта: строка должна читаться, но не спорить с брендом центра.
        На мобильных снизу добавлен safe-area и запас под нижнюю навигацию.
      */}
      <div className="border-t border-white/10 bg-black/15">
        <div className="container-page flex items-center justify-center py-5 sm:py-6">
          <p className="text-[0.9375rem] text-white/55">
            Сайт разработан{' '}
            <a
              href={site.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {site.developer.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
