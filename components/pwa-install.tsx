"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DownloadIcon, XIcon } from "@/components/icons"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <DownloadIcon className="h-5 w-5" />
        <div>
          <p className="font-semibold">앱으로 설치하기</p>
          <p className="text-sm opacity-90">홈 화면에 추가하여 빠르게 접속하세요</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleInstall} variant="secondary" size="sm">
          설치
        </Button>
        <Button onClick={handleDismiss} variant="ghost" size="sm" className="text-white hover:bg-white/20">
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
