import { AdvantageTheses } from '@/components/sections/AdvantageTheses';
import { AgeGroups } from '@/components/sections/AgeGroups';
import { Directions } from '@/components/sections/Directions';
import { FaqSection } from '@/components/sections/FaqSection';
import { FinalCta } from '@/components/sections/FinalCta';
import { Hero } from '@/components/sections/Hero';
import { LanguagesSection } from '@/components/sections/LanguagesSection';
import { Methodology } from '@/components/sections/Methodology';
import { OfficesGrid } from '@/components/sections/OfficesGrid';
import { Reviews } from '@/components/sections/Reviews';
import { generalFaq } from '@/content/faq';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'RandK Center — языковые и образовательные центры в Подмосковье',
  ogTitle: 'RandK Center — языки, экзамены и развитие',
  description:
    'Иностранные языки, подготовка к ОГЭ и ЕГЭ, репетиторство и развивающие программы для детей и взрослых. Три офиса в Орехово-Зуеве, Павловском Посаде и Электростали.',
  path: '/',
});

/**
 * Главная страница.
 *
 * Композиция и порядок секций сохранены из утверждённого макета.
 * Добавлены два смысловых блока: каталог языков (раньше сайт читался как
 * школа одного английского) и методика. Сетка офисов показывает три карточки.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Directions />
      <LanguagesSection />
      <AgeGroups />
      <Methodology />
      <AdvantageTheses />
      <OfficesGrid />
      <Reviews />
      <FaqSection items={generalFaq} />
      <FinalCta />
    </>
  );
}
