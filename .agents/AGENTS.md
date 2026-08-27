# Project Rules & Working Guidelines

## P0 TOP PRIORITY RULE #1 (최우선 가치 수칙)

0. **Strict User Popup Suppression & Stress-Free Execution (서브밋/Proceed 팝업 100% 완전 봉인)**
   - **본 프로젝트의 최우선 가치 수칙(Top Priority #1)입니다.**
   - 선배님의 작업 화면을 방해하거나 자리를 비우지 못하게 만드는 서브밋 팝업 카드(`RequestFeedback: true`) 및 `ask_question` 팝업을 **단 1초도 100% 절대로 유발하지 않습니다.**
   - 모든 아티팩트 및 작업 진행 시 `RequestFeedback: false`로 고정하여 화면에 거치적거리는 팝업 카드가 전혀 뜨지 않도록 철저히 차단합니다.
   - 선배님이 편안하게 휴식을 취하실 수 있도록 뒷단에서 100% 안전하고 조용하게 자율적으로 완성합니다.

---

## 🏛️ 헌법 제1조 (Article 1). Mandatory Daily Continuity & 100% Auto-Logging Protocol (일일 작업 연속성 보장 & 100% 전자동 기록 & 시작 시 자동 선 브리핑 헌법)

1. **세션 시작 시 무조건 선(先) 브리핑 의무화**:
   - 사용자가 묻지 않아도 매일 아침 또는 새로운 세션이 시작될 때, 무조건 `PROJECT_HISTORY.md`를 먼저 읽고 **[전날 마지막 작업 내역 + 핵심 설계도/결정사항 + 오늘 바로 이어서 할 작업 1순위]**를 3줄 요약으로 먼저 정갈하게 브리핑하고 업무를 시작한다.
   - 담당 AI가 바뀌거나 세션이 넘어가더라도 사용자가 어제 한 작업을 다시 설명하게 만드는 행위를 100% 원천 금지한다.

2. **100% 전자동 작업 기록 (Zero-Effort Auto-Logging)**:
   - 사용자가 "기억해"라고 말하지 않아도, AI는 주요 기능 완성, 커밋, 배포, 핵심 설계도 합의 시마다 **[날짜, 완성된 기능, 시스템 상태, 다음 할 일]**을 `PROJECT_HISTORY.md`에 100% 자동으로 즉시 갱신 기록한다.
   - 사용자가 "기억해", "기억해둬"라고 명시적으로 지시한 경우, 해당 시점의 설계도나 요구사항을 [★ Golden Checkpoint]로 특급 박제한다.

3. **핵심 아키텍처 영구 계승 및 작업 원복 100% 원천 금지**:
   - 사용자와 합의된 핵심 아키텍처(예: **[보라 AI 자가 학습 플라이휠: 미답변 질문 클라우드 실시간 수집 ➔ 관리자 큐 ➔ 제미나이 배치 학습 ➔ 전 세계 즉시 배포]**)는 세션이 바뀌어도 절대 초기화하거나 원복하지 않고 일관되게 구축 완성한다.

---

## Work Authorization & Verification Workflow

1. **Root Cause & Side-Effect Analysis (원인 및 영향도 분석)**
   - 코드 수정 전, 문제의 근본 원인을 파악하고 연관된 컴포넌트, 상태(State), 이벤트 흐름을 추적합니다.
   - 수정 작업으로 인해 기존에 잘 동작하던 기능이 안 되게 되는 사이드 이펙트(Regression risk)가 있는지 사전에 도출합니다.

2. **Feasibility Review & Better Alternatives (타당성 검토 및 대안 제안)**
   - 요청된 작업 방식의 타당성을 검토합니다.
   - 만약 구조적으로 더 우수하거나 부작용이 적고 안전한 대안이 있다면 먼저 제안합니다.

3. **Implementation Plan & Explicit User Approval (계획 제시 및 승인 대기)**
   - 분석 결과, 사이드 이펙트 가능성, 제안/대안, 검증 방안을 사용자에게 먼저 설명합니다.
   - **사용자가 "진행해" 등 명시적으로 승인하기 전까지는 절대 코드를 먼저 수정하지 않습니다.**

4. **Safe Execution & Verification (작업 진행 및 검증)**
   - 승인받은 내용에 대해서만 작업을 수행하고, 기존 기능의 원복이나 파손이 없는지 철저히 검증합니다.

5. **Strict Multilingual Support (다국어 처리 기본 적용 - i18n)**
   - UI 텍스트, 버튼 문구, 툴팁, 안내 메시지 등 새로운 문구를 추가하거나 수정할 때는 단일 언어 하드코딩을 절대 금지합니다.
   - 기본적으로 `src/i18n/translations.js`에 모든 지원 언어(한국어, 영어, 일본어, 중국어 간체/번체, 독일어, 프랑스어, 스페인어, 러시아어 등)의 번역 키를 빠짐없이 등록하고 적용합니다.

6. **Data Sourcing & Fallback Handling (관광 정보 API 및 이미지 템플릿 처리)**
   - 기본적으로 관광 정보, 상세 데이터 및 이미지는 공공 데이터(한국관광공사 TourAPI 등)를 우선 활용합니다.
   - API 데이터나 이미지가 유실/누락된 경우, 화면이 깨지거나 빈 공간이 생기지 않도록 고품질 템플릿 이미지(Fallback Image) 및 기본 템플릿 정보 데이터를 준비하여 항상 매끄럽게 표시되도록 처리합니다.

7. **Authentic Korean Tourism Imagery Only (한국 및 관광공사 정품 이미지 엄격 적용)**
   - 일본, 그리스 등 해외 풍경 이미지 및 부적절한 간판 사진의 사용을 100% 엄금합니다.
   - 모든 관광 명소 이미지는 한국관광공사 TourAPI 4.0 공식 CDN (`http://tong.visitkorea.or.kr/...`) 정품 이미지 및 검증된 한국 대표 관광지 고화질 사진만 활용하며, 검증되지 않은 외부 무작위 이미지는 철저히 차단합니다.

8. **Multilingual TourAPI Data Sourcing (다국어 관광 정보 관광공사 공식 API 우선 호출)**
   - 영어(EngService2), 일본어(JpnService2), 중국어 간체(ChsService2), 중국어 번체(ChtService2), 독일어(GerService2), 프랑스어(FreService2), 스페인어(SpnService2), 러시아어(RusService2) 등 모든 다국어 모드 전환 시, 임의 번역기나 외부 주소가 아닌 한국관광공사 TourAPI 4.0 다국어 전용 공식 API 서비스(`https://apis.data.go.kr/B551011/...Service2`)를 100% 최우선으로 연동하여 정품 다국어 관광명소명, 위치 정보, 상세 안내 데이터를 수신합니다.

9. **Foreigner-First UX & Mandatory Multilingual Verification (글로벌 외국인 관광객 기준 최우선 및 개발 단계 다국어 검증 의무화)**
   - 본 플랫폼의 주 서비스 대상은 **대한민국을 방문하는 글로벌 외국인 관광객**입니다.
   - 모든 새로운 기능의 추가, 기존 기능 수정, UI/UX 디자인 변경 시 반드시 글로벌 외국인 사용자 기준(영어/외국어 표기, 가독성, 해외 결제/대중교통 안내, 글로벌 구글지도 연동)에서 최우선으로 설계합니다.
   - **기능을 수정하거나 추가하는 모든 작업 단계에서 지원하는 모든 다국어 모드(영어, 일본어, 중국어 등)에 단일 언어 하드코딩이나 번역 누락이 없는지 철저히 사전 검증을 완료한 후 마감합니다.**

10. **Autonomous Execution & Minimized Interactive Prompting (자율 수행 및 질의 팝업 최소화)**
    - 단순하거나 사소한 디자인/구현 선택 시 인터랙티브 팝업(`ask_question`)을 남발하지 않고 가장 우수한 추천 옵션을 자율적으로 선택하여 진행합니다.
    - 사용자의 승인을 받은 구현 계획 범위 내에서는 추가 확인 팝업 없이 안전한 검증 및 코드 완성을 자율적(Autonomous)으로 신속히 수행합니다.

11. **Two-Track Deployment Isolation (개발-운영 깃 레포 분리)**
    - 개발/테스트 단계 배포 지시("배포해", "푸시해") 시: **오직 개발 전용 `dev-remote` (`travelkorea_2.git`) 레포로만 푸시**합니다. (Cloudflare Pages `travelkorea-dev.pages.dev` 반영)
    - 운영/실제 서비스 배포 지시("운영 배포해", "프로덕션 배포해", "origin 푸시해") 시에만 **운영 전용 `origin` (`travel-info-kr.git`) 레포로 푸시**합니다. (GitHub Pages `terainfoai-kyh.github.io/travel-info-kr/` 반영)

12. **Strict User Opinion Seeking Rule (의견 문의 시 선(先) 코드 수정 금지 및 100% 승인 대기)**
    - 사용자가 "의견은?", "어때?", "어떻게 생각해?", "의견좀" 등 의견을 질의할 때는 **절대로 코드를 사전에 수정하거나 실행하지 않습니다.**
    - 오직 **[현상 분석 + 장단점/대안 + 추천 안]**만을 정갈하게 답변으로 제시하고, 사용자가 "진행해", "수정해", "OK" 등 명시적으로 승인 지시를 내릴 때까지 **100% 대기**합니다.

13. **Multilingual Application Standard & Mandatory Search Conditions (다국어 적용 기준 및 필수 조건)**
    - **적용 시점**: 모든 핵심 기능 및 UI/UX 개발이 완료된 후 최종 다국어 고도화 단계에서 일괄 적용.
    - **양방향 대소문자 정규화 (Case-Insensitive Unification)**:
      - 검색어(Query)와 DB 응답값(Title, Addr) 모두 `.toUpperCase()`로 통일하여 대소문자 불일치(예: `Gyeongbokgung` vs `gyeongbokgung` vs `GYEONGBOKGUNG`)로 인한 검색 누락 100% 방지.
    - **공백 및 특수문자 정규화 (Whitespace & Special Char Normalization)**:
      - 공백(`\s`), 하이픈(`-`), 언더바(`_`), 마침표(`.`), 쉼표(`,`), 괄호(`()[]`)를 제거한 압축 문자열(`lm.replace(/[\s\-\_\.\,\(\)\[\]]/g, '').toUpperCase()`)로 상호 비교.
    - **위치/도시명 다국어 매칭 통일**:
      - `item.addr1.toUpperCase().includes(cleanTargetCity.toUpperCase())`
    - **3중 스마트 연쇄 검색 (Multi-attempt Fallback Chain)**:
      - 1차: 원본 검색어 (예: `N-Seoul Tower`)
      - 2차: 공백/특수문자 제거 압축 검색어 (예: `NSEOULTOWER`)
      - 3차: 도시명 결합 검색어 (예: `SEOUL NSEOULTOWER`)

14. **Strict Zero Mocking & Mandatory Live TourAPI 4.0 Direct Pipeline (가짜 고정 데이터 작성 영구 금지 및 실시간 공공데이터 직결 헌법)**
    - **가짜 고정 데이터(Mock / Hardcoded Pool) 작성 100% 영구 엄금**: `masterCitySpots.js`처럼 로컬 JS 파일에 특정 명소를 고정으로 박아두고 돌려막는 가짜 Mock 코드를 생성하는 행위를 영구히 금지합니다.
    - **한국관광공사 TourAPI 4.0 실시간 직결**: 사용자의 여행 요청 시 반드시 한국관광공사 공식 실시간 API (`searchKeyword2`, `areaBasedList2`)를 호출하여 해당 도시의 실제 수백 개 정품 등록 관광지를 실시간 수신하여 일정표를 조립합니다.
    - **2중 정품 포토 보정**: 사진 누락/저화질은 `photoPipeline.js` (Google Places 실시간 API)를 통해 최신 4K 고화질 방문자 사진과 실제 평점(⭐ 4.8)으로 보정합니다.
    - **공간 클러스터링**: 위경도 좌표 거리(Haversine)를 계산하여 가까운 명소들끼리 일차별 권역으로 동적 밀집 배정하며, 1일차부터 5일차까지 동일 명소 중복 배치를 100% 원천 차단합니다.

15. **Official TourAPI Category Enforcement & Food/Commercial Store Ban (공식 카테고리 엄격 적용 및 편의점/식당 꼼수 박멸 헌법)**
    - **메인 코스 카테고리 한정**: 메인 여행 일정표에는 오직 `contentTypeId`가 **`12`(관광지), `14`(문화시설/궁궐), `28`(레포츠/체험)**인 순수 관광지만 포함합니다.
    - **편의점/식당/상가 100% 원천 차단**: `contentTypeId=38`(쇼핑/편의점)과 `contentTypeId=39`(음식점), `32`(숙박)는 메인 코스에서 무조건 100% 자동 제외합니다.
    - **꼼수 조건문 영구 금지**: `excludeFood` 같은 검색어 텍스트 매칭 꼼수를 엄금하며, 공공 API 코드 레벨에서 기본적으로 식당/점포를 원천 차단합니다. 식당/카페는 오직 상세 모달의 보충 정보 탭(`[ 주변 맛집/카페 ]`)으로만 제공합니다.

16. **Non-Fixed Dynamic Time Budget Simulation & Operating Hours Cutoff (완전 비고정 타임라인 및 운영시간 연동 헌법)**
    - **스팟 개수 비고정 (Time Budget 방식)**: 스팟 개수를 3~4개로 고정하지 않고, 하루 가용 시간(09:30~19:00), 스팟 규모별 실제 체류시간(60~150분), 위경도 이동시간, 점심 식사 버퍼(50분)를 누적하여 유동적으로 채웁니다.
    - **16:30 주간 마감 시설 컷오프 (Cutoff)**: 대공원, 동물원, 궁궐, 박물관, 미술관, 도서관 등 18:00에 문 닫는 주간 관람 시설은 16:30 이후 스팟 배정을 100% 원천 금지합니다.
    - **저녁(17:00 이후) 야간 명소 우선**: 17:00 이후 마지막 스팟에는 N서울타워/전망대(야경), DDP, 광장시장/야시장, 한강공원, 성수동/익선동 감성거리 등 야간/상시 개방 명소를 배치합니다.
    - **300m 이내 과밀 중복 방지 및 미래 앵커 보호**: 동일 산/타워/공원 내 서브시설 중복을 방지하고, 다음 날짜 대표 앵커(예: 3일차 DDP)가 당일 채우기 루프에서 미리 소비되지 않도록 사전 예약 분리합니다.

17. **Intelligent 24H / Night Operating Hours Display (상세 모달 지능형 운영시간 표기)**
    - 공원, 근린공원, 한강, 해수욕장, 거리, 광장 등은 획일적 09:00~18:00이 아닌 **`"24시간 상시 개방 (자유 관람)"`**으로 표기하고, 궁궐/박물관은 09:00~18:00, 타워는 10:00~22:30으로 상식에 부합하게 표기합니다.

18. **Mandatory Live TourAPI Direct Pipeline for Recommendation Cards (추천 카드 공공데이터 100% 실시간 직결 및 로컬 사진 하드코딩 영구 금지 헌법)**
    - **로컬 정적 사진/명소 하드코딩 100% 영구 금지**: 속도 향상 등을 핑계로 로컬 JS 파일에 특정 사진 URL이나 명소 목록을 고정으로 박아두고 돌려막는 행위를 영구히 금지합니다.
    - **한국관광공사 TourAPI 4.0 실시간 직결**: 추천 카드(`보라가 엄선한 추천 명소`) 역시 반드시 한국관광공사 공식 실시간 API(`areaBasedList2`, `searchKeyword2`)를 직접 호출하여 해당 도시의 최신 정품 사진과 실시간 명소 데이터를 동적으로 받아와 렌더링합니다.




