"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Banknote } from "lucide-react"
import {
  syncActivitiesData,
  syncMemberNewsData,
  saveActivitiesData,
  saveMemberNewsData,
  type Activity,
  type MemberNews,
} from "@/lib/activities-data"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [memberNews, setMemberNews] = useState<MemberNews[]>([])
  const [activitiesVersion, setActivitiesVersion] = useState(0)
  const [memberNewsVersion, setMemberNewsVersion] = useState(0)
  const { requireAuth, showLogin, setShowLogin, handleLoginSuccess } = useAdminAuth()

  const syncActivities = () => {
    const allActivities = syncActivitiesData()
    setActivities(allActivities)
    setActivitiesVersion((prev) => prev + 1)
    console.log("[v0] 봉사활동 페이지 동기화 완료:", allActivities.length, "개")
    console.log("[v0] 봉사활동 페이지 데이터:", allActivities)
  }

  const syncMemberNewsFunc = () => {
    const allMemberNews = syncMemberNewsData()
    setMemberNews(allMemberNews)
    setMemberNewsVersion((prev) => prev + 1)
    console.log("[v0] 회원소식 페이지 동기화 완료:", allMemberNews.length, "개")
    console.log("[v0] 회원소식 페이지 데이터:", allMemberNews)
  }

  useEffect(() => {
    syncActivities()
    syncMemberNewsFunc()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "rotary-activities") {
        console.log("[v0] 봉사활동 페이지 Storage 변경 감지, 재동기화")
        syncActivities()
      }
      if (e.key === "rotary-member-news") {
        console.log("[v0] 회원소식 페이지 Storage 변경 감지, 재동기화")
        syncMemberNewsFunc()
      }
    }

    const handleActivitiesUpdate = () => {
      console.log("[v0] 봉사활동 페이지 업데이트 이벤트 감지, 즉시 동기화")
      syncActivities()
    }

    const handleMemberNewsUpdate = () => {
      console.log("[v0] 회원소식 페이지 업데이트 이벤트 감지, 즉시 동기화")
      syncMemberNewsFunc()
    }

    const handleFocus = () => {
      console.log("[v0] 봉사활동 페이지 포커스, 재동기화")
      syncActivities()
      syncMemberNewsFunc()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("activitiesUpdated", handleActivitiesUpdate)
    window.addEventListener("memberNewsUpdated", handleMemberNewsUpdate)
    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("activitiesUpdated", handleActivitiesUpdate)
      window.removeEventListener("memberNewsUpdated", handleMemberNewsUpdate)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  const saveActivities = (newActivities: Activity[]) => {
    if (saveActivitiesData(newActivities)) {
      setActivities(newActivities)
      setActivitiesVersion((prev) => prev + 1)
      window.dispatchEvent(
        new CustomEvent("activitiesUpdated", {
          detail: { activities: newActivities },
        }),
      )
      console.log("[v0] 봉사활동 저장 완료:", newActivities.length, "개")
    }
  }

  const saveMemberNewsFunc = (newMemberNews: MemberNews[]) => {
    if (saveMemberNewsData(newMemberNews)) {
      setMemberNews(newMemberNews)
      setMemberNewsVersion((prev) => prev + 1)
      window.dispatchEvent(
        new CustomEvent("memberNewsUpdated", {
          detail: { memberNews: newMemberNews },
        }),
      )
      console.log("[v0] 회원소식 저장 완료:", newMemberNews.length, "개")
    }
  }

  const [isEditing, setIsEditing] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [editingMemberNews, setEditingMemberNews] = useState<MemberNews | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMemberNewsDialogOpen, setIsMemberNewsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    amount: "",
    participants: "",
    type: "봉사활동",
    image: "",
  })
  const [memberNewsFormData, setMemberNewsFormData] = useState({
    title: "",
    date: "",
    content: "",
    type: "회원소식",
  })
  const [imagePreview, setImagePreview] = useState("")

  const handleAddActivity = () => {
    requireAuth(() => {
      setIsEditing(false)
      setEditingActivity(null)
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        amount: "",
        participants: "",
        type: "봉사활동",
        image: "",
      })
      setImagePreview("")
      setIsDialogOpen(true)
    })
  }

  const handleEditActivity = (activity: Activity) => {
    requireAuth(() => {
      setIsEditing(true)
      setEditingActivity(activity)
      setFormData({
        title: activity.title,
        date: activity.date,
        location: activity.location || "",
        description: activity.description || "",
        amount: activity.amount || "",
        participants: activity.participants || "",
        type: activity.type,
        image: activity.image || "",
      })
      setImagePreview(activity.image || "")
      setIsDialogOpen(true)
    })
  }

  const handleDeleteActivity = (id: number) => {
    requireAuth(() => {
      if (confirm("이 봉사활동을 삭제하시겠습니까?")) {
        const updatedActivities = activities.filter((activity) => activity.id !== id)
        saveActivities(updatedActivities)
      }
    })
  }

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault()
    const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, ".")

    const newActivity: Activity = {
      id: isEditing ? editingActivity!.id : Date.now(),
      title: formData.title,
      date: formData.date,
      location: formData.location,
      description: formData.description,
      amount: formData.amount,
      participants: formData.participants,
      type: formData.type,
      image: formData.image,
    }

    let updatedActivities
    if (isEditing) {
      updatedActivities = activities.map((activity) => (activity.id === editingActivity!.id ? newActivity : activity))
    } else {
      updatedActivities = [newActivity, ...activities]
    }

    saveActivities(updatedActivities)
    setIsDialogOpen(false)
  }

  const handleAddMemberNews = () => {
    requireAuth(() => {
      setIsEditing(false)
      setEditingMemberNews(null)
      setMemberNewsFormData({
        title: "",
        date: "",
        content: "",
        type: "회원소식",
      })
      setIsMemberNewsDialogOpen(true)
    })
  }

  const handleEditMemberNews = (news: MemberNews) => {
    requireAuth(() => {
      setIsEditing(true)
      setEditingMemberNews(news)
      setMemberNewsFormData({
        title: news.title,
        date: news.date,
        content: news.content,
        type: news.type,
      })
      setIsMemberNewsDialogOpen(true)
    })
  }

  const handleDeleteMemberNews = (id: number) => {
    requireAuth(() => {
      if (confirm("이 회원소식을 삭제하시겠습니까?")) {
        const updatedMemberNews = memberNews.filter((news) => news.id !== id)
        saveMemberNewsFunc(updatedMemberNews)
      }
    })
  }

  const handleSubmitMemberNews = (e: React.FormEvent) => {
    e.preventDefault()

    const newMemberNews: MemberNews = {
      id: isEditing ? editingMemberNews!.id : Date.now(),
      title: memberNewsFormData.title,
      date: memberNewsFormData.date,
      content: memberNewsFormData.content,
      type: memberNewsFormData.type,
    }

    let updatedMemberNews
    if (isEditing) {
      updatedMemberNews = memberNews.map((news) => (news.id === editingMemberNews!.id ? newMemberNews : news))
    } else {
      updatedMemberNews = [newMemberNews, ...memberNews]
    }

    saveMemberNewsFunc(updatedMemberNews)
    setIsMemberNewsDialogOpen(false)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("[v0] 사진 업로드 시작:", file.name, file.size)

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          const maxWidth = 800
          const maxHeight = 600
          let { width, height } = img

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          ctx!.drawImage(img, 0, 0, width, height)

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8)
          console.log("[v0] 사진 압축 완료")

          setImagePreview(compressedDataUrl)
          setFormData({ ...formData, image: compressedDataUrl })
        }
        img.src = e.target!.result as string
      } catch (error) {
        console.error("[v0] 사진 처리 오류:", error)
        alert("사진 처리 중 오류가 발생했습니다.")
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">봉사활동</h1>
          <p className="text-lg text-gray-600">경주중앙로타리클럽의 봉사활동과 회원소식을 확인하세요.</p>
        </div>

        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="activities">봉사활동</TabsTrigger>
            <TabsTrigger value="member-news">회원소식</TabsTrigger>
          </TabsList>

          <TabsContent value="activities">
            <div className="flex justify-center mb-6">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddActivity} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />새 봉사활동 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{isEditing ? "봉사활동 수정" : "새 봉사활동 추가"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitActivity} className="space-y-4">
                    <div>
                      <Label>제목</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>날짜</Label>
                      <Input
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        placeholder="2024.01.01"
                      />
                    </div>
                    <div>
                      <Label>장소</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>설명</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>기부금액</Label>
                      <Input
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="100만원"
                      />
                    </div>
                    <div>
                      <Label>참가자수</Label>
                      <Input
                        value={formData.participants}
                        onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                        placeholder="10명"
                      />
                    </div>
                    <div>
                      <Label>유형</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="봉사활동">봉사활동</SelectItem>
                          <SelectItem value="기부활동">기부활동</SelectItem>
                          <SelectItem value="장학사업">장학사업</SelectItem>
                          <SelectItem value="환경보호">환경보호</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>이미지 URL</Label>
                      <Input
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://example.com/image.jpg (선택)"
                      />
                    </div>
                    <div>
                      <Label>또는 파일 업로드</Label>
                      <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="미리보기"
                            className="w-32 h-24 object-cover rounded"
                          />
                        </div>
                      )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <Card
                  key={`${activity.id}-${activitiesVersion}`}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {activity.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="mb-2">
                        {activity.type}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditActivity(activity)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteActivity(activity.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {activity.date}
                      </div>
                      {activity.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {activity.location}
                        </div>
                      )}
                      {activity.amount && (
                        <div className="flex items-center">
                          <Banknote className="w-4 h-4 mr-2" />
                          {activity.amount}
                        </div>
                      )}
                      {activity.participants && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {activity.participants}
                        </div>
                      )}
                    </div>
                    {activity.description && <p className="text-sm text-gray-700 mt-3">{activity.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="member-news">
            <div className="flex justify-center mb-6">
              <Dialog open={isMemberNewsDialogOpen} onOpenChange={setIsMemberNewsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddMemberNews} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />새 회원소식 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{isEditing ? "회원소식 수정" : "새 회원소식 추가"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitMemberNews} className="space-y-4">
                    <div>
                      <Label>제목</Label>
                      <Input
                        value={memberNewsFormData.title}
                        onChange={(e) => setMemberNewsFormData({ ...memberNewsFormData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>날짜</Label>
                      <Input
                        value={memberNewsFormData.date}
                        onChange={(e) => setMemberNewsFormData({ ...memberNewsFormData, date: e.target.value })}
                        required
                        placeholder="2024년 1월 1일"
                      />
                    </div>
                    <div>
                      <Label>내용</Label>
                      <Textarea
                        value={memberNewsFormData.content}
                        onChange={(e) => setMemberNewsFormData({ ...memberNewsFormData, content: e.target.value })}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsMemberNewsDialogOpen(false)}>
                        취소
                      </Button>
                      <Button type="submit">{isEditing ? "수정" : "추가"}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberNews.map((news) => (
                <Card key={`${news.id}-${memberNewsVersion}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2">
                        {news.type}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditMemberNews(news)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMemberNews(news.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{news.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {news.date}
                    </div>
                    <p className="text-sm text-gray-700">{news.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
    </div>
  )
}
