export interface DataBackupConfig {
  mainKey: string
  backupKey: string
  timestampKey: string
  defaultData: any[]
}

export class DataPersistenceManager {
  private config: DataBackupConfig

  constructor(config: DataBackupConfig) {
    this.config = config
  }

  // 데이터 로드 (이중 백업 시스템)
  loadData<T>(): T[] {
    if (typeof window === "undefined") return this.config.defaultData

    const mainData = localStorage.getItem(this.config.mainKey)
    const backupData = localStorage.getItem(this.config.backupKey)

    let loadedData: T[] = []

    if (mainData) {
      try {
        loadedData = JSON.parse(mainData)
        console.log(`[v0] ${this.config.mainKey} 메인 데이터 로드 성공:`, loadedData.length, "개")
      } catch (error) {
        console.log(`[v0] ${this.config.mainKey} 메인 데이터 파싱 실패, 백업 데이터 시도`)
        if (backupData) {
          try {
            loadedData = JSON.parse(backupData)
            console.log(`[v0] ${this.config.mainKey} 백업 데이터 복구 성공:`, loadedData.length, "개")
          } catch (backupError) {
            console.log(`[v0] ${this.config.mainKey} 백업 데이터도 파싱 실패, 기본 데이터 사용`)
            loadedData = this.config.defaultData
          }
        } else {
          loadedData = this.config.defaultData
        }
      }
    } else if (backupData) {
      try {
        loadedData = JSON.parse(backupData)
        console.log(`[v0] ${this.config.mainKey} 백업에서 데이터 로드:`, loadedData.length, "개")
      } catch (error) {
        loadedData = this.config.defaultData
      }
    } else {
      loadedData = this.config.defaultData
      console.log(`[v0] ${this.config.mainKey} 기본 데이터 초기화:`, loadedData.length, "개")
    }

    return loadedData
  }

  // 데이터 저장 (이중 백업)
  saveData<T>(data: T[]): boolean {
    if (typeof window === "undefined") return false

    try {
      const dataString = JSON.stringify(data)
      const timestamp = new Date().toISOString()

      // 메인 저장
      localStorage.setItem(this.config.mainKey, dataString)
      // 백업 저장
      localStorage.setItem(this.config.backupKey, dataString)
      // 타임스탬프 저장
      localStorage.setItem(this.config.timestampKey, timestamp)

      console.log(`[v0] ${this.config.mainKey} 저장 완료 (이중 백업):`, data.length, "개")

      // 다른 탭/창에 데이터 변경 알림
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: this.config.mainKey,
          newValue: dataString,
        }),
      )

      return true
    } catch (error) {
      console.error(`[v0] ${this.config.mainKey} 저장 실패:`, error)
      return false
    }
  }

  // 수동 백업 다운로드
  downloadBackup<T>(data: T[], filename: string): void {
    try {
      const dataString = JSON.stringify(data, null, 2)
      const blob = new Blob([dataString], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      console.log(`[v0] ${filename} 수동 백업 다운로드 완료`)
    } catch (error) {
      console.error(`[v0] ${filename} 백업 다운로드 실패:`, error)
    }
  }

  // 데이터 복구 (백업에서)
  recoverFromBackup<T>(): T[] | null {
    if (typeof window === "undefined") return null

    const backupData = localStorage.getItem(this.config.backupKey)
    if (backupData) {
      try {
        const recoveredData = JSON.parse(backupData)
        // 메인 데이터를 백업 데이터로 복구
        localStorage.setItem(this.config.mainKey, backupData)
        console.log(`[v0] ${this.config.mainKey} 백업에서 복구 완료:`, recoveredData.length, "개")
        return recoveredData
      } catch (error) {
        console.error(`[v0] ${this.config.mainKey} 백업 복구 실패:`, error)
        return null
      }
    }
    return null
  }

  // 데이터 무결성 검사
  validateData<T>(data: T[]): boolean {
    return Array.isArray(data) && data.every((item) => item && typeof item === "object")
  }
}

// 각 페이지별 데이터 매니저 인스턴스
export const noticesDataManager = new DataPersistenceManager({
  mainKey: "rotary-notices",
  backupKey: "rotary-notices-backup",
  timestampKey: "rotary-notices-timestamp",
  defaultData: [
    {
      id: "default-1",
      title: "2025-26년 9월 이사회 개최",
      content: "이사회",
      date: "2025-09-19",
      location: "장수만세국수 (권덕용 회원)",
      eventDate: "2025.09.26.금요일",
      author: "관리자",
      important: true,
    },
  ],
})

export const activitiesDataManager = new DataPersistenceManager({
  mainKey: "rotary-activities",
  backupKey: "rotary-activities-backup",
  timestampKey: "rotary-activities-timestamp",
  defaultData: [
    {
      id: "default-1",
      title: "지역사회 봉사활동",
      description: "경주 지역 어려운 이웃을 위한 봉사활동",
      date: "2025-09-15",
      location: "경주시 일원",
      participants: 15,
      status: "planned",
    },
  ],
})

export const galleryDataManager = new DataPersistenceManager({
  mainKey: "rotary-gallery",
  backupKey: "rotary-gallery-backup",
  timestampKey: "rotary-gallery-timestamp",
  defaultData: [
    {
      id: "default-1",
      title: "로타리클럽 정기모임",
      imageUrl: "/placeholder.svg?height=300&width=400&text=로타리클럽 정기모임",
      date: "2025-09-01",
      description: "경주중앙로타리클럽 정기모임 사진",
    },
  ],
})

// 전역 데이터 동기화 이벤트 리스너
export const setupGlobalDataSync = () => {
  if (typeof window === "undefined") return

  // localStorage 변경 감지
  window.addEventListener("storage", (e) => {
    if (e.key?.startsWith("rotary-")) {
      console.log(`[v0] 데이터 동기화 감지: ${e.key}`)
      // 페이지 새로고침 없이 데이터 동기화
      window.dispatchEvent(
        new CustomEvent("rotaryDataSync", {
          detail: { key: e.key, newValue: e.newValue },
        }),
      )
    }
  })

  // 페이지 가시성 변경 시 데이터 재로드
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      console.log("[v0] 페이지 활성화, 데이터 동기화 확인")
      window.dispatchEvent(new CustomEvent("rotaryDataRefresh"))
    }
  })
}
