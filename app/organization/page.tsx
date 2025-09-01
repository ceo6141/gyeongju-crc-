"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Origami as Org3, Users, Crown, Edit, Trash2, Plus, Save, X } from "lucide-react"
import { membersData } from "@/lib/members-data"

interface Executive {
  id: string
  position: string
  name: string
  type: "main" | "sub"
}

interface Committee {
  id: string
  name: string
  chairman: string
  members: string[]
}

interface SpecialCommittee {
  id: string
  name: string
  chairman: string
  members: string[]
}

interface OrganizationData {
  executives: Executive[]
  committees: Committee[]
  specialCommittees: SpecialCommittee[]
}

const getMemberDisplayName = (name: string) => {
  const member = membersData.find((m) => m.name === name || m.name.includes(name))
  if (member && member.nickname) {
    return `${member.nickname} ${name}`
  }
  return name
}

const getDefaultOrganizationData = (): OrganizationData => ({
  executives: [
    { id: "1", position: "직전회장", name: "김용현", type: "main" },
    { id: "2", position: "회장", name: "최용환", type: "main" },
    { id: "3", position: "차기회장", name: "미정", type: "main" },
    { id: "4", position: "클럽트레이너", name: "이재술", type: "sub" },
    { id: "5", position: "부회장", name: "허동욱", type: "sub" },
    { id: "6", position: "부회장", name: "최태복", type: "sub" },
    { id: "7", position: "감사", name: "김경진", type: "sub" },
    { id: "8", position: "감사", name: "남정악", type: "sub" },
    { id: "9", position: "정책위원회 총무", name: "최병준", type: "sub" },
    { id: "10", position: "사찰", name: "박재열", type: "sub" },
    { id: "11", position: "사찰", name: "이상익", type: "sub" },
    { id: "12", position: "사찰", name: "오승연", type: "sub" },
    { id: "13", position: "사찰", name: "이창희", type: "sub" },
    { id: "14", position: "사찰", name: "임성일", type: "sub" },
    { id: "15", position: "사찰", name: "서상호", type: "sub" },
    { id: "16", position: "재무", name: "이사", type: "sub" },
    { id: "17", position: "재무", name: "황병욱", type: "sub" },
    { id: "18", position: "부총무", name: "손인익", type: "sub" },
    { id: "19", position: "부총무", name: "문시영", type: "sub" },
    { id: "20", position: "부총무", name: "권오석", type: "sub" },
    { id: "21", position: "부총무", name: "권태석", type: "sub" },
    { id: "22", position: "부총무", name: "김원기", type: "sub" },
    { id: "23", position: "부총무", name: "박임관", type: "sub" },
    { id: "24", position: "부총무", name: "윤태열", type: "sub" },
  ],
  committees: [
    {
      id: "1",
      name: "클럽관리위원회",
      chairman: "조현우",
      members: ["최병준", "이상익", "서상호", "황병욱", "박임관", "박준민", "엄만섭"],
    },
    {
      id: "2",
      name: "멤버십(회원)위원회",
      chairman: "김용환",
      members: ["최원식", "황현호", "김일래", "김동해", "한기운", "임도경"],
    },
    {
      id: "3",
      name: "공공이미지(홍보)위원회",
      chairman: "전종필",
      members: ["정재근", "황대환", "박원수", "손동균", "김동수", "이경보"],
    },
    {
      id: "4",
      name: "봉사프로젝트위원회",
      chairman: "권국창",
      members: ["한동균", "권덕용", "조윤철", "이락우", "황해진", "이현호"],
    },
    {
      id: "5",
      name: "로타리재단위원회",
      chairman: "윤태열",
      members: ["이기삼", "최은호", "김태규", "이중효", "황영석", "이주형"],
    },
    {
      id: "6",
      name: "청소년(신세대)위원회",
      chairman: "이성민",
      members: [
        "손대호",
        "김태호",
        "김철태",
        "오태환",
        "김기태",
        "공영건",
        "황유신",
        "황정헌",
        "김병철",
        "최중혁",
        "남태연",
      ],
    },
  ],
  specialCommittees: [
    {
      id: "1",
      name: "회관건립 및 이전 추진위원회",
      chairman: "김동한",
      members: ["이정환", "남정악", "이창희"],
    },
    {
      id: "2",
      name: "20주년 기념사업 준비위원회",
      chairman: "이창희",
      members: ["박임관", "김동한", "박지훈"],
    },
    {
      id: "3",
      name: "신입회원영입 추진위원회",
      chairman: "오승연",
      members: ["이정환", "임성일", "이재술"],
    },
  ],
})

export default function OrganizationPage() {
  const [organizationData, setOrganizationData] = useState<OrganizationData>(getDefaultOrganizationData())
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editType, setEditType] = useState<"executive" | "committee" | "special">("executive")

  useEffect(() => {
    const savedData = localStorage.getItem("gyeongju-rotary-organization")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setOrganizationData(parsed)
        console.log("[v0] 조직도 데이터 로드됨:", parsed)
      } catch (error) {
        console.error("[v0] 조직도 데이터 로드 실패:", error)
        setOrganizationData(getDefaultOrganizationData())
      }
    } else {
      console.log("[v0] 조직도 기본 데이터 사용")
      saveOrganizationData(getDefaultOrganizationData())
    }
  }, [])

  const saveOrganizationData = (data: OrganizationData) => {
    localStorage.setItem("gyeongju-rotary-organization", JSON.stringify(data))
    setOrganizationData(data)
    console.log("[v0] 조직도 데이터 저장됨:", data)
  }

  const handleAuth = () => {
    if (password === "1234") {
      setIsAuthenticated(true)
      setPassword("")
      alert("관리자 인증 성공!")
    } else {
      alert("비밀번호가 틀렸습니다.")
    }
  }

  const handleSave = () => {
    if (editingItem) {
      const updatedData = { ...organizationData }

      if (editType === "executive") {
        if (editingItem.id === "new") {
          editingItem.id = Date.now().toString()
          updatedData.executives.push(editingItem)
        } else {
          updatedData.executives = updatedData.executives.map((item) =>
            item.id === editingItem.id ? editingItem : item,
          )
        }
      } else if (editType === "committee") {
        if (editingItem.id === "new") {
          editingItem.id = Date.now().toString()
          updatedData.committees.push(editingItem)
        } else {
          updatedData.committees = updatedData.committees.map((item) =>
            item.id === editingItem.id ? editingItem : item,
          )
        }
      } else if (editType === "special") {
        if (editingItem.id === "new") {
          editingItem.id = Date.now().toString()
          updatedData.specialCommittees.push(editingItem)
        } else {
          updatedData.specialCommittees = updatedData.specialCommittees.map((item) =>
            item.id === editingItem.id ? editingItem : item,
          )
        }
      }

      saveOrganizationData(updatedData)
      setEditingItem(null)
      alert("저장되었습니다!")
    }
  }

  const handleDelete = (type: "executive" | "committee" | "special", id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const updatedData = { ...organizationData }

      if (type === "executive") {
        updatedData.executives = updatedData.executives.filter((item) => item.id !== id)
      } else if (type === "committee") {
        updatedData.committees = updatedData.committees.filter((item) => item.id !== id)
      } else if (type === "special") {
        updatedData.specialCommittees = updatedData.specialCommittees.filter((item) => item.id !== id)
      }

      saveOrganizationData(updatedData)
      alert("삭제되었습니다!")
    }
  }

  const handleAdd = (type: "executive" | "committee" | "special") => {
    setEditType(type)
    if (type === "executive") {
      setEditingItem({ id: "new", position: "", name: "", type: "sub" })
    } else {
      setEditingItem({ id: "new", name: "", chairman: "", members: [] })
    }
  }

  const handleEdit = (type: "executive" | "committee" | "special", item: any) => {
    setEditType(type)
    setEditingItem({ ...item })
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Org3 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">2025-26년도 조직도</h1>
          <p className="text-lg text-muted-foreground">경주중앙로타리클럽의 조직 구조를 소개합니다.</p>

          <div className="mt-6 flex justify-center gap-4">
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="관리자 비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-48"
                />
                <Button onClick={handleAuth}>인증</Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditMode(!isEditMode)} variant={isEditMode ? "destructive" : "default"}>
                  {isEditMode ? "편집 종료" : "편집 모드"}
                </Button>
                <Button onClick={() => setIsAuthenticated(false)} variant="outline">
                  로그아웃
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Executive Leadership */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">임원진</h2>
            {isEditMode && (
              <Button onClick={() => handleAdd("executive")} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                임원 추가
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {organizationData.executives
              .filter((exec) => exec.type === "main")
              .map((executive) => (
                <Card key={executive.id} className={executive.position === "회장" ? "border-primary" : ""}>
                  <CardHeader className="relative">
                    <Crown className="h-12 w-12 text-primary mx-auto mb-2" />
                    <CardTitle>{executive.position}</CardTitle>
                    {isEditMode && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit("executive", executive)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("executive", executive.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-lg">{getMemberDisplayName(executive.name)}</p>
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {organizationData.executives
              .filter((exec) => exec.type === "sub")
              .map((executive) => (
                <Card key={executive.id} className="text-center relative">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{executive.position}</CardTitle>
                    {isEditMode && (
                      <div className="absolute top-1 right-1 flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit("executive", executive)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("executive", executive.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">{getMemberDisplayName(executive.name)}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Committees */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">위원회 조직</h2>
            {isEditMode && (
              <Button onClick={() => handleAdd("committee")} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                위원회 추가
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {organizationData.committees.map((committee) => (
              <Card key={committee.id} className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {committee.name}
                  </CardTitle>
                  {isEditMode && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit("committee", committee)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete("committee", committee.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Badge variant="outline">위원장</Badge> {getMemberDisplayName(committee.chairman)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {committee.members.map((member) => getMemberDisplayName(member)).join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Committees */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">특별위원회</h2>
            {isEditMode && (
              <Button onClick={() => handleAdd("special")} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                특별위원회 추가
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {organizationData.specialCommittees.map((committee) => (
              <Card key={committee.id} className="relative">
                <CardHeader>
                  <CardTitle>{committee.name}</CardTitle>
                  {isEditMode && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit("special", committee)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete("special", committee.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Badge variant="outline">위원장</Badge> {getMemberDisplayName(committee.chairman)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {committee.members.map((member) => getMemberDisplayName(member)).join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingItem.id === "new" ? "추가" : "수정"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {editType === "executive" ? (
                  <>
                    <div>
                      <label className="text-sm font-medium">직책</label>
                      <Input
                        value={editingItem.position}
                        onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                        placeholder="직책을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">이름</label>
                      <Input
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        placeholder="이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">유형</label>
                      <select
                        value={editingItem.type}
                        onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="main">주요 임원</option>
                        <option value="sub">일반 임원</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium">위원회명</label>
                      <Input
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        placeholder="위원회명을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">위원장</label>
                      <Input
                        value={editingItem.chairman}
                        onChange={(e) => setEditingItem({ ...editingItem, chairman: e.target.value })}
                        placeholder="위원장 이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">위원 (쉼표로 구분)</label>
                      <Textarea
                        value={Array.isArray(editingItem.members) ? editingItem.members.join(", ") : ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            members: e.target.value
                              .split(",")
                              .map((m) => m.trim())
                              .filter((m) => m),
                          })
                        }
                        placeholder="위원 이름들을 쉼표로 구분하여 입력하세요"
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    저장
                  </Button>
                  <Button onClick={() => setEditingItem(null)} variant="outline" className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    취소
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Footer />
    </div>
  )
}
