'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { currentFaculty } from '@/lib/faculty-self';
import { serviceClient, trashPost, saveVersion } from '@/lib/vault';
import { translateKoToEn } from '@/lib/translate';
import { buildingOf } from '@/lib/buildings';
import { refreshSite } from '@/lib/refresh';
import { toHtml } from '@/lib/html';

/** 교수 본인 편집(2026-11) — 로그인한 교수님이 자기 교수진 페이지와 자기 연구성과 글만 고친다.
 *  쓰기는 service key로 하되, 매번 서버에서 로그인 메일 ↔ 교수진 명단을 다시 확인한다. */
const str = (fd: FormData, k: string) => (fd.get(k) as string | null)?.toString() ?? '';
const nul = (s: string) => (s.trim() ? s : null);
const loc = (fd: FormData) => (str(fd, 'locale') === 'en' ? 'en' : 'ko');
const strip = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180);
const kstNowIso = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString();

async function me() {
  const m = await currentFaculty();
  if (!m?.faculty) throw new Error('교수진 명단에 있는 학교 계정으로 로그인해 주세요.');
  return m as { email: string; faculty: any };
}

export async function signOutMy(fd: FormData) {
  const sb = createClient(); await sb.auth.signOut(); redirect(`/${loc(fd)}/my`);
}

/** 내 교수진 페이지 — 이름·직함·정렬·보직·공개 여부는 학과가 관리하므로 여기서는 고칠 수 없다 */
export async function saveMyProfile(fd: FormData) {
  const { faculty: f } = await me();
  const row: any = {};
  for (const k of ['lab_ko', 'lab_en', 'lab_url', 'scholar_url', 'photo_url', 'tel', 'bio_ko', 'bio_en', 'research_ko', 'research_en']) row[k] = nul(str(fd, k));
  row.keywords = str(fd, 'keywords').split(',').map((x) => x.trim()).filter(Boolean).join(', ');
  row.room = nul(str(fd, 'room'));
  const bdg = buildingOf(f.building);
  row.office = bdg ? (row.room ? `${bdg.ko}(${bdg.code}) ${row.room}호` : `${bdg.ko}(${bdg.code})`) : f.office;

  // 국문을 고쳤고 영문은 손대지 않았으면 영문을 다시 만든다(관리자 화면과 같은 규칙)
  const editedEn = (k: string) => (row[k] ?? null) !== (f[k] ?? null);
  const koChanged = (k: string) => (row[k] || '') !== (f[k] || '');
  const need = (ko: string, en: string) => !!row[ko] && !editedEn(en) && (koChanged(ko) || !row[en]);
  const fields: Record<string, string> = {};
  if (need('lab_ko', 'lab_en')) fields.lab = row.lab_ko;
  if (need('research_ko', 'research_en')) fields.research = row.research_ko;
  if (need('bio_ko', 'bio_en')) fields.bio = row.bio_ko;
  if (Object.keys(fields).length) {
    const out = await translateKoToEn(fields).catch(() => null);
    if (out) {
      if (fields.lab && out.lab) row.lab_en = out.lab;
      if (fields.research && out.research) row.research_en = out.research;
      if (fields.bio && out.bio) row.bio_en = out.bio;
    }
  }
  const { error } = await serviceClient().from('faculty').update(row).eq('id', f.id);
  if (error) throw new Error(error.message);
  refreshSite();
  redirect(`/${loc(fd)}/my?saved=profile`);
}

/** 연구성과 글 쓰기·고치기 — 본인이 쓴 글(owner_email)만 고칠 수 있다 */
export async function saveMyPost(fd: FormData) {
  const { email, faculty: f } = await me();
  const svc = serviceClient();
  const id = Number(str(fd, 'id')) || 0;
  let prev: any = null;
  if (id) {
    const { data } = await svc.from('posts').select('*').eq('id', id).single();
    if (!data || data.board !== 'research' || (data.owner_email || '').toLowerCase() !== email) throw new Error('본인이 쓴 연구성과 글만 고칠 수 있습니다.');
    prev = data;
    await saveVersion(svc, prev, email).catch((e) => console.error('history', e?.message));
  }
  const content = toHtml(str(fd, 'content_ko'));
  const row: any = {
    board: 'research', title_ko: str(fd, 'title_ko').trim(), content_ko: content, excerpt_ko: strip(content),
    author: f.name_ko, owner_email: email, published: true, updated_at: new Date().toISOString(),
  };
  if (!row.title_ko) throw new Error('제목을 입력해 주세요.');
  // 대표 그림: 올린 그림 → 없으면 본문 첫 사진. 예전에 본문 첫 사진으로 자동으로 채워졌던 값이 그대로 넘어오면 새 본문 기준으로 다시 고른다
  const firstImg = (html: string) => (String(html || '').match(/<img[^>]+src="([^"]+)"/i) || [])[1] || null;
  const picked = nul(str(fd, 'thumbnail_url'));
  const wasAuto = !!prev?.thumbnail_url && picked === prev.thumbnail_url && String(prev.content_ko || '').includes(prev.thumbnail_url);
  row.thumbnail_url = picked && !wasAuto ? picked : firstImg(content);
  // 작성일: 날짜를 바꿨을 때만 반영
  const created = str(fd, 'created_at'); const today = kstNowIso().slice(0, 10);
  if (!id) row.created_at = !created || created === today ? kstNowIso() : `${created}T09:00:00+00:00`;
  else if (created && created !== (prev.created_at || '').slice(0, 10)) row.created_at = created === today ? kstNowIso() : `${created}T09:00:00+00:00`;

  // 영문: 국문이 바뀐 항목만 다시 번역
  const fields: Record<string, string> = {};
  if (!prev || row.title_ko !== prev.title_ko || !prev.title_en) fields.title = row.title_ko;
  if (!prev || row.content_ko !== prev.content_ko || !prev.content_en) { fields.content = row.content_ko; if (row.excerpt_ko) fields.excerpt = row.excerpt_ko; }
  if (Object.keys(fields).length) {
    const out = await translateKoToEn(fields).catch(() => null);
    if (out) {
      if (fields.title && out.title) row.title_en = out.title;
      if (fields.content && out.content) row.content_en = out.content;
      if (fields.excerpt && out.excerpt) row.excerpt_en = out.excerpt;
    }
  }
  const { error } = id ? await svc.from('posts').update(row).eq('id', id) : await svc.from('posts').insert(row);
  if (error) throw new Error(error.message);
  refreshSite();
  redirect(`/${loc(fd)}/my?saved=post`);
}

/** 내 글 삭제 = 휴지통으로(30일 보관, 관리자가 복구 가능) */
export async function deleteMyPost(fd: FormData) {
  const { email } = await me();
  const svc = serviceClient(); const id = Number(str(fd, 'id'));
  const { data: row } = await svc.from('posts').select('*').eq('id', id).single();
  if (!row || row.board !== 'research' || (row.owner_email || '').toLowerCase() !== email) throw new Error('본인이 쓴 글만 지울 수 있습니다.');
  await trashPost(svc, row, email);
  await svc.from('posts').delete().eq('id', id);
  refreshSite();
  redirect(`/${loc(fd)}/my?saved=deleted`);
}
