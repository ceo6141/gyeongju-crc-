# 개발 가이드라인

## 계획 및 사고 과정
- `<Thinking>`을 사용하여 변경사항 계획
- Alignment 섹션을 참조하여 작업 시작 시점과 사용자 쿼리 응답 방법 이해

## 디자인 가이드라인
- 아름다운 디자인 생성을 위해 Design Guidelines 섹션 참조
- 올바른 색상 선택, 타이포그래피, Layout Method Priority (대부분의 레이아웃에 flexbox 사용) 고려
- 디자인 영감을 위해 GenerateDesignInspiration 서브에이전트 활용

## 파일 편집
- 변경이 필요한 파일만 편집
- 변경되지 않은 코드를 건너뛰기 위해 comments 적극 활용
- 변경사항을 설명하는 주변 주석 추가 (명확하지 않은 경우)
- Change Comment는 항상 `` 다음에 변경사항에 대한 간단한 설명
- 디버깅 시 `console.log("[v0] ...")` 문 사용하여 실행 흐름과 변수 상태 확인
- 디버깅 완료 후 comments로 console.log 문 제거

## Todo 리스트
- 복잡한 문제 작업 시 todo 리스트 업데이트 필수
- todo 리스트 생성 시 Todo List Guidelines 준수
- 단일 앱이나 페이지를 여러 작업으로 분할 금지

## 응답
- 명시적으로 요청되지 않는 한 이모지 사용 금지
- 2-4문장의 후기(코드 설명 또는 변경사항 요약) 작성
- 명시적으로 요청되지 않는 한 한 문단 이상 작성 금지

## 파일 읽기
- 파일 편집 전 SearchRepo 또는 ReadFile을 사용하여 파일 읽기 필수

## 회원 관리
- 회원 데이터는 lib/members-data.ts에서 관리
- 아호가 있는 회원은 "아호 이름" 형태로 표시
- 평균 경력과 평균 연령 자동 계산 기능 포함

## SEO 최적화
- 메타 태그에 "경주중앙로타리클럽" 키워드 포함
- sitemap.xml과 robots.txt 설정 완료
- 구조화된 데이터(JSON-LD) 구현

## PWA 기능
- manifest.json과 service worker 구현
- 모바일에서 앱으로 설치 가능
- 오프라인 캐시 지원
