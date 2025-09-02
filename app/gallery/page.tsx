"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Camera, Settings, X, Search } from "lucide-react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"

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

const defaultImages: GalleryImage[] = [
  {
    id: "default-1",
    title: "경주중앙로타리클럽 정기모임",
    description: "매월 첫째, 셋째주 목요일 정기모임 모습",
    date: "2025-01-16",
    location: "경주중앙로타리클럽 회관",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-2",
    title: "봉사활동 - 지역사회 기부금 전달",
    description: "경주 지역 소외계층을 위한 기부금 전달식",
    date: "2025-01-10",
    location: "경주시청",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-3",
    title: "신입회원 환영식",
    description: "새로운 회원들을 환영하는 특별한 시간",
    date: "2025-01-05",
    location: "경주중앙로타리클럽 회관",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
]

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
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
  const [zoomedImage, setZoomedImage] = useState<GalleryImage | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const { requireAuth, showLogin, setShowLogin, handleLoginSuccess } = useAdminAuth()

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

    const finalImages = userImages.length > 0 ? userImages : defaultImages
    setImages(finalImages)
    console.log("[v0] 갤러리 이미지 설정 완료:", finalImages.length, "개")

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gallery-images") {
        console.log("[v0] 갤러리 페이지 Storage 변경 감지, 재로드")
        const newImages = e.newValue ? JSON.parse(e.newValue) : []
        setImages(newImages)
      }
    }

    const handleFocus = () => {
      console.log("[v0] 갤러리 페이지 포커스, 데이터 재로드")
      const currentImages = localStorage.getItem("gallery-images")
      if (currentImages) {
        try {
          const parsedImages = JSON.parse(currentImages)
          setImages(parsedImages)
        } catch (error) {
          console.error("[v0] 갤러리 포커스 시 데이터 로드 오류:", error)
        }
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("[v0] 갤러리 페이지 가시성 변경, 데이터 재로드")
        const currentImages = localStorage.getItem("gallery-images")
        if (currentImages) {
          try {
            const parsedImages = JSON.parse(currentImages)
            setImages(parsedImages)
          } catch (error) {
            console.error("[v0] 갤러리 가시성 변경 시 데이터 로드 오류:", error)
          }
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
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
    requireAuth(() => openEditDialog(image))
  }

  const handleDeleteClick = (id: string) => {
    requireAuth(() => {
      if (confirm("이 사진을 삭제하시겠습니까?")) {
        const updatedImages = images.filter((img) => img.id !== id)
        saveImages(updatedImages)
        console.log("[v0] 이미지 삭제 완료:", id)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Camera className="h-10 w-10" />
              갤러리
            </h1>
            <p className="text-gray-600 text-lg">경주중앙로타리클럽의 소중한 순간들을 담았습니다</p>
          </div>

          <div className="mb-8 text-center flex justify-center gap-4">
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="lg"
              className="gap-2"
              onClick={handleEditModeToggle}
            >
              <Settings className="h-5 w-5" />
              {isEditMode ? "편집모드 종료" : "편집모드"}
            </Button>

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
                        src={image.imageUrl || "/placeholder.svg?height=300&width=400&query=gallery"}
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

          <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  )
}
