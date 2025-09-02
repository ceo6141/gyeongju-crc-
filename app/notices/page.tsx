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
import { Bell, Calendar, MapPin, Clock, Plus, Edit, Trash2 } from "lucide-react"
import { syncNoticesData, saveNoticesData } from "@/lib/notices-data"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"

export default function NoticesPage() {
  const [notices, setNotices] = useState([])
  const [noticesVersion, setNoticesVersion] = useState(0)
  const { requireAuth, showLogin, setShowLogin, handleLoginSuccess } = useAdminAuth()

  const syncNotices = () => {
    const allNotices = syncNoticesData()

    const currentDate = new Date()
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0)
      // Handle formats like "2025.09.04목" or "2025.08.28.목"
      const cleanDate = dateStr.replace(/[가-힣]/g, "").replace(/\.$/, "")
      return new Date(cleanDate.replace(/\./g, "-"))
    }

    const filteredNotices = allNotices.filter((notice) => {
      // 중요 공지사항인 경우 날짜 확인
      if (notice.type === "중요") {
        const noticeDate = parseDate(notice.details?.date || notice.date)
        // 현재 날짜보다 과거인 중요 공지사항은 제거
        if (noticeDate < currentDate) {
          console.log("[v0] 과거 날짜의 중요 공지사항 제거:", notice.title, notice.details?.date || notice.date)
          return false
        }
      }
      return true
    })

    // 필터링된 데이터를 다시 저장 (과거 중요 공지사항이 제거됨)
    if (filteredNotices.length !== allNotices.length) {
      const noticesForStorage = filteredNotices.map(({ icon, ...notice }) => notice)
      saveNoticesData(noticesForStorage)
      console.log("[v0] 과거 중요 공지사항 삭제 후 저장 완료:", filteredNotices.length, "개")
    }

    const noticesWithIcons = filteredNotices
      .map((notice) => ({
        ...notice,
        icon: notice.type === "중요" ? <Bell className="h-4 w-4" /> : <Calendar className="h-4 w-4" />,
      }))
      .sort((a, b) => {
        const dateA = a.details?.date || a.date
        const dateB = b.details?.date || b.date

        return parseDate(dateB) - parseDate(dateA)
      })

    setNotices(noticesWithIcons)
    setNoticesVersion((prev) => prev + 1)
    console.log("[v0] 공지사항 페이지 동기화 완료:", noticesWithIcons.length, "개")
    console.log("[v0] 공지사항 페이지 데이터:", noticesWithIcons)
  }

  useEffect(() => {
    syncNotices()

    const handleStorageChange = (e) => {
      if (e.key === "rotary-notices") {
        console.log("[v0] 공지사항 페이지 Storage 변경 감지, 재동기화")
        syncNotices()
      }
    }

    const handleNoticesUpdate = (e) => {
      console.log("[v0] 공지사항 페이지 업데이트 이벤트 감지, 즉시 동기화")
      syncNotices()
    }

    const handleFocus = () => {
      console.log("[v0] 공지사항 페이지 포커스, 재동기화")
      syncNotices()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("noticesUpdated", handleNoticesUpdate)
    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("noticesUpdated", handleNoticesUpdate)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

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
    console.log("[v0] 공지사항 수정 버튼 클릭됨:", notice.title)
    requireAuth(() => {
      console.log("[v0] 관리자 인증 성공, 수정 모드 진입")
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
      console.log("[v0] 수정 폼 데이터 설정 완료:", formData)
    })
  }

  const handleDeleteNotice = (id) => {
    console.log("[v0] 공지사항 삭제 버튼 클릭됨:", id)
    requireAuth(() => {
      console.log("[v0] 관리자 인증 성공, 삭제 진행")

      const noticeToDelete = notices.find((notice) => notice.id === id)
      const confirmMessage = noticeToDelete
        ? `"${noticeToDelete.title}" 공지사항을 삭제하시겠습니까?`
        : "이 공지사항을 삭제하시겠습니까?"

      if (confirm(confirmMessage)) {
        try {
          const updatedNotices = notices.filter((notice) => notice.id !== id)
          saveNotices(updatedNotices)
          console.log("[v0] 공지사항 삭제 완료:", noticeToDelete?.title || id)

          const successMessage = noticeToDelete
            ? `"${noticeToDelete.title}" 공지사항이 성공적으로 삭제되었습니다.`
            : "공지사항이 성공적으로 삭제되었습니다."

          alert(successMessage)
        } catch (error) {
          console.error("[v0] 공지사항 삭제 오류:", error)
          alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.")
        }
      }
    })
  }

  const saveNotices = (newNotices) => {
    const noticesForStorage = newNotices.map(({ icon, ...notice }) => notice)
    if (saveNoticesData(noticesForStorage)) {
      setNotices(
        newNotices.map((notice) => ({
          ...notice,
          icon: notice.type === "중요" ? <Bell className="h-4 w-4" /> : <Calendar className="h-4 w-4" />,
        })),
      )
      setNoticesVersion((prev) => prev + 1)

      setTimeout(() => {
        syncNotices()
      }, 100)

      window.dispatchEvent(
        new CustomEvent("noticesUpdated", {
          detail: { notices: noticesForStorage },
        }),
      )
      console.log("[v0] 공지사항 저장 및 즉시 업데이트 완료:", noticesForStorage.length, "개")
    }
  }

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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("[v0] 공지사항 폼 제출 시작:", formData)

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
      icon: formData.type === "중요" ? <Bell className="h-4 w-4" /> : <Calendar className="h-4 w-4" />,
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
      console.log("[v0] 공지사항 수정 모드:", editingNotice.id)
      updatedNotices = notices.map((notice) => (notice.id === editingNotice.id ? newNotice : notice))
    } else {
      console.log("[v0] 공지사항 추가 모드")
      updatedNotices = [newNotice, ...notices]
    }

    try {
      saveNotices(updatedNotices)
      setIsDialogOpen(false)

      const actionText = isEditing ? "수정" : "추가"
      const successMessage = `공지사항이 성공적으로 ${actionText}되었습니다!\n\n제목: ${formData.title}\n유형: ${formData.type}`

      alert(successMessage)
      console.log("[v0] 공지사항 저장 완료:", actionText, "- 제목:", formData.title)

      // Reset form data after successful submission
      setFormData({
        title: "",
        content: "",
        type: "일반",
        date: "",
        time: "",
        location: "",
      })
    } catch (error) {
      console.error("[v0] 공지사항 저장 오류:", error)
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  const importantNotices = notices.filter((notice) => notice.type === "중요")
  const regularNotices = notices.filter((notice) => notice.type !== "중요")

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">공지사항</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              경주중앙로타리클럽의 최신 소식과 공지사항을 확인하세요.
            </p>
            <div className="mt-8">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddNotice} className="bg-white text-primary hover:bg-gray-100">
                    <Plus className="h-4 w-4 mr-2" />
                    공지사항 추가
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
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
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{notice.details.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{notice.details.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{notice.details.location}</span>
                          </div>
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

      {/* All Notices */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {notices.map((notice) => (
              <Card
                key={`${notice.id}-${noticesVersion}`}
                className={notice.type === "중요" ? "border-amber-200 bg-amber-50" : ""}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {notice.icon}
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
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>
                            <strong>일시:</strong> {notice.details.date}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>
                            <strong>시간:</strong> {notice.details.time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>
                            <strong>장소:</strong> {notice.details.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
    </div>
  )
}
