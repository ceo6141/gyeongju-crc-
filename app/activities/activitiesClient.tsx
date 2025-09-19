"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, CalendarIcon, MapPinIcon, EditIcon, SaveIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { unifiedActivitiesManager, type Activity, setupUnifiedDataSync } from "@/lib/unified-data-manager"

export default function ActivitiesClient() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    participants: "",
    status: "planned" as const,
    type: "봉사활동",
    amount: "",
    image: "",
  })

  const { isAuthenticated, showLogin, setShowLogin, requireAuth, handleLoginSuccess } = useAdminAuth()

  useEffect(() => {
    setupUnifiedDataSync()

    const loadData = () => {
      try {
        const loadedActivities = unifiedActivitiesManager.getAll()
        setActivities(loadedActivities)
        console.log("[v0] 통합 매니저로 봉사활동 로드 완료:", loadedActivities.length, "개")
      } catch (error) {
        console.error("[v0] 봉사활동 로드 오류:", error)
        // 오류 시 강제 복구 시도
        unifiedActivitiesManager.forceRecover()
        const recoveredActivities = unifiedActivitiesManager.getAll()
        setActivities(recoveredActivities)
        console.log("[v0] 봉사활동 강제 복구 완료:", recoveredActivities.length, "개")
      }
    }

    loadData()

    const handleActivitiesUpdate = (event: CustomEvent) => {
      console.log("[v0] 봉사활동 업데이트 이벤트 수신")
      setActivities(event.detail.data)
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "rotary-activities") {
        console.log("[v0] 스토리지 변경 감지 - 봉사활동 새로고침")
        loadData()
      }
    }

    const handleDataSync = (event: CustomEvent) => {
      if (event.detail.key === "rotary-activities") {
        console.log("[v0] 데이터 동기화 이벤트 수신")
        setActivities(event.detail.data)
      }
    }

    window.addEventListener("activitiesUpdated", handleActivitiesUpdate as EventListener)
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("rotaryDataSync", handleDataSync as EventListener)

    return () => {
      window.removeEventListener("activitiesUpdated", handleActivitiesUpdate as EventListener)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("rotaryDataSync", handleDataSync as EventListener)
    }
  }, [])

  const handleAddClick = () => {
    requireAuth(() => setShowAddForm(!showAddForm))
  }

  const handleAddActivity = () => {
    if (!newActivity.title.trim() || !newActivity.description.trim()) return

    const activity: Omit<Activity, "id"> = {
      title: newActivity.title,
      description: newActivity.description,
      date: newActivity.date,
      location: newActivity.location,
      participants: newActivity.participants,
      type: newActivity.type,
      amount: newActivity.amount,
      image: newActivity.image,
    }

    const success = unifiedActivitiesManager.add(activity)
    if (success) {
      const updatedActivities = unifiedActivitiesManager.getAll()
      setActivities(updatedActivities)
      setNewActivity({
        title: "",
        description: "",
        date: "",
        location: "",
        participants: "",
        status: "planned",
        type: "봉사활동",
        amount: "",
        image: "",
      })
      setShowAddForm(false)
      console.log("[v0] 통합 매니저로 새 봉사활동 추가:", activity.title)
    } else {
      alert("봉사활동 추가에 실패했습니다.")
    }
  }

  const handleEditActivity = (activity: Activity) => {
    requireAuth(() => {
      setEditingActivity(activity)
      setNewActivity({
        title: activity.title,
        description: activity.description || "",
        date: activity.date,
        location: activity.location || "",
        participants: activity.participants || "",
        status: "planned",
        type: activity.type,
        amount: activity.amount || "",
        image: activity.image || "",
      })
      setShowAddForm(true)
      console.log("[v0] 봉사활동 편집 모드 활성화:", activity.title)
    })
  }

  const handleUpdateActivity = () => {
    if (!editingActivity || !newActivity.title.trim() || !newActivity.description.trim()) return

    const updates: Partial<Activity> = {
      title: newActivity.title,
      description: newActivity.description,
      date: newActivity.date,
      location: newActivity.location,
      participants: newActivity.participants,
      type: newActivity.type,
      amount: newActivity.amount,
      image: newActivity.image,
    }

    const success = unifiedActivitiesManager.update(editingActivity.id, updates)
    if (success) {
      const updatedActivities = unifiedActivitiesManager.getAll()
      setActivities(updatedActivities)
      setNewActivity({
        title: "",
        description: "",
        date: "",
        location: "",
        participants: "",
        status: "planned",
        type: "봉사활동",
        amount: "",
        image: "",
      })
      setShowAddForm(false)
      setEditingActivity(null)
      console.log("[v0] 통합 매니저로 봉사활동 수정 완료:", newActivity.title)
    } else {
      alert("봉사활동 수정에 실패했습니다.")
    }
  }

  const handleDeleteActivity = (id: string) => {
    requireAuth(() => {
      const activityToDelete = activities.find((a) => a.id === id)
      const success = unifiedActivitiesManager.delete(id)
      if (success) {
        const updatedActivities = unifiedActivitiesManager.getAll()
        setActivities(updatedActivities)
        console.log("[v0] 통합 매니저로 봉사활동 삭제 완료:", activityToDelete?.title)
      } else {
        alert("봉사활동 삭제에 실패했습니다.")
      }
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
      participants: "",
      status: "planned",
      type: "봉사활동",
      amount: "",
      image: "",
    })
  }

  const getStatusBadge = (type: string) => {
    switch (type) {
      case "기부활동":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            기부활동
          </Badge>
        )
      case "봉사활동":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            봉사활동
          </Badge>
        )
      case "교육지원":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            교육지원
          </Badge>
        )
      case "의료봉사":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            의료봉사
          </Badge>
        )
      case "아동지원":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            아동지원
          </Badge>
        )
      default:
        return <Badge variant="secondary">봉사활동</Badge>
    }
  }

  const handleManualBackup = () => {
    requireAuth(() => {
      try {
        const allActivities = unifiedActivitiesManager.getAll()
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
        console.log("[v0] 통합 매니저 봉사활동 백업 파일 다운로드 완료")
      } catch (error) {
        console.error("[v0] 백업 다운로드 실패:", error)
        alert("백업 다운로드에 실패했습니다.")
      }
    })
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
              <Button onClick={handleManualBackup} variant="outline" className="ml-2 bg-green-50 hover:bg-green-100">
                <SaveIcon className="w-4 h-4 mr-2" />
                백업 다운로드
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
                    placeholder="참가 인원 (예: 15명)"
                    value={newActivity.participants}
                    onChange={(e) => setNewActivity({ ...newActivity, participants: e.target.value })}
                  />
                  <Input
                    placeholder="기부 금액 (선택사항, 예: 200만원)"
                    value={newActivity.amount}
                    onChange={(e) => setNewActivity({ ...newActivity, amount: e.target.value })}
                  />
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="봉사활동">봉사활동</option>
                    <option value="기부활동">기부활동</option>
                    <option value="교육지원">교육지원</option>
                    <option value="의료봉사">의료봉사</option>
                    <option value="아동지원">아동지원</option>
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
                            {getStatusBadge(activity.type)}
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
                      <div className="flex gap-4 text-sm text-gray-600">
                        {activity.participants && <span>참가 인원: {activity.participants}</span>}
                        {activity.amount && <span>기부 금액: {activity.amount}</span>}
                      </div>
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
