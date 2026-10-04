import { notFound } from 'next/navigation';
import Link from '@/components/Link';
import HeroVideo from '@/components/HeroVideo';
import NewsRows from '@/components/NewsRows';
import Reveal from '@/components/Reveal';
import { getHomeData, getLabCount } from '@/lib/data';
import { T, t, isLocale, type Locale } from '@/lib/i18n';
import { areas } from '@/content/areas';
import { assets, heroFieldVideos } from '@/content/assets';
import { coverFor } from '@/lib/placeholder';
import { youtubeThumb } from '@/lib/html';

export const revalidate = 3600; // 관리자 저장 시 즉시 갱신되므로 길게(10분 → 1시간, 2026-09-25 전송량 절감)

export default async function Home({ params }: { params: { locale: Locale } }) {
  if (!isLocale(params.locale)) notFound();   // /favicon.ico 등 언어가 아닌 한 단계 주소가 여기로 오면 500 대신 404(2026-09-25)
  const l = params.locale; const ko = l === 'ko';
  const [{ groups, gallery, banners, settings, latest }, labCount] = await Promise.all([getHomeData(), getLabCount()]);
  const sections: string[] = settings.sections || ['hero', 'intro', 'news', 'programs', 'quicklinks', 'gallery'];
  const on = (s: string) => sections.includes(s);

  const programs = [
    { k: 'ug', d: 'ugDesc', href: '/undergraduate/curriculum', tagKo: '학부', tagEn: 'Undergraduate', tint: 'var(--sg-cardinal)' },
    { k: 'grad', d: 'gradDesc', href: '/graduate/admission', tagKo: '대학원', tagEn: 'Graduate', tint: 'var(--sg-blue)', extra: ko ? `, ${labCount}개 연구실` : `, ${labCount} labs` },
    { k: 'researchNav', d: 'researchDesc', href: '/about/labs', tagKo: '연구', tagEn: 'Research', tint: 'var(--sg-orange)' },
    { k: 'equipmentNav', d: 'equipmentDesc', href: '/equipment', tagKo: '공용장비', tagEn: 'Instruments', tint: 'var(--sg-teal)' },
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
      {on('hero') && <HeroVideo locale={l} fieldVideos={heroFieldVideos} videoUrl={settings.hero_video_url ?? assets.campusVideo} poster={settings.hero_poster_url ?? undefined} taglineKo={settings.tagline_ko} taglineEn={settings.tagline_en} news={latest} newsHref={on('news') ? '#news' : `/${l}/board/academic`} />}


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

      {on('intro') && (
        <section id="areas" className="container-site pt-24 pb-10">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{T(l, 'areasTitle')}</p>
            <h2 className="h-section mt-3">{ko ? '분자에서 공정까지, 네 개의 연구센터' : 'From molecules to processes — four research centers'}</h2>
            <p className="mt-4 text-[17px] text-sg-gray11 leading-relaxed">{ko ? '화공생명공학과는 C1 가스 전환, 에너지 인력양성, 분자제어 화공생물공정, 첨단소재 네 개의 대형 연구센터를 운영합니다. 18개 연구실이 촉매·분리막·고분자·전기화학·나노바이오를 아우릅니다.' : 'The department runs four major research centers — C1 gas refinery, energy workforce, molecular-scale bioprocess control, and advanced materials — across 18 laboratories.'}</p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 items-stretch">
            {areas.map((a, i) => (
              <Reveal key={a.id} delay={i * 90} className="h-full">
                <Link href={`/${l}/about/centers#${a.id}`} className="group relative flex h-full min-h-[300px] sm:min-h-[340px] flex-col overflow-hidden bg-sg-ink text-white p-6 sm:p-8 md:p-10">
                  <div className="absolute inset-0 opacity-90" style={{ background: `linear-gradient(135deg, ${a.color} 0%, #1a1a1a 85%)` }} />
                  <div className="absolute inset-0 opacity-[.12]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '22px 22px' }} />
                  <div className="relative flex h-full flex-col">
                    <p className="text-[13px] font-semibold tracking-[0.12em] text-white/70 uppercase">{ko ? a.en : ''}</p>
                    <h3 className="mt-2 font-brand text-[1.6rem] sm:text-[1.9rem] md:text-[2.3rem] leading-tight break-keep">{ko ? a.ko : a.en}</h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/85">{ko ? a.descKo : a.descEn}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">{(ko ? a.keywordsKo : a.keywordsEn).map((k) => <li key={k} className="text-[12.5px] px-2.5 py-1 bg-white/[.12] border border-white/20 rounded-full">{k}</li>)}</ul>
                    <span className="mt-auto pt-6 inline-flex items-center gap-2 text-[14px] font-semibold">{ko ? '센터 소개' : 'About the center'} <span className="transition-transform group-hover:translate-x-1">→</span></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {on('news') && (
        <section id="news" className="container-site py-20 scroll-mt-24">
          <Reveal className="mb-12"><p className="eyebrow">{T(l, 'newsTitle')}</p><h2 className="h-section mt-3">{ko ? '화공생명공학과 소식' : 'News from the department'}</h2></Reveal>
          <NewsRows locale={l} groups={groups} />
        </section>
      )}

      {on('programs') && (
        <section className="bg-sg-mist py-24">
          <div className="container-site">
            <Reveal className="mb-10"><p className="eyebrow">{T(l, 'programsTitle')}</p><h2 className="h-section mt-3">{ko ? '학부에서 대학원, 그리고 연구 현장까지' : 'From coursework to the laboratory'}</h2></Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {programs.map((p, i) => (
                <Reveal key={p.k} delay={i * 80}>
                  <Link href={`/${l}${p.href}`} className="group relative block aspect-[3/4] overflow-hidden bg-sg-ink text-white">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ background: `linear-gradient(150deg, ${p.tint} 0%, #1a1a1a 78%)` }} />
                    <div className="absolute inset-0 opacity-[.10]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-sg-ink via-[rgba(26,26,26,0.25)] to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-[12.5px] font-semibold tracking-[0.12em] text-white/70 uppercase">{ko ? p.tagKo : p.tagEn}</p>
                      <h3 className="mt-1 font-brand text-[1.8rem] leading-tight">{T(l, p.k)}</h3>
                      <p className="mt-2 text-[14px] text-white/80 leading-relaxed">{T(l, p.d)}{(p as any).extra || ''}</p>
                      <span className="mt-4 inline-flex w-10 h-10 items-center justify-center bg-sg-cardinal group-hover:bg-white group-hover:text-sg-cardinal transition-colors">→</span>
                    </div>
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
                  <img src={g.thumbnail_url || g.images?.[0]?.url || coverFor('gallery', t(g, 'title', l), g.id)} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="absolute left-3 bottom-3 right-3 text-[13.5px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{t(g, 'title', l)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
