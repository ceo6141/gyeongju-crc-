export interface Notice {
  id: string
  title: string
  content: string
  date: string
  author: string
  image?: string
}

export interface Activity {
  id: string
  title: string
  content: string
  date: string
  location: string
  participants: number
  image?: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string
  date: string
  image: string
}

class SimpleDataManager {
  private static instance: SimpleDataManager

  static getInstance(): SimpleDataManager {
    if (!SimpleDataManager.instance) {
      SimpleDataManager.instance = new SimpleDataManager()
    }
    return SimpleDataManager.instance
  }

  // 공지사항 관리
  getNotices(): Notice[] {
    try {
      const data = localStorage.getItem("rotary-notices")
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("공지사항 로드 실패:", error)
      return []
    }
  }

  saveNotices(notices: Notice[]): boolean {
    try {
      localStorage.setItem("rotary-notices", JSON.stringify(notices))
      console.log("[v0] 공지사항 저장 성공:", notices.length, "개")
      return true
    } catch (error) {
      console.error("공지사항 저장 실패:", error)
      return false
    }
  }

  addNotice(notice: Omit<Notice, "id">): boolean {
    try {
      const notices = this.getNotices()
      const newNotice: Notice = {
        ...notice,
        id: Date.now().toString(),
      }
      notices.unshift(newNotice)
      return this.saveNotices(notices)
    } catch (error) {
      console.error("공지사항 추가 실패:", error)
      return false
    }
  }

  updateNotice(id: string, updatedNotice: Partial<Notice>): boolean {
    try {
      const notices = this.getNotices()
      const index = notices.findIndex((n) => n.id === id)
      if (index !== -1) {
        notices[index] = { ...notices[index], ...updatedNotice }
        return this.saveNotices(notices)
      }
      return false
    } catch (error) {
      console.error("공지사항 수정 실패:", error)
      return false
    }
  }

  deleteNotice(id: string): boolean {
    try {
      const notices = this.getNotices()
      const filteredNotices = notices.filter((n) => n.id !== id)
      return this.saveNotices(filteredNotices)
    } catch (error) {
      console.error("공지사항 삭제 실패:", error)
      return false
    }
  }

  // 봉사활동 관리
  getActivities(): Activity[] {
    try {
      const data = localStorage.getItem("rotary-activities")
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("봉사활동 로드 실패:", error)
      return []
    }
  }

  saveActivities(activities: Activity[]): boolean {
    try {
      localStorage.setItem("rotary-activities", JSON.stringify(activities))
      console.log("[v0] 봉사활동 저장 성공:", activities.length, "개")
      return true
    } catch (error) {
      console.error("봉사활동 저장 실패:", error)
      return false
    }
  }

  addActivity(activity: Omit<Activity, "id">): boolean {
    try {
      const activities = this.getActivities()
      const newActivity: Activity = {
        ...activity,
        id: Date.now().toString(),
      }
      activities.unshift(newActivity)
      return this.saveActivities(activities)
    } catch (error) {
      console.error("봉사활동 추가 실패:", error)
      return false
    }
  }

  updateActivity(id: string, updatedActivity: Partial<Activity>): boolean {
    try {
      const activities = this.getActivities()
      const index = activities.findIndex((a) => a.id === id)
      if (index !== -1) {
        activities[index] = { ...activities[index], ...updatedActivity }
        return this.saveActivities(activities)
      }
      return false
    } catch (error) {
      console.error("봉사활동 수정 실패:", error)
      return false
    }
  }

  deleteActivity(id: string): boolean {
    try {
      const activities = this.getActivities()
      const filteredActivities = activities.filter((a) => a.id !== id)
      return this.saveActivities(filteredActivities)
    } catch (error) {
      console.error("봉사활동 삭제 실패:", error)
      return false
    }
  }

  // 클럽갤러리 관리
  getGalleryItems(): GalleryItem[] {
    try {
      const data = localStorage.getItem("rotary-gallery")
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("클럽갤러리 로드 실패:", error)
      return []
    }
  }

  saveGalleryItems(items: GalleryItem[]): boolean {
    try {
      localStorage.setItem("rotary-gallery", JSON.stringify(items))
      console.log("[v0] 클럽갤러리 저장 성공:", items.length, "개")
      return true
    } catch (error) {
      console.error("클럽갤러리 저장 실패:", error)
      return false
    }
  }

  addGalleryItem(item: Omit<GalleryItem, "id">): boolean {
    try {
      const items = this.getGalleryItems()
      const newItem: GalleryItem = {
        ...item,
        id: Date.now().toString(),
      }
      items.unshift(newItem)
      return this.saveGalleryItems(items)
    } catch (error) {
      console.error("클럽갤러리 추가 실패:", error)
      return false
    }
  }

  updateGalleryItem(id: string, updatedItem: Partial<GalleryItem>): boolean {
    try {
      const items = this.getGalleryItems()
      const index = items.findIndex((i) => i.id === id)
      if (index !== -1) {
        items[index] = { ...items[index], ...updatedItem }
        return this.saveGalleryItems(items)
      }
      return false
    } catch (error) {
      console.error("클럽갤러리 수정 실패:", error)
      return false
    }
  }

  deleteGalleryItem(id: string): boolean {
    try {
      const items = this.getGalleryItems()
      const filteredItems = items.filter((i) => i.id !== id)
      return this.saveGalleryItems(filteredItems)
    } catch (error) {
      console.error("클럽갤러리 삭제 실패:", error)
      return false
    }
  }
}

export const dataManager = SimpleDataManager.getInstance()
