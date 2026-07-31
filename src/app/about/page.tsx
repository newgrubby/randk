import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Advantages } from '@/components/sections/Advantages';
import { FinalCta } from '@/components/sections/FinalCta';
import { Results } from '@/components/sections/Results';
import { Teachers } from '@/components/sections/Teachers';
import { ArrowRight } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { teachers } from '@/content/teachers';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'О центре',
  description:
    'RandK Center — сеть образовательных и языковых центров для детей, подростков и взрослых в Орехово-Зуеве, Павловском Посаде и Электростали.',
  path: '/about',
});

/** Принципы работы. Формулировки смысловые — без неподтверждённых фактов. */
const principles = [
  {
    title: 'Сначала задача, потом программа',
    text: 'Мы не продаём «курс вообще». Разговор начинается с того, зачем ученику занятия: экзамен, школьная программа, разговорная речь или подготовка к первому классу. Программа собирается уже под этот ответ.',
  },
  {
    title: 'Возраст определяет подход',
    text: 'Дошкольник, подросток и взрослый учатся по-разному — по темпу, мотивации и формату обратной связи. Поэтому направления разведены по возрастным ступеням, а не сведены к одному «универсальному» уроку.',
  },
  {
    title: 'Очный формат как основа',
    text: 'Центры работают вживую. Присутствие в классе даёт то, что сложно воспроизвести онлайн: живую речь, внимание преподавателя к деталям и привычку к учебной среде.',
  },
  {
    title: 'Прозрачность для семьи',
    text: 'Родитель должен понимать, что происходит на занятиях. Мы держим регулярную обратную связь и говорим не только об успехах, но и о том, что даётся тяжело.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О центре"
        title="Сеть образовательных и языковых центров RandK"
        lead="Работаем с детьми, подростками и взрослыми в трёх городах Подмосковья. Помогаем получать знания и увереннее чувствовать себя в учёбе."
        breadcrumbs={[{ name: 'О центре', path: '/about' }]}
      />

      <div className="container-page">
        <Reveal>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] md:aspect-[21/9]">
            <Image
              src="/images/about.svg"
              alt="Образовательная среда центров RandK"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      <Section spacing="tight">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Подход" title="Принципы, на которых держится работа" />
          </div>

          <ul className="lg:col-span-7">
            {principles.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 0.07}>
                <div className="border-border border-b py-8 first:pt-0">
                  <h2 className="text-h3 font-serif">{item.title}</h2>
                  <p className="text-muted mt-3 leading-relaxed">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/*
        Развёрнутые преимущества и процесс контроля результата живут только
        здесь: на главной от них остались короткие тезисы. Сетка филиалов
        тоже убрана — она есть на главной и на /branches, третья копия
        удлиняла страницу, ничего не добавляя.
      */}
      <Advantages />
      <Results />
      <Teachers
        items={teachers}
        eyebrow="Команда"
        title="Кто ведёт занятия"
        lead="Педагога подбираем под возраст и задачу ученика."
        aside={
          <Link
            href="/teachers"
            className="group text-accent inline-flex items-center gap-2 text-sm font-medium"
          >
            Все преподаватели
            <ArrowRight />
          </Link>
        }
      />
      <FinalCta />
    </>
  );
}
