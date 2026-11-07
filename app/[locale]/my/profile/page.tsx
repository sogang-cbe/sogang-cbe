import { redirect } from 'next/navigation';
import PageHero from '@/components/PageHero';
import ProfileForm from '@/components/my/ProfileForm';
import { currentFaculty } from '@/lib/faculty-self';
import type { Locale } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function MyProfile({ params }: { params: { locale: Locale } }) {
  const l = params.locale;
  const m = await currentFaculty();
  if (!m?.faculty) redirect(`/${l}/my`);
  return (<>
    <PageHero locale={l} section="faculty" title="내 교수진 페이지 수정" narrow />
    <div className="container-narrow py-12"><ProfileForm f={m.faculty} locale={l} /></div>
  </>);
}
