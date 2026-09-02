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

import { getCityLocalKnowledge as getVaultCityLocalKnowledge, CITY_LOCAL_KNOWLEDGE as VAULT_CITY_LOCAL_KNOWLEDGE } from './voraQnaVault.js';

// ==============================================================================
// 1. SUPPLEMENTAL_CITY_LOCAL_KNOWLEDGE (괴산, 제천 등 지자체 지식 확장 등록)
// ==============================================================================
export const SUPPLEMENTAL_CITY_LOCAL_KNOWLEDGE = {
  '괴산': {
    nameKo: '괴산',
    nameEn: 'Goesan',
    badge: '청정 힐링 숲·계곡',
    description: '수려한 괴산호 풍경을 따라 걷는 산막이옛길과 화양구곡, 맑은 속리산 푸른 숲을 품은 충북 대표 자연 힐링 도시',
    signatureHighlights: ['산막이옛길', '화양구곡', '괴산자연드림파크', '쌍곡계곡', '각연사'],
    rainyHotspots: ['괴산자연드림파크', '괴산한지체험박물관', '괴산농업역사박물관'],
    walkingMinimized: ['괴산호 유람선', '산막이옛길 연리지쉼터', '괴산자연드림파크 힐링센터'],
    localFoodieSecret: '괴산 올갱이해장국(다슬기국), 쫀득한 고추순대, 버섯전골과 괴산 대학찰옥수수',
    nightHighlights: ['괴산호 수변산책로 야경', '산막이옛길 달빛 쉼터', '괴산읍 수변공원'],
    transitTip: '괴산시외버스터미널에서 산막이옛길 및 화양동 방면 군내버스 운행 (자차/렌터카 드라이브 권장)'
  },
  '제천': {
    nameKo: '제천',
    nameEn: 'Jecheon',
    badge: '비단 호수 & 한방 힐링',
    description: '청풍호반의 비경을 내려다보는 케이블카와 삼한시대 수리시설 의림지, 옥순봉 출렁다리가 어우러진 내륙의 바다 휴양지',
    signatureHighlights: ['청풍호반케이블카', '의림지', '옥순봉출렁다리', '청풍문화재단지', '비봉산전망대', '박달재'],
    rainyHotspots: ['제천한방엑스포공원', '의림지역사박물관', '청풍호반케이블카 실내전망대'],
    walkingMinimized: ['청풍호반케이블카(비봉산 정상)', '청풍호 유람선', '의림지 수변 데크길'],
    localFoodieSecret: '제천 명물 빨간오뎅, 건강한 약채락 비빔밥, 곤드레밥과 의림지 막국수',
    nightHighlights: ['의림지 인공폭포 미디어파사드 야경', '청풍호반 야간 조명산책로', '비봉산 일몰 조망'],
    transitTip: 'KTX-이음 제천역에서 청풍호 방면 시내버스 탑승 또는 청풍호 시티투어 버스 활용 추천'
  }
};

export function getCityLocalKnowledge() {
  const vaultKnowledge = getVaultCityLocalKnowledge() || {};
  return { ...vaultKnowledge, ...SUPPLEMENTAL_CITY_LOCAL_KNOWLEDGE };
}

export const CITY_LOCAL_KNOWLEDGE = new Proxy({}, {
  get(target, prop) {
    const allKnowledge = getCityLocalKnowledge();
    if (prop === 'keys' || prop === Symbol.iterator) return Object.keys(allKnowledge);
    return allKnowledge[prop];
  },
  has(target, prop) {
    const allKnowledge = getCityLocalKnowledge();
    return prop in allKnowledge;
  },
  ownKeys(target) {
    const allKnowledge = getCityLocalKnowledge();
    return Object.keys(allKnowledge);
  },
  getOwnPropertyDescriptor(target, prop) {
    const allKnowledge = getCityLocalKnowledge();
    if (prop in allKnowledge) {
      return { enumerable: true, configurable: true, value: allKnowledge[prop] };
    }
    return undefined;
  }
});

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
  '전주': { signature: '전주 콩나물국밥(수란 세트) & 전주 전통비빔밥', tip: '한옥마을 전주비빔빵 & 달콤 쌉싸름한 모주 한잔' },
  '괴산': { signature: '괴산 올갱이해장국(다슬기국) & 쫀득한 고추순대 + 버섯전골', tip: '산막이옛길 트레킹 후 올갱이국 한 그릇과 대학찰옥수수 간식 페어링' },
  '제천': { signature: '제천 명물 매콤 빨간오뎅 & 약채락 약선비빔밥 + 곤드레나물밥', tip: '청풍호반케이블카 관람 후 의림지 막국수와 빨간오뎅 분식 페어링' }
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

  // 🌟 [대한민국 대표 도시별 N일 코스 시그니처 지식 즉시 응답]
  const isCityTripPlan = /(제주|서울|부산|경주|강릉|속초|전주|여수|수원|통영|거제|포항|인천|안동|춘천|대구|대전|광주)/i.test(clean) &&
                         /(\d+\s*일|\d+\s*박\s*\d+\s*일|\d+\s*박|당일치기|코스|여행|추천|일정|가볼만한)/i.test(clean);
  if (isCityTripPlan) {
    const isJeju = /(제주|jeju)/i.test(clean);
    const isSeoul = /(서울|seoul)/i.test(clean);
    const isBusan = /(부산|busan)/i.test(clean);
    const isGyeongju = /(경주|gyeongju)/i.test(clean);
    const isGangneung = /(강릉|속초|gangneung|sokcho)/i.test(clean);
    const isJeonju = /(전주|jeonju)/i.test(clean);
    const isYeosu = /(여수|yeosu)/i.test(clean);
    const isSuwon = /(수원|suwon)/i.test(clean);
    const isTongyeong = /(통영|거제|tongyeong|geoje)/i.test(clean);

    if (isJeju) {
      return {
        matchedKey: 'JEJU_SIGNATURE_COURSE',
        reply: `**제주도 여행**은 **1일차 동부(성산일출봉 & 우도 산호해변), 2일차 남부(서귀포 올레시장 & 천지연폭포), 3일차 서부(협재해수욕장 & 애월 한담해변 카페거리)**로 순환하는 것이 가장 완벽한 황금 동선입니다! 🌴🌊✨`,
        followUp: '성산일출봉과 협재 바다를 담은 제주 맞춤 코스로 잡아드릴까요? 🍊🌊',
        isTikitaka: true
      };
    } else if (isSeoul) {
      return {
        matchedKey: 'SEOUL_SIGNATURE_COURSE',
        reply: `**서울 여행**은 **1일차 전통 문화(경복궁·북촌한옥마을·인사동), 2일차 랜드마크 & 쇼핑(N서울타워·명동·성수동 팝업), 3일차 트렌드 & 힐링(DDP·여의도 한강공원)**이 핵심 황금 코스입니다! 👑🗼✨`,
        followUp: '경복궁과 N서울타워 파노라마를 담은 서울 맞춤 코스로 잡아드릴까요? 🏙️✨',
        isTikitaka: true
      };
    } else if (isBusan) {
      return {
        matchedKey: 'BUSAN_SIGNATURE_COURSE',
        reply: `**부산 여행**은 **1일차 오션 & 액티비티(해운대 블루라인파크 스카이캡슐·해동용궁사), 2일차 낭만 야경(광안대교 드론쇼 & 해변 산책), 3일차 감성 골목(영도 흰여울문화마을 & 감천문화마을·자갈치시장)**이 최고의 황금 루트입니다! 🌊🚡✨`,
        followUp: '스카이캡슐과 광안대교 선셋 뷰를 담은 부산 맞춤 코스로 잡아드릴까요? 🌊✨',
        isTikitaka: true
      };
    } else if (isGyeongju) {
      return {
        matchedKey: 'GYEONGJU_SIGNATURE_COURSE',
        reply: `천년고도 **경주 여행**은 **1일차 핫플 & 역사(황리단길 감성 카페·대릉원·첨성대·동궁과 월지 반영 야경), 2일차 세계문화유산(불국사 & 석굴암 힐링 산책)**이 가장 완벽한 코스입니다! 🏯🌙✨`,
        followUp: '황리단길 감성과 환상적인 달빛 야경을 담은 경주 맞춤 코스로 잡아드릴까요? 🏯✨',
        isTikitaka: true
      };
    } else if (isGangneung) {
      return {
        matchedKey: 'GANGNEUNG_SIGNATURE_COURSE',
        reply: `청정 동해 **강릉·속초 여행**은 **1일차 바다 감성(안목 커피거리 & 강문해변·BTS 버스정류장), 2일차 힐링 & 명산(설악산 권금성 케이블카 & 속초 중앙시장 닭강정)**이 대표 코스입니다! ☕🌲🌊`,
        followUp: '푸른 동해 파도와 설악산 절경을 담은 강릉·속초 맞춤 코스로 잡아드릴까요? 🌊✨',
        isTikitaka: true
      };
    } else if (isJeonju) {
      return {
        matchedKey: 'JEONJU_SIGNATURE_COURSE',
        reply: `맛과 멋의 고장 **전주 여행**은 **1일차 한옥 감성(전주한옥마을 한복 체험·경기전·전동성당·오목대 전망), 2일차 미식 & 골목(남부시장 야시장 피순대·자만벽화마을)**이 핵심입니다! 🍱🏮✨`,
        followUp: '고즈넉한 한옥 골목과 전통 미식을 담은 전주 맞춤 코스로 잡아드릴까요? 🏮✨',
        isTikitaka: true
      };
    } else if (isYeosu) {
      return {
        matchedKey: 'YEOSU_SIGNATURE_COURSE',
        reply: `낭만 바다 **여수 여행**은 **1일차 해상 파노라마(여수 해상케이블카·오동도 동백섬·돌산대교 낭만포차 밤바다), 2일차 일출 & 비경(향일암 바위 절벽 사찰 & 아쿠아플라넷)**이 최고의 코스입니다! 🚢🌙✨`,
        followUp: '해상케이블카와 여수 밤바다를 담은 여수 맞춤 코스로 잡아드릴까요? 🌊✨',
        isTikitaka: true
      };
    } else if (isSuwon) {
      return {
        matchedKey: 'SUWON_SIGNATURE_COURSE',
        reply: `세계문화유산 **수원 여행**은 **수원화성 성곽길 트레킹 & 화성행궁, 방화수류정 노을 피크닉, 그리고 행궁동 감성 공방 & 카페거리**가 당일 및 1박 2일 필수 코스입니다! 🏹🏰✨`,
        followUp: '수원화성 야경과 행궁동 감성 카페를 담은 수원 맞춤 코스로 잡아드릴까요? 🏰✨',
        isTikitaka: true
      };
    } else if (isTongyeong) {
      return {
        matchedKey: 'TONGYEONG_SIGNATURE_COURSE',
        reply: `한국의 나폴리 **통영·거제 여행**은 **1일차 예술 & 항구(동피랑 벽화마을·중앙시장 충무김밥·통영 케이블카), 2일차 섬 & 바다(사량도 옥녀봉 출렁다리 또는 거제 바람의언덕·외도 보타니아)**가 황금 루트입니다! 🚡🏝️✨`,
        followUp: '통영의 에메랄드 바다와 힐링 섬 투어를 담은 맞춤 코스로 잡아드릴까요? 🏝️✨',
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
    
    const seasonLabel = isRain ? '우천 ' : (currentSeason ? `${currentSeason} ` : '');
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
