import { createClient } from './supabase-server';
import { serviceClient } from './vault';

/** 교수 본인 편집(2026-11): 학교 구글 계정으로 로그인한 사람이 교수진 명단의 교수인지 확인한다.
 *  메일 아이디 부분으로 맞춘다 — 명단은 jongslee@sogang.ac.kr 인데 u.sogang.ac.kr 로 쓰는 경우가 있어서. */
const SCHOOL = /@(u\.)?sogang\.ac\.kr$/i;

export async function facultyByEmail(email: string): Promise<any | null> {
  const e = (email || '').toLowerCase();
  if (!SCHOOL.test(e)) return null;
  const local = e.split('@')[0].replace(/[^a-z0-9._-]/g, '');
  if (!local) return null;
  const { data } = await serviceClient().from('faculty').select('*').eq('published', true)
    .or(`email.ilike.${local}@sogang.ac.kr,email.ilike.${local}@u.sogang.ac.kr`).limit(1);
  return data?.[0] || null;
}

/** 지금 로그인한 사람 — 로그인하지 않았으면 null, 교수가 아니면 faculty: null */
export async function currentFaculty(): Promise<{ email: string; faculty: any | null } | null> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  const email = (user?.email || '').toLowerCase();
  if (!email) return null;
  return { email, faculty: await facultyByEmail(email) };
}
