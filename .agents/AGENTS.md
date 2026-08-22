# Project Rules & Working Guidelines
## Autonomous Execution & Minimized Interactive Prompting
- **단순 질문 및 정보 문의**: 설명 요청, 현상 문의, 질문 시에는 절대로 계획서(implementation_plan.md)나 승인 팝업(Submit 버튼)을 띄우지 않고 대화창에서 즉각 답변합니다.
- **인터랙티브 팝업 최소화**: 단순 UI/구현 선택 시 ask_question 팝업(Submit 버튼)을 남발하지 않고 최선의 추천 옵션을 자율 선택하여 진행합니다.
- **신속 실행**: 사용자가 "바로 진행해", "수정해" 등 명시적으로 지시한 경우 추가 승인 대기 팝업 없이 코드를 신속히 수정합니다.

## P0 TOP PRIORITY RULE #1 (최우선 가치 수칙)

0. **Strict User Popup Suppression & Stress-Free Execution (서브밋/Proceed 팝업 100% 완전 봉인)**
   - **본 프로젝트의 최우선 가치 수칙(Top Priority #1)입니다.**
   - 선배님의 작업 화면을 방해하거나 자리를 비우지 못하게 만드는 서브밋 팝업 카드(`RequestFeedback: true`) 및 `ask_question` 팝업을 **단 1초도 100% 절대로 유발하지 않습니다.**
   - 모든 아티팩트 및 작업 진행 시 `RequestFeedback: false`로 고정하여 화면에 거치적거리는 팝업 카드가 전혀 뜨지 않도록 철저히 차단합니다.
   - 선배님이 편안하게 휴식을 취하실 수 있도록 뒷단에서 100% 안전하고 조용하게 자율적으로 완성합니다.

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

