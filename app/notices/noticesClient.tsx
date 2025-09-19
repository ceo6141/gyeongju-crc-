"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, CalendarIcon, EditIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { Navigation } from "@/components/navigation"

interface Notice {
  id: string
  title: string
  content: string
  date: string
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
      date: new Date().toISOString().split("T")[0], // Use ISO date format for better sorting
      author: "관리자",
      important: newNotice.important,
    }

    const updatedNotices = [notice, ...notices]
    saveNotices(updatedNotices)

    setNewNotice({ title: "", content: "", important: false })
    setShowAddForm(false)
    console.log("[v0] 새 공지사항 추가:", notice.title)
  }

  const handleEditNotice = (notice: Notice) => {
    requireAuth(() => {
      setEditingNotice(notice)
      setNewNotice({
        title: notice.title,
        content: notice.content,
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
            important: newNotice.important,
          }
        : notice,
    )

    saveNotices(updatedNotices)
    setEditingNotice(null)
    setNewNotice({ title: "", content: "", important: false })
    setShowAddForm(false)
    console.log("[v0] 공지사항 수정 완료:", newNotice.title)
  }

  const handleCancelEdit = () => {
    setEditingNotice(null)
    setNewNotice({ title: "", content: "", important: false })
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">공지사항</h1>
              <p className="text-lg text-gray-600">경주중앙로타리클럽의 중요한 소식을 확인하세요</p>
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

            <div className="space-y-4">
              {notices.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                notices.map((notice) => (
                  <Card key={notice.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{notice.title}</CardTitle>
                            {notice.important && <Badge variant="destructive">중요</Badge>}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(notice.date).toLocaleDateString("ko-KR")} | {notice.author}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditNotice(notice)}>
                            <EditIcon className="w-4 h-4 mr-1" />
                            수정
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteNotice(notice.id)}>
                            삭제
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">{notice.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
    </div>
  )
}
