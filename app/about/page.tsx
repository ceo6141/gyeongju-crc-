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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Club Information */}
            <div className="lg:col-span-1">
              <Card className="p-3 h-full flex flex-col">
                <h3 className="text-lg font-bold mb-3 text-center">클럽 정보</h3>
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

            {/* Club Photo */}
            <div className="lg:col-span-2">
              <div className="relative h-[350px]">
                <Image
                  src="/images/club-photo.png"
                  alt="제 21대 22대 회장단 이취임식"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
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
