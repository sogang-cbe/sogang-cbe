import PageHero from '@/components/PageHero';
import Link from '@/components/Link';
import MemberLogin from '@/components/MemberLogin';
import { currentFaculty } from '@/lib/faculty-self';
import { serviceClient } from '@/lib/vault';
import type { Locale } from '@/lib/i18n';
import { signOutMy } from './actions';

export const dynamic = 'force-dynamic';   // 로그인 상태에 따라 내용이 달라진다

/** 교수 본인 편집 첫 화면(2026-11): 학교 구글 계정으로 로그인 → 내 교수진 페이지 수정 · 연구성과 글 쓰기 */
export default async function MyPage({ params, searchParams }: { params: { locale: Locale }; searchParams: { login?: string; saved?: string } }) {
  const l = params.locale; const ko = l === 'ko';
  const m = await currentFaculty();
  const box = 'border border-sg-line bg-white p-6 md:p-8';

  const shell = (children: React.ReactNode) => (<>
    <PageHero locale={l} section="faculty" title={ko ? '교수 페이지 관리' : 'Faculty sign-in'} narrow />
    <div className="container-narrow py-12">{children}</div>
  </>);

  if (!m) return shell(
    <div className={`${box} max-w-2xl`}>
      {searchParams.login === 'domain' && <p className="mb-5 border-l-4 border-sg-cardinal bg-sg-mist px-4 py-3 text-[14px] break-keep">{ko ? '서강대학교 계정(@sogang.ac.kr · @u.sogang.ac.kr)으로만 로그인할 수 있습니다.' : 'Only Sogang accounts (@sogang.ac.kr, @u.sogang.ac.kr) can sign in.'}</p>}
      {searchParams.login === 'failed' && <p className="mb-5 border-l-4 border-sg-cardinal bg-sg-mist px-4 py-3 text-[14px] break-keep">{ko ? '로그인이 완료되지 않았습니다. 다시 시도해 주세요.' : 'Sign-in did not complete. Please try again.'}</p>}
      <h2 className="font-brand text-[1.4rem]">{ko ? '교수님 로그인' : 'Faculty sign-in'}</h2>
      <p className="mt-3 text-[15px] text-sg-gray11 break-keep leading-relaxed">
        {ko ? '학교 구글 계정으로 로그인하시면 교수님 소개 페이지(사진·약력·연구 소개·주요 논문·연구실 정보)를 직접 고치고, 학과 게시판 「연구성과」에 글을 올리실 수 있습니다. 별도 아이디·비밀번호는 없습니다.'
            : 'Sign in with your Sogang Google account to edit your faculty profile and post to Research Highlights.'}
      </p>
      <div className="mt-6"><MemberLogin next={`/${l}/my`} locale={l} /></div>
    </div>,
  );

  if (!m.faculty) return shell(
    <div className={`${box} max-w-2xl`}>
      <h2 className="font-brand text-[1.4rem]">{ko ? '교수진 명단에서 찾을 수 없습니다' : 'Not on the faculty list'}</h2>
      <p className="mt-3 text-[15px] text-sg-gray11 break-keep leading-relaxed">
        {ko ? `${m.email} 으로 로그인했습니다. 이 화면은 교수진 페이지에 등록된 메일로 로그인한 교수님만 쓸 수 있습니다. 메일이 다르게 등록되어 있다면 학과 사무실(02-705-8474)에 알려 주세요.`
            : `Signed in as ${m.email}. This page is for faculty members whose email is on the faculty list.`}
      </p>
      <form action={signOutMy} className="mt-6"><input type="hidden" name="locale" value={l} /><button className="btn-ghost">{ko ? '로그아웃' : 'Sign out'}</button></form>
    </div>,
  );

  const f = m.faculty;
  const { data: posts } = await serviceClient().from('posts').select('id,title_ko,created_at')
    .eq('board', 'research').eq('owner_email', m.email).order('created_at', { ascending: false }).limit(50);
  const saved = { profile: '교수 페이지를 저장했습니다. 사이트에 바로 반영됩니다.', post: '연구성과 글을 저장했습니다.', deleted: '글을 지웠습니다(휴지통에 30일 보관).' }[searchParams.saved || ''];

  return shell(<>
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
      <div>
        <p className="eyebrow">{ko ? '로그인' : 'Signed in'}</p>
        <h2 className="mt-1 font-brand text-[1.7rem] break-keep">{f.name_ko} <span className="text-[1rem] text-sg-gray9 font-sans font-medium">{f.title_ko}</span></h2>
        <p className="mt-1 text-[13.5px] text-sg-gray9">{m.email}</p>
      </div>
      <form action={signOutMy}><input type="hidden" name="locale" value={l} /><button className="btn-ghost !px-4 !py-2">{ko ? '로그아웃' : 'Sign out'}</button></form>
    </div>
    {saved && <p className="mb-6 border-l-4 border-sg-cardinal bg-white px-4 py-3 text-[14px] break-keep">{saved}</p>}

    <div className="grid gap-5 md:grid-cols-2">
      <section className={box}>
        <h3 className="font-brand text-[1.25rem]">{ko ? '내 교수진 페이지' : 'My profile'}</h3>
        <p className="mt-2 text-[14px] text-sg-gray11 break-keep leading-relaxed">사진, 약력, 연구 소개, 주요 논문, 연구실 이름·홈페이지, Google Scholar, 연구분야 키워드를 고칠 수 있습니다. 국문만 고치시면 영문 페이지는 자동으로 번역됩니다.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/${l}/my/profile`} className="btn-primary !px-5 !py-2.5">{ko ? '수정하기' : 'Edit'}</Link>
          <Link href={`/${l}/faculty/${f.id}`} className="btn-ghost !px-5 !py-2.5">{ko ? '내 페이지 보기' : 'View'} ↗</Link>
        </div>
      </section>
      <section className={box}>
        <h3 className="font-brand text-[1.25rem]">{ko ? '연구성과 글' : 'Research highlights'}</h3>
        <p className="mt-2 text-[14px] text-sg-gray11 break-keep leading-relaxed">학과 게시판 「연구성과」에 연구실 소식(논문 게재, 수상, 언론 보도 등)을 올립니다. 연구 메뉴의 연구성과에도 함께 보입니다.</p>
        <div className="mt-5"><Link href={`/${l}/my/posts/new`} className="btn-primary !px-5 !py-2.5">+ {ko ? '새 글 쓰기' : 'New post'}</Link></div>
      </section>
    </div>

    <section className="mt-10">
      <h3 className="sec-h">{ko ? '내가 올린 연구성과' : 'My posts'}</h3>
      {(posts || []).length === 0
        ? <p className="mt-4 text-[14px] text-sg-gray9">{ko ? '아직 올린 글이 없습니다.' : 'No posts yet.'}</p>
        : <ul className="mt-2 divide-y divide-sg-line border-b border-sg-line">
            {(posts || []).map((p: any) => (
              <li key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3.5">
                <span className="font-mono text-[12.5px] text-sg-gray9 shrink-0">{(p.created_at || '').slice(0, 10)}</span>
                <Link href={`/${l}/board/research/${p.id}`} className="flex-1 text-[15px] hover:text-sg-cardinal break-keep">{p.title_ko}</Link>
                <Link href={`/${l}/my/posts/${p.id}`} className="text-[13px] text-sg-cardinal underline underline-offset-4 shrink-0">{ko ? '수정' : 'Edit'}</Link>
              </li>
            ))}
          </ul>}
    </section>
  </>);
}
