import { PageHero } from '@/components/layout/PageHero';
import { FinalCta } from '@/components/sections/FinalCta';
import { ProgramsCatalog } from '@/components/sections/ProgramsCatalog';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Программы и направления обучения',
  description:
    'Все направления RandK Center: иностранные языки, подготовка к ОГЭ и ЕГЭ, школьные предметы, подготовка к школе, развивающие и индивидуальные занятия.',
  path: '/programs',
});

/**
 * Каталог направлений.
 *
 * `searchParams` читается на сервере и передаётся в каталог пропом — так
 * ссылка вида /programs?age=teens отрабатывает ещё до гидратации, а карточки
 * попадают в исходный HTML. Раньше начальный фильтр брался из
 * `useSearchParams()` внутри клиентского компонента, из-за чего Next
 * пропускал пререндер и отдавал заглушку вместо каталога.
 *
 * Цена решения — страница рендерится по запросу, а не статически.
 * Для одной страницы это допустимо: робот без параметров всё равно
 * получает полный список направлений в HTML.
 */
export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const { age } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Каталог"
        title="Направления обучения"
        lead="Выберите возраст, тип занятий или центр — покажем подходящие программы. Направления можно совмещать между собой."
        breadcrumbs={[{ name: 'Программы', path: '/programs' }]}
      />

      <div className="container-page pb-20 md:pb-28">
        <ProgramsCatalog initialAge={age ?? 'all'} />
      </div>

      <FinalCta />
    </>
  );
}
