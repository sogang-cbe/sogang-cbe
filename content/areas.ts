/** 홈 화면과 히어로 하단 띠에 쓰는 학과 연구 영역 4개.
 *  화공과는 기계과처럼 공식 "기초 분야" 구분을 쓰지 않으므로, 실제 운영 중인 대형 연구센터를 보여준다.
 *  (출처: 옛 홈페이지 kor/sub/03_02.php — 참여교수 명단은 현황 확인 후 갱신 필요) */
export const areas = [
  { id: 'cgrc', ko: 'C1 가스 리파이너리 사업단', en: 'C1 Gas Refinery R&D Center', color: 'var(--sg-cardinal)',
    descKo: 'C1 가스를 저온·저압에서 직접 전환하는 원천기술을 확보합니다. 바이오촉매·화학촉매·리파이너리를 잇는 융복합 연구로 기초 화학소재와 수송 연료의 조기 실용화를 목표로 합니다.',
    descEn: 'Original technology for direct low-temperature, low-pressure conversion of C1 gases, bridging biocatalysis, chemical catalysis and refinery processes toward commercial chemicals and fuels.',
    keywordsKo: ['바이오촉매', '화학촉매', '리파이너리', '기술사업화'], keywordsEn: ['Biocatalysis', 'Chemical catalysis', 'Refinery', 'Commercialization'],
    lead: '이진원', members: ['나정걸', '하경수', '강태욱', '이종석', '오병근', '김충익', '김형준'], url: 'http://cgrc.sogang.ac.kr' },
  { id: 'cxenergy', ko: '에너지인력양성사업단', en: 'Energy Workforce Program', color: 'var(--sg-orange)',
    descKo: 'Cx 가스 전환을 통한 에너지화와 화학제품 생산 기술의 전문 인력을 길러냅니다. 온실가스 전환 분야의 산학협력과 CCUS 생태계 확립에 기여합니다.',
    descEn: 'Training specialists in Cx gas conversion for energy and chemical production, with industry collaboration toward a CCUS ecosystem.',
    keywordsKo: ['온실가스 전환', 'CCUS', '산학협력', '인력양성'], keywordsEn: ['GHG conversion', 'CCUS', 'Industry–academia', 'Workforce'],
    lead: '오병근', members: ['오세용', '최진훈', '하경수', '나정걸', '이종석', '허남회', '신관우'], url: 'http://cxenergy.sogang.ac.kr' },
  { id: 'bk21', ko: 'BK21 분자제어기반 화공생물공정연구팀', en: 'BK21 FOUR — Molecular-scale Control', color: 'var(--sg-blue)',
    descKo: '분자제어 화공생물공정 분야의 미래 인재를 양성하고, 국제 허브를 구축해 관련 분야의 연구와 교육을 선도합니다.',
    descEn: 'Developing future talent in molecular-scale control of chemical and biological processes, and building an international hub for research and education.',
    keywordsKo: ['분자제어', '화공생물공정', '대학원 교육', '국제협력'], keywordsEn: ['Molecular control', 'Bioprocess', 'Graduate education', 'International'],
    lead: '강태욱', members: ['김현철', '하경수', '이종석', '강문성', '박제영', '조현석'], url: 'http://bk21cheme.sogang.ac.kr' },
  { id: 'advmat', ko: '첨단소재 연구소', en: 'Advanced Materials Institute', color: 'var(--sg-teal)',
    descKo: '반도체·디스플레이·배터리에 쓰이는 첨단소재를 연구합니다. 반도체 공정 장비와 전기화학 분석 인프라를 갖추고 국내외 연구기관과 학술 교류를 추진합니다.',
    descEn: 'Advanced materials for semiconductors, displays and batteries, supported by process equipment and electrochemical analysis infrastructure.',
    keywordsKo: ['반도체 소재', '디스플레이', '배터리', '전기화학 분석'], keywordsEn: ['Semiconductor materials', 'Displays', 'Batteries', 'Electrochemical analysis'],
    lead: '강문성', members: ['이종석', '김형준', '박제영'], url: '' },
];
