'use server';
import { createClient } from '@/lib/supabase-server';
import { currentMember } from '@/lib/members';
import { revalidatePath } from 'next/cache';

/** 본인 이름·연구실 저장. 역할은 DB 트리거(members_guard)가 바꾸지 못하게 막는다. */
export async function saveProfile(fd: FormData) {
  const me = await currentMember();
  if (!me) return { error: '로그인이 필요합니다.' };
  const sb = createClient();
  const { error } = await sb.from('members')
    .update({ name: String(fd.get('name') || '').slice(0, 40), lab: String(fd.get('lab') || '').slice(0, 80) })
    .eq('email', me.email);
  if (error) return { error: error.message };
  revalidatePath('/ko/equipment');
  return { ok: true };
}
