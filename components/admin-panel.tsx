"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Save, X, Shield } from "lucide-react"
import Image from "next/image"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"

export function AdminPanel() {
  const { isAuthenticated, showLogin, setShowLogin, requireAuth, handleLoginSuccess, logout } = useAdminAuth()

  const [backgroundImages, setBackgroundImages] = useState([
    { id: 1, name: "클럽 단체사진", url: "/images/club-photo.png", active: true },
  ])
  const [editingImage, setEditingImage] = useState(null)
  const [newImageName, setNewImageName] = useState("")
  const [newImageFile, setNewImageFile] = useState(null)

  const handleImageUpload = (event) => {
    requireAuth(() => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage = {
            id: Date.now(),
            name: newImageName || file.name,
            url: e.target.result,
            active: false,
          }
          setBackgroundImages([...backgroundImages, newImage])
          setNewImageName("")
          setNewImageFile(null)
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleSetActiveImage = (id) => {
    requireAuth(() => {
      setBackgroundImages(
        backgroundImages.map((img) => ({
          ...img,
          active: img.id === id,
        })),
      )

      const activeImage = backgroundImages.find((img) => img.id === id)
      if (activeImage) {
        localStorage.setItem("activeBackgroundImage", activeImage.url)
        window.location.reload()
      }
    })
  }

  const handleDeleteImage = (id) => {
    requireAuth(() => {
      if (confirm("이 이미지를 삭제하시겠습니까?")) {
        setBackgroundImages(backgroundImages.filter((img) => img.id !== id))
      }
    })
  }

  const handleEditImage = (image) => {
    requireAuth(() => {
      setEditingImage({ ...image })
    })
  }

  const handleSaveImageEdit = () => {
    requireAuth(() => {
      setBackgroundImages(backgroundImages.map((img) => (img.id === editingImage.id ? editingImage : img)))
      setEditingImage(null)
    })
  }

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setShowLogin(true)}
        >
          <Shield className="h-4 w-4 mr-2" />
          관리자 로그인
        </Button>

        <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
      </>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 max-h-96 overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              관리자 패널
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={logout}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">배경 이미지 관리</h3>

            {/* 새 이미지 업로드 */}
            <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <Input placeholder="이미지 이름" value={newImageName} onChange={(e) => setNewImageName(e.target.value)} />
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* 기존 이미지 목록 */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {backgroundImages.map((image) => (
                <div key={image.id} className="flex items-center gap-2 p-2 border rounded">
                  {editingImage?.id === image.id ? (
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editingImage.name}
                        onChange={(e) => setEditingImage({ ...editingImage, name: e.target.value })}
                      />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={handleSaveImageEdit}>
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingImage(null)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.name}
                        width={40}
                        height={30}
                        className="object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{image.name}</div>
                        {image.active && (
                          <Badge variant="secondary" className="text-xs">
                            활성
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {!image.active && (
                          <Button size="sm" variant="outline" onClick={() => handleSetActiveImage(image.id)}>
                            적용
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleEditImage(image)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteImage(image.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
