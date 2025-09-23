"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, CalendarIcon, MapPinIcon, EditIcon, SaveIcon, ImageIcon, TrashIcon, UsersIcon } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { dataManager, type Activity } from "@/lib/simple-data-manager"
import { uploadFile, validateImageFile } from "@/lib/file-upload"

export default function ActivitiesClient() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [newActivity, setNewActivity] = useState({
    title: "",
    content: "",
    date: "",
    location: "",
    participants: 0,
    image: "",
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isAuthenticated, showLogin, setShowLogin, requireAuth, handleLoginSuccess } = useAdminAuth()

  useEffect(() => {
    const loadActivities = () => {
      try {
        const loadedActivities = dataManager.getActivities()
        setActivities(loadedActivities)
        console.log("[v0] 봉사활동 로드 완료:", loadedActivities.length, "개")
      } catch (error) {
        console.error("[v0] 봉사활동 로드 실패:", error)
        setActivities([])
      }
    }

    loadActivities()

    // 스토리지 변경 감지
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "rotary-activities") {
        console.log("[v0] 스토리지 변경 감지 - 봉사활동 새로고침")
        loadActivities()
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
      setNewActivity({ ...newActivity, image: imageData })
      console.log("[v0] 이미지 업로드 성공")
    } catch (error) {
      console.error("[v0] 이미지 업로드 실패:", error)
      alert("이미지 업로드에 실패했습니다: " + (error as Error).message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setNewActivity({ ...newActivity, image: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddClick = () => {
    requireAuth(() => setShowAddForm(!showAddForm))
  }

  const handleAddActivity = () => {
    if (!newActivity.title.trim() || !newActivity.content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    const success = dataManager.addActivity({
      title: newActivity.title,
      content: newActivity.content,
      date: newActivity.date,
      location: newActivity.location,
      participants: newActivity.participants,
      image: newActivity.image,
    })

    if (success) {
      const updatedActivities = dataManager.getActivities()
      setActivities(updatedActivities)
      setNewActivity({ title: "", content: "", date: "", location: "", participants: 0, image: "" })
      setShowAddForm(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
      console.log("[v0] 새 봉사활동 추가 성공")
    } else {
      alert("봉사활동 추가에 실패했습니다.")
    }
  }

  const handleEditActivity = (activity: Activity) => {
    requireAuth(() => {
      setEditingActivity(activity)
      setNewActivity({
        title: activity.title,
        content: activity.content,
        date: activity.date,
        location: activity.location,
        participants: activity.participants,
        image: activity.image || "",
      })
      setShowAddForm(true)
      console.log("[v0] 봉사활동 편집 모드 활성화:", activity.title)
    })
  }

  const handleUpdateActivity = () => {
    if (!editingActivity || !newActivity.title.trim() || !newActivity.content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    const success = dataManager.updateActivity(editingActivity.id, {
      title: newActivity.title,
      content: newActivity.content,
      date: newActivity.date,
      location: newActivity.location,
      participants: newActivity.participants,
      image: newActivity.image,
    })

    if (success) {
      const updatedActivities = dataManager.getActivities()
      setActivities(updatedActivities)
      setEditingActivity(null)
      setNewActivity({ title: "", content: "", date: "", location: "", participants: 0, image: "" })
      setShowAddForm(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
      console.log("[v0] 봉사활동 수정 완료")
    } else {
      alert("봉사활동 수정에 실패했습니다.")
    }
  }

  const handleCancelEdit = () => {
    setEditingActivity(null)
    setNewActivity({ title: "", content: "", date: "", location: "", participants: 0, image: "" })
    setShowAddForm(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDeleteActivity = (id: string) => {
    requireAuth(() => {
      if (confirm("정말로 이 봉사활동을 삭제하시겠습니까?")) {
        const success = dataManager.deleteActivity(id)
        if (success) {
          const updatedActivities = dataManager.getActivities()
          setActivities(updatedActivities)
          console.log("[v0] 봉사활동 삭제 완료")
        } else {
          alert("봉사활동 삭제에 실패했습니다.")
        }
      }
    })
  }

  const handleManualBackup = () => {
    requireAuth(() => {
      try {
        const allActivities = dataManager.getActivities()
        const dataString = JSON.stringify(allActivities, null, 2)
        const blob = new Blob([dataString], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rotary-activities-backup-${new Date().toISOString().split("T")[0]}.json`
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
                <h1 className="text-xl font-bold text-gray-900 mb-0">봉사활동</h1>
                <p className="text-xs text-gray-700">지역사회를 위한 경주중앙로타리클럽의 봉사활동</p>
              </div>

              <div className="mb-1 flex gap-2">
                <Button onClick={handleAddClick} className="bg-orange-600 hover:bg-orange-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  봉사활동 추가
                </Button>
                <Button onClick={handleManualBackup} variant="outline" className="bg-green-50 hover:bg-green-100">
                  <SaveIcon className="w-4 h-4 mr-2" />
                  백업 다운로드
                </Button>
              </div>

              {showAddForm && isAuthenticated && (
                <Card className="mb-4 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>{editingActivity ? "봉사활동 수정" : "새 봉사활동 등록"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="활동명을 입력하세요"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="활동 내용을 입력하세요"
                      value={newActivity.content}
                      onChange={(e) => setNewActivity({ ...newActivity, content: e.target.value })}
                      rows={4}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        type="date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                      />
                      <Input
                        placeholder="활동 장소"
                        value={newActivity.location}
                        onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="참가 인원"
                        value={newActivity.participants}
                        onChange={(e) =>
                          setNewActivity({ ...newActivity, participants: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>

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
                        {newActivity.image && (
                          <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                            <TrashIcon className="w-4 h-4 mr-1" />
                            이미지 제거
                          </Button>
                        )}
                      </div>
                      {newActivity.image && (
                        <div className="mt-2">
                          <img
                            src={newActivity.image || "/placeholder.svg"}
                            alt="미리보기"
                            className="max-w-xs max-h-48 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={editingActivity ? handleUpdateActivity : handleAddActivity}>
                        {editingActivity ? "수정" : "등록"}
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        취소
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {activities.length === 0 ? (
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">등록된 봉사활동이 없습니다.</p>
                    </CardContent>
                  </Card>
                ) : (
                  activities.map((activity) => (
                    <Card
                      key={activity.id}
                      className="hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm border border-gray-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                봉사활동
                              </Badge>
                            </div>

                            <div className="text-sm text-gray-700 mb-3">
                              <p>{activity.content}</p>
                            </div>

                            {activity.image && (
                              <div className="mb-3">
                                <img
                                  src={activity.image || "/placeholder.svg"}
                                  alt={activity.title}
                                  className="max-w-md max-h-64 object-cover rounded border"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <div className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                {activity.date ? new Date(activity.date).toLocaleDateString("ko-KR") : "날짜 미정"}
                              </div>
                              {activity.location && (
                                <div className="flex items-center">
                                  <MapPinIcon className="w-4 h-4 mr-1" />
                                  {activity.location}
                                </div>
                              )}
                              {activity.participants > 0 && (
                                <div className="flex items-center">
                                  <UsersIcon className="w-4 h-4 mr-1" />
                                  {activity.participants}명 참가
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditActivity(activity)}
                              className="text-xs"
                            >
                              <EditIcon className="w-3 h-3 mr-1" />
                              수정
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteActivity(activity.id)}
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
