/**
 * VORA AI Master Q&A Knowledge Vault (보라 대용량 핵심 지식 데이터베이스)
 * 
 * Production-Grade Knowledge Base distilled from Gemini 2.5 Flash.
 * Categorized into 10 Major Travel Domains with 300+ Question Variations.
 * Supports dynamic slot interpolation: {city}, {season}, {gateway}, {hotel} with Korean particle formatting!
 */

export const VORA_QNA_VAULT = [
  // =========================================================================
  // 1. 패션 & 사계절 날씨 & 우천/폭염/한파 (FASHION_WEATHER)
  // =========================================================================
  {
    id: "qna_fashion_winter",
    category: "FASHION_WEATHER",
    targetCity: "all",
    season: "winter",
    questionVariations: [
      "겨울복장은?",
      "겨울에 갈건데 옷은 뭘 입고 가지",
      "겨울 옷차림",
      "겨울에 뭐 입어",
      "겨울 패션",
      "패딩 입어야 돼",
      "겨울 복장",
      "겨울에 갈건데 복장은 뭘 입지",
      "겨울 옷 어떻게 입지",
      "겨울에 날씨 추워?",
      "한파 옷차림",
      "12월 옷차림",
      "1월 패션",
      "2월에 뭐 입지"
    ],
    intentKeywords: ["겨울", "복장", "옷", "패션", "코디", "패딩", "추위", "추워", "외투", "코트", "따뜻", "12월", "1월", "2월", "한파"],
    geminiAnswer: {
      ko: "**{city:은/는}** 겨울철 체감온도가 낮고 바람이 불 수 있어 보온성 높은 롱패딩이나 울 코트에 목도리, 기모 이너웨어를 레이어드하는 따뜻한 룩을 추천드려요! 🧣❄️\n\n💡 **추천 꿀아이템**: 붙이는 핫팩, 스마트폰 터치 장갑, 보온 텀블러",
      en: "For winter in **{city}**, temperatures can drop with brisk winds. We recommend layering with a warm padded coat, thermal wear, and a scarf! 🧣❄️\n\n💡 **Must-haves**: Hand warmers, gloves, cozy scarf"
    },
    followUp: "{city:으로/로} 떠나실 때 가고 싶으신 명소나 따뜻한 실내 코스를 잡아드릴까요? ☕❄️",
    suggestedChips: ["☀️ 오전 도착", "🌤️ 오후 도착", "☕ 따뜻한 실내 카페 투어", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_fashion_spring",
    category: "FASHION_WEATHER",
    targetCity: "all",
    season: "spring",
    questionVariations: [
      "봄에 복장은?",
      "봄 옷차림",
      "봄에 뭐 입고 가",
      "봄 패션",
      "봄에는 어떻게 입어",
      "봄옷 어떻게 입지",
      "벚꽃 여행 옷차림",
      "3월 옷차림",
      "4월 옷차림",
      "5월에 뭐 입지"
    ],
    intentKeywords: ["봄", "복장", "옷", "패션", "코디", "자켓", "트렌치", "가디건", "벚꽃", "봄옷", "3월", "4월", "5월"],
    geminiAnswer: {
      ko: "**{city:은/는}** 화사한 봄철 낮에는 포근하지만 아침저녁 일교차가 있으니, 니트나 셔츠 위에 트렌치코트, 자켓, 가디건을 걸치는 산뜻한 레이어드 룩이 사진 찍기에 가장 예쁩니다 🧥🌸\n\n💡 **추천 꿀아이템**: 가벼운 겉옷, 편안한 워킹 스니커즈, 자외선 차단제",
      en: "Spring in **{city}** is wonderfully pleasant! Since mornings and evenings can be breezy, layering a light trench coat, blazer, or cardigan over shirts is perfect for stylish photos! 🧥🌸\n\n💡 **Must-haves**: Light jacket, walking sneakers, sunscreen"
    },
    followUp: "화창한 날씨에 딱 맞는 **{city}** 인생샷 야외 산책 & 감성 카페 코스로 잡아드릴까요? 🌸📸",
    suggestedChips: ["🌸 벚꽃 & 꽃길 산책 코스", "☕ 감성 카페 & 디저트 투어", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_fashion_summer",
    category: "FASHION_WEATHER",
    targetCity: "all",
    season: "summer",
    questionVariations: [
      "여름 복장은?",
      "여름 옷차림",
      "여름에 뭐 입지",
      "여름 패션",
      "더운데 어떻게 입어",
      "여름옷 추천",
      "폭염 옷차림",
      "6월 옷차림",
      "7월 옷차림",
      "8월에 뭐 입지"
    ],
    intentKeywords: ["여름", "복장", "옷", "패션", "더워", "더위", "폭염", "반팔", "린넨", "원피스", "시원", "6월", "7월", "8월"],
    geminiAnswer: {
      ko: "**{city:은/는}** 여름철 기온과 습도가 높으니 통기성 좋은 린넨 셔츠, 반팔 티셔츠, 쾌적한 원피스를 추천드려요! 실내 에어컨 냉방에 대비해 얇은 린넨 가디건이나 셔츠를 챙기시면 좋습니다 🌊🕶️\n\n💡 **추천 꿀아이템**: 휴대용 선풍기, 양우산, 선글라스, 냉감 쿨패치",
      en: "Summer in **{city}** is warm and sunny! Breathable linen shirts, lightweight dresses, and comfortable sandals are ideal. Keep a light shirt handy for air-conditioned indoor spots! 🌊🕶️\n\n💡 **Must-haves**: Mini handheld fan, UV umbrella, sunglasses"
    },
    followUp: "더위를 식혀줄 시원한 **{city}** 오션뷰 & 쾌적한 실내 명소 코스로 잡아드릴까요? 🌊🏖️",
    suggestedChips: ["🌊 시원한 바다 & 오션뷰 코스", "🏛️ 쾌적한 실내 미디어아트", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_fashion_autumn",
    category: "FASHION_WEATHER",
    targetCity: "all",
    season: "autumn",
    questionVariations: [
      "가을 복장은?",
      "가을 옷차림",
      "가을에 뭐 입어",
      "가을 패션",
      "단풍 여행 옷차림",
      "가을옷 추천",
      "9월 옷차림",
      "10월 옷차림",
      "11월에 뭐 입지"
    ],
    intentKeywords: ["가을", "복장", "옷", "패션", "코디", "단풍", "트렌치", "자켓", "선선", "가을옷", "9월", "10월", "11월"],
    geminiAnswer: {
      ko: "**{city:은/는}** 청명하고 선선한 가을 날씨로 여행하기 가장 좋습니다! 니트나 맨투맨 위에 가죽 자켓, 블레이저, 트렌치코트를 매치하면 분위기 있는 가을 감성룩이 완성됩니다 🍂🧥\n\n💡 **추천 꿀아이템**: 편안한 워킹화, 보습 립밤, 감성 스카프",
      en: "Autumn in **{city}** offers crystal-clear skies and crisp breezes! Pairing cozy knits with trench coats, leather jackets, or blazers gives you the best autumn travel look 🍂🧥\n\n💡 **Must-haves**: Walking shoes, lip balm, light scarf"
    },
    followUp: "붉은 단풍과 고즈넉한 정취를 만끽할 수 있는 **{city}** 힐링 코스로 잡아드릴까요? 🍁✨",
    suggestedChips: ["🍁 단풍 & 고궁 힐링 산책", "☕ 가을 감성 로컬 카페", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_weather_rainy",
    category: "FASHION_WEATHER",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "비 올 때 복장은?",
      "비 오는 날 옷차림",
      "비 올 때 뭐 입지",
      "우천 시 코디",
      "비 오는데 어디 가?",
      "비 올 때 실내 갈만한 곳",
      "비 오는 날 데이트 코스",
      "장마철 여행"
    ],
    intentKeywords: ["비", "우천", "비오", "폭우", "우산", "장마", "레인", "방수", "실내", "실내명소"],
    geminiAnswer: {
      ko: "**{city:은/는}** 비 오는 날에는 젖기 쉬운 긴 바지 대신 롤업 가능한 팬츠나 숏팬츠, 방수 겉옷을 입으시고, 레인부츠나 방수 스니커즈를 착용하시는 것이 쾌적합니다 ☔🌧️\n\n💡 **추천 꿀아이템**: 가벼운 3단 우산, 방수 신발 커버, 여분의 양말",
      en: "On rainy days in **{city}**, lightweight water-repellent jackets and comfortable non-slip footwear or short boots will keep you dry and comfortable! ☔🌧️\n\n💡 **Must-haves**: Compact umbrella, water-resistant shoes"
    },
    followUp: "비 한 방울 안 맞는 몰입형 대형 미디어아트 & 아쿠아리움·오션뷰 카페 코스로 잡아드릴까요? ☔🏛️",
    suggestedChips: ["🏛️ 실내 미디어아트 & 아쿠아리움", "☕ 빗소리 감성 카페 & 빈대떡", "🚀 바로 일정 만들기"]
  },

  // =========================================================================
  // 2. 교통 & 관문 & 짐보관 & 패스권 (TRANSPORT_GATEWAY)
  // =========================================================================
  {
    id: "qna_transport_luggage_drop",
    category: "TRANSPORT_GATEWAY",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "공항 도착해서 짐은 어디에 맡겨?",
      "짐 보관 어디서 해?",
      "캐리어 보관소 있어?",
      "숙소 체크인 전에 짐 맡길 수 있어?",
      "공항 짐 배송 서비스 있어?",
      "서울역 짐 보관",
      "부산역 짐 보관",
      "물품보관함 어디 있어"
    ],
    intentKeywords: ["짐", "캐리어", "보관", "라커", "맡기", "체크인전", "짐보관", "러기지", "배송", "물품보관함"],
    geminiAnswer: {
      ko: "대부분의 한국 호텔은 체크인 전/후에 무료로 짐을 보관해 줍니다! 또한 주요 KTX역(서울역, 부산역 등)과 지하철역 물품보관함(T-Locker), 공항에서 숙소로 캐리어를 당일 배송해 주는 '트립백(TripBAG) / 짐캐리(ZimCarry)' 서비스를 이용하시면 두 손 가볍게 여행을 시작하실 수 있어요! 🧳✨",
      en: "Most hotels in Korea offer free luggage storage before check-in and after check-out! You can also use station lockers (T-Locker) at major subway/KTX stations, or same-day luggage delivery services (ZimCarry / TripBAG) from airports straight to your hotel! 🧳✨"
    },
    followUp: "**{city}** 도착 직후 짐을 가볍게 맡기고 바로 시작할 수 있는 첫날 오후 코스를 준비해 드릴까요? ✈️🏨",
    suggestedChips: ["☀️ 오전 도착 후 짐보관 코스", "🌤️ 오후 도착 체크인 코스", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_transport_tmoney_climate",
    category: "TRANSPORT_GATEWAY",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "티머니 카드 어디서 사?",
      "교통카드 어떻게 사?",
      "기후동행카드랑 티머니 차이가 뭐야?",
      "외국인 교통카드 추천",
      "지하철 버스 카드 충전",
      "기후동행카드 외국인권",
      "와우패스 교통카드 돼?"
    ],
    intentKeywords: ["티머니", "교통카드", "기후동행", "기후동행카드", "버스카드", "지하철카드", "tmoney", "충전", "편의점", "와우패스"],
    geminiAnswer: {
      ko: "T-Money 카드는 편의점(CU, GS25, 세븐일레븐)과 지하철역에서 3,000~4,000원에 구매 후 현금 충전하여 전국 대중교통에 쓸 수 있습니다! 서울 시내를 집중 여행하신다면 서울 지하철/버스를 무제한 타는 **'기후동행카드(외국인 단기권: 1일/2일/3일/5일권)'**나 환전+교통카드 일체형 **'와우패스(WOWPASS)'**를 강력 추천드려요! 💳🚌",
      en: "T-Money cards are available at all convenience stores for ~₩4,000 and work nationwide. For intensive Seoul exploration, get the unlimited **'Climate Card Short-Term Tourist Pass (1/2/3/5 Days)'** or the all-in-one **'WOWPASS'** card! 💳🚌"
    },
    followUp: "대중교통으로 환승 없이 가장 편하게 이동할 수 있는 **{city}** 알짜 코스로 잡아드릴까요? 🚅✨",
    suggestedChips: ["🚅 지하철/대중교통 최적 코스", "🚶 덜 걷는 도보 친화 코스", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_transport_taxi_uber",
    category: "TRANSPORT_GATEWAY",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "카카오택시 외국인 카드 돼?",
      "택시 부를 때 우버 돼?",
      "한국에서 우버 쓸 수 있어?",
      "택시 결제 해외카드",
      "택시 어떻게 불러",
      "심야 택시 잡는 법"
    ],
    intentKeywords: ["택시", "카카오택시", "우버", "uber", "kakaotaxi", "해외카드", "신용카드", "호출", "택시비"],
    geminiAnswer: {
      ko: "한국에서는 글로벌 **Uber(UT) 앱**을 그대로 켜서 등록된 해외 카드로 손쉽게 택시를 부르실 수 있습니다! 또한 **Kakao T** 앱의 영문/외국인 버전에서도 해외 카드가 지원되며, 길거리 일반 택시에서도 해외 비자/마스터 카드로 직접 결제가 가능합니다 🚕💳",
      en: "You can simply open your global **Uber app** in Korea to hail taxis with your overseas credit card! **Kakao T** also supports international cards, and all street taxis accept international Visa/Mastercard directly inside the car 🚕💳"
    },
    followUp: "택시나 대중교통으로 15분 내외로 쾌적하게 닿는 **{city}** 핫플 코스로 잡아드릴까요? ✨",
    suggestedChips: ["🚕 이동 편한 최적 동선", "👑 대표 시그니처 랜드마크", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_transport_arex_airport",
    category: "TRANSPORT_GATEWAY",
    targetCity: "서울",
    season: "all",
    questionVariations: [
      "인천공항에서 서울역 어떻게 가?",
      "공항철도 직통열차 예매",
      "AREX 직통열차 일반열차 차이",
      "공항철도 타는 법",
      "인천공항 공항버스 리무진"
    ],
    intentKeywords: ["인천공항", "공항철도", "arex", "직통열차", "서울역", "공항버스", "리무진", "인천공항에서"],
    geminiAnswer: {
      ko: "인천공항에서 서울역으로 가는 가장 빠른 방법은 **AREX 공항철도 직통열차(Express Train)**로, 무정차로 단 43분 만에 서울역에 도착합니다(지정좌석제, 약 11,000원)! 짐이 많고 호텔 앞까지 편하게 가시려면 주요 호텔 문 앞까지 가는 **공항 리무진 버스(약 17,000~18,000원)**를 추천드려요 🚄🚌",
      en: "The fastest route from Incheon Airport to Seoul Station is the **AREX Express Train (non-stop in 43 mins, ~₩11,000)**! If carrying heavy luggage, Airport Limousine Buses offer direct door-to-door comfort to major hotel districts (~₩18,000) 🚄🚌"
    },
    followUp: "서울역 도착 후 짐을 풀고 바로 시작하는 첫날 오후 서울 시그니처 코스를 잡아드릴까요? 👑✨",
    suggestedChips: ["👑 서울역 출발 하이라이트 코스", "☕ 성수동/홍대 감성 투어", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_transport_korail_pass",
    category: "TRANSPORT_GATEWAY",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "코레일 패스 살만해?",
      "KTX 외국인 할인 패스",
      "코레일패스 예약 방법",
      "KTX 타고 지방 여행",
      "서울에서 부산 KTX 시간"
    ],
    intentKeywords: ["코레일", "코레일패스", "korail", "ktx", "기차", "패스", "지방여행", "부산행"],
    geminiAnswer: {
      ko: "서울-부산, 서울-강릉, 서울-경주 등 2~3개 도시를 KTX로 연계 여행하신다면 외국인 전용 무제한 기차 탑승권인 **'KORAIL PASS(코레일 패스 2일/3일/5일권)'**가 KTX 개별 편도권보다 훨씬 경제적입니다! 코레일 공식 영문 홈페이지나 클룩(Klook)에서 손쉽게 예약하실 수 있어요 🚅🎫",
      en: "If traveling between multi-cities like Seoul ➔ Busan ➔ Gyeongju by KTX, the foreigner-exclusive **KORAIL PASS (2/3/5 Day Passes)** offers huge savings compared to buying single KTX tickets! 🚅🎫"
    },
    followUp: "KTX 역에서 내리자마자 바로 닿는 **{city}** 알짜 역세권 힐링 코스로 잡아드릴까요? 🚅✨",
    suggestedChips: ["🚅 KTX 역세권 핵심 코스", "🌊 오션뷰 힐링 코스", "🚀 바로 일정 만들기"]
  },

  // =========================================================================
  // 3. 전국 주요 도시별 킬러 명소 & 로컬 지식 (CITY_KNOWLEDGE)
  // =========================================================================
  {
    id: "qna_city_geoje",
    category: "CITY_KNOWLEDGE",
    targetCity: "거제",
    season: "all",
    questionVariations: [
      "거제도 가면 어디 가야 돼?",
      "거제 대표 관광지",
      "거제도 가볼만한 곳",
      "거제 2박3일 코스",
      "바람의 언덕 매미성 외도",
      "거제도 추천 코스"
    ],
    intentKeywords: ["거제", "거제도", "바람의언덕", "매미성", "외도", "정글돔", "신선대", "구조라", "몽돌", "관광지", "명소"],
    geminiAnswer: {
      ko: "거제의 핵심 4대 명소는 **탁 트인 에메랄드빛 오션뷰 '바람의 언덕'과 '신선대', 유럽 중세 성 같은 인생샷 성지 '매미성', 이국적인 해상식물원 '외도 보타니아', 사계절 온실 돔 '거제 정글돔'**입니다! 청정 남해 바다와 몽돌 해변의 파도 소리를 들으며 힐링하기에 완벽한 섬이에요 🌊🏰🌿",
      en: "Geoje's top highlights include the breezy **Windy Hill & Sinseondae Cliff**, the European fortress-style photo gem **Maemi Castle**, the exotic botanical paradise **Oedo Botania Island**, and the glass-domed **Geoje Jungle Dome**! 🌊🏰🌿"
    },
    followUp: "남해 오션뷰와 이국적인 포토존을 완벽한 동선으로 엮은 **거제 맞춤 코스**로 잡아드릴까요? 🌊📸",
    suggestedChips: ["🏰 거제 인생샷 & 핫플 투어", "🌿 외도 & 몽돌해변 힐링 코스", "🚀 바로 거제 일정표 만들기"]
  },
  {
    id: "qna_city_busan",
    category: "CITY_KNOWLEDGE",
    targetCity: "부산",
    season: "all",
    questionVariations: [
      "부산 가면 어디 가야 돼?",
      "부산 대표 관광지",
      "부산 가볼만한 곳",
      "부산 2박3일 코스",
      "해운대 광안리 흰여울 감천",
      "부산 여행 추천"
    ],
    intentKeywords: ["부산", "해운대", "광안리", "스카이캡슐", "블루라인파크", "흰여울", "감천문화마을", "자갈치", "명소", "관광지"],
    geminiAnswer: {
      ko: "부산의 필수 코스는 **해운대 블루라인파크 해변열차&스카이캡슐, 광안대교 야경과 드론쇼, 알록달록 언덕마을 '감천문화마을', 절벽 위 바다 산책로 '흰여울문화마을', 그리고 자갈치시장&남포동 비프광장**입니다! 바다와 화려한 도시 야경, 골목 감성을 모두 품은 최고의 여행지예요 🌊🗼🚡",
      en: "Busan's must-visits feature the **Haeundae Blueline Park Sky Capsule**, the sparkling **Gwangalli Bridge Drone Show**, the vibrant **Gamcheon Culture Village**, the cliffside **Huinnyeoul Culture Village**, and Jagalchi Fish Market! 🌊🗼🚡"
    },
    followUp: "스카이캡슐과 광안대교 선셋 뷰를 완벽하게 즐길 수 있는 **부산 맞춤 코스**로 잡아드릴까요? 🌊✨",
    suggestedChips: ["🚡 블루라인 스카이캡슐 & 해운대 코스", "🌉 광안리 선셋 & 야경 투어", "🚀 바로 부산 일정표 만들기"]
  },
  {
    id: "qna_city_jeju",
    category: "CITY_KNOWLEDGE",
    targetCity: "제주",
    season: "all",
    questionVariations: [
      "제주도 가면 어디 가야 돼?",
      "제주 대표 관광지",
      "제주 가볼만한 곳",
      "제주 3박4일 코스",
      "애월 함덕 서귀포 성산",
      "제주 여행 추천",
      "제주 렌트카 필수야?"
    ],
    intentKeywords: ["제주", "제주도", "애월", "성산일출봉", "협재", "함덕", "서귀포", "우도", "한라산", "명소", "관광지"],
    geminiAnswer: {
      ko: "제주는 서쪽(애월/한담해변/협재), 동쪽(성산일출봉/우도/함덕), 남쪽(서귀포 폭포/쇠소깍/중문)으로 나누어 도는 것이 정석입니다! 에메랄드빛 투명한 바다 카페 투어, 올레길 산책, 오름 일몰 감상까지 사계절 언제나 이국적인 낭만을 선사합니다 🌴🍊🌊",
      en: "Jeju is best explored by dividing into West (Aewol & Hyeopjae beaches), East (Seongsan Ilchulbong & Udo Island), and South (Seogwipo waterfalls & Jungmun)! 🌴🍊🌊"
    },
    followUp: "에메랄드 바다 드라이브와 힐링 카페가 가득한 **제주 맞춤 코스**로 잡아드릴까요? 🌴🍊",
    suggestedChips: ["🌊 애월 & 협재 서쪽 감성 드라이브", "⛰️ 성산일출봉 & 우도 동쪽 힐링", "🚀 바로 제주 일정표 만들기"]
  },
  {
    id: "qna_city_gyeongju",
    category: "CITY_KNOWLEDGE",
    targetCity: "경주",
    season: "all",
    questionVariations: [
      "경주 가면 어디 가야 돼?",
      "경주 대표 관광지",
      "경주 가볼만한 곳",
      "황리단길 첨성대 동궁과월지",
      "경주 1박2일 코스",
      "경주 불국사 석굴암"
    ],
    intentKeywords: ["경주", "황리단길", "첨성대", "동궁과월지", "안압지", "불국사", "석굴암", "대릉원", "명소"],
    geminiAnswer: {
      ko: "천년고도 경주는 **트렌디한 한옥 카페와 맛집이 가득한 '황리단길', 거대한 고분 뷰의 '대릉원', 밤이 되면 환상적인 반영 야경을 뽐내는 '동궁과 월지(안압지)'와 '첨성대', 세계문화유산 '불국사'**가 핵심입니다! 낮에는 고즈넉한 한옥 산책, 밤에는 황홀한 야경을 즐겨보세요 🏯🌙✨",
      en: "Gyeongju, the historic millennium capital, boasts the trendy hanok cafes of **Hwangnidan-gil**, ancient royal tombs at **Daereungwon**, the breathtaking night illumination at **Donggung Palace & Wolji Pond**, and UNESCO-listed **Bulguksa Temple**! 🏯🌙✨"
    },
    followUp: "황리단길 감성 카페와 환상적인 달빛 야경을 담은 **경주 맞춤 코스**로 잡아드릴까요? 🏯🌙",
    suggestedChips: ["🏯 황리단길 & 대릉원 감성 산책", "🌙 동궁과 월지 환상 야경 투어", "🚀 바로 경주 일정표 만들기"]
  },
  {
    id: "qna_city_gangneung",
    category: "CITY_KNOWLEDGE",
    targetCity: "강릉",
    season: "all",
    questionVariations: [
      "강릉 가면 어디 가야 돼?",
      "강릉 대표 관광지",
      "강릉 가볼만한 곳",
      "안목해변 커피거리 정동진",
      "강릉 1박2일 코스",
      "초당 순두부 마을"
    ],
    intentKeywords: ["강릉", "안목해변", "커피거리", "정동진", "경포대", "초당순두부", "아르떼뮤지엄", "명소", "강원도"],
    geminiAnswer: {
      ko: "KTX로 1시간 반이면 닿는 강릉은 **솔향 가득한 '경포해변', 바다를 보며 스페셜티 커피를 마시는 '안목 커피거리', 몰입형 빛의 전시 '아르떼뮤지엄 강릉', 고소한 '초당 순두부마을'과 동해 일출 명소 '정동진'**이 대표적입니다! 맑고 푸른 동해 바다 힐링 여행지로 최고예요 🌊☕🎨",
      en: "Just 1.5 hours from Seoul via KTX, Gangneung offers pine-fringed **Gyeongpo Beach**, oceanic cafe hopping at **Anmok Coffee Street**, mesmerizing media art at **Arte Museum Gangneung**, and savory Chodang Tofu Village! 🌊☕🎨"
    },
    followUp: "동해 바다 뷰와 스페셜티 커피를 즐기는 **강릉 감성 코스**로 잡아드릴까요? ☕🌊",
    suggestedChips: ["☕ 안목 커피거리 & 경포대 오션뷰", "🎨 아르떼뮤지엄 & 초당 순두부 미식", "🚀 바로 강릉 일정표 만들기"]
  },
  {
    id: "qna_city_suwon",
    category: "CITY_KNOWLEDGE",
    targetCity: "수원",
    season: "all",
    questionVariations: [
      "수원 가면 어디 가야 돼?",
      "수원 대표 관광지",
      "수원화성 행리단길",
      "수원 당일치기 코스",
      "수원 왕갈비 방화수류정"
    ],
    intentKeywords: ["수원", "수원화성", "행리단길", "방화수류정", "화성행궁", "수원갈비", "열기구", "플라잉수원"],
    geminiAnswer: {
      ko: "서울 근교 당일치기/1박2일 명소인 수원은 **세계문화유산 '수원화성 성곽길', 감성 피크닉과 연못 야경의 성지 '방화수류정', 한옥 골목과 힙한 카페가 즐비한 '행리단길', 그리고 달콤한 육즙의 '수원 왕갈비'**가 환상적입니다! 성곽 위로 뜨는 열기구 '플라잉수원'도 인생샷 명소예요 🏰🎈🥩",
      en: "Suwon, the gem near Seoul, features the UNESCO **Suwon Hwaseong Fortress walls**, scenic pond picnics at **Banghwasuryujeong**, trendy cafes along **Haengnidan-gil**, and world-famous Suwon King Ribs! 🏰🎈🥩"
    },
    followUp: "성곽길 노을 산책과 행리단길 힙한 카페를 엮은 **수원 코스**로 잡아드릴까요? 🏰☕",
    suggestedChips: ["🏰 수원화성 성곽길 & 방화수류정 피크닉", "☕ 행리단길 감성 카페 & 왕갈비 미식", "🚀 바로 수원 일정표 만들기"]
  },

  // =========================================================================
  // 4. 음식 & 로컬 미식 & 미식 페어링 (LOCAL_FOOD_PAIRING)
  // =========================================================================
  {
    id: "qna_food_geoje",
    category: "LOCAL_FOOD_PAIRING",
    targetCity: "거제",
    season: "all",
    questionVariations: [
      "거제도 가면 뭐 먹어야 돼?",
      "거제 대표 맛집 추천",
      "거제 특산물 음식",
      "거제도에서 회 말고 맛있는 거",
      "거제 현지인 맛집",
      "바람의 핫도그 몽돌빵"
    ],
    intentKeywords: ["거제", "음식", "맛집", "미식", "먹거리", "굴구이", "멍게비빔밥", "바람의핫도그", "해물뚝배기", "대구탕"],
    geminiAnswer: {
      ko: "거제에 오시면 **신선한 바다 향이 가득한 '멍게비빔밥'과 통통한 '거제 굴구이/굴코스', 얼큰하고 시원한 '해물뚝배기', 겨울철 시원한 '외포 대구탕'**은 필수입니다! 바다 산책 후 출출할 때 즐기는 달콤 고소한 '바람의 핫도그'와 '거제 몽돌빵'도 놓치지 마세요 🐟🤤\n\n💡 **추천 미식**: 멍게비빔밥, 해물뚝배기, 굴 코스요리, 바람의 핫도그",
      en: "In Geoje, must-try local specialties include fresh **Sea Squirt Bibimbap (Myeongae Bibimbap)**, juicy grilled oysters, rich spicy seafood stew (Haemul Ttukbaegi), and hearty winter Cod soup! Don't miss the famous 'Windy Hotdog' after coastal strolls! 🐟🤤"
    },
    followUp: "바다 전망과 함께 현지인 찐 로컬 맛집을 즐길 수 있는 **거제** 미식 코스로 잡아드릴까요? 🍴✨",
    suggestedChips: ["🍴 거제 로컬 해물 미식 투어", "☕ 오션뷰 베이커리 카페", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_food_busan",
    category: "LOCAL_FOOD_PAIRING",
    targetCity: "부산",
    season: "all",
    questionVariations: [
      "부산 가면 꼭 먹어야 하는 음식",
      "부산 대표 맛집",
      "부산 돼지국밥 밀면 어디서 먹어?",
      "부산 길거리 음식",
      "부산 미식 추천",
      "씨앗호떡 어묵"
    ],
    intentKeywords: ["부산", "돼지국밥", "밀면", "씨앗호떡", "활어회", "어묵", "맛집", "음식", "낙곱새", "조개구이"],
    geminiAnswer: {
      ko: "부산 미식의 정수는 **진하고 뽀얀 사골 육수의 '돼지국밥', 살얼음 동동 띄운 매콤달콤 '밀면', 매콤고소한 '낙곱새(낙지·곱창·새우)', 광안대교 뷰와 함께 즐기는 '제철 활어회', 남포동 명물 '씨앗호떡'과 탱글한 '부산 삼진어묵'**입니다! 🍲🐟\n\n💡 **추천 미식**: 수변공원 활어회, 남포동 씨앗호떡, 서면 돼지국밥 거리, 개미집 낙곱새",
      en: "Busan's food heaven features rich and comforting **Pork Soup (Dwaeji Gukbap)**, icy sweet & spicy **Milmyeon noodles**, sizzling **Nakgopse (octopus, tripe & shrimp)**, seaside sashimi by Gwangalli Bridge, and nutty Seed Hotteok! 🍲🐟"
    },
    followUp: "오션뷰와 로컬 노포 맛집을 황금 비율로 엮은 **부산** 미식 코스로 잡아드릴까요? 🍴🌊",
    suggestedChips: ["🍲 부산 대표 3대 미식 투어", "🍺 광안리 선셋 수제맥주 & 회", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_food_jeju",
    category: "LOCAL_FOOD_PAIRING",
    targetCity: "제주",
    season: "all",
    questionVariations: [
      "제주도 가면 꼭 먹어야 하는 음식",
      "제주 흑돼지 고기국수 맛집",
      "제주 갈치조림 딱새우회",
      "제주도 로컬 음식 추천",
      "제주 오메기떡 감귤 디저트"
    ],
    intentKeywords: ["제주", "흑돼지", "고기국수", "갈치조림", "딱새우", "전복", "오메기떡", "몸국", "맛집", "음식"],
    geminiAnswer: {
      ko: "제주 미식은 **육즙 가득한 숯불 '제주 흑돼지 구이', 뽀얗고 진한 육수의 '고기국수', 매콤달콤 양념이 밴 '통갈치조림/구이', 쫄깃한 '딱새우회'와 '전복돌솥밥'**이 대표적입니다! 디저트로는 달콤한 감귤 타르트와 쫀득한 오메기떡을 추천드려요 🥩🐟🍊",
      en: "Jeju's mouthwatering icons include thick juicy **Black Pork BBQ**, savory **Gogi Guksu (Pork Noodle Soup)**, whole braised **Silver Cutlassfish**, sweet raw Red Banded Lobster, and fragrant Citrus desserts! 🥩🐟🍊"
    },
    followUp: "바다 뷰 흑돼지 구이와 고기국수 맛집을 엮은 **제주 미식 코스**로 잡아드릴까요? 🍴🌴",
    suggestedChips: ["🥩 제주 흑돼지 & 딱새우 미식 투어", "🍊 오션뷰 감귤 카페 & 베이커리", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_food_non_spicy",
    category: "LOCAL_FOOD_PAIRING",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "매운 거 못 먹는데 안 매운 음식 있어?",
      "안 매운 한국 음식 추천",
      "외국인 안 매운 음식",
      "아이랑 먹을 안 매운 메뉴",
      "맵지 않은 전통 음식",
      "매운맛 없는 한식"
    ],
    intentKeywords: ["안 매운", "맵지 않", "매운거 못", "달콤", "불고기", "갈비탕", "삼계탕", "삼겹살", "비빔밥", "간장"],
    geminiAnswer: {
      ko: "한국에는 맵지 않고 깊은 풍미를 자랑하는 일품요리가 가득합니다! 달콤 짭조름한 **'궁중 소불고기'와 든든한 '갈비탕 & 맑은 설렁탕', 영양 만점 '삼계탕', 고소한 '한우 숯불갈비'와 노릇노릇 '해물파전/녹두빈대떡'**을 추천드려요! 비빔밥도 고추장 대신 간장 양념으로 맵지 않게 즐기실 수 있습니다 🥩🍲",
      en: "Korea has incredible non-spicy delicacies! We highly recommend savory sweet **Bulgogi beef**, hearty **Galbi-tang (beef short rib soup)**, nourishing **Samgye-tang (ginseng chicken soup)**, and crispy Seafood Pajeon pancakes! 🥩🍲"
    },
    followUp: "아이와 외국인 모두 편안하고 맛있게 즐길 수 있는 **{city}** 안 매운 프리미엄 미식 코스로 잡아드릴까요? 🍴✨",
    suggestedChips: ["🥩 궁중 불고기 & 갈비탕 한정식", "🍗 바삭한 치킨 & 전통 빈대떡", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_food_vegan_halal",
    category: "LOCAL_FOOD_PAIRING",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "채식주의자 식당 있어?",
      "한국 비건 식당 추천",
      "할랄 음식 어디서 먹어?",
      "채식 식당 찾는 법",
      "이태원 할랄 식당",
      "사찰음식 비건"
    ],
    intentKeywords: ["비건", "채식", "채식주의", "할랄", "halal", "vegan", "사찰음식", "두부", "산채비빔밥"],
    geminiAnswer: {
      ko: "한국에서는 **'사찰음식 전문점(발우공양 등)', 고소한 '손두부 보쌈/전골', 신선한 나물이 가득한 '산채비빔밥'**이 훌륭한 비건 식사가 됩니다! 서울 인사동과 성수동에 트렌디한 비건 카페&다이닝이 많으며, 이태원 우사단길에는 공식 무슬림 친화 인증 할랄 레스토랑이 집중되어 있습니다 🥗🌿✨",
      en: "For vegan/vegetarian dining in Korea, authentic **Temple Food cuisine**, handmade tofu hotpots, and mountain wild greens Bibimbap offer incredible plant-based dining! Itaewon area in Seoul also hosts a wide range of certified Halal restaurants 🥗🌿✨"
    },
    followUp: "건강하고 정갈한 사찰음식과 비건 친화 감성 다이닝을 포함한 **{city}** 힐링 코스로 잡아드릴까요? 🥗🌿",
    suggestedChips: ["🥗 정갈한 사찰음식 & 비건 다이닝", "☕ 오가닉 티 & 비건 디저트 카페", "🚀 바로 일정 만들기"]
  },

  // =========================================================================
  // 5. 동행자 맞춤 & 이동 편의 (COMPANION_STYLE)
  // =========================================================================
  {
    id: "qna_companion_kids",
    category: "COMPANION_STYLE",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "아이랑 가는데 어디가 좋아?",
      "유모차 끌고 가기 좋은 곳",
      "아이 동반 여행지 추천",
      "어린이 체험 코스",
      "키즈존 있는 곳",
      "아이 데리고 가기 편한 곳",
      "초등학생 가족 여행"
    ],
    intentKeywords: ["아이", "애기", "키즈", "유모차", "어린이", "가족", "자녀", "초등", "체험", "아쿠아리움"],
    geminiAnswer: {
      ko: "아이와 함께하는 여행은 **계단 없는 평지 산책로, 오감 자극 인터랙티브 체험관, 대형 아쿠아리움과 안전한 잔디마당**이 있는 장소가 최고입니다! 유모차 대여와 수유실이 잘 갖춰진 쾌적한 안심 명소 위주로 이동 동선을 촘촘하게 줄이는 것이 꿀팁이에요 👨‍👩‍👧‍👦🎈",
      en: "For traveling with kids or strollers, we focus on step-free wide promenades, hands-on interactive museums, expansive aquariums, and open parks with dedicated family amenities! 👨‍👩‍👧‍👦🎈"
    },
    followUp: "아이와 부모님 모두 체력 부담 없이 편안하게 즐길 수 있는 **{city}** 키즈 안심 코스로 잡아드릴까요? 🎈🌿",
    suggestedChips: ["🎈 키즈 체험 & 아쿠아리움", "🌿 유모차 편한 평지 공원", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_companion_parents",
    category: "COMPANION_STYLE",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "부모님 모시고 가는데 어디가 좋아?",
      "부모님 효도 관광",
      "어르신 모시고 갈만한 곳",
      "덜 걷고 계단 없는 코스",
      "할머니 할아버지 모시고 가기 좋은 곳",
      "시니어 여행 추천",
      "다리 아프신 부모님 여행"
    ],
    intentKeywords: ["부모님", "어르신", "할머니", "할아버지", "엄마", "아빠", "시니어", "효도", "덜 걷", "무릎", "계단", "다리아파"],
    geminiAnswer: {
      ko: "부모님과의 여행은 **가파른 계단이나 과도한 도보를 피하고, 케이블카나 유람선으로 수려한 경관을 감상하며 정갈한 보양 한식을 즐기는 여유로운 동선**이 가장 만족도가 높습니다! 중간중간 편안한 전망 카페에서 쉬어가는 힐링 타임을 넉넉히 배치해 드려요 😊🌿",
      en: "For traveling with parents or seniors, gentle step-free walking paths, scenic cable cars, relaxing cruise boats, and authentic nourishing Korean cuisine make the most memorable and comfortable journey! 😊🌿"
    },
    followUp: "계단 없이 편안한 케이블카 & 정갈한 한식 다이닝 위주의 **{city}** 효도 안심 코스로 잡아드릴까요? 🌿👑",
    suggestedChips: ["🌿 케이블카 & 평지 힐링 산책", "🍴 정갈한 보양 한정식", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_companion_solo",
    category: "COMPANION_STYLE",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "혼자 여행하는데 어디가 좋아?",
      "나홀로 여행 코스",
      "혼밥하기 좋은 곳",
      "혼행 추천",
      "조용하게 사색하기 좋은 곳",
      "혼자 힐링할 만한 곳",
      "여자 혼자 한국 여행"
    ],
    intentKeywords: ["혼자", "나홀로", "솔로", "혼행", "혼밥", "사색", "조용", "힐링", "혼자여행"],
    geminiAnswer: {
      ko: "혼자만의 여행은 **고즈넉한 돌담길 산책, 아늑한 감성 독립서점, 창밖 뷰가 예쁜 1인 친화적 브루잉 카페와 1인 식사가 편안한 바 형태의 로컬 맛집**들을 추천드려요! 한국은 치안이 매우 안전하여 늦은 밤 산책이나 나홀로 여행을 자유롭게 만끽하실 수 있습니다 🎧🌿",
      en: "Solo travel in Korea is exceptionally safe and inspiring! We recommend tranquil stone-wall walking paths, indie bookstores, specialty pour-over cafes, and cozy solo-friendly dining bars 🎧🌿"
    },
    followUp: "나만의 여유로운 쉼과 낭만을 만끽할 수 있는 **{city}** 나홀로 감성 코스로 잡아드릴까요? 🎧☕",
    suggestedChips: ["🎧 고즈넉한 산책 & 독립서점", "☕ 뷰 맛집 힐링 카페", "🚀 바로 일정 만들기"]
  },

  // =========================================================================
  // 6. 외국인 실전 꿀팁 & 문화 & 에티켓 (FOREIGNER_HACKS)
  // =========================================================================
  {
    id: "qna_hacks_esim_wifi",
    category: "FOREIGNER_HACKS",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "eSIM이랑 와이파이 도시락 중에 뭐가 좋아?",
      "한국 유심 추천",
      "인터넷 데이터 어떻게 해?",
      "한국 포켓와이파이",
      "esim 어떻게 사?",
      "한국 데이터 무제한"
    ],
    intentKeywords: ["esim", "유심", "와이파이", "포켓와이파이", "유심칩", "데이터", "인터넷"],
    geminiAnswer: {
      ko: "1~2인 여행객이시라면 실물 교체 없이 QR코드 스캔으로 즉시 개통되는 **'eSIM(이심)'**이 가장 가볍고 편리합니다! 만약 가족이나 3인 이상 동행이 여러 기기를 함께 연결하신다면 **'포켓와이파이(와이파이 도시락)'**를 공항에서 수령하시는 것이 가성비가 좋습니다 📱📶",
      en: "For solo or couple travelers, an **eSIM** activated via QR code is the most lightweight and convenient option! For families or groups sharing multiple devices, renting a **Pocket Wi-Fi** at the airport offers great value 📱📶"
    },
    followUp: "한국 여행을 가장 스마트하고 편하게 즐길 수 있는 **{city}** 알짜 코스를 잡아드릴까요? ✈️✨",
    suggestedChips: ["📱 여행 필수 꿀팁 & 명소 코스", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_hacks_tax_refund",
    category: "FOREIGNER_HACKS",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "텍스리펀 어떻게 받아?",
      "세금 환급 어디서 해?",
      "면세 쇼핑 팁",
      "Tax Refund 받는 법",
      "공항 세금 환급",
      "올리브영 면세 받는 법"
    ],
    intentKeywords: ["텍스리펀", "택스리펀", "tax refund", "세금환급", "면세", "환급", "올리브영 면세", "사후면세"],
    geminiAnswer: {
      ko: "한국의 주요 백화점, 올리브영, 대형 매장에서는 1회 15,000원 이상 구매 시 여권을 제시하시면 결제 즉시 세금이 차감되는 **'현장 즉시 환급(Immediate Tax Refund)'**을 받으실 수 있습니다! 일반 사후 환급 영수증은 출국 시 공항의 무인 텍스리펀 키오스크(Kiosk)에서 간편하게 현금이나 카드로 돌려받으실 수 있습니다 🛍️💳",
      en: "At major shops like Olive Young and department stores, presenting your passport for purchases over ₩15,000 gives you **Immediate Tax Refund** at the counter! For general receipts, simply scan them at airport Tax Refund kiosks before departure 🛍️💳"
    },
    followUp: "트렌디한 K-뷰티 쇼핑과 감성 핫플을 한 번에 즐기는 **{city}** 쇼핑 & 미식 코스로 잡아드릴까요? 🛍️☕",
    suggestedChips: ["🛍️ K-뷰티 & 패션 쇼핑 핫플", "☕ 감성 카페 & 디저트 투어", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_hacks_tip_culture",
    category: "FOREIGNER_HACKS",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "한국 식당에서 팁 줘야 돼?",
      "한국 팁 문화",
      "식당 물 반찬 무료야?",
      "한국 에티켓",
      "한국 계산 팁"
    ],
    intentKeywords: ["팁", "팁문화", "tip", "에티켓", "물 무료", "반찬 리필", "계산"],
    geminiAnswer: {
      ko: "한국에는 **팁(Tip) 문화가 전혀 없습니다!** 영수증에 적힌 음식 가격에 봉사료와 부가세가 모두 포함되어 있으니 적힌 금액만 결제하시면 됩니다! 또한 모든 식당에서 **시원한 식수와 기본 반찬(김치, 나물 등)이 무료로 무한 리필**되는 것도 한국만의 기분 좋은 문화예요 🍚💧✨",
      en: "There is **NO tipping culture in Korea!** The price on the menu already includes all taxes and services. Furthermore, drinking water and delicious side dishes (banchan like Kimchi) are complimentary and refillable for free at all Korean restaurants! 🍚💧✨"
    },
    followUp: "현지인들의 찐 인심을 느낄 수 있는 **{city}** 전통 시장 & 노포 맛집 코스로 잡아드릴까요? 🍲✨",
    suggestedChips: ["🍲 전통시장 길거리 미식 투어", "🍴 든든한 로컬 백반 맛집", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_hacks_voltage_plug",
    category: "FOREIGNER_HACKS",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "한국 전압 몇 볼트 써?",
      "돼지코 플러그 모양",
      "한국 콘센트 모양",
      "한국 전압 어댑터"
    ],
    intentKeywords: ["전압", "볼트", "돼지코", "플러그", "콘센트", "어댑터", "220v"],
    geminiAnswer: {
      ko: "한국의 표준 전압은 **220V, 60Hz**이며, 둥근 핀 2개 형태의 **C타입 또는 F타입 콘센트(유럽형과 유사)**를 사용합니다! 110V 전용 기기를 사용하시는 미국/일본 여행객께서는 멀티 어댑터(돼지코)를 챙겨오시거나 편의점/다이소에서 쉽게 구매하실 수 있습니다 🔌⚡",
      en: "Korea uses **220V, 60Hz** electrical supply with two round prongs (**Type C / Type F plugs**). Travelers from countries using 110V (USA, Japan) should bring a universal travel plug adapter, which can also be purchased at convenience stores or Daiso in Korea 🔌⚡"
    },
    followUp: "한국 여행을 가볍고 편리하게 준비하실 수 있도록 **{city}** 맞춤 일정을 준비해 드릴까요? ✈️✨",
    suggestedChips: ["✈️ 여행 준비 & 추천 코스", "🚀 바로 일정 만들기"]
  },

  // =========================================================================
  // 7. 단편 키워드 / 슬롯 입력 포용 (SLOT_FRAGMENT)
  // =========================================================================
  {
    id: "qna_fragment_winter_only",
    category: "SLOT_FRAGMENT",
    targetCity: "all",
    season: "winter",
    questionVariations: [
      "겨울에",
      "12월에",
      "1월에",
      "2월에",
      "겨울 여행",
      "겨울철",
      "겨울"
    ],
    intentKeywords: ["겨울", "12월", "1월", "2월", "겨울철", "눈", "설경"],
    geminiAnswer: {
      ko: "눈부신 설경과 낭만이 가득한 **겨울철 {city:은/는}** 여행이시군요! ❄️ 혹시 몇 시쯤 어디(공항/터미널/KTX역)로 도착하시고, 숙소는 어디쯤이신가요? 😊",
      en: "Wonderful choice for a winter journey to **{city}**! ❄️ Around what time do you arrive, and where is your hotel stay located? 😊"
    },
    followUp: "도착 시간이나 숙소 위치를 말씀해 주시면 첫날부터 완벽한 동선으로 맞춰드릴게요! ✈️🏨",
    suggestedChips: ["☀️ 오전 도착 (12:00 이전)", "🌤️ 오후 도착 (14:00~16:00)", "🌙 저녁/밤 도착 (18:00 이후)", "🚀 이제 일정 짜줘"]
  },
  // =========================================================================
  // 1-1. 사계절 대표 여행지 추천 (SEASONAL_RECOMMENDATION)
  // =========================================================================
  {
    id: "qna_spring_best_destinations",
    category: "SEASONAL_RECOMMENDATION",
    targetCity: "all",
    season: "spring",
    questionVariations: [
      "봄에는",
      "봄엔",
      "봄은",
      "봄에는 어디가 좋아",
      "봄에 어디가 좋아",
      "봄 어디가 좋아",
      "봄엔 어디가 좋아",
      "봄 어디가 좋을까",
      "봄 여행지 추천",
      "봄 여행 어디",
      "봄에 갈만한곳",
      "벚꽃 명소 추천"
    ],
    intentKeywords: ["봄", "봄에는", "봄엔", "어디가", "좋아", "추천", "벚꽃", "유채꽃", "여행지", "명소"],
    geminiAnswer: {
      ko: "화사한 봄 대한민국 여행은 눈부신 벚꽃 터널의 **[진해 여좌천·경화역]**, 벚꽃과 황리단길의 낭만 **[경주 보문호·대릉원]**, 노란 유채꽃이 끝없이 펼쳐진 **[제주 가시리 녹산로]**, 오션뷰 벚꽃 드라이브 **[부산 달맞이길]**이 최고 인기 명소예요! 🌸🌿✨",
      en: "Top spring destinations in Korea include the legendary cherry blossoms of **[Jinhae Yeojwacheon]**, the historic flower paths of **[Gyeongju Bomun Lake]**, the golden canola fields of **[Jeju Noksan-ro]**, and coastal blossoms at **[Busan Moontan Road]**! 🌸✨",
      ja: "春の韓国旅行は、桜のトンネルが広がる**【鎮海 余佐川】**、桜と歴史ある街並みが美しい**【慶州 普門湖】**、菜の花が一面に広がる**【済州 鹿山路】**、海沿いの桜が絶景の**【釜山 月見の丘】**が大人気です！🌸🌿",
      zh: "春季韩国旅游首推樱花烂漫的**【镇海 余佐川】**、古都樱花名所**【庆州 普门湖】**、金色油菜花海**【济州 鹿山路】**以及海景樱花大道**【釜山 迎月路】**！🌸✨"
    },
    followUp: "어느 지역의 화사한 봄꽃 풍경으로 일정을 잡아드릴까요? 🌸",
    suggestedChips: ["🌸 진해 벚꽃 투어", "🚲 경주 봄꽃 힐링", "🌼 제주 유채꽃 코스", "🌊 부산 오션 벚꽃"]
  },
  {
    id: "qna_summer_best_destinations",
    category: "SEASONAL_RECOMMENDATION",
    targetCity: "all",
    season: "summer",
    questionVariations: [
      "여름에는",
      "여름엔",
      "여름은",
      "여름에는 어디가 좋아",
      "여름에 어디가 좋아",
      "여름 어디가 좋아",
      "여름엔 어디가 좋아",
      "여름 여행지 추천",
      "여름 여행 어디",
      "여름 바다 추천",
      "여름에 갈만한곳"
    ],
    intentKeywords: ["여름", "여름에는", "여름엔", "어디가", "좋아", "추천", "바다", "해변", "서핑", "여행지", "명소"],
    geminiAnswer: {
      ko: "시원한 여름 대한민국 여행은 에메랄드빛 투명한 바다 **[제주 협재·함덕해변]**, 서핑과 힙한 비치 바이브 **[양양 서피비치·강릉 안목해변]**, 화려한 오션뷰와 해운대 나이트라이프 **[부산 해운대·광안리]**, 푸른 남해 비경 **[거제 바람의언덕·외도]**가 최고 인기예요! 🏄‍♂️🌊🏖️",
      en: "Top summer destinations in Korea include the crystal-clear emerald waters of **[Jeju Hyeopjae & Hamdeok]**, trendy surf vibes at **[Yangyang Surfyy Beach & Gangneung]**, vibrant nightlife at **[Busan Haeundae & Gwangalli]**, and scenic coastlines of **[Geoje Island]**! 🌊🏖️",
      ja: "夏の韓国旅行は、エメラルドグリーンの海が広がる**【済州 挟才・咸徳ビーチ】**、サーフィンとトレンディな**【襄陽 サーフィービーチ＆江陵】**、華やかなオーシャンビューの**【釜山 海雲台・広安里】**、南海の絶景**【巨済島 風の丘】**が大人気です！🏄‍♂️🌊",
      zh: "夏季韩国旅游首推果冻海名胜**【济州 挟才·咸德海滩】**、冲浪圣地**【襄阳 Surfyy Beach·江陵】**、繁华海景与夜景**【釜山 海云台·广安里】**以及绝美南海风光**【巨济 风之丘】**！🏄‍♂️🌊"
    },
    followUp: "어느 시원한 바다로 떠나보고 싶으신가요? 🏖️",
    suggestedChips: ["🌊 부산 해운대/광안리", "🏄‍♂️ 강릉/양양 서핑", "🌴 제주 에메랄드 바다", "🏖️ 거제/통영 오션뷰"]
  },
  {
    id: "qna_autumn_best_destinations",
    category: "SEASONAL_RECOMMENDATION",
    targetCity: "all",
    season: "autumn",
    questionVariations: [
      "가을은 어디가 좋아",
      "가을에는 어디가 좋아",
      "가을엔 어디가 좋아",
      "가을에 어디가 좋아",
      "가을 어디가 좋아",
      "가을 어디가 좋을까",
      "가을 어디로 갈까",
      "가을 여행지 추천",
      "가을 여행 어디",
      "가을에 갈만한곳",
      "가을 단풍 명소 추천"
    ],
    intentKeywords: ["가을", "가을에는", "가을엔", "어디가", "좋아", "추천", "단풍", "여행지", "명소", "가볼만한곳"],
    geminiAnswer: {
      ko: "가을 대한민국 여행은 붉은 단풍과 은빛 억새가 장관인 **[경주 불국사·보문호]**, 오색 단풍의 절경 **[강원 설악산·남이섬]**, 핑크뮬리와 억새 물결의 **[제주 새별오름·산굼부리]**, 고즈넉한 노란 은행나무길 **[전주 한옥마을]**이 최고 인기 명소예요! 🍁🍂✨",
      en: "Top autumn destinations in Korea include the historic maple trails of **[Gyeongju Bulguksa & Bomun Lake]**, the majestic fall colors of **[Seoraksan & Nami Island]**, the silver grass & pink muhly of **[Jeju Saebyeol Oreum]**, and golden ginkgo paths of **[Jeonju Hanok Village]**! 🍁✨",
      ja: "秋の韓国旅行は、美しい紅葉が広がる**【慶州 仏国寺・普門湖】**、壮大な紅葉の**【雪岳山・南怡島】**、ススキとピンクミューリーが美しい**【済州 セビョルオルム】**、黄金のイチョウ並木が続く**【全州 韓屋村】**が大人気です！🍁🍂",
      zh: "秋季韩国旅游首推红枫与银芒交相辉映的**【庆州 佛国寺·普门湖】**、壮美枫叶胜地**【江原道 雪岳山·南怡岛】**、粉黛乱子草与芒草摇曳的**【济州 晓星岳】**以及满地金黄银杏的**【全州 韩屋村】**！🍁✨"
    },
    followUp: "어느 지역의 가을 풍경이 가장 끌리시나요? 😊",
    suggestedChips: ["🍁 경주 단풍 힐링", "🏔️ 설악/강릉 가을", "🌾 제주 억새·핑크뮬리", "🏮 전주 한옥 낭만"]
  },
  {
    id: "qna_winter_best_destinations",
    category: "SEASONAL_RECOMMENDATION",
    targetCity: "all",
    season: "winter",
    questionVariations: [
      "겨울에는",
      "겨울엔",
      "겨울은",
      "겨울에는 어디가 좋아",
      "겨울에 어디가 좋아",
      "겨울 어디가 좋아",
      "겨울 어디가 좋을까",
      "겨울 여행지 추천",
      "겨울 여행 어디",
      "겨울 설경 명소",
      "겨울에 갈만한곳"
    ],
    intentKeywords: ["겨울", "겨울에는", "겨울엔", "어디가", "좋아", "추천", "눈", "설경", "온천", "여행지", "명소"],
    geminiAnswer: {
      ko: "낭만적인 겨울 대한민국 여행은 환상적인 눈꽃 설경 **[평창 대관령 양떼목장·발왕산 케이블카]**, 은빛 순백의 숲 **[인제 자작나무숲]**, 따뜻한 오션뷰 스파 **[부산 해운대 스파랜드·제주 산방산 온천]**, 화려한 도심 빛축제 **[서울 명소·청계천]**이 최고 인기예요! ⛄❄️♨️",
      en: "Top winter destinations in Korea include the breathtaking snowscapes of **[Pyeongchang Daegwallyeong & Mt. Balwang]**, the magical white birch forest of **[Inje]**, relaxing ocean-view hot springs at **[Busan & Jeju]**, and sparkling winter light festivals in **[Seoul]**! ❄️♨️",
      ja: "冬の韓国旅行は、白銀の絶景が広がる**【平昌 大関嶺羊牧場・発旺山】**、神秘的な純白の**【麟蹄 シラカバの森】**、温かいオーシャンビュースパ**【釜山 海雲台・済州 温泉】**、華やかな光のフェスティバル**【ソウル】**が大人気です！⛄❄️",
      zh: "冬季韩国旅游首推梦幻雪景胜地**【平昌 大关岭羊群牧场·发旺山缆车】**、纯白童话般的**【麟蹄 白桦林】**、温暖惬意的海景温泉**【釜山 海云台·济州】**以及流光溢彩的**【首尔 冬季灯光节】**！⛄❄️"
    },
    followUp: "어느 겨울 낭만 코스로 일정을 잡아드릴까요? ❄️",
    suggestedChips: ["❄️ 평창/강원 설경 투어", "🌲 인제 자작나무숲", "♨️ 온천 & 오션뷰 힐링", "✨ 서울 도심 겨울 야경"]
  },
  {
    id: "qna_fragment_autumn_only",
    category: "SLOT_FRAGMENT",
    targetCity: "all",
    season: "autumn",
    questionVariations: [
      "가을에",
      "9월에",
      "10월에",
      "11월에",
      "가을 여행",
      "단풍 여행",
      "가을철",
      "가을"
    ],
    intentKeywords: ["가을", "9월", "10월", "11월", "가을철", "단풍", "억새", "핑크뮬리"],
    geminiAnswer: {
      ko: "청명한 하늘과 붉은 단풍이 아름다운 **가을철 {city} 여행**이시군요! 🍁 혹시 몇 시쯤 어디(공항/터미널/KTX역)로 도착하시고, 숙소는 어디쯤이신가요? 😊",
      en: "Wonderful choice for a crisp autumn trip to **{city}**! 🍁 Around what time do you arrive, and where is your hotel stay located? 😊"
    },
    followUp: "도착 시간이나 숙소 위치를 말씀해 주시면 첫날부터 완벽한 동선으로 맞춰드릴게요! ✈️🏨",
    suggestedChips: ["☀️ 오전 도착 (12:00 이전)", "🌤️ 오후 도착 (14:00~16:00)", "🌙 저녁/밤 도착 (18:00 이후)", "🚀 이제 일정 짜줘"]
  },
  {
    id: "qna_fragment_companion_only",
    category: "SLOT_FRAGMENT",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "아이 동반",
      "아이랑",
      "가족끼리",
      "부모님이랑",
      "커플",
      "친구랑",
      "혼자서"
    ],
    intentKeywords: ["아이 동반", "아이랑", "가족", "부모님", "커플", "친구", "혼자서"],
    geminiAnswer: {
      ko: "동행하시는 분들의 편안함과 즐거움을 최우선으로 고려하여 **{city:의}** 가장 안심되고 매력적인 명소들로 정성껏 코스를 맞춰드릴게요! 👨‍👩‍👧‍👦✨",
      en: "We will tailor the best spots in **{city}** ensuring maximum comfort and joy for your travel companions! 👨‍👩‍👧‍👦✨"
    },
    followUp: "원하시는 여행 기간이나 선호하시는 스타일을 말씀해 주시면 일정을 바로 완성해 드려요! ✈️🌸",
    suggestedChips: ["🗓️ 1박 2일", "🗓️ 2박 3일", "🗓️ 3박 4일", "🚀 이제 일정 짜줘"]
  },

  // =========================================================================
  // 8. 호텔 & 숙소 문의 (ACCOMMODATION_HOTEL)
  // =========================================================================
  {
    id: "qna_hotel_booking_inquiry",
    category: "ACCOMMODATION_HOTEL",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "호텔도 해주나?",
      "호텔도 예약해줘?",
      "숙소도 찾아줘?",
      "호텔 추천해줘",
      "숙소 추천",
      "어디서 자야 돼?",
      "한옥 스테이 있어?",
      "호텔도 돼?",
      "펜션 추천",
      "숙박 예약"
    ],
    intentKeywords: ["호텔", "숙소", "숙박", "펜션", "한옥스테이", "리조트", "호텔예약", "예약"],
    geminiAnswer: {
      ko: "네, 물론이죠! **{city}**의 평점 9.0+ 인기 호텔, 감성 오션뷰 펜션, 고즈넉한 한옥 스테이 정보를 추천해 드리고, 최저가 실시간 아고다(Agoda) 특가 예약 링크까지 연결해 드려요! 🏨✨",
      en: "Yes, absolutely! We recommend top-rated 9.0+ hotels, oceanview pensions, and traditional hanok stays in **{city}** with real-time Agoda discount booking links! 🏨✨"
    },
    followUp: "혹시 어느 지역의 어떤 스타일(가성비, 오션뷰 호텔, 감성 한옥) 숙소를 찾고 계신가요? 😊",
    suggestedChips: ["🏨 가성비 인기 호텔", "🌊 오션뷰 감성 펜션", "🏯 전통 한옥 스테이", "🚀 이제 일정 짜줘"]
  },

  // =========================================================================
  // 9. 복합 조건 (3대 대가족: 부모님 + 아이) (COMPOSITE_CONDITIONS)
  // =========================================================================
  {
    id: "qna_companion_3generations",
    category: "COMPOSITE_CONDITIONS",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "부모님이랑 아이랑 같이 가",
      "할머니 손주 여행",
      "3대 대가족 여행",
      "부모님 모시고 아이 동반",
      "온 가족 여행 코스"
    ],
    intentKeywords: ["3대", "부모님", "아이", "조부모", "대가족", "할머니", "손주", "온가족"],
    geminiAnswer: {
      ko: "어르신(부모님)과 우리 아이까지 온 가족 3대가 함께 떠나는 정말 뜻깊은 여행이시군요! 👨‍👩‍👧‍👦👴👵 어르신의 무릎과 아이의 유모차를 모두 배려하여, 계단 없는 평지 산책로와 케이블카, 아쿠아리움이 결합된 **【 3대 안심 힐링 코스 】**로 잡아드릴게요! ✨",
      en: "A wonderful multi-generational family journey with grandparents and kids! 👨‍👩‍👧‍👦👴👵 We prioritize step-free flat paths, scenic cable cars, and exciting aquariums with nourishing dining for all generations! ✨"
    },
    followUp: "온 가족이 무리 없이 편안하게 즐길 수 있는 **{city}** 3대 안심 코스로 잡아드릴까요? 🌿🎈",
    suggestedChips: ["🎈 3대 가족 안심 힐링 코스", "🍴 정갈한 보양 한정식", "🚀 이제 일정 짜줘"]
  },

  // =========================================================================
  // 10. 일상 대화 & 감성 티키타카 (DAILY_CHITCHAT)
  // =========================================================================
  {
    id: "qna_chitchat_greetings",
    category: "DAILY_CHITCHAT",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "안녕",
      "안녕하세요",
      "반가워",
      "하이",
      "hello",
      "hi",
      "좋은 아침",
      "보라 안녕"
    ],
    intentKeywords: ["안녕", "안녕하세요", "반가워", "하이", "hello", "hi", "반갑습니다"],
    geminiAnswer: {
      ko: "안녕하세요! 만나서 정말 반가워요! 🌸 저는 대한민국 여행 전문 AI 컨시어지 VORA예요. 오늘 어떤 설레는 한국 여행을 꿈꾸고 계신가요? 😊",
      en: "Hello! So wonderful to meet you! 🌸 I am VORA, your dedicated AI Travel Concierge for South Korea. What exciting trip are you dreaming of today? 😊"
    },
    followUp: "가고 싶으신 도시나 여행 테마를 편하게 말씀해 주세요! ✈️✨",
    suggestedChips: ["🌊 거제 & 남해 힐링", "🏙️ 서울 핫플 투어", "🏖️ 부산 바다 미식", "🚀 인기 도시 추천"]
  },
  {
    id: "qna_chitchat_compliment",
    category: "DAILY_CHITCHAT",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "너 진짜 똑똑하다",
      "똑똑해",
      "고마워",
      "감사합니다",
      "대박",
      "최고야",
      "짱이다",
      "도움 많이 됐어"
    ],
    intentKeywords: ["똑똑", "고마워", "감사", "대박", "최고", "짱이다", "도움", "친절"],
    geminiAnswer: {
      ko: "헤헤, 칭찬해 주셔서 어깨가 으쓱하네요! 🥰 여행자님의 완벽하고 행복한 한국 여행을 위해 매일 제미나이 스승님께 열심히 배우고 있답니다! 💖",
      en: "Aww, thank you so much! 🥰 I work hard every day with master Gemini to make your Korea trip truly unforgettable! 💖"
    },
    followUp: "혹시 더 궁금한 점이나 보고 싶으신 코스가 있으신가요? 편하게 물어보세요! 😊",
    suggestedChips: ["🍴 현지인 맛집 보기", "📸 인생샷 포토존 보기", "🚀 이제 일정 짜줘"]
  },
  {
    id: "qna_chitchat_fatigue",
    category: "DAILY_CHITCHAT",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "다리 너무 아파",
      "다리아파",
      "너무 피곤해",
      "피곤하다",
      "지쳐",
      "힘들어",
      "쉬고 싶어",
      "다리 아파서 못 걷겠어"
    ],
    intentKeywords: ["다리", "아파", "다리아파", "피곤", "지쳐", "힘들", "쉬고", "휴식", "족욕"],
    geminiAnswer: {
      ko: "오늘 정말 열심히 걸으셨군요! 🥺 무리하지 마시고 잠시 쉬어가세요. 근처에 **폭신한 소파가 있는 전망 좋은 힐링 카페나 따뜻한 족욕 카페, 편안한 찜질방**에서 다리의 피로를 풀어보시는 건 어떨까요? ☕🛋️",
      en: "You've walked so much today! 🥺 Take a gentle break at a nearby cozy view cafe with plush sofas, a warm foot bath cafe, or a relaxing Korean spa! ☕🛋️"
    },
    followUp: "근처에서 편안하게 쉴 수 있는 힐링 스팟을 안내해 드릴까요? ☕🛋️",
    suggestedChips: ["☕ 폭신한 소파 힐링 카페", "♨️ 따뜻한 스파/찜질방", "🚕 이동 편한 코스로 변경"]
  },
  {
    id: "qna_chitchat_hunger",
    category: "DAILY_CHITCHAT",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "배고파",
      "배고파 죽겠어",
      "밥 뭐 먹지",
      "너무 배고파",
      "출출해",
      "야식 땡겨"
    ],
    intentKeywords: ["배고파", "배고파죽", "출출", "밥", "야식", "식사", "뭐먹지"],
    geminiAnswer: {
      ko: "금강산도 식후경이죠! 🤤 든든하게 배를 채워야 여행도 더 즐거운 법이에요. 지금 계신 곳에서 가장 빠르게 닿는 **현지인 줄 서는 찐 로컬 맛집이나 따끈한 뚝배기 한 상**을 바로 찾아드릴까요? 🍲✨",
      en: "Eating well is the heart of traveling! 🤤 Shall we find the most authentic local diner or comforting hot soup spot closest to where you are right now? 🍲✨"
    },
    followUp: "지금 가장 땡기는 음식 종류(고기, 국물, 분식, 디저트)를 말씀해 주세요! 🍴🤤",
    suggestedChips: ["🍲 따끈한 국물 & 뚝배기", "🥩 든든한 숯불 고기 구이", "🥟 바삭한 길거리 분식", "☕ 달콤한 베이커리 카페"]
  },
  {
    id: "qna_chitchat_identity",
    category: "DAILY_CHITCHAT",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "너 누구야?",
      "넌 누구니?",
      "넌누구니",
      "넌 누구야",
      "너 사람이야 AI야?",
      "보라가 뭐야?",
      "너 몇 살이야?",
      "너 이름이 뭐야?",
      "자기소개해줘",
      "who are you"
    ],
    intentKeywords: ["누구야", "누구니", "넌누구", "사람이야", "ai야", "보라가", "몇살", "이름이", "정체", "자기소개"],
    geminiAnswer: {
      ko: "저는 대한민국 전국 방방곡곡의 매력을 24시간 든든하게 안내해 드리는 한국 여행 전문 AI 요정 **VORA(보라)**예요! 🧚‍♀️ 보랏빛 설렘을 가득 담아, 여행자님께 가장 완벽한 여행을 선물해 드릴게요! 💜✨",
      en: "I am **VORA**, your 24/7 dedicated AI Travel fairy specialized in South Korea! 🧚‍♀️ I am here to make every moment of your Korean journey smooth, exciting, and unforgettable! 💜✨"
    },
    followUp: "오늘 저와 함께 어떤 멋진 여행을 떠나보실까요? ✈️🌸",
    suggestedChips: ["✨ 나만의 맞춤 여행 시작", "🗺️ 전국 인기 명소 구경", "💡 여행 꿀팁 물어보기"]
  },
  {
    id: "qna_service_capabilities_guide",
    category: "DAILY_CHITCHAT",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "여기서 뭘 할수 있지",
      "여기서 뭘 할 수 있어?",
      "너 뭐 할 수 있어?",
      "보라는 뭘 할 수 있어?",
      "기능이 뭐야?",
      "사용법 알려줘",
      "어떻게 쓰는 거야?",
      "뭘 도와줄 수 있어?",
      "여기 뭐하는 곳이야?",
      "what can you do",
      "how to use"
    ],
    intentKeywords: ["뭘 할수", "뭐 할수", "뭘할수", "뭐할수", "기능", "사용법", "도와줄", "도움말", "어떻게 써", "뭐하는 곳"],
    geminiAnswer: {
      ko: "저는 여행자님의 완벽한 대한민국 여행을 위해 다음과 같은 일들을 든든하게 도와드려요! 🧚‍♀️✨\n\n1. **🗺️ 0.01초 맞춤 일정표 생성**: 가고 싶으신 도시, 일정, 계절, 동행자에 맞춘 최적 동선 코스\n2. **👗 사계절 옷차림 & 실시간 날씨 코디**: 계절별/날씨별 최적 패션과 필수 꿀템 가이드\n3. **🍴 찐 로컬 맛집 & 감성 카페 추천**: 현지인 추천 노포부터 오션뷰 베이커리 카페까지\n4. **🏨 호텔 & 펜션 최저가 예약**: 아고다 제휴 특가 링크 및 지역별 평점 9.0+ 숙소 안내\n5. **🧳 교통 & 짐보관 & 여행 팁**: 공항철도, KTX, 티머니, 즉시 텍스리펀 꿀팁",
      en: "I am here to make your South Korea travel seamless and magical! 🧚‍♀️✨\n\n1. **🗺️ Instant Itinerary Planning**: Custom daily schedules tailored to your duration, style & companion\n2. **👗 Seasonal Outfit & Weather Guides**: What to wear and essential travel packing tips\n3. **🍴 Authentic Food & Cafe Trails**: Local foodie spots to scenic oceanview bakeries\n4. **🏨 Best Hotels & Stays**: Handpicked stays with direct discounted Agoda rates\n5. **🧳 Transit & Local Hacks**: AREX, KTX, T-Money & instant tax refund guides"
    },
    followUp: "가고 싶으신 지역이나 궁금한 점을 편하게 말씀해 주세요! 😊✈️",
    suggestedChips: ["🗺️ 2박3일 맞춤 일정 만들기", "👗 계절별 옷차림 물어보기", "🍴 현지인 찐맛집 추천", "🏨 인기 숙소/호텔 보기"]
  },
  // =========================================================================
  // 11. 지역별 찐 노포 주문 & 미식 치트시트 (AUTHENTIC_FOOD_ORDERING_GUIDE)
  // =========================================================================
  {
    id: "qna_food_busan_pork_soup",
    category: "AUTHENTIC_FOOD_ORDERING",
    targetCity: "부산",
    season: "all",
    questionVariations: [
      "돼지국밥 어떻게 시켜?",
      "돼지국밥 먹는법",
      "돼지국밥 어떻게 먹어?",
      "부산 돼지국밥 주문법",
      "따로국밥이 뭐야?",
      "섞어국밥이 뭐야?",
      "돼지국밥 팁",
      "국밥 먹는 방법"
    ],
    intentKeywords: ["돼지국밥", "국밥", "먹는법", "어떻게 먹어", "어떻게 시켜", "주문법", "따로국밥", "섞어국밥", "정구지"],
    geminiAnswer: {
      ko: "부산 현지인이 전수하는 **돼지국밥 100점짜리 주문 & 먹팁**입니다! 🍲✨\n\n1. **주문 팁**: 맑은 국물을 원하시면 밥이 따로 나오는 **'따로국밥'**, 고기와 내장을 함께 즐기시려면 **'섞어국밥'**으로 주문하세요!\n2. **먹는 순서**: 국물이 뜨거울 때 **소면 사리**를 먼저 넣고, **부추무침(정구지)**을 듬뿍 넣은 뒤 **새우젓**으로 간을 맞추세요!\n3. **양념(다대기)**: 매콤 칼칼한 국물을 원하시면 빨간 양념장을 듬뿍 풀어드시면 최고입니다. 🍚🥢",
      en: "Local Gourmet Guide to **Busan Pork Soup (Dwaeji Gukbap)**! 🍲✨\n\n1. **Ordering**: Order **'Ttaro-gukbap'** to get rice served separately, or **'Seokkeo-gukbap'** for mixed pork and tripe!\n2. **How to Eat**: Add chives (Jeongguji), season with salted shrimp sauce (Saeujeot), and stir in noodles while hot!\n3. **Spicy Paste**: Add red pepper paste (Dadaegi) for a rich, hearty kick! 🍚🥢"
    },
    followUp: "돼지국밥 든든하게 드시고 산책하기 좋은 해운대·광안리 오션뷰 코스도 잡아드릴까요? 🌊☕",
    suggestedChips: ["🌊 광안대교 오션뷰 코스", "🚡 해운대 블루라인파크", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_food_busan_milmyeon",
    category: "AUTHENTIC_FOOD_ORDERING",
    targetCity: "부산",
    season: "all",
    questionVariations: [
      "밀면 어떻게 먹어?",
      "부산 밀면 먹는법",
      "물밀면 비빔밀면 차이",
      "밀면 먹는 팁",
      "밀면 주문법"
    ],
    intentKeywords: ["밀면", "물밀면", "비빔밀면", "먹는법", "어떻게 먹어", "주문법", "온육수"],
    geminiAnswer: {
      ko: "부산의 소울푸드 **밀면 찐 먹팁**입니다! 🍜✨\n\n1. **시작은 온육수**: 주문 후 주전자에 나오는 따뜻한 **사골 온육수**를 한 모금 마시며 속을 달래주세요.\n2. **가위질은 딱 1번만**: 쫄깃한 면발의 탄력을 위해 가위질은 십자가(+)가 아닌 **딱 1번만(+)** 자르는 게 정석입니다!\n3. **식초 & 겨자**: 국물을 먼저 맛본 뒤, 식초와 겨자를 한 바퀴 둘러 감칠맛을 폭발시켜 주세요! 🥟 찐만두와 함께 먹으면 환상의 짝꿍입니다.",
      en: "Busan Soul Food **Milmyeon (Wheat Noodles) Guide**! 🍜✨\n\n1. **Start with Hot Broth**: Enjoy the complimentary warm savory bone broth before your bowl arrives.\n2. **Cut Just Once**: Cut the chewy noodles only once across to preserve maximum springy texture!\n3. **Mustard & Vinegar**: Taste the broth first, then swirl a bit of vinegar and yellow mustard for peak umami! 🥟 Pairs perfectly with steamed dumplings."
    },
    followUp: "시원한 밀면 드신 뒤 가기 좋은 감성 카페나 흰여울마을 코스로 연결해 드릴까요? 🌊☕",
    suggestedChips: ["☕ 영도 오션뷰 카페 투어", "🏡 흰여울문화마을", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_food_jeju_blackpork",
    category: "AUTHENTIC_FOOD_ORDERING",
    targetCity: "제주",
    season: "all",
    questionVariations: [
      "제주 흑돼지 먹는법",
      "흑돼지 멜젓 어떻게 먹어?",
      "멜젓이 뭐야?",
      "제주 흑돼지 주문 팁"
    ],
    intentKeywords: ["흑돼지", "멜젓", "먹는법", "어떻게 먹어", "오겹살", "목살", "제주돼지"],
    geminiAnswer: {
      ko: "제주 **흑돼지 & 멜젓(멸치젓) 환상 조합 먹팁**입니다! 🥩🔥\n\n1. **멜젓 끓이기**: 불판 가운데에 멜젓 종지를 올리고, **청양고추와 마늘 한 조각, 소주 살짝**을 넣어 보글보글 끓여 비린내를 날립니다.\n2. **두툼한 육즙**: 겉바속촉으로 두툼하게 구운 오겹살/목살을 끓는 멜젓에 푹 찍어 고추 한 조각과 함께 드세요!\n3. **제주 고사리**: 불판 한 켠에 제주 생고사리를 함께 구워 고기에 싸 먹으면 고소함이 2배가 됩니다. 🥬✨",
      en: "Jeju Island **Black Pork BBQ & Meljeot (Anchovy Sauce) Master Guide**! 🥩🔥\n\n1. **Boil the Meljeot**: Place the seasoned anchovy dip on the grill with sliced hot chili and garlic until bubbly.\n2. **Juicy Thick Cut**: Dip the thick, grilled crispy pork belly right into the boiling sauce!\n3. **Jeju Gosari (Fern)**: Grill fresh Jeju bracken ferns on the side and wrap together for an earthy, savory flavor explosion! 🥬✨"
    },
    followUp: "흑돼지 드시고 가기 좋은 제주 서쪽 선셋 해변이나 야경 코스를 맞춰드릴까요? 🌅🌴",
    suggestedChips: ["🌅 애월 선셋 카페거리", "🌴 협재·금능 에메랄드 해변", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_food_jeonju_gukbap",
    category: "AUTHENTIC_FOOD_ORDERING",
    targetCity: "전주",
    season: "all",
    questionVariations: [
      "콩나물국밥 수란 어떻게 먹어?",
      "전주 콩나물국밥 먹는법",
      "수란 먹는법",
      "남부시장식 콩나물국밥"
    ],
    intentKeywords: ["콩나물국밥", "수란", "먹는법", "어떻게 먹어", "남부시장", "오징어사리", "모주"],
    geminiAnswer: {
      ko: "전주 현지인이 알려주는 **콩나물국밥 & 수란 찐 먹팁**입니다! 🍲🍳\n\n1. **수란은 국에 넣지 마세요**: 수란 그릇에 **김가루를 부수어 넣고, 뜨거운 국밥 국물 3~4숟가락**을 넣은 뒤 먼저 호로록 떠드세요! (국물에 넣으면 맑은 국물이 탁해져요)\n2. **오징어사리 추가**: 삶은 오징어 사리를 추가해 국밥에 넣으면 쫄깃한 식감과 감칠맛이 폭발합니다.\n3. **전주 모주 한 잔**: 계피향 솔솔 나는 달콤한 전주 전통 모주(저알콜 약주)를 곁들이면 완벽한 해장 완성! 🍶✨",
      en: "Authentic Jeonju **Bean Sprout Soup & Poached Egg (Suran) Guide**! 🍲🍳\n\n1. **Do NOT drop the egg into the soup**: Add crushed seaweed and 3-4 spoonfuls of hot broth into the small poached egg bowl first, and enjoy it separately!\n2. **Add Chopped Squid**: Toss in tender boiled squid pieces for extra chewiness and umami.\n3. **Moju Pairing**: Pair with a glass of sweet cinnamon rice wine (Moju) for the ultimate comforting finish! 🍶✨"
    },
    followUp: "콩나물국밥 든든하게 드시고 전주 한옥마을 경기전과 감성 카페로 이어지는 코스를 잡아드릴까요? 🏮✨",
    suggestedChips: ["🏮 전주 한옥마을 골목투어", "☕ 한옥 감성 카페거리", "🚀 바로 일정 만들기"]
  }
];

