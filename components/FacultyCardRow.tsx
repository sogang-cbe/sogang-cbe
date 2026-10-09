import Link from '@/components/Link';
import { t, T, type Locale } from '@/lib/i18n';
import { formatOffice } from '@/lib/buildings';

/** 가로형 카드 — 사진을 작게 쓰는 화면용.
 *  명예교수는 옛 홈페이지 사진이 100px 안팎이라 세로형(FacultyCard)의 290px 자리에 올리면
 *  뭉개진다. 사진을 다시 받을 수 없으므로 이 화면만 가로형을 유지한다. */
/** emailOnly: 연구실·연구분야·위치·전화를 빼고 이메일만 적는다(석학교수 화면). */
export default function FacultyCardRow({ f, locale, emailOnly }: { f: any; locale: Locale; emailOnly?: boolean }) {
  const ko = locale === 'ko';
  const kw: string[] = (f.keywords || '').split(',').map((x: string) => x.trim()).filter(Boolean).slice(0, 3);
  return (
    <Link href={`/${locale}/faculty/${f.id}`} className="card group relative flex min-w-0 gap-5 p-5 md:p-6 overflow-hidden">
      {/* 왼쪽 세로 선은 명예교수·석학교수 구분 없이 카디널색으로 통일(2026-10-09) */}
      <span className="absolute left-0 top-0 h-full w-1.5 bg-sg-cardinal" />
      <div className="w-[104px] h-[124px] shrink-0 bg-sg-mist overflow-hidden relative">
        {f.photo_url
          ? <img src={f.photo_url} alt="" className="w-full h-full object-cover" loading="lazy" />
          : <div className="absolute inset-0 grid place-items-center text-sg-gray5 text-3xl font-brand">{(f.name_ko || '').slice(0, 1)}</div>}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[20px] font-bold leading-tight group-hover:text-sg-cardinal transition-colors break-keep">
          {t(f, 'name', locale)} <span className="text-[14px] font-medium text-sg-gray9">{t(f, 'title', locale)}</span>{' '}{t(f, 'badge', locale) && <span className="text-[11.5px] font-semibold text-sg-cardinal border border-sg-cardinal px-1.5 py-[1px] leading-none">{t(f, 'badge', locale)}</span>}
          {t(f, 'role_note', locale) && (
            <span className="ml-2 align-middle text-[11.5px] font-semibold text-white bg-sg-cardinal px-1.5 py-0.5 leading-none">{t(f, 'role_note', locale)}</span>
          )}
        </h3>
        {f.name_en && ko && <p className="text-[12.5px] text-sg-gray9 tracking-wide">{f.name_en}</p>}
        {!emailOnly && t(f, 'lab', locale) && <p className="mt-2 text-[14.5px] font-medium leading-snug break-keep">{t(f, 'lab', locale)}</p>}
        {!emailOnly && kw.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1">
            {kw.map((k) => <li key={k} className="text-[11.5px] px-1.5 py-0.5 border border-sg-line text-sg-gray11">{k}</li>)}
          </ul>
        )}
        <dl className="mt-3 space-y-0.5 text-[13px] text-sg-gray11">
          {!emailOnly && formatOffice(f, ko) && <div className="flex gap-2"><dt className="w-10 shrink-0 text-sg-gray9">{T(locale, 'office')}</dt><dd className="truncate">{formatOffice(f, ko)}</dd></div>}
          {!emailOnly && f.tel && <div className="flex gap-2"><dt className="w-10 shrink-0 text-sg-gray9">{T(locale, 'tel')}</dt><dd>{f.tel}</dd></div>}
          {f.email && <div className="flex gap-2"><dt className="w-10 shrink-0 text-sg-gray9">{T(locale, 'email')}</dt><dd className="truncate">{f.email}</dd></div>}
        </dl>
      </div>
    </Link>
  );
}
