"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Award, BookOpen, History } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { AdminPanel } from "@/components/admin-panel"
import PWAInstall from "@/components/pwa-install"

const latestNotices = [
  {
    id: 1,
    title: "이사회 개최 안내",
    content: "2025년 8월 28일(목) 오후 7시에 이사회가 개최됩니다.",
    date: "2025.08.20",
  },
  {
    id: 2,
    title: "정기모임 안내",
    content: "다음 정기모임이 2025년 9월 4일(목) 오후 7시에 진행됩니다.",
    date: "2025.08.20",
  },
  {
    id: 3,
    title: "봄맞이 봉사활동 참가자 모집",
    content: "4월 20일 진행될 봄맞이 봉사활동 참가자를 모집합니다.",
    date: "2024.03.28",
  },
]

export default function HomePage() {
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

  const [backgroundImage, setBackgroundImage] = useState("/images/club-photo.png")

  useEffect(() => {
    const savedActivities = localStorage.getItem("activities")
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    }

    const savedMemberNews = localStorage.getItem("memberNews")
    if (savedMemberNews) {
      setMemberNews(JSON.parse(savedMemberNews))
    }

    const savedBackgroundImage = localStorage.getItem("activeBackgroundImage")
    if (savedBackgroundImage) {
      setBackgroundImage(savedBackgroundImage)
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
      <Navigation />
      <PWAInstall />

      <div className="pt-16">
        <section className="relative min-h-[60vh] flex items-center bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* 좌측: 로고와 텍스트 */}
              <div className="flex flex-col items-start space-y-6">
                <Image
                  src="/rotary-logo-official.png"
                  alt="Rotary Logo"
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
                    봉사를 통한 지역사회 발전과 국제친선
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
                      className="font-semibold px-6 py-3 rounded-full bg-transparent border-2 border-purple-200 hover:bg-purple-50 text-purple-700"
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
                    src={backgroundImage || "/placeholder.svg"}
                    alt="제 21대 22대 회장단 이취임식"
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      e.currentTarget.src = "/images/club-photo.png"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-4 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 leading-tight">공지사항</h2>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
                클럽의 최신 소식과 공지사항을 확인하세요.
              </p>
            </div>

            <div className="space-y-1 max-w-4xl mx-auto">
              {latestNotices.map((notice) => (
                <Card
                  key={notice.id}
                  className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-r from-white to-gray-50"
                >
                  <CardContent className="p-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold mb-1 text-gray-900 leading-tight">{notice.title}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">{notice.content}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-700 border-0">
                        {notice.date}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-3">
              <Button
                variant="outline"
                asChild
                className="font-semibold px-3 py-1 text-sm rounded-full border-2 border-blue-200 hover:bg-blue-50 transition-all bg-transparent"
              >
                <Link href="/notices">모든 공지사항 보기</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">로타리클럽이란?</h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                로타리는 전 세계 200여 개국에서 120만 명 이상의 회원이 활동하는 국제적인 봉사단체입니다.
                경주중앙로타리클럽은 지역사회 발전과 국제친선을 위해 다양한 봉사활동을 펼치고 있습니다.
              </p>
            </div>

            <div className="space-y-8">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">로타리의 목적</CardTitle>
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
                        사업과 전문직업의 높은 윤리적 표준을 장려하고, 모든 유용한 업무의 품위를 인정하며, 각자의 직업을
                        통하여 사회에 봉사하는 정신을 함양한다
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
                        봉사 이상으로 결합된 사업인과 전문직업인의 세계적 친목을 통하여 국제간의 이해와 친선과 평화를
                        증진한다
                      </span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

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
                        <span className="font-semibold">봉사 (Service)</span> - 우리의 직업, 지역사회, 그리고 전 세계를
                        위한 봉사
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
      </div>

      <Footer />
      <AdminPanel />
    </div>
  )
}
