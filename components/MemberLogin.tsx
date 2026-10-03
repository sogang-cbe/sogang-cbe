'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

/** 학교 구글 계정 로그인 버튼. 공용장비·자료실처럼 구성원만 보는 화면에서 쓴다. */
export default function MemberLogin({ next, locale }: { next: string; locale: 'ko' | 'en' }) {
  const ko = locale === 'ko';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function go() {
    setBusy(true); setErr('');
    const sb = createClient();
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { hd: 'sogang.ac.kr', prompt: 'select_account' },
      },
    });
    if (error) { setErr(error.message); setBusy(false); }
  }
  return (
    <div>
      <button onClick={go} disabled={busy} className="btn-primary !py-3 inline-flex items-center gap-3">
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#fff" d="M44.5 20H24v8.5h11.8C34.7 33.4 30 36.5 24 36.5c-6.9 0-12.5-5.6-12.5-12.5S17.1 11.5 24 11.5c3.2 0 6.1 1.2 8.3 3.2l6-6C34.6 5 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z" /></svg>
        {busy ? '…' : ko ? '서강대 구글 계정으로 로그인' : 'Sign in with your Sogang account'}
      </button>
      {err && <p className="mt-3 text-[13px] text-sg-cardinal">{err}</p>}
    </div>
  );
}
