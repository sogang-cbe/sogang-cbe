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
  // 가리킨 메뉴 하나의 하위 항목만, 그 메뉴 글자 바로 아래로 세로로 펼친다(2026-10-09 책임자 결정).
  // 메뉴 위치는 창 폭에 따라 달라지므로 가리킨 순간 실제로 재서 쓴다.
  const [mega, setMega] = useState<{ id: string; x: number } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const openAt = (id: string, el: HTMLElement | null) => {
    const bar = barRef.current;
    if (!el || !bar) { setMega({ id, x: 0 }); return; }
    // 펼침 칸도 같은 container(좌우 여백 포함) 안에 있으므로 그 여백만큼 빼야 글자끼리 맞는다
    const barLeft = bar.getBoundingClientRect().left + (parseFloat(getComputedStyle(bar).paddingLeft) || 0);
    const textLeft = el.getBoundingClientRect().left + (parseFloat(getComputedStyle(el).paddingLeft) || 0);
    setMega({ id, x: Math.max(0, Math.round(textLeft - barLeft)) });
  };
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
  useEffect(() => { setOpen(false); setMega(null); }, [pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 ${scrolled || mega || open ? 'bg-white/90 shadow-[0_2px_20px_rgba(0,0,0,.08)]' : 'bg-white/85 supports-[backdrop-filter]:bg-white/60'}`} onMouseLeave={() => setMega(null)}>
      <div className="h-1 bg-sg-cardinal" />
      <div ref={barRef} className="container-site h-[76px] flex items-center justify-between gap-6">
        <Logo locale={locale} />
        {/* 전체 메뉴는 1280px 이상에서만: 1024~1365px에서 메뉴가 넘쳐 오른쪽 언어 전환 버튼이 화면 밖으로 잘리던 문제(2026-09-25 전체 점검).
            1280~1439px은 메뉴 간격을 줄이고, 그보다 좁으면 햄버거 메뉴 */}
        <nav className="hidden xl:flex items-center h-full" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.id} href={`/${locale}${item.href}`} onMouseEnter={(e) => openAt(item.id, e.currentTarget)} onFocus={(e) => openAt(item.id, e.currentTarget)}
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
      {/* 하위 메뉴(데스크톱) — 가리킨 메뉴의 항목만 그 메뉴 글자 바로 아래에 세로로.
          메뉴 이름은 따로 적지 않는다 — 바로 위에 그 메뉴가 빨갛게 켜져 있어 두 번 적는 셈이었다(2026-10-09). */}
      <div className={`hidden xl:block absolute inset-x-0 top-full bg-white/95 backdrop-blur-xl border-t border-sg-line overflow-hidden transition-[max-height,opacity] duration-200 ${mega ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="container-site pt-6 pb-6">
          <div style={{ marginLeft: mega?.x ?? 0 }}>
          <ul>{nav.find((n) => n.id === mega?.id)?.sub?.map((sub) => <li key={sub.id}>{isExternal(sub.href)
            ? <a href={sub.href} target="_blank" rel="noreferrer" className="block py-[3px] text-[15px] text-sg-gray11 hover:text-sg-cardinal whitespace-nowrap">{label(sub, locale)} ↗</a>
            : <Link href={`/${locale}${sub.href}`} className="block py-[3px] text-[15px] text-sg-gray11 hover:text-sg-cardinal whitespace-nowrap">{label(sub, locale)}</Link>}</li>)}</ul>
          </div>
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
