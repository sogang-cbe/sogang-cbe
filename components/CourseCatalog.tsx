'use client';
import { useMemo, useState } from 'react';
import { ugCourses, gradCourses, type Course } from '@/content/courses';
import type { Locale } from '@/lib/i18n';

/** 교과목 목록 — 학수번호·과목명·개요를 한 번에 훑고 검색한다.
 *  옛 사이트는 긴 한 페이지를 스크롤해야 했다. */
export default function CourseCatalog({ locale, level }: { locale: Locale; level: 'ug' | 'grad' }) {
  const ko = locale === 'ko';
  const all: Course[] = level === 'ug' ? ugCourses : gradCourses;
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return all;
    return all.filter((c) =>
      c.code.toLowerCase().includes(k) || c.name.toLowerCase().includes(k) || (c.desc || '').toLowerCase().includes(k));
  }, [q, all]);

  return (
    <div>
      <label className="block">
        <span className="sr-only">{ko ? '과목 검색' : 'Search courses'}</span>
        <input
          type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder={ko ? '학수번호 또는 과목명 (예: CBE3001, 열역학)' : 'Course code or title'}
          className="w-full border border-sg-line bg-white px-4 py-3 text-[15px] focus:border-sg-cardinal focus:outline-none"
        />
      </label>
      <p className="mt-3 text-[13px] text-sg-gray9 tabular-nums">
        {ko ? `${list.length}과목` : `${list.length} courses`}
        {q && ko && ` · '${q}' 검색 결과`}
      </p>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-[15px] text-sg-gray9">{ko ? '해당하는 과목이 없습니다.' : 'No matching courses.'}</p>
      ) : (
        <ul className="mt-6 divide-y divide-sg-line border-t border-sg-line">
          {list.map((c) => (
            <li key={c.code} className="py-5 flex flex-col sm:flex-row sm:gap-6">
              <div className="sm:w-[150px] shrink-0">
                <p className="font-mono text-[13px] font-semibold text-sg-cardinal tabular-nums">{c.code}</p>
                <p className="mt-0.5 text-[12.5px] text-sg-gray9 tabular-nums">{c.credits}{ko ? '학점' : ' cr.'}</p>
              </div>
              <div className="min-w-0 mt-2 sm:mt-0">
                <h3 className="font-bold text-[16px] break-keep">{c.name}</h3>
                {c.hours && <p className="mt-0.5 text-[12.5px] text-sg-gray9">{c.hours}</p>}
                {c.prereq && c.prereq.length > 0 && (
                  <p className="mt-1.5 text-[12.5px] text-sg-gray11">
                    <span className="font-semibold">{ko ? '선수과목' : 'Prerequisite'}</span>{' '}
                    <span className="font-mono tabular-nums">{c.prereq.join(', ')}</span>
                  </p>
                )}
                {c.desc && <p className="mt-2 text-[14.5px] leading-relaxed text-sg-gray11 break-keep">{c.desc}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
