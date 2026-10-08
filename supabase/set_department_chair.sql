-- 보직 칼럼 (없으면 만든다) + 학과장 지정
alter table faculty add column if not exists role_note_ko text;
alter table faculty add column if not exists role_note_en text;

-- 먼저 전원 비우고 (보직이 바뀌면 이 파일의 이름만 고쳐 다시 실행하면 된다)
update faculty set role_note_ko = null, role_note_en = null
 where role_note_ko is not null or role_note_en is not null;

update faculty set role_note_ko = '학과장', role_note_en = 'Department Chair'
 where name_ko = '이종석';

notify pgrst, 'reload schema';
