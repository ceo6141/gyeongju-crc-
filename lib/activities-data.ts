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

const getDefaultActivitiesData = (): Activity[] => []
const getDefaultMemberNewsData = (): MemberNews[] => []

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
    console.log("[v0] 봉사활동 데이터:", activities)
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
    console.log("[v0] 회원소식 데이터:", memberNews)
    return true
  } catch (error) {
    console.error("[v0] 회원소식 데이터 저장 오류:", error)
    return false
  }
}
