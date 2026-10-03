'use server';
import { createClient } from '@/lib/supabase-server';
import { currentMember, isApproved } from '@/lib/members';
import { revalidatePath } from 'next/cache';

const KST = 'Asia/Seoul';
export const todayKST = () => new Date(new Date().toLocaleString('en-US', { timeZone: KST })).toISOString().slice(0, 10);

async function gate() {
  const me = await currentMember();
  if (!me?.member || !isApproved(me.member)) throw new Error('승인된 구성원만 예약할 수 있습니다.');
  return me.email;
}

/** 장비 예약 신청. 담당자 승인이 필요한 장비는 'pending', 그 밖은 바로 확정된다. */
export async function book(fd: FormData) {
  const email = await gate();
  const sb = createClient();
  const equipment_id = Number(fd.get('equipment_id'));
  const date = String(fd.get('date') || '');
  const start_time = String(fd.get('start_time') || '');
  const end_time = String(fd.get('end_time') || '');
  const purpose = String(fd.get('purpose') || '').slice(0, 200);
  if (!equipment_id || !date || !start_time || !end_time) return { error: '날짜와 시간을 입력해 주세요.' };
  if (end_time <= start_time) return { error: '종료 시각이 시작 시각보다 빨라요.' };
  if (date < todayKST()) return { error: '지난 날짜는 예약할 수 없습니다.' };

  const { data: eq } = await sb.from('equipment').select('needs_approval,open_from,open_to,min_slot').eq('id', equipment_id).single();
  if (!eq) return { error: '장비를 찾을 수 없습니다.' };
  if (eq.open_from && start_time < String(eq.open_from).slice(0, 5)) return { error: `이 장비는 ${String(eq.open_from).slice(0, 5)} 이후에만 예약할 수 있습니다.` };
  if (eq.open_to && end_time > String(eq.open_to).slice(0, 5)) return { error: `이 장비는 ${String(eq.open_to).slice(0, 5)} 까지만 예약할 수 있습니다.` };

  const { error } = await sb.from('equipment_reservations').insert({
    equipment_id, member_email: email, date, start_time, end_time, purpose,
    status: eq.needs_approval ? 'pending' : 'approved',
  });
  if (error) {
    // 배타 제약(eq_resv_no_overlap)에 걸리면 이미 다른 사람이 그 시간에 예약한 것이다
    if (/eq_resv_no_overlap|exclusion/i.test(error.message)) return { error: '그 시간에는 이미 예약이 있습니다. 다른 시간을 골라 주세요.' };
    return { error: error.message };
  }
  revalidatePath(`/ko/equipment/${equipment_id}`); revalidatePath('/ko/equipment');
  return { ok: true };
}

/** 본인 예약 취소. */
export async function cancel(fd: FormData): Promise<void> {
  const email = await gate();
  const sb = createClient();
  const id = Number(fd.get('id'));
  await sb.from('equipment_reservations').update({ status: 'cancelled' }).eq('id', id).eq('member_email', email);
  revalidatePath('/ko/equipment');
}

/** QR 체크인·체크아웃. 장비 앞 QR을 찍으면 이 동작이 실행된다. */
export async function checkInOut(fd: FormData): Promise<void> {
  const email = await gate();
  const sb = createClient();
  const id = Number(fd.get('id'));
  const out = fd.get('out') === '1';
  const { data: r } = await sb.from('equipment_reservations').select('id,checked_in_at,equipment_id').eq('id', id).eq('member_email', email).maybeSingle();
  if (!r) return;        // 본인 예약이 아니면 아무 일도 하지 않는다
  const patch = out ? { checked_out_at: new Date().toISOString() } : { checked_in_at: new Date().toISOString(), no_show: false };
  await sb.from('equipment_reservations').update(patch).eq('id', id);
  revalidatePath('/ko/equipment');
  revalidatePath(`/ko/equipment/${r.equipment_id}`);
}
