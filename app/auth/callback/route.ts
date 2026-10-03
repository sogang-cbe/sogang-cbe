import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/** 구글 로그인 뒤 돌아오는 자리. 코드를 세션으로 바꾸고, 처음 온 사람은 members에 'pending'으로 등록한다. */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/ko/equipment';
  if (!code) return NextResponse.redirect(`${origin}${next}?login=failed`);

  const sb = createClient();
  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}${next}?login=failed`);

  const { data: { user } } = await sb.auth.getUser();
  const email = (user?.email || '').toLowerCase();
  // 학교 계정만 받는다. (Supabase 쪽에서도 도메인 제한을 걸지만 여기서 한 번 더 확인한다)
  if (!email.endsWith('@sogang.ac.kr')) {
    await sb.auth.signOut();
    return NextResponse.redirect(`${origin}${next}?login=domain`);
  }
  const { data: me } = await sb.from('members').select('email').eq('email', email).maybeSingle();
  if (!me) {
    await sb.from('members').insert({
      email,
      name: (user?.user_metadata?.full_name as string) || (user?.user_metadata?.name as string) || null,
      role: 'pending',
    });
  }
  return NextResponse.redirect(`${origin}${next}`);
}
