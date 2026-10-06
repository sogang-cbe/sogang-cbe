import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isLocale } from './lib/i18n';

const ADMIN_PATH = process.env.ADMIN_PATH || 'adm';

/** 옛 홈페이지(chemeng.sogang.ac.kr, 이젤디자인 CMS) URL → 새 사이트 경로 리다이렉트.
 *  구글 검색결과·외부 사이트(공과대학·연구실 등)에 남아 있는 옛 링크가 404가 되지 않게 한다.
 *  옛 주소 모양: /kor/index.php · /kor/sub/01_01.php · /kor/sub/05_04.php?mode=view&idx=123 */
const LEGACY_PAGES: Record<string, string> = {
  '01_01': '/about/intro', '01_02': '/about/history', '01_03': '/about/location',
  '02_01': '/faculty', '02_02': '/faculty/emeritus', '02_03': '/about/staff',
  '03_01': '/about/labs', '03_02': '/about/centers',
  '04_01': '/undergraduate/curriculum', '04_02': '/graduate/curriculum',
  '04_03': '/undergraduate/rules', '04_04': '/graduate/rules', '04_05': '/undergraduate/lab',
  '05_01': '/board/research', '05_02': '/board/seminar', '05_04': '/board/academic', '05_05': '/board/scholarship',
  '06_01': '/undergraduate/activities', '06_02': '/undergraduate/activities', '06_03': '/board/gallery',
  // 동문회 메뉴는 내렸다(2026-10-07) — 옛 동문회 주소는 홈으로 보낸다
  '07_01': '', '07_02': '', '07_03': '', '07_04': '/board/gallery', '07_05': '', '07_06': '', '07_07': '',
  '08_01': '/reservation', '08_02': '/board/grad_intro',
  'sitemap': '',
};
/** 글 하나로 들어오는 주소(?mode=view&idx=)의 옛 페이지 → 옛 게시판 코드. 이관 때 넣은 legacy_id 로 새 글을 찾는다. */
const LEGACY_BOARD_OF: Record<string, string> = {
  '05_04': 'bbs07', '06_01': 'bbs10', '05_01': 'bbs04', '04_0503': 'bbs02', '05_02': 'bbs05',
  '08_02': 'bbs14', '06_02': 'bbs15', '06_03': 'bbs10', '07_04': 'bbs13', '05_03': 'bbs06',
  '05_05': 'bbs08', '05_06': 'bbs09', '04_0502': 'bbs01', '04_0504': 'bbs03',
};
/** 메뉴에 노출하지 않는 옛 게시판(교수게시판·회의록·공문서·건의) → 글 주소로도 열지 않고 홈으로 */
const LEGACY_PRIVATE = new Set(['bbs01', 'bbs03', 'bbs06', 'bbs09']);

async function legacyRedirect(req: NextRequest): Promise<NextResponse | null> {
  const { pathname, searchParams } = req.nextUrl;
  const to = (path: string, permanent = true) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    url.search = '';
    return NextResponse.redirect(url, permanent ? 308 : 307);
  };

  const m = pathname.match(/^\/(kor|eng)(?:\/(?:sub\/)?([\w]+)\.php)?\/?$/);
  if (!m) {
    if (pathname === '/index.php') return to('/');
    return null;
  }
  const l = m[1] === 'kor' ? 'ko' : 'en';
  const page = m[2] || '';
  if (!page || page === 'index') return to(`/${l}`);

  // 글 하나로 들어온 주소: 이관 때 저장한 legacy_id(cbe:게시판:번호)로 새 글 번호를 찾는다
  const idx = searchParams.get('idx');
  const oldBoard = LEGACY_BOARD_OF[page];
  if (idx && /^\d+$/.test(idx) && oldBoard) {
    if (LEGACY_PRIVATE.has(oldBoard)) return to(`/${l}`);
    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?select=id,board&published=eq.true&legacy_id=eq.cbe:${oldBoard}:${idx}&limit=1`,
        { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` } },
      );
      const d = await r.json();
      if (Array.isArray(d) && d[0]) return to(`/${l}/board/${d[0].board}/${d[0].id}`);
    } catch { /* DB 불통이면 아래 게시판 목록으로 */ }
    // 못 찾은 글은 307(임시) — 일시적 장애로 틀린 목적지가 브라우저에 영구 캐시되지 않게
    const dest = LEGACY_PAGES[page];
    return to(dest ? `/${l}${dest}` : `/${l}`, false);
  }

  // 학번별 이수계획표(04_0102~04_0112, 04_course_2022~2025)는 한 페이지로 합쳤다
  if (/^04_(01\d\d|course_\d{4})$/.test(page)) return to(`/${l}/undergraduate/curriculum`);
  if (page === '04_0503') return to(`/${l}/board/academic`);
  if (page === '04_0502' || page === '04_0504' || page === '05_03' || page === '05_06') return to(`/${l}`);

  const dest = LEGACY_PAGES[page];
  if (dest !== undefined) return to(`/${l}${dest}`);
  return to(`/${l}`);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const legacy = await legacyRedirect(req);
  if (legacy) return legacy;

  // 1) Secret admin URL -> internal /admin (direct /admin is blocked)
  if (pathname === `/${ADMIN_PATH}` || pathname.startsWith(`/${ADMIN_PATH}/`)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(`/${ADMIN_PATH}`, '/admin');
    const res = NextResponse.rewrite(url);
    // keep Supabase session fresh for admin pages
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list: { name: string; value: string; options?: any }[]) => list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    });
    await supabase.auth.getUser();
    return res;
  }
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse('Not found', { status: 404 });
  }

  // 2) Locale routing: /ko/... or /en/... ; otherwise detect
  const first = pathname.split('/')[1];
  if (isLocale(first)) {
    // 언어 선택은 헤더의 전환 버튼(?setlang=1)을 눌렀을 때만 기억한다.
    // 링크를 타고 들어온 것만으로 기억하면 옛 영문 링크로 유입된 한국어 사용자가 영어에 갇힌다.
    if (req.nextUrl.searchParams.has('setlang')) {
      const url = req.nextUrl.clone();
      url.searchParams.delete('setlang');
      const res = NextResponse.redirect(url, 307);
      // 실제 사용자의 클릭(문서 이동)일 때만 저장한다. next/link 프리페치·RSC 요청(헤더 rsc / next-router-prefetch)이 이 주소를
      // 미리 받아 가면서 쿠키가 반대 언어로 뒤집히던 문제(2026-09-24)의 서버 쪽 방어선.
      const prefetch = req.headers.has('next-router-prefetch') || req.headers.has('rsc') || (req.headers.get('sec-fetch-dest') || 'document') !== 'document';
      if (!prefetch) res.cookies.set('sg_lang', first, { path: '/', maxAge: 60 * 60 * 24 * 365 });
      return res;
    }
    return NextResponse.next();
  }
  const cookie = req.cookies.get('sg_lang')?.value;
  const country = req.headers.get('x-vercel-ip-country') || req.geo?.country || '';
  const accept = req.headers.get('accept-language') || '';
  // 판별 순서(2026-09-24 책임자: "영어로 접속되는 일이 잦다"): ① 전환 버튼으로 저장한 쿠키 ② 브라우저 언어에 한국어가 있으면 한국어
  // ③ 한국 IP면 한국어(폰 언어를 영어로 쓰는 한국 사용자 포함) ④ 그 밖(해외 IP + 한국어 없는 브라우저)만 영어.
  // 예전에는 IP 국가를 브라우저 언어보다 먼저 봐서 VPN·해외 출장·해외로 잡히는 통신망에서는 한국어 브라우저도 영어로 갔다.
  let locale = 'ko';
  if (cookie && isLocale(cookie)) locale = cookie;
  else if (/(^|[,;\s])ko\b/i.test(accept)) locale = 'ko';
  else if (country) locale = country === 'KR' ? 'ko' : 'en';
  else if (accept) locale = 'en';
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // /ko·/en 아래 경로는 미들웨어가 할 일이 없어(언어 전환 ?setlang 제외) 뺀다 — 방문·링크 프리페치마다 함수 호출이 1회씩 더 나가던 것을 없애
    // Vercel 무료(Hobby) 한도(함수 호출 월 100만 회) 안에서 운영하기 위함(2026-09-26)
    '/((?!api|_next/static|_next/image|images|ko(?:/|$)|en(?:/|$)|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
    { source: '/(ko|en)/:path*', has: [{ type: 'query', key: 'setlang' }] },
    // 옛 사이트 리다이렉트 대상 (점(.)이 들어간 경로는 위 일반 매처에서 제외되므로 명시)
    '/kor/:path*', '/eng/:path*', '/index.php',
  ],
};
