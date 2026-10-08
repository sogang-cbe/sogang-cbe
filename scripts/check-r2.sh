#!/usr/bin/env bash
# R2 자격증명만 30초 안에 확인한다. 통과하면 migrate-all.sh 를 돌리면 된다.
#   bash check-r2.sh
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "■ Cloudflare R2 토큰 화면의 값 2개 (입력한 글자는 보이지 않습니다)"
echo "  'Token value' 가 아니라 'Access Key ID'(32자) / 'Secret Access Key'(64자) 입니다."
read -r  -p "R2 Account ID [a943f4d691cff116d13b87d165f226b9]: " R2_ACCOUNT_ID
R2_ACCOUNT_ID="${R2_ACCOUNT_ID:-a943f4d691cff116d13b87d165f226b9}"
read -rs -p "R2 Access Key ID: " R2_ACCESS_KEY_ID; echo
read -rs -p "R2 Secret Access Key: " R2_SECRET_ACCESS_KEY; echo
R2_BUCKET="${R2_BUCKET:-sogang-cbe-media}"
export R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET

echo "  Access Key ID ${#R2_ACCESS_KEY_ID}자 / Secret ${#R2_SECRET_ACCESS_KEY}자"
node --input-type=module -e "
import { r2Config, preflight } from '$HERE/lib-r2.mjs';
const cfg = r2Config();
try {
  await preflight(cfg);
  console.log('\n✅ 정상입니다. 이제 bash migrate-all.sh 를 돌리세요.');
} catch (e) {
  console.log('\n❌ 실패 — ' + (e.code || e.message));
  if (e.code === 'SignatureDoesNotMatch') console.log('   Secret Access Key 가 틀렸습니다. 토큰을 새로 만들어 64자 Secret 을 복사하세요.');
  if (e.code === 'InvalidAccessKeyId')    console.log('   Access Key ID 가 틀렸거나 토큰이 아직 반영되지 않았습니다.');
  if (e.code === 'AccessDenied')          console.log('   토큰 권한을 Object Read & Write 로 만드세요.');
  process.exit(1);
}
"
