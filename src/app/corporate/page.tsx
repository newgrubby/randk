import { notFound } from 'next/navigation';
import { DirectionPage } from '@/components/templates/DirectionPage';
import { getProgram } from '@/content/programs';
import { buildMetadata } from '@/lib/seo';

/**
 * Маршрут направления — тонкая обёртка над общим шаблоном.
 * Вся вёрстка живёт в DirectionPage, поэтому правка макета
 * применяется сразу ко всем направлениям.
 */
const SLUG = 'corporate';

export function generateMetadata() {
  const program = getProgram(SLUG);
  if (!program) {
    return buildMetadata({
      title: 'Страница не найдена',
      description: '',
      path: '/programs',
      noIndex: true,
    });
  }
  return buildMetadata({
    title: program.seoTitle,
    ogTitle: program.title,
    description: program.seoDescription,
    path: program.href,
  });
}

export default function Page() {
  const program = getProgram(SLUG);
  if (!program) notFound();
  return <DirectionPage program={program} />;
}
