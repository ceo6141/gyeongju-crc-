"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit, Crown, History, Building2, Users } from "lucide-react"
import Image from "next/image"
import { getMemberCount } from "@/lib/members-data"
import { Navigation } from "@/components/navigation"

interface ClubContact {
  address: string
  phone: string
  fax: string
  email: string
  postalCode: string
}

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
  const [clubContact, setClubContact] = useState<ClubContact>({
    address: "경주시 승삼1길 5-5, 4층(용강동)",
    phone: "054-773-7676",
    fax: "054-773-7673",
    email: "ceo6141@gmail.com",
    postalCode: "우편번호(ZIP CODE) : 38090",
  })
  const [isEditingContact, setIsEditingContact] = useState(false)
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
        // Fallback to static data if localStorage is empty
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

  const handleContactEdit = () => {
    setIsEditingContact(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="text-center py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">경주중앙로타리클럽</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              1905년 시카고에서 시작된 로타리는 전 세계 200여 개국에서 120만 명의 회원이 활동하는 국제적인
              봉사단체입니다. 경주중앙로타리클럽은 지역사회 발전과 국제친선을 위해 노력하고 있습니다.
            </p>
          </section>

          {/* President's Message */}
          <section className="py-16 bg-gray-50 rounded-lg">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">회장 인사말</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KakaoTalk_20250604_152409666.jpg-ifeMFXyH5GS3y4HqwvH5ED17TXkHQf.jpeg"
                    alt="경주중앙로타리클럽 회장"
                    width={160}
                    height={160}
                    className="rounded-full shadow-lg"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-lg leading-relaxed mb-4">
                    안녕하십니까!! 경주중앙로타리클럽 제22대 회장 천상(天翔) 최용환입니다.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    로타리는 '봉사하는 마음'으로 시작되어 전 세계적으로 확산된 인류애 실천 단체입니다. 우리
                    경주중앙로타리클럽은 2005년 창립 이래 지역사회 발전과 국제친선을 위해 꾸준히 노력해왔습니다.
                  </p>
                  <p className="text-lg leading-relaxed">
                    앞으로도 '봉사하는 삶'의 가치를 실현하며, 더 나은 세상을 만들어가는 데 최선을 다하겠습니다. 많은
                    관심과 성원 부탁드립니다.
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold">경주중앙로타리클럽 제22대 회장</p>
                    <p className="text-xl font-bold text-primary">천상 天翔 최용환</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 창립정보와 클럽 발전사 */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 창립정보 */}
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-6 text-primary">창립정보</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">창립일:</span>
                      <span className="text-lg font-semibold">2005년 1월 20일</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">창립장소:</span>
                      <span>경주 힐튼호텔</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">스폰서클럽:</span>
                      <span>경주선덕로타리클럽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">초대회장:</span>
                      <span>이암 최병준</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">창립회원:</span>
                      <span>61명</span>
                    </div>
                  </div>
                </Card>

                {/* 클럽 발전사 */}
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-6 text-primary">클럽 발전사</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">창립 20주년:</span>
                      <span className="text-lg font-semibold">2025년</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">현재 회원수:</span>
                      <span className="text-lg font-semibold text-primary">{currentMemberCount}명</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">역대 회장:</span>
                      <span>22명</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">자매클럽:</span>
                      <span>3개 클럽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">주요 봉사:</span>
                      <span>100여 건</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Club Information */}
          <section className="py-16 bg-gray-50 rounded-lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">클럽 정보</h2>

              {/* Club Info Cards Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Club Information */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">클럽 정보</h3>
                    <span className="text-xs text-muted-foreground">(2025-26년도)</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">현 회장:</span>
                      <span>천상 天翔 최용환 (제22대)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">직전회장:</span>
                      <span>천관 김용현</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">차기회장:</span>
                      <span>미정</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">부회장:</span>
                      <span>허동욱, 최태복</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">총무:</span>
                      <span>호헌 박재열</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">재무:</span>
                      <span>우함 손인익</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">부총무:</span>
                      <span>문시영, 김원기</span>
                    </div>
                  </div>
                </Card>

                {/* Club Details */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">클럽 현황</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">창립:</span>
                      <span>2005년 1월 20일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">회원:</span>
                      <span>{currentMemberCount}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">지구:</span>
                      <span>국제로타리3630지구</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">지역:</span>
                      <span>경주시</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">정기모임:</span>
                      <span className="text-xs">{nextMeetingDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">클럽회관:</span>
                      <span className="text-xs">경주중앙로타리클럽 회관</span>
                    </div>
                  </div>
                </Card>

                {/* Contact Information */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Edit className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-bold">연락처</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">GYEONGJU CENTRAL ROTARY CLUB:</span>
                      <div className="mt-1">경주중앙로타리클럽</div>
                    </div>
                    <div>
                      <span className="font-medium">ADDRESS:</span>
                      <div className="mt-1">
                        경주시 승삼1길 5-5, 4층(용강동)
                        <br />
                        <span className="text-xs text-muted-foreground">
                          5-5, Seungsam 1-gil, Yonggang-dong, Gyeongju-si, Gyeongsangbuk-do, Republic of Korea
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">TEL:</span> {clubContact.phone}
                    </div>
                    <div>
                      <span className="font-medium">FAX:</span> {clubContact.fax}
                    </div>
                    <div>
                      <span className="font-medium">E-MAIL:</span> ceo6141@gmail.com
                    </div>
                    <div>
                      <span className="font-medium">우편번호(ZIP CODE) :</span> 38090
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingContact(true)}
                    className="w-full mt-3 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    연락처 수정
                  </Button>
                </Card>
              </div>

              {/* Photos Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Club Building Photo */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-center">클럽 회관</h4>
                  <div className="relative h-[240px] max-w-[320px] mx-auto">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KakaoTalk_20250823_174449340.jpg-puIILbLwSWvbEvXvsSuGAJoBAYO08v.jpeg"
                      alt="경주중앙로타리클럽 회관"
                      fill
                      className="object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                {/* Group Photo */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-center">단체 사진</h4>
                  <div className="relative h-[240px] max-w-[400px] mx-auto">
                    <Image
                      src="/images/club-photo.png"
                      alt="제 21대 22대 회장단 이취임식"
                      fill
                      className="object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Club History and Presidents */}
          <section className="py-16 bg-gray-50 rounded-lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">클럽 소개</h2>

              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    클럽 연혁
                  </TabsTrigger>
                  <TabsTrigger value="presidents" className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    역대 회장
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-primary">경주중앙로타리클럽 연혁</h3>
                    <p className="text-lg text-muted-foreground">
                      2005년 창립 이래 지역사회 발전과 국제친선을 위해 꾸준히 활동해온 우리 클럽의 발자취입니다.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {historyByYear.map((yearData, index) => (
                      <div
                        key={index}
                        className={`border-l-4 ${yearData.color} pl-6 bg-white p-6 rounded-lg shadow-sm`}
                      >
                        <h4 className={`text-xl font-bold ${yearData.textColor} mb-4`}>{yearData.year}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {yearData.events.map((event, eventIndex) => (
                            <div key={eventIndex} className="text-sm">
                              • {event}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="presidents" className="space-y-6">
                  <div className="text-center mb-8">
                    <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-4 text-primary">역대 회장</h3>
                    <p className="text-lg text-muted-foreground">
                      경주중앙로타리클럽을 이끌어온 역대 회장님들을 소개합니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {presidents.map((president, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow bg-white">
                        <div className="text-center p-6">
                          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary/20 bg-gray-100 flex items-center justify-center">
                            <Crown className="h-8 w-8 text-primary/60" />
                          </div>
                          <Badge variant="outline" className="mb-2">
                            {president.term}
                          </Badge>
                          <h4 className="text-lg font-semibold">{president.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{president.nameHanja}</p>
                          <p className="text-sm font-medium text-primary">{president.period}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* What is Rotary Club */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">로타리 클럽이란?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">로타리의 역사</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    1905년 2월 23일 미국 시카고에서 폴 해리스(Paul Harris)에 의해 창설된 로타리는 세계 최초의
                    봉사클럽입니다. 현재 전 세계 200여 개국에 35,000여 개 클럽, 120만 명의 회원이 활동하고 있습니다.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">로타리의 목적</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    로타리는 봉사의 이상을 장려하고 육성하며, 특히 직업을 통한 봉사의 이상을 장려합니다. 높은 윤리적
                    기준을 바탕으로 한 직업인들의 친목을 도모하고, 세계 이해와 친선 및 평화를 증진시키는 것을 목적으로
                    합니다.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">4대 봉사 분야</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• 클럽 봉사 (Club Service)</li>
                    <li>• 직업 봉사 (Vocational Service)</li>
                    <li>• 사회 봉사 (Community Service)</li>
                    <li>• 국제 봉사 (International Service)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">로타리 모토</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    "Service Above Self" (초아봉사)
                    <br />
                    자신보다 남을 먼저 생각하는 봉사정신을 바탕으로 더 나은 세상을 만들어가고 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Contact Edit Dialog */}
      <Dialog open={isEditingContact} onOpenChange={setIsEditingContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>연락처 정보 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">주소</label>
              <Input
                value={clubContact.address}
                onChange={(e) => setClubContact({ ...clubContact, address: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">전화번호</label>
              <Input
                value={clubContact.phone}
                onChange={(e) => setClubContact({ ...clubContact, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">팩스</label>
              <Input
                value={clubContact.fax}
                onChange={(e) => setClubContact({ ...clubContact, fax: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">이메일</label>
              <Input
                value={clubContact.email || "ceo6141@gmail.com"}
                onChange={(e) => setClubContact({ ...clubContact, email: e.target.value })}
                placeholder="이메일 주소를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">우편번호(ZIP CODE)</label>
              <Input
                value={clubContact.postalCode}
                onChange={(e) => setClubContact({ ...clubContact, postalCode: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleContactEdit} className="flex-1">
                저장
              </Button>
              <Button variant="outline" onClick={() => setIsEditingContact(false)} className="flex-1">
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
