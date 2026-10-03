import type { PageContent } from './types';

/** 대학원과정 고정 글. 출처: 옛 홈페이지 kor/sub/04_04.php(대학원 요람·학과 내규).
 *  교과목 목록은 content/data/grad-courses.json(CourseCatalog)으로 그린다. */
export const graduate: Record<string, PageContent> = {
  'graduate/admission': {
    ko: `<p class="text-xl font-semibold text-sg-ink break-keep">화공생명공학과 대학원은 18개 연구실에서 촉매·분리막·고분자·전기화학·나노바이오·생물공정을 아우르는 연구를 수행합니다.</p>
<p>대학원생들은 국가 연구개발 과제와 기업 공동연구에 참여하며, 졸업 후 대학·기업 연구소·정부출연 연구소 등에서 활동하고 있습니다. 학과는 C1 가스 리파이너리 사업단, 에너지인력양성사업단, BK21 분자제어기반 화공생물공정연구팀, 첨단소재 연구소를 운영하고 있어 대형 과제에 참여할 기회가 넓습니다.</p>
<h2>지원 절차</h2>
<table><tbody>
<tr><th>모집 시기</th><td>전기(9~10월 전형, 다음 해 3월 입학) · 후기(5~6월 전형, 9월 입학). 정확한 일정과 서류는 <a href="https://gradsch.sogang.ac.kr" target="_blank" rel="noreferrer">서강대학교 일반대학원 ↗</a> 공지를 확인하세요.</td></tr>
<tr><th>과정</th><td>석사과정 · 박사과정 · 석박사통합과정 · 학석사연계과정</td></tr>
<tr><th>지도교수 상담</th><td>지원 전에 관심 연구실의 지도교수와 미리 상담하기를 권합니다. <a href="/ko/about/labs">연구실 목록</a>에서 연구 분야와 연락처를 확인할 수 있습니다.</td></tr>
<tr><th>문의</th><td>학과사무실 02-705-8474 · 입학 전형 관련은 일반대학원 행정팀</td></tr>
</tbody></table>
<h2>장학 및 연구 환경</h2>
<ul>
<li>연구과제 참여를 통한 인건비 지원과 교내 장학 제도가 운영됩니다. 구체적인 범위는 연구실마다 다르므로 지도교수와 상담하세요.</li>
<li>BK21 교육연구팀 참여 대학원생에게는 별도의 연구장학금이 지급됩니다.</li>
<li>학과 공용장비는 홈페이지 <a href="/ko/equipment">예약 › 공용장비</a>에서 예약해 사용합니다.</li>
</ul>`,
    en: `<p class="text-xl font-semibold text-sg-ink">Eighteen laboratories covering catalysis, membranes, polymers, electrochemistry, nano-bioengineering and bioprocessing.</p>
<p>Graduate students take part in national R&amp;D projects and industry collaborations, and go on to universities, corporate laboratories and government research institutes. The department hosts the C1 Gas Refinery R&amp;D Center, the Energy Workforce Program, the BK21 FOUR research team and the Advanced Materials Institute.</p>
<h2>How to apply</h2>
<table><tbody>
<tr><th>Admission cycles</th><td>Fall screening for March entry; spring screening for September entry. See the <a href="https://gradsch.sogang.ac.kr" target="_blank" rel="noreferrer">Sogang Graduate School ↗</a> announcements for dates and documents.</td></tr>
<tr><th>Programs</th><td>MS · PhD · integrated MS–PhD · combined BS–MS</td></tr>
<tr><th>Contacting an advisor</th><td>Applicants are encouraged to contact a prospective advisor first. See the <a href="/en/about/labs">laboratory list</a>.</td></tr>
<tr><th>Enquiries</th><td>Department office +82-2-705-8474</td></tr>
</tbody></table>`,
  },
  'graduate/curriculum': {
    ko: `<h2>과정별 이수 요건</h2>
<p class="text-[13.5px] text-sg-gray9">모든 학번 공통 적용. 괄호 안의 숫자는 연구학점으로 이수 가능한 최대 학점입니다.</p>
<table><thead><tr><th>과정</th><th>전공필수</th><th>전공선택</th><th>총 취득학점</th><th>종합시험</th><th>제1외국어</th></tr></thead><tbody>
<tr><th>석사학위과정</th><td>3*</td><td>21*</td><td>24 (6)</td><td>2과목</td><td>없음</td></tr>
<tr><th>박사학위과정</th><td>—</td><td>24</td><td>24 (6)</td><td>2과목</td><td>없음</td></tr>
<tr><th>석·박사통합과정</th><td>—</td><td>42</td><td>42 (12)</td><td>2과목</td><td>없음</td></tr>
</tbody></table>
<p>* 교내 「대학원 학칙 시행세칙」 제4장 제3절 제42조에 따라 5000번대 학·석사 공용과목은 최대 9학점까지만 인정됩니다.<br>
* 매 학기 수강신청 시 대학원 행정팀 홈페이지에 게시되는 수강신청 유의사항을 반드시 확인하세요.</p>
<h2>공통 사항</h2>
<ol>
<li>입학자격과 입학시험은 대학원 학칙에 준합니다.</li>
<li>대학원 개설 교과목 중에서 과정별 소정 학점 이상을 취득해야 합니다. 석·박사통합과정의 경우 석사학위 소지자는 석사과정에서 취득한 학점을 인정받을 수 있습니다.</li>
<li>종합시험에 합격해야 합니다.
<ul>
<li>응시자격: 18학점 이상을 취득하고 3학기 이상 등록한 학생</li>
<li>응시과목: 화공수학·전달현상·열역학·반응공학 중 본인이 선택한 두 과목 이상에서 합격(구술 또는 필기)</li>
<li>재시험: 불합격 과목에 대해 한 학기 1회 허용</li>
</ul></li>
<li>학위논문은 심사위원회의 심사를 통과해야 합니다. 심사위원회 구성은 대학원 내규에 준합니다.</li>
<li>석·박사통합과정 이수 중 석사학위 취득 요건을 갖추면 석사학위를 수여받을 수 있습니다.</li>
</ol>
<p class="text-[13.5px] text-sg-gray9">※ 교과목 성격상 2013학년도 1학기에 「응용통계열역학」을 수강한 학생은 「고급화공열역학」을 수강한 것으로 인정합니다. (2013.02.20 개정)</p>`,
    en: `<h2>Degree requirements</h2>
<p class="text-[13.5px] text-sg-gray9">Common to all entering classes. Figures in parentheses are the maximum credits that may be taken as research credits.</p>
<table><thead><tr><th>Program</th><th>Required</th><th>Elective</th><th>Total credits</th><th>Qualifying exam</th><th>Foreign language</th></tr></thead><tbody>
<tr><th>MS</th><td>3*</td><td>21*</td><td>24 (6)</td><td>2 subjects</td><td>None</td></tr>
<tr><th>PhD</th><td>—</td><td>24</td><td>24 (6)</td><td>2 subjects</td><td>None</td></tr>
<tr><th>Integrated MS–PhD</th><td>—</td><td>42</td><td>42 (12)</td><td>2 subjects</td><td>None</td></tr>
</tbody></table>
<p>* At most 9 credits of 5000-level courses shared with the undergraduate program may be counted.</p>
<h2>Common provisions</h2>
<ol>
<li>Admission follows the Graduate School statutes.</li>
<li>Students must earn at least the credits required for their program. Integrated-program students holding an MS may transfer credits earned in the master's program.</li>
<li>Students must pass the comprehensive examination: open to those with 18+ credits and 3+ registered semesters; two or more subjects chosen from CBE mathematics, transport phenomena, thermodynamics and reaction engineering; one re-sit per semester for failed subjects.</li>
<li>The thesis must pass the examining committee, constituted under the Graduate School rules.</li>
<li>Integrated-program students meeting the master's requirements may receive the MS degree.</li>
</ol>`,
  },
  'graduate/rules': {
    ko: `<p class="text-[13.5px] text-sg-gray9">화공생명공학과 대학원 졸업 학과 내규 — 2010년 3월 입학생부터 적용. 아래 내용과 대학원 학칙이 충돌할 경우 학칙이 우선합니다.</p>
<h2>논문심사 신청 및 승인</h2>
<ol>
<li>석·박사 논문심사 대상자는 논문제출승인서를 제출할 때 졸업 자격요건과 관련된 증빙서류를 학과(학과장)에 제출해야 하며, 대학원 책임교수가 이를 검토하고 학과장이 최종적으로 논문심사 여부를 승인합니다. (석사: 논문 제출에 대한 메일 내용 또는 기타 증빙자료 / 박사: 게재 수락된 학술지의 표지와 논문 첫 페이지)</li>
<li>석·박사 논문심사 최종 합격 여부는 학위논문 최종 심사 결과에 따릅니다.</li>
</ol>
<h2>공개발표</h2>
<ol>
<li>박사학위 청구논문을 제출하려는 학생은 제출 기간 안에 학과 홈페이지 및 게시판을 통해 공지하고 논문 내용을 공개 발표해야 합니다.</li>
<li>공개발표는 논문지도교수를 포함하여 3인 이상의 소속학과 전임교수가 참관해야 합니다.</li>
<li>공개발표는 모든 사람이 방청할 수 있습니다.</li>
<li>참관교수 또는 방청자는 발표자에게 논문 관련 질의를 할 수 있으며, 발표자는 이에 답변해야 합니다.</li>
</ol>
<h2>석사학위과정 졸업 요건</h2>
<ol>
<li>학진등재(후보)지 이상 학술지에 최소 1편의 논문을 제출해야 합니다. (증빙자료는 학과에 제출하여 승인)</li>
<li>화공생명공학과 또는 화학공학과를 전공한 학생은 대학원 필수과목 — 고급화공열역학(CBE5001), 고급에너지 및 운동량 전달(CBE5004), 고급화공수학(CBE5007), 고급촉매공학(CBE6097, 고급반응공학 대체과목), 고급화공생명공학(CBE6098) — 중 1과목 이상을 최소 B학점(B− 이상) 이상으로 취득해야 하며, 화학공학을 전공하지 않은 학생은 2과목 이상을 취득해야 합니다. (학연협동과정 학생은 예외)</li>
<li>석사과정 2학기 수료 후 3학기 시작 전 Proposal 형식의 자격시험(Qualifying exam)을 1회 진행합니다.</li>
</ol>
<p class="text-[13.5px] text-sg-gray9">※ 경과조치: 2010년 3월 입학생부터 적용 · 고급화공생명공학(CBE6098) 필수과목 추가는 2022년 2월 졸업대상자부터 적용(2021.10.25 개정) · 자격시험은 2019학년도 2학기 기준 2학기 재학생부터 매년 3월 첫째 주 실시(2019.09.16 개정)</p>
<h2>박사학위과정 졸업 요건</h2>
<ol>
<li>SCI(E) 학술지에 최소 3편이 게재 수락되어야 하며, 이 중 2편 이상에서 주저자여야 합니다.
<ul>
<li>산업체 소속 박사과정 학생은 주저자 논문 1편을 특허로 대신할 수 있습니다. (증빙자료는 학과에 제출하여 승인)</li>
<li>졸업요건을 충족하지 않더라도 예외적으로 특허 등 연구업적이 충분하면서 미충족 사유가 있는 경우, 지도교수가 학과회의에 증빙과 함께 졸업심의를 요청할 수 있습니다.</li>
</ul></li>
<li>박사과정 4~7학기 학생을 대상으로 Proposal 형식의 자격시험을 1회 진행합니다.</li>
</ol>
<h2>대학원 세미나 수강</h2>
<p>대학원생은 졸업 요건을 충족하기 위해 매 학기 개설되는 세미나 수업을 모두 수강해야 합니다. (조기수료 요건을 만족하는 학석사통합·석박통합과정 학생은 조기수료까지 매 학기 수강) 해당 내규는 2023학년도 1학기 입학생부터 적용됩니다.</p>
<p>직장 및 기관의 근로시간, 지역, 이동 시간에 따른 어려움을 고려하여 지도교수의 허락 하에 세미나 수강을 면제할 수 있습니다. (2025.09.01 개정)</p>
<h2>석·박사통합과정 조기수료 요건</h2>
<p class="text-[13.5px] text-sg-gray9">2019.03.29 제정</p>
<p>석·박사통합과정 학생은 다음 요건을 모두 갖출 경우 학과 대학원 위원회 의결을 통하여 최대 2학기 범위 내에서 조기수료를 허가할 수 있습니다.</p>
<ol>
<li>대학원 학칙 제22조에 규정된 석박사통합과정 수료 학점 이상을 이수</li>
<li>총 성적평점평균이 대학원 학칙 시행세칙 제25조에 규정된 수료 요건 이상</li>
<li>제1저자로서 SCI(E) 논문을 1편 이상 게재(예정) — 주저자·공동저자 모두 가능</li>
<li>조기수료 요건 대상자는 석박사통합과정 재학생에 한해 소급 적용</li>
</ol>`,
    en: `<p class="text-[13.5px] text-sg-gray9">Departmental graduation rules, applied from the March 2010 entering class. Where these conflict with the Graduate School statutes, the statutes prevail.</p>
<h2>Thesis examination</h2>
<ol>
<li>Candidates submit evidence of the graduation requirements together with the thesis submission approval form; the graduate program director reviews it and the department chair gives final approval.</li>
<li>The outcome follows the final thesis examination.</li>
</ol>
<h2>Public presentation</h2>
<ol>
<li>Doctoral candidates must announce and give a public presentation of the thesis within the submission period.</li>
<li>At least three full-time faculty of the department, including the advisor, must attend.</li>
<li>The presentation is open to all, and attendees may question the candidate.</li>
</ol>
<h2>MS requirements</h2>
<ol>
<li>At least one paper submitted to a KCI-listed (or higher) journal.</li>
<li>Students with a chemical engineering background must pass at least one of the required graduate courses (CBE5001, CBE5004, CBE5007, CBE6097, CBE6098) with B− or better; students from other backgrounds, at least two.</li>
<li>A proposal-style qualifying examination is held once, after the second semester.</li>
</ol>
<h2>PhD requirements</h2>
<ol>
<li>At least three SCI(E) papers accepted, with the candidate as lead author on two or more. Students employed in industry may substitute a patent for one lead-author paper; exceptional cases may be reviewed by the department meeting on the advisor's request.</li>
<li>A proposal-style qualifying examination is held once, between the fourth and seventh semesters.</li>
</ol>
<h2>Graduate seminar</h2>
<p>Graduate students must take the seminar course every semester. Applies from the Spring 2023 entering class. Exemptions may be granted by the advisor where work location or hours make attendance impractical (revised 2025.09.01).</p>
<h2>Early completion (integrated MS–PhD)</h2>
<p>Up to two semesters of early completion may be approved by the departmental graduate committee for students who meet the credit and GPA requirements and have at least one SCI(E) paper published or accepted as first author.</p>`,
  },
};
