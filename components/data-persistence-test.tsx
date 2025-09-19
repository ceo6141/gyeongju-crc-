"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircleIcon, XCircleIcon, AlertCircleIcon, RefreshCwIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { noticesDataManager, activitiesDataManager, galleryDataManager } from "@/lib/data-persistence"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  details?: string
}

export function DataPersistenceTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const results: TestResult[] = []

    // 공지사항 데이터 테스트
    try {
      const noticesData = noticesDataManager.loadData()
      const testNotice = {
        id: "test-" + Date.now(),
        title: "테스트 공지사항",
        content: "데이터 지속성 테스트",
        date: new Date().toISOString().split("T")[0],
        location: "테스트 장소",
        eventDate: "2025.09.30.월요일",
        author: "테스트",
        important: false,
      }

      const updatedNotices = [testNotice, ...noticesData]
      const saveSuccess = noticesDataManager.saveData(updatedNotices)

      if (saveSuccess) {
        const reloadedData = noticesDataManager.loadData()
        const testExists = reloadedData.some((notice) => notice.id === testNotice.id)

        if (testExists) {
          results.push({
            name: "공지사항 데이터 지속성",
            status: "success",
            message: "저장 및 로드 성공",
            details: `${reloadedData.length}개 항목 확인`,
          })

          // 테스트 데이터 정리
          const cleanedData = reloadedData.filter((notice) => notice.id !== testNotice.id)
          noticesDataManager.saveData(cleanedData)
        } else {
          results.push({
            name: "공지사항 데이터 지속성",
            status: "error",
            message: "데이터 로드 실패",
            details: "저장된 데이터를 다시 로드할 수 없음",
          })
        }
      } else {
        results.push({
          name: "공지사항 데이터 지속성",
          status: "error",
          message: "데이터 저장 실패",
        })
      }
    } catch (error) {
      results.push({
        name: "공지사항 데이터 지속성",
        status: "error",
        message: "테스트 중 오류 발생",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      })
    }

    // 봉사활동 데이터 테스트
    try {
      const activitiesData = activitiesDataManager.loadData()
      const testActivity = {
        id: "test-" + Date.now(),
        title: "테스트 봉사활동",
        description: "데이터 지속성 테스트",
        date: new Date().toISOString().split("T")[0],
        location: "테스트 장소",
        participants: 1,
        status: "planned" as const,
      }

      const updatedActivities = [testActivity, ...activitiesData]
      const saveSuccess = activitiesDataManager.saveData(updatedActivities)

      if (saveSuccess) {
        const reloadedData = activitiesDataManager.loadData()
        const testExists = reloadedData.some((activity) => activity.id === testActivity.id)

        if (testExists) {
          results.push({
            name: "봉사활동 데이터 지속성",
            status: "success",
            message: "저장 및 로드 성공",
            details: `${reloadedData.length}개 항목 확인`,
          })

          // 테스트 데이터 정리
          const cleanedData = reloadedData.filter((activity) => activity.id !== testActivity.id)
          activitiesDataManager.saveData(cleanedData)
        } else {
          results.push({
            name: "봉사활동 데이터 지속성",
            status: "error",
            message: "데이터 로드 실패",
          })
        }
      } else {
        results.push({
          name: "봉사활동 데이터 지속성",
          status: "error",
          message: "데이터 저장 실패",
        })
      }
    } catch (error) {
      results.push({
        name: "봉사활동 데이터 지속성",
        status: "error",
        message: "테스트 중 오류 발생",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      })
    }

    // 갤러리 데이터 테스트
    try {
      const galleryData = galleryDataManager.loadData()
      const testImage = {
        id: "test-" + Date.now(),
        title: "테스트 이미지",
        imageUrl: "/placeholder.svg?height=200&width=300&text=테스트",
        date: new Date().toISOString().split("T")[0],
        description: "데이터 지속성 테스트",
      }

      const updatedGallery = [testImage, ...galleryData]
      const saveSuccess = galleryDataManager.saveData(updatedGallery)

      if (saveSuccess) {
        const reloadedData = galleryDataManager.loadData()
        const testExists = reloadedData.some((image) => image.id === testImage.id)

        if (testExists) {
          results.push({
            name: "갤러리 데이터 지속성",
            status: "success",
            message: "저장 및 로드 성공",
            details: `${reloadedData.length}개 항목 확인`,
          })

          // 테스트 데이터 정리
          const cleanedData = reloadedData.filter((image) => image.id !== testImage.id)
          galleryDataManager.saveData(cleanedData)
        } else {
          results.push({
            name: "갤러리 데이터 지속성",
            status: "error",
            message: "데이터 로드 실패",
          })
        }
      } else {
        results.push({
          name: "갤러리 데이터 지속성",
          status: "error",
          message: "데이터 저장 실패",
        })
      }
    } catch (error) {
      results.push({
        name: "갤러리 데이터 지속성",
        status: "error",
        message: "테스트 중 오류 발생",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      })
    }

    // localStorage 용량 테스트
    try {
      const storageUsage = Object.keys(localStorage)
        .filter((key) => key.startsWith("rotary-"))
        .reduce((total, key) => {
          const value = localStorage.getItem(key) || ""
          return total + key.length + value.length
        }, 0)

      const storageUsageMB = (storageUsage / (1024 * 1024)).toFixed(2)

      if (storageUsage < 5 * 1024 * 1024) {
        // 5MB 미만
        results.push({
          name: "localStorage 용량",
          status: "success",
          message: "정상 범위",
          details: `${storageUsageMB}MB 사용 중`,
        })
      } else {
        results.push({
          name: "localStorage 용량",
          status: "warning",
          message: "용량 주의",
          details: `${storageUsageMB}MB 사용 중 (5MB 이상)`,
        })
      }
    } catch (error) {
      results.push({
        name: "localStorage 용량",
        status: "error",
        message: "용량 확인 실패",
      })
    }

    setTestResults(results)
    setIsRunning(false)
    console.log("[v0] 데이터 지속성 테스트 완료:", results)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircleIcon className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertCircleIcon className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            성공
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">실패</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            주의
          </Badge>
        )
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          데이터 지속성 테스트
          <Button variant="outline" size="sm" onClick={runTests} disabled={isRunning}>
            <RefreshCwIcon className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "테스트 중..." : "다시 테스트"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testResults.length === 0 && isRunning && (
            <div className="text-center py-8">
              <RefreshCwIcon className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-gray-600">데이터 지속성 테스트 진행 중...</p>
            </div>
          )}

          {testResults.map((result, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{result.name}</h4>
                  {getStatusBadge(result.status)}
                </div>
                <p className="text-sm text-gray-600">{result.message}</p>
                {result.details && <p className="text-xs text-gray-500 mt-1">{result.details}</p>}
              </div>
            </div>
          ))}

          {testResults.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">테스트 요약</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {testResults.filter((r) => r.status === "success").length}
                  </div>
                  <div className="text-gray-600">성공</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {testResults.filter((r) => r.status === "warning").length}
                  </div>
                  <div className="text-gray-600">주의</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    {testResults.filter((r) => r.status === "error").length}
                  </div>
                  <div className="text-gray-600">실패</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
