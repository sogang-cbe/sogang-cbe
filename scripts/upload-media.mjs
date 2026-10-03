#!/usr/bin/env node
/**
 * 옛 홈페이지 파일 중 "실제로 쓰이는 것만" Cloudflare R2에 올린다.
 *
 *   node scripts/upload-media.mjs <웹루트> <posts_mapped.json>
 *
 * 웹루트 = 백업 tar를 푼 뒤의 home2/chemeng/public 폴더
 *
 * 필요한 환경변수
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET=sogang-cbe-media
 *
 * 이미 올라간 파일은 건너뛰지 않고 덮어쓴다(같은 키 = 같은 파일).
 */
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { r2Config, putObject, contentTypeOf } from './lib-r2.mjs';
import { keyForLegacyPath, OLD_HOSTS } from './legacy-media.mjs';

const [webRoot, postsJson] = process.argv.slice(2);
if (!webRoot || !postsJson) {
  console.error('사용법: node scripts/upload-media.mjs <웹루트(.../home2/chemeng/public)> <posts_mapped.json>');
  process.exit(1);
}

const posts = JSON.parse(await readFile(postsJson, 'utf8'));
const wanted = new Set();

// 1) 첨부파일
for (const p of posts) for (const a of p.attachments || []) if (a.stored) wanted.add('data/bbsData/' + a.stored);
// 2) 본문 안 이미지
const hostRe = new RegExp(`https?://(?:${OLD_HOSTS.map((h) => h.replace(/\./g, '\\.')).join('|')})/([^"'\\s>)]+)`, 'gi');
for (const p of posts) {
  for (const m of String(p.content || '').matchAll(hostRe)) {
    const rel = m[1].split('?')[0];
    if (keyForLegacyPath(rel)) wanted.add(rel);
  }
}
// 3) 교수 사진 (data/upload 전체 — 67개 4.7MB뿐이라 통째로)
const facultyPics = JSON.parse(await readFile(new URL('./faculty-pics.json', import.meta.url), 'utf8').catch(() => '[]'));
for (const f of facultyPics) wanted.add('data/upload/' + f);

const cfg = r2Config();
const list = [...wanted].sort();
console.log(`올릴 파일 ${list.length}개 확인 중…`);

let ok = 0, missing = 0, failed = 0, bytes = 0;
const CONCURRENCY = 6;
let i = 0;
async function worker() {
  while (i < list.length) {
    const rel = list[i++];
    const key = keyForLegacyPath(rel);
    const file = path.join(webRoot, rel);
    try {
      const st = await stat(file);
      if (!st.isFile()) { missing++; continue; }
      const body = await readFile(file);
      await putObject(cfg, key, body, contentTypeOf(rel));
      ok++; bytes += st.size;
      if (ok % 100 === 0) console.log(`  ${ok}/${list.length} (${(bytes / 1048576).toFixed(0)} MB)`);
    } catch (e) {
      if (e.code === 'ENOENT') { missing++; console.warn('  없음:', rel); }
      else { failed++; console.error('  실패:', rel, e.message); }
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`\n완료 — 올림 ${ok} · 원본 없음 ${missing} · 실패 ${failed} · ${(bytes / 1048576).toFixed(1)} MB`);
if (failed) process.exitCode = 1;
