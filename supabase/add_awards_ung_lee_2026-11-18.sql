-- 이웅 교수 주요 수상 3건 추가 (2026-11-18). 기존 '주요 수상' 목록 맨 앞(최신순)에 넣는다.
-- 이미 들어가 있으면 다시 넣지 않는다(여러 번 실행해도 결과가 같다).
update faculty set
  bio_ko = replace(bio_ko, '<h3>주요 수상</h3><ul>',
    '<h3>주요 수상</h3><ul>'
    || '<li>국가지식재산위원회 위원장 표창 (2026) <a href="https://www.e-patentnews.com/14613">관련 기사</a></li>'
    || '<li>한국차세대과학기술한림원(Y-KAST) 회원 (2025)</li>'
    || '<li>과학기술정보통신부 장관상 (2023)</li>'),
  bio_en = replace(bio_en, '<h3>Selected Awards</h3><ul>',
    '<h3>Selected Awards</h3><ul>'
    || '<li>Commendation from the Chair of the Presidential Council on Intellectual Property (2026) <a href="https://www.e-patentnews.com/14613">News</a></li>'
    || '<li>Member, Young Korean Academy of Science and Technology (Y-KAST) (2025)</li>'
    || '<li>Minister of Science and ICT Award (2023)</li>')
where name_ko = '이웅' and bio_ko not like '%국가지식재산위원회%';

-- 두 칸 모두 true 이면 정상
select name_ko, bio_ko like '%국가지식재산위원회%' as ko_ok, bio_en like '%Intellectual Property%' as en_ok
from faculty where name_ko = '이웅';
