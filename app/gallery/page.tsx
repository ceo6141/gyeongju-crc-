"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import Image from "next/image"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { galleryManager, type GalleryImage, backupData, restoreData, autoRestoreData } from "@/lib/data-manager"
import { Navigation } from "@/components/navigation"

const processImage = (file: File): Promise<{ dataUrl: string; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    console.log("[v0] 이미지 업로드 시작:", {
      fileName: file.name,
      fileSize: (file.size / 1024 / 1024).toFixed(2) + "MB",
      fileType: file.type,
    })

    const reader = new FileReader()
    reader.onload = (e) => {
      console.log("[v0] 파일 읽기 완료:", {
        dataSize: ((e.target?.result as string).length / 1024).toFixed(2) + "KB",
      })

      const img = new window.Image()
      img.onload = () => {
        console.log("[v0] 이미지 로드 완료:", {
          originalWidth: img.width,
          originalHeight: img.height,
        })

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!

        // 최대 크기 설정 (800px)
        const maxSize = 800
        let { width, height } = img

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)

        console.log("[v0] 이미지 압축 완료:", {
          finalWidth: width,
          finalHeight: height,
          compressedSize: (dataUrl.length / 1024).toFixed(2) + "KB",
        })

        resolve({ dataUrl, width, height })
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const checkStorageAndBackup = () => {
  try {
    const testKey = "storage-test"
    const testData = "x".repeat(1024) // 1KB 테스트 데이터
    localStorage.setItem(testKey, testData)
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    console.log("[v0] 저장소 용량 초과 감지")

    // 기존 이미지들을 백업용 JSON으로 다운로드
    const allImages = galleryManager.getAll()
    const backupData = {
      timestamp: new Date().toISOString(),
      images: allImages,
      note: "갤러리 용량 초과로 인한 자동 백업",
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `gallery-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    alert(
      "저장소 용량이 부족합니다. 기존 사진들이 자동으로 백업되었습니다. 다운로드된 백업 파일을 안전한 곳에 보관해주세요.",
    )
    return false
  }
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
  const [zoomedImage, setZoomedImage] = useState<GalleryImage | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const { requireAuth, showLogin, setShowLogin, handleLoginSuccess } = useAdminAuth()

  useEffect(() => {
    const loadImages = () => {
      if (galleryManager.getAll().length === 0) {
        autoRestoreData()
      }

      const allImages = galleryManager.getAll()
      setImages(allImages)
      console.log("[v0] 갤러리 이미지 로드 완료:", allImages.length, "개")
    }

    loadImages()

    // 갤러리 업데이트 이벤트 리스너
    const handleGalleryUpdate = () => {
      loadImages()
    }

    window.addEventListener("galleryUpdated", handleGalleryUpdate)
    return () => window.removeEventListener("galleryUpdated", handleGalleryUpdate)
  }, [])

  const handleEditModeToggle = () => {
    if (isEditMode) {
      setIsEditMode(false)
    } else {
      requireAuth(() => {
        setIsEditMode(true)
        console.log("[v0] 편집 모드 활성화")
      })
    }
  }

  const handleAddImage = async () => {
    if (!selectedFile || !formData.title.trim()) {
      alert("사진과 제목을 입력해주세요.")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("파일 크기가 너무 큽니다. 10MB 이하의 파일을 선택해주세요.")
      return
    }

    if (!checkStorageAndBackup()) {
      return
    }

    try {
      const { dataUrl, width, height } = await processImage(selectedFile)

      const newImage: Omit<GalleryImage, "id"> = {
        title: formData.title,
        description: formData.description,
        date: formData.date || new Date().toISOString().split("T")[0],
        location: formData.location,
        imageUrl: dataUrl,
        originalWidth: width,
        originalHeight: height,
      }

      if (galleryManager.add(newImage)) {
        setFormData({ title: "", description: "", date: "", location: "" })
        setSelectedFile(null)
        setIsAddDialogOpen(false)
        console.log("[v0] 이미지 업로드 성공")
        alert("사진이 성공적으로 추가되었습니다!")
      } else {
        throw new Error("이미지 저장 실패")
      }
    } catch (error) {
      console.error("[v0] 사진 추가 오류:", error)
      alert("사진 추가 중 오류가 발생했습니다. 파일 크기를 확인해주세요.")
    }
  }

  const handleEditImage = async () => {
    if (!editingImage || !formData.title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }

    try {
      let imageUrl = editingImage.imageUrl
      let originalWidth = editingImage.originalWidth
      let originalHeight = editingImage.originalHeight

      if (selectedFile) {
        if (selectedFile.size > 10 * 1024 * 1024) {
          alert("파일 크기가 너무 큽니다. 10MB 이하의 파일을 선택해주세요.")
          return
        }

        const { dataUrl, width, height } = await processImage(selectedFile)
        imageUrl = dataUrl
        originalWidth = width
        originalHeight = height
      }

      const updates: Partial<GalleryImage> = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        imageUrl,
        originalWidth,
        originalHeight,
      }

      if (galleryManager.update(editingImage.id, updates)) {
        setFormData({ title: "", description: "", date: "", location: "" })
        setSelectedFile(null)
        setIsEditDialogOpen(false)
        setEditingImage(null)
        console.log("[v0] 이미지 수정 성공")
        alert("사진이 성공적으로 수정되었습니다!")
      } else {
        throw new Error("이미지 수정 실패")
      }
    } catch (error) {
      console.error("[v0] 사진 수정 오류:", error)
      alert("사진 수정 중 오류가 발생했습니다.")
    }
  }

  const handleDeleteImage = (image: GalleryImage) => {
    requireAuth(() => {
      if (confirm(`"${image.title}" 사진을 삭제하시겠습니까?`)) {
        if (galleryManager.delete(image.id)) {
          console.log("[v0] 사진 삭제 완료:", image.title)
          alert("사진이 삭제되었습니다.")
        } else {
          alert("사진 삭제 중 오류가 발생했습니다.")
        }
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

  const handleBackupDownload = () => {
    requireAuth(() => {
      try {
        backupData()
        alert("백업 파일이 다운로드되었습니다!")
      } catch (error) {
        console.error("[v0] 백업 다운로드 오류:", error)
        alert("백업 다운로드 중 오류가 발생했습니다.")
      }
    })
  }

  const handleBackupRestore = async () => {
    if (!restoreFile) {
      alert("복원할 백업 파일을 선택해주세요.")
      return
    }

    try {
      await restoreData(restoreFile)
      setRestoreFile(null)
      setIsRestoreDialogOpen(false)
      alert("백업이 성공적으로 복원되었습니다!")
    } catch (error) {
      console.error("[v0] 백업 복원 오류:", error)
      alert("백업 복원 중 오류가 발생했습니다. 파일 형식을 확인해주세요.")
    }
  }

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">클럽 갤러리</h1>
            <p className="text-xl text-gray-600">경주중앙로타리클럽의 소중한 순간들</p>
          </div>

          <div className="mb-8 text-center">
            <Button onClick={handleEditModeToggle} variant={isEditMode ? "destructive" : "default"} className="mb-4">
              {isEditMode ? "편집 모드 종료" : "사진 편집하기 (관리자)"}
            </Button>

            {isEditMode && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg max-w-md mx-auto">
                <p className="text-yellow-800 font-medium">
                  📝 편집 모드 활성화됨 - 각 사진의 수정/삭제 버튼을 클릭하세요
                </p>
                <p className="text-yellow-700 text-sm mt-2">💾 용량 초과 시 기존 사진들이 자동으로 백업됩니다</p>
              </div>
            )}

            {isEditMode && (
              <div className="flex justify-center gap-2 mb-4">
                <Button onClick={handleBackupDownload} variant="outline" className="gap-2 bg-transparent">
                  <Icons.Download className="h-4 w-4" />
                  백업 다운로드
                </Button>
                <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Icons.Upload className="h-4 w-4" />
                      백업 복원
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>백업 복원</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="restore-file">백업 파일 선택 (.json)</Label>
                        <Input
                          id="restore-file"
                          type="file"
                          accept=".json"
                          onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                        />
                        {restoreFile && <p className="text-sm text-gray-500 mt-1">선택된 파일: {restoreFile.name}</p>}
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-amber-800 text-sm">
                          ⚠️ 백업 복원 시 현재 데이터가 모두 교체됩니다. 신중하게 진행해주세요.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleBackupRestore} className="flex-1" disabled={!restoreFile}>
                          복원
                        </Button>
                        <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)} className="flex-1">
                          취소
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {isEditMode && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Icons.Plus className="h-5 w-5" />
                    사진 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>새 사진 추가</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image-file">사진 선택 (최대 10MB)</Label>
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      {selectedFile && (
                        <p className="text-sm text-gray-500 mt-1">
                          선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="title">제목 *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="사진 제목을 입력하세요"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">설명</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="사진 설명을 입력하세요"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">날짜</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">장소</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="촬영 장소를 입력하세요"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddImage}
                        className="flex-1"
                        disabled={!selectedFile || !formData.title.trim()}
                      >
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

          {images.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">등록된 사진이 없습니다.</p>
              <p className="text-gray-400 mb-4">새 사진을 추가하거나 백업 파일을 복원해보세요.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-800 text-sm">
                  💡 이전에 백업한 파일이 있다면 "백업 복원" 기능을 사용해서 사진들을 다시 불러올 수 있습니다.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video">
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={image.title}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => setZoomedImage(image)}
                  />
                  {isEditMode && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button size="sm" variant="secondary" onClick={() => openEditDialog(image)}>
                        <Icons.Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image)}>
                        <Icons.Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                  {image.description && <p className="text-gray-600 text-sm mb-2">{image.description}</p>}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{image.date}</span>
                    {image.location && <span>{image.location}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>사진 수정</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-image-file">새 사진 선택 (선택사항, 최대 10MB)</Label>
                  <Input
                    id="edit-image-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-title">제목 *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="사진 제목을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">설명</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="사진 설명을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-date">날짜</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">장소</Label>
                  <Input
                    id="edit-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="촬영 장소를 입력하세요"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleEditImage} className="flex-1" disabled={!formData.title.trim()}>
                    수정
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                    취소
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {zoomedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
              <div className="relative max-w-4xl max-h-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-12 right-0 text-white hover:bg-white/20"
                  onClick={() => setZoomedImage(null)}
                >
                  <Icons.X className="h-6 w-6" />
                </Button>
                <Image
                  src={zoomedImage.imageUrl || "/placeholder.svg"}
                  alt={zoomedImage.title}
                  width={zoomedImage.originalWidth || 800}
                  height={zoomedImage.originalHeight || 600}
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
                  <h3 className="font-semibold text-lg">{zoomedImage.title}</h3>
                  {zoomedImage.description && <p className="text-sm opacity-90">{zoomedImage.description}</p>}
                  <div className="flex justify-between text-sm opacity-75 mt-2">
                    <span>{zoomedImage.date}</span>
                    {zoomedImage.location && <span>{zoomedImage.location}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  )
}
