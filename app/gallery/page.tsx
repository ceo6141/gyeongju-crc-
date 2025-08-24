"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Camera } from "lucide-react"
import Image from "next/image"

interface GalleryImage {
  id: string
  title: string
  description: string
  date: string
  location: string
  imageUrl: string
}

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

  // localStorage에서 갤러리 이미지 로드
  useEffect(() => {
    const savedImages = localStorage.getItem("gallery-images")
    if (savedImages) {
      try {
        setImages(JSON.parse(savedImages))
      } catch (error) {
        console.error("갤러리 이미지 로드 오류:", error)
      }
    }
  }, [])

  // localStorage에 갤러리 이미지 저장
  const saveImages = (newImages: GalleryImage[]) => {
    try {
      localStorage.setItem("gallery-images", JSON.stringify(newImages))
      setImages(newImages)
    } catch (error) {
      console.error("갤러리 이미지 저장 오류:", error)
    }
  }

  // 이미지 압축 함수
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        try {
          // 최대 크기 설정
          const maxWidth = 600
          const maxHeight = 400
          let width = img.width || 800
          let height = img.height || 600

          // 비율 유지하면서 크기 조정
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

          // 고품질 렌더링 설정
          if (ctx) {
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"
            ctx.drawImage(img, 0, 0, width, height)

            // JPEG 품질 0.6으로 압축
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.6)
            resolve(compressedDataUrl)
          } else {
            reject(new Error("Canvas context를 가져올 수 없습니다"))
          }
        } catch (error) {
          console.error("이미지 압축 중 오류:", error)
          reject(error)
        }
      }

      img.onerror = () => reject(new Error("이미지 로드 실패"))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleAddImage = async (e?: React.MouseEvent) => {
    if (!selectedFile || !formData.title.trim()) {
      alert("사진과 제목을 입력해주세요.")
      return
    }

    try {
      const compressedImageUrl = await compressImage(selectedFile)

      const newImage: GalleryImage = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        imageUrl: compressedImageUrl,
      }

      const updatedImages = [...images, newImage]
      saveImages(updatedImages)

      // 폼 초기화
      setFormData({ title: "", description: "", date: "", location: "" })
      setSelectedFile(null)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("사진 추가 오류:", error)
      alert("사진 추가 중 오류가 발생했습니다.")
    }
  }

  const handleEditImage = async (e?: React.MouseEvent) => {
    if (!editingImage || !formData.title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }

    try {
      let imageUrl = editingImage.imageUrl

      // 새 파일이 선택된 경우 압축
      if (selectedFile) {
        imageUrl = await compressImage(selectedFile)
      }

      const updatedImage: GalleryImage = {
        ...editingImage,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        imageUrl,
      }

      const updatedImages = images.map((img) => (img.id === editingImage.id ? updatedImage : img))
      saveImages(updatedImages)

      // 폼 초기화
      setFormData({ title: "", description: "", date: "", location: "" })
      setSelectedFile(null)
      setEditingImage(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("사진 수정 오류:", error)
      alert("사진 수정 중 오류가 발생했습니다.")
    }
  }

  // 사진 삭제
  const handleDeleteImage = (id: string) => {
    if (confirm("이 사진을 삭제하시겠습니까?")) {
      const updatedImages = images.filter((img) => img.id !== id)
      saveImages(updatedImages)
    }
  }

  // 수정 다이얼로그 열기
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

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <Camera className="h-10 w-10" />
            갤러리
          </h1>
          <p className="text-muted-foreground text-lg">경주중앙로타리클럽의 소중한 순간들을 담았습니다</p>
        </div>

        {/* 사진 추가 버튼 */}
        <div className="mb-8 text-center">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
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
                  <Input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
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
                  <Button onClick={() => handleAddImage()} className="flex-1">
                    추가
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    취소
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 갤러리 그리드 */}
        {images.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">아직 등록된 사진이 없습니다.</p>
            <p className="text-muted-foreground">첫 번째 사진을 추가해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={image.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEditDialog(image)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                    {image.description && <p className="text-muted-foreground text-sm mb-2">{image.description}</p>}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      {image.date && <span>{image.date}</span>}
                      {image.location && <span>{image.location}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 수정 다이얼로그 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>사진 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">사진 변경 (선택사항)</label>
                <Input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
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
                <Button onClick={() => handleEditImage()} className="flex-1">
                  수정
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  취소
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
