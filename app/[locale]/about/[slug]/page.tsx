import Link from '@/components/Link';
import StaticPage from '@/components/StaticPage';
import { history } from '@/content/courses';
import { areas } from '@/content/areas';
import { getFaculty } from '@/lib/data';
import { shortLab } from '@/lib/html';
import type { Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const revalidate = 86400;
export function generateStaticParams() { return []; }

const slugs = ['intro', 'history', 'competency', 'location', 'labs', 'centers', 'staff'];
/** URL은 /about/... 이지만 메뉴상 소속이 다른 페이지가 있다 — 히어로 탭이 맞는 메뉴를 가리키게 한다. */
const sectionOf: Record<string, string> = { labs: 'research', centers: 'research', staff: 'faculty' };

export default async function AboutPage({ params }: { params: { locale: Locale; slug: string } }) {
  const { locale: l, slug } = params;
  const ko = l === 'ko';
  if (!slugs.includes(slug)) notFound();

  /* 연혁 — cs_history(1976~2020)를 10년 단위로 묶어 보여준다. */
  if (slug === 'history') {
    const decades = Array.from(new Set(history.map((h) => h.year.slice(0, 3) + '0')));
    return (
      <StaticPage locale={l} section={sectionOf[slug] || 'about'} slug={slug}>
        <p className="eyebrow">SINCE 1976</p>
        <div className="mt-8 space-y-12">
          {decades.map((d) => {
            const items = history.filter((h) => h.year.startsWith(d.slice(0, 3)));
            if (!items.length) return null;
            return (
              <section key={d} className="grid md:grid-cols-[120px_1fr] gap-6">
                <h2 className="font-mono text-3xl font-medium text-sg-cardinal tabular-nums">{d}s</h2>
                <ol className="relative border-l border-sg-line pl-8 space-y-5">
                  {items.map((h, i) => (
                    <li key={`${h.year}-${i}`} className="relative">
                      <span className="absolute -left-[37px] top-1.5 w-2.5 h-2.5 bg-sg-cardinal rounded-full ring-4 ring-white" />
                      <span className="font-mono text-[12px] text-sg-gray9 tabular-nums">{h.year}</span>
                      <p className="mt-0.5 text-[15px] break-keep">{h.content}</p>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
        {!ko && <p className="mt-10 text-[13.5px] text-sg-gray9">The department history is maintained in Korean; an English version is in preparation.</p>}
      </StaticPage>
    );
  }

  /* 연구센터 — 학과가 운영하는 대형 연구센터 4곳. */
  if (slug === 'centers') {
    return (
      <StaticPage locale={l} section={sectionOf[slug] || 'about'} slug={slug}>
        <p className="text-[15px] text-sg-gray11 break-keep mb-10">{ko ? '참여교수 명단은 옛 홈페이지 기준입니다. 현황이 바뀐 경우 학과사무실로 알려 주세요.' : 'Participating-faculty lists are carried over from the previous site and are being verified.'}</p>
        <div className="space-y-14">
          {areas.map((a) => (
            <section key={a.id} id={a.id} className="scroll-mt-40">
              <div className="flex gap-5 border-t-2 border-sg-ink pt-6">
                <div className="w-[6px] self-stretch shrink-0" style={{ backgroundColor: a.color }} />
                <div className="min-w-0">
                  <h2 className="font-brand text-[1.6rem] md:text-[2rem] leading-tight break-keep">{ko ? a.ko : a.en}</h2>
                  {ko && <p className="text-[13.5px] text-sg-gray9 mt-1">{a.en}</p>}
                </div>
              </div>
              <p className="mt-4 text-[15.5px] leading-relaxed text-[#2a2d33] break-keep max-w-3xl">{ko ? a.descKo : a.descEn}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {(ko ? a.keywordsKo : a.keywordsEn).map((k) => (
                  <li key={k} className="text-[12.5px] px-2.5 py-1 border border-sg-line bg-sg-mist rounded-full">{k}</li>
                ))}
              </ul>
              <dl className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-[110px_1fr] text-[14.5px] max-w-3xl">
                <dt className="font-semibold text-sg-gray9">{ko ? '책임교수' : 'Director'}</dt>
                <dd className="break-keep">{a.lead}{ko ? ' 교수' : ''}</dd>
                {a.members.length > 0 && <>
                  <dt className="font-semibold text-sg-gray9">{ko ? '참여교수' : 'Faculty'}</dt>
                  <dd className="break-keep">{a.members.join(', ')}</dd>
                </>}
                {a.url && <>
                  <dt className="font-semibold text-sg-gray9">{ko ? '홈페이지' : 'Website'}</dt>
                  <dd><a href={a.url} target="_blank" rel="noreferrer" className="text-sg-cardinal underline underline-offset-4 break-all">{a.url.replace(/^https?:\/\//, '')} ↗</a></dd>
                </>}
              </dl>
            </section>
          ))}
        </div>
      </StaticPage>
    );
  }

  /* 연구실 — 교수진(DB)에서 자동 생성. 교수 정보를 고치면 이 목록이 따라 바뀐다.
     2026-10-09 개편(A안): 맨 위 안내문과 교수 사진을 빼고, 연구실명은 국문만 크게 쓰고 영문은 아랫줄로 내렸다.
     (목록형 B안도 만들어 봤으나 실제로 보니 카드가 낫다는 결론) */
  if (slug === 'labs') {
    const faculty = await getFaculty(false);
    const labs = faculty.filter((f: any) => f.lab_ko && f.field !== 'staff');
    const kw = (f: any) => (f.keywords || '').split(',').map((x: string) => x.trim()).filter(Boolean).slice(0, 4);
    return (
      <StaticPage locale={l} section={sectionOf[slug] || 'about'} slug={slug}>
        <div className="grid gap-4 md:grid-cols-2">
          {labs.map((f: any) => (
            <div key={f.id} className="card group relative flex flex-col p-6 md:p-7">
              {/* 카드 전체가 교수 상세로 간다. 연구실 홈페이지(↗)만 그 위에 따로 올려 둔다
                  (<a> 안에 <a> 를 넣을 수 없어 겹쳐 놓는 방식을 쓴다) */}
              <Link href={`/${l}/faculty/${f.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">{ko ? `${f.name_ko} 교수 상세` : `${f.name_en || f.name_ko} details`}</span>
              </Link>
              {/* 국문명 뒤의 영문 괄호는 떼고 영문은 아래 줄로 — 한 줄에 두 번 적히지 않게 */}
              <h2 className="text-[19px] md:text-[20px] font-bold leading-snug break-keep !mt-0 transition-colors group-hover:text-sg-cardinal">
                {shortLab(ko ? f.lab_ko : f.lab_en || f.lab_ko, ko)}
                {f.lab_url && <a href={f.lab_url} target="_blank" rel="noreferrer"
                  className="relative z-10 ml-1 inline-block align-middle text-[13px] text-sg-cardinal hover:text-sg-deep"
                  title={ko ? '연구실 홈페이지 (새 창)' : 'Lab website (opens in new window)'}>↗<span className="sr-only">{ko ? ' 연구실 홈페이지 (새 창)' : ' Lab website (opens in new window)'}</span></a>}
              </h2>
              {ko && f.lab_en && <p className="mt-1.5 text-[13px] leading-snug text-sg-gray9">{f.lab_en}</p>}

              {kw(f).length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {kw(f).map((k: string) => <li key={k} className="text-[12px] leading-[1.5] px-2 py-[3px] border border-sg-line text-sg-gray11 break-keep">{k}</li>)}
                </ul>
              )}

              <div className="mt-auto pt-4 border-t border-sg-line flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-bold text-[15.5px] transition-colors group-hover:text-sg-cardinal">
                  {ko ? f.name_ko : f.name_en || f.name_ko}
                  <span className="ml-1.5 text-[12.5px] font-medium text-sg-gray9">{ko ? f.title_ko : f.title_en}</span>
                </span>
                <span className="ml-auto text-[12.5px] text-sg-gray9">
                  {[f.room ? (ko ? `${f.room}호` : `Room ${f.room}`) : '', f.email].filter(Boolean).join(' · ')}
                </span>
              </div>
            </div>
          ))}
        </div>
        {labs.length === 0 && (
          <p className="mt-8 text-[15px] text-sg-gray9">{ko ? '연구실 정보는 관리자 화면에서 교수진을 등록하면 자동으로 채워집니다.' : 'This list fills in automatically once faculty records are added.'}</p>
        )}
      </StaticPage>
    );
  }

  if (slug === 'location') {
    const addr = ko
      ? '04107 서울특별시 마포구 백범로 35 (신수동) 리치과학관(R) 521호 화공생명공학과 학과사무실'
      : 'Ricci Hall (R) Room 521, 35 Baekbeom-ro, Mapo-gu, Seoul 04107, Korea';
    return (
      <StaticPage locale={l} section={sectionOf[slug] || 'about'} slug={slug}>
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <div className="prose-sg">
            <h2 className="!mt-0">{ko ? '학과사무실' : 'Department office'}</h2>
            <table><tbody>
              <tr><th>{ko ? '주소' : 'Address'}</th><td>{addr}</td></tr>
              <tr><th>{ko ? '전화' : 'Phone'}</th><td>02-705-8474 / 02-705-8039</td></tr>
              <tr><th>{ko ? '팩스' : 'Fax'}</th><td>02-711-0439</td></tr>
            </tbody></table>
            <h2>{ko ? '대중교통' : 'Public transport'}</h2>
            <table><tbody>
              <tr><th>{ko ? '지하철' : 'Subway'}</th><td>{ko ? '2호선 신촌역 6번 출구 도보 8분 · 6호선 대흥역 1번 출구 도보 12분' : 'Line 2 Sinchon Station Exit 6, 8 min walk · Line 6 Daeheung Station Exit 1, 12 min walk'}</td></tr>
              <tr><th>{ko ? '버스' : 'Bus'}</th><td className="tabular-nums">110, 153, 604, 740, 5714, 7016, 7613, 921</td></tr>
            </tbody></table>
            <p><a href="https://www.sogang.ac.kr/ko/campus-map" target="_blank" rel="noreferrer">{ko ? '학내 건물 배치도 →' : 'Campus map →'}</a></p>
          </div>
          <div className="border border-sg-line aspect-[4/3] bg-sg-mist overflow-hidden">
            <iframe title="map" className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=%EC%84%9C%EA%B0%95%EB%8C%80%ED%95%99%EA%B5%90+%EB%A6%AC%EC%B9%98%EA%B3%BC%ED%95%99%EA%B4%80&t=&z=16&ie=UTF8&iwloc=&output=embed" />
          </div>
        </div>
      </StaticPage>
    );
  }

  return <StaticPage locale={l} section={sectionOf[slug] || 'about'} slug={slug} />;
}
