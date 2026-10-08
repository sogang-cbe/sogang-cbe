#!/usr/bin/env bash
# 교수 사진 업로드 — 터미널에서 한 번 실행한다.
#   bash upload-faculty.sh
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="${BASE:-$HOME/Library/CloudStorage/Dropbox/Sogang/Department/학과홈페이지/기존데이터베이스}"
PICS="${PICS:-$BASE/교수사진_원본/완성}"

say() { printf '\n\033[1;36m%s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m%s\033[0m\n' "$*" >&2; exit 1; }
[ -d "$PICS" ] || die "사진 폴더를 찾을 수 없습니다: $PICS"

ask() {
  local __var="$1" prompt="$2" want="$3" hide="$4" val n try=0
  while :; do
    if [ "$hide" = y ]; then read -rs -p "$prompt: " val; echo; else read -r -p "$prompt: " val; fi
    val="$(printf '%s' "$val" | tr -d '[:space:]')"; n=${#val}
    if [ "$n" -eq 0 ]; then
      try=$((try+1)); echo "  입력이 없습니다. 붙여넣기는 ⌘V 입니다."
      [ "$try" -ge 3 ] && die "중단합니다."; continue
    fi
    [ "$want" -ne 0 ] && { [ "$n" -eq "$want" ] && echo "  ✓ ${n}자" || echo "  ⚠ ${n}자 (기대: ${want}자)"; }
    printf -v "$__var" '%s' "$val"; return
  done
}

say "■ Cloudflare R2 토큰 값 (Token value 아님)"
read -r -p "R2 Account ID [a943f4d691cff116d13b87d165f226b9]: " R2_ACCOUNT_ID
R2_ACCOUNT_ID="$(printf '%s' "${R2_ACCOUNT_ID:-a943f4d691cff116d13b87d165f226b9}" | tr -d '[:space:]')"
ask R2_ACCESS_KEY_ID     "R2 Access Key ID (그대로 보입니다)" 32 n
ask R2_SECRET_ACCESS_KEY "R2 Secret Access Key (보이지 않습니다)" 64 y
MEDIA_BASE="${MEDIA_BASE:-https://pub-a183fa7f31f4404bbd9290f0823b8786.r2.dev}"
R2_BUCKET="${R2_BUCKET:-sogang-cbe-media}"
export R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET MEDIA_BASE

say "■ 올립니다 — $PICS"
node "$HERE/upload-faculty.mjs" "$PICS"
