-- 이종석 교수 연구실 국문 이름 변경 (2026-11-18): 녹색지속가능분리 연구실 → 생성형 지속가능 분리연구실
-- 영문 이름(Generative and Sustainable Separation Laboratory (GSSL))은 11/6 회신 때 이미 바뀌어 있다.
-- 소개 글 안에 옛 이름이 남아 있으면 함께 바꾼다. 여러 번 실행해도 결과가 같다.
update faculty set
  lab_ko = '생성형 지속가능 분리연구실',
  bio_ko = regexp_replace(bio_ko, '녹색\s*지속가능\s*분리\s*연구실', '생성형 지속가능 분리연구실', 'g'),
  research_ko = regexp_replace(research_ko, '녹색\s*지속가능\s*분리\s*연구실', '생성형 지속가능 분리연구실', 'g')
where name_ko = '이종석';

select name_ko, lab_ko, lab_en from faculty where name_ko = '이종석';
