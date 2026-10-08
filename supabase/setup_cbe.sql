-- ============================================================
-- 서강대학교 화공생명공학과 홈페이지 — Supabase 초기 설정
-- Supabase 대시보드 > SQL Editor에 전체를 붙여넣고 Run 한 번.
-- 여러 번 실행해도 안전합니다 (if not exists / or replace).
--
-- 기계공학과 저장소(sogang-me)의 schema.sql + v3 + v6 + v7 + v8을 하나로 합치고,
-- 기계과 전용 데이터·기능(교수 분야 분류, URECA 지원)은 뺐습니다.
-- ============================================================
create extension if not exists pgcrypto;

-- Admin allow-list. Any Supabase Auth user whose email is listed here can manage the site.
create table if not exists admins (
  email text primary key,
  created_at timestamptz default now()
);

create or replace function is_admin() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Boards: academic | scholarship | research | seminar | gallery | archive | grad_intro | internal
create table if not exists posts (
  id bigserial primary key,
  board text not null,
  title_ko text not null,
  title_en text,
  content_ko text default '',
  content_en text,
  excerpt_ko text,
  excerpt_en text,
  thumbnail_url text,
  images jsonb default '[]'::jsonb,       -- gallery: [{url, caption}]
  attachments jsonb default '[]'::jsonb,  -- [{name, url, size}]
  author text default '화공생명공학과',
  is_pinned boolean default false,        -- 더는 쓰지 않는다(2026-10-08 상단 고정 기능 제거). 목록은 날짜순 하나로만 정렬한다.
  show_on_home boolean default true,
  published boolean default true,
  view_count int default 0,
  legacy_id text,                          -- 옛 사이트 글 식별자 'cbe:<게시판코드>:<idx>' (이관 중복 방지)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists posts_board_idx on posts(board, created_at desc);
-- 부분 인덱스(where legacy_id is not null)로 두면 PostgREST 의 on_conflict=legacy_id 가
-- 이 인덱스를 추론하지 못해 42P10 이 난다. 일반 고유 인덱스도 NULL 중복은 허용하므로 동작은 같다.
drop index if exists posts_legacy_uq;
create unique index if not exists posts_legacy_uq on posts(legacy_id);

create table if not exists faculty (
  id bigserial primary key,
  name_ko text not null,
  name_en text,
  title_ko text default '교수',
  title_en text default 'Professor',
  email text,
  tel text,
  lab_ko text,
  lab_en text,
  lab_url text,
  office text,
  photo_url text,
  field text,                 -- chair(석학교수) | staff(행정실) | null(전임·명예)
  research_ko text,
  research_en text,
  bio_ko text,
  bio_en text,
  sort_order int default 100,
  is_emeritus boolean default false,
  published boolean default true,
  created_at timestamptz default now()
);

-- Editable static pages (admin can edit body text without redeploy)
create table if not exists pages (
  slug text primary key,
  title_ko text,
  title_en text,
  content_ko text,
  content_en text,
  updated_at timestamptz default now()
);

-- Facility reservations: meeting (학과회의실 R521A)
create table if not exists reservations (
  id bigserial primary key,
  facility text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  user_name text not null,
  affiliation text,
  purpose text,
  contact text,
  status text default 'approved',  -- pending | approved | rejected
  created_at timestamptz default now()
);
create index if not exists reservations_idx on reservations(facility, date);

create table if not exists banners (
  id bigserial primary key,
  title_ko text,
  title_en text,
  subtitle_ko text,
  subtitle_en text,
  image_url text,
  link text,
  sort_order int default 100,
  visible boolean default true,
  created_at timestamptz default now()
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ---------- Row level security ----------
alter table admins enable row level security;
alter table posts enable row level security;
alter table faculty enable row level security;
alter table pages enable row level security;
alter table reservations enable row level security;
alter table banners enable row level security;
alter table site_settings enable row level security;

drop policy if exists "admins self read" on admins;
create policy "admins self read" on admins for select using (is_admin());

drop policy if exists "posts public read" on posts;
create policy "posts public read" on posts for select using (published or is_admin());
drop policy if exists "posts admin write" on posts;
create policy "posts admin write" on posts for all using (is_admin()) with check (is_admin());

drop policy if exists "faculty public read" on faculty;
create policy "faculty public read" on faculty for select using (published or is_admin());
drop policy if exists "faculty admin write" on faculty;
create policy "faculty admin write" on faculty for all using (is_admin()) with check (is_admin());

drop policy if exists "pages public read" on pages;
create policy "pages public read" on pages for select using (true);
drop policy if exists "pages admin write" on pages;
create policy "pages admin write" on pages for all using (is_admin()) with check (is_admin());

drop policy if exists "reservations public read" on reservations;
create policy "reservations public read" on reservations for select using (true);
drop policy if exists "reservations public insert" on reservations;
create policy "reservations public insert" on reservations for insert with check (status = 'pending');
drop policy if exists "reservations admin write" on reservations;
create policy "reservations admin write" on reservations for all using (is_admin()) with check (is_admin());

drop policy if exists "banners public read" on banners;
create policy "banners public read" on banners for select using (visible or is_admin());
drop policy if exists "banners admin write" on banners;
create policy "banners admin write" on banners for all using (is_admin()) with check (is_admin());

drop policy if exists "settings public read" on site_settings;
create policy "settings public read" on site_settings for select using (true);
drop policy if exists "settings admin write" on site_settings;
create policy "settings admin write" on site_settings for all using (is_admin()) with check (is_admin());

-- view counter callable by anyone
create or replace function increment_view(post_id bigint) returns void
language sql security definer as $$
  update posts set view_count = view_count + 1 where id = post_id;
$$;

-- Storage bucket for uploads (images, attachments)
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for all
  using (bucket_id = 'media' and is_admin()) with check (bucket_id = 'media' and is_admin());

-- Default settings
insert into site_settings (key, value) values
 ('home', '{"sections":["hero","intro","news","programs","quicklinks","gallery"],"news_count":6,"tagline_ko":"분자에서 공정까지, 화학을 쓸모로 바꿉니다","tagline_en":"From molecules to processes"}')
on conflict (key) do nothing;


-- ===== v3: 게시글 추가 컬럼 =====
-- v3: 게시글 부가 컬럼(영상 링크·분류·정렬)
alter table posts add column if not exists video_url text;
alter table posts add column if not exists term text;        -- e.g. '2025-2' (학년도-학기) or year '2025'
alter table posts add column if not exists members text;     -- 조원
alter table posts add column if not exists advisor text;     -- 지도교수
alter table posts add column if not exists category text;    -- 게시판별 소분류 (예: 세미나 분야)
alter table posts add column if not exists sort_order int default 100;


update site_settings set value = value || '{"notify_email":"chemeng.sogang@gmail.com"}'::jsonb where key='home' and not (value ? 'notify_email');
alter table posts add column if not exists category_en text;


-- ===== v6: 교수 위치(건물·호실) 분리 =====
-- v6: 교수 위치를 건물 코드 + 호실로 분리 (국문/영문 자동 표기)
alter table faculty add column if not exists building text;
alter table faculty add column if not exists room text;

-- 기존 office 문자열에서 건물 코드와 호실을 추출해 채워 넣습니다.
update faculty set
  building = coalesce(building, (regexp_match(office, '\(([A-Z]{1,3})\)'))[1]),
  room     = coalesce(room,     (regexp_match(office, '\(?[A-Z]{0,3}\)?\s*([0-9]+[A-Za-z]?)\s*호'))[1])
where office is not null;



-- ===== v7: 영문 검수 표시 =====
alter table posts add column if not exists en_verified timestamptz;
alter table faculty add column if not exists en_verified timestamptz;


-- ===== v8: 보안·버그 보강 (개인정보 컬럼 차단 포함) =====
-- schema_v8: 2026-09-02 전체 감사 후속 DB 보강
-- Supabase 대시보드 > SQL Editor에 그대로 붙여넣고 Run.
-- 코드(리포)는 이 SQL이 적용되기 전에도 동작하도록 작성되어 있다.

-- 1) [보안] 예약자 개인정보(연락처·소속) 익명 노출 차단.
--    RLS의 "reservations public read"는 행만 거를 수 있어, 지금은 누구나 anon 키로
--    /rest/v1/reservations?select=contact 를 호출해 전 예약자의 전화번호를 덤프할 수 있다.
--    컬럼 단위 grant로 익명(anon)에게는 달력 표시에 필요한 컬럼만 연다.
revoke select on table public.reservations from anon;
grant select (id, facility, date, start_time, end_time, user_name, purpose, status, created_at)
  on table public.reservations to anon;
-- 로그인한 관리자(authenticated)는 전 컬럼 유지 (기본 grant 그대로).

-- 2) [버그] 관리자 추가(addAdmin)가 조용히 실패하던 문제: admins에 쓰기 정책이 없었다.
drop policy if exists "admins admin write" on public.admins;
create policy "admins admin write" on public.admins
  for all using (is_admin()) with check (is_admin());


-- 4) [방어] 예약 공개 insert 조건 강화: API를 우회해 Supabase REST로 직접 넣어도
--    pending·시간 정합·과거 날짜 금지가 DB에서 강제된다.
drop policy if exists "reservations public insert" on public.reservations;
create policy "reservations public insert" on public.reservations
  for insert with check (
    status = 'pending'
    and end_time > start_time
    and date >= (now() at time zone 'Asia/Seoul')::date
  );

-- 5) [방어] 동시 예약 신청 레이스 정리: 나중에 들어온 pending 행이 스스로 물러날 때 사용.
--    겹치는 더 이른 행이 실제로 있을 때만, 그리고 pending일 때만 지워서 오남용을 막는다.
create or replace function public.withdraw_conflicted_reservation(p_id bigint)
returns boolean
language sql security definer set search_path = public as $$
  with me as (select * from reservations where id = p_id and status = 'pending'),
  del as (
    delete from reservations r using me
    where r.id = me.id
      and exists (
        select 1 from reservations o
        where o.facility = me.facility and o.date = me.date and o.id < me.id
          and o.status <> 'rejected'
          and o.start_time < me.end_time and o.end_time > me.start_time
      )
    returning r.id
  ) select count(*) > 0 from del;
$$;
revoke all on function public.withdraw_conflicted_reservation(bigint) from public;
grant execute on function public.withdraw_conflicted_reservation(bigint) to anon, authenticated;

-- PostgREST 스키마 캐시 갱신
notify pgrst, 'reload schema';


-- ============================================================
-- 화공생명공학과 추가 — 공용장비 예약 (신규 기능)
-- 대학원생만 열람·예약, QR 체크인으로 실제 사용 기록, 노쇼 집계
-- ============================================================

-- 구성원: 학교 구글 계정으로 로그인한 사람의 역할. 행정실이 승인해야 대학원생 권한이 생긴다.
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  role text not null default 'pending',   -- pending | grad | faculty | staff
  lab text,                               -- 소속 연구실
  approved_at timestamptz,
  created_at timestamptz default now()
);

-- 장비 목록
create table if not exists equipment (
  id bigserial primary key,
  name_ko text not null,
  name_en text,
  model text,
  location text,
  manager text,                           -- 담당자
  manager_email text,
  note_ko text,
  note_en text,
  min_slot int default 60,                -- 예약 최소 단위(분)
  power_safe boolean default false,       -- 전원을 함부로 끊어도 되는 장비인지
  published boolean default true,
  sort_order int default 100,
  created_at timestamptz default now()
);

-- 장비 예약
create table if not exists equipment_reservations (
  id bigserial primary key,
  equipment_id bigint not null references equipment(id) on delete cascade,
  member_email text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  purpose text,
  status text default 'pending',          -- pending | approved | rejected | cancelled
  checked_in_at timestamptz,              -- QR 체크인
  checked_out_at timestamptz,
  no_show boolean default false,
  created_at timestamptz default now()
);
create index if not exists eq_resv_day on equipment_reservations (equipment_id, date);
create index if not exists eq_resv_member on equipment_reservations (member_email, date);

alter table members enable row level security;
alter table equipment enable row level security;
alter table equipment_reservations enable row level security;

-- 로그인한 본인 정보만 조회. 관리자는 전체.
drop policy if exists "members self read" on members;
create policy "members self read" on members for select
  using (is_admin() or email = auth.jwt() ->> 'email');
drop policy if exists "members admin write" on members;
create policy "members admin write" on members for all using (is_admin()) with check (is_admin());

-- 장비 목록은 승인된 구성원만 본다 (일반 공개 아님).
drop policy if exists "equipment member read" on equipment;
create policy "equipment member read" on equipment for select using (
  is_admin() or exists (
    select 1 from members m
    where m.email = auth.jwt() ->> 'email' and m.role in ('grad','faculty','staff')
  )
);
drop policy if exists "equipment admin write" on equipment;
create policy "equipment admin write" on equipment for all using (is_admin()) with check (is_admin());

-- 예약도 승인된 구성원만. 본인 예약만 신청·취소.
drop policy if exists "eq resv member read" on equipment_reservations;
create policy "eq resv member read" on equipment_reservations for select using (
  is_admin() or exists (
    select 1 from members m
    where m.email = auth.jwt() ->> 'email' and m.role in ('grad','faculty','staff')
  )
);
drop policy if exists "eq resv member insert" on equipment_reservations;
create policy "eq resv member insert" on equipment_reservations for insert with check (
  member_email = auth.jwt() ->> 'email'
  and status = 'pending'
  and end_time > start_time
  and date >= (now() at time zone 'Asia/Seoul')::date
  and exists (
    select 1 from members m
    where m.email = auth.jwt() ->> 'email' and m.role in ('grad','faculty','staff')
  )
);
drop policy if exists "eq resv admin write" on equipment_reservations;
create policy "eq resv admin write" on equipment_reservations for all using (is_admin()) with check (is_admin());

notify pgrst, 'reload schema';


-- ============================================================
-- 공용장비 v2 — 첫 로그인 등록, 본인 예약 수정(취소·체크인), 중복 예약 차단
-- ============================================================
create extension if not exists btree_gist;

-- 담당자 승인이 필요한 장비 표시 (기본값: 바로 예약 확정)
alter table equipment add column if not exists needs_approval boolean default false;
-- 예약 가능한 시간대(학교 건물 운영시간에 맞춘다)
alter table equipment add column if not exists open_from time default '08:00';
alter table equipment add column if not exists open_to time default '22:00';
-- 장비 QR 코드가 가리키는 토큰 (주소만 알면 남의 예약을 체크인할 수 없게)
alter table equipment add column if not exists qr_token text default encode(gen_random_bytes(8), 'hex');

-- 처음 로그인한 사람이 스스로 pending 으로 등록된다. 승인은 행정실이 한다.
drop policy if exists "members self insert" on members;
create policy "members self insert" on members for insert with check (
  email = auth.jwt() ->> 'email' and role = 'pending' and approved_at is null
);
-- 이름·연구실은 본인이 고칠 수 있다 (역할은 바꿀 수 없다 — 아래 트리거로 막는다)
drop policy if exists "members self update" on members;
create policy "members self update" on members for update
  using (email = auth.jwt() ->> 'email') with check (email = auth.jwt() ->> 'email');

create or replace function public.members_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if is_admin() then return new; end if;
  new.role := old.role;              -- 본인이 역할을 올리는 것을 막는다
  new.approved_at := old.approved_at;
  new.email := old.email;
  return new;
end; $$;
drop trigger if exists members_guard_tr on members;
create trigger members_guard_tr before update on members
  for each row execute function public.members_guard();

-- 본인 예약만 취소·체크인할 수 있다.
drop policy if exists "eq resv member update" on equipment_reservations;
create policy "eq resv member update" on equipment_reservations for update
  using (member_email = auth.jwt() ->> 'email')
  with check (member_email = auth.jwt() ->> 'email');

-- 승인이 필요 없는 장비는 신청 즉시 확정(approved)으로 넣을 수 있다.
drop policy if exists "eq resv member insert" on equipment_reservations;
create policy "eq resv member insert" on equipment_reservations for insert with check (
  member_email = auth.jwt() ->> 'email'
  and end_time > start_time
  and date >= (now() at time zone 'Asia/Seoul')::date
  and exists (select 1 from members m where m.email = auth.jwt() ->> 'email' and m.role in ('grad','faculty','staff'))
  and (
    status = 'pending'
    or (status = 'approved' and exists (select 1 from equipment e where e.id = equipment_id and coalesce(e.needs_approval, false) = false))
  )
);

-- 같은 장비·같은 시간에 두 예약이 들어가지 않게 DB에서 막는다.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'eq_resv_no_overlap') then
    alter table equipment_reservations add constraint eq_resv_no_overlap
      exclude using gist (
        equipment_id with =,
        tsrange((date + start_time), (date + end_time)) with &&
      ) where (status in ('pending', 'approved'));
  end if;
end $$;

notify pgrst, 'reload schema';


-- ============================================================
-- 교수 연구 키워드 — 연구실 목록 카드와 교수 상세에 칩으로 보여 준다.
-- 쉼표로 구분해 3~5개 정도 (예: 고분자 재료, 이온 소재, 전기접착)
-- ============================================================
alter table faculty add column if not exists keywords text;
-- 보직(학과장 등) — 직함과 별개로 이름 옆에 칩으로 붙는다. /adm/faculty 에서 편집.
alter table faculty add column if not exists badge_ko text;
alter table faculty add column if not exists badge_en text;
-- 보직(학과장·부학과장 등). 직급(title_ko)과 따로 둔다 — 보직은 2년마다 바뀌고 직급은 그대로다.
alter table faculty add column if not exists role_note_ko text;
alter table faculty add column if not exists role_note_en text;
notify pgrst, 'reload schema';
