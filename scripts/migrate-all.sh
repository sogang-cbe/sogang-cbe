#!/usr/bin/env bash
# ============================================================
# 옛 홈페이지 → 새 홈페이지 이관 (한 번만 실행)
#
#   bash scripts/migrate-all.sh
#
# 하는 일
#   1. 백업 tar에서 "실제로 쓰이는 폴더만" 풀어 놓는다 (약 6.5GB, 임시)
#   2. 첨부·본문 이미지·교수 사진을 Cloudflare R2에 올린다
#   3. 게시글 1,779건을 Supabase에 넣는다
#
# 필요한 값 4개 (화면에서 물어봅니다. 입력한 값은 화면에 보이지 않고 파일에도 남지 않습니다)
#   - Supabase service_role 키 : Supabase → Project Settings → API → service_role
#   - R2 Account ID            : Cloudflare → R2 → 오른쪽 "Account ID"
#   - R2 Access Key / Secret   : Cloudflare → R2 → Manage API tokens 로 만든 값
#
# 몇 번을 다시 돌려도 안전합니다 (같은 글·같은 파일은 덮어쓰기만 합니다).
# ============================================================
set -euo pipefail

BASE="${BASE:-$HOME/Library/CloudStorage/Dropbox/Sogang/Department/학과홈페이지/기존데이터베이스}"
TAR="$BASE/chemeng_260914_WEB.tar.gz"
POSTS="$BASE/추출데이터/posts_mapped.json"
WORK="${WORK:-$BASE/_이관작업}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   # 이 스크립트와 .mjs 들이 같은 폴더에 있다

say() { printf '\n\033[1;36m%s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m%s\033[0m\n' "$*" >&2; exit 1; }

[ -f "$TAR" ]   || die "백업 파일을 찾을 수 없습니다: $TAR"
[ -f "$POSTS" ] || die "추출 데이터를 찾을 수 없습니다: $POSTS"
command -v node >/dev/null || die "node 가 필요합니다. https://nodejs.org 에서 설치하세요."

say "■ 값 입력 (입력한 글자는 보이지 않습니다)"
read -r  -p "Supabase 주소 [https://pvbjbvsnuwccfyauajpe.supabase.co]: " SUPABASE_URL
SUPABASE_URL="${SUPABASE_URL:-https://pvbjbvsnuwccfyauajpe.supabase.co}"
read -rs -p "Supabase service_role 키: " SUPABASE_SERVICE_KEY; echo
read -r  -p "R2 공개 주소 (예: https://pub-xxxx.r2.dev): " MEDIA_BASE
read -r  -p "R2 Account ID: " R2_ACCOUNT_ID
read -rs -p "R2 Access Key ID: " R2_ACCESS_KEY_ID; echo
read -rs -p "R2 Secret Access Key: " R2_SECRET_ACCESS_KEY; echo
R2_BUCKET="${R2_BUCKET:-sogang-cbe-media}"
export SUPABASE_URL SUPABASE_SERVICE_KEY MEDIA_BASE R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET

for v in SUPABASE_SERVICE_KEY MEDIA_BASE R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY; do
  [ -n "${!v}" ] || die "$v 가 비어 있습니다."
done

say "■ 1/3 백업에서 필요한 폴더만 풀어 놓습니다 (몇 분 걸립니다)"
mkdir -p "$WORK"
if [ -d "$WORK/home2/chemeng/public/data/bbsData" ]; then
  echo "  이미 풀려 있어 건너뜁니다. 다시 풀려면 $WORK 를 지우고 실행하세요."
else
  tar xzf "$TAR" -C "$WORK" \
    'home2/chemeng/public/data/bbsData' \
    'home2/chemeng/public/data/upload' \
    'home2/chemeng/public/se2/photo_uploader/upload' \
    'home2/chemeng/public/_core/data/file'
fi
WEBROOT="$WORK/home2/chemeng/public"
[ -d "$WEBROOT" ] || die "압축 해제가 끝나지 않았습니다: $WEBROOT"
echo "  완료 — $(du -sh "$WORK" | cut -f1)"

say "■ 2/3 파일을 R2에 올립니다 (쓰이는 것만, 약 4GB — 회선에 따라 10~40분)"
node "$HERE/upload-media.mjs" "$WEBROOT" "$POSTS"

say "■ 3/3 게시글을 Supabase에 넣습니다"
node "$HERE/migrate-posts.mjs" "$POSTS" --dry
read -r -p "위 건수가 맞으면 Enter, 중단하려면 Ctrl+C: " _
node "$HERE/migrate-posts.mjs" "$POSTS"

say "■ 끝났습니다."
cat <<'MSG'
  확인할 곳
    https://sogang-cbe.vercel.app/ko/board/academic     학사공지
    https://sogang-cbe.vercel.app/ko/board/research     연구성과
    https://sogang-cbe.vercel.app/ko/board/scholarship  장학·취업
    https://sogang-cbe.vercel.app/adm/posts             관리자 (비공개 36건 확인)

  개인정보가 섞인 36건은 비공개로 들어갔습니다. 행정실에서 확인한 뒤 공개로 바꿔 주세요.
  임시 폴더(_이관작업)는 확인이 끝나면 지우셔도 됩니다.
MSG

say "■ 교수 사진 주소 — Supabase SQL Editor 에 아래 한 줄을 붙여 넣고 Run 하세요"
echo "  (supabase/seed_faculty_cbe.sql 로 교수진을 먼저 넣은 뒤에 실행합니다)"
printf "
  update faculty set photo_url = replace(photo_url, 'MEDIA_BASE', '%s')\n    where photo_url like 'MEDIA_BASE%%';

" "$MEDIA_BASE"
