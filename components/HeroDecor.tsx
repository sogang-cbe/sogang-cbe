/** 페이지 히어로 공용 장식 레이어 — 블루프린트 그리드 + 화공 공정도(증류탑·응축기·분자 고리).
 *
 *  기계과에서 물려받은 회전 기어·치수호를 2026-10 에 화공 설비로 교체했다.
 *  움직임은 전부 CSS 애니메이션이라 globals.css 의 prefers-reduced-motion 규칙으로 함께 멈춘다
 *  (SMIL <animate> 는 CSS 로 못 멈춘다 — 그래서 쓰지 않는다). */

/** 벤젠 고리 — 육각형 + 안쪽 방향족 원. */
function Ring({ cx, cy, r, dur, reverse = false }: { cx: number; cy: number; r: number; dur: string; reverse?: boolean }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 - Math.PI / 2;
    return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
  }).join(' ');
  return (
    <g className="decor-spin" style={{ animationDuration: dur, animationDirection: reverse ? 'reverse' : 'normal' }}>
      <polygon points={pts} strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r={r * 0.55} strokeWidth="1.5" />
    </g>
  );
}

export default function HeroDecor() {
  const trays = [120, 152, 184, 216, 248, 280];
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none text-white overflow-hidden">
      {/* 블루프린트 그리드 */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.13]">
        <defs>
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <pattern id="hero-grid-lg" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M240 0H0V240" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
        <rect width="100%" height="100%" fill="url(#hero-grid-lg)" />
      </svg>

      {/* 우측 공정도: 증류탑 + 응축기 + 분자 고리 */}
      <svg viewBox="0 0 900 420" preserveAspectRatio="xMaxYMid slice"
           className="absolute right-0 top-1/2 -translate-y-1/2 h-[130%] w-auto max-w-none opacity-[0.22] stroke-current fill-none">

        {/* ── 증류탑 ── */}
        <g strokeWidth="2.5">
          {/* 동체와 위아래 반구 헤드 */}
          <path d="M646 96 a54 34 0 0 1 108 0 V324 a54 34 0 0 1 -108 0 Z" />
          {/* 단(tray) */}
          <g strokeWidth="1.5">
            {trays.map((y, i) => (
              <line key={y} x1={i % 2 ? 646 : 664} y1={y} x2={i % 2 ? 736 : 754} y2={y} />
            ))}
          </g>
          {/* 탑 안에서 올라가는 기포 */}
          <g fill="currentColor" stroke="none">
            {[[676, '7s', '0s', 3.5], [700, '9s', '1.8s', 2.5], [722, '8s', '3.4s', 3]].map(([x, d, delay, r]) => (
              <circle key={x as number} cx={x as number} cy={318} r={r as number} className="decor-bubble"
                      style={{ animationDuration: d as string, animationDelay: delay as string }} />
            ))}
          </g>
        </g>

        {/* ── 배관 ── 원료 공급 / 탑정 증기 / 탑저 ── */}
        <g strokeWidth="2">
          <path d="M520 216 H646" />                               {/* 공급 */}
          <path d="M700 62 V34 H846" />                             {/* 탑정 증기 → 응축기 */}
          <path d="M846 150 V196 H812" />                           {/* 응축액 → 환류 */}
          <path d="M700 358 V392 H560" />                           {/* 탑저 */}
        </g>
        {/* 배관 위를 흐르는 점선 */}
        <g strokeWidth="2" strokeDasharray="3 11" className="decor-flow">
          <path d="M520 216 H646" />
          <path d="M700 62 V34 H846" />
          <path d="M700 358 V392 H560" />
        </g>

        {/* ── 응축기 (냉각 코일) ── */}
        <g strokeWidth="2">
          <rect x={812} y={62} width={68} height={88} rx={8} />
          <path d="M822 80 q17 -12 34 0 t34 0 M822 106 q17 -12 34 0 t34 0 M822 132 q17 -12 34 0 t34 0" strokeWidth="1.5" />
        </g>

        {/* ── 분자 고리 ── */}
        <Ring cx={214} cy={104} r={46} dur="54s" />
        <Ring cx={300} cy={160} r={26} dur="38s" reverse />
        <line x1={250} y1={128} x2={278} y2={146} strokeWidth="2" />

        {/* ── 기준점 ── */}
        <g strokeWidth="1.5" opacity="0.8">
          <path d="M120 300h22M131 289v22" /><path d="M400 90h18M409 81v18" /><path d="M430 330h18M439 321v18" />
        </g>
      </svg>
    </div>
  );
}
