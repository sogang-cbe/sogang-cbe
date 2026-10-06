import type { PageContent } from './types';

/** 사이트 운영 정책. (동문회 페이지는 2026-10-07 메뉴에서 내렸고 본문은 docs/보존-동문회페이지.md 에 있다) */
export const policy: Record<string, PageContent> = {
  'policy/privacy': {
    ko: `<p>서강대학교 화공생명공학과(이하 "학과")는 「개인정보 보호법」 등 관련 법령을 준수하며, 홈페이지 이용자의 개인정보를 다음과 같이 처리합니다.</p>
<h3>1. 수집하는 개인정보 항목과 목적</h3>
<table><tbody>
<tr><th>구성원 로그인</th><td>이메일(@sogang.ac.kr), 이름, 소속 연구실 — 공용장비·시설 예약 자격 확인과 이용 내역 관리</td></tr>
<tr><th>시설·장비 예약</th><td>예약자 이메일, 예약 일시, 사용 목적, 체크인·체크아웃 기록 — 예약 운영, 중복 예약 방지, 사용 통계</td></tr>
<tr><th>게시판 작성</th><td>작성자 이름(또는 소속), 내용, 첨부파일 — 학과 공지와 자료 공유</td></tr>
<tr><th>관리자 계정</th><td>이메일 — 관리자 인증</td></tr>
</tbody></table>
<h3>2. 보유 및 이용 기간</h3>
<ul>
<li>예약·사용 기록: 예약일로부터 2년 보관 후 삭제 (장비 운영 통계와 분담 산정에 사용)</li>
<li>구성원 계정: 졸업·퇴직 등으로 자격이 상실된 때로부터 1년 이내 삭제</li>
<li>게시글: 학과 기록물로서 보존하되, 작성자의 요청이 있으면 비공개 처리합니다.</li>
</ul>
<h3>3. 제3자 제공</h3><p>법령에 따른 경우를 제외하고 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.</p>
<h3>4. 처리 위탁</h3><p>홈페이지 운영을 위하여 다음 서비스를 이용합니다. — Vercel(웹 호스팅), Supabase(데이터베이스·인증), Cloudflare R2(첨부파일 저장), Google(구성원 로그인).</p>
<h3>5. 이용자의 권리</h3><p>본인의 개인정보에 대한 열람·정정·삭제·처리정지를 학과사무실에 요청할 수 있습니다.</p>
<h3>6. 문의</h3><p>화공생명공학과 학과사무실 · 02-705-8474 · 서울특별시 마포구 백범로 35 리치과학관(R) 521호</p>`,
    en: `<p>The Department of Chemical and Biomolecular Engineering, Sogang University, complies with the Personal Information Protection Act and processes users' personal data as follows.</p>
<h3>1. Data collected and purpose</h3>
<table><tbody>
<tr><th>Member sign-in</th><td>Email (@sogang.ac.kr), name, laboratory — to verify eligibility for instrument and facility booking and to keep usage records</td></tr>
<tr><th>Reservations</th><td>Email, date and time, purpose, check-in/check-out records — to operate bookings, prevent conflicts and compile usage statistics</td></tr>
<tr><th>Board posts</th><td>Author name or affiliation, content, attachments — departmental notices and file sharing</td></tr>
<tr><th>Administrator accounts</th><td>Email — authentication</td></tr>
</tbody></table>
<h3>2. Retention</h3>
<ul>
<li>Reservation and usage records: two years from the reservation date</li>
<li>Member accounts: deleted within one year of leaving the department</li>
<li>Board posts: retained as departmental records; withdrawn from public view on the author's request</li>
</ul>
<h3>3. Third parties</h3><p>Personal data is not disclosed to third parties without consent, except as required by law.</p>
<h3>4. Processors</h3><p>Vercel (hosting), Supabase (database and authentication), Cloudflare R2 (file storage), Google (member sign-in).</p>
<h3>5. Your rights</h3><p>You may ask the department office to access, correct, delete or suspend processing of your data.</p>
<h3>6. Contact</h3><p>Department office · +82-2-705-8474 · Ricci Hall (R) Room 521, 35 Baekbeom-ro, Mapo-gu, Seoul</p>`,
  },
  'policy/email': {
    ko: `<p>본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 의해 형사 처벌됨을 유념하시기 바랍니다.</p>`,
    en: `<p>Email addresses published on this website may not be collected without authorization by email harvesting programs or other technical means. Violations are subject to criminal penalties under the Act on Promotion of Information and Communications Network Utilization and Information Protection.</p>`,
  },
  'policy/terms': {
    ko: `<p>본 홈페이지의 모든 콘텐츠(텍스트, 이미지, 자료)의 저작권은 서강대학교 화공생명공학과에 있으며, 사전 승인 없이 상업적 목적으로 복제·배포할 수 없습니다. 게시판에 게시되는 내용은 학과의 공식 입장과 다를 수 있습니다.</p>`,
    en: `<p>All content on this website (text, images, files) is copyrighted by the Department of Chemical and Biomolecular Engineering, Sogang University, and may not be reproduced or distributed for commercial purposes without prior permission. Board posts may not reflect the department's official position.</p>`,
  },
};
