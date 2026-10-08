import Link from '@/components/Link';
import { nav, label, isExternal } from '@/lib/nav';
import { T, type Locale } from '@/lib/i18n';
import { sectionHero } from '@/content/assets';
import HeroDecor from './HeroDecor';
import TabScroll from './TabScroll';

/** 상단 제목·경로·탭.
 *  narrow: 본문이 좁은 컨테이너(1088px)를 쓰는 페이지에서는 제목·경로·탭도 같은 폭으로 맞춘다.
 *  (폭이 어긋나면 제목과 본문의 왼쪽 선이 안 맞아 눈에 거슬린다 — 2026-10-09 책임자 지적) */
export default function PageHero({ locale, section, current, title, image, narrow }: { locale: Locale; section: string; current?: string; title?: string; image?: string; narrow?: boolean }) {
  const box = narrow ? 'container-narrow' : 'container-site';
  const sec = nav.find((n) => n.id === section);
  const cur = sec?.sub?.find((s) => s.id === current);
  const heading = title || (cur ? label(cur, locale) : sec ? label(sec, locale) : '');
  const img = image || sectionHero[section] || sectionHero.default;
  return (
    <>
      <section className="relative bg-sg-ink text-white pt-[80px] overflow-hidden">
        {/* 배경 — 사진이 없을 때는 한 겹 그라디언트 대신 세 겹으로 깊이를 준다(2026-10-09).
            ① 왼쪽 잉크 → 오른쪽 카디널 대각 바탕 ② 오른쪽 위에서 번지는 빛 ③ 공정도·격자(HeroDecor)
            ④ 제목이 놓이는 왼쪽을 덮는 어두운 막 — 글자 대비를 확보한다. */}
        <div className="absolute inset-0">
          {img ? (<>
            <img src={img} alt="" className="w-full h-full object-cover kenburns" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(18,18,18,.90) 0%, rgba(18,18,18,.60) 46%, rgba(123,26,32,.42) 100%)' }} />
          </>) : (<>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(104deg, #121212 0%, #2b0b0e 28%, #641519 62%, #96222b 100%)' }} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(72% 140% at 84% 4%, rgba(216,72,80,.40) 0%, rgba(175,39,47,.15) 44%, transparent 72%)' }} />
          </>)}
          <HeroDecor />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(16,16,16,.62) 0%, rgba(16,16,16,.26) 44%, rgba(16,16,16,0) 74%)' }} />
          <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, rgba(14,14,14,.45), transparent)' }} />
        </div>
        <div className={`${box} relative py-20 md:py-24`}>
          <p className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] text-white/70 uppercase">
            <span aria-hidden className="w-7 h-px bg-white/45" />
            {sec ? label(sec, locale) : locale === 'ko' ? '화공생명공학과' : 'Sogang CBE'}
          </p>
          <h1 className="h-display mt-3.5 tracking-[-0.015em]">{heading}</h1>
        </div>
        {/* 아래 모서리 마감 — 흰 경로 줄과 만나는 자리에 가는 카디널 선 */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: 'linear-gradient(90deg,#af272f 0%,#d8484f 38%,rgba(216,72,79,0) 86%)' }} />
      </section>
      <div className="border-b border-sg-line bg-white">
        <div className={`${box} flex items-center gap-2 py-3 text-[14px] text-sg-gray9`}>
          <Link href={`/${locale}`} className="hover:text-sg-cardinal">{T(locale, 'home')}</Link>
          {sec && <><span>›</span><span>{label(sec, locale)}</span></>}
          {cur && <><span>›</span><span className="text-sg-ink font-semibold">{label(cur, locale)}</span></>}
        </div>
      </div>
      {sec?.sub && (
        <div className="border-b border-sg-line bg-white sticky top-[80px] z-30">
          <TabScroll className={`${box} flex gap-1 overflow-x-auto no-scrollbar`}>
            {sec.sub.map((s) => isExternal(s.href) ? (
              <a key={s.id} href={s.href} target="_blank" rel="noreferrer" className="whitespace-nowrap px-4 py-3.5 text-[15px] border-b-[3px] -mb-px border-transparent text-sg-gray11 hover:text-sg-ink">{label(s, locale)} ↗</a>
            ) : (
              <Link key={s.id} href={`/${locale}${s.href}`} aria-current={s.id === current ? 'page' : undefined} className={`whitespace-nowrap px-4 py-3.5 text-[15px] border-b-[3px] -mb-px ${s.id === current ? 'border-sg-cardinal text-sg-cardinal font-bold' : 'border-transparent text-sg-gray11 hover:text-sg-ink'}`}>{label(s, locale)}</Link>
            ))}
          </TabScroll>
        </div>
      )}
    </>
  );
}
