import PageHero from './PageHero';
import { staticPages } from '@/content';
import { getPage } from '@/lib/data';
import type { Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { toHtml, wrapTables } from '@/lib/html';
/** 페이지 상단 이미지. 학과 사진이 준비되기 전까지는 비워 두면 그라디언트로 대체된다. */
const pageImages: Record<string, string> = {};

/** Renders an editable static page: DB row (pages table) wins, otherwise built-in content. */
/** wide: 글이 아니라 표가 중심인 페이지(행정실 등)는 교수진 목록과 같은 폭을 쓴다.
 *  기본값(container-narrow)은 긴 글의 한 줄 길이를 읽기 좋게 잡아 두기 위한 것이라 그대로 둔다. */
export default async function StaticPage({ locale, section, slug, children, wide }: { locale: Locale; section: string; slug: string; children?: React.ReactNode; wide?: boolean }) {
  const key = `${section}/${slug}`;
  const builtin = staticPages[key];
  const db = await getPage(key);
  const html = locale === 'en' ? (db?.content_en || builtin?.en || db?.content_ko || builtin?.ko) : (db?.content_ko || builtin?.ko);
  if (!builtin && !db && !children) notFound();
  return (
    <>
      <PageHero locale={locale} section={section} current={slug} title={locale === 'en' ? db?.title_en || undefined : db?.title_ko || undefined} />
      <article className={`${wide ? 'container-site' : 'container-narrow'} py-14`}>
        {pageImages[key] && !children && <img src={pageImages[key]} alt="" className="w-full aspect-[21/9] object-cover mb-10 border border-sg-line" />}
        {children}
        {html && <div className="prose-sg" dangerouslySetInnerHTML={{ __html: wrapTables(toHtml(html)) }} />}
      </article>
    </>
  );
}
