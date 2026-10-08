import PageHero from '@/components/PageHero';
import Link from '@/components/Link';
import EquipmentBooking from '@/components/EquipmentBooking';
import { createClient } from '@/lib/supabase-server';
import { currentMember, isApproved } from '@/lib/members';
import { t, type Locale } from '@/lib/i18n';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/** 장비 상세 — 일주일치 예약 현황과 신청 폼. */
export default async function EquipmentDetail({ params, searchParams }: { params: { locale: Locale; id: string }; searchParams: { d?: string } }) {
  const l = params.locale; const ko = l === 'ko';
  const me = await currentMember();
  if (!me || !isApproved(me.member)) redirect(`/${l}/equipment`);

  const sb = createClient();
  const { data: eq } = await sb.from('equipment').select('*').eq('id', Number(params.id)).maybeSingle();
  if (!eq || eq.published === false) notFound();

  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const start = searchParams.d && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.d) ? new Date(`${searchParams.d}T00:00:00`) : today;
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * 864e5).toISOString().slice(0, 10));
  const { data: rows } = await sb.from('equipment_reservations')
    .select('id,date,start_time,end_time,status,member_email,checked_in_at,checked_out_at')
    .eq('equipment_id', eq.id).in('status', ['pending', 'approved'])
    .gte('date', days[0]).lte('date', days[6]).order('date').order('start_time');

  const prev = new Date(start.getTime() - 7 * 864e5).toISOString().slice(0, 10);
  const next = new Date(start.getTime() + 7 * 864e5).toISOString().slice(0, 10);

  return (<>
    <PageHero locale={l} section="facility" current="equipment" title={t(eq, 'name', l)} narrow />
    <div className="container-narrow py-12">
      <Link href={`/${l}/equipment`} className="text-[14px] text-sg-gray11 hover:text-sg-cardinal">← {ko ? '장비 목록' : 'All instruments'}</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
        <div className="min-w-0">
          <h2 className="font-brand text-[1.4rem] mb-4">{ko ? '예약 현황' : 'Schedule'}</h2>
          <div className="flex items-center justify-between mb-3 text-[14px]">
            <Link href={`/${l}/equipment/${eq.id}?d=${prev}`} className="btn-ghost !py-1.5 !px-3 !text-[13px]">← {ko ? '지난주' : 'Prev'}</Link>
            <span className="tabular-nums text-sg-gray11">{days[0]} ~ {days[6]}</span>
            <Link href={`/${l}/equipment/${eq.id}?d=${next}`} className="btn-ghost !py-1.5 !px-3 !text-[13px]">{ko ? '다음주' : 'Next'} →</Link>
          </div>
          <ul className="border-t border-sg-line">
            {days.map((d) => {
              const items = (rows || []).filter((r: any) => r.date === d);
              const wd = ['일', '월', '화', '수', '목', '금', '토'][new Date(`${d}T00:00:00`).getDay()];
              return (
                <li key={d} className="border-b border-sg-line py-3 grid grid-cols-[86px_1fr] gap-3">
                  <span className="font-mono text-[13px] text-sg-gray9 tabular-nums">{d.slice(5)} ({wd})</span>
                  {items.length === 0 ? (
                    <span className="text-[13.5px] text-sg-gray5">{ko ? '예약 없음' : 'Free'}</span>
                  ) : (
                    <ul className="flex flex-wrap gap-1.5">
                      {items.map((r: any) => {
                        const mine = r.member_email === me.email;
                        return (
                          <li key={r.id} className={`text-[12.5px] px-2 py-1 border tabular-nums ${mine ? 'border-sg-cardinal text-sg-cardinal font-semibold' : 'border-sg-line bg-sg-mist text-sg-gray11'}`}>
                            {String(r.start_time).slice(0, 5)}–{String(r.end_time).slice(0, 5)}
                            {mine ? ` · ${ko ? '내 예약' : 'mine'}` : r.checked_in_at && !r.checked_out_at ? ` · ${ko ? '사용 중' : 'in use'}` : ''}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[12.5px] text-sg-gray9 break-keep">{ko ? '다른 사람의 예약은 시간만 보입니다. 누가 예약했는지는 장비 담당자와 행정실만 볼 수 있습니다.' : "Other members' bookings show times only." }</p>
        </div>

        <aside className="lg:sticky lg:top-[150px] self-start w-full">
          <EquipmentBooking
            locale={l} equipmentId={eq.id} today={today.toISOString().slice(0, 10)}
            openFrom={String(eq.open_from || '08:00').slice(0, 5)} openTo={String(eq.open_to || '22:00').slice(0, 5)}
            minSlot={eq.min_slot || 60} needsApproval={!!eq.needs_approval}
          />
          <dl className="mt-6 border border-sg-line bg-white p-5 grid gap-y-2 grid-cols-[88px_1fr] text-[14px]">
            {eq.model && <><dt className="text-sg-gray9">{ko ? '모델' : 'Model'}</dt><dd className="break-keep">{eq.model}</dd></>}
            {eq.location && <><dt className="text-sg-gray9">{ko ? '위치' : 'Location'}</dt><dd className="break-keep">{eq.location}</dd></>}
            {eq.manager && <><dt className="text-sg-gray9">{ko ? '담당' : 'Manager'}</dt><dd className="break-keep">{eq.manager}{eq.manager_email ? <> · <a href={`mailto:${eq.manager_email}`} className="text-sg-cardinal underline underline-offset-2 break-all">{eq.manager_email}</a></> : null}</dd></>}
          </dl>
          {t(eq, 'note', l) && (
            <div className="mt-4 border-l-4 border-sg-cardinal bg-white px-4 py-3 text-[14px] leading-relaxed break-keep whitespace-pre-line">{t(eq, 'note', l)}</div>
          )}
        </aside>
      </div>
    </div>
  </>);
}
