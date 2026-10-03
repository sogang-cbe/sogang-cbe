'use server';
import { createClient } from '@/lib/supabase-server';
import { adminBase } from '@/lib/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim() || null;
const num = (fd: FormData, k: string, d: number) => { const n = Number(fd.get(k)); return Number.isFinite(n) ? n : d; };
const bool = (fd: FormData, k: string) => fd.get(k) === 'on' || fd.get(k) === 'true';

/** 장비 등록·수정. id가 없으면 새로 만든다. */
export async function saveEquipment(fd: FormData) {
  const sb = createClient();
  const id = Number(fd.get('id')) || 0;
  const row = {
    name_ko: String(fd.get('name_ko') || '').trim(),
    name_en: str(fd, 'name_en'),
    model: str(fd, 'model'),
    location: str(fd, 'location'),
    manager: str(fd, 'manager'),
    manager_email: str(fd, 'manager_email'),
    note_ko: str(fd, 'note_ko'),
    note_en: str(fd, 'note_en'),
    min_slot: num(fd, 'min_slot', 60),
    open_from: str(fd, 'open_from') || '08:00',
    open_to: str(fd, 'open_to') || '22:00',
    needs_approval: bool(fd, 'needs_approval'),
    published: bool(fd, 'published'),
    sort_order: num(fd, 'sort_order', 100),
  };
  if (!row.name_ko) redirect(`${adminBase()}/equipment?err=name`);
  if (id) await sb.from('equipment').update(row).eq('id', id);
  else await sb.from('equipment').insert(row);
  revalidatePath('/ko/equipment');
  redirect(`${adminBase()}/equipment?ok=1`);
}

export async function deleteEquipment(fd: FormData) {
  const sb = createClient();
  await sb.from('equipment').delete().eq('id', Number(fd.get('id')));
  revalidatePath('/ko/equipment');
  redirect(`${adminBase()}/equipment`);
}

/** 장비 예약 승인·반려·노쇼 표시. */
export async function setEquipmentReservation(fd: FormData) {
  const sb = createClient();
  const id = Number(fd.get('id'));
  const action = String(fd.get('action') || '');
  if (action === 'delete') await sb.from('equipment_reservations').delete().eq('id', id);
  else if (action === 'no_show') await sb.from('equipment_reservations').update({ no_show: true }).eq('id', id);
  else await sb.from('equipment_reservations').update({ status: action }).eq('id', id);
  revalidatePath('/ko/equipment');
  redirect(`${adminBase()}/equipment`);
}

/** 구성원 역할 지정 (대학원생 승인 등). */
export async function setMemberRole(fd: FormData) {
  const sb = createClient();
  const email = String(fd.get('email') || '');
  const role = String(fd.get('role') || 'pending');
  await sb.from('members').update({ role, approved_at: role === 'pending' ? null : new Date().toISOString() }).eq('email', email);
  redirect(`${adminBase()}/members`);
}
