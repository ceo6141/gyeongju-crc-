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
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="cache-control" content="no-cache, no-store, must-revalidate, max-age=0" />
        <meta name="version" content={`v2025-${Date.now()}`} />
        <meta name="last-modified" content={new Date().toISOString()} />
        <meta name="etag" content={`"${Date.now()}"`} />

        <meta name="google-site-verification" content="FC16dXl-lBiw-am_va-sxaFm091Sylo7aNOUjjRhyHQ" />
        <meta name="naver-site-verification" content="7ea6ce43416a296cb40ec2aae371286de917d64b" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <meta name="geo.region" content="KR-47" />
        <meta name="geo.placename" content="경주시" />
        <meta name="geo.position" content="35.8562;129.2247" />
        <meta name="ICBM" content="35.8562, 129.2247" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="canonical" href="https://gjcrotaryclub.vercel.app" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="경주중앙RC" />
        <meta name="mobile-web-app-capable" content="yes" />

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
                const CURRENT_VERSION = 'v2025-${Date.now()}';
                const LAST_VERSION_KEY = 'site-version';
                const FORCE_RELOAD_KEY = 'force-reload-done';
                
                function clearAllCaches() {
                  console.log('[v0] ULTRA-AGGRESSIVE cache clearing for complete version replacement');
                  
                  if ('caches' in window) {
                    caches.keys().then(names => {
                      names.forEach(name => {
                        caches.delete(name);
                        console.log('[v0] Deleted cache:', name);
                      });
                    });
                  }
                  
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                      registrations.forEach(reg => {
                        reg.unregister();
                        console.log('[v0] Unregistered service worker');
                      });
                    });
                  }
                  
                  if (window.applicationCache) {
                    window.applicationCache.update();
                    window.applicationCache.swapCache();
                  }
                  
                  const timestamp = Date.now();
                  const cacheMetaTags = [
                    { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate' },
                    { httpEquiv: 'Pragma', content: 'no-cache' },
                    { httpEquiv: 'Expires', content: '0' },
                    { name: 'cache-control', content: 'no-cache, no-store, must-revalidate' },
                    { name: 'timestamp', content: timestamp.toString() },
                    { name: 'version-force', content: CURRENT_VERSION },
                  ];
                  
                  cacheMetaTags.forEach(tag => {
                    const meta = document.createElement('meta');
                    if (tag.httpEquiv) meta.httpEquiv = tag.httpEquiv;
                    if (tag.name) meta.name = tag.name;
                    meta.content = tag.content;
                    document.head.appendChild(meta);
                  });
                  
                  const links = document.querySelectorAll('link[rel="stylesheet"], script[src]');
                  links.forEach(link => {
                    if (link.href || link.src) {
                      const url = new URL(link.href || link.src);
                      url.searchParams.set('v', timestamp.toString());
                      if (link.href) link.href = url.toString();
                      if (link.src) link.src = url.toString();
                    }
                  });
                }
                
                function detectAccessMethod() {
                  const referrer = document.referrer;
                  const userAgent = navigator.userAgent;
                  const isNaverAccess = referrer && (referrer.includes('naver.com') || referrer.includes('search.naver.com'));
                  const isGoogleAccess = referrer && (referrer.includes('google.com') || referrer.includes('google.co.kr'));
                  const isSearchEngineAccess = isNaverAccess || isGoogleAccess || referrer.includes('bing.com') || referrer.includes('daum.net');
                  const isExternalAccess = referrer && !referrer.includes(window.location.hostname);
                  const isDirectAccess = !referrer;
                  const isMobileAccess = /Mobile|Android|iPhone|iPad/.test(userAgent);
                  
                  console.log('[v0] Access detection for version replacement:', {
                    referrer,
                    isNaverAccess,
                    isGoogleAccess,
                    isSearchEngineAccess,
                    isExternalAccess,
                    isDirectAccess,
                    isMobileAccess
                  });
                  
                  return {
                    isSearchEngineAccess,
                    isExternalAccess,
                    isDirectAccess,
                    shouldClearCache: true // Always clear cache for complete version replacement
                  };
                }
                
                const lastVersion = localStorage.getItem(LAST_VERSION_KEY);
                const isNewVersion = lastVersion !== CURRENT_VERSION;
                const forceReloadDone = sessionStorage.getItem(FORCE_RELOAD_KEY);
                const accessInfo = detectAccessMethod();
                
                console.log('[v0] COMPLETE VERSION REPLACEMENT check:', {
                  lastVersion,
                  currentVersion: CURRENT_VERSION,
                  isNewVersion,
                  forceReloadDone,
                  accessInfo
                });
                
                if (isNewVersion || !lastVersion || accessInfo.shouldClearCache) {
                  console.log('[v0] FORCING complete version replacement');
                  
                  clearAllCaches();
                  
                  const essentialKeys = ['rotary-notices', 'rotary-members', 'rotary-attendance-rate', 'gallery-images', 'activities-data'];
                  const tempData = {};
                  essentialKeys.forEach(key => {
                    const data = localStorage.getItem(key);
                    if (data) tempData[key] = data;
                  });
                  
                  localStorage.clear();
                  sessionStorage.clear(); // Also clear session storage
                  
                  // Restore essential data
                  Object.keys(tempData).forEach(key => {
                    localStorage.setItem(key, tempData[key]);
                  });
                  
                  // Set new version
                  localStorage.setItem(LAST_VERSION_KEY, CURRENT_VERSION);
                  
                  if (!forceReloadDone) {
                    console.log('[v0] FORCING immediate page reload for version replacement');
                    sessionStorage.setItem(FORCE_RELOAD_KEY, 'true');
                    const reloadUrl = window.location.href + 
                      (window.location.search ? '&' : '?') + 
                      'v=' + Date.now() + '&refresh=1&force=1&source=' + 
                      (accessInfo.isSearchEngineAccess ? 'search' : 'direct');
                    window.location.replace(reloadUrl);
                    return;
                  }
                }
                
                let versionCheckInterval;
                
                function checkVersion() {
                  const currentStoredVersion = localStorage.getItem(LAST_VERSION_KEY);
                  if (currentStoredVersion !== CURRENT_VERSION) {
                    console.log('[v0] Version mismatch detected - forcing replacement');
                    clearAllCaches();
                    localStorage.setItem(LAST_VERSION_KEY, CURRENT_VERSION);
                    window.location.reload(true);
                  }
                }
                
                document.addEventListener('visibilitychange', function() {
                  if (!document.hidden) {
                    console.log('[v0] Page became visible, checking for version replacement');
                    setTimeout(checkVersion, 50); // Faster response time
                  }
                });
                
                window.addEventListener('focus', function() {
                  console.log('[v0] Window focused, checking for version replacement');
                  setTimeout(checkVersion, 50); // Faster response time
                });
                
                versionCheckInterval = setInterval(checkVersion, 5000); // Check every 5 seconds
                
                setTimeout(() => {
                  if (window.location.search || window.location.hash) {
                    const cleanUrl = window.location.origin + window.location.pathname;
                    window.history.replaceState({}, document.title, cleanUrl);
                  }
                }, 500); // Faster cleanup
                
                if (performance.navigation.type === 1) {
                  sessionStorage.removeItem(FORCE_RELOAD_KEY);
                }
                
                window.addEventListener('beforeunload', function() {
                  if (versionCheckInterval) {
                    clearInterval(versionCheckInterval);
                  }
                });
                
                console.log('[v0] COMPLETE VERSION REPLACEMENT system initialized successfully');
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
