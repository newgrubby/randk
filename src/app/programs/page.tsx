import { PageHero } from '@/components/layout/PageHero';
import { FinalCta } from '@/components/sections/FinalCta';
import { ProgramsCatalog } from '@/components/sections/ProgramsCatalog';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Программы и направления обучения',
  description:
    'Все направления RandK Center: иностранные языки, подготовка к ОГЭ и ЕГЭ, репетиторство, подготовка к школе, развивающие занятия и корпоративное обучение.',
  path: '/programs',
});

/**
 * Общий каталог: языки и образовательные направления в одном списке.
 *
 * Карточки рендерятся в исходный HTML (важно для поиска и доступности),
 * фильтры работают на клиенте без перезагрузки. Начальный фильтр по
 * возрасту читается из `?age=` после гидратации — сайт собирается
 * статически, и серверных query-параметров у него нет.
 */
export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Каталог"
        title="Направления обучения"
        lead="Выберите раздел, возраст или город — покажем подходящие программы. Направления можно совмещать между собой."
        breadcrumbs={[{ name: 'Направления', path: '/programs' }]}
      />

      <div className="container-page pb-20 md:pb-28">
        <ProgramsCatalog />
      </div>

      <FinalCta />
    </>
  );
}
