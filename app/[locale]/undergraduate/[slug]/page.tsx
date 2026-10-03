import StaticPage from '@/components/StaticPage';
import AcademicCalendar from '@/components/Calendar';
import CourseCatalog from '@/components/CourseCatalog';
import CurriculumPlans from '@/components/CurriculumPlans';
import type { Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { ugCourses } from '@/content/courses';

export const revalidate = 86400;
export function generateStaticParams() { return []; }
const slugs = ['curriculum', 'courses', 'rules', 'lab', 'calendar', 'activities'];

export default async function UG({ params }: { params: { locale: Locale; slug: string } }) {
  const { locale: l, slug } = params; const ko = l === 'ko';
  if (!slugs.includes(slug)) notFound();

  if (slug === 'calendar') {
    return <StaticPage locale={l} section="undergraduate" slug="calendar"><AcademicCalendar locale={l} /></StaticPage>;
  }

  if (slug === 'curriculum') {
    return (
      <StaticPage locale={l} section="undergraduate" slug="curriculum">
        <div className="mt-10 border-t-2 border-sg-ink pt-8">
          <p className="eyebrow">{ko ? '심화과정 이수 계획표' : 'Intensive major plan'}</p>
          <h2 className="h-sub mt-2 mb-3">{ko ? '학번을 선택하세요' : 'Choose your entry year'}</h2>
          <p className="text-[15px] text-sg-gray11 mb-6 break-keep">
            {ko
              ? '입학 학번에 따라 필수과목과 이수 계획이 다릅니다. 본인 학번을 선택하면 해당 연도의 계획표가 나옵니다.'
              : 'Required courses differ by entry year. Select your year to see the corresponding plan.'}
          </p>
          <CurriculumPlans locale={l} />
        </div>
      </StaticPage>
    );
  }

  if (slug === 'courses') {
    return (
      <StaticPage locale={l} section="undergraduate" slug="courses">
        <div className="mt-10 border-t-2 border-sg-ink pt-8">
          <p className="eyebrow">{ko ? '교과목 안내' : 'Course catalog'}</p>
          <h2 className="h-sub mt-2 mb-3">{ko ? `전공 교과목 ${ugCourses.length}과목` : `${ugCourses.length} major courses`}</h2>
          <p className="text-[15px] text-sg-gray11 mb-6 break-keep">
            {ko
              ? '학수번호나 과목명으로 찾을 수 있습니다. 선수과목이 있는 과목은 함께 표시됩니다.'
              : 'Search by course code or title. Prerequisites are shown where they apply.'}
          </p>
          <CourseCatalog locale={l} level="ug" />
        </div>
      </StaticPage>
    );
  }

  return <StaticPage locale={l} section="undergraduate" slug={slug} />;
}
