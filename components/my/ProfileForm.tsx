'use client';
import RichEditor from '@/components/admin/RichEditor';
import PhotoField from '@/components/admin/PhotoField';
import SubmitButton from '@/components/admin/SubmitButton';
import { saveMyProfile } from '@/app/[locale]/my/actions';

/** 교수 본인 편집 폼 — 관리자 교수진 편집에서 학과가 관리할 칸(이름·직함·정렬·보직·공개)을 뺀 것 */
export default function ProfileForm({ f, locale }: { f: any; locale: 'ko' | 'en' }) {
  const I = ({ n, l, ph, hint }: { n: string; l: string; ph?: string; hint?: string }) => (
    <label className="block text-[13px]">{l}<input name={n} defaultValue={f?.[n] || ''} placeholder={ph} className="input mt-1" />{hint && <span className="block text-[11.5px] text-sg-steel mt-1 break-keep">{hint}</span>}</label>
  );
  const sec = 'border border-sg-line bg-white p-5 md:p-7';
  return (
    <form action={saveMyProfile} className="space-y-6 max-w-5xl">
      <input type="hidden" name="locale" value={locale} />
      <section className={`${sec} grid gap-6 md:grid-cols-[200px_1fr]`}>
        <div>
          <p className="text-[13px] mb-2">프로필 사진</p>
          <PhotoField defaultValue={f?.photo_url} />
          <p className="mt-2 text-[11.5px] text-sg-steel break-keep">무릎 위까지 나온 사진이면 다른 교수님들과 비슷하게 보입니다.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 content-start">
          <I n="lab_ko" l="연구실 이름 (국문)" />
          <I n="lab_en" l="Laboratory (English)" />
          <I n="lab_url" l="연구실 홈페이지" ph="https://" />
          <I n="scholar_url" l="Google Scholar 주소" ph="https://scholar.google.com/citations?user=…" />
          <I n="room" l="연구실 호실" ph="607A" hint="숫자만 (건물은 학과에서 관리)" />
          <I n="tel" l="전화" ph="02-705-0000" />
          <div className="sm:col-span-2"><I n="keywords" l="연구분야 키워드" ph="Ionoelastomers, Polyelectrolyte Complexes, …" hint="영문 3~4개, 쉼표로 구분. 페이지 위쪽에 칩으로 표시됩니다." /></div>
        </div>
      </section>

      <section className={sec}>
        <h2 className="font-brand text-[1.2rem]">약력</h2>
        <p className="mt-1 mb-3 text-[12.5px] text-sg-steel break-keep">소제목 순서: 학력 → 경력 → 주요 수상 → 학회 활동 → 주요 논문. 「주요 논문」 아래의 목록은 페이지 맨 아래에 번호 목록으로 따로 표시됩니다.</p>
        <RichEditor name="bio_ko" defaultValue={f?.bio_ko || ''} folder="faculty" minHeight={260} />
      </section>

      <section className={sec}>
        <h2 className="font-brand text-[1.2rem]">연구 소개</h2>
        <p className="mt-1 mb-3 text-[12.5px] text-sg-steel break-keep">주제마다 첫 줄에 제목을 쓰고 줄을 바꿔(Shift+Enter) 설명을 이어 쓰시면 제목이 굵게 표시됩니다.</p>
        <RichEditor name="research_ko" defaultValue={f?.research_ko || ''} folder="faculty" minHeight={260} />
      </section>

      <details className={sec}>
        <summary className="cursor-pointer font-brand text-[1.1rem]">영문 (선택) — 비워 두거나 그대로 두면 국문을 고칠 때 자동 번역됩니다</summary>
        <div className="mt-5 space-y-6">
          <div><p className="text-[13px] mb-2">Biography (English)</p><RichEditor name="bio_en" defaultValue={f?.bio_en || ''} folder="faculty" minHeight={200} /></div>
          <div><p className="text-[13px] mb-2">Research (English)</p><RichEditor name="research_en" defaultValue={f?.research_en || ''} folder="faculty" minHeight={200} /></div>
        </div>
      </details>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton className="btn-primary !px-6 !py-3">저장</SubmitButton>
        <a href={`/${locale}/my`} className="text-[14px] text-sg-gray11 underline underline-offset-4">취소</a>
        <span className="text-[12.5px] text-sg-steel">이름·직함·보직은 학과 사무실에서 관리합니다.</span>
      </div>
    </form>
  );
}
