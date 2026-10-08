-- posts.legacy_id 고유 인덱스를 일반 인덱스로 바꾼다.
-- 부분 인덱스는 PostgREST 의 on_conflict=legacy_id 가 추론하지 못해 42P10 을 낸다.
-- (일반 고유 인덱스도 NULL 은 여러 개 허용하므로 기존 글에는 영향이 없다.)
drop index if exists posts_legacy_uq;
create unique index if not exists posts_legacy_uq on posts(legacy_id);
notify pgrst, 'reload schema';
