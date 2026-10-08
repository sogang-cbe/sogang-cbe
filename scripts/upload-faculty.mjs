#!/usr/bin/env node
/**
 * 교수 사진을 R2의 faculty/2026/ 아래로 올리고, DB 반영용 SQL 을 찍는다.
 *
 *   node scripts/upload-faculty.mjs <사진폴더>
 *
 * 폴더 안의 .jpg 파일 이름이 그대로 키가 된다 (예: taewook-kang.jpg).
 * 필요한 환경변수: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, MEDIA_BASE
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { r2Config, putObject, preflight, contentTypeOf, R2AuthError } from './lib-r2.mjs';

const dir = process.argv[2];
if (!dir) { console.error('사용법: node scripts/upload-faculty.mjs <사진폴더>'); process.exit(1); }
const MEDIA_BASE = (process.env.MEDIA_BASE || '').replace(/\/$/, '');
if (!MEDIA_BASE) { console.error('환경변수 MEDIA_BASE 를 설정하세요.'); process.exit(1); }

const cfg = r2Config();
process.stdout.write('R2 연결 확인 중… ');
try { await preflight(cfg); console.log('정상'); }
catch (e) {
  console.log('실패');
  console.error(`  ${e.code || e.message}`);
  if (e.code === 'SignatureDoesNotMatch') console.error('  → Secret Access Key(64자)를 확인하세요.');
  process.exit(1);
}

// 성함 ← 파일명 대응표 (DB 의 name_en 에서 만든 것)
const NAME = {
  'taewook-kang': '강태욱', 'hyuncheol-kim': '김현철', 'hyeong-jun-kim': '김형준',
  'jeong-geol-na': '나정걸', 'jeyoung-park': '박제영', 'byung-keun-oh': '오병근',
  'se-young-oh': '오세용', 'jinwon-lee': '이진원', 'jeong-woo-choi': '최정우',
  'jinhoon-choi': '최진훈', 'kyoung-su-ha': '하경수',
  'hyun-seok-cho': '조현석', 'moon-sung-kang': '강문성', 'heejong-shin': '신희종',
  'choongik-kim': '김충익', 'jong-suk-lee': '이종석', 'jaegeon-ryu': '류재건',
  'seonghyun-lee': '이성현',
};

const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
if (!files.length) { console.error(`${dir} 안에 사진이 없습니다.`); process.exit(1); }

const done = [];
for (const f of files) {
  const key = `faculty/2026/${f}`;
  try {
    await putObject(cfg, key, await readFile(path.join(dir, f)), contentTypeOf(f));
    const stem = f.replace(/\.[^.]+$/, '');
    done.push([stem, NAME[stem] || null]);
    console.log(`  올림  ${f}${NAME[stem] ? '  (' + NAME[stem] + ' 교수)' : '  ⚠ 성함 대응 없음'}`);
  } catch (e) {
    if (e instanceof R2AuthError) { console.error(`\n  인증 거부 (${e.code}). 중단합니다.`); process.exit(1); }
    console.error(`  실패  ${f} — ${e.message}`);
  }
}

const named = done.filter(([, ko]) => ko);
console.log(`\n■ ${done.length}장 올렸습니다. 아래 SQL 을 Supabase SQL Editor 에 붙여넣고 Run 하세요.\n`);
console.log('update faculty f set photo_url = v.url');
console.log('  from (values');
console.log(named.map(([stem, ko]) => `    ('${ko}', '${MEDIA_BASE}/faculty/2026/${stem}.jpg')`).join(',\n'));
console.log('  ) as v(name, url)');
console.log('  where f.name_ko = v.name;\n');
const nameless = done.filter(([, ko]) => !ko).map(([s]) => s);
if (nameless.length) console.log(`성함 대응이 없는 파일: ${nameless.join(', ')} — NAME 표에 추가하세요.`);
