"use client"

export interface UnifiedDataItem {
  id: string
  [key: string]: any
}

export interface UnifiedDataConfig<T> {
  storageKey: string
  backupKey: string
  timestampKey: string
  defaultData: T[]
  eventName: string
}

export class UnifiedDataManager<T extends UnifiedDataItem> {
  private config: UnifiedDataConfig<T>
  private data: T[] = []
  private isInitialized = false

  constructor(config: UnifiedDataConfig<T>) {
    this.config = config
    this.initializeData()
  }

  private isClient(): boolean {
    return typeof window !== "undefined"
  }

  // 데이터 초기화 (삼중 백업 시스템)
  private initializeData(): void {
    if (!this.isClient()) {
      this.data = [...this.config.defaultData]
      return
    }

    try {
      // 1차: 메인 데이터 시도
      const mainData = localStorage.getItem(this.config.storageKey)
      if (mainData) {
        const parsed = JSON.parse(mainData)
        if (this.validateData(parsed)) {
          this.data = parsed
          this.saveToAllBackups()
          console.log(`[v0] ${this.config.storageKey} 메인 데이터 로드 성공:`, this.data.length, "개")
          this.isInitialized = true
          return
        }
      }

      // 2차: 백업 데이터 시도
      const backupData = localStorage.getItem(this.config.backupKey)
      if (backupData) {
        const parsed = JSON.parse(backupData)
        if (this.validateData(parsed)) {
          this.data = parsed
          this.saveToAllBackups()
          console.log(`[v0] ${this.config.storageKey} 백업 데이터에서 복구:`, this.data.length, "개")
          this.isInitialized = true
          return
        }
      }

      // 3차: sessionStorage 시도
      const sessionData = sessionStorage.getItem(this.config.storageKey)
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        if (this.validateData(parsed)) {
          this.data = parsed
          this.saveToAllBackups()
          console.log(`[v0] ${this.config.storageKey} 세션 데이터에서 복구:`, this.data.length, "개")
          this.isInitialized = true
          return
        }
      }

      // 4차: 기본 데이터 사용
      this.data = [...this.config.defaultData]
      this.saveToAllBackups()
      console.log(`[v0] ${this.config.storageKey} 기본 데이터 초기화:`, this.data.length, "개")
      this.isInitialized = true
    } catch (error) {
      console.error(`[v0] ${this.config.storageKey} 초기화 오류:`, error)
      this.data = [...this.config.defaultData]
      this.saveToAllBackups()
      this.isInitialized = true
    }
  }

  // 데이터 검증
  private validateData(data: any): boolean {
    return Array.isArray(data) && data.every((item) => item && typeof item === "object" && typeof item.id === "string")
  }

  // 모든 백업에 저장
  public saveToAllBackups(): boolean {
    if (!this.isClient()) return false

    try {
      const dataString = JSON.stringify(this.data)
      const timestamp = new Date().toISOString()

      // localStorage 메인 저장
      localStorage.setItem(this.config.storageKey, dataString)
      // localStorage 백업 저장
      localStorage.setItem(this.config.backupKey, dataString)
      // sessionStorage 저장
      sessionStorage.setItem(this.config.storageKey, dataString)
      // 타임스탬프 저장
      localStorage.setItem(this.config.timestampKey, timestamp)

      console.log(`[v0] ${this.config.storageKey} 삼중 백업 저장 완료:`, this.data.length, "개")

      // 전역 이벤트 발생
      this.dispatchEvents()

      return true
    } catch (error) {
      console.error(`[v0] ${this.config.storageKey} 저장 실패:`, error)
      return false
    }
  }

  public setData(data: T[]): boolean {
    this.data = [...data]
    return this.saveToAllBackups()
  }

  public get currentData(): T[] {
    return [...this.data]
  }

  // 이벤트 발생
  private dispatchEvents(): void {
    if (!this.isClient()) return

    // 커스텀 이벤트
    window.dispatchEvent(
      new CustomEvent(this.config.eventName, {
        detail: { data: this.data },
      }),
    )

    // 스토리지 이벤트
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: this.config.storageKey,
        newValue: JSON.stringify(this.data),
      }),
    )

    // 전역 동기화 이벤트
    window.dispatchEvent(
      new CustomEvent("rotaryDataSync", {
        detail: { key: this.config.storageKey, data: this.data },
      }),
    )
  }

  // 데이터 정렬
  private sortData(data: T[]): T[] {
    return data.sort((a, b) => {
      const dateA = new Date(a.date || "1970-01-01").getTime()
      const dateB = new Date(b.date || "1970-01-01").getTime()
      return dateB - dateA // 최신순
    })
  }

  // 공개 메서드들
  getAll(): T[] {
    if (!this.isInitialized) this.initializeData()
    return this.sortData([...this.data])
  }

  getById(id: string): T | undefined {
    if (!this.isInitialized) this.initializeData()
    return this.data.find((item) => item.id === id)
  }

  add(item: Omit<T, "id"> & { id?: string }): boolean {
    if (!this.isInitialized) this.initializeData()

    const newItem = {
      ...item,
      id: item.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    } as T

    this.data.unshift(newItem)
    return this.saveToAllBackups()
  }

  update(id: string, updates: Partial<T>): boolean {
    if (!this.isInitialized) this.initializeData()

    const index = this.data.findIndex((item) => item.id === id)
    if (index === -1) return false

    this.data[index] = { ...this.data[index], ...updates }
    return this.saveToAllBackups()
  }

  delete(id: string): boolean {
    if (!this.isInitialized) this.initializeData()

    const initialLength = this.data.length
    this.data = this.data.filter((item) => item.id !== id)

    if (this.data.length < initialLength) {
      return this.saveToAllBackups()
    }
    return false
  }

  refresh(): void {
    this.isInitialized = false
    this.initializeData()
    this.dispatchEvents()
  }

  reset(): boolean {
    this.data = [...this.config.defaultData]
    return this.saveToAllBackups()
  }

  // 강제 복구
  forceRecover(): boolean {
    if (!this.isClient()) return false

    console.log(`[v0] ${this.config.storageKey} 강제 복구 시도...`)

    // 모든 가능한 소스에서 데이터 찾기
    const sources = [this.config.backupKey, this.config.storageKey + "-emergency", "rotary-emergency-backup"]

    for (const source of sources) {
      try {
        const data = localStorage.getItem(source)
        if (data) {
          const parsed = JSON.parse(data)
          let targetData = parsed

          // 비상 백업의 경우 특정 키에서 데이터 추출
          if (source === "rotary-emergency-backup") {
            const keyMap: { [key: string]: string } = {
              "rotary-notices": "notices",
              "rotary-gallery": "gallery",
              "rotary-activities": "activities",
              "rotary-member-news": "news",
            }
            const dataKey = keyMap[this.config.storageKey]
            if (dataKey && parsed[dataKey]) {
              targetData = parsed[dataKey]
            }
          }

          if (this.validateData(targetData)) {
            this.data = targetData
            this.saveToAllBackups()
            console.log(`[v0] ${this.config.storageKey} ${source}에서 복구 성공:`, this.data.length, "개")
            return true
          }
        }
      } catch (error) {
        console.error(`[v0] ${source}에서 복구 실패:`, error)
      }
    }

    // 모든 복구 시도 실패 시 기본 데이터 사용
    console.log(`[v0] ${this.config.storageKey} 모든 복구 실패, 기본 데이터 사용`)
    this.data = [...this.config.defaultData]
    this.saveToAllBackups()
    return true
  }
}

// 통합 데이터 매니저 인스턴스들
export interface Notice {
  id: string
  title: string
  content: string
  date: string
  location?: string
  eventDate?: string
  author?: string
  important?: boolean
  type?: string
  details?: {
    date?: string
    time?: string
    location?: string
  }
}

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

export interface Activity {
  id: string
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
  id: string
  title: string
  date: string
  content: string
  category: string
  type?: string
}

// 기본 데이터
const defaultNotices: Notice[] = [
  {
    id: "default-1",
    title: "2025-26년 9월 이사회 개최",
    content: "이사회가 개최됩니다.",
    date: "2025-09-19",
    location: "장수만세국수 (권덕용 회원)",
    eventDate: "2025.09.26.금요일",
    author: "관리자",
    important: true,
    type: "중요",
  },
]

const defaultGallery: GalleryImage[] = [
  {
    id: "default-1",
    title: "경주중앙로타리클럽 제21대 22대 회장단 이취임식",
    description: "천상 天翔 최용환 회장 이취임식",
    date: "2024-07-01",
    location: "경주 힐튼호텔",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
]

const defaultActivities: Activity[] = [
  {
    id: "default-1",
    title: "지역사회 기부금 전달",
    date: "2025-07-22",
    location: "경주시청",
    description: "경주 지역 소외계층을 위한 기부금을 전달했습니다.",
    amount: "200만원",
    participants: "12명",
    type: "기부활동",
    image: "/placeholder.svg?height=300&width=400",
  },
]

const defaultMemberNews: MemberNews[] = [
  {
    id: "default-1",
    title: "신입회원 환영식",
    date: "2025-08-10",
    content: "새로운 회원들을 환영하는 시간을 가졌습니다.",
    category: "회원소식",
    type: "회원소식",
  },
]

// 통합 데이터 매니저 인스턴스들
export const unifiedNoticesManager = new UnifiedDataManager<Notice>({
  storageKey: "rotary-notices",
  backupKey: "rotary-notices-backup",
  timestampKey: "rotary-notices-timestamp",
  defaultData: defaultNotices,
  eventName: "noticesUpdated",
})

export const unifiedGalleryManager = new UnifiedDataManager<GalleryImage>({
  storageKey: "rotary-gallery",
  backupKey: "rotary-gallery-backup",
  timestampKey: "rotary-gallery-timestamp",
  defaultData: defaultGallery,
  eventName: "galleryUpdated",
})

export const unifiedActivitiesManager = new UnifiedDataManager<Activity>({
  storageKey: "rotary-activities",
  backupKey: "rotary-activities-backup",
  timestampKey: "rotary-activities-timestamp",
  defaultData: defaultActivities,
  eventName: "activitiesUpdated",
})

export const unifiedMemberNewsManager = new UnifiedDataManager<MemberNews>({
  storageKey: "rotary-member-news",
  backupKey: "rotary-member-news-backup",
  timestampKey: "rotary-member-news-timestamp",
  defaultData: defaultMemberNews,
  eventName: "memberNewsUpdated",
})

// 전역 데이터 동기화 및 복구 시스템
export const setupUnifiedDataSync = () => {
  if (typeof window === "undefined") return

  console.log("[v0] 통합 데이터 동기화 시스템 초기화")

  // 페이지 로드 시 모든 데이터 검증
  const validateAllData = () => {
    const managers = [unifiedNoticesManager, unifiedGalleryManager, unifiedActivitiesManager, unifiedMemberNewsManager]

    managers.forEach((manager) => {
      try {
        const data = manager.getAll()
        if (data.length === 0) {
          console.log(`[v0] 빈 데이터 감지, 복구 시도: ${manager.constructor.name}`)
          manager.forceRecover()
        }
      } catch (error) {
        console.error(`[v0] 데이터 검증 오류:`, error)
        manager.forceRecover()
      }
    })
  }

  // 스토리지 이벤트 리스너
  window.addEventListener("storage", (e) => {
    if (e.key?.startsWith("rotary-")) {
      console.log(`[v0] 스토리지 변경 감지: ${e.key}`)
      // 해당 매니저 새로고침
      if (e.key.includes("notices")) unifiedNoticesManager.refresh()
      if (e.key.includes("gallery")) unifiedGalleryManager.refresh()
      if (e.key.includes("activities")) unifiedActivitiesManager.refresh()
      if (e.key.includes("member-news")) unifiedMemberNewsManager.refresh()
    }
  })

  // 페이지 가시성 변경 시 데이터 검증
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      console.log("[v0] 페이지 활성화, 데이터 검증 시작")
      setTimeout(validateAllData, 100)
    }
  })

  // 페이지 언로드 시 비상 백업
  window.addEventListener("beforeunload", () => {
    try {
      const emergencyBackup = {
        notices: unifiedNoticesManager.getAll(),
        gallery: unifiedGalleryManager.getAll(),
        activities: unifiedActivitiesManager.getAll(),
        memberNews: unifiedMemberNewsManager.getAll(),
        timestamp: Date.now(),
      }
      localStorage.setItem("rotary-emergency-backup", JSON.stringify(emergencyBackup))
      console.log("[v0] 비상 백업 저장 완료")
    } catch (error) {
      console.error("[v0] 비상 백업 실패:", error)
    }
  })

  // 초기 데이터 검증
  setTimeout(validateAllData, 500)
}

// 전역 복구 함수
export const recoverAllUnifiedData = () => {
  console.log("[v0] 모든 데이터 강제 복구 시작")

  const results = {
    notices: unifiedNoticesManager.forceRecover(),
    gallery: unifiedGalleryManager.forceRecover(),
    activities: unifiedActivitiesManager.forceRecover(),
    memberNews: unifiedMemberNewsManager.forceRecover(),
  }

  console.log("[v0] 데이터 복구 결과:", results)
  return results
}
