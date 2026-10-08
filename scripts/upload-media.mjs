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
import { r2Config, putObject, preflight, contentTypeOf, R2AuthError } from './lib-r2.mjs';
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

// 3천 개를 다 실패시키기 전에, 작은 파일 하나로 자격증명부터 확인한다.
process.stdout.write('R2 연결 확인 중… ');
try {
  await preflight(cfg);
  console.log('정상');
} catch (e) {
  console.log('실패');
  console.error(`\n  R2에 접속하지 못했습니다 (${e.code || e.message}).\n`);
  if (e.code === 'SignatureDoesNotMatch') {
    console.error('  → Secret Access Key 가 맞지 않습니다.');
    console.error('     Cloudflare R2 토큰 화면에는 값이 여러 개 있습니다. 그중');
    console.error('       · Access Key ID      (영문+숫자 32자)');
    console.error('       · Secret Access Key  (영문+숫자 64자)  ← 이 둘을 넣어야 합니다');
    console.error('     맨 위의 "Token value" 를 넣으면 이 오류가 납니다.');
    console.error('     Secret 을 못 보셨으면 토큰을 새로 만드세요(기존 토큰은 지워도 됩니다).');
  } else if (e.code === 'InvalidAccessKeyId') {
    console.error('  → Access Key ID 가 틀렸거나 방금 만든 토큰이 아직 반영되지 않았습니다. 1분 뒤 다시 시도해 보세요.');
  } else if (e.code === 'AccessDenied') {
    console.error(`  → 토큰 권한이 모자랍니다. Object Read & Write 로, 버킷 ${cfg.bucket} 에 권한이 있는지 확인하세요.`);
  } else if (e.code === 'InvalidArgument' || /ENOTFOUND|fetch failed/i.test(e.message)) {
    console.error(`  → Account ID 또는 버킷 이름을 확인하세요. 지금 설정: ${cfg.host} / ${cfg.bucket}`);
  }
  process.exit(1);
}

const list = [...wanted].sort();
console.log(`올릴 파일 ${list.length}개 확인 중…`);

let ok = 0, missing = 0, failed = 0, bytes = 0, authFailed = false;
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
      if (e.code === 'ENOENT') { missing++; continue; }
      if (e instanceof R2AuthError) {   // 자격증명 문제 — 나머지도 전부 실패한다. 즉시 중단.
        console.error(`\n  인증이 거부되었습니다 (${e.code}). 중단합니다.`);
        authFailed = true; i = list.length; return;
      }
      failed++;
      if (failed <= 10) console.error('  실패:', rel, e.message);
      else if (failed === 11) console.error('  (이후 실패는 생략)');
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`\n완료 — 올림 ${ok} · 원본 없음 ${missing} · 실패 ${failed} · ${(bytes / 1048576).toFixed(1)} MB`);
if (missing) console.log(`  (원본 없음 ${missing}건은 옛 서버에서 이미 지워진 첨부입니다. 글은 그대로 들어갑니다.)`);
if (authFailed || failed) process.exitCode = 1;
