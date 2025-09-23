"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, TrashIcon, EditIcon, SaveIcon, ImageIcon } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { dataManager, type GalleryItem } from "@/lib/simple-data-manager"
import { uploadFile, validateImageFile } from "@/lib/file-upload"

export default function GalleryClientPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    image: "",
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isAuthenticated, showLogin, setShowLogin, requireAuth, handleLoginSuccess } = useAdminAuth()

  useEffect(() => {
    const loadGalleryItems = () => {
      try {
        const loadedItems = dataManager.getGalleryItems()
        setGalleryItems(loadedItems)
        console.log("[v0] 클럽갤러리 로드 완료:", loadedItems.length, "개")
      } catch (error) {
        console.error("[v0] 클럽갤러리 로드 실패:", error)
        setGalleryItems([])
      }
    }

    loadGalleryItems()

    // 스토리지 변경 감지
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "rotary-gallery") {
        console.log("[v0] 스토리지 변경 감지 - 클럽갤러리 새로고침")
        loadGalleryItems()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      alert(validationError)
      return
    }

    setIsUploading(true)
    try {
      const imageData = await uploadFile(file)
      setNewItem({ ...newItem, image: imageData })
      console.log("[v0] 이미지 업로드 성공")
    } catch (error) {
      console.error("[v0] 이미지 업로드 실패:", error)
      alert("이미지 업로드에 실패했습니다: " + (error as Error).message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setNewItem({ ...newItem, image: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddClick = () => {
    requireAuth(() => setShowAddForm(!showAddForm))
  }

  const handleAddItem = () => {
    if (!newItem.title.trim() || !newItem.image.trim()) {
      alert("제목과 이미지를 입력해주세요.")
      return
    }

    const success = dataManager.addGalleryItem({
      title: newItem.title,
      description: newItem.description,
      date: new Date().toISOString().split("T")[0],
      image: newItem.image,
    })

    if (success) {
      const updatedItems = dataManager.getGalleryItems()
      setGalleryItems(updatedItems)
      setNewItem({ title: "", description: "", image: "" })
      setShowAddForm(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
      console.log("[v0] 새 갤러리 아이템 추가 성공")
    } else {
      alert("갤러리 아이템 추가에 실패했습니다.")
    }
  }

  const handleEditItem = (item: GalleryItem) => {
    requireAuth(() => {
      setEditingItem(item)
      setNewItem({
        title: item.title,
        description: item.description,
        image: item.image,
      })
      setShowAddForm(true)
      console.log("[v0] 갤러리 아이템 편집 모드 활성화:", item.title)
    })
  }

  const handleUpdateItem = () => {
    if (!editingItem || !newItem.title.trim() || !newItem.image.trim()) {
      alert("제목과 이미지를 입력해주세요.")
      return
    }

    const success = dataManager.updateGalleryItem(editingItem.id, {
      title: newItem.title,
      description: newItem.description,
      image: newItem.image,
    })

    if (success) {
      const updatedItems = dataManager.getGalleryItems()
      setGalleryItems(updatedItems)
      setEditingItem(null)
      setNewItem({ title: "", description: "", image: "" })
      setShowAddForm(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
      console.log("[v0] 갤러리 아이템 수정 완료")
    } else {
      alert("갤러리 아이템 수정에 실패했습니다.")
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setNewItem({ title: "", description: "", image: "" })
    setShowAddForm(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDeleteItem = (id: string) => {
    requireAuth(() => {
      if (confirm("정말로 이 갤러리 아이템을 삭제하시겠습니까?")) {
        const success = dataManager.deleteGalleryItem(id)
        if (success) {
          const updatedItems = dataManager.getGalleryItems()
          setGalleryItems(updatedItems)
          console.log("[v0] 갤러리 아이템 삭제 완료")
        } else {
          alert("갤러리 아이템 삭제에 실패했습니다.")
        }
      }
    })
  }

  const handleManualBackup = () => {
    requireAuth(() => {
      try {
        const allItems = dataManager.getGalleryItems()
        const dataString = JSON.stringify(allItems, null, 2)
        const blob = new Blob([dataString], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rotary-gallery-backup-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        console.log("[v0] 백업 파일 다운로드 완료")
      } catch (error) {
        console.error("[v0] 백업 다운로드 실패:", error)
        alert("백업 다운로드에 실패했습니다.")
      }
    })
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/images/rotary-background.jpg')",
        backgroundPosition: "center 5%",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>

      <div className="relative z-10">
        <Navigation />

        <div className="pt-0">
          <div className="container mx-auto px-4 py-0">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-1 mt-2">
                <h1 className="text-xl font-bold text-gray-900 mb-0">클럽갤러리</h1>
                <p className="text-xs text-gray-700">경주중앙로타리클럽의 소중한 순간들을 함께 나누세요</p>
              </div>

              <div className="mb-1 flex gap-2">
                <Button onClick={handleAddClick} className="bg-green-600 hover:bg-green-700">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  사진 추가
                </Button>
                <Button onClick={handleManualBackup} variant="outline" className="bg-green-50 hover:bg-green-100">
                  <SaveIcon className="w-4 h-4 mr-2" />
                  백업 다운로드
                </Button>
              </div>

              {showAddForm && isAuthenticated && (
                <Card className="mb-4 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>{editingItem ? "사진 수정" : "새 사진 추가"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="제목을 입력하세요"
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="설명을 입력하세요 (선택사항)"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      rows={3}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium">이미지 업로드 (필수)</label>
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          {isUploading ? "업로드 중..." : "이미지 선택"}
                        </Button>
                        {newItem.image && (
                          <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                            <TrashIcon className="w-4 h-4 mr-1" />
                            이미지 제거
                          </Button>
                        )}
                      </div>
                      {newItem.image && (
                        <div className="mt-2">
                          <img
                            src={newItem.image || "/placeholder.svg"}
                            alt="미리보기"
                            className="max-w-xs max-h-48 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={editingItem ? handleUpdateItem : handleAddItem}>
                        {editingItem ? "수정" : "추가"}
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        취소
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {galleryItems.length === 0 ? (
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">등록된 사진이 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryItems.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm"
                    >
                      <div className="aspect-video bg-gray-200 relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=200&width=300&text=이미지 로드 실패"
                          }}
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button variant="secondary" size="sm" onClick={() => handleEditItem(item)}>
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                        {item.description && <p className="text-gray-600 text-sm mb-2">{item.description}</p>}
                        <p className="text-gray-500 text-xs">{new Date(item.date).toLocaleDateString("ko-KR")}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
    </div>
  )
}
