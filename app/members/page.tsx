"use client"

import { useState, useEffect, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Phone, Building, Calendar, Plus, Edit, Trash2, Save, X } from "lucide-react"
import Image from "next/image"
import { NaverBandLink } from "@/components/naver-band-link"
import { type Member, membersData } from "@/lib/members-data"
import { ProtectedButton } from "@/components/protected-button"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"

const initialMembers: Member[] = []

export default function MembersPage() {
  const { requireAuth, showLogin, setShowLogin, handleLoginSuccess } = useAdminAuth()

  const [members, setMembers] = useState<Member[]>(membersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [newMember, setNewMember] = useState<Member>({
    name: "",
    nameHanja: "",
    nickname: "",
    memberNo: "",
    company: "",
    phone: "",
    joinDate: "",
    birthDate: "",
    title: "",
    spouse: "",
    memberPhoto: "/rotary-international-logo.png",
    spousePhoto: "/rotary-international-logo.png",
  })
  const [attendanceRate, setAttendanceRate] = useState<number>(85)
  const [isEditingAttendance, setIsEditingAttendance] = useState(false)

  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem("rotary-members")
      const savedAttendanceRate = localStorage.getItem("rotary-attendance-rate")

      if (savedMembers) {
        const parsedMembers = JSON.parse(savedMembers)
        if (!Array.isArray(parsedMembers) || parsedMembers.length !== membersData.length) {
          console.log(
            `[v0] Member count mismatch (${parsedMembers.length} vs ${membersData.length}), resetting to base data`,
          )
          localStorage.removeItem("rotary-members")
          setMembers(membersData)
          localStorage.setItem("rotary-members", JSON.stringify(membersData))
          return
        }

        // Check for invalid birth dates and fix them
        const mergedMembers = parsedMembers.map((savedMember: Member) => {
          const baseMember = membersData.find((m) => m.name === savedMember.name)

          // Fix invalid birth date formats like "71" -> "1971.08.21"
          if (savedMember.birthDate && savedMember.birthDate.length <= 2 && baseMember?.birthDate) {
            console.log(
              `[v0] Fixing invalid birth date for ${savedMember.name}: "${savedMember.birthDate}" -> "${baseMember.birthDate}"`,
            )
            return {
              ...savedMember,
              birthDate: baseMember.birthDate,
            }
          }

          // If birth date is missing in saved data but exists in base data, use base data
          if ((!savedMember.birthDate || !savedMember.birthDate.trim()) && baseMember?.birthDate) {
            return {
              ...savedMember,
              birthDate: baseMember.birthDate,
            }
          }

          return savedMember
        })

        setMembers(mergedMembers)
        console.log("[v0] Loaded and merged members from localStorage:", mergedMembers.length)

        // Update localStorage with merged data
        localStorage.setItem("rotary-members", JSON.stringify(mergedMembers))
      } else {
        console.log("[v0] No saved data, loading initial members")
        setMembers(membersData)
        localStorage.setItem("rotary-members", JSON.stringify(membersData))
      }

      if (savedAttendanceRate) {
        setAttendanceRate(Number.parseFloat(savedAttendanceRate))
      }
    } catch (error) {
      console.log("[v0] Error loading data, loading initial members:", error)
      setMembers(membersData)
      localStorage.setItem("rotary-members", JSON.stringify(membersData))
    }
  }, [])

  const updateMembersStorage = (newMembers: Member[]) => {
    try {
      if (!Array.isArray(newMembers)) {
        throw new Error("Invalid members data")
      }

      setMembers(newMembers)
      localStorage.setItem("rotary-members", JSON.stringify(newMembers))
      console.log("[v0] Updated localStorage with", newMembers.length, "members")
    } catch (error) {
      console.error("[v0] Error updating localStorage:", error)
      alert("데이터 저장 중 오류가 발생했습니다.")
    }
  }

  const calculateAverageExperience = () => {
    if (members.length === 0) return 0

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    const totalExperience = members.reduce((sum, member) => {
      if (!member.joinDate) return sum

      const joinDateParts = member.joinDate.split(/[.-]/)
      if (joinDateParts.length < 2) return sum

      const joinYear = Number.parseInt(joinDateParts[0]) || currentYear
      const joinMonth = Number.parseInt(joinDateParts[1]) || 1

      // Calculate years with month precision
      let experience = currentYear - joinYear
      if (currentMonth < joinMonth) {
        experience -= 1
      }

      return sum + Math.max(0, experience)
    }, 0)

    return Math.round((totalExperience / members.length) * 10) / 10 // Round to 1 decimal place
  }

  const averageAge = useMemo(() => {
    if (members.length === 0) {
      console.log("[v0] No members found")
      return 0
    }

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    const validMembers = members.filter((member) => {
      if (!member.birthDate || !member.birthDate.trim()) {
        console.log(`[v0] Member without birth date: ${member.name} (${member.nickname || "no nickname"})`)
        return false
      }

      // Extract birth year from various date formats
      const birthDateStr = member.birthDate.trim()
      let birthYear: number

      // Try to extract year from different formats
      if (birthDateStr.includes(".") || birthDateStr.includes("-") || birthDateStr.includes("/")) {
        // Format: YYYY.MM.DD, YYYY-MM-DD, YYYY/MM/DD
        const parts = birthDateStr.split(/[.\-/]/)
        birthYear = Number.parseInt(parts[0])
      } else if (birthDateStr.length === 4) {
        // Format: YYYY (birth year only)
        birthYear = Number.parseInt(birthDateStr)
      } else {
        console.log(`[v0] Member with invalid birth date format: ${member.name} - "${birthDateStr}"`)
        return false
      }

      // Validate birth year (reasonable range: 1930-2010)
      if (isNaN(birthYear) || birthYear < 1930 || birthYear > 2010) {
        console.log(`[v0] Member with invalid birth year: ${member.name} - ${birthYear}`)
        return false
      }

      return true
    })

    console.log(
      `[v0] Found ${validMembers.length} members with valid birth years out of ${members.length} total members`,
    )

    console.log("[v0] All members birth date status:")
    members.forEach((member, index) => {
      console.log(
        `${index + 1}. ${member.name} (${member.nickname || "no nickname"}): "${member.birthDate || "NO BIRTH DATE"}"`,
      )
    })

    if (validMembers.length === 0) {
      console.log("[v0] No members with valid birth years found")
      return 0
    }

    // Calculate ages based on birth year
    const ages = validMembers
      .map((member) => {
        try {
          const birthDateStr = member.birthDate!.trim()
          let birthYear: number

          if (birthDateStr.includes(".") || birthDateStr.includes("-") || birthDateStr.includes("/")) {
            const parts = birthDateStr.split(/[.\-/]/)
            birthYear = Number.parseInt(parts[0])
          } else {
            birthYear = Number.parseInt(birthDateStr)
          }

          const age = currentYear - birthYear
          return Math.max(0, age) // Ensure age is not negative
        } catch (error) {
          return null
        }
      })
      .filter((age): age is number => age !== null)

    if (ages.length === 0) {
      console.log("[v0] No valid ages calculated from birth years")
      return 0
    }

    const totalAge = ages.reduce((sum, age) => sum + age, 0)
    const averageAge = totalAge / ages.length

    console.log(
      `[v0] Birth year based average age calculation: ${ages.length} valid members out of ${members.length} total, total age: ${totalAge}, average: ${averageAge.toFixed(1)}`,
    )

    return Math.round(averageAge * 10) / 10
  }, [members])

  const updateAttendanceRate = (rate: number) => {
    setAttendanceRate(rate)
    localStorage.setItem("rotary-attendance-rate", rate.toString())
  }

  const filteredMembers = members
    .filter((member) => {
      if (!searchTerm.trim()) return true // Show all members if search term is empty

      const searchLower = searchTerm.toLowerCase().trim()

      const nameMatch = member.name.toLowerCase().includes(searchLower)
      const companyMatch = member.company.toLowerCase().includes(searchLower)
      const nicknameMatch =
        member.nickname && member.nickname.trim() && member.nickname.toLowerCase().includes(searchLower)
      const memberNoMatch =
        member.memberNo && member.memberNo.trim() && member.memberNo.toLowerCase().includes(searchLower)
      const nameHanjaMatch =
        member.nameHanja && member.nameHanja.trim() && member.nameHanja.toLowerCase().includes(searchLower)

      return nameMatch || companyMatch || nicknameMatch || memberNoMatch || nameHanjaMatch
    })
    .sort((a, b) => {
      // Sort by Korean name in alphabetical order
      return a.name.localeCompare(b.name, "ko-KR", {
        numeric: true,
        sensitivity: "base",
      })
    })

  const handlePhotoUpload = (memberNo: string, photoType: "member" | "spouse", file: File) => {
    if (!file) return

    if (file.size > 3 * 1024 * 1024) {
      alert("파일 크기는 3MB 이하여야 합니다.")
      return
    }

    // File type check
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string
        if (!result) {
          alert("파일을 읽는 중 오류가 발생했습니다.")
          return
        }

        // Create image for compression
        const img = new Image()
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            if (!ctx) {
              alert("이미지 처리 중 오류가 발생했습니다.")
              return
            }

            const originalWidth = img.width
            const originalHeight = img.height

            // Determine optimal size based on original dimensions
            let targetSize = 120
            if (originalWidth > 2000 || originalHeight > 2000) {
              targetSize = 150 // Larger target for high-res images
            } else if (originalWidth < 500 || originalHeight < 500) {
              targetSize = 100 // Smaller target for low-res images
            }

            canvas.width = targetSize
            canvas.height = targetSize

            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"
            ctx.drawImage(img, 0, 0, targetSize, targetSize)

            let quality = 0.8
            if (file.size > 2 * 1024 * 1024) {
              quality = 0.6 // Lower quality for large files
            } else if (file.size > 1 * 1024 * 1024) {
              quality = 0.7 // Medium quality for medium files
            }

            const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)

            const finalSize = compressedDataUrl.length * 0.75 // Approximate size in bytes
            let finalDataUrl = compressedDataUrl

            if (finalSize > 500 * 1024) {
              // If still larger than 500KB
              finalDataUrl = canvas.toDataURL("image/jpeg", 0.5) // More aggressive compression
            }

            // Update member data
            const updatedMembers = members.map((member) =>
              member.memberNo === memberNo
                ? {
                    ...member,
                    [photoType === "member" ? "memberPhoto" : "spousePhoto"]: finalDataUrl,
                  }
                : member,
            )

            updateMembersStorage(updatedMembers)
            alert("사진이 성공적으로 업로드되었습니다.")
          } catch (error) {
            console.error("[v0] Image compression error:", error)
            alert("이미지 처리 중 오류가 발생했습니다.")
          }
        }

        img.onerror = () => {
          alert("이미지를 로드할 수 없습니다.")
        }

        img.src = result
      } catch (error) {
        console.error("[v0] File reading error:", error)
        alert("파일을 읽는 중 오류가 발생했습니다.")
      }
    }

    reader.onerror = () => {
      alert("파일을 읽는 중 오류가 발생했습니다.")
    }

    reader.readAsDataURL(file)
  }

  const removePhoto = (memberNo: string, photoType: "member" | "spouse") => {
    requireAuth(() => {
      updateMembersStorage(
        members.map((member) =>
          member.memberNo === memberNo
            ? {
                ...member,
                [photoType === "member" ? "memberPhoto" : "spousePhoto"]: "/rotary-international-logo.png",
              }
            : member,
        ),
      )
    })
  }

  const deleteMember = (memberNo: string) => {
    requireAuth(() => {
      const memberToDelete = members.find((m) => m.memberNo === memberNo)
      if (!memberToDelete) {
        alert("삭제할 회원을 찾을 수 없습니다.")
        return
      }

      if (confirm(`정말로 ${memberToDelete.name} 회원을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
        const updatedMembers = members.filter((member) => member.memberNo !== memberNo)
        updateMembersStorage(updatedMembers)
        console.log("[v0] Deleted member:", memberToDelete.name, "Remaining members:", updatedMembers.length)
        alert(`${memberToDelete.name} 회원이 성공적으로 삭제되었습니다.`)

        if (editingMember?.memberNo === memberNo) {
          setEditingMember(null)
        }
      }
    })
  }

  const addMember = () => {
    requireAuth(() => {
      if (!newMember.name.trim() || !newMember.memberNo.trim() || !newMember.company.trim()) {
        alert("이름, 회원번호, 직장은 필수 입력 항목입니다.")
        return
      }

      const existingMember = members.find((member) => member.memberNo === newMember.memberNo.trim())
      if (existingMember) {
        alert("이미 존재하는 회원번호입니다.")
        return
      }

      const memberToAdd = {
        ...newMember,
        name: newMember.name.trim(),
        memberNo: newMember.memberNo.trim(),
        company: newMember.company.trim(),
        title: newMember.title?.trim() || "",
        spouse: newMember.spouse?.trim() || "",
        nameHanja: newMember.nameHanja?.trim() || "",
        nickname: newMember.nickname?.trim() || "",
        phone: newMember.phone?.trim() || "",
        joinDate: newMember.joinDate?.trim() || "",
        birthDate: newMember.birthDate?.trim() || "",
      }

      const updatedMembers = [...members, memberToAdd]
      updateMembersStorage(updatedMembers)

      setNewMember({
        name: "",
        nameHanja: "",
        nickname: "",
        memberNo: "",
        company: "",
        phone: "",
        joinDate: "",
        birthDate: "",
        title: "",
        spouse: "",
        memberPhoto: "/rotary-international-logo.png",
        spousePhoto: "/rotary-international-logo.png",
      })
      setShowAddForm(false)
      console.log("[v0] Added new member:", memberToAdd.name, "Total members:", updatedMembers.length)
      alert(`${memberToAdd.name} 회원이 성공적으로 추가되었습니다.`)
    })
  }

  const updateMember = (memberNo: string, updatedData: Partial<Member>) => {
    requireAuth(() => {
      if (!updatedData.name?.trim() || !updatedData.memberNo?.trim() || !updatedData.company?.trim()) {
        alert("이름, 회원번호, 회사명은 필수 입력 항목입니다.")
        return
      }

      if (updatedData.memberNo !== memberNo) {
        const existingMember = members.find(
          (member) => member.memberNo === updatedData.memberNo && member.memberNo !== memberNo,
        )
        if (existingMember) {
          alert("이미 존재하는 회원번호입니다.")
          return
        }
      }

      const cleanedData = {
        ...updatedData,
        name: updatedData.name?.trim(),
        nameHanja: updatedData.nameHanja?.trim() || "",
        nickname: updatedData.nickname?.trim() || "",
        memberNo: updatedData.memberNo?.trim(),
        company: updatedData.company?.trim(),
        phone: updatedData.phone?.trim() || "",
        joinDate: updatedData.joinDate?.trim() || "",
        title: updatedData.title?.trim() || "",
        spouse: updatedData.spouse?.trim() || "",
        birthDate: updatedData.birthDate?.trim() || "",
      }

      const updatedMembers = members.map((member) =>
        member.memberNo === memberNo ? { ...member, ...cleanedData } : member,
      )
      updateMembersStorage(updatedMembers)
      setEditingMember(null)
      console.log("[v0] Updated member:", cleanedData.name, "Total members:", updatedMembers.length)
      alert(`${cleanedData.name} 회원 정보가 성공적으로 수정되었습니다.`)
    })
  }

  const startEditMember = (member: Member) => {
    requireAuth(() => {
      setEditingMember(member)
    })
  }

  const handleAttendanceEdit = () => {
    requireAuth(() => {
      setIsEditingAttendance(true)
    })
  }

  const handleShowAddForm = () => {
    requireAuth(() => {
      setShowAddForm(!showAddForm)
    })
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Users className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">회원명부</h1>
          <p className="text-lg text-muted-foreground">경주중앙로타리클럽 회원들을 소개합니다.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="회원명, 아호, 직장명, 회원번호로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <ProtectedButton variant="outline" onClick={handleShowAddForm}>
              <Plus className="h-4 w-4 mr-2" />
              회원 추가
            </ProtectedButton>
          </div>
        </div>

        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>새 회원 추가</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  placeholder="이름 *"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="한자명"
                  value={newMember.nameHanja}
                  onChange={(e) => setNewMember({ ...newMember, nameHanja: e.target.value })}
                />
                <Input
                  placeholder="아호"
                  value={newMember.nickname}
                  onChange={(e) => setNewMember({ ...newMember, nickname: e.target.value })}
                />
                <Input
                  placeholder="회원번호 *"
                  value={newMember.memberNo}
                  onChange={(e) => setNewMember({ ...newMember, memberNo: e.target.value })}
                  required
                />
                <Input
                  placeholder="직장 *"
                  value={newMember.company}
                  onChange={(e) => setNewMember({ ...newMember, company: e.target.value })}
                  required
                />
                <Input
                  placeholder="직책"
                  value={newMember.title || ""}
                  onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                />
                <Input
                  placeholder="휴대폰"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                />
                <Input
                  placeholder="입회일 (YYYY.MM.DD)"
                  value={newMember.joinDate}
                  onChange={(e) => setNewMember({ ...newMember, joinDate: e.target.value })}
                />
                <Input
                  placeholder="출생년도 (YYYY)"
                  value={newMember.birthDate || ""}
                  onChange={(e) => setNewMember({ ...newMember, birthDate: e.target.value })}
                />
                <Input
                  placeholder="배우자명"
                  value={newMember.spouse || ""}
                  onChange={(e) => setNewMember({ ...newMember, spouse: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addMember}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{members.length}</div>
              <div className="text-sm text-muted-foreground">총 회원 수</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">2005</div>
              <div className="text-sm text-muted-foreground">창립년도</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{calculateAverageExperience()}년</div>
              <div className="text-sm text-muted-foreground">평균 경력</div>
              <div className="text-xs text-muted-foreground mt-1">(총 {members.length}명 기준)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{averageAge}세</div>
              <div className="text-sm text-muted-foreground">평균 연령</div>
              <div className="text-xs text-muted-foreground mt-1">
                (출생년도 기준{" "}
                {
                  members.filter((m) => {
                    if (!m.birthDate || !m.birthDate.trim()) return false
                    const birthDateStr = m.birthDate.trim()
                    let birthYear: number

                    if (birthDateStr.includes(".") || birthDateStr.includes("-") || birthDateStr.includes("/")) {
                      const parts = birthDateStr.split(/[.\-/]/)
                      birthYear = Number.parseInt(parts[0])
                    } else if (birthDateStr.length === 4) {
                      birthYear = Number.parseInt(birthDateStr)
                    } else {
                      return false
                    }

                    return !isNaN(birthYear) && birthYear >= 1930 && birthYear <= 2010
                  }).length
                }
                명)
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {isEditingAttendance ? (
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={attendanceRate}
                    onChange={(e) => setAttendanceRate(Number.parseFloat(e.target.value) || 0)}
                    className="text-center"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => {
                        updateAttendanceRate(attendanceRate)
                        setIsEditingAttendance(false)
                      }}
                    >
                      저장
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingAttendance(false)}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={handleAttendanceEdit}>
                  <div className="text-2xl font-bold text-primary">{attendanceRate}%</div>
                  <div className="text-sm text-muted-foreground">참여율 (클릭하여 수정)</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {searchTerm && <div className="mb-4 text-sm text-muted-foreground">검색 결과: {filteredMembers.length}명</div>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <Card key={member.memberNo} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-center items-center space-x-3">
                      <div className="text-center">
                        <Image
                          src={member.memberPhoto || "/rotary-international-logo.png"}
                          alt={`${member.name} 회원 사진`}
                          width={60}
                          height={60}
                          className="rounded-full mx-auto mb-1 object-cover border-2 border-gray-200"
                        />
                        <p className="text-xs text-muted-foreground font-medium">회원</p>
                      </div>

                      <div className="text-center">
                        <Image
                          src={member.spousePhoto || "/rotary-international-logo.png"}
                          alt={`${member.name} 배우자 사진`}
                          width={50}
                          height={50}
                          className="rounded-full mx-auto mb-1 object-cover border-2 border-gray-200"
                        />
                        <p className="text-xs text-muted-foreground font-medium">배우자</p>
                        {member.spouse && <p className="text-xs text-gray-600 mt-1 truncate">{member.spouse}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-center">
                        <h3 className="text-sm font-bold text-primary leading-tight">
                          {member.nickname && member.nickname.trim()
                            ? `${member.nickname} ${member.name}`
                            : member.name}
                        </h3>
                        {member.nameHanja && <p className="text-xs text-muted-foreground">{member.nameHanja}</p>}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Building className="h-3 w-3 text-muted-foreground mr-1 flex-shrink-0" />
                          <span className="truncate">{member.company}</span>
                        </div>

                        {member.title && (
                          <div className="flex items-center text-xs">
                            <span className="h-3 w-3 mr-1 flex-shrink-0"></span>
                            <span className="text-muted-foreground truncate">{member.title}</span>
                          </div>
                        )}

                        {member.phone && (
                          <div className="flex items-center text-xs">
                            <Phone className="h-3 w-3 text-muted-foreground mr-1 flex-shrink-0" />
                            <a
                              href={`tel:${member.phone.replace(/[^0-9]/g, "")}`}
                              className="truncate text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                              onClick={(e) => {
                                console.log("[v0] Initiating call to:", member.phone)
                              }}
                            >
                              {member.phone}
                            </a>
                          </div>
                        )}

                        <div className="flex items-center text-xs">
                          <Calendar className="h-3 w-3 text-muted-foreground mr-1 flex-shrink-0" />
                          <span className="truncate">입회: {member.joinDate}</span>
                        </div>

                        <div className="flex justify-center">
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            {member.memberNo}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 pt-2 border-t border-gray-100">
                      <ProtectedButton
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent text-xs px-2 py-1"
                        onClick={() => startEditMember(member)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        수정
                      </ProtectedButton>
                      <ProtectedButton
                        variant="destructive"
                        size="sm"
                        className="px-2 py-1"
                        onClick={() => deleteMember(member.memberNo)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </ProtectedButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-muted-foreground">
                다른 검색어로 시도해보세요. 회원명, 아호, 직장명, 회원번호로 검색할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        {editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">회원 정보 수정</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingMember(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">이름</label>
                  <Input
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    placeholder="이름"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">한자명</label>
                  <Input
                    value={editingMember.nameHanja}
                    onChange={(e) => setEditingMember({ ...editingMember, nameHanja: e.target.value })}
                    placeholder="한자명"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">회원번호</label>
                  <Input
                    value={editingMember.memberNo}
                    onChange={(e) => setEditingMember({ ...editingMember, memberNo: e.target.value })}
                    placeholder="회원번호"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">직책</label>
                  <Input
                    value={editingMember.title || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                    placeholder="직책"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">회사명</label>
                  <Input
                    value={editingMember.company}
                    onChange={(e) => setEditingMember({ ...editingMember, company: e.target.value })}
                    placeholder="회사명"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">전화번호</label>
                  <Input
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    placeholder="전화번호"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">입회일</label>
                  <Input
                    value={editingMember.joinDate}
                    onChange={(e) => setEditingMember({ ...editingMember, joinDate: e.target.value })}
                    placeholder="입회일"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">출생년도</label>
                  <Input
                    value={editingMember.birthDate || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, birthDate: e.target.value })}
                    placeholder="출생년도 (YYYY)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">아호</label>
                  <Input
                    value={editingMember.nickname || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, nickname: e.target.value })}
                    placeholder="아호"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">회원 사진</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Image
                        src={editingMember.memberPhoto || "/rotary-international-logo.png"}
                        alt="회원 사진 미리보기"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const input = event.target as HTMLInputElement
                            if (input && input.files && input.files.length > 0) {
                              const file = input.files[0]
                              if (file && editingMember) {
                                handlePhotoUpload(editingMember.memberNo, "member", file)
                                input.value = ""
                              }
                            }
                          }}
                          className="hidden"
                          id={`member-photo-${editingMember.memberNo}`}
                        />
                        <label
                          htmlFor={`member-photo-${editingMember.memberNo}`}
                          className="cursor-pointer block w-full p-3 border border-gray-200 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors text-center text-sm font-medium text-blue-700"
                        >
                          📷 사진 업로드 (3MB 이하, 자동 최적화)
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 bg-transparent"
                          onClick={() => removePhoto(editingMember.memberNo, "member")}
                        >
                          로타리 로고로 변경
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">배우자 사진</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Image
                        src={editingMember.spousePhoto || "/rotary-international-logo.png"}
                        alt="배우자 사진 미리보기"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const input = event.target as HTMLInputElement
                            if (input && input.files && input.files.length > 0) {
                              const file = input.files[0]
                              if (file && editingMember) {
                                handlePhotoUpload(editingMember.memberNo, "spouse", file)
                                input.value = ""
                              }
                            }
                          }}
                          className="hidden"
                          id={`spouse-photo-${editingMember.memberNo}`}
                        />
                        <label
                          htmlFor={`spouse-photo-${editingMember.memberNo}`}
                          className="cursor-pointer block w-full p-3 border border-gray-200 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors text-center text-sm font-medium text-blue-700"
                        >
                          📷 사진 업로드 (3MB 이하, 자동 최적화)
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 bg-transparent"
                          onClick={() => removePhoto(editingMember.memberNo, "spouse")}
                        >
                          로타리 로고로 변경
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">배우자명</label>
                  <Input
                    value={editingMember.spouse || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, spouse: e.target.value })}
                    placeholder="배우자명"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={() => updateMember(editingMember.memberNo, editingMember)} className="flex-1">
                  수정 완료
                </Button>
                <Button variant="outline" onClick={() => setEditingMember(null)} className="flex-1">
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <NaverBandLink variant="card" />
        </div>

        <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
      </div>
    </div>
  )
}
