/** 사이트가 쓰는 미디어 주소.
 *
 *  2026-10: 기계과 저장소를 복제해 만들었으므로, 기계과 Cloudflare R2(pub-752d…r2.dev)를 가리키던
 *  영상·이미지 참조를 모두 끊었다. 남의 학과 저장소에 의존하면 그쪽이 파일을 지우는 순간 깨진다.
 *
 *  현재는 학교 공식 배너 영상과 CSS 그라디언트로 버티고, 학과 사진이 준비되면
 *  관리자 화면(설정)에서 hero_video_url·hero_poster_url을 넣거나 아래 상수를 학과 R2 주소로 바꾼다.
 *  학과 R2 공개 버킷: sogang-cbe-media (Cloudflare → R2 → Public Development URL) */
export const siteMedia = process.env.NEXT_PUBLIC_MEDIA_BASE || '';

export const assets = {
  /** 서강대 공식 홍보 영상 — 학과 영상이 준비되면 교체한다. */
  campusVideo: 'https://www.sogang.ac.kr/banner/61_1.mp4',
  /** 사진이 아직 없는 자리는 이미지 대신 그라디언트 카드로 보여준다(깨진 이미지 방지). */
  mainVisual: '',
  entrance: '',
  research: '',
  graduate: '',
  equipment: '',
};

/** 히어로 배경 영상 묶음. 학과 영상이 준비되기 전까지는 비워 두고 campusVideo 한 편만 쓴다. */
export const heroFieldVideos: { field?: string; src: string; poster: string }[] = [];

/** 섹션 상단 배경 이미지. 비어 있으면 각 페이지가 그라디언트로 대체한다. */
export const sectionHero: Record<string, string> = {
  about: '', faculty: '', research: '', undergraduate: '', graduate: '',
  board: '', facility: '', alumni: '', default: '',
};
