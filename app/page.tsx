"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import Image from "next/image"
import { CacheBuster } from "@/components/cache-buster"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AdminPanel } from "@/components/admin-panel"
import PWAInstall from "@/components/pwa-install"

interface Notice {
  id: string
  title: string
  content: string
  date: string
  type: string
  details?: {
    date?: string
    time?: string
    location?: string
  }
}

interface MemberNews {
  id: string
  title: string
  date: string
  content: string
  category: string
}

export default function HomePage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [memberNews, setMemberNews] = useState<MemberNews[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false)
  const [isEditNoticeOpen, setIsEditNoticeOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
    date: "",
    time: "",
    location: "",
    type: "일반",
  })
  const { requireAuth, showLogin, setShowLogin, handleLoginSuccess } = useAdminAuth()

  const defaultNotices: Notice[] = []

  const defaultMemberNews: MemberNews[] = []

  useEffect(() => {
    loadNotices()
    loadMemberNews()
  }, [])

  const loadNotices = () => {
    try {
      const savedNotices = localStorage.getItem("homepage-notices")
      const userNotices = savedNotices ? JSON.parse(savedNotices) : []

      const allNotices = [...userNotices]

      const sortedNotices = allNotices
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)

      setNotices(sortedNotices)
      console.log("[v0] 공지사항 로드 완료:", sortedNotices.length, "개")
    } catch (error) {
      console.error("[v0] 공지사항 로드 오류:", error)
      setNotices([])
    }
  }

  const loadMemberNews = () => {
    try {
      const savedNews = localStorage.getItem("homepage-news")
      const userNews = savedNews ? JSON.parse(savedNews) : []

      const allNews = [...userNews]

      const sortedNews = allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)

      setMemberNews(sortedNews)
      console.log("[v0] 회원소식 로드 완료:", sortedNews.length, "개")
    } catch (error) {
      console.error("[v0] 회원소식 로드 오류:", error)
      setMemberNews([])
    }
  }

  const saveNotices = (userNotices: Notice[]) => {
    try {
      if (!Array.isArray(userNotices)) {
        console.error("[v0] 잘못된 공지사항 데이터 형식")
        return false
      }

      localStorage.setItem("homepage-notices", JSON.stringify(userNotices))
      console.log("[v0] 공지사항 저장 완료:", userNotices.length, "개")
      loadNotices()
      return true
    } catch (error) {
      console.error("[v0] 공지사항 저장 오류:", error)
      alert("공지사항 저장 중 오류가 발생했습니다.")
      return false
    }
  }

  const saveMemberNews = (data: MemberNews[]) => {
    try {
      if (!Array.isArray(data)) {
        console.error("[v0] 잘못된 회원소식 데이터 형식")
        return false
      }

      localStorage.setItem("homepage-news", JSON.stringify(data))
      console.log("[v0] 홈페이지 회원소식 저장:", data.length, "개")
      return true
    } catch (error) {
      console.error("[v0] 회원소식 저장 오류:", error)
      alert("회원소식 저장 중 오류가 발생했습니다.")
      return false
    }
  }

  const handleEditModeToggle = () => {
    if (isEditMode) {
      setIsEditMode(false)
    } else {
      requireAuth(() => {
        setIsEditMode(true)
        console.log("[v0] 공지사항 편집 모드 활성화")
      })
    }
  }

  const handleAddNotice = () => {
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    const newNotice: Notice = {
      id: `user-${Date.now()}`,
      title: noticeForm.title,
      content: noticeForm.content,
      date: noticeForm.date || new Date().toISOString().split("T")[0],
      type: noticeForm.type,
      details: {
        date: noticeForm.date,
        time: noticeForm.time,
        location: noticeForm.location,
      },
    }

    const currentUserNotices = notices.filter((notice) => notice.id.startsWith("user-"))
    const updatedUserNotices = [newNotice, ...currentUserNotices]

    if (saveNotices(updatedUserNotices)) {
      setNoticeForm({
        title: "",
        content: "",
        date: "",
        time: "",
        location: "",
        type: "일반",
      })
      setIsAddNoticeOpen(false)
      alert("공지사항이 성공적으로 추가되었습니다!")
    }
  }

  const handleEditNotice = () => {
    if (!editingNotice || !noticeForm.title.trim() || !noticeForm.content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    const updatedNotice: Notice = {
      ...editingNotice,
      title: noticeForm.title,
      content: noticeForm.content,
      date: noticeForm.date || editingNotice.date,
      type: noticeForm.type,
      details: {
        date: noticeForm.date,
        time: noticeForm.time,
        location: noticeForm.location,
      },
    }

    const currentUserNotices = notices.filter((notice) => notice.id.startsWith("user-"))
    const updatedUserNotices = currentUserNotices.map((notice) =>
      notice.id === editingNotice.id ? updatedNotice : notice,
    )

    if (saveNotices(updatedUserNotices)) {
      setNoticeForm({
        title: "",
        content: "",
        date: "",
        time: "",
        location: "",
        type: "일반",
      })
      setIsEditNoticeOpen(false)
      setEditingNotice(null)
      alert("공지사항이 성공적으로 수정되었습니다!")
    }
  }

  const handleDeleteNotice = (notice: Notice) => {
    requireAuth(() => {
      if (confirm(`"${notice.title}" 공지사항을 삭제하시겠습니까?`)) {
        const currentUserNotices = notices.filter((n) => n.id.startsWith("user-"))
        const updatedUserNotices = currentUserNotices.filter((n) => n.id !== notice.id)

        if (saveNotices(updatedUserNotices)) {
          console.log("[v0] 공지사항 삭제 완료:", notice.title)
          alert("공지사항이 삭제되었습니다.")
        }
      }
    })
  }

  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice)
    setNoticeForm({
      title: notice.title,
      content: notice.content,
      date: notice.details?.date || notice.date,
      time: notice.details?.time || "",
      location: notice.details?.location || "",
      type: notice.type,
    })
    setIsEditNoticeOpen(true)
  }

  const [backgroundImage, setBackgroundImage] = useState("/images/club-photo.png")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const [newsForm, setNewsForm] = useState({
    title: "",
    date: "",
    content: "",
    category: "일반소식",
  })

  const [editingNews, setEditingNews] = useState<MemberNews | null>(null)

  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false)

  const loadData = () => {
    try {
      const savedNews = localStorage.getItem("homepage-news")

      if (savedNews) {
        const parsed = JSON.parse(savedNews)
        setMemberNews(parsed)
        console.log("[v0] 홈페이지 회원소식 로드:", parsed.length, "개")
      } else {
        setMemberNews([])
        localStorage.setItem("homepage-news", JSON.stringify([]))
      }
    } catch (error) {
      console.error("[v0] 데이터 로드 오류:", error)
    }
  }

  const handleSaveNews = () => {
    if (!newsForm.title.trim() || !newsForm.date.trim()) {
      alert("제목과 날짜를 입력해주세요.")
      return
    }

    const newsData: MemberNews = {
      id: editingNews ? editingNews.id : `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...newsForm,
    }

    let updatedNews
    if (editingNews) {
      updatedNews = memberNews.map((news) => (news.id === editingNews.id ? newsData : news))
      alert("회원소식이 성공적으로 수정되었습니다!")
    } else {
      updatedNews = [...memberNews, newsData]
      alert("회원소식이 성공적으로 추가되었습니다!")
    }

    setMemberNews(updatedNews)
    if (saveMemberNews(updatedNews)) {
      setIsAddNewsOpen(false)
      setEditingNews(null)
      setNewsForm({
        title: "",
        date: "",
        content: "",
        category: "일반소식",
      })
    }
  }

  const handleEditNews = (news: MemberNews) => {
    if (!requireAuth()) return
    setEditingNews(news)
    setNewsForm(news)
    setIsAddNewsOpen(true)
  }

  const handleDeleteNews = (id: string | number) => {
    if (!requireAuth()) return
    if (confirm("이 회원소식을 삭제하시겠습니까?")) {
      const updatedNews = memberNews.filter((news) => news.id !== id)
      setMemberNews(updatedNews)
      saveMemberNews(updatedNews)
      alert("회원소식이 삭제되었습니다.")
    }
  }

  useEffect(() => {
    const forceRefresh = () => {
      loadData()
    }

    forceRefresh()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "homepage-activities" || e.key === "homepage-news") {
        loadData()
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        forceRefresh()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <CacheBuster />

      <Navigation />
      <PWAInstall />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/club-photo.png"
            alt="경주중앙로타리클럽 제21대 22대 회장단 이취임식 - 천상 天翔 최용환 회장"
            fill
            className="object-cover object-top"
            priority
            onError={() => setBackgroundImage("/placeholder.svg?height=400&width=600")}
          />
        </div>

        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto pt-32 pb-8">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-balance text-white"
            style={{
              color: "#ffffff",
              textShadow: "4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,1)",
            }}
          >
            경주중앙로타리클럽
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 leading-relaxed text-balance text-white"
            style={{
              color: "#ffffff",
              textShadow: "3px 3px 6px rgba(0,0,0,1), 1px 1px 2px rgba(0,0,0,1)",
            }}
          >
            천상 天翔 최용환 회장과 함께하는 봉사의 여정
          </p>
        </div>

        {/* 공지사항 섹션 */}
        <div className="absolute bottom-2 left-0 right-0 z-20 px-4 max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-1.5">
            {/* 편집 모드 컨트롤 */}
            <div className="text-center mb-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Button
                  onClick={handleEditModeToggle}
                  variant={isEditMode ? "destructive" : "default"}
                  className={`text-sm px-16 py-2 font-semibold rounded-lg transition-all duration-300 ${
                    !isEditMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-lg hover:shadow-xl"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {isEditMode ? "편집 모드 종료" : "공지사항"}
                </Button>
              </div>

              {isEditMode && (
                <div className="mb-1 p-1 bg-yellow-100 border border-yellow-400 rounded-lg max-w-md mx-auto">
                  <p className="text-yellow-800 font-medium text-xs">
                    📝 편집 모드 활성화됨 - 공지사항을 추가, 수정, 삭제할 수 있습니다
                  </p>
                </div>
              )}

              {isEditMode && (
                <Button onClick={() => setIsAddNoticeOpen(true)} className="gap-1 text-xs px-3 py-1">
                  <Icons.Plus className="h-3 w-3" />새 공지사항 추가
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {notices.length > 0 ? (
                notices.slice(0, 3).map((notice) => (
                  <Card
                    key={notice.id}
                    className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-r from-white to-gray-50"
                  >
                    <CardContent className="p-1">
                      <div className="flex flex-col h-full space-y-0.5">
                        {/* 제목 */}
                        <h3 className="text-xs font-bold text-blue-700 leading-tight line-clamp-1 text-center">
                          {notice.title}
                        </h3>

                        {/* 세부 정보를 가로로 배치 */}
                        <div className="space-y-0.5">
                          {notice.details?.date && (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="font-medium text-gray-600 min-w-[25px]">일시:</span>
                              <span className="text-blue-600 truncate">{notice.details.date}</span>
                            </div>
                          )}
                          {notice.details?.time && (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="font-medium text-gray-600 min-w-[25px]">시간:</span>
                              <span className="text-blue-600 truncate">{notice.details.time}</span>
                            </div>
                          )}
                          {notice.details?.location && (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="font-medium text-gray-600 min-w-[25px]">장소:</span>
                              <span className="text-blue-600 truncate">{notice.details.location}</span>
                            </div>
                          )}
                        </div>

                        {/* 내용 */}
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-1 flex-1">{notice.content}</p>

                        {/* 하단 정보 */}
                        <div className="flex justify-between items-end mt-0.5">
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal bg-gray-100 text-gray-500 border-0 px-1 py-0.5"
                          >
                            {new Date().toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </Badge>
                          {isEditMode && (
                            <div className="flex gap-0.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(notice)}
                                className="h-4 w-4 p-0"
                              >
                                <Icons.Edit className="h-2 w-2" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteNotice(notice)}
                                className="h-4 w-4 p-0"
                              >
                                <Icons.Trash2 className="h-2 w-2" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-sm bg-gradient-to-r from-white to-gray-50 col-span-3">
                  <CardContent className="p-1.5 text-center">
                    <p className="text-gray-500 text-xs">등록된 공지사항이 없습니다.</p>
                    {isEditMode && (
                      <Button onClick={() => setIsAddNoticeOpen(true)} className="gap-1 text-xs px-3 py-1 mt-1">
                        <Icons.Plus className="h-3 w-3" />첫 공지사항 추가
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* 공지사항 추가 다이얼로그 */}
        {isAddNoticeOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">새 공지사항 추가</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">제목</label>
                  <input
                    type="text"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="공지사항 제목을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">내용</label>
                  <textarea
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    className="w-full p-2 border rounded-lg h-24"
                    placeholder="공지사항 내용을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">일시</label>
                  <input
                    type="date"
                    value={noticeForm.date}
                    onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">시간</label>
                  <input
                    type="time"
                    value={noticeForm.time}
                    onChange={(e) => setNoticeForm({ ...noticeForm, time: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">장소</label>
                  <input
                    type="text"
                    value={noticeForm.location}
                    onChange={(e) => setNoticeForm({ ...noticeForm, location: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="장소를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">유형</label>
                  <select
                    value={noticeForm.type}
                    onChange={(e) => setNoticeForm({ ...noticeForm, type: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="일반">일반</option>
                    <option value="긴급">긴급</option>
                    <option value="모임">모임</option>
                    <option value="행사">행사</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleAddNotice} className="flex-1">
                  추가
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddNoticeOpen(false)
                    setNoticeForm({
                      title: "",
                      content: "",
                      date: "",
                      time: "",
                      location: "",
                      type: "일반",
                    })
                  }}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 공지사항 수정 다이얼로그 */}
        {isEditNoticeOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">공지사항 수정</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">제목</label>
                  <input
                    type="text"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="공지사항 제목을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">내용</label>
                  <textarea
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    className="w-full p-2 border rounded-lg h-24"
                    placeholder="공지사항 내용을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">일시</label>
                  <input
                    type="date"
                    value={noticeForm.date}
                    onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">시간</label>
                  <input
                    type="time"
                    value={noticeForm.time}
                    onChange={(e) => setNoticeForm({ ...noticeForm, time: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">장소</label>
                  <input
                    type="text"
                    value={noticeForm.location}
                    onChange={(e) => setNoticeForm({ ...noticeForm, location: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="장소를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">유형</label>
                  <select
                    value={noticeForm.type}
                    onChange={(e) => setNoticeForm({ ...noticeForm, type: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="일반">일반</option>
                    <option value="긴급">긴급</option>
                    <option value="모임">모임</option>
                    <option value="행사">행사</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleEditNotice} className="flex-1">
                  수정
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditNoticeOpen(false)
                    setEditingNotice(null)
                    setNoticeForm({
                      title: "",
                      content: "",
                      date: "",
                      time: "",
                      location: "",
                      type: "일반",
                    })
                  }}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 로타리클럽 소개 섹션 */}
      <section className="py-24 bg-white" aria-labelledby="about-rotary-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 id="about-rotary-heading" className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              경주중앙로타리클럽이란?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              로타리는 전 세계 200여 개국에서 120만 명 이상의 회원이 활동하는 국제적인 봉사단체입니다.
              경주중앙로타리클럽은 경주 지역사회 발전과 국제친선을 위해 다양한 봉사활동을 펼치고 있습니다.
            </p>
          </div>

          <div className="mb-16">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-amber-50">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Icons.MapPin className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">클럽현황</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <span className="font-semibold text-amber-600 min-w-[80px] text-lg">창립:</span>
                    <span className="text-gray-700 leading-relaxed text-lg">2005년 1월 20일</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="font-semibold text-amber-600 min-w-[80px] text-lg">회원:</span>
                    <span className="text-gray-700 leading-relaxed text-lg">68명</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="font-semibold text-amber-600 min-w-[80px] text-lg">지구:</span>
                    <span className="text-gray-700 leading-relaxed text-lg">국제로타리3630지구</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="font-semibold text-amber-600 min-w-[80px] text-lg">지역:</span>
                    <span className="text-gray-700 leading-relaxed text-lg">경주시</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="font-semibold text-amber-600 min-w-[80px] text-lg">정기모임:</span>
                    <span className="text-gray-700 leading-relaxed text-lg">매월 첫째, 셋째주 목요일 오후 7시</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="font-semibold text-amber-600 min-w-[80px] text-lg">장소:</span>
                    <span className="text-gray-700 leading-relaxed text-lg">본 클럽 회관</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="font-semibold text-amber-600 min-w-[80px] text-lg">이사회:</span>
                    <span className="text-gray-700 leading-relaxed text-lg">매월 넷째주 목요일</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <AdminPanel />
      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
    </div>
  )
}
