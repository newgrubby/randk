import type { Review } from './types';

/**
 * Отзывы учеников и родителей.
 *
 * СЕЙЧАС МАССИВ ПУСТ — И ЭТО НАМЕРЕННО.
 * Вымышленные отзывы не создаются. Пока данных нет, блок показывает
 * корректное сообщение и предлагает оставить отзыв.
 *
 * Как добавить: заполнить объект по типу `Review` и поставить `isConfirmed: true`.
 * Отзывы с `isConfirmed: false` на сайте не отображаются.
 *
 * Рекомендация: указывать `sourceUrl` (VK или Яндекс Карты) —
 * это повышает доверие и позволяет позже подключить агрегацию.
 */

export const reviews: Review[] = [];

/** Отзывы, разрешённые к публикации. */
export const publishedReviews = reviews.filter((review) => review.isConfirmed);

export const hasPublishedReviews = publishedReviews.length > 0;
