import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Origami as Org3, Users, Crown } from "lucide-react"

export default function OrganizationPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Org3 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">2025-26년도 조직도</h1>
          <p className="text-lg text-muted-foreground">경주중앙로타리클럽의 조직 구조를 소개합니다.</p>
        </div>

        {/* Executive Leadership */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">임원진</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader>
                <Crown className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>직전회장</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg">김용현</p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary">
              <CardHeader>
                <Crown className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>회장</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg text-primary">최용환</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Crown className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>차기회장</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg">미정</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">클럽트레이너</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">이재술</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">부회장</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">허동욱</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">부회장</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">최태복</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">감사</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">현승 남정악</p>
                <p className="font-semibold">김경진</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Committees */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center mb-8">위원회 조직</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  클럽관리위원회
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline">위원장</Badge> 조현우
                  </div>
                  <div className="text-sm text-muted-foreground">최병준, 이상익, 서상호, 황병욱, 박임관, 박준민</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  멤버십(회원)위원회
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline">위원장</Badge> 김용환
                  </div>
                  <div className="text-sm text-muted-foreground">최원식, 황현호, 김일래, 최지호, 한기운, 윤대한</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  공공이미지(홍보)위원회
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline">위원장</Badge> 전종필
                  </div>
                  <div className="text-sm text-muted-foreground">정재근, 황대환, 박원수, 김동해, 김동수, 임도경</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  봉사프로젝트위원회
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline">위원장</Badge> 권국창
                  </div>
                  <div className="text-sm text-muted-foreground">한동균, 권덕용, 조윤철, 손동균, 황해진, 이경보</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  로타리재단위원회
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline">위원장</Badge> 윤태열
                  </div>
                  <div className="text-sm text-muted-foreground">이기삼, 구대학, 김태규, 정연철, 황영석, 이현호</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  청소년(신세대)위원회
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline">위원장</Badge> 이성민
                  </div>
                  <div className="text-sm text-muted-foreground">손대호, 최은호, 김원준, 이락우, 김기태, 이주형</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Special Committees */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">특별위원회</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>회관건립 및 이전 추진위원회</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline">위원장</Badge> 이창희
                  </div>
                  <div className="text-sm text-muted-foreground">김동한, 박지훈</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>20주년 기념사업 준비위원회</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline">위원장</Badge> 박임관
                  </div>
                  <div className="text-sm text-muted-foreground">김동한, 이정환, 남정악, 이창희</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>신입회원영입 추진위원회</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline">위원장</Badge> 오승연
                  </div>
                  <div className="text-sm text-muted-foreground">이정환, 임성일, 이재술</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
