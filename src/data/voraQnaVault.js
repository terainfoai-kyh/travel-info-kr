/**
 * VORA AI Golden Q&A Knowledge Vault (보라 핵심 자산 지식 데이터베이스)
 * 
 * Production-Grade Knowledge Base distilled from Gemini 2.5 Flash.
 * Supports dynamic slot interpolation: {city}, {season}, {gateway}, {hotel} with Korean particle formatting!
 */

export const VORA_QNA_VAULT = [
  // ==========================================
  // 1. 패션 & 날씨 & 옷차림 (FASHION_WEATHER)
  // ==========================================
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
      "겨울에 날씨 추워?"
    ],
    intentKeywords: ["겨울", "복장", "옷", "패션", "코디", "패딩", "추위", "추워", "외투", "코트", "따뜻"],
    geminiAnswer: {
      ko: "**{city:은/는}** 겨울철 체감온도가 낮고 바람이 불 수 있어 보온성 높은 패딩이나 울 코트에 목도리, 기모 이너웨어를 레이어드하는 따뜻한 룩을 추천드려요! 🧣❄️\n\n💡 **추천 꿀아이템**: 핫팩, 목도리/장갑, 보온 텀블러",
      en: "For winter in **{city}**, temperatures can drop with chilly winds. We recommend layering with a warm padded coat, thermal wear, and a scarf! 🧣❄️\n\n💡 **Must-haves**: Hand warmers, gloves, cozy scarf"
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
      "벚꽃 여행 옷차림"
    ],
    intentKeywords: ["봄", "복장", "옷", "패션", "코디", "자켓", "트렌치", "가디건", "벚꽃", "봄옷"],
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
      "폭염 옷차림"
    ],
    intentKeywords: ["여름", "복장", "옷", "패션", "더워", "더위", "폭염", "반팔", "린넨", "원피스", "시원"],
    geminiAnswer: {
      ko: "**{city:은/는}** 여름철 기온과 습도가 높으니 통기성 좋은 린넨 셔츠, 반팔 티셔츠, 쾌적한 원피스를 추천드려요! 실내 에어컨 냉방에 대비해 얇은 린넨 가디건이나 셔츠를 챙기시면 좋습니다 🌊🕶️\n\n💡 **추천 꿀아이템**: 휴대용 선풍기, 양우산, 선글라스, 냉감 패치",
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
      "가을옷 추천"
    ],
    intentKeywords: ["가을", "복장", "옷", "패션", "코디", "단풍", "트렌치", "자켓", "선선", "가을옷"],
    geminiAnswer: {
      ko: "**{city:은/는}** 청명하고 선선한 가을 날씨로 여행하기 가장 좋습니다! 니트나 맨투맨 위에 라이더 자켓, 블레이저, 트렌치코트를 매치하면 분위기 있는 가을 감성룩이 완성됩니다 🍂🧥\n\n💡 **추천 꿀아이템**: 편안한 워킹화, 보습 립밤, 감성 스카프",
      en: "Autumn in **{city}** offers crystal-clear skies and crisp breezes! Pairing cozy knits with trench coats, leather jackets, or blazers gives you the best autumn travel look 🍂🧥\n\n💡 **Must-haves**: Walking shoes, lip balm, light scarf"
    },
    followUp: "붉은 단풍과 고즈넉한 정취를 만끽할 수 있는 **{city}** 힐링 코스로 잡아드릴까요? 🍁✨",
    suggestedChips: ["🍁 단풍 & 고궁 힐링 산책", "☕ 가을 감성 로컬 카페", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_fashion_rain",
    category: "FASHION_WEATHER",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "비 올 때 복장은?",
      "비 오는 날 옷차림",
      "비 올 때 뭐 입지",
      "우천 시 코디",
      "비 오는데 옷 어떻게 입어"
    ],
    intentKeywords: ["비", "우천", "비오", "폭우", "우산", "장마", "레인", "방수", "신발"],
    geminiAnswer: {
      ko: "**{city:은/는}** 비 오는 날에는 젖기 쉬운 긴 바지 대신 롤업 가능한 팬츠나 숏팬츠, 방수 겉옷을 입으시고, 미끄럽지 않은 레인부츠나 방수 스니커즈를 착용하시는 것이 쾌적합니다 ☔🌧️\n\n💡 **추천 꿀아이템**: 가벼운 3단 우산, 방수 신발 커버, 여분의 양말",
      en: "On rainy days in **{city}**, lightweight water-repellent jackets and comfortable non-slip footwear or short boots will keep you dry and comfortable! ☔🌧️\n\n💡 **Must-haves**: Compact umbrella, water-resistant shoes"
    },
    followUp: "비 한 방울 안 맞는 몰입형 미디어아트 & 실내 수족관·오션뷰 카페 코스로 잡아드릴까요? ☔🏛️",
    suggestedChips: ["🏛️ 실내 미디어아트 & 박물관", "☕ 빗소리 감성 오션뷰 카페", "🚀 바로 일정 만들기"]
  },

  // ==========================================
  // 2. 교통 & 관문 & 짐보관 (TRANSPORT_GATEWAY)
  // ==========================================
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
      "부산역 짐 보관"
    ],
    intentKeywords: ["짐", "캐리어", "보관", "라커", "맡기", "체크인전", "짐보관", "러기지", "배송"],
    geminiAnswer: {
      ko: "대부분의 한국 호텔은 체크인 전/후에 무료로 짐을 보관해 줍니다! 또한 주요 KTX역(서울역, 부산역 등)과 지하철역 물품보관함(T-Locker), 공항에서 숙소로 캐리어를 당일 배송해 주는 '트립백(TripBAG) / 짐캐리' 서비스를 이용하시면 가볍게 여행을 시작하실 수 있어요! 🧳✨",
      en: "Most hotels in Korea offer free luggage storage before check-in and after check-out! You can also use station lockers (T-Locker) at major subway/KTX stations, or same-day luggage delivery services (ZimCarry / TripBAG) from airports straight to your hotel! 🧳✨"
    },
    followUp: "**{city}** 도착 직후 짐을 가볍게 맡기고 바로 시작할 수 있는 첫날 오후 코스를 준비해 드릴까요? ✈️🏨",
    suggestedChips: ["☀️ 오전 도착 후 짐보관 코스", "🌤️ 오후 도착 체크인 코스", "🚀 바로 일정 만들기"]
  },
  {
    id: "qna_transport_tmoney_card",
    category: "TRANSPORT_GATEWAY",
    targetCity: "all",
    season: "all",
    questionVariations: [
      "티머니 카드 어디서 사?",
      "교통카드 어떻게 사?",
      "기후동행카드랑 티머니 차이가 뭐야?",
      "외국인 교통카드 추천",
      "지하철 버스 카드 충전"
    ],
    intentKeywords: ["티머니", "교통카드", "기후동행", "기후동행카드", "버스카드", "지하철카드", "tmoney", "충전", "편의점"],
    geminiAnswer: {
      ko: "T-Money 교통카드는 공항, 모든 편의점(CU, GS25, 세븐일레븐), 지하철역 자판기에서 약 3,000~4,000원에 구매 후 현금으로 충전하실 수 있습니다! 서울 시내를 집중적으로 대중교통으로 다니실 계획이라면 무제한 대중교통 이용권인 **'기후동행카드(외국인 단기권: 1일/2일/3일/5일)'**를 추천드려요! 💳🚌",
      en: "You can purchase a T-Money card at any convenience store (CU, GS25, 7-Eleven) or airport for around ₩3,000~₩4,000 and top up with cash! If exploring Seoul intensively, the unlimited **'Climate Card Short-Term Pass (1/2/3/5 Days)'** is highly recommended! 💳🚌"
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
      "택시 어떻게 불러"
    ],
    intentKeywords: ["택시", "카카오택시", "우버", "uber", "kakaotaxi", "해외카드", "신용카드", "호출"],
    geminiAnswer: {
      ko: "한국에서는 글로벌 **Uber(UT) 앱**을 그대로 켜서 해외 신용카드로 손쉽게 택시를 부르실 수 있습니다! 또한 **Kakao T** 앱의 '외국인 전용 웹/앱 버전'에서도 해외 카드 결제가 지원되며, 길거리에서 잡는 일반 택시 안에서도 해외 비자/마스터 카드로 직접 결제가 가능합니다 🚕💳",
      en: "You can simply open your global **Uber app** in Korea to hail taxis with your overseas credit card! **Kakao T** also supports international cards, and all street taxis accept international Visa/Mastercard directly inside the car 🚕💳"
    },
    followUp: "택시나 대중교통으로 15분 내외로 쾌적하게 닿는 **{city}** 핫플 코스로 잡아드릴까요? ✨",
    suggestedChips: ["🚕 이동 편한 최적 동선", "👑 대표 시그니처 랜드마크", "🚀 바로 일정 만들기"]
  },

  // ==========================================
  // 3. 동행자 & 여행 스타일 (COMPANION_STYLE)
  // ==========================================
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
      "아이 데리고 가기 편한 곳"
    ],
    intentKeywords: ["아이", "애기", "키즈", "유모차", "어린이", "가족", "자녀", "초등", "체험"],
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
      "시니어 여행 추천"
    ],
    intentKeywords: ["부모님", "어르신", "할머니", "할아버지", "엄마", "아빠", "시니어", "효도", "덜 걷", "무릎", "계단"],
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
      "혼자 힐링할 만한 곳"
    ],
    intentKeywords: ["혼자", "나홀로", "솔로", "혼행", "혼밥", "사색", "조용", "힐링"],
    geminiAnswer: {
      ko: "혼자만의 여행은 **고즈넉한 돌담길 산책, 아늑한 감성 독립서점, 창밖 뷰가 예쁜 1인 친화적 브루잉 카페와 1인 식사가 편안한 바 형태의 로컬 맛집**들을 추천드려요! 시간에 쫓기지 않고 나만의 속도로 오롯이 힐링하실 수 있습니다 🎧🌿",
      en: "Solo travel in Korea is safe and wonderfully inspiring! We recommend tranquil stone-wall walking paths, indie bookstores, specialty pour-over cafes, and cozy solo-friendly dining bars 🎧🌿"
    },
    followUp: "나만의 여유로운 쉼과 낭만을 만끽할 수 있는 **{city}** 나홀로 감성 코스로 잡아드릴까요? 🎧☕",
    suggestedChips: ["🎧 고즈넉한 산책 & 독립서점", "☕ 뷰 맛집 힐링 카페", "🚀 바로 일정 만들기"]
  },

  // ==========================================
  // 4. 음식 & 로컬 미식 (LOCAL_FOOD_PAIRING)
  // ==========================================
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
      "거제 현지인 맛집"
    ],
    intentKeywords: ["거제", "음식", "맛집", "미식", "먹거리", "굴구이", "멍게비빔밥", "바람의핫도그", "해물뚝배기"],
    geminiAnswer: {
      ko: "거제에 오시면 **신선한 바다 향이 가득한 '멍게비빔밥'과 통통한 '거제 굴구이', 얼큰하고 시원한 '해물뚝배기'**는 필수입니다! 바다 산책 후 출출할 때 즐기는 달콤 고소한 '바람의 핫도그'와 '거제 몽돌빵'도 놓치지 마세요 🐟🤤\n\n💡 **추천 미식**: 멍게비빔밥, 해물뚝배기, 굴 코스요리, 바람의 핫도그",
      en: "In Geoje, must-try local specialties include fresh **Sea Squirt Bibimbap (Myeongae Bibimbap)**, juicy grilled oysters, and rich spicy seafood stew (Haemul Ttukbaegi)! Don't miss the famous 'Windy Hotdog' after coastal strolls! 🐟🤤"
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
      "부산 미식 추천"
    ],
    intentKeywords: ["부산", "돼지국밥", "밀면", "씨앗호떡", "활어회", "어묵", "맛집", "음식"],
    geminiAnswer: {
      ko: "부산 미식의 정수는 **진하고 뽀얀 사골 육수의 '돼지국밥', 살얼음 동동 띄운 매콤달콤 '밀면', 광안대교 뷰와 함께 즐기는 '제철 활어회', 남포동 명물 '씨앗호떡'과 탱글한 '부산 삼진어묵'**입니다! 🍲🐟\n\n💡 **추천 미식**: 수변공원 활어회, 남포동 씨앗호떡, 서면 돼지국밥 거리",
      en: "Busan's food heaven features rich and comforting **Pork Soup (Dwaeji Gukbap)**, icy sweet & spicy **Milmyeon noodles**, fresh seaside sashimi by Gwangalli Bridge, and nutty Seed Hotteok! 🍲🐟"
    },
    followUp: "오션뷰와 로컬 노포 맛집을 황금 비율로 엮은 **부산** 미식 코스로 잡아드릴까요? 🍴🌊",
    suggestedChips: ["🍲 부산 대표 3대 미식 투어", "🍺 광안리 선셋 수제맥주 & 회", "🚀 바로 일정 만들기"]
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
      "맵지 않은 전통 음식"
    ],
    intentKeywords: ["안 매운", "맵지 않", "매운거 못", "달콤", "불고기", "갈비탕", "삼계탕", "삼겹살", "비빔밥"],
    geminiAnswer: {
      ko: "한국에는 맵지 않고 깊은 풍미를 자랑하는 일품요리가 가득합니다! 달콤 짭조름한 **'궁중 소불고기'와 든든한 '갈비탕 & 설렁탕', 보양식 '삼계탕', 고소한 '한우 숯불갈비'와 노릇노릇 '해물파전/빈대떡'**을 추천드려요! 비빔밥도 고추장 대신 간장 양념으로 맛있게 즐기실 수 있습니다 🥩🍲",
      en: "Korea has incredible non-spicy delicacies! We highly recommend savory sweet **Bulgogi beef**, hearty **Galbi-tang (beef short rib soup)**, nourishing **Samgye-tang (ginseng chicken soup)**, and crispy Seafood Pajeon pancakes! 🥩🍲"
    },
    followUp: "아이와 외국인 모두 맛있게 즐길 수 있는 **{city}** 프리미엄 안 매운 미식 코스로 잡아드릴까요? 🍴✨",
    suggestedChips: ["🥩 궁중 불고기 & 갈비탕 한정식", "🍗 바삭한 치킨 & 전통 빈대떡", "🚀 바로 일정 만들기"]
  },

  // ==========================================
  // 5. 외국인 실전 여행 팁 (FOREIGNER_HACKS)
  // ==========================================
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
      "esim 어떻게 사?"
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
      "공항 세금 환급"
    ],
    intentKeywords: ["텍스리펀", "택스리펀", "tax refund", "세금환급", "면세", "환급", "올리브영 면세"],
    geminiAnswer: {
      ko: "한국의 주요 백화점, 올리브영, 대형 매장에서는 1회 15,000원 이상 구매 시 여권을 제시하시면 결제 즉시 세금이 차감되는 **'현장 즉시 환급(Immediate Tax Refund)'**을 받으실 수 있습니다! 일반 사후 환급 영수증은 출국 시 공항의 무인 텍스리펀 키오스크(Kiosk)에서 간편하게 현금이나 카드로 돌려받으실 수 있습니다 🛍️💳",
      en: "At major shops like Olive Young and department stores, presenting your passport for purchases over ₩15,000 gives you **Immediate Tax Refund** at the counter! For general receipts, simply scan them at airport Tax Refund kiosks before departure 🛍️💳"
    },
    followUp: "트렌디한 K-뷰티 쇼핑과 감성 핫플을 한 번에 즐기는 **{city}** 쇼핑 & 미식 코스로 잡아드릴까요? 🛍️☕",
    suggestedChips: ["🛍️ K-뷰티 & 패션 쇼핑 핫플", "☕ 감성 카페 & 디저트 투어", "🚀 바로 일정 만들기"]
  },

  // ==========================================
  // 6. 단편 키워드 / 계절 / 동행 입력 포용 (SLOT_FRAGMENT)
  // ==========================================
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
      "겨울철"
    ],
    intentKeywords: ["겨울", "12월", "1월", "2월", "겨울철", "눈"],
    geminiAnswer: {
      ko: "눈부신 설경과 낭만이 가득한 **겨울철 {city:은/는}** 여행이시군요! ❄️ 혹시 몇 시쯤 어디(공항/터미널/KTX역)로 도착하시고, 숙소는 어디쯤이신가요? 😊",
      en: "Wonderful choice for a winter journey to **{city}**! ❄️ Around what time do you arrive, and where is your hotel stay located? 😊"
    },
    followUp: "도착 시간이나 숙소 위치를 말씀해 주시면 첫날부터 완벽한 동선으로 맞춰드릴게요! ✈️🏨",
    suggestedChips: ["☀️ 오전 도착 (12:00 이전)", "🌤️ 오후 도착 (14:00~16:00)", "🌙 저녁/밤 도착 (18:00 이후)", "🚀 바로 일정 만들기"]
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
      "친구랑"
    ],
    intentKeywords: ["아이 동반", "아이랑", "가족", "부모님", "커플", "친구"],
    geminiAnswer: {
      ko: "동행하시는 분들의 편안함과 즐거움을 최우선으로 고려하여 **{city:의}** 가장 안심되고 매력적인 명소들로 정성껏 코스를 맞춰드릴게요! 👨‍👩‍👧‍👦✨",
      en: "We will tailor the best spots in **{city}** ensuring maximum comfort and joy for your travel companions! 👨‍👩‍👧‍👦✨"
    },
    followUp: "원하시는 여행 기간(1박2일, 2박3일 등)이나 선호하시는 스타일을 말씀해 주시면 일정을 바로 완성해 드려요! ✈️🌸",
    suggestedChips: ["🗓️ 1박 2일", "🗓️ 2박 3일", "🗓️ 3박 4일", "🚀 바로 일정 만들기"]
  }
];
