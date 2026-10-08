#!/usr/bin/env node
/**
 * 옛 게시판 글 1,779건을 Supabase posts 테이블로 옮긴다.
 *
 *   node scripts/migrate-posts.mjs <posts_mapped.json>
 *
 * 필요한 환경변수
 *   SUPABASE_URL          https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY  Settings > API > service_role (절대 공개 금지)
 *   MEDIA_BASE            https://pub-xxxxxxxx.r2.dev   (R2 공개 주소, 끝에 / 없이)
 *
 * legacy_id(cbe:게시판:번호)로 중복을 막으므로 몇 번 돌려도 안전하다.
 * --dry 를 붙이면 보내지 않고 통계만 보여준다.
 */
import { readFile } from 'node:fs/promises';
import { rewriteContent, isImage, BOARD_MAP, encodeKey } from './legacy-media.mjs';

const file = process.argv[2];
const dry = process.argv.includes('--dry');
const checkOnly = process.argv.includes('--check');
if (!file) { console.error('사용법: node scripts/migrate-posts.mjs <posts_mapped.json> [--dry|--check]'); process.exit(1); }

const { SUPABASE_URL, SUPABASE_SERVICE_KEY, MEDIA_BASE } = process.env;
if (!dry && (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !MEDIA_BASE)) {
  console.error('환경변수 SUPABASE_URL, SUPABASE_SERVICE_KEY, MEDIA_BASE 를 설정하세요.');
  process.exit(1);
}

/** 키의 "종류"를 사람이 읽을 수 있게 풀어 준다. 틀린 키를 넣었을 때 바로 알 수 있도록. */
function describeKey(k) {
  if (!k) return { ok: false, why: '비어 있습니다' };
  if (k.startsWith('sb_publishable_'))
    return { ok: false, why: 'publishable(공개용) 키입니다. 글을 넣으려면 secret 키가 필요합니다' };
  if (k.startsWith('sb_secret_')) return { ok: true, why: 'secret 키 (올바른 종류)' };
  if (k.startsWith('eyJ')) {
    try {
      const payload = JSON.parse(Buffer.from(k.split('.')[1], 'base64').toString('utf8'));
      if (payload.role === 'service_role') return { ok: true, why: 'legacy service_role 키 (올바른 종류)' };
      return { ok: false, why: `legacy ${payload.role} 키입니다. service_role 이어야 합니다` };
    } catch { return { ok: false, why: 'JWT 형식이 깨졌습니다 (복사하다 잘렸을 수 있습니다)' }; }
  }
  return { ok: false, why: '알 수 없는 형식입니다 (sb_secret_… 또는 eyJ… 로 시작해야 합니다)' };
}

/** 실제로 한 번 찔러 보고 쓸 수 있는 키인지 확인한다. */
async function checkSupabase() {
  const kind = describeKey(SUPABASE_SERVICE_KEY);
  console.log(`  키 종류: ${kind.why}`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=id&limit=1`, {
    headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
  }).catch((e) => ({ ok: false, status: 0, text: async () => e.message }));
  if (res.ok) { console.log('  Supabase 정상'); return true; }
  const body = await res.text();
  console.error(`\n  Supabase 가 키를 거부했습니다 — ${res.status}\n  ${body.slice(0, 200)}`);
  if (!kind.ok) {
    console.error(`  → ${kind.why}`);
  } else if (/Invalid API key/i.test(body)) {
    console.error('  → 키 종류는 맞는데 값이 통하지 않습니다. 다음을 확인하세요.');
    console.error('     · Supabase → Project Settings → API Keys 에서 값을 다시 복사 (Reveal 후 복사 버튼 사용)');
    console.error('     · 화면에 Secret keys 와 Legacy API keys 가 둘 다 있으면, 지금과 다른 쪽을 써 보세요');
    console.error(`     · 프로젝트 주소가 맞는지: ${SUPABASE_URL}`);
  } else if (res.status === 404) {
    console.error('  → posts 테이블이 없습니다. SQL Editor 에서 supabase/setup_cbe.sql 을 먼저 실행하세요.');
  }
  return false;
}

if (checkOnly) { process.exit((await checkSupabase()) ? 0 : 1); }
const media = (MEDIA_BASE || 'MEDIA_BASE').replace(/\/$/, '');

const strip = (h) => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const posts = JSON.parse(await readFile(file, 'utf8'));
const rows = [];
const skipped = [];

for (const p of posts) {
  const board = BOARD_MAP[p.old_board];
  if (!board) { skipped.push(p.old_board); continue; }
  const content = rewriteContent(p.content, media);
  const atts = (p.attachments || []).filter((a) => a.stored).map((a) => ({
    name: a.original || a.stored, url: `${media}/attach/${encodeKey(a.stored)}`,
  }));
  const images = atts.filter((a) => isImage(a.name) || isImage(a.url)).map((a) => ({ url: a.url, caption: '' }));
  // 갤러리는 첨부 이미지가 본문이다. 그 밖의 게시판은 본문 첫 이미지를 대표 이미지로 쓴다.
  const firstInline = (content.match(/<img[^>]*src=["']([^"']+)["']/i) || [])[1] || null;
  rows.push({
    board,
    title_ko: (p.title || '(제목 없음)').trim(),
    title_en: p.title_en || null,
    content_ko: content,
    content_en: p.content_en || null,
    excerpt_ko: strip(content).slice(0, 180) || null,
    thumbnail_url: images[0]?.url || firstInline,
    images,
    attachments: atts,
    author: p.author || '화공생명공학과',
    is_pinned: !!p.notice,
    // 개인정보가 섞인 글(36건)은 비공개로 들여놓고 행정실이 확인한 뒤 공개한다
    published: !p.has_pii,
    show_on_home: board !== 'internal' && board !== 'archive' && !p.has_pii,
    view_count: Number(p.views) || 0,
    legacy_id: `cbe:${p.old_board}:${p.old_idx}`,
    created_at: (p.date || '').replace(' ', 'T') + '+09:00',
    updated_at: (p.date || '').replace(' ', 'T') + '+09:00',
  });
}

const count = (k) => rows.reduce((m, r) => (m[r[k]] = (m[r[k]] || 0) + 1, m), {});
console.log('게시판별:', count('board'));
console.log(`비공개(개인정보 확인 대기): ${rows.filter((r) => !r.published).length}건`);
console.log(`첨부 ${rows.reduce((n, r) => n + r.attachments.length, 0)}개 · 매핑 안 된 게시판: ${[...new Set(skipped)].join(', ') || '없음'}`);
if (dry) { console.log('\n--dry 이므로 보내지 않았습니다.'); process.exit(0); }

if (!(await checkSupabase())) process.exit(1);

const CHUNK = 100;
let done = 0;
for (let i = 0; i < rows.length; i += CHUNK) {
  const batch = rows.slice(i, i + CHUNK);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?on_conflict=legacy_id`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) { console.error(`\n${i}번째 묶음 실패 — ${res.status}\n${await res.text()}`); process.exit(1); }
  done += batch.length;
  console.log(`  ${done}/${rows.length}`);
}
console.log('\n완료. 관리자 화면(/adm/posts)에서 확인하세요. 비공개 글은 "개인정보 확인" 후 공개로 바꿔 주세요.');
