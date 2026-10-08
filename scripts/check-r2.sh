#!/usr/bin/env bash
# R2 자격증명만 30초 안에 확인한다.
#   bash check-r2.sh
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 길이를 확인하며 받는다. 비어 있으면 다시 묻는다.
ask() {            # ask <변수명> <안내문> <기대길이> <가릴까(y/n)>
  local __var="$1" prompt="$2" want="$3" hide="$4" val n try=0
  while :; do
    if [ "$hide" = y ]; then read -rs -p "$prompt: " val; echo; else read -r -p "$prompt: " val; fi
    val="$(printf '%s' "$val" | tr -d '[:space:]')"      # 앞뒤 공백·줄바꿈 제거
    n=${#val}
    if [ "$n" -eq 0 ]; then
      try=$((try+1))
      echo "  아무것도 입력되지 않았습니다. 붙여넣기는 ⌘V 입니다. (글자가 안 보이는 건 정상)"
      [ "$try" -ge 3 ] && { echo "  중단합니다."; exit 1; }
      continue
    fi
    if [ "$n" -ne "$want" ]; then
      echo "  ⚠ ${n}자입니다 (기대: ${want}자). 그대로 진행은 하지만, 값이 맞는지 확인하세요."
    else
      echo "  ✓ ${n}자"
    fi
    printf -v "$__var" '%s' "$val"
    return
  done
}

echo "■ Cloudflare R2 토큰 화면의 값"
echo "  맨 위 'Token value' 가 아니라 'Access Key ID'(32자) / 'Secret Access Key'(64자) 입니다."
read -r -p "R2 Account ID [a943f4d691cff116d13b87d165f226b9]: " R2_ACCOUNT_ID
R2_ACCOUNT_ID="$(printf '%s' "${R2_ACCOUNT_ID:-a943f4d691cff116d13b87d165f226b9}" | tr -d '[:space:]')"
ask R2_ACCESS_KEY_ID     "R2 Access Key ID (그대로 보입니다)" 32 n
ask R2_SECRET_ACCESS_KEY "R2 Secret Access Key (보이지 않습니다)" 64 y
R2_BUCKET="${R2_BUCKET:-sogang-cbe-media}"
export R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET

node --input-type=module -e "
import { r2Config, preflight } from '$HERE/lib-r2.mjs';
try {
  await preflight(r2Config());
  console.log('\n✅ 정상입니다. 이제  bash migrate-all.sh  를 돌리세요.');
} catch (e) {
  console.log('\n❌ 실패 — ' + (e.code || e.message));
  if (e.code === 'SignatureDoesNotMatch') console.log('   Secret Access Key 가 맞지 않습니다. 64자 Secret 을 다시 복사해 보세요.');
  if (e.code === 'InvalidAccessKeyId')    console.log('   Access Key ID 가 틀렸거나 토큰이 아직 반영되지 않았습니다. 1분 뒤 다시.');
  if (e.code === 'AccessDenied')          console.log('   토큰 권한을 Object Read & Write 로 만드세요.');
  process.exit(1);
}
"
