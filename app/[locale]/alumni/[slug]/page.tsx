import StaticPage from '@/components/StaticPage';
import type { Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
export const revalidate = 86400;
export function generateStaticParams() { return []; }
const slugs = ['intro', 'officers', 'dues'];
export default function Alumni({ params }: { params: { locale: Locale; slug: string } }) {
  if (!slugs.includes(params.slug)) notFound();
  return <StaticPage locale={params.locale} section="alumni" slug={params.slug} />;
}
