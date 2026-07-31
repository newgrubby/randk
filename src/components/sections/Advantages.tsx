import { advantages } from '@/content/home';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Преимущества.
 * Формулировки намеренно смысловые: пока статистика не подтверждена,
 * цифры на сайте не используются.
 */
export function Advantages() {
  return (
    <Section id="advantages">
      <SectionHeading
        eyebrow="Почему RandK"
        title="Что стоит за словом «центр»"
        lead="Не набор кружков, а выстроенная система: возрастные ступени, подбор под цель и живой контакт с семьёй."
      />

      <ul className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {advantages.map((item, index) => (
          <Reveal as="li" key={item.title} delay={(index % 3) * 0.08}>
            <span className="text-accent font-serif text-[2.5rem] leading-none">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-h3 mt-4 font-serif">{item.title}</h3>
            <p className="text-muted mt-3 leading-relaxed">{item.text}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
