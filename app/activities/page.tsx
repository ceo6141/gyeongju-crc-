"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Activity {
  id: number
  title: string
  date: string
  location?: string
  description?: string
  amount?: string
  participants?: string
  type: string
  image?: string
}

interface MemberNews {
  id: number
  title: string
  date: string
  content: string
  type: string
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [memberNews, setMemberNews] = useState<MemberNews[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  const saveData = (newActivities: Activity[], newMemberNews: MemberNews[]) => {
    console.log("[v0] 데이터 저장:", { activities: newActivities.length, news: newMemberNews.length })

    try {
      const activitiesData = JSON.stringify(newActivities)
      const newsData = JSON.stringify(newMemberNews)

      localStorage.setItem("rotary-activities", activitiesData)
      localStorage.setItem("rotary-member-news", newsData)
      localStorage.setItem("rotary-lastUpdated", Date.now().toString())

      setActivities([...newActivities])
      setMemberNews([...newMemberNews])

      console.log("[v0] localStorage 저장 성공:", {
        activitiesSize: `${(activitiesData.length / 1024).toFixed(2)}KB`,
        newsSize: `${(newsData.length / 1024).toFixed(2)}KB`,
      })

      console.log("[v0] 데이터 저장 완료")
      return true
    } catch (error) {
      console.error("[v0] localStorage 저장 실패:", error)
      setActivities([...newActivities])
      setMemberNews([...newMemberNews])
      console.log("[v0] 메모리 저장소로 폴백")
      return true
    }
  }

  const loadData = () => {
    console.log("[v0] 데이터 로딩 시작")

    if (activities.length > 0 || memberNews.length > 0) {
      console.log("[v0] 메모리에 기존 데이터 존재 - 로딩 건너뛰기:", {
        activities: activities.length,
        news: memberNews.length,
      })
      return
    }

    try {
      const savedActivities = localStorage.getItem("rotary-activities")
      const savedNews = localStorage.getItem("rotary-member-news")
      const lastUpdated = localStorage.getItem("rotary-lastUpdated")

      if (savedActivities && savedNews) {
        const activities = JSON.parse(savedActivities)
        const news = JSON.parse(savedNews)

        console.log("[v0] localStorage에서 데이터 복원:", {
          activities: activities.length,
          news: news.length,
          lastUpdated: lastUpdated ? new Date(Number.parseInt(lastUpdated)).toLocaleString() : "알 수 없음",
        })

        setActivities(activities)
        setMemberNews(news)
      } else {
        const defaultActivities = [
          {
            id: 1,
            title: "지역사회 기부금 전달",
            date: "2025.07.22",
            location: "경주시청",
            description: "경주 지역 소외계층을 위한 기부금을 전달했습니다.",
            amount: "200만원",
            participants: "12명",
            type: "기부활동",
            image: "/placeholder.svg?height=300&width=400",
          },
          {
            id: 2,
            title: "환경정화 봉사활동",
            date: "2025.06.15",
            location: "대릉원 일대",
            description: "경주 대릉원 주변 환경정화 활동을 실시했습니다.",
            amount: "",
            participants: "20명",
            type: "봉사활동",
            image: "/placeholder.svg?height=300&width=400",
          },
        ]

        const defaultNews = [
          {
            id: 1,
            title: "신입회원 환영식",
            date: "2025년 8월 10일",
            content: "새로운 회원들을 환영하는 시간을 가졌습니다.",
            type: "회원소식",
          },
          {
            id: 2,
            title: "정기총회 개최",
            date: "2025년 7월 25일",
            content: "2025-26년도 정기총회가 성공적으로 개최되었습니다.",
            type: "회원소식",
          },
        ]

        console.log("[v0] 기본 데이터로 초기화")
        setActivities(defaultActivities)
        setMemberNews(defaultNews)
        saveData(defaultActivities, defaultNews)
      }
    } catch (error) {
      console.error("[v0] localStorage 로딩 실패:", error)
      console.log("[v0] 빈 데이터로 초기화")
      setActivities([])
      setMemberNews([])
    }

    console.log("[v0] 데이터 로딩 완료")
  }

  useEffect(() => {
    loadData()

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("[v0] 페이지 포커스 복귀 - 메모리 데이터 유지")
        // loadData() 호출 제거 - 메모리 데이터를 보존
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleVisibilityChange)
    }
  }, [])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMemberNewsDialogOpen, setIsMemberNewsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
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

  const handleAddActivity = () => {
    requireAuth(() => {
      setIsEditing(false)
      setEditingId(null)
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
      setIsDialogOpen(true)
    })
  }

  const handleEditActivity = (activity: Activity) => {
    requireAuth(() => {
      setIsEditing(true)
      setEditingId(activity.id)
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
      setIsDialogOpen(true)
    })
  }

  const handleDeleteActivity = (id: number) => {
    requireAuth(() => {
      const activity = activities.find((a) => a.id === id)
      if (activity && confirm(`"${activity.title}" 봉사활동을 삭제하시겠습니까?`)) {
        const newActivities = activities.filter((a) => a.id !== id)
        if (saveData(newActivities, memberNews)) {
          alert("봉사활동이 삭제되었습니다.")
        }
      }
    })
  }

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.date) {
      alert("제목과 날짜는 필수입니다.")
      return
    }

    const newActivity: Activity = {
      id: isEditing ? editingId! : Date.now(),
      title: formData.title,
      date: formData.date,
      location: formData.location,
      description: formData.description,
      amount: formData.amount,
      participants: formData.participants,
      type: formData.type,
      image: formData.image,
    }

    let newActivities: Activity[]
    if (isEditing) {
      newActivities = activities.map((a) => (a.id === editingId ? newActivity : a))
    } else {
      newActivities = [newActivity, ...activities]
    }

    if (saveData(newActivities, memberNews)) {
      setIsDialogOpen(false)
      alert(isEditing ? "봉사활동이 수정되었습니다!" : "봉사활동이 추가되었습니다!")
    }
  }

  const handleAddMemberNews = () => {
    requireAuth(() => {
      setIsEditing(false)
      setEditingId(null)
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
      setEditingId(news.id)
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
      const news = memberNews.find((n) => n.id === id)
      if (news && confirm(`"${news.title}" 회원소식을 삭제하시겠습니까?`)) {
        const newMemberNews = memberNews.filter((n) => n.id !== id)
        if (saveData(activities, newMemberNews)) {
          alert("회원소식이 삭제되었습니다.")
        }
      }
    })
  }

  const handleSubmitMemberNews = (e: React.FormEvent) => {
    e.preventDefault()

    if (!memberNewsFormData.title || !memberNewsFormData.date || !memberNewsFormData.content) {
      alert("모든 필드를 입력해주세요.")
      return
    }

    const newNews: MemberNews = {
      id: isEditing ? editingId! : Date.now(),
      title: memberNewsFormData.title,
      date: memberNewsFormData.date,
      content: memberNewsFormData.content,
      type: memberNewsFormData.type,
    }

    let newMemberNews: MemberNews[]
    if (isEditing) {
      newMemberNews = memberNews.map((n) => (n.id === editingId ? newNews : n))
    } else {
      newMemberNews = [newNews, ...memberNews]
    }

    if (saveData(activities, newMemberNews)) {
      setIsMemberNewsDialogOpen(false)
      alert(isEditing ? "회원소식이 수정되었습니다!" : "회원소식이 추가되었습니다!")
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("[v0] 이미지 업로드 시작:", {
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: file.type,
    })

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      console.log("[v0] 파일 읽기 완료:", {
        dataSize: `${(result.length / 1024).toFixed(2)}KB`,
      })

      const img = new Image()
      img.onload = () => {
        console.log("[v0] 이미지 로드 완료:", {
          originalWidth: img.width,
          originalHeight: img.height,
        })

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
        ctx?.drawImage(img, 0, 0, width, height)

        const compressedImage = canvas.toDataURL("image/jpeg", 0.8)

        console.log("[v0] 이미지 압축 완료:", {
          finalWidth: width,
          finalHeight: height,
          compressedSize: `${(compressedImage.length / 1024).toFixed(2)}KB`,
        })

        try {
          const testData = { ...formData, image: compressedImage }
          const testJson = JSON.stringify(testData)

          if (testJson.length > 1024 * 1024) {
            alert("압축된 이미지가 너무 큽니다. 더 작은 이미지를 사용해주세요.")
            return
          }

          setFormData({ ...formData, image: compressedImage })
          console.log("[v0] 이미지 업로드 성공")
          alert("이미지가 성공적으로 업로드되었습니다!")
        } catch (error) {
          console.error("[v0] 이미지 처리 오류:", error)
          alert("이미지 처리 중 오류가 발생했습니다.")
        }
      }

      img.onerror = () => {
        console.error("[v0] 이미지 로드 실패")
        alert("이미지를 로드할 수 없습니다. 다른 이미지를 시도해주세요.")
      }

      img.src = result
    }

    reader.onerror = () => {
      console.error("[v0] 파일 읽기 실패")
      alert("파일을 읽을 수 없습니다.")
    }

    reader.readAsDataURL(file)
  }

  const requireAuth = (action: () => void) => {
    if (isAuthenticated) {
      action()
    } else {
      setPendingAction(() => action)
      setShowPasswordDialog(true)
    }
  }

  const handlePasswordSubmit = () => {
    if (password === "1234") {
      setIsAuthenticated(true)
      setShowPasswordDialog(false)
      setPassword("")
      if (pendingAction) {
        pendingAction()
        setPendingAction(null)
      }
      console.log("[v0] 관리자 인증 성공")
    } else {
      alert("비밀번호가 틀렸습니다.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
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
              <Button onClick={handleAddActivity} className="bg-blue-600 hover:bg-blue-700">
                ➕ 새 봉사활동 추가
              </Button>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">등록된 봉사활동이 없습니다.</p>
                <p className="text-gray-400">새 봉사활동을 추가해보세요.</p>
                <div className="mt-4 text-xs text-gray-400">
                  <p>현재 세션에서 {activities.length}개의 봉사활동이 등록되어 있습니다.</p>
                  <p className="text-green-600">✅ 메모리 저장소 사용 중 (페이지 새로고침 시까지 데이터 유지)</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                            ✏️
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteActivity(activity.id)}>
                            🗑️
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">📅 {activity.date}</div>
                        {activity.location && <div className="flex items-center">📍 {activity.location}</div>}
                        {activity.amount && <div className="flex items-center">💰 {activity.amount}</div>}
                        {activity.participants && <div className="flex items-center">👥 {activity.participants}</div>}
                      </div>
                      {activity.description && <p className="text-sm text-gray-700 mt-3">{activity.description}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="member-news">
            <div className="flex justify-center mb-6">
              <Button onClick={handleAddMemberNews} className="bg-blue-600 hover:bg-blue-700">
                ➕ 새 회원소식 추가
              </Button>
            </div>

            {memberNews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">등록된 회원소식이 없습니다.</p>
                <p className="text-gray-400">새 회원소식을 추가해보세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memberNews.map((news) => (
                  <Card key={news.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2">
                          {news.type}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditMemberNews(news)}>
                            ✏️
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteMemberNews(news.id)}>
                            🗑️
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{news.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-sm text-gray-600 mb-3">📅 {news.date}</div>
                      <p className="text-sm text-gray-700">{news.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>관리자 인증</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>비밀번호</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  placeholder="관리자 비밀번호를 입력하세요"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                  취소
                </Button>
                <Button onClick={handlePasswordSubmit}>확인</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "봉사활동 수정" : "새 봉사활동 추가"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitActivity} className="space-y-4">
              <div>
                <Label>제목 *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>날짜 *</Label>
                <Input
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  placeholder="2025.01.01"
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
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="봉사활동">봉사활동</SelectItem>
                    <SelectItem value="기부활동">기부활동</SelectItem>
                    <SelectItem value="장학사업">장학사업</SelectItem>
                    <SelectItem value="환경보호">환경보호</SelectItem>
                    <SelectItem value="국제교류">국제교류</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>이미지 URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label>또는 파일 업로드 (최대 5MB)</Label>
                <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="미리보기"
                      className="w-32 h-24 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                      onClick={() => {
                        setFormData({ ...formData, image: "" })
                        console.log("[v0] 이미지 제거됨")
                      }}
                    >
                      이미지 제거
                    </Button>
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

        <Dialog open={isMemberNewsDialogOpen} onOpenChange={setIsMemberNewsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? "회원소식 수정" : "새 회원소식 추가"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitMemberNews} className="space-y-4">
              <div>
                <Label>제목 *</Label>
                <Input
                  value={memberNewsFormData.title}
                  onChange={(e) => setMemberNewsFormData({ ...memberNewsFormData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>날짜 *</Label>
                <Input
                  value={memberNewsFormData.date}
                  onChange={(e) => setMemberNewsFormData({ ...memberNewsFormData, date: e.target.value })}
                  required
                  placeholder="2025년 1월 1일"
                />
              </div>
              <div>
                <Label>내용 *</Label>
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
    </div>
  )
}
