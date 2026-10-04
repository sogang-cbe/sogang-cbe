'use client';
import { useState } from 'react';
import { ugPlans, planYears } from '@/content/courses';
import type { Locale } from '@/lib/i18n';

/** 학번별 이수 계획표 — 옛 사이트의 13개 페이지를 선택 버튼 하나로 합쳤다.
 *  표는 원본 구조를 그대로 보존한다(2022학번부터 행렬형, 그 이전은 학기별 목록형). */
export default function CurriculumPlans({ locale }: { locale: Locale }) {
  const ko = locale === 'ko';
  const [year, setYear] = useState(planYears[0]);
  const plan = ugPlans[year];

  const label = (y: string) => (y.startsWith('2013') ? (ko ? '2013 이전' : 'Before 2013') : ko ? `${y}학번` : y);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={ko ? '학번 선택' : 'Entry year'}>
        {planYears.map((y) => (
          <button
            key={y} type="button" onClick={() => setYear(y)} aria-pressed={y === year}
            className={`px-3.5 py-2 text-[13.5px] font-semibold border transition-colors tabular-nums ${
              y === year
                ? 'bg-sg-cardinal text-white border-sg-cardinal'
                : 'bg-white text-sg-gray11 border-sg-line hover:border-sg-cardinal hover:text-sg-cardinal'
            }`}
          >
            {label(y)}
          </button>
        ))}
      </div>

      <div className="mt-7">
        {!plan ? (
          <p className="text-[15px] text-sg-gray9">{ko ? '이 학번의 계획표가 아직 없습니다.' : 'No plan available for this year yet.'}</p>
        ) : (
          <div className="overflow-x-auto border border-sg-line">
            <table className="min-w-full w-auto border-collapse text-[13.5px]">
              <tbody>
                {plan.grid.map((row, ri) => (
                  <tr key={ri} className={ri === 0 ? 'bg-sg-mist font-semibold' : ''}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={`border border-sg-line px-3 py-2 align-top break-keep whitespace-pre-line ${cell.length <= 4 ? 'whitespace-nowrap text-center w-px' : 'min-w-[150px]'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-[12.5px] text-sg-gray9">
          {ko ? '옛 홈페이지의 해당 학번 페이지를 그대로 옮긴 표입니다. 학사 규정이 우선합니다.' : 'Transferred from the previous site. Official academic regulations take precedence.'}
        </p>
      </div>
    </div>
  );
}
