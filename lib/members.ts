import { createClient } from './supabase-server';

export type Member = { email: string; name: string | null; role: string; lab: string | null; approved_at: string | null };
export const APPROVED_ROLES = ['grad', 'faculty', 'staff'] as const;
export const roleLabel = (r: string, ko: boolean) => ({
  pending: ko ? '승인 대기' : 'Pending', grad: ko ? '대학원생' : 'Graduate student',
  faculty: ko ? '교수' : 'Faculty', staff: ko ? '행정실' : 'Staff', rejected: ko ? '거절' : 'Rejected',
}[r] || r);

/** 지금 로그인한 구성원. 로그인하지 않았으면 null, 처음 온 사람은 role='pending'. */
export async function currentMember(): Promise<{ email: string; member: Member | null } | null> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  const email = (user?.email || '').toLowerCase();
  if (!email) return null;
  const { data } = await sb.from('members').select('email,name,role,lab,approved_at').eq('email', email).maybeSingle();
  return { email, member: (data as Member) || null };
}
export const isApproved = (m: Member | null | undefined) => !!m && (APPROVED_ROLES as readonly string[]).includes(m.role);
