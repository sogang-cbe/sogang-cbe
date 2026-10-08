import PageHero from './PageHero';
import { staticPages } from '@/content';
import { getPage } from '@/lib/data';
import type { Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { toHtml, wrapTables } from '@/lib/html';
/** 페이지 상단 이미지. 학과 사진이 준비되기 전까지는 비워 두면 그라디언트로 대체된다. */
const pageImages: Record<string, string> = {};

/** Renders an editable static page: DB row (pages table) wins, otherwise built-in content. */
/** wide: 같은 메뉴의 다른 화면이 넓은 폭을 쓰는 페이지(행정실 → 구성원 메뉴)만 넓게 연다.
 *  한 메뉴 안에서 폭이 섞이면 탭과 본문의 왼쪽 선이 페이지마다 움직인다. */
export default async function StaticPage({ locale, section, slug, children, wide }: { locale: Locale; section: string; slug: string; children?: React.ReactNode; wide?: boolean }) {
  const key = `${section}/${slug}`;
  const builtin = staticPages[key];
  const db = await getPage(key);
  const html = locale === 'en' ? (db?.content_en || builtin?.en || db?.content_ko || builtin?.ko) : (db?.content_ko || builtin?.ko);
  if (!builtin && !db && !children) notFound();
  return (
    <>
      <PageHero locale={locale} section={section} current={slug} title={locale === 'en' ? db?.title_en || undefined : db?.title_ko || undefined} narrow={!wide} />
      <article className={`${wide ? 'container-site' : 'container-narrow'} py-14`}>
        {pageImages[key] && !children && <img src={pageImages[key]} alt="" className="w-full aspect-[21/9] object-cover mb-10 border border-sg-line" />}
        {children}
        {html && <div className="prose-sg" dangerouslySetInnerHTML={{ __html: wrapTables(toHtml(html)) }} />}
      </article>
    </>
  );
}
