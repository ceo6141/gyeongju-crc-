"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Camera, X, Search, Calendar, MapPin, Users, Banknote } from "lucide-react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GalleryImage {
  id: string
  title: string
  description: string
  date: string
  location: string
  imageUrl: string
  originalWidth?: number
  originalHeight?: number
}

interface Activity {
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

interface MemberNews {
  id: number
  title: string
  date: string
  content: string
  type: string
  author?: string
}

const defaultImages: GalleryImage[] = [
  {
    id: "default-1",
    title: "경주중앙로타리클럽 정기모임",
    description: "매월 첫째, 셋째주 목요일 정기모임 모습",
    date: "2025-01-16",
    location: "경주중앙로타리클럽 회관",
    imageUrl: "/placeholder.svg?height=300&width=400&text=정기모임",
  },
  {
    id: "default-2",
    title: "APEC 회원국 초청 국제 유소년대회 일본 테소로팀 응원 봉사",
    description: "국제 유소년 축구대회에서 일본팀을 응원하며 국제친선에 기여",
    date: "2025-01-20",
    location: "경주월드컵경기장",
    imageUrl: "/placeholder.svg?height=300&width=400&text=APEC+유소년대회",
  },
  {
    id: "default-3",
    title: "지역사회 기부금 전달식",
    description: "경주 지역 소외계층을 위한 기부금 전달 봉사활동",
    date: "2025-01-15",
    location: "경주시청",
    imageUrl: "/placeholder.svg?height=300&width=400&text=기부금+전달식",
  },
  {
    id: "default-4",
    title: "신입회원 환영식",
    description: "새로운 회원들을 환영하는 특별한 시간",
    date: "2025-01-10",
    location: "경주중앙로타리클럽 회관",
    imageUrl: "/placeholder.svg?height=300&width=400&text=신입회원+환영식",
  },
]

const defaultActivities: Activity[] = [
  {
    id: "default-activity-1",
    title: "APEC 회원국 초청 국제 유소년대회 일본 테소로팀 응원 봉사",
    description: "국제 유소년 축구대회에서 일본팀을 응원하며 국제친선에 기여하는 봉사활동을 진행했습니다.",
    date: "2025-01-20",
    location: "경주월드컵경기장",
    type: "국제친선",
    participants: "회원 25명",
    amount: "후원금 200만원",
    image: "/images/apec-youth-soccer.jpg",
  },
  {
    id: "default-activity-2",
    title: "지역사회 기부금 전달식",
    description: "경주 지역 소외계층을 위한 기부금 전달 봉사활동을 실시했습니다.",
    date: "2025-01-15",
    location: "경주시청",
    type: "지역봉사",
    participants: "회원 15명",
    amount: "기부금 500만원",
    image: "/images/donation-ceremony.jpg",
  },
]

const defaultMemberNews: MemberNews[] = [
  {
    id: "default-news-1",
    title: "신입회원 환영식 개최",
    content:
      "새로운 회원들을 환영하는 특별한 시간을 가졌습니다. 로타리 정신을 함께 실천할 동반자들을 맞이하게 되어 기쁩니다.",
    date: "2025-01-10",
    author: "총무 최병준",
    image: "/gyeongju-rotary-president.png",
  },
]

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [memberNews, setMemberNews] = useState<MemberNews[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  })
  const [activityFormData, setActivityFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    amount: "",
    participants: "",
    type: "봉사활동",
    image: "",
  })
  const [memberNewsFormData, setMemberNewsFormData] = useState({
    title: "",
    date: "",
    content: "",
    type: "회원소식",
  })
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [isMemberNewsDialogOpen, setIsMemberNewsDialogOpen] = useState(false)
  const [isEditingActivity, setIsEditingActivity] = useState(false)
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null)
  const [zoomedImage, setZoomedImage] = useState<GalleryImage | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const { requireAuth, showLogin, setShowLogin, handleLoginSuccess } = useAdminAuth()

  const loadActivitiesData = () => {
    console.log("[v0] 갤러리 페이지 봉사활동 데이터 로딩 시작")
    try {
      const savedActivities = localStorage.getItem("homepage-activities")
      const savedMemberNews = localStorage.getItem("homepage-news")

      const activitiesData = savedActivities ? JSON.parse(savedActivities) : defaultActivities
      const memberNewsData = savedMemberNews ? JSON.parse(savedMemberNews) : defaultMemberNews

      setActivities(activitiesData)
      setMemberNews(memberNewsData)

      console.log(
        "[v0] 갤러리 페이지 봉사활동 데이터 로딩 완료 - 봉사활동:",
        activitiesData.length,
        "개, 회원소식:",
        memberNewsData.length,
        "개",
      )
    } catch (error) {
      console.error("[v0] 갤러리 페이지 봉사활동 데이터 로딩 오류:", error)
      setActivities(defaultActivities)
      setMemberNews(defaultMemberNews)
    }
  }

  const saveActivitiesData = (newActivities: Activity[], newMemberNews: MemberNews[]) => {
    try {
      const activitiesJson = JSON.stringify(newActivities)
      const newsJson = JSON.stringify(newMemberNews)

      localStorage.setItem("homepage-activities", activitiesJson)
      localStorage.setItem("homepage-news", newsJson)

      setActivities([...newActivities])
      setMemberNews([...newMemberNews])

      setTimeout(() => {
        const savedActivities = localStorage.getItem("homepage-activities")
        const savedNews = localStorage.getItem("homepage-news")

        if (savedActivities && savedNews) {
          const parsedActivities = JSON.parse(savedActivities)
          const parsedNews = JSON.parse(savedNews)

          setActivities([...parsedActivities])
          setMemberNews([...parsedNews])

          console.log(
            "[v0] 갤러리 페이지 봉사활동 데이터 저장 완료 - 봉사활동:",
            parsedActivities.length,
            "개, 회원소식:",
            parsedNews.length,
            "개",
          )

          window.dispatchEvent(
            new CustomEvent("activitiesUpdated", {
              detail: { activities: parsedActivities, news: parsedNews },
            }),
          )
        }
      }, 200)

      return true
    } catch (error) {
      console.error("[v0] 갤러리 페이지 봉사활동 데이터 저장 오류:", error)
      alert("데이터 저장 중 오류가 발생했습니다.")
      return false
    }
  }

  useEffect(() => {
    const savedImages = localStorage.getItem("gallery-images")
    let userImages: GalleryImage[] = []

    if (savedImages) {
      try {
        userImages = JSON.parse(savedImages)
        console.log("[v0] 사용자 갤러리 이미지 로드됨:", userImages.length, "개")
      } catch (error) {
        console.error("갤러리 이미지 로드 오류:", error)
        userImages = []
      }
    }

    const finalImages = userImages.length > 0 ? [...defaultImages, ...userImages] : defaultImages
    setImages(finalImages)
    console.log("[v0] 갤러리 이미지 설정 완료:", finalImages.length, "개 (기본 4개 + 사용자", userImages.length, "개)")

    loadActivitiesData()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gallery-images") {
        console.log("[v0] 갤러리 페이지 Storage 변경 감지, 재로드")
        const newImages = e.newValue ? JSON.parse(e.newValue) : []
        const finalNewImages = newImages.length > 0 ? [...defaultImages, ...newImages] : defaultImages
        setImages(finalNewImages)
      }
      if (e.key === "homepage-activities" || e.key === "homepage-news") {
        console.log("[v0] 갤러리 페이지 봉사활동 Storage 변경 감지, 재로드")
        loadActivitiesData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const processImage = (file: File): Promise<{ dataUrl: string; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const result = reader.result as string

        const img = new window.Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          const maxWidth = 1920
          const maxHeight = 1080
          let { width, height } = img

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = width * ratio
            height = height * ratio
          }

          canvas.width = width
          canvas.height = height

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8) // 80% 품질로 압축

            resolve({
              dataUrl: compressedDataUrl,
              width: img.naturalWidth,
              height: img.naturalHeight,
            })
          } else {
            reject(new Error("Canvas context 생성 실패"))
          }
        }
        img.onerror = () => reject(new Error("이미지 로드 실패"))
        img.src = result
      }

      reader.onerror = () => reject(new Error("파일 읽기 실패"))
      reader.readAsDataURL(file)
    })
  }

  const saveImages = (newImages: GalleryImage[]) => {
    try {
      const dataString = JSON.stringify(newImages)
      const dataSize = new Blob([dataString]).size
      console.log("[v0] 갤러리 데이터 크기:", Math.round(dataSize / 1024), "KB")

      if (dataSize > 4.5 * 1024 * 1024) {
        throw new Error("데이터 크기가 너무 큽니다. 이미지 수를 줄이거나 크기를 줄여주세요.")
      }

      localStorage.setItem("gallery-images", dataString)

      setTimeout(() => {
        const savedData = localStorage.getItem("gallery-images")
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData)
            if (parsedData.length === newImages.length) {
              setImages(newImages)
              console.log("[v0] 갤러리 이미지 저장 및 검증 완료:", newImages.length, "개")

              // 다른 페이지에 데이터 변경 알림
              window.dispatchEvent(
                new CustomEvent("galleryUpdated", {
                  detail: { images: newImages },
                }),
              )
            } else {
              throw new Error("데이터 저장 검증 실패")
            }
          } catch (error) {
            console.error("[v0] 갤러리 저장 검증 오류:", error)
            throw error
          }
        }
      }, 100)

      if (newImages.length > 0) {
        console.log("[v0] 갤러리 데이터 지속성 확인됨")
      }
    } catch (error) {
      console.error("[v0] 갤러리 이미지 저장 오류:", error)
      alert(`이미지 저장 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
      throw error
    }
  }

  const handleAddImageClick = () => {
    requireAuth(() => setIsAddDialogOpen(true))
  }

  const handleAddImage = async () => {
    if (!selectedFile || !formData.title.trim()) {
      alert("사진과 제목을 입력해주세요.")
      return
    }

    try {
      console.log("[v0] 사진 추가 시작:", selectedFile.name)

      const { dataUrl, width, height } = await processImage(selectedFile)

      const newImage: GalleryImage = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        imageUrl: dataUrl,
        originalWidth: width,
        originalHeight: height,
      }

      const updatedImages = [...images, newImage]
      saveImages(updatedImages)

      console.log("[v0] 사진 추가 완료")

      setFormData({ title: "", description: "", date: "", location: "" })
      setSelectedFile(null)
      setIsAddDialogOpen(false)

      alert("사진이 성공적으로 추가되었습니다!")
    } catch (error) {
      console.error("[v0] 사진 추가 오류:", error)
      alert("사진 추가 중 오류가 발생했습니다.")
    }
  }

  const handleEditClick = (image: GalleryImage) => {
    console.log("[v0] 수정 요청:", image.title)
    requireAuth(() => openEditDialog(image))
  }

  const handleDeleteClick = (id: string) => {
    requireAuth(() => {
      console.log("[v0] 삭제 요청:", id)
      if (confirm("이 사진을 삭제하시겠습니까?")) {
        const updatedImages = images.filter((img) => img.id !== id)
        saveImages(updatedImages)
        console.log("[v0] 이미지 삭제 완료:", id)
        alert("사진이 성공적으로 삭제되었습니다!")
      }
    })
  }

  const openEditDialog = (image: GalleryImage) => {
    setEditingImage(image)
    setFormData({
      title: image.title,
      description: image.description,
      date: image.date,
      location: image.location,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditImage = async () => {
    if (!editingImage || !formData.title.trim()) {
      alert("사진과 제목을 입력해주세요.")
      return
    }

    try {
      console.log("[v0] 사진 수정 시작:", editingImage.title)

      let newImageUrl = editingImage.imageUrl
      let originalWidth = editingImage.originalWidth
      let originalHeight = editingImage.originalHeight

      if (selectedFile) {
        const { dataUrl, width, height } = await processImage(selectedFile)
        newImageUrl = dataUrl
        originalWidth = width
        originalHeight = height
      }

      const updatedImage: GalleryImage = {
        ...editingImage,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        imageUrl: newImageUrl,
        originalWidth,
        originalHeight,
      }

      const updatedImages = images.map((img) => (img.id === editingImage.id ? updatedImage : img))
      saveImages(updatedImages)

      console.log("[v0] 사진 수정 완료")

      setFormData({ title: "", description: "", date: "", location: "" })
      setSelectedFile(null)
      setIsEditDialogOpen(false)

      alert("사진이 성공적으로 수정되었습니다!")
    } catch (error) {
      console.error("[v0] 사진 수정 오류:", error)
      alert("사진 수정 중 오류가 발생했습니다.")
    }
  }

  const handleImageClick = (image: GalleryImage) => {
    console.log("[v0] 이미지 클릭됨:", image.title, "편집모드:", isEditMode)
    if (!isEditMode) {
      console.log("[v0] 이미지 확대 시작")
      setZoomedImage(image)
    }
  }

  const closeZoom = () => {
    console.log("[v0] 이미지 확대 종료")
    setZoomedImage(null)
  }

  const handleEditModeToggle = () => {
    console.log("[v0] 편집모드 토글 요청")
    requireAuth(() => {
      console.log("[v0] 편집모드 변경:", !isEditMode)
      setIsEditMode(!isEditMode)
      if (!isEditMode) {
        alert("편집 모드가 활성화되었습니다. 이제 사진을 수정하거나 삭제할 수 있습니다.")
      } else {
        alert("편집 모드가 비활성화되었습니다.")
      }
    })
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (images.length > 0) {
        try {
          localStorage.setItem("gallery-images", JSON.stringify(images))
          console.log("[v0] 페이지 언로드 시 갤러리 데이터 저장")
        } catch (error) {
          console.error("[v0] 페이지 언로드 시 저장 오류:", error)
        }
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [images])

  const handleAddActivity = () => {
    requireAuth(() => {
      setIsEditingActivity(false)
      setEditingActivityId(null)
      setActivityFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        amount: "",
        participants: "",
        type: "봉사활동",
        image: "",
      })
      setIsActivityDialogOpen(true)
      console.log("[v0] 갤러리 페이지 봉사활동 추가 다이얼로그 열기")
    })
  }

  const handleEditActivity = (activity: Activity) => {
    requireAuth(() => {
      setIsEditingActivity(true)
      setEditingActivityId(activity.id)
      setActivityFormData({
        title: activity.title,
        date: activity.date,
        location: activity.location || "",
        description: activity.description || "",
        amount: activity.amount || "",
        participants: activity.participants || "",
        type: activity.type,
        image: activity.image || "",
      })
      setIsActivityDialogOpen(true)
      console.log("[v0] 갤러리 페이지 봉사활동 수정 다이얼로그 열기:", activity.title)
    })
  }

  const handleDeleteActivity = (id: number) => {
    requireAuth(() => {
      const activity = activities.find((a) => a.id === id)
      if (activity && confirm(`"${activity.title}" 봉사활동을 삭제하시겠습니까?`)) {
        const newActivities = activities.filter((a) => a.id !== id)
        if (saveActivitiesData(newActivities, memberNews)) {
          alert("봉사활동이 삭제되었습니다.")
        }
      }
    })
  }

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activityFormData.title || !activityFormData.date) {
      alert("제목과 날짜는 필수입니다.")
      return
    }

    const newActivity: Activity = {
      id: isEditingActivity ? editingActivityId! : Date.now(),
      title: activityFormData.title,
      date: activityFormData.date,
      location: activityFormData.location,
      description: activityFormData.description,
      amount: activityFormData.amount,
      participants: activityFormData.participants,
      type: activityFormData.type,
      image: activityFormData.image,
    }

    let newActivities: Activity[]
    if (isEditingActivity) {
      newActivities = activities.map((a) => (a.id === editingActivityId ? newActivity : a))
    } else {
      newActivities = [newActivity, ...activities]
    }

    if (saveActivitiesData(newActivities, memberNews)) {
      setIsActivityDialogOpen(false)
      alert(isEditingActivity ? "봉사활동이 성공적으로 수정되었습니다!" : "봉사활동이 성공적으로 추가되었습니다!")
    }
  }

  const handleAddMemberNews = () => {
    requireAuth(() => {
      setIsEditingActivity(false)
      setEditingActivityId(null)
      setMemberNewsFormData({
        title: "",
        date: "",
        content: "",
        type: "회원소식",
      })
      setIsMemberNewsDialogOpen(true)
    })
  }

  const handleEditMemberNews = (news: MemberNews) => {
    requireAuth(() => {
      setIsEditingActivity(true)
      setEditingActivityId(news.id)
      setMemberNewsFormData({
        title: news.title,
        date: news.date,
        content: news.content,
        type: news.type,
      })
      setIsMemberNewsDialogOpen(true)
    })
  }

  const handleDeleteMemberNews = (id: number) => {
    requireAuth(() => {
      const news = memberNews.find((n) => n.id === id)
      if (news && confirm(`"${news.title}" 회원소식을 삭제하시겠습니까?`)) {
        const newMemberNews = memberNews.filter((n) => n.id !== id)
        if (saveActivitiesData(activities, newMemberNews)) {
          alert("회원소식이 삭제되었습니다.")
        }
      }
    })
  }

  const handleSubmitMemberNews = (e: React.FormEvent) => {
    e.preventDefault()
    if (!memberNewsFormData.title || !memberNewsFormData.date || !memberNewsFormData.content) {
      alert("모든 필드를 입력해주세요.")
      return
    }

    const newNews: MemberNews = {
      id: isEditingActivity ? editingActivityId! : Date.now(),
      title: memberNewsFormData.title,
      date: memberNewsFormData.date,
      content: memberNewsFormData.content,
      type: memberNewsFormData.type,
    }

    let newMemberNews: MemberNews[]
    if (isEditingActivity) {
      newMemberNews = memberNews.map((n) => (n.id === editingActivityId ? newNews : n))
    } else {
      newMemberNews = [newNews, ...memberNews]
    }

    if (saveActivitiesData(activities, newMemberNews)) {
      setIsMemberNewsDialogOpen(false)
      alert(isEditingActivity ? "회원소식이 성공적으로 수정되었습니다!" : "회원소식이 성공적으로 추가되었습니다!")
    }
  }

  const handleActivityPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        const maxWidth = 800
        const maxHeight = 600
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
        const compressedImage = canvas.toDataURL("image/jpeg", 0.8)
        setActivityFormData({ ...activityFormData, image: compressedImage })
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Camera className="h-10 w-10" />
              갤러리 & 봉사활동
            </h1>
            <p className="text-gray-600 text-lg">경주중앙로타리클럽의 소중한 순간들과 봉사활동을 확인하세요</p>
          </div>

          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="gallery">갤러리</TabsTrigger>
              <TabsTrigger value="activities">봉사활동</TabsTrigger>
              <TabsTrigger value="member-news">회원소식</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery">
              <div className="mb-8 text-center flex justify-center gap-4">
                <Button
                  onClick={handleEditModeToggle}
                  variant={isEditMode ? "destructive" : "default"}
                  className="mb-4"
                >
                  {isEditMode ? "편집 모드 종료" : "사진 편집하기 (관리자)"}
                </Button>
                {isEditMode && (
                  <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                    <p className="text-yellow-800 font-medium">
                      📝 편집 모드 활성화됨 - 각 사진의 수정/삭제 버튼을 클릭하세요
                    </p>
                  </div>
                )}

                {isEditMode && (
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="gap-2" onClick={handleAddImageClick}>
                        <Plus className="h-5 w-5" />
                        사진 추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>새 사진 추가</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">사진 선택</label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">제목 *</label>
                          <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="사진 제목을 입력하세요"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">설명</label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="사진 설명을 입력하세요"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">날짜</label>
                          <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">장소</label>
                          <Input
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="촬영 장소를 입력하세요"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleAddImage} className="flex-1">
                            추가
                          </Button>
                          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                            취소
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {images.length === 0 ? (
                <div className="text-center py-16">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">아직 등록된 사진이 없습니다.</p>
                  <p className="text-gray-500">첫 번째 사진을 추가해보세요!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative">
                          <Image
                            src={image.imageUrl || "/placeholder.svg?height=300&width=400"}
                            alt={image.title}
                            width={400}
                            height={300}
                            className={`w-full h-48 object-cover ${!isEditMode ? "cursor-pointer" : ""} transition-all duration-300`}
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log("[v0] 이미지 클릭 이벤트 발생:", image.title)
                              handleImageClick(image)
                            }}
                            onError={(e) => {
                              console.log("[v0] 이미지 로드 실패:", image.title)
                              e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                            }}
                          />
                          {isEditMode && (
                            <div className="absolute top-2 right-2 flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleEditClick(image)}
                                className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                              >
                                <Edit className="h-4 w-4" />
                                수정
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteClick(image.id)}
                                className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                                삭제
                              </Button>
                            </div>
                          )}
                          {!isEditMode && (
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="opacity-0 hover:opacity-100 transition-opacity text-white text-sm font-medium">
                                클릭하여 확대
                              </div>
                            </div>
                          )}
                          {!isEditMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log("[v0] 돋보기 클릭:", image.title)
                                setZoomedImage(image)
                              }}
                              className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-200 shadow-md"
                            >
                              <Search className="h-4 w-4 text-gray-700" />
                            </button>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 text-gray-900">{image.title}</h3>
                          {image.description && <p className="text-gray-600 text-sm mb-2">{image.description}</p>}
                          <div className="flex justify-between text-xs text-gray-500">
                            {image.date && <span>{image.date}</span>}
                            {image.location && <span>{image.location}</span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activities">
              <div className="flex justify-center mb-6">
                <Button onClick={handleAddActivity} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />새 봉사활동 추가
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {activity.image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={activity.image || "/placeholder.svg"}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="mb-2">
                          {activity.type}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditActivity(activity)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteActivity(activity.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {activity.date}
                        </div>
                        {activity.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {activity.location}
                          </div>
                        )}
                        {activity.amount && (
                          <div className="flex items-center">
                            <Banknote className="w-4 h-4 mr-2" />
                            {activity.amount}
                          </div>
                        )}
                        {activity.participants && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {activity.participants}
                          </div>
                        )}
                      </div>
                      {activity.description && <p className="text-sm text-gray-700 mt-3">{activity.description}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="member-news">
              <div className="flex justify-center mb-6">
                <Button onClick={handleAddMemberNews} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />새 회원소식 추가
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memberNews.map((news) => (
                  <Card key={news.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2">
                          {news.type}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditMemberNews(news)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteMemberNews(news.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{news.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        {news.date}
                      </div>
                      <p className="text-sm text-gray-700">{news.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {zoomedImage && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[99999] p-4">
              <div className="relative max-w-7xl max-h-full">
                <Image
                  src={zoomedImage.imageUrl || "/placeholder.svg"}
                  alt={zoomedImage.title}
                  width={zoomedImage.originalWidth || 1920}
                  height={zoomedImage.originalHeight || 1440}
                  className="max-w-full max-h-[95vh] object-contain rounded-lg"
                  priority
                  quality={100}
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "100%",
                    maxHeight: "95vh",
                  }}
                />
                <button
                  onClick={closeZoom}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition-colors shadow-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}

          <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditingActivity ? "봉사활동 수정" : "새 봉사활동 추가"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitActivity} className="space-y-4">
                <div>
                  <Label>제목 *</Label>
                  <Input
                    value={activityFormData.title}
                    onChange={(e) => setActivityFormData({ ...activityFormData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>날짜 *</Label>
                  <Input
                    value={activityFormData.date}
                    onChange={(e) => setActivityFormData({ ...activityFormData, date: e.target.value })}
                    required
                    placeholder="2025.01.01"
                  />
                </div>
                <div>
                  <Label>장소</Label>
                  <Input
                    value={activityFormData.location}
                    onChange={(e) => setActivityFormData({ ...activityFormData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label>설명</Label>
                  <Textarea
                    value={activityFormData.description}
                    onChange={(e) => setActivityFormData({ ...activityFormData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>기부금액</Label>
                  <Input
                    value={activityFormData.amount}
                    onChange={(e) => setActivityFormData({ ...activityFormData, amount: e.target.value })}
                    placeholder="100만원"
                  />
                </div>
                <div>
                  <Label>참가자수</Label>
                  <Input
                    value={activityFormData.participants}
                    onChange={(e) => setActivityFormData({ ...activityFormData, participants: e.target.value })}
                    placeholder="10명"
                  />
                </div>
                <div>
                  <Label>유형</Label>
                  <Select
                    value={activityFormData.type}
                    onValueChange={(value) => setActivityFormData({ ...activityFormData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="봉사활동">봉사활동</SelectItem>
                      <SelectItem value="기부활동">기부활동</SelectItem>
                      <SelectItem value="장학사업">장학사업</SelectItem>
                      <SelectItem value="환경보호">환경보호</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>이미지 URL</Label>
                  <Input
                    value={activityFormData.image}
                    onChange={(e) => setActivityFormData({ ...activityFormData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label>또는 파일 업로드</Label>
                  <Input type="file" accept="image/*" onChange={handleActivityPhotoUpload} />
                  {activityFormData.image && (
                    <div className="mt-2">
                      <img
                        src={activityFormData.image || "/placeholder.svg"}
                        alt="미리보기"
                        className="w-32 h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsActivityDialogOpen(false)}>
                    취소
                  </Button>
                  <Button type="submit">{isEditingActivity ? "수정" : "추가"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isMemberNewsDialogOpen} onOpenChange={setIsMemberNewsDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{isEditingActivity ? "회원소식 수정" : "새 회원소식 추가"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitMemberNews} className="space-y-4">
                <div>
                  <Label>제목 *</Label>
                  <Input
                    value={memberNewsFormData.title}
                    onChange={(e) => setMemberNewsFormData({ ...memberNewsFormData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>날짜 *</Label>
                  <Input
                    value={memberNewsFormData.date}
                    onChange={(e) => setMemberNewsFormData({ ...memberNewsFormData, date: e.target.value })}
                    required
                    placeholder="2025년 1월 1일"
                  />
                </div>
                <div>
                  <Label>내용 *</Label>
                  <Textarea
                    value={memberNewsFormData.content}
                    onChange={(e) => setMemberNewsFormData({ ...memberNewsFormData, content: e.target.value })}
                    required
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsMemberNewsDialogOpen(false)}>
                    취소
                  </Button>
                  <Button type="submit">{isEditingActivity ? "수정" : "추가"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  )
}
