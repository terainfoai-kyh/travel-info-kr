# Project Living Spec & Architecture Decisions

이 문서는 선배님과의 모든 설계 철학, 시스템 환경, 요구사항, 규칙을 영구히 기록하여 **세션 리셋이나 안티그래비티 재부팅 후 새로 투입되는 에이전트도 100% 기억하고 동일한 원칙으로 동작하도록 하는 Living Spec**입니다.

---

## 0. 프로젝트 최우선 대원칙 (Never Forget)
1. **섣부른 대공사 절대 금지 (No Reckless Rewriting)**:
   - 기존에 잘 작동하고 있는 코드베이스, Gemini 연동, Context Engine, UI 디테일을 임의로 뒤엎지 않는다.
   - 반드시 선배님의 의도와 확인을 거친 후 핀셋으로 안전하게 작업한다.
2. **서브밋 / Proceed 팝업 100% 완전 봉인 (P0)**:
   - 화면을 방해하는 인터랙티브 팝업 카드 및 `ask_question` 유발 금지 (`RequestFeedback: false` 고정).
3. **Two-Track 배포 분리**:
   - 개발/테스트 배포: `origin` (`travelkorea_2.git`) ➔ Cloudflare Pages (`travelkorea-dev.pages.dev`)
   - 실운영 서비스 배포: `prod` (`travel-info-kr.git`) ➔ GitHub Pages (`travel-info-kr`)

---

## 1. 시스템 아키텍처 및 데이터 환경 (No Backend DB)
- **서버 유지비 0원의 JAMstack / Single Page Application**:
  - 별도의 외부 백엔드 DB(MySQL, Firebase, MongoDB 등)를 두지 않는다.
  - 사용자 상태(저장 여행, 위시리스트, 쿼터)는 브라우저 `localStorage`에 안전하게 보관한다.
- **데이터 소스**:
  - **한국관광공사 TourAPI 4.0** (`tourApi.js`): 실시간 정품 관광 정보 및 다국어 공식 CDN 이미지.
  - **내장 정적 지식 볼트** (`voraQnaVault.js`, `translations.js`): 1,000+ QnA 및 8개 국어 번역 사전.

---

## 2. VORA AI 배치 학습 시스템 (Active Learning Feedback Loop)
- **목적**: API 비용 0원, 0.5ms(0.0005초) 초고속 다국어 응답 실현.
- **파이프라인**:
  1. **미답변 질문 자동 수집 (`logUnansweredQuestion`)**: 사용자의 새로운 질문을 문맥(도시, 일수, 동행)과 함께 큐(`vora_unanswered_qna`)에 자동 축적.
  2. **Gemini Flash 배치 증류 (`AdminBatchModal.jsx`)**: 관리자 모달에서 Gemini를 통해 수집된 질문들을 고품질 4개 국어(한/영/일/중) 정답 JSON으로 일괄 변환.
  3. **영구 지식 축적 (`voraQnaVault.js`)**: 증류된 지식을 마스터 볼트에 탑재하여 다음부터 전 세계 사용자에게 API 호출 없이 0ms 즉시 응답.

---

## 3. Gemini AI(제미나이) 하이브리드 운영 정책
- **Tier 1 (Gemini 3.5 Flash 실시간 AI)**:
  - 동행자(친구, 부모님), 날씨, 호텔 짐 보관, 도착 시간 등 복잡한 사용자 자연어 조건에 100% 맞춘 초개인화 맞춤 일정 생성.
- **Tier 2 (로컬 물리 시뮬레이터 Fallback)**:
  - API Quota 초과, 네트워크 단절 시 화면이 멈추지 않도록 즉각 투입되는 100% 안전망 백업 엔진.
- **일정 생성 3대 황금 규칙**:
  - **동선 밀집 (Proximity Clustering)**: 하루 일정은 도보/대중교통 10~20분 내 동일 권역으로만 구성.
  - **단일 명소 표기 (No `&`, `/`)**: `경복궁 & 향원정` 금지 ➔ `경복궁` 단일 명소로 정직하게 표기 (구글맵/사진 매칭 100%).
  - **휴무일 방어 (Reality Check)**: 경복궁 화요일 휴무, 국립중앙박물관 월요일 휴무 등 실제 운영일 사전 체크.

---

## 4. UI/UX 및 일정 생성 원칙
1. **식당(밥집) 분리 정책**:
   - 타임라인 순번에는 순수 명소·체험·카페·야경만 배치하고, 식당은 일자별 `foodRecommendation` (오늘의 추천 로컬 미식 카드)로 단독 분리.
2. **스팟 중복 100% 차단 (`Global Visited Set`)**:
   - 1일차~5일차 전 기간에 걸쳐 한 번 방문한 명소는 다음 일차에서 절대 재등장하지 않음.
3. **[ 🗺️ 구글맵 길찾기 & 노선 ↗ ] 모바일 최적화 풀버튼**:
   - 오해를 부르는 비현실적 총 이동거리 텍스트를 배제하고, 클릭 시 다중 경유지 경로와 대중교통 노선이 바로 열리는 풀와이드 액션 버튼 유지.
4. **사람 걸음 기준 현실 물리 시뮬레이션**:
   - 기계적 3시간 분할(09:00/12:00/15:00/18:00) 덮어쓰기 금지.
   - 실제 체류시간과 보행 버퍼를 누적한 살아 숨 쉬는 24시간제 리얼 타임라인 산출.
