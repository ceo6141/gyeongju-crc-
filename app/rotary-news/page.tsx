"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Globe, Smartphone, Users, BookOpen, Award, Heart, History } from "lucide-react"
import { NaverBandLink } from "@/components/naver-band-link"
import { Navigation } from "@/components/navigation"

export default function RotaryNewsPage() {
  const [activeTab, setActiveTab] = useState("rotary-info")

  const internationalNews = [
    {
      id: 1,
      title: "2025-26년도 국제로타리 회장 테마",
      content:
        "브라질의 Francesco Arezzo 회장의 'UNITE FOR GOOD' 테마로 전 세계 로타리안들이 하나가 되어 선한 일을 위해 협력하며 지역사회에 긍정적인 변화를 만들어가고 있습니다.",
      date: "2025-07-01",
      type: "테마",
    },
    {
      id: 2,
      title: "2025-26년도 로타리재단 연차 기금 목표",
      content:
        "새로운 로타리 연도를 맞아 로타리재단의 연차 기금 목표가 발표되었으며, 전 세계적인 봉사 프로젝트 지원을 위한 기금 모금이 진행됩니다.",
      date: "2025-06-15",
      type: "재단",
    },
    {
      id: 3,
      title: "폴리오 퇴치 최종 단계 진입",
      content:
        "2025년 현재 폴리오는 아프가니스탄과 파키스탄 2개국에서만 발생하고 있으며, 완전 퇴치를 위한 마지막 노력이 계속되고 있습니다.",
      date: "2025-05-20",
      type: "캠페인",
    },
    {
      id: 4,
      title: "2025년 국제로타리 국제대회",
      content:
        "캐나다 캘거리에서 개최되는 2025년 국제로타리 국제대회에 전 세계 로타리안들이 참가하여 우정과 봉사 정신을 나누었습니다.",
      date: "2025-06-01",
      type: "대회",
    },
  ]

  const districtNews = [
    {
      id: 1,
      title: "3630지구 2025-26년도 지구총회",
      content:
        "부산에서 개최된 3630지구 총회에서 새로운 지구 거버너가 취임하고 2025-26년도 지구 운영 계획이 발표되었습니다.",
      date: "2025-07-15",
      type: "총회",
    },
    {
      id: 2,
      title: "지구 차원의 환경보호 프로젝트",
      content: "3630지구 내 모든 클럽이 참여하는 '깨끗한 바다 만들기' 환경보호 프로젝트가 본격 시작되었습니다.",
      date: "2025-08-01",
      type: "봉사",
    },
    {
      id: 3,
      title: "청소년 교환 프로그램 재개",
      content:
        "코로나19 이후 중단되었던 청소년 교환 프로그램이 2025-26년도부터 본격 재개되어 국제 교류가 활성화됩니다.",
      date: "2025-06-20",
      type: "청소년",
    },
    {
      id: 4,
      title: "경주중앙로타리클럽 제22대 임원 취임",
      content:
        "경주중앙로타리클럽에서 천상 天翔 최용환 회장을 비롯한 제22대 임원진이 취임하여 '다시하나되어 봉사와 성장을!!' 슬로건으로 새로운 출발을 했습니다.",
      date: "2025-07-01",
      type: "클럽",
    },
  ]

  const rotaryInfo = {
    purpose: [
      "친목을 도모하고 봉사의 기회로 삼는다",
      "사업과 전문직업의 높은 윤리적 표준을 장려하고, 모든 유용한 업무의 품위를 인정하며, 각자의 직업을 통하여 사회에 봉사하는 정신을 함양한다",
      "모든 로타리안이 개인적으로나 사업 및 사회생활에 있어서 봉사 이상을 적용하도록 장려한다",
      "봉사 이상으로 결합된 사업인과 전문직업인의 세계적 친목을 통하여 국제간의 이해와 친선과 평화를 증진한다",
    ],
    fourWayTest: [
      "진실한가?",
      "모든 관계자에게 공정한가?",
      "선의와 우정을 증진하는가?",
      "모든 관계자에게 이익이 되는가?",
    ],
    coreValues: [
      "봉사 (Service) - 우리의 직업, 지역사회, 그리고 전 세계를 위한 봉사",
      "친목 (Fellowship) - 지역적, 국가적, 국제적 차원에서의 지속적인 우정",
      "다양성 (Diversity) - 다양한 직업, 문화, 관점을 가진 사람들과의 협력",
      "고결성 (Integrity) - 우리의 행동과 관계에서 보여주는 정직함",
      "리더십 (Leadership) - 지역사회와 직장에서의 리더십 개발",
    ],
    history: [
      {
        year: "1905년",
        event: "폴 해리스가 시카고에서 최초의 로타리클럽 창립",
      },
      {
        year: "1910년",
        event: "전국로타리클럽연합회 결성",
      },
      {
        year: "1922년",
        event: "국제로타리 명칭 채택",
      },
      {
        year: "1947년",
        event: "한국 최초 로타리클럽(서울로타리클럽) 창립",
      },
      {
        year: "1985년",
        event: "폴리오플러스 프로그램 시작",
      },
      {
        year: "2005년",
        event: "경주중앙로타리클럽 창립",
      },
    ],
    riPresident: {
      year: "2025-26",
      name: "Francesco Arezzo",
      nationality: "브라질",
      theme: "UNITE FOR GOOD",
      description:
        "브라질 출신의 Francesco Arezzo 회장은 'UNITE FOR GOOD' 테마로 전 세계 로타리안들이 하나가 되어 선한 일을 위해 협력할 것을 강조하고 있습니다.",
    },
    districtGovernors: [
      {
        year: "2025-26",
        name: "청담 공명식",
        club: "3630지구",
        description: "국제로타리 3630지구의 현 총재로서 지구 내 모든 클럽의 발전과 봉사활동을 이끌고 있습니다.",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">로타리 소식</h1>
            <p className="text-lg text-muted-foreground">
              로타리에 대한 정보와 국제로타리, 3630지구의 최신 소식을 확인하세요
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>국제로타리 공식 사이트</CardTitle>
                <CardDescription>Rotary International 공식 홈페이지</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild className="w-full">
                  <a
                    href="https://www.rotary.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    방문하기 <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Smartphone className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>K로타리 앱</CardTitle>
                <CardDescription>모바일에서 로타리 정보 확인</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <a
                    href="https://play.google.com/store/search?q=k%EB%A1%9C%ED%83%80%EB%A6%AC&c=apps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Google Play <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <a
                    href="https://apps.apple.com/search?term=k%EB%A1%9C%ED%83%80%EB%A6%AC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    App Store <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>경주중앙로타리클럽</CardTitle>
                <CardDescription className="text-lg font-semibold">네이버밴드로 가기</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <NaverBandLink />
              </CardContent>
            </Card>
          </div>

          {/* News Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit mx-auto">
              <Button
                variant={activeTab === "rotary-info" ? "default" : "ghost"}
                onClick={() => setActiveTab("rotary-info")}
                className="px-6"
              >
                로타리 소개
              </Button>
              <Button
                variant={activeTab === "international" ? "default" : "ghost"}
                onClick={() => setActiveTab("international")}
                className="px-6"
              >
                국제 소식
              </Button>
              <Button
                variant={activeTab === "district" ? "default" : "ghost"}
                onClick={() => setActiveTab("district")}
                className="px-6"
              >
                3630지구 소식
              </Button>
            </div>
          </div>

          {/* News Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "rotary-info" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-center mb-6">로타리란?</h2>

                {/* 로타리의 목적 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">로타리의 목적</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {rotaryInfo.purpose.map((item, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="font-semibold text-primary min-w-[24px]">{index + 1}.</span>
                          <span className="text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* 네가지 표준 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Award className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">네가지 표준 (Four-Way Test)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">우리가 생각하고 말하고 행동하는 모든 것에 대하여:</p>
                    <ol className="space-y-3">
                      {rotaryInfo.fourWayTest.map((item, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="font-semibold text-primary min-w-[24px]">{index + 1}.</span>
                          <span className="text-muted-foreground leading-relaxed font-medium">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* 로타리 핵심가치 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Heart className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">로타리 핵심가치</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {rotaryInfo.coreValues.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <span className="text-primary">•</span>
                          <span className="text-muted-foreground leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 로타리 역사 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <History className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">로타리 역사</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rotaryInfo.history.map((item, index) => (
                        <div key={index} className="flex gap-4 items-start">
                          <Badge variant="outline" className="min-w-fit">
                            {item.year}
                          </Badge>
                          <span className="text-muted-foreground leading-relaxed">{item.event}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Globe className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">2025-26년도 국제로타리 R.I 총재</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-blue-900">{rotaryInfo.riPresident.name}</h3>
                            <p className="text-blue-700">{rotaryInfo.riPresident.nationality}</p>
                          </div>
                          <Badge className="bg-blue-600 text-white">{rotaryInfo.riPresident.year}</Badge>
                        </div>
                        <div className="mb-3">
                          <span className="text-sm font-medium text-blue-800">회장 테마:</span>
                          <p className="text-xl font-bold text-blue-900 mt-1">{rotaryInfo.riPresident.theme}</p>
                        </div>
                        <p className="text-blue-800 leading-relaxed">{rotaryInfo.riPresident.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Users className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">국제로타리 3630지구 총재</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rotaryInfo.districtGovernors.map((governor, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-green-900">{governor.name}</h3>
                              <p className="text-green-700">{governor.club}</p>
                            </div>
                            <Badge className="bg-green-600 text-white">{governor.year}</Badge>
                          </div>
                          <p className="text-green-800 leading-relaxed">{governor.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "international" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-6">국제로타리 소식</h2>
                {internationalNews.map((news) => (
                  <Card key={news.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{news.title}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">{news.date}</CardDescription>
                        </div>
                        <Badge variant="secondary">{news.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{news.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "district" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-6">3630지구 소식</h2>
                {districtNews.map((news) => (
                  <Card key={news.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{news.title}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">{news.date}</CardDescription>
                        </div>
                        <Badge variant="secondary">{news.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{news.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">더 많은 정보가 필요하시면 아래 링크를 확인하세요</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="https://www.rotary.org/ko" target="_blank" rel="noopener noreferrer">
                  국제로타리 한국어 사이트
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://www.rotary3630.org" target="_blank" rel="noopener noreferrer">
                  3630지구 공식 사이트
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
