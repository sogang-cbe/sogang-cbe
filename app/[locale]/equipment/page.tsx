import PageHero from '@/components/PageHero';
import Link from '@/components/Link';
import MemberLogin from '@/components/MemberLogin';
import MemberProfile from '@/components/MemberProfile';
import { createClient } from '@/lib/supabase-server';
import { currentMember, isApproved, roleLabel } from '@/lib/members';
import { t, type Locale } from '@/lib/i18n';
import { cancel } from './actions';

export const dynamic = 'force-dynamic';   // 로그인 상태에 따라 내용이 달라진다

/** 공용장비 — 승인된 구성원(대학원생·교수·행정실)만 볼 수 있다. */
export default async function Equipment({ params, searchParams }: { params: { locale: Locale }; searchParams: { login?: string } }) {
  const l = params.locale; const ko = l === 'ko';
  const me = await currentMember();

  if (!me) return (
    <Gate locale={l}>
      {searchParams.login === 'domain' && <p className="mb-5 border-l-4 border-sg-cardinal bg-white px-4 py-3 text-[14px] break-keep">{ko ? '서강대학교 계정(@sogang.ac.kr)으로만 로그인할 수 있습니다.' : 'Only @sogang.ac.kr accounts can sign in.'}</p>}
      {searchParams.login === 'failed' && <p className="mb-5 border-l-4 border-sg-cardinal bg-white px-4 py-3 text-[14px] break-keep">{ko ? '로그인이 완료되지 않았습니다. 다시 시도해 주세요.' : 'Sign-in did not complete. Please try again.'}</p>}
      <MemberLogin next={`/${l}/equipment`} locale={l} />
    </Gate>
  );

  if (!isApproved(me.member)) return (
    <Gate locale={l} title={ko ? '승인을 기다리고 있습니다' : 'Waiting for approval'}>
      <p className="text-[15px] text-sg-gray11 break-keep">
        {ko
          ? `${me.email} 으로 로그인했습니다. 행정실이 대학원생·교수 여부를 확인하면 장비 목록과 예약이 열립니다. 보통 근무시간 안에 처리됩니다.`
          : `Signed in as ${me.email}. The department office will confirm your status, after which the instrument list and booking open up.`}
      </p>
      <div className="mt-6"><MemberProfile email={me.email} name={me.member?.name || ''} lab={me.member?.lab || ''} locale={l} /></div>
      <p className="mt-6 text-[13.5px] text-sg-gray9">{ko ? `현재 상태: ${roleLabel(me.member?.role || 'pending', true)} · 문의 02-705-8474` : `Status: ${roleLabel(me.member?.role || 'pending', false)}`}</p>
    </Gate>
  );

  const sb = createClient();
  const [{ data: list }, { data: mine }] = await Promise.all([
    sb.from('equipment').select('*').eq('published', true).order('sort_order').order('id'),
    sb.from('equipment_reservations').select('id,equipment_id,date,start_time,end_time,status,checked_in_at,checked_out_at,no_show')
      .eq('member_email', me.email).gte('date', new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10))
      .order('date').order('start_time'),
  ]);
  const eqName = (id: number) => { const e = (list || []).find((x: any) => x.id === id); return e ? t(e, 'name', l) : `#${id}`; };

  return (<>
    <PageHero locale={l} section="facility" current="equipment" />
    <div className="container-site py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <p className="text-[15px] text-sg-gray11 break-keep max-w-2xl">
          {ko
            ? '학과 공용장비는 구성원 누구나 무료로 쓸 수 있습니다. 예약한 시간에 장비 앞 QR을 찍어 체크인하고, 끝나면 체크아웃해 주세요. 사용 기록은 장비 관리와 소모품 계획에만 씁니다.'
            : 'Shared instruments are free for department members. Scan the QR code at the instrument to check in, and check out when you finish. Usage records are used only for maintenance planning.'}
        </p>
        <p className="text-[13px] text-sg-gray9 shrink-0">{me.email} · {roleLabel(me.member!.role, ko)}</p>
      </div>

      {(mine || []).filter((r: any) => r.status !== 'cancelled').length > 0 && (
        <section className="mb-12 border border-sg-line bg-white">
          <h2 className="px-5 md:px-7 py-4 border-b border-sg-line font-brand text-[1.3rem]">{ko ? '내 예약' : 'My reservations'}</h2>
          <ul className="divide-y divide-sg-line">
            {(mine || []).filter((r: any) => r.status !== 'cancelled').map((r: any) => (
              <li key={r.id} className="px-5 md:px-7 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold break-keep">{eqName(r.equipment_id)}</p>
                  <p className="text-[13.5px] text-sg-gray11 tabular-nums">
                    {r.date} {String(r.start_time).slice(0, 5)}–{String(r.end_time).slice(0, 5)}
                    <span className="ml-2">{statusChip(r, ko)}</span>
                  </p>
                </div>
                {r.status !== 'rejected' && !r.checked_out_at && (
                  <form action={cancel} className="shrink-0">
                    <input type="hidden" name="id" value={r.id} />
                    <button className="btn-ghost !py-1.5 !px-3 !text-[13px]">{ko ? '취소' : 'Cancel'}</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(list || []).length === 0 ? (
        <p className="text-sg-gray9 break-keep">{ko ? '등록된 장비가 아직 없습니다. 행정실에서 장비를 등록하면 여기에 나타납니다.' : 'No instruments registered yet.'}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(list || []).map((e: any) => (
            <Link key={e.id} href={`/${l}/equipment/${e.id}`} className="card p-5 flex flex-col hover:border-sg-ink">
              <p className="eyebrow">{e.model || (ko ? '공용장비' : 'Shared instrument')}</p>
              <h3 className="mt-1.5 font-bold text-[17px] break-keep">{t(e, 'name', l)}</h3>
              {e.location && <p className="mt-1 text-[13.5px] text-sg-gray9">{e.location}</p>}
              {t(e, 'note', l) && <p className="mt-3 text-[14px] text-sg-gray11 leading-relaxed break-keep line-clamp-3">{t(e, 'note', l)}</p>}
              <span className="mt-auto pt-4 text-[14px] font-semibold text-sg-cardinal">{ko ? '예약하기 →' : 'Book →'}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  </>);
}

function statusChip(r: any, ko: boolean) {
  const cls = 'text-[12px] px-2 py-0.5 border';
  if (r.checked_out_at) return <span className={`${cls} border-sg-line text-sg-gray9`}>{ko ? '사용 완료' : 'Finished'}</span>;
  if (r.checked_in_at) return <span className={`${cls} border-sg-cardinal text-sg-cardinal font-semibold`}>{ko ? '사용 중' : 'In use'}</span>;
  if (r.no_show) return <span className={`${cls} border-sg-line text-sg-gray9`}>{ko ? '노쇼' : 'No-show'}</span>;
  if (r.status === 'pending') return <span className={`${cls} border-sg-line text-sg-gray11`}>{ko ? '승인 대기' : 'Pending'}</span>;
  if (r.status === 'rejected') return <span className={`${cls} border-sg-line text-sg-gray9`}>{ko ? '반려' : 'Rejected'}</span>;
  return <span className={`${cls} border-sg-line text-sg-gray11`}>{ko ? '예약 확정' : 'Confirmed'}</span>;
}

function Gate({ locale, title, children }: { locale: Locale; title?: string; children: React.ReactNode }) {
  const ko = locale === 'ko';
  return (<>
    <PageHero locale={locale} section="facility" current="equipment" narrow />
    <div className="container-narrow py-16">
      <h2 className="font-brand text-[1.8rem] md:text-[2.2rem] leading-tight break-keep">{title || (ko ? '구성원만 볼 수 있는 화면입니다' : 'Members only')}</h2>
      <p className="mt-3 text-[15px] text-sg-gray11 break-keep">
        {ko ? '학과 공용장비 목록과 예약은 대학원생·교수·행정실만 이용할 수 있습니다. 서강대학교 구글 계정으로 로그인해 주세요.' : 'The shared-instrument list and booking are available to graduate students, faculty and staff. Please sign in with your Sogang Google account.'}
      </p>
      <div className="mt-8">{children}</div>
    </div>
  </>);
}
