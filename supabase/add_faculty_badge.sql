-- 보직 표시(학과장 등). 직함(title_ko)과 섞지 않고 따로 둬서 사람이 바뀔 때 쉽게 옮긴다.
-- 이름 옆에 카디널 테두리 칩으로 붙고, 비어 있으면 아무것도 표시되지 않는다.
alter table faculty add column if not exists badge_ko text;
alter table faculty add column if not exists badge_en text;

update faculty set badge_ko = '학과장', badge_en = 'Department Chair'
 where name_ko = '이종석';

notify pgrst, 'reload schema';
