import { Advantages } from '@/components/sections/Advantages';
import { AgeGroups } from '@/components/sections/AgeGroups';
import { BranchesGrid } from '@/components/sections/BranchesGrid';
import { Directions } from '@/components/sections/Directions';
import { FaqSection } from '@/components/sections/FaqSection';
import { FinalCta } from '@/components/sections/FinalCta';
import { Hero } from '@/components/sections/Hero';
import { QuizSection } from '@/components/sections/QuizSection';
import { Results } from '@/components/sections/Results';
import { Reviews } from '@/components/sections/Reviews';
import { Teachers } from '@/components/sections/Teachers';
import { generalFaq } from '@/content/faq';
import { teachers } from '@/content/teachers';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'RandK Center — языковые и образовательные центры в Подмосковье',
  ogTitle: 'RandK Center — языки, экзамены и развитие',
  description:
    'Иностранные языки, подготовка к ОГЭ и ЕГЭ, школьные предметы и развивающие занятия для детей и взрослых. Очные центры в Орехово-Зуеве, Павловском Посаде и Электростали.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <AgeGroups />
      <Directions />
      <QuizSection />
      <Advantages />
      <Teachers items={teachers} />
      <Results />
      <Reviews />
      <BranchesGrid />
      <FaqSection items={generalFaq} />
      <FinalCta />
    </>
  );
}
