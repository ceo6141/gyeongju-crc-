"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Banknote } from "lucide-react"

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

  const getDefaultActivities = (): Activity[] => [
    {
      id: 1,
      title: "지역사회 기부금 전달",
      date: "2025.07.22",
      location: "경주시청",
      description: "경주 지역 소외계층을 위한 기부금을 전달했습니다.",
      amount: "200만원",
      participants: "12명",
      type: "기부활동",
      image: "/placeholder.svg?height=300&width=400&text=기부금전달",
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
      image: "/placeholder.svg?height=300&width=400&text=환경정화",
    },
  ]

  const getDefaultMemberNews = (): MemberNews[] => [
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

  const loadData = () => {
    console.log("[v0] 봉사활동 데이터 로딩 시작")
    try {
      const userModified = localStorage.getItem("gyeongju-rotary-user-modified") === "true"
      const savedActivities = localStorage.getItem("gyeongju-rotary-activities")
      const savedMemberNews = localStorage.getItem("gyeongju-rotary-member-news")

      if (userModified) {
        const activitiesData = savedActivities ? JSON.parse(savedActivities) : []
        const memberNewsData = savedMemberNews ? JSON.parse(savedMemberNews) : []

        setActivities(activitiesData)
        setMemberNews(memberNewsData)
        console.log(
          "[v0] 사용자 수정 데이터 로드 - 봉사활동:",
          activitiesData.length,
          "개, 회원소식:",
          memberNewsData.length,
          "개",
        )
      } else if (savedActivities || savedMemberNews) {
        const activitiesData = savedActivities ? JSON.parse(savedActivities) : []
        const memberNewsData = savedMemberNews ? JSON.parse(savedMemberNews) : []

        setActivities(activitiesData)
        setMemberNews(memberNewsData)
        console.log(
          "[v0] 저장된 데이터 로드 - 봉사활동:",
          activitiesData.length,
          "개, 회원소식:",
          memberNewsData.length,
          "개",
        )
      } else {
        const defaultActivities = getDefaultActivities()
        const defaultMemberNews = getDefaultMemberNews()

        setActivities(defaultActivities)
        setMemberNews(defaultMemberNews)

        console.log(
          "[v0] 기본 데이터 로드 (저장하지 않음) - 봉사활동:",
          defaultActivities.length,
          "개, 회원소식:",
          defaultMemberNews.length,
          "개",
        )
      }
    } catch (error) {
      console.error("[v0] 데이터 로딩 오류:", error)
      setActivities(getDefaultActivities())
      setMemberNews(getDefaultMemberNews())
    }
  }

  const saveActivities = (data: Activity[]) => {
    try {
      localStorage.setItem("gyeongju-rotary-activities", JSON.stringify(data))
      localStorage.setItem("gyeongju-rotary-user-modified", "true")
      setActivities(data)
      console.log("[v0] 봉사활동 저장 및 상태 업데이트 완료:", data.length, "개")
    } catch (error) {
      console.error("[v0] 봉사활동 저장 오류:", error)
      alert("저장 중 오류가 발생했습니다.")
    }
  }

  const saveMemberNews = (data: MemberNews[]) => {
    try {
      localStorage.setItem("gyeongju-rotary-member-news", JSON.stringify(data))
      localStorage.setItem("gyeongju-rotary-user-modified", "true")
      setMemberNews(data)
      console.log("[v0] 회원소식 저장 및 상태 업데이트 완료:", data.length, "개")
    } catch (error) {
      console.error("[v0] 회원소식 저장 오류:", error)
      alert("저장 중 오류가 발생했습니다.")
    }
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
      console.log("[v0] 관리자 인증 실패")
    }
  }

  useEffect(() => {
    loadData()
    console.log("[v0] 봉사활동 페이지 초기화 완료")

    const handleFocus = () => {
      console.log("[v0] 페이지 포커스 - 데이터 다시 로드하지 않음")
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
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
      console.log("[v0] 봉사활동 추가 다이얼로그 열기")
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
      console.log("[v0] 봉사활동 수정 다이얼로그 열기:", activity.title)
    })
  }

  const handleDeleteActivity = (id: number) => {
    requireAuth(() => {
      if (confirm("이 봉사활동을 삭제하시겠습니까?")) {
        console.log("[v0] 봉사활동 삭제 시작:", id)
        const updated = activities.filter((a) => a.id !== id)
        saveActivities(updated)
        console.log("[v0] 봉사활동 삭제 완료 - 남은 개수:", updated.length)
        alert("봉사활동이 삭제되었습니다.")
      }
    })
  }

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] 봉사활동 저장 시작")

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

    let updated: Activity[]
    if (isEditing) {
      updated = activities.map((a) => (a.id === editingId ? newActivity : a))
      console.log("[v0] 봉사활동 수정:", newActivity.title)
    } else {
      updated = [newActivity, ...activities]
      console.log("[v0] 봉사활동 추가:", newActivity.title)
    }

    saveActivities(updated)

    setTimeout(() => {
      setIsDialogOpen(false)
      alert(isEditing ? "봉사활동이 수정되었습니다." : "봉사활동이 추가되었습니다.")
      console.log("[v0] 봉사활동 저장 및 UI 업데이트 완료")
    }, 200)
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
      console.log("[v0] 회원소식 추가 다이얼로그 열기")
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
      console.log("[v0] 회원소식 수정 다이얼로그 열기:", news.title)
    })
  }

  const handleDeleteMemberNews = (id: number) => {
    requireAuth(() => {
      if (confirm("이 회원소식을 삭제하시겠습니까?")) {
        console.log("[v0] 회원소식 삭제 시작:", id)
        const updated = memberNews.filter((n) => n.id !== id)
        saveMemberNews(updated)
        console.log("[v0] 회원소식 삭제 완료 - 남은 개수:", updated.length)
        alert("회원소식이 삭제되었습니다.")
      }
    })
  }

  const handleSubmitMemberNews = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] 회원소식 저장 시작")

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

    let updated: MemberNews[]
    if (isEditing) {
      updated = memberNews.map((n) => (n.id === editingId ? newNews : n))
      console.log("[v0] 회원소식 수정:", newNews.title)
    } else {
      updated = [newNews, ...memberNews]
      console.log("[v0] 회원소식 추가:", newNews.title)
    }

    saveMemberNews(updated)
    setIsMemberNewsDialogOpen(false)

    alert(isEditing ? "회원소식이 수정되었습니다." : "회원소식이 추가되었습니다.")
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("[v0] 사진 업로드 시작:", file.name)

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setFormData({ ...formData, image: result })
      console.log("[v0] 사진 업로드 완료")
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
              <Button onClick={handleAddActivity} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />새 봉사활동 추가
              </Button>
            </div>

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
              <Button onClick={handleAddMemberNews} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />새 회원소식 추가
              </Button>
            </div>

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
                <Label>또는 파일 업로드</Label>
                <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image || "/placeholder.svg"}
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
