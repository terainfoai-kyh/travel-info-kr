# 🌸 VORA AI - Korea Smart Travel Concierge (Travel OS)

> **대한민국 No.1 차세대 AI 여행 컨시어지 플랫폼 (koreatravel.cc)**  
> 한국관광공사 TourAPI 4.0 공식 실시간 공공데이터와 Google DeepMind Gemini 3.5 Flash를 결합하여 전 세계 외국인 관광객과 한국 여행자에게 초개인화 맞춤 여행 일정을 실시간으로 설계합니다.

---

## ✨ 핵심 기능 및 특장점 (Key Features)

1. **🏛️ 한국관광공사 TourAPI 4.0 실시간 직결**:
   - 로컬 가짜 목업 100% 영구 철폐.
   - 전국 226개 시·군·구 및 도서(섬) 지역의 수만 개 공식 등록 관광지, 문화재, 체험 명소 실시간 수신.
2. **🧠 5-Lane 보라 AI 자가 학습 플라이휠**:
   - 미답변 질문 클라우드 자동 수집 ➔ 관리자 검수 ➔ Gemini 3.5 배치 학습 ➔ 4개국어 전 세계 즉시 배포.
3. **🏝️ 대한민국 도서/섬 공간 클러스터 (`KOREA_ISLAND_CLUSTERS`)**:
   - 울릉도, 독도, 신안(퍼플섬/홍도/흑산도), 완도(청산도/보길도), 진도, 백령도 등 주요 섬 전용 지오코딩 및 4개국어 정품 지식베이스 탑재.
4. **🗺️ CartoDB 글로벌 다국어 인터랙티브 맵**:
   - 글로벌 외국인을 위한 깔끔한 영문 맵 타일과 남한 영토 경계(위도 33.0~38.9°, 경도 124.5~132.0°) 엄격 락인.
5. **📊 초경량 실시간 관리자 모니터링 대시보드**:
   - Cloudflare Pages Functions `/api/analytics` 서버리스 텔레메트리 기반 실시간 DAU, 일정 생성 수, 인기 도시 Top 10, 최근 7일/14일/30일 일자별 추이 차트.
6. **🌐 4대 핵심 글로벌 언어 완벽 지원**:
   - 한국어 (KO), 영어 (EN), 일본어 (JA), 중국어 (ZH - 简体/繁體).

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 18, Vite, Vanilla CSS Design System, Lucide Icons, Leaflet
- **AI Brain**: Google DeepMind Gemini 3.5 Flash (Multi-key failover chain)
- **Public Data**: 한국관광공사(KTO) TourAPI 4.0 (`searchKeyword2`, `areaBasedList2`, `detailCommon2`)
- **Maps**: CartoDB Voyager Tile Service, OpenStreetMap Nominatim
- **Backend/Edge**: Cloudflare Pages Functions (`/api/qna`, `/api/analytics`), Cloudflare KV
- **Quality Assurance**: PowerShell AST Zero-Defect Code Verification (`verifySyntax.ps1`)

---

## 🚀 로컬 개발 및 실행 (Getting Started)

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 환경변수 설정 (.env 파일 생성)
# VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# 3. 로컬 개발 서버 시작
npm run dev

# 4. 배포 전 사전 무결점 검증 스크립트 실행
powershell.exe -ExecutionPolicy Bypass -File .\scripts\verifySyntax.ps1
```

---

## 🛡️ 보안 및 라이선스 (Security & License)

- 본 프로젝트의 모든 민감한 API Key 및 관리자 인증 정보는 환경변수로 완벽 격리 관리됩니다.
- © 2026 VORA AI (koreatravel.cc). All Rights Reserved.
