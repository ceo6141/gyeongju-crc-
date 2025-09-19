export interface SharedNotice {
  id: string
  title: string
  content: string
  date: string
  details?: {
    time?: string
    location?: string
    contact?: string
  }
}

export interface SharedGalleryImage {
  id: string
  title: string
  description: string
  date: string
  location: string
  imageUrl: string
}

// 기본 공지사항 데이터
export const getDefaultNotices = (): SharedNotice[] => [
  {
    id: "1",
    title: "이사회 개최 안내",
    content: "2025년 8월 28일(목) 오후 7시에 이사회가 개최됩니다.",
    date: "2025.08.20",
    details: {
      time: "오후 7시",
      location: "해물마당",
      contact: "ceo6141@gmail.com",
    },
  },
  {
    id: "2",
    title: "정기모임 안내",
    content: "다음 정기모임은 2025년 9월 4일(목) 오후 7시에 진행됩니다.",
    date: "2025.08.20",
    details: {
      time: "오후 7시",
      location: "해물마당",
      contact: "ceo6141@gmail.com",
    },
  },
]

// 데이터 동기화 함수들
export const syncNoticesData = () => {
  const savedNotices = localStorage.getItem("homepage-notices")
  if (!savedNotices) {
    const defaultNotices = getDefaultNotices()
    localStorage.setItem("homepage-notices", JSON.stringify(defaultNotices))
    return defaultNotices
  }
  return JSON.parse(savedNotices)
}

export const syncGalleryData = () => {
  const savedImages = localStorage.getItem("gallery-images")
  if (!savedImages) {
    localStorage.setItem("gallery-images", JSON.stringify([]))
    return []
  }
  return JSON.parse(savedImages)
}
