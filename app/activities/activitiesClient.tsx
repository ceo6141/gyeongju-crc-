"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, CalendarIcon, MapPinIcon, EditIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"

interface Activity {
  id: string
  title: string
  description: string
  date: string
  location: string
  participants: number
  status: "planned" | "ongoing" | "completed"
}

export default function ActivitiesClient() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    participants: 0,
    status: "planned" as const,
  })

  const { isAuthenticated, showLogin, setShowLogin, requireAuth, handleLoginSuccess } = useAdminAuth()

  useEffect(() => {
    // Load activities from localStorage safely
    if (typeof window !== "undefined") {
      const savedActivities = localStorage.getItem("rotary-activities")
      if (savedActivities) {
        const parsed = JSON.parse(savedActivities)
        const sortedActivities = parsed.sort((a: Activity, b: Activity) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        setActivities(sortedActivities)
        console.log("[v0] 봉사활동 로드 완료:", sortedActivities.length, "개")
      }
    }
  }, [])

  const saveActivities = (updatedActivities: Activity[]) => {
    if (typeof window !== "undefined") {
      const sortedActivities = updatedActivities.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      localStorage.setItem("rotary-activities", JSON.stringify(sortedActivities))
      setActivities(sortedActivities)
      console.log("[v0] 봉사활동 저장 완료:", sortedActivities.length, "개")
    }
  }

  const handleAddClick = () => {
    requireAuth(() => setShowAddForm(!showAddForm))
  }

  const handleAddActivity = () => {
    if (!newActivity.title.trim() || !newActivity.description.trim()) return

    const activity: Activity = {
      id: Date.now().toString(),
      title: newActivity.title,
      description: newActivity.description,
      date: newActivity.date,
      location: newActivity.location,
      participants: newActivity.participants,
      status: newActivity.status,
    }

    const updatedActivities = [activity, ...activities]
    saveActivities(updatedActivities)

    setNewActivity({
      title: "",
      description: "",
      date: "",
      location: "",
      participants: 0,
      status: "planned",
    })
    setShowAddForm(false)
    console.log("[v0] 새 봉사활동 추가:", activity.title)
  }

  const handleEditActivity = (activity: Activity) => {
    requireAuth(() => {
      setEditingActivity(activity)
      setNewActivity({
        title: activity.title,
        description: activity.description,
        date: activity.date,
        location: activity.location,
        participants: activity.participants,
        status: activity.status,
      })
      setShowAddForm(true)
      console.log("[v0] 봉사활동 편집 모드 활성화:", activity.title)
    })
  }

  const handleUpdateActivity = () => {
    if (!editingActivity || !newActivity.title.trim() || !newActivity.description.trim()) return

    const updatedActivity: Activity = {
      ...editingActivity,
      title: newActivity.title,
      description: newActivity.description,
      date: newActivity.date,
      location: newActivity.location,
      participants: newActivity.participants,
      status: newActivity.status,
    }

    const updatedActivities = activities.map((activity) =>
      activity.id === editingActivity.id ? updatedActivity : activity,
    )
    saveActivities(updatedActivities)

    setNewActivity({
      title: "",
      description: "",
      date: "",
      location: "",
      participants: 0,
      status: "planned",
    })
    setShowAddForm(false)
    setEditingActivity(null)
    console.log("[v0] 봉사활동 수정 완료:", updatedActivity.title)
  }

  const handleDeleteActivity = (id: string) => {
    requireAuth(() => {
      const activityToDelete = activities.find((a) => a.id === id)
      const updatedActivities = activities.filter((activity) => activity.id !== id)
      saveActivities(updatedActivities)
      console.log("[v0] 봉사활동 삭제:", activityToDelete?.title)
    })
  }

  const handleCancelEdit = () => {
    setEditingActivity(null)
    setShowAddForm(false)
    setNewActivity({
      title: "",
      description: "",
      date: "",
      location: "",
      participants: 0,
      status: "planned",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return <Badge variant="secondary">예정</Badge>
      case "ongoing":
        return <Badge variant="default">진행중</Badge>
      case "completed":
        return <Badge variant="outline">완료</Badge>
      default:
        return <Badge variant="secondary">예정</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <Navigation />

      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">봉사활동</h1>
              <p className="text-lg text-gray-600">지역사회를 위한 경주중앙로타리클럽의 봉사활동</p>
            </div>

            <div className="mb-6">
              <Button onClick={handleAddClick} className="bg-orange-600 hover:bg-orange-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                봉사활동 추가
              </Button>
            </div>

            {showAddForm && isAuthenticated && (
              <Card className="mb-6">
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
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    rows={3}
                  />
                  <Input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                  />
                  <Input
                    placeholder="활동 장소를 입력하세요"
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
                  <select
                    value={newActivity.status}
                    onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="planned">예정</option>
                    <option value="ongoing">진행중</option>
                    <option value="completed">완료</option>
                  </select>
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

            <div className="space-y-4">
              {activities.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500">등록된 봉사활동이 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                activities.map((activity) => (
                  <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{activity.title}</CardTitle>
                            {getStatusBadge(activity.status)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              {activity.date}
                            </div>
                            {activity.location && (
                              <div className="flex items-center">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {activity.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditActivity(activity)}>
                            <EditIcon className="w-4 h-4 mr-1" />
                            수정
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteActivity(activity.id)}>
                            삭제
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{activity.description}</p>
                      {activity.participants > 0 && (
                        <p className="text-sm text-gray-600">참가 인원: {activity.participants}명</p>
                      )}
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
