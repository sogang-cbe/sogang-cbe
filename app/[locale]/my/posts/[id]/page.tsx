import { redirect, notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import MyPostForm from '@/components/my/MyPostForm';
import { currentFaculty } from '@/lib/faculty-self';
import { serviceClient } from '@/lib/vault';
import type { Locale } from '@/lib/i18n';

export const dynamic = 'force-dynamic';
export function generateStaticParams() { return []; }

export default async function MyPost({ params }: { params: { locale: Locale; id: string } }) {
  const l = params.locale;
  const m = await currentFaculty();
  if (!m?.faculty) redirect(`/${l}/my`);
  let post: any = null;
  if (params.id !== 'new') {
    const { data } = await serviceClient().from('posts').select('*').eq('id', Number(params.id)).maybeSingle();
    if (!data || data.board !== 'research' || (data.owner_email || '').toLowerCase() !== m.email) notFound();
    post = data;
  }
  return (<>
    <PageHero locale={l} section="faculty" title={post ? '연구성과 글 수정' : '연구성과 새 글'} narrow />
    <div className="container-narrow py-12"><MyPostForm post={post} locale={l} /></div>
  </>);
}
