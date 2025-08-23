"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Settings, Edit, Trash2, Save, X } from "lucide-react"
import Image from "next/image"

const ADMIN_USERS = ["admin@gjcrc.com", "president@gjcrc.com", "secretary@gjcrc.com", "webmaster@gjcrc.com"]

export function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [backgroundImages, setBackgroundImages] = useState([
    { id: 1, name: "클럽 단체사진", url: "/images/club-photo.png", active: true },
  ])
  const [editingImage, setEditingImage] = useState(null)
  const [newImageName, setNewImageName] = useState("")
  const [newImageFile, setNewImageFile] = useState(null)

  useEffect(() => {
    const savedAdmin = localStorage.getItem("isAdmin")
    if (savedAdmin === "true") {
      setIsAdmin(true)
    }
  }, [])

  const handleAdminLogin = () => {
    if (ADMIN_USERS.includes(adminEmail) && adminPassword === "gjcrc2025") {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      setIsLoginOpen(false)
      setAdminEmail("")
      setAdminPassword("")
    } else {
      alert("관리자 인증에 실패했습니다.")
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem("isAdmin")
  }

  const handleImageUpload = (event) => {
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
  }

  const handleSetActiveImage = (id) => {
    setBackgroundImages(
      backgroundImages.map((img) => ({
        ...img,
        active: img.id === id,
      })),
    )

    // 실제 배경 이미지 변경 (localStorage에 저장)
    const activeImage = backgroundImages.find((img) => img.id === id)
    if (activeImage) {
      localStorage.setItem("activeBackgroundImage", activeImage.url)
      // 페이지 새로고침으로 변경사항 적용
      window.location.reload()
    }
  }

  const handleDeleteImage = (id) => {
    if (confirm("이 이미지를 삭제하시겠습니까?")) {
      setBackgroundImages(backgroundImages.filter((img) => img.id !== id))
    }
  }

  const handleEditImage = (image) => {
    setEditingImage({ ...image })
  }

  const handleSaveImageEdit = () => {
    setBackgroundImages(backgroundImages.map((img) => (img.id === editingImage.id ? editingImage : img)))
    setEditingImage(null)
  }

  if (!isAdmin) {
    return (
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="fixed bottom-4 right-4 bg-blue-600 text-white hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" />
            관리자
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>관리자 로그인</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="관리자 이메일"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <Button onClick={handleAdminLogin} className="w-full">
              로그인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 max-h-96 overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">관리자 패널</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleAdminLogout}>
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
