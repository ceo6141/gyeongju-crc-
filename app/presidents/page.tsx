"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import Image from "next/image"

const presidents = [
  {
    term: "초대",
    period: "2005",
    name: "이암 최병준",
    nameHanja: "崔炳俊",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "2대",
    period: "2005-2006",
    name: "이암 최병준",
    nameHanja: "崔炳俊",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "3대",
    period: "2006-2007",
    name: "최희상",
    nameHanja: "崔熙相",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "4대",
    period: "2007-2008",
    name: "이상익",
    nameHanja: "李相益",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "5대",
    period: "2008-2009",
    name: "김병수",
    nameHanja: "金炳洙",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "6대",
    period: "2009-2010",
    name: "윤태조",
    nameHanja: "尹泰祚",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "7대",
    period: "2010-2011",
    name: "이승협",
    nameHanja: "李承協",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "8대",
    period: "2011-2012",
    name: "이창희",
    nameHanja: "李昌熙",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "9대",
    period: "2012-2013",
    name: "서상호",
    nameHanja: "徐相浩",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "10대",
    period: "2013-2014",
    name: "박문상",
    nameHanja: "朴文相",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "11대",
    period: "2014-2015",
    name: "황병욱",
    nameHanja: "黃炳旭",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "12대",
    period: "2015-2016",
    name: "권오석",
    nameHanja: "權五碩",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "13대",
    period: "2016-2017",
    name: "박임관",
    nameHanja: "朴林寬",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "14대",
    period: "2017-2018",
    name: "윤태열",
    nameHanja: "尹泰烈",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "15대",
    period: "2018-2019",
    name: "이정환",
    nameHanja: "李正奐",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "16대",
    period: "2019-2020",
    name: "현승 남정악",
    nameHanja: "南禎岳",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "17대",
    period: "2020-2021",
    name: "김동한",
    nameHanja: "金東漢",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "18대",
    period: "2021-2022",
    name: "오승연",
    nameHanja: "吳承燕",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "19대",
    period: "2022-2023",
    name: "임성일",
    nameHanja: "林成一",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "20대",
    period: "2023-2024",
    name: "이재술",
    nameHanja: "李在述",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "21대",
    period: "2024-2025",
    name: "김용현",
    nameHanja: "金龍賢",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "22대",
    period: "2025-2026",
    name: "천상天翔 최용환",
    nameHanja: "崔龍煥",
    photo: "/placeholder.svg?height=80&width=80",
  },
  {
    term: "23대",
    period: "2026-2027",
    name: "김용현",
    nameHanja: "金龍賢",
    photo: "/placeholder.svg?height=80&width=80",
  },
]

export default function PresidentsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">역대 회장</h1>
          <p className="text-lg text-muted-foreground">경주중앙로타리클럽을 이끌어온 역대 회장님들을 소개합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {presidents.map((president, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary/20">
                  <Image
                    src={president.photo || "/placeholder.svg"}
                    alt={`${president.name} 회장`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge variant="outline" className="mb-2">
                  {president.term}
                </Badge>
                <CardTitle className="text-lg">{president.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{president.nameHanja}</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm font-medium text-primary">{president.period}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
