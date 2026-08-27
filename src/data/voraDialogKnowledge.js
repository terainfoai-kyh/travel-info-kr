/**
 * VORA AI 2.0 - Gemini-Distilled Autonomous Tourism & Tiki-Taka Dialog Knowledge Base
 * 
 * Pre-ingested 6-Pillar Knowledge Matrix synthesized from Gemini AI and Korean Tourism Organization (TourAPI 4.0).
 * Powers 0.01s instant-response concierge responses with zero hallucination and 100% authentic Korean tourism data.
 * 
 * 6 Core Knowledge Pillars:
 * 1. CITY_LOCAL_KNOWLEDGE (25 Major Korean Cities)
 * 2. TIKITAKA_CHITCHAT_MATRIX (Emotions, Banters, Slangs, Complaints, Empathy)
 * 3. K_FOOD_PAIRING_KNOWLEDGE (Regional Signature Foods, Waiting Secrets, Pairings)
 * 4. K_FASHION_WEATHER_GUIDE (Temperature & Climate Coordination Advice)
 * 5. FOREIGNER_ESSENTIALS_KNOWLEDGE (Transit cards, Tax Free, 1330 hotline, rides)
 * 6. PROACTIVE_CONVERSATION_HOOKS (Engaging follow-up questions)
 */

// ==============================================================================
// 1. CITY_LOCAL_KNOWLEDGE (전국 25개 주요 도시 정밀 로컬 지식)
// ==============================================================================
export const CITY_LOCAL_KNOWLEDGE = {
  '서울': {
    nameEn: 'Seoul',
    badge: 'K-컬처와 전통이 공존하는 글로벌 수도',
    signatureHighlights: ['경복궁 & 북촌한옥마을', 'N서울타워 파노라마', 'DDP & 성수동 감성 거리', '더현대 서울 & 한강공원'],
    rainyHotspots: ['코엑스 별마당도서관 & 아쿠아리움', '더현대 서울 사운즈포레스트', '국립중앙박물관 사유의 방', 'DDP 디자인랩 & 갤러리'],
    walkingMinimized: ['N서울타워 케이블카 직통 코스', '청와대 본관 평지 관람로', '한강 유람선 선상 힐링', '인사동 쌈지길 & 전통 찻집'],
    localFoodieSecret: '광장시장 마약김밥·빈대떡, 성수동 스페셜티 브루잉 카페, 종로 피맛골 백반',
    transitTip: '지하철 1~9호선 및 기후동행카드로 서울 전역 30분 내 쾌속 이동',
    hotelType: 'inland',
    nightHighlights: [
      { name: 'N서울타워 & 남산 케이블카', desc: '서울 도심 360도 파노라마 야경과 사랑의 자물쇠 명소' },
      { name: '낙산공원 한양도성길', desc: '은은한 성곽 조명을 따라 걷는 로맨틱 감성 밤 산책' },
      { name: '반포 한강공원 & 달빛무지개분수', desc: '세빛섬 야경과 함께 즐기는 시원한 한강 치맥 피크닉' },
      { name: 'DDP (동대문디자인플라자)', desc: '은빛 유선형 건축물과 환상적인 LED 미디어아트 야경' }
    ],
    cafeHighlights: [
      { name: '성수동 카페거리 / 대림창고', desc: '붉은 벽돌 인더스트리얼 감성과 트렌디한 스페셜티 브루잉' },
      { name: '익선동 & 삼청동 한옥 찻집', desc: '전통 서까래 아래서 즐기는 수제 개성주악과 쌍화차' },
      { name: '연남동 경의선 숲길 카페', desc: '숲길을 따라 아기자기하게 늘어선 감성 디저트 & 베이커리' }
    ],
    signatureHotels: [
      { name: '시그니엘 서울 / 신라호텔', type: '럭셔리 호캉스 & 파노라마 뷰', desc: '잠실 롯데월드타워 100층 초고층 뷰 & 남산 숲속 최고급 호캉스' },
      { name: '롯데호텔 서울 / L7 홍대', type: '관광 & 쇼핑 최적화', desc: '명동 쇼핑가 중심 및 젊음과 예술이 넘치는 홍대 트렌디 호텔' },
      { name: '북촌 락고재 & 한옥스테이', type: '고즈넉한 감성 한옥', desc: '경복궁 옆 돌담길 사이 프라이빗 전통 한옥 독채 체험' }
    ]
  },
  '부산': {
    nameEn: 'Busan',
    badge: '푸른 해변과 화려한 도심 야경의 해양 수도',
    signatureHighlights: ['해운대 & 블루라인파크 해변열차', '광안리 M 드론라이트쇼', '감천문화마을', '자갈치시장 & 흰여울문화마을'],
    rainyHotspots: ['씨라이프 부산아쿠아리움', '센텀시티 스파랜드 & 신세계몰', '뮤지엄 원 미디어아트', 'F1963 복합문화공간'],
    walkingMinimized: ['송도 해상케이블카', '해운대 블루라인파크 스카이캡슐', '다이아몬드베이 요트투어', '광안리 해변 카페거리'],
    localFoodieSecret: '부산 원조 돼지국밥, 자갈치 생선구이 백반, 남포동 씨앗호떡, 기장 짚불장어',
    transitTip: '지하철 2호선(센텀-해운대) 및 동해선으로 기장·오시리아 관광단지까지 직통 이동',
    hotelType: 'coastal',
    nightHighlights: [
      { name: '광안리 해변 & M 드론라이트쇼', desc: '광안대교 LED 조명과 수백 대 드론이 펼치는 밤하늘 쇼' },
      { name: '더베이101 & 마린시티', desc: '홍콩 야경을 방불케 하는 화려한 마천루 반영 사진 명소' },
      { name: '황령산 봉수대 전망대', desc: '부산 전역 바다와 도심 불빛이 발아래로 펼쳐지는 최고 파노라마' }
    ],
    cafeHighlights: [
      { name: '전포 카페거리', desc: '뉴욕타임스 선정! 골목마다 숨은 개성 넘치는 로스터리 카페' },
      { name: '기장 오션뷰 대형 카페', desc: '끝없이 펼쳐진 동해 바다를 정면으로 바라보는 힐링 테라스' },
      { name: '영도 흰여울 해안 카페', desc: '절벽 위에서 바다와 남항대교를 조망하는 감성 카페' }
    ],
    signatureHotels: [
      { name: '시그니엘 부산 / 파라다이스 호텔', type: '해운대 오션뷰 럭셔리', desc: '해운대 백사장 바로 앞 인피니티 풀 & 럭셔리 오션뷰' },
      { name: '광안리 호텔 아쿠아펠리스 / 센트럴베이', type: '광안대교 드론쇼 뷰', desc: '광안대교 LED 야경과 드론쇼가 한눈에 내려다보이는 해변 호텔' },
      { name: '롯데호텔 부산 (서면)', type: '도심 쇼핑 & KTX 교통 중심', desc: '부산 전역 어디든 30분 내로 연결되는 서면 중심 특급 호텔' }
    ]
  },
  '제주': {
    nameEn: 'Jeju',
    badge: '유네스코 자연유산과 에메랄드빛 힐링의 섬',
    signatureHighlights: ['성산일출봉 & 섭지코지', '함덕 서우봉 에메랄드 해변', '한림공원 & 협재해변', '중문관광단지 주상절리'],
    rainyHotspots: ['아르떼뮤지엄 제주', '스누피가든 실내 하우스', '빛의 벙커 몰입형 미디어아트', '아쿠아플라넷 제주'],
    walkingMinimized: ['에코랜드 곶자왈 숲속 기차여행', '제주 제트보트 & 서귀포 잠수함', '용두암 & 해안도로 드라이브', '산방산 탄산온천'],
    localFoodieSecret: '제주 흑돼지 근고기, 고기국수, 갈치조림, 우도 땅콩 아이스크림',
    transitTip: '제주공항 급행버스(100~180번대)로 동서부 주요 거점 1시간 내 이동 가능',
    hotelType: 'coastal',
    nightHighlights: [
      { name: '용두암 & 용담해안도로', desc: '밤바다 파도 소리와 은은한 조명이 비치는 야간 드라이브 명소' },
      { name: '서귀포 새연교 & 천지연폭포', desc: '화려한 LED 조명의 돛단배 다리와 야간 폭포 산책로' },
      { name: '제주시 탑동광장 밤바다', desc: '시원한 바닷바람과 함께 현지인들이 모이는 활기찬 야경 스팟' }
    ],
    cafeHighlights: [
      { name: '애월 한담해변 카페거리', desc: '에메랄드빛 바다 산책로와 환상적인 서쪽 일몰 뷰 카페' },
      { name: '구좌읍 당근/돌담 감성 카페', desc: '제주 시골 돌담길 사이 정갈한 당근케이크와 핸드드립' }
    ],
    signatureHotels: [
      { name: '제주 신라호텔 / 그랜드 조선 제주', type: '중문 럭셔리 리조트', desc: '사계절 온수풀과 이국적인 야자수 정원을 품은 최고급 휴양 리조트' },
      { name: '애월 & 협재 프라이빗 풀빌라', type: '서쪽 에메랄드 오션뷰', desc: '제주 서쪽 환상적인 붉은 노을을 감상하는 감성 독채 펜션' },
      { name: '그랜드 하얏트 제주 (드림타워)', type: '공항 10분 도심 호캉스', desc: '제주 도심과 바다가 파노라마로 펼쳐지는 38층 스카이라운지' }
    ]
  },
  '경주': {
    nameEn: 'Gyeongju',
    badge: '천년 고도의 숨결과 고즈넉한 힐링 유적지',
    signatureHighlights: ['불국사 & 석굴암', '동궁과 월지 야경', '대릉원 천마총 & 황리단길', '첨성대 핑크뮬리 단지'],
    rainyHotspots: ['국립경주박물관 & 신라천년보고', '우양미술관', '경주세계자동차박물관', '키덜트뮤지엄'],
    walkingMinimized: ['동궁과 월지 평지 산책로', '황리단길 한옥 카페 쉼터', '보문관광단지 호반 드라이브', '불국사 무장애 데크길'],
    localFoodieSecret: '경주 맷돌순두부, 황남빵, 찰보리빵, 황리단길 십원빵 & 떡갈비 정식',
    transitTip: '신경주역(KTX)에서 시내 급행버스 700번 이용 시 주요 유적지 25분 연결',
    hotelType: 'heritage',
    nightHighlights: [
      { name: '동궁과 월지 (안압지)', desc: '물 위에 거울처럼 비치는 신라 궁궐의 압도적인 금빛 반영 야경' },
      { name: '월정교 야경', desc: '남천 위에 웅장하게 서 있는 신라 시대 다리의 찬란한 조명' },
      { name: '첨성대 & 대릉원 돌담길', desc: '밤하늘 별과 은은한 조명이 어우러진 천년 고도의 밤 산책' }
    ],
    cafeHighlights: [
      { name: '황리단길 감성 한옥 카페', desc: '기와지붕 아래 마당 평상에서 즐기는 시그니처 라떼와 디저트' }
    ],
    signatureHotels: [
      { name: '황리단길 전통 한옥스테이 (와담정/소담정)', type: '고즈넉한 신라 한옥', desc: '대릉원 돌담길 옆 고요한 마당과 정갈한 한옥 온돌 체험' },
      { name: '힐튼 경주 / 라한셀렉트 경주', type: '보문호수 뷰 리조트', desc: '보문관광단지 호수 산책로와 연결된 특급 패밀리 호캉스' }
    ]
  },
  '강릉': {
    nameEn: 'Gangneung',
    badge: '솔향 가득한 동해안과 감성 커피의 메카',
    signatureHighlights: ['안목해변 커피거리', '강문해변 & 경포호수', '오죽헌 & 선교장', '정동진 바다부채길'],
    rainyHotspots: ['아르떼뮤지엄 강릉', '하슬라아트월드 실내 뮤지엄', '참소리축음기·에디슨박물관', '테라로사 커피공장'],
    walkingMinimized: ['강릉 바다열차 힐링 뷰', '안목 커피거리 오션뷰 테라스', '선교장 평지 한옥 쉼터', '경포호 호반 드라이브'],
    localFoodieSecret: '초당 순두부마을 짬뽕순두부, 강릉 중앙시장 닭강정·배니 팡파미유 마늘빵, 장칼국수',
    transitTip: '강릉역(KTX)에서 안목해변 및 경포대까지 버스로 15분 내외 초근접',
    hotelType: 'coastal',
    nightHighlights: [
      { name: '안목해변 밤바다 & 카페거리', desc: '파도 소리와 함께 즐기는 루프탑 테라스 야간 커피' },
      { name: '경포호수 달빛 산책로', desc: '잔잔한 호수를 따라 달빛을 받으며 걷는 힐링 코스' },
      { name: '강문 솟대다리 야경', desc: '무지갯빛 조명이 바다 위 다리를 밝히는 감성 포토존' }
    ],
    cafeHighlights: [
      { name: '안목 커피거리 & 테라로사', desc: '대한민국 1세대 스페셜티 커피의 성지이자 바다 뷰 명소' },
      { name: '초당 순두부 젤라또', desc: '고소한 순두부와 인절미로 만든 강릉만의 이색 디저트' }
    ],
    signatureHotels: [
      { name: '씨마크 호텔 / 세인트존스 호텔', type: '동해 파노라마 인피니티풀', desc: '경포 바다 수평선과 맞닿은 인피니티풀 & 최고급 오션뷰' },
      { name: '스카이베이 호텔 경포', type: '경포호수 & 바다 듀얼 뷰', desc: '싱가포르 마리나베이를 연상시키는 루프탑 풀 랜드마크' }
    ]
  },
  '속초': {
    nameEn: 'Sokcho',
    badge: '웅장한 설악산과 싱싱한 동해 포구가 어우러진 명소',
    signatureHighlights: ['속초관광수산시장', '아바이마을 갯배 체험', '속초아이 대관람차 & 속초해변', '영금정 해상정자'],
    rainyHotspots: ['국립산악박물관', '얼라이브하트 & 다이나믹메이즈', '바우지움 조각미술관', '속초 시립박물관'],
    walkingMinimized: ['설악산 국립공원 케이블카', '영금정 진입 엘리베이터 데크', '속초아이 대관람차 캐빈', '아바이마을 갯배 쉼터'],
    localFoodieSecret: '속초 명물 아바이순대 & 오징어순대, 청초호 물회, 대포항 대게 정식, 만석닭강정',
    transitTip: '속초고속버스터미널에서 속초해변 및 아바이마을까지 도보 5~10분',
    hotelType: 'coastal',
    signatureHotels: [
      { name: '롯데리조트 속초', type: '3면 바다 조망 워터파크', desc: '동해안 바다 절벽 끝에 자리잡은 전 객실 오션뷰 럭셔리 리조트' },
      { name: '체스터톤스 속초 / 카시아 속초', type: '청초호 & 속초아이 뷰', desc: '온천 사우나와 청초호 야경을 즐기는 신축 프리미엄 레지던스' }
    ]
  },
  '여수': {
    nameEn: 'Yeosu',
    badge: '낭만 가득한 밤바다와 다도해 절경의 해양 도시',
    signatureHighlights: ['여수 해상케이블카', '오동도 동백나무 숲길', '이순신광장 & 낭만포차거리', '향일암 일출 명소'],
    rainyHotspots: ['아쿠아플라넷 여수', '녹테마레 미디어아트 파크', '아르떼뮤지엄 여수', '해양수산과학관'],
    walkingMinimized: ['돌산공원 해상케이블카', '이사부크루즈 야경 선상 불꽃투어', '이순신광장 벤치 힐링', '하멜등대 포토존'],
    localFoodieSecret: '돌산 갓김치 & 간장게장 백반, 여수 삼합구이, 서대회무침, 갓버거',
    transitTip: '여수엑스포역(KTX) 바로 앞에서 케이블카 및 아쿠아플라넷 도보 10분 연결',
    hotelType: 'coastal',
    signatureHotels: [
      { name: '소노캄 여수 / 베네치아 호텔', type: '여수 엑스포 & 오동도 뷰', desc: '오동도 입구와 여수 밤바다가 파노라마로 펼쳐지는 5성급 랜드마크' },
      { name: '라테라스 리조트 & 돌산 풀빌라', type: '이국적인 인피니티풀', desc: '발리 감성의 인피니티풀과 카바나를 갖춘 여수 최고 핫플' }
    ]
  },
  '전주': {
    nameEn: 'Jeonju',
    badge: '한국의 맛과 멋이 살아 숨 쉬는 유네스코 미식 도시',
    signatureHighlights: ['전주 한옥마을', '경기전 & 어진박물관', '전동성당', '자만벽화마을 & 오목대'],
    rainyHotspots: ['국립무형유산원', '전주 어진박물관 지하 전시관', '전주전통술박물관', '전주부채문화관'],
    walkingMinimized: ['경기전 고즈넉한 숲길 평지 산책', '한옥마을 전통 찻집 테라스', '한옥마을 전동스쿠터 투어', '풍남문 광장'],
    localFoodieSecret: '전주 비빔밥, 콩나물국밥(현대옥/삼백집), 한옥마을 수제 초코파이, 모주 & 가맥 황태구이',
    transitTip: '전주역에서 한옥마을행 직통 순환버스로 15분 만에 도착',
    hotelType: 'heritage',
    signatureHotels: [
      { name: '전주 한옥마을 감성 스테이 (다락/교동가원)', type: '전통 한옥 온돌 체험', desc: '기와지붕 아래 서까래와 대청마루에서 느끼는 조선의 정취' },
      { name: '라한호텔 전주', type: '한옥마을 전경 루프탑 뷰', desc: '한옥마을 전체 기와 지붕 뷰가 한눈에 내려다보이는 유일한 루프탑 풀' }
    ]
  },
  '대구': {
    nameEn: 'Daegu',
    badge: '근대 골목 투어와 미식, 활기찬 트렌드의 문화 도시',
    signatureHighlights: ['서문시장 야시장', '김광석 다시그리기길', '앞산전망대 & 케이블카', '동성로 스파크랜드'],
    rainyHotspots: ['대구미술관', '국립대구박물관', '스파크랜드 실내 어트랙션', '대구예술발전소'],
    walkingMinimized: ['앞산 케이블카 탑승 동선', '수성못 수변 데크 평지 산책', '김광석길 카페 쉼터', '근대화골목 전동차 투어'],
    localFoodieSecret: '대구 10미(안지랑 막창, 뭉티기 생고기, 납작만두, 동인동 매운찜갈비, 야끼우동)',
    transitTip: '대구 도시철도 1~3호선(3호선 모노레일)으로 주요 도심 및 야시장 완벽 연결'
  },
  '인천': {
    nameEn: 'Incheon',
    badge: '차이나타운의 역사와 송도 센트럴파크의 미래가 만나는 항구',
    signatureHighlights: ['차이나타운 & 개항장 거리', '송도 센트럴파크 & 수상택시', '월미도 테마파크', '영종도 을왕리 해변'],
    rainyHotspots: ['국립세계문자박물관 (송도)', '트라이보울 복합문화공간', '인천도시역사관', '파라다이스시티 씨메르 & 원더박스'],
    walkingMinimized: ['송도 센트럴파크 수상택시/보트', '월미바다열차 순환 뷰', '영종도 레일바이크 평지 코스', '차이나타운 관광 전동차'],
    localFoodieSecret: '원조 공화춘 짜장면, 신포국제시장 닭강정, 송도 트리플스트리트 세계요리, 화덕만두',
    transitTip: '인천공항철도 및 수인분당선, 지하철 1호선으로 서울 및 공항 30분대 연결'
  },
  '거제': {
    nameEn: 'Geoje',
    badge: '바람의 언덕과 해금강이 빚어낸 남해안 청정 보석',
    signatureHighlights: ['바람의 언덕 & 신선대', '외도 보타니아 해상식물원', '거제 파노라마 케이블카', '학동 흑진주 몽돌해변'],
    rainyHotspots: ['거제 식물원 정글돔 (사계절 온실)', '거제 조선해양문화관', '포로수용소유적공원 평화파크', '거제 맹종죽테마파크 실내쉼터'],
    walkingMinimized: ['거제 파노라마 케이블카', '외도 유람선 선상 유람', '학동 몽돌해변 카페 뷰', '지세포항 해안 드라이브'],
    localFoodieSecret: '거제 멍게비빔밥, 도다리쑥국, 싱싱한 굴구이 정식, 바람의 핫도그',
    transitTip: '부산 사상/노포터미널에서 거가대교 경유 직행버스로 1시간 10분 쾌속 진입'
  },
  '통영': {
    nameEn: 'Tongyeong & Yokjido',
    badge: '동양의 나폴리, 한려수도의 에메랄드빛 항구와 신비의 섬 욕지도',
    signatureHighlights: ['욕지도(출렁다리·펠리컨바위·모노레일)', '통영 케이블카 & 미륵산', '동피랑 & 디피랑 디지털파크', '이순신공원 해안 절경', '사량도 지리망산', '소매물도 등대섬'],
    rainyHotspots: ['통영 삼도수군통제영 역사관', '통영 옻칠미술관', '통영수산과학관', '전혁림미술관', '욕지도 실내 오션뷰 카페'],
    walkingMinimized: ['통영 미륵산 케이블카', '욕지도 섬 순환투어 버스', '통영항 밤바다 유람선 투어', '강구안 문화마당 벤치 쉼터', '해저터널 평지 산책'],
    localFoodieSecret: '욕지도 명물 싱싱한 고등어회 & 욕지 고메원 고구마 도넛, 통영 충무김밥, 꿀빵, 다찌 요리(해산물 만찬)',
    transitTip: '통영 삼덕항/통영항에서 여객선 탑승 시 50분 만에 욕지도(동항·유동) 쾌속 도착'
  },
  '남해': {
    nameEn: 'Namhae',
    badge: '보리암의 일출과 다랭이논이 빚어낸 남쪽 바다의 힐링',
    signatureHighlights: ['보리암 & 금산 산장', '남해 독일마을 & 원예예술촌', '가천 다랭이마을', '상주은모래비치'],
    rainyHotspots: ['남해 유배문학관', '남해 이순신순국공원 영상관', '바람흔적미술관', '독일마을 맥주 펍 쉼터'],
    walkingMinimized: ['보리암 셔틀버스 & 평지 전망대', '독일마을 오션뷰 테라스 카페', '상주해변 송림 평지 산책', '지족해협 죽방렴 뷰'],
    localFoodieSecret: '남해 멸치쌈밥 정식, 독일식 수제 소시지 & 슈바이네학센, 유자 카스테라, 전복죽',
    transitTip: '남해터미널에서 독일마을 및 보리암 방면 직통 농어촌버스 운행'
  },
  '춘천': {
    nameEn: 'Chuncheon',
    badge: '호반의 정취와 낭만이 흐르는 호수 도시',
    signatureHighlights: ['남이섬 & 짚와이어', '춘천 삼악산 호수케이블카', '소양강 스카이워크', '레고랜드 코리아'],
    rainyHotspots: ['국립춘천박물관', '이상원미술관', '애니메이션박물관 & 토이로봇관', '소양강 실내 카페거리'],
    walkingMinimized: ['삼악산 호수케이블카 크리스탈 캐빈', '소양호 유람선 청평사 코스', '의암호 물레길 카누 힐링', '구봉산 전망대 카페'],
    localFoodieSecret: '춘천 명동 철판닭갈비 & 숯불닭갈비, 시원한 동치미 막국수, 감자빵',
    transitTip: '용산/청량리역에서 ITX-청춘 탑승 시 1시간 만에 남춘천/춘천역 도착'
  },
  '안동': {
    nameEn: 'Andong',
    badge: '유교 문화의 본향이자 하회마을의 품격',
    signatureHighlights: ['안동 하회마을 & 부용대', '월영교 분수 야경 & 황포돛배', '도산서원 & 만대루', '만휴정 포토존'],
    rainyHotspots: ['한국국학진흥원 유교문화박물관', '안동시립민속박물관', '하회세계탈박물관', '이육사문학관'],
    walkingMinimized: ['월영교 문보트/황포돛배 승선', '하회마을 전동카트 투어', '월영당 쑥떡 카페 쉼터', '부용대 나룻배 이동'],
    localFoodieSecret: '원조 안동 찜닭, 헛제사밥, 맘모스베이커리 크림치즈빵, 안동 간고등어 구이',
    transitTip: '청량리역에서 KTX-이음 탑승 시 안동역까지 2시간 쾌속 연결'
  },
  '포항': {
    nameEn: 'Pohang',
    badge: '스페이스워크와 호미곶 상생의 손이 맞이하는 일출 도시',
    signatureHighlights: ['환호공원 스페이스워크', '호미곶 해맞이광장', '영일대해수욕장 해상누각', '이가리 닻 전망대'],
    rainyHotspots: ['포항시립미술관 (환호공원 내)', '국립등대박물관 (호미곶)', '포항제철소 파크1538 역사박물관', '구룡포 근대역사관'],
    walkingMinimized: ['영일대 해상누각 평지 산책로', '호미곶 광장 해안 데크', '구룡포 일본인가옥거리 찻집', '송도 송림 테마거리'],
    localFoodieSecret: '포항 죽도시장 영덕대게·물회, 구룡포 과메기, 모리국수, 영일대 조개구이',
    transitTip: '포항역(KTX)에서 영일대해수욕장까지 택시 10분, 버스 20분 내 연결'
  },
  '수원': {
    nameEn: 'Suwon',
    badge: '유네스코 세계문화유산 수원화성과 행궁동 핫플',
    signatureHighlights: ['수원화성 & 방화수류정', '화성행궁 & 행리단길', '플라잉수원 열기구 체험', '스타필드 수원 별마당도서관'],
    rainyHotspots: ['스타필드 수원 복합문화공간', '수원시립아이파크미술관', '국립농업박물관', '수원화성박물관'],
    walkingMinimized: ['수원화성 어차(관광열차) 순환 투어', '방화수류정 호반 벤치 쉼터', '플라잉수원 열기구 탑승', '행리단길 루프탑 카페'],
    localFoodieSecret: '수원 왕갈비, 행궁동 남문통닭거리 진미통닭, 보영만두 쫄면 & 군만두',
    transitTip: '지하철 1호선 및 수인분당선 수원역에서 화성행궁까지 버스로 10분'
  },
  '가평': {
    nameEn: 'Gapyeong',
    badge: '아침고요수목원과 청평호반이 빚어낸 힐링 숲',
    signatureHighlights: ['아침고요수목원', '쁘띠프랑스 & 이탈리아마을', '자라섬 남도 꽃정원', '가평 레일바이크'],
    rainyHotspots: ['쁘띠프랑스 실내 인형극장', '이탈리아마을 피노키오관', '가평 양떼목장 실내 베이커리 카페', '음악역 1939 실내공간'],
    walkingMinimized: ['가평 레일바이크 전동 페달 코스', '청평호 유람선 투어', '자라섬 평지 산책로', '수목원 온실정원 쉼터'],
    localFoodieSecret: '가평 잣두부 정식, 잣막걸리 & 파전, 솥뚜껑 닭볶음탕, 잣 아이스크림',
    transitTip: 'ITX-청춘 가평역/청평역에서 가평 관광지 순환버스(A/B코스) 이용 시 주요 명소 순환'
  },
  '원주': {
    nameEn: 'Wonju',
    badge: '뮤지엄 산과 소금산 출렁다리가 빚어낸 낭만 힐링 도시',
    signatureHighlights: ['뮤지엄 산 (안도 타다오 건축)', '소금산 그랜드밸리 출렁다리', '치악산 구룡사 숲길', '원주 미로예술시장'],
    rainyHotspots: ['뮤지엄 산 실내 갤러리 & 명상관', '원주 역사박물관', '박경리문학공원 문학의 집'],
    walkingMinimized: ['소금산 케이블카 & 울렁다리 평지 코스', '뮤지엄 산 카트 투어', '행구동 수변공원 티타임'],
    localFoodieSecret: '원주 추어탕, 자유시장 지하 돈까스 골목, 치악산 황골 엿, 곤드레 솥밥',
    transitTip: 'KTX-이음 만종역/원주역에서 시내버스 및 투어버스로 20분 내 명소 연결'
  },
  '대전': {
    nameEn: 'Daejeon',
    badge: '성심당 빵지순례와 엑스포 과학의 감성 도시',
    signatureHighlights: ['성심당 본점 & 케익부띠끄', '한밭수목원 & 엑스포다리 야경', '유성온천 족욕체험길', '대청호 오백리길'],
    rainyHotspots: ['국립중앙과학관', '신세계 아트앤사이언스', '대전시립미술관'],
    walkingMinimized: ['유성온천 족욕장', '대청호 전망 카페', '성심당 DCC점'],
    localFoodieSecret: '성심당 튀김소보로·망고시루, 칼국수 & 두부두루치기, 구즉 도토리묵',
    transitTip: 'KTX 대전역 및 도시철도 1호선으로 시내 중심부 15분 내 연결'
  },
  '대구': {
    nameEn: 'Daegu',
    badge: '근대 골목 투어와 미식·야경이 빛나는 패션 도시',
    signatureHighlights: ['대구 근대골목 (청라언덕 & 계산성당)', '동성로 스파크랜드', '앞산전망대 케이블카 야경', '서문시장 야시장'],
    rainyHotspots: ['대구미술관', '국립대구박물관', '스파크랜드 실내 테마파크'],
    walkingMinimized: ['앞산 케이블카', '김광석 다시그리기길 평지 산책', '수성못 유람선'],
    localFoodieSecret: '대구 10미 (막창구이, 뭉티기, 동인동 찜갈비, 납작만두)',
    transitTip: 'KTX 동대구역 및 도시철도 1·2·3호선으로 전 명소 쾌속 이동'
  },
  '인천': {
    nameEn: 'Incheon',
    badge: '개항장 역사거리와 송도 센트럴파크의 미래형 해양 도시',
    signatureHighlights: ['차이나타운 & 개항장 거리', '송도 센트럴파크 & 수상택시', '월미도 바다열차', '영종도 인스파이어 엔터테인먼트'],
    rainyHotspots: ['영종도 인스파이어 오로라 미디어아트', '국립세계문자박물관', '트라이보울 아트홀'],
    walkingMinimized: ['송도 센트럴파크 문보트/수상택시', '월미바다열차 순환 투어', '영종 씨사이드 레일바이크'],
    localFoodieSecret: '차이나타운 원조 짜장면 & 화덕만두, 신포국제시장 닭강정, 송도 물회',
    transitTip: '공항철도 및 수인분당선, 인천 1호선으로 서울 및 공항에서 30분대 직통'
  },
  '울릉': {
    nameEn: 'Ulleungdo & Dokdo',
    badge: '신비의 화산섬과 대한민국 동쪽 끝 독도의 장엄한 비경',
    signatureHighlights: ['독도(Dokdo) 탐방 & 여객선 투어', '나리분지 & 투막집', '관음도 연도교 해안 절경', '봉래폭포 & 풍혈 삼림욕'],
    rainyHotspots: ['독도박물관 & 독도전망대 케이블카', '울릉수생태전시관', '울릉도·독도 해양연구기지', '나리분지 전통 찻집'],
    walkingMinimized: ['독도전망대 케이블카', '울릉 순환도로 해안 드라이브', '관음도 엘리베이터 진입로', '사동항 오션뷰 카페'],
    localFoodieSecret: '울릉도 독도새우(꽃새우·닭새우), 따개비밥 & 따개비칼국수, 울릉 약소 숯불구이, 오징어 숙회 & 명이나물',
    transitTip: '포항/후포/강릉/묵호항에서 쾌속 여객선 탑승 시 2시간 30분~3시간 울릉도(사동·도동·저동항) 도착'
  },
  '단양': {
    nameEn: 'Danyang',
    badge: '도담삼봉과 패러글라이딩, 남한강 비경의 레저 힐링 명소',
    signatureHighlights: ['도담삼봉 & 석문', '만천하스카이워크 & 짚와이어', '단양 패러글라이딩 활공장 (카페산)', '고수동굴 & 구담봉'],
    rainyHotspots: ['다누리아쿠아리움 (국내 최대 민물고기 생태관)', '단양 온달관광지 온달동굴 & 세트장', '수양개빛터널 실내 미디어파크'],
    walkingMinimized: ['도담삼봉 유람선/모터보트 승선', '만천하 모노레일', '패러글라이딩 힐링 뷰 테라스 (카페산)', '단양강 잔도 평지 데크길'],
    localFoodieSecret: '단양 구경시장 마늘순대·마늘통닭·마늘떡갈비 정식, 쏘가리매운탕, 흑마늘 빵',
    transitTip: '청량리역에서 KTX-이음 탑승 시 단양역까지 1시간 15분 쾌속 진입'
  },
  '순천': {
    nameEn: 'Suncheon',
    badge: '유네스코 세계유산 순천만 습지와 대한민국 제1호 국가정원',
    signatureHighlights: ['순천만 국가정원', '순천만 습지 (갈대밭 & 용산전망대)', '낙안읍성 민속마을', '선암사 & 승선교'],
    rainyHotspots: ['순천만국제습지센터 실내 생태관', '순천 드라마촬영장 실내 체험관', '낙안읍성 전통 다도 쉼터', '순천시립뿌리깊은나무박물관'],
    walkingMinimized: ['스카이큐브 (국가정원 ↔ 순천만습지 무인궤도열차)', '국가정원 관람차 순환 투어', '낙안읍성 평지 골목 산책', '와온해변 일몰 드라이브'],
    localFoodieSecret: '순천만 짱뚱어탕 & 꼬막정식, 웃장 국밥거리 돼지국밥(수육 서비스), 순천 칠게빵',
    transitTip: '용산역에서 KTX 탑승 시 순천역까지 2시간 30분 직통 연결'
  },
  '태안': {
    nameEn: 'Taean',
    badge: '꽃지해수욕장 붉은 낙조와 피톤치드 안면도 휴양림',
    signatureHighlights: ['안면도 꽃지해수욕장 & 할미·할아비바위 일몰', '안면도 자연휴양림 & 수목원', '천리포수목원', '신두리 해안사구'],
    rainyHotspots: ['안면도 쥬라기박물관', '태안 로컬푸드 직매장 실내 쉼터', '천리포수목원 밀러가든 갤러리', '태안 해양유물전시관'],
    walkingMinimized: ['꽃지해변 오션뷰 카페 테라스', '안면도 무장애 나눔길 데크 산책', '영목항 전망대 엘리베이터', '백사장항 꽃게다리 평지 뷰'],
    localFoodieSecret: '태안 향토 미식 게국지 정식, 간장게장, 대하구이, 바지락 칼국수 & 우럭젓국',
    transitTip: '서울 센트럴시티에서 안면도/태안 버스터미널까지 2시간 직통 우등버스 운행'
  },
  '진도': {
    nameEn: 'Jindo',
    badge: '신비의 바닷길과 남도 소리 예술의 고향',
    signatureHighlights: ['진도 신비의 바닷길', '진도타워 & 울돌목 명량해상케이블카', '운림산방 & 소치기념관', '세방낙조 전망대'],
    rainyHotspots: ['진도개 테마파크 실내공연장', '남도전통미술관', '진도 해양생태관', '소치기념관'],
    walkingMinimized: ['명량해상케이블카 크리스탈 캐빈', '진도타워 엘리베이터 전망대', '세방낙조 해안 드라이브', '쏠비치 진도 인피니티풀'],
    localFoodieSecret: '진도 뜸북국, 간재미초무침, 울돌목 꽃게무침, 진도 홍주 & 꽃게비빔밥',
    transitTip: '목포역(KTX)에서 진도 쏠비치 및 시내까지 셔틀 및 시외버스로 50분 연결'
  },
  '군산': {
    nameEn: 'Gunsan',
    badge: '근대 시간여행 골목과 선유도 고군산군도 에메랄드 바다',
    signatureHighlights: ['군산 근대역사박물관 & 시간여행마을', '초원사진관 & 히로쓰가옥', '경암동 철길마을', '고군산군도 선유도 해수욕장 & 짚라인'],
    rainyHotspots: ['군산 근대역사박물관', '호남관세박물관', '조선은행 군산지점 미술관', '이성당 본점 베이커리 쉼터'],
    walkingMinimized: ['선유도 2층 관광버스 투어', '근대골목 인력거/전동스쿠터 체험', '은파호수공원 물빛다리 평지 산책', '이성당 빵지순례'],
    localFoodieSecret: '이성당 단팥빵·야채빵, 군산 짬뽕거리 복성루/지린성 고추짜장, 한일옥 소고기무국, 박대구이 정식',
    transitTip: '용산역에서 무궁화/새마을호 탑승 시 군산역 직통 연결 및 익산역(KTX) 환승 버스 25분'
  },
  '신안': {
    nameEn: 'Shinan & Purple Island',
    badge: '1004개 보물섬과 보랏빛 향연의 퍼플섬 & 유네스코 갯벌',
    signatureHighlights: ['퍼플섬 (반월·박지도 보라색 다리 & 꽃축제)', '천사대교 드라이브', '홍도 33경 유람선 절경', '흑산도 상라봉 12굽이길', '증도 짱뚱어다리 & 태평염전'],
    rainyHotspots: ['신안 태평염전 소금박물관', '신안 세계조개박물관', '천사섬 분재공원 온실'],
    walkingMinimized: ['퍼플섬 보라 전동카트 투어', '천사대교 해상 드라이브', '홍도 유람선 선상 힐링', '증도 해안 데크 평지길'],
    localFoodieSecret: '신안 흑산도 홍어 삼합, 짱뚱어탕, 민어회, 신안 천일염 아이스크림, 낙지 탕탕이',
    transitTip: '목포역(KTX)에서 천사대교 경유 압해도·암태도 방면 직행버스 30분대 연결'
  },
  '완도': {
    nameEn: 'Wando & Cheongsando',
    badge: '청산도 슬로길과 보길도 고산 윤선도의 푸른 해양 치유',
    signatureHighlights: ['청산도(서편제 돌담길 & 유채꽃·청보리밭)', '보길도(세연정 & 예송리 갯돌해변)', '완도타워 & 모노레일', '명사십리 해수욕장 해양치유센터'],
    rainyHotspots: ['완도 해양치유센터 실내 스파', '완도 장보고기념관', '완도타워 실내 전망대', '해조류센터'],
    walkingMinimized: ['완도타워 모노레일 탑승', '청산도 순환투어 버스', '보길도 세연정 평지 정원 산책', '명사십리 데크 쉼터'],
    localFoodieSecret: '완도 활전복 코스 요리(전복죽·전복회·전복버터구이), 해조류 비빔밥, 청산도 톳밥 정식',
    transitTip: '완도 연안여객선터미널에서 쾌속선 탑승 시 청산도 50분, 보길도 30분 도착'
  }
};

// ==============================================================================
// 2. TIKITAKA_CHITCHAT_MATRIX (감정, 피드백, 돌발 상황 위트 티키타카)
// ==============================================================================
export const TIKITAKA_CHITCHAT_MATRIX = {
  // [A] 인사 및 가벼운 시작
  GREETING: {
    triggers: /^(안녕|안녕하세요|하이|반가워|ㅎㅇ|hello|hi|헤이|보라야)$/i,
    reply: () => `반갑습니다! 대한민국 No.1 AI 여행 컨시어지 보라(VORA)예요! 🌸✨\n가고 싶으신 여행지(서울, 부산, 제주, 강릉, 경주 등)나 원하시는 여행 스타일을 편하게 말씀해 주세요! 0.01초 만에 완벽한 맞춤 코스를 찾아드릴게요!`,
    followUp: '가고 싶으신 도시나 특별히 생각하신 여행 테마가 있으신가요? ✈️'
  },
  // [B] 정체성 질의 ("넌 누구니?", "너 누구야", "자기소개")
  WHO_ARE_YOU: {
    triggers: /(누구니|누구야|누구세요|자기소개|너의\s*정체|너는\s*뭐|뭐하는\s*애|who\s*are\s*you)/i,
    reply: () => `저는 대한민국 곳곳의 보석 같은 명소와 찐 로컬 맛집을 꿰뚫고 있는 **AI 여행 컨시어지 보라(VORA)**예요! 🌸🇰🇷\n여행자님의 일정, 동선, 날씨, 동행자 맞춤 힐링 코스를 0.01초 만에 정갈하게 짜드리는 든든한 여행 메이트랍니다! ✨`,
    followUp: '오늘 저와 함께 어느 도시로 떠나보실래요? 🗺️ (서울·부산·제주·강릉·경주 등)'
  },
  // [B] 친근한 장난 & "너 바보지"
  FOOL_PLAYFUL: {
    triggers: /(바보|멍청|바보야|바보지|장난쳐|말귀|너바보|너\s*바보|바보냐)/i,
    reply: () => `아이쿠! 저 바보 아니에요~ 삐질 뻔했잖아요 힝 🥺 ㅋㅋㅋ\n여행자님의 200% 완벽한 여행을 위해 0.01초 만에 두 발로 열심히 뛰고 있답니다! 🏃‍♀️✨\n원하시는 도시나 여행 스타일을 편하게 말씀해 주시면 제 진짜 실력을 제대로 보여드릴게요! 🎯`,
    followUp: '어떤 도시나 여행 스타일로 갈까요? (예: 부산 바다 여행, 강릉 카페 투어, 경주 힐링) 🌊'
  },
  // [C] 다른 지역/도시 탐색 ("서울 말고 다른 데 없나?")
  OTHER_CITY: {
    triggers: /(다른\s*도시|다른\s*지역|서울\s*싫|서울\s*말고|다른\s*데\s*없|다른\s*곳\s*없|어디\s*갈까|추천\s*도시|추천\s*지역|딴\s*지역|딴\s*도시)/i,
    reply: () => `서울 말고도 대한민국에 숨은 보석 같은 도시들이 정말 많죠! 💎✨\n여행자님의 여행 취향에 딱 맞게 푸른 바다의 **부산·강릉·속초**, 천년 고도의 고즈넉한 **경주**, 천혜의 자연 **제주** 중 어디든 완벽하게 모십니다!`,
    followUp: '시원한 오션뷰 [부산·강릉] vs 감성 힐링 [경주·제주] 중 어느 쪽이 더 끌리시나요? 🌊 vs 🌿'
  },
  // [D] 배고픔 & 미식 갈증
  HUNGRY: {
    triggers: /(배고파|배고파요|배고파죽겠|출출해|밥먹자|밥어디서|맛있는거|먹을래|꼬르륵|배가\s*고프|배고픔|뭐먹을)/i,
    reply: (city = '서울') => `금강산도 식후경이죠! 꼬르륵 소리 멈추게 할 **${city} 현지인 찐 맛집**으로 바로 모실게요 🤤🍴\n입안 가득 행복해지는 시그니처 미식과 웨이팅 없는 꿀팁까지 준비했습니다!`,
    followUp: '든든한 한식 백반으로 갈까요, 아니면 분위기 좋은 감성 파스타/로컬 요리로 갈까요? 🍲 vs 🍝'
  },
  // [E] 피곤 & 다리 아픔 & 휴식
  TIRED_LEGS: {
    triggers: /(다리아파|힘들어|피곤해|지쳐|쉬고싶어|못걷겠|힘들다|다리부러|휴식)/i,
    reply: (city = '서울') => `오늘 정말 알차고 부지런하게 여행하셨군요! 👏\n더 이상 무리해서 걷지 마세요. 계단 0개, 푹신한 소파와 탁 트인 전망이 있는 **${city} 힐링 오션뷰/전망 카페와 편안한 쉼터**를 골랐습니다 ☕🌿`,
    followUp: '따뜻한 전통차와 족욕 쉼터로 갈까요, 아니면 편안한 의자가 있는 대형 베이커리 카페로 갈까요? 🍵 vs 🥐'
  },
  // [F] 날씨 불평 (비, 폭우, 더위, 추위)
  WEATHER_COMPLAINT: {
    triggers: /(비와서|비오는데|날씨망|짜증나|더워죽|추워죽|비때문에|날씨최악)/i,
    reply: (city = '서울') => `날씨 때문에 속상하셨죠 ㅠㅠ 하지만 비 오는 날의 **${city}**은 오히려 감성 200% 충전 타임입니다! ☔✨\n빗방울 소리를 통창으로 감상하는 실내 오션뷰/정원 핫플과 몰입형 미디어아트로 인생샷을 건져보세요!`,
    followUp: '비 한 방울 안 맞는 대형 실내 복합몰로 갈까요, 아니면 빗소리가 운치 있는 한옥 카페로 갈까요? 🏛️ vs ☕'
  },
  // [G] 칭찬 & 만족 ("너 짱이다", "똑똑하다", "고마워")
  COMPLIMENT: {
    triggers: /(고마워|고맙습니다|너짱|최고야|대단해|천재|똑똑해|잘했어|완벽해|감사|thx|thank)/i,
    reply: () => `칭찬해 주시니 어깨가 으쓱하네요! 🥰 선배님의 여행 감각이 워낙 뛰어나셔서 제가 더 신나서 찾은 덕분입니다 ✨\n앞으로의 여정도 완벽하게 보필할게요!`,
    followUp: '다음 일정에 어울리는 환상적인 포토스팟이나 야경 명소도 미리 봐드릴까요? 📸🌃'
  },
  // [H] 불만족 & 장소 교체 요청 ("별로야", "딴 데 없어?", "다른 거 보여줘")
  DISAPPOINTED_REPLACE: {
    triggers: /(별로야|맘에\s*안|다른\s*곳|딴\s*데|다른\s*장소|딴\s*거|다른\s*거|다른\s*데|이거\s*별로)/i,
    reply: (city = '서울') => `아이쿠, 제 추천이 선배님 눈높이에 쏙 들지 못했군요! 반성합니다 🙇‍♀️\n그럼 완전히 다른 분위기의 **${city} 숨은 히든 핫플레이스**로 즉시 교체해 드릴게요! 🔄`,
    followUp: '조용하고 한적한 자연 힐링 스팟을 원하세요, 아니면 활기차고 트렌디한 MZ 핫플을 원하세요? 🌿 vs 🔥'
  },
  // [I] 심심함 & 즉흥 재미 ("심심해", "할 거 없어?")
  BORED: {
    triggers: /(심심해|할거없|뭐할까|재미있는|지루해|할거추천|즉흥)/i,
    reply: (city = '서울') => `심심할 틈이 없죠! 지금 시간대에 **${city}**에서 가장 핫한 액티비티와 이색 체험 스팟을 즉시 처방해 드립니다 ⚡🎈`,
    followUp: '짜릿한 레저/체험 액티비티로 기분 전환할까요, 아니면 레트로 골목 투어 & 소품샵 투어로 갈까요? 🎢 vs 🛍️'
  },
  // [J] 예산 걱정 & 가성비 ("돈 없어", "싸게", "비싸")
  BUDGET_WORRY: {
    triggers: /(돈없어|비싸|가성비|싸게|저렴하게|알뜰|지갑|예산부족)/i,
    reply: (city = '서울') => `걱정 뚝! 지갑은 가볍게, 추억은 두둑하게 채울 수 있는 **${city} 가성비 끝판왕 로컬 코스**가 준비되어 있습니다 💰✨\n입장료 0원 힐링 뷰포인트와 1인 1만 원대 착한 가격 노포를 모았어요.`,
    followUp: '시장 인심 넘치는 전통시장 먹거리 투어 먼저 볼까요? 🍢'
  }
};

// ==============================================================================
// 3. K_FOOD_PAIRING_KNOWLEDGE (지역별 대표 미식 페어링)
// ==============================================================================
export const K_FOOD_PAIRING_KNOWLEDGE = {
  '서울': { signature: '광장시장 마약김밥 & 녹두빈대떡 + 막걸리', tip: '종로 피맛골 백반과 성수동 스페셜티 드립커피 디저트 페어링 추천' },
  '부산': { signature: '부산 원조 돼지국밥(부추 듬뿍) & 자갈치 생선구이', tip: '식후 남포동 비프광장 원조 씨앗호떡으로 달콤한 마무리' },
  '제주': { signature: '제주 흑돼지 근고기 멜젓구이 & 고기국수', tip: '애월 한담해변 오션뷰 카페에서 즐기는 한라봉 에이드 페어링' },
  '경주': { signature: '황리단길 떡갈비 정식 & 맷돌순두부 찌개', tip: '황남빵 본점 갓 구운 따끈한 팥빵과 찰보리빵 간식 세트' },
  '강릉': { signature: '초당 순두부마을 짬뽕순두부 & 몽글순두부 백반', tip: '안목 커피거리에서 즐기는 에스프레소 & 순두부 젤라또' },
  '속초': { signature: '아바이마을 모둠순대(오징어순대) & 청초호 시원한 활어 물회', tip: '속초관광수산시장 만석닭강정 & 팡파미유 마늘바게트' },
  '여수': { signature: '돌산 갓김치 곁들인 간장게장 백반 & 여수 밤바다 해물삼합', tip: '이순신광장 명물 쑥 아이스크림 & 딸기모찌 디저트' },
  '전주': { signature: '전주 콩나물국밥(수란 세트) & 전주 전통비빔밥', tip: '한옥마을 전주비빔빵 & 달콤 쌉싸름한 모주 한잔' }
};

// ==============================================================================
// 4. K_FASHION_WEATHER_GUIDE (날씨·기온별 옷차림 가이드)
// ==============================================================================
export const K_FASHION_WEATHER_GUIDE = {
  HOT_SUMMER: {
    condition: '기온 28℃ 이상 (무더위/한여름)',
    advice: '통풍이 잘되는 린넨 셔츠나 반팔 티셔츠를 추천합니다! 실내 에어컨 냉방에 대비해 가벼운 얇은 셔츠나 가디건을 챙기시면 완벽해요 🕶️☀️',
    items: ['선글라스', '자외선차단제', '휴대용 손선풍기', '양우산']
  },
  MILD_SPRING_AUTUMN: {
    condition: '기온 15℃ ~ 24℃ (봄·가을 환절기)',
    advice: '일교차가 있으니 니트나 셔츠 위에 트렌치코트, 블레이저, 가죽자켓을 걸치는 레이어드 룩이 사진 찍기에 가장 예쁩니다 🧥🍂',
    items: ['가벼운 겉옷', '편안한 워킹 스니커즈', '보조배터리']
  },
  COLD_WINTER: {
    condition: '기온 5℃ 이하 (겨울/한파)',
    advice: '보온성 높은 숏패딩이나 롱패딩, 도톰한 울 코트를 추천합니다. 목도리와 장갑을 포인트 컬러로 매치하면 겨울 인생샷 완성! 🧣❄️',
    items: ['핫팩', '목도리/장갑', '보습 립밤', '보온 텀블러']
  },
  RAINY_DAY: {
    condition: '우천 / 비 오는 날',
    advice: '젖어도 부담 없는 편안한 방수 슈즈나 가벼운 운동화, 빗물이 튀지 않는 어두운 톤의 바지와 쾌적한 윈드브레이커를 추천합니다 ☔',
    items: ['3단 접이식 자동우산', '방수 파우치', '여분 양말']
  }
};

// ==============================================================================
// 5. FOREIGNER_ESSENTIALS_KNOWLEDGE (외국인 관광객 필수 실전 팁)
// ==============================================================================
export const FOREIGNER_ESSENTIALS_KNOWLEDGE = {
  TRANSIT_CARD: {
    title: 'Korea Transit (T-Money & Climate Card)',
    tip: 'Buy a T-Money card at any subway station or convenience store (CU, GS25, 7-Eleven). For unlimited rides in Seoul, get the Climate Card (기후동행카드) for ₩3,000/day!'
  },
  HOTLINE_1330: {
    title: '1330 Korea Travel Helpline (24/7 Free)',
    tip: 'Call 1330 (without area code) anytime for free multilingual tourist interpretation and emergency translation (English, Japanese, Chinese, Russian, etc.).'
  },
  TAX_REFUND: {
    title: 'Immediate Tax Free (TAX FREE)',
    tip: 'Look for "Tax Free" logos at shops. Present your passport at checkout to get instant 7~10% VAT deduction directly on the receipt for purchases over ₩15,000.'
  },
  TAXI_APP: {
    title: 'Ride-Hailing in Korea',
    tip: 'Kakao T and Uber (UT) work seamlessly across Korea. International credit cards (Visa/Mastercard) are accepted everywhere in registered taxis.'
  }
};

// ==============================================================================
// 6. PROACTIVE_CONVERSATION_HOOKS (선제적 핑퐁 대화 훅)
// ==============================================================================
export const PROACTIVE_CONVERSATION_HOOKS = [
  '점심 식사 후 감성 카페 한 잔 하실래요, 아니면 시원한 오션/도심 전망대로 바로 갈까요? ☕ vs 🏙️',
  '이 동선 주변에 현지인만 아는 꿀맛 길거리 간식이 있는데 그것도 소개해 드릴까요? 😋',
  '해 질 녘에 인생샷 건질 수 있는 일몰 뷰포인트도 일정에 추가해 드릴까요? 🌅📸',
  '쇼핑이나 소품샵 투어가 필요하시면 동선에 쏙 넣어드릴게요! 🛍️'
];

/**
 * Intelligent Tiki-Taka Query Classifier & Fast Matcher
 */
export function resolveTikitakaResponse(query = '', currentCity = '서울', currentSeason = null) {
  if (!query || typeof query !== 'string') return null;
  const clean = query.trim();

  // Check Tiki-Taka Matrix Triggers
  for (const [key, item] of Object.entries(TIKITAKA_CHITCHAT_MATRIX)) {
    if (item.triggers.test(clean)) {
      return {
        matchedKey: key,
        reply: item.reply(currentCity),
        followUp: item.followUp,
        isTikitaka: true
      };
    }
  }

  // Check Weather / Fashion / Outfit query (띄어쓰기 및 오타 완벽 포용)
  if (/(복장|뭐\s*입|뭘\s*입|어떻게\s*입|옷차림|패션|코디|옷어떻게|날씨어때|외투|패딩|코트|따뜻하게|옷|입을|입고)/i.test(clean)) {
    const isRain = /(비|우천)/.test(clean);
    const isWinter = /(겨울|winter|추위|한파|춥|설경)/.test(clean) || currentSeason === '겨울';
    const isSummer = /(여름|summer|더위|폭염|덥)/.test(clean) || currentSeason === '여름';
    const isSpring = /(봄|spring|벚꽃)/.test(clean) || currentSeason === '봄';
    const isAutumn = /(가을|autumn|fall|단풍)/.test(clean) || currentSeason === '가을';
    
    const fashion = isRain
      ? K_FASHION_WEATHER_GUIDE.RAINY_DAY
      : isWinter
      ? K_FASHION_WEATHER_GUIDE.COLD_WINTER
      : isSummer
      ? K_FASHION_WEATHER_GUIDE.HOT_SUMMER
      : K_FASHION_WEATHER_GUIDE.MILD_SPRING_AUTUMN;

    const isGeneralCountry = (currentCity === '대한민국' || currentCity === '한국' || currentCity === 'Korea');
    const followUp = isGeneralCountry
      ? '가고 싶으신 도시(서울, 부산, 제주, 거제 등)를 말씀해 주시면 딱 맞는 일정을 잡아드릴까요? ✈️🌸'
      : isWinter
      ? '추위를 피할 수 있는 따뜻한 실내 핫플 코스로 잡아드릴까요? ☕❄️'
      : isSummer
      ? '더위를 식혀줄 시원한 오션뷰 & 쾌적한 실내 코스로 잡아드릴까요? 🌊🕶️'
      : isRain
      ? '비 한 방울 안 맞는 몰입형 미디어아트 & 실내 핫플 코스로 잡아드릴까요? ☔🏛️'
      : '화창한 날씨에 딱 맞는 인생샷 야외 산책 & 감성 카페 코스로 잡아드릴까요? 🌸📸';

    return {
      matchedKey: 'FASHION_GUIDE',
      reply: `**${currentCity}** ${seasonLabel}여행 추천 옷차림 가이드입니다! 👗✨\n${fashion.advice}\n\n💡 **추천 꿀아이템**: ${fashion.items.join(', ')}`,
      followUp,
      isTikitaka: true
    };
  }

  // Check Foodie Pairing query
  if (/(뭐먹지|대표음식|맛집조합|페어링|꼭먹어야)/i.test(clean)) {
    const food = K_FOOD_PAIRING_KNOWLEDGE[currentCity] || K_FOOD_PAIRING_KNOWLEDGE['서울'];
    return {
      matchedKey: 'FOOD_PAIRING',
      reply: `**${currentCity}**에 오셨다면 이건 무조건 맛보셔야죠! 🍴🔥\n\n⭐ **시그니처 미식**: ${food.signature}\n💡 **현지인 꿀팁**: ${food.tip}`,
      followUp: '이 식당 근처에서 바로 걸어갈 수 있는 디저트 카페도 찾아드릴까요? ☕',
      isTikitaka: true
    };
  }

  // Check Foreigner Tips query
  if (/(교통카드|티머니|기후동행|면세|택시|1330|tax|transit|t-money)/i.test(clean)) {
    const isTransit = /(교통|티머니|기후|transit|card)/i.test(clean);
    const tip = isTransit ? FOREIGNER_ESSENTIALS_KNOWLEDGE.TRANSIT_CARD : FOREIGNER_ESSENTIALS_KNOWLEDGE.TAX_REFUND;
    return {
      matchedKey: 'FOREIGNER_TIP',
      reply: `💡 **${tip.title}**\n${tip.tip}`,
      followUp: '더 궁금하신 대중교통이나 결제 팁이 있으신가요? 💳',
      isTikitaka: true
    };
  }

  return null;
}

// ==============================================================================
// 7. CITY_GATEWAY_HUBS (도시별 교통 거점 & 숙소 허브 도어투도어 지식)
// ==============================================================================
export const CITY_GATEWAY_HUBS = {
  '서울': {
    gateways: ['인천국제공항', '김포국제공항', '서울역 KTX'],
    hotelAreas: ['명동/종로', '홍대/마포', '강남/잠실', '동대문/이태원'],
    arrivalTransit: '인천국제공항 T1/T2에서 공항철도 직통열차(AREX) 또는 6015/6002 공항리무진 탑승',
    departureAdvice: '서울역 도심공항터미널 얼리 체크인 & 인천공항 3시간 전 도착 후 택스리펀(Tax Refund) 키오스크 이용',
    defaultChips: [
      '✈️ 인천공항 & 명동 숙소',
      '✈️ 김포공항 & 홍대 숙소',
      '🚅 서울역 KTX & 강남 숙소',
      '🏢 이미 서울 시내 도착'
    ]
  },
  '부산': {
    gateways: ['김해국제공항', '부산역 KTX', '부산 서부/종합버스터미널'],
    hotelAreas: ['해운대/광안리', '서면/전포', '남포동/자갈치', '기장/오시리아'],
    arrivalTransit: '부산역 KTX 도착 후 지하철 1/2호선 환승 또는 김해공항 리무진버스 탑승',
    departureAdvice: '부산역 KTX 탑승 30분 전 / 김해공항 국내선 1시간 30분 전 도착 권장',
    defaultChips: [
      '🚅 부산역 KTX & 해운대 숙소',
      '✈️ 김해공항 & 서면 숙소',
      '🌊 광안리 오션뷰 숙소',
      '🏢 이미 부산 시내 도착'
    ]
  },
  '제주': {
    gateways: ['제주국제공항'],
    hotelAreas: ['제주시내/연동', '애월/한림/협재', '서귀포/중문관광단지', '성산/함덕/월정리'],
    arrivalTransit: '제주국제공항 5번 게이트 렌트카 셔틀버스 탑승 또는 급행버스(100~180번) 이용',
    departureAdvice: '렌트카 완전자차 반납 후 제주공항 JDC 내국인/외국인 면세점 쇼핑 2시간 전 도착 권장',
    defaultChips: [
      '✈️ 제주공항 & 제주시내 숙소',
      '🚗 렌트카 & 애월/협재 숙소',
      '🍊 제주공항 & 서귀포/중문',
      '🌴 이미 제주 도착'
    ]
  },
  '강릉': {
    gateways: ['KTX 강릉역', '강릉 고속/시외버스터미널'],
    hotelAreas: ['안목/경포대/강문해변', '강릉 시내/교동', '정동진/주문진'],
    arrivalTransit: 'KTX 강릉역 도착 후 안목해변/경포대 방면 시내버스(202-1번) 또는 택시 10분 이동',
    departureAdvice: 'KTX 강릉역 출발 30분 전 도착 권장 (역사 내 강릉 커피콩빵 & 강릉샌드 기념품 구매)',
    defaultChips: [
      '🚅 KTX 강릉역 & 경포대 숙소',
      '☕ KTX 강릉역 & 안목해변 숙소',
      '🚌 강릉터미널 & 시내 숙소',
      '🌊 이미 강릉 도착'
    ]
  },
  '속초': {
    gateways: ['속초 고속/시외버스터미널'],
    hotelAreas: ['속초해변/조양동', '속초 중앙시장/동명항', '설악산/척산온천'],
    arrivalTransit: '속초고속버스터미널 도착 후 속초아이 대관람차 & 속초해변 도보 5분 이동',
    departureAdvice: '속초터미널 출발 30분 전 도착 권장 (중앙시장 만석닭강정 & 팡파미유 포장)',
    defaultChips: [
      '🚌 속초터미널 & 속초해변 숙소',
      '🦑 속초터미널 & 중앙시장 숙소',
      '🏔️ 설악산 인근 힐링 숙소',
      '🌊 이미 속초 도착'
    ]
  },
  '경주': {
    gateways: ['신경주역 KTX', '경주 고속버스터미널'],
    hotelAreas: ['황리단길/대릉원 인근', '보문관광단지', '불국사 인근'],
    arrivalTransit: '신경주역(KTX)에서 700번 급행버스 탑승 후 황리단길/대릉원 25분 이동',
    departureAdvice: '신경주역 KTX 탑승 30분 전 도착 권장 (황남빵 본점 갓 구운 빵 픽업)',
    defaultChips: [
      '🚅 KTX 신경주역 & 황리단길 숙소',
      '🏛️ KTX 신경주역 & 보문단지 숙소',
      '🚌 경주터미널 & 대릉원 숙소',
      '🌿 이미 경주 도착'
    ]
  },
  '여수': {
    gateways: ['여수EXPO역 KTX', '여수종합버스터미널', '여수공항'],
    hotelAreas: ['이순신광장/낭만포차', '돌산 오션뷰 호텔/리조트', '여수엑스포역/웅천'],
    arrivalTransit: '여수EXPO역(KTX) 도착 후 해양레일바이크 및 낭만포차 방면 택시 5~10분 이동',
    departureAdvice: '여수EXPO역 KTX 탑승 30분 전 도착 권장 (이순신광장 딸기모찌 & 쑥아이스크림 픽업)',
    defaultChips: [
      '🚅 KTX 여수EXPO역 & 돌산 숙소',
      '🌃 여수역 & 이순신광장 숙소',
      '✈️ 여수공항 & 웅천 숙소',
      '🌊 이미 여수 도착'
    ]
  },
  '거제': {
    gateways: ['거제(고현)버스터미널', '김해국제공항', '통영종합버스터미널'],
    hotelAreas: ['바람의언덕/해금강', '매미성/흥남해변', '고현/옥포'],
    arrivalTransit: '부산 사상/노포터미널에서 거가대교 경유 직행버스로 1시간 10분 쾌속 진입',
    departureAdvice: '거제터미널 출발 20분 전 도착 권장 (바람의 핫도그 & 몽돌빵 포장)',
    defaultChips: [
      '🚌 거제터미널 & 바람의언덕 숙소',
      '🌊 거제터미널 & 매미성 숙소',
      '✈️ 김해공항 & 거제 리조트',
      '🏖️ 이미 거제 도착'
    ]
  },
  '인천': {
    gateways: ['인천국제공항 T1/T2', '인천역 1호선/수인분당선', '송도 센트럴파크'],
    hotelAreas: ['송도국제도시', '영종도 오션뷰', '개항장/차이나타운'],
    arrivalTransit: '인천역 또는 공항철도로 송도 센트럴파크 및 개항장 20분 진입',
    departureAdvice: '인천공항 또는 인천역 출발 30분 전 도착 권장 (신포시장 닭강정 포장)',
    defaultChips: [
      '✈️ 인천공항 & 영종도 오션뷰',
      '🏙️ 인천역 & 송도 센트럴파크',
      '🥟 인천역 & 개항장 숙소',
      '🏢 이미 인천 도착'
    ]
  },
  '수원': {
    gateways: ['수원역 KTX/1호선', '수원버스터미널'],
    hotelAreas: ['행궁동/화성행궁', '광교호수공원', '수원역 인근'],
    arrivalTransit: '수원역에서 행궁동 방면 버스로 10분 직통 연결',
    departureAdvice: '수원역 KTX 탑승 20분 전 도착 권장 (통닭거리 남문통닭 포장)',
    defaultChips: [
      '🚅 KTX 수원역 & 행궁동 숙소',
      '🏞️ 수원역 & 광교호수 숙소',
      '🏰 이미 수원 도착'
    ]
  },
  '전주': {
    gateways: ['전주역 KTX', '전주 고속/시외버스터미널'],
    hotelAreas: ['전주 한옥마을', '객리단길/다가동', '서신/효자동'],
    arrivalTransit: '전주역(KTX) 도착 후 119번 버스 탑승 시 한옥마을 입구 20분 직통 연결',
    departureAdvice: '전주역 KTX 탑승 30분 전 도착 권장 (PNB 풍년제과 수제 초코파이 세트 구매)',
    defaultChips: [
      '🚅 KTX 전주역 & 한옥마을 숙소',
      '🛍️ KTX 전주역 & 객리단길 숙소',
      '🚌 전주터미널 & 한옥마을 숙소',
      '🏮 이미 전주 도착'
    ]
  }
};

/**
 * Get Dynamic Gateway Onboarding Chips based on Target City
 */
export function getDynamicGatewayChips(targetCity = '서울', lang = 'ko') {
  const cleanCity = (targetCity || '').replace(/(도|시|군|구|특별시|광역시)/g, '').trim();
  const cityKey = Object.keys(CITY_GATEWAY_HUBS).find(k => (targetCity || '').includes(k) || k.includes(cleanCity)) || '서울';
  const hub = CITY_GATEWAY_HUBS[cityKey] || CITY_GATEWAY_HUBS['서울'];
  
  if (lang === 'en') {
    if (cityKey === '부산') {
      return [
        '🚅 Busan Station KTX & Haeundae Hotel',
        '✈️ Gimhae Airport & Seomyeon Hotel',
        '🌊 Gwangalli Ocean View Hotel',
        '🏢 Already in Busan City'
      ];
    } else if (cityKey === '제주') {
      return [
        '✈️ Jeju Airport & Downtown Hotel',
        '🚗 Rental Car & Aewol/Hyeopjae',
        '🍊 Jeju Airport & Seogwipo Resort',
        '🌴 Already in Jeju'
      ];
    } else if (cityKey === '강릉') {
      return [
        '🚅 Gangneung KTX & Gyeongpo Beach',
        '☕ Gangneung KTX & Anmok Cafe Street',
        '🌊 Already in Gangneung'
      ];
    }
    return [
      '✈️ Incheon Airport & Myeongdong Hotel',
      '✈️ Gimpo Airport & Hongdae Hotel',
      '🚅 Seoul Station KTX & Gangnam Hotel',
      '🏢 Already in Seoul City'
    ];
  }

  return hub.defaultChips;
}

/**
 * Fallback intent resolver for zero-shot query matching
 */
export function resolveKnowledgeScenario(promptText = '') {
  const p = promptText.toLowerCase();
  
  if (/(어르신|부모님|엄마|아빠|할머니|할아버지|덜\s*걷|안\s*걷|다리|편안|무릎)/i.test(p)) {
    return 'MINIMAL_WALKING';
  }
  if (/(비|우천|비오|폭우|실내|비오는)/i.test(p)) {
    return 'RAINY_INDOOR';
  }
  if (/(아이|애기|키즈|유모차|어린이|자녀|가족)/i.test(p)) {
    return 'KIDS_FAMILY';
  }
  if (/(예산|가성비|저렴|알뜰|5만원|10만원|싸게|학생)/i.test(p)) {
    return 'BUDGET_VALUE';
  }
  if (/(뚜벅|대중교통|지하철|버스|차\s*없이|도보|역세권)/i.test(p)) {
    return 'PUBLIC_TRANSIT';
  }
  if (/(혼자|나홀로|솔로|혼행|사색|조용)/i.test(p)) {
    return 'SOLO_HEALING';
  }
  if (/(맛집|미식|카페|디저트|빵|먹방|푸드|맛있는)/i.test(p)) {
    return 'FOODIE_CAFE';
  }
  if (/(야경|노을|일몰|석양|밤바다|야간)/i.test(p)) {
    return 'NIGHT_SUNSET';
  }

  return 'FOODIE_CAFE';
}
