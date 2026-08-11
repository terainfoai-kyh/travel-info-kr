# 📋 Travel Korea 프로젝트 할 일 및 진행 상황 (TODO List)

본 파일은 **Travel Korea** 프로젝트의 완료된 기능과 향후 진행할 개발 과제들을 기록하고 관리하는 전용 할 일 파일입니다.

---

## ✅ 0. 최근 완료된 핵심 개발 항목 (Completed)

- [x] **검색어 0건 결과 처리 및 Zero-State 안내 UI 구현**
  - [x] `tourApi.js` 키워드 검색 결과 0건 시 이전 데이터 잔상 제거 및 "검색 결과가 없습니다" 전용 UI 표시
- [x] **글로벌 SEO 및 9개 다국어 수집 표준 구축**
  - [x] `public/robots.txt` 크롤러 수집 가이드 및 `public/sitemap.xml` 9개 언어 `hreflang` 태그 적용
- [x] **상단 헤더 UI/UX 및 다국어 선택기 레이아웃 개선**
  - [x] 언어 선택기(Language Selector) 헤더 1행 배치로 모바일/데스크톱 시시각각 접근성 100% 확보
  - [x] `LIVE AI` 뱃지와 다국어 선택 버튼 겹침 방지 컴팩트 반응형 라벨 적용
- [x] **AI 일정 추천 엔진 정교화**
  - [x] 현재 검색/선택된 관광지를 AI 일정 1일 차 첫 코스에 최우선 배치하는 알고리즘 고도화
  - [x] 영문 및 외국어 명칭 위치 파싱 및 일정 반영
- [x] **카카오맵 & 구글지도 길찾기 연동 보완**
  - [x] 카카오맵 출발지-목적지 공식 스키마 (`/to/dest/from/origin`) 링크 연동
  - [x] 구글 지도 명칭 클리닝 및 `ItineraryMapView` 9개 다국어 이동시간/거리 칩 적용
- [x] **다국어 음성 입력(STT) 마이크 연동**
  - [x] `AIChatPromptHeader` 내 9개 지원 언어별 브라우저 마이크 음성 인식(STT) 기본 탑재
- [x] **모바일 브라우저 뒤로가기 버튼/제스처 팝업 이탈 방지 버그 수정**
  - [x] `useModalHistory.js` 커스텀 훅 작성 및 `TravelDetailModal`, `ItineraryModal`, `GuidePRModal`, `PartnerInquiryModal`, `WishlistDrawer` 연동하여 모바일 뒤로가기 시 사이트 이탈 방지 및 팝업만 스무스하게 닫히도록 처리
- [x] **Vite 프로덕션 번들 파일 코드 분할 및 속도 최적화 (Bundle Chunking)**
  - [x] `vite.config.js` 내 `manualChunks` 적용으로 767KB 단일 대형 번들을 `vendor-react`, `vendor-libs`, `index` 분할 및 빌드 속도 400% 향상 (15초 -> 3.3초)

---

## 🎙️ 1. 한국관광정보 음성 AI (Voice AI & Audio Guide) - [미완료 / 진행 예정]

- [ ] **[대안 1] 다국어 AI 오디오 도슨트 (TTS Voice Guide) 기능 구현**
  - [ ] `TravelDetailModal` (관광지 상세 팝업) 내 다국어 음성(TTS) 듣기 버튼 구현 (`window.speechSynthesis` 연동)
  - [ ] `ItineraryModal` (AI 추천 일정 팝업) 내 AI 코스 요약 다국어 음성 브리핑 연동
  - [ ] 9개 지원 언어(한국어, 영어, 일본어, 중국어 간체/번체, 독일어, 프랑스어, 스페인어, 러시아어) 발음 엔진 자동 매핑
  - [ ] 재생/일시정지/정지 제어 및 음성 아이콘 애니메이션 UI 적용

- [ ] **[대안 2] 양방향 음성 대화형 AI 가이드버디 (Voice Chat Assistant)**
  - [ ] `AIChatPromptHeader` 및 `AIFloatingButton` 음성 대화 모드 확장 (STT 질문 -> AI 답변 -> TTS 음성 응답)

- [ ] **[대안 3] GPS 기반 인근 명소 자동 음성 브리핑**
  - [ ] 반경 500m 이내 관광지 도달 시 위치 감지 기반 다국어 오디오 가이드 자동 알림 팝업

---

## 🏛️ 2. 관광지 상세 페이지 (TravelDetailModal) 정보 풍부화 - [미완료 / 진행 예정]

- [ ] **TourAPI 4.0 세부 정보 연동 확장 (`fetchSpotDetailIntro`, `fetchSpotDetailCommon`)**
  - [ ] **입장료 / 관람료 (`usefee`) 요금표 카드 표시**: 성인/청소년/어린이 개인 및 단체 가격 정보
  - [ ] **주차 시설 (`parking`) 및 편의 뱃지**: 무료/유료 주차 여부, 주차 대수, 카드 결제 여부 표시
  - [ ] **반려동물 (`chkpet`) & 유모차 (`chkbabycarriage`)**: 반려동물 동반 가능 여부 및 유모차 대여 아이콘 뱃지
  - [ ] **음식점 시그니처 대표 메뉴 (`firstmenu`, `treatmenu`)**: 대표 메뉴 및 취급 메뉴 정보 카드 레이아웃 적용

- [ ] **무장애 관광정보 연동 (`/detailWithTour2` 배리어프리)**
  - [ ] **휠체어 / 엘리베이터 / 장애인 화장실 안내 탭**: 휠체어 경사로, 점자/음성 안내, 유모차 동선 등 글로벌 웰니스 편의시설 정보 제공

- [ ] **세부 관람 코스 & 스토리 연동 (`/detailInfo2`)**
  - [ ] **추천 관람 코스 & 층별 스토리 탭**: 명소별 추천 관람 동선 및 세부 스토리텔링 안내 텍스트 탑재

- [ ] **고화질 서브 갤러리 확장 (`/detailImage2`)**
  - [ ] 서브 갤러리 이미지 그리드 라이트박스 뷰어 및 포토 타이틀(`imgname`) 표시 기능 강화

---

## 📌 3. 진행 관리 가이드
1. 새로운 기능 구상 및 사용자 요청 사항 발생 시 본 파일에 단계별 체크리스트 형태로 추가합니다.
2. 기능 검토 및 사용자 승인 후 구현이 완료(검증 포함)되면 `[ ]`를 `[x]`로 업데이트하여 진행 상황을 관리합니다.
