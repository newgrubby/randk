import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { site } from '@/content/site';

/**
 * Обёртка юридических страниц.
 *
 * Документы — рабочие черновики. Пока клиент не передал реквизиты и не
 * согласовал текст с юристом, страница честно об этом сообщает, а блок
 * реквизитов не выводится (вместо выдуманных ИНН/ОГРН).
 */
export function LegalPage({
  title,
  updatedLabel,
  breadcrumbs,
  children,
}: {
  title: string;
  updatedLabel?: string;
  breadcrumbs: Crumb[];
  children: ReactNode;
}) {
  const { legal } = site;

  return (
    <div className="pt-10 pb-24 md:pt-14">
      <div className="container-page">
        <Breadcrumbs items={breadcrumbs} />

        <div className="container-prose mt-10">
          <h1 className="text-h1 font-serif">{title}</h1>

          {legal.documentsUpdatedAt || updatedLabel ? (
            <p className="text-muted mt-4 text-sm">
              Редакция от {legal.documentsUpdatedAt ?? updatedLabel}
            </p>
          ) : null}

          {!legal.isConfirmed ? (
            <p className="bg-surface-muted text-muted mt-8 rounded-xl px-5 py-4 text-sm leading-relaxed">
              Документ подготовлен как рабочий черновик и требует согласования с юристом
              организации. Реквизиты оператора персональных данных будут добавлены после их передачи
              центром.
            </p>
          ) : null}

          <div className="legal-prose mt-10">{children}</div>

          {legal.isConfirmed ? (
            <div className="border-border mt-14 border-t pt-8">
              <h2 className="font-serif text-xl">Реквизиты оператора</h2>
              <dl className="text-muted mt-4 flex flex-col gap-2 text-sm">
                {legal.entityName ? (
                  <div>
                    <dt className="inline">Наименование: </dt>
                    <dd className="inline">{legal.entityName}</dd>
                  </div>
                ) : null}
                {legal.inn ? (
                  <div>
                    <dt className="inline">ИНН: </dt>
                    <dd className="inline">{legal.inn}</dd>
                  </div>
                ) : null}
                {legal.ogrn ? (
                  <div>
                    <dt className="inline">ОГРН: </dt>
                    <dd className="inline">{legal.ogrn}</dd>
                  </div>
                ) : null}
                {legal.legalAddress ? (
                  <div>
                    <dt className="inline">Адрес: </dt>
                    <dd className="inline">{legal.legalAddress}</dd>
                  </div>
                ) : null}
                {legal.privacyEmail ? (
                  <div>
                    <dt className="inline">Адрес для обращений: </dt>
                    <dd className="inline">{legal.privacyEmail}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
