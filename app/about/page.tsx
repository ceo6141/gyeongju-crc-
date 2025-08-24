"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit } from "lucide-react"
import Image from "next/image"

interface ClubContact {
  address: string
  phone: string
  fax: string
  email: string
  postalCode: string
}

export default function AboutPage() {
  const [nextMeetingDate, setNextMeetingDate] = useState<string>("")
  const [clubContact, setClubContact] = useState<ClubContact>({
    address: "경주시 승삼1길 5-5, 4층(용강동)",
    phone: "054-773-7676",
    fax: "054-773-7673",
    email: "",
    postalCode: "38090",
  })
  const [isEditingContact, setIsEditingContact] = useState(false)

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
  }, [])

  const handleContactEdit = () => {
    setIsEditingContact(false)
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">경주중앙로타리클럽</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            1905년 시카고에서 시작된 로타리는 전 세계 200여 개국에서 120만 명의 회원이 활동하는 국제적인 봉사단체입니다.
            경주중앙로타리클럽은 지역사회 발전과 국제친선을 위해 노력하고 있습니다.
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
                  안녕하십니까. 경주중앙로타리클럽 제22대 회장 최용환입니다.
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
                  <p className="text-xl font-bold text-primary">천상 최용환</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Club Photo and Info Section */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Club Information */}
            <div className="lg:col-span-1">
              <Card className="p-3 h-full flex flex-col">
                <h3 className="text-lg font-bold mb-3 text-center">
                  클럽 정보 <span className="text-xs text-muted-foreground">(2025-26년도)</span>
                </h3>
                <div className="space-y-1.5 flex-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">현 회장:</span>
                    <span>천상 최용환 (제22대)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">직전회장:</span>
                    <span>천관 김용현</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">차기회장:</span>
                    <span>미정</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">부회장:</span>
                    <span>허동욱, 최태복</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">총무:</span>
                    <span>호헌 박재열</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">재무:</span>
                    <span>우함 손인익</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">부총무:</span>
                    <span>문시영, 김원기</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">창립:</span>
                    <span>2005년 1월 20일</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">회원:</span>
                    <span>68명</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">지구:</span>
                    <span>국제로타리3630지구</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">지역:</span>
                    <span>경주시</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">정기모임:</span>
                    <span className="text-xs">{nextMeetingDate}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">클럽회관:</span>
                    <span className="text-xs">경주중앙로타리클럽 회관</span>
                  </div>

                  <hr className="my-1.5" />

                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="font-medium">ADDRESS:</span>
                      <div className="mt-0.5">
                        경주시 승삼1길 5-5, 4층(용강동)
                        <br />
                        EN) 5-5, Seungsam 1-gil, Gyeongju-si
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">TEL:</span> {clubContact.phone}
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">FAX:</span> {clubContact.fax}
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">E-MAIL:</span> 입력 예정
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">ZIP CODE:</span> {clubContact.postalCode}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingContact(true)}
                    className="w-full mt-1.5 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    연락처 수정
                  </Button>
                </div>
              </Card>
            </div>

            {/* Club Building Photos - Vertical Stack */}
            <div className="lg:col-span-1 space-y-4">
              {/* Club Building Photo */}
              <div className="relative h-[400px]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KakaoTalk_20250823_174449340.jpg-puIILbLwSWvbEvXvsSuGAJoBAYO08v.jpeg"
                  alt="경주중앙로타리클럽 회관"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Group Photo - Full Width Below */}
          <div className="mt-8">
            <div className="relative h-[300px] w-full">
              <Image
                src="/images/club-photo.png"
                alt="제 21대 22대 회장단 이취임식"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
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

        {/* Club History Section */}
        <section className="py-16 bg-gray-50 rounded-lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">클럽 연혁</h2>
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-primary">경주중앙로타리클럽</h3>
                <p className="text-lg text-muted-foreground">
                  2005년 창립 이래 지역사회 발전과 국제친선을 위해 꾸준히 활동해온 우리 클럽의 발자취입니다.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-6 text-primary">상세 연혁</h4>
                <div className="space-y-6">
                  {/* 2005년 */}
                  <div className="border-l-4 border-primary pl-6">
                    <h5 className="text-lg font-bold text-primary mb-3">2005년 (창립년도)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 20일: 창립총회 (경주선덕로타리클럽 스폰서, 경주황룡호텔)</div>
                      <div>• 2월 25일: 국제로타리 100주년 기념상징물 제막식 참여</div>
                      <div>• 5월 09일: 전동차 기증식 (용강동 동사무소)</div>
                      <div>• 7월 06일: 국제로타리 3670지구 이리중앙로타리클럽과 자매결연</div>
                      <div>• 8월 10일: 국제로타리 3300지구 말레이시아 Banda-sunway 로타리클럽과의 자매결연</div>
                      <div>• 9월 23일: 여승인 인증서 전달식 (월드웰컴뷔페)</div>
                      <div>• 10월 05일: 경주정보고등학교 인터랙트클럽 창립 (회원 20명)</div>
                      <div>• 10월 18일: 경주용강초등학교 리틀랙트클럽 창립 (회원 34명)</div>
                      <div>• 10월 26일: 골프회 발족</div>
                      <div>• 12월 09일: 부인회 발족</div>
                      <div>• 12월 11일: 동산회 발족</div>
                      <div>• 12월 28일: 연말 불우이웃돕기 행사</div>
                    </div>
                  </div>

                  {/* 2006년 */}
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h5 className="text-lg font-bold text-blue-600 mb-3">2006년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 20일: 창립 1주년 기념식 (회원 101명)</div>
                      <div>• 2월 18일: 자매마을 결연 (경주시 건천읍 신평2리 가천마을)</div>
                      <div>• 3월 25일: "사랑의 김치기" 준공 (건천읍 신평2리)</div>
                      <div>• 4월 23일: 3630지구 최우수클럽상 수상 (지구대회)</div>
                      <div>• 5월 03일: 자매마을 쌀포살치 (신평2리 가천마을)</div>
                      <div>• 5월 20일: 3630지구 지구협의회 참가 (회원 21명, 포항1대회)</div>
                      <div>• 6월 16일: 제3대 명덕 최회상 회장 취임 (경주황룡호텔)</div>
                      <div>• 8월 10일: 교환학생 파견 (국제로타리 3300지구 말레이시아)</div>
                      <div>• 11월 05일: 자매마을 영정사진 제작 및 한방진료, 이미용 봉사활동</div>
                      <div>• 12월 11일: 축구회 발족 (회원25명)</div>
                      <div>• 12월 28일: 교환학생 방한 (국제로타리3300지구 말레이시아)</div>
                    </div>
                  </div>

                  {/* 2007년 */}
                  <div className="border-l-4 border-green-500 pl-6">
                    <h5 className="text-lg font-bold text-green-600 mb-3">2007년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 3월 01일~04일: 국제로타리 3300지구 말레이시아 반다썬웨이로타리클럽 초청 방문</div>
                      <div>• 6월 19일: 제4대 양정 이상익 회장 취임 (월드웰컴뷔페)</div>
                      <div>• 7월 28일: 용강리틀랙트클럽 지식연수회 및 활성화지원 발전소 견학</div>
                      <div>• 10월 21일~28일: 나눔의 손길로 삼척을 위한 대장정 참가</div>
                      <div>• 11월 04일: 자매클럽과 부부합동 중반 주회 (무주 덕유산)</div>
                    </div>
                  </div>

                  {/* 2008년 */}
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h5 className="text-lg font-bold text-yellow-600 mb-3">2008년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 3월 23일: 건천읍 신평리 자매마을 봉사활동 (한방진료, 이미용 봉사, 독거노인 지원 등)</div>
                      <div>• 4월 27일: GSE단원 본클럽 방문 (라트비아 시범 및 간담회)</div>
                      <div>• 6월 27일: 제5대 수수 김병수 회장 취임 (월드웰컴뷔페)</div>
                      <div>• 9월 03일: 한국로타리의 날 행사 참가</div>
                      <div>• 9월 27일: 자매클럽과 부부합동 중반 주회 (경주 남산)</div>
                    </div>
                  </div>

                  {/* 2009년 */}
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h5 className="text-lg font-bold text-purple-600 mb-3">2009년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 04일: 연차총회 개최</div>
                      <div>• 1월 22일: 스폰서 클럽과 합동주회 (경주선덕RC)</div>
                      <div>• 6월 26일: 제6대 금파 윤태조 회장 취임 (포시즌 유스호스텔)</div>
                      <div>• 8월 07일: 나눔의 봉사활동 (안양지 연령단지 작은 음악회 개최)</div>
                      <div>• 8월 14일: 신평창성주회활동</div>
                      <div>• 9월 17일: 경주 중앙기반건 개최 성명회 개최</div>
                      <div>• 10월 01일: 강동면 양남면 해안 정어 (국도7호 외동-용산 경계)</div>
                      <div>• 11월 01일: 간전 5주년 기념식, 강남구 전명, 아르리카 게나 코인 무료 급식사업 및 우간다</div>
                      <div>• 11월 21일: 포항시 기계면 하이미 물창치 운전 수상 (서울구 하이미)</div>
                      <div>• 11월 29일: 사회복지시설 에티컴터 화목용 장작 1톤과 물품전달, 김장김치 봉사</div>
                    </div>
                  </div>

                  {/* 2010년 */}
                  <div className="border-l-4 border-red-500 pl-6">
                    <h5 className="text-lg font-bold text-red-600 mb-3">2010년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 05일: 자매결연지 에티컴터 화목용 장작 1톤 지원 및 봉사활동 전달</div>
                      <div>• 1월 21일: 창립 5주년 기념식, 강남구 전명, 아르리카 게나 코인 무료 급식사업 및 우간다</div>
                      <div>• 2월 05일: 자매결연지 에티컴터 화목용 장작 1톤 지원 및 봉사활동</div>
                      <div>• 2월 12일: 건천 신평2리 자매마을 다문화 37명과 불우이웃 27명 성전전달 및 봉사활동</div>
                      <div>• 3월 08일: 자매마을 신평2에 전동휠체어 전달 (건천 신평2리)</div>
                      <div>• 3월 10일: 자매결연지 에티컴터 시력 기증 및 화목용 장작 1톤 전달</div>
                      <div>• 3월 12일: 제21회 전국 주보로타리스 편집부로 은상 수상</div>
                      <div>• 3월 20일: 자매클럽과 이리중앙로타리클럽과 부부합동 중반주회 및 자연정화 활동</div>
                      <div>• 3월 26일: 자매결연 에티컴터 화목용 장작 1톤 전달 및 봉사활동</div>
                      <div>• 3월 30일: 사회복지시설 나재원 자매결연 및 봉사활동 전달</div>
                      <div>• 4월 13일: 사회복지에 대한 방안과 역할 특강 개최 (최성대 박사, 조선 교수)</div>
                      <div>• 5월 01일: 3630지구대회 수상 (모범 클럽상, 회원증강 이름다운 세상만들기 공로상,</div>
                      <div>• 7월 02일: 제7대 자유 이승협 회장 취임 (경주현대호텔)</div>
                      <div>• 7월 16일: 사회복지시설 에티컴터에 화목용 장작전달</div>
                      <div>• 8월 06일: 사랑의 집짓기 참여 (경주시 동방동 다문화 가정)</div>
                      <div>• 10월 13일: 인터랙트클럽 조기 전달 (경주정보고등학교)</div>
                      <div>• 10월 23일: 다문화 가정에서 봉사 아우주회 (경주시 동방동)</div>
                      <div>• 10월 24일: 신라역사체험 사전대회에 인터랙트, 회원 환경정화활동 및 안내</div>
                      <div>• 11월 11일: 다문화 가정 중국 (경주시 동방동)</div>
                      <div>• 11월 20일: 자매클럽과 이리중앙로타리클럽과 부부합동주회 (옥산서원 새산마을)</div>
                      <div>• 11월 29일: 사회복지시설 에티컴터 자매결연 (재해결)</div>
                      <div>• 12월 10일: 사회복지시설 에티컴터에 김장 400포기 및 화목용 장작, 봉사금 전달</div>
                    </div>
                  </div>

                  {/* 2011년 */}
                  <div className="border-l-4 border-indigo-500 pl-6">
                    <h5 className="text-lg font-bold text-indigo-600 mb-3">2011년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 21일: 사회복지시설 에티컴터에 화목용 장작 전달</div>
                      <div>• 1월 30일: 동한산 사산제 및 자연정화 활동</div>
                      <div>• 2월 18일: 스폰서 클럽인 경주선덕로타리클럽과 합동 및 직장주회 (간신원우)</div>
                      <div>• 2월 23일: 3630지구 총재 소아마비 박멸 홍보 특별 참석</div>
                      <div>• 2월 28일: 사회복지시설 에티컴터 화목용 장작 전달(보호)</div>
                      <div>• 3월 15일: 자매마을 건천 신평리 자매마을 의료보조기 10대 전달</div>
                      <div>• 3월 27일: 남산산행 후 자연정화 활동</div>
                      <div>
                        • 4월 30일: 3630지구 로타리재단 기여 우수클럽상, 홍보상, 모범클럽상 수상 (김천실내체육관)
                      </div>
                      <div>• 6월 14일: 인터랙트클럽 조기 전달 (경주정보고등학교)</div>
                      <div>• 6월 16일: 제8대 동연 이창희 회장 취임 (월드웰컴뷔페)</div>
                      <div>• 6월 30일: 불우이웃돕기 쌀 전달 (경주시장애인협회, 에티컴터)</div>
                    </div>
                  </div>

                  {/* 2012년 */}
                  <div className="border-l-4 border-pink-500 pl-6">
                    <h5 className="text-lg font-bold text-pink-600 mb-3">2012년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 18일: 사회복지시설 에티컴터 자매결연지 및 화목용 장작 전달</div>
                      <div>• 2월 02일: 스폰서 클럽 경주선덕로타리클럽과 합동주회 (간신원우)</div>
                      <div>• 2월 16일: 현명 봉사활동 (경주역 광장)</div>
                      <div>• 3월 06일: 경주시 자원봉사단체장 워크숍 참석 (경주교육청회의실)</div>
                      <div>• 3월 18일: 자매마을 건천읍 신평리 한방진료 및 이미용, 무료급식 봉사활동</div>
                      <div>• 4월 28일: 3630지구 우수클럽상, 홍보상, 한국로타리감사원 기여 표창,</div>
                      <div>• 5월 5일~9일: 제103차 2012 한국 국제대회 참가 (2011~12 제인지메이어 RI 표창 수상)</div>
                      <div>• 6월 21일: 제9대 운재 서상호 회장 취임 (월드웰컴뷔페)</div>
                      <div>• 6월 30일: 2011~12년도 R년차 표창 수상</div>
                      <div>• 7월 04일: 신내면 (사)남경자연이 사랑의 생필품 전달</div>
                      <div>• 7월 05일: 부부합동 간친중회 개최 (경주시 주민건강지원센터)</div>
                      <div>• 8월 10일: 2012 화랑대기 전국초등학교 유소년 축구대회 지원 (자매결연 경남 남해</div>
                      <div>• 8월 16일: 울산 적십자 혈액원과 합께 부부합동 헌혈주회 (경주역 광장)</div>
                      <div>• 10월 10일: 인터랙트클럽 지원금 전달 (경주정보고등학교)</div>
                      <div>• 11월 17일: 국내자매클럽과 이리중앙로타리클럽과 합동부부주회</div>
                    </div>
                  </div>

                  {/* 2013년 */}
                  <div className="border-l-4 border-teal-500 pl-6">
                    <h5 className="text-lg font-bold text-teal-600 mb-3">2013년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 17일: 창립 8주년 기념식 및 부부합동 선물교환 주회 (월드웰컴뷔페)</div>
                      <div>• 1월 22일: 국제로타리 3630지구 필리핀 세부레스로타리클럽과 자매결연 (필리핀)</div>
                      <div>• 2월 13일: 경주한국로타리클럽, 경주한국로타리클럽과 합동주회 (강신원우)</div>
                      <div>• 2월 13일: 리틀랙트클럽 장학금 전달 (용강초등학교 졸업식)</div>
                      <div>• 2월 23일: 물리요 기금마련 걸기대회 참가 (동악산)</div>
                      <div>• 3월 17일: 자매마을 가천마을 한방진료, 이·미용 봉사, 마을 환경정화와</div>
                      <div>
                        • 3월 23일~28일: 국제자매클럽과 국제로타리 3630지구 필리핀 세부레스로타리클럽과 자매결연
                      </div>
                      <div>• 4월 27일: 3630지구 회원증강 표창, 로타리재단 기여 표창, 제24회 전국클럽주보콘테스트</div>
                      <div>• 5월 21일: 스폰서 클럽인 경주선덕로타리클럽과 천성프로젝트 (경주신라펜션로타리클럽)</div>
                      <div>• 6월 20일: 제10대 심원 박문상 회장 취임 (월드웰컴뷔페)</div>
                      <div>• 6월 20일: 사랑의 쌀 나누기 (에티컴터 12포 전달)</div>
                      <div>• 6월 25일: 사랑의 쌀 나누기 (건천읍, 충효동, 황남동 독거노인 및 기초생활수급자</div>
                      <div>• 6월 30일: 2012~13년도 RI 회장 표창 수상</div>
                      <div>• 7월 03일: 사랑의 쌀 나누기 (장전동 다문화가정 및 기초생활수급자 47명 각 2포씩 전달)</div>
                    </div>
                  </div>

                  {/* 2014년 */}
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h5 className="text-lg font-bold text-orange-600 mb-3">2014년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 15일: 경주시로부터 봉사활동유공 표창 수상</div>
                      <div>• 1월 17일: 에티컴터 생필품 전달 및 화목 만들기 봉사</div>
                      <div>• 2월 15일: 글로벌 보조금 사업 승인(GG1414012)</div>
                      <div>• 2월 20일: 리틀랙트클럽 장학금 전달 (용강초등학교)</div>
                      <div>• 2월 21일: 스폰서 클럽 경주선덕로타리클럽과 합동주회 (보문한우)</div>
                      <div>• 3월 01일: 3월 정기총회 (보문한우)</div>
                      <div>• 3월 06일: 제25회 전국 클럽 주보 콘테스트 대상 수상(로타리 코리아)</div>
                      <div>• 3월 16일: 자매마을 건천읍 신평2리(가천마을) 한방진료, 이·미용봉사, 기념식</div>
                      <div>• 4월 01일: 로타리코리아 표 4월호 - 주보콘테스트 대상 수상 소감문 및 클럽활동 게재</div>
                      <div>• 4월 26일: 에티컴터 화목용 장작 - 물리핀 세부지역 클럽활동 및 자연봉사 지원</div>
                      <div>• 5월 10일: 3630지구 우수 클럽상, 로타리재단 기여 우수 표창, 봉사파트너 확대 표창</div>
                      <div>• 5월 15일: 2013-14년 지구보조금사업(6.7지역 시리아봉사시설 김장봉사 400포기 지원)</div>
                      <div>
                        • 6월 8일~13일: 글로벌 보조금 (GG1414012) 프로젝트 실시 - 필리핀 세부지역 클럽활동 설치사업
                      </div>
                      <div>• 6월 19일: 제11대 중원 황병욱 회장 취임 (월드웰컴뷔페)</div>
                      <div>• 6월 24일: 사랑의 쌀 나누기 (성건동 다문화가정 - 30Kg, 급식봉)</div>
                      <div>• 6월 30일: 2013-14 RI 회장 표창(매년 패널 매치기 - 30Kg, 급식봉)</div>
                      <div>• 7월 01일: 사랑의 쌀 나누기 (성건동 소재 경주시 종합사회복지관 250Kg)</div>
                      <div>• 7월 12일: 존 9, 10A 로타리협의회 참가 (경북대 대강당)</div>
                      <div>• 8월 06일: 경주정보고등학교 인터랙트 클럽 RI 승인</div>
                      <div>• 8월 28일: 사랑의 쌀 나누기 (자매결연 사회복지시설 에티컴터 300kg,</div>
                      <div>• 10월 16일: 인터랙트클럽 지원금 전달 (경주정보고등학교)</div>
                      <div>• 11월 15일: 자매클럽과 이리중앙로타리클럽과 부부합동주회 (누리마루)</div>
                      <div>• 12월 22일: 옥교 제50사단 한방대와 자매결연 (옥교 옥교 제50사단)</div>
                      <div>• 12월 28일: 창립 10주년 기념 조정물(파고라) 준공 (노서공원)</div>
                    </div>
                  </div>

                  {/* 2015년 */}
                  <div className="border-l-4 border-cyan-500 pl-6">
                    <h5 className="text-lg font-bold text-cyan-600 mb-3">2015년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 20일: 창립 10주년 기념식 (월드웰컴뷔페)</div>
                      <div>
                        • 1월 20일: 자매결연지 사회복지시설 에티컴터 봉사 (생필품 50만원 상당, 화목용 장작 전달)
                      </div>
                      <div>• 2월 7일~10일: 3630지구 7지역의 필리핀 컴퓨터 지원 사업 참가</div>
                      <div>• 2월 12일: 로타랙트클럽 지원금 전달 (위덕대학교)</div>
                      <div>• 2월 16일: 리틀랙트클럽 장학금 전달 (용강초등학교)</div>
                      <div>• 4월 25일: 3630지구 로타리재단, 로타리재단 기여 표창 (구미 박정희체육관)</div>
                      <div>• 6월 18일: 제12대 회장 승강 권오석 회장 취임 (월드웰컴뷔페)</div>
                      <div>• 7월 27일: 자매결연 사회복지시설 에티컴터 생필품 나눔 봉사 (쌀, 휴지 등)</div>
                      <div>• 8월 07일: 유소년 축구대회 서포터즈 용품 및 격려</div>
                      <div>• 8월 20일: 부부합동 아이영양음악회 (천북 물성소가든)</div>
                      <div>• 8월 22일: 로타리재단 및 보조금 관리 세미나 (천북 물성소가든)</div>
                      <div>• 9월 13일: 지구총회 한마당(황성공원 타임캡슐 공원)</div>
                      <div>• 9월 17일: 경주정보고등학교 인터랙트클럽 장학금 전달</div>
                      <div>• 9월 19일: 신입회원 연수회 (간천읍 대관리)</div>
                      <div>• 10월 07일: 위덕대학교 경주중앙로타랙트클럽 지원금 전달(위덕대학교)</div>
                      <div>• 10월 15일: 충재상실문주회 (영양 한솔촌 총재)</div>
                      <div>• 10월 31일: 6.7지역 로타리세미나 및 체육대회 (축구공원청구장)</div>
                      <div>• 11월 12일: 사랑의 연탄나눔 (지체장애인 57가구, 2,000장)</div>
                      <div>• 11월 14일: 자매클럽과 국제로타리 3670지구 이리중앙로타리클럽과 부부합동 주회</div>
                    </div>
                  </div>

                  {/* 2016년 */}
                  <div className="border-l-4 border-lime-500 pl-6">
                    <h5 className="text-lg font-bold text-lime-600 mb-3">2016년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 07일: 연차총회</div>
                      <div>• 1월 13일: 6.7지역 합동 사랑의 생필품 헌혈봉사 (경주역)</div>
                      <div>• 2월 15일~19일: 7지역 지구보조금 사업 (필리핀 상상 어린이 수술 지원 참가)</div>
                      <div>• 2월 15일: 국제로타리 3670지구 이리중앙로타리클럽 RI 가입인증 및 창립 40주년</div>
                      <div>• 3월 06일: 안강읍 감산리 자매마을 봉사 (식사대접, 무료한방진료,</div>
                      <div>• 3월 26일: 국제로타리 3670지구 2015-16 지구대회 참가 (영천실내체육관)</div>
                      <div>• 3월 30일: 한병창성 68주년 기념식 창석 (옥교 제50사단 한방대)</div>
                      <div>• 4월 30일: 차기회장, 차기총무 연수회 (디케이호텔경주)</div>
                      <div>• 5월 21일: 국제로타리 3630지구 2016-17 지구협의회 참가 (포항대학교)</div>
                      <div>• 6월 02일: 부부합동 아이영양 (대종연어상사)</div>
                      <div>
                        • 6월 10일~14일: 자매클럽과 국제로타리 3860지구 필리핀 세부레스로타리클럽 이·취임식 참석
                      </div>
                    </div>
                  </div>

                  {/* 2017년 */}
                  <div className="border-l-4 border-rose-500 pl-6">
                    <h5 className="text-lg font-bold text-rose-600 mb-3">2017년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 05일: 연차총회</div>
                      <div>• 1월 20일: 창립 12주년 기념 주회(자연에 곤드레 창립반상)</div>
                      <div>• 2월 08일: 50사단 헌병대에 전광판 기증</div>
                      <div>• 2월 13일: 경주선덕RC와 합동주회 옥토이</div>
                      <div>• 3월 02일: 부부합동 영화주회 (메가박스)</div>
                      <div>• 3월 19일: 안강읍 감산리 자매마을 봉사 (식사대접, 무료한방진료,</div>
                      <div>• 4월 05일: 경주정보고등학교 인터랙트클럽 지원금 전달</div>
                      <div>• 4월 22일: 2016-17년 지구대회(모범클럽상, 로타리 재단기여 표창,</div>
                      <div>• 5월 11일: 사업회원 지식연수회(세계셀러드 뷔페)</div>
                      <div>• 5월 20일: 2017-18년 지구연수협의회 참석(경주 동국대학교)</div>
                      <div>• 6월 03일: 2017-18년도 임원 · 이사 워크샵 개최 (센터셀러드뷔페)</div>
                      <div>• 6월 7일~11일: 자매클럽과 국제로타리 3860지구 필리핀 세부레스로타리클럽 이·취임식 참석</div>
                      <div>• 6월 15일: 제13·14대 회장 및 임원 이사 이·취임식 (The-k호텔 경주)</div>
                    </div>
                  </div>

                  {/* 2018년 */}
                  <div className="border-l-4 border-violet-500 pl-6">
                    <h5 className="text-lg font-bold text-violet-600 mb-3">2018년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 04일: 연차총회</div>
                      <div>• 1월 08일: 불우이웃 전기매트, 이불 지원사업 (경주선덕RC와 합동봉사)</div>
                      <div>• 1월 18일: 부부합동 영화주회 (한국전쟁 수련회, 에티컴터)</div>
                      <div>• 1월 24일: 인터랙트클럽 장학금 전달 (용강초등학교)</div>
                      <div>
                        • 1월 25일~30일: 지구보조금 해외봉사 프로젝트 사업 참가 (인도 뉴델리, 남경 윤태열 외 8명)
                      </div>
                      <div>• 2월 02일: 성심 직장 장기모임 (경주선덕RC와 합동)</div>
                      <div>• 2월 07일: 로타리의 날 행사(포항 효자아들)</div>
                      <div>• 2월 08일: 사랑의 헌혈운동(7지역 3개클럽 합동 - 장소: 경주 광장)</div>
                      <div>• 2월 25일: 사랑의 헌혈운동(7지역 3개클럽 합동 - 경주역 광장)</div>
                      <div>• 3월 11일: 경주선덕RC 합동주회 (농봄)</div>
                      <div>• 3월 14일: 사랑의 쌀 나누기 (은혜원 온혜원)</div>
                      <div>• 3월 15일: 카자흐스탄 고려인 병원건지원(청소년보건관)</div>
                      <div>• 3월 24일: 감산마을 봉사활동(이·미용봉사, 식사대접, 환경정화활동 등)</div>
                      <div>• 4월 27일: 2019-20년도 지구대회 표창패, 우수클럽상 수상</div>
                      <div>• 5월 11일: 2019-20년도 지구연수협의회 (동국대학교 문무관)</div>
                      <div>• 5월 16일: 성심 직장 장기모임 (보문한우)</div>
                      <div>• 5월 18일: 2019-20년도 임원 워크샵 (마실리)</div>
                      <div>• 6월 20일: 제15·16대 회장 및 임원 이사 이·취임식 (경주 황룡호텔)</div>
                      <div>• 7월 04일: 클럽회관 장기모임</div>
                      <div>• 7월 06일: 에티컴터 쌀나눔 봉사</div>
                      <div>• 7월 10일~12일: 리일과 수련회(더케이호텔)</div>
                      <div>• 7월 11일: 존11,12로타리 협의회</div>
                      <div>• 7월 13일: 스크린산신 정착 활동</div>
                      <div>• 7월 17일: 모아초등학교 리틀랙트 창단식</div>
                      <div>• 7월 18일: 로타랙트, 인터랙트 지원금 전달</div>
                      <div>• 7월 19일: 부인회 개최 (보문한우)</div>
                      <div>• 7월 25일: 김인준회원 입재발문 (청광도애)</div>
                    </div>
                  </div>

                  {/* 2019년 */}
                  <div className="border-l-4 border-emerald-500 pl-6">
                    <h5 className="text-lg font-bold text-emerald-600 mb-3">2019년</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• 1월 03일: 연차총회 (클럽회관)</div>
                      <div>• 1월 17일: 창립14주년 기념 장기모임 (한식뷔페 경마장)</div>
                      <div>• 1월 21일~24일: 지구보조금 프로젝트봉사(컴퓨터 전달 - 필리핀 마닐라)</div>
                      <div>• 2월 21일: 성심 직장 장기모임(에코클럽센터)</div>
                      <div>• 2월 23일: 로타리의 날 행사(포항 효자아들)</div>
                      <div>• 2월 25일: 사랑의 헌혈운동(7지역 3개클럽 합동 - 경주역 광장)</div>
                      <div>• 3월 11일: 경주선덕RC 합동주회 (농봄)</div>
                      <div>• 3월 14일: 사랑의 쌀 나누기 (은혜원온혜원)</div>
                      <div>• 3월 15일: 카자흐스탄 고려인 병원건지원(청소년보건관)</div>
                      <div>• 3월 24일: 감산마을 봉사활동(이·미용봉사, 식사대접, 환경정화활동 등)</div>
                      <div>• 4월 27일: 2019-20년도 지구대회 (표창패 우수클럽상 수상)</div>
                      <div>• 5월 11일: 2019-20년도 지구연수협의회 (동국대학교 문무관)</div>
                      <div>• 5월 16일: 성심 직장 장기모임 (보문한우)</div>
                      <div>• 5월 18일: 2019-20년도 임원 워크샵 (마실리)</div>
                      <div>• 6월 20일: 제15·16대 회장 및 임원 이사 이·취임식 (경주 황룡호텔)</div>
                      <div>• 7월 04일: 클럽회관 장기모임</div>
                      <div>• 7월 06일: 에티컴터 쌀나눔 봉사</div>
                      <div>• 7월 10일~12일: 리일과 수련회(더케이호텔)</div>
                      <div>• 7월 11일: 존11,12로타리 협의회</div>
                      <div>• 7월 13일: 스크린산신 정착 활동</div>
                      <div>• 7월 17일: 모아초등학교 리틀랙트 창단식</div>
                      <div>• 7월 18일: 로타랙트, 인터랙트 지원금 전달</div>
                      <div>• 7월 19일: 부인회 개최 (보문한우)</div>
                      <div>• 7월 25일: 김인준회원 입재발문 (청광도애)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold mb-4 text-primary">창립 정보</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">창립일:</span>
                      <span>2005년 1월 20일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">초대 회장:</span>
                      <span>최병준 (崔炳俊)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">소속 지구:</span>
                      <span>국제로타리 3630지구</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">현재 회원수:</span>
                      <span>68명 (2025년 기준)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold mb-4 text-primary">클럽 발전사</h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">20년</div>
                      <div className="text-sm text-muted-foreground">창립 이래 지속적인 봉사활동</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">22대</div>
                      <div className="text-sm text-muted-foreground">역대 회장단의 헌신적인 리더십</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">68명</div>
                      <div className="text-sm text-muted-foreground">다양한 직업군의 회원들</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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
                value={clubContact.email}
                onChange={(e) => setClubContact({ ...clubContact, email: e.target.value })}
                placeholder="이메일 주소를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">우편번호</label>
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
