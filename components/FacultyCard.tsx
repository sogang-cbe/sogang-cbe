import Link from '@/components/Link';
import { t, type Locale } from '@/lib/i18n';
import { formatOffice } from '@/lib/buildings';

/** 국문 화면에서는 연구실 이름 끝의 영문 괄호를 떼어 카드가 길어지지 않게 한다.
 *  예) '광전자 나노소재 및 그린에너지 연구실(Photoelectronic … Lab)' → '광전자 나노소재 및 그린에너지 연구실' */
const shortLab = (s: string, ko: boolean) => (ko ? s.replace(/\s*\([^()]*\)\s*$/, '') : s);

/** 세로형 카드 — 사진을 카드 폭 전체로 쓰고 글을 아래에 둔다.
 *  2022년 촬영 원본이 4:5라 비율을 거기에 맞췄다. 사진이 없으면 성함 첫 글자를 옅게 넣어
 *  빈 칸처럼 보이지 않게 하고 카드 높이도 흐트러지지 않게 한다. */
export default function FacultyCard({ f, locale }: { f: any; locale: Locale }) {
  const ko = locale === 'ko';
  const lab = shortLab(t(f, 'lab', locale) || '', ko);
  const office = formatOffice(f, ko);
  const hasDetail = Boolean(lab || office || f.email);

  return (
    <Link href={`/${locale}/faculty/${f.id}`} className="group flex min-w-0 flex-col">
      <div className="relative w-full overflow-hidden bg-white border border-sg-line" style={{ aspectRatio: '4 / 5' }}>
        {f.photo_url
          ? <img src={f.photo_url} alt="" loading="lazy"
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          : <span className="absolute inset-0 grid place-items-center font-brand text-5xl text-sg-line select-none">
              {(f.name_ko || '').slice(0, 1)}
            </span>}
      </div>

      <h3 className="mt-3.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[19px] font-bold leading-tight break-keep transition-colors group-hover:text-sg-cardinal">
        {t(f, 'name', locale)}
        <span className="text-[12.5px] font-medium text-sg-gray9">{t(f, 'title', locale)}</span>
        {t(f, 'badge', locale) && <span className="text-[11.5px] font-semibold text-sg-cardinal border border-sg-cardinal px-1.5 py-[1px] leading-none">{t(f, 'badge', locale)}</span>}
        {t(f, 'role_note', locale) && (
          <span className="text-[11.5px] font-semibold text-white bg-sg-cardinal px-1.5 py-0.5 leading-none">{t(f, 'role_note', locale)}</span>
        )}
      </h3>
      {f.name_en && ko && <p className="mt-0.5 text-[12.5px] text-sg-gray9 tracking-wide">{f.name_en}</p>}

      {hasDetail && (
        <div className="mt-2.5 pt-2.5 border-t border-sg-line">
          {lab && <p className="text-[13.5px] leading-snug break-keep">{lab}</p>}
          {office && <p className="mt-1.5 text-[12px] text-sg-gray9">{office}</p>}
          {f.email && <p className="text-[12px] text-sg-gray9 truncate">{f.email}</p>}
        </div>
      )}
    </Link>
  );
}
