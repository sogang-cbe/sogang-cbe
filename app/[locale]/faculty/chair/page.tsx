import PageHero from '@/components/PageHero';
import FacultyCard from '@/components/FacultyCard';
import { getChair } from '@/lib/data';
import type { Locale } from '@/lib/i18n';
export const revalidate = 86400; // 관리자 저장 때 즉시 갱신되므로 시간 기준 갱신은 하루(Vercel 무료 한도 절약, 2026-09-26)
export default async function Chair({ params }: { params: { locale: Locale } }) {
  const ko = params.locale === 'ko';
  const list = await getChair();
  return (<>
    <PageHero locale={params.locale} section="faculty" current="chair" narrow />
    <div className="container-narrow py-12">
      {list.length === 0
        ? <p className="text-sg-gray9 break-keep">{ko ? '석좌교수 정보가 아직 등록되지 않았습니다.' : 'No chair professor records yet.'}</p>
        : <div className="grid gap-x-5 gap-y-9 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{list.map((f: any) => <FacultyCard key={f.id} f={f} locale={params.locale} />)}</div>}
    </div>
  </>);
}
