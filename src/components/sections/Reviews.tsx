import Image from 'next/image';
import { publishedReviews } from '@/content/reviews';
import { site } from '@/content/site';
import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Отзывы.
 * Вымышленные отзывы не создаются. Пока подтверждённых нет,
 * показываем честное сообщение и ведём в сообщество.
 */
export function Reviews() {
  return (
    <Section id="reviews">
      <SectionHeading
        eyebrow="Отзывы"
        title="Что говорят ученики и родители"
        lead={
          publishedReviews.length > 0
            ? 'Собираем обратную связь после занятий и публикуем её со ссылкой на источник.'
            : undefined
        }
      />

      {publishedReviews.length > 0 ? (
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {publishedReviews.map((review, index) => (
            <Reveal as="li" key={review.id} delay={(index % 3) * 0.08}>
              <figure className="bg-surface border-border flex h-full flex-col rounded-[1.25rem] border p-7">
                {review.rating ? (
                  <div
                    className="text-accent flex gap-1"
                    aria-label={`Оценка ${review.rating} из 5`}
                  >
                    {Array.from({ length: review.rating }).map((_, starIndex) => (
                      <span key={starIndex} aria-hidden>
                        ★
                      </span>
                    ))}
                  </div>
                ) : null}

                <blockquote className="mt-4 flex-1 leading-relaxed">{review.text}</blockquote>

                <figcaption className="border-border mt-6 flex items-center gap-3 border-t pt-5">
                  {review.photo ? (
                    <Image
                      src={review.photo.src}
                      alt={review.photo.alt}
                      width={44}
                      height={44}
                      className="size-11 rounded-full object-cover"
                    />
                  ) : null}
                  <span>
                    <span className="block text-sm font-medium">{review.authorName}</span>
                    <span className="text-muted block text-xs">
                      {[review.city, review.program].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  {review.sourceUrl ? (
                    <a
                      href={review.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-accent ml-auto text-xs"
                    >
                      Источник
                    </a>
                  ) : null}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      ) : (
        <Reveal>
          <div className="bg-surface border-border mt-12 flex flex-col items-start gap-6 rounded-[1.5rem] border p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl">
              <p className="text-h3 font-serif">
                Отзывы учеников и родителей будут добавлены после подтверждения материалов
              </p>
              <p className="text-muted mt-3 leading-relaxed">
                Мы публикуем только настоящие отзывы со ссылкой на источник. До этого момента
                посмотреть жизнь центров и обратную связь можно в сообществе.
              </p>
            </div>
            {site.social.vkPrimary ? (
              <ButtonLink href={site.social.vkPrimary} external variant="secondary" size="lg">
                Перейти в сообщество
                <ArrowRight />
              </ButtonLink>
            ) : null}
          </div>
        </Reveal>
      )}
    </Section>
  );
}
