export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ko';
export function isLocale(x: string): x is Locale { return (locales as readonly string[]).includes(x); }

/** Pick the localized field; falls back to Korean when the English version is missing. */
export function t<T extends Record<string, any>>(row: T, key: string, locale: Locale): string {
  const v = locale === 'en' ? row[`${key}_en`] || row[`${key}_ko`] : row[`${key}_ko`];
  return v ?? '';
}

/** 게시글 작성자 표시. 옛 사이트 글의 '최고관리자'·'관리자'(옛 게시판 프로그램의 기본 계정명)와 기본값은 학과 이름으로,
 *  영문 페이지에서는 영문으로 보여 준다. 그 밖의 이름은 입력한 그대로. */
export function authorLabel(author: string | null | undefined, locale: Locale): string {
  const a = (author || '').trim();
  if (!a || a === '최고관리자' || a === '관리자' || a === '화공생명공학과') return locale === 'en' ? 'Dept. of CBE' : '화공생명공학과';
  return a;
}

export const ui = {
  ko: {
    home: '홈', more: '더보기', all: '전체', search: '검색', date: '날짜', views: '조회', author: '작성자',
    attachments: '첨부파일', list: '목록', prev: '이전', next: '다음', noPosts: '등록된 게시물이 없습니다.',
    academic: '학사공지', scholarship: '장학·취업', research: '연구성과', seminar: '세미나',
    notice: '공지', award: '수상', major: '심화전공', events: '외부 행사', alumni_news: '동문 소식', promo: '홍보자료', capstone: '종합설계', festival: '학술제', videos: '영상', ureca: '학부연구', industry: '산학협력', drafting: '제도실', server: '공용서버',
    gallery: '갤러리', archive: '자료실', grad_intro: '재학생 소개', internal: '학과 아카이브', reservation: '학과회의실 예약', equipment: '공용장비',
    quick: '바로가기', meeting: '학과회의실 (R521A)',
    ugAdmission: '학부 입학', gradAdmission: '대학원 입학', contact: '문의',
    readMore: '자세히 보기', professors: '전임교수', emeritus: '명예교수', lab: '연구실', office: '위치', tel: '전화',
    email: '이메일', website: '홈페이지', field: '연구분야', reserve: '예약 신청', pending: '승인 대기', approved: '확정',
    officeHours: '학과사무실', address: '주소', fax: '팩스', privacy: '개인정보처리방침', terms: '이용약관', emailPolicy: '이메일무단수집거부',
    hero1: '서강대학교 화공생명공학과', hero2: '',
    // 홈 히어로 설명 — 두 문장을 각각 한 줄로 둔다(heroSub / heroSub2)
    heroSub: '화학공학은 정유·석유화학에서 출발해 바이오·의약, 신소재, 반도체, 에너지, 환경으로 영역을 넓혀 왔습니다.',
    heroSub2: '서강대학교 화공생명공학과는 탄탄한 기초 교육과 최전선의 연구로 그 변화를 이끌어 갈 인재를 길러냅니다.',
    since: '1976년 설립', labs: '개 연구실', profs: '명 전임교수', bk21: '4단계 BK21 교육연구팀',
    newsTitle: '학과 소식', programsTitle: '교육 프로그램', galleryTitle: '갤러리', areasTitle: '연구 분야',
    // 홈 히어로 '최신 소식' 위젯
    latestTitle: '최신 소식', latestSub: '모든 게시판의 최신 글', latestAll: '전체 소식',
    ug: '학부과정', grad: '대학원과정', equipmentNav: '공용장비',
    ugDesc: '전공 교과목 43과목, 2·3·4학년 실험 실습 병행', gradDesc: '석사·박사·통합과정, 교과목 82과목',
    equipmentDesc: '장비 예약과 사용 기록 (대학원생)', researchDesc: '18개 연구실과 4개 대형 연구센터', researchNav: '연구', urecaDesc: '', industryDesc: '',
  },
  en: {
    home: 'Home', more: 'More', all: 'All', search: 'Search', date: 'Date', views: 'Views', author: 'Author',
    attachments: 'Attachments', list: 'List', prev: 'Prev', next: 'Next', noPosts: 'No posts yet.',
    academic: 'Academic Notice', scholarship: 'Scholarship & Careers', research: 'Research', seminar: 'Seminar',
    notice: 'Notice', award: 'Awards', major: 'Advanced Major', events: 'External Events', alumni_news: 'Alumni News', promo: 'Materials', capstone: 'Capstone', festival: 'Festival', videos: 'Videos', ureca: 'URECA', industry: 'Industry', drafting: 'Drafting room', server: 'Shared servers',
    gallery: 'Gallery', archive: 'Downloads', grad_intro: 'Graduate Students', internal: 'Department Archive', reservation: 'Meeting Room', equipment: 'Shared Instruments',
    quick: 'Quick links', meeting: 'Meeting room (R521A)',
    ugAdmission: 'Undergraduate Admission', gradAdmission: 'Graduate Admission', contact: 'Contact',
    readMore: 'Read more', professors: 'Professors', emeritus: 'Emeritus', lab: 'Laboratory', office: 'Office', tel: 'Phone',
    email: 'Email', website: 'Website', field: 'Research field', reserve: 'Request a reservation', pending: 'Pending', approved: 'Confirmed',
    officeHours: 'Department Office', address: 'Address', fax: 'Fax', privacy: 'Privacy Policy', terms: 'Terms of Use', emailPolicy: 'No Unauthorized Email Collection',
    hero1: 'Sogang Chemical and Biomolecular Engineering', hero2: '',
    heroSub: 'Chemical engineering began with refining and petrochemicals and now reaches into biopharmaceuticals, advanced materials, semiconductors, energy and the environment.',
    heroSub2: 'Sogang CBE prepares the people who will lead that change, through solid fundamentals and research at the frontier.',
    since: 'Founded 1976', labs: 'research labs', profs: 'full-time faculty', bk21: 'BK21 FOUR program',
    newsTitle: 'News', programsTitle: 'Programs', galleryTitle: 'Gallery', areasTitle: 'Research areas',
    latestTitle: 'Latest News', latestSub: 'Latest across all boards', latestAll: 'All news',
    ug: 'Undergraduate', grad: 'Graduate', equipmentNav: 'Shared Instruments',
    ugDesc: '43 major courses with laboratory work in years 2–4', gradDesc: 'MS, PhD and integrated programs; 82 courses',
    equipmentDesc: 'Reserve instruments and log usage (graduate students)', researchDesc: '18 laboratories and 4 major research centers', researchNav: 'Research', urecaDesc: '', industryDesc: '',
  },
} as const;
export type UIKey = keyof typeof ui.ko;
export const T = (l: Locale, k: UIKey) => ui[l][k];
