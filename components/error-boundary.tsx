"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[v0] Error caught by boundary:", error, errorInfo)

    // Handle chunk loading errors specifically
    if (error.message.includes("Loading chunk") || error.message.includes("ChunkLoadError")) {
      console.log("[v0] Chunk loading error detected, attempting reload")
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">페이지 로딩 오류</h2>
            <p className="text-gray-600 mb-6">페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              페이지 새로고침
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
