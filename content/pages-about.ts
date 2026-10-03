import type { PageContent } from './types';

/** 학과소개·전공능력·행정실 등 '화공생명공학과' 섹션의 고정 글.
 *  출처: 옛 홈페이지 kor/sub/01_01.php(학과소개·전공능력), 01_03.php(오시는 길), 02_03.php(직원).
 *  연혁(about/history)·연구센터(about/centers)·연구실(about/labs)·오시는 길(about/location)은
 *  전용 컴포넌트가 그리므로 본문을 비워 둔다. */
export const about: Record<string, PageContent> = {
  'about/intro': {
    ko: `
<p class="text-xl font-semibold text-sg-ink break-keep">분자 수준의 기초과학과 공학을 잇는 학문. 서강대학교 화공생명공학과는 1976년 개설 이후 50년 가까이 화학공학의 기본을 단단히 가르쳐 왔습니다.</p>
<p>서강대학교 공과대학 화공생명공학과 홈페이지를 찾아주신 여러분을 환영합니다.</p>
<p>화학공학은 전통적으로 정유, 석유화학, 정밀화학, 무기화학 등과 관련된 각종 연료와 화학제품 및 이를 생산하는 공정을 개발하는 공학 분야였으나, 최근에는 분자 수준의 기초과학과 공학을 연결하는 차별성 있는 학문 분야로 성장하여 의학, 신소재, 마이크로 전자, 신재생에너지, 환경 등으로 대상 분야가 확장되고 있습니다.</p>
<p>서강대학교 화공생명공학과는 화학공학의 전공 기초 강의와 실험 실습을 병행하여 실질적이고 충실한 학부 교육을 철저히 제공하고 있으며, 생명·신소재·환경·에너지 등의 다양한 최신 분야를 아우르기 위한 전공선택 과목을 제공하고 있습니다.</p>
<p>위의 과정을 이수한 본 학과 및 대학원 과정의 졸업생은 다양한 화학공학 관련 분야의 연구소와 기업체뿐 아니라 학교, 정부기관 등에 진출하여 사회 각계의 리더로서 활동하고 있습니다.</p>
<p>앞으로도 본 학과에 지속적인 관심을 부탁드리며, 세계로 향하는 화공생명공학과로 발전하기 위해 최선의 노력을 다하겠습니다.</p>
<p class="text-right font-semibold">서강대학교 화공생명공학과</p>
<h2>학부 교육의 특징</h2>
<table><tbody>
<tr><th>기초를 끝까지</th><td>화공수학·열역학·전달현상·반응공학의 네 기둥을 학부에서 끝까지 다룹니다. 대학원 종합시험 과목이기도 한 이 네 과목은 화학공학자의 공통 언어입니다.</td></tr>
<tr><th>2·3·4학년 연속 실험</th><td>기초실험(2학년) → 요소실험(3학년) → 공정실험(4학년)으로 3년 내내 실험이 이어집니다. 강의에서 배운 식이 실제 장치에서 어떻게 움직이는지 직접 확인합니다.</td></tr>
<tr><th>공학교육인증</th><td>2005년부터 화공생명공학 심화과정을 공학교육인증 프로그램으로 운영합니다.</td></tr>
<tr><th>넓은 선택</th><td>생명·신소재·에너지·환경·반도체 등으로 전공선택 과목이 열려 있어 4학년에서 진로에 맞춰 깊이를 선택할 수 있습니다.</td></tr>
</tbody></table>`,
    en: `
<p class="text-xl font-semibold text-sg-ink">A discipline that connects molecular-scale science with engineering. Since 1976, the Department of Chemical and Biomolecular Engineering at Sogang University has taught the fundamentals of chemical engineering without compromise.</p>
<p>Welcome to the Department of Chemical and Biomolecular Engineering, Sogang University.</p>
<p>Chemical engineering traditionally developed fuels, chemical products and the processes that make them — refining, petrochemicals, fine chemicals, inorganic chemistry. Today it has grown into a distinctive discipline bridging molecular-scale science and engineering, extending into medicine, advanced materials, microelectronics, renewable energy and the environment.</p>
<p>Our department pairs core lecture courses with hands-on laboratory work to deliver a thorough undergraduate education, and offers a wide range of electives covering life science, advanced materials, environment and energy.</p>
<p>Our graduates lead in research institutes and industry, as well as in universities and government, across the many fields related to chemical engineering.</p>
<p class="text-right font-semibold">Department of Chemical and Biomolecular Engineering, Sogang University</p>
<h2>What defines our undergraduate program</h2>
<table><tbody>
<tr><th>Fundamentals, all the way</th><td>Chemical engineering mathematics, thermodynamics, transport phenomena and reaction engineering — the four pillars, and the subjects of the graduate qualifying exam — are taught in full at undergraduate level.</td></tr>
<tr><th>Three years of laboratory</th><td>Basic labs (year 2) → unit-operation labs (year 3) → process labs (year 4). Students see how the equations behave on real equipment.</td></tr>
<tr><th>Accredited engineering program</th><td>The intensive major has been run as an accredited engineering education program since 2005.</td></tr>
<tr><th>Breadth of electives</th><td>Electives span life science, advanced materials, energy, environment and semiconductors, so students choose their depth in the final year.</td></tr>
</tbody></table>`,
  },
  'about/competency': {
    ko: `<p class="break-keep">화공생명공학과 졸업생이 갖추어야 할 여덟 가지 전공능력입니다. 교과과정과 실험 과목은 이 능력들을 기르도록 설계되어 있습니다.</p>
<table><thead><tr><th>전공능력</th><th>정의</th><th>하위능력</th></tr></thead><tbody>
<tr><th>기초지식 응용력</th><td>수학, 기초과학, 공학의 지식과 정보기술을 응용할 수 있는 능력</td><td>화공생명공학에서 활용되는 수학, 기초과학의 기본 개념 및 지식을 습득하고 이해할 수 있다.</td></tr>
<tr><th>자료분석 실험능력</th><td>자료를 이해하고 분석할 수 있는 능력 및 실험을 계획하고 수행할 수 있는 능력</td><td>화공생명공학 문제에서 주어진 자료를 이해하고 분석하여 실험을 수행할 수 있다.</td></tr>
<tr><th>설계능력</th><td>현실적 제한조건을 반영하여 시스템, 요소, 공정을 설계할 수 있는 능력</td><td>공정 모델링에 대한 기본 원리를 이해할 수 있고, 실제 공정의 최적 설계 및 운전의 조건을 발견할 수 있다.</td></tr>
<tr><th>문제구성 해결능력</th><td>공학 문제들을 인식하며, 이를 공식화하고 해결할 수 있는 능력</td><td>화공생명공학 분야의 문제들에 관한 인식과 각종 자료를 수집할 수 있으며, 이론과 도구들을 실제 공학문제에 적용할 수 있다.</td></tr>
<tr><th>학제간 협동능력</th><td>복합 학제적 팀의 한 구성원의 역할을 해낼 수 있는 능력</td><td>팀 구성원들과 협의를 통해 창의적 아이디어를 창출하고, 복합 학제적 토론을 통해 타당한 합의를 도출할 수 있다.</td></tr>
<tr><th>의사전달 능력</th><td>효과적으로 의사를 전달할 수 있는 능력</td><td>화공생명공학 지식을 바탕으로 자신의 의견을 표현할 수 있으며, 나아가 비판적 의견을 조리 있게 표현하며, 질의에 적절한 화공생명공학적 답변을 할 수 있다.</td></tr>
<tr><th>윤리의식</th><td>직업적 책임과 윤리적 책임에 대한 인식</td><td>화공생명공학 분야에서 필요한 윤리적 가치관과 도덕의식을 확립하고, 실무자로서 사회적이고 직업적인 책임의식을 확립할 수 있다.</td></tr>
<tr><th>글로벌 협동능력</th><td>세계문화에 대한 이해와 국제적으로 협동할 수 있는 능력</td><td>각국의 화공생명공학의 발전을 역사 및 문화의 관점에서 이해하고, 나아가 국제적 협동의 필요성을 인식하여 실천할 수 있다.</td></tr>
</tbody></table>`,
    en: `<p>The eight program outcomes expected of our graduates. The curriculum and laboratory sequence are designed around them.</p>
<table><thead><tr><th>Outcome</th><th>Definition</th><th>Sub-competency</th></tr></thead><tbody>
<tr><th>Applying fundamentals</th><td>Apply mathematics, basic science, engineering knowledge and information technology</td><td>Acquire and understand the mathematical and scientific concepts used in chemical and biomolecular engineering.</td></tr>
<tr><th>Data analysis &amp; experimentation</th><td>Understand and analyze data; plan and conduct experiments</td><td>Interpret and analyze data in CBE problems and carry out the corresponding experiments.</td></tr>
<tr><th>Design</th><td>Design systems, components and processes under realistic constraints</td><td>Understand process-modelling principles and identify optimal design and operating conditions for real processes.</td></tr>
<tr><th>Problem formulation &amp; solving</th><td>Identify, formulate and solve engineering problems</td><td>Recognize problems in the field, gather information, and apply theory and tools to real engineering problems.</td></tr>
<tr><th>Interdisciplinary teamwork</th><td>Function as a member of a multidisciplinary team</td><td>Generate creative ideas with teammates and reach sound agreement through interdisciplinary discussion.</td></tr>
<tr><th>Communication</th><td>Communicate effectively</td><td>Express and defend ideas grounded in CBE knowledge, and answer questions appropriately.</td></tr>
<tr><th>Professional ethics</th><td>Awareness of professional and ethical responsibility</td><td>Establish ethical values and a sense of social and professional responsibility as a practitioner.</td></tr>
<tr><th>Global collaboration</th><td>Understand world cultures and collaborate internationally</td><td>Understand the development of the field in historical and cultural context and act on the need for international collaboration.</td></tr>
</tbody></table>`,
  },
  'faculty/staff': {
    ko: `<p class="break-keep">학과사무실은 리치과학관(R) 521호에 있습니다. 학부·대학원 학사, 장학, 시설, 행사 등 학과의 모든 행정을 담당합니다.</p>
<table><thead><tr><th>담당</th><th>성명</th><th>연락처</th><th>이메일</th></tr></thead><tbody>
<tr><td>화공생명공학과 학과업무</td><td>신대희</td><td>02-705-8474</td><td>giram10@sogang.ac.kr</td></tr>
<tr><td>BK21 교육연구단 업무</td><td>최지은</td><td>02-706-8039</td><td>znch@sogang.ac.kr</td></tr>
<tr><td>에너지인력양성사업단 업무</td><td>박영주</td><td>02-705-8039</td><td>parkyj@sogang.ac.kr</td></tr>
</tbody></table>
<p>팩스 02-711-0439 · 업무시간 평일 09:00–17:30 (점심시간 12:00–13:00)</p>
<h2>무엇을 어디에 문의할까요</h2>
<table><tbody>
<tr><th>수강·졸업·학적</th><td>학과사무실 (02-705-8474). 학사 일정과 규정은 <a href="/ko/undergraduate/rules">학사규정</a> 페이지를 먼저 확인해 주세요.</td></tr>
<tr><th>학과회의실(R521A) 예약</th><td>홈페이지 <a href="/ko/reservation">예약 › 학과회의실</a>에서 직접 예약합니다.</td></tr>
<tr><th>공용장비 사용</th><td>홈페이지 <a href="/ko/equipment">예약 › 공용장비</a>에서 예약합니다. 대학원생 로그인이 필요합니다.</td></tr>
<tr><th>홈페이지 수정 요청</th><td>학과사무실로 알려 주시면 반영합니다.</td></tr>
</tbody></table>`,
    en: `<p>The department office is in Room 521, Ricci Hall (R). It handles all undergraduate and graduate administration, scholarships, facilities and events.</p>
<table><thead><tr><th>Responsibility</th><th>Name</th><th>Phone</th><th>Email</th></tr></thead><tbody>
<tr><td>Department administration</td><td>Daehee Shin</td><td>+82-2-705-8474</td><td>giram10@sogang.ac.kr</td></tr>
<tr><td>BK21 FOUR program</td><td>Ji Eun Choi</td><td>+82-2-706-8039</td><td>znch@sogang.ac.kr</td></tr>
<tr><td>Energy Workforce Program</td><td>YoungJoo Park</td><td>+82-2-705-8039</td><td>parkyj@sogang.ac.kr</td></tr>
</tbody></table>
<p>Fax +82-2-711-0439 · Office hours 09:00–17:30 on weekdays (closed 12:00–13:00)</p>`,
  },
  'research/labs': { ko: '', en: '' },      // 교수진 DB에서 표를 생성한다
  'research/centers': { ko: '', en: '' },   // content/areas.ts 로 그린다
  'about/history': { ko: '', en: '' },   // content/data/history.json 타임라인
  'about/location': { ko: '', en: '' },  // 지도 + 주소 블록
};
