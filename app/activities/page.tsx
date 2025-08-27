"use client"

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

const getDefaultActivitiesData = () => [
  {
    id: 1,
    title: "지역사회 기부금 전달",
    date: "2025년 7월 22일",
    location: "경주예술의전당",
    description: "경주 문화재 및 환경보호를 위한 기부금을 전달하였습니다.",
    amount: "200만원",
    participants: "12명",
    type: "기부활동",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    title: "경주 문화재 보존 활동",
    date: "2025년 6월 15일",
    location: "불국사 일원",
    description: "경주 지역 문화재 보존을 위한 봉사활동을 실시했습니다.",
    amount: "150만원",
    participants: "15명",
    type: "봉사활동",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    title: "청소년 장학금 지원",
    date: "2025년 5월 20일",
    location: "경주시청",
    description: "지역 청소년들의 교육을 위한 장학금을 지원했습니다.",
    amount: "500만원",
    participants: "20명",
    type: "장학사업",
    image: "/placeholder.svg?height=300&width=400",
  },
]

const getDefaultMemberNewsData = () => [
  {
    id: 1,
    title: "신입회원 환영식",
    date: "2025년 7월 15일",
    content: "새로운 회원들을 환영하는 식을 가졌습니다. 앞으로 함께 봉사활동에 참여해주세요.",
    type: "회원소식",
  },
  {
    id: 2,
    title: "정기 월례회 개최",
    date: "2025년 7월 10일",
    content: "7월 정기 월례회가 성공적으로 개최되었습니다. 다음 달 활동 계획을 논의했습니다.",
    type: "회원소식",
  },
  {
    id: 3,
    title: "봉사활동 참여 감사",
    date: "2025년 6월 30일",
    content: "지난 달 봉사활동에 참여해주신 모든 회원분들께 감사드립니다.",
    type: "회원소식",
  },
]

const loadActivitiesData = () => {
  try {
    const stored = localStorage.getItem("activities_data")
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log("[v0] Loading user activities data:", parsed.length)
        return parsed
      }
    }
    console.log("[v0] Using default activities data")
    const defaultData = getDefaultActivitiesData()
    // 기본 데이터를 localStorage에도 저장하여 일관성 유지
    localStorage.setItem("activities_data", JSON.stringify(defaultData))
    return defaultData
  } catch (error) {
    console.error("Error loading activities data:", error)
    const defaultData = getDefaultActivitiesData()
    localStorage.setItem("activities_data", JSON.stringify(defaultData))
    return defaultData
  }
}

const loadMemberNewsData = () => {
  try {
    const stored = localStorage.getItem("member_news_data")
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log("[v0] Loading user member news data:", parsed.length)
        return parsed
      }
    }
    console.log("[v0] Using default member news data")
    const defaultData = getDefaultMemberNewsData()
    // 기본 데이터를 localStorage에도 저장하여 일관성 유지
    localStorage.setItem("member_news_data", JSON.stringify(defaultData))
    return defaultData
  } catch (error) {
    console.error("Error loading member news data:", error)
    const defaultData = getDefaultMemberNewsData()
    localStorage.setItem("member_news_data", JSON.stringify(defaultData))
    return defaultData
  }
}

const saveActivitiesData = (data) => {
  try {
    console.log("[v0] Saving activities data:", data.length)
    localStorage.setItem("activities_data", JSON.stringify(data))
    console.log("[v0] Activities data saved successfully")
  } catch (error) {
    console.error("Error saving activities data:", error)
  }
}

const saveMemberNewsData = (data) => {
  try {
    console.log("[v0] Saving member news data:", data.length)
    localStorage.setItem("member_news_data", JSON.stringify(data))
    console.log("[v0] Member news data saved successfully")
  } catch (error) {
    console.error("Error saving member news data:", error)
  }
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([])
  const [memberNews, setMemberNews] = useState([])
  const [authDialog, setAuthDialog] = useState({ open: false, action: null, id: null })
  const [authPassword, setAuthPassword] = useState("")
  const [newActivity, setNewActivity] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    amount: "",
    participants: "",
    type: "봉사활동",
    image: "",
  })
  const [newMemberNews, setNewMemberNews] = useState({
    title: "",
    date: "",
    content: "",
    type: "회원소식",
  })
  const [editingActivity, setEditingActivity] = useState(null)
  const [editingMemberNews, setEditingMemberNews] = useState(null)
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [isAddingMemberNews, setIsAddingMemberNews] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    console.log("[v0] Loading activities page data")
    const activitiesData = loadActivitiesData()
    const memberNewsData = loadMemberNewsData()

    setActivities(activitiesData)
    setMemberNews(memberNewsData)

    console.log("[v0] Data loaded - Activities:", activitiesData.length, "News:", memberNewsData.length)
  }, [])

  const requireAuth = (action, id = null) => {
    return new Promise((resolve) => {
      setAuthDialog({
        open: true,
        action,
        id,
        resolve,
      })
    })
  }

  const handleAuthSubmit = () => {
    console.log("[v0] Auth attempt with password:", authPassword ? "***" : "empty")

    const validPasswords = ["rotary", "1234", "rotary2025"]
    if (validPasswords.includes(authPassword)) {
      console.log("[v0] Auth successful")
      setAuthDialog({ open: false, action: null, id: null })
      setAuthPassword("")

      // Execute the pending action
      if (authDialog.action === "deleteActivity") {
        executeDeleteActivity(authDialog.id)
      } else if (authDialog.action === "deleteMemberNews") {
        executeDeleteMemberNews(authDialog.id)
      } else if (authDialog.resolve) {
        authDialog.resolve(true)
      }
    } else {
      console.log("[v0] Auth failed")
      alert("비밀번호: rotary 또는 1234")
    }
  }

  const executeDeleteActivity = (id) => {
    console.log("[v0] Executing delete activity:", id)

    if (confirm("정말로 이 활동을 삭제하시겠습니까?")) {
      console.log("[v0] User confirmed deletion")
      const updatedActivities = activities.filter((activity) => activity.id !== id)
      console.log("[v0] Updated activities count:", updatedActivities.length)

      setActivities(updatedActivities)
      saveActivitiesData(updatedActivities)
      console.log("[v0] Activity deleted and saved successfully")
    } else {
      console.log("[v0] User cancelled deletion")
    }
  }

  const executeDeleteMemberNews = (id) => {
    console.log("[v0] Executing delete member news:", id)

    if (confirm("정말로 이 소식을 삭제하시겠습니까?")) {
      console.log("[v0] User confirmed deletion")
      const updatedNews = memberNews.filter((news) => news.id !== id)
      console.log("[v0] Updated news count:", updatedNews.length)

      setMemberNews(updatedNews)
      saveMemberNewsData(updatedNews)
      console.log("[v0] Member news deleted and saved successfully")
    } else {
      console.log("[v0] User cancelled deletion")
    }
  }

  const handlePhotoUpload = (event, isEditing = false) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("[v0] Photo upload started:", file.name, file.size)

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
          ctx.drawImage(img, 0, 0, width, height)

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8)
          console.log("[v0] Photo compressed successfully")

          setImagePreview(compressedDataUrl)
          if (isEditing && editingActivity) {
            setEditingActivity({ ...editingActivity, image: compressedDataUrl })
          } else {
            setNewActivity({ ...newActivity, image: compressedDataUrl })
          }
        }
        img.src = e.target.result
      } catch (error) {
        console.error("[v0] Photo processing error:", error)
        alert("사진 처리 중 오류가 발생했습니다.")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.date) {
      alert("제목과 날짜는 필수입니다.")
      return
    }

    const activity = {
      ...newActivity,
      id: Date.now(),
    }

    const updatedActivities = [...activities, activity]
    console.log("[v0] Adding new activity:", activity.title)

    setActivities(updatedActivities)
    saveActivitiesData(updatedActivities)

    setNewActivity({
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
    setIsAddingActivity(false)

    console.log("[v0] Activity added successfully")
  }

  const handleEditActivity = (activity) => {
    setEditingActivity(activity)
    setImagePreview(activity.image || "")
  }

  const handleUpdateActivity = () => {
    if (!editingActivity.title || !editingActivity.date) {
      alert("제목과 날짜는 필수입니다.")
      return
    }

    const updatedActivities = activities.map((activity) =>
      activity.id === editingActivity.id ? editingActivity : activity,
    )

    console.log("[v0] Updating activity:", editingActivity.title)
    setActivities(updatedActivities)
    saveActivitiesData(updatedActivities)
    setEditingActivity(null)
    setImagePreview("")

    setTimeout(() => {
      console.log("[v0] Activity update completed, current count:", updatedActivities.length)
    }, 100)
  }

  const handleDeleteActivity = (id) => {
    console.log("[v0] Delete activity requested:", id)
    requireAuth("deleteActivity", id)
  }

  const handleAddMemberNews = () => {
    if (!newMemberNews.title || !newMemberNews.date) {
      alert("제목과 날짜는 필수입니다.")
      return
    }

    const news = {
      ...newMemberNews,
      id: Date.now(),
    }

    const updatedNews = [...memberNews, news]
    setMemberNews(updatedNews)
    saveMemberNewsData(updatedNews)

    setNewMemberNews({
      title: "",
      date: "",
      content: "",
      type: "회원소식",
    })
    setIsAddingMemberNews(false)
  }

  const handleEditMemberNews = (news) => {
    setEditingMemberNews(news)
  }

  const handleUpdateMemberNews = () => {
    if (!editingMemberNews.title || !editingMemberNews.date) {
      alert("제목과 날짜는 필수입니다.")
      return
    }

    const updatedNews = memberNews.map((news) => (news.id === editingMemberNews.id ? editingMemberNews : news))
    setMemberNews(updatedNews)
    saveMemberNewsData(updatedNews)
    setEditingMemberNews(null)
  }

  const handleDeleteMemberNews = (id) => {
    console.log("[v0] Delete member news requested:", id)
    requireAuth("deleteMemberNews", id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">봉사활동</h1>
          <p className="text-lg text-gray-600">경주중앙로타리클럽의 봉사활동과 회원소식을 확인하세요.</p>
        </div>

        <Dialog
          open={authDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              setAuthDialog({ open: false, action: null, id: null })
              setAuthPassword("")
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>관리자 인증</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="auth-password" className="text-right">
                  비밀번호
                </Label>
                <Input
                  id="auth-password"
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="col-span-3"
                  onKeyPress={(e) => e.key === "Enter" && handleAuthSubmit()}
                  autoFocus
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setAuthDialog({ open: false, action: null, id: null })
                  setAuthPassword("")
                }}
              >
                취소
              </Button>
              <Button onClick={handleAuthSubmit}>확인</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="activities">봉사활동</TabsTrigger>
            <TabsTrigger value="member-news">회원소식</TabsTrigger>
          </TabsList>

          <TabsContent value="activities">
            <div className="flex justify-center mb-6">
              <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />새 봉사활동 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>새 봉사활동 추가</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-title" className="text-right">
                        제목
                      </Label>
                      <Input
                        id="new-title"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-date" className="text-right">
                        날짜
                      </Label>
                      <Input
                        id="new-date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                        className="col-span-3"
                        placeholder="2024.01.01"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-location" className="text-right">
                        장소
                      </Label>
                      <Input
                        id="new-location"
                        value={newActivity.location}
                        onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-description" className="text-right">
                        설명
                      </Label>
                      <Textarea
                        id="new-description"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-amount" className="text-right">
                        기부금액
                      </Label>
                      <Input
                        id="new-amount"
                        value={newActivity.amount}
                        onChange={(e) => setNewActivity({ ...newActivity, amount: e.target.value })}
                        className="col-span-3"
                        placeholder="100만원"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-participants" className="text-right">
                        참가자수
                      </Label>
                      <Input
                        id="new-participants"
                        value={newActivity.participants}
                        onChange={(e) => setNewActivity({ ...newActivity, participants: e.target.value })}
                        className="col-span-3"
                        placeholder="10명"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-type" className="text-right">
                        유형
                      </Label>
                      <Select
                        value={newActivity.type}
                        onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}
                      >
                        <SelectTrigger className="col-span-3">
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-image-url" className="text-right">
                        이미지 URL
                      </Label>
                      <Input
                        id="new-image-url"
                        value={newActivity.image}
                        onChange={(e) => setNewActivity({ ...newActivity, image: e.target.value })}
                        className="col-span-3"
                        placeholder="https://example.com/image.jpg (선택)"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-image-file" className="text-right">
                        또는 파일 업로드
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="new-image-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e)}
                        />
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
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingActivity(false)}>
                      취소
                    </Button>
                    <Button onClick={handleAddActivity}>추가</Button>
                  </div>
                </DialogContent>
              </Dialog>
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

            {/* Edit Activity Dialog */}
            <Dialog open={!!editingActivity} onOpenChange={() => setEditingActivity(null)}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>봉사활동 수정</DialogTitle>
                </DialogHeader>
                {editingActivity && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-title" className="text-right">
                        제목
                      </Label>
                      <Input
                        id="edit-title"
                        value={editingActivity.title}
                        onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-date" className="text-right">
                        날짜
                      </Label>
                      <Input
                        id="edit-date"
                        value={editingActivity.date}
                        onChange={(e) => setEditingActivity({ ...editingActivity, date: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-location" className="text-right">
                        장소
                      </Label>
                      <Input
                        id="edit-location"
                        value={editingActivity.location}
                        onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-description" className="text-right">
                        설명
                      </Label>
                      <Textarea
                        id="edit-description"
                        value={editingActivity.description}
                        onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-amount" className="text-right">
                        기부금액
                      </Label>
                      <Input
                        id="edit-amount"
                        value={editingActivity.amount}
                        onChange={(e) => setEditingActivity({ ...editingActivity, amount: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-participants" className="text-right">
                        참가자수
                      </Label>
                      <Input
                        id="edit-participants"
                        value={editingActivity.participants}
                        onChange={(e) => setEditingActivity({ ...editingActivity, participants: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-type" className="text-right">
                        유형
                      </Label>
                      <Select
                        value={editingActivity.type}
                        onValueChange={(value) => setEditingActivity({ ...editingActivity, type: value })}
                      >
                        <SelectTrigger className="col-span-3">
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-image-url" className="text-right">
                        이미지 URL
                      </Label>
                      <Input
                        id="edit-image-url"
                        value={editingActivity.image}
                        onChange={(e) => setEditingActivity({ ...editingActivity, image: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-image-file" className="text-right">
                        또는 파일 업로드
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="edit-image-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, true)}
                        />
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
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingActivity(null)}>
                    취소
                  </Button>
                  <Button onClick={handleUpdateActivity}>수정</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="member-news">
            <div className="flex justify-center mb-6">
              <Dialog open={isAddingMemberNews} onOpenChange={setIsAddingMemberNews}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />새 회원소식 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>새 회원소식 추가</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-news-title" className="text-right">
                        제목
                      </Label>
                      <Input
                        id="new-news-title"
                        value={newMemberNews.title}
                        onChange={(e) => setNewMemberNews({ ...newMemberNews, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-news-date" className="text-right">
                        날짜
                      </Label>
                      <Input
                        id="new-news-date"
                        value={newMemberNews.date}
                        onChange={(e) => setNewMemberNews({ ...newMemberNews, date: e.target.value })}
                        className="col-span-3"
                        placeholder="2024년 1월 1일"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-news-content" className="text-right">
                        내용
                      </Label>
                      <Textarea
                        id="new-news-content"
                        value={newMemberNews.content}
                        onChange={(e) => setNewMemberNews({ ...newMemberNews, content: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingMemberNews(false)}>
                      취소
                    </Button>
                    <Button onClick={handleAddMemberNews}>추가</Button>
                  </div>
                </DialogContent>
              </Dialog>
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

            {/* Edit Member News Dialog */}
            <Dialog open={!!editingMemberNews} onOpenChange={() => setEditingMemberNews(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>회원소식 수정</DialogTitle>
                </DialogHeader>
                {editingMemberNews && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-news-title" className="text-right">
                        제목
                      </Label>
                      <Input
                        id="edit-news-title"
                        value={editingMemberNews.title}
                        onChange={(e) => setEditingMemberNews({ ...editingMemberNews, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-news-date" className="text-right">
                        날짜
                      </Label>
                      <Input
                        id="edit-news-date"
                        value={editingMemberNews.date}
                        onChange={(e) => setEditingMemberNews({ ...editingMemberNews, date: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-news-content" className="text-right">
                        내용
                      </Label>
                      <Textarea
                        id="edit-news-content"
                        value={editingMemberNews.content}
                        onChange={(e) => setEditingMemberNews({ ...editingMemberNews, content: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingMemberNews(null)}>
                    취소
                  </Button>
                  <Button onClick={handleUpdateMemberNews}>수정</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
