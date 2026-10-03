import { createClient } from '@/lib/supabase-server';
import { setMemberRole } from '../equipment/actions';
import { roleLabel } from '@/lib/members';

/** 구성원 승인 — 학교 구글 계정으로 처음 로그인한 사람의 역할을 정한다. */
export default async function MembersAdmin() {
  const sb = createClient();
  const { data: rows } = await sb.from('members').select('*').order('role').order('created_at', { ascending: false });
  const pending = (rows || []).filter((m: any) => m.role === 'pending');
  const others = (rows || []).filter((m: any) => m.role !== 'pending');

  return (
    <div>
      <h1 className="text-2xl font-bold">구성원 승인</h1>
      <p className="mt-2 text-[13.5px] text-sg-steel break-keep">
        공용장비와 자료실은 여기서 <strong>대학원생·교수·행정실</strong>로 승인한 사람만 볼 수 있습니다. 승인 대기 상태로는 아무것도 보이지 않습니다.
        학교 계정(@sogang.ac.kr)만 로그인할 수 있으므로, 이름과 연구실이 학과 명단과 맞는지만 확인하면 됩니다.
      </p>

      <Table title={`승인 대기 ${pending.length}명`} rows={pending} empty="승인을 기다리는 사람이 없습니다." />
      <Table title={`승인된 구성원 ${others.length}명`} rows={others} empty="아직 없습니다." />
    </div>
  );
}

function Table({ title, rows, empty }: { title: string; rows: any[]; empty: string }) {
  return (
    <section className="mt-8">
      <h2 className="font-bold">{title}</h2>
      {rows.length === 0 ? <p className="mt-3 text-[13.5px] text-sg-steel">{empty}</p> : (
        <div className="mt-3 card overflow-x-auto"><table className="w-full text-[13.5px]">
          <thead><tr className="bg-sg-mist text-left"><th className="p-3">이메일</th><th className="p-3">이름</th><th className="p-3">연구실</th><th className="p-3">현재</th><th className="p-3">변경</th></tr></thead>
          <tbody>{rows.map((m: any) => (
            <tr key={m.email} className="border-t border-sg-line">
              <td className="p-3 break-all">{m.email}</td>
              <td className="p-3">{m.name || '—'}</td>
              <td className="p-3 break-keep">{m.lab || '—'}</td>
              <td className="p-3">{roleLabel(m.role, true)}</td>
              <td className="p-3">
                <form action={setMemberRole} className="flex gap-1.5 items-center">
                  <input type="hidden" name="email" value={m.email} />
                  <select name="role" defaultValue={m.role} className="input !py-1 !text-[12.5px]">
                    {['pending', 'grad', 'faculty', 'staff', 'rejected'].map((r) => <option key={r} value={r}>{roleLabel(r, true)}</option>)}
                  </select>
                  <button className="px-2 py-1 text-[12px] btn-primary">적용</button>
                </form>
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </section>
  );
}
