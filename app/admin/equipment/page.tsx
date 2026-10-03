import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { adminBase } from '@/lib/admin';
import { saveEquipment, deleteEquipment, setEquipmentReservation } from './actions';

type SP = { edit?: string; ok?: string };

/** 공용장비 관리 — 장비 등록, QR 주소 확인, 예약 승인, 사용 기록. */
export default async function EquipmentAdmin({ searchParams }: { searchParams: SP }) {
  const sb = createClient(); const b = adminBase();
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://sogang-cbe.vercel.app';
  const [{ data: list }, { data: pending }, { data: recent }] = await Promise.all([
    sb.from('equipment').select('*').order('sort_order').order('id'),
    sb.from('equipment_reservations').select('*').eq('status', 'pending').order('date').order('start_time'),
    sb.from('equipment_reservations').select('*').order('date', { ascending: false }).order('start_time', { ascending: false }).limit(40),
  ]);
  const editing = searchParams.edit ? (list || []).find((e: any) => String(e.id) === searchParams.edit) : null;
  const eqName = (id: number) => (list || []).find((e: any) => e.id === id)?.name_ko || `#${id}`;
  const hhmm = (t: any) => String(t || '').slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold">공용장비</h1>
      <p className="mt-2 text-[13.5px] text-sg-steel break-keep">
        대학원생·교수·행정실로 승인된 구성원만 장비 목록을 볼 수 있습니다. 승인은 <Link href={`${b}/members`} className="underline">구성원 승인</Link> 화면에서 합니다.
      </p>

      {(pending || []).length > 0 && (
        <section className="mt-8">
          <h2 className="font-bold">승인 대기 예약 {pending!.length}건</h2>
          <div className="mt-3 card overflow-x-auto"><table className="w-full text-[13.5px]">
            <thead><tr className="bg-sg-mist text-left"><th className="p-3">장비</th><th className="p-3">신청자</th><th className="p-3">일시</th><th className="p-3">목적</th><th className="p-3">처리</th></tr></thead>
            <tbody>{pending!.map((r: any) => (
              <tr key={r.id} className="border-t border-sg-line">
                <td className="p-3">{eqName(r.equipment_id)}</td>
                <td className="p-3 break-all">{r.member_email}</td>
                <td className="p-3 tabular-nums whitespace-nowrap">{r.date} {hhmm(r.start_time)}–{hhmm(r.end_time)}</td>
                <td className="p-3 break-keep">{r.purpose || ''}</td>
                <td className="p-3 flex gap-1.5">
                  {['approved', 'rejected'].map((a) => (
                    <form key={a} action={setEquipmentReservation}>
                      <input type="hidden" name="id" value={r.id} /><input type="hidden" name="action" value={a} />
                      <button className={`px-2 py-1 text-[12px] ${a === 'approved' ? 'btn-primary' : 'btn-ghost'}`}>{a === 'approved' ? '승인' : '반려'}</button>
                    </form>
                  ))}
                </td>
              </tr>
            ))}</tbody>
          </table></div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-bold">장비 {(list || []).length}대</h2>
        <div className="mt-3 card overflow-x-auto"><table className="w-full text-[13.5px]">
          <thead><tr className="bg-sg-mist text-left"><th className="p-3">장비</th><th className="p-3">위치</th><th className="p-3">담당</th><th className="p-3">운영</th><th className="p-3">공개</th><th className="p-3">QR 주소</th><th className="p-3"></th></tr></thead>
          <tbody>{(list || []).map((e: any) => (
            <tr key={e.id} className="border-t border-sg-line align-top">
              <td className="p-3"><span className="font-semibold">{e.name_ko}</span>{e.model && <span className="block text-[12px] text-sg-steel">{e.model}</span>}</td>
              <td className="p-3">{e.location || ''}</td>
              <td className="p-3">{e.manager || ''}</td>
              <td className="p-3 tabular-nums whitespace-nowrap">{hhmm(e.open_from)}–{hhmm(e.open_to)} / {e.min_slot}분{e.needs_approval ? ' · 승인필요' : ''}</td>
              <td className="p-3">{e.published ? 'O' : '—'}</td>
              <td className="p-3 font-mono text-[11px] break-all">{`${site}/ko/equipment/check?e=${e.id}&k=${e.qr_token || ''}`}</td>
              <td className="p-3 whitespace-nowrap"><Link href={`${b}/equipment?edit=${e.id}`} className="underline">수정</Link></td>
            </tr>
          ))}</tbody>
        </table></div>
        <p className="mt-2 text-[12.5px] text-sg-steel break-keep">
          QR 주소를 QR 코드로 만들어 장비 앞에 붙입니다(무료 QR 생성기 아무 것이나 사용 가능). 주소에 들어 있는 토큰 때문에 다른 장비의 QR로는 체크인되지 않습니다.
        </p>
      </section>

      <section className="mt-10 card p-5">
        <h2 className="font-bold">{editing ? `장비 수정 — ${editing.name_ko}` : '장비 등록'}</h2>
        <form action={saveEquipment} className="mt-4 grid gap-3 md:grid-cols-2">
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <label className="block text-[13px]">장비명 (국문)<input name="name_ko" required defaultValue={editing?.name_ko || ''} className="input mt-1" /></label>
          <label className="block text-[13px]">장비명 (영문)<input name="name_en" defaultValue={editing?.name_en || ''} className="input mt-1" /></label>
          <label className="block text-[13px]">모델<input name="model" defaultValue={editing?.model || ''} className="input mt-1" /></label>
          <label className="block text-[13px]">위치<input name="location" defaultValue={editing?.location || ''} placeholder="R521A" className="input mt-1" /></label>
          <label className="block text-[13px]">담당자<input name="manager" defaultValue={editing?.manager || ''} className="input mt-1" /></label>
          <label className="block text-[13px]">담당자 이메일<input name="manager_email" type="email" defaultValue={editing?.manager_email || ''} className="input mt-1" /></label>
          <label className="block text-[13px]">예약 시작 가능 시각<input name="open_from" type="time" defaultValue={hhmm(editing?.open_from) || '08:00'} className="input mt-1" /></label>
          <label className="block text-[13px]">예약 종료 시각<input name="open_to" type="time" defaultValue={hhmm(editing?.open_to) || '22:00'} className="input mt-1" /></label>
          <label className="block text-[13px]">최소 예약 단위(분)<input name="min_slot" type="number" min={15} step={15} defaultValue={editing?.min_slot ?? 60} className="input mt-1" /></label>
          <label className="block text-[13px]">정렬 순서<input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 100} className="input mt-1" /></label>
          <label className="block text-[13px] md:col-span-2">이용 안내 (국문)<textarea name="note_ko" rows={3} defaultValue={editing?.note_ko || ''} className="input mt-1" placeholder="교육 이수자만 사용 / 소모품은 각 연구실 부담 등" /></label>
          <label className="block text-[13px] md:col-span-2">이용 안내 (영문)<textarea name="note_en" rows={2} defaultValue={editing?.note_en || ''} className="input mt-1" /></label>
          <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" name="needs_approval" defaultChecked={!!editing?.needs_approval} /> 담당자 승인 후 확정</label>
          <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" name="published" defaultChecked={editing ? !!editing.published : true} /> 구성원에게 공개</label>
          <div className="md:col-span-2 flex gap-2">
            <button className="btn-primary">{editing ? '저장' : '등록'}</button>
            {editing && <Link href={`${b}/equipment`} className="btn-ghost">새 장비 입력으로</Link>}
          </div>
        </form>
        {editing && (
          <form action={deleteEquipment} className="mt-4 pt-4 border-t border-sg-line">
            <input type="hidden" name="id" value={editing.id} />
            <button className="text-[12.5px] text-sg-cardinal underline">이 장비 삭제 (예약 기록도 함께 지워집니다)</button>
          </form>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-bold">최근 사용 기록</h2>
        <div className="mt-3 card overflow-x-auto"><table className="w-full text-[13.5px]">
          <thead><tr className="bg-sg-mist text-left"><th className="p-3">일시</th><th className="p-3">장비</th><th className="p-3">사용자</th><th className="p-3">체크인</th><th className="p-3">체크아웃</th><th className="p-3">상태</th><th className="p-3"></th></tr></thead>
          <tbody>{(recent || []).map((r: any) => (
            <tr key={r.id} className="border-t border-sg-line">
              <td className="p-3 tabular-nums whitespace-nowrap">{r.date} {hhmm(r.start_time)}–{hhmm(r.end_time)}</td>
              <td className="p-3">{eqName(r.equipment_id)}</td>
              <td className="p-3 break-all">{r.member_email}</td>
              <td className="p-3 tabular-nums">{r.checked_in_at ? new Date(r.checked_in_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '—'}</td>
              <td className="p-3 tabular-nums">{r.checked_out_at ? new Date(r.checked_out_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '—'}</td>
              <td className="p-3">{r.no_show ? '노쇼' : r.status}</td>
              <td className="p-3">
                {!r.checked_in_at && !r.no_show && r.status !== 'cancelled' && (
                  <form action={setEquipmentReservation}>
                    <input type="hidden" name="id" value={r.id} /><input type="hidden" name="action" value="no_show" />
                    <button className="px-2 py-1 text-[12px] btn-ghost">노쇼 표시</button>
                  </form>
                )}
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      </section>
    </div>
  );
}
