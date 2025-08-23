"use client"

import { useState } from "react"
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

const initialNotices = [
  {
    id: 1,
    title: "이사회 개최 안내",
    content: "2025년 8월 28일(목) 오후 7시에 이사회가 개최됩니다. 장소는 추후 공지예정입니다.",
    date: "2025.08.20",
    type: "중요",
    icon: <Bell className="h-4 w-4" />,
    details: {
      date: "2025년 8월 28일(목)",
      time: "오후 7시",
      location: "장소 미정",
    },
  },
  {
    id: 2,
    title: "정기모임 안내",
    content: "다음 정기모임이 2025년 9월 4일(목) 오후 7시에 진행됩니다.",
    date: "2025.08.20",
    type: "일반",
    icon: <Calendar className="h-4 w-4" />,
    details: {
      date: "2025년 9월 4일(목)",
      time: "오후 7시",
      location: "본 클럽회관",
    },
  },
  {
    id: 3,
    title: "4월 정기모임 안내",
    content: "4월 정기모임이 4월 15일(월) 오후 7시에 진행됩니다.",
    date: "2024.04.01",
    type: "일반",
    icon: <Calendar className="h-4 w-4" />,
    details: {
      date: "4월 15일(월)",
      time: "오후 7시",
      location: "본 클럽회관",
    },
  },
  {
    id: 4,
    title: "봄맞이 봉사활동 참가자 모집",
    content: "4월 20일 진행될 봄맞이 봉사활동 참가자를 모집합니다.",
    date: "2024.03.28",
    type: "봉사",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: 5,
    title: "신입회원 환영식",
    content: "새로 가입하신 회원님들을 위한 환영식을 개최합니다.",
    date: "2024.03.25",
    type: "행사",
    icon: <Bell className="h-4 w-4" />,
  },
]

export default function NoticesPage() {
  const [notices, setNotices] = useState(initialNotices)
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
  }

  const handleEditNotice = (notice) => {
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
  }

  const handleDeleteNotice = (id) => {
    if (confirm("이 공지사항을 삭제하시겠습니까?")) {
      setNotices(notices.filter((notice) => notice.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
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

    if (isEditing) {
      setNotices(notices.map((notice) => (notice.id === editingNotice.id ? newNotice : notice)))
    } else {
      setNotices([newNotice, ...notices])
    }

    setIsDialogOpen(false)
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
              <Card key={notice.id} className={notice.type === "중요" ? "border-amber-200 bg-amber-50" : ""}>
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
    </div>
  )
}
