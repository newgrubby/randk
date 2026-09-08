import Image from 'next/image';
import { cities, offices } from '@/content/centers';
import { activeLanguages } from '@/content/languages';
import { buildMetadata } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Advantages } from '@/components/sections/Advantages';
import { FinalCta } from '@/components/sections/FinalCta';
import { Results } from '@/components/sections/Results';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata = buildMetadata({
  title: 'О центре',
  description:
    'RandK Center — сеть языковых и образовательных центров для детей, подростков и взрослых. Три офиса в Орехово-Зуеве, Павловском Посаде и Электростали.',
  path: '/about',
});

/** Принципы работы. Формулировки смысловые — без неподтверждённых фактов. */
const principles = [
  {
    title: 'Сначала задача, потом программа',
    text: 'Мы не продаём «курс вообще». Разговор начинается с того, зачем ученику занятия: экзамен, школьная программа, разговорная речь или подготовка к первому классу. Программа собирается уже под этот ответ.',
  },
  {
    title: 'Языковой центр, а не курсы английского',
    text: 'Английский — самое востребованное направление, но не единственное. В каталоге шесть языков, и у каждого своя логика: то, что работает в испанском, не переносится на китайский напрямую.',
  },
  {
    title: 'Возраст определяет подход',
    text: 'Дошкольник, подросток и взрослый учатся по-разному — по темпу, мотивации и формату обратной связи. Поэтому направления разведены по возрастным ступеням, а не сведены к одному «универсальному» уроку.',
  },
  {
    title: 'Очный формат как основа',
    text: 'Занятия идут вживую в трёх офисах. Присутствие в классе даёт то, что сложно воспроизвести онлайн: живую речь, внимание преподавателя к деталям и привычку к учебной среде.',
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
        title="Сеть языковых и образовательных центров RandK"
        lead={`Работаем с детьми, подростками и взрослыми. ${offices.length} офиса в ${cities.length} городах Подмосковья, ${activeLanguages.length} языков и образовательные направления от подготовки к школе до экзаменов.`}
        breadcrumbs={[{ name: 'О центре', path: '/about' }]}
      />

      <div className="container-page">
        <Reveal>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] md:aspect-[21/9]">
            <Image
              src="/images/generated/editorial/editorial-common-room.webp"
              alt="Светлая общая учебная зона с учениками за столами"
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover object-center md:object-[50%_52%]"
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
        здесь — на главной от них остались короткие тезисы. Сетка офисов тоже
        не дублируется: она есть на главной и на /centers.

        Раздела о преподавателях здесь нет: информация о них на сайте
        не публикуется по решению клиента.
      */}
      <Advantages />
      <Results />
      <FinalCta />
    </>
  );
}
