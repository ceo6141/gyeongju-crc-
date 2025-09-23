"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, EditIcon, SaveIcon, ImageIcon, TrashIcon } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { Navigation } from "@/components/navigation"
import { dataManager, type Notice } from "@/lib/simple-data-manager"
import { uploadFile, validateImageFile } from "@/lib/file-upload"

export default function NoticesClient() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    author: "관리자",
    image: "",
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isAuthenticated, showLogin, setShowLogin, requireAuth, handleLoginSuccess } = useAdminAuth()

  useEffect(() => {
    const loadNotices = () => {
      try {
        const loadedNotices = dataManager.getNotices()
        setNotices(loadedNotices)
        console.log("[v0] 공지사항 로드 완료:", loadedNotices.length, "개")
      } catch (error) {
        console.error("[v0] 공지사항 로드 실패:", error)
        setNotices([])
      }
    }

    loadNotices()

    // 스토리지 변경 감지
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "rotary-notices") {
        console.log("[v0] 스토리지 변경 감지 - 공지사항 새로고침")
        loadNotices()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      alert(validationError)
      return
    }

    setIsUploading(true)
    try {
      const imageData = await uploadFile(file)
      setNewNotice({ ...newNotice, image: imageData })
      console.log("[v0] 이미지 업로드 성공")
    } catch (error) {
      console.error("[v0] 이미지 업로드 실패:", error)
      alert("이미지 업로드에 실패했습니다: " + (error as Error).message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setNewNotice({ ...newNotice, image: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddClick = () => {
    requireAuth(() => setShowAddForm(!showAddForm))
  }

  const handleAddNotice = () => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    const success = dataManager.addNotice({
      title: newNotice.title,
      content: newNotice.content,
      date: new Date().toISOString().split("T")[0],
      author: newNotice.author,
      image: newNotice.image,
    })

    if (success) {
      const updatedNotices = dataManager.getNotices()
      setNotices(updatedNotices)
      setNewNotice({ title: "", content: "", author: "관리자", image: "" })
      setShowAddForm(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
      console.log("[v0] 새 공지사항 추가 성공")
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
        author: notice.author,
        image: notice.image || "",
      })
      setShowAddForm(true)
      console.log("[v0] 공지사항 편집 모드 활성화:", notice.title)
    })
  }

  const handleUpdateNotice = () => {
    if (!editingNotice || !newNotice.title.trim() || !newNotice.content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    const success = dataManager.updateNotice(editingNotice.id, {
      title: newNotice.title,
      content: newNotice.content,
      author: newNotice.author,
      image: newNotice.image,
    })

    if (success) {
      const updatedNotices = dataManager.getNotices()
      setNotices(updatedNotices)
      setEditingNotice(null)
      setNewNotice({ title: "", content: "", author: "관리자", image: "" })
      setShowAddForm(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
      console.log("[v0] 공지사항 수정 완료")
    } else {
      alert("공지사항 수정에 실패했습니다.")
    }
  }

  const handleCancelEdit = () => {
    setEditingNotice(null)
    setNewNotice({ title: "", content: "", author: "관리자", image: "" })
    setShowAddForm(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDeleteNotice = (id: string) => {
    requireAuth(() => {
      if (confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
        const success = dataManager.deleteNotice(id)
        if (success) {
          const updatedNotices = dataManager.getNotices()
          setNotices(updatedNotices)
          console.log("[v0] 공지사항 삭제 완료")
        } else {
          alert("공지사항 삭제에 실패했습니다.")
        }
      }
    })
  }

  const handleManualBackup = () => {
    requireAuth(() => {
      try {
        const allNotices = dataManager.getNotices()
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
        console.log("[v0] 백업 파일 다운로드 완료")
      } catch (error) {
        console.error("[v0] 백업 다운로드 실패:", error)
        alert("백업 다운로드에 실패했습니다.")
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
                    <Input
                      placeholder="작성자"
                      value={newNotice.author}
                      onChange={(e) => setNewNotice({ ...newNotice, author: e.target.value })}
                    />
                    <Textarea
                      placeholder="내용을 입력하세요"
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                      rows={4}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium">이미지 첨부</label>
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          {isUploading ? "업로드 중..." : "이미지 선택"}
                        </Button>
                        {newNotice.image && (
                          <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                            <TrashIcon className="w-4 h-4 mr-1" />
                            이미지 제거
                          </Button>
                        )}
                      </div>
                      {newNotice.image && (
                        <div className="mt-2">
                          <img
                            src={newNotice.image || "/placeholder.svg"}
                            alt="미리보기"
                            className="max-w-xs max-h-48 object-cover rounded border"
                          />
                        </div>
                      )}
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
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                            </div>

                            <div className="text-sm text-gray-700 mb-2">
                              <p>{notice.content}</p>
                            </div>

                            {notice.image && (
                              <div className="mb-2">
                                <img
                                  src={notice.image || "/placeholder.svg"}
                                  alt={notice.title}
                                  className="max-w-md max-h-64 object-cover rounded border"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span>작성자: {notice.author}</span>
                              <span>작성일: {new Date(notice.date).toLocaleDateString("ko-KR")}</span>
                            </div>
                          </div>

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
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="w-3 h-3 mr-1" />
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
