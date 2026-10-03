// Cloudflare R2 (S3 호환) 업로드 — 외부 패키지 없이 Node 내장 crypto로 SigV4 서명한다.
// 맥에서 `node scripts/upload-media.mjs ...` 로 바로 돌아가게 하기 위함(npm install 불필요).
import { createHash, createHmac } from 'node:crypto';

const sha256 = (b) => createHash('sha256').update(b).digest('hex');
const hmac = (k, d) => createHmac('sha256', k).update(d).digest();

export function r2Config() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
    throw new Error('환경변수 R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET 를 설정하세요.');
  }
  return {
    host: `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    bucket: R2_BUCKET,
    key: R2_ACCESS_KEY_ID,
    secret: R2_SECRET_ACCESS_KEY,
  };
}

/** 한 개의 객체를 PUT 한다. key는 버킷 안 경로(앞에 / 없이). */
export async function putObject(cfg, key, body, contentType) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256(body);
  const canonicalUri = '/' + cfg.bucket + '/' + key.split('/').map(encodeURIComponent).join('/');
  const headers = {
    host: cfg.host,
    'content-type': contentType || 'application/octet-stream',
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  };
  const signedHeaders = Object.keys(headers).sort().join(';');
  const canonicalHeaders = Object.keys(headers).sort().map((h) => `${h}:${headers[h]}\n`).join('');
  const canonicalRequest = ['PUT', canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
  const scope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonicalRequest)].join('\n');
  let k = hmac('AWS4' + cfg.secret, dateStamp);
  k = hmac(k, 'auto'); k = hmac(k, 's3'); k = hmac(k, 'aws4_request');
  const signature = createHmac('sha256', k).update(stringToSign).digest('hex');
  const auth = `AWS4-HMAC-SHA256 Credential=${cfg.key}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`https://${cfg.host}${canonicalUri}`, {
    method: 'PUT', body, headers: { ...headers, authorization: auth },
  });
  if (!res.ok) throw new Error(`PUT ${key} → ${res.status} ${await res.text()}`);
}

export const contentTypeOf = (name) => ({
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  bmp: 'image/bmp', svg: 'image/svg+xml', pdf: 'application/pdf', zip: 'application/zip',
  doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  hwp: 'application/x-hwp', hwpx: 'application/x-hwp', txt: 'text/plain; charset=utf-8',
  mp4: 'video/mp4', mov: 'video/quicktime',
}[(name.split('.').pop() || '').toLowerCase()] || 'application/octet-stream');
