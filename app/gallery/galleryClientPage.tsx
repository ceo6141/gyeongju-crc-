"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, TrashIcon, EditIcon, SaveIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"

interface GalleryImage {
  id: string
  title: string
  imageUrl: string
  date: string
  description: string
}

export default function GalleryClientPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [newImage, setNewImage] = useState({
    title: "",
    imageUrl: "",
    description: "",
  })

  const { isAuthenticated, showLogin, setShowLogin, requireAuth, handleLoginSuccess } = useAdminAuth()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedImages = localStorage.getItem("rotary-gallery")
      const backupImages = localStorage.getItem("rotary-gallery-backup")

      let loadedImages: GalleryImage[] = []

      if (savedImages) {
        try {
          loadedImages = JSON.parse(savedImages)
        } catch (error) {
          console.log("[v0] 메인 갤러리 데이터 파싱 실패, 백업 데이터 시도")
          if (backupImages) {
            try {
              loadedImages = JSON.parse(backupImages)
            } catch (backupError) {
              console.log("[v0] 백업 갤러리 데이터도 파싱 실패")
              loadedImages = getDefaultImages()
            }
          } else {
            loadedImages = getDefaultImages()
          }
        }
      } else if (backupImages) {
        try {
          loadedImages = JSON.parse(backupImages)
        } catch (error) {
          loadedImages = getDefaultImages()
        }
      } else {
        loadedImages = getDefaultImages()
      }

      const sortedImages = loadedImages.sort((a: GalleryImage, b: GalleryImage) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      setImages(sortedImages)
      console.log("[v0] 클럽갤러리 로드 완료:", sortedImages.length, "개")
    }
  }, [])

  const getDefaultImages = (): GalleryImage[] => {
    return [
      {
        id: "default-1",
        title: "로타리클럽 정기모임",
        imageUrl: "/placeholder.svg?height=300&width=400&text=로타리클럽 정기모임",
        date: "2025-09-01",
        description: "경주중앙로타리클럽 정기모임 사진",
      },
    ]
  }

  const saveImages = (updatedImages: GalleryImage[]) => {
    if (typeof window !== "undefined") {
      const sortedImages = updatedImages.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      const dataString = JSON.stringify(sortedImages)

      localStorage.setItem("rotary-gallery", dataString)
      localStorage.setItem("rotary-gallery-backup", dataString)
      localStorage.setItem("rotary-gallery-timestamp", new Date().toISOString())

      setImages(sortedImages)
      console.log("[v0] 클럽갤러리 저장 완료 (이중 백업):", sortedImages.length, "개")
    }
  }

  const handleAddClick = () => {
    requireAuth(() => setShowAddForm(!showAddForm))
  }

  const handleAddImage = () => {
    if (!newImage.title.trim() || !newImage.imageUrl.trim()) return

    const image: GalleryImage = {
      id: Date.now().toString(),
      title: newImage.title,
      imageUrl: newImage.imageUrl,
      description: newImage.description,
      date: new Date().toISOString().split("T")[0], // Use ISO date format for better sorting
    }

    const updatedImages = [image, ...images]
    saveImages(updatedImages)

    setNewImage({ title: "", imageUrl: "", description: "" })
    setShowAddForm(false)
    console.log("[v0] 새 갤러리 이미지 추가:", image.title)
  }

  const handleEditImage = (image: GalleryImage) => {
    requireAuth(() => {
      setEditingImage(image)
      setNewImage({
        title: image.title,
        imageUrl: image.imageUrl,
        description: image.description,
      })
      setShowAddForm(true)
      console.log("[v0] 갤러리 이미지 편집 모드 활성화:", image.title)
    })
  }

  const handleUpdateImage = () => {
    if (!editingImage || !newImage.title.trim() || !newImage.imageUrl.trim()) return

    const updatedImage: GalleryImage = {
      ...editingImage,
      title: newImage.title,
      imageUrl: newImage.imageUrl,
      description: newImage.description,
    }

    const updatedImages = images.map((image) => (image.id === editingImage.id ? updatedImage : image))
    saveImages(updatedImages)

    setNewImage({ title: "", imageUrl: "", description: "" })
    setShowAddForm(false)
    setEditingImage(null)
    console.log("[v0] 갤러리 이미지 수정 완료:", updatedImage.title)
  }

  const handleDeleteImage = (id: string) => {
    requireAuth(() => {
      const imageToDelete = images.find((img) => img.id === id)
      const updatedImages = images.filter((image) => image.id !== id)
      saveImages(updatedImages)
      console.log("[v0] 갤러리 이미지 삭제:", imageToDelete?.title)
    })
  }

  const handleCancelEdit = () => {
    setEditingImage(null)
    setShowAddForm(false)
    setNewImage({ title: "", imageUrl: "", description: "" })
  }

  const handleManualBackup = () => {
    requireAuth(() => {
      const dataString = JSON.stringify(images)
      const blob = new Blob([dataString], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rotary-gallery-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      console.log("[v0] 갤러리 수동 백업 파일 다운로드 완료")
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />

      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">클럽갤러리</h1>
              <p className="text-lg text-gray-600">경주중앙로타리클럽의 소중한 순간들을 함께 나누세요</p>
            </div>

            <div className="mb-6">
              <Button onClick={handleAddClick} className="bg-green-600 hover:bg-green-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                사진 추가
              </Button>
              <Button onClick={handleManualBackup} variant="outline" className="ml-2 bg-green-50 hover:bg-green-100">
                <SaveIcon className="w-4 h-4 mr-2" />
                백업 다운로드
              </Button>
            </div>

            {showAddForm && isAuthenticated && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingImage ? "사진 수정" : "새 사진 추가"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="제목을 입력하세요"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  />
                  <Input
                    placeholder="이미지 URL을 입력하세요"
                    value={newImage.imageUrl}
                    onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                  />
                  <Textarea
                    placeholder="설명을 입력하세요 (선택사항)"
                    value={newImage.description}
                    onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button onClick={editingImage ? handleUpdateImage : handleAddImage}>
                      {editingImage ? "수정" : "추가"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      취소
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {images.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">등록된 사진이 없습니다.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=300&text=이미지 로드 실패"
                        }}
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button variant="secondary" size="sm" onClick={() => handleEditImage(image)}>
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(image.id)}>
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                      {image.description && <p className="text-gray-600 text-sm mb-2">{image.description}</p>}
                      <p className="text-gray-500 text-xs">{new Date(image.date).toLocaleDateString("ko-KR")}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
    </div>
  )
}
