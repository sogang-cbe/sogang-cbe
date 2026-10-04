import PageHero from '@/components/PageHero';
import Link from '@/components/Link';
import MemberLogin from '@/components/MemberLogin';
import { createClient } from '@/lib/supabase-server';
import { currentMember, isApproved } from '@/lib/members';
import { t, type Locale } from '@/lib/i18n';
import { checkInOut } from '../actions';

export const dynamic = 'force-dynamic';

/** 장비 앞 QR이 가리키는 화면: /ko/equipment/check?e=3&k=<토큰>
 *  오늘 그 장비에 예약된 내 예약을 찾아 체크인·체크아웃 버튼만 보여 준다. */
export default async function Check({ params, searchParams }: { params: { locale: Locale }; searchParams: { e?: string; k?: string } }) {
  const l = params.locale; const ko = l === 'ko';
  const me = await currentMember();
  const qs = `?e=${searchParams.e || ''}&k=${searchParams.k || ''}`;

  if (!me) return <Shell locale={l} title={ko ? '로그인이 필요합니다' : 'Sign in required'}>
    <MemberLogin next={`/${l}/equipment/check${qs}`} locale={l} />
  </Shell>;
  if (!isApproved(me.member)) return <Shell locale={l} title={ko ? '승인 대기 중입니다' : 'Waiting for approval'}>
    <p className="text-[15px] text-sg-gray11 break-keep">{ko ? '행정실 승인 후 체크인할 수 있습니다.' : 'You can check in once the office approves your account.'}</p>
  </Shell>;

  const sb = createClient();
  const { data: eq } = await sb.from('equipment').select('id,name_ko,name_en,qr_token,location').eq('id', Number(searchParams.e || 0)).maybeSingle();
  if (!eq || (eq.qr_token && searchParams.k !== eq.qr_token)) return <Shell locale={l} title={ko ? 'QR을 다시 확인해 주세요' : 'Invalid QR code'}>
    <p className="text-[15px] text-sg-gray11 break-keep">{ko ? '장비에 붙어 있는 QR이 맞는지 확인하고, 그래도 안 되면 행정실(02-705-8474)로 알려 주세요.' : 'Please check the QR code on the instrument.'}</p>
    <Link href={`/${l}/equipment`} className="btn-ghost mt-6">{ko ? '장비 목록' : 'Instruments'}</Link>
  </Shell>;

  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })).toISOString().slice(0, 10);
  const { data: mine } = await sb.from('equipment_reservations')
    .select('id,start_time,end_time,status,checked_in_at,checked_out_at')
    .eq('equipment_id', eq.id).eq('member_email', me.email).eq('date', today)
    .in('status', ['pending', 'approved']).order('start_time');

  const open = (mine || []).find((r: any) => !r.checked_out_at);

  return <Shell locale={l} title={t(eq, 'name', l)}>
    <p className="text-[14px] text-sg-gray9">{eq.location} · {today}</p>
    {!open ? (<>
      <p className="mt-5 text-[15px] text-sg-gray11 break-keep">
        {ko ? '오늘 이 장비에 예약된 내 시간이 없습니다. 먼저 예약한 뒤 다시 QR을 찍어 주세요.' : 'You have no booking for this instrument today. Please book first.'}
      </p>
      <Link href={`/${l}/equipment/${eq.id}`} className="btn-primary mt-6">{ko ? '예약하기' : 'Book'}</Link>
    </>) : (<>
      <p className="mt-5 text-[15px] tabular-nums">{String(open.start_time).slice(0, 5)}–{String(open.end_time).slice(0, 5)}</p>
      <form action={checkInOut} className="mt-6">
        <input type="hidden" name="id" value={open.id} />
        <input type="hidden" name="out" value={open.checked_in_at ? '1' : '0'} />
        <button className="btn-primary !py-4 !px-8 !text-[17px] w-full justify-center">
          {open.checked_in_at ? (ko ? '사용 종료 (체크아웃)' : 'Check out') : (ko ? '사용 시작 (체크인)' : 'Check in')}
        </button>
      </form>
      <p className="mt-4 text-[13px] text-sg-gray9 break-keep">
        {open.checked_in_at
          ? (ko ? `${new Date(open.checked_in_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} 에 체크인했습니다. 끝나면 꼭 체크아웃해 주세요.` : 'Checked in. Remember to check out.')
          : (ko ? '체크인하면 사용 기록이 남습니다. 예약 시간이 지나도 체크인이 없으면 노쇼로 집계됩니다.' : 'Checking in records your usage. Bookings without check-in are counted as no-shows.')}
      </p>
    </>)}
    <Link href={`/${l}/equipment`} className="mt-8 inline-block text-[14px] text-sg-gray11 hover:text-sg-cardinal">← {ko ? '내 예약 보기' : 'My reservations'}</Link>
  </Shell>;
}

function Shell({ locale, title, children }: { locale: Locale; title: string; children: React.ReactNode }) {
  return (<>
    <PageHero locale={locale} section="facility" current="equipment" title={title} />
    <div className="container-narrow py-14">{children}</div>
  </>);
}
