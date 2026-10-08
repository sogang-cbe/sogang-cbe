import Link from '@/components/Link';
import { T, type Locale } from '@/lib/i18n';
import HeroRotator from './HeroRotator';


export default function HeroVideo({ locale, videoUrl, poster, taglineKo, taglineEn, fieldVideos }: { locale: Locale; videoUrl?: string; poster?: string; taglineKo?: string | null; taglineEn?: string | null; fieldVideos?: { src: string; poster: string }[] }) {
  const ko = locale === 'ko';
  const tagline = ko ? taglineKo : taglineEn;
  return (
    <section className="relative min-h-[100svh] bg-sg-ink text-white overflow-hidden pt-[80px]">
      {/* Background: 관리자가 지정한 영상 > 4개 분야 영상 순환 > 정적 이미지 순 */}
      <div className="absolute inset-0">
        {videoUrl ? (
          <video className="w-full h-full object-cover" autoPlay muted loop playsInline poster={poster} preload="metadata">
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : fieldVideos?.length ? (
          <HeroRotator videos={fieldVideos} />
        ) : (
          <img src={poster} alt="" className="w-full h-full object-cover kenburns" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,.82)_0%,rgba(139,30,36,.55)_45%,rgba(26,26,26,.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-sg-ink to-transparent" />
      </div>

      <div className="container-site relative flex flex-col justify-center min-h-[calc(100svh-80px)] py-16">
        <div>
          <div className="min-w-0">
            <p className="rise rise-1 text-[15px] md:text-[17px] font-semibold tracking-[0.12em] text-white/80">
              SOGANG UNIVERSITY
            </p>
            {/* 한 줄 캐치프레이즈. 관리자 설정(tagline)이 있으면 그것을, 없으면 hero1(+hero2)을 쓴다.
                국문은 한 줄에 들어가는 길이로 유지하고, 영문은 길면 자연스럽게 접히게 둔다. */}
            <h1 className="mt-5 max-w-6xl font-brand text-[2.3rem] sm:text-[3.4rem] lg:text-[4.2rem] xl:text-[4.8rem] leading-[1.1] break-keep rise rise-2">
              {tagline || [T(locale, 'hero1'), T(locale, 'hero2')].filter(Boolean).join(' ')}
            </h1>
            {/* 두 문장을 각각 한 줄로 — 첫 줄이 접히지 않게 폭을 넓게 잡고 글자를 한 치 줄였다(책임자 요청) */}
            <div className="mt-6 max-w-[1120px] text-[16.5px] md:text-[18px] leading-relaxed text-white/85 break-keep rise rise-4">
              <p>{T(locale, 'heroSub')}</p>
              <p className="mt-1.5">{T(locale, 'heroSub2')}</p>
            </div>
            <div className="mt-9 flex flex-wrap gap-3 rise rise-4">
              <Link href={`/${locale}/undergraduate/curriculum`} className="btn-primary">{T(locale, 'ug')}</Link>
              <Link href={`/${locale}/graduate/admission`} className="btn-light">{T(locale, 'gradAdmission')}</Link>
              <Link href={`/${locale}/about/labs`} className="btn-light">{T(locale, 'lab')}</Link>
            </div>
          </div>
        </div>
      </div>
      <a href="#news" className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 hover:text-white flex flex-col items-center gap-1 text-[11px] tracking-[.3em]">SCROLL<span className="floaty">↓</span></a>
    </section>
  );
}
