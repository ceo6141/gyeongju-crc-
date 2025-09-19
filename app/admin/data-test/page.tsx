import { Navigation } from "@/components/navigation"
import { DataPersistenceTest } from "@/components/data-persistence-test"

export default function DataTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">데이터 지속성 테스트</h1>
              <p className="text-lg text-gray-600">
                공지사항, 봉사활동, 갤러리 데이터의 저장 및 로드 기능을 테스트합니다
              </p>
            </div>

            <DataPersistenceTest />

            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">데이터 지속성 개선사항</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>이중 백업 시스템: 메인 데이터와 백업 데이터 동시 저장</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>자동 복구: 메인 데이터 손실 시 백업에서 자동 복구</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>타임스탬프 관리: 데이터 저장 시점 추적</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>수동 백업: JSON 파일로 데이터 다운로드 가능</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>크로스 페이지 동기화: 페이지 간 데이터 일관성 보장</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
