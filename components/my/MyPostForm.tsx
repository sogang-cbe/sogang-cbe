'use client';
import RichEditor from '@/components/admin/RichEditor';
import SubmitButton from '@/components/admin/SubmitButton';
import { saveMyPost, deleteMyPost } from '@/app/[locale]/my/actions';

/** 연구성과 글 — 교수님이 쓰는 간단한 폼. 표지 사진은 본문의 첫 사진, 영문은 자동 번역 */
export default function MyPostForm({ post, locale }: { post?: any; locale: 'ko' | 'en' }) {
  const sec = 'border border-sg-line bg-white p-5 md:p-7';
  return (
    <div className="space-y-6 max-w-5xl">
      <form action={saveMyPost} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        {post?.id && <input type="hidden" name="id" value={post.id} />}
        <section className={`${sec} grid gap-4 md:grid-cols-[1fr_180px]`}>
          <label className="block text-[13px]">제목 *<input name="title_ko" required defaultValue={post?.title_ko || ''} placeholder="예: 김OO 학생 논문 Nature Communications 게재" className="input mt-1" /></label>
          <label className="block text-[13px]">날짜<input name="created_at" type="date" defaultValue={post?.created_at?.slice(0, 10)} className="input mt-1" /></label>
        </section>
        <section className={sec}>
          <p className="text-[13px] mb-2">본문</p>
          <RichEditor name="content_ko" defaultValue={post?.content_ko || ''} folder="posts" minHeight={360} />
          <p className="mt-2 text-[12px] text-sg-steel break-keep">본문의 첫 사진이 목록의 표지가 됩니다. 영문 게시판에는 자동 번역되어 올라갑니다.</p>
        </section>
        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton className="btn-primary !px-6 !py-3">{post ? '저장' : '올리기'}</SubmitButton>
          <a href={`/${locale}/my`} className="text-[14px] text-sg-gray11 underline underline-offset-4">취소</a>
        </div>
      </form>
      {post?.id && (
        <form action={deleteMyPost} onSubmit={(e) => { if (!confirm('이 글을 지울까요? 휴지통에 30일 보관됩니다.')) e.preventDefault(); }} className="pt-4 border-t border-sg-line">
          <input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={post.id} />
          <button className="text-[13px] text-sg-cardinal underline underline-offset-4">이 글 지우기</button>
        </form>
      )}
    </div>
  );
}
