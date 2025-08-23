import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "경주중앙로타리클럽",
  description: "경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "경주중앙RC",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "경주중앙로타리클럽",
    title: "경주중앙로타리클럽",
    description: "경주중앙로타리클럽 공식 웹사이트 - 봉사를 통한 지역사회 발전",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="application-name" content="경주중앙RC" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="경주중앙RC" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="apple-touch-icon" href="/rotary-international-logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/rotary-international-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/rotary-international-logo.png" />
        <link rel="manifest" href="/manifest.json" />
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
