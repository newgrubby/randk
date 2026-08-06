import { notFound } from 'next/navigation';
import { LanguagePage } from '@/components/templates/LanguagePage';
import { activeLanguages, getLanguage } from '@/content/languages';
import { buildMetadata } from '@/lib/seo';

/** Статические маршруты собираются из активных языков — скрытые не попадают в сборку. */
export function generateStaticParams() {
  return activeLanguages.map((language) => ({ slug: language.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const language = getLanguage(slug);

  if (!language) {
    return buildMetadata({
      title: 'Язык не найден',
      description: '',
      path: '/languages',
      noIndex: true,
    });
  }

  return buildMetadata({
    title: language.seoTitle,
    ogTitle: language.title,
    description: language.seoDescription,
    path: `/languages/${language.slug}`,
  });
}

export default async function LanguageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const language = getLanguage(slug);
  if (!language) notFound();

  return <LanguagePage language={language} />;
}
