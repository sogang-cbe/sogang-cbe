'use client';
import { useState } from 'react';
import Uploader from '@/components/admin/Uploader';
import RichEditor from '@/components/admin/RichEditor';
import SubmitButton from '@/components/admin/SubmitButton';
import { saveMyPost, deleteMyPost } from '@/app/[locale]/my/actions';

/** 연구성과 글 — 교수님이 쓰는 간단한 폼. 표지 사진은 본문의 첫 사진, 영문은 자동 번역 */
export default function MyPostForm({ post, locale }: { post?: any; locale: 'ko' | 'en' }) {
  const sec = 'border border-sg-line bg-white p-5 md:p-7';
  const [thumb, setThumb] = useState<string>(post?.thumbnail_url || '');
  return (
    <div className="space-y-6 max-w-5xl">
      <form action={saveMyPost} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="thumbnail_url" value={thumb} />
        {post?.id && <input type="hidden" name="id" value={post.id} />}
        <section className={`${sec} grid gap-4 md:grid-cols-[1fr_180px]`}>
          <label className="block text-[13px]">제목 *<input name="title_ko" required defaultValue={post?.title_ko || ''} placeholder="예: 김OO 학생 논문 Nature Communications 게재" className="input mt-1" /></label>
          <label className="block text-[13px]">날짜<input name="created_at" type="date" defaultValue={post?.created_at?.slice(0, 10)} className="input mt-1" /></label>
        </section>
        <section className={`${sec} flex flex-col sm:flex-row gap-5`}>
          <div className="w-full sm:w-[220px] shrink-0">
            <div className="aspect-[4/3] border border-sg-line bg-sg-mist overflow-hidden grid place-items-center">
              {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <span className="text-[12px] text-sg-gray9">대표 그림 없음</span>}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold">대표 그림 (선택)</p>
            <p className="mt-1 text-[12.5px] text-sg-steel break-keep leading-relaxed">게시판 목록과 「최근 연구성과」 띠에 보이는 그림입니다. 논문 TOC 그림이나 연구 이미지를 추천합니다. 비워 두면 본문의 첫 사진을 씁니다.</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Uploader folder="posts" accept="image/*" label={thumb ? '다른 그림 올리기' : '그림 올리기'} onDone={(fs) => setThumb(fs[0].url)} />
              {thumb && <button type="button" onClick={() => setThumb('')} className="text-[13px] text-sg-cardinal underline underline-offset-4">빼기</button>}
            </div>
          </div>
        </section>
        <section className={sec}>
          <p className="text-[13px] mb-2">본문</p>
          <RichEditor name="content_ko" defaultValue={post?.content_ko || ''} folder="posts" minHeight={360} />
          <p className="mt-2 text-[12px] text-sg-steel break-keep">영문 게시판에는 자동 번역되어 올라갑니다.</p>
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
