/** Convert admin input to safe-ish display HTML. Plain text (no block tags) gets paragraphs/line breaks. */
export function toHtml(input: string | null | undefined): string {
  const s = (input || '').trim();
  if (!s) return '';
  if (/<(p|div|br|ul|ol|h[1-6]|table|blockquote|img|iframe|figure)\b/i.test(s)) return s;
  return s.split(/\n{2,}/).map((para) => `<p>${para.replace(/\n/g, '<br>')}</p>`).join('\n');
}
/** 화면 표시용(저장 금지): 본문 표를 가로 스크롤 상자로 감싼다 — 옛 글·교과과정의 넓은 표가 모바일(390px)에서 페이지 전체를 넓혀
 *  화면이 축소되거나 옆으로 밀리던 문제(2026-09-25 전체 점검). DB에는 원문 그대로 두고 렌더링 때만 적용한다. */
export function wrapTables(html: string): string {
  if (!html || !/<table\b/i.test(html)) return html;
  return html.replace(/<table\b/gi, '<div class="tbl-scroll"><table').replace(/<\/table\s*>/gi, '</table></div>');
}
/** Extract YouTube video id from any common URL form. */
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  // [?&]v= : 다른 파라미터 꼬리(rev= 등)를 v=로 오인하지 않게. /live/ 형식도 지원.
  const m = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/);
  return m ? m[1] : null;
}
/** 이메일 등 HTML 문맥에 사용자 입력을 넣을 때의 이스케이프. */
export const escapeHtml = (s: string | null | undefined) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
/** Supabase Storage 공개 URL은 ?download= 을 붙여야 저장(다운로드)으로 응답한다. */
export const downloadUrl = (url: string, filename?: string) =>
  /\/storage\/v1\/object\/public\//.test(url) ? `${url}${url.includes('?') ? '&' : '?'}download=${encodeURIComponent(filename || '')}` : url;
export const youtubeThumb = (url: string | null | undefined) => { const id = youtubeId(url); return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null; };
export function youtubeStart(url: string | null | undefined): number { const m = (url || '').match(/[?&]t=(\d+)/); return m ? Number(m[1]) : 0; }

/** 국문 화면에서는 연구실 이름 끝의 영문 괄호를 뗀다(아래 영문 줄과 겹쳐 두 번 나오던 문제).
 *  예) '광전자 나노소재 및 그린에너지 연구실(Photoelectronic … Lab)' → '광전자 나노소재 및 그린에너지 연구실' */
export const shortLab = (s: string, ko: boolean) => (ko ? (s || '').replace(/\s*\([^()]*\)\s*$/, '') : s || '');

/** 교수 상세의 '연구 소개' 본문 다듬기.
 *  ① 맨 앞 요약 줄(<p class="text-lg font-semibold">…)은 연구분야 칩과 같은 내용이라 떼어 낸다.
 *  ② 옛 홈페이지는 소제목을 <p>제목<br>본문</p> 형태로 넣어 두었다 — 제목 줄만 굵게 올린다.
 *     (마침표가 있거나 120자를 넘으면 본문 문장이므로 그대로 둔다) */
export function researchBody(html: string): string {
  let s = (html || '').replace(/^\s*<p class="text-lg font-semibold"[^>]*>[\s\S]*?<\/p>/i, '');
  s = s.replace(/<p>([^<.]{3,120})<br\s*\/?>/gi, (m, head: string) =>
    /[,;:]\s*$/.test(head) ? m : `<p><strong class="sub-lead">${head}</strong>`);
  return s.trim();
}

/** 약력 HTML을 '약력'과 '주요 논문'으로 가른다 — 상세 페이지가 논문을 전체 폭 번호 목록으로 그리기 위함.
 *  옛 글은 <h3>주요 논문</h3>(또는 대표 논문) 뒤에 논문이 <li> 나 <p> 로 하나씩 들어 있다. */
export function splitBio(html: string): { vita: string; pubs: string[] } {
  const s = (html || '').trim();
  if (!s) return { vita: '', pubs: [] };
  const m = s.match(/<h[2-4][^>]*>[^<]*논문[^<]*<\/h[2-4]>/i);
  if (!m || m.index === undefined) return { vita: s, pubs: [] };
  const rest = s.slice(m.index + m[0].length);
  const raw = rest.match(/<li\b[^>]*>[\s\S]*?<\/li>/gi) || rest.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
  let pubs = raw.map((x) => x.replace(/^<(?:li|p)\b[^>]*>/i, '').replace(/<\/(?:li|p)\s*>\s*$/i, ''));
  // 한 덩어리에 줄바꿈으로만 나뉘어 있던 경우(옛 글 대부분) 줄 단위로 끊는다
  if (pubs.length === 1 && /<br\s*\/?>/i.test(pubs[0])) pubs = pubs[0].split(/<br\s*\/?>/i);
  pubs = pubs
    .map((x) => x.trim().replace(/^\d{1,3}\s*[.)]\s*/, ''))   // 글에 적혀 있던 번호는 떼고 화면 번호(01, 02 …)를 쓴다
    .filter((x) => x.replace(/<[^>]+>/g, '').trim().length > 0);
  return { vita: s.slice(0, m.index).trim(), pubs: pubs.length ? pubs : [rest] };
}
