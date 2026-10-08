-- 최정우 교수 직함을 옛 홈페이지 표기에 맞춘다.
-- (옛 사이트 영문 표기 'Loyoal'은 오타라 'Loyola'로 바로잡았다.)
update faculty
   set title_ko = '로욜라 석학교수',
       title_en = 'Loyola Distinguished Professor'
 where name_ko = '최정우';
