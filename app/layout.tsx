import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "경주중앙로타리클럽 | 국제로타리 제3630지구",
  description:
    "경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전. 국제로타리 제3630지구 소속으로 경주 지역의 봉사활동과 친목을 도모합니다.",
  keywords:
    "경주중앙로타리클럽, 경주로타리클럽, 로타리클럽, 경주, 봉사활동, 국제로타리, 제3630지구, 로타리, 경주중앙RC, 경주 로타리, 경주 봉사단체, 로타리 경주",
  authors: [{ name: "경주중앙로타리클럽" }],
  creator: "경주중앙로타리클럽",
  publisher: "경주중앙로타리클럽",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#1e40af",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "경주중앙RC",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://gjcrotaryclub.vercel.app",
    title: "경주중앙로타리클럽 | 국제로타리 제3630지구",
    description: "경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전",
    siteName: "경주중앙로타리클럽",
    images: [
      {
        url: "https://gjcrotaryclub.vercel.app/rotary-international-logo.png",
        width: 1200,
        height: 630,
        alt: "경주중앙로타리클럽 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "경주중앙로타리클럽 | 국제로타리 제3630지구",
    description: "경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전",
    images: ["https://gjcrotaryclub.vercel.app/rotary-international-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://gjcrotaryclub.vercel.app",
  },
  category: "organization",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        <title>경주중앙로타리클럽 | 국제로타리 제3630지구</title>
        <meta
          name="description"
          content="경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전. 국제로타리 제3630지구 소속으로 경주 지역의 봉사활동과 친목을 도모합니다."
        />

        {/* Open Graph - 네이버가 우선적으로 확인하는 태그들 */}
        <meta property="og:title" content="경주중앙로타리클럽 | 국제로타리 제3630지구" />
        <meta
          property="og:description"
          content="경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전. 국제로타리 제3630지구 소속으로 경주 지역의 봉사활동과 친목을 도모합니다."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gjcrotaryclub.vercel.app/" />
        <meta property="og:image" content="https://gjcrotaryclub.vercel.app/rotary-international-logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="경주중앙로타리클럽 로고" />
        <meta property="og:site_name" content="경주중앙로타리클럽" />
        <meta property="og:locale" content="ko_KR" />

        {/* 추가 메타 태그들 */}
        <meta
          name="keywords"
          content="경주중앙로타리클럽, 경주로타리클럽, 로타리클럽, 경주, 봉사활동, 국제로타리, 제3630지구, 로타리, 경주중앙RC, 경주 로타리, 경주 봉사단체, 로타리 경주"
        />
        <meta name="author" content="경주중앙로타리클럽" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Korean" />
        <meta name="revisit-after" content="1 days" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="경주중앙로타리클럽 | 국제로타리 제3630지구" />
        <meta name="twitter:description" content="경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전" />
        <meta name="twitter:image" content="https://gjcrotaryclub.vercel.app/rotary-international-logo.png" />

        {/* 검색엔진 인증 */}
        <meta name="google-site-verification" content="FC16dXl-lBiw-am_va-sxaFm091Sylo7aNOUjjRhyHQ" />
        <meta name="naver-site-verification" content="7ea6ce43416a296cb40ec2aae371286de917d64b" />

        {/* 캐시 제어 - 네이버가 최신 버전을 읽도록 */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="version" content={`naver-seo-${Date.now()}`} />
        <meta name="last-modified" content={new Date().toISOString()} />

        {/* 지역 정보 */}
        <meta name="geo.region" content="KR-47" />
        <meta name="geo.placename" content="경주시" />
        <meta name="geo.position" content="35.8562;129.2247" />
        <meta name="ICBM" content="35.8562, 129.2247" />

        <link rel="canonical" href="https://gjcrotaryclub.vercel.app/" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="경주중앙RC" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "경주중앙로타리클럽",
              alternateName: ["경주중앙RC", "경주 중앙 로타리클럽", "Gyeongju Central Rotary Club"],
              url: "https://gjcrotaryclub.vercel.app",
              logo: "https://gjcrotaryclub.vercel.app/rotary-international-logo.png",
              image: "https://gjcrotaryclub.vercel.app/rotary-international-logo.png",
              description: "경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전. 국제로타리 제3630지구 소속",
              foundingDate: "2005",
              address: {
                "@type": "PostalAddress",
                streetAddress: "승삼1길 5-5, 4층(용강동)",
                addressLocality: "경주시",
                addressRegion: "경상북도",
                postalCode: "38090",
                addressCountry: "KR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "35.8562",
                longitude: "129.2247",
              },
              email: "ceo6141@gmail.com",
              telephone: "054-773-7676",
              faxNumber: "054-773-7673",
              memberOf: {
                "@type": "Organization",
                name: "국제로타리 제3630지구",
                url: "https://rotary.org",
              },
              sameAs: ["https://band.us/@gjcrotary", "https://rotary.org"],
              areaServed: {
                "@type": "Place",
                name: "경주시",
              },
              knowsAbout: ["봉사활동", "지역사회 발전", "로타리", "경주"],
            }),
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 네이버 크롤러 감지 및 메타 태그 강제 설정
                function forceNaverMetaTags() {
                  console.log('[NAVER SEO] 네이버 서치어드바이저용 메타 태그 강제 설정 시작');
                  
                  // 페이지 제목 강제 설정
                  document.title = '경주중앙로타리클럽 | 국제로타리 제3630지구';
                  
                  // 필수 메타 태그들을 강제로 생성/업데이트
                  const requiredMetas = [
                    { selector: 'meta[name="description"]', name: 'description', content: '경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전. 국제로타리 제3630지구 소속으로 경주 지역의 봉사활동과 친목을 도모합니다.' },
                    { selector: 'meta[property="og:title"]', property: 'og:title', content: '경주중앙로타리클럽 | 국제로타리 제3630지구' },
                    { selector: 'meta[property="og:description"]', property: 'og:description', content: '경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전. 국제로타리 제3630지구 소속으로 경주 지역의 봉사활동과 친목을 도모합니다.' },
                    { selector: 'meta[property="og:type"]', property: 'og:type', content: 'website' },
                    { selector: 'meta[property="og:url"]', property: 'og:url', content: 'https://gjcrotaryclub.vercel.app/' },
                    { selector: 'meta[property="og:image"]', property: 'og:image', content: 'https://gjcrotaryclub.vercel.app/rotary-international-logo.png' }
                  ];
                  
                  requiredMetas.forEach(meta => {
                    let element = document.querySelector(meta.selector);
                    
                    if (!element) {
                      element = document.createElement('meta');
                      if (meta.name) element.setAttribute('name', meta.name);
                      if (meta.property) element.setAttribute('property', meta.property);
                      document.head.insertBefore(element, document.head.firstChild);
                      console.log('[NAVER SEO] 생성된 메타 태그:', meta.selector);
                    }
                    
                    element.setAttribute('content', meta.content);
                    console.log('[NAVER SEO] 설정된 메타 태그:', meta.selector, '=', meta.content);
                  });
                  
                  // 네이버 크롤러 전용 추가 태그
                  const naverSpecific = document.createElement('meta');
                  naverSpecific.setAttribute('name', 'naver-site-title');
                  naverSpecific.setAttribute('content', '경주중앙로타리클럽 | 국제로타리 제3630지구');
                  document.head.appendChild(naverSpecific);
                  
                  console.log('[NAVER SEO] 네이버 서치어드바이저용 메타 태그 설정 완료');
                }
                
                // 즉시 실행
                forceNaverMetaTags();
                
                // DOM 로드 후에도 실행
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', forceNaverMetaTags);
                } else {
                  setTimeout(forceNaverMetaTags, 100);
                }
                
                // 페이지 포커스 시에도 실행 (네이버 크롤러 재방문 대비)
                window.addEventListener('focus', function() {
                  setTimeout(forceNaverMetaTags, 50);
                });
                
                document.addEventListener('visibilitychange', function() {
                  if (!document.hidden) {
                    setTimeout(forceNaverMetaTags, 50);
                  }
                });
              })();
            `,
          }}
        />

        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
