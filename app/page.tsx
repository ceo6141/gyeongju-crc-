"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Award, BookOpen, History, Calendar, Clock, MapPin, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { AdminPanel } from "@/components/admin-panel"
import PWAInstall from "@/components/pwa-install"
import { CacheBuster } from "@/components/cache-buster"
import { syncNoticesData, saveNoticesData } from "@/lib/notices-data"

export default function HomePage() {
  const [notices, setNotices] = useState([])
  const [noticesVersion, setNoticesVersion] = useState(0)
  const [isEditingNotices, setIsEditingNotices] = useState(false)
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [memberNews, setMemberNews] = useState([])
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [newsForm, setNewsForm] = useState({
    title: "",
    date: "",
    content: "",
    category: "일반소식",
  })

  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
    date: "",
    type: "일반",
    details: "",
  })

  const [backgroundImage, setBackgroundImage] = useState("/images/club-photo.png")

  const requireAuth = () => {
    if (isAuthenticated) return true
    const password = prompt("관리자 비밀번호를 입력하세요:")
    if (password === "1234") {
      setIsAuthenticated(true)
      return true
    }
    alert("비밀번호가 틀렸습니다.")
    return false
  }

  const syncNotices = () => {
    const allNotices = syncNoticesData()

    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0)

      // Handle Korean date format like "2025.09.04목" or "2025.08.28.목"
      const cleanDate = dateStr.replace(/[가-힣]/g, "").replace(/\.$/, "")
      const parts = cleanDate.split(".")

      if (parts.length >= 3) {
        const year = Number.parseInt(parts[0])
        const month = Number.parseInt(parts[1]) - 1
        const day = Number.parseInt(parts[2])
        return new Date(year, month, day)
      }

      return new Date(dateStr)
    }

    const sortedNotices = allNotices.sort((a, b) => {
      const dateA = parseDate(a.details?.date)
      const dateB = parseDate(b.details?.date)

      return dateB - dateA // Sort by latest date first
    })

    const latestThree = sortedNotices.slice(0, 3)

    setNotices((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(latestThree)) {
        console.log("[v0] 공지사항 데이터 업데이트:", latestThree.length, "개")
        return latestThree
      }
      return prev
    })
  }

  const handleEditNotice = (notice) => {
    if (!requireAuth()) return
    setEditingNotice(notice)
  }

  const handleDeleteNotice = (noticeId) => {
    if (!requireAuth()) return
    if (confirm("이 공지사항을 삭제하시겠습니까?")) {
      const allNotices = syncNoticesData()
      const updatedNotices = allNotices.filter((notice) => notice.id !== noticeId)
      saveNoticesData(updatedNotices)
      syncNotices()
      alert("공지사항이 삭제되었습니다.")
    }
  }

  const handleAddNotice = (noticeData) => {
    const allNotices = syncNoticesData()
    const newNotice = {
      id: Date.now().toString(),
      ...noticeData,
      date: new Date().toLocaleDateString("ko-KR"),
    }
    const updatedNotices = [newNotice, ...allNotices]
    saveNoticesData(updatedNotices)
    syncNotices()
    setIsAddNoticeOpen(false)
    alert("공지사항이 추가되었습니다.")
  }

  const handleUpdateNotice = (noticeData) => {
    const allNotices = syncNoticesData()
    const updatedNotices = allNotices.map((notice) =>
      notice.id === editingNotice.id ? { ...notice, ...noticeData } : notice,
    )
    saveNoticesData(updatedNotices)
    syncNotices()
    setEditingNotice(null)
    alert("공지사항이 수정되었습니다.")
  }

  const loadData = () => {
    try {
      const savedNews = localStorage.getItem("homepage-news")

      if (savedNews) {
        const parsed = JSON.parse(savedNews)
        setMemberNews(parsed)
        console.log("[v0] 홈페이지 회원소식 로드:", parsed.length, "개")
      } else {
        // 기본 데이터
        const defaultNews = [
          {
            id: 1,
            title: "천상 天翔 최용환 회장 취임",
            date: "2025-07-01",
            content: "제22대 회장으로 천상 天翔 최용환 회원이 취임했습니다.",
            category: "임원소식",
          },
        ]
        setMemberNews(defaultNews)
        localStorage.setItem("homepage-news", JSON.stringify(defaultNews))
      }
    } catch (error) {
      console.error("[v0] 데이터 로드 오류:", error)
    }
  }

  const saveMemberNews = (data) => {
    try {
      localStorage.setItem("homepage-news", JSON.stringify(data))
      console.log("[v0] 홈페이지 회원소식 저장:", data.length, "개")
    } catch (error) {
      console.error("[v0] 회원소식 저장 오류:", error)
    }
  }

  const handleSaveNews = () => {
    if (!newsForm.title.trim() || !newsForm.date.trim()) {
      alert("제목과 날짜를 입력해주세요.")
      return
    }

    const newsData = {
      id: editingNews ? editingNews.id : Date.now(),
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
    saveMemberNews(updatedNews)
    setIsAddNewsOpen(false)
    setEditingNews(null)
    setNewsForm({
      title: "",
      date: "",
      content: "",
      category: "일반소식",
    })
  }

  const handleEditNews = (news) => {
    if (!requireAuth()) return
    setEditingNews(news)
    setNewsForm(news)
    setIsAddNewsOpen(true)
  }

  const handleDeleteNews = (id) => {
    if (!requireAuth()) return
    if (confirm("이 회원소식을 삭제하시겠습니까?")) {
      const updatedNews = memberNews.filter((news) => news.id !== id)
      setMemberNews(updatedNews)
      saveMemberNews(updatedNews)
      alert("회원소식이 삭제되었습니다.")
    }
  }

  useEffect(() => {
    loadData()
    syncNotices()

    const handleStorageChange = (e) => {
      if (e.key === "rotary-notices") {
        syncNotices()
      } else if (e.key === "homepage-activities" || e.key === "homepage-news") {
        loadData()
      }
    }

    const handleNoticesUpdate = () => {
      syncNotices()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("noticesUpdated", handleNoticesUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("noticesUpdated", handleNoticesUpdate)
    }
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <CacheBuster />
      <Navigation />
      <PWAInstall />

      <div className="pt-16">
        <main>
          <section className="relative min-h-[60vh] flex items-center bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* 좌측: 로고와 텍스트 */}
                <div className="flex flex-col items-start space-y-6">
                  <Image
                    src="/rotary-logo-official.png"
                    alt="경주중앙로타리클럽 로고 - Gyeongju Central Rotary Club Logo"
                    width={160}
                    height={80}
                    className="object-contain"
                  />
                  <div className="text-lg font-semibold text-blue-600 -mt-2">Gyeongju Central Rotary Club</div>
                  <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      국제로타리3630지구
                      <br />
                      경주중앙로타리클럽
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                      봉사를 통한 지역사회 발전과 국제친선 - 경주 지역 최고의 봉사단체
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button size="lg" asChild className="font-semibold px-6 py-3 rounded-full">
                        <Link href="/about">클럽 소개</Link>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="font-semibold px-6 py-3 rounded-full bg-transparent"
                        asChild
                      >
                        <Link href="/activities">봉사활동 보기</Link>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="font-semibold px-6 py-3 rounded-full bg-blue-900 border-2 border-blue-900 hover:bg-blue-800 text-white hover:text-white"
                        asChild
                      >
                        <Link href="/gallery">클럽갤러리</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 우측: 배경 사진 */}
                <div className="lg:col-span-2 relative flex justify-center">
                  <div className="w-full h-[350px] lg:h-[400px] relative rounded-2xl shadow-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=400&width=600"
                      alt="경주중앙로타리클럽 제21대 22대 회장단 이취임식 - 천상 天翔 최용환 회장"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-4 bg-white" aria-labelledby="notices-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-4">
                <h2 id="notices-heading" className="text-xl md:text-2xl font-bold mb-2 text-gray-900 leading-tight">
                  공지사항
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  클럽의 최신 소식과 공지사항을 확인하세요.
                </p>
              </div>

              <div className="space-y-1 max-w-4xl mx-auto">
                {notices.length > 0 ? (
                  notices.map((notice) => (
                    <Card
                      key={`${notice.id}-${noticesVersion}`}
                      className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-r from-white to-gray-50"
                    >
                      <CardContent className="p-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2 text-blue-700 leading-tight">{notice.title}</h3>
                            <p className="text-base font-semibold text-blue-600 leading-relaxed mb-1">
                              {notice.content}
                            </p>
                            {notice.details && (
                              <div className="flex flex-wrap gap-3 text-sm text-blue-500 font-medium mt-2">
                                {notice.details.date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {notice.details.date}
                                  </span>
                                )}
                                {notice.details.time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {notice.details.time}
                                  </span>
                                )}
                                {notice.details.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {notice.details.location}
                                  </span>
                                )}
                              </div>
                            )}
                            {!notice.details && notice.location && (
                              <p className="text-sm text-blue-500 font-medium flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {notice.location}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal bg-gray-100 text-gray-500 border-0 ml-4"
                          >
                            {notice.date}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-0 shadow-sm bg-gradient-to-r from-white to-gray-50">
                    <CardContent className="p-4 text-center">
                      <p className="text-gray-500">공지사항을 불러오는 중...</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="text-center mt-3">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingNotices(!isEditingNotices)}
                    className="font-semibold px-3 py-1 text-sm rounded-full border-2 border-blue-200 hover:bg-blue-50 transition-all bg-transparent"
                  >
                    {isEditingNotices ? "편집 완료" : "공지사항 관리"}
                  </Button>
                  {isEditingNotices && (
                    <Button
                      onClick={() => setIsAddNoticeOpen(true)}
                      className="font-semibold px-3 py-1 text-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      새 공지사항 추가
                    </Button>
                  )}
                </div>

                {isEditingNotices && notices.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {notices.map((notice) => (
                      <div key={notice.id} className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditNotice(notice)}
                          className="text-xs"
                        >
                          "{notice.title}" 수정
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="text-xs"
                        >
                          삭제
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="py-16 bg-white" aria-labelledby="news-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 id="news-heading" className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  회원소식
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  클럽 회원들의 최신 소식과 활동을 전해드립니다.
                </p>
                <div className="mt-6">
                  <Dialog open={isAddNewsOpen} onOpenChange={setIsAddNewsOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          if (!requireAuth()) return
                          setEditingNews(null)
                          setNewsForm({
                            title: "",
                            date: "",
                            content: "",
                            category: "일반소식",
                          })
                        }}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />새 회원소식 추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingNews ? "회원소식 수정" : "새 회원소식 추가"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="news-title">제목 *</Label>
                          <Input
                            id="news-title"
                            value={newsForm.title}
                            onChange={(e) => setNewsForm((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="회원소식 제목을 입력하세요"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="news-date">날짜 *</Label>
                            <Input
                              id="news-date"
                              type="date"
                              value={newsForm.date}
                              onChange={(e) => setNewsForm((prev) => ({ ...prev, date: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="news-category">카테고리</Label>
                            <Select
                              value={newsForm.category}
                              onValueChange={(value) => setNewsForm((prev) => ({ ...prev, category: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="일반소식">일반소식</SelectItem>
                                <SelectItem value="임원소식">임원소식</SelectItem>
                                <SelectItem value="입회소식">입회소식</SelectItem>
                                <SelectItem value="개인소식">개인소식</SelectItem>
                                <SelectItem value="사업소식">사업소식</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="news-content">내용</Label>
                          <Textarea
                            id="news-content"
                            value={newsForm.content}
                            onChange={(e) => setNewsForm((prev) => ({ ...prev, content: e.target.value }))}
                            placeholder="회원소식 내용을 입력하세요"
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddNewsOpen(false)}>
                            취소
                          </Button>
                          <Button onClick={handleSaveNews}>{editingNews ? "수정" : "추가"}</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memberNews.map((news) => (
                  <Card key={news.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          {news.category}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditNews(news)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteNews(news.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-900">{news.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-3">{news.content}</p>
                      <p className="text-sm text-gray-500">{formatDate(news.date)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {memberNews.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">아직 등록된 회원소식이 없습니다.</p>
                  <p className="text-gray-400 text-sm mt-2">새 회원소식을 추가해보세요.</p>
                </div>
              )}
            </div>
          </section>

          <section className="py-24 bg-white" aria-labelledby="about-rotary-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2
                  id="about-rotary-heading"
                  className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight"
                >
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
                        <MapPin className="h-8 w-8 text-amber-600" />
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

              <div className="space-y-8">
                <article className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
                  <Card>
                    <CardHeader className="pb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">경주중앙로타리클럽의 목적</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ol className="space-y-4">
                        <li className="flex gap-4">
                          <span className="font-bold text-blue-600 min-w-[32px] text-lg">1.</span>
                          <span className="text-gray-700 leading-relaxed text-lg">
                            친목을 도모하고 봉사의 기회로 삼는다
                          </span>
                        </li>
                        <li className="flex gap-4">
                          <span className="font-bold text-blue-600 min-w-[32px] text-lg">2.</span>
                          <span className="text-gray-700 leading-relaxed text-lg">
                            사업과 전문직업의 높은 윤리적 표준을 장려하고, 모든 유용한 업무의 품위를 인정하며, 각자의
                            직업을 통하여 사회에 봉사하는 정신을 함양한다
                          </span>
                        </li>
                        <li className="flex gap-4">
                          <span className="font-bold text-blue-600 min-w-[32px] text-lg">3.</span>
                          <span className="text-gray-700 leading-relaxed text-lg">
                            모든 로타리안이 개인적으로나 사업 및 사회생활에 있어서 봉사 이상을 적용하도록 장려한다
                          </span>
                        </li>
                        <li className="flex gap-4">
                          <span className="font-bold text-blue-600 min-w-[32px] text-lg">4.</span>
                          <span className="text-gray-700 leading-relaxed text-lg">
                            봉사 이상으로 결합된 사업인과 전문직업인의 세계적 친목을 통하여 국제간의 이해와 친선과
                            평화를 증진한다
                          </span>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </article>

                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50">
                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-100 rounded-full">
                        <Award className="h-8 w-8 text-indigo-600" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">네가지 표준 (Four-Way Test)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                      우리가 생각하고 말하고 행동하는 모든 것에 대하여:
                    </p>
                    <ol className="space-y-4">
                      <li className="flex gap-4">
                        <span className="font-bold text-indigo-600 min-w-[32px] text-lg">1.</span>
                        <span className="text-gray-700 leading-relaxed font-semibold text-lg">진실한가?</span>
                      </li>
                      <li className="flex gap-4">
                        <span className="font-bold text-indigo-600 min-w-[32px] text-lg">2.</span>
                        <span className="text-gray-700 leading-relaxed font-semibold text-lg">
                          모든 관계자에게 공정한가?
                        </span>
                      </li>
                      <li className="flex gap-4">
                        <span className="font-bold text-indigo-600 min-w-[32px] text-lg">3.</span>
                        <span className="text-gray-700 leading-relaxed font-semibold text-lg">
                          선의와 우정을 증진하는가?
                        </span>
                      </li>
                      <li className="flex gap-4">
                        <span className="font-bold text-indigo-600 min-w-[32px] text-lg">4.</span>
                        <span className="text-gray-700 leading-relaxed font-semibold text-lg">
                          모든 관계자에게 이익이 되는가?
                        </span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Heart className="h-8 w-8 text-purple-600" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">로타리 핵심가치</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <span className="text-purple-600 text-xl">•</span>
                        <span className="text-gray-700 leading-relaxed text-lg">
                          <span className="font-semibold">봉사 (Service)</span> - 우리의 직업, 지역사회, 그리고 전
                          세계를 위한 봉사
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-purple-600 text-xl">•</span>
                        <span className="text-gray-700 leading-relaxed text-lg">
                          <span className="font-semibold">친목 (Fellowship)</span> - 지역적, 국가적, 국제적 차원에서의
                          지속적인 우정
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-purple-600 text-xl">•</span>
                        <span className="text-gray-700 leading-relaxed text-lg">
                          <span className="font-semibold">다양성 (Diversity)</span> - 다양한 직업, 문화, 관점을 가진
                          사람들과의 협력
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-purple-600 text-xl">•</span>
                        <span className="text-gray-700 leading-relaxed text-lg">
                          <span className="font-semibold">고결성 (Integrity)</span> - 우리의 행동과 관계에서 보여주는
                          정직함
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-purple-600 text-xl">•</span>
                        <span className="text-gray-700 leading-relaxed text-lg">
                          <span className="font-semibold">리더십 (Leadership)</span> - 지역사회와 직장에서의 리더십 개발
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <History className="h-8 w-8 text-green-600" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">로타리 역사</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-5">
                      <div className="flex gap-6 items-start">
                        <Badge
                          variant="outline"
                          className="min-w-fit text-sm font-semibold px-3 py-1 bg-green-100 text-green-700 border-green-200"
                        >
                          1905년
                        </Badge>
                        <span className="text-gray-700 leading-relaxed text-lg">
                          폴 해리스가 시카고에서 최초의 로타리클럽 창립
                        </span>
                      </div>
                      <div className="flex gap-6 items-start">
                        <Badge
                          variant="outline"
                          className="min-w-fit text-sm font-semibold px-3 py-1 bg-green-100 text-green-700 border-green-200"
                        >
                          1910년
                        </Badge>
                        <span className="text-gray-700 leading-relaxed text-lg">전국로타리클럽연합회 결성</span>
                      </div>
                      <div className="flex gap-6 items-start">
                        <Badge
                          variant="outline"
                          className="min-w-fit text-sm font-semibold px-3 py-1 bg-green-100 text-green-700 border-green-200"
                        >
                          1922년
                        </Badge>
                        <span className="text-gray-700 leading-relaxed text-lg">국제로타리 명칭 채택</span>
                      </div>
                      <div className="flex gap-6 items-start">
                        <Badge
                          variant="outline"
                          className="min-w-fit text-sm font-semibold px-3 py-1 bg-green-100 text-green-700 border-green-200"
                        >
                          1947년
                        </Badge>
                        <span className="text-gray-700 leading-relaxed text-lg">
                          한국 최초 로타리클럽(서울로타리클럽) 창립
                        </span>
                      </div>
                      <div className="flex gap-6 items-start">
                        <Badge
                          variant="outline"
                          className="min-w-fit text-sm font-semibold px-3 py-1 bg-green-100 text-green-700 border-green-200"
                        >
                          1985년
                        </Badge>
                        <span className="text-gray-700 leading-relaxed text-lg">폴리오플러스 프로그램 시작</span>
                      </div>
                      <div className="flex gap-6 items-start">
                        <Badge
                          variant="outline"
                          className="min-w-fit text-sm font-semibold px-3 py-1 bg-blue-100 text-blue-700 border-blue-200"
                        >
                          2005년
                        </Badge>
                        <span className="text-gray-700 leading-relaxed text-lg font-semibold text-blue-700">
                          경주중앙로타리클럽 창립
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
      <AdminPanel />

      <Dialog open={isAddNoticeOpen} onOpenChange={setIsAddNoticeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>새 공지사항 추가</DialogTitle>
          </DialogHeader>
          <NoticeForm onSubmit={handleAddNotice} onCancel={() => setIsAddNoticeOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingNotice} onOpenChange={() => setEditingNotice(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>공지사항 수정</DialogTitle>
          </DialogHeader>
          <NoticeForm notice={editingNotice} onSubmit={handleUpdateNotice} onCancel={() => setEditingNotice(null)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function NoticeForm({ notice, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: notice?.title || "",
    content: notice?.content || "",
    type: notice?.type || "일반",
    details: {
      date: notice?.details?.date || "",
      time: notice?.details?.time || "",
      location: notice?.details?.location || "",
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="notice-title">제목</Label>
        <Input
          id="notice-title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="공지사항 제목을 입력하세요"
        />
      </div>

      <div>
        <Label htmlFor="notice-content">내용</Label>
        <Textarea
          id="notice-content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="공지사항 내용을 입력하세요"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="notice-type">유형</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="일반">일반</SelectItem>
            <SelectItem value="중요">중요</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="notice-date">날짜</Label>
          <Input
            id="notice-date"
            type="text"
            value={formData.details.date}
            onChange={(e) => setFormData({ ...formData, details: { ...formData.details, date: e.target.value } })}
            placeholder="2025.01.15"
          />
        </div>

        <div>
          <Label htmlFor="notice-time">시간</Label>
          <Input
            id="notice-time"
            type="text"
            value={formData.details.time}
            onChange={(e) => setFormData({ ...formData, details: { ...formData.details, time: e.target.value } })}
            placeholder="오후 7시"
          />
        </div>

        <div>
          <Label htmlFor="notice-location">장소</Label>
          <Input
            id="notice-location"
            type="text"
            value={formData.details.location}
            onChange={(e) => setFormData({ ...formData, details: { ...formData.details, location: e.target.value } })}
            placeholder="클럽회관"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">{notice ? "수정" : "추가"}</Button>
      </div>
    </form>
  )
}
