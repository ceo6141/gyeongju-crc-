"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, CalendarIcon, EditIcon, MapPinIcon, FileTextIcon, SaveIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { Navigation } from "@/components/navigation"
import { unifiedNoticesManager, type Notice, setupUnifiedDataSync } from "@/lib/unified-data-manager"

export default function NoticesClient() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    location: "",
    eventDate: "",
    important: false,
  })

  const { isAuthenticated, showLogin, setShowLogin, requireAuth, handleLoginSuccess } = useAdminAuth()

  useEffect(() => {
    // 통합 데이터 동기화 시스템 초기화
    setupUnifiedDataSync()

    const loadData = () => {
      try {
        const loadedNotices = unifiedNoticesManager.getAll()
        setNotices(loadedNotices)
        console.log("[v0] 통합 매니저로 공지사항 로드 완료:", loadedNotices.length, "개")
      } catch (error) {
        console.error("[v0] 공지사항 로드 오류:", error)
        // 오류 시 강제 복구 시도
        unifiedNoticesManager.forceRecover()
        const recoveredNotices = unifiedNoticesManager.getAll()
        setNotices(recoveredNotices)
        console.log("[v0] 공지사항 강제 복구 완료:", recoveredNotices.length, "개")
      }
    }

    loadData()

    // 데이터 변경 이벤트 리스너
    const handleNoticesUpdate = (event: CustomEvent) => {
      console.log("[v0] 공지사항 업데이트 이벤트 수신")
      setNotices(event.detail.data)
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "rotary-notices") {
        console.log("[v0] 스토리지 변경 감지 - 공지사항 새로고침")
        loadData()
      }
    }

    const handleDataSync = (event: CustomEvent) => {
      if (event.detail.key === "rotary-notices") {
        console.log("[v0] 데이터 동기화 이벤트 수신")
        setNotices(event.detail.data)
      }
    }

    window.addEventListener("noticesUpdated", handleNoticesUpdate as EventListener)
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("rotaryDataSync", handleDataSync as EventListener)

    return () => {
      window.removeEventListener("noticesUpdated", handleNoticesUpdate as EventListener)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("rotaryDataSync", handleDataSync as EventListener)
    }
  }, [])

  const saveNotices = (updatedNotices: Notice[]) => {
    try {
      console.log("[v0] 공지사항 저장 시작:", updatedNotices.length, "개")

      // 통합 매니저의 내부 데이터를 직접 업데이트
      unifiedNoticesManager["data"] = [...updatedNotices]

      // 모든 백업에 저장
      const success = unifiedNoticesManager["saveToAllBackups"]()

      if (success) {
        const finalNotices = unifiedNoticesManager.getAll()
        setNotices(finalNotices)
        console.log("[v0] 공지사항 저장 완료:", finalNotices.length, "개")
      } else {
        throw new Error("저장 실패")
      }
    } catch (error) {
      console.error("[v0] 공지사항 저장 실패:", error)
      alert("데이터 저장에 실패했습니다. 다시 시도해주세요.")
    }
  }

  const handleManualBackup = () => {
    requireAuth(() => {
      try {
        const allNotices = unifiedNoticesManager.getAll()
        const dataString = JSON.stringify(allNotices, null, 2)
        const blob = new Blob([dataString], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rotary-notices-backup-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        console.log("[v0] 통합 매니저 백업 파일 다운로드 완료")
      } catch (error) {
        console.error("[v0] 백업 다운로드 실패:", error)
        alert("백업 다운로드에 실패했습니다.")
      }
    })
  }

  const handleAddClick = () => {
    requireAuth(() => setShowAddForm(!showAddForm))
  }

  const handleAddNotice = () => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) return

    const notice: Notice = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newNotice.title,
      content: newNotice.content,
      location: newNotice.location,
      eventDate: newNotice.eventDate,
      date: new Date().toISOString().split("T")[0],
      author: "관리자",
      important: newNotice.important,
    }

    const currentNotices = unifiedNoticesManager.getAll()
    const updatedNotices = [notice, ...currentNotices]

    // 통합 매니저의 내부 데이터 직접 업데이트
    unifiedNoticesManager["data"] = updatedNotices
    const success = unifiedNoticesManager["saveToAllBackups"]()

    if (success) {
      setNotices(updatedNotices)
      setNewNotice({ title: "", content: "", location: "", eventDate: "", important: false })
      setShowAddForm(false)
      console.log("[v0] 새 공지사항 추가:", notice.title)
    } else {
      alert("공지사항 추가에 실패했습니다.")
    }
  }

  const handleEditNotice = (notice: Notice) => {
    requireAuth(() => {
      setEditingNotice(notice)
      setNewNotice({
        title: notice.title,
        content: notice.content,
        location: notice.location || "",
        eventDate: notice.eventDate || "",
        important: notice.important || false,
      })
      setShowAddForm(true)
      console.log("[v0] 공지사항 편집 모드 활성화:", notice.title)
    })
  }

  const handleUpdateNotice = () => {
    if (!editingNotice || !newNotice.title.trim() || !newNotice.content.trim()) return

    const currentNotices = unifiedNoticesManager.getAll()
    const updatedNotices = currentNotices.map((notice) =>
      notice.id === editingNotice.id
        ? {
            ...notice,
            title: newNotice.title,
            content: newNotice.content,
            location: newNotice.location,
            eventDate: newNotice.eventDate,
            important: newNotice.important,
          }
        : notice,
    )

    // 통합 매니저의 내부 데이터 직접 업데이트
    unifiedNoticesManager["data"] = updatedNotices
    const success = unifiedNoticesManager["saveToAllBackups"]()

    if (success) {
      setNotices(updatedNotices)
      setEditingNotice(null)
      setNewNotice({ title: "", content: "", location: "", eventDate: "", important: false })
      setShowAddForm(false)
      console.log("[v0] 공지사항 수정 완료:", newNotice.title)
    } else {
      alert("공지사항 수정에 실패했습니다.")
    }
  }

  const handleCancelEdit = () => {
    setEditingNotice(null)
    setNewNotice({ title: "", content: "", location: "", eventDate: "", important: false })
    setShowAddForm(false)
  }

  const handleDeleteNotice = (id: string) => {
    requireAuth(() => {
      const currentNotices = unifiedNoticesManager.getAll()
      const noticeToDelete = currentNotices.find((n) => n.id === id)
      const updatedNotices = currentNotices.filter((notice) => notice.id !== id)

      // 통합 매니저의 내부 데이터 직접 업데이트
      unifiedNoticesManager["data"] = updatedNotices
      const success = unifiedNoticesManager["saveToAllBackups"]()

      if (success) {
        setNotices(updatedNotices)
        console.log("[v0] 공지사항 삭제 완료:", noticeToDelete?.title)
      } else {
        alert("공지사항 삭제에 실패했습니다.")
      }
    })
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/images/rotary-background.jpg')",
        backgroundPosition: "center 5%",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>

      <div className="relative z-10">
        <Navigation />

        <div className="pt-0">
          <div className="container mx-auto px-4 py-0">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-1 mt-2">
                <h1 className="text-xl font-bold text-gray-900 mb-0">공지사항</h1>
                <p className="text-xs text-gray-700">경주중앙로타리클럽의 중요한 소식을 확인하세요</p>
              </div>

              <div className="mb-1 flex gap-2">
                <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  공지사항 추가
                </Button>
                <Button onClick={handleManualBackup} variant="outline" className="bg-green-50 hover:bg-green-100">
                  <SaveIcon className="w-4 h-4 mr-2" />
                  백업 다운로드
                </Button>
              </div>

              {showAddForm && isAuthenticated && (
                <Card className="mb-4 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>{editingNotice ? "공지사항 수정" : "새 공지사항 작성"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="제목을 입력하세요"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="일시 (예: 2025.09.26.금요일)"
                        value={newNotice.eventDate}
                        onChange={(e) => setNewNotice({ ...newNotice, eventDate: e.target.value })}
                      />
                      <Input
                        placeholder="장소 (예: 장수만세국수 (권덕용 회원))"
                        value={newNotice.location}
                        onChange={(e) => setNewNotice({ ...newNotice, location: e.target.value })}
                      />
                    </div>
                    <Textarea
                      placeholder="내용을 입력하세요"
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                      rows={4}
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="important"
                        checked={newNotice.important}
                        onChange={(e) => setNewNotice({ ...newNotice, important: e.target.checked })}
                      />
                      <label htmlFor="important">중요 공지</label>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={editingNotice ? handleUpdateNotice : handleAddNotice}>
                        {editingNotice ? "수정" : "등록"}
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        취소
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {notices.length === 0 ? (
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
                    </CardContent>
                  </Card>
                ) : (
                  notices.map((notice) => (
                    <Card
                      key={notice.id}
                      className="hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm border border-gray-200"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                            {/* 제목 */}
                            <div className="md:col-span-2 flex items-center gap-2">
                              <span className="font-semibold text-gray-900 text-sm">제목: {notice.title}</span>
                              {notice.important && (
                                <Badge variant="destructive" className="text-xs">
                                  중요
                                </Badge>
                              )}
                            </div>

                            {/* 일시 */}
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <CalendarIcon className="w-4 h-4 text-blue-600" />
                              <span>일시: {notice.eventDate || "미정"}</span>
                            </div>

                            {/* 장소 */}
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <MapPinIcon className="w-4 h-4 text-green-600" />
                              <span>장소: {notice.location || "미정"}</span>
                            </div>

                            {/* 내용 */}
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <FileTextIcon className="w-4 h-4 text-purple-600" />
                              <span>
                                내용:{" "}
                                {notice.content.length > 15 ? notice.content.substring(0, 15) + "..." : notice.content}
                              </span>
                            </div>

                            {/* 작성일 */}
                            <div className="text-sm text-gray-600">
                              작성일: {new Date(notice.date).toLocaleDateString("ko-KR")}
                            </div>
                          </div>

                          {/* 관리 버튼 */}
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditNotice(notice)}
                              className="text-xs"
                            >
                              <EditIcon className="w-3 h-3 mr-1" />
                              수정
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteNotice(notice.id)}
                              className="text-xs"
                            >
                              삭제
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
    </div>
  )
}
