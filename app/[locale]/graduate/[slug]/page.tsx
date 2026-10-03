import StaticPage from '@/components/StaticPage';
import AcademicCalendar from '@/components/Calendar';
import CourseCatalog from '@/components/CourseCatalog';
import type { Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { gradCourses } from '@/content/courses';

export const revalidate = 86400;
export function generateStaticParams() { return []; }
const slugs = ['admission', 'curriculum', 'rules', 'calendar'];

export default async function Grad({ params }: { params: { locale: Locale; slug: string } }) {
  const { locale: l, slug } = params; const ko = l === 'ko';
  if (!slugs.includes(slug)) notFound();

  if (slug === 'calendar') {
    return <StaticPage locale={l} section="graduate" slug="calendar"><AcademicCalendar locale={l} /></StaticPage>;
  }

  if (slug === 'curriculum') {
    return (
      <StaticPage locale={l} section="graduate" slug="curriculum">
        <div className="mt-10 border-t-2 border-sg-ink pt-8">
          <p className="eyebrow">{ko ? '교과목 안내' : 'Course catalog'}</p>
          <h2 className="h-sub mt-2 mb-3">{ko ? `대학원 교과목 ${gradCourses.length}과목` : `${gradCourses.length} graduate courses`}</h2>
          <p className="text-[15px] text-sg-gray11 mb-6 break-keep">
            {ko
              ? '석사·박사·석박사통합과정이 공통으로 이수하는 교과목입니다. 학수번호나 과목명으로 찾을 수 있습니다.'
              : 'Courses shared across the MS, PhD and integrated programs. Search by code or title.'}
          </p>
          <CourseCatalog locale={l} level="grad" />
        </div>
      </StaticPage>
    );
  }

  return <StaticPage locale={l} section="graduate" slug={slug} />;
}
