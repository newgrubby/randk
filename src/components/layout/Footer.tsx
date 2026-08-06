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
    <footer className="surface-deep">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div className="max-w-sm">
            <Logo tone="dark" />
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
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="link-underline text-sm text-white/75 transition-colors duration-300 hover:text-white"
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
              <p className="mt-1 text-xs leading-relaxed text-white/45">{fullAddress(office)}</p>
              {office.phone ? (
                <a
                  href={`tel:${office.phone}`}
                  className="mt-2 inline-block text-sm text-white transition-colors duration-300 hover:text-white/70"
                >
                  {displayPhone(office.phone)}
                </a>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/12 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-col gap-2 text-xs text-white/45 sm:flex-row sm:gap-6">
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline hover:text-white/80">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 text-xs text-white/40 sm:flex-row sm:items-center sm:gap-6">
            <p>
              © {copyrightRange} {site.name}
            </p>
            <p>
              Сайт —{' '}
              <a
                href={site.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-white/60 transition-colors duration-300 hover:text-white"
              >
                {site.developer.name}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
