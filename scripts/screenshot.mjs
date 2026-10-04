#!/usr/bin/env node
/**
 * 로컬로 띄운 사이트를 데스크톱(1440)·모바일(390) 두 폭으로 캡처한다. 디자인 자가 검수용.
 *
 *   npm i -D playwright
 *   npm run build && npm start
 *   node scripts/screenshot.mjs http://localhost:3000 /ko /ko/faculty
 *
 * 캡처는 shots/ 에 저장된다(.gitignore). 등장 애니메이션(.reveal)은 캡처에서 꺼 둔다 —
 * 전체 페이지 캡처는 IntersectionObserver를 제대로 깨우지 못해 내용이 비어 보이기 때문이다.
 * executablePath 는 이 컨테이너에 미리 깔린 크로미움 경로다. 다른 환경에서는 지우고 쓴다.
 */
import { chromium } from 'playwright';
const base = process.argv[2];
const pages = process.argv.slice(3);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const p of pages) {
  const name = (p.replace(/[^\w]+/g,'_') || 'home');
  for (const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]) {
    const ctx = await b.newContext({ viewport:{width:w,height:h} });
    const page = await ctx.newPage();
    // 등장 애니메이션은 캡처에서 꺼 둔다 (fullPage 캡처는 IntersectionObserver를 제대로 깨우지 못한다)
    await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important;transition:none!important}' }).catch(()=>{});
    await page.addInitScript(() => {
      const css = '.reveal{opacity:1!important;transform:none!important;transition:none!important}';
      document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); });
    });
    try {
      await page.goto(base+p, { waitUntil:'networkidle', timeout:45000 });
      // 스크롤로 등장 애니메이션(Reveal)을 모두 깨운 뒤 캡처한다
      await page.evaluate(async () => {
        await new Promise((r) => { let y = 0; const t = setInterval(() => { window.scrollTo(0, y); y += 400; if (y > document.body.scrollHeight + 800) { clearInterval(t); r(); } }, 40); });
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(900);
      await page.screenshot({ path:`shots/${tag}${name}.png`, fullPage:true });
      console.log('ok', tag, p);
    } catch(e) { console.log('FAIL', tag, p, String(e.message).split('\n')[0]); }
    await ctx.close();
  }
}
await b.close();
