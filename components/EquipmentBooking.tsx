'use client';
import { useState, useTransition } from 'react';
import { book } from '@/app/[locale]/equipment/actions';
import type { Locale } from '@/lib/i18n';

/** 장비 예약 폼. 서버에서 중복·시간대를 다시 검사하므로 여기서는 입력을 돕는 역할만 한다. */
export default function EquipmentBooking({ locale, equipmentId, today, openFrom, openTo, minSlot, needsApproval }: {
  locale: Locale; equipmentId: number; today: string; openFrom: string; openTo: string; minSlot: number; needsApproval: boolean;
}) {
  const ko = locale === 'ko';
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [pending, start] = useTransition();

  // 운영시간 안에서 min_slot 간격으로 고를 수 있는 시각
  const slots: string[] = [];
  const [fh, fm] = openFrom.split(':').map(Number);
  const [th, tm] = openTo.split(':').map(Number);
  for (let m = fh * 60 + fm; m <= th * 60 + tm; m += Math.max(15, minSlot)) {
    slots.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }

  return (
    <form
      className="border border-sg-line bg-white p-5 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        fd.set('equipment_id', String(equipmentId));
        start(async () => {
          const r = await book(fd);
          if (r?.error) setMsg({ kind: 'err', text: r.error });
          else { setMsg({ kind: 'ok', text: needsApproval ? (ko ? '신청했습니다. 담당자 승인을 기다려 주세요.' : 'Requested. Awaiting approval.') : (ko ? '예약이 확정되었습니다.' : 'Booked.') }); form.reset(); }
        });
      }}
    >
      <h2 className="font-brand text-[1.3rem]">{ko ? '예약 신청' : 'Book this instrument'}</h2>
      <label className="block text-[13px]">{ko ? '날짜' : 'Date'}
        <input name="date" type="date" required min={today} defaultValue={today} className="input mt-1" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-[13px]">{ko ? '시작' : 'From'}
          <select name="start_time" required defaultValue={slots[0]} className="input mt-1">{slots.slice(0, -1).map((s) => <option key={s} value={s}>{s}</option>)}</select>
        </label>
        <label className="block text-[13px]">{ko ? '종료' : 'To'}
          <select name="end_time" required defaultValue={slots[1]} className="input mt-1">{slots.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}</select>
        </label>
      </div>
      <label className="block text-[13px]">{ko ? '사용 목적 (선택)' : 'Purpose (optional)'}
        <input name="purpose" maxLength={200} placeholder={ko ? '예: 고분자 막 두께 측정' : 'e.g. film thickness measurement'} className="input mt-1" />
      </label>
      <button disabled={pending} className="btn-primary w-full justify-center !py-2.5">{pending ? '…' : needsApproval ? (ko ? '예약 신청' : 'Request') : (ko ? '예약하기' : 'Book')}</button>
      {msg && <p className={`text-[13px] break-keep ${msg.kind === 'err' ? 'text-sg-cardinal' : 'text-sg-gray11'}`}>{msg.text}</p>}
      <p className="text-[12.5px] text-sg-gray9 break-keep">
        {ko ? `운영시간 ${openFrom}–${openTo} · 최소 ${minSlot}분 단위` : `Open ${openFrom}–${openTo} · ${minSlot}-minute slots`}
        {needsApproval && (ko ? ' · 담당자 승인 필요' : ' · needs approval')}
      </p>
    </form>
  );
}
