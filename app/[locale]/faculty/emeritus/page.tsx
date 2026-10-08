import PageHero from '@/components/PageHero';
import FacultyCardRow from '@/components/FacultyCardRow';
import { getFaculty } from '@/lib/data';
import type { Locale } from '@/lib/i18n';
export const revalidate = 86400; // 관리자 저장 때 즉시 갱신되므로 시간 기준 갱신은 하루(Vercel 무료 한도 절약, 2026-09-26)

/** 명예교수는 가로형 카드를 쓴다. 옛 홈페이지 사진이 100px 안팎이라
 *  전임교수 화면의 세로형(사진 290px)에 올리면 뭉개지고, 사진을 다시 받을 수 없다. */
export default async function Emeritus({ params }: { params: { locale: Locale } }) {
  const list = await getFaculty(true);
  return (<>
    <PageHero locale={params.locale} section="faculty" current="emeritus" narrow />
    <div className="container-narrow py-12">
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((f: any) => <FacultyCardRow key={f.id} f={f} locale={params.locale} />)}
      </div>
    </div>
  </>);
}
