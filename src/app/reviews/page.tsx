import { PageHero } from '@/components/layout/PageHero';
import { FinalCta } from '@/components/sections/FinalCta';
import { Reviews } from '@/components/sections/Reviews';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Отзывы учеников и родителей',
  description:
    'Отзывы о центрах RandK. Публикуем только подтверждённые отзывы со ссылкой на первоисточник.',
  path: '/reviews',
});

/**
 * Страница отзывов.
 *
 * Пока подтверждённых отзывов нет, страница честно об этом сообщает и
 * объясняет принцип публикации. Это осмысленная страница, а не заглушка
 * ради пункта в меню: она отвечает на вопрос «а где отзывы?» и ведёт туда,
 * где обратная связь настоящая.
 */
export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Обратная связь"
        title="Отзывы"
        lead="Мы публикуем только настоящие отзывы — с именем автора и ссылкой на первоисточник."
        breadcrumbs={[{ name: 'Отзывы', path: '/reviews' }]}
      />

      <Reviews withHeading={false} />

      <Section tone="muted" spacing="tight">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Принцип" title="Почему здесь нет «отзывов для сайта»" />
          </div>
          <div className="lg:col-span-7">
            <p className="text-lead text-muted">
              Вымышленный отзыв узнаётся мгновенно и обесценивает всё остальное на странице. Поэтому
              пока у нас нет подтверждённых материалов, мы предпочитаем пустой раздел красивому
              вымыслу.
            </p>
            <p className="text-muted mt-5 leading-relaxed">
              Каждый опубликованный отзыв будет содержать имя автора, город, программу и ссылку на
              источник — сообщество или карточку организации в картах. Так его можно проверить, а не
              просто прочитать.
            </p>
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
