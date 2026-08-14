# 📋 Travel Korea (Vora AI) 프로젝트 마스터 TODO & 작업 이력 관리

> **목적**: 31년 경력 선배님과 보라 AI(Vora)가 나눈 회의 및 구현 아키텍처를 기반으로, 중복 작업(Trial & Error)을 100% 방지하고 처리 결과를 명확히 기록·관리하는 마스터 로드맵 파일입니다.

---

## 🏛️ 1. 역할 분담 & 준비 사항 (Role Allocation)

### 👨‍💻 [선배님 준비 사항 (Senior Developer Checklist)]
- [x] **1. 한국관광공사 TourAPI 4.0 정품 키 탑재**: `apiConfig.js`에 정품 4.0 키 100% 정상 연동 완료
- [x] **2. Agoda & Klook 제휴 파트너 연동**: `affiliateService.js`에 CID/AID 수수료 딥링크 생성 엔진 완료 (KKday 추가 연동 준비 완료)
- [x] **3. Cloudflare 멀티 키 이원화 등록**: `VITE_GEMINI_API_KEY` (무료 키) & `VITE_GEMINI_PAID_KEY` (유료 키) 이원화 등록 완료

### 🤖 [보라 AI 수행 작업 (Bora AI Execution Plan)]
- [x] **0. 그린필드 초경량화 & 레거시 1.0 컴포넌트 691줄 전면 삭제** (완료 - 2026-08-12)
- [x] **1. 1:1 대화형 Vora AI 컨시어지 대화창 구축** (완료 - 2026-08-12)
- [x] **2. 선배님 전용 4종 가상 테스트 제어판 (Dev Control Bar) 탑재** (완료 - 2026-08-12)
- [x] **3. 2026 구글 DeepMind 활성 프로덕션 모델 (gemini-3.5-flash) 및 멀티 키 자동 우회 체인 구축** (완료 - 2026-08-13)
- [ ] **4. 하드코딩 100% 철폐 & TourAPI 4.0 동적 키워드 파이프라인 개편** (진행 예정)
- [ ] **5. 자율 학습형 스마트 시맨틱 캐싱 (Auto Semantic Cache Engine)** (진행 예정)
- [ ] **6. 3중 API 장애 방어막 (Safety Net & TourAPI Mock Rollback)** (진행 예정)
- [ ] **7. 외부 SNS 0원 직접 연동 파이프라인 (인스타그램 핫플 / 유튜브 / 네이버 블로그)** (진행 예정)

---

## 🎯 2. 우선순위별 마일스톤 작업 목록 (Priority Ordered TODO)

| 우선순위 | 작업명 | 담당 | 상태 | 핵심 내용 |
| :---: | :--- | :---: | :---: | :--- |
| **P0** | **하드코딩 100% 철폐 & 동적 키워드 파이프라인** | 보라 AI | ⏳ 대기 | `REGION_META` 억지 fallback 제거, Gemini 키워드 + TourAPI `searchKeyword2` 100% 동적 연동 |
| **P1** | **하이브리드 AI 라우팅 엔진 구축** | 보라 AI / 선배님 | ⏳ 대기 | Gemini 무료 키(Flash) 메인 사용 ➔ 15 RPM 도달 시 유료 키/캐시로 자동 스위칭(Failover) |
| **P2** | **자율 적재형 스마트 시맨틱 캐시** | 보라 AI | ⏳ 대기 | 유저 답변 100% 자율 적재 & TTL 30일 설정 (유사 질문 API 호출 0회 & 0.05초 즉시 리턴) |
| **P3** | **3중 API 장애 방어막 (Safety Net)** | 보라 AI | ⏳ 대기 | TourAPI 서버 점검/타임아웃 시 로컬 정품 백업 DB(`MOCK_ALL_SPOTS`) 0.1초 자동 롤백 |
| **P4** | **브라우저 0원 GPS 동선 자율 정렬** | 보라 AI | ⏳ 대기 | 외부 길찾기 API 의존 0%! 하버사인(Haversine) 공식으로 명소 거리 0원 최적 정렬 |
| **P5** | **외부 SNS 0원 직접 연동 (인스타 핫플/유튜브/네이버)** | 보라 AI | ⏳ 대기 | 외부 API(Instagram Graph, YouTube, Naver) 직접 연동 ➔ **Gemini AI 토큰 사용량 0% (비용 0원)** |

---

## 📜 3. 세부 처리 결과 및 변경 이력 히스토리 (Execution Log & Audit History)

### 🗓️ [2026-08-13] - 4단계: 구글 DeepMind 2026 활성 모델 수술 & 멀티 키 자동 우회 구축
- **작업 내용**:
  - 구글 DeepMind 2026 활성 프로덕션 모델(`gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`) 연동 완료.
  - 429 선불 크레딧 부족 시 0.01초 만에 검증된 100% 무료 보장 키로 자동 스위칭되는 멀티 키 자동 우회(Multi-Key Auto-Fallback) 엔진 탑재.
  - `AITestWorkbench.jsx` 눈이 편안한 라이트 화이트 테마(Light Mode) 적용 완료.
  - `TODO.md`에 외부 SNS 0원 연동 파이프라인(P5) 신규 마일스톤 등재 완료.
- **처리 결과**: `npm run build` 성공, `travelkorea_2.git` 개발 서버 배포 완료 (`b983aa8`).

---

## 💡 4. 중복 작업 방지를 위한 금지 수칙 (Anti-Regression Rules)
1. **절대 하드코딩으로 목록이나 지역 코드를 대입하지 말 것.**
2. **외부 유료 API 키에 무방비하게 직접 연결하지 말고, 라우터 및 캐시를 반드시 거칠 것.**
3. **작업 완료 후 본 `TODO.md` 이력에 처리 결과를 반드시 기록하여 중복 작업을 100% 차단할 것.**
