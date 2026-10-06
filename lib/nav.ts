import type { Locale } from './i18n';
export type NavItem = { id: string; ko: string; en: string; href: string; sub?: NavItem[] };
export const nav: NavItem[] = [
  { id: 'about', ko: '화공생명공학과', en: 'About', href: '/about/intro', sub: [
    { id: 'intro', ko: '학과소개', en: 'Introduction', href: '/about/intro' },
    { id: 'history', ko: '연혁', en: 'History', href: '/about/history' },
    { id: 'competency', ko: '전공능력', en: 'Program Outcomes', href: '/about/competency' },
    { id: 'location', ko: '오시는 길', en: 'Location', href: '/about/location' },
  ]},
  { id: 'faculty', ko: '구성원', en: 'People', href: '/faculty', sub: [
    { id: 'professors', ko: '교수진', en: 'Professors', href: '/faculty' },
    { id: 'emeritus', ko: '명예교수', en: 'Emeritus', href: '/faculty/emeritus' },
    { id: 'chair', ko: '석학교수', en: 'Distinguished Professor', href: '/faculty/chair' },
    { id: 'staff', ko: '행정실', en: 'Department Office', href: '/about/staff' },
  ]},
  { id: 'research', ko: '연구', en: 'Research', href: '/about/labs', sub: [
    { id: 'labs', ko: '연구실', en: 'Laboratories', href: '/about/labs' },
    { id: 'centers', ko: '연구센터', en: 'Research Centers', href: '/about/centers' },
    { id: 'results', ko: '연구성과', en: 'Research Highlights', href: '/board/research' },
  ]},
  { id: 'undergraduate', ko: '학부과정', en: 'Undergraduate', href: '/undergraduate/curriculum', sub: [
    { id: 'curriculum', ko: '교과과정', en: 'Curriculum', href: '/undergraduate/curriculum' },
    { id: 'courses', ko: '교과목 안내', en: 'Course Catalog', href: '/undergraduate/courses' },
    { id: 'rules', ko: '학사규정', en: 'Academic Regulations', href: '/undergraduate/rules' },
    { id: 'lab', ko: '학부실험', en: 'Undergraduate Labs', href: '/undergraduate/lab' },
    { id: 'calendar', ko: '학사일정', en: 'Academic Calendar', href: '/undergraduate/calendar' },
    { id: 'activities', ko: '학생활동', en: 'Student Activities', href: '/undergraduate/activities' },
  ]},
  { id: 'graduate', ko: '대학원과정', en: 'Graduate', href: '/graduate/admission', sub: [
    { id: 'admission', ko: '입학안내', en: 'Admission', href: '/graduate/admission' },
    { id: 'curriculum', ko: '교과과정', en: 'Curriculum', href: '/graduate/curriculum' },
    { id: 'rules', ko: '학사규정', en: 'Academic Regulations', href: '/graduate/rules' },
    { id: 'students', ko: '재학생 소개', en: 'Graduate Students', href: '/board/grad_intro' },
    { id: 'bk21', ko: 'BK21 교육연구팀', en: 'BK21 FOUR Program', href: 'http://bk21cheme.sogang.ac.kr' },   // 외부 사이트
  ]},
  { id: 'board', ko: '학과게시판', en: 'Board', href: '/board/academic', sub: [
    { id: 'academic', ko: '학사공지', en: 'Academic Notice', href: '/board/academic' },
    { id: 'scholarship', ko: '장학·취업', en: 'Scholarship & Careers', href: '/board/scholarship' },
    { id: 'research', ko: '연구성과', en: 'Research', href: '/board/research' },
    { id: 'seminar', ko: '세미나', en: 'Seminar', href: '/board/seminar' },
    { id: 'gallery', ko: '갤러리', en: 'Gallery', href: '/board/gallery' },
    { id: 'archive', ko: '자료실', en: 'Downloads', href: '/board/archive' },
  ]},
  { id: 'facility', ko: '예약', en: 'Reservation', href: '/equipment', sub: [
    { id: 'equipment', ko: '공용장비', en: 'Shared Instruments', href: '/equipment' },
    { id: 'rooms', ko: '학과회의실', en: 'Meeting Room', href: '/reservation' },
  ]},
];
export const label = (item: { ko: string; en: string }, l: Locale) => (l === 'en' ? item.en : item.ko);
/** 외부 링크(BK21 등)는 로케일 접두어 없이 새 탭으로 연다. */
export const isExternal = (href: string) => href.startsWith('http');
export const boards = ['academic', 'scholarship', 'research', 'seminar', 'gallery', 'archive', 'grad_intro', 'internal'] as const;
/** Which nav section/sub a board belongs to (for hero + tabs). */
export const boardSection: Record<string, [string, string]> = {
  research: ['research', 'results'], grad_intro: ['graduate', 'students'],
};
/** 관리자 전용 게시판 — 메뉴에 노출하지 않는다. 옛 교수게시판·학과회의록·공문서 92건의 보존처. */
export const adminOnlyBoards = ['internal'] as const;
/** 로그인(구성원) 전용 게시판. */
export const memberOnlyBoards = ['archive'] as const;
export type Board = (typeof boards)[number];
/** 예약 대상 시설. 화공과는 현재 학과회의실(R521A) 하나. 공용장비는 별도 모듈(/equipment)에서 다룬다. */
export const facilities = [
  { id: 'meeting', ko: '학과회의실 (R521A)', en: 'Meeting room (R521A)' },
];
/** 기계과에서 물려받은 상수 — 화공과에서는 쓰지 않는다. 관련 화면 제거 후 함께 삭제한다. */
export const festivalCategories: { id: string; ko: string; en: string }[] = [];
export const urecaTerms: { id: string; ko: string; en: string }[] = [];
