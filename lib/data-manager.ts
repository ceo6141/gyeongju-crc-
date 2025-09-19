interface DataItem {
  id: string
  [key: string]: any
}

interface DataManagerConfig {
  storageKey: string
  defaultData: DataItem[]
  eventName?: string
}

class DataManager<T extends DataItem> {
  private config: DataManagerConfig
  private data: T[] = []

  constructor(config: DataManagerConfig) {
    this.config = config
    this.loadData()
  }

  // 데이터 로드
  private loadData(): void {
    try {
      const savedData = localStorage.getItem(this.config.storageKey)
      const backupData = localStorage.getItem(`${this.config.storageKey}-backup`)

      if (savedData) {
        const parsed = JSON.parse(savedData)
        this.data = Array.isArray(parsed) ? parsed : (this.config.defaultData as T[])
      } else if (backupData) {
        console.log(`[v0] ${this.config.storageKey} 백업에서 복원 중...`)
        const parsed = JSON.parse(backupData)
        this.data = Array.isArray(parsed) ? parsed : (this.config.defaultData as T[])
        // 복원된 데이터를 메인 저장소에 저장
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.data))
      } else {
        this.data = this.config.defaultData as T[]
      }

      this.data = this.sortByDate(this.data)

      console.log(`[v0] ${this.config.storageKey} 데이터 로드:`, this.data.length, "개")
    } catch (error) {
      console.error(`[v0] ${this.config.storageKey} 로드 오류:`, error)
      try {
        const backupData = localStorage.getItem(`${this.config.storageKey}-backup`)
        if (backupData) {
          const parsed = JSON.parse(backupData)
          this.data = Array.isArray(parsed) ? parsed : (this.config.defaultData as T[])
          console.log(`[v0] ${this.config.storageKey} 백업에서 복원 성공`)
        } else {
          this.data = this.config.defaultData as T[]
        }
      } catch (backupError) {
        console.error(`[v0] ${this.config.storageKey} 백업 복원 실패:`, backupError)
        this.data = this.config.defaultData as T[]
      }
    }
  }

  private sortByDate(data: T[]): T[] {
    return data.sort((a, b) => {
      const dateA = new Date(a.date || "1970-01-01").getTime()
      const dateB = new Date(b.date || "1970-01-01").getTime()
      return dateB - dateA // 최신순
    })
  }

  // 데이터 저장
  private saveData(): boolean {
    try {
      this.data = this.sortByDate(this.data)

      const dataString = JSON.stringify(this.data)
      localStorage.setItem(this.config.storageKey, dataString)

      localStorage.setItem(`${this.config.storageKey}-backup`, dataString)
      localStorage.setItem(`${this.config.storageKey}-lastSaved`, Date.now().toString())

      console.log(`[v0] ${this.config.storageKey} 저장 완료:`, this.data.length, "개 (백업 포함)")

      // 이벤트 발생
      if (this.config.eventName) {
        window.dispatchEvent(
          new CustomEvent(this.config.eventName, {
            detail: { data: this.data },
          }),
        )
      }

      return true
    } catch (error) {
      console.error(`[v0] ${this.config.storageKey} 저장 오류:`, error)

      console.log(`[v0] ${this.config.storageKey} 메모리에서 데이터 유지 중`)
      return false
    }
  }

  // 모든 데이터 조회
  getAll(): T[] {
    return this.sortByDate([...this.data])
  }

  // ID로 데이터 조회
  getById(id: string): T | undefined {
    return this.data.find((item) => item.id === id)
  }

  // 데이터 추가
  add(item: Omit<T, "id"> & { id?: string }): boolean {
    const newItem = {
      ...item,
      id: item.id || `user-${Date.now()}`,
    } as T

    this.data.unshift(newItem)
    return this.saveData()
  }

  // 데이터 수정
  update(id: string, updates: Partial<T>): boolean {
    const index = this.data.findIndex((item) => item.id === id)
    if (index === -1) return false

    this.data[index] = { ...this.data[index], ...updates }
    return this.saveData()
  }

  // 데이터 삭제
  delete(id: string): boolean {
    const initialLength = this.data.length
    this.data = this.data.filter((item) => item.id !== id)

    if (this.data.length < initialLength) {
      return this.saveData()
    }
    return false
  }

  // 데이터 새로고침
  refresh(): void {
    this.loadData()
  }

  // 데이터 초기화
  reset(): boolean {
    this.data = this.config.defaultData as T[]
    return this.saveData()
  }

  recover(): boolean {
    try {
      const backupData = localStorage.getItem(`${this.config.storageKey}-backup`)
      if (backupData) {
        const parsed = JSON.parse(backupData)
        this.data = Array.isArray(parsed) ? parsed : (this.config.defaultData as T[])
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.data))
        console.log(`[v0] ${this.config.storageKey} 백업에서 복구 완료`)
        return true
      }
      return false
    } catch (error) {
      console.error(`[v0] ${this.config.storageKey} 복구 실패:`, error)
      return false
    }
  }
}

// 공지사항 데이터 관리자
export interface Notice {
  id: string
  title: string
  content: string
  date: string
  type: string
  details?: {
    date?: string
    time?: string
    location?: string
  }
}

const defaultNotices: Notice[] = [
  {
    id: "default-1",
    title: "정기 예회 안내",
    content: "매주 목요일 정기 예회가 진행됩니다.",
    date: "2024-12-01",
    type: "정기",
    details: {
      date: "매주 목요일",
      time: "오후 7:00",
      location: "경주 힐튼호텔",
    },
  },
]

export const noticesManager = new DataManager<Notice>({
  storageKey: "homepage-notices",
  defaultData: defaultNotices,
  eventName: "noticesUpdated",
})

// 갤러리 이미지 데이터 관리자
export interface GalleryImage {
  id: string
  title: string
  description: string
  date: string
  location: string
  imageUrl: string
  originalWidth?: number
  originalHeight?: number
}

const defaultImages: GalleryImage[] = [
  {
    id: "default-1",
    title: "경주중앙로타리클럽 제21대 22대 회장단 이취임식",
    description: "천상 天翔 최용환 회장 이취임식",
    date: "2024-07-01",
    location: "경주 힐튼호텔",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-2",
    title: "APEC 회원국 초청 국제 유소년대회 일본 테소로팀 응원 봉사",
    description: "국제 유소년 축구대회에서 일본팀 응원 및 문화교류 봉사활동",
    date: "2024-06-15",
    location: "경주월드컵경기장",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-3",
    title: "지역사회 봉사활동 - 독거노인 도시락 배달",
    description: "매월 정기적으로 진행하는 독거노인 도시락 배달 봉사",
    date: "2024-05-20",
    location: "경주시 전역",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-4",
    title: "로타리 청소년 장학금 수여식",
    description: "지역 우수 청소년들에게 장학금을 수여하는 의미있는 시간",
    date: "2024-04-10",
    location: "경주교육청",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-5",
    title: "환경보호 캠페인 - 불국사 주변 정화활동",
    description: "불국사 주변 환경정화 및 관광객 안내 봉사활동",
    date: "2024-03-15",
    location: "불국사 일대",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-6",
    title: "국제교류 - 자매클럽 방문",
    description: "일본 자매클럽과의 우정 증진 및 문화교류 활동",
    date: "2024-02-20",
    location: "일본 오사카",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-7",
    title: "지역 소상공인 지원 바자회",
    description: "지역 소상공인들을 위한 바자회 개최 및 수익금 기부",
    date: "2024-01-25",
    location: "경주시민회관",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
]

export const galleryManager = new DataManager<GalleryImage>({
  storageKey: "gallery-images",
  defaultData: defaultImages,
  eventName: "galleryUpdated",
})

// 회원소식 데이터 관리자
export interface MemberNews {
  id: string
  title: string
  date: string
  content: string
  category: string
}

const defaultMemberNews: MemberNews[] = [
  {
    id: "default-1",
    title: "신입회원 환영",
    content: "새로운 회원들을 환영합니다.",
    date: "2024-12-01",
    category: "회원소식",
  },
]

export const memberNewsManager = new DataManager<MemberNews>({
  storageKey: "homepage-news",
  defaultData: defaultMemberNews,
  eventName: "memberNewsUpdated",
})

export const syncAllData = () => {
  // 기존 데이터 백업
  const currentNotices = noticesManager.getAll()
  const currentGallery = galleryManager.getAll()
  const currentNews = memberNewsManager.getAll()

  // 데이터 새로고침
  noticesManager.refresh()
  galleryManager.refresh()
  memberNewsManager.refresh()

  // 데이터가 비어있으면 기본 데이터로 복원
  if (galleryManager.getAll().length === 0) {
    console.log("[v0] 갤러리 데이터 복원 중...")
    defaultImages.forEach((image) => {
      galleryManager.add(image)
    })
  }

  // 데이터 손실 방지를 위한 추가 백업
  try {
    localStorage.setItem(
      "rotary-emergency-backup",
      JSON.stringify({
        notices: currentNotices,
        gallery: currentGallery,
        news: currentNews,
        timestamp: Date.now(),
      }),
    )
    console.log("[v0] 비상 백업 저장 완료")
  } catch (error) {
    console.error("[v0] 비상 백업 저장 실패:", error)
  }

  console.log("[v0] 모든 데이터 동기화 완료")
}

// 데이터 백업 및 복원
export const backupData = () => {
  const backup = {
    notices: noticesManager.getAll(),
    gallery: galleryManager.getAll(),
    memberNews: memberNewsManager.getAll(),
    timestamp: new Date().toISOString(),
    version: "2.0", // 백업 버전 추가
  }

  const dataStr = JSON.stringify(backup, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement("a")
  link.href = url
  link.download = `rotary-backup-${new Date().toISOString().split("T")[0]}.json`
  link.click()

  URL.revokeObjectURL(url)
  console.log("[v0] 데이터 백업 완료")
}

export const restoreData = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string)

        // 데이터 검증
        if (!backup.notices || !backup.gallery || !backup.memberNews) {
          throw new Error("잘못된 백업 파일 형식입니다.")
        }

        const emergencyBackup = {
          notices: noticesManager.getAll(),
          gallery: galleryManager.getAll(),
          memberNews: memberNewsManager.getAll(),
          timestamp: Date.now(),
        }
        localStorage.setItem("rotary-pre-restore-backup", JSON.stringify(emergencyBackup))

        // 데이터 복원
        localStorage.setItem("homepage-notices", JSON.stringify(backup.notices))
        localStorage.setItem("gallery-images", JSON.stringify(backup.gallery))
        localStorage.setItem("homepage-news", JSON.stringify(backup.memberNews))

        localStorage.setItem("homepage-notices-backup", JSON.stringify(backup.notices))
        localStorage.setItem("gallery-images-backup", JSON.stringify(backup.gallery))
        localStorage.setItem("homepage-news-backup", JSON.stringify(backup.memberNews))

        // 메모리 데이터 새로고침
        syncAllData()

        console.log("[v0] 데이터 복원 완료 (백업 포함)")
        resolve(backup)
      } catch (error) {
        console.error("[v0] 데이터 복원 오류:", error)
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export const autoRestoreData = () => {
  try {
    const activitiesData = localStorage.getItem("rotary-activities")
    if (!activitiesData) {
      const defaultActivities = [
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
      ]
      localStorage.setItem("rotary-activities", JSON.stringify(defaultActivities))
      localStorage.setItem("rotary-activities-backup", JSON.stringify(defaultActivities))
      console.log("[v0] 봉사활동 기본 데이터 복원 완료")
    }

    const memberNewsData = localStorage.getItem("rotary-member-news")
    if (!memberNewsData) {
      const defaultMemberNews = [
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
      localStorage.setItem("rotary-member-news", JSON.stringify(defaultMemberNews))
      localStorage.setItem("rotary-member-news-backup", JSON.stringify(defaultMemberNews))
      console.log("[v0] 회원소식 기본 데이터 복원 완료")
    }

    // 갤러리 데이터 복원
    const galleryData = localStorage.getItem("gallery-images")
    if (!galleryData) {
      localStorage.setItem("gallery-images", JSON.stringify(defaultImages))
      localStorage.setItem("gallery-images-backup", JSON.stringify(defaultImages))
      console.log("[v0] 갤러리 기본 데이터 복원 완료")
    }

    // 데이터 동기화
    syncAllData()

    console.log("[v0] 자동 데이터 복원 완료 (백업 강화)")
    return true
  } catch (error) {
    console.error("[v0] 자동 데이터 복원 실패:", error)
    return false
  }
}

export const recoverAllData = () => {
  console.log("[v0] 모든 데이터 복구 시도 중...")

  let recovered = false

  // 각 데이터 매니저의 복구 시도
  if (noticesManager.recover()) recovered = true
  if (galleryManager.recover()) recovered = true
  if (memberNewsManager.recover()) recovered = true

  // 비상 백업에서 복구 시도
  try {
    const emergencyBackup = localStorage.getItem("rotary-emergency-backup")
    if (emergencyBackup) {
      const backup = JSON.parse(emergencyBackup)
      console.log("[v0] 비상 백업에서 데이터 복구 중...")

      if (backup.notices && backup.notices.length > 0) {
        localStorage.setItem("homepage-notices", JSON.stringify(backup.notices))
        recovered = true
      }
      if (backup.gallery && backup.gallery.length > 0) {
        localStorage.setItem("gallery-images", JSON.stringify(backup.gallery))
        recovered = true
      }
      if (backup.news && backup.news.length > 0) {
        localStorage.setItem("homepage-news", JSON.stringify(backup.news))
        recovered = true
      }
    }
  } catch (error) {
    console.error("[v0] 비상 백업 복구 실패:", error)
  }

  if (recovered) {
    syncAllData()
    console.log("[v0] 데이터 복구 완료")
    return true
  } else {
    console.log("[v0] 복구할 백업 데이터가 없습니다")
    return false
  }
}
