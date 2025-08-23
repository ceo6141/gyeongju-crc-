"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Plus, Trash2, User } from "lucide-react"
import { useState, useEffect } from "react"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: "지역사회 기부금 전달",
      date: "2025년 7월 22일",
      location: "경북장애인자립생활센터 (센터장 박귀룡)",
      description: "지역 취약계층 지원을 위한 기부금 전달 및 생필품 후원",
      amount: "200만원",
      participants: "6명",
      type: "기부활동",
      image: "/images/donation-activity.png",
    },
    {
      id: 2,
      title: "지역 어르신 돌봄 서비스",
      date: "2024년 3월 15일",
      location: "경주시 일원",
      description: "독거 어르신들을 위한 생필품 전달 및 안부 확인 봉사활동을 진행했습니다.",
      amount: "",
      participants: "12명",
      type: "봉사활동",
      image: "",
    },
    {
      id: 3,
      title: "장학금 전달식",
      date: "2024년 3월 10일",
      location: "경주시청",
      description: "지역 우수 학생들에게 장학금을 전달하여 교육 기회를 지원했습니다.",
      amount: "500만원",
      participants: "8명",
      type: "교육지원",
      image: "",
    },
  ])

  const [memberNews, setMemberNews] = useState([
    {
      id: 1,
      title: "천상 최용환 회장 취임",
      date: "2025-07-01",
      content: "제22대 회장으로 천상 최용환 회원이 취임했습니다.",
      category: "임원소식",
    },
    {
      id: 2,
      title: "신입회원 입회",
      date: "2025-06-15",
      content: "김원기, 공영건 회원이 새롭게 입회했습니다.",
      category: "입회소식",
    },
    {
      id: 3,
      title: "회원 사업장 개업",
      date: "2025-05-20",
      content: "권국창 회원의 새로운 사업장이 개업했습니다.",
      category: "개인소식",
    },
  ])

  useEffect(() => {
    const savedActivities = localStorage.getItem("activities")
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    }

    const savedMemberNews = localStorage.getItem("memberNews")
    if (savedMemberNews) {
      setMemberNews(JSON.parse(savedMemberNews))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    localStorage.setItem("memberNews", JSON.stringify(memberNews))
  }, [memberNews])

  const sortedMemberNews = [...memberNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const [editingActivity, setEditingActivity] = useState(null)
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [newActivity, setNewActivity] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    amount: "",
    participants: "",
    type: "",
    image: "",
  })

  const [editingMemberNews, setEditingMemberNews] = useState(null)
  const [isAddingMemberNews, setIsAddingMemberNews] = useState(false)
  const [newMemberNews, setNewMemberNews] = useState({
    title: "",
    date: "",
    content: "",
    category: "",
  })

  const handleEditActivity = (activity) => {
    setEditingActivity({ ...activity })
  }

  const handleSaveActivity = () => {
    if (editingActivity) {
      setActivities(activities.map((activity) => (activity.id === editingActivity.id ? editingActivity : activity)))
      setEditingActivity(null)
    }
  }

  const handleAddActivity = () => {
    const id = Math.max(...activities.map((a) => a.id)) + 1
    setActivities([...activities, { ...newActivity, id }])
    setNewActivity({
      title: "",
      date: "",
      location: "",
      description: "",
      amount: "",
      participants: "",
      type: "",
      image: "",
    })
    setIsAddingActivity(false)
  }

  const handleDeleteActivity = (id) => {
    if (confirm("이 활동을 삭제하시겠습니까?")) {
      setActivities(activities.filter((activity) => activity.id !== id))
    }
  }

  const handleEditMemberNews = (news) => {
    setEditingMemberNews({ ...news })
  }

  const handleSaveMemberNews = () => {
    if (editingMemberNews) {
      setMemberNews(memberNews.map((news) => (news.id === editingMemberNews.id ? editingMemberNews : news)))
      setEditingMemberNews(null)
    }
  }

  const handleAddMemberNews = () => {
    const id = Math.max(...memberNews.map((n) => n.id)) + 1
    setMemberNews([...memberNews, { ...newMemberNews, id }])
    setNewMemberNews({
      title: "",
      date: "",
      content: "",
      category: "",
    })
    setIsAddingMemberNews(false)
  }

  const handleDeleteMemberNews = (id) => {
    if (confirm("이 소식을 삭제하시겠습니까?")) {
      setMemberNews(memberNews.filter((news) => news.id !== id))
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Header */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">봉사활동</h1>
            <p className="text-lg text-muted-foreground">경주중앙로타리클럽의 봉사활동과 회원소식을 확인하세요.</p>
          </div>
        </div>
      </section>

      {/* Activities & Member News */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="activities">봉사활동</TabsTrigger>
              <TabsTrigger value="member-news">회원소식</TabsTrigger>
            </TabsList>

            <TabsContent value="activities">
              <div className="text-center mb-8">
                <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />새 봉사활동 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>새 봉사활동 추가</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="new-title">제목</Label>
                          <Input
                            id="new-title"
                            value={newActivity.title}
                            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-type">활동 유형</Label>
                          <Input
                            id="new-type"
                            value={newActivity.type}
                            onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                            placeholder="예: 기부활동, 봉사활동"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="new-date">일시</Label>
                          <Input
                            id="new-date"
                            value={newActivity.date}
                            onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-location">장소</Label>
                          <Input
                            id="new-location"
                            value={newActivity.location}
                            onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="new-amount">기부금액 (선택)</Label>
                          <Input
                            id="new-amount"
                            value={newActivity.amount}
                            onChange={(e) => setNewActivity({ ...newActivity, amount: e.target.value })}
                            placeholder="예: 200만원"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-participants">참가회원</Label>
                          <Input
                            id="new-participants"
                            value={newActivity.participants}
                            onChange={(e) => setNewActivity({ ...newActivity, participants: e.target.value })}
                            placeholder="예: 6명"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="new-description">활동내용</Label>
                        <Textarea
                          id="new-description"
                          value={newActivity.description}
                          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-image">이미지 URL (선택)</Label>
                        <Input
                          id="new-image"
                          value={newActivity.image}
                          onChange={(e) => setNewActivity({ ...newActivity, image: e.target.value })}
                          placeholder="/images/activity.png"
                        />
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <Card key={activity.id} className="relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleEditActivity(activity)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>봉사활동 수정</DialogTitle>
                            </DialogHeader>
                            {editingActivity && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-title">제목</Label>
                                    <Input
                                      id="edit-title"
                                      value={editingActivity.title}
                                      onChange={(e) =>
                                        setEditingActivity({ ...editingActivity, title: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-type">활동 유형</Label>
                                    <Input
                                      id="edit-type"
                                      value={editingActivity.type}
                                      onChange={(e) => setEditingActivity({ ...editingActivity, type: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-date">일시</Label>
                                    <Input
                                      id="edit-date"
                                      value={editingActivity.date}
                                      onChange={(e) => setEditingActivity({ ...editingActivity, date: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-location">장소</Label>
                                    <Input
                                      id="edit-location"
                                      value={editingActivity.location}
                                      onChange={(e) =>
                                        setEditingActivity({ ...editingActivity, location: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-amount">기부금액</Label>
                                    <Input
                                      id="edit-amount"
                                      value={editingActivity.amount}
                                      onChange={(e) =>
                                        setEditingActivity({ ...editingActivity, amount: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-participants">참가회원</Label>
                                    <Input
                                      id="edit-participants"
                                      value={editingActivity.participants}
                                      onChange={(e) =>
                                        setEditingActivity({ ...editingActivity, participants: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="edit-description">활동내용</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editingActivity.description}
                                    onChange={(e) =>
                                      setEditingActivity({ ...editingActivity, description: e.target.value })
                                    }
                                    rows={3}
                                  />
                                </div>
                              </div>
                            )}
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setEditingActivity(null)}>
                                취소
                              </Button>
                              <Button onClick={handleSaveActivity}>저장</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteActivity(activity.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {activity.image && (
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={activity.image || "/placeholder.svg"}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <Badge className="w-fit mb-2">{activity.type}</Badge>
                      <CardTitle>{activity.title}</CardTitle>
                      <CardDescription>{activity.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          <strong>장소:</strong> {activity.location}
                        </p>
                        {activity.amount && (
                          <p>
                            <strong>기부금액:</strong> {activity.amount}
                          </p>
                        )}
                        <p>
                          <strong>활동내용:</strong> {activity.description}
                        </p>
                        <p>
                          <strong>참가회원:</strong> {activity.participants}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="member-news">
              <div className="text-center mb-8">
                <Dialog open={isAddingMemberNews} onOpenChange={setIsAddingMemberNews}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />새 회원소식 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>새 회원소식 추가</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="new-news-title">제목</Label>
                          <Input
                            id="new-news-title"
                            value={newMemberNews.title}
                            onChange={(e) => setNewMemberNews({ ...newMemberNews, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-news-category">카테고리</Label>
                          <Input
                            id="new-news-category"
                            value={newMemberNews.category}
                            onChange={(e) => setNewMemberNews({ ...newMemberNews, category: e.target.value })}
                            placeholder="예: 임원소식, 입회소식, 개인소식"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="new-news-date">일시</Label>
                        <Input
                          id="new-news-date"
                          type="date"
                          value={newMemberNews.date}
                          onChange={(e) => setNewMemberNews({ ...newMemberNews, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-news-content">내용</Label>
                        <Textarea
                          id="new-news-content"
                          value={newMemberNews.content}
                          onChange={(e) => setNewMemberNews({ ...newMemberNews, content: e.target.value })}
                          rows={3}
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
                {sortedMemberNews.map((news) => (
                  <Card key={news.id} className="relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleEditMemberNews(news)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>회원소식 수정</DialogTitle>
                            </DialogHeader>
                            {editingMemberNews && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-news-title">제목</Label>
                                    <Input
                                      id="edit-news-title"
                                      value={editingMemberNews.title}
                                      onChange={(e) =>
                                        setEditingMemberNews({ ...editingMemberNews, title: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-news-category">카테고리</Label>
                                    <Input
                                      id="edit-news-category"
                                      value={editingMemberNews.category}
                                      onChange={(e) =>
                                        setEditingMemberNews({ ...editingMemberNews, category: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="edit-news-date">일시</Label>
                                  <Input
                                    id="edit-news-date"
                                    type="date"
                                    value={editingMemberNews.date}
                                    onChange={(e) =>
                                      setEditingMemberNews({ ...editingMemberNews, date: e.target.value })
                                    }
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-news-content">내용</Label>
                                  <Textarea
                                    id="edit-news-content"
                                    value={editingMemberNews.content}
                                    onChange={(e) =>
                                      setEditingMemberNews({ ...editingMemberNews, content: e.target.value })
                                    }
                                    rows={3}
                                  />
                                </div>
                              </div>
                            )}
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setEditingMemberNews(null)}>
                                취소
                              </Button>
                              <Button onClick={handleSaveMemberNews}>저장</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteMemberNews(news.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <CardHeader>
                      <Badge className="w-fit mb-2" variant="secondary">
                        {news.category}
                      </Badge>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {news.title}
                      </CardTitle>
                      <CardDescription>{formatDate(news.date)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{news.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
