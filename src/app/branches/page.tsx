import { PageHero } from '@/components/layout/PageHero';
import { BranchesGrid } from '@/components/sections/BranchesGrid';
import { FaqSection } from '@/components/sections/FaqSection';
import { FinalCta } from '@/components/sections/FinalCta';
import { branchFaq } from '@/content/faq';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Центры сети — Орехово-Зуево, Павловский Посад, Электросталь',
  description:
    'Образовательные и языковые центры RandK в Орехово-Зуеве, Павловском Посаде и Электростали: направления, запись на пробное занятие и контакты филиалов.',
  path: '/branches',
});

export default function BranchesPage() {
  return (
    <>
      <PageHero
        eyebrow="География сети"
        title="Центры RandK"
        lead="Три очных центра в Подмосковье. Программы общие для сети, но состав групп и расписание в каждом городе свои."
        breadcrumbs={[{ name: 'Центры', path: '/branches' }]}
      />

      <BranchesGrid withHeading={false} />

      <FaqSection items={branchFaq} title="Вопросы о центрах" />
      <FinalCta />
    </>
  );
}
