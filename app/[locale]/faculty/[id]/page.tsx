import FacultyDetailView from '@/components/FacultyDetailView';
import { getFacultyOne } from '@/lib/data';
import type { Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
export const revalidate = 86400; // 관리자 저장 때 즉시 갱신되므로 시간 기준 갱신은 하루(Vercel 무료 한도 절약, 2026-09-26)
export function generateStaticParams() { return []; }   // 선언해야 요청 시 만든 페이지가 캐시된다(ISR) — 없으면 매 요청 DB 조회(2026-09-25)

/** 교수 상세 — 데이터만 읽어 FacultyDetailView 에 넘긴다(화면 구성은 그 컴포넌트에). */
export default async function FacultyDetail({ params }: { params: { locale: Locale; id: string } }) {
  const f = await getFacultyOne(Number(params.id)); if (!f || f.published === false) notFound();
  return <FacultyDetailView f={f} locale={params.locale} />;
}
