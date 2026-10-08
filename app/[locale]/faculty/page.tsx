import PageHero from '@/components/PageHero';
import FacultyCard from '@/components/FacultyCard';
import Reveal from '@/components/Reveal';
import Link from '@/components/Link';
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
      <p className="text-[15px] text-sg-gray11 break-keep mb-8">
        {ko
          ? `전임교수 ${all.length}명이 촉매·분리막·고분자·전기화학·나노바이오·생물공정에 걸친 연구실을 이끌고 있습니다. 연구실별 소개는 `
          : `${all.length} full-time professors lead laboratories spanning catalysis, membranes, polymers, electrochemistry, nano-bioengineering and bioprocessing. See `}
        <Link href={`/${l}/about/labs`} className="text-sg-cardinal underline underline-offset-4">{ko ? '연구실 페이지' : 'the laboratory list'}</Link>
        {ko ? '에서 볼 수 있습니다.' : ' for details.'}
      </p>
      {all.length === 0
        ? <p className="text-sg-gray9">{ko ? '교수진 정보가 아직 등록되지 않았습니다.' : 'No faculty records yet.'}</p>
        : <div className="grid gap-x-6 gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {all.map((f: any, i: number) => <Reveal key={f.id} delay={Math.min(i, 8) * 50} className="min-w-0"><FacultyCard f={f} locale={l} /></Reveal>)}
          </div>}
    </div>
  </>);
}
