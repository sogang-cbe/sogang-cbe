'use client';
import { useState, useTransition } from 'react';
import { saveProfile } from '@/app/[locale]/equipment/profile-actions';
import type { Locale } from '@/lib/i18n';

/** 이름·연구실만 본인이 직접 채운다. 역할(대학원생 여부)은 행정실이 정한다. */
export default function MemberProfile({ email, name, lab, locale }: { email: string; name: string; lab: string; locale: Locale }) {
  const ko = locale === 'ko';
  const [msg, setMsg] = useState('');
  const [pending, start] = useTransition();
  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end border border-sg-line bg-white p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => { const r = await saveProfile(fd); setMsg(r?.error || (ko ? '저장했습니다.' : 'Saved.')); });
      }}
    >
      <label className="block text-[13px]">{ko ? '이름' : 'Name'}
        <input name="name" defaultValue={name} required className="input mt-1" />
      </label>
      <label className="block text-[13px]">{ko ? '소속 연구실' : 'Laboratory'}
        <input name="lab" defaultValue={lab} placeholder={ko ? '예: 고분자 이온 소재 연구실' : 'e.g. Polymer Ionic Materials Lab'} className="input mt-1" />
      </label>
      <button disabled={pending} className="btn-primary !py-2.5">{pending ? '…' : ko ? '저장' : 'Save'}</button>
      <p className="sm:col-span-3 text-[12.5px] text-sg-gray9">{msg || (ko ? `${email} · 승인 심사에 쓰이니 이름과 연구실을 적어 주세요.` : `${email} · Used for approval.`)}</p>
    </form>
  );
}
