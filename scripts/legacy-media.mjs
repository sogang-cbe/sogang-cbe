// 옛 홈페이지 콘텐츠의 이미지·첨부 주소를 새 주소(R2)로 바꾸는 규칙.
// upload-media.mjs(무엇을 올릴지)와 migrate-posts.mjs(본문을 어떻게 고칠지)가 같은 규칙을 쓴다.
export const OLD_HOSTS = ['chemeng.sogang.ac.kr', 'chemeng.jnetwork.kr', 'chemeng.easel.asia', 'www.chemeng.sogang.ac.kr'];

/** 옛 사이트 안의 경로 → R2 키. 옮기지 않는 경로는 null. */
export function keyForLegacyPath(p) {
  const path = p.replace(/^\/+/, '').split('?')[0];
  if (path.startsWith('data/bbsData/')) return 'attach/' + path.slice('data/bbsData/'.length);
  if (path.startsWith('data/upload/')) return 'faculty/' + path.slice('data/upload/'.length);
  if (path.startsWith('se2/photo_uploader/upload/')) return 'legacy/' + path;
  if (path.startsWith('_core/data/file/')) return 'legacy/' + path;
  return null;
}

/** 본문 HTML의 주소를 새 주소로 바꾸고, 살릴 수 없는 이미지는 지운다. */
export function rewriteContent(html, mediaBase) {
  if (!html) return '';
  let out = html;
  // 1) 내 컴퓨터 경로(file:///…)를 가리키는 이미지 — 애초에 보이지 않던 것이므로 지운다
  out = out.replace(/<img[^>]*src=["']file:\/\/\/[^"']*["'][^>]*>/gi, '');
  // 2) 옛 사이트 파일 → R2
  for (const host of OLD_HOSTS) {
    const re = new RegExp(`https?://${host.replace(/\./g, '\\.')}/([^"'\\s>)]+)`, 'gi');
    out = out.replace(re, (m, p) => {
      const key = keyForLegacyPath(p);
      return key ? `${mediaBase}/${encodeKey(key)}` : m;
    });
  }
  // 3) 남은 http 이미지는 https로 — 사이트가 https라 혼합 콘텐츠가 차단된다
  out = out.replace(/(<img[^>]*src=["'])http:\/\//gi, '$1https://');
  return out;
}

/** URL에 쓸 수 있도록 경로의 각 조각을 인코딩한다(한글·공백 파일명 대비).
 *  R2 업로드(putObject)도 같은 방식으로 인코딩하므로 주소가 어긋나지 않는다. */
export function encodeKey(key) {
  return key.split('/').map((seg) => {
    let raw = seg;
    try { raw = decodeURIComponent(seg); } catch { /* 이미 날것 */ }
    return encodeURIComponent(raw);
  }).join('/');
}

export const isImage = (name) => /\.(jpe?g|png|gif|webp|bmp)$/i.test(name || '');

/** 옛 게시판 코드 → 새 게시판 */
export const BOARD_MAP = {
  bbs07: 'academic',     // 학사
  bbs02: 'academic',     // 학생게시판 (실험 조편성·수업 공지)
  bbs061: 'academic',    // 공지및게시판
  bbs08: 'scholarship',  // 취업/장학
  bbs04: 'research',     // 연구 및 학술활동
  bbs05: 'seminar',      // 세미나
  bbs10: 'gallery',      // 학교생활 갤러리
  bbs15: 'gallery',      // 동아리 소개
  bbs13: 'gallery',      // 동문회 갤러리
  bbs14: 'grad_intro',   // 대학원생 소개
  bbs062: 'archive',     // 공유리소스
  bbs01: 'internal',     // 교수 게시판 (관리자 전용 보존)
  bbs06: 'internal',     // 학과회의록
  bbs09: 'internal',     // 공문서
  bbs03: 'internal',     // 건의/질의 (비공개 글)
  bbs11: 'internal',     // 동문회 게시판
  bbs12: 'internal',     // 동문회 커뮤니티
  bbs16: 'internal',     // 화공과 발전위원회
};
