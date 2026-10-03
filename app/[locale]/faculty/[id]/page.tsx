import PageHero from '@/components/PageHero';
import { getFacultyOne, getFaculty } from '@/lib/data';
import { t, T, type Locale } from '@/lib/i18n';
import { formatOffice } from '@/lib/buildings';
import { notFound } from 'next/navigation';
import Link from '@/components/Link';
import { toHtml } from '@/lib/html';
export const revalidate = 86400; // 관리자 저장 때 즉시 갱신되므로 시간 기준 갱신은 하루(Vercel 무료 한도 절약, 2026-09-26)
export function generateStaticParams() { return []; }   // 선언해야 요청 시 만든 페이지가 캐시된다(ISR) — 없으면 매 요청 DB 조회(2026-09-25)

/** 교수 상세. 연구분야 설명·약력(research/bio)이 비어 있는 분이 대부분이라(2026-09 기준 전임 18명 중 0·1명),
 *  본문 칸을 비워 두는 2단 구성 대신 사진+연락처 프로필 카드를 한 덩어리로 짜고, 아래에 소속 분야 소개와
 *  같은 분야 교수진을 붙여 페이지가 비어 보이지 않게 한다. research/bio가 있으면 그 사이에 그대로 보여준다. */
export default async function FacultyDetail({ params }: { params: { locale: Locale; id: string } }) {
  const l = params.locale; const ko = l === 'ko';
  const f = await getFacultyOne(Number(params.id)); if (!f || f.published === false) notFound();
  // 명예교수는 분야를 쓰지 않는다 — 전임 시절 field가 남아 있어도 배지·분야 섹션·같은 분야 목록이 뜨지 않게 (리뷰 지적: 그대로 두면 명예교수 전체가 '같은 분야'로 잘못 나열되고 목록이 두 번 렌더됨)
  const research = toHtml(t(f, 'research', l)); const bio = toHtml(t(f, 'bio', l));
  const kind = f.is_emeritus ? 'emeritus' : f.field === 'chair' ? 'chair' : 'professors';
  const listHref = `/${l}/faculty${kind === 'emeritus' ? '/emeritus' : kind === 'chair' ? '/chair' : ''}`;
  // 같은 분야 교수진(전임) / 명예교수는 다른 명예교수 목록
  const peers: any[] = f.field === 'staff' ? []
    : (await getFaculty(f.is_emeritus)).filter((p: any) => p.id !== f.id && p.field !== 'staff').slice(0, 9);
  const office = formatOffice(f, ko);
  const host = (f.lab_url || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  const accent = 'var(--sg-cardinal)';

  const contacts: { k: string; v: React.ReactNode }[] = [];
  if (office) contacts.push({ k: T(l, 'office'), v: office });
  if (f.tel) contacts.push({ k: T(l, 'tel'), v: <a href={`tel:${f.tel.replace(/[^\d+]/g, '')}`} className="font-mono hover:text-sg-cardinal">{f.tel}</a> });
  if (f.email) contacts.push({ k: T(l, 'email'), v: <a href={`mailto:${f.email}`} className="break-all hover:text-sg-cardinal">{f.email}</a> });
  if (f.lab_url) contacts.push({ k: T(l, 'website'), v: <a href={f.lab_url} target="_blank" rel="noreferrer" className="break-all text-sg-cardinal underline underline-offset-4">{host} ↗<span className="sr-only">{ko ? ' (새 창)' : ' (opens in new window)'}</span></a> });

  // 배지 글자는 분야색이 아닌 잉크색 — 열·유체 주황(#d86018)은 흰 배경 위 13px 글자로 대비 3.75:1이라 AA 미달. 색은 점(●)으로만 표시
  const Badge = () => kind !== 'professors' ? (
    <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide text-sg-cardinal"><span className="w-2 h-2 rounded-full bg-sg-cardinal" />{kind === 'chair' ? (ko ? '석좌교수' : 'Chair Professor') : T(l, 'emeritus')}</span>
  ) : null;
  const PeerRow = (p: any) => (
    <li key={p.id} className="border-b border-sg-line">
      <Link href={`/${l}/faculty/${p.id}`} className="group flex items-center gap-4 py-3">
        <span className="w-12 h-14 shrink-0 bg-sg-mist overflow-hidden">{p.photo_url ? <img src={p.photo_url} alt="" loading="lazy" className="w-full h-full object-cover" /> : <span className="w-full h-full grid place-items-center font-brand text-xl text-sg-gray5">{(p.name_ko || '').slice(0, 1)}</span>}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-[15.5px] leading-tight group-hover:text-sg-cardinal transition-colors">{t(p, 'name', l)} <span className="text-[13px] font-medium text-sg-gray9">{t(p, 'title', l)}</span></span>
          {/* 보조 줄: 전임은 연구실명, 명예교수 목록은 영문 이름으로 통일(연구실이 있는 분과 없는 분이 섞이지 않게) */}
          {(f.is_emeritus ? (ko && p.name_en) : t(p, 'lab', l)) && <span className="block mt-0.5 text-[13px] text-sg-gray11 truncate">{f.is_emeritus ? p.name_en : t(p, 'lab', l)}</span>}
        </span>
        <span className="text-sg-gray5 group-hover:text-sg-cardinal transition-colors" aria-hidden>→</span>
      </Link>
    </li>
  );
  const Name = () => (
    <>
      <h2 className="mt-2 font-brand text-[1.9rem] sm:text-[2.2rem] md:text-[2.7rem] leading-tight break-keep">
        {t(f, 'name', l)} <span className="font-sans text-[0.95rem] md:text-[1.1rem] font-medium text-sg-gray9 whitespace-nowrap">{t(f, 'title', l)}</span>
      </h2>
      {ko && f.name_en && <p className="mt-1 text-[14px] md:text-[15px] text-sg-gray9 tracking-wide">{f.name_en}</p>}
    </>
  );

  return (<>
    <PageHero locale={l} section="faculty" current={kind} title={`${t(f, 'name', l)} ${t(f, 'title', l)}`} />
    <div className="container-site py-12 md:py-16">
      {/* 프로필: 모바일은 사진+이름을 나란히, md 이상은 사진 열 + 정보 열 */}
      <section className="md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[300px_1fr] md:gap-10 lg:gap-14 items-start">
        <div className="flex gap-5 md:block">
          <div className="relative w-[124px] sm:w-[160px] md:w-full shrink-0 aspect-[3/4] bg-sg-mist border border-sg-line overflow-hidden">
            {f.photo_url ? <img src={f.photo_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center font-brand text-5xl md:text-6xl text-sg-gray5">{(f.name_ko || '').slice(0, 1)}</div>}
            <span className="absolute left-0 bottom-0 w-full h-1.5" style={{ background: accent }} />
          </div>
          <div className="md:hidden min-w-0 self-center"><Badge /><Name /></div>
        </div>

        <div className="mt-7 md:mt-0 min-w-0">
          <div className="hidden md:block"><Badge /><Name /></div>

          {t(f, 'lab', l) && (
            <div className="mt-5 md:mt-6 pl-4 border-l-[3px]" style={{ borderColor: accent }}>
              <p className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-sg-gray9">{T(l, 'lab')}</p>
              <p className="mt-1 text-[18px] md:text-[21px] font-bold leading-snug break-keep">{t(f, 'lab', l)}</p>
              {ko && f.lab_en && <p className="mt-0.5 text-[13.5px] text-sg-gray9">{f.lab_en}</p>}
            </div>
          )}

          {contacts.length > 0 && (
            <dl className="mt-7 grid sm:grid-cols-2 gap-x-10 gap-y-4 border-t border-sg-line pt-6 text-[15px]">
              {contacts.map((c) => (
                <div key={c.k}><dt className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-sg-gray9">{c.k}</dt><dd className="mt-1 text-sg-ink break-keep">{c.v}</dd></div>
              ))}
            </dl>
          )}


          <div className="mt-8 flex flex-wrap gap-3">
            {f.lab_url && <a href={f.lab_url} target="_blank" rel="noreferrer" className="btn-primary !py-3">{ko ? '연구실 홈페이지' : 'Lab website'} <span aria-hidden>↗</span></a>}
            {f.email && <a href={`mailto:${f.email}`} className="btn-ghost !py-3">{ko ? '이메일 보내기' : 'Send email'}</a>}
            <Link href={listHref} className="btn !py-3 border border-sg-line text-sg-gray11 hover:border-sg-ink hover:text-sg-ink">← {T(l, 'list')}</Link>
          </div>
        </div>
      </section>

      {(research || bio) && (
        <section className="mt-14 md:mt-16 max-w-4xl prose-sg">
          {research ? <><h2 className="!mt-0">{T(l, 'field')}</h2><div dangerouslySetInnerHTML={{ __html: research }} /></> : null}
          {bio ? <><h2 className={research ? '' : '!mt-0'}>{ko ? '약력' : 'Biography'}</h2><div dangerouslySetInnerHTML={{ __html: bio }} /></> : null}
        </section>
      )}

      {/* 같은 구분의 다른 교수진 */}
      {peers.length > 0 && (
        <section className="mt-14 md:mt-20 border-t border-sg-line pt-10 md:pt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{f.is_emeritus ? T(l, 'emeritus') : ko ? '화공생명공학과' : 'Department of CBE'}</p>
              <h3 className="mt-2 font-brand text-[1.5rem] md:text-[1.8rem] leading-none break-keep">{f.is_emeritus ? (ko ? '다른 명예교수' : 'Other emeritus professors') : (ko ? '다른 교수진' : 'Other professors')}</h3>
            </div>
            <Link href={f.is_emeritus ? `/${l}/faculty/emeritus` : `/${l}/faculty`} className="shrink-0 text-[14px] font-semibold text-sg-gray11 hover:text-sg-cardinal whitespace-nowrap">{T(l, 'more')} +</Link>
          </div>
          <ul className="mt-5 grid md:grid-cols-2 gap-x-12 border-t border-sg-line">{peers.map(PeerRow)}</ul>
        </section>
      )}
    </div>
  </>);
}
