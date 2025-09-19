"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bell, Calendar, Clock, MapPin, FileText, Edit, Trash2, Plus, Settings } from "lucide-react"
import { syncNoticesData, saveNoticesData } from "@/lib/notices-data"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"

export default function NoticesPage() {
  const [notices, setNotices] = useState([])
  const [noticesVersion, setNoticesVersion] = useState(0)
  const { requireAuth, showLogin, setShowLogin, handleLoginSuccess } = useAdminAuth()

  const syncNotices = () => {
    try {
      console.log("[v0] 공지사항 동기화 시작")
      const allNotices = syncNoticesData()
      console.log("[v0] 공지사항 로드 완료:", allNotices.length, "개")

      const parseDate = (dateStr) => {
        if (!dateStr) return new Date(0)
        const cleanDate = dateStr.replace(/[가-힣]/g, "").replace(/\.$/, "")
        return new Date(cleanDate.replace(/\./g, "-"))
      }

      const sortedNotices = allNotices.sort((a, b) => {
        const dateA = a.details?.date || a.date
        const dateB = b.details?.date || b.date
        return parseDate(dateB) - parseDate(dateA)
      })

      setNotices(sortedNotices)
      setNoticesVersion((prev) => prev + 1)
      console.log("[v0] 공지사항 페이지 동기화 완료:", sortedNotices.length, "개")
    } catch (error) {
      console.error("[v0] 공지사항 동기화 오류:", error)
      setNotices([])
    }
  }

  useEffect(() => {
    syncNotices()

    const handleStorageChange = (e) => {
      if (e.key === "homepage-notices") {
        syncNotices()
      }
    }

    const handleNoticesUpdate = () => {
      syncNotices()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("noticesUpdated", handleNoticesUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("noticesUpdated", handleNoticesUpdate)
    }
  }, [])

  const [isEditing, setIsEditing] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "일반",
    date: "",
    time: "",
    location: "",
  })

  const handleAddNotice = () => {
    requireAuth(() => {
      setIsEditing(false)
      setEditingNotice(null)
      setFormData({
        title: "",
        content: "",
        type: "일반",
        date: "",
        time: "",
        location: "",
      })
      setIsDialogOpen(true)
    })
  }

  const handleEditNotice = (notice) => {
    requireAuth(() => {
      setIsEditing(true)
      setEditingNotice(notice)
      setFormData({
        title: notice.title,
        content: notice.content,
        type: notice.type,
        date: notice.details?.date || "",
        time: notice.details?.time || "",
        location: notice.details?.location || "",
      })
      setIsDialogOpen(true)
    })
  }

  const handleDeleteNotice = (id) => {
    requireAuth(() => {
      const noticeToDelete = notices.find((notice) => notice.id === id)
      const confirmMessage = noticeToDelete
        ? `"${noticeToDelete.title}" 공지사항을 삭제하시겠습니까?`
        : "이 공지사항을 삭제하시겠습니까?"

      if (confirm(confirmMessage)) {
        try {
          const updatedNotices = notices.filter((notice) => notice.id !== id)
          saveNotices(updatedNotices)
          alert("공지사항이 성공적으로 삭제되었습니다.")
        } catch (error) {
          console.error("[v0] 공지사항 삭제 오류:", error)
          alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.")
        }
      }
    })
  }

  const saveNotices = (newNotices) => {
    try {
      const noticesForStorage = newNotices.map(({ icon, ...notice }) => notice)

      if (saveNoticesData(noticesForStorage)) {
        setNotices(noticesForStorage)
        setNoticesVersion((prev) => prev + 1)

        window.dispatchEvent(
          new CustomEvent("noticesUpdated", {
            detail: { notices: noticesForStorage },
          }),
        )
      }
    } catch (error) {
      console.error("[v0] 공지사항 저장 오류:", error)
      throw error
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.")
      return
    }

    const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, ".")

    const newNotice = {
      id: isEditing ? editingNotice.id : Date.now(),
      title: formData.title,
      content: formData.content,
      date: currentDate,
      type: formData.type,
      details:
        formData.date || formData.time || formData.location
          ? {
              date: formData.date,
              time: formData.time,
              location: formData.location,
            }
          : undefined,
    }

    let updatedNotices
    if (isEditing) {
      updatedNotices = notices.map((notice) => (notice.id === editingNotice.id ? newNotice : notice))
    } else {
      updatedNotices = [newNotice, ...notices]
    }

    try {
      saveNotices(updatedNotices)
      setIsDialogOpen(false)

      const actionText = isEditing ? "수정" : "추가"
      alert(`공지사항이 성공적으로 ${actionText}되었습니다!`)

      setFormData({
        title: "",
        content: "",
        type: "일반",
        date: "",
        time: "",
        location: "",
      })
    } catch (error) {
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  const importantNotices = notices.filter((notice) => notice.type === "중요")
  const regularNotices = notices.filter((notice) => notice.type !== "중요")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">공지사항</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              경주중앙로타리클럽의 최신 소식과 공지사항을 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notices Banner */}
      {importantNotices.length > 0 && (
        <section className="py-8 bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              <Bell className="h-6 w-6 text-amber-600" />
              <div className="text-center">
                <h3 className="text-lg font-bold text-amber-800 mb-2">중요 공지사항</h3>
                <div className="space-y-1 text-amber-700">
                  {importantNotices.map((notice) => (
                    <div key={notice.id}>
                      <p className="font-semibold">{notice.content}</p>
                      {notice.details && (
                        <div className="flex items-center justify-center space-x-4 text-sm mt-1">
                          {notice.details.date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{notice.details.date}</span>
                            </div>
                          )}
                          {notice.details.time && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{notice.details.time}</span>
                            </div>
                          )}
                          {notice.details.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{notice.details.location}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <div className="w-20 flex-shrink-0">
              <div className="bg-blue-600 text-white p-4 rounded-lg min-h-[500px] flex items-center justify-center sticky top-8 shadow-lg">
                <div className="transform -rotate-90 whitespace-nowrap">
                  <h2 className="text-2xl font-bold tracking-wider">공지사항</h2>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 min-w-0">
              <div className="space-y-6">
                {notices.length === 0 ? (
                  <Card className="text-center py-12 bg-white shadow-sm">
                    <CardContent>
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">등록된 공지사항이 없습니다.</p>
                      <p className="text-gray-400 text-sm mt-2">새로운 공지사항을 추가해보세요.</p>
                    </CardContent>
                  </Card>
                ) : (
                  notices.map((notice) => (
                    <Card
                      key={`${notice.id}-${noticesVersion}`}
                      className={`bg-white shadow-sm hover:shadow-md transition-shadow ${
                        notice.type === "중요" ? "border-amber-200 bg-amber-50" : ""
                      }`}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            {notice.type === "중요" ? (
                              <Bell className="h-4 w-4 text-amber-600" />
                            ) : (
                              <Calendar className="h-4 w-4 text-blue-600" />
                            )}
                            <CardTitle className="text-lg">{notice.title}</CardTitle>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={notice.type === "중요" ? "destructive" : "outline"}
                              className={notice.type === "중요" ? "bg-amber-500 hover:bg-amber-600" : ""}
                            >
                              {notice.type}
                            </Badge>
                            <Badge variant="outline">{notice.date}</Badge>
                            <Button size="sm" variant="outline" onClick={() => handleEditNotice(notice)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteNotice(notice.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{notice.content}</p>
                        {notice.details && (
                          <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">상세 정보</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              {notice.details.date && (
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <span>
                                    <strong>일시:</strong> {notice.details.date}
                                  </span>
                                </div>
                              )}
                              {notice.details.time && (
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span>
                                    <strong>시간:</strong> {notice.details.time}
                                  </span>
                                </div>
                              )}
                              {notice.details.location && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  <span>
                                    <strong>장소:</strong> {notice.details.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <div className="w-80 flex-shrink-0">
              <div className="sticky top-8">
                <Card className="bg-white shadow-lg min-h-[500px]">
                  <CardHeader className="bg-blue-100 rounded-t-lg">
                    <CardTitle className="text-lg text-center text-blue-800">공지사항 관리</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={handleAddNotice} className="w-full bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />새 공지사항 추가
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{isEditing ? "공지사항 수정" : "공지사항 추가"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">제목</label>
                            <Input
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">내용</label>
                            <Textarea
                              value={formData.content}
                              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                              required
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">유형</label>
                            <Select
                              value={formData.type}
                              onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="일반">일반</SelectItem>
                                <SelectItem value="중요">중요</SelectItem>
                                <SelectItem value="봉사">봉사</SelectItem>
                                <SelectItem value="행사">행사</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">일시</label>
                              <Input
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                placeholder="예: 2025년 8월 28일(목)"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">시간</label>
                              <Input
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                placeholder="예: 오후 7시"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">장소</label>
                              <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="예: 본 클럽회관"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                              취소
                            </Button>
                            <Button type="submit">{isEditing ? "수정" : "추가"}</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg border">
                      <div className="text-sm text-gray-600 text-center">
                        <p className="font-semibold">통계</p>
                        <p>총 {notices.length}개의 공지사항</p>
                        <p className="text-amber-600">중요: {importantNotices.length}개</p>
                        <p className="text-blue-600">일반: {regularNotices.length}개</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 text-center bg-blue-50 p-2 rounded">최근 공지사항</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notices.length === 0 ? (
                          <div className="text-center text-gray-500 text-sm py-4">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p>공지사항이 없습니다</p>
                          </div>
                        ) : (
                          notices.slice(0, 5).map((notice) => (
                            <div
                              key={notice.id}
                              className="p-3 bg-white rounded border text-sm hover:shadow-sm transition-shadow"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {notice.type === "중요" ? (
                                  <Bell className="h-4 w-4 text-amber-600" />
                                ) : (
                                  <Calendar className="h-4 w-4 text-blue-600" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {notice.type}
                                </Badge>
                              </div>
                              <p className="font-medium truncate">{notice.title}</p>
                              <p className="text-gray-500 text-xs">{notice.date}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <Settings className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm text-blue-800 font-medium">관리자 전용</p>
                        <p className="text-xs text-blue-600">공지사항 추가/수정/삭제</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
    </div>
  )
}
