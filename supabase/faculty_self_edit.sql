-- 교수 본인 편집 (2026-11) — 교수님이 학교 구글 계정으로 로그인해 자기 교수진 페이지와 연구성과 글을 고친다.
-- 실제 쓰기는 서버(service key)에서 본인 확인 뒤 처리한다. 여기서는 ① 글 주인 칸 ② 사진·본문 이미지 업로드 권한만 연다.
-- 여러 번 실행해도 된다.

-- ① 연구성과 글의 작성 교수(로그인 이메일). 관리자가 쓴 글은 비어 있다.
alter table posts add column if not exists owner_email text;
create index if not exists posts_owner_email_idx on posts (lower(owner_email));

-- ② 교수진 명단의 메일(아이디 부분)과 같은 학교 계정으로 로그인했는가
create or replace function public.is_faculty_self() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt() ->> 'email', '') ~* '@(u\.)?sogang\.ac\.kr$'
     and exists (
       select 1 from faculty f
       where f.published
         and split_part(lower(f.email), '@', 1) = split_part(lower(auth.jwt() ->> 'email'), '@', 1)
     );
$$;

-- ③ 교수 본인은 media 버킷의 faculty/(프로필 사진)·posts/(본문 사진) 폴더에 새 파일만 올릴 수 있다(수정·삭제는 불가)
drop policy if exists "media faculty upload" on storage.objects;
create policy "media faculty upload" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_faculty_self() and (storage.foldername(name))[1] in ('faculty', 'posts'));

-- ④ 이미 승인 대기 중인 교수님은 바로 '교수'로 승인 (다음부터는 로그인할 때 자동 승인)
update members m set role = 'faculty', approved_at = coalesce(m.approved_at, now())
where m.role = 'pending'
  and exists (select 1 from faculty f where f.published and split_part(lower(f.email), '@', 1) = split_part(lower(m.email), '@', 1));
