import ug from './data/ug-courses.json';
import grad from './data/grad-courses.json';
import plans from './data/ug-plans.json';
import hist from './data/history.json';

/** 학부 전공 교과목 — 옛 홈페이지 kor/sub/04_0106.php(교과목 요람)에서 추출. */
export type Course = { code: string; name: string; hours?: string; credits: number; prereq?: string[]; desc: string };
export const ugCourses: Course[] = ug as Course[];

/** 대학원 교과목 — 옛 홈페이지 kor/sub/04_02.php. */
export const gradCourses: Course[] = grad as Course[];

/** 학번별 심화과정 이수 계획표.
 *  옛 사이트는 학번마다 페이지가 따로 있어 13개로 흩어져 있었다(04_01·04_0102~04_0112·04_course_2022~2025).
 *  표를 그대로 보존해 학번 선택 하나로 바뀌도록 합쳤다. */
export type Plan = { source: string; grid: string[][] } | null;
export const ugPlans: Record<string, Plan> = plans as Record<string, Plan>;
/** 최신 학번이 앞에 오도록. '2013이전'은 맨 뒤. */
export const planYears = Object.keys(ugPlans).sort((a, b) => {
  const n = (x: string) => (x.startsWith('2013') ? 0 : Number(x));
  return n(b) - n(a);
});

/** 연혁 — cs_history 테이블(1976~2020). */
export const history: { year: string; content: string }[] = (hist as any[])
  .map((h) => ({ year: String(h.year), content: h.content }))
  .sort((a, b) => Number(a.year) - Number(b.year));
