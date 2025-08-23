"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Phone, Building, Calendar, Plus, Edit, Trash2, Save, X, Camera } from "lucide-react"
import Image from "next/image"
import { NaverBandLink } from "@/components/naver-band-link"

interface Member {
  name: string
  nameHanja: string
  memberNo: string
  company: string
  phone: string
  joinDate: string
  nickname: string
  title?: string
  spouse?: string
  memberPhoto?: string
  spousePhoto?: string
}

const initialMembers: Member[] = [
  {
    name: "구대학",
    nameHanja: "具大學",
    memberNo: "8624748",
    company: "대학치과의원",
    phone: "010-9384-3480",
    joinDate: "2012.10.01",
    nickname: "",
  },
  {
    name: "권국창",
    nameHanja: "權國彰",
    memberNo: "6454417",
    company: "해물마당",
    phone: "010-6521-0819",
    joinDate: "2005.06.18",
    nickname: "",
  },
  {
    name: "권덕용",
    nameHanja: "權德龍",
    memberNo: "6337306",
    company: "예술의전당 센텀뷔페",
    phone: "010-4502-5204",
    joinDate: "2005.01.20",
    nickname: "",
  },
  {
    name: "권오석",
    nameHanja: "權五碩",
    memberNo: "6454404",
    company: "곤드레 참한밥상",
    phone: "010-6612-4830",
    joinDate: "2005.04.15",
    nickname: "송정",
  },
  {
    name: "권태석",
    nameHanja: "權泰錫",
    memberNo: "6454411",
    company: "이디야커피 경주동국대점",
    phone: "010-4801-1613",
    joinDate: "2005.05.20",
    nickname: "평길",
  },
  {
    name: "김경진",
    nameHanja: "金慶鎭",
    memberNo: "6454395",
    company: "천마유통",
    phone: "010-8585-4596",
    joinDate: "2005.03.18",
    nickname: "",
  },
  {
    name: "김동수",
    nameHanja: "金東洙",
    memberNo: "8340184",
    company: "(주)하나정보",
    phone: "010-8856-7100",
    joinDate: "2011.07.22",
    nickname: "",
  },
  {
    name: "김동한",
    nameHanja: "金東漢",
    memberNo: "8624745",
    company: "(주)사랑모아금융서비스/팀장",
    phone: "010-2543-4704",
    joinDate: "2012.07.01",
    nickname: "강경",
  },
  {
    name: "김동해",
    nameHanja: "金東海",
    memberNo: "6337302",
    company: "경주시의회 의원",
    phone: "010-2507-0031",
    joinDate: "2005.01.20",
    nickname: "",
  },
  {
    name: "김병철",
    nameHanja: "金炳澈",
    memberNo: "6644978",
    company: "기아자동차 해동대리점",
    phone: "010-3810-9885",
    joinDate: "2006.09.01",
    nickname: "각운",
  },
  {
    name: "김용현",
    nameHanja: "金龍賢",
    memberNo: "9311369",
    company: "(주)경주이엔씨",
    phone: "010-2678-3758",
    joinDate: "2015.07.01",
    nickname: "천관",
  },
  {
    name: "김용환",
    nameHanja: "金龍奐",
    memberNo: "8552373",
    company: "우리꽃집",
    phone: "010-3507-3234",
    joinDate: "2012.10.01",
    nickname: "",
  },
  {
    name: "김원준",
    nameHanja: "金元俊",
    memberNo: "10084768",
    company: "라인아크 건축사사무소",
    phone: "010-9914-0724",
    joinDate: "2017.11.01",
    nickname: "",
  },
  {
    name: "김일래",
    nameHanja: "金日來",
    memberNo: "6454439",
    company: "경주문화예술원",
    phone: "010-3060-0101",
    joinDate: "2005.11.04",
    nickname: "",
  },
  {
    name: "김철태",
    nameHanja: "金澈泰",
    memberNo: "6337271",
    company: "자영업",
    phone: "010-8599-4005",
    joinDate: "2005.01.20",
    nickname: "",
  },
  {
    name: "김태규",
    nameHanja: "金泰圭",
    memberNo: "9197221",
    company: "건축사사무소 예작",
    phone: "010-3516-2301",
    joinDate: "2015.03.05",
    nickname: "",
  },
  {
    name: "김태호",
    nameHanja: "金泰浩",
    memberNo: "9976513",
    company: "바른개발(주)",
    phone: "010-8581-6100",
    joinDate: "2017.07.05",
    nickname: "",
  },
  {
    name: "남정악",
    nameHanja: "南禎岳",
    memberNo: "6337299",
    company: "메리츠화재 경주지점",
    phone: "010-9373-9782",
    joinDate: "2005.01.20",
    nickname: "현승",
  },
  {
    name: "박원수",
    nameHanja: "朴元秀",
    memberNo: "9311370",
    company: "(주)신라관광/대표이사",
    phone: "010-2818-9287",
    joinDate: "2015.07.01",
    nickname: "",
  },
  {
    name: "박임관",
    nameHanja: "朴林寬",
    memberNo: "6454405",
    company: "경주학연구원/원장, (주)바실라",
    phone: "010-7100-0000",
    joinDate: "2005.04.15",
    nickname: "청호",
  },
  {
    name: "박재열",
    nameHanja: "",
    memberNo: "11723859",
    company: "(주)엠제이컴퍼니",
    phone: "010-4740-2099",
    joinDate: "2023.02.16",
    nickname: "호헌",
  },
  {
    name: "박준민",
    nameHanja: "朴竣民",
    memberNo: "8599847",
    company: "맷돌순두부/세진F&C",
    phone: "010-3857-2020",
    joinDate: "2013.01.17",
    nickname: "",
  },
  {
    name: "박지훈",
    nameHanja: "朴志勳",
    memberNo: "6337273",
    company: "(주)영남전기",
    phone: "010-3511-0788",
    joinDate: "2005.01.20",
    nickname: "경원",
  },
  {
    name: "서상호",
    nameHanja: "徐相浩",
    memberNo: "6278802",
    company: "대풍연와건축자재",
    phone: "010-3523-2265",
    joinDate: "2006.01.20",
    nickname: "운재",
  },
  {
    name: "손대호",
    nameHanja: "孫大鎬",
    memberNo: "9671603",
    company: "경주은혜원",
    phone: "010-3523-9958",
    joinDate: "2016.07.21",
    nickname: "",
  },
  {
    name: "손동균",
    nameHanja: "孫東鈞",
    memberNo: "8355755",
    company: "카페베네 경주동국대점",
    phone: "010-4815-8585",
    joinDate: "2011.03.17",
    nickname: "우제",
  },
  {
    name: "손인익",
    nameHanja: "",
    memberNo: "11522170",
    company: "오복산업",
    phone: "010-4875-2500",
    joinDate: "2023.02.16",
    nickname: "우함",
  },
  {
    name: "오승연",
    nameHanja: "吳承燕",
    memberNo: "9671611",
    company: "(재)화랑문화재연구원/원장",
    phone: "010-8584-2327",
    joinDate: "2016.07.21",
    nickname: "동은",
  },
  {
    name: "오태환",
    nameHanja: "",
    memberNo: "10387460",
    company: "깨끗한 중고 프라자",
    phone: "010-2743-9009",
    joinDate: "2018.09.06",
    nickname: "",
  },
  {
    name: "윤대한",
    nameHanja: "尹大漢",
    memberNo: "10622670",
    company: "(주)경주이엔씨",
    phone: "010-2932-5820",
    joinDate: "2019.06.20",
    nickname: "",
  },
  {
    name: "윤태열",
    nameHanja: "尹泰烈",
    memberNo: "6337314",
    company: "(주)남경엔지니어링",
    phone: "010-4386-2383",
    joinDate: "2005.01.20",
    nickname: "남경",
  },
  {
    name: "이경보",
    nameHanja: "",
    memberNo: "11570250",
    company: "디바로레",
    phone: "010-7696-4028",
    joinDate: "2022.10.13",
    nickname: "",
  },
  {
    name: "이기삼",
    nameHanja: "",
    memberNo: "11188773",
    company: "HC기초소재",
    phone: "010-3854-1804",
    joinDate: "2021.07.02",
    nickname: "",
  },
  {
    name: "이락우",
    nameHanja: "李洛雨",
    memberNo: "6454435",
    company: "경주시의원",
    phone: "010-3594-7350",
    joinDate: "2005.08.05",
    nickname: "",
  },
  {
    name: "이상익",
    nameHanja: "李相益",
    memberNo: "6337259",
    company: "세무법인 은송",
    phone: "010-9022-3456",
    joinDate: "2005.01.20",
    nickname: "양정",
  },
  {
    name: "이성민",
    nameHanja: "李聖珉",
    memberNo: "6337290",
    company: "현대자동차서비스 용강점",
    phone: "010-8797-9916",
    joinDate: "2005.01.20",
    nickname: "",
  },
  {
    name: "이재술",
    nameHanja: "",
    memberNo: "8624762",
    company: "등뼈家",
    phone: "010-8797-8506",
    joinDate: "2012.07.01",
    nickname: "인암",
  },
  {
    name: "이정환",
    nameHanja: "李正奐",
    memberNo: "8624763",
    company: "사랑채 1894",
    phone: "010-3815-4086",
    joinDate: "2012.07.01",
    nickname: "청야",
  },
  {
    name: "이중효",
    nameHanja: "李重曉",
    memberNo: "9976524",
    company: "자영업",
    phone: "010-9882-8855",
    joinDate: "2017.07.05",
    nickname: "",
  },
  {
    name: "이창희",
    nameHanja: "李昌熙",
    memberNo: "6454441",
    company: "자영업",
    phone: "010-2713-9650",
    joinDate: "2005.11.04",
    nickname: "동연",
  },
  {
    name: "임도경",
    nameHanja: "",
    memberNo: "11570247",
    company: "용황모터스",
    phone: "010-9143-9879",
    joinDate: "2022.10.13",
    nickname: "",
  },
  {
    name: "임성일",
    nameHanja: "林成一",
    memberNo: "8105581",
    company: "부창건설",
    phone: "010-2811-5504",
    joinDate: "2009.10.22",
    nickname: "삼봉",
  },
  {
    name: "전종필",
    nameHanja: "全鍾必",
    memberNo: "8261969",
    company: "경주광고",
    phone: "010-3511-1601",
    joinDate: "2010.07.02",
    nickname: "운대",
  },
  {
    name: "정연철",
    nameHanja: "鄭鉛鐵",
    memberNo: "9171000",
    company: "소마루",
    phone: "010-9972-7388",
    joinDate: "2015.01.20",
    nickname: "",
  },
  {
    name: "정재근",
    nameHanja: "鄭在根",
    memberNo: "6337300",
    company: "하베스트(카페.디저트)",
    phone: "010-3545-1546",
    joinDate: "2005.01.20",
    nickname: "",
  },
  {
    name: "조윤철",
    nameHanja: "趙倫徹",
    memberNo: "6337316",
    company: "현대병원",
    phone: "010-4516-3862",
    joinDate: "2005.01.20",
    nickname: "",
  },
  {
    name: "조현우",
    nameHanja: "趙玹佑",
    memberNo: "6337310",
    company: "영진베어링",
    phone: "010-3817-6717",
    joinDate: "2005.01.20",
    nickname: "창해",
  },
  {
    name: "최병준",
    nameHanja: "崔炳俊",
    memberNo: "6336989",
    company: "용강스크린골프/경북도의회 의원",
    phone: "010-3531-0360",
    joinDate: "2005.01.20",
    nickname: "이암",
  },
  {
    name: "최용환",
    nameHanja: "崔龍煥",
    memberNo: "6454414",
    company: "영남산업(주)",
    phone: "010-2126-9775",
    joinDate: "2005.05.20",
    nickname: "",
  },
  {
    name: "최원식",
    nameHanja: "崔元植",
    memberNo: "6337283",
    company: "자유업",
    phone: "010-5210-8357",
    joinDate: "2005.01.20",
    nickname: "",
  },
  {
    name: "최은호",
    nameHanja: "崔殷豪",
    memberNo: "6454415",
    company: "보문한우",
    phone: "010-3816-9880",
    joinDate: "2005.05.20",
    nickname: "",
  },
  {
    name: "최중혁",
    nameHanja: "",
    memberNo: "11183256",
    company: "육손장의사/소문난돼지국밥",
    phone: "010-8770-5444",
    joinDate: "2021.07.01",
    nickname: "",
  },
  {
    name: "최지호",
    nameHanja: "",
    memberNo: "8624754",
    company: "우영건설/우영스틸",
    phone: "010-8349-5567",
    joinDate: "2012.07.01",
    nickname: "",
  },
  {
    name: "최태복",
    nameHanja: "",
    memberNo: "6426144",
    company: "화진개발(주)",
    phone: "010-8855-7748",
    joinDate: "2021.08.23",
    nickname: "",
  },
  {
    name: "한기운",
    nameHanja: "韓基運",
    memberNo: "6454399",
    company: "경주해성여행사",
    phone: "010-3513-7400",
    joinDate: "2005.04.15",
    nickname: "동심",
  },
  {
    name: "한동균",
    nameHanja: "",
    memberNo: "10306423",
    company: "자영업",
    phone: "010-7523-4931",
    joinDate: "2018.06.30",
    nickname: "",
  },
  {
    name: "황대환",
    nameHanja: "黃大煥",
    memberNo: "9995564",
    company: "시원렌탈/천년미가",
    phone: "010-3821-8297",
    joinDate: "2017.07.20",
    nickname: "",
  },
  {
    name: "황병욱",
    nameHanja: "黃炳旭",
    memberNo: "6337311",
    company: "(주)해오름종합건설",
    phone: "010-3827-3449",
    joinDate: "2005.01.20",
    nickname: "중원",
  },
  {
    name: "황영석",
    nameHanja: "黃瑛晳",
    memberNo: "9671628",
    company: "경주시외버스터미널, 경주벼룩시장",
    phone: "010-4506-0660",
    joinDate: "2016.07.21",
    nickname: "",
  },
  {
    name: "황유신",
    nameHanja: "",
    memberNo: "11183253",
    company: "(주)한지산업",
    phone: "010-5272-7777",
    joinDate: "2021.07.01",
    nickname: "",
  },
  {
    name: "황정헌",
    nameHanja: "黃晶憲",
    memberNo: "6456047",
    company: "새벌상사",
    phone: "010-4547-5335",
    joinDate: "2006.01.20",
    nickname: "",
  },
  {
    name: "황해진",
    nameHanja: "黃海鎭",
    memberNo: "6644977",
    company: "골프웨어 <파리게이츠>",
    phone: "010-4599-9742",
    joinDate: "2006.09.01",
    nickname: "",
  },
  {
    name: "황현호",
    nameHanja: "黃鉉浩",
    memberNo: "6454427",
    company: "임대업",
    phone: "010-3507-8360",
    joinDate: "2005.08.05",
    nickname: "",
  },
  {
    name: "허동욱",
    nameHanja: "",
    memberNo: "11813502",
    company: "만석정숯불",
    phone: "010-3518-4262",
    joinDate: "2023.07.10",
    nickname: "",
  },
  {
    name: "이현호",
    nameHanja: "",
    memberNo: "11826274",
    company: "성화엔지니어링 대표",
    phone: "010-4438-2505",
    joinDate: "2023.08.01",
    nickname: "",
  },
  {
    name: "이주형",
    nameHanja: "",
    memberNo: "12089380",
    company: "(사)호연건축문화유산연구원 원장",
    phone: "010-5596-1770",
    joinDate: "2024.07.08",
    nickname: "",
  },
  {
    name: "김기태",
    nameHanja: "",
    memberNo: "12171502",
    company: "(주)남경엔지니어링",
    phone: "010-3509-3697",
    joinDate: "2024.10.07",
    nickname: "",
  },
  {
    name: "문시영",
    nameHanja: "",
    memberNo: "12182426",
    company: "기아자동차 해동대리점",
    phone: "010-5152-0220",
    joinDate: "2024.10.17",
    nickname: "",
  },
  {
    name: "김원기",
    nameHanja: "",
    memberNo: "12182432",
    company: "(주)한지렌트카",
    phone: "010-9165-5511",
    joinDate: "2024.10.17",
    nickname: "",
  },
  {
    name: "공영건",
    nameHanja: "",
    memberNo: "12211716",
    company: "강남중량기공",
    phone: "010-6775-1955",
    joinDate: "2024.12.02",
    nickname: "",
  },
]

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [newMember, setNewMember] = useState<Member>({
    name: "",
    nameHanja: "",
    nickname: "",
    memberNo: "",
    company: "",
    phone: "",
    joinDate: "",
    title: "",
    spouse: "",
    memberPhoto: "/placeholder.svg?height=100&width=100",
    spousePhoto: "/placeholder.svg?height=100&width=100",
  })
  const [attendanceRate, setAttendanceRate] = useState<number>(85)
  const [isEditingAttendance, setIsEditingAttendance] = useState(false)

  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem("rotary-members")
      const savedAttendanceRate = localStorage.getItem("rotary-attendance-rate")

      if (savedMembers) {
        const parsedMembers = JSON.parse(savedMembers)
        if (Array.isArray(parsedMembers) && parsedMembers.length > 0) {
          setMembers(parsedMembers)
          console.log("[v0] Loaded members from localStorage:", parsedMembers.length)
        } else {
          console.log("[v0] Invalid saved data, loading initial members")
          setMembers(initialMembers)
          localStorage.setItem("rotary-members", JSON.stringify(initialMembers))
        }
      } else {
        console.log("[v0] No saved data, loading initial members")
        setMembers(initialMembers)
        localStorage.setItem("rotary-members", JSON.stringify(initialMembers))
      }

      if (savedAttendanceRate) {
        setAttendanceRate(Number.parseFloat(savedAttendanceRate))
      }
    } catch (error) {
      console.log("[v0] Error loading data, loading initial members:", error)
      setMembers(initialMembers)
      localStorage.setItem("rotary-members", JSON.stringify(initialMembers))
    }
  }, [])

  const updateMembersStorage = (newMembers: Member[]) => {
    try {
      if (!Array.isArray(newMembers)) {
        throw new Error("Invalid members data")
      }

      setMembers(newMembers)
      localStorage.setItem("rotary-members", JSON.stringify(newMembers))
      console.log("[v0] Updated localStorage with", newMembers.length, "members")

      setTimeout(() => {
        setMembers([...newMembers])
      }, 0)
    } catch (error) {
      console.error("[v0] Error updating localStorage:", error)
      alert("데이터 저장 중 오류가 발생했습니다.")
    }
  }

  const calculateAverageExperience = () => {
    if (members.length === 0) return 0

    const currentYear = new Date().getFullYear()
    const totalExperience = members.reduce((sum, member) => {
      const joinYear = Number.parseInt(member.joinDate.split("-")[0]) || currentYear
      return sum + (currentYear - joinYear)
    }, 0)

    return Math.round(totalExperience / members.length)
  }

  const updateAttendanceRate = (rate: number) => {
    setAttendanceRate(rate)
    localStorage.setItem("rotary-attendance-rate", rate.toString())
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberNo.includes(searchTerm) ||
      member.nameHanja.includes(searchTerm),
  )

  const handlePhotoUpload = (memberNo: string, photoType: "member" | "spouse", file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string
      updateMembersStorage(
        members.map((member) =>
          member.memberNo === memberNo
            ? {
                ...member,
                [photoType === "member" ? "memberPhoto" : "spousePhoto"]: photoUrl,
              }
            : member,
        ),
      )
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = (memberNo: string, photoType: "member" | "spouse") => {
    updateMembersStorage(
      members.map((member) =>
        member.memberNo === memberNo
          ? {
              ...member,
              [photoType === "member" ? "memberPhoto" : "spousePhoto"]: undefined,
            }
          : member,
      ),
    )
  }

  const deleteMember = (memberNo: string) => {
    const memberToDelete = members.find((m) => m.memberNo === memberNo)
    if (!memberToDelete) {
      alert("삭제할 회원을 찾을 수 없습니다.")
      return
    }

    if (confirm(`정말로 ${memberToDelete.name} 회원을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      const updatedMembers = members.filter((member) => member.memberNo !== memberNo)
      updateMembersStorage(updatedMembers)
      console.log("[v0] Deleted member:", memberToDelete.name, "Remaining members:", updatedMembers.length)
      alert(`${memberToDelete.name} 회원이 성공적으로 삭제되었습니다.`)

      if (editingMember?.memberNo === memberNo) {
        setEditingMember(null)
      }
    }
  }

  const addMember = () => {
    if (!newMember.name.trim() || !newMember.memberNo.trim() || !newMember.company.trim()) {
      alert("이름, 회원번호, 직장은 필수 입력 항목입니다.")
      return
    }

    const existingMember = members.find((member) => member.memberNo === newMember.memberNo.trim())
    if (existingMember) {
      alert("이미 존재하는 회원번호입니다.")
      return
    }

    const memberToAdd = {
      ...newMember,
      name: newMember.name.trim(),
      memberNo: newMember.memberNo.trim(),
      company: newMember.company.trim(),
      title: newMember.title?.trim() || "",
      spouse: newMember.spouse?.trim() || "",
      nameHanja: newMember.nameHanja?.trim() || "",
      nickname: newMember.nickname?.trim() || "",
      phone: newMember.phone?.trim() || "",
      joinDate: newMember.joinDate?.trim() || "",
    }

    const updatedMembers = [...members, memberToAdd]
    updateMembersStorage(updatedMembers)

    setNewMember({
      name: "",
      nameHanja: "",
      nickname: "",
      memberNo: "",
      company: "",
      phone: "",
      joinDate: "",
      title: "",
      spouse: "",
      memberPhoto: "/placeholder.svg?height=100&width=100",
      spousePhoto: "/placeholder.svg?height=100&width=100",
    })
    setShowAddForm(false)
    console.log("[v0] Added new member:", memberToAdd.name, "Total members:", updatedMembers.length)
    alert(`${memberToAdd.name} 회원이 성공적으로 추가되었습니다.`)
  }

  const updateMember = (memberNo: string, updatedData: Partial<Member>) => {
    if (!updatedData.name?.trim() || !updatedData.memberNo?.trim() || !updatedData.company?.trim()) {
      alert("이름, 회원번호, 회사명은 필수 입력 항목입니다.")
      return
    }

    if (updatedData.memberNo !== memberNo) {
      const existingMember = members.find(
        (member) => member.memberNo === updatedData.memberNo && member.memberNo !== memberNo,
      )
      if (existingMember) {
        alert("이미 존재하는 회원번호입니다.")
        return
      }
    }

    const cleanedData = {
      ...updatedData,
      name: updatedData.name?.trim(),
      nameHanja: updatedData.nameHanja?.trim() || "",
      nickname: updatedData.nickname?.trim() || "",
      memberNo: updatedData.memberNo?.trim(),
      company: updatedData.company?.trim(),
      phone: updatedData.phone?.trim() || "",
      joinDate: updatedData.joinDate?.trim() || "",
      title: updatedData.title?.trim() || "",
      spouse: updatedData.spouse?.trim() || "",
    }

    const updatedMembers = members.map((member) =>
      member.memberNo === memberNo ? { ...member, ...cleanedData } : member,
    )
    updateMembersStorage(updatedMembers)
    setEditingMember(null)
    console.log("[v0] Updated member:", cleanedData.name, "Total members:", updatedMembers.length)
    alert(`${cleanedData.name} 회원 정보가 성공적으로 수정되었습니다.`)
  }

  const startEditMember = (member: Member) => {
    setEditingMember(member)
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Users className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">회원명부</h1>
          <p className="text-lg text-muted-foreground">경주중앙로타리클럽 회원들을 소개합니다.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="회원명, 아호, 직장명, 회원번호로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              회원 추가
            </Button>
          </div>
        </div>

        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>새 회원 추가</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  placeholder="이름 *"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="한자명"
                  value={newMember.nameHanja}
                  onChange={(e) => setNewMember({ ...newMember, nameHanja: e.target.value })}
                />
                <Input
                  placeholder="회원번호 *"
                  value={newMember.memberNo}
                  onChange={(e) => setNewMember({ ...newMember, memberNo: e.target.value })}
                  required
                />
                <Input
                  placeholder="직장 *"
                  value={newMember.company}
                  onChange={(e) => setNewMember({ ...newMember, company: e.target.value })}
                  required
                />
                <Input
                  placeholder="휴대폰"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                />
                <Input
                  placeholder="입회일 (YYYY.MM.DD)"
                  value={newMember.joinDate}
                  onChange={(e) => setNewMember({ ...newMember, joinDate: e.target.value })}
                />
                <Input
                  placeholder="아호"
                  value={newMember.nickname}
                  onChange={(e) => setNewMember({ ...newMember, nickname: e.target.value })}
                />
                <Input
                  placeholder="직책"
                  value={newMember.title || ""}
                  onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                />
                <Input
                  placeholder="배우자명"
                  value={newMember.spouse || ""}
                  onChange={(e) => setNewMember({ ...newMember, spouse: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addMember}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{members.length}</div>
              <div className="text-sm text-muted-foreground">총 회원 수</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">2005</div>
              <div className="text-sm text-muted-foreground">창립년도</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{calculateAverageExperience()}년</div>
              <div className="text-sm text-muted-foreground">평균 경력</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {isEditingAttendance ? (
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={attendanceRate}
                    onChange={(e) => setAttendanceRate(Number.parseFloat(e.target.value) || 0)}
                    className="text-center"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => {
                        updateAttendanceRate(attendanceRate)
                        setIsEditingAttendance(false)
                      }}
                    >
                      저장
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingAttendance(false)}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => setIsEditingAttendance(true)}
                >
                  <div className="text-2xl font-bold text-primary">{attendanceRate}%</div>
                  <div className="text-sm text-muted-foreground">참여율 (클릭하여 수정)</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {searchTerm && <div className="mb-4 text-sm text-muted-foreground">검색 결과: {filteredMembers.length}명</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <Card key={member.memberNo} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="text-center relative group">
                      <div className="relative">
                        <Image
                          src={member.memberPhoto || "/rotary-international-logo.png"}
                          alt={`${member.name} 회원 사진`}
                          width={80}
                          height={80}
                          className="rounded-full mx-auto mb-2 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <label className="cursor-pointer">
                            <Camera className="h-6 w-6 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handlePhotoUpload(member.memberNo, "member", file)
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">회원</p>
                      {member.memberPhoto && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 text-xs bg-transparent"
                          onClick={() => removePhoto(member.memberNo, "member")}
                        >
                          사진 삭제
                        </Button>
                      )}
                    </div>
                    <div className="text-center relative group">
                      <div className="relative">
                        <Image
                          src={member.spousePhoto || "/rotary-international-logo.png"}
                          alt={`${member.name} 배우자 사진`}
                          width={80}
                          height={80}
                          className="rounded-full mx-auto mb-2 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <label className="cursor-pointer">
                            <Camera className="h-6 w-6 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handlePhotoUpload(member.memberNo, "spouse", file)
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">배우자</p>
                      {member.spousePhoto && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 text-xs bg-transparent"
                          onClick={() => removePhoto(member.memberNo, "spouse")}
                        >
                          사진 삭제
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">
                    {member.name}
                    {member.nickname && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {member.nickname}
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{member.nameHanja}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="truncate">{member.company}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>입회: {member.joinDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Badge variant="outline" className="text-xs">
                      회원번호: {member.memberNo}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => startEditMember(member)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteMember(member.memberNo)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-muted-foreground">
                다른 검색어로 시도해보세요. 회원명, 아호, 직장명, 회원번호로 검색할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        {editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">회원 정보 수정</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingMember(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">이름</label>
                  <Input
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    placeholder="이름"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">한자명</label>
                  <Input
                    value={editingMember.nameHanja}
                    onChange={(e) => setEditingMember({ ...editingMember, nameHanja: e.target.value })}
                    placeholder="한자명"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">회원번호</label>
                  <Input
                    value={editingMember.memberNo}
                    onChange={(e) => setEditingMember({ ...editingMember, memberNo: e.target.value })}
                    placeholder="회원번호"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">직책</label>
                  <Input
                    value={editingMember.title || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                    placeholder="직책"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">회사명</label>
                  <Input
                    value={editingMember.company}
                    onChange={(e) => setEditingMember({ ...editingMember, company: e.target.value })}
                    placeholder="회사명"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">전화번호</label>
                  <Input
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    placeholder="전화번호"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">입회일</label>
                  <Input
                    value={editingMember.joinDate}
                    onChange={(e) => setEditingMember({ ...editingMember, joinDate: e.target.value })}
                    placeholder="입회일"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">배우자명</label>
                  <Input
                    value={editingMember.spouse || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, spouse: e.target.value })}
                    placeholder="배우자명"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">회원 사진 URL</label>
                  <Input
                    value={editingMember.memberPhoto || "/placeholder.svg?height=100&width=100"}
                    onChange={(e) => setEditingMember({ ...editingMember, memberPhoto: e.target.value })}
                    placeholder="회원 사진 URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">배우자 사진 URL</label>
                  <Input
                    value={editingMember.spousePhoto || "/placeholder.svg?height=100&width=100"}
                    onChange={(e) => setEditingMember({ ...editingMember, spousePhoto: e.target.value })}
                    placeholder="배우자 사진 URL"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={() => updateMember(editingMember.memberNo, editingMember)} className="flex-1">
                  수정 완료
                </Button>
                <Button variant="outline" onClick={() => setEditingMember(null)} className="flex-1">
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <NaverBandLink variant="card" />
        </div>
      </div>
    </div>
  )
}
