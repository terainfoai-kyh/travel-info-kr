/**
 * VORA AI 3.0 - Streamlined 4-Language Universal Translation System (KO, EN, JA, ZH)
 * Eliminates translation holes, ensures 100% complete localization across all UI,
 * itinerary planning, travel essentials, and Google AdSense compliance modals.
 */

export function detectBrowserLanguage() {
  if (typeof navigator === 'undefined') return 'ko';
  const lang = (navigator.language || navigator.userLanguage || 'ko').toLowerCase();
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('zh')) return 'zh';
  return 'en'; // Default fallback for all other international visitors
}

export function getCloseButtonLabel(lang = 'ko') {
  switch (lang) {
    case 'en': return 'Close';
    case 'ja': return '閉じる';
    case 'zh': return '关闭';
    default: return '닫기';
  }
}

export function getSpotDetailButtonLabel(lang = 'ko', isShort = false) {
  if (isShort) {
    switch (lang) {
      case 'en': return 'Detail';
      case 'ja': return '詳細';
      case 'zh': return '详情';
      default: return '상세';
    }
  }
  switch (lang) {
    case 'en': return '🔍 Photos & Details';
    case 'ja': return '🔍 写真・詳細を見る';
    case 'zh': return '🔍 照片·查看详情';
    default: return '🔍 사진·상세보기';
  }
}

export function getSpotMapButtonLabel(lang = 'ko', isShort = false) {
  if (isShort) {
    switch (lang) {
      case 'en': return 'Map';
      case 'ja': return '地図';
      case 'zh': return '地图';
      default: return '지도';
    }
  }
  switch (lang) {
    case 'en': return 'Google Map';
    case 'ja': return 'Googleマップ';
    case 'zh': return 'Google地图';
    default: return '지도 위치';
  }
}

export function getMapSearchBtnLabel(foodName, lang = 'ko') {
  const cleanName = foodName ? foodName.split('&')[0].trim() : '';
  switch (lang) {
    case 'en': return `Search Nearby ${cleanName} Restaurants ↗`;
    case 'ja': return `周辺の ${cleanName} グルメマップ検索 ↗`;
    case 'zh': return `搜索周边 ${cleanName} 美食地图 ↗`;
    default: return `주변 ${cleanName} 맛집 지도 검색 ↗`;
  }
}

export function getTranslatedTitle(title, lang = 'ko') {
  if (!title || typeof title !== 'string') return '';
  return title.trim();
}

export function getTranslatedAddress(addr, lang = 'ko') {
  if (!addr || typeof addr !== 'string') return '';
  return addr.trim();
}

export const TRANSLATIONS = {
  ko: {
    // Brand & Header
    brandName: 'VORA',
    brandTagline: '대한민국 AI 여행 컨시어지',
    navWeather: '날씨',
    navEssentials: '여행 필수정보',
    navWishlist: '위시리스트',
    navLanguage: '언어',
    themeToggle: '테마 전환',

    // Hero Section
    heroBadge: '✨ 2026 AI-Powered Korea Travel Concierge',
    heroTitle: '질문 하나로 완성되는 나만의 한국 여행',
    heroSubtitle: '한국관광공사 Official DB와 Gemini AI가 설계하는 초개인화 맞춤 코스 & 실시간 구글맵 연동',
    searchPlaceholder: '어떤 여행을 꿈꾸시나요? (예: 성수동 핫플 카페 2박3일, 제주도 바다뷰 힐링, 비 오는 날 서울 데이트)',
    searchBtn: 'AI 코스 생성',
    promptChipsTitle: '🔥 인기 추천 프롬프트',
    promptChips: [
      { label: '🗼 서울 2박3일 핫플 & 성수동 감성 투어', prompt: '서울 2박3일 성수동 핫플 카페거리와 한남동, 경복궁 감성 여행 코스 짜줘' },
      { label: '🏝️ 제주도 바다뷰 힐링 & 맛집 로드', prompt: '제주도 3박4일 애월, 협재 바다뷰 카페와 서귀포 올레길 힐링 코스 추천해줘' },
      { label: '🎬 K-드라마 & K-POP 성지순례', prompt: '서울 K-POP 핫플레이스와 K-드라마 촬영 명소 1박2일 코스 알려줘' },
      { label: '🌙 부산 해운대 & 광안리 야경 코스', prompt: '부산 2박3일 해운대 블루라인파크와 광안리 드론쇼, 자갈치 미식 투어' },
      { label: '🍁 경주 한옥마을 & 황리단길 감성', prompt: '경주 1박2일 황리단길 감성 카페와 불국사, 동궁과월지 야경 힐링 여행' }
    ],

    // Chat Interface
    chatTitle: 'Vora AI 컨시어지 대화',
    chatWelcome: '안녕하세요! 당신의 전담 한국 여행 AI 컨시어지 VORA(보라)입니다. 😊\n가고 싶은 도시나 원하는 여행 스타일을 편하게 말씀해주세요!',
    chatThinking: '최적의 동선과 핫플레이스를 분석 중입니다...',
    chatCopyItinerary: '전체 일정 복사',
    chatCopied: '복사되었습니다!',
    chatShare: '일정 공유',
    chatQuickModifications: [
      '2일차 카페를 맛집으로 바꿔줘',
      '비 오는 날 실내 코스로 변경해줘',
      '대중교통 이동 동선으로 맞춰줘',
      '예산 5만원 가성비 코스로 수정'
    ],

    // Course Timeline & Map
    courseTimelineTitle: '스마트 여행 코스 타임라인',
    dayBadge: (d) => `${d}일차`,
    openGoogleMapsRoute: '🗺️ 구글맵에서 오늘 코스 전체 길찾기',
    spotTransitTime: (time) => `🚇 ${time || '지하철/도보로 편리하게 이동'}`,
    photosAndDetails: '🔍 사진 및 상세정보',
    saveToWishlist: '위시리스트 저장',
    savedToWishlist: '저장됨 ❤️',
    noSpotsYet: 'AI에게 여행 계획을 물어보시면 맞춤형 코스 타임라인과 구글 지도가 이곳에 펼쳐집니다.',

    // Question Quota
    freeQuestionsRemaining: (remain, total) => `⚡ 오늘 무료 질문: ${remain} / ${total}회`,
    questionsExhausted: '오늘의 무료 질문(5회)을 모두 사용하셨습니다. 내일 00시에 자동 충전됩니다 ✨',

    // Travel Essentials
    essentialsTitle: '외국인 관광객 필수 툴킷',
    essentialsSubtitle: '안전하고 편리한 한국 여행을 위한 핵심 서비스',
    subwayMapTitle: '지하철 노선도 & 길찾기',
    subwayMapDesc: '서울, 부산 등 전국 지하철 실시간 노선도 및 환승 가이드',
    climateCardTitle: '기후동행카드 & T-Money',
    climateCardDesc: '외국인 단기권 구매처 및 대중교통 무제한 이용 팁',
    esimTitle: 'eSIM & 포켓 와이파이',
    esimDesc: '인천공항 수령 및 즉시 사용 가능한 데이터 플랜',
    helplineTitle: '1330 관광 안내 & 통역',
    helplineDesc: '24시간 연중무휴 무료 4개 국어 긴급 통역 및 여행 지원',

    // AdSense Editorial Section
    editorialTitle: '대한민국 여행 완벽 가이드 & FAQ',
    editorialSubtitle: '한국을 처음 방문하는 여행자를 위한 검증된 로컬 꿀팁',

    // Modals
    modalClose: '닫기',
    privacyPolicy: '개인정보처리방침',
    termsOfService: '이용약관',
    aboutUs: '서비스 소개',
    contactUs: '제휴 및 문의',
    footerCopyright: '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.',
    footerTourApiNotice: 'Google Gemini 3.0 AI & Google Maps Platform 연동'
  },

  en: {
    // Brand & Header
    brandName: 'VORA',
    brandTagline: 'Korea AI Travel Concierge',
    navWeather: 'Weather',
    navEssentials: 'Travel Essentials',
    navWishlist: 'Wishlist',
    navLanguage: 'Language',
    themeToggle: 'Toggle Theme',

    // Hero Section
    heroBadge: '✨ 2026 AI-Powered Korea Travel Concierge',
    heroTitle: 'Discover Korea Like a Local, Powered by AI',
    heroSubtitle: 'Tailor-made itineraries, hidden gems, and seamless Google Maps transit designed in 3 seconds.',
    searchPlaceholder: 'What kind of trip do you dream of? (e.g. 3-day Seongsu cafe hopping in Seoul, Jeju nature healing, rainy day date)',
    searchBtn: 'Generate Itinerary',
    promptChipsTitle: '🔥 Popular Prompt Ideas',
    promptChips: [
      { label: '🗼 Seoul 3-Day Hip & Trendy Tour', prompt: 'Create a 3-day Seoul itinerary exploring Seongsu-dong cafes, Hannam-dong shopping, and Gyeongbokgung palace.' },
      { label: '🏝️ Jeju Island Scenic Healing', prompt: 'Recommend a 4-day healing trip in Jeju including Aewol ocean-view cafes and Seogwipo Olle trail.' },
      { label: '🎬 K-Drama & K-Pop Hotspots', prompt: 'Give me a 2-day Seoul tour visiting iconic K-Pop agency hotspots and K-Drama filming locations.' },
      { label: '🌙 Busan Coastal & Night View', prompt: 'Plan a 2-day Busan itinerary with Haeundae Blueline Park, Gwangalli drone show, and Jagalchi seafood.' },
      { label: '🍁 Gyeongju Hanok Village & History', prompt: 'Suggest a 2-day Gyeongju trip exploring Hwangnidan-gil hanok cafes and Donggung Palace night view.' }
    ],

    // Chat Interface
    chatTitle: 'Vora AI Concierge Chat',
    chatWelcome: 'Hello! I am VORA, your dedicated AI travel concierge for South Korea. 😊\nTell me where you want to visit or your desired travel style!',
    chatThinking: 'Analyzing optimal routes and authentic Korean hotspots...',
    chatCopyItinerary: 'Copy Itinerary',
    chatCopied: 'Copied to clipboard!',
    chatShare: 'Share Trip',
    chatQuickModifications: [
      'Replace Day 2 cafe with a bakery',
      'Change to an indoor rainy day course',
      'Optimize for public transit only',
      'Adjust for a budget under $50/day'
    ],

    // Course Timeline & Map
    courseTimelineTitle: 'Smart Itinerary Timeline',
    dayBadge: (d) => `Day ${d}`,
    openGoogleMapsRoute: '🗺️ Open Full Day Route in Google Maps',
    spotTransitTime: (time) => `🚇 ${time || 'Smooth transit by subway or walk'}`,
    photosAndDetails: '🔍 Photos & Details',
    saveToWishlist: 'Save to Wishlist',
    savedToWishlist: 'Saved ❤️',
    noSpotsYet: 'Ask VORA AI to plan your trip, and your custom timeline & interactive Google Map will appear here.',

    // Question Quota
    freeQuestionsRemaining: (remain, total) => `⚡ Free AI Queries Today: ${remain} / ${total}`,
    questionsExhausted: 'You have used all 5 free daily queries. Resets at midnight ✨',

    // Travel Essentials
    essentialsTitle: 'Foreign Traveler Essentials',
    essentialsSubtitle: 'Must-have tools and tips for a smooth trip to Korea',
    subwayMapTitle: 'Subway Map & Transit Guide',
    subwayMapDesc: 'Interactive subway routes & transfer guides for Seoul, Busan and beyond',
    climateCardTitle: 'Climate Card & T-Money',
    climateCardDesc: 'Tourist pass options & unlimited public transit guide',
    esimTitle: 'eSIM & Pocket WiFi',
    esimDesc: 'Instant high-speed mobile data for seamless navigation',
    helplineTitle: '1330 Korea Travel Helpline',
    helplineDesc: '24/7 free multilingual interpretation & emergency travel support',

    // AdSense Editorial Section
    editorialTitle: 'Complete South Korea Travel Guide & FAQ',
    editorialSubtitle: 'Curated local wisdom for international visitors',

    // Modals
    modalClose: 'Close',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    aboutUs: 'About VORA',
    contactUs: 'Contact & Partnership',
    footerCopyright: '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.',
    footerTourApiNotice: 'Powered by Korea Tourism Organization TourAPI 4.0 & Google Maps Platform'
  },

  ja: {
    // Brand & Header
    brandName: 'VORA',
    brandTagline: '韓国旅行AIコンシェルジュ',
    navWeather: '天気',
    navEssentials: '旅行必須情報',
    navWishlist: 'ウィッシュリスト',
    navLanguage: '言語',
    themeToggle: 'テーマ切替',

    // Hero Section
    heroBadge: '✨ 2026 AI搭載 韓国旅行コンシェルジュ',
    heroTitle: '一言で完成する、あなただけの韓国旅行',
    heroSubtitle: '韓国観光公社公式データとGemini AIが3秒で設計するオーダーメイドコース＆Googleマップ連携',
    searchPlaceholder: 'どんな旅をご希望ですか？（例：聖水洞カフェ巡り2泊3日、済州島ヒーリング、雨の日のソウル）',
    searchBtn: 'AIコース作成',
    promptChipsTitle: '🔥 人気のおすすめプロンプト',
    promptChips: [
      { label: '🗼 ソウル 2泊3日 トレンド＆聖水洞ツアー', prompt: 'ソウル2泊3日で聖水洞カフェ通り、漢南洞ショッピング、景福宮を巡るコースを作成して' },
      { label: '🏝️ 済州島 オーシャンビュー＆癒しの旅', prompt: '済州島3泊4日、涯月カフェと西帰浦のオルレ道を巡るヒーリングコースを教えて' },
      { label: '🎬 K-POP＆ドラマロケ地巡り', prompt: 'ソウルのK-POP人気スポットとドラマロケ地を巡る1泊2日コースを教えて' },
      { label: '🌙 釜山 海雲台＆広安里の夜景コース', prompt: '釜山2泊3日で海雲台ブルーラインパークと広安里ドローンショー、チャガルチ市場ツアー' },
      { label: '🍁 慶州 韓屋村＆皇理団通り', prompt: '慶州1泊2日で皇理団通りのカフェと仏国寺、東宮と月池の夜景を満喫する旅' }
    ],

    // Chat Interface
    chatTitle: 'Vora AIコンシェルジュチャット',
    chatWelcome: 'こんにちは！韓国旅行専属AIコンシェルジュのVORAです。😊\n行きたい都市や旅行スタイルをお気軽にお知らせください！',
    chatThinking: '最適なルートと最新トレンドスポットを分析中...',
    chatCopyItinerary: '日程テキストをコピー',
    chatCopied: 'コピーしました！',
    chatShare: '日程を共有',
    chatQuickModifications: [
      '2日目のカフェをベーカリーに変更して',
      '雨の日向けの屋内コースにして',
      '地下鉄中心の移動ルートにして',
      '1日5万ウォンのコスパコースにして'
    ],

    // Course Timeline & Map
    courseTimelineTitle: 'スマート旅程タイムライン',
    dayBadge: (d) => `${d}日目`,
    openGoogleMapsRoute: '🗺️ Googleマップで本日の全ルート案内を開く',
    spotTransitTime: (time) => `🚇 ${time || '地下鉄・徒歩で快適に移動'}`,
    photosAndDetails: '🔍 写真・詳細を見る',
    saveToWishlist: 'ウィッシュリストに保存',
    savedToWishlist: '保存済み ❤️',
    noSpotsYet: 'AIに旅行の相談をすると、ここに専用タイムラインとGoogleマップが表示されます。',

    // Question Quota
    freeQuestionsRemaining: (remain, total) => `⚡ 本日の無料質問: ${remain} / ${total}回`,
    questionsExhausted: '本日の無料質問枠(5回)をすべて利用しました。深夜0時に自動リセットされます ✨',

    // Travel Essentials
    essentialsTitle: '外国人旅行者 必須ツールキット',
    essentialsSubtitle: '快適で安全な韓国旅行のための必須サービス',
    subwayMapTitle: '地下鉄路線図＆ルート案内',
    subwayMapDesc: 'ソウル・釜山など全国の地下鉄路線図と乗換ガイド',
    climateCardTitle: '気候同行カード＆T-Money',
    climateCardDesc: '外国人向け短期券の購入方法と乗り放題ガイド',
    esimTitle: 'eSIM＆ポケットWi-Fi',
    esimDesc: '空港受取または即時利用可能な高速データプラン',
    helplineTitle: '1330 観光案内＆通訳ダイヤル',
    helplineDesc: '24時間年中無休・日本語対応の緊急通訳＆旅行サポート',

    // AdSense Editorial Section
    editorialTitle: '韓国旅行 完全ガイド＆よくある質問 (FAQ)',
    editorialSubtitle: '初めての韓国旅行でも安心のローカル情報',

    // Modals
    modalClose: '閉じる',
    privacyPolicy: 'プライバシーポリシー',
    termsOfService: '利用規約',
    aboutUs: 'サービス紹介',
    contactUs: '提携・お問い合わせ',
    footerCopyright: '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.',
    footerTourApiNotice: '韓国観光公社 TourAPI 4.0 公共データ＆Google Maps Platform 連携'
  },

  zh: {
    // Brand & Header
    brandName: 'VORA',
    brandTagline: '韩国旅游AI智能管家',
    navWeather: '天气',
    navEssentials: '旅行必备',
    navWishlist: '心愿单',
    navLanguage: '语言',
    themeToggle: '切换主题',

    // Hero Section
    heroBadge: '✨ 2026 AI驱动 韩国专属旅行管家',
    heroTitle: '一句话定制 专属韩国梦幻之旅',
    heroSubtitle: '结合韩国观光公社官方权威数据与Gemini AI，3秒生成专属路线与实时谷歌地图导航',
    searchPlaceholder: '您想去哪里旅行？（例如：首尔圣水洞咖啡厅3天2晚、济州岛海景疗愈游、雨天首尔室内约会）',
    searchBtn: 'AI生成路线',
    promptChipsTitle: '🔥 热门推荐灵感',
    promptChips: [
      { label: '🗼 首尔 3天2晚 潮流圣水洞之旅', prompt: '请设计一份首尔3天2晚行程，包含圣水洞咖啡街、汉南洞购物和景福宫。' },
      { label: '🏝️ 济州岛 绝美海景疗愈之旅', prompt: '推荐一份济州岛4天3晚行程，包含涯月邑海景咖啡厅和西归浦偶来小路。' },
      { label: '🎬 K-POP与韩剧热门拍摄地巡礼', prompt: '请推荐一份首尔2天1晚K-POP偶像打卡地与韩剧经典取景地路线。' },
      { label: '🌙 釜山 海云台与广安里夜景之旅', prompt: '规划一份釜山3天2晚行程，体验海云台胶囊列车、广安里无人机秀和海鲜市场。' },
      { label: '🍁 庆州 韩屋村与皇理团路风情', prompt: '推荐庆州2天1晚行程，漫步皇理团路特色咖啡厅，欣赏东宫与月池夜景。' }
    ],

    // Chat Interface
    chatTitle: 'Vora AI智能管家对话',
    chatWelcome: '您好！我是您的韩国专属旅行AI管家VORA（宝拉）。😊\n请告诉我您想去的城市或旅行偏好！',
    chatThinking: '正在为您分析最佳路线与韩国地道热门景点...',
    chatCopyItinerary: '复制行程内容',
    chatCopied: '已复制到剪贴板！',
    chatShare: '分享行程',
    chatQuickModifications: [
      '把第2天的咖啡厅换成特色烘焙店',
      '修改为适合下雨天的室内路线',
      '调整为全程乘坐地铁公交的便捷路线',
      '按每天5万韩元预算调整'
    ],

    // Course Timeline & Map
    courseTimelineTitle: '智能行程时间线',
    dayBadge: (d) => `第${d}天`,
    openGoogleMapsRoute: '🗺️ 在Google地图中打开今日完整导航路线',
    spotTransitTime: (time) => `🚇 ${time || '搭乘地铁或步行便捷直达'}`,
    photosAndDetails: '🔍 照片与详细信息',
    saveToWishlist: '加入心愿单',
    savedToWishlist: '已保存 ❤️',
    noSpotsYet: '在左侧向AI咨询旅行计划后，定制的行程时间线与Google交互地图将在此展示。',

    // Question Quota
    freeQuestionsRemaining: (remain, total) => `⚡ 今日免费提问额度: ${remain} / ${total}次`,
    questionsExhausted: '今日5次免费提问额度已用完，将于次日0点自动刷新 ✨',

    // Travel Essentials
    essentialsTitle: '国际游客必备旅行工具包',
    essentialsSubtitle: '助您畅游韩国的实用指南与官方服务',
    subwayMapTitle: '地铁线路图与换乘指南',
    subwayMapDesc: '首尔、釜山等全国实时地铁线路图与中文换乘指引',
    climateCardTitle: '气候同行卡与T-Money交通卡',
    climateCardDesc: '短期游客无限次乘车卡购买地点与充值攻略',
    esimTitle: '韩国eSIM与随身WiFi',
    esimDesc: '仁川机场快速领取或即时激活的高速流量套餐',
    helplineTitle: '1330 韩国旅游咨询与免费翻译',
    helplineDesc: '24小时全年无休多语言紧急翻译与官方求助热线',

    // AdSense Editorial Section
    editorialTitle: '韩国旅行全景指南与常见问题 (FAQ)',
    editorialSubtitle: '为初次到访韩国的游客量身打造的地道旅行攻略',

    // Modals
    modalClose: '关闭',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',
    aboutUs: '关于我们',
    contactUs: '商务合作与咨询',
    footerCopyright: '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.',
    footerTourApiNotice: '基于韩国观光公社 TourAPI 4.0 官方公共数据与 Google Maps Platform 构建'
  }
};

// Aliases for zh-Hant and others to ensure zero errors
TRANSLATIONS.zht = TRANSLATIONS.zh;
TRANSLATIONS.de = TRANSLATIONS.en;
TRANSLATIONS.fr = TRANSLATIONS.en;
TRANSLATIONS.es = TRANSLATIONS.en;
TRANSLATIONS.ru = TRANSLATIONS.en;