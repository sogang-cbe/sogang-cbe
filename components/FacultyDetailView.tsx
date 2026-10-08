import PageHero from '@/components/PageHero';
import Link from '@/components/Link';
import { t, T, type Locale } from '@/lib/i18n';
import { formatOffice } from '@/lib/buildings';
import { toHtml, shortLab, researchBody, splitBio } from '@/lib/html';

/** 교수 상세 화면. 2026-10 개편(책임자 승인한 시안):
 *  - 사진은 모든 교수님 같은 4:5 비율·같은 칸 폭으로 고정하고 밑에 빨간 줄을 두지 않는다. 사진 아래 끝이 오른쪽 칸 버튼 줄과 맞는다.
 *  - 연락처는 두 칸(칸 폭 280px 제한 — 전체를 반으로 쪼개면 위치와 전화가 너무 멀어진다).
 *  - 아래는 약력(왼쪽) · 연구 소개(오른쪽) 2단, 주요 논문은 전체 폭 번호 목록으로 따로 뺀다.
 *  - 연구 소개 맨 앞 요약 줄과 연구실 이름 뒤 영문 괄호는 연구분야 칩·영문 줄과 겹치므로 떼어 낸다(lib/html).
 *  DB를 읽지 않는 표시 전용 컴포넌트 — 시안 확인용 미리보기에서 같은 화면을 가짜 데이터로 띄울 수 있다. */
export default function FacultyDetailView({ f, locale: l }: { f: any; locale: Locale }) {
  const ko = l === 'ko';
  // 명예교수는 분야를 쓰지 않는다 — 전임 시절 field가 남아 있어도 배지·같은 분야 목록이 뜨지 않게
  const kind = f.is_emeritus ? 'emeritus' : f.field === 'chair' ? 'chair' : 'professors';
  const listHref = `/${l}/faculty${kind === 'emeritus' ? '/emeritus' : kind === 'chair' ? '/chair' : ''}`;
  const research = researchBody(toHtml(t(f, 'research', l)));
  const { vita, pubs } = splitBio(toHtml(t(f, 'bio', l)));
  const twoCol = Boolean(vita) && Boolean(research);
  const office = formatOffice(f, ko);
  const lab = shortLab(t(f, 'lab', l) || '', ko);
  // 주소가 길면(연구실 홈페이지가 하위 경로인 경우) 도메인만 적는다 — 연락처 칸(280px)에서 두 줄로 접히지 않게
  const url = (f.lab_url || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  const host = url.length > 28 ? url.split('/')[0] : url;

  const keywords: string[] = (f.keywords || '').split(',').map((x: string) => x.trim()).filter(Boolean);
  const contacts: { k: string; v: React.ReactNode }[] = [];
  if (office) contacts.push({ k: T(l, 'office'), v: office });
  if (f.tel) contacts.push({ k: T(l, 'tel'), v: <a href={`tel:${f.tel.replace(/[^\d+]/g, '')}`} className="font-mono hover:text-sg-cardinal">{f.tel}</a> });
  if (f.email) contacts.push({ k: T(l, 'email'), v: <a href={`mailto:${f.email}`} className="break-all hover:text-sg-cardinal">{f.email}</a> });
  if (f.lab_url) contacts.push({ k: T(l, 'website'), v: <a href={f.lab_url} target="_blank" rel="noreferrer" className="break-all text-sg-cardinal underline underline-offset-4">{host} ↗<span className="sr-only">{ko ? ' (새 창)' : ' (opens in new window)'}</span></a> });

  const chip = 'font-sans text-[12px] font-semibold text-sg-cardinal border border-sg-cardinal px-1.5 py-[2px] leading-none whitespace-nowrap';
  const Head = () => (
    <>
      <h2 className="font-brand text-[1.9rem] sm:text-[2.2rem] md:text-[2.6rem] leading-[1.15] break-keep flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {t(f, 'name', l)}
        <span className="font-sans text-[0.95rem] md:text-[1.05rem] font-medium text-sg-gray9 whitespace-nowrap">{t(f, 'title', l)}</span>
        {/* 배지는 DB의 badge 칸만 쓴다 — 명예교수·석학교수는 직함(title)에 이미 적혀 있어 자동 배지를 붙이면 두 번 나온다 */}
        {t(f, 'badge', l) && <span className={chip}>{t(f, 'badge', l)}</span>}
        {t(f, 'role_note', l) && <span className="font-sans text-[12px] font-semibold text-white bg-sg-cardinal px-1.5 py-[3px] leading-none whitespace-nowrap">{t(f, 'role_note', l)}</span>}
      </h2>
      {ko && f.name_en && <p className="mt-1.5 text-[14px] md:text-[15px] text-sg-gray9 tracking-wide">{f.name_en}</p>}
    </>
  );

  return (<>
    <PageHero locale={l} section="faculty" current={kind} title={`${t(f, 'name', l)} ${t(f, 'title', l)}`} narrow />
    <div className="container-narrow py-12 md:py-16">
      {/* 프로필: 모바일은 사진+이름을 나란히, md 이상은 사진 열 + 정보 열 */}
      <section className="md:grid md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[370px_minmax(0,1fr)] md:gap-10 lg:gap-12 items-start">
        <div className="flex gap-5 md:block">
          {/* 사진: 4:5 고정. 사진이 없으면 성함 첫 글자를 옅게 넣어 칸이 비어 보이지 않게 한다 */}
          <div className="relative w-[128px] sm:w-[170px] md:w-full shrink-0 aspect-[4/5] bg-white border border-sg-line overflow-hidden">
            {f.photo_url
              ? <img src={f.photo_url} alt="" className="w-full h-full object-cover" />
              : <span className="absolute inset-0 grid place-items-center font-brand text-5xl md:text-6xl text-sg-line select-none">{(f.name_ko || '').slice(0, 1)}</span>}
          </div>
          <div className="md:hidden min-w-0 self-center"><Head /></div>
        </div>

        <div className="mt-7 md:mt-0 min-w-0">
          <div className="hidden md:block"><Head /></div>

          {lab && (
            <div className="mt-5 md:mt-6 pl-4 border-l-[3px] border-sg-cardinal">
              <p className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-sg-gray9">{T(l, 'lab')}</p>
              <p className="mt-1 text-[18px] md:text-[21px] font-bold leading-snug break-keep">{lab}</p>
              {ko && f.lab_en && <p className="mt-0.5 text-[13.5px] text-sg-gray9">{f.lab_en}</p>}
            </div>
          )}

          {/* 연락처 두 칸 — 칸 폭을 280px로 묶어 위치와 전화가 멀어지지 않게 한다 */}
          {contacts.length > 0 && (
            <dl className="mt-7 pt-6 border-t border-sg-line grid grid-cols-1 sm:grid-cols-[repeat(2,minmax(0,280px))] gap-x-8 gap-y-[18px] text-[15px]">
              {contacts.map((c) => (
                <div key={c.k} className="min-w-0"><dt className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-sg-gray9">{c.k}</dt><dd className="mt-1.5 text-sg-ink break-keep">{c.v}</dd></div>
              ))}
            </dl>
          )}

          {/* 연구분야 칩: 글자 폭에 맞춰 작게. 칸을 균등하게 늘리면 짧은 말이 부풀어 커 보인다 */}
          {keywords.length > 0 && (
            <div className="mt-6">
              <p className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-sg-gray9">{T(l, 'field')}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {keywords.map((k) => <li key={k} className="text-[12.5px] leading-[1.5] px-[9px] py-[3px] border border-sg-line text-sg-gray11 break-keep">{k}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            {f.lab_url && <a href={f.lab_url} target="_blank" rel="noreferrer" className="btn-primary !px-6 !py-3">{ko ? '연구실 홈페이지' : 'Lab website'} <span aria-hidden>↗</span></a>}
            {f.email && <a href={`mailto:${f.email}`} className="btn-ghost !px-6 !py-3">{ko ? '이메일 보내기' : 'Send email'}</a>}
            <Link href={listHref} className="btn !px-6 !py-3 border border-sg-line text-sg-gray11 hover:border-sg-ink hover:text-sg-ink">← {T(l, 'list')}</Link>
          </div>
        </div>
      </section>

      {/* 약력(왼쪽) · 연구 소개(오른쪽). 한쪽만 있으면 한 단으로 */}
      {(vita || research) && (
        <section className={`mt-14 md:mt-16 ${twoCol ? 'grid gap-10 md:gap-14 md:grid-cols-[1fr_1.5fr] items-start' : 'max-w-4xl'}`}>
          {vita && (
            <div>
              <h2 className="sec-h">{ko ? '약력' : 'Biography'}</h2>
              <div className="vita-col text-justify" dangerouslySetInnerHTML={{ __html: vita }} />
            </div>
          )}
          {research && (
            <div className="min-w-0">
              <h2 className="sec-h">{ko ? '연구 소개' : 'Research'}</h2>
              <div className="prose-sg text-justify" dangerouslySetInnerHTML={{ __html: research }} />
            </div>
          )}
        </section>
      )}

      {/* 주요 논문: 전체 폭 번호 목록 */}
      {pubs.length > 0 && (
        <section className="mt-14 md:mt-16">
          <h2 className="sec-h">{ko ? '주요 논문' : 'Selected publications'}</h2>
          <ol className="pubs">{pubs.map((p, i) => <li key={i} dangerouslySetInnerHTML={{ __html: p }} />)}</ol>
        </section>
      )}

    </div>
  </>);
}
