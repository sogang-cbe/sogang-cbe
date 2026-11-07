import Link from '@/components/Link';
import { fmtDate } from '@/components/PostCard';

type Item = { id: number; title_ko: string; title_en: string | null; created_at: string; img: string };

/** 연구성과 게시판 위 「최근 연구성과」 — 대표 그림 카드가 천천히 흘러간다(2026-11-07).
 *  최근 3개월 글. 같은 목록을 두 번 이어 붙여 끊김 없이 돌고, 마우스를 올리거나 키보드로 들어오면 멈춘다.
 *  움직임 줄이기 설정이면 멈춘 채 가로 스크롤로 본다. 두 번째 묶음은 화면낭독기·탭 이동에서 숨긴다. */
export default function ResearchStrip({ items, locale }: { items: Item[]; locale: 'ko' | 'en' }) {
  if (items.length < 2) return null;
  const ko = locale === 'ko';
  // 최근 3개월이라 글이 적을 수 있다 — 한 묶음이 띠 너비보다 짧으면 이어 붙일 때 빈칸이 보이므로 6장이 될 때까지 반복한다
  const base: Item[] = []; while (base.length < 6) base.push(...items);
  const card = (p: Item, dup: boolean, key: string) => (
    <Link key={key} href={`/${locale}/board/research/${p.id}`} tabIndex={dup ? -1 : undefined} aria-hidden={dup || undefined}
      className="group block w-[220px] sm:w-[270px] shrink-0">
      <div className="aspect-[4/3] overflow-hidden border border-sg-line bg-sg-mist">
        <img src={p.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
      </div>
      <p className="mt-3 font-mono text-[12px] text-sg-gray9">{fmtDate(p.created_at)}</p>
      <p className="mt-1 text-[14.5px] font-semibold leading-snug line-clamp-2 break-keep group-hover:text-sg-cardinal">{(!ko && p.title_en) || p.title_ko}</p>
    </Link>
  );
  return (
    <section className="mb-12" aria-label={ko ? '최근 연구성과' : 'Recent research highlights'}>
      <div className="flex items-end justify-between mb-5">
        <h2 className="font-brand text-[1.35rem] md:text-[1.55rem] break-keep">{ko ? '최근 연구성과' : 'Recent highlights'}</h2>
        <p className="text-[12.5px] text-sg-gray9 hidden sm:block">{ko ? '마우스를 올리면 멈춥니다' : 'Hover to pause'}</p>
      </div>
      <div className="strip-wrap overflow-hidden" style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)', maskImage: 'linear-gradient(90deg, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)' }}>
        <div className="strip-track flex w-max gap-6" style={{ animationDuration: `${Math.max(36, base.length * 6)}s` }}>
          {base.map((p, i) => card(p, i >= items.length, `a${i}`))}
          {base.map((p, i) => card(p, true, `d${i}`))}
        </div>
      </div>
    </section>
  );
}
