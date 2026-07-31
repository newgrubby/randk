import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { JsonLd } from './JsonLd';

export type Crumb = { name: string; path: string };

/** Хлебные крошки + BreadcrumbList одним компонентом — рассинхрон невозможен. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: 'Главная', path: '/' }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(full)} />
      <nav aria-label="Хлебные крошки" className="text-muted text-sm">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {full.map((crumb, index) => {
            const isLast = index === full.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-text">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className="link-underline hover:text-accent">
                      {crumb.name}
                    </Link>
                    <span aria-hidden className="text-border-strong">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
