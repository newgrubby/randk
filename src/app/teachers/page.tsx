import { PageHero } from '@/components/layout/PageHero';
import { FinalCta } from '@/components/sections/FinalCta';
import { Teachers } from '@/components/sections/Teachers';
import { teachers } from '@/content/teachers';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Преподаватели',
  description:
    'Преподаватели образовательных центров RandK: языковые направления, подготовка к ОГЭ и ЕГЭ, школьные предметы и дошкольные программы.',
  path: '/teachers',
});

export default function TeachersPage() {
  return (
    <>
      <PageHero
        eyebrow="Команда"
        title="Преподаватели RandK Center"
        lead="Педагога подбираем под возраст и задачу ученика. Ниже — специализации, по которым работают преподаватели сети."
        breadcrumbs={[{ name: 'Преподаватели', path: '/teachers' }]}
      />

      <Teachers
        items={teachers}
        eyebrow="Специализации"
        title="Направления работы преподавателей"
        lead="Один ученик может заниматься с несколькими педагогами — например, язык в группе и школьный предмет индивидуально."
      />

      <FinalCta />
    </>
  );
}
