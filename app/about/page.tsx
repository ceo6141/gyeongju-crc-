"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMemberCount } from "@/lib/members-data"
import { Navigation } from "@/components/navigation"
import Image from "next/image"

const presidents = [
  { term: "초대", period: "2005", name: "이암 최병준", nameHanja: "李殷 최炳俊" },
  { term: "2대", period: "2005-2006", name: "이암 최병준", nameHanja: "李殷 최炳俊" },
  { term: "3대", period: "2006-2007", name: "최희상", nameHanja: "崔熙相" },
  { term: "4대", period: "2007-2008", name: "이상익", nameHanja: "李相益" },
  { term: "5대", period: "2008-2009", name: "김병수", nameHanja: "金炳洙" },
  { term: "6대", period: "2009-2010", name: "윤태조", nameHanja: "尹泰祚" },
  { term: "7대", period: "2010-2011", name: "이승협", nameHanja: "李承協" },
  { term: "8대", period: "2011-2012", name: "이창희", nameHanja: "李昌熙" },
  { term: "9대", period: "2012-2013", name: "서상호", nameHanja: "徐相浩" },
  { term: "10대", period: "2013-2014", name: "박문상", nameHanja: "朴文相" },
  { term: "11대", period: "2014-2015", name: "황병욱", nameHanja: "黃炳旭" },
  { term: "12대", period: "2015-2016", name: "권오석", nameHanja: "權五碩" },
  { term: "13대", period: "2016-2017", name: "박임관", nameHanja: "朴林寬" },
  { term: "14대", period: "2017-2018", name: "윤태열", nameHanja: "尹泰烈" },
  { term: "15대", period: "2018-2019", name: "이정환", nameHanja: "李正奐" },
  { term: "16대", period: "2019-2020", name: "남정악", nameHanja: "南禎岳" },
  { term: "17대", period: "2020-2021", name: "김동한", nameHanja: "金東漢" },
  { term: "18대", period: "2021-2022", name: "오승연", nameHanja: "吳承燕" },
  { term: "19대", period: "2022-2023", name: "임성일", nameHanja: "林成一" },
  { term: "20대", period: "2023-2024", name: "이재술", nameHanja: "李在述" },
  { term: "21대", period: "2024-2025", name: "김용현", nameHanja: "金龍賢" },
  { term: "22대", period: "2025-2026", name: "최용환", nameHanja: "崔龍煥" },
]

const historyByYear = [
  {
    year: "2005년 (창립년도)",
    color: "border-primary",
    textColor: "text-primary",
    events: [
      "1월 20일: 창립총회 (경주선덕로타리클럽 스폰서, 경주 힐튼호텔)",
      "2월 25일: 국제로타리 100주년 기념상징물 제막식 참여",
      "5월 09일: 전동차 기증식 (용강동 동사무소)",
      "7월 06일: 국제로타리 3670지구 이리중앙로타리클럽과 자매결연",
      "8월 10일: 국제로타리 3300지구 말레이시아 Banda-sunway 로타리클럽과의 자매결연",
      "9월 23일: 여승인 인증서 전달식 (월드웰컴뷔페)",
      "10월 05일: 경주정보고등학교 인터랙트클럽 창립 (회원 20명)",
      "10월 18일: 경주용강초등학교 리틀랙트클럽 창립 (회원 34명)",
      "10월 26일: 골프회 발족",
      "12월 09일: 부인회 발족",
      "12월 11일: 동산회 발족",
      "12월 28일: 연말 불우이웃돕기 행사",
    ],
  },
  {
    year: "2006년",
    color: "border-blue-500",
    textColor: "text-blue-600",
    events: [
      "1월 20일: 창립 1주년 기념식 (회원 101명)",
      "2월 18일: 자매마을 결연 (경주시 건천읍 신평2리 가천마을)",
      "3월 25일: '사랑의 김치기' 준공 (건천읍 신평2리)",
      "4월 23일: 3630지구 최우수클럽상 수상 (지구대회)",
      "5월 03일: 자매마을 쌀포살치 (신평2리 가천마을)",
      "6월 16일: 제3대 명덕 최회상 회장 취임 (경주 힐튼호텔)",
      "8월 10일: 교환학생 파견 (국제로타리 3300지구 말레이시아)",
      "11월 05일: 자매마을 영정사진 제작 및 한방진료, 이미용 봉사활동",
      "12월 11일: 축구회 발족 (회원25명)",
      "12월 28일: 교환학생 방한 (국제로타리3300지구 말레이시아)",
    ],
  },
  {
    year: "2007년",
    color: "border-green-500",
    textColor: "text-green-600",
    events: [
      "3월 01일~04일: 국제로타리 3300지구 말레이시아 반다썬웨이로타리클럽 초청 방문",
      "6월 19일: 제4대 양정 이상익 회장 취임 (월드웰컴뷔페)",
      "7월 28일: 용강리틀랙트클럽 지식연수회 및 활성화지원 발전소 견학",
      "10월 21일~28일: 나눔의 손길로 삼척을 위한 대장정 참가",
      "11월 04일: 자매클럽과 부부합동 중반 주회 (무주 덕유산)",
    ],
  },
  {
    year: "2008년",
    color: "border-yellow-500",
    textColor: "text-yellow-600",
    events: [
      "3월 23일: 건천읍 신평리 자매마을 봉사활동 (한방진료, 이미용 봉사, 독거노인 지원 등)",
      "4월 27일: GSE단원 본클럽 방문 (라트비아 시범 및 간담회)",
      "6월 27일: 제5대 수수 김병수 회장 취임 (월드웰컴뷔페)",
      "9월 03일: 한국로타리의 날 행사 참가",
      "9월 27일: 자매클럽과 부부합동 중반 주회 (경주 남산)",
    ],
  },
  {
    year: "2009년",
    color: "border-purple-500",
    textColor: "text-purple-600",
    events: [
      "1월 04일: 연차총회 개최",
      "1월 22일: 스폰서 클럽과 합동주회 (경주선덕RC)",
      "6월 26일: 제6대 금파 윤태조 회장 취임 (포시즌 유스호스텔)",
      "8월 07일: 나눔의 봉사활동 (안양지 연령단지 작은 음악회 개최)",
      "11월 01일: 창립 5주년 기념식, 아프리카 케냐 코인 무료 급식사업 및 우간다 지원",
      "11월 29일: 사회복지시설 에티컴터 화목용 장작 1톤과 물품전달, 김장김치 봉사",
    ],
  },
  {
    year: "2010년",
    color: "border-red-500",
    textColor: "text-red-600",
    events: [
      "1월 21일: 창립 5주년 기념식",
      "3월 08일: 자매마을 신평2리에 전동휠체어 전달",
      "3월 12일: 제21회 전국 주보로타리스트 편집부문 은상 수상",
      "5월 01일: 3630지구대회 수상 (모범 클럽상, 회원증강 표창)",
      "7월 02일: 제7대 자유 이승협 회장 취임 (경주현대호텔)",
      "8월 06일: 사랑의 집짓기 참여 (경주시 동방동 다문화 가정)",
      "10월 24일: 신라역사체험 축제대회에 인터랙트, 회원 환경정화활동 및 안내",
    ],
  },
  {
    year: "2011년",
    color: "border-indigo-500",
    textColor: "text-indigo-600",
    events: [
      "1월 30일: 동한산 산행 및 자연정화 활동",
      "2월 18일: 스폰서 클럽인 경주선덕로타리클럽과 합동 직장주회",
      "3월 15일: 자매마을 건천 신평리 의료보조기 10대 전달",
      "4월 30일: 3630지구 로타리재단 기여 우수클럽상, 홍보상, 모범클럽상 수상",
      "6월 16일: 제8대 동연 이창희 회장 취임 (월드웰컴뷔페)",
    ],
  },
  {
    year: "2012년",
    color: "border-pink-500",
    textColor: "text-pink-600",
    events: [
      "2월 16일: 현명 봉사활동 (경주역 광장)",
      "3월 18일: 자매마을 건천읍 신평리 한방진료 및 이미용, 무료급식 봉사활동",
      "5월 5일~9일: 제103차 2012 한국 국제대회 참가 (2011~12 제인지메이어 RI 표창 수상)",
      "6월 21일: 제9대 운재 서상호 회장 취임 (월드웰컴뷔페)",
      "8월 16일: 울산 적십자 혈액원과 함께 부부합동 헌혈주회 (경주역 광장)",
    ],
  },
  {
    year: "2013년",
    color: "border-teal-500",
    textColor: "text-teal-600",
    events: [
      "1월 17일: 창립 8주년 기념식 및 부부합동 선물교환 주회",
      "1월 22일: 국제로타리 3630지구 필리핀 세부레스로타리클럽과 자매결연",
      "2월 23일: 소아마비 기금마련 걷기대회 참가 (동악산)",
      "3월 23일~28일: 필리핀 세부레스로타리클럽과 자매결연식 참석",
      "6월 20일: 제10대 심원 박문상 회장 취임 (월드웰컴뷔페)",
    ],
  },
  {
    year: "2014년",
    color: "border-orange-500",
    textColor: "text-orange-600",
    events: [
      "1월 15일: 경주시로부터 봉사활동유공 표창 수상",
      "2월 15일: 글로벌 보조금 사업 승인(GG1414012)",
      "3월 06일: 제25회 전국 클럽 주보 콘테스트 대상 수상",
      "6월 8일~13일: 글로벌 보조금 프로젝트 실시 - 필리핀 세부지역 클럽활동 설치사업",
      "6월 19일: 제11대 중원 황병욱 회장 취임 (월드웰컴뷔페)",
      "12월 28일: 창립 10주년 기념 조형물(파고라) 준공 (노서공원)",
    ],
  },
  {
    year: "2015년",
    color: "border-cyan-500",
    textColor: "text-cyan-600",
    events: [
      "1월 20일: 창립 10주년 기념식 (월드웰컴뷔페)",
      "2월 7일~10일: 3630지구 7지역의 필리핀 컴퓨터 지원 사업 참가",
      "4월 25일: 3630지구 로타리재단 기여 표창",
      "6월 18일: 제12대 회장 승강 권오석 회장 취임 (월드웰컴뷔페)",
      "11월 12일: 사랑의 연탄나눔 (지체장애인 57가구, 2,000장)",
    ],
  },
  {
    year: "2016년",
    color: "border-lime-500",
    textColor: "text-lime-600",
    events: [
      "1월 13일: 6.7지역 합동 사랑의 생필품 헌혈봉사 (경주역)",
      "2월 15일~19일: 7지역 지구보조금 사업 (필리핀 상상 어린이 수술 지원 참가)",
      "3월 06일: 안강읍 감산리 자매마을 봉사",
      "6월 10일~14일: 필리핀 세부레스로타리클럽 이·취임식 참석",
    ],
  },
  {
    year: "2017년",
    color: "border-rose-500",
    textColor: "text-rose-600",
    events: [
      "1월 20일: 창립 12주년 기념 주회",
      "2월 08일: 50사단 헌병대에 전광판 기증",
      "4월 22일: 2016-17년 지구대회(모범클럽상, 로타리 재단기여 표창)",
      "6월 15일: 제13·14대 회장 및 임원 이사 이·취임식 (The-k호텔 경주)",
      "7월 17일: 모아초등학교 리틀랙트 창단식",
    ],
  },
  {
    year: "2018년",
    color: "border-violet-500",
    textColor: "text-violet-600",
    events: [
      "1월 08일: 불우이웃 전기매트, 이불 지원사업 (경주선덕RC와 합동봉사)",
      "1월 25일~30일: 지구보조금 해외봉사 프로젝트 사업 참가 (인도 뉴델리)",
      "2월 08일: 사랑의 헌혈운동(7지역 3개클럽 합동 - 경주역 광장)",
      "6월 20일: 제15·16대 회장 및 임원 이사 이·취임식 (경주 황룡호텔)",
      "8월 20일: 코로나19 극복 의료진 응원 물품 전달",
      "10월 15일: 비대면 봉사활동 - 독거노인 생필품 전달",
      "12월 24일: 사랑의 연탄나눔 봉사 (코로나19 방역수칙 준수)",
    ],
  },
  {
    year: "2019년",
    color: "border-emerald-500",
    textColor: "text-emerald-600",
    events: [
      "1월 17일: 창립14주년 기념 정기모임",
      "1월 21일~24일: 지구보조금 프로젝트봉사(컴퓨터 전달 - 필리핀 마닐라)",
      "2월 25일: 사랑의 헌혈운동(7지역 3개클럽 합동 - 경주역 광장)",
      "4월 27일: 2019-20년도 지구대회 (표창패 우수클럽상 수상)",
      "6월 20일: 제15·16대 회장 및 임원 이사 이·취임식 (경주 황룡호텔)",
    ],
  },
  {
    year: "2020년",
    color: "border-blue-600",
    textColor: "text-blue-700",
    events: [
      "1월 16일: 창립15주년 기념 정기모임",
      "2월 17일: 코로나19 대응 마스크 지원 사업 (경주시 취약계층)",
      "6월 18일: 제17대 회장 김동한 취임 (온라인 화상회의)",
      "8월 20일: 코로나19 극복 의료진 응원 물품 전달",
      "10월 15일: 비대면 봉사활동 - 독거노인 생필품 전달",
      "12월 24일: 사랑의 연탄나눔 봉사 (코로나19 방역수칙 준수)",
    ],
  },
  {
    year: "2021년",
    color: "border-purple-600",
    textColor: "text-purple-700",
    events: [
      "1월 21일: 창립16주년 기념 온라인 모임",
      "3월 10일: 디지털 소외계층 태블릿 지원 사업",
      "5월 12일: 어린이날 기념 취약계층 아동 선물 전달",
      "6월 17일: 제18대 회장 오승연 취임식",
      "9월 23일: 추석맞이 독거노인 안부 확인 및 생필품 전달",
      "11월 18일: 경주시 코로나19 방역 지원 물품 기증",
    ],
  },
  {
    year: "2022년",
    color: "border-green-600",
    textColor: "text-green-700",
    events: [
      "1월 20일: 창립17주년 기념식 (제한적 대면 모임)",
      "4월 14일: 우크라이나 난민 지원 성금 모금",
      "6월 16일: 제19대 회장 임성일 취임식 (경주 황룡호텔)",
      "8월 25일: 폭우 피해 지역 복구 봉사활동",
      "10월 20일: 경주시 다문화가정 한글교육 지원",
      "12월 22일: 연말 불우이웃돕기 성금 전달",
    ],
  },
  {
    year: "2023년",
    color: "border-red-600",
    textColor: "text-red-700",
    events: [
      "1월 19일: 창립18주년 기념 정기모임",
      "3월 16일: 경주시 청소년 진로체험 프로그램 지원",
      "5월 11일: 어버이날 기념 경로당 방문 봉사",
      "6월 15일: 제20대 회장 이재술 취임식",
      "9월 14일: 추석맞이 사회복지시설 위문",
      "11월 23일: 김장김치 나눔 봉사활동 (200포기)",
    ],
  },
  {
    year: "2024년",
    color: "border-orange-600",
    textColor: "text-orange-700",
    events: [
      "1월 18일: 창립19주년 기념식",
      "3월 21일: 경주시 환경정화 캠페인 참여",
      "5월 16일: 어린이 교통안전 캠페인 실시",
      "6월 20일: 제21대 회장 김용현 취임식 (경주 황룡호텔)",
      "8월 15일: 광복절 기념 보훈가족 위문",
      "10월 17일: 경주세계문화엑스포 자원봉사 참여",
      "12월 19일: 연말 사랑나눔 성금 전달식",
    ],
  },
  {
    year: "2025년",
    color: "border-indigo-600",
    textColor: "text-indigo-700",
    events: [
      "1월 16일: 창립20주년 기념 특별 행사 계획",
      "6월 19일: 제22대 회장 천상天翔 최용환 취임",
      "연중: 창립 20주년 기념 특별 봉사 프로젝트 진행",
    ],
  },
]

export default function AboutPage() {
  const [nextMeetingDate, setNextMeetingDate] = useState<string>("")
  const [currentMemberCount, setCurrentMemberCount] = useState<number>(0)

  useEffect(() => {
    const calculateNextMeeting = () => {
      const today = new Date()
      const cutoffDate = new Date("2025-09-04")

      if (today < cutoffDate) {
        setNextMeetingDate("매월 첫째, 셋째주 목요일 오후 7시")
        return
      }

      const year = today.getFullYear()
      const month = today.getMonth()

      const getThursdayOfWeek = (year: number, month: number, weekNumber: number) => {
        const firstDay = new Date(year, month, 1)
        const firstThursday = new Date(firstDay)
        firstThursday.setDate(1 + ((4 - firstDay.getDay() + 7) % 7))

        const targetThursday = new Date(firstThursday)
        targetThursday.setDate(firstThursday.getDate() + (weekNumber - 1) * 7)

        return targetThursday
      }

      const firstThursday = getThursdayOfWeek(year, month, 1)
      const thirdThursday = getThursdayOfWeek(year, month, 3)

      let nextMeeting: Date

      if (today <= firstThursday) {
        nextMeeting = firstThursday
      } else if (today <= thirdThursday) {
        nextMeeting = thirdThursday
      } else {
        const nextMonth = month === 11 ? 0 : month + 1
        const nextYear = month === 11 ? year + 1 : year
        nextMeeting = getThursdayOfWeek(nextYear, nextMonth, 1)
      }

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }
      const formattedDate = nextMeeting.toLocaleDateString("ko-KR", options)
      setNextMeetingDate(`${formattedDate} 오후 7시`)
    }

    calculateNextMeeting()

    const getStoredMemberCount = () => {
      try {
        const savedMembers = localStorage.getItem("rotary-members")
        if (savedMembers) {
          const parsedMembers = JSON.parse(savedMembers)
          if (Array.isArray(parsedMembers)) {
            return parsedMembers.length
          }
        }
        return getMemberCount()
      } catch (error) {
        return getMemberCount()
      }
    }

    const memberCount = getStoredMemberCount()
    setCurrentMemberCount(memberCount)

    const handleStorageChange = () => {
      const updatedCount = getStoredMemberCount()
      setCurrentMemberCount(updatedCount)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <div>
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">클럽소개</h1>

        <Tabs defaultValue="status" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">클럽현황</TabsTrigger>
            <TabsTrigger value="info">클럽정보</TabsTrigger>
            <TabsTrigger value="clubhouse">클럽회관</TabsTrigger>
            <TabsTrigger value="history">클럽 연혁</TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>클럽현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">창립</span>
                      <span>2005년 1월 20일</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">회원</span>
                      <span>{currentMemberCount}명</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">지구</span>
                      <span>국제로타리3630지구</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">지역</span>
                      <span>경주시</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">정기모임</span>
                      <span className="text-sm">매월 첫째, 셋째주 목요일 오후 7시</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">장소</span>
                      <span>본 클럽 회관</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">이사회</span>
                      <span>매월 넷째주 목요일</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">다음 모임</span>
                      <span className="text-sm">{nextMeetingDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>창립정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">창립일</h3>
                        <p className="text-lg font-medium">2005년 1월 20일</p>
                        <p className="text-sm text-muted-foreground">경주 힐튼호텔에서 창립총회 개최</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">스폰서 클럽</h3>
                        <p className="text-lg font-medium">경주선덕로타리클럽</p>
                        <p className="text-sm text-muted-foreground">창립을 후원한 모클럽</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">초대 회장</h3>
                        <p className="text-lg font-medium">이암 최병준</p>
                        <p className="text-sm text-muted-foreground">李殷 최炳俊 (2005년)</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">창립 회원수</h3>
                        <p className="text-lg font-medium">창립 1주년 시 101명</p>
                        <p className="text-sm text-muted-foreground">2006년 1월 20일 기준</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">창립 의의</h3>
                    <p className="text-sm">
                      경주중앙로타리클럽은 2005년 1월 20일 경주선덕로타리클럽의 스폰서로 창립되어, 경주 지역의
                      봉사활동과 국제친선을 위한 새로운 장을 열었습니다. 창립 이후 지속적인 성장을 통해 현재 68명의
                      회원이 활동하고 있으며, 지역사회 발전과 국제 로타리의 이상 실현을 위해 노력하고 있습니다.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>로타리의 목적</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    로타리의 목적은 의미 있는 사업과 전문직업의 기초가 되는 봉사 이상을 장려하고 육성하는 데 있으며,
                    구체적으로는 다음과 같다:
                  </p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>봉사의 기회로서 친목과 상호부조의 발전을 도모한다.</li>
                    <li>
                      사업과 전문직업에 있어서 높은 윤리적 표준을 장려하고, 모든 유용한 업무의 존엄성을 인식하며, 각자의
                      직업을 통하여 사회에 봉사하는 로타리안의 가치를 높인다.
                    </li>
                    <li>모든 로타리안이 개인생활, 사업생활 및 사회생활에 있어서 봉사 이상을 적용하도록 장려한다.</li>
                    <li>
                      봉사 이상으로 결합된 사업인과 전문직업인의 세계적 친목을 통하여 국제간의 이해와 친선과 평화를
                      증진한다.
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>로타리의 핵심가치</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-primary mb-2">봉사 (Service)</h3>
                      <p className="text-sm">우리의 직업적 기술과 에너지를 인류를 위해 사용합니다.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-primary mb-2">친목 (Fellowship)</h3>
                      <p className="text-sm">다양성 속에서 지속적인 우정을 만들어 갑니다.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-primary mb-2">다양성 (Diversity)</h3>
                      <p className="text-sm">우리의 차이점을 소중히 여기고 포용합니다.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-primary mb-2">고결성 (Integrity)</h3>
                      <p className="text-sm">정직하고 공정하며 윤리적으로 행동합니다.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-primary mb-2">리더십 (Leadership)</h3>
                      <p className="text-sm">긍정적인 변화를 이끌어내는 리더가 됩니다.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>네가지 표준</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">우리가 생각하고 말하고 행동하는 모든 것에 대하여:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>진실한가?</li>
                    <li>모든 관련자에게 공정한가?</li>
                    <li>선의와 우정을 증진하는가?</li>
                    <li>모든 관련자에게 유익한가?</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clubhouse">
            <Card>
              <CardHeader>
                <CardTitle>경주중앙로타리클럽 회관</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/2">
                      <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden border">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KakaoTalk_20250823_174449340.jpg-r53eGeCN5qIDRf5cctlVXcqw2fnVHV.jpeg"
                          alt="경주중앙로타리클럽 회관 건물"
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                          <p className="text-sm font-medium">경주중앙로타리클럽 회관 (4층)</p>
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-1/2 space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3">회관 정보</h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-muted rounded-lg">
                            <span className="text-sm text-muted-foreground block">주소</span>
                            <span className="font-medium">경주시 승삼1길 5-5, 4층(용강동)</span>
                            <span className="text-xs text-muted-foreground block mt-1">
                              5-5, Seungsam 1-gil, Yonggang-dong, Gyeongju-si
                            </span>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <span className="text-sm text-muted-foreground block">우편번호</span>
                            <span className="font-medium">38090</span>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <span className="text-sm text-muted-foreground block">용도</span>
                            <span className="font-medium">정기모임, 이사회, 각종 행사</span>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <span className="text-sm text-muted-foreground block">수용인원</span>
                            <span className="font-medium">약 100명</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-3">연락처 정보</h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-muted rounded-lg">
                            <span className="text-sm text-muted-foreground block">전화번호</span>
                            <span className="font-medium">054-773-7676</span>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <span className="text-sm text-muted-foreground block">팩스</span>
                            <span className="font-medium">054-773-7673</span>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <span className="text-sm text-muted-foreground block">이메일</span>
                            <span className="font-medium">ceo6141@gmail.com</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>경주중앙로타리클럽 연혁</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {historyByYear.map((yearData) => (
                    <div key={yearData.year} className={`border-l-4 ${yearData.color} pl-4`}>
                      <h3 className={`font-bold text-lg ${yearData.textColor} mb-2`}>{yearData.year}</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {yearData.events.map((event, index) => (
                          <li key={index}>{event}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
