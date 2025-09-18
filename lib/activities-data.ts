export interface Activity {
  id: number
  title: string
  date: string
  location?: string
  description?: string
  amount?: string
  participants?: string
  type: string
  image?: string
}

export interface MemberNews {
  id: number
  title: string
  date: string
  content: string
  type: string
}

const ACTIVITIES_STORAGE_KEY = "rotary-activities"
const MEMBER_NEWS_STORAGE_KEY = "rotary-member-news"

const getDefaultActivitiesData = (): Activity[] => [
  {
    id: 1,
    title: "지역사회 기부금 전달",
    date: "2025.07.22",
    location: "경주시청",
    description: "경주 지역 소외계층을 위한 기부금을 전달했습니다.",
    amount: "200만원",
    participants: "12명",
    type: "기부활동",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    title: "환경정화 봉사활동",
    date: "2025.06.15",
    location: "대릉원 일대",
    description: "경주 대릉원 주변 환경정화 활동을 실시했습니다.",
    amount: "",
    participants: "20명",
    type: "봉사활동",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    title: "독거노인 도시락 배달",
    date: "2025.05.30",
    location: "경주시 전역",
    description: "독거노인분들께 따뜻한 도시락을 배달했습니다.",
    amount: "",
    participants: "15명",
    type: "봉사활동",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    title: "장학금 전달식",
    date: "2025.04.20",
    location: "경주고등학교",
    description: "우수한 학생들에게 장학금을 전달했습니다.",
    amount: "500만원",
    participants: "8명",
    type: "교육지원",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 5,
    title: "의료봉사활동",
    date: "2025.03.15",
    location: "경주시 보건소",
    description: "지역주민들을 위한 무료 건강검진을 실시했습니다.",
    amount: "",
    participants: "25명",
    type: "의료봉사",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 6,
    title: "어린이집 후원",
    date: "2025.02.28",
    location: "햇살어린이집",
    description: "지역 어린이집에 교육용품과 간식을 후원했습니다.",
    amount: "150만원",
    participants: "10명",
    type: "아동지원",
    image: "/placeholder.svg?height=300&width=400",
  },
]

const getDefaultMemberNewsData = (): MemberNews[] => [
  {
    id: 1,
    title: "신입회원 환영식",
    date: "2025년 8월 10일",
    content: "새로운 회원들을 환영하는 시간을 가졌습니다.",
    type: "회원소식",
  },
  {
    id: 2,
    title: "정기총회 개최",
    date: "2025년 7월 25일",
    content: "2025-26년도 정기총회가 성공적으로 개최되었습니다.",
    type: "회원소식",
  },
]

export const syncActivitiesData = (): Activity[] => {
  try {
    const stored = localStorage.getItem(ACTIVITIES_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log("[v0] 저장된 봉사활동 데이터 사용:", parsed.length, "개")
        return parsed
      }
    }

    const defaultData = getDefaultActivitiesData()
    console.log("[v0] 봉사활동 기본 데이터 사용:", defaultData.length, "개")
    return defaultData
  } catch (error) {
    console.error("[v0] 봉사활동 데이터 로드 오류:", error)
    return getDefaultActivitiesData()
  }
}

export const syncMemberNewsData = (): MemberNews[] => {
  try {
    const stored = localStorage.getItem(MEMBER_NEWS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log("[v0] 저장된 회원소식 데이터 사용:", parsed.length, "개")
        return parsed
      }
    }

    const defaultData = getDefaultMemberNewsData()
    console.log("[v0] 회원소식 기본 데이터 사용:", defaultData.length, "개")
    return defaultData
  } catch (error) {
    console.error("[v0] 회원소식 데이터 로드 오류:", error)
    return getDefaultMemberNewsData()
  }
}

export const saveActivitiesData = (activities: Activity[]): boolean => {
  try {
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities))
    console.log("[v0] 봉사활동 데이터 저장 완료:", activities.length, "개")
    return true
  } catch (error) {
    console.error("[v0] 봉사활동 데이터 저장 오류:", error)
    return false
  }
}

export const saveMemberNewsData = (memberNews: MemberNews[]): boolean => {
  try {
    localStorage.setItem(MEMBER_NEWS_STORAGE_KEY, JSON.stringify(memberNews))
    console.log("[v0] 회원소식 데이터 저장 완료:", memberNews.length, "개")
    return true
  } catch (error) {
    console.error("[v0] 회원소식 데이터 저장 오류:", error)
    return false
  }
}
