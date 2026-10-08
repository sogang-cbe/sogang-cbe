// Cloudflare R2 (S3 호환) 업로드 — 외부 패키지 없이 Node 내장 crypto로 SigV4 서명한다.
// 맥에서 `node scripts/upload-media.mjs ...` 로 바로 돌아가게 하기 위함(npm install 불필요).
import { createHash, createHmac } from 'node:crypto';

const sha256 = (b) => createHash('sha256').update(b).digest('hex');
const hmac = (k, d) => createHmac('sha256', k).update(d).digest();

// AWS는 비예약문자(A-Za-z0-9-_.~)만 그대로 두고 나머지는 전부 %XX 로 바꾸도록 요구한다.
// encodeURIComponent 는 ! ' ( ) * 를 남기므로 직접 처리한다. (옛 첨부파일 이름에 괄호가 흔하다)
const uriEncode = (s) =>
  encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());

export function r2Config() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
    throw new Error('환경변수 R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET 를 설정하세요.');
  }
  return {
    host: `${R2_ACCOUNT_ID.trim()}.r2.cloudflarestorage.com`,
    bucket: R2_BUCKET.trim(),
    key: R2_ACCESS_KEY_ID.trim(),
    secret: R2_SECRET_ACCESS_KEY.trim(),
  };
}

/** 응답 본문에서 <Code>…</Code> 를 꺼낸다. */
const errCode = (text) => (String(text).match(/<Code>([^<]+)<\/Code>/) || [])[1] || '';

export class R2AuthError extends Error {
  constructor(code, detail) {
    super(code);
    this.name = 'R2AuthError';
    this.code = code;
    this.detail = detail;
  }
}

/** 한 개의 객체를 PUT 한다. key는 버킷 안 경로(앞에 / 없이). */
export async function putObject(cfg, key, body, contentType) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256(body);
  const canonicalUri = '/' + cfg.bucket + '/' + key.split('/').map(uriEncode).join('/');
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
  if (!res.ok) {
    const text = await res.text();
    const code = errCode(text);
    // 인증 문제는 파일마다 반복해도 소용없다 — 바로 멈추도록 따로 구분한다.
    if (['SignatureDoesNotMatch', 'InvalidAccessKeyId', 'AccessDenied', 'InvalidArgument'].includes(code)) {
      throw new R2AuthError(code, text.slice(0, 300));
    }
    throw new Error(`PUT ${key} → ${res.status} ${code || text.slice(0, 200)}`);
  }
}

/** 진짜 업로드를 시작하기 전에 작은 파일 하나로 자격증명을 확인한다. */
export async function preflight(cfg) {
  await putObject(cfg, '_preflight.txt', Buffer.from('ok\n'), 'text/plain; charset=utf-8');
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
