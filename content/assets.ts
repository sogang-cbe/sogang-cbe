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

/** 홈 '교육 프로그램' 카드 배경 사진 (초안).
 *  학과 갤러리(옛 홈페이지에서 옮겨 온 우리 사진)에서 고른 것이라 저작권 문제가 없다.
 *  제대로 된 사진이 생기면 여기 주소만 바꾸면 된다. 빈 문자열이면 카드가 글자만 있는 예전 모양으로 돌아간다.
 *  - ug        2023 학술·진로지도 체육행사 (운동장 단체)
 *  - grad      2022 대학원 신입생 오리엔테이션
 *  - research  2013 학부·대학원 공장견학 (현대제철)
 *  - equipment 2018 학부생 공장견학 (한화토탈) — 장비 사진이 없어 임시로 쓴다. 촬영 후 교체할 것. */
export const programImages: Record<string, string> = {
  ug: 'https://pub-a183fa7f31f4404bbd9290f0823b8786.r2.dev/attach/16848964381.png',
  grad: 'https://pub-a183fa7f31f4404bbd9290f0823b8786.r2.dev/attach/16611537941.JPG',
  researchNav: 'https://pub-a183fa7f31f4404bbd9290f0823b8786.r2.dev/attach/14810953771.jpg',
  equipmentNav: 'https://pub-a183fa7f31f4404bbd9290f0823b8786.r2.dev/attach/15469277201.jpg',
};
