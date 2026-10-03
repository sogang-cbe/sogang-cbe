import type { PageContent } from './types';

/** 학부과정 고정 글. 출처: 옛 홈페이지 kor/sub/04_01.php(교과과정·참고사항), 04_03.php(학사규정),
 *  06_01.php(학교생활·행사). 학번별 이수계획표는 content/data/ug-plans.json,
 *  교과목 목록은 content/data/ug-courses.json, 학사일정은 content/calendar.ts. */
export const undergraduate: Record<string, PageContent> = {
  'undergraduate/curriculum': {
    ko: `<h2>참고사항</h2>
<ol>
<li>모든 공학부 신입생은 1학년 1학기에 개설되는 신입생세미나(HSS3014, 1학점) 과목을 필수적으로 수강해야 합니다. (2014학번부터 적용)</li>
<li>글로벌의사소통Ⅰ(COR1003)의 경우 Placement Test를 통하여 이미 고급 수준의 영어 능력이 있다고 판단된 학생은 글로벌의사소통Ⅰ(고급)(COR1005)을 수강함으로써 중핵교육과정을 이수하며, 동시에 성적에 따라 수행능력 인증(Global English 관련 부문)을 취득할 수 있습니다.</li>
<li>CBE2006(응용생물학)은 전공선택 과목이 아닌 전공예비 과목입니다.</li>
<li>1학기와 2학기에 모두 개설되는 과목은 어느 학기에 수강해도 무방합니다.</li>
<li>중핵필수 과목은 아니지만 SHU4059(창의와 혁신) 수강을 권장합니다.</li>
</ol>
<h2>졸업까지의 흐름</h2>
<table><tbody>
<tr><th>1학년</th><td>일반화학·일반물리·미적분학과 실험 등 공학 기초. 창의설계(CBE2002)로 전공을 처음 접합니다.</td></tr>
<tr><th>2학년</th><td>화공수학Ⅰ·Ⅱ, 화공생명공학 양론, 물리화학, 응용유기화학, 응용생화학. 화공생명공학 기초실험Ⅰ·Ⅱ가 함께 열립니다.</td></tr>
<tr><th>3학년</th><td>화공열역학, 반응공학, 화공유체역학, 열 및 물질전달, 고분자공학. 요소실험Ⅰ·Ⅱ로 단위조작을 직접 다룹니다.</td></tr>
<tr><th>4학년</th><td>화공생명공학심화종합설계(캡스톤), 공정실험, 생물화학공학, 화학산업과 기술경영. 전공선택으로 진로에 맞춰 깊이를 더합니다.</td></tr>
</tbody></table>
<p class="text-[13.5px] text-sg-gray9">※ 2026학번 이수계획표는 확정되는 대로 올립니다. 그 전까지는 2025학번 기준을 참고하시고, 확정 내용은 학과사무실에 확인해 주세요.</p>`,
    en: `<h2>Notes</h2>
<ol>
<li>All engineering freshmen must take the Freshman Seminar (HSS3014, 1 credit) in the first semester of year 1 (from the 2014 entering class).</li>
<li>Students judged to have advanced English through the placement test may take Global Communication I (Advanced) (COR1005) in place of COR1003.</li>
<li>CBE2006 (Applied Biology) is a pre-major course, not a major elective.</li>
<li>Courses offered in both semesters may be taken in either.</li>
<li>SHU4059 (Creativity and Innovation) is recommended although it is not a core requirement.</li>
</ol>
<h2>Path to graduation</h2>
<table><tbody>
<tr><th>Year 1</th><td>General chemistry, physics, calculus and their labs. Creative Design (CBE2002) gives a first taste of the major.</td></tr>
<tr><th>Year 2</th><td>CBE Mathematics I·II, Material and Energy Balances, Physical Chemistry, Applied Organic Chemistry, Applied Biochemistry, with Basic CBE Laboratory I·II.</td></tr>
<tr><th>Year 3</th><td>Thermodynamics, Reaction Engineering, Fluid Mechanics, Heat and Mass Transfer, Polymer Engineering, with Unit-Operation Laboratory I·II.</td></tr>
<tr><th>Year 4</th><td>Capstone design, Process Laboratory, Biochemical Engineering, Chemical Industry and Technology Management, plus electives.</td></tr>
</tbody></table>
<p class="text-[13.5px] text-sg-gray9">The plan for the 2026 entering class will be posted once confirmed.</p>`,
  },
  'undergraduate/courses': { ko: '', en: '' },
  'undergraduate/rules': {
    ko: `<h2>학사규정</h2>
<p>학부 학사에 관한 사항은 서강대학교 학칙과 학사 운영 규정을 따릅니다. 아래에서 전문을 확인할 수 있습니다.</p>
<ul>
<li><a href="https://www.sogang.ac.kr/ko/rules" target="_blank" rel="noreferrer">서강대학교 학사규정 전문 ↗</a></li>
<li><a href="https://sogang.ac.kr/ko/academics" target="_blank" rel="noreferrer">교무처 학사 안내 ↗</a></li>
</ul>
<h2>전공 이수 구분</h2>
<table><tbody>
<tr><th>화공생명공학 심화과정</th><td>공학교육인증(ABEEK) 프로그램입니다. 전공 필수·선택과 설계 과목을 인증 기준에 맞추어 이수합니다. 이수계획표는 <a href="/ko/undergraduate/curriculum">교과과정</a>에서 학번별로 확인합니다.</td></tr>
<tr><th>전공 예비과목</th><td>응용생물학(CBE2006), 프로그래밍 언어 기초(CBE2013) 등은 전공선택 학점에 포함되지 않습니다.</td></tr>
<tr><th>설계 과목</th><td>창의설계(CBE2002), 화공생명공학심화종합설계(CBE4001)가 설계 학점에 해당합니다.</td></tr>
</tbody></table>
<h2>자주 묻는 것</h2>
<table><tbody>
<tr><th>졸업 학점·요건</th><td>입학 학번에 따라 다릅니다. 본인 학번의 이수계획표와 학사규정을 함께 확인하고, 애매하면 학과사무실(02-705-8474)에 문의하세요.</td></tr>
<tr><th>타 전공 과목 인정</th><td>학과 승인이 필요합니다. 수강 전에 학과사무실에 문의하세요.</td></tr>
<tr><th>전과·복수전공</th><td>교무처 공지 일정에 따라 신청합니다. 학사일정의 '전공 추가신청 및 변경' 기간을 확인하세요.</td></tr>
</tbody></table>`,
    en: `<h2>Academic regulations</h2>
<p>Undergraduate matters follow the University statutes and academic operating regulations.</p>
<ul>
<li><a href="https://www.sogang.ac.kr/en" target="_blank" rel="noreferrer">Sogang University academic regulations ↗</a></li>
</ul>
<h2>Track types</h2>
<table><tbody>
<tr><th>Intensive major (accredited)</th><td>An ABEEK-accredited engineering program. See <a href="/en/undergraduate/curriculum">Curriculum</a> for the plan by entering year.</td></tr>
<tr><th>Pre-major courses</th><td>Applied Biology (CBE2006) and Introduction to Programming (CBE2013) do not count toward major electives.</td></tr>
<tr><th>Design courses</th><td>Creative Design (CBE2002) and Capstone Design (CBE4001) carry design credits.</td></tr>
</tbody></table>
<p>Graduation requirements depend on the entering year. Contact the department office (+82-2-705-8474) if anything is unclear.</p>`,
  },
  'undergraduate/lab': {
    ko: `<p class="text-xl font-semibold text-sg-ink break-keep">서강대 화공생명공학과는 2·3·4학년 세 해에 걸쳐 실험 과목을 연속으로 둡니다. 강의에서 세운 식이 실제 장치에서 어떻게 움직이는지 직접 확인하는 과정입니다.</p>
<h2>실험 과목</h2>
<table><thead><tr><th>학년</th><th>과목</th><th>다루는 것</th></tr></thead><tbody>
<tr><td>2학년</td><td>화공생명공학 기초실험Ⅰ (CBE2008)<br>화공생명공학 기초실험Ⅱ (CBE2009)</td><td>기본 측정과 데이터 처리, 물질·에너지 수지, 화학·생화학 기초 실험</td></tr>
<tr><td>3학년</td><td>화공생명공학 요소실험Ⅰ (CBE3015)<br>화공생명공학 요소실험Ⅱ (CBE3016)</td><td>유체·열전달·물질전달·반응 등 단위조작 장치 실험</td></tr>
<tr><td>4학년</td><td>화공생명공학 공정실험 (CBE4017)</td><td>여러 단위조작을 묶은 공정 운전과 해석, 설계와의 연결</td></tr>
</tbody></table>
<h2>실험실 안전</h2>
<ul>
<li>실험 전 안전교육을 이수해야 하며, 실험복과 보안경은 매 실험 착용이 원칙입니다.</li>
<li>샌들·반바지 등 노출이 많은 복장으로는 실험실에 들어갈 수 없습니다.</li>
<li>사고·누출이 발생하면 즉시 담당 조교와 학과사무실(02-705-8474)에 알립니다.</li>
<li>시약과 폐액은 지정된 용기에만 버립니다.</li>
</ul>
<h2>일정</h2>
<p>조 편성, 실험 날짜·장소, 보고서 마감은 매 학기 <a href="/ko/board/academic">학사공지</a>에 올라갑니다.</p>`,
    en: `<p class="text-xl font-semibold text-sg-ink">Laboratory courses run for three consecutive years — years 2, 3 and 4 — so students see how the equations behave on real equipment.</p>
<h2>Laboratory courses</h2>
<table><thead><tr><th>Year</th><th>Course</th><th>Focus</th></tr></thead><tbody>
<tr><td>2</td><td>Basic CBE Laboratory I (CBE2008)<br>Basic CBE Laboratory II (CBE2009)</td><td>Measurement and data handling, material and energy balances, basic chemistry and biochemistry</td></tr>
<tr><td>3</td><td>Unit-Operation Laboratory I (CBE3015)<br>Unit-Operation Laboratory II (CBE3016)</td><td>Fluid flow, heat and mass transfer, reaction — unit operations on real apparatus</td></tr>
<tr><td>4</td><td>Process Laboratory (CBE4017)</td><td>Operating and analyzing integrated processes, linked to capstone design</td></tr>
</tbody></table>
<h2>Laboratory safety</h2>
<ul>
<li>Safety training is required before entering the lab; lab coat and safety glasses are mandatory.</li>
<li>Open shoes and shorts are not permitted.</li>
<li>Report any incident or spill immediately to the teaching assistant and the department office.</li>
<li>Dispose of reagents and waste only in the designated containers.</li>
</ul>
<p>Group assignments, dates, rooms and report deadlines are posted each semester under <a href="/en/board/academic">Academic Notice</a>.</p>`,
  },
  'undergraduate/calendar': { ko: '', en: '' },
  'undergraduate/activities': {
    ko: `<p class="break-keep">물론 학과 수업이 우선입니다. 1학년 때는 공학 기초과목을 배우고, 2·3학년에서는 화공생명공학의 심화 과정을 학습합니다. 강의와 함께 전공과 연관된 실험·실습을 통해 구체적이고 효과적으로 전공과정을 익히며, 4학년에서는 다양한 전공선택 과정을 통해 취업과 대학원 진학 등 진로를 결정합니다. 그리고 그 사이에, 사람이 남는 시간이 있습니다.</p>
<h2>학과 행사</h2>
<table><tbody>
<tr><th>3월</th><td><strong>개강총회</strong> 한 학기 행사를 정하고 간부를 선출합니다. <strong>총MT·신입생MT</strong> 교수님과 재학생, 신입생이 함께 갑니다.</td></tr>
<tr><th>4월~</th><td><strong>Happy Hour</strong> 학년별로 교수진·동문 선배와 만나 학교생활과 직장생활의 경험을 나눕니다. (매월)</td></tr>
<tr><th>6월</th><td><strong>종강총회</strong> 1학기를 마무리하고 2학기 간부를 선출합니다. <strong>졸업파티</strong> 4학년과 교수진이 함께하는 저녁 자리입니다.</td></tr>
<tr><th>9월</th><td><strong>개강총회</strong> 2학기 행사를 공유합니다.</td></tr>
<tr><th>10월</th><td><strong>일일호프</strong> 신입생들이 직접 운영하는 행사입니다.</td></tr>
<tr><th>11월</th><td><strong>화공생명공학과 축제</strong> 1년 중 가장 큰 행사입니다. 화공 체육대회, 선배님들과의 대화, 화공인의 날 등으로 재학생과 대학원생이 함께합니다. <strong>홈커밍데이</strong> 졸업생·재학생·교수진이 모입니다.</td></tr>
<tr><th>12월</th><td><strong>종강총회</strong> 2학기를 마무리합니다.</td></tr>
</tbody></table>
<h2>학교 행사</h2>
<table><tbody>
<tr><th>3월 해오름제</th><td>총학·단과대·학과 대표자를 소개하고 신입생과 어우러지는 학교 주관 행사입니다.</td></tr>
<tr><th>5월 대동제</th><td>과티 경연대회, 과주점, 본 판 공연이 이어지는 봄 축제입니다.</td></tr>
<tr><th>11월 서강문화제</th><td>서강문화축제·국제문화축제·서강영화제로 이어지는 문화 교류의 시간입니다.</td></tr>
</tbody></table>
<h2>진로와 연결된 활동</h2>
<table><tbody>
<tr><th>공장견학</th><td>3·4학년 중심으로 동문 선배가 많이 진출한 기업의 공장을 방문해 업계 현황과 진로를 듣습니다.</td></tr>
<tr><th>취업 세미나</th><td>주로 4학년을 대상으로 동문 선배가 방문해 취업 관련 세미나와 강좌를 진행합니다.</td></tr>
<tr><th>학부 연구 참여</th><td>관심 있는 연구실에 미리 들어가 연구를 경험할 수 있습니다. <a href="/ko/about/labs">연구실</a> 목록을 보고 지도교수에게 직접 문의하세요.</td></tr>
</tbody></table>`,
    en: `<p>Coursework comes first — engineering fundamentals in year 1, the core of chemical and biomolecular engineering in years 2 and 3, laboratory work alongside lectures, and electives in year 4 that shape the path to employment or graduate school. In between, there is the rest of student life.</p>
<h2>Department events</h2>
<table><tbody>
<tr><th>March</th><td><strong>Opening assembly</strong> and department retreats with faculty, students and the incoming class.</td></tr>
<tr><th>From April</th><td><strong>Happy Hour</strong> — monthly meetings by year group with faculty and alumni to share experience of study and work.</td></tr>
<tr><th>June</th><td><strong>Closing assembly</strong> and a <strong>graduation dinner</strong> for the final-year class with the faculty.</td></tr>
<tr><th>October</th><td><strong>One-day pub</strong>, organized by the first-year students.</td></tr>
<tr><th>November</th><td><strong>Department festival</strong> — the largest event of the year, with a sports day, talks with alumni and CBE Day — and <strong>Homecoming Day</strong>.</td></tr>
<tr><th>December</th><td><strong>Closing assembly</strong> for the fall semester.</td></tr>
</tbody></table>
<h2>University events</h2>
<table><tbody>
<tr><th>March — Haeoreum</th><td>The university welcome festival, introducing student representatives and the incoming class.</td></tr>
<tr><th>May — Daedongje</th><td>The spring festival: class T-shirt contest, department pubs and the main stage.</td></tr>
<tr><th>November — Sogang Culture Festival</th><td>Culture, international and film festivals.</td></tr>
</tbody></table>
<h2>Career-related activities</h2>
<table><tbody>
<tr><th>Plant visits</th><td>Years 3–4 visit plants of companies where many alumni work.</td></tr>
<tr><th>Career seminars</th><td>Alumni return to run seminars, mainly for final-year students.</td></tr>
<tr><th>Undergraduate research</th><td>Join a laboratory early. See the <a href="/en/about/labs">Laboratories</a> list and contact the advisor directly.</td></tr>
</tbody></table>`,
  },
};
