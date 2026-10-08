import PageHero from '@/components/PageHero';
import FacultyCard from '@/components/FacultyCard';
import Reveal from '@/components/Reveal';
import { getFaculty } from '@/lib/data';
import type { Locale } from '@/lib/i18n';
export const revalidate = 86400;

/** 전임교수 목록. 화공과는 기계과 같은 공식 '기초 분야' 구분을 쓰지 않으므로
 *  분야 탭 없이 한 줄로 나열하고, 정렬은 관리자 화면의 sort_order를 따른다. */
export default async function Faculty({ params }: { params: { locale: Locale } }) {
  const l = params.locale; const ko = l === 'ko';
  const all = (await getFaculty(false)).filter((f: any) => f.field !== 'staff');
  return (<>
    <PageHero locale={l} section="faculty" current="professors" />
    <div className="container-site py-12">
      {all.length === 0
        ? <p className="text-sg-gray9">{ko ? '교수진 정보가 아직 등록되지 않았습니다.' : 'No faculty records yet.'}</p>
        : <div className="grid gap-x-6 gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {all.map((f: any, i: number) => <Reveal key={f.id} delay={Math.min(i, 8) * 50} className="min-w-0"><FacultyCard f={f} locale={l} /></Reveal>)}
          </div>}
    </div>
  </>);
}
