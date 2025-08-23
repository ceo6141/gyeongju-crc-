"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface GalleryImage {
  id: string
  src: string
  title: string
  description: string
  date: string
  location: string
}

interface ClubContact {
  address: string
  phone: string
  fax: string
  email: string
  postalCode: string
}

export default function AboutPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [newImage, setNewImage] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    file: null as File | null,
  })
  const [nextMeetingDate, setNextMeetingDate] = useState<string>("")
  const [clubContact, setClubContact] = useState<ClubContact>({
    address: "경주시 승삼1길 5-5, 4층(용강동)",
    phone: "054-773-7676",
    fax: "054-773-7673",
    email: "",
    postalCode: "38090",
  })
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    const savedImages = localStorage.getItem("clubGallery")
    if (savedImages) {
      setGalleryImages(JSON.parse(savedImages))
    } else {
      const initialImages: GalleryImage[] = [
        {
          id: "1",
          src: "/images/club-photo.png",
          title: "제 21대 22대 회장단 이취임식",
          description: "경주중앙로타리클럽 회원들이 함께한 뜻깊은 이·취임식 행사",
          date: "2025-06-19",
          location: "경주 힐튼호텔",
        },
      ]
      setGalleryImages(initialImages)
      localStorage.setItem("clubGallery", JSON.stringify(initialImages))
    }

    const savedContact = localStorage.getItem("clubContact")
    if (savedContact) {
      setClubContact(JSON.parse(savedContact))
    }

    const targetDate = new Date("2025-09-04")
    const now = new Date()

    if (now >= targetDate) {
      setNextMeetingDate(getNextMeetingDate())
    } else {
      setNextMeetingDate("2025년 9월 4일(목) 오후 7시")
    }
  }, [])

  const saveClubContact = (contact: ClubContact) => {
    setClubContact(contact)
    localStorage.setItem("clubContact", JSON.stringify(contact))
  }

  const saveGalleryData = (images: GalleryImage[]) => {
    try {
      console.log("[v0] Saving gallery data:", images.length, "images")
      setGalleryImages(images)
      localStorage.setItem("clubGallery", JSON.stringify(images))
      console.log("[v0] Gallery data saved successfully")

      // 저장 후 즉시 검증
      const saved = localStorage.getItem("clubGallery")
      if (saved) {
        const parsed = JSON.parse(saved)
        console.log("[v0] Verification: saved", parsed.length, "images")
      }
    } catch (error) {
      console.error("[v0] Error saving gallery data:", error)
      alert("사진 저장 중 오류가 발생했습니다. 파일 크기가 너무 클 수 있습니다.")
    }
  }

  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error("파일 크기가 5MB를 초과합니다."))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.onerror = () => {
        reject(new Error("파일 읽기 중 오류가 발생했습니다."))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAddImage = async () => {
    if (!newImage.title.trim()) {
      alert("사진 제목을 입력해주세요.")
      return
    }
    if (!newImage.description.trim()) {
      alert("사진 설명을 입력해주세요.")
      return
    }
    if (!newImage.date) {
      alert("날짜를 선택해주세요.")
      return
    }
    if (!newImage.location.trim()) {
      alert("장소를 입력해주세요.")
      return
    }
    if (!newImage.file) {
      alert("사진 파일을 선택해주세요.")
      return
    }

    try {
      console.log("[v0] Adding new image:", newImage.title)
      const imageSrc = await handleImageUpload(newImage.file)
      const newGalleryImage: GalleryImage = {
        id: Date.now().toString(),
        src: imageSrc,
        title: newImage.title.trim(),
        description: newImage.description.trim(),
        date: newImage.date,
        location: newImage.location.trim(),
      }
      const updatedImages = [...galleryImages, newGalleryImage]
      saveGalleryData(updatedImages)
      setNewImage({ title: "", description: "", date: "", location: "", file: null })
      setIsAddDialogOpen(false)
      alert("사진이 성공적으로 추가되었습니다.")
    } catch (error) {
      console.error("[v0] Error adding image:", error)
      alert(`사진 추가 중 오류가 발생했습니다: ${error.message}`)
    }
  }

  const handleEditImage = async (id: string) => {
    if (!editingImage) return

    if (!editingImage.title.trim()) {
      alert("사진 제목을 입력해주세요.")
      return
    }
    if (!editingImage.description.trim()) {
      alert("사진 설명을 입력해주세요.")
      return
    }
    if (!editingImage.date) {
      alert("날짜를 선택해주세요.")
      return
    }
    if (!editingImage.location.trim()) {
      alert("장소를 입력해주세요.")
      return
    }

    try {
      console.log("[v0] Editing image:", id, editingImage.title)
      const updatedImages = galleryImages.map((img) =>
        img.id === id
          ? {
              ...editingImage,
              title: editingImage.title.trim(),
              description: editingImage.description.trim(),
              location: editingImage.location.trim(),
            }
          : img,
      )
      saveGalleryData(updatedImages)
      setEditingImage(null)
      setIsEditDialogOpen(false)
      alert("사진이 성공적으로 수정되었습니다.")
    } catch (error) {
      console.error("[v0] Error editing image:", error)
      alert("사진 수정 중 오류가 발생했습니다.")
    }
  }

  const handleDeleteImage = (id: string) => {
    if (confirm("정말로 이 사진을 삭제하시겠습니까?")) {
      try {
        console.log("[v0] Deleting image:", id)
        const updatedImages = galleryImages.filter((img) => img.id !== id)
        saveGalleryData(updatedImages)
        alert("사진이 성공적으로 삭제되었습니다.")
      } catch (error) {
        console.error("[v0] Error deleting image:", error)
        alert("사진 삭제 중 오류가 발생했습니다.")
      }
    }
  }

  const handleContactUpdate = () => {
    saveClubContact(clubContact)
    setIsEditingContact(false)
  }

  const getNextMeetingDate = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    const firstThursday = getFirstThursday(currentYear, currentMonth)
    const thirdThursday = getThirdThursday(currentYear, currentMonth)

    if (now < firstThursday) {
      return formatMeetingDate(firstThursday)
    } else if (now < thirdThursday) {
      return formatMeetingDate(thirdThursday)
    } else {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
      const nextFirstThursday = getFirstThursday(nextYear, nextMonth)
      return formatMeetingDate(nextFirstThursday)
    }
  }

  const getFirstThursday = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const dayOfWeek = firstDay.getDay()
    const daysToThursday = (4 - dayOfWeek + 7) % 7
    return new Date(year, month, 1 + daysToThursday)
  }

  const getThirdThursday = (year: number, month: number) => {
    const firstThursday = getFirstThursday(year, month)
    return new Date(firstThursday.getTime() + 14 * 24 * 60 * 60 * 1000)
  }

  const formatMeetingDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}년 ${month}월 ${day}일(목) 오후 7시`
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">클럽 소개</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              경주중앙로타리클럽의 역사와 비전, 그리고 우리가 추구하는 가치를 소개합니다.
            </p>
          </div>
        </div>
      </section>

      {/* President Message */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <img
                  src="/president-choi-yong-hwan.png"
                  alt="천상 최용환 회장"
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-200"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-blue-900">회장 인사말</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">2025-26년도 슬로건</h3>
                <p className="text-2xl font-bold text-blue-600">"다시하나되어 봉사와 성장을!!"</p>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                안녕하십니까. 경주중앙로타리클럽 제22대 회장 천상 최용환입니다. 우리 클럽은 2005년 창립 이래 20년간
                지역사회를 위한 봉사와 친선을 실천해왔습니다. 새로운 로타리 연도를 맞아 모든 회원이 하나가 되어 더욱
                의미 있는 봉사활동을 펼쳐나가겠습니다.
              </p>
              <div className="mt-6 text-right">
                <p className="font-semibold text-blue-900">경주중앙로타리클럽 제22대 회장</p>
                <p className="font-bold text-xl text-blue-700">천상 최용환</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Club Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h2 className="text-3xl font-bold mb-4">클럽 갤러리</h2>
              <p className="text-lg text-muted-foreground">우리 클럽의 소중한 순간들을 함께 나누어요.</p>
            </div>
            <div className="flex gap-2">
              <Button variant={isEditMode ? "default" : "outline"} onClick={() => setIsEditMode(!isEditMode)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditMode ? "편집 완료" : "편집 모드"}
              </Button>
              {isEditMode && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      사진 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>새 사진 추가</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="사진 제목 *"
                        value={newImage.title}
                        onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                      />
                      <Textarea
                        placeholder="사진 설명 *"
                        value={newImage.description}
                        onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={newImage.date}
                        onChange={(e) => setNewImage({ ...newImage, date: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="장소 *"
                        value={newImage.location}
                        onChange={(e) => setNewImage({ ...newImage, location: e.target.value })}
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewImage({ ...newImage, file: e.target.files?.[0] || null })}
                        required
                      />
                      <Button onClick={handleAddImage} className="w-full">
                        사진 추가
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  {isEditMode && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingImage(image)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>사진 수정</DialogTitle>
                          </DialogHeader>
                          {editingImage && (
                            <div className="space-y-4">
                              <Input
                                placeholder="사진 제목 *"
                                value={editingImage.title}
                                onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                              />
                              <Textarea
                                placeholder="사진 설명 *"
                                value={editingImage.description}
                                onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                              />
                              <Input
                                type="date"
                                value={editingImage.date}
                                onChange={(e) => setEditingImage({ ...editingImage, date: e.target.value })}
                              />
                              <Input
                                placeholder="장소 *"
                                value={editingImage.location}
                                onChange={(e) => setEditingImage({ ...editingImage, location: e.target.value })}
                              />
                              <Button onClick={() => handleEditImage(image.id)} className="w-full">
                                수정 완료
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{image.description}</p>
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{image.location}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{new Date(image.date).toLocaleDateString("ko-KR")}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Club Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">경주중앙로타리클럽</h2>
              <p className="text-lg text-muted-foreground mb-6">
                경주중앙로타리클럽은 2005년에 창립되어 20년간 경주 지역사회의 발전과 국제친선을 위해 헌신해온
                봉사단체입니다. 우리는 "Service Above Self"라는 로타리의 모토 아래 지역사회의 다양한 문제 해결과 발전을
                위해 노력하고 있습니다.
              </p>

              <div className="bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-center">클럽 정보</h3>
                  <Button variant="outline" size="sm" onClick={() => setIsEditingContact(!isEditingContact)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditingContact ? "완료" : "편집"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>정기모임:</strong> 매월 첫째, 셋째주 목요일 오후 7시
                  </div>
                  <div>
                    <strong>다음 모임:</strong> {nextMeetingDate || "2025년 9월 4일(목) 오후 7시"}
                  </div>
                  <div>
                    <strong>모임장소:</strong> 본 클럽회관
                  </div>
                  <div>
                    <strong>클럽회관:</strong> 경주중앙로타리클럽 회관
                  </div>
                  <div>
                    <strong>지구:</strong> 국제로타리3630지구
                  </div>
                  <div>
                    <strong>지역:</strong> 경주시
                  </div>
                  <div>
                    <strong>현 회장:</strong> 천상 최용환 (제22대)
                  </div>
                  <div>
                    <strong>직전회장:</strong> 천관 김용현
                  </div>
                  <div>
                    <strong>차기회장:</strong> 미정
                  </div>
                  <div>
                    <strong>부회장:</strong> 허동욱, 최태복
                  </div>
                  <div>
                    <strong>총무:</strong> 호헌 박재열
                  </div>
                  <div>
                    <strong>재무:</strong> 우함 손인익
                  </div>
                  <div>
                    <strong>부총무:</strong> 문시영, 김원기
                  </div>
                  <div>
                    <strong>창립:</strong> 2005년 1월 20일
                  </div>
                  <div>
                    <strong>회원:</strong> 68명
                  </div>
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>ADDRESS:</strong> 경주시 승삼1길 5-5, 4층(용강동)
                        <br />
                        <span className="text-xs text-muted-foreground">
                          EN) 5-5, Seungsam 1-gil, Gyeongju-si, Gyeongsangbuk-do, Republic of Korea
                        </span>
                      </div>
                      <div>
                        <strong>TEL:</strong> 054-773-7676
                      </div>
                      <div>
                        <strong>FAX:</strong> 054-773-7673
                      </div>
                      <div>
                        <strong>E-MAIL:</strong>
                        {isEditingContact ? (
                          <Input
                            value={clubContact.email}
                            onChange={(e) => setClubContact({ ...clubContact, email: e.target.value })}
                            placeholder="이메일을 입력하세요"
                            className="mt-1"
                          />
                        ) : (
                          <span className="ml-2">{clubContact.email || "입력 예정"}</span>
                        )}
                      </div>
                      <div>
                        <strong>ZIP CODE:</strong>
                        {isEditingContact ? (
                          <Input
                            value={clubContact.postalCode}
                            onChange={(e) => setClubContact({ ...clubContact, postalCode: e.target.value })}
                            placeholder="우편번호를 입력하세요"
                            className="mt-1"
                          />
                        ) : (
                          <span className="ml-2">{clubContact.postalCode}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isEditingContact && (
                    <div className="md:col-span-2">
                      <Button onClick={handleContactUpdate} className="w-full">
                        저장
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/club-building.jpg"
                alt="경주중앙로타리클럽 회관"
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">클럽 위치</h3>
                <div className="rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3262.8234567890123!2d129.2234567890123!3d35.8234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z6rK96KO87IucIOyKueyCvDHquLggNS01!5e0!3m2!1sko!2skr!4v1234567890123!5m2!1sko!2skr&markers=color:red%7C35.8234567890123,129.2234567890123"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="경주중앙로타리클럽 위치"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">경주시 승삼1길 5-5, 4층(용강동)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Rotary Club */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8">
            <h2 className="text-3xl font-bold mb-4">로타리 클럽이란?</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">로타리의 목적</h3>
                <p className="text-muted-foreground">
                  로타리의 목적은 의미 있는 프로젝트를 통해 지역사회와 세계 곳곳에서 지속적인 변화를 만들어내고,
                  전문직업인과 지역사회 리더들 간의 친목을 도모하며, 윤리적 기준을 높이고 세계 이해와 친선 및 평화를
                  증진하는 것입니다.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">4가지 표준</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>진실한가?</li>
                  <li>모든 관계자에게 공정한가?</li>
                  <li>선의와 우정을 증진하는가?</li>
                  <li>모든 관계자에게 유익한가?</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">로타리의 핵심 가치</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>봉사 (Service)</li>
                  <li>친목 (Fellowship)</li>
                  <li>다양성 (Diversity)</li>
                  <li>고결성 (Integrity)</li>
                  <li>리더십 (Leadership)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Club History */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">클럽 연혁</h2>
            <p className="text-lg text-muted-foreground">경주중앙로타리클럽의 주요 발자취를 소개합니다.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2005년 (창립년도)</h3>
              <ul className="space-y-2 text-sm">
                <li>• 1월 20일: 경주중앙로타리클럽 창립</li>
                <li>• 초대회장: 최병준</li>
                <li>• 국제로타리 3630지구 가입</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2006-2008년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2006년: 제2대 회장 최병준 연임</li>
                <li>• 2007년: 제3대 회장 최희상 취임</li>
                <li>• 2008년: 제4대 회장 이상익 취임</li>
                <li>• 지역사회 봉사활동 본격 시작</li>
                <li>• 회원 확충 및 클럽 기반 구축</li>
                <li>• 국제로타리 3630지구 활동 참여</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2009-2011년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2009년 8월: 나눔의 봉사활동 (안양지 연락단지 작은 음악회 개최)</li>
                <li>• 2009년 8월: 신만성회원 업체방문 ((주)현산업)</li>
                <li>• 2009년 9월: 경주 중앙기법원 재해 설명회 개최</li>
                <li>• 2009년 10월: 강동면 양산지 지내결연 사업 봉사활동</li>
                <li>• 2009년 11월: 지내결연인 이리중앙로타리클럽과 부부활동추진</li>
                <li>• 2009년 12월: 육군 제50사단 한센대 지원사업 (육군 육군 제50사단)</li>
                <li>• 2010년 1월: 창립 5주년 기념식, 경북도 의장 및 지연정화 활동</li>
                <li>• 2010년 2월: 지내결연지 사회복지시설 에디컴터 화목용 장작 전달</li>
                <li>• 2010년 2월: 전진 신만지 지내결연 사업 (전진 신만2리)</li>
                <li>• 2010년 3월: 지내결연지 시내 기준 및 화목용 장작 1톤 전달</li>
                <li>• 2010년 3월: 지내결연지 에디컴터 시내기준 및 화목용 장작 1톤 전달</li>
                <li>• 2010년 4월: 대한 방문과 대한 방문 역할 특강 개최 (천성에 바사, 조직 교수)</li>
                <li>• 2010년 5월: 3630지구대회 수상 클럽상, 홍보상, 모범클럽상 수상 (김천실내체육관)</li>
                <li>• 2010년 7월: 제7대 지구 이승희 회장 취임</li>
                <li>• 2010년 7월: 사회복지시설 에디컴터 화목용 장작 400포기 및 화목용 장작, 봉사금 전달</li>
                <li>• 2011년 1월: 사회복지시설 에디컴터 화목용 장작 전달</li>
                <li>• 2011년 1월: 독립선 시설치 및 지연정화 활동</li>
                <li>• 2011년 2월: 스폰서 클럽인 경주선덕로타리클럽과 합동 및 지장추진 (김신인우)</li>
                <li>• 2011년 2월: 3630지구대회 수상 클럽상, 홍보상, 모범클럽상 수상 (김천실내체육관)</li>
                <li>• 2011년 3월: 지내결연 건진 신만지 지내결연 의료보조기 10대 전달</li>
                <li>• 2011년 3월: 남산산책 총 지연정화 활동</li>
                <li>• 2011년 4월: 3630지구 로타리재단 기여 우수클럽상, 홍보상, 모범클럽상 수상 (김천실내체육관)</li>
                <li>• 2011년 6월: 인터랙트클럽 조기 전달 (경주정보고등학교)</li>
                <li>• 2011년 6월: 제8대 동국대 총장 취임</li>
                <li>• 2011년 6월: 불우이웃돕기 쌀 전달 (경주장애인복지관, 에디컴터)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2012-2013년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2012년 1월: 사회복지시설 에디컴터 지내결연지 및 화목용 장작 전달</li>
                <li>• 2012년 2월: 스폰서 클럽인 경주선덕로타리클럽과 합동추진 (강산한우)</li>
                <li>• 2012년 2월: 현명 봉사활동 (경주역 광장)</li>
                <li>• 2012년 3월: 경주시 지연봉사재단 학습지 전달 (경주교육청)</li>
                <li>• 2012년 3월: 지내결연 건진 신만지 학습지 전달</li>
                <li>• 2012년 4월: 3630지구 로타리재단 기여 우수 표창, 로타리재단 기여 우수 표창</li>
                <li>• 2012년 5월: 부인회 영화관람 정기모임 (클럽하우스)</li>
                <li>• 2012년 5월: 클럽관리정 및 공포회장에 공포대회 (경주신라CC)</li>
                <li>• 2012년 5월: 클럽관 보조금 사업 "대성포지 에디컴터 지원사업" 행사</li>
                <li>• 2012년 5월: (예술의전당 지원사업 지원사업)</li>
                <li>• 2012년 5월: 2021-22년도 지구대회 (김천 실내체육관)</li>
                <li>• 2012년 8월: 울산 적십자 활동원과 합께 부부활동 현황주회 (경주역 광장)</li>
                <li>• 2012년 8월: 인터랙트클럽 지원금 전달 (경주정보고등학교)</li>
                <li>• 2012년 10월: 국내지내클럽인 이리중앙로타리클럽과 합동추진회 및 지내추진</li>
                <li>• 2012년 11월: 지내클럽인 이리중앙로타리클럽과 부부활동추진</li>
                <li>• 2013년 1월: 창립 8주년 기념식, 경북도 의장 및 지연정화 활동 (월드컵경기장)</li>
                <li>• 2013년 1월: 국제지내클럽인 경주선덕로타리클럽과 합동추진 (강산한우)</li>
                <li>• 2013년 2월: 경주선덕로타리클럽과 합동추진 (강산한우)</li>
                <li>• 2013년 2월: 리틀랜드클럽 장학금 전달 (용강초등학교)</li>
                <li>• 2013년 2월: 지내결연 건진 신만지 학습지 전달</li>
                <li>• 2013년 3월: 지내결연 건진 신만지 학습지 전달, 기념식 수여</li>
                <li>• 2013년 4월: 3630지구 우수클럽상 수상, 로타리재단 기여 우수 표창</li>
                <li>• 2013년 5월: 2013년도 우수클럽상, 로타리재단 기여 우수 표창</li>
                <li>• 2013년 5월: 제21일 클럽 주관 정기모임 (경주신라CC 경주)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2014-2015년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2014년 1월: 경주시로부터 봉사활동유공 표창 수상</li>
                <li>• 2014년 1월: 에디컴터 생필품 전달 및 화목 단독기 봉사</li>
                <li>• 2014년 2월: 클럽회관 정기모임</li>
                <li>• 2014년 2월: 리틀랜드클럽 장학금 전달 (용강초등학교)</li>
                <li>• 2014년 2월: 스폰서 클럽인 경주선덕로타리클럽과 합동추진</li>
                <li>• 2014년 3월: 제25회 전국 클럽 주보 콘테스트 대상 수상(로타리 코리아)</li>
                <li>• 2014년 3월: 지내결연인 이리중앙 신만2리(가정이용) 합방지원, 이·미용봉사</li>
                <li>• 2014년 4월: 로타리코리아 8대 4월호 - 주보콘테스트 대상 수상 소감문 및 클럽광고 게재</li>
                <li>• 2014년 4월: 에디컴터 화목기 물품기 봉사활동 (위덕대학교경주캠퍼스 학과)</li>
                <li>• 2014년 5월: 3630지구 우수클럽상, 로타리재단 기여 우수 표창</li>
                <li>• 2014년 5월: 2013-14년 지구보조금사업(6.7지역-사랑의 집짓기) 준공식</li>
                <li>• 2014년 6월: 클럽관 보조금 사업 (GG1414012) 프로젝트 실시 - 필리핀 세부지역 클럽관 설치사업</li>
                <li>• 2014년 6월: 제11대 회장 중앙 황복욱 회장 취임 (월드컵경기장)</li>
                <li>• 2014년 6월: 사랑의 쌀 나누기 (성건동 다문화가정 - 30Kg, 급식원)</li>
                <li>• 2014년 7월: 사랑의 쌀 나누기 (용강동 소재 경주시 종합사회복지관 250Kg)</li>
                <li>• 2014년 7월: 존 9, 10A 로타리협의회 참가 (경북대 대강당)</li>
                <li>• 2014년 8월: 경주정보고등학교 인터랙트클럽 지원금 승인</li>
                <li>
                  • 2014년 8월: 사랑의 쌀 나누기 (지내결연지 사회복지시설 에디컴터 300kg, 광명동 독거노인 50Kg, 동천동
                  저소득가정 50Kg)
                </li>
                <li>• 2014년 10월: 인터랙트클럽 지원금 전달 (경주정보고등학교)</li>
                <li>• 2014년 11월: 지내결연인 이리중앙로타리클럽과 부부활동추진 (누리마루)</li>
                <li>• 2014년 12월: 육군 제50사단 한센대 지원사업 (육군 육군 제50사단)</li>
                <li>• 2014년 12월: 창립 10주년 기념 조정물(파고라) 준공 (노서공원)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2015-2016년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2015년 1월: 창립 10주년 기념식 (월드컵경기장)</li>
                <li>• 2015년 1월: 지내결연지 사회복지시설 에디컴터 봉사 (생필품 50만원 상당, 화목용 장작 전달)</li>
                <li>• 2015년 2월: 3630지구 7지역의 필리핀 컴퓨터 지원 사업 참가</li>
                <li>• 2015년 2월: 로타랙트클럽 장학금 전달 (위덕대학교)</li>
                <li>• 2015년 2월: 리틀랜드클럽 장학금 전달 (용강초등학교)</li>
                <li>• 2015년 4월: 3630지구 로타리재단 기여 우수 표창, 로타리재단 기여 우수 표창</li>
                <li>• 2015년 6월: 제12대 회장 승삼 권오석 회장 취임 (월드컵경기장)</li>
                <li>• 2015년 7월: 지내결연 건진 신만지 봉사 (쌀 후원 등)</li>
                <li>• 2015년 8월: 유소년 축구대회 대구광역시 유소년 축구대회 용인 및 격려</li>
                <li>• 2015년 8월: 화랑대기 전국 유소년 축구대회 용인 및 격려</li>
                <li>• 2015년 8월: 부부활동 아외영상음악회 (천북면 용인)</li>
                <li>• 2015년 8월: 로타리재단 및 보조금 간이 세미나 (경주코모도호텔 용인)</li>
                <li>• 2015년 9월: 지구총재 공식방문 (간절곶)</li>
                <li>• 2015년 9월: 신입회원 연수회 및 회원단합회 (간절곶)</li>
                <li>• 2015년 10월: 위덕대학교 경주중앙로타랙트클럽 지원금 전달(위덕대학교)</li>
                <li>• 2015년 10월: 충재공식방문 (영천 한솔온천)</li>
                <li>• 2015년 10월: 6.7지역 합동 지원사업 준공식</li>
                <li>• 2015년 11월: 사랑의 연탄나눔 지원 (지역주민 57가구, 2,000장)</li>
                <li>• 2015년 11월: 에디컴터 사랑의 김장담그기 봉사 (위덕대 경주캠퍼스와 합동)</li>
                <li>• 2015년 12월: 육군 제50사단 한센대 지원사업 (육군 육군 제50사단)</li>
                <li>• 2015년 12월: 부부활동 송년의 밤 (센텀뷔페)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2016-2017년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2016년 6월: 제12·13대 회장 및 임원, 이취임식 (월드컵경기장)</li>
                <li>
                  • 2016년 6월: 지내클럽인 국제로타리 3670지구 이리중앙로타리클럽과 이·취임식 참석 (익산 갤러리아펜션)
                </li>
                <li>• 2016년 6월: 송정 권오석 회장 K. R. Ravindran R전회장으로부터 클럽발전공로상 수상</li>
                <li>• 2016년 7월: 지구총재 이취임식 (포항필로스호텔)</li>
                <li>• 2016년 7월: 존9,10A 로타리협의회(대구엑스코)</li>
                <li>• 2016년 7월: 유적발굴 및 휴지 줍기 봉사 (분황사 일대)</li>
                <li>• 2016년 7월: 임시총회 (세차 개최 및 예, 결산, 클럽회관)</li>
                <li>• 2016년 8월: 화랑중강세미나 참가</li>
                <li>• 2016년 9월: 로타리재단 세미나 참가</li>
                <li>• 2016년 10월: 제4회 세계소아마비의 날 기념 & 경주문화원장 전달</li>
                <li>• 2016년 11월: 국수 나눔 봉사 (무료급식소 이용자)</li>
                <li>• 2016년 12월: 7지역 지구보조금사업 다문화가정 지원</li>
                <li>• 2017년 1월: 연차총회</li>
                <li>• 2017년 2월: 50사단 현명대에 전달받 기증</li>
                <li>• 2017년 3월: 부부활동 영화관람 추진</li>
                <li>• 2017년 4월: 경주정보고등학교 인터랙트클럽 지원금 전달</li>
                <li>• 2017년 5월: 사회복지시설 지원사업 (신내구보)</li>
                <li>• 2017년 6월: 2017-18년 지구연수협의회 참석</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2018-2019년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2018년 7월: 동천동 무료급식소 이용자 쌀 나눔 봉사활동</li>
                <li>• 2018년 7월: 부인회 개최(보문한우)</li>
                <li>• 2018년 7월: 학교방 청소년 봉사활동 기증행사(경주시 청소년수련관)</li>
                <li>• 2018년 8월: 에디컴터 봉사활동(강릉 및 놀이터 참가지역)</li>
                <li>• 2018년 8월: 유소년 축구대회 서포터즈 활동(안산FC 주니어클럽)</li>
                <li>• 2018년 8월: 화랑중강 세미나 참석(포항시 다정)</li>
                <li>• 2018년 9월: 신입회원 지식업무 자연환경 대청소</li>
                <li>• 2018년 9월: 클럽관리 세미나 참석(대구엑스코)</li>
                <li>• 2018년 9월: 무료급식소 이용자 봉사활동, 로타랙트 봉사금 전달</li>
                <li>• 2018년 9월: 부부활동 문화관람 전달, 아르르라카 게임 전달</li>
                <li>• 2018년 10월: 세계소아마비의 날 홍보활동(경주역 광장)</li>
                <li>• 2018년 10월: 세계소아마비의 날 홍보활동(경주시 중앙시장)</li>
                <li>• 2018년 11월: 사랑의 연탄나눔 봉사활동(경주시 동천동)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2020-2021년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2020년 6월: 클럽회관 정기모임</li>
                <li>• 2020년 6월: 제16,17대 회장 및 임원, 이사 이·취임식(다케이호텔)</li>
                <li>• 2020년 7월: 클럽회관 정기모임</li>
                <li>• 2020년 7월: 에디컴터 쌀나눔 봉사</li>
                <li>• 2020년 7월: 예, 결산 총회 (클럽회관)</li>
                <li>• 2020년 7월: 부인회 (보문한우)</li>
                <li>• 2020년 8월: 화랑위원회, 재단위원회 모임 (해동마당)</li>
                <li>• 2020년 8월: 신세대위원회 모임 (곤드레 참한밥상)</li>
                <li>• 2020년 8월: 클럽관리 위원회 모임 (보문한우)</li>
                <li>• 2020년 8월: 인터랙트클럽 봉사지원금 전달 (경주정보고등학교)</li>
                <li>• 2020년 8월: 사랑의 마스크 전달 (경주시청)</li>
                <li>• 2020년 9월: 예술의전당 방역 봉사활동</li>
                <li>• 2020년 9월: 경주신덕RC 합동 봉사 및 놀가 등기 행사 (황성공원)</li>
                <li>• 2020년 9월: 사랑의 생필품 나눔 봉사 (은혜원)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2022-2023년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2022년 10월: 이사회(소마루)</li>
                <li>• 2022년 10월: 위덕대학교 봉사지원금 전달</li>
                <li>• 2022년 10월: 부인회 정기모임(보문한우)</li>
                <li>• 2022년 10월: 소아마비 박멸 홍보 및 음료봉사 나눔봉사</li>
                <li>• 2022년 10월: 6.7지역 합동 지구보조금사업 (경주시)</li>
                <li>• 2022년 11월: 부부활동 영화관람 정기모임</li>
                <li>• 2022년 11월: 전북 모아리 정화 활동</li>
                <li>• 2022년 11월: 정기 이사회(동백)</li>
                <li>• 2022년 12월: 연차총회 정기모임(클럽회관)</li>
                <li>• 2022년 12월: 송년의 밤 부부활동 정기모임 (곤드레 참한밥상)</li>
                <li>• 2022년 12월: 송년의 밤 부부활동 정기모임(곤드레 참한밥상)</li>
                <li>• 2022년 12월: 이사회 (용강국밥)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2023-2024년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2023년 1월: 임시총회 정기모임(클럽회관)</li>
                <li>• 2023년 1월: 중증장애인 거주시설 지원사업 (경주시 거주시설 지원금)</li>
                <li>• 2023년 1월: 사랑의 생필품 나눔 봉사(황성동 행정복지센터)</li>
                <li>• 2023년 1월: 정기 이사회(소마루)</li>
                <li>• 2023년 1월: 지구보조금 해외봉사 사업 (김보디아 사업팀)</li>
                <li>• 2023년 1월: 부부활동 영화관람 정기모임 (롯데시네마)</li>
                <li>• 2023년 2월: 이사회 (전북한우)</li>
                <li>• 2023년 2월: 부부활동 영화관람 정기모임 (롯데시네마)</li>
                <li>• 2023년 2월: 2023-24년도 로타리데이 개최 (다케이호텔 거문고홀)</li>
                <li>• 2023년 3월: 부부활동영화관람 정기모임 (롯데시네마)</li>
                <li>• 2023년 3월: 황경정화 봉사 정기모임 (스금강산 일원)</li>
                <li>• 2023년 3월: 이사회 (우리마당 동천점)</li>
                <li>• 2023년 4월: 정식정기 모임 (서부한방 경주점)</li>
                <li>• 2023년 4월: 정식정기 모임 (정목쌀밥)</li>
                <li>• 2023년 4월: 이사회 (지연에 곤드레참한밥상)</li>
                <li>• 2023년 4월: 지구대회 (경주 실내체육관)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-3">2024-2025년</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2024년 7월: 2024-25년도 예산 이사회 (동백촌)</li>
                <li>• 2024년 7월: 2024-25년도 첫 정기모임 (클럽회관)</li>
                <li>• 2024년 7월: 예, 결산 정기모임 (클럽회관)</li>
                <li>• 2024년 7월: 2차 이사회 (지연에 곤드레참한밥상)</li>
                <li>• 2024년 7월: 사랑의 쌀(이취임식 성취식) 전달식 (은혜원)</li>
                <li>• 2024년 8월: 7차 정기모임</li>
                <li>• 2024년 8월: 위원회별 정기모임-1팀 (안성장)</li>
                <li>• 2024년 8월: 위원회별 정기모임-2팀 (고마음)</li>
                <li>• 2024년 8월: 클럽활성화 워크숍 (다케이호텔 거문고홀)</li>
                <li>• 2024년 8월: 3차 이사회 (나점오리)</li>
                <li>• 2024년 8월: 화랑중강지구위원회 및 모임 (동백촌)</li>
                <li>• 2024년 8월: 인터랙트클럽 봉사지원금 전달 (경주정보고등학교)</li>
                <li>• 2024년 9월: 7지역 주최 합동 현명봉사 (불국사 능하마나로마트 주차장)</li>
                <li>• 2024년 9월: 임시총회 정기모임 (클럽회관)</li>
                <li>• 2024년 9월: 부인회 모임 (보문한우)</li>
                <li>• 2024년 9월: 황경정화봉사 (스금강산 주변)</li>
                <li>• 2024년 9월: 신입회원 연수회 (목마을)</li>
                <li>• 2024년 9월: 4차 이사회 (소마루)</li>
                <li>• 2024년 10월: 임시총회 정기모임 (클럽회관)</li>
                <li>• 2024년 10월: 지내마을 물품지원 및 황경정화봉사</li>
                <li>• 2024년 10월: 충재공식방문 클럽협의회 (클럽회관)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
