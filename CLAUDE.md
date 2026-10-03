# 서강대학교 화공생명공학과 홈페이지 (sogang-cbe)

- 리포지토리: https://github.com/sogang-cbe/sogang-cbe (소유 조직 `sogang-cbe`, 계정 `chemengsogang`)
- 옛 홈페이지: http://chemeng.sogang.ac.kr (이젤디자인 운영, 2026년 9월 백업 수령)
- 배포: https://sogang-cbe.vercel.app (main 푸시 시 Vercel 자동 배포, 반영까지 약 1~2분)
- 스택: Next.js 14 (App Router) + Tailwind + TypeScript / Supabase(게시판·교수진·예약·구성원) / Cloudflare R2(파일) / Vercel
- 관리자 화면: `/adm` (게시글·교수진·장비·구성원 승인 등 DB 데이터는 여기서 편집)
- 리포지토리가 코드·정적 콘텐츠·문서의 유일한 원본이다. 컨테이너는 일회용이므로 남길 것은 전부 커밋·푸시한다.
- 이 저장소는 기계공학과 홈페이지(`sgmeoffice-hub/sogang-me`)를 포크해 만들었다. `docs/INHERITED-ME-*.md`는 기계과 기준 참고 문서다.

## 작업 규칙
- 정적 콘텐츠 수정은 `content/` 폴더의 .ts 파일만 편집한다.
  - `content/pages-about.ts` 학과소개·전공능력·행정실
  - `content/pages-ug.ts` 학부과정 / `content/pages-grad.ts` 대학원과정 / `content/pages-misc.ts` 동문회·정책
  - `content/areas.ts` 학과 연구센터 4곳(홈 카드·연구센터 페이지)
  - `content/courses.ts` + `content/data/*.json` 교과목·이수계획표·연혁·연구실 (옛 홈페이지에서 추출한 원본)
  - `content/calendar.ts` 학사일정 (대학 공통, 매 학년도 갱신)
  - `lib/i18n.ts` 공통 문구(메뉴·히어로·라벨) / `lib/nav.ts` 메뉴·게시판 목록
- 게시글·교수진·연구실·예약·장비·구성원 데이터는 코드로 고치지 않는다. 요청이 오면 `/adm`에서 하도록 안내하거나 사용자에게 먼저 확인한다.
- 국문(ko)/영문(en) 두 로케일을 항상 함께 반영한다.
- 디자인 테마(카디널 레드 PANTONE 1805C, 제목 폰트 Pretendard, 공식 시그니처 로고, 레이아웃)는 임의로 바꾸지 않는다. 메뉴 순서를 유지한다.
- **화공과는 기계과처럼 공식 "기초 분야" 구분을 쓰지 않는다.** 교수진을 임의의 분야로 나누지 말고, 연구는 ① 연구실 18곳 ② 학과가 운영하는 연구센터 4곳(C1 가스 리파이너리 사업단 / 에너지인력양성사업단 / BK21 분자제어기반 화공생물공정연구팀 / 첨단소재 연구소) 기준으로 서술한다.
- 학부 교육을 설명할 때는 화공수학·열역학·전달현상·반응공학의 네 기둥과 2·3·4학년 연속 실험(기초→요소→공정)을 중심에 둔다.
- 모바일(390px)을 항상 함께 고려한다. 한국어 텍스트에는 `break-keep`을 준다. 넓은 셀 안에 아이콘+텍스트를 가로 배치할 때는 모바일에서 세로 배치(`flex-col sm:flex-row`)로 전환한다.
- push 전에 `npm run build`로 빌드 통과를 확인한다. (컨테이너에는 Supabase 환경변수가 없어 홈(`/ko`,`/en`) 프리렌더만 실패하는 것은 정상이다. 그 밖의 페이지가 실패하면 실제 오류다.)
- 책임자(김형준 교수)가 직접 지시한 작업은 main까지 반영한다. 배포까지가 작업 완료다.
- 큰 개편(레이아웃 변경, 여러 페이지 동시 수정)은 작업 브랜치에 push해 Vercel 미리보기 URL로 먼저 확인받는다.
- 게시 금지: 학생 개인정보(학번·연락처·성적), 미공개 연구 자료, 재배포 불가한 출판사 자료, 외부 사이트에서 가져온 저작권 이미지. 옛 게시글 중 개인정보가 섞인 36건은 비공개(`published=false`)로 들여놓았으니 공개로 바꾸지 않는다.

## 구성원 로그인과 공용장비
- 학교 구글 계정(@sogang.ac.kr)으로 로그인하면 `members` 테이블에 `role='pending'`으로 등록되고, 행정실이 `/adm/members`에서 대학원생·교수·행정실로 승인한다.
- 승인된 구성원만 공용장비(`/equipment`)와 자료실(`/board/archive`)을 볼 수 있다. 내부 기록 게시판(`internal`)은 관리자 화면에서만 본다.
- 장비 사용은 무료다. 예약 → 장비 앞 QR(`/ko/equipment/check?e=<id>&k=<토큰>`) 체크인 → 체크아웃으로 기록을 남긴다. 체크인이 없으면 노쇼로 집계한다. 규칙은 운영하면서 더한다.
- 장비·QR 주소·예약 승인·사용 기록은 `/adm/equipment`에서 관리한다.

## 알아둘 환경 특성
- Tailwind 투명도 수식은 커스텀 색상 토큰에서 동작하지 않는다 (`bg-sg-ink/25`, `bg-sg-gray9/60` → 투명하게 렌더링). 반투명이 필요하면 `style={{ backgroundColor: 'rgba(26,26,26,.3)' }}` 같은 인라인 스타일을 쓴다. (sg-ink = rgb 26,26,26)
- 새 동적 경로(`[slug]`, `[id]`) 페이지에는 `export function generateStaticParams() { return []; }`를 꼭 넣는다. 없으면 `revalidate`가 있어도 매 요청 DB를 다시 읽는다(Supabase 전송량·Vercel 함수 호출 급증).
- 동적 라우트 폴더명에 대괄호가 있으므로(`app/[locale]/...`) 셸에서 경로를 다룰 때 따옴표로 감싼다.
- 서버 액션을 `<form action={…}>`에 바로 넣으려면 반환형이 `Promise<void>`여야 한다. 결과 메시지가 필요하면 클라이언트 컴포넌트에서 호출한다.
- GitHub Actions 봇 커밋은 Vercel이 배포하지 않는다. 배포는 소유자 계정 커밋(이 세션의 push 포함)으로만 트리거된다.
- push가 권한 분류기에 막히면 GitHub MCP 도구(`create_or_update_file`, 또는 `create_pull_request` → `merge_pull_request`)로 우회한다.
- 컨테이너에서 배포된 사이트 접속이 제한될 수 있다. 반영 확인은 사용자가 브라우저로 한다. 컨테이너 내에서는 `npm run build` 통과로 자가 검수한다.
- 옛 홈페이지의 원본 DB·파일(약 11GB)은 맥미니의 Dropbox `Sogang/Department/학과홈페이지/기존데이터베이스`에 있다. 추출한 JSON은 같은 폴더 `추출데이터/`.

## 진행 상황
- 세션 간 인수인계는 `docs/HANDOFF.md`를 읽고 이어서 하고, 처리한 항목은 그 문서를 갱신해 함께 커밋한다.
