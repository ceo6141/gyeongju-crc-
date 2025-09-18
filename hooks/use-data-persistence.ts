"use client"

import { useState, useEffect, useCallback } from "react"

interface UsePersistentDataOptions {
  storageKey: string
  defaultValue: any
  eventName?: string
}

export function usePersistentData<T>({ storageKey, defaultValue, eventName }: UsePersistentDataOptions) {
  const [data, setData] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 데이터 로드
  const loadData = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)

      const savedData = localStorage.getItem(storageKey)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        setData(parsed)
        console.log(`[v0] ${storageKey} 데이터 로드 완료`)
      } else {
        setData(defaultValue)
        console.log(`[v0] ${storageKey} 기본값 사용`)
      }
    } catch (err) {
      console.error(`[v0] ${storageKey} 로드 오류:`, err)
      setError(err instanceof Error ? err.message : "데이터 로드 실패")
      setData(defaultValue)
    } finally {
      setIsLoading(false)
    }
  }, [storageKey, defaultValue])

  // 데이터 저장
  const saveData = useCallback(
    (newData: T) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newData))
        setData(newData)

        // 커스텀 이벤트 발생
        if (eventName) {
          window.dispatchEvent(
            new CustomEvent(eventName, {
              detail: { data: newData },
            }),
          )
        }

        console.log(`[v0] ${storageKey} 저장 완료`)
        return true
      } catch (err) {
        console.error(`[v0] ${storageKey} 저장 오류:`, err)
        setError(err instanceof Error ? err.message : "데이터 저장 실패")
        return false
      }
    },
    [storageKey, eventName],
  )

  // 데이터 업데이트
  const updateData = useCallback(
    (updater: (prevData: T) => T) => {
      const newData = updater(data)
      return saveData(newData)
    },
    [data, saveData],
  )

  // 데이터 초기화
  const resetData = useCallback(() => {
    return saveData(defaultValue)
  }, [defaultValue, saveData])

  // 초기 로드
  useEffect(() => {
    loadData()
  }, [loadData])

  // 스토리지 이벤트 리스너
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        loadData()
      }
    }

    const handleCustomEvent = () => {
      loadData()
    }

    window.addEventListener("storage", handleStorageChange)
    if (eventName) {
      window.addEventListener(eventName, handleCustomEvent)
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      if (eventName) {
        window.removeEventListener(eventName, handleCustomEvent)
      }
    }
  }, [storageKey, eventName, loadData])

  return {
    data,
    setData: saveData,
    updateData,
    resetData,
    refreshData: loadData,
    isLoading,
    error,
  }
}

// 특화된 훅들
export function useNotices() {
  return usePersistentData({
    storageKey: "homepage-notices",
    defaultValue: [],
    eventName: "noticesUpdated",
  })
}

export function useGallery() {
  return usePersistentData({
    storageKey: "gallery-images",
    defaultValue: [],
    eventName: "galleryUpdated",
  })
}

export function useMemberNews() {
  return usePersistentData({
    storageKey: "homepage-news",
    defaultValue: [],
    eventName: "memberNewsUpdated",
  })
}
