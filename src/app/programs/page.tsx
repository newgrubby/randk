import { Suspense } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { FaqSection } from '@/components/sections/FaqSection';
import { FinalCta } from '@/components/sections/FinalCta';
import { ProgramsCatalog } from '@/components/sections/ProgramsCatalog';
import { generalFaq } from '@/content/faq';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Программы и направления обучения',
  description:
    'Все направления RandK Center: иностранные языки, подготовка к ОГЭ и ЕГЭ, школьные предметы, подготовка к школе, развивающие и индивидуальные занятия.',
  path: '/programs',
});

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Каталог"
        title="Направления обучения"
        lead="Выберите возраст, тип занятий или центр — покажем подходящие программы. Направления можно совмещать между собой."
        breadcrumbs={[{ name: 'Программы', path: '/programs' }]}
      />

      <div className="container-page pb-20 md:pb-28">
        <Suspense fallback={<div className="border-border h-40 border-y" />}>
          <ProgramsCatalog />
        </Suspense>
      </div>

      <FaqSection items={generalFaq.slice(0, 4)} title="Вопросы о программах" />
      <FinalCta />
    </>
  );
}
