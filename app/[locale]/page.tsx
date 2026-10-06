import { notFound } from 'next/navigation';
import Link from '@/components/Link';
import HeroVideo from '@/components/HeroVideo';
import NewsRows from '@/components/NewsRows';
import Reveal from '@/components/Reveal';
import { getHomeData, getLabCount } from '@/lib/data';
import { T, t, isLocale, type Locale } from '@/lib/i18n';
import { areas } from '@/content/areas';
import { assets, heroFieldVideos } from '@/content/assets';
import { youtubeThumb } from '@/lib/html';

export const revalidate = 3600; // 관리자 저장 시 즉시 갱신되므로 길게(10분 → 1시간, 2026-09-25 전송량 절감)

export default async function Home({ params }: { params: { locale: Locale } }) {
  if (!isLocale(params.locale)) notFound();   // /favicon.ico 등 언어가 아닌 한 단계 주소가 여기로 오면 500 대신 404(2026-09-25)
  const l = params.locale; const ko = l === 'ko';
  const [{ groups, gallery, banners, settings, latest }, labCount] = await Promise.all([getHomeData(), getLabCount()]);
  const DEFAULT_SECTIONS = ['hero', 'news', 'programs', 'quicklinks', 'gallery'];   // 'research'(연구센터 카드)는 기본에서 뺐다 — 관리자 '메인·설정'에서 켤 수 있다
  /* DB(site_settings.home)에 기계과 시절 설정이 그대로 남아 있을 수 있다.
     그때만 있던 구역 이름(promo·videos·intro)이 보이면 옛 설정으로 보고 기본값을 쓴다.
     관리자 화면 '메인·설정'에서 한 번 저장하면 이 보정은 더 이상 타지 않는다. */
  const stored: string[] = settings.sections || [];
  const legacySettings = ['promo', 'videos', 'intro'].some((k) => stored.includes(k));
  const sections: string[] = stored.length && !legacySettings ? stored : DEFAULT_SECTIONS;
  const LEGACY_TAGLINE = '움직이는 모든 것의 원리를 설계합니다';
  const on = (s: string) => sections.includes(s);

  const programs = [
    { k: 'ug', d: 'ugDesc', href: '/undergraduate/curriculum', tagKo: '학부', tagEn: 'Undergraduate' },
    { k: 'grad', d: 'gradDesc', href: '/graduate/admission', tagKo: '대학원', tagEn: 'Graduate', extra: ko ? `, ${labCount}개 연구실` : `, ${labCount} labs` },
    { k: 'researchNav', d: 'researchDesc', href: '/about/labs', tagKo: '연구', tagEn: 'Research' },
    { k: 'equipmentNav', d: 'equipmentDesc', href: '/equipment', tagKo: '공용장비', tagEn: 'Instruments' },
  ] as const;
  const quick = [
    { k: 'academic', href: '/board/academic', icon: 'M4 4h12l4 4v12H4zM16 4v4h4M8 13h8M8 17h5' },
    { k: 'meeting', href: '/reservation', icon: 'M3 8h18v8H3zM7 12h10' },
    { k: 'equipment', href: '/equipment', icon: 'M9 3v6l-5 9a2 2 0 002 3h12a2 2 0 002-3l-5-9V3zM9 3h6M7.5 15h9' },
    { k: 'professors', href: '/faculty', icon: 'M12 11a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0' },
    { k: 'scholarship', href: '/board/scholarship', icon: 'M12 3l9 5-9 5-9-5 9-5zM5 12v4c0 2 3 4 7 4s7-2 7-4v-4' },
    { k: 'gallery', href: '/board/gallery', icon: 'M4 5h16v14H4zM8 15l3-3 3 3 2-2 2 2' },
  ] as const;

  return (
    <>
      {on('hero') && <HeroVideo locale={l} fieldVideos={heroFieldVideos} videoUrl={settings.hero_video_url ?? assets.campusVideo} poster={settings.hero_poster_url ?? undefined} taglineKo={settings.tagline_ko === LEGACY_TAGLINE ? undefined : settings.tagline_ko} taglineEn={settings.tagline_en} news={latest} newsHref={on('news') ? '#news' : `/${l}/board/academic`} />}


      {banners.length > 0 && (
        <section className="container-site -mt-10 relative z-10 grid gap-4 md:grid-cols-3">
          {banners.slice(0, 3).map((b: any) => (
            <a key={b.id} href={b.link || '#'} className="card p-5 flex items-center gap-4">
              {b.image_url && <img src={b.image_url} alt="" className="w-16 h-16 object-cover" />}
              <div><p className="font-bold text-[16px]">{t(b, 'title', l)}</p><p className="text-[14px] text-sg-gray9">{t(b, 'subtitle', l)}</p></div>
            </a>
          ))}
        </section>
      )}

      {on('news') && (
        <section id="news" className="container-site py-20 scroll-mt-24">
          <Reveal className="mb-12"><p className="eyebrow">{T(l, 'newsTitle')}</p><h2 className="h-section mt-3">{ko ? '화공생명공학과 소식' : 'News from the department'}</h2></Reveal>
          <NewsRows locale={l} groups={groups} />
        </section>
      )}

      {/* 연구 — 학과가 운영하는 대형 연구센터 네 곳. 연구실 목록으로 이어진다. */}
      {on('research') && (
        <section id="areas" className="bg-sg-ink text-white py-24 scroll-mt-24">
          <div className="container-site">
            <Reveal className="max-w-3xl">
              <p className="eyebrow !text-white/70">{T(l, 'areasTitle')}</p>
              <h2 className="h-section mt-3 break-keep">{ko ? '네 개의 대형 연구센터' : 'Four major research centers'}</h2>
              <p className="mt-4 text-[17px] text-white/80 leading-relaxed break-keep">
                {ko
                  ? 'C1 가스 전환, 에너지 인력양성, 분자제어 화공생물공정, 첨단소재. 학과가 운영하는 네 개의 센터가 국가 과제와 기업 공동연구를 이끕니다.'
                  : 'C1 gas refinery, energy workforce training, molecular-scale control of bioprocesses, and advanced materials — four centers leading national projects and industry collaboration.'}
              </p>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2 items-stretch">
              {areas.map((a, i) => (
                <Reveal key={a.id} delay={i * 90} className="h-full">
                  <Link href={`/${l}/about/centers#${a.id}`} className="group relative flex h-full min-h-[280px] sm:min-h-[320px] flex-col overflow-hidden p-6 sm:p-8 md:p-10">
                    <div className="absolute inset-0 opacity-90" style={{ background: `linear-gradient(135deg, ${a.color} 0%, #1a1a1a 85%)` }} />
                    <div className="absolute inset-0 opacity-[.12]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '22px 22px' }} />
                    <div className="relative flex h-full flex-col">
                      <p className="text-[13px] font-semibold tracking-[0.12em] text-white/70 uppercase">{ko ? a.en : ''}</p>
                      <h3 className="mt-2 font-brand text-[1.6rem] sm:text-[1.9rem] md:text-[2.2rem] leading-tight break-keep">{ko ? a.ko : a.en}</h3>
                      <p className="mt-4 text-[15px] leading-relaxed text-white/85 break-keep">{ko ? a.descKo : a.descEn}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">{(ko ? a.keywordsKo : a.keywordsEn).map((k) => <li key={k} className="text-[12.5px] px-2.5 py-1 border border-white/20 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,.12)' }}>{k}</li>)}</ul>
                      <span className="mt-auto pt-6 inline-flex items-center gap-2 text-[14px] font-semibold">{ko ? '센터 소개' : 'About the center'} <span className="transition-transform group-hover:translate-x-1">→</span></span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120} className="mt-10">
              <Link href={`/${l}/about/labs`} className="inline-flex items-center gap-2 text-[15.5px] font-semibold text-white hover:text-white/70">
                {ko ? `연구실 ${labCount || 18}곳 전체 보기` : `See all ${labCount || 18} laboratories`} <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {on('programs') && (
        <section className="bg-sg-mist py-24">
          <div className="container-site">
            <Reveal className="mb-10"><p className="eyebrow">{T(l, 'programsTitle')}</p><h2 className="h-section mt-3">{ko ? '학부에서 대학원, 그리고 연구 현장까지' : 'From coursework to the laboratory'}</h2></Reveal>
            {/* 흰 카드 + 카디널 한 가지로 통일. 네 가지 원색 그라디언트는 학교 색 체계와 겉돌았다(2026-10-07 책임자). */}
            <div className="grid gap-px bg-sg-line border border-sg-line sm:grid-cols-2 lg:grid-cols-4">
              {programs.map((p, i) => (
                <Reveal key={p.k} delay={i * 80} className="h-full">
                  <Link href={`/${l}${p.href}`} className="group relative flex h-full flex-col bg-white p-7 md:p-8 transition-colors hover:bg-sg-mist">
                    <span aria-hidden className="absolute left-0 top-0 h-[3px] w-0 bg-sg-cardinal transition-all duration-500 group-hover:w-full" />
                    <p className="font-mono text-[12.5px] tabular-nums text-sg-gray5">{String(i + 1).padStart(2, '0')}</p>
                    <p className="mt-6 text-[12.5px] font-semibold tracking-[0.12em] text-sg-cardinal uppercase">{ko ? p.tagKo : p.tagEn}</p>
                    <h3 className="mt-1.5 font-brand text-[1.7rem] leading-tight break-keep">{T(l, p.k)}</h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-sg-gray11 break-keep">{T(l, p.d)}{(p as any).extra || ''}</p>
                    <span className="mt-auto pt-7 inline-flex items-center gap-2 text-[14px] font-semibold text-sg-ink group-hover:text-sg-cardinal transition-colors">
                      {ko ? '바로가기' : 'Open'} <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {on('quicklinks') && (
        <section className="container-site py-20">
          <Reveal className="mb-8 flex items-end justify-between gap-4"><div><p className="eyebrow">{T(l, 'quick')}</p><h2 className="h-section mt-3">{ko ? '자주 찾는 메뉴' : 'Quick links'}</h2></div></Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
            {quick.map((q, i) => (
              <Reveal key={q.k} delay={i * 60} className="h-full">
                <Link href={`/${l}${q.href}`} className="card group h-full flex flex-col items-center justify-start p-6 text-center hover:border-sg-cardinal">
                  <span className="mx-auto w-16 h-16 grid place-items-center rounded-full bg-sg-mist text-sg-cardinal group-hover:bg-sg-cardinal group-hover:text-white transition-colors">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={q.icon} /></svg>
                  </span>
                  <p className="mt-4 font-bold text-[15.5px]">{T(l, q.k)}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {on('gallery') && gallery.length > 0 && (
        <section className="bg-sg-ink text-white py-24">
          <div className="container-site">
            <div className="flex items-end justify-between mb-10">
              <div><p className="eyebrow !text-white/70">{T(l, 'galleryTitle')}</p><h2 className="h-section mt-3">{ko ? '학과의 순간들' : 'Moments'}</h2></div>
              <Link href={`/${l}/board/gallery`} className="text-[14px] font-semibold text-white/70 hover:text-white">{T(l, 'more')} +</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.slice(0, 8).map((g: any, i: number) => (
                <Link key={g.id} href={`/${l}/board/gallery/${g.id}`} className={`group relative overflow-hidden bg-white/5 ${i === 0 ? 'col-span-2 row-span-2' : ''} aspect-square`}>
                  {/* 사진이 있으면 사진, 없으면 제목을 보여 주는 타일 (정사각형 칸이라 16:10 자동표지를 쓰면 글자가 잘린다) */}
                  {(g.thumbnail_url || g.images?.[0]?.url) ? (<>
                    <img src={g.thumbnail_url || g.images[0].url} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="absolute left-3 bottom-3 right-3 text-[13.5px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{t(g, 'title', l)}</p>
                  </>) : (
                    <span className="absolute inset-0 flex items-end p-4 transition-colors" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.03))' }}>
                      <span className={`font-semibold leading-snug break-keep text-white/85 group-hover:text-white ${i === 0 ? 'text-[17px] line-clamp-4' : 'text-[13px] line-clamp-3'}`}>{t(g, 'title', l)}</span>
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
