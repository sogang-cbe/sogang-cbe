# 서강대학교 화공생명공학과 홈페이지 (Sogang CBE)

Next.js 14 · Supabase(DB/인증/파일) · Cloudflare R2(파일) · Vercel(호스팅) · 국문/영문 · 관리자 페이지 · AI 자동 번역

기계공학과 홈페이지(`sgmeoffice-hub/sogang-me`)를 포크해 화공생명공학과용으로 바꾼 저장소입니다.

## 구성
| 경로 | 내용 |
|---|---|
| `app/[locale]/…` | 공개 사이트 (`/ko`, `/en`) |
| `app/[locale]/equipment/…` | 공용장비 — 구성원 로그인·예약·QR 체크인 |
| `app/admin/…` | 관리자 (실제 주소는 `.env`의 `ADMIN_PATH`, 기본 `/adm`) |
| `app/auth/callback/` | 학교 구글 계정 로그인 되돌아오는 자리 |
| `content/` | 고정 페이지 본문(국/영), 연혁·교과목·이수계획표·학사일정·연구센터 |
| `content/data/*.json` | 옛 홈페이지에서 추출한 원본 데이터 (교과목 125과목, 이수계획표 13개 학번, 연혁 18건, 연구실 18곳) |
| `supabase/setup_cbe.sql` | DB 테이블·권한·저장소 — Supabase SQL Editor에 붙여넣고 1회 실행 |
| `supabase/seed_faculty_cbe.sql` | 교수진 시드 (전임 17 · 석학 1 · 명예 10) |
| `scripts/upload-media.mjs` | 옛 홈페이지 첨부·이미지 중 실제로 쓰이는 것만 R2에 올림 |
| `scripts/migrate-posts.mjs` | 옛 게시판 글 1,779건을 Supabase로 이관 |
| `docs/HANDOFF.md` | 세션 간 인수인계 (현재 상태·다음 할 일) |
| `docs/INHERITED-ME-*.md` | 기계공학과 원본 문서 (참고용) |

## 처음 세팅 순서
1. **Supabase** — 프로젝트 생성 → SQL Editor에 `supabase/setup_cbe.sql` 전체 붙여넣고 Run → `admins` 테이블에 관리자 이메일 추가 → Authentication › Providers에서 Google 켜기(허용 도메인 `sogang.ac.kr`), Redirect URL에 `https://<도메인>/auth/callback` 추가.
2. **Cloudflare R2** — 버킷 `sogang-cbe-media`(공개 Development URL 켜기), `sogang-cbe-backup`(비공개) 생성 → API 토큰(Object Read & Write) 발급.
3. **Vercel 환경변수** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_MEDIA_BASE`(R2 공개 주소), `NEXT_PUBLIC_SITE_URL`, `ADMIN_PATH`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BACKUP_BUCKET`, `R2_MEDIA_BUCKET`.
4. **데이터 이관** — 아래 "옛 홈페이지 이관".
5. **교수진** — `supabase/seed_faculty_cbe.sql` 실행 후, 맨 아래 주석의 UPDATE 한 줄로 사진 주소를 R2 공개 주소로 바꿉니다.

## 옛 홈페이지 이관
백업(`chemeng_260914_WEB.tar.gz`)을 풀면 웹 루트는 `home2/chemeng/public` 입니다.

```bash
# 1) 파일 — 실제로 쓰이는 것만 올라갑니다 (첨부 1,504 + 본문 이미지)
export R2_ACCOUNT_ID=… R2_ACCESS_KEY_ID=… R2_SECRET_ACCESS_KEY=… R2_BUCKET=sogang-cbe-media
node scripts/upload-media.mjs /경로/home2/chemeng/public /경로/추출데이터/posts_mapped.json

# 2) 게시글 — 먼저 --dry 로 건수를 확인한 뒤 실행
export SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_KEY=… MEDIA_BASE=https://pub-xxxx.r2.dev
node scripts/migrate-posts.mjs /경로/추출데이터/posts_mapped.json --dry
node scripts/migrate-posts.mjs /경로/추출데이터/posts_mapped.json
```

`legacy_id`로 중복을 막으므로 두 스크립트 모두 여러 번 돌려도 안전합니다. 개인정보가 섞인 36건은 비공개로 들어가니 행정실이 확인한 뒤 공개로 바꿉니다.

## 개발
```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev                  # http://localhost:3000
npm run build                # push 전 필수
```
