#!/usr/bin/env bash
# 파일 업로드는 이미 끝났고 게시글만 넣을 때 쓴다.
#   bash posts-only.sh
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="${BASE:-$HOME/Library/CloudStorage/Dropbox/Sogang/Department/학과홈페이지/기존데이터베이스}"
POSTS="$BASE/추출데이터/posts_mapped.json"

say() { printf '\n\033[1;36m%s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m%s\033[0m\n' "$*" >&2; exit 1; }
[ -f "$POSTS" ] || die "추출 데이터를 찾을 수 없습니다: $POSTS"

ask() {            # ask <변수명> <안내문> <기대길이,0이면 확인안함> <가릴까(y/n)>
  local __var="$1" prompt="$2" want="$3" hide="$4" val n try=0
  while :; do
    if [ "$hide" = y ]; then read -rs -p "$prompt: " val; echo; else read -r -p "$prompt: " val; fi
    val="$(printf '%s' "$val" | tr -d '[:space:]')"
    n=${#val}
    if [ "$n" -eq 0 ]; then
      try=$((try+1)); echo "  아무것도 입력되지 않았습니다. 붙여넣기는 ⌘V 입니다."
      [ "$try" -ge 3 ] && die "입력이 없어 중단합니다."; continue
    fi
    [ "$want" -ne 0 ] && { [ "$n" -eq "$want" ] && echo "  ✓ ${n}자" || echo "  ⚠ ${n}자 (기대: ${want}자)"; }
    printf -v "$__var" '%s' "$val"; return
  done
}

say "■ 값 입력"
read -r -p "Supabase 주소 [https://pvbjbvsnuwccfyauajpe.supabase.co]: " SUPABASE_URL
SUPABASE_URL="$(printf '%s' "${SUPABASE_URL:-https://pvbjbvsnuwccfyauajpe.supabase.co}" | tr -d '[:space:]')"
echo "  Supabase → Project Settings → API Keys 의 secret 키입니다 (sb_secret_… 또는 eyJ…)."
echo "  publishable 키가 아닙니다."
ask SUPABASE_SERVICE_KEY "Supabase secret 키 (보이지 않습니다)" 0 y
read -r -p "R2 공개 주소 [https://pub-a183fa7f31f4404bbd9290f0823b8786.r2.dev]: " MEDIA_BASE
MEDIA_BASE="$(printf '%s' "${MEDIA_BASE:-https://pub-a183fa7f31f4404bbd9290f0823b8786.r2.dev}" | tr -d '[:space:]')"
export SUPABASE_URL SUPABASE_SERVICE_KEY MEDIA_BASE

say "■ 키 확인"
node "$HERE/migrate-posts.mjs" "$POSTS" --check || die "키가 통하지 않아 중단합니다. 위 안내를 보고 다시 시도하세요."

say "■ 게시글을 넣습니다"
node "$HERE/migrate-posts.mjs" "$POSTS"

say "■ 끝났습니다."
cat <<'MSG'
  확인할 곳
    https://sogang-cbe.vercel.app/ko/board/academic     학사공지
    https://sogang-cbe.vercel.app/ko/board/research     연구성과
    https://sogang-cbe.vercel.app/ko/board/scholarship  장학·취업
    https://sogang-cbe.vercel.app/adm/posts             관리자 (비공개 36건 확인)

  개인정보가 섞인 36건은 비공개로 들어갔습니다. 행정실에서 확인한 뒤 공개로 바꿔 주세요.
MSG
