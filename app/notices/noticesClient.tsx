"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, CalendarIcon, EditIcon, MapPinIcon, FileTextIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { Navigation } from "@/components/navigation"

interface Notice {
  id: string
  title: string
  content: string
  date: string
  location?: string
  eventDate?: string
  author: string
  important: boolean
}

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
    // Load notices from localStorage safely
    if (typeof window !== "undefined") {
      const savedNotices = localStorage.getItem("rotary-notices")
      if (savedNotices) {
        const parsed = JSON.parse(savedNotices)
        const sortedNotices = parsed.sort((a: Notice, b: Notice) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        setNotices(sortedNotices)
        console.log("[v0] 공지사항 로드 완료:", sortedNotices.length, "개")
      }
    }
  }, [])

  const saveNotices = (updatedNotices: Notice[]) => {
    if (typeof window !== "undefined") {
      const sortedNotices = updatedNotices.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      localStorage.setItem("rotary-notices", JSON.stringify(sortedNotices))
      setNotices(sortedNotices)
      console.log("[v0] 공지사항 저장 완료:", sortedNotices.length, "개")
    }
  }

  const handleAddClick = () => {
    requireAuth(() => setShowAddForm(!showAddForm))
  }

  const handleAddNotice = () => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) return

    const notice: Notice = {
      id: Date.now().toString(),
      title: newNotice.title,
      content: newNotice.content,
      location: newNotice.location,
      eventDate: newNotice.eventDate,
      date: new Date().toISOString().split("T")[0],
      author: "관리자",
      important: newNotice.important,
    }

    const updatedNotices = [notice, ...notices]
    saveNotices(updatedNotices)

    setNewNotice({ title: "", content: "", location: "", eventDate: "", important: false })
    setShowAddForm(false)
    console.log("[v0] 새 공지사항 추가:", notice.title)
  }

  const handleEditNotice = (notice: Notice) => {
    requireAuth(() => {
      setEditingNotice(notice)
      setNewNotice({
        title: notice.title,
        content: notice.content,
        location: notice.location || "",
        eventDate: notice.eventDate || "",
        important: notice.important,
      })
      setShowAddForm(true)
      console.log("[v0] 공지사항 편집 모드 활성화:", notice.title)
    })
  }

  const handleUpdateNotice = () => {
    if (!editingNotice || !newNotice.title.trim() || !newNotice.content.trim()) return

    const updatedNotices = notices.map((notice) =>
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

    saveNotices(updatedNotices)
    setEditingNotice(null)
    setNewNotice({ title: "", content: "", location: "", eventDate: "", important: false })
    setShowAddForm(false)
    console.log("[v0] 공지사항 수정 완료:", newNotice.title)
  }

  const handleCancelEdit = () => {
    setEditingNotice(null)
    setNewNotice({ title: "", content: "", location: "", eventDate: "", important: false })
    setShowAddForm(false)
  }

  const handleDeleteNotice = (id: string) => {
    requireAuth(() => {
      const noticeToDelete = notices.find((n) => n.id === id)
      const updatedNotices = notices.filter((notice) => notice.id !== id)
      saveNotices(updatedNotices)
      console.log("[v0] 공지사항 삭제:", noticeToDelete?.title)
    })
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/placeholder.svg?height=800&width=1200')",
        backgroundPosition: "center 20%",
      }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]"></div>

      <div className="relative z-10">
        <Navigation />

        <div className="pt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">공지사항</h1>
                <p className="text-base text-gray-700">경주중앙로타리클럽의 중요한 소식을 확인하세요</p>
              </div>

              <div className="mb-6">
                <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  공지사항 추가
                </Button>
              </div>

              {showAddForm && isAuthenticated && (
                <Card className="mb-6">
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
                  <Card className="bg-white/90 backdrop-blur-sm">
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
                    </CardContent>
                  </Card>
                ) : (
                  notices.map((notice) => (
                    <Card
                      key={notice.id}
                      className="hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm border border-gray-200"
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
