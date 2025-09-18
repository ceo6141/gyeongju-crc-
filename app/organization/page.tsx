"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface OrganizationData {
  executives: {
    pastPresident: string
    president: string
    presidentElect: string
    clubTrainer: string
    vicePresidents: string[]
    auditors: string[]
    directors: string[]
    secretary: string
    treasurer: string
    assistantSecretary: string[]
    inspectors: string[]
  }
  policyCommittee: {
    chair: string
    directors: string[]
  }
  specialCommittees: {
    name: string
    members: string[]
  }[]
  standingCommittees: {
    name: string
    members: string[]
  }[]
}

export default function OrganizationPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const [organizationData, setOrganizationData] = useState<OrganizationData>({
    executives: {
      pastPresident: "김용현",
      president: "최용환",
      presidentElect: "미정",
      clubTrainer: "이재술",
      vicePresidents: ["최태복", "허동욱"],
      auditors: ["김경진", "남정악"],
      directors: ["권태석", "권오석", "김동한", "이창희", "박지훈", "이정환"],
      secretary: "박재열",
      treasurer: "손인익",
      assistantSecretary: ["김원기", "문시영"],
      inspectors: ["오승연", "임성일"],
    },
    policyCommittee: {
      chair: "남정악",
      directors: [
        "최병준",
        "이상익",
        "이창희",
        "서상호",
        "황병욱",
        "권오석",
        "박임관",
        "윤태열",
        "이정환",
        "김동한",
        "오승연",
        "임성일",
        "김용현",
      ],
    },
    specialCommittees: [
      {
        name: "회관건립 및 20주년기념사업 준비위원회",
        members: ["박지훈", "박임관", "이정환", "윤태열", "이창희", "박임관", "이정환", "남정악"],
      },
      {
        name: "이전추진위원회",
        members: ["김동한", "이재술", "오승연", "임성일"],
      },
      {
        name: "신입회원영입추진위원회",
        members: ["이락우", "이중효", "오태환", "김병철"],
      },
    ],
    standingCommittees: [
      {
        name: "클럽관리 위원회",
        members: ["조현우", "최병준", "최원식", "정재근"],
      },
      {
        name: "멤버십(회원) 위원회",
        members: ["김용환", "이상익", "황현호"],
      },
      {
        name: "공공이미지(홍보) 위원회",
        members: [
          "전종필",
          "서상호",
          "김일래",
          "박원수",
          "황대환",
          "권덕용",
          "최은호",
          "김태호",
          "황유신",
          "한동균",
          "이기삼",
          "손대호",
          "엄만섭",
        ],
      },
      {
        name: "봉사프로젝트 위원회",
        members: [
          "권국창",
          "황병욱",
          "김동해",
          "손동균",
          "이락우",
          "이중효",
          "오태환",
          "김병철",
          "조윤철",
          "김태규",
          "김철태",
          "황정헌",
        ],
      },
      {
        name: "청소년(신세대) 위원회",
        members: ["이성민", "박준민", "임도경", "이경보", "이현호", "이주형", "공영건", "남태연"],
      },
      {
        name: "로타리재단 위원회",
        members: ["윤태열", "박임관", "한기운", "김동수", "황해진", "황영석", "김기태", "최중혁"],
      },
    ],
  })

  const [editingExecutive, setEditingExecutive] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")

  useEffect(() => {
    const savedData = localStorage.getItem("gyeongju-rotary-organization")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        if (
          parsedData &&
          parsedData.specialCommittees &&
          Array.isArray(parsedData.specialCommittees) &&
          parsedData.standingCommittees &&
          Array.isArray(parsedData.standingCommittees)
        ) {
          setOrganizationData(parsedData)
        }
      } catch (error) {
        console.error("조직도 데이터 로드 실패:", error)
      }
    }
  }, [])

  const saveData = (data: OrganizationData) => {
    try {
      localStorage.setItem("gyeongju-rotary-organization", JSON.stringify(data))
      setOrganizationData(data)
    } catch (error) {
      console.error("조직도 데이터 저장 실패:", error)
      alert("데이터 저장에 실패했습니다.")
    }
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

  const handleEdit = (type: string, index?: number) => {
    setEditingItem({ type, index })
    setIsEditing(true)
  }

  const handleSave = (newData: any) => {
    const updatedData = { ...organizationData }

    if (editingItem.type === "specialCommittee") {
      if (editingItem.index !== undefined) {
        updatedData.specialCommittees[editingItem.index] = newData
      } else {
        updatedData.specialCommittees.push(newData)
      }
    } else if (editingItem.type === "standingCommittee") {
      if (editingItem.index !== undefined) {
        updatedData.standingCommittees[editingItem.index] = newData
      } else {
        updatedData.standingCommittees.push(newData)
      }
    }

    saveData(updatedData)
    setIsEditing(false)
    setEditingItem(null)
  }

  const handleDelete = (type: string, index: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const updatedData = { ...organizationData }

      if (type === "specialCommittee") {
        updatedData.specialCommittees.splice(index, 1)
      } else if (type === "standingCommittee") {
        updatedData.standingCommittees.splice(index, 1)
      }

      saveData(updatedData)
    }
  }

  const handleExecutiveEdit = (field: string, value: string) => {
    setEditingExecutive(field)
    setEditingValue(value)
  }

  const handleExecutiveSave = (field: string) => {
    const updatedData = { ...organizationData }

    if (field === "pastPresident") {
      updatedData.executives.pastPresident = editingValue
    } else if (field === "president") {
      updatedData.executives.president = editingValue
    } else if (field === "presidentElect") {
      updatedData.executives.presidentElect = editingValue
    } else if (field === "clubTrainer") {
      updatedData.executives.clubTrainer = editingValue
    } else if (field === "secretary") {
      updatedData.executives.secretary = editingValue
    } else if (field === "treasurer") {
      updatedData.executives.treasurer = editingValue
    } else if (field === "assistantSecretary") {
      updatedData.executives.assistantSecretary = editingValue.split(", ").map((name) => name.trim())
    } else if (field === "inspectors") {
      updatedData.executives.inspectors = editingValue.split(", ").map((name) => name.trim())
    } else if (field.startsWith("vicePresident-")) {
      const index = Number.parseInt(field.split("-")[1])
      updatedData.executives.vicePresidents[index] = editingValue
    } else if (field.startsWith("auditor-")) {
      const index = Number.parseInt(field.split("-")[1])
      updatedData.executives.auditors[index] = editingValue
    } else if (field.startsWith("director-")) {
      const index = Number.parseInt(field.split("-")[1])
      updatedData.executives.directors[index] = editingValue
    } else if (field === "policyChair") {
      updatedData.policyCommittee.chair = editingValue
    } else if (field.startsWith("policyDirector-")) {
      const index = Number.parseInt(field.split("-")[1])
      updatedData.policyCommittee.directors[index] = editingValue
    }

    saveData(updatedData)
    setEditingExecutive(null)
    setEditingValue("")
  }

  const handleExecutiveCancel = () => {
    setEditingExecutive(null)
    setEditingValue("")
  }

  const EditableField = ({ field, value, placeholder }: { field: string; value: string; placeholder: string }) => {
    if (editingExecutive === field) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            placeholder={placeholder}
            className="text-sm"
            autoFocus
          />
          <Button size="sm" onClick={() => handleExecutiveSave(field)} className="p-1">
            저장
          </Button>
          <Button size="sm" variant="outline" onClick={handleExecutiveCancel} className="p-1 bg-transparent">
            취소
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 group">
        <p className="text-black font-bold text-lg min-h-[1.5rem] flex items-center">
          {value || <span className="text-gray-500 italic font-normal">{placeholder}</span>}
        </p>
        {isAuthenticated && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleExecutiveEdit(field, value)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-700 hover:bg-gray-100"
          >
            편집
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <div className="h-16 w-16 text-primary flex items-center justify-center text-2xl font-bold">🏢</div>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-foreground">2025-26년도 경주중앙로타리클럽 조직도</h1>
              <p className="text-xl text-muted-foreground mb-8">클럽의 조직 구조와 임원진을 확인하세요</p>

              <div className="flex justify-center">
                {!isAuthenticated ? (
                  <div className="flex gap-3 bg-card p-4 rounded-lg border shadow-sm">
                    <Input
                      type="password"
                      placeholder="관리자 비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-48"
                    />
                    <Button onClick={handleAuth} className="bg-primary hover:bg-primary/90">
                      🔒 인증
                    </Button>
                  </div>
                ) : (
                  <div className="bg-card p-4 rounded-lg border shadow-sm">
                    <Button onClick={() => setIsAuthenticated(false)} variant="outline">
                      로그아웃
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16">
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-3">
                👥 임원진
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Top Level - Presidents */}
              <div className="flex justify-center items-center mb-12">
                <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
                  <div className="text-center">
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="bg-amber-500 text-white p-2 rounded-lg mb-4">
                          <h3 className="font-bold text-lg">직전회장</h3>
                        </div>
                        <EditableField
                          field="pastPresident"
                          value={organizationData.executives.pastPresident}
                          placeholder="이름을 입력하세요"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30 hover:shadow-xl transition-shadow transform scale-105">
                      <CardContent className="p-8">
                        <div className="bg-primary text-primary-foreground p-3 rounded-lg mb-4">
                          <h3 className="font-bold text-xl">회장</h3>
                        </div>
                        <EditableField
                          field="president"
                          value={organizationData.executives.president}
                          placeholder="이름을 입력하세요"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Card className="bg-gradient-to-br from-secondary/10 to-secondary/20 border-secondary/30 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="bg-secondary text-secondary-foreground p-2 rounded-lg mb-4">
                          <h3 className="font-bold text-lg">차기회장</h3>
                        </div>
                        <EditableField
                          field="presidentElect"
                          value={organizationData.executives.presidentElect}
                          placeholder="이름을 입력하세요"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Connection Line */}
              <div className="flex justify-center mb-8">
                <div className="w-px h-8 bg-border"></div>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="bg-blue-500 text-white p-2 rounded-lg mb-3 text-center">
                      <h3 className="font-semibold">클럽트레이너</h3>
                    </div>
                    <EditableField
                      field="clubTrainer"
                      value={organizationData.executives.clubTrainer}
                      placeholder="이름을 입력하세요"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="bg-purple-500 text-white p-2 rounded-lg mb-3 text-center">
                      <h3 className="font-semibold">부회장</h3>
                    </div>
                    <div className="space-y-2">
                      {organizationData.executives.vicePresidents.map((vp, index) => (
                        <EditableField
                          key={index}
                          field={`vicePresident-${index}`}
                          value={vp}
                          placeholder={`부회장 ${index + 1}`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="bg-teal-500 text-white p-2 rounded-lg mb-3 text-center">
                      <h3 className="font-semibold">감사</h3>
                    </div>
                    <div className="space-y-2">
                      {organizationData.executives.auditors.map((auditor, index) => (
                        <EditableField
                          key={index}
                          field={`auditor-${index}`}
                          value={auditor}
                          placeholder={`감사 ${index + 1}`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="bg-indigo-500 text-white p-2 rounded-lg mb-3 text-center">
                      <h3 className="font-semibold">이사</h3>
                    </div>
                    <div className="space-y-2">
                      {organizationData.executives.directors.map((director, index) => (
                        <EditableField
                          key={index}
                          field={`director-${index}`}
                          value={director}
                          placeholder={`이사 ${index + 1}`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-t-lg"></div>
                    <CardTitle className="text-center text-lg font-bold relative z-10">재무</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <EditableField
                      field="treasurer"
                      value={organizationData.executives.treasurer}
                      placeholder="이름을 입력하세요"
                    />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-t-lg"></div>
                    <CardTitle className="text-center text-lg font-bold relative z-10">총무</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <EditableField
                      field="secretary"
                      value={organizationData.executives.secretary}
                      placeholder="이름을 입력하세요"
                    />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-violet-500 to-violet-600 text-white relative">
                    <div className="absolute inset-0 bg-violet-500 rounded-t-lg"></div>
                    <CardTitle className="text-center text-lg font-bold relative z-10">부총무</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <div className="grid grid-cols-2 gap-2">
                      {organizationData.executives.assistantSecretary.map((assistantSecretary, index) => (
                        <EditableField
                          key={index}
                          field={`assistantSecretary-${index}`}
                          value={assistantSecretary}
                          placeholder={`부총무 ${index + 1}`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white relative">
                    <div className="absolute inset-0 bg-cyan-500 rounded-t-lg"></div>
                    <CardTitle className="text-center text-lg font-bold relative z-10">사찰</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-2">
                      {organizationData.executives.inspectors.map((inspector, index) => (
                        <EditableField
                          key={index}
                          field={`inspector-${index}`}
                          value={inspector}
                          placeholder={`사찰 ${index + 1}`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-rose-500 to-rose-600 text-white">
              <CardTitle className="text-center text-2xl font-bold text-white">정책위원회</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 inline-block">
                  <CardContent className="p-4">
                    <div className="bg-rose-500 text-white p-2 rounded-lg mb-3">
                      <h3 className="font-semibold">위원장</h3>
                    </div>
                    <div className="flex items-center gap-2 group">
                      <p className="text-gray-900 font-bold text-lg min-h-[1.5rem] flex items-center">
                        {organizationData.policyCommittee.chair || (
                          <span className="text-gray-500 italic font-normal">위원장 이름</span>
                        )}
                      </p>
                      {isAuthenticated && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExecutiveEdit("policyChair", organizationData.policyCommittee.chair)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-700 hover:bg-gray-100"
                        >
                          편집
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {organizationData.policyCommittee.directors.map((director, index) => (
                  <div key={index} className="bg-rose-50 rounded-lg p-3 text-center border border-rose-200">
                    <div className="flex items-center gap-2 group justify-center">
                      <p className="text-gray-900 font-bold text-base min-h-[1.5rem] flex items-center">
                        {director || <span className="text-gray-500 italic font-normal">이사 {index + 1}</span>}
                      </p>
                      {isAuthenticated && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExecutiveEdit(`policyDirector-${index}`, director)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-700 hover:bg-gray-100"
                        >
                          편집
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-12">
          {/* Special Committees */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                특별위원회
              </h2>
              {isAuthenticated && (
                <Button
                  onClick={() => handleEdit("specialCommittee")}
                  className="bg-primary hover:bg-primary/90 shadow-lg"
                >
                  ➕ 위원회 추가
                </Button>
              )}
            </div>
            <div className="grid gap-6">
              {organizationData.specialCommittees && organizationData.specialCommittees.length > 0 ? (
                organizationData.specialCommittees.map((committee, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/20 border-b border-primary/20">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-primary text-lg">{committee.name}</CardTitle>
                        {isAuthenticated && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEdit("specialCommittee", index)}
                              size="sm"
                              variant="outline"
                              className="border-primary/30 text-primary hover:bg-primary/10"
                            >
                              편집
                            </Button>
                            <Button
                              onClick={() => handleDelete("specialCommittee", index)}
                              size="sm"
                              variant="destructive"
                            >
                              삭제
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-3">
                        {committee.members && committee.members.length > 0 ? (
                          committee.members.map((member, memberIndex) => (
                            <div
                              key={memberIndex}
                              className="bg-white rounded-lg p-3 text-center border border-primary/20 shadow-sm"
                            >
                              <p className="text-gray-900 font-bold text-base">{member || "미정"}</p>
                            </div>
                          ))
                        ) : (
                          <div className="bg-white rounded-lg p-3 text-center border border-primary/20 shadow-sm">
                            <p className="text-gray-900 font-bold text-base">미정</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">특별위원회가 없습니다.</div>
              )}
            </div>
          </div>

          {/* Standing Committees */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-secondary to-primary rounded-full"></div>
                상임위원회
              </h2>
              {isAuthenticated && (
                <Button
                  onClick={() => handleEdit("standingCommittee")}
                  className="bg-secondary hover:bg-secondary/90 shadow-lg"
                >
                  ➕ 위원회 추가
                </Button>
              )}
            </div>
            <div className="grid gap-6">
              {organizationData.standingCommittees && organizationData.standingCommittees.length > 0 ? (
                organizationData.standingCommittees.map((committee, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="bg-slate-700 border-b border-slate-600">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white text-xl font-bold">{committee.name}</CardTitle>
                        {isAuthenticated && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEdit("standingCommittee", index)}
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              편집
                            </Button>
                            <Button
                              onClick={() => handleDelete("standingCommittee", index)}
                              size="sm"
                              variant="destructive"
                            >
                              삭제
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-6 gap-3">
                        {committee.members && committee.members.length > 0 ? (
                          committee.members.map((member, memberIndex) => (
                            <div
                              key={memberIndex}
                              className="bg-white rounded-lg p-3 text-center border border-secondary/20 shadow-sm"
                            >
                              <p className="text-gray-900 font-bold text-base">{member || "미정"}</p>
                            </div>
                          ))
                        ) : (
                          <div className="bg-white rounded-lg p-3 text-center border border-secondary/20 shadow-sm">
                            <p className="text-gray-900 font-bold text-base">미정</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">상임위원회가 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem.index !== undefined ? "위원회 편집" : "위원회 추가"}
            </h3>
            <CommitteeEditForm
              committee={
                editingItem.index !== undefined
                  ? editingItem.type === "specialCommittee"
                    ? organizationData.specialCommittees[editingItem.index]
                    : organizationData.standingCommittees[editingItem.index]
                  : { name: "", members: [] }
              }
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

function CommitteeEditForm({
  committee,
  onSave,
  onCancel,
}: {
  committee: { name: string; members: string[] }
  onSave: (data: { name: string; members: string[] }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(committee.name)
  const [membersText, setMembersText] = useState(committee.members.join(", "))

  const handleSave = () => {
    if (!name.trim()) {
      alert("위원회 이름을 입력하세요.")
      return
    }

    const members = membersText
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m)
    onSave({ name: name.trim(), members })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">위원회 이름</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="위원회 이름을 입력하세요" />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">위원 (쉼표로 구분)</label>
        <Textarea
          value={membersText}
          onChange={(e) => setMembersText(e.target.value)}
          placeholder="위원 이름을 쉼표로 구분하여 입력하세요"
          rows={4}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button onClick={onCancel} variant="outline">
          취소
        </Button>
        <Button onClick={handleSave}>저장</Button>
      </div>
    </div>
  )
}
