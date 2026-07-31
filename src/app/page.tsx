import { AdvantageTheses } from '@/components/sections/AdvantageTheses';
import { AgeGroups } from '@/components/sections/AgeGroups';
import { BranchesGrid } from '@/components/sections/BranchesGrid';
import { Directions } from '@/components/sections/Directions';
import { FaqSection } from '@/components/sections/FaqSection';
import { FinalCta } from '@/components/sections/FinalCta';
import { Hero } from '@/components/sections/Hero';
import { QuizSection } from '@/components/sections/QuizSection';
import { Reviews } from '@/components/sections/Reviews';
import { generalFaq } from '@/content/faq';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'RandK Center — языковые и образовательные центры в Подмосковье',
  ogTitle: 'RandK Center — языки, экзамены и развитие',
  description:
    'Иностранные языки, подготовка к ОГЭ и ЕГЭ, школьные предметы и развивающие занятия для детей и взрослых. Очные центры в Орехово-Зуеве, Павловском Посаде и Электростали.',
  path: '/',
});

/**
 * Главная страница.
 *
 * Задача главной — быстро довести до выбора программы или центра, а не
 * пересказать весь сайт. Поэтому здесь короткие тезисы вместо развёрнутых
 * преимуществ, а блоки «как мы следим за результатом» и «преподаватели»
 * раскрываются на /about и /teachers — раньше они дословно дублировались.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <AgeGroups />
      <Directions />
      <QuizSection />
      <AdvantageTheses />
      <Reviews />
      <BranchesGrid />
      <FaqSection items={generalFaq} />
      <FinalCta />
    </>
  );
}
