'use client';
import Link from '@/components/Link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { nav, label, isExternal } from '@/lib/nav';
import type { Locale } from '@/lib/i18n';


export default function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // 하위 메뉴(데스크톱) — 여덟 칸을 한 번에 펼치되 각 칸을 자기 메뉴 글자 아래에 세운다(2026-10-09 책임자 결정, A안).
  // 평소에는 작은 글씨라 좁은 칸끼리도 부딪히지 않고, 가리킨 칸만 흰 카드로 떠오르며 커져 읽기 쉽다.
  // 메뉴 위치는 창 폭·글꼴에 따라 달라지므로 실제로 재서 쓴다.
  const [mega, setMega] = useState(false);
  const [hot, setHot] = useState<string | null>(null);
  const [xs, setXs] = useState<Record<string, number>>({});
  const barRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const measure = () => {
    const bar = barRef.current, nv = navRef.current;
    if (!bar || !nv) return;
    // 칸은 position:absolute 라 기준이 container 의 '패딩 바깥' 모서리다 — 좌우 여백을 빼면 그만큼 왼쪽으로 밀린다.
    // 머리글 줄과 펼침 줄이 같은 container 를 쓰므로 모서리끼리 그대로 빼면 맞는다.
    const barLeft = bar.getBoundingClientRect().left;
    const next: Record<string, number> = {};
    nav.forEach((item, i) => {
      const el = nv.children[i] as HTMLElement | undefined;
      if (!el) return;
      next[item.id] = Math.max(0, Math.round(el.getBoundingClientRect().left + (parseFloat(getComputedStyle(el).paddingLeft) || 0) - barLeft));
    });
    setXs(next);
  };
  useEffect(() => { measure(); window.addEventListener('resize', measure); return () => window.removeEventListener('resize', measure); }, [locale]);
  const openMega = (id: string) => { if (!mega) measure(); setMega(true); setHot(id); };
  const [mobile, setMobile] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const other: Locale = locale === 'ko' ? 'en' : 'ko';
  // ?setlang=1: 미들웨어가 이 표시가 있을 때만 언어 선택을 쿠키로 기억한다.
  // 클릭 시점에 현재 쿼리(페이지·검색어 등)를 보존해 언어를 바꿔도 보던 목록이 유지되게 한다.
  // (useSearchParams는 SSG 페이지에서 Suspense 경계를 요구하므로 쓰지 않는다)
  const switchHref = pathname.replace(/^\/(ko|en)/, `/${other}`) + '?setlang=1';
  const switchLang = (e: React.MouseEvent) => {
    e.preventDefault();
    const q = new URLSearchParams(window.location.search);
    q.set('setlang', '1');
    window.location.href = pathname.replace(/^\/(ko|en)/, `/${other}`) + `?${q.toString()}`;
  };
  useEffect(() => { const f = () => setScrolled(window.scrollY > 10); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { setOpen(false); setMega(false); setHot(null); }, [pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 ${scrolled || mega || open ? 'bg-white/90 shadow-[0_2px_20px_rgba(0,0,0,.08)]' : 'bg-white/85 supports-[backdrop-filter]:bg-white/60'}`} onMouseLeave={() => { setMega(false); setHot(null); }}>
      <div className="h-1 bg-sg-cardinal" />
      <div ref={barRef} className="container-site h-[76px] flex items-center justify-between gap-6">
        <Logo locale={locale} />
        {/* 전체 메뉴는 1280px 이상에서만: 1024~1365px에서 메뉴가 넘쳐 오른쪽 언어 전환 버튼이 화면 밖으로 잘리던 문제(2026-09-25 전체 점검).
            1280~1439px은 메뉴 간격을 줄이고, 그보다 좁으면 햄버거 메뉴 */}
        <nav ref={navRef} className="hidden xl:flex items-center h-full" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.id} href={`/${locale}${item.href}`} onMouseEnter={() => openMega(item.id)} onFocus={() => openMega(item.id)}
              className="relative px-2.5 min-[1536px]:px-4 h-full flex items-center text-[16px] min-[1536px]:text-[16.5px] font-semibold text-sg-ink hover:text-sg-cardinal after:absolute after:left-2.5 after:right-2.5 min-[1536px]:after:left-4 min-[1536px]:after:right-4 after:bottom-0 after:h-[3px] after:bg-sg-cardinal after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100">
              {label(item, locale)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {/* 일반 <a>여야 한다 — next/link로 두면 화면에 보이는 순간 /xx?setlang=1 을 프리페치하고, 미들웨어가 그것을 '언어 선택'으로 받아
              쿠키를 반대 언어로 바꿔 버린다(2026-09-24 발견: 한국어 페이지를 보기만 해도 다음 접속이 영어로 열리던 원인) */}
          <a href={switchHref} onClick={switchLang} className="px-2.5 py-2 text-[13px] font-semibold tracking-wide text-sg-gray11 hover:text-sg-cardinal transition-colors" aria-label={other === 'en' ? 'Switch to English' : '한국어로 전환'}>
            {other === 'en' ? 'ENG' : '한국어'}
          </a>
          <button onClick={() => setOpen(!open)} className="xl:hidden p-2 text-sg-ink" aria-label="Menu" aria-expanded={open}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}</svg>
          </button>
        </div>
      </div>
      {/* 하위 메뉴(데스크톱) — 여덟 칸을 한 번에, 각 칸은 자기 메뉴 글자 아래. 가리킨 칸만 떠올라 커진다. */}
      <div className={`hidden xl:block absolute inset-x-0 top-full bg-white/95 backdrop-blur-xl border-t border-sg-line overflow-hidden transition-[max-height,opacity] duration-200 ${mega ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="container-site relative h-[268px]">
          {nav.map((item) => {
            const up = hot === item.id;
            return (
              <div key={item.id} onMouseEnter={() => setHot(item.id)}
                className={up ? 'absolute z-20 bg-white border border-sg-line shadow-[0_14px_34px_-14px_rgba(26,26,26,.3)] px-4 pt-3.5 pb-4' : 'absolute z-10'}
                style={{ left: (xs[item.id] ?? 0) - (up ? 16 : 0), top: up ? 14 : 28 }}>
                <p className="font-bold whitespace-nowrap" style={{ fontSize: up ? 15.5 : 12.5, color: up ? '#af272f' : 'rgba(175,39,47,.72)' }}>{label(item, locale)}</p>
                <ul className="mt-2.5">{item.sub?.map((sub) => (
                  <li key={sub.id} style={{ fontSize: up ? 15 : 12.5, lineHeight: up ? 1.95 : 1.85 }}>{isExternal(sub.href)
                    ? <a href={sub.href} target="_blank" rel="noreferrer" className="block whitespace-nowrap hover:text-sg-cardinal" style={{ color: up ? '#2b2b2b' : '#8b8d8f' }}>{label(sub, locale)} ↗</a>
                    : <Link href={`/${locale}${sub.href}`} className="block whitespace-nowrap hover:text-sg-cardinal" style={{ color: up ? '#2b2b2b' : '#8b8d8f' }}>{label(sub, locale)}</Link>}</li>
                ))}</ul>
              </div>
            );
          })}
        </div>
      </div>
      {open && (
        <div className="xl:hidden bg-white/95 backdrop-blur-xl border-t border-sg-line max-h-[calc(100vh-80px)] overflow-y-auto">
          {nav.map((item) => (
            <div key={item.id} className="border-b border-sg-line">
              <button className="w-full flex items-center justify-between px-5 py-4 text-left text-[16px] font-semibold" onClick={() => setMobile(mobile === item.id ? null : item.id)} aria-expanded={mobile === item.id}>
                {label(item, locale)}<span className={`text-sg-gray9 transition-transform ${mobile === item.id ? 'rotate-45' : ''}`}>+</span>
              </button>
              {mobile === item.id && item.sub && <ul className="bg-sg-mist pb-2">{item.sub.map((s) => <li key={s.id}>{isExternal(s.href)
                ? <a href={s.href} target="_blank" rel="noreferrer" className="block px-8 py-2.5 text-[15px]">{label(s, locale)} ↗</a>
                : <Link href={`/${locale}${s.href}`} className="block px-8 py-2.5 text-[15px]">{label(s, locale)}</Link>}</li>)}</ul>}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
