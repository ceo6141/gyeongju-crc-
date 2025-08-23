import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, CheckCircle } from "lucide-react"

export default function PlansPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Target className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">사업계획</h1>
          <p className="text-lg text-muted-foreground">2025-26년도 경주중앙로타리클럽의 사업계획을 소개합니다.</p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  지역사회 봉사
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">독거노인 돌봄 서비스</h4>
                  <p className="text-sm text-muted-foreground">매월 셋째 주 토요일, 생필품 전달 및 안부 확인</p>
                  <Badge variant="outline">연 12회</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">경주 문화유적지 정화활동</h4>
                  <p className="text-sm text-muted-foreground">분기별 주요 관광지 환경정화 및 안내활동</p>
                  <Badge variant="outline">연 4회</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">저소득층 주거환경 개선</h4>
                  <p className="text-sm text-muted-foreground">도배, 장판 교체 등 주거환경 개선 지원</p>
                  <Badge variant="outline">연 6회</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                  청소년 지원
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">장학금 지원 사업</h4>
                  <p className="text-sm text-muted-foreground">지역 우수 학생 대상 장학금 지원</p>
                  <Badge variant="outline">연 2회</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">진로체험 프로그램</h4>
                  <p className="text-sm text-muted-foreground">중고등학생 대상 직업체험 및 멘토링</p>
                  <Badge variant="outline">연 4회</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">로타랙트클럽 지원</h4>
                  <p className="text-sm text-muted-foreground">대학생 로타랙트클럽 활동 지원</p>
                  <Badge variant="outline">상시</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                  국제봉사
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">해외 교육시설 지원</h4>
                  <p className="text-sm text-muted-foreground">개발도상국 학교 건립 및 교육용품 지원</p>
                  <Badge variant="outline">연 1회</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">자매클럽 교류</h4>
                  <p className="text-sm text-muted-foreground">일본, 중국 자매클럽과의 문화교류</p>
                  <Badge variant="outline">연 2회</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">로타리재단 기부</h4>
                  <p className="text-sm text-muted-foreground">폴리오 퇴치 및 글로벌 그랜트 지원</p>
                  <Badge variant="outline">상시</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-orange-600" />
                  클럽 발전
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">회원 증강</h4>
                  <p className="text-sm text-muted-foreground">신입회원 10명 영입 목표</p>
                  <Badge variant="outline">연중</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">20주년 기념행사</h4>
                  <p className="text-sm text-muted-foreground">클럽 창립 20주년 기념 행사 개최</p>
                  <Badge variant="outline">2025년 하반기</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">회관 건립</h4>
                  <p className="text-sm text-muted-foreground">클럽 전용 회관 건립 추진</p>
                  <Badge variant="outline">장기계획</Badge>
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
