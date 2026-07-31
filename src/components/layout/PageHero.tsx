import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { Eyebrow } from '@/components/ui/SectionHeading';

/** Шапка внутренней страницы: крошки, H1 и лид. Единая на весь сайт. */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  aside,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumbs: Crumb[];
  aside?: ReactNode;
}) {
  return (
    <section className="pt-10 pb-14 md:pt-14 md:pb-20">
      <div className="container-page">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {eyebrow ? <Eyebrow className="text-muted">{eyebrow}</Eyebrow> : null}
            <h1 className="text-h1 mt-4 font-serif">{title}</h1>
          </div>

          {lead || aside ? (
            <div className="lg:col-span-5">
              {lead ? <p className="text-lead text-muted">{lead}</p> : null}
              {aside ? <div className="mt-6">{aside}</div> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
