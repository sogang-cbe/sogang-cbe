import Link from '@/components/Link';
import PageHero from '@/components/PageHero';
import PostCard, { fmtDate } from '@/components/PostCard';
import { getPosts } from '@/lib/data';
import { boards, boardSection, adminOnlyBoards, memberOnlyBoards } from '@/lib/nav';
import { t, T, authorLabel, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { facultyNames, peopleEn } from '@/lib/names';
import { currentMember, isApproved } from '@/lib/members';
import MemberLogin from '@/components/MemberLogin';
export const revalidate = 600; // 자료실(archive)만 로그인 쿠키를 읽어 요청마다 동적으로 그려지고, 나머지 게시판은 10분 캐시. 60초 → 10분(2026-09-25 Supabase 전송량 절감): 글 저장·삭제는 즉시 갱신되고, 목록의 조회수만 최대 10분 늦게 바뀐다
const PER = 15;
const intros: Record<string, [string, string]> = {
  academic: ['수강·교과목·실험·졸업·학적 등 학부와 대학원 학사 공지입니다. 옛 홈페이지의 「학사」와 「학생게시판」 글을 모두 옮겨 왔습니다.', 'Academic notices for undergraduate and graduate programs, including posts migrated from the previous site.'],
  scholarship: ['장학금, 인턴·채용, 설명회 안내입니다.', 'Scholarships, internships, recruiting and information sessions.'],
  research: ['학과 교수진과 연구실의 논문·수상·연구 소식입니다.', 'Papers, awards and research news from our faculty and laboratories.'],
  seminar: ['학과 세미나와 초청 강연 일정입니다. 대학원생은 매 학기 세미나 과목을 수강해야 합니다.', 'Department seminars and invited talks. Graduate students take the seminar course every semester.'],
  gallery: ['학과 행사와 학교생활 사진입니다.', 'Photos from department events and student life.'],
  archive: ['학과 양식과 자료를 모아 둔 곳입니다. 로그인한 구성원만 볼 수 있습니다.', 'Forms and documents for department members. Sign-in required.'],
  grad_intro: ['화공생명공학과 대학원 재학생 소개입니다.', 'Introducing our graduate students.'],
  internal: ['교수회의록·공문서 등 학과 내부 기록입니다. 관리자만 볼 수 있습니다.', 'Internal departmental records. Administrators only.'],
};

export default async function BoardList({ params, searchParams }: { params: { locale: Locale; board: string }; searchParams: { page?: string; q?: string; year?: string } }) {
  const { locale: l, board } = params; const ko = l === 'ko';
  if (!(boards as readonly string[]).includes(board)) notFound();
  // 내부 기록(교수회의록·공문서)은 메뉴에도 없고 관리자 화면에서만 본다 — 주소를 알아도 열리지 않게 404
  if ((adminOnlyBoards as readonly string[]).includes(board)) notFound();
  // 자료실은 로그인한 구성원만
  if ((memberOnlyBoards as readonly string[]).includes(board)) {
    const me = await currentMember();
    if (!me || !isApproved(me.member)) return (<>
      <PageHero locale={l} section="board" current={board} />
      <div className="container-narrow py-16">
        <h2 className="font-brand text-[1.8rem] break-keep">{ko ? '구성원만 볼 수 있습니다' : 'Members only'}</h2>
        <p className="mt-3 text-[15px] text-sg-gray11 break-keep">{ko ? '자료실은 대학원생·교수·행정실만 볼 수 있습니다. 서강대학교 구글 계정으로 로그인해 주세요.' : 'Sign in with your Sogang Google account to view the downloads.'}</p>
        <div className="mt-8"><MemberLogin next={`/${l}/board/${board}`} locale={l} /></div>
      </div>
    </>);
  }
  const pageN = Number(searchParams.page); // 숫자가 아니면 NaN → 1페이지로 (NaN이 range()에 흘러가 빈 화면이 되지 않게)
  const page = Number.isFinite(pageN) && pageN >= 1 ? Math.floor(pageN) : 1; const q = searchParams.q || '';
  const { posts: raw, total } = await getPosts(board, page, PER, q);
  // 캡스톤·학술제의 조원·지도교수는 국문으로 입력된다 → 영문 페이지에서는 교수는 공식 영문 이름, 학생은 로마자로
  const people = !ko && raw.some((p) => p.advisor || p.members);
  const names = people ? await facultyNames() : [];
  const posts = people ? raw.map((p) => ({ ...p, advisor: p.advisor && peopleEn(names, p.advisor), members: p.members && peopleEn(names, p.members) })) : raw;
  const pages = Math.max(1, Math.ceil(total / PER));
  const [section, current] = boardSection[board] || ['board', board];
  const href = (p: number) => `/${l}/board/${board}?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
  return (<>
    <PageHero locale={l} section={section} current={current} />
    <div className="container-site py-12">
      {intros[board] && <p className="mb-8 max-w-3xl text-[16px] leading-relaxed text-sg-gray11">{ko ? intros[board][0] : intros[board][1]}</p>}
      {(
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-[13px] text-sg-gray9">{ko ? `총 ${total}건` : `${total} posts`}</p>
          <form className="flex" action={`/${l}/board/${board}`}><input name="q" defaultValue={q} placeholder={T(l, 'search')} className="input !w-56" /><button className="btn-primary !py-2">{T(l, 'search')}</button></form>
        </div>
      )}
      {posts.length === 0 ? <p className="py-16 text-center text-sg-gray9 border border-dashed border-sg-line">{T(l, 'noPosts')}</p>
       : board === 'gallery' ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{posts.map((p) => <PostCard key={p.id} post={p} locale={l} />)}</div>
      ) : (
        <table className="w-full text-[15px] border-t-2 border-sg-ink">
          <thead className="hidden md:table-header-group"><tr className="text-[12px] uppercase tracking-wider text-sg-gray9 border-b border-sg-line">
            <th className="py-3 w-16 text-left">No.</th><th className="py-3 text-left">{ko ? '제목' : 'Title'}</th><th className="py-3 w-28 text-left">{T(l, 'author')}</th><th className="py-3 w-28 text-left">{T(l, 'date')}</th><th className="py-3 w-16 text-right">{T(l, 'views')}</th></tr></thead>
          <tbody>
            {posts.map((p, i) => (
              <tr key={p.id} className={`border-b border-sg-line ${p.is_pinned ? 'bg-[#f9f9f9]' : ''}`}>
                <td className="py-3.5 pr-2 text-[13px] text-sg-gray9 hidden md:table-cell">{p.is_pinned ? <span className="text-sg-cardinal font-bold">{ko ? '공지' : 'PIN'}</span> : total - (page - 1) * PER - i}</td>
                <td className="py-3.5 pr-3">
                  <Link href={`/${l}/board/${board}/${p.id}`} className="font-medium hover:text-sg-cardinal line-clamp-2">
                    {p.is_pinned && <span className="md:hidden text-[11px] text-sg-cardinal font-bold mr-2">{ko ? '공지' : 'PIN'}</span>}{t(p, 'title', l)}
                    {(p.attachments?.length ?? 0) > 0 && <span className="ml-2 text-[12px] text-sg-gray9">📎</span>}{p.video_url && <span className="ml-2 text-[12px] text-sg-cardinal">▶</span>}
                  </Link>
                  <span className="md:hidden block text-[12px] text-sg-gray9 mt-1">{fmtDate(p.created_at)}</span>
                </td>
                <td className="py-3.5 pr-3 text-sg-gray11 hidden md:table-cell">{authorLabel(p.author, l)}</td>
                <td className="py-3.5 pr-3 text-[13px] text-sg-gray9 hidden md:table-cell">{fmtDate(p.created_at)}</td>
                <td className="py-3.5 text-right text-[13px] text-sg-gray9 hidden md:table-cell">{p.view_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {pages > 1 && (
        <nav className="mt-10 flex justify-center gap-1 text-[14px]" aria-label="Pagination">
          {page > 1 && <Link href={href(page - 1)} className="px-3 py-2 border border-sg-line hover:border-sg-ink">‹</Link>}
          {Array.from({ length: pages }, (_, i) => i + 1).filter((p) => Math.abs(p - page) <= 3 || p === 1 || p === pages).map((p, i, arr) => (
            <span key={p} className="flex">{i > 0 && arr[i - 1] !== p - 1 && <span className="px-2 py-2 text-sg-gray9">…</span>}<Link href={href(p)} className={`px-3 py-2 border ${p === page ? 'bg-sg-ink text-white border-sg-ink' : 'border-sg-line hover:border-sg-ink'}`}>{p}</Link></span>
          ))}
          {page < pages && <Link href={href(page + 1)} className="px-3 py-2 border border-sg-line hover:border-sg-ink">›</Link>}
        </nav>
      )}
    </div>
  </>);
}
