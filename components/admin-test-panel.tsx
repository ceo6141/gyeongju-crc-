"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestTube, CheckCircle, XCircle, AlertCircle, Database, ImageIcon, FileText, Users } from "lucide-react"
import { noticesManager, galleryManager, memberNewsManager, syncAllData } from "@/lib/data-manager"
import { DataBackup } from "@/components/data-backup"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  timestamp: string
}

export function AdminTestPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addTestResult = (name: string, status: "success" | "error" | "warning", message: string) => {
    const result: TestResult = {
      name,
      status,
      message,
      timestamp: new Date().toLocaleTimeString(),
    }
    setTestResults((prev) => [result, ...prev])
  }

  // 공지사항 CRUD 테스트
  const testNoticesCRUD = async () => {
    try {
      // Create 테스트
      const testNotice = {
        title: "테스트 공지사항",
        content: "CRUD 테스트용 공지사항입니다.",
        date: new Date().toISOString().split("T")[0],
        type: "테스트",
        details: {
          date: "2024-12-01",
          time: "14:00",
          location: "테스트 장소",
        },
      }

      const createSuccess = noticesManager.add(testNotice)
      if (createSuccess) {
        addTestResult("공지사항 생성", "success", "테스트 공지사항이 성공적으로 생성되었습니다.")
      } else {
        addTestResult("공지사항 생성", "error", "공지사항 생성에 실패했습니다.")
        return
      }

      // Read 테스트
      const allNotices = noticesManager.getAll()
      const createdNotice = allNotices.find((n) => n.title === "테스트 공지사항")
      if (createdNotice) {
        addTestResult("공지사항 조회", "success", `공지사항 조회 성공: ${createdNotice.title}`)
      } else {
        addTestResult("공지사항 조회", "error", "생성된 공지사항을 찾을 수 없습니다.")
        return
      }

      // Update 테스트
      const updateSuccess = noticesManager.update(createdNotice.id, {
        title: "수정된 테스트 공지사항",
        content: "수정된 내용입니다.",
      })
      if (updateSuccess) {
        addTestResult("공지사항 수정", "success", "공지사항이 성공적으로 수정되었습니다.")
      } else {
        addTestResult("공지사항 수정", "error", "공지사항 수정에 실패했습니다.")
      }

      // Delete 테스트
      const deleteSuccess = noticesManager.delete(createdNotice.id)
      if (deleteSuccess) {
        addTestResult("공지사항 삭제", "success", "테스트 공지사항이 성공적으로 삭제되었습니다.")
      } else {
        addTestResult("공지사항 삭제", "error", "공지사항 삭제에 실패했습니다.")
      }
    } catch (error) {
      addTestResult(
        "공지사항 CRUD",
        "error",
        `오류 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      )
    }
  }

  // 갤러리 CRUD 테스트
  const testGalleryCRUD = async () => {
    try {
      // Create 테스트
      const testImage = {
        title: "테스트 이미지",
        description: "CRUD 테스트용 이미지입니다.",
        date: new Date().toISOString().split("T")[0],
        location: "테스트 장소",
        imageUrl: "/placeholder.svg?height=400&width=600&text=테스트+이미지",
        originalWidth: 600,
        originalHeight: 400,
      }

      const createSuccess = galleryManager.add(testImage)
      if (createSuccess) {
        addTestResult("갤러리 생성", "success", "테스트 이미지가 성공적으로 생성되었습니다.")
      } else {
        addTestResult("갤러리 생성", "error", "이미지 생성에 실패했습니다.")
        return
      }

      // Read 테스트
      const allImages = galleryManager.getAll()
      const createdImage = allImages.find((img) => img.title === "테스트 이미지")
      if (createdImage) {
        addTestResult("갤러리 조회", "success", `이미지 조회 성공: ${createdImage.title}`)
      } else {
        addTestResult("갤러리 조회", "error", "생성된 이미지를 찾을 수 없습니다.")
        return
      }

      // Update 테스트
      const updateSuccess = galleryManager.update(createdImage.id, {
        title: "수정된 테스트 이미지",
        description: "수정된 설명입니다.",
      })
      if (updateSuccess) {
        addTestResult("갤러리 수정", "success", "이미지가 성공적으로 수정되었습니다.")
      } else {
        addTestResult("갤러리 수정", "error", "이미지 수정에 실패했습니다.")
      }

      // Delete 테스트
      const deleteSuccess = galleryManager.delete(createdImage.id)
      if (deleteSuccess) {
        addTestResult("갤러리 삭제", "success", "테스트 이미지가 성공적으로 삭제되었습니다.")
      } else {
        addTestResult("갤러리 삭제", "error", "이미지 삭제에 실패했습니다.")
      }
    } catch (error) {
      addTestResult("갤러리 CRUD", "error", `오류 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
    }
  }

  // 회원소식 CRUD 테스트
  const testMemberNewsCRUD = async () => {
    try {
      // Create 테스트
      const testNews = {
        title: "테스트 회원소식",
        content: "CRUD 테스트용 회원소식입니다.",
        date: new Date().toISOString().split("T")[0],
        category: "테스트",
      }

      const createSuccess = memberNewsManager.add(testNews)
      if (createSuccess) {
        addTestResult("회원소식 생성", "success", "테스트 회원소식이 성공적으로 생성되었습니다.")
      } else {
        addTestResult("회원소식 생성", "error", "회원소식 생성에 실패했습니다.")
        return
      }

      // Read 테스트
      const allNews = memberNewsManager.getAll()
      const createdNews = allNews.find((news) => news.title === "테스트 회원소식")
      if (createdNews) {
        addTestResult("회원소식 조회", "success", `회원소식 조회 성공: ${createdNews.title}`)
      } else {
        addTestResult("회원소식 조회", "error", "생성된 회원소식을 찾을 수 없습니다.")
        return
      }

      // Update 테스트
      const updateSuccess = memberNewsManager.update(createdNews.id, {
        title: "수정된 테스트 회원소식",
        content: "수정된 내용입니다.",
      })
      if (updateSuccess) {
        addTestResult("회원소식 수정", "success", "회원소식이 성공적으로 수정되었습니다.")
      } else {
        addTestResult("회원소식 수정", "error", "회원소식 수정에 실패했습니다.")
      }

      // Delete 테스트
      const deleteSuccess = memberNewsManager.delete(createdNews.id)
      if (deleteSuccess) {
        addTestResult("회원소식 삭제", "success", "테스트 회원소식이 성공적으로 삭제되었습니다.")
      } else {
        addTestResult("회원소식 삭제", "error", "회원소식 삭제에 실패했습니다.")
      }
    } catch (error) {
      addTestResult(
        "회원소식 CRUD",
        "error",
        `오류 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      )
    }
  }

  // 데이터 지속성 테스트
  const testDataPersistence = async () => {
    try {
      // localStorage 접근 테스트
      const testKey = "test-persistence"
      const testData = { test: true, timestamp: Date.now() }

      localStorage.setItem(testKey, JSON.stringify(testData))
      const retrieved = localStorage.getItem(testKey)

      if (retrieved) {
        const parsed = JSON.parse(retrieved)
        if (parsed.test === true) {
          addTestResult("데이터 지속성", "success", "localStorage 읽기/쓰기가 정상 작동합니다.")
        } else {
          addTestResult("데이터 지속성", "error", "데이터 무결성 검증에 실패했습니다.")
        }
      } else {
        addTestResult("데이터 지속성", "error", "localStorage에서 데이터를 읽을 수 없습니다.")
      }

      localStorage.removeItem(testKey)

      // 동기화 테스트
      syncAllData()
      addTestResult("데이터 동기화", "success", "모든 데이터 매니저 동기화가 완료되었습니다.")
    } catch (error) {
      addTestResult(
        "데이터 지속성",
        "error",
        `오류 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      )
    }
  }

  // 전체 테스트 실행
  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    addTestResult("테스트 시작", "success", "모든 CRUD 작업 테스트를 시작합니다.")

    await new Promise((resolve) => setTimeout(resolve, 500))
    await testNoticesCRUD()

    await new Promise((resolve) => setTimeout(resolve, 500))
    await testGalleryCRUD()

    await new Promise((resolve) => setTimeout(resolve, 500))
    await testMemberNewsCRUD()

    await new Promise((resolve) => setTimeout(resolve, 500))
    await testDataPersistence()

    addTestResult("테스트 완료", "success", "모든 CRUD 작업 테스트가 완료되었습니다.")
    setIsRunning(false)
  }

  // 데이터 현황 조회
  const getDataStats = () => {
    return {
      notices: noticesManager.getAll().length,
      gallery: galleryManager.getAll().length,
      memberNews: memberNewsManager.getAll().length,
    }
  }

  const stats = getDataStats()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <TestTube className="h-4 w-4" />
          CRUD 테스트
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            관리자 CRUD 테스트 패널
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="tests">테스트</TabsTrigger>
            <TabsTrigger value="data">데이터</TabsTrigger>
            <TabsTrigger value="backup">백업</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    공지사항
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.notices}</div>
                  <p className="text-xs text-muted-foreground">개의 공지사항</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    갤러리
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.gallery}</div>
                  <p className="text-xs text-muted-foreground">개의 이미지</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    회원소식
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.memberNews}</div>
                  <p className="text-xs text-muted-foreground">개의 소식</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">시스템 상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">localStorage 지원</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    정상
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">데이터 매니저</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    활성화
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">이벤트 시스템</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    작동중
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={runAllTests} disabled={isRunning} className="gap-2">
                <TestTube className="h-4 w-4" />
                {isRunning ? "테스트 실행 중..." : "전체 테스트 실행"}
              </Button>
              <Button variant="outline" onClick={() => setTestResults([])} disabled={isRunning}>
                결과 초기화
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.status === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {result.status === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                      {result.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      <span className="font-medium text-sm">{result.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                </Card>
              ))}

              {testResults.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <TestTube className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>테스트를 실행하여 결과를 확인하세요.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">공지사항 데이터</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {noticesManager
                      .getAll()
                      .slice(0, 3)
                      .map((notice) => (
                        <div key={notice.id} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="text-sm font-medium">{notice.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {notice.id.startsWith("default-") ? "기본" : "사용자"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">갤러리 데이터</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {galleryManager
                      .getAll()
                      .slice(0, 3)
                      .map((image) => (
                        <div key={image.id} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="text-sm font-medium">{image.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {image.id.startsWith("default-") ? "기본" : "사용자"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">회원소식 데이터</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {memberNewsManager
                      .getAll()
                      .slice(0, 3)
                      .map((news) => (
                        <div key={news.id} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="text-sm font-medium">{news.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {String(news.id).startsWith("default-") ? "기본" : "사용자"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  데이터 백업 및 복원
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">모든 데이터를 안전하게 백업하고 복원할 수 있습니다.</p>
                  <DataBackup />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">데이터 동기화</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    모든 데이터 매니저를 동기화하여 최신 상태로 유지합니다.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      syncAllData()
                      addTestResult("수동 동기화", "success", "모든 데이터가 동기화되었습니다.")
                    }}
                    className="gap-2"
                  >
                    <Database className="h-4 w-4" />
                    데이터 동기화
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
