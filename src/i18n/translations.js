export function detectBrowserLanguage() {
  if (typeof navigator === 'undefined') return 'ko';
  const lang = (navigator.language || navigator.userLanguage || 'ko').toLowerCase();
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.includes('tw') || lang.includes('hk') || lang.includes('hant')) return 'zht';
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('ru')) return 'ru';
  return 'ko';
}

export function getMapSearchBtnLabel(foodName, lang = 'ko') {
  const cleanName = foodName ? foodName.split('&')[0].trim() : '';
  switch (lang) {
    case 'en': return `Search Nearby ${cleanName} Restaurants ↗`;
    case 'ja': return `周辺の ${cleanName} グルメマップ検索 ↗`;
    case 'zh': return `搜索周边 ${cleanName} 美食地图 ↗`;
    case 'zht': return `搜尋周邊 ${cleanName} 美食地圖 ↗`;
    case 'de': return `Umgebende ${cleanName} Restaurants suchen ↗`;
    case 'fr': return `Rechercher les restaurants de ${cleanName} ↗`;
    case 'es': return `Buscar restaurantes de ${cleanName} cercanos ↗`;
    case 'ru': return `Поиск ресторанов ${cleanName} поблизости ↗`;
    default: return `주변 ${cleanName} 맛집 지도 검색 ↗`;
  }
}

export const TRANSLATIONS = {
  ko: {
    title: 'K-Travel AI | 대한민국 스마트 여행 가이드',
    subtitle: '✨ AI가 안내하는 실시간 날씨 · 맞춤 명소 · 맛집 & 코디',
    shareBtn: '여행 조건 공유',
    shareSuccessToast: '여행 조건 공유 링크가 클립보드에 복사되었습니다!',
    imagePreparing: '이미지 준비 중',
    travelKorea: '대한민국 여행 정보',
    navSpots: '추천 명소',
    navEssentials: '여행 필수템',
    navWeather: '실시간 날씨',
    navLifestyle: 'AI 맛집 & 코디',
    navMap: '구글 지도',
    lightMode: '라이트 모드',
    darkMode: '다크 모드',
    klookEsimBtn: 'Klook eSIM / 패스 ↗',
    kkdayActivityBtn: 'KKday 액티비티 ↗',
    aiLifestyleTitle: 'AI 맞춤 여행 라이프스타일 가이드',
    aiLifestyleSub: '선택하신 지역·날씨·연령·성별 조건을 분석하여 실시간 최적 음식과 코디를 제안합니다',
    foodTabLabel: '🍱 추천 맛집/음식',
    outfitTabLabel: '👔 날씨 맞춤 코디',
    outfitSearchBtn: '추천 코디 스타일 룩북 검색 ↗',
    essentialsTitle: '✈️ 한국 여행 필수 가이드 & 제휴 혜택',
    essentialsSub: 'eSIM, 교통패스, 최저가 호텔 예약까지 원스톱으로 준비하세요',
    essentialsBadge: '공식 제휴 할인가 적용',
    essentialsDetails: '혜택 상세 & 예약하기',
    esimTitle: '무제한 데이터 eSIM / SIM',
    esimTag: 'Klook 15% 할인',
    esimDesc: '한국 도착 즉시 개통되는 무제한 4G/5G 고속 데이터 SIM/eSIM',
    transitTitle: 'K-PASS & 공항철도 AREX',
    transitTag: '교통 필수 패스',
    transitDesc: '인천공항 직통열차 & 대한민국 전역 지하철/버스 통합 교통권',
    hotelTitle: '인기 지역 최고급 호텔 & 숙소',
    hotelTag: 'Agoda 최저가 보장',
    hotelDesc: '서울, 제주, 부산, 경주 한옥 등 인근 숙소 최대 75% 특별 할인가',
    taxfreeTitle: '택스 리펀 & 면세 쇼핑 팁',
    taxfreeTag: '환급 혜택 가이드',
    taxfreeDesc: '주요 백화점, 마트, 올리브영 즉시 면세(Tax Refund) 환급 방법',
    footerCopyright: '© 2026 대한민국 여행 정보 (K-Travel Explorer). koreatravel.cc & koreatravelsguide.com',
    footerAttribution: '한국관광공사 TourAPI 4.0 및 기상청 공공데이터 연동',
    aiFloatBadge: '3초 만에 1:1 맞춤 코스 완성!',
    aiFloatBtn: 'AI 코스 추천',
    aiCourseBtn: 'AI 코스 추천',
    wishlistBtn: '찜목록',
    copiedToast: '복사 완료!',
    partnerInquiryBtn: '제휴 & 광고 문의',
    partnerInquiryTitle: '📩 제휴 및 광고 / 입점 문의',
    partnerInquirySub: 'K-Travel AI 글로벌 방문자 대상 스폰서십, 제휴 마케팅 및 장소 입점 문의',
    partnerFormName: '성함 / 담당자명',
    partnerFormEmail: '이메일 주소',
    partnerFormType: '문의 유형',
    partnerTypeOption1: '스폰서십 & 광고 문의 (Sponsorship & Banner)',
    partnerTypeOption2: '장소 / 한옥 / 제휴 입점 문의 (Spot Listing)',
    partnerTypeOption3: '콘텐츠 & 유튜버/인플루언서 제휴 (Affiliate & Content)',
    partnerFormMessage: '문의 내용 (상세 내용 및 연락처)',
    partnerSubmitBtn: '문의 메시지 전송하기',
    partnerDirectEmailText: '또는 공식 이메일로 직접 문의해 주세요:',
    partnerCopyEmailBtn: '이메일 복사',
    partnerSuccessMessage: '제휴 문의가 성공적으로 접수되었습니다. 담당자가 확인 후 24시간 이내에 연락드리겠습니다!',
    // Travel Essentials
    essentialsTitle: '✈️ 한국 여행 필수 가이드 & 제휴 혜택',
    essentialsSub: 'eSIM, 교통패스, 최저가 호텔 예약까지 원스톱으로 준비하세요',
    essentialsBadge: '공식 제휴 할인가 적용',
    essentialsDetails: '혜택 상세 & 예약하기',
    esimTitle: '무제한 데이터 eSIM / SIM',
    esimTag: 'Klook 15% 할인',
    esimDesc: '한국 도착 즉시 개통되는 무제한 4G/5G 고속 데이터 SIM/eSIM',
    transitTitle: 'K-PASS & 공항철도 AREX',
    transitTag: '교통 필수 패스',
    transitDesc: '인천공항 직통열차 & 대한민국 전역 지하철/버스 통합 교통권',
    hotelTitle: '인기 지역 최고급 호텔 & 숙소',
    hotelTag: 'Agoda 최저가 보장',
    hotelDesc: '서울, 제주, 부산, 경주 한옥 등 인근 숙소 최대 75% 특별 할인가',
    taxfreeTitle: '택스 리펀 & 면세 쇼핑 팁',
    taxfreeTag: '환급 혜택 가이드',
    taxfreeDesc: '주요 백화점, 마트, 올리브영 즉시 면세(Tax Refund) 환급 방법',
    // Footer & Privacy Policy
    footerCopyright: '© 2026 대한민국 여행 정보 (K-Travel Explorer)',
    footerAttribution: '한국관광공사 TourAPI 4.0 및 기상청 공공데이터 연동',
    privacyPolicyTitle: '개인정보처리방침',
    privacyCloseBtn: '확인 및 닫기',
    privacySection1Title: '1. 수집하는 개인정보 항목 및 수집 방법',
    privacySection1Desc: '본 서비스는 별도의 회원가입 없이 이용 가능하며, 서비스 제공 및 품질 개선을 위해 웹 브라우저 쿠키(Cookie) 및 접근 기기 정보를 자동으로 수집할 수 있습니다.',
    privacySection2Title: '2. 구글 애드센스 (Google AdSense) 광고 및 쿠키 안내',
    privacySection2Desc: '본 웹사이트는 구글(Google)을 비롯한 제3자 광고 사업자의 맞춤형 광고(AdSense)를 게재할 수 있습니다. Google은 쿠키를 사용하여 사용자의 이전 방문 기록을 바탕으로 관련성 높은 광고를 표시합니다.',
    privacySection3Title: '3. 제휴 마케팅 (Affiliate Links) 안내',
    privacySection3Desc: '본 서비스는 아고다(Agoda), 클룩(Klook), KKday 등 파트너사의 제휴 링크를 포함하고 있으며, 방문자가 해당 링크를 통해 결제 시 당사는 소정의 수수료 보상을 받을 수 있습니다.',
    privacySection4Title: '4. 개인정보의 보유 및 이용 기간',
    privacySection4Desc: '원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.',
    langKo: '한국어 (KO)',
    langEn: '영어 (EN)',
    langJa: '일본어 (JA)',
    langZh: '중국어 간체 (ZH-CN)',
    langZht: '중국어 번체 (ZH-TW)',
    langDe: '독일어 (DE)',
    langFr: '프랑스어 (FR)',
    langEs: '스페인어 (ES)',
    langRu: '러시아어 (RU)',
    filterSummary: '조회 조건',
    keywordLabel: '키워드',
    searchTitle: '여행 맞춤 조건 입력',
    period: '여행 기간',
    keyword: '검색 키워드',
    keywordPlaceholder: '명소 이름, 도시, 태그(#일출, #데이트 등) 검색...',
    region: '여행 지역',
    theme: '여행 테마',
    age: '연령대',
    gender: '성별',
    arrange: '정렬 순서',
    arrangeO: '제목순 (가나다)',
    arrangeQ: '최근 수정일순',
    arrangeR: '최근 등록일순',
    apiServiceTypeLabel: '정보 조회 유형 (API 서비스 선택)',
    searchBtn: '실시간 맞춤 정보 조회',
    weatherTitle: '기상청 실시간 기후 정보',
    weatherTempLabel: '현재/단기 기온',
    weatherPopLabel: '강수확률',
    midTermTitle: '기상청 중기예보 전망 (3일 ~ 7일차 주간 기후 & 최고/최저 기온)',
    dayOffsetLabel: '일후 예보',
    tourTitle: '추천 한국 관광 명소',
    totalSpots: '총 {count}개',
    page: '페이지',
    foodTitle: '지역 & 시즌 맞춤 추천 음식',
    outfitTitle: '기후 & 여행조건 맞춤 드레스코드 / 복장',
    customConditionLabel: '맞춤 조건',
    mapTitle: '위치 지도 보기',
    viewOnGoogleMaps: 'Google 지도에서 크게 보기',
    noCoordinates: '지적 좌표 정보가 제공되지 않는 장소입니다.',
    countryBadge: '대한민국',
    detailTitle: '상세 정보',
    overviewLoading: '한국관광공사 공식 상세 정보를 불러오는 중입니다...',
    defaultOverview: '대한민국 관광공사 공식 등록 대표 명소입니다. 아름다운 풍경과 다양한 볼거리를 제공합니다.',
    officialWebsite: '공식 홈페이지 바로가기 (새창 팝업)',
    noOfficialWebsite: '등록된 공식 웹사이트 정보가 없습니다.',
    telInquiry: '전화 문의',
    hoursLabel: '운영 시간',
    hoursDefault: '09:00 - 18:00 (입장마감 17:00 / 매주 월요일 휴무)',
    contactLabel: '문의 전화',
    contactDefault: '관광안내콜센터 1330',
    websiteLabel: '공식 웹사이트',
    websiteLoading: '웹사이트 연결 정보 확인 중...',
    visitOfficialWebsite: '공식 홈페이지 방문하기',
    seasonLabel: '추천 방문 시즌',
    seasonDefault: '봄/가을 맑은 날 최적 (사계절 방문 가능)',
    highlightsTitle: '관광지 주요 하이라이트',
    highlightsBullets: [
      '한국관광공사 TourAPI 공식 인증 대표 명소',
      '지역 특색 미식 및 주변 로컬 감성 카페 연계 코스',
      '인생샷 포토 스팟 및 야경 뷰포인트 추천',
      '대중교통 및 주차 시설 완비 (가족/연인/나홀로 여행 최적)'
    ],
    galleryTitle: '관광지 갤러리',
    photosUnit: '장',
    mapSearchTitle: '위치 지도 및 길찾기',
    googleMapRoute: 'Google 지도에서 경로 보기',
    reviewsTitle: '방문객 후기 & 평점',
    reviewsUnit: '개 후기',
    writeReviewLabel: '한 줄 리뷰 작성하기',
    reviewPlaceholder: '이 명소에 대한 솔직한 후기를 남겨주세요...',
    submitReviewBtn: '리뷰 등록',
    ratingLabel: '평점 선택',
    authorLabel: '방문자',
    closeBtn: '닫기',
    savedBookmark: '보관함 저장됨',
    saveBookmark: '보관함에 저장',
    showAllReviews: '전체 리뷰 보기',
    hideReviews: '리뷰 접기',
    scoreSuffix: '점',
    koreaRecommendedTag: '관광공사추천',
    noSpots: '조회 조건에 해당하는 관광 명소가 없습니다. 다른 검색어로 찾아보세요.',
    detailModalHeader: '관광지 상세 정보',
    detailModalSub: '한국관광공사 TourAPI 4.0 실시간 검증 데이터',
    affiliateTitle: '파트너 혜택 및 주변 서비스',
    agodaHotelBtn: '주변 최저가 숙소 찾기 (아고다)',
    klookTicketBtn: '티켓 & eSIM 할인 (클룩/KKday)',
    tripHotelBtn: '호텔 & 항공 최저가 (트립닷컴)',
    esimBannerTitle: '✈️ 한국 여행 필수템: eSIM & K-PASS 할인 혜택',
    esimBannerSub: '한국 방문 외국인/여행객 전용 데이터 eSIM & K-Pass 즉시 발급',
    adSponsoredTag: '스폰서 파트너 / 광고',
    aiTrustBadgeTitle: '🔒 K-Travel AI 플래너의 약속',
    aiTrustBadgeDesc: '본 코스는 한국관광공사 Official DB를 기반으로 생성되며, 허위 정보 없이 카카오맵/구글맵 실제 경로와 100% 연동됩니다.',
    rainyModeLabel: '비 오는 날 (실내 코스)',
    swapSpotBtn: '다른 장소 추천 🔄',
    regenerateItineraryBtn: 'AI 코스 다시 추천 🔄',
    spotTitles: {
      '경복궁 & 근정전': '경복궁 & 근정전',
      '제주 성산일출봉': '제주 성산일출봉',
      '부산 해운대 블루라인파크': '부산 해운대 블루라인파크',
      '설악산 국립공원 권금성': '설악산 국립공원 권금성',
      '경주 동궁과 월지 (안압지)': '경주 동궁과 월지 (안압지)',
      '전주 한옥마을 경기전': '전주 한옥마을 경기전',
      '서울 N서울타워 & 남산공원': '서울 N서울타워 & 남산공원',
      '인천 송도 센트럴파크': '인천 송도 센트럴파크',
      '수원 화성 & 행리단길': '수원 화성 & 행리단길',
      '가가책방': '가가책방',
      '공주 산성시장': '공주 산성시장',
      '무령왕릉과 왕릉원': '무령왕릉과 왕릉원',
      '공산성': '공산성',
      '마곡사': '마곡사'
    },
    regions: {
      '전국': '전국', '서울': '서울', '부산': '부산', '제주': '제주', '인천': '인천',
      '강원': '강원', '경기': '경기', '경북': '경북', '경남': '경남', '전북': '전북',
      '전남': '전남', '충북': '충북', '충남': '충남', '대구': '대구', '대전': '대전',
      '광주': '광주', '울산': '울산', '세종': '세종', '한국': '대한민국'
    },
    genders: { '무관': '무관', '남성': '남성', '여성': '여성' },
    ages: { '전체': '전체', '10대': '10대', '20대': '20대', '30대': '30대', '40대': '40대', '50대이상': '50대 이상' },
    themes: {
      '전체': '전체', '관광': '관광', '자연/힐링': '자연/힐링', '역사/문화': '역사/문화',
      '미식/쇼핑': '미식/쇼핑', '액티비티/레저': '액티비티/레저', 'K-컬처/이벤트': 'K-컬처/이벤트',
      '숙박/호텔': '숙박/호텔', '쇼핑/명소': '쇼핑/명소', '축제': '축제/이벤트', '음식': '미식/음식',
      '전통식당': '전통식당', '디저트': '디저트/카페', '해산물': '해산물/회', '로컬별미': '로컬별미',
      '스트리트푸드': '길거리음식', '향토음식': '향토음식'
    },
    weatherMap: {
      '맑음': '맑음', '맑고 쾌청함': '맑고 쾌청함', '구름 조금': '구름 조금',
      '구름많음': '구름많음', '구름 많음': '구름 많음', '흐림': '흐림',
      '비': '비', '비/눈': '비 또는 눈', '눈': '눈', '소나기': '소나기'
    },
    apiServices: {
      'all': '전체 (모든 정보 서비스)',
      'area': '지역기반 관광 정보',
      'location': '위치기반 주변 관광 (내주변/반경)',
      'festival': '행사/축제 정보',
      'stay': '숙박/호텔 정보'
    }
  },
  en: {
    title: 'K-Travel AI | Korea Smart Travel Guide',
    subtitle: '✨ Real-time Weather, AI Spots, Food & Outfit Guide',
    shareBtn: 'Share Conditions',
    shareSuccessToast: 'Travel link copied to clipboard!',
    imagePreparing: 'Image Preparing',
    travelKorea: 'Korea Travel Info',
    navSpots: 'Top Spots',
    navEssentials: 'Essentials Hub',
    navWeather: 'Live Weather',
    navLifestyle: 'AI Food & Outfit',
    navMap: 'Google Map',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    klookEsimBtn: 'Klook eSIM / Pass ↗',
    kkdayActivityBtn: 'KKday Activities ↗',
    aiLifestyleTitle: 'AI Custom Travel Lifestyle Guide',
    aiLifestyleSub: 'Analyzes region, weather, age & gender to recommend real-time optimal food & outfits.',
    foodTabLabel: '🍱 Recommended Food & Dining',
    outfitTabLabel: '👔 Weather Outfits',
    outfitSearchBtn: 'Search Outfit Style Lookbook ↗',
    essentialsTitle: '✈️ Korea Travel Essentials & Partner Deals',
    essentialsSub: 'Get your eSIM, transit pass, and best rate hotels all in one place.',
    essentialsBadge: 'Official Affiliate Discount Applied',
    essentialsDetails: 'View Details & Book',
    esimTitle: 'Unlimited Data eSIM / SIM',
    esimTag: 'Klook 15% Off',
    esimDesc: 'High-speed 4G/5G native eSIM activated immediately upon arrival in Korea.',
    transitTitle: 'K-PASS & Airport Express AREX',
    transitTag: 'Essential Transit Pass',
    transitDesc: 'Incheon Airport Express Train & nationwide subway/bus integrated transit card.',
    hotelTitle: 'Top Hotels & Stays in Popular Cities',
    hotelTag: 'Agoda Best Price Guarantee',
    hotelDesc: 'Up to 75% off stays in Seoul, Jeju, Busan, Gyeongju Hanok, and more.',
    taxfreeTitle: 'Tax Refund & Duty Free Shopping Guide',
    taxfreeTag: 'Tax Free Guide',
    taxfreeDesc: 'Instant tax refund guide for major department stores, supermarkets, and Olive Young.',
    footerCopyright: '© 2026 Korea Travel Guide (K-Travel Explorer). koreatravel.cc & koreatravelsguide.com',
    footerAttribution: 'Powered by Korea Tourism Organization TourAPI 4.0 & KMA Weather Open Data',
    aiFloatBadge: '1:1 Custom Itinerary in 3s!',
    aiFloatBtn: 'AI Itinerary Generator',
    aiCourseBtn: 'AI Itinerary',
    wishlistBtn: 'Wishlist',
    copiedToast: 'Copied!',
    privacyPolicyTitle: 'Privacy Policy',
    privacyCloseBtn: 'Confirm & Close',
    privacySection1Title: '1. Collected Personal Information & Collection Method',
    privacySection1Desc: 'This service can be used without registration. Web browser cookies and device access information may be automatically collected for service delivery and quality improvement.',
    privacySection2Title: '2. Google AdSense Ads & Cookie Policy',
    privacySection2Desc: 'This website displays personalized ads from third-party ad vendors including Google AdSense. Google uses cookies to serve relevant ads based on users\' previous visits.',
    privacySection3Title: '3. Affiliate Marketing Disclosure',
    privacySection3Desc: 'This service contains affiliate links for partner services such as Agoda, Klook, and KKday. We may earn a small commission when visitors make bookings through these links.',
    privacySection4Title: '4. Data Retention & Destruction Period',
    privacySection4Desc: 'In principle, personal data is destroyed without delay once the purpose of collection and usage is fulfilled.',
    partnerInquiryBtn: 'Partner & Advertise',
    partnerInquiryTitle: '📩 Business & Partnership Inquiry',
    partnerInquirySub: 'Sponsorship, Banner Ad, and Spot Listing for K-Travel AI global visitors',
    partnerFormName: 'Name / Contact Person',
    partnerFormEmail: 'Email Address',
    partnerFormType: 'Inquiry Type',
    partnerTypeOption1: 'Sponsorship & Banner Ads',
    partnerTypeOption2: 'Spot & Accommodation Listing',
    partnerTypeOption3: 'Influencer & Content Partnership',
    partnerFormMessage: 'Message & Contact Details',
    partnerSubmitBtn: 'Send Inquiry',
    partnerDirectEmailText: 'Or contact us directly via email:',
    partnerCopyEmailBtn: 'Copy Email',
    partnerSuccessMessage: 'Your partnership inquiry has been submitted! Our team will get back to you within 24 hours.',
    // Travel Essentials
    essentialsTitle: '✈️ Korea Travel Essentials & Partner Deals',
    essentialsSub: 'One-stop prep for eSIM, transit pass & lowest hotel rates',
    essentialsBadge: 'Official Partner Discount Applied',
    essentialsDetails: 'View Deal & Book',
    esimTitle: 'Unlimited Data eSIM / SIM',
    esimTag: 'Klook 15% Off',
    esimDesc: 'Instant activation upon arrival in Korea with high-speed 4G/5G data',
    transitTitle: 'K-PASS & Airport Express AREX',
    transitTag: 'Transit Pass',
    transitDesc: 'Incheon Airport Express Train & all-in-one Korea subway/bus pass',
    hotelTitle: 'Top Hotels & Hanok Stays',
    hotelTag: 'Agoda Best Rate Guarantee',
    hotelDesc: 'Up to 75% off hotels & traditional Hanok stays in Seoul, Jeju, Busan, Gyeongju',
    taxfreeTitle: 'Tax Refund & Duty Free Shopping Tips',
    taxfreeTag: 'Refund Guide',
    taxfreeDesc: 'Instant Tax Refund guide for department stores, marts & Olive Young',
    // Footer & Privacy Policy
    footerCopyright: '© 2026 Korea Travel Info (K-Travel Explorer)',
    footerAttribution: 'Powered by Korea Tourism Organization TourAPI 4.0 & KMA Public Weather Data',
    privacyPolicyTitle: 'Privacy Policy',
    privacyCloseBtn: 'Confirm & Close',
    privacySection1Title: '1. Information Collected & Method',
    privacySection1Desc: 'This service requires no registration. Web browser cookies and device access logs may be collected automatically for service improvement.',
    privacySection2Title: '2. Google AdSense Ads & Cookie Disclosure',
    privacySection2Desc: 'This website displays third-party personalized advertisements including Google AdSense. Google uses cookies to serve relevant ads based on previous visits.',
    privacySection3Title: '3. Affiliate Marketing Links Disclosure',
    privacySection3Desc: 'This site contains affiliate links to partners like Agoda, Klook, and KKday. We may earn a small commission when bookings are completed via these links.',
    privacySection4Title: '4. Retention and Destruction of Data',
    privacySection4Desc: 'Personal data is destroyed immediately once the collection purpose has been fulfilled.',
    langKo: 'Korean (KO)',
    langEn: 'English (EN)',
    langJa: 'Japanese (JA)',
    langZh: 'Simplified Chinese (ZH-CN)',
    langZht: 'Traditional Chinese (ZH-TW)',
    langDe: 'German (DE)',
    langFr: 'French (FR)',
    langEs: 'Spanish (ES)',
    langRu: 'Russian (RU)',
    filterSummary: 'Filter Conditions',
    keywordLabel: 'Keyword',
    searchTitle: 'Custom Travel Conditions',
    period: 'Travel Period',
    keyword: 'Search Keyword',
    keywordPlaceholder: 'Search spot name, city, tag (#sunrise, #date)...',
    region: 'Region',
    theme: 'Travel Theme',
    age: 'Age Group',
    gender: 'Gender',
    arrange: 'Sort Order',
    arrangeO: 'Alphabetical (Title)',
    arrangeQ: 'Recently Updated',
    arrangeR: 'Recently Created',
    apiServiceTypeLabel: 'Information Type (API Service)',
    searchBtn: 'Search Travel Info',
    weatherTitle: 'KMA Real-time Weather Info',
    weatherTempLabel: 'Current / Short-term Temp',
    weatherPopLabel: 'Precipitation Prob.',
    midTermTitle: 'KMA 3-7 Day Mid-term Outlook (Weekly Climate & High/Low Temp)',
    dayOffsetLabel: 'Days Later',
    tourTitle: 'Recommended Attractions in Korea',
    totalSpots: 'Total {count} spots',
    page: 'Page',
    foodTitle: 'Recommended Regional & Seasonal Food',
    outfitTitle: 'Recommended Outfit & Dress Code',
    customConditionLabel: 'Filtered Conditions',
    mapTitle: 'Location Map',
    viewOnGoogleMaps: 'Open in Google Maps',
    noCoordinates: 'Location coordinates unavailable for this spot.',
    countryBadge: 'South Korea',
    detailTitle: 'Attraction Details',
    overviewLoading: 'Loading official details from KTO (Korea Tourism Organization)...',
    defaultOverview: 'Official registered attraction of Korea Tourism Organization. Offers scenic views and iconic cultural experiences.',
    officialWebsite: 'Visit Official Website ↗',
    noOfficialWebsite: 'No official website registered.',
    telInquiry: 'Tel Inquiry',
    hoursLabel: 'Operating Hours',
    hoursDefault: '09:00 - 18:00 (Last Entry 17:00 / Closed Mondays)',
    contactLabel: 'Contact / Hotline',
    contactDefault: 'Tourist Information Hotline 1330',
    websiteLabel: 'Official Website',
    websiteLoading: 'Checking website link...',
    visitOfficialWebsite: 'Visit Official Website',
    seasonLabel: 'Best Season to Visit',
    seasonDefault: 'Best on clear Spring/Autumn days (Open year-round)',
    highlightsTitle: 'Attraction Highlights',
    highlightsBullets: [
      'Officially certified landmark of Korea Tourism Organization TourAPI',
      'Connects with local specialty cuisine & trendy neighborhood cafes',
      'Recommended photo spots & breathtaking night view points',
      'Accessible by public transit & convenient parking (ideal for families, couples & solo travelers)'
    ],
    galleryTitle: 'Attraction Photo Gallery',
    photosUnit: ' photos',
    mapSearchTitle: 'Location Map & Route',
    googleMapRoute: 'View Route on Google Maps',
    reviewsTitle: 'Visitor Reviews & Ratings',
    reviewsUnit: ' reviews',
    writeReviewLabel: 'Write a Review',
    reviewPlaceholder: 'Write your honest review for this attraction...',
    submitReviewBtn: 'Submit Review',
    ratingLabel: 'Your Rating',
    authorLabel: 'Visitor',
    closeBtn: 'Close',
    savedBookmark: 'Saved',
    saveBookmark: 'Save to Bookmarks',
    showAllReviews: 'Show All Reviews',
    hideReviews: 'Hide Reviews',
    scoreSuffix: ' pts',
    koreaRecommendedTag: 'KTO Recommended',
    noSpots: 'No travel spots match your search criteria. Please try another keyword.',
    detailModalHeader: 'Attraction Details',
    detailModalSub: 'Verified real-time data from Korea Tourism Organization TourAPI 4.0',
    affiliateTitle: 'Partner Offers & Nearby Services',
    agodaHotelBtn: 'Search Nearby Hotels (Agoda)',
    klookTicketBtn: 'Book Passes & eSIM (Klook)',
    tripHotelBtn: 'Hotels & Flights (Trip.com)',
    esimBannerTitle: '✈️ Korea Travel Essential: Unlimited eSIM & K-PASS Discount',
    esimBannerSub: 'Instant delivery for Korea data eSIM & K-Pass for travelers',
    adSponsoredTag: 'Sponsored Partner / Ad',
    spotTitles: {
      '경복궁 & 근정전': 'Gyeongbokgung Palace & Geunjeongjeon',
      '제주 성산일출봉': 'Jeju Seongsan Ilchulbong Peak',
      '부산 해운대 블루라인파크': 'Haeundae Blueline Park (Busan)',
      '설악산 국립공원 권금성': 'Seoraksan National Park Gwongeumseong',
      '경주 동궁과 월지 (안압지)': 'Donggung Palace & Wolji Pond (Gyeongju)',
      '전주 한옥마을 경기전': 'Jeonju Hanok Village Gyeonggijeon',
      '서울 N서울타워 & 남산공원': 'N Seoul Tower & Namsan Park (Seoul)',
      '인천 송도 센트럴파크': 'Songdo Central Park (Incheon)',
      '수원 화성 & 행리단길': 'Suwon Hwaseong Fortress & Haengnidan-gil',
      '가가책방': 'Gaga Bookstore (Gongju)',
      '공주 산성시장': 'Gongju Sanseong Traditional Market',
      '무령왕릉과 왕릉원': 'Royal Tomb of King Muryeong',
      '공산성': 'Gongsanseong Fortress',
      '마곡사': 'Magoksa Temple'
    },
    regions: {
      '전국': 'Nationwide', '서울': 'Seoul', '부산': 'Busan', '제주': 'Jeju', '인천': 'Incheon',
      '강원': 'Gangwon', '경기': 'Gyeonggi', '경북': 'Gyeongbuk', '경남': 'Gyeongnam', '전북': 'Jeonbuk',
      '전남': 'Jeonnam', '충북': 'Chungbuk', '충남': 'Chungnam', '대구': 'Daegu', '대전': 'Daejeon',
      '광주': 'Gwangju', '울산': 'Ulsan', '세종': 'Sejong', '한국': 'South Korea'
    },
    genders: { '무관': 'Any', '남성': 'Male', '여성': 'Female' },
    ages: { '전체': 'All Ages', '10대': 'Teens (10s)', '20대': '20s', '30대': '30s', '40대': '40s', '50대이상': '50s & Above' },
    themes: {
      '전체': 'All', '관광': 'Sightseeing', '자연/힐링': 'Nature & Healing', '역사/문화': 'History & Culture',
      '미식/쇼핑': 'Food & Shopping', '액티비티/레저': 'Activity & Leisure', 'K-컬처/이벤트': 'K-Culture & Events',
      '숙박/호텔': 'Hotel & Stay', '쇼핑/명소': 'Shopping', '축제': 'Festival', '음식': 'Gourmet Food',
      '전통식당': 'Traditional Dining', '디저트': 'Dessert & Cafe', '해산물': 'Fresh Seafood', '로컬별미': 'Local Specialty',
      '스트리트푸드': 'Street Food', '향토음식': 'Regional Cuisine'
    },
    weatherMap: {
      '맑음': 'Clear / Sunny', '맑고 쾌청함': 'Sunny & Clear', '구름 조금': 'Partly Cloudy',
      '구름많음': 'Mostly Cloudy', '구름 많음': 'Mostly Cloudy', '흐림': 'Overcast',
      '비': 'Rain', '비/눈': 'Rain / Snow', '눈': 'Snow', '소나기': 'Shower'
    },
    apiServices: {
      'all': 'All Services (Full TourAPI)',
      'area': 'Area-based Tour Info',
      'location': 'Location-based Nearby Tour (Radius)',
      'festival': 'Events & Festivals Info',
      'stay': 'Stay & Hotel Info'
    }
  },
  ja: {
    title: '韓国旅行ガイド',
    subtitle: 'リアルタイム天気 · 観光スポット · グルメ & 服装ガイド',
    imagePreparing: '画像準備中',
    travelKorea: '韓国旅行ガイド',
    navSpots: 'おすすめ名所',
    navEssentials: '旅行必須アイテム',
    navWeather: 'リアルタイム天気',
    navLifestyle: 'AI グルメ＆コーデ',
    navMap: 'Googleマップ',
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',
    klookEsimBtn: 'Klook eSIM / パス ↗',
    kkdayActivityBtn: 'KKday アクティビティ ↗',
    aiLifestyleTitle: 'AI カスタム旅行ライフスタイルガイド',
    aiLifestyleSub: '地域・天気・年齢・性別条件を分析し、リアルタイムで最適なグルメとコーディネートをご提案します',
    foodTabLabel: '🍱 おすすめグルメ・料理',
    outfitTabLabel: '👔 天気おすすめコーデ',
    outfitSearchBtn: 'コーディネーションルックブック를検索 ↗',
    essentialsTitle: '✈️ 韓国旅行必須ガイド＆提携特典',
    essentialsSub: 'eSIM、交通パス、最安値ホテル予約までワンストップで準備',
    essentialsBadge: '公式提携割引適用',
    essentialsDetails: '詳細・予約はこちら',
    esimTitle: '無制限データ eSIM / SIM',
    esimTag: 'Klook 15% 割引',
    esimDesc: '韓国到着後すぐに開通する高速4G/5GネイティブeSIM/SIM',
    transitTitle: 'K-PASS ＆ 空港鉄道 AREX',
    transitTag: '交通必須パス',
    transitDesc: '仁川空港直通列車＆韓国全域の地下鉄・バス統合交通カード',
    hotelTitle: '人気エリアの高級ホテル＆宿泊施設',
    hotelTag: 'Agoda 最安値保証',
    hotelDesc: 'ソウル、済州、釜山、慶州の韓屋など近隣宿泊施設が最大75%OFF',
    taxfreeTitle: '免税・タックスリファンドショッピングのコツ',
    taxfreeTag: '払い戻しガイド',
    taxfreeDesc: '主要デパート、マート、オリーブヤングでの即時免税（Tax Refund）方法',
    footerCopyright: '© 2026 韓国旅行ガイド (K-Travel Explorer). koreatravel.cc & koreatravelsguide.com',
    footerAttribution: '韓国観光公社 TourAPI 4.0 および 気象庁オープンデータ連携',
    langKo: '韓国語 (KO)',
    langEn: '英語 (EN)',
    langJa: '日本語 (JA)',
    langZh: '中国語 簡体字 (ZH-CN)',
    langZht: '中国語 繁体字 (ZH-TW)',
    langDe: 'ドイツ語 (DE)',
    langFr: 'フランス語 (FR)',
    langEs: 'スペイン語 (ES)',
    langRu: 'ロシア語 (RU)',
    filterSummary: '検索条件',
    keywordLabel: 'キーワード',
    searchTitle: '旅行条件の入力',
    period: '旅行期間',
    keyword: '検索キーワード',
    keywordPlaceholder: 'スポット名、都市、タグ(#日の出、#デート等)...',
    region: '旅行地域',
    theme: 'テーマ',
    age: '年代',
    gender: '性別',
    arrange: '並び順',
    arrangeO: '五十音順 (タイトル)',
    arrangeQ: '更新日順',
    arrangeR: '登録日順',
    apiServiceTypeLabel: '情報タイプ (APIサービス)',
    searchBtn: 'リアルタイム情報検索',
    weatherTitle: '気象庁 リアルタイム気象情報',
    weatherTempLabel: '現在/短期気温',
    weatherPopLabel: '降水確率',
    midTermTitle: '気象庁 中期予報 (3〜7日目の週間気候 & 最高/最低気温)',
    dayOffsetLabel: '日後の予報',
    tourTitle: 'おすすめ韓国観光スポット',
    totalSpots: '全 {count} 件',
    page: 'ページ',
    foodTitle: '地域＆季節のおすすめグルメ',
    outfitTitle: '気候＆旅行条件に合わせたおすすめ服装',
    customConditionLabel: '検索条件',
    mapTitle: '位置マップを見る',
    viewOnGoogleMaps: 'Google マップで拡大表示',
    noCoordinates: '位置情報が提供されていない場所です。',
    countryBadge: '韓国',
    detailTitle: '観光スポット詳細',
    overviewLoading: '韓国観光公社(KTO)の公式詳細情報を読み込み中...',
    defaultOverview: '韓国観光公社公式登録の代表的観光スポットです。美しい風景と様々な見どころを提供します。',
    officialWebsite: '公式サイトへ行く ↗',
    noOfficialWebsite: '登録された公式サイト情報はありません。',
    telInquiry: '電話お問い合わせ',
    hoursLabel: '営業時間',
    hoursDefault: '09:00 - 18:00 (入場締切 17:00 / 毎週月曜日休館)',
    contactLabel: 'お問い合わせ',
    contactDefault: '観光案内コールセンター 1330',
    websiteLabel: '公式サイト',
    websiteLoading: 'ウェブサイト情報を確認中...',
    visitOfficialWebsite: '公式サイトへ行く',
    seasonLabel: 'おすすめの季節',
    seasonDefault: '春・秋の晴れた日が最適 (年中無休)',
    highlightsTitle: '見どころ・ハイライト',
    highlightsBullets: [
      '韓国観光公社TourAPI公式認定の代表的スポット',
      '地域の特色あるグルメや人気ローカルカフェの連動コース',
      '映え写真スポット＆夜景ビューポイントのオススメ',
      '公共交通機関アクセス＆駐車場完備（ファミリー・カップル・一人旅に最適）'
    ],
    galleryTitle: 'フォトギャラリー',
    photosUnit: '枚',
    mapSearchTitle: '位置マップ・アクセス',
    googleMapRoute: 'Google マップでルートを見る',
    reviewsTitle: '訪問者の口コミ・評価',
    reviewsUnit: '件のレビュー',
    writeReviewLabel: 'レビューを書く',
    reviewPlaceholder: 'この観光スポットのレビューを書いてください...',
    submitReviewBtn: 'レビューを投稿',
    ratingLabel: '評価を選択',
    authorLabel: '訪問者',
    closeBtn: '閉じる',
    savedBookmark: '保存済み',
    saveBookmark: 'ブックマークに保存',
    showAllReviews: 'すべてのレビューを見る',
    hideReviews: 'レビューを折りたたむ',
    scoreSuffix: '点',
    koreaRecommendedTag: '韓国観光公社おすすめ',
    noSpots: '検索条件に一致する観光スポットがありません。別のキーワードでお試しください。',
    detailModalHeader: '観光スポット詳細',
    detailModalSub: '韓国観光公社 TourAPI 4.0 リアルタイム検証データ',
    affiliateTitle: 'パートナー特典＆周辺サービス',
    agodaHotelBtn: '周辺の最安値ホテルを検索 (Agoda)',
    klookTicketBtn: 'チケット＆eSIM予約 (Klook)',
    tripHotelBtn: 'ホテル＆航空券 (Trip.com)',
    esimBannerTitle: '✈️ 韓国旅行の必需品：eSIM＆K-PASS割引特典',
    esimBannerSub: '旅行者向けデータ無制限eSIM＆K-Passの即時発行',
    adSponsoredTag: 'スポンサー / 広告',
    detailModalSub: '韓国観光公社 TourAPI 4.0 リアルタイム検証データ',
    shareBtn: '条件を共有',
    shareSuccessToast: '旅行条件の共有リンクがクリップボードにコピーされました！',
    privacyPolicyTitle: 'プライバシーポリシー',
    privacyCloseBtn: '確認して閉じる',
    privacySection1Title: '1. 収集する個人情報項目および収集方法',
    privacySection1Desc: '本サービスは会員登録なしで利用可能です。サービス提供および品質改善のため、Webブラウザのクッキー（Cookie）および端末アクセス情報を自動収集する場合があります。',
    privacySection2Title: '2. Google AdSense 広告およびクッキーに関するご案内',
    privacySection2Desc: '本ウェブサイトではGoogle AdSense等の第三者配信事業者のパーソナライズド広告を掲載する場合があります。Googleはクッキーを使用し、過去の訪問履歴に基づき関連性の高い広告を表示します。',
    privacySection3Title: '3. アフィリエイトマーケティング（提携リンク）のご案内',
    privacySection3Desc: '本サービスはAgoda、Klook、KKday等のパートナー企業のアフィリエイトリンクを含んでおり、ユーザーが当該リンク経由で予約された場合、当方は所定の報酬を受け取る場合があります。',
    privacySection4Title: '4. 個人情報の保有および利用期間',
    privacySection4Desc: '原則として、個人情報の収集および利用目的が達成された後は、該当情報を遅滞なく破棄いたします。',
    partnerInquiryBtn: '提携＆広告のお問い合わせ',
    partnerInquiryTitle: '📩 提携・広告・出店のお問い合わせ',
    partnerInquirySub: 'K-Travel AI グローバル訪問者向けスポンサーシップ、アフィリエイト、スポット出店のお問い合わせ',
    partnerFormName: 'お名前 / 担当者名',
    partnerFormEmail: 'メールアドレス',
    partnerFormType: 'お問い合わせタイプ',
    partnerTypeOption1: 'スポンサーシップ＆広告のお問い合わせ (Sponsorship & Banner)',
    partnerTypeOption2: 'スポット / 韓屋 / 提携出店のお問い合わせ (Spot Listing)',
    partnerTypeOption3: 'コンテンツ＆インフルエンサー提携 (Affiliate & Content)',
    partnerFormMessage: 'お問い合わせ内容 (詳細及び連絡先)',
    partnerSubmitBtn: 'お問い合わせを送信',
    partnerDirectEmailText: 'または公式メールにて直接お問い合わせください:',
    partnerCopyEmailBtn: 'メールをコピー',
    partnerSuccessMessage: 'お問い合わせが正常に受け付けられました。担当者より24時間以内にご連絡いたします！',
    essentialsTitle: '✈️ 韓国旅行の必需品ガイド＆パートナー特典',
    essentialsSub: 'eSIM、交通パス、最安値ホテル予約までワンストップで準備',
    essentialsBadge: '公式パートナー割引適用',
    essentialsDetails: '詳細と予約を見る',
    esimTitle: '無制限データ eSIM / SIM',
    esimTag: 'Klook 15%OFF',
    esimDesc: '韓国到着後すぐに使える高速4G/5G無制限データSIM/eSIM',
    transitTitle: 'K-PASS＆空港鉄道AREX',
    transitTag: '交通必須パス',
    transitDesc: '仁川空港直通列車＆韓国全域の地下鉄・バス統合交通カード',
    hotelTitle: '人気エリアの高級ホテル＆韓屋ステイ',
    hotelTag: 'Agoda 最安値保証',
    hotelDesc: 'ソウル、済州、釜山、慶州の韓屋など近隣宿泊施設が最大75%割引',
    taxfreeTitle: '免税(Tax Refund)＆ショッピングのコツ',
    taxfreeTag: '即時免税ガイド',
    taxfreeDesc: '主要百貨店、スーパー、オリーブヤングでの即時免税手続きガイド',
    aiFloatBadge: '3秒でオーダーメイドコース完成！',
    aiFloatBtn: 'AI コース推薦',
    aiCourseBtn: 'AI コース推薦',
    wishlistBtn: 'お気に入り',
    copiedToast: 'コピー完了！',
    kkdayTicketBtn: 'KKday アクティビティ予約',
    aiMatchingLabel: 'AI マッチング',
    spotTitles: {
      '경복궁 & 근정전': '景福宮 (キョンボックン) & 勤政殿',
      '제주 성산일출봉': '済州 城山日出峰 (ソンサンイルチュルボン)',
      '부산 해운대 블루라인파크': '海雲台 ブルーラインパーク (釜山)',
      '설악산 국립공원 권금성': '雪岳山 国立公園 権金城',
      '경주 동궁과 월지 (안압지)': '慶州 東宮と月池 (雁鴨池)',
      '전주 한옥마을 경기전': '全州 韓屋村 慶基殿',
      '서울 N서울타워 & 남산공원': 'Nソウルタワー ＆ 南山公園',
      '인천 송도 센트럴파크': '松島 セントラルパーク (仁川)',
      '수원 화성 & 행리단길': '水原 華城 ＆ 行理団路',
      '가가책방': 'ガガ本屋 (Gaga Bookstore)',
      '공주 산성시장': '公州 山城市場',
      '무령왕릉과 왕릉원': '武寧王陵と王陵園',
      '공산성': '公山城 (コンサンソン)',
      '마곡사': '麻谷寺 (マゴクサ)'
    },
    regions: {
      '전국': '全国', '서울': 'ソウル', '부산': '釜山 (プサン)', '제주': '済州 (チェジュ)', '인천': '仁川 (インチョン)',
      '강원': '江原 (カンウォン)', '경기': '京畿 (キョンギ)', '경북': '慶北', '경남': '慶南', '전북': '全北',
      '전남': '全南', '충북': '忠北', '충남': '忠南', '대구': '大邱 (대구)', '대전': '大田 (대전)',
      '광주': '光州 (광주)', '울산': '蔚山 (울산)', '세종': '世宗 (세종)', '한국': '韓国'
    },
    genders: { '무관': '指定なし', '남성': '男性', '여성': '女性' },
    ages: { '전체': '全年代', '10대': '10代', '20대': '20代', '30대': '30代', '40대': '40代', '50대이상': '50代以上' },
    themes: {
      '전체': '全テーマ', '관광': '観光', '자연/힐링': '自然＆ヒーリング', '역사/문화': '歴史＆文化',
      '미식/쇼핑': 'グルメ＆ショッピング', '액티비티/레저': 'アクティビティ＆レジャー', 'K-컬처/이벤트': 'K-カルチャー＆イベント',
      '숙박/호텔': 'ホテル＆宿泊', '쇼핑/명소': 'ショッピング', '축제': 'お祭り', '음식': 'グルメ',
      '전통식당': '伝統食堂', '디저트': 'デザート・カフェ', '해산물': '海鮮料理', '로컬별미': '郷土料理',
      '스트리트푸드': '屋台グルメ', '향토음식': '郷土料理'
    },
    weatherMap: {
      '맑음': '快晴', '맑고 쾌청함': '快晴', '구름 조금': '晴れ時々曇り',
      '구름많음': '曇りがち', '구름 많음': '曇りがち', '흐림': '曇り',
      '비': '雨', '비/눈': '雨または雪', '눈': '雪', '소나기': 'にわか雨'
    },
    apiServices: {
      'all': '全体 (すべての情報サービス)',
      'area': '地域別 観光情報',
      'location': '位置情報周辺観光 (周辺/半径)',
      'festival': 'イベント・お祭り情報',
      'stay': '宿泊・ホテル情報'
    }
  },
  zh: {
    title: '韩国旅游指南',
    subtitle: '实时天气 · 景点推荐 · 美食与服装指南',
    imagePreparing: '图片准备中',
    travelKorea: '韩国旅游指南',
    navSpots: '精选景点',
    navEssentials: '旅行必备',
    navWeather: '实时天气',
    navLifestyle: 'AI 美食与穿搭',
    navMap: '谷歌地图',
    lightMode: '浅色模式',
    darkMode: '深色模式',
    klookEsimBtn: 'Klook eSIM / 交通卡 ↗',
    kkdayActivityBtn: 'KKday 活动体验 ↗',
    aiLifestyleTitle: 'AI 定制旅行生活方式指南',
    aiLifestyleSub: '根据您选择的地区、天气、年龄和性别条件，实时推荐最佳美食和穿搭',
    foodTabLabel: '🍱 美食推荐',
    outfitTabLabel: '👔 天气穿搭',
    outfitSearchBtn: '搜索穿搭风格 Lookbook ↗',
    essentialsTitle: '✈️ 韩国旅行必备指南与优惠',
    essentialsSub: '一站式准备 eSIM、交通卡及超值酒店预订',
    essentialsBadge: '已应用官方合作优惠',
    essentialsDetails: '查看详情与预订',
    esimTitle: '无限流量 eSIM / SIM',
    esimTag: 'Klook 85折优惠',
    esimDesc: '抵韩即刻激活的高速4G/5G原生SIM/eSIM',
    transitTitle: 'K-PASS & 机场铁道 AREX',
    transitTag: '交通必备卡',
    transitDesc: '仁川机场直达列车及韩国全国地铁/公交一卡通',
    hotelTitle: '热门城市精选酒店与住宿',
    hotelTag: 'Agoda 最低价保证',
    hotelDesc: '首尔、济州、釜山、庆州韩屋等住宿享最高75%折扣',
    taxfreeTitle: '退税与免税购物指南',
    taxfreeTag: '退税指南',
    taxfreeDesc: '各大百货、超市、Olive Young 现场即时退税指南',
    footerCopyright: '© 2026 韩国旅游指南 (K-Travel Explorer). koreatravel.cc & koreatravelsguide.com',
    footerAttribution: '韩国旅游发展局 TourAPI 4.0 及 气象厅公共数据联动',
    langKo: '韩语 (KO)',
    langEn: '英语 (EN)',
    langJa: '日语 (JA)',
    langZh: '中文 简体 (ZH-CN)',
    langZht: '中文 繁体 (ZH-TW)',
    langDe: '德语 (DE)',
    langFr: '法语 (FR)',
    langEs: '西班牙语 (ES)',
    langRu: '俄语 (RU)',
    filterSummary: '筛选条件',
    keywordLabel: '关键词',
    searchTitle: '个性化旅游条件设置',
    period: '旅游日期',
    keyword: '搜索关键词',
    keywordPlaceholder: '搜索景点名称、城市、标签(#日出、#约会等)...',
    region: '旅游地区',
    theme: '旅游主题',
    age: '年龄段',
    gender: '性别',
    arrange: '排序方式',
    arrangeO: '按标题排序',
    arrangeQ: '按最近更新',
    arrangeR: '按最近注册',
    apiServiceTypeLabel: '查询类型 (API服务)',
    searchBtn: '查询实时个性化信息',
    weatherTitle: '气象厅实时气候信息',
    weatherTempLabel: '当前/短期气温',
    weatherPopLabel: '降水概率',
    midTermTitle: '气象厅中期预报 (3-7天周预报 & 最高/最低气温)',
    dayOffsetLabel: '天后预报',
    tourTitle: '韩国精选推荐景点',
    totalSpots: '共 {count} 个景点',
    page: '页码',
    foodTitle: '地区与季节特色美食推荐',
    outfitTitle: '气候与行程穿搭指南',
    customConditionLabel: '筛选条件',
    mapTitle: '查看位置地图',
    viewOnGoogleMaps: '在 Google 地图中查看',
    noCoordinates: '该景点暂未提供经纬度坐标。',
    countryBadge: '韩国',
    detailTitle: '景点详细信息',
    overviewLoading: '正在加载韩国旅游发展局(KTO)官方详细信息...',
    defaultOverview: '韩国旅游发展局官方登记代表景点，提供优雅风光与丰富文化体验。',
    officialWebsite: '访问官方网站 ↗',
    noOfficialWebsite: '暂无登记的官方网站信息。',
    telInquiry: '电话咨询',
    hoursLabel: '营业时间',
    hoursDefault: '09:00 - 18:00 (截止入场 17:00 / 每周一闭馆)',
    contactLabel: '咨询电话',
    contactDefault: '旅游咨询热线 1330',
    websiteLabel: '官方网站',
    websiteLoading: '正在确认网站链接...',
    visitOfficialWebsite: '访问官方网站',
    seasonLabel: '推荐游览季节',
    seasonDefault: '春秋晴天游览最佳 (全年开放)',
    highlightsTitle: '景点核心亮点',
    highlightsBullets: [
      '韩国旅游发展局TourAPI官方认证代表景点',
      '联动地方特色美食与周边特色文青咖啡馆路线',
      '推荐绝美打卡拍照点与迷人夜景观景点',
      '公共交通便利与停车设施完善（极度适合家庭、情侣与单人游）'
    ],
    galleryTitle: '景点图集',
    photosUnit: '张',
    mapSearchTitle: '位置地图与路线',
    googleMapRoute: '在 Google 地图中查看路线',
    reviewsTitle: '游客点评与评分',
    reviewsUnit: '条点评',
    writeReviewLabel: '撰写点评',
    reviewPlaceholder: '请输入您对该景点的真实点评...',
    submitReviewBtn: '提交点评',
    ratingLabel: '您的评分',
    authorLabel: '游客',
    closeBtn: '关闭',
    savedBookmark: '已收藏',
    saveBookmark: '收藏景点',
    showAllReviews: '查看全部点评',
    hideReviews: '收起点评',
    scoreSuffix: '分',
    koreaRecommendedTag: '韩国旅游局推荐',
    noSpots: '暂无符合条件的景点，请更换关键词重试。',
    detailModalHeader: '景点详细信息',
    detailModalSub: '韩国旅游发展局 TourAPI 4.0 实时验证数据',
    affiliateTitle: '合作优惠与周边服务',
    agodaHotelBtn: '搜索周边优惠酒店 (Agoda)',
    klookTicketBtn: '预订门票与eSIM (Klook)',
    tripHotelBtn: '酒店与机票 (Trip.com)',
    esimBannerTitle: '✈️ 韩国旅行必备：无限流量eSIM与K-PASS优惠',
    esimBannerSub: '面向赴韩游客的流量eSIM与交通卡即时提供',
    adSponsoredTag: '赞助商 / 广告',
    shareBtn: '分享行程条件',
    shareSuccessToast: '旅行条件分享链接已复制到剪贴板！',
    partnerInquiryBtn: '商务合作与广告',
    partnerInquiryTitle: '📩 商务合作 / 广告 / 入驻咨询',
    partnerInquirySub: '面向 K-Travel AI 全球访客的赞助、联盟营销及景点入驻咨询',
    partnerFormName: '姓名 / 联系人',
    partnerFormEmail: '电子邮箱',
    partnerFormType: '咨询类型',
    partnerTypeOption1: '赞助与广告咨询 (Sponsorship & Banner)',
    partnerTypeOption2: '景点 / 韩屋 / 合作入驻咨询 (Spot Listing)',
    partnerTypeOption3: '内容与网红/博主合作 (Affiliate & Content)',
    partnerFormMessage: '咨询内容 (详细信息及联系方式)',
    partnerSubmitBtn: '发送咨询信息',
    partnerDirectEmailText: '或通过官方邮箱直接联系我们:',
    partnerCopyEmailBtn: '复制邮箱',
    partnerSuccessMessage: '合作咨询已成功提交！我们的团队将在24小时内联系您。',
    essentialsTitle: '✈️ 韩国旅行必备指南与合作优惠',
    essentialsSub: '一站式准备 eSIM、交通卡与超值酒店预订',
    essentialsBadge: '已应用官方合作折扣',
    essentialsDetails: '查看优惠与预订',
    esimTitle: '无限流量 eSIM / SIM',
    esimTag: 'Klook 85折优惠',
    esimDesc: '抵韩即刻开通的高速4G/5G无限流量SIM/eSIM',
    transitTitle: 'K-PASS 与 机场快线 AREX',
    transitTag: '交通必备卡',
    transitDesc: '仁川机场直通列车与全韩地铁/公交通用交通卡',
    hotelTitle: '热门地区精选酒店与韩屋住宿',
    hotelTag: 'Agoda 最优价格保证',
    hotelDesc: '首尔、济州、釜山、庆州韩屋等周边住宿最高享2.5折优惠',
    taxfreeTitle: '退税与免税购物指南',
    taxfreeTag: '退税指南',
    taxfreeDesc: '大型百货、超市与 Olive Young 现场即时退税方法',
    shareBtn: '分享行程条件',
    shareSuccessToast: '行程分享链接已复制到剪贴板！',
    privacyPolicyTitle: '隐私政策',
    privacyCloseBtn: '确认并关闭',
    privacySection1Title: '1. 收集的个人信息项目及收集方法',
    privacySection1Desc: '本服务无需注册即可免费使用。为提供服务及改进质量，系统可能会自动收集网页浏览器 Cookie 及设备访问信息。',
    privacySection2Title: '2. 谷歌 Google AdSense 广告与 Cookie 说明',
    privacySection2Desc: '本网站可能会投放来自 Google 等第三方广告商的个性化广告 (AdSense)。Google 会使用 Cookie 根据用户以前的访问记录展示相关度较高的广告。',
    privacySection3Title: '3. 联盟营销 (Affiliate Links) 声明',
    privacySection3Desc: '本服务包含 Agoda、Klook、KKday 等合作伙伴的联盟营销链接。当访问者通过该链接完成预订付款时，本站可能会获得少许佣金报酬。',
    privacySection4Title: '4. 个人信息保留及销毁期限',
    privacySection4Desc: '原则上，在达到个人信息收集及使用目的后，相关信息将立即被销毁。',
    partnerInquiryBtn: '商务合作与广告',
    aiFloatBadge: '3秒快速生成专属推荐行程！',
    aiFloatBtn: 'AI 行程推荐',
    aiCourseBtn: 'AI 行程推荐',
    wishlistBtn: '收藏夹',
    copiedToast: '已复制！',
    kkdayTicketBtn: '预订 KKday 活动体验',
    aiMatchingLabel: 'AI 匹配',
    spotTitles: {
      '경복궁 & 근정전': '景福宫 & 勤政殿',
      '제주 성산일출봉': '济州 城山日出峰',
      '부산 해운대 블루라인파크': '釜山 海云台蓝线公园',
      '설악산 국립공원 권금성': '雪岳山 国家公园权金城',
      '경주 동궁과 월지 (안압지)': '庆州 东宫与月池 (雁鸭池)',
      '전주 한옥마을 경기전': '全州 韩屋村庆基殿',
      '서울 N서울타워 & 남산공원': 'N首尔塔 & 南山公园',
      '인천 송도 센트럴파크': '仁川 松岛中央公园',
      '수원 화성 & 행리단길': '水原 华城 & 行理团路',
      '가가책방': 'Gaga书店 (公州)',
      '공주 산성시장': '公州 山城传统市场',
      '무령왕릉과 왕릉원': '武宁王陵与王陵园',
      '공산성': '公山城',
      '마곡사': '麻谷寺'
    },
    regions: {
      '전국': '全国', '서울': '首尔', '부산': '釜山', '제주': '济州', '인천': '仁川',
      '강원': '江原', '경기': '京畿', '경북': '庆北', '경남': '庆南', '전북': '全北',
      '전남': '全南', '충북': '忠北', '충남': '忠南', '대구': '大邱', '대전': '大田',
      '광주': '光州', '울산': '蔚山', '세종': '世宗', '한국': '韩国'
    },
    genders: { '무관': '不限', '남성': '男性', '여성': '女性' },
    ages: { '전체': '不限', '10대': '10多岁', '20대': '20多岁', '30대': '30多岁', '40대': '40多岁', '50대이상': '50岁以上' },
    themes: {
      '전체': '全部', '관광': '观光景点', '자연/힐링': '自然与疗愈', '역사/문화': '历史与文化',
      '미식/쇼핑': '美食与购物', '액티비티/레저': '户外与休闲', 'K-컬처/이벤트': 'K-文化与活动',
      '숙박/호텔': '酒店与住宿', '쇼핑/명소': '购物景点', '축제': '庆典活动', '음식': '特色美食',
      '전통식당': '传统餐厅', '디저트': '甜品咖啡', '해산물': '海鲜刺身', '로컬별미': '地方风味',
      '스트리트푸드': '街头小吃', '향토음식': '乡土美食'
    },
    weatherMap: {
      '맑음': '晴朗', '맑고 쾌청함': '晴朗干爽', '구름 조금': '少云',
      '구름많음': '多云', '구름 많음': '多云', '흐림': '阴天',
      '비': '降雨', '비/눈': '雨夹雪', '눈': '降雪', '소나기': '阵雨'
    },
    apiServices: {
      'all': '全部 (所有信息服务)',
      'area': '基于地区的观光信息',
      'location': '基于位置的周边观光 (周边/半径)',
      'festival': '活动/庆典信息',
      'stay': '住宿/酒店信息'
    }
  },
  zht: {
    title: '韓國旅遊指南',
    subtitle: '實時天氣 · 景點推薦 · 美食與服裝指南',
    imagePreparing: '圖片準備中',
    travelKorea: '韓國旅遊指南',
    navSpots: '精選景點',
    navEssentials: '旅行必備',
    navWeather: '實時天氣',
    navLifestyle: 'AI 美食與穿搭',
    navMap: '谷歌地圖',
    lightMode: '淺色模式',
    darkMode: '深色模式',
    klookEsimBtn: 'Klook eSIM / 交通卡 ↗',
    kkdayActivityBtn: 'KKday 活動體驗 ↗',
    aiLifestyleTitle: 'AI 定制旅行生活方式指南',
    aiLifestyleSub: '根據您選擇的地區、天氣、年齡和性別條件，實時推薦最佳美食和穿搭',
    foodTabLabel: '🍱 美食推薦',
    outfitTabLabel: '👔 天氣穿搭',
    outfitSearchBtn: '搜尋穿搭風格 Lookbook ↗',
    essentialsTitle: '✈️ 韓國旅行必備指南與優惠',
    essentialsSub: '一站式準備 eSIM、交通卡及超值酒店預訂',
    essentialsBadge: '已應用官方合作優惠',
    essentialsDetails: '檢視詳情與預訂',
    esimTitle: '無限流量 eSIM / SIM',
    esimTag: 'Klook 85折優惠',
    esimDesc: '抵韓即刻激活的高速4G/5G原生SIM/eSIM',
    transitTitle: 'K-PASS & 機場鐵道 AREX',
    transitTag: '交通必備卡',
    transitDesc: '仁川機場直達列車及韓國全國地鐵/公車一卡通',
    hotelTitle: '熱門城市精選酒店與住宿',
    hotelTag: 'Agoda 最低價保證',
    hotelDesc: '首爾、濟州、釜山、慶州韓屋等住宿享最高75%折扣',
    taxfreeTitle: '退稅與免稅購物指南',
    taxfreeTag: '退稅指南',
    taxfreeDesc: '各大百貨、超市、Olive Young 現場即時退稅指南',
    footerCopyright: '© 2026 韓國旅遊指南 (K-Travel Explorer). koreatravel.cc & koreatravelsguide.com',
    footerAttribution: '韓國旅遊發展局 TourAPI 4.0 及 氣象廳公共數據聯動',
    langKo: '韓語 (KO)',
    langEn: '英語 (EN)',
    langJa: '日語 (JA)',
    langZh: '中文 簡體 (ZH-CN)',
    langZht: '中文 繁體 (ZH-TW)',
    langDe: '德語 (DE)',
    langFr: '法語 (FR)',
    langEs: '西班牙語 (ES)',
    langRu: '俄語 (RU)',
    filterSummary: '篩選條件',
    keywordLabel: '關鍵字',
    searchTitle: '個性化旅遊條件設定',
    period: '旅遊日期',
    keyword: '搜尋關鍵字',
    keywordPlaceholder: '搜尋景點名稱、城市、標籤(#日出、#約會等)...',
    region: '旅遊地區',
    theme: '旅遊主題',
    age: '年齡層',
    gender: '性別',
    arrange: '排序方式',
    arrangeO: '按標題排序',
    arrangeQ: '按最近更新',
    arrangeR: '按最近註冊',
    apiServiceTypeLabel: '查詢類型 (API服務)',
    searchBtn: '查詢實時個性化資訊',
    weatherTitle: '氣象廳實時氣候資訊',
    weatherTempLabel: '當前/短期氣溫',
    weatherPopLabel: '降雨機率',
    midTermTitle: '氣象廳中期預報 (3-7天週預報 & 最高/最低氣溫)',
    dayOffsetLabel: '天後預報',
    tourTitle: '韓國精選推薦景點',
    totalSpots: '共 {count} 個景點',
    page: '頁碼',
    foodTitle: '地區與季節特色美食推薦',
    outfitTitle: '氣候與行程穿搭指南',
    customConditionLabel: '篩選條件',
    mapTitle: '檢視位置地圖',
    viewOnGoogleMaps: '在 Google 地圖中檢視',
    noCoordinates: '該景點暫未提供經緯度座標。',
    countryBadge: '韓國',
    detailTitle: '景點詳細資訊',
    overviewLoading: '正在載入韓國觀光公社(KTO)官方詳細資訊...',
    defaultOverview: '韓國觀光公社官方登記代表景點，提供優雅風光與豐富文化體驗。',
    officialWebsite: '造訪官方網站 ↗',
    noOfficialWebsite: '暫無登記的官方網站資訊。',
    telInquiry: '電話諮詢',
    hoursLabel: '營業時間',
    hoursDefault: '09:00 - 18:00 (截止入場 17:00 / 每週一休館)',
    contactLabel: '諮詢電話',
    contactDefault: '旅遊諮詢熱線 1330',
    websiteLabel: '官方網站',
    websiteLoading: '正在確認網站連結...',
    visitOfficialWebsite: '造訪官方網站',
    seasonLabel: '推薦遊覽季節',
    seasonDefault: '春秋晴天遊覽最佳 (全年開放)',
    highlightsTitle: '景點核心亮點',
    highlightsBullets: [
      '韓國觀光公社TourAPI官方認證代表景點',
      '聯動地方特色美食與周邊特色文青咖啡館路線',
      '推薦絕美打卡拍照點與迷人夜景觀焦點',
      '公共交通便利與停車設施完善（極度適合家庭、情侶與單人遊）'
    ],
    galleryTitle: '景點圖集',
    photosUnit: '張',
    mapSearchTitle: '位置地圖與路線',
    googleMapRoute: '在 Google 地圖中檢視路線',
    reviewsTitle: '遊客點評與評分',
    reviewsUnit: '條點評',
    writeReviewLabel: '撰寫點評',
    reviewPlaceholder: '請輸入您對該景點的真實點評...',
    submitReviewBtn: '提交點評',
    ratingLabel: '您的評分',
    authorLabel: '遊客',
    closeBtn: '關閉',
    savedBookmark: '已收藏',
    saveBookmark: '收藏景點',
    showAllReviews: '檢視全部點評',
    hideReviews: '收起點評',
    scoreSuffix: '分',
    koreaRecommendedTag: '韓國觀光局推薦',
    noSpots: '暫無符合條件的景點，請更換關鍵字重試。',
    detailModalHeader: '景點詳細資訊',
    detailModalSub: '韓國觀光局 TourAPI 4.0 即時驗證資料',
    affiliateTitle: '合作優惠與週邊服務',
    agodaHotelBtn: '搜尋週邊優惠飯店 (Agoda)',
    klookTicketBtn: '預訂門票與eSIM (Klook)',
    tripHotelBtn: '飯店與機票 (Trip.com)',
    esimBannerTitle: '✈️ 韓國旅行必備：無限流量eSIM與K-PASS優惠',
    esimBannerSub: '面向赴韓遊客的流量eSIM與交通卡即時提供',
    adSponsoredTag: '贊助商 / 廣告',
    shareBtn: '分享行程條件',
    shareSuccessToast: '旅行條件分享連結已複製到剪貼簿！',
    partnerInquiryBtn: '商務合作與廣告',
    partnerInquiryTitle: '📩 商務合作 / 廣告 / 入駐諮詢',
    partnerInquirySub: '面向 K-Travel AI 全球訪客的贊助、聯盟營銷及景點入駐諮詢',
    partnerFormName: '姓名 / 聯絡人',
    partnerFormEmail: '電子郵件',
    partnerFormType: '諮詢類型',
    partnerTypeOption1: '贊助與廣告諮詢 (Sponsorship & Banner)',
    partnerTypeOption2: '景點 / 韓屋 / 合作入駐諮詢 (Spot Listing)',
    partnerTypeOption3: '內容與網紅/博主合作 (Affiliate & Content)',
    partnerFormMessage: '諮詢內容 (詳細資訊及聯絡方式)',
    partnerSubmitBtn: '發送諮詢資訊',
    partnerDirectEmailText: '或透過官方郵箱直接聯絡我們:',
    partnerCopyEmailBtn: '複製郵箱',
    partnerSuccessMessage: '合作諮詢已成功提交！我們的團隊將在24小時內聯絡您。',
    essentialsTitle: '✈️ 韓國旅行必備指南與合作優惠',
    essentialsSub: '一站式準備 eSIM、交通卡與超值飯店預訂',
    essentialsBadge: '已應用官方合作折扣',
    essentialsDetails: '查看優惠與預訂',
    esimTitle: '無限流量 eSIM / SIM',
    esimTag: 'Klook 85折優惠',
    esimDesc: '抵韓即刻開通的高速4G/5G無限流量SIM/eSIM',
    transitTitle: 'K-PASS 與 機場快線 AREX',
    transitTag: '交通必備卡',
    transitDesc: '仁川機場直通列車與全韓地鐵/公車通用交通卡',
    hotelTitle: '熱門地區精選飯店與韓屋住宿',
    hotelTag: 'Agoda 最佳價格保證',
    hotelDesc: '首爾、濟州、釜山、慶州韓屋等週邊住宿最高享2.5折優惠',
    taxfreeTitle: '退稅與免稅購物指南',
    taxfreeTag: '退稅指南',
    taxfreeDesc: '大型百貨、超市與 Olive Young 現場即時退稅方法',
    shareBtn: '分享行程條件',
    shareSuccessToast: '行程分享連結已複製到剪貼簿！',
    privacyPolicyTitle: '隱私政策',
    privacyCloseBtn: '確認並關閉',
    privacySection1Title: '1. 收集的個人資訊項目及收集方法',
    privacySection1Desc: '本服務無需註冊即可免費使用。為提供服務及改進品質，系統可能會自動收集網頁瀏覽器 Cookie 及設備存取資訊。',
    privacySection2Title: '2. Google AdSense 廣告與 Cookie 說明',
    privacySection2Desc: '本網站可能會投放來自 Google 等第三方廣告商的個性化廣告 (AdSense)。Google 會使用 Cookie 根據使用者以前的造訪紀錄展示相關度較高的廣告。',
    privacySection3Title: '3. 聯盟行銷 (Affiliate Links) 聲明',
    privacySection3Desc: '本服務包含 Agoda、Klook、KKday 等合作夥伴的聯盟行銷連結。當訪客透過該連結完成預訂付款時，本站可能會獲得少許傭金報酬。',
    privacySection4Title: '4. 個人資訊保留及銷毀期限',
    privacySection4Desc: '原則上，在達到個人資訊收集及使用目的後，相關資訊將立即被銷毀。',
    partnerInquiryBtn: '商務合作與廣告',
    aiFloatBadge: '3秒快速生成專屬推薦行程！',
    aiFloatBtn: 'AI 行程推薦',
    aiCourseBtn: 'AI 行程推薦',
    wishlistBtn: '收藏夾',
    copiedToast: '已複製！',
    kkdayTicketBtn: '預訂 KKday 活動體驗',
    aiMatchingLabel: 'AI 匹配',
    spotTitles: {
      '경복궁 & 근정전': '景福宮 & 勤政殿',
      '제주 성산일출봉': '濟州 城山日出峰',
      '부산 해운대 블루라인파크': '釜山 海雲臺藍線公園',
      '설악산 국립공원 권금성': '雪嶽山 國家公園權金城',
      '경주 동궁과 월지 (안압지)': '慶州 東宮與月池 (雁鴨池)',
      '전주 한옥마을 경기전': '全州 韓屋村慶基殿',
      '서울 N서울타워 & 남산공원': 'N首爾塔 & 南山公園',
      '인천 송도 센트럴파크': '仁川 松島中央公園',
      '수원 화성 & 행리단길': '水原 華城 & 行理團路',
      '가가책방': 'Gaga書店 (公州)',
      '공주 산성시장': '公州 山城傳統市場',
      '무령왕릉과 왕릉원': '武寧王陵與王陵園',
      '공산성': '公山城',
      '마곡사': '麻谷寺'
    },
    regions: {
      '전국': '全國', '서울': '首爾', '부산': '釜山', '제주': '濟州', '인천': '仁川',
      '강원': '江原', '경기': '京畿', '경북': '慶北', '경남': '慶南', '전북': '全北',
      '전남': '全南', '충북': '忠北', '충남': '忠南', '대구': '大邱', '대전': '大田',
      '광주': '光州', '울산': '蔚山', '세종': '世宗', '한국': '韓國'
    },
    genders: { '무관': '不限', '남성': '男性', '여성': '女性' },
    ages: { '전체': '不限', '10대': '10多歲', '20대': '20多歲', '30대': '30多歲', '40대': '40多歲', '50대이상': '50歲以上' },
    themes: {
      '전체': '全部', '관광': '觀光景點', '자연/힐링': '自然與療癒', '역사/문화': '歷史與文化',
      '미식/쇼핑': '美食與購物', '액티비티/레저': '戶外與休閒', 'K-컬처/이벤트': 'K-文化與活動',
      '숙박/호텔': '酒店與住宿', '쇼핑/명소': '購物景點', '축제': '慶典活動', '음식': '特色美食',
      '전통식당': '傳統餐廳', '디저트': '甜品咖啡', '해산물': '海鮮刺身', '로컬별미': '地方風味',
      '스트리트푸드': '街頭小吃', '향토음식': '鄉土美食'
    },
    weatherMap: {
      '맑음': '晴朗', '맑고 쾌청함': '晴朗乾爽', '구름 조금': '少雲',
      '구름많음': '多雲', '구름 많음': '多雲', '흐림': '陰天',
      '비': '降雨', '비/눈': '雨夾雪', '눈': '降雪', '소나기': '陣雨'
    },
    apiServices: {
      'all': '全部 (所有資訊服務)',
      'area': '基於地區的觀光資訊',
      'location': '基於位置的周邊觀光 (周邊/半徑)',
      'festival': '活動/慶典資訊',
      'stay': '住宿/酒店資訊'
    }
  },
  de: {
    title: 'Korea Reiseführer',
    subtitle: 'Echtzeit-Wetter · Attraktionen · Kulinarik & Kleidungsempfehlungen',
    imagePreparing: 'Bild in Vorbereitung',
    travelKorea: 'Korea Reiseinfo',
    navSpots: 'Top-Orte',
    navEssentials: 'Essentials',
    navWeather: 'Live-Wetter',
    navLifestyle: 'AI Food & Outfit',
    navMap: 'Google Maps',
    lightMode: 'Heller Modus',
    darkMode: 'Dunkler Modus',
    klookEsimBtn: 'Klook eSIM / Pass ↗',
    kkdayActivityBtn: 'KKday Aktivitäten ↗',
    aiLifestyleTitle: 'AI Reise-Lifestyle-Guide',
    aiLifestyleSub: 'Analysiert Region, Wetter, Alter & Geschlecht für optimale Kulinarik- & Outfit-Empfehlungen.',
    foodTabLabel: '🍱 Kulinarik & Speisen',
    outfitTabLabel: '👔 Wetter-Outfit',
    outfitSearchBtn: 'Outfit-Style Lookbook Suchen ↗',
    essentialsTitle: '✈️ Korea Reise-Essentials & Angebote',
    essentialsSub: 'eSIM, Transportpass und Bestpreis-Hotels an einem Ort buchen.',
    essentialsBadge: 'Offizieller Partner-Rabatt',
    essentialsDetails: 'Details & Buchen',
    esimTitle: 'Unbegrenztes Daten-eSIM / SIM',
    esimTag: 'Klook 15% Rabatt',
    esimDesc: 'Schnelles 4G/5G eSIM, sofort bei der Ankunft in Korea aktiviert.',
    transitTitle: 'K-PASS & Flughafen-Express AREX',
    transitTag: 'Wichtiger Pass',
    transitDesc: 'Incheon Airport Express & landesweite U-Bahn/Bus Fahrkarte.',
    hotelTitle: 'Top Hotels & Unterkünfte in Korea',
    hotelTag: 'Agoda Bestpreisgarantie',
    hotelDesc: 'Bis zu 75% Rabatt auf Unterkünfte in Seoul, Jeju, Busan & Hanok.',
    taxfreeTitle: 'Tax Refund & Duty Free Shopping-Tipps',
    taxfreeTag: 'Steuerrückerstattungs-Guide',
    taxfreeDesc: 'Sofortige Steuerrückerstattung in Kaufhäusern, Supermärkten & Olive Young.',
    footerCopyright: '© 2026 Korea Reiseführer (K-Travel Explorer). koreatravel.cc & koreatravelsguide.com',
    footerAttribution: 'Basiert auf Korea Tourism Organization TourAPI 4.0 & KMA Wetterdaten',
    shareBtn: 'Reisebedingungen Teilen',
    shareSuccessToast: 'Reiselink in die Zwischenablage kopiert!',
    privacyPolicyTitle: 'Datenschutzerklärung',
    privacyCloseBtn: 'Bestätigen & Schließen',
    privacySection1Title: '1. Erfasste personenbezogene Daten & Erhebungsmethoden',
    privacySection1Desc: 'Dieser Dienst kann ohne Registrierung genutzt werden. Web-Browser-Cookies und Gerätezugriffsdaten können zur Bereitstellung und Qualitätsverbesserung automatisch erfasst werden.',
    privacySection2Title: '2. Google AdSense-Anzeigen & Cookie-Richtlinien',
    privacySection2Desc: 'Diese Website schaltet personalisierte Anzeigen von Drittanbietern wie Google AdSense. Google verwendet Cookies, um relevante Anzeigen basierend auf früheren Besuchen anzuzeigen.',
    privacySection3Title: '3. Affiliate-Marketing Offenlegung',
    privacySection3Desc: 'Dieser Dienst enthält Affiliate-Links von Partnern wie Agoda, Klook und KKday. Bei einer Buchung über diese Links erhalten wir möglicherweise eine kleine Provision.',
    privacySection4Title: '4. Datenspeicherung & Löschungsfrist',
    privacySection4Desc: 'Personenbezogene Daten werden unverzüglich gelöscht, sobald der Zweck der Erhebung und Nutzung erfüllt ist.',
    partnerInquiryBtn: 'Partner & Werbung',
    aiFloatBadge: '1:1 Maßgeschneiderter Kurs in 3s!',
    aiFloatBtn: 'AI Kurs-Empfehlung',
    aiCourseBtn: 'AI Kurs-Empfehlung',
    wishlistBtn: 'Wunschliste',
    copiedToast: 'Kopiert!',
    kkdayTicketBtn: 'KKday Aktivitäten Buchen',
    aiMatchingLabel: 'AI Übereinstimmung',
    langKo: 'Koreanisch (KO)', langEn: 'Englisch (EN)', langJa: 'Japanisch (JA)', langZh: 'Chinesisch (ZH-CN)', langZht: 'Chinesisch (ZH-TW)', langDe: 'Deutsch (DE)', langFr: 'Französisch (FR)', langEs: 'Spanisch (ES)', langRu: 'Russisch (RU)',
    filterSummary: 'Filterbedingungen', keywordLabel: 'Schlüsselwort', searchTitle: 'Reisebedingungen Anpassen', period: 'Reisezeitraum', keyword: 'Suchbegriff', keywordPlaceholder: 'Attraktion, Stadt, Tag (#Sonnenaufgang, #Date)...', region: 'Region', theme: 'Thema', age: 'Altersgruppe', gender: 'Geschlecht', arrange: 'Sortierung', arrangeO: 'Alphabetisch', arrangeQ: 'Zuletzt Aktualisiert', arrangeR: 'Neueste', apiServiceTypeLabel: 'API-Diensttyp', searchBtn: 'Reiseinfos Suchen', weatherTitle: 'Echtzeit-Wetterinformationen', weatherTempLabel: 'Aktuelle Temperatur', weatherPopLabel: 'Niederschlagswahrscheinlichkeit', midTermTitle: 'Wettervorhersage (3-7 Tage)', dayOffsetLabel: 'Tage Vorhersage', tourTitle: 'Empfohlene Sehenswürdigkeiten in Korea', totalSpots: 'Insgesamt {count} Orte', page: 'Seite', foodTitle: 'Empfohlene Kulinarik', outfitTitle: 'Kleidungsempfehlungen & Dresscode', customConditionLabel: 'Filter', mapTitle: 'Karte Anzeigen', viewOnGoogleMaps: 'Auf Google Maps anzeigen', noCoordinates: 'Keine Koordinaten verfügbar.', countryBadge: 'Südkorea', detailTitle: 'Details', overviewLoading: 'Lädt offizielle Daten der Korea Tourism Organization...', defaultOverview: 'Offiziell registrierte Attraktion der Korea Tourism Organization.', officialWebsite: 'Offizielle Website besuchen ↗', noOfficialWebsite: 'Keine offizielle Website angegeben.', telInquiry: 'Telefonischer Kontakt', hoursLabel: 'Öffnungszeiten', hoursDefault: '09:00 - 18:00 (Montags geschlossen)', contactLabel: 'Kontakt', contactDefault: 'Tourist Information 1330', websiteLabel: 'Website', websiteLoading: 'Link wird geprüft...', visitOfficialWebsite: 'Offizielle Website besuchen', seasonLabel: 'Beste Reisezeit', seasonDefault: 'Frühling & Herbst (Ganzjährig geöffnet)', highlightsTitle: 'Highlights der Attraktion', highlightsBullets: ['Offiziell zertifizierte Attraktion von KTO TourAPI', 'Verbindung zu lokalen Kulinarik- und Café-Routen', 'Wunderschöne Fotospots und Aussichtspunkte', 'Gute Anbindung an öffentliche Verkehrsmittel'], galleryTitle: 'Fotogalerie', photosUnit: 'Fotos', mapSearchTitle: 'Karte & Route', googleMapRoute: 'Route auf Google Maps anzeigen', reviewsTitle: 'Bewertungen', reviewsUnit: 'Bewertungen', writeReviewLabel: 'Bewertung schreiben', reviewPlaceholder: 'Schreiben Sie Ihre Bewertung...', submitReviewBtn: 'Bewertung absenden', ratingLabel: 'Bewertung', authorLabel: 'Besucher', closeBtn: 'Schließen', savedBookmark: 'Gespeichert', saveBookmark: 'Merken', showAllReviews: 'Alle anzeigen', hideReviews: 'Einklappen', scoreSuffix: 'Pkt', koreaRecommendedTag: 'KTO Empfohlen', noSpots: 'Keine Ergebnisse gefunden.', detailModalHeader: 'Attraktions-Details', detailModalSub: 'Echtzeit-Verifizierung durch Korea Tourism Organization TourAPI 4.0',
    affiliateTitle: 'Partnerangebote & Services', agodaHotelBtn: 'Hotels in der Nähe suchen (Agoda)', klookTicketBtn: 'Tickets & eSIM buchen (Klook)', tripHotelBtn: 'Hotels & Flüge (Trip.com)', esimBannerTitle: '✈️ Korea Reise-Essentials: eSIM & K-PASS Rabatt', esimBannerSub: 'Sofortige Bereitstellung von Daten-eSIM & K-Pass für Reisende', adSponsoredTag: 'Sponsor / Werbung',
    spotTitles: {}, regions: { '전국': 'Ganz Korea', '서울': 'Seoul', '부산': 'Busan', '제주': 'Jeju', '인천': 'Incheon', '강원': 'Gangwon', '경기': 'Gyeonggi', '경북': 'Gyeongbuk', '경남': 'Gyeongnam', '전북': 'Jeonbuk', '전남': 'Jeonnam', '충북': 'Chungbuk', '충남': 'Chungnam', '대구': 'Daegu', '대전': 'Daejeon', '광주': 'Gwangju', '울산': 'Ulsan', '세종': 'Sejong', '한국': 'Südkorea' },
    genders: { '무관': 'Alle', '남성': 'Männlich', '여성': 'Weiblich' }, ages: { '전체': 'Alle', '10대': '10er', '20대': '20er', '30대': '30er', '40대': '40er', '50대이상': '50+' },
    themes: { '전체': 'Alle', '관광': 'Besichtigung', '자연/힐링': 'Natur & Erholung', '역사/문화': 'Geschichte & Kultur', '미식/쇼핑': 'Kulinarik & Shopping', '액티비티/레저': 'Aktivitäten & Freizeit', 'K-컬처/이벤트': 'K-Kultur & Events', '숙박/호텔': 'Hotels & Unterkunft', '쇼핑/명소': 'Shopping', '축제': 'Festivals', '음식': 'Kulinarik' },
    weatherMap: { '맑음': 'Sonnig', '맑고 쾌청함': 'Klar', '구름 조금': 'Leicht bewölkt', '구름많음': 'Bewölkt', '구름 많음': 'Bewölkt', '흐림': 'Bedeckt', '비': 'Regen', '비/눈': 'Schneeregen', '눈': 'Schnee', '소나기': 'Schauer' },
    apiServices: { 'all': 'Alle Dienste (TourAPI)', 'area': 'Regional-Sehenswürdigkeiten', 'location': 'In der Nähe (Radius)', 'festival': 'Events & Festivals', 'stay': 'Unterkunft & Hotels' }
  },
  fr: {
    title: 'Guide de Voyage en Corée',
    subtitle: 'Météo en Temps Réel · Attractions · Gastronomie & Tenues',
    imagePreparing: 'Image en préparation',
    travelKorea: 'Infos Voyage Corée',
    navSpots: 'Top-Lieux',
    navEssentials: 'Indispensables',
    navWeather: 'Météo en Direct',
    navLifestyle: 'AI Gastronomie & Tenues',
    navMap: 'Google Maps',
    lightMode: 'Mode Clair',
    darkMode: 'Mode Sombre',
    klookEsimBtn: 'Klook eSIM / Pass ↗',
    kkdayActivityBtn: 'Activités KKday ↗',
    aiLifestyleTitle: 'Guide de Style de Vie Voyage AI',
    aiLifestyleSub: 'Analyse la région, la météo, l\'âge et le genre pour recommander la nourriture et les tenues.',
    foodTabLabel: '🍱 Gastronomie & Plats',
    outfitTabLabel: '👔 Tenues selon la Météo',
    outfitSearchBtn: 'Chercher un Lookbook de Tenue ↗',
    essentialsTitle: '✈️ Indispensables Voyage Corée & Offres',
    essentialsSub: 'Réservez votre eSIM, pass transport et hôtels au meilleur prix.',
    essentialsBadge: 'Remise Partenaire Officielle Appliquée',
    essentialsDetails: 'Voir les détails & Réserver',
    esimTitle: 'eSIM / SIM Données Illimitées',
    esimTag: '15% de réduction Klook',
    esimDesc: 'eSIM 4G/5G rapide activée dès votre arrivée en Corée.',
    transitTitle: 'K-PASS & Train Express AREX',
    transitTag: 'Pass Transport Indispensable',
    transitDesc: 'Train express Incheon & carte de transport métro/bus nationale.',
    hotelTitle: 'Meilleurs Hôtels & Hébergements',
    hotelTag: 'Garantie du Meilleur Prix Agoda',
    hotelDesc: 'Jusqu\'à 75% de réduction sur les hébergements à Séoul, Jeju, Busan & Hanok.',
    taxfreeTitle: 'Détaxe & Guide du Shopping Duty Free',
    taxfreeTag: 'Guide de Détaxe',
    taxfreeDesc: 'Guide de détaxe immédiate dans les grands magasins, supermarchés et Olive Young.',
    footerCopyright: '© 2026 Guide de Voyage en Corée (K-Travel Explorer). koreatravel.cc & koreatravelsguide.com',
    footerAttribution: 'Alimenté par l\'Organisation du Tourisme de Corée TourAPI 4.0 & Données Météo',
    langKo: 'Coréen (KO)', langEn: 'Anglais (EN)', langJa: 'Japonais (JA)', langZh: 'Chinois (ZH-CN)', langZht: 'Chinois (ZH-TW)', langDe: 'Allemand (DE)', langFr: 'Français (FR)', langEs: 'Espagnol (ES)', langRu: 'Russe (RU)',
    filterSummary: 'Conditions de Filtre', keywordLabel: 'Mot-clé', searchTitle: 'Personnaliser votre Voyage', period: 'Période de Voyage', keyword: 'Mot-clé de Recherche', keywordPlaceholder: 'Attraction, ville, tag (#leverdesoleil, #date)...', region: 'Région', theme: 'Thème', age: 'Tranche d\'âge', gender: 'Genre', arrange: 'Tri', arrangeO: 'Alphabétique', arrangeQ: 'Mis à jour', arrangeR: 'Récent', apiServiceTypeLabel: 'Type de Service API', searchBtn: 'Rechercher', weatherTitle: 'Météo en Temps Réel', weatherTempLabel: 'Température Actuelle', weatherPopLabel: 'Précipitations', midTermTitle: 'Prévisions Météo (3-7 jours)', dayOffsetLabel: 'Jours', tourTitle: 'Attractions Incontournables en Corée', totalSpots: 'Total {count} lieux', page: 'Page', foodTitle: 'Gastronomie Recommandée', outfitTitle: 'Conseils de Tenue', customConditionLabel: 'Filtres', mapTitle: 'Voir la Carte', viewOnGoogleMaps: 'Voir sur Google Maps', noCoordinates: 'Coordonnées non disponibles.', countryBadge: 'Corée du Sud', detailTitle: 'Détails', overviewLoading: 'Chargement des données officielles de l\'Organisation du Tourisme de Corée...', defaultOverview: 'Attraction officielle enregistrée par l\'Organisation du Tourisme de Corée.', officialWebsite: 'Visiter le site officiel ↗', noOfficialWebsite: 'Aucun site officiel renseigné.', telInquiry: 'Contact Téléphonique', hoursLabel: 'Horaires', hoursDefault: '09:00 - 18:00 (Fermé le lundi)', contactLabel: 'Contact', contactDefault: 'Information Touristique 1330', websiteLabel: 'Site Web', websiteLoading: 'Vérification du lien...', visitOfficialWebsite: 'Visiter le site officiel', seasonLabel: 'Meilleure Saison', seasonDefault: 'Printemps & Automne (Ouvert toute l\'année)', highlightsTitle: 'Points Forts', highlightsBullets: ['Attraction certifiée officielle KTO TourAPI', 'Circuit connecté aux spécialités locales et cafés', 'Superbes spots photo et points de vue nocturnes'], galleryTitle: 'Galerie Photos', photosUnit: 'Photos', mapSearchTitle: 'Carte & Itinéraire', googleMapRoute: 'Itinéraire sur Google Maps', reviewsTitle: 'Avis', reviewsUnit: 'Avis', writeReviewLabel: 'Écrire un avis', reviewPlaceholder: 'Rédigez votre avis...', submitReviewBtn: 'Soumettre', ratingLabel: 'Note', authorLabel: 'Visiteur', closeBtn: 'Fermer', savedBookmark: 'Enregistré', saveBookmark: 'Enregistrer', showAllReviews: 'Tout afficher', hideReviews: 'Masquer', scoreSuffix: 'pts', koreaRecommendedTag: 'Recommandé KTO', noSpots: 'Aucun résultat trouvé.', detailModalHeader: 'Détails de l\'Attraction', detailModalSub: 'Vérification en temps réel par KTO TourAPI 4.0',
    affiliateTitle: 'Offres Partenaires & Services', agodaHotelBtn: 'Rechercher des Hôtels (Agoda)', klookTicketBtn: 'Réserver Billets & eSIM (Klook)', tripHotelBtn: 'Hôtels & Vols (Trip.com)', esimBannerTitle: '✈️ Indispensable Voyage Corée: Réduction eSIM & K-PASS', esimBannerSub: 'Livraison instantanée d\'eSIM données & K-Pass pour voyageurs', adSponsoredTag: 'Partenaire Sponsorisé / Pub',
    shareBtn: 'Partager le voyage', shareSuccessToast: 'Lien de voyage copié dans le presse-papier !', partnerInquiryBtn: 'Partenariat & Pub', partnerInquiryTitle: '📩 Demande de Partenariat & Publicité', partnerInquirySub: 'Sponsorisation, bannières et référencement pour visiteurs internationaux', partnerFormName: 'Nom / Contact', partnerFormEmail: 'Adresse e-mail', partnerFormType: 'Type de demande', partnerTypeOption1: 'Sponsoring & Publicité', partnerTypeOption2: 'Référencement de lieu / Hanok', partnerTypeOption3: 'Partenariat Influenceurs & Contenu', partnerFormMessage: 'Message & Coordonnées', partnerSubmitBtn: 'Envoyer la demande', partnerDirectEmailText: 'Ou contactez-nous directement par e-mail :', partnerCopyEmailBtn: 'Copier l\'e-mail', partnerSuccessMessage: 'Votre demande a bien été envoyée ! Nous vous répondrons sous 24h.',
    privacyPolicyTitle: 'Politique de confidentialité',
    privacyCloseBtn: 'Confirmer & Fermer',
    privacySection1Title: '1. Données personnelles collectées & Méthode de collecte',
    privacySection1Desc: 'Ce service est utilisable sans inscription. Des cookies et des informations d\'accès peuvent être collectés automatiquement pour fournir et améliorer le service.',
    privacySection2Title: '2. Publicités Google AdSense & Politique relative aux cookies',
    privacySection2Desc: 'Ce site affiche des publicités personnalisées via des tiers comme Google AdSense. Google utilise des cookies pour afficher des annonces pertinentes basées sur vos visites précédentes.',
    privacySection3Title: '3. Divulgation de marketing d\'affiliation',
    privacySection3Desc: 'Ce service contient des liens d\'affiliation partenaires tels qu\'Agoda, Klook et KKday. Nous pouvons recevoir une petite commission si un visiteur effectue une réservation via ces liens.',
    privacySection4Title: '4. Durée de conservation & Destruction des données',
    privacySection4Desc: 'En principe, les données personnelles sont détruites sans délai une fois l\'objectif de collecte et d\'utilisation atteint.',
    essentialsTitle: '✈️ Indispensables Voyage Corée & Offres Partenaires', essentialsSub: 'Préparation tout-en-un pour eSIM, pass transport & tarifs hôtels', essentialsBadge: 'Réduction Officielle Appliquée', essentialsDetails: 'Voir les détails & réserver', esimTitle: 'eSIM / SIM Données Illimitées', esimTag: 'Klook 15% de réduction', esimDesc: 'Activation instantanée à l\'arrivée en Corée avec données 4G/5G haut débit', transitTitle: 'K-PASS & Express Aéroport AREX', transitTag: 'Pass Transport', transitDesc: 'Train express Aéroport Incheon & pass bus/métro tout-en-un pour la Corée', hotelTitle: 'Meilleurs Hôtels & Séjours Hanok', hotelTag: 'Garantie Meilleur Tarif Agoda', hotelDesc: 'Jusqu\'à 75% de réduction sur les hôtels & hanoks à Séoul, Jeju, Busan', taxfreeTitle: 'Détaxe & Conseils Shopping Duty Free', taxfreeTag: 'Guide Détaxe', taxfreeDesc: 'Détaxe immédiate dans les grands magasins, supermarchés & Olive Young',
    aiFloatBadge: 'Itinéraire sur mesure 1:1 en 3s !', aiFloatBtn: 'Planificateur AI', aiCourseBtn: 'Planificateur AI', wishlistBtn: 'Favoris', copiedToast: 'Copié !', kkdayTicketBtn: 'Réserver Activités KKday', aiMatchingLabel: 'Match AI',
    spotTitles: {}, regions: { '전국': 'Toute la Corée', '서울': 'Séoul', '부산': 'Busan', '제주': 'Jeju', '인천': 'Incheon', '강원': 'Gangwon', '경기': 'Gyeonggi', '경북': 'Gyeongbuk', '경남': 'Gyeongnam', '전북': 'Jeonbuk', '전남': 'Jeonnam', '충북': 'Chungbuk', '충남': 'Chungnam', '대구': 'Daegu', '대전': 'Daejeon', '광주': 'Gwangju', '울산': 'Ulsan', '세종': 'Sejong', '한국': 'Corée du Sud' },
    genders: { '무관': 'Tous', '남성': 'Homme', '여성': 'Femme' }, ages: { '전체': 'Tous', '10대': '10ans', '20대': '20ans', '30대': '30ans', '40대': '40ans', '50대이상': '50+' },
    themes: { '전체': 'Tous', '관광': 'Visites', '자연/힐링': 'Nature & Détente', '역사/문화': 'Histoire & Culture', '미식/쇼핑': 'Gastronomie & Shopping', '액티비티/레저': 'Activités & Loisirs', 'K-컬처/이벤트': 'K-Culture & Événements', '숙박/호텔': 'Hôtels & Hébergements', '쇼핑/명소': 'Shopping', '축제': 'Festivals', '음식': 'Gastronomie' },
    weatherMap: { '맑음': 'Ensoleillé', '맑고 쾌청함': 'Dégagé', '구름 조금': 'Peu nuageux', '구름많음': 'Nuageux', '구름 많음': 'Très nuageux', '흐림': 'Couvert', '비': 'Pluie', '비/눈': 'Pluie et neige', '눈': 'Neige', '소나기': 'Averse' },
    apiServices: { 'all': 'Tous les Services (TourAPI)', 'area': 'Attractions Régionales', 'location': 'À Proximité (Rayon)', 'festival': 'Événements & Festivals', 'stay': 'Hôtels & Hébergements' }
  },
  es: {
    title: 'Guía de Viaje a Corea',
    subtitle: 'Clima en Tiempo Real · Atracciones · Gastronomía y Ropa',
    imagePreparing: 'Imagen en preparación',
    travelKorea: 'Info Viaje Corea',
    navSpots: 'Mejores Lugares',
    navEssentials: 'Esenciales',
    navWeather: 'Clima en Vivo',
    navLifestyle: 'AI Comida y Ropa',
    navMap: 'Google Maps',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    klookEsimBtn: 'Klook eSIM / Pase ↗',
    kkdayActivityBtn: 'Actividades KKday ↗',
    aiLifestyleTitle: 'Guía de Estilo de Vida de Viaje AI',
    aiLifestyleSub: 'Analiza región, clima, edad y género para recomendar comida y ropa óptimas.',
    foodTabLabel: '🍱 Comida Recomendada',
    outfitTabLabel: '👔 Ropa para el Clima',
    outfitSearchBtn: 'Buscar Lookbook de Estilo de Ropa ↗',
    langKo: 'Coreano (KO)', langEn: 'Inglés (EN)', langJa: 'Japonés (JA)', langZh: 'Chino (ZH-CN)', langZht: 'Chino (ZH-TW)', langDe: 'Alemán (DE)', langFr: 'Francés (FR)', langEs: 'Español (ES)', langRu: 'Ruso (RU)',
    filterSummary: 'Filtros de Búsqueda', keywordLabel: 'Palabra Clave', searchTitle: 'Personalizar Viaje', period: 'Período de Viaje', keyword: 'Buscar Palabra Clave', keywordPlaceholder: 'Atracción, ciudad, etiqueta (#amanecer, #cita)...', region: 'Región', theme: 'Tema', age: 'Edad', gender: 'Género', arrange: 'Orden', arrangeO: 'Alfabético', arrangeQ: 'Actualizado', arrangeR: 'Reciente', apiServiceTypeLabel: 'Tipo de Servicio API', searchBtn: 'Buscar Información', weatherTitle: 'Clima en Tiempo Real', weatherTempLabel: 'Temperatura Actual', weatherPopLabel: 'Precipitación', midTermTitle: 'Pronóstico del Tiempo (3-7 días)', dayOffsetLabel: 'Días', tourTitle: 'Atracciones Recomendadas en Corea', totalSpots: 'Total {count} lugares', page: 'Página', foodTitle: 'Gastronomía Recomendada', outfitTitle: 'Recomendaciones de Ropa', customConditionLabel: 'Filtros', mapTitle: 'Ver Mapa', viewOnGoogleMaps: 'Ver en Google Maps', noCoordinates: 'Coordonadas no disponibles.', countryBadge: 'Corea del Sur', detailTitle: 'Detalles', overviewLoading: 'Cargando datos oficiales de la Organización de Turismo de Corea...', defaultOverview: 'Atracción oficial registrada por la Organización de Turismo de Corea.', officialWebsite: 'Visitar sitio oficial ↗', noOfficialWebsite: 'Sin sitio web oficial registrado.', telInquiry: 'Contacto Telefónico', hoursLabel: 'Horario', hoursDefault: '09:00 - 18:00 (Cerrado los lunes)', contactLabel: 'Contacto', contactDefault: 'Información Turística 1330', websiteLabel: 'Sitio Web', websiteLoading: 'Verificando enlace...', visitOfficialWebsite: 'Visitar sitio oficial', seasonLabel: 'Mejor Época', seasonDefault: 'Primavera y Otoño (Abierto todo el año)', highlightsTitle: 'Puntos Destacados', highlightsBullets: ['Atracción certificada oficial de KTO TourAPI', 'Ruta conectada a gastronomía local y cafeterías', 'Fotografías espectaculares y vistas nocturnas'], galleryTitle: 'Galería de Fotos', photosUnit: 'Fotos', mapSearchTitle: 'Mapa y Ruta', googleMapRoute: 'Ver ruta en Google Maps', reviewsTitle: 'Opiniones', reviewsUnit: 'Opiniones', writeReviewLabel: 'Escribir opinión', reviewPlaceholder: 'Escribe tu opinión...', submitReviewBtn: 'Enviar', ratingLabel: 'Calificación', authorLabel: 'Visitante', closeBtn: 'Cerrar', savedBookmark: 'Guardado', saveBookmark: 'Guardar', showAllReviews: 'Mostrar todo', hideReviews: 'Ocultar', scoreSuffix: 'pts', koreaRecommendedTag: 'Recomendado KTO', noSpots: 'No se encontraron resultados.', detailModalHeader: 'Detalles de la Atracción', detailModalSub: 'Verificación en tiempo real por KTO TourAPI 4.0',
    affiliateTitle: 'Ofertas de Socios y Servicios', agodaHotelBtn: 'Buscar Hoteles Cercanos (Agoda)', klookTicketBtn: 'Reservar Entradas y eSIM (Klook)', tripHotelBtn: 'Hoteles y Vuelos (Trip.com)', esimBannerTitle: '✈️ Esencial para Viajar a Corea: Descuento en eSIM y K-PASS', esimBannerSub: 'Entrega instantánea de eSIM de datos y K-Pass para viajeros', adSponsoredTag: 'Patrocinado / Publicidad',
    shareBtn: 'Compartir Viaje', shareSuccessToast: '¡Enlace de viaje copiado al portapapeles!', partnerInquiryBtn: 'Socios y Publicidad', partnerInquiryTitle: '📩 Solicitud de Asociación y Publicidad', partnerInquirySub: 'Patrocinio, anuncios e inclusión para visitantes globales', partnerFormName: 'Nombre / Contacto', partnerFormEmail: 'Correo electrónico', partnerFormType: 'Tipo de consulta', partnerTypeOption1: 'Patrocinio y Publicidad', partnerTypeOption2: 'Listado de Lugares / Hanok', partnerTypeOption3: 'Asociación con Influencers', partnerFormMessage: 'Mensaje y Contacto', partnerSubmitBtn: 'Enviar consulta', partnerDirectEmailText: 'O contáctenos por correo electrónico:', partnerCopyEmailBtn: 'Copiar correo', partnerSuccessMessage: '¡Su consulta ha sido enviada! Responderemos en 24 horas.',
    essentialsTitle: '✈️ Esenciales para Viajar a Corea y Ofertas', essentialsSub: 'Todo en uno: eSIM, pase de transporte y mejores precios de hotel', essentialsBadge: 'Descuento Oficial Aplicado', essentialsDetails: 'Ver detalles y reservar', esimTitle: 'eSIM / SIM de Datos Ilimitados', esimTag: '15% de descuento Klook', esimDesc: 'Activación instantánea a la llegada a Corea con datos 4G/5G de alta velocidad', transitTitle: 'K-PASS y Expreso del Aeropuerto AREX', transitTag: 'Pase de Transporte', transitDesc: 'Tren expreso del aeropuerto de Incheon y pase para metro/autobús en Corea', hotelTitle: 'Los Mejores Hoteles y Hanoks', hotelTag: 'Garantía Mejor Precio Agoda', hotelDesc: 'Hasta 75% de descuento en hoteles y hanoks en Seúl, Jeju, Busan', taxfreeTitle: 'Reembolso de Impuestos y Compras', taxfreeTag: 'Guía de Reembolso', taxfreeDesc: 'Reembolso inmediato de impuestos en centros comerciales y Olive Young',
    footerCopyright: '© 2026 Guía de Viaje a Corea (K-Travel Explorer). koreatravel.cc & koreatravelsguide.com',
    footerAttribution: 'Impulsado por TourAPI 4.0 de Turismo de Corea y Datos Meteorológicos',
    privacyPolicyTitle: 'Política de Privacidad',
    privacyCloseBtn: 'Confirmar y Cerrar',
    privacySection1Title: '1. Datos personales recopilados y Método de recopilación',
    privacySection1Desc: 'Este servicio se puede utilizar sin registro. Se pueden recopilar automáticamente cookies del navegador e información del dispositivo para la calidad del servicio.',
    privacySection2Title: '2. Anuncios de Google AdSense y Política de cookies',
    privacySection2Desc: 'Este sitio web muestra anuncios personalizados de proveedores externos como Google AdSense. Google utiliza cookies para mostrar anuncios relevantes basados en sus visitas previas.',
    privacySection3Title: '3. Divulgación de marketing de afiliados',
    privacySection3Desc: 'Este servicio contiene enlaces de afiliados de socios como Agoda, Klook y KKday. Podemos recibir una pequeña comisión cuando los visitantes reservan a través de estos enlaces.',
    privacySection4Title: '4. Período de conservación y Eliminación de datos',
    privacySection4Desc: 'En principio, los datos personales se eliminan de inmediato una vez cumplido el propósito de la recopilación y uso.',
    aiFloatBadge: '¡Itinerario personalizado 1:1 en 3s!', aiFloatBtn: 'Planificador AI', aiCourseBtn: 'Planificador AI', wishlistBtn: 'Favoritos', copiedToast: '¡Copiado!', kkdayTicketBtn: 'Reservar Actividades KKday', aiMatchingLabel: 'Coincidencia AI',
    spotTitles: {}, regions: { '전국': 'Toda Corea', '서울': 'Seúl', '부산': 'Busan', '제주': 'Jeju', '인천': 'Incheon', '강원': 'Gangwon', '경기': 'Gyeonggi', '경북': 'Gyeongbuk', '경남': 'Gyeongnam', '전북': 'Jeonbuk', '전남': 'Jeonnam', '충북': 'Chungbuk', '충남': 'Chungnam', '대구': 'Daegu', '대전': 'Daejeon', '광주': 'Gwangju', '울산': 'Ulsan', '세종': 'Sejong', '한국': 'Corea del Sur' },
    genders: { '무관': 'Todos', '남성': 'Hombre', '여성': 'Mujer' }, ages: { '전체': 'Todos', '10대': '10s', '20대': '20s', '30대': '30s', '40대': '40s', '50대이상': '50+' },
    themes: { '전체': 'Todos', '관광': 'Turismo', '자연/힐링': 'Naturaleza & Relajación', '역사/문화': 'Historia & Cultura', '미식/쇼핑': 'Gastronomía & Compras', '액티비티/레저': 'Actividades & Ocio', 'K-컬처/이벤트': 'K-Cultura & Eventos', '숙박/호텔': 'Hoteles & Alojamiento', '쇼핑/명소': 'Compras', '축제': 'Festivales', '음식': 'Gastronomía' },
    weatherMap: { '맑음': 'Soleado', '맑고 쾌청함': 'Despejado', '구름 조금': 'Algo nublado', '구름많음': 'Nublado', '구름 많음': 'Muy nublado', '흐림': 'Cubierto', '비': 'Lluvia', '비/눈': 'Lluvia y nieve', '눈': 'Nieve', '소나기': 'Chubasco' },
    apiServices: { 'all': 'Todos los Servicios (TourAPI)', 'area': 'Información Turística Regional', 'location': 'Cercano (Radio)', 'festival': 'Eventos y Festivales', 'stay': 'Alojamientos y Hoteles' }
  },
  ru: {
    title: 'Путеводитель по Корее',
    subtitle: 'Погода в реальном времени · Достопримечательности · Еда и одежда',
    imagePreparing: 'Изображение готовится',
    travelKorea: 'Путеводитель по Корее',
    navSpots: 'Главные места',
    navEssentials: 'Главное',
    navWeather: 'Погода',
    navLifestyle: 'AI Еда и Одежда',
    navMap: 'Google Карты',
    lightMode: 'Светлая тема',
    darkMode: 'Темная тема',
    klookEsimBtn: 'Klook eSIM / Билеты ↗',
    kkdayActivityBtn: 'Туры KKday ↗',
    aiLifestyleTitle: 'AI Персональный гид по стилю и еде',
    aiLifestyleSub: 'Анализирует регион, погоду, возраст и пол для подбора лучшей еды и одежды.',
    foodTabLabel: '🍱 Еда и рестораны',
    outfitTabLabel: '👔 Одежда по погоде',
    outfitSearchBtn: 'Найти лукбук одежды ↗',
    langKo: 'Корейский (KO)', langEn: 'Английский (EN)', langJa: 'Японский (JA)', langZh: 'Китайский (ZH-CN)', langZht: 'Китайский (ZH-TW)', langDe: 'Немецкий (DE)', langFr: 'Французский (FR)', langEs: 'Испанский (ES)', langRu: 'Русский (RU)',
    filterSummary: 'Условия Фильтра', keywordLabel: 'Ключевое слово', searchTitle: 'Настройка поездки', period: 'Период поездки', keyword: 'Поисковый запрос', keywordPlaceholder: 'Достопримечательность, город, тег (#рассвет)...', region: 'Регион', theme: 'Тема', age: 'Возраст', gender: 'Пол', arrange: 'Сортировка', arrangeO: 'По алфавиту', arrangeQ: 'Обновлено', arrangeR: 'Новые', apiServiceTypeLabel: 'Тип API сервиса', searchBtn: 'Найти информацию', weatherTitle: 'Погода в реальном времени', weatherTempLabel: 'Текущая температура', weatherPopLabel: 'Осадки', midTermTitle: 'Прогноз погоды (3-7 дней)', dayOffsetLabel: 'Дней', tourTitle: 'Рекомендуемые достопримечательности', totalSpots: 'Всего {count} мест', page: 'Страница', foodTitle: 'Рекомендуемая кухня', outfitTitle: 'Рекомендации по одежде', customConditionLabel: 'Фильтры', mapTitle: 'Посмотреть карту', viewOnGoogleMaps: 'Открыть в Google Картах', noCoordinates: 'Координаты недоступны.', countryBadge: 'Южная Корея', detailTitle: 'Подробнее', overviewLoading: 'Загрузка официальных данных Национальной организации туризма Кореи...', defaultOverview: 'Официально зарегистрированная достопримечательность НОТК.', officialWebsite: 'Перейти на официальный сайт ↗', noOfficialWebsite: 'Официальный сайт не указан.', telInquiry: 'Телефон для справок', hoursLabel: 'Часы работы', hoursDefault: '09:00 - 18:00 (Понедельник — выходной)', contactLabel: 'Контакты', contactDefault: 'Туристическая справка 1330', websiteLabel: 'Веб-сайт', websiteLoading: 'Проверка ссылки...', visitOfficialWebsite: 'Перейти на официальный сайт', seasonLabel: 'Лучшее время', seasonDefault: 'Весна и Осень (Круглый год)', highlightsTitle: 'Главные особенности', highlightsBullets: ['Официально сертифицированное место KTO TourAPI', 'Маршрут с местной кухней и кафе', 'Отличные фотолокации и ночные виды'], galleryTitle: 'Галерея фотографий', photosUnit: 'Фото', mapSearchTitle: 'Карта и маршрут', googleMapRoute: 'Посмотреть маршрут на Google Картах', reviewsTitle: 'Отзывы', reviewsUnit: 'Отзывов', writeReviewLabel: 'Написать отзыв', reviewPlaceholder: 'Напишите ваш отзыв...', submitReviewBtn: 'Отправить', ratingLabel: 'Оценка', authorLabel: 'Посетитель', closeBtn: 'Закрыть', savedBookmark: 'Сохранено', saveBookmark: 'Сохранить', showAllReviews: 'Показать все', hideReviews: 'Свернуть', scoreSuffix: 'баллов', koreaRecommendedTag: 'Рекомендовано KTO', noSpots: 'Ничего не найдено.', detailModalHeader: 'Подробная информация', detailModalSub: 'Проверка в реальном времени через KTO TourAPI 4.0',
    affiliateTitle: 'Партнерские предложения и сервисы', agodaHotelBtn: 'Поиск отелей поблизости (Agoda)', klookTicketBtn: 'Билеты и eSIM (Klook)', tripHotelBtn: 'Отели и авиабилеты (Trip.com)', esimBannerTitle: '✈️ Главное для поездки в Корею: Скидки на eSIM и K-PASS', esimBannerSub: 'Мгновенное получение eSIM с интернетом и K-Pass для туристов', adSponsoredTag: 'Спонсор / Реклама',
    shareBtn: 'Поделиться поездкой', shareSuccessToast: 'Ссылка скопирована в буфер обмена!', partnerInquiryBtn: 'Партнерство и реклама', partnerInquiryTitle: '📩 Заявка на партнерство и рекламу', partnerInquirySub: 'Спонсорство, баннеры и размещение для путешественников со всего мира', partnerFormName: 'Имя / Контактное лицо', partnerFormEmail: 'Электронная почта', partnerFormType: 'Тип обращения', partnerTypeOption1: 'Спонсорство и реклама', partnerTypeOption2: 'Размещение мест / Ханок', partnerTypeOption3: 'Партнерство с блогерами', partnerFormMessage: 'Сообщение и контакты', partnerSubmitBtn: 'Отправить заявку', partnerDirectEmailText: 'Или свяжитесь с нами напрямую по e-mail:', partnerCopyEmailBtn: 'Скопировать e-mail', partnerSuccessMessage: 'Ваша заявка принята! Мы ответим в течение 24 часов.',
    essentialsTitle: '✈️ Главное для поездки в Корею и скидки', essentialsSub: 'Всё в одном месте: eSIM, проездные и отели по лучшим ценам', essentialsBadge: 'Применена скидка партнера', essentialsDetails: 'Подробности и бронирование', esimTitle: 'Безлимитный интернет eSIM / SIM', esimTag: 'Скидка 15% на Klook', esimDesc: 'Мгновенная активация по прибытии в Корею с высокоскоростным 4G/5G интернетом', transitTitle: 'K-PASS и аэроэкспресс AREX', transitTag: 'Проездной билет', transitDesc: 'Экспресс из аэропорта Инчхон и единый проездной на метро и автобусы Кореи', hotelTitle: 'Отели и традиционные дома Ханок', hotelTag: 'Гарантия лучшей цены Agoda', hotelDesc: 'Скидки до 75% на отели и дома Ханок в Сеуле, Чеджу, Пусане', taxfreeTitle: 'Возврат налогов (Tax Free) и шопинг', taxfreeTag: 'Гид по возврату налога', taxfreeDesc: 'Инструкция по мгновенному возврату налогов в универмагах и Olive Young',
    footerCopyright: '© 2026 Путеводитель по Корее (K-Travel Explorer). koreatravel.cc & koreatravelsguide.com',
    footerAttribution: 'Интегрировано с НОТК TourAPI 4.0 и Метеорологической службой Кореи',
    privacyPolicyTitle: 'Политика конфиденциальности',
    privacyCloseBtn: 'Подтвердить и закрыть',
    privacySection1Title: '1. Собираемые персональные данные и методы сбора',
    privacySection1Desc: 'Данный сервис доступен без регистрации. Файлы cookie браузера и данные об устройстве могут собираться автоматически для обеспечения качества сервиса.',
    privacySection2Title: '2. Реклама Google AdSense и политика в отношении файлов cookie',
    privacySection2Desc: 'Этот сайт отображает персонализированную рекламу Google AdSense. Google использует файлы cookie для показа релевантных объявлений на основе ваших предыдущих посещений.',
    privacySection3Title: '3. Раскрытие информации об аффилированном маркетинге',
    privacySection3Desc: 'Сервис содержит партнерские ссылки Agoda, Klook и KKday. Мы можем получать небольшую комиссию при бронировании через эти ссылки.',
    privacySection4Title: '4. Срок хранения и удаления данных',
    privacySection4Desc: 'Персональные данные удаляются незамедлительно после достижения целей их сбора и использования.',
    aiFloatBadge: 'Маршрут 1:1 за 3 секунды!', aiFloatBtn: 'AI Маршруты', aiCourseBtn: 'AI Маршруты', wishlistBtn: 'Избранное', copiedToast: 'Скопировано!', kkdayTicketBtn: 'Туры на KKday', aiMatchingLabel: 'Совпадение AI',
    spotTitles: {}, regions: { '전국': 'Вся Корея', '서울': 'Сеул', '부산': 'Пусан', '제주': 'Чеджу', '인천': 'Инчхон', '강원': 'Канвондо', '경기': 'Кёнгидо', '경북': 'Кёнсан-Пукто', '경남': 'Кёнсан-Намдо', '전북': 'Чолла-Пукто', '전남': 'Чолла-Намдо', '충북': 'Чхунчхон-Пукто', '충남': 'Чхунчхон-Намдо', '대구': 'Тэгу', '대전': 'Тэджон', '광주': 'Кванджу', '울산': 'Ульсан', '세종': 'Седжон', '한국': 'Южная Корея' },
    genders: { '무관': 'Все', '남성': 'Мужской', '여성': 'Женский' }, ages: { '전체': 'Все', '10대': '10-19', '20대': '20-29', '30대': '30-39', '40대': '40-49', '50대이상': '50+' },
    themes: { '전체': 'Все', '관광': 'Экскурсии', '자연/힐링': 'Природа и Отдых', '역사/문화': 'История и Культура', '미식/쇼핑': 'Еда и Шопинг', '액티비티/레저': 'Активный отдых', 'K-컬처/이벤트': 'K-Культура и События', '숙박/호텔': 'Отели и Проживание', '쇼핑/명소': 'Шопинг', '축제': 'Фестивали', '음식': 'Еда' },
    weatherMap: { '맑음': 'Ясно', '맑고 쾌청함': 'Ясно и сухо', '구름 조금': 'Небольшая облачность', '구름많음': 'Облачно', '구름 많음': 'Значительная облачность', '흐림': 'Пасмурно', '비': 'Дождь', '비/눈': 'Дождь со снегом', '눈': 'Снег', '소나기': 'Ливень' },
    apiServices: { 'all': 'Все сервисы (TourAPI)', 'area': 'Региональный туризм', 'location': 'Достопримечательности рядом', 'festival': 'Фестивали и мероприятия', 'stay': 'Отели и проживание' }
  }
};

// Korean Hangul Revised Romanization algorithm for dynamic fallbacks
export function romanizeHangul(text) {
  if (!text) return '';
  const INITIALS = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
  const MEDIALS = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
  const FINALS = ['', 'g', 'kk', 'gs', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'b', 'bs', 's', 'ss', 'ng', 'j', 'ch', 'k', 't', 'p', 'h'];

  let res = '';
  let inHangul = false;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const syllableIndex = code - 0xAC00;
      const initialIdx = Math.floor(syllableIndex / 588);
      const medialIdx = Math.floor((syllableIndex % 588) / 28);
      const finalIdx = syllableIndex % 28;

      let init = INITIALS[initialIdx];
      let med = MEDIALS[medialIdx];
      let fin = FINALS[finalIdx];

      let charRom = init + med + fin;
      const isStartOfWord = i === 0 || /[\s\(\-\.\/]/ .test(text[i - 1]) || !inHangul;
      if (isStartOfWord && charRom.length > 0) {
        charRom = charRom.charAt(0).toUpperCase() + charRom.slice(1);
      }
      res += charRom;
      inHangul = true;
    } else {
      res += text[i];
      inHangul = false;
    }
  }
  return res;
}

export function getTranslatedTitle(title, lang = 'ko') {
  if (!title) return '';
  if (lang === 'ko') return title;

  const tObj = TRANSLATIONS[lang] || TRANSLATIONS.en;
  if (tObj.spotTitles && tObj.spotTitles[title]) {
    return tObj.spotTitles[title];
  }

  if (title === '가가책방') {
    if (lang === 'en') return 'Gaga Bookstore (Gongju)';
    if (lang === 'ja') return 'ガガ本屋 (Gaga Bookstore)';
    if (lang === 'zh') return 'Gaga书店 (公州)';
  }

  let res = title;

  const COMPOUND_REPLACEMENTS = {
    en: [
      ['관광특구', ' Special Tourist Zone'],
      ['미디어아트', ' Media Art'],
      ['성곽길', ' Fortress Wall Trail'],
      ['문화재', ' Cultural Heritage'],
      ['수원화성', 'Suwon Hwaseong Fortress'],
      ['행궁동', 'Haenggung-dong'],
      ['행궁점', ' Haenggung Branch'],
      ['행궁', 'Haenggung Palace'],
      ['경복궁', 'Gyeongbokgung Palace'],
      ['근정전', 'Geunjeongjeon Hall'],
      ['성산일출봉', 'Seongsan Ilchulbong Peak'],
      ['블루라인파크', 'Blueline Park'],
      ['권금성', 'Gwongeumseong Fortress'],
      ['동궁과 월지', 'Donggung Palace & Wolji Pond'],
      ['안압지', 'Anapji Pond'],
      ['한옥마을', 'Hanok Village'],
      ['경기전', 'Gyeonggijeon Shrine'],
      ['N서울타워', 'N Seoul Tower'],
      ['남산공원', 'Namsan Park'],
      ['센트럴파크', 'Central Park'],
      ['행리단길', 'Haengnidan-gil'],
      ['산성시장', 'Sanseong Market'],
      ['왕릉원', 'Royal Tombs'],
      ['무령왕릉', 'Tomb of King Muryeong'],
      ['공산성', 'Gongsanseong Fortress'],
      ['마곡사', 'Magoksa Temple'],
      ['넘버25', 'No.25 Hotel'],
      ['넘버 25', 'No.25 Hotel'],
      ['야행', ' Night Tour'],
      ['축제', ' Festival'],
      ['행사', ' Event'],
      ['체험', ' Experience'],
      ['안내소', ' Info Center'],
      ['공연장', ' Performance Hall'],
      ['생태공원', ' Eco Park'],
      ['체육공원', ' Sports Park'],
      ['기념관', ' Memorial'],
      ['유적지', ' Historic Site'],
      ['생가', ' Birthplace'],
      ['호텔', ' Hotel'],
      ['펜션', ' Pension'],
      ['게스트하우스', ' Guesthouse'],
      ['모텔', ' Motel'],
      ['리조트', ' Resort'],
      ['민박', ' Guesthouse'],
      ['책방', ' Bookstore'],
      ['서점', ' Bookstore'],
      ['시장', ' Market'],
      ['공원', ' Park'],
      ['해수욕장', ' Beach'],
      ['해변', ' Beach'],
      ['전망대', ' Observatory'],
      ['박물관', ' Museum'],
      ['미술관', ' Art Museum'],
      ['수목원', ' Arboretum'],
      ['계곡', ' Valley'],
      ['도서관', ' Library'],
      ['점', ' Branch']
    ],
    ja: [
      ['관광특구', '観光特区'], ['미디어아트', 'メディアアート'], ['성곽길', '城郭の道'], ['문화재', '文化財'],
      ['수원화성', '水原華城'], ['행궁동', '行宮洞'], ['행궁점', '行宮店'], ['행궁', '行宮'],
      ['경복궁', '景福宮'], ['근정전', '勤政殿'], ['넘버25', 'ナンバー25ホテル'], ['넘버 25', 'ナンバー25ホテル'],
      ['호텔', 'ホテル'], ['펜션', 'ペンション'], ['게스트하우스', 'ゲストハウス'], ['모텔', 'モーテル'],
      ['리조트', 'リゾート'], ['책방', '本屋'], ['서점', '書店'], ['시장', '市場'],
      ['공원', '公園'], ['해수욕장', '海水浴場'], ['점', '店']
    ],
    zh: [
      ['관광특구', '旅游特区'], ['미디어아트', '媒体艺术'], ['성곽길', '城墙小径'], ['문화재', '文化遗产'],
      ['수원화성', '水原华城'], ['행궁동', '行宫洞'], ['행궁점', '行宫店'], ['행궁', '行宫'],
      ['경복궁', '景福宫'], ['근정전', '勤政殿'], ['넘버25', 'No.25酒店'], ['넘버 25', 'No.25酒店'],
      ['호텔', '酒店'], ['펜션', '民宿'], ['게스트하우스', '青年旅舍'], ['모텔', '汽车旅馆'],
      ['리조트', '度假村'], ['책방', '书店'], ['서점', '书店'], ['시장', '市场'],
      ['공원', '公园'], ['해수욕장', '海水浴场'], ['점', '店']
    ],
    zht: [
      ['관광특구', '旅遊特區'], ['미디어아트', '媒體藝術'], ['성곽길', '城牆小徑'], ['문화재', '文化遺產'],
      ['수원화성', '水原華城'], ['행궁동', '行宮洞'], ['행궁점', '行宮店'], ['행궁', '行宮'],
      ['경복궁', '景福宮'], ['근정전', '勤政殿'], ['넘버25', 'No.25酒店'], ['넘버 25', 'No.25酒店'],
      ['호텔', '酒店'], ['펜션', '民宿'], ['게스트하우스', '青年旅舍'], ['모텔', '汽車旅館'],
      ['리조트', '渡假村'], ['책방', '書店'], ['서점', '書店'], ['시장', '市場'],
      ['공원', '公園'], ['해수욕장', '海水浴場'], ['점', '店']
    ]
  };

  const list = COMPOUND_REPLACEMENTS[lang] || COMPOUND_REPLACEMENTS.en;
  for (const [kr, trans] of list) {
    if (res.includes(kr)) {
      res = res.replace(new RegExp(kr, 'g'), trans);
    }
  }

  // If language is not Korean and there are still Hangul letters left, run Romanization fallback
  if (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(res)) {
    res = romanizeHangul(res);
  }

  return res.replace(/\s+/g, ' ').trim();
}

export function getTranslatedAddress(address, lang = 'ko') {
  if (!address) return '';
  if (lang === 'ko') return address;

  let res = address;
  const ADDR_MAP = {
    en: [
      ['서울특별시', 'Seoul, '], ['서울시', 'Seoul, '], ['서울', 'Seoul, '],
      ['부산광역시', 'Busan, '], ['부산시', 'Busan, '], ['부산', 'Busan, '],
      ['제주특별자치도', 'Jeju Island, '], ['제주시', 'Jeju City, '], ['서귀포시', 'Seogwipo, '],
      ['인천광역시', 'Incheon, '], ['인천시', 'Incheon, '],
      ['강원특별자치도', 'Gangwon State, '], ['강원도', 'Gangwon-do, '], ['속초시', 'Sokcho, '],
      ['경기도', 'Gyeonggi-do, '], ['수원시', 'Suwon, '], ['팔달구', 'Paldal-gu, '],
      ['경상북도', 'Gyeongsangbuk-do, '], ['경북', 'Gyeongbuk, '], ['경주시', 'Gyeongju, '],
      ['경상남도', 'Gyeongsangnam-do, '], ['경남', 'Gyeongnam, '],
      ['전북특별자치도', 'Jeonbuk State, '], ['전북도', 'Jeonbuk, '], ['전주시', 'Jeonju, '], ['완산구', 'Wansan-gu, '],
      ['전라남도', 'Jeollanam-do, '], ['전남', 'Jeonnam, '],
      ['충청북도', 'Chungcheongbuk-do, '], ['충북', 'Chungbuk, '],
      ['충청남도', 'Chungcheongnam-do, '], ['충남', 'Chungnam, '], ['공주시', 'Gongju-si, '],
      ['대구광역시', 'Daegu, '], ['대전광역시', 'Daejeon, '], ['광주광역시', 'Gwangju, '], ['울산광역시', 'Ulsan, '], ['세종특별자치시', 'Sejong, '],
      ['당간지주길', 'Dangganjiju-gil '], ['(반죽동)', '(Banjuk-dong)'], ['반죽동', 'Banjuk-dong'], ['사직로', 'Sajik-ro '],
      ['세종대로', 'Sejong-daero '], ['청사포로', 'Cheongsapo-ro '], ['설악산로', 'Seoraksan-ro '],
      ['원화로', 'Wonhwa-ro '], ['기린대로', 'Girin-daero '], ['남산공원길', 'Namsangongwon-gil '],
      ['컨벤시아대로', 'Convensia-daero '], ['정조로', 'Jeongjo-ro ']
    ],
    ja: [
      ['서울특별시', 'ソウル特別市 '], ['서울', 'ソウル '], ['부산광역시', '釜山広域市 '], ['부산', '釜山 '],
      ['제주특별자치도', '済州特別自治道 '], ['제주', '済州 '], ['인천광역시', '仁川広域市 '],
      ['강원특별자치도', '江原特別自治道 '], ['강원', '江原 '], ['경기도', '京畿道 '], ['수원시', '水原市 '],
      ['경상북도', '慶尚北道 '], ['경북', '慶北 '], ['경주시', '慶州市 '],
      ['전북특별자치도', '全北特別自治道 '], ['전주', '全州 '],
      ['충청남도', '忠清南道 '], ['충남', '忠남 '], ['공주시', '公州市 '],
      ['당간지주길', 'Dangganjiju-gil '], ['(반죽동)', '(半竹洞)'], ['반죽동', '半竹洞']
    ],
    zh: [
      ['서울특별시', '首尔特别市 '], ['서울', '首尔 '], ['부산광역시', '釜山广域市 '], ['부산', '釜山 '],
      ['제주특별자치도', '济州特别自治道 '], ['제주', '济州 '], ['인천광역시', '仁川广域市 '],
      ['강원특별자치도', '江原特别自治道 '], ['강원', '江原 '], ['경기도', '京畿道 '], ['수원시', '水原市 '],
      ['경상북도', '庆尚北道 '], ['경북', '庆北 '], ['경주시', '庆州市 '],
      ['전북특별자치도', '全北特别自治道 '], ['전주', '全州 '],
      ['충청남도', '忠清南道 '], ['충남', '忠南 '], ['공주시', '公州市 '],
      ['당간지주길', 'Dangganjiju-gil '], ['(반죽동)', '(半竹洞)'], ['반죽동', '半竹洞']
    ],
    zht: [
      ['서울특별시', '首爾特別市 '], ['서울', '首爾 '], ['부산광역시', '釜山廣域市 '], ['부산', '釜山 '],
      ['제주특별자치도', '濟州特別自治道 '], ['제주', '濟州 '], ['인천광역시', '仁川廣域市 '],
      ['강원특별자치도', '江原特別自治道 '], ['강원', '江原 '], ['경기도', '京畿道 '], ['수원시', '水原市 '],
      ['경상북도', '慶尚北道 '], ['경북', '慶北 '], ['경주시', '慶州市 '],
      ['전북특별자치도', '全北特別自治道 '], ['전주', '全州 '],
      ['충청남도', '忠清南道 '], ['충남', '忠南 '], ['공주시', '公州市 '],
      ['당간지주길', 'Dangganjiju-gil '], ['(반죽동)', '(半竹洞)'], ['반죽동', '半竹洞']
    ]
  };

  const list = ADDR_MAP[lang] || ADDR_MAP.en;
  for (const [kr, trans] of list) {
    res = res.replace(new RegExp(kr, 'g'), trans);
  }

  // Handle road numbers like 810번길 -> 810beon-gil
  if (lang === 'en') {
    res = res
      .replace(/(\d+)\s*번길/g, '$1beon-gil')
      .replace(/(\d+)\s*길/g, '$1-gil')
      .replace(/(\d+)\s*로/g, '$1-ro')
      .replace(/(\d+)\s*동/g, '$1-dong')
      .replace(/(\d+)\s*가/g, '$1-ga')
      .replace(/번길/g, 'beon-gil ')
      .replace(/길\b/g, '-gil ');
  } else if (lang === 'ja' || lang === 'zh') {
    res = res
      .replace(/(\d+)\s*번길/g, '$1号街')
      .replace(/(\d+)\s*길/g, '$1路')
      .replace(/(\d+)\s*로/g, '$1路')
      .replace(/(\d+)\s*동/g, '$1洞')
      .replace(/번길/g, '号街')
      .replace(/길/g, '路');
  }

  // Automatic Romanization fallback for any remaining Korean words in address
  if (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(res)) {
    res = res.replace(/([\uAC00-\uD7A3]+)/g, (match) => {
      if (match.endsWith('동')) {
        return romanizeHangul(match.slice(0, -1)) + '-dong';
      }
      if (match.endsWith('구')) {
        return romanizeHangul(match.slice(0, -1)) + '-gu';
      }
      if (match.endsWith('시')) {
        return romanizeHangul(match.slice(0, -1)) + '-si';
      }
      if (match.endsWith('로')) {
        return romanizeHangul(match.slice(0, -1)) + '-ro';
      }
      if (match.endsWith('길')) {
        return romanizeHangul(match.slice(0, -1)) + '-gil';
      }
      return romanizeHangul(match);
    });
  }

  // Cleanup any accidental double parentheses or spaces
  res = res
    .replace(/\s+/g, ' ')
    .replace(/\(\s*\(/g, '(')
    .replace(/\)\s*\)/g, ')')
    .trim();

  return res;
}

export function getTranslatedTheme(theme, lang = 'ko') {
  if (!theme) return '';
  if (lang === 'ko') return theme;
  const tObj = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return tObj.themes?.[theme] || theme;
}

export function getTranslatedReview(review, lang = 'ko') {
  if (!review) return review;
  if (lang === 'ko') return review;

  const REVIEW_TRANS = {
    en: {
      '날씨 좋을 때 방문하니 경관이 정말 훌륭했습니다! 포토스팟도 많고 강력 추천합니다.': 'Visiting in nice weather gave an absolutely stunning view! Great photo spots and highly recommended.',
      '주변 로컬 맛집 코스가 잘 되어 있네요. 주차 공간도 여유로워서 무척 편했습니다.': 'Great local food spots nearby. Ample parking space made it super convenient.',
      '가족과 함께 오기 좋은 곳입니다. 편의시설이 깔끔하게 잘 정비되어 있습니다.': 'A wonderful place to visit with family. Amenities are clean and well-maintained.',
      '인생샷 사진 찍기 최고입니다! 대중교통 접근성도 좋고 주변 둘레길 산책 코스도 무척 좋습니다.': 'Best spot for taking photos! Excellent public transport access and walking trails nearby.',
      '가족들과 주말 나들이로 다녀왔는데 경치가 너무 고즈넉하고 힐링되었습니다.': 'Went on a weekend family trip. Scenic, tranquil atmosphere provided great healing.'
    },
    ja: {
      '날씨 좋을 때 방문하니 경관이 정말 훌륭했습니다! 포토스팟도 많고 강력 추천합니다.': 'お天気の良い日に訪れたら景観が本当に素晴らしかったです！フォトスポットも多く大満足です。',
      '주변 로컬 맛집 코스가 잘 되어 있네요. 주차 공간도 여유로워서 무척 편했습니다.': '周辺のローカルグルメコースが充実しています。駐車場も広くてとても便利でした。',
      '가족과 함께 오기 좋은 곳입니다. 편의시설이 깔끔하게 잘 정비되어 있습니다.': '家族と一緒に来るのに最適な場所です。設備が清潔で整っています。',
      '인생샷 사진 찍기 최고입니다! 대중교통 접근성도 좋고 주변 둘레길 산책 코스도 무척 좋습니다.': '映え写真を撮るのに最高！公共交通機関のアクセスも良く、周辺の散策コースも素晴らしいです。',
      '가족들과 주말 나들이로 다녀왔는데 경치가 너무 고즈넉하고 힐링되었습니다.': '週末に家族でお出かけしました。静かで趣のある風景にとても癒されました。'
    },
    zh: {
      '날씨 좋을 때 방문하니 경관이 정말 훌륭했습니다! 포토스팟도 많고 강력 추천합니다.': '天气晴朗时前往，风景非常绝美！打卡拍照点很多，强烈推荐！',
      '주변 로컬 맛집 코스가 잘 되어 있네요. 주차 공간도 여유로워서 무척 편했습니다.': '周边地方特色美食路线规划得很好，停车位宽敞便利。',
      '가족과 함께 오기 좋은 곳입니다. 편의시설이 깔끔하게 잘 정비되어 있습니다.': '非常适合全家出游的好地方，公共设施整洁完善。',
      '인생샷 사진 찍기 최고입니다! 대중교통 접근성도 좋고 주변 둘레길 산책 코스도 무척 좋습니다.': '拍照绝佳地点！公共交通便利，周围的散步小道环境优美。',
      '가족들과 주말 나들이로 다녀왔는데 경치가 너무 고즈넉하고 힐링되었습니다.': '周末和家人一起出游，风景宁静典雅，身心得到了极大放松。'
    }
  };

  const list = REVIEW_TRANS[lang] || REVIEW_TRANS.en;
  const authorMap = {
    en: { '김민준': 'Minjun Kim', '이서연': 'Seoyeon Lee', '박지훈': 'Jihoon Park', '최유진': 'Yujin Choi', '정명훈': 'Myeonghun Jeong' },
    ja: { '김민준': '金ミンジュン', '이서연': '李ソヨン', '박지훈': '朴ジフン', '최유진': '崔ユジン', '정명훈': '鄭ミョンフン' },
    zh: { '김민준': '金民俊', '이서연': '李瑞妍', '박지훈': '朴智勋', '최유진': '崔有珍', '정명훈': '郑明勋' }
  };
  const ageMap = {
    en: { '10대': 'Teens', '20대': '20s', '30대': '30s', '40대': '40s', '50대이상': '50s+' },
    ja: { '10대': '10代', '20대': '20代', '30대': '30代', '40대': '40代', '50대이상': '50代以上' },
    zh: { '10대': '10多岁', '20대': '20多岁', '30대': '30多岁', '40대': '40多岁', '50대이상': '50岁以上' }
  };
  const genderMap = {
    en: { '남성': 'Male', '여성': 'Female' },
    ja: { '남성': '男性', '여성': '女性' },
    zh: { '남성': '男性', '여성': '女性' }
  };

  const currentAuthorMap = authorMap[lang] || authorMap.en;
  const currentAgeMap = ageMap[lang] || ageMap.en;
  const currentGenderMap = genderMap[lang] || genderMap.en;

  return {
    ...review,
    author: currentAuthorMap[review.author] || review.author,
    ageGroup: currentAgeMap[review.ageGroup] || review.ageGroup,
    gender: currentGenderMap[review.gender] || review.gender,
    content: list[review.content] || review.content
  };
}

export function getTranslatedOverview(overview, title = '', lang = 'ko') {
  if (!overview) return '';
  if (lang === 'ko') return overview;

  if (title === '가가책방' || overview.includes('가가책방')) {
    if (lang === 'en') return 'Gaga Bookstore is a cozy local independent bookstore and cultural salon located in Gongju, Chungcheongnam-do. It offers curated books, peaceful reading spaces, and local artistic vibes.';
    if (lang === 'ja') return 'ガガ本屋は忠清南道公州市にある独立系書店兼文化サロンです。厳選された本と静かな読書空間、ローカルアートの雰囲気を提供します。';
    if (lang === 'zh') return 'Gaga书店是位于忠清南道公州市的一家充满特色的独立书店与文化空间，提供精选书籍和安静舒适的阅读体验。';
  }

  const OVERVIEW_MAP = {
    en: {
      '한국관광공사 TourAPI 공식 등록 관광지입니다.': 'Officially registered tourism spot of the Korea Tourism Organization (KTO). Provides rich cultural experiences and scenic beauty.',
      '대한민국 관광공사 공식 등록 대표 명소입니다. 아름다운 풍경과 다양한 볼거리를 제공합니다.': 'Official landmark registered with Korea Tourism Organization. Offers scenic views and iconic cultural experiences.'
    },
    ja: {
      '한국관광공사 TourAPI 공식 등록 관광지입니다.': '韓国観光公社(KTO)公式登録の観光スポットです。豊かな文化的体験と美しい風景を提供します。',
      '대한민국 관광공사 공식 등록 대표 명소입니다. 아름다운 풍경과 다양한 볼거리를 제공합니다.': '韓国観光公社公式登録の代表的観光スポットです。美しい風景と様々な見どころを提供します。'
    },
    zh: {
      '한국관광공사 TourAPI 공식 등록 관광지입니다.': '韩国旅游发展局(KTO)官方登记景点，提供丰富的文化体验与绝美自然风光。',
      '대한민국 관광공사 공식 등록 대표 명소입니다. 아름다운 풍경과 다양한 볼거리를 제공합니다.': '韩国旅游发展局官方登记代表景点，提供优雅风光与丰富文化体验。'
    }
  };

  const list = OVERVIEW_MAP[lang] || OVERVIEW_MAP.en;
  return list[overview] || overview;
}

export function getTranslatedDetailText(text, lang = 'ko') {
  if (!text) return '';
  if (lang === 'ko') return text;

  const TEXT_MAP = {
    en: {
      '09:00 - 18:00 (입장마감 17:00 / 매주 월요일 휴무)': '09:00 - 18:00 (Last Entry 17:00 / Closed Mondays)',
      '관광안내콜센터 1330': 'Tourist Info Center 1330',
      '봄/가을 맑은 날 최적 (사계절 방문 가능)': 'Best on clear Spring/Autumn days (Year-round)',
      '한국관광공사 TourAPI 공식 인증 대표 명소': 'Officially certified landmark of KTO TourAPI 4.0',
      '지역 특색 미식 및 주변 로컬 감성 카페 연계 코스': 'Paired with local gastronomy & aesthetic neighborhood cafes',
      '인생샷 포토 스팟 및 야경 뷰포인트 추천': 'Recommended photo spots & stunning night view points',
      '대중교통 및 주차 시설 완비 (가족/연인/나홀로 여행 최적)': 'Convenient public transit & parking (ideal for family & solo travel)'
    },
    ja: {
      '09:00 - 18:00 (입장마감 17:00 / 매주 월요일 휴무)': '09:00 - 18:00 (入場締切 17:00 / 毎週月曜日休館)',
      '관광안내콜센터 1330': '観光案内コールセンター 1330',
      '봄/가을 맑은 날 최적 (사계절 방문 가능)': '春・秋の晴れた日が最適 (年中無休)',
      '한국관광공사 TourAPI 공식 인증 대표 명소': '韓国観光公社TourAPI公式認定の代表的スポット',
      '지역 특색 미식 및 주변 로컬 감성 카페 연계 코스': '地域の特色あるグルメや人気ローカルカフェの連動コース',
      '인생샷 포토 스팟 및 야경 뷰포인트 추천': '映え写真スポット＆夜景ビューポイントのオススメ',
      '대중교통 및 주차 시설 완비 (가족/연인/나홀로 여행 최적)': '公共交通機関アクセス＆駐車場完備（ファミリー・一人旅に最適）'
    },
    zh: {
      '09:00 - 18:00 (입장마감 17:00 / 매주 월요일 휴무)': '09:00 - 18:00 (截止入场 17:00 / 每周一闭馆)',
      '관광안내콜센터 1330': '旅游咨询热线 1330',
      '봄/가을 맑은 날 최적 (사계절 방문 가능)': '春秋晴天游览最佳 (全年开放)',
      '한국관광공사 TourAPI 공식 인증 대표 명소': '韩国旅游发展局TourAPI官方认证代表景点',
      '지역 특색 미식 및 주변 로컬 감성 카페 연계 코스': '联动地方特色美食与周边特色文青咖啡馆路线',
      '인생샷 포토 스팟 및 야경 뷰포인트 추천': '推荐绝美打卡拍照点与迷人夜景观景点',
      '대중교통 및 주차 시설 완비 (가족/연인/나홀로 여행 최적)': '公共交通便利与停车设施完善（极度适合家庭与单人游）'
    }
  };

  const list = TEXT_MAP[lang] || TEXT_MAP.en;
  return list[text] || text;
}

export function getTranslatedFood(food, lang = 'ko') {
  if (!food) return food;
  if (lang === 'ko') return food;

  const FOOD_NAME_MAP = {
    en: {
      '제주 청정 흑돼지 구이 & 멜젓': 'Jeju Premium Black Pork BBQ & Anchovy Dip',
      '시원한 살얼음 물냉면 & 숯불고기': 'Chilled Mul-Naengmyeon & Charcoal Pork',
      '제주 해산물 물회 & 싱싱 전복죽': 'Jeju Seafood Mulhoe & Fresh Abalone Porridge',
      '뜨끈한 뚝배기 국밥 & 쫄깃 수육': 'Hot Clay-pot Gukbap & Boiled Pork Slices',
      '얼큰한 해물 뚝배기 전골 & 칼국수': 'Spicy Seafood Hot-pot & Kalguksu Noodle'
    },
    ja: {
      '제주 청정 흑돼지 구이 & 멜젓': '済州クリーン黒豚焼肉 ＆ メルジョッ(イワ시塩辛)',
      '시원한 살얼음 물냉면 & 숯불고기': 'キンキン冷やし水冷麺 ＆ 炭火焼き肉',
      '제주 해산물 물회 & 싱싱 전복죽': '済州海鮮ムルフェ ＆ 新鮮アワビ粥',
      '뜨끈한 뚝배기 국밥 & 쫄깃 수육': 'アツアツ土鍋クッパ ＆ モチモチ豚スユク',
      '얼큰한 해물 뚝배기 전골 & 칼국수': 'ピリ辛海鮮土鍋チゲ ＆ カルグクス'
    },
    zh: {
      '제주 청정 흑돼지 구이 & 멜젓': '济州清净黑猪肉烤肉 & 鳀鱼酱',
      '시원한 살얼음 물냉면 & 숯불고기': '冰爽水冷面 & 炭火烤肉',
      '제주 해산물 물회 & 싱싱 전복죽': '济州海鲜水刺身 & 新鲜鲍鱼粥',
      '뜨끈한 뚝배기 국밥 & 쫄깃 수육': '热腾腾砂锅汤饭 & 白切猪肉',
      '얼큰한 해물 뚝배기 전골 & 칼국수': '香辣海鲜砂锅火锅 & 刀削面'
    },
    zht: {
      '제주 청정 흑돼지 구이 & 멜젓': '濟州清淨黑豬肉烤肉 & 鯷魚醬',
      '시원한 살얼음 물냉면 & 숯불고기': '冰爽水冷麵 & 炭火烤肉',
      '제주 해산물 물회 & 싱싱 전복죽': '濟州海鮮水刺身 & 新鮮鮑魚粥',
      '뜨끈한 뚝배기 국밥 & 쫄깃 수육': '熱騰騰砂鍋湯飯 & 白切豬肉',
      '얼큰한 해물 뚝배기 전골 & 칼국수': '香辣海鮮砂鍋火鍋 & 刀削麵'
    },
    de: {
      '제주 청정 흑돼지 구이 & 멜젓': 'Jeju Bio-Schwarzschwein BBQ & Anchovis-Dip',
      '시원한 살얼음 물냉면 & 숯불고기': 'Eiskalte Mul-Naengmyeon & Holzkohle-BBQ',
      '제주 해산물 물회 & 싱싱 전복죽': 'Jeju Meeresfrüchte Mulhoe & Abalone-Suppe',
      '뜨끈한 뚝배기 국밥 & 쫄깃 수육': 'Heißer Tontopf-Gukbap & Gekochtes Schweinefleisch',
      '얼큰한 해물 뚝배기 전골 & 칼국수': 'Scharfer Meeresfrüchte-Eintopf & Kalguksu'
    },
    fr: {
      '제주 청정 흑돼지 구이 & 멜젓': 'Barbecue de Porc Noir de Jeju & Sauce Anchois',
      '시원한 살얼음 물냉면 & 숯불고기': 'Nouilles Froides Mul-Naengmyeon & Barbecue',
      '제주 해산물 물회 & 싱싱 전복죽': 'Mulhoe aux Fruits de Mer & Bouillie d\'Ormeau',
      '뜨끈한 뚝배기 국밥 & 쫄깃 수육': 'Gukbap Chaud en Pot de Terre & Porc Bouilli',
      '얼큰한 해물 뚝배기 전골 & 칼국수': 'Marmite de Fruits de Mer Épicée & Nouilles'
    },
    es: {
      '제주 청정 흑돼지 구이 & 멜젓': 'Barbacoa de Cerdo Negro de Jeju y Salsa de Anchoas',
      '시원한 살얼음 물냉면 & 숯불고기': 'Fideos Fríos Mul-Naengmyeon y Cerdo al Carbón',
      '제주 해산물 물회 & 싱싱 전복죽': 'Mulhoe de Mariscos de Jeju y Papilla de Abulón',
      '뜨끈한 뚝배기 국밥 & 쫄깃 수육': 'Gukbap Caliente en Cazuela y Cerdo Hervido',
      '얼큰한 해물 뚝배기 전골 & 칼국수': 'Cazuela Picante de Mariscos y Fideos Kalguksu'
    },
    ru: {
      '제주 청정 흑돼지 구이 & 멜젓': 'BBQ из черной свинины Чеджу с соусом',
      '시원한 살얼음 물냉면 & 숯불고기': 'Холодная лапша Муль-нэнмён и мясо на углях',
      '제주 해산물 물회 & 싱싱 전복죽': 'Мульхве из морепродуктов и каша из абалона',
      '뜨끈한 뚝배기 국밥 & 쫄깃 수육': 'Горячий кук바п в горшочке и отварная свинина',
      '얼큰한 해물 뚝배기 전골 & 칼국수': 'Острый суп из морепродуктов и лапша Кальгуксу'
    }
  };

  const FOOD_CAT_MAP = {
    en: { '구이 / 제주특산': 'BBQ / Jeju Specialty', '면류 / 육류': 'Noodles / Meat', '해산물 / 오션뷰': 'Seafood / Ocean View', '국밥 / 한식': 'Soup Rice / Korean', '전골 / 면류': 'Hot-pot / Noodles' },
    ja: { '구이 / 제주특산': '焼肉 / 済州特産', '면류 / 육류': '麺類 / 肉料理', '해산물 / 오션뷰': '海鮮 / オーシャンビュー', '국밥 / 한식': 'クッパ / 韓国料理', '전골 / 면류': '鍋料理 / 麺類' },
    zh: { '구이 / 제주특산': '烧烤 / 济州特产', '면류 / 육류': '面类 / 肉类', '해산물 / 오션뷰': '海鲜 / 海景', '국밥 / 한식': '汤饭 / 韩餐', '전골 / 면류': '火锅 / 面类' },
    zht: { '구이 / 제주특산': '燒烤 / 濟州特產', '면류 / 육류': '麵類 / 肉類', '해산물 / 오션뷰': '海鮮 / 海景', '국밥 / 한식': '湯飯 / 韓餐', '전골 / 면류': '火鍋 / 麵類' },
    de: { '구이 / 제주특산': 'BBQ / Spezialität', '면류 / 육류': 'Nudeln / Fleisch', '해산물 / 오션뷰': 'Meeresfrüchte / Meerblick', '국밥 / 한식': 'Suppenreis / Koreanisch', '전골 / 면류': 'Eintopf / Nudeln' },
    fr: { '구이 / 제주특산': 'Barbecue / Spécialité', '면류 / 육류': 'Nouilles / Viande', '해산물 / 오션뷰': 'Fruits de Mer / Vue Mer', '국밥 / 한식': 'Soupe Riz / Coréen', '전골 / 면류': 'Marmite / Nouilles' },
    es: { '구이 / 제주특산': 'Barbacoa / Especialidad', '면류 / 육류': 'Fideos / Carne', '해산물 / 오션뷰': 'Mariscos / Vista al Mar', '국밥 / 한식': 'Sopa con Arroz / Coreano', '전골 / 면류': 'Cazuela / Fideos' },
    ru: { '구이 / 제주특산': 'BBQ / Специфика', '면류 / 육류': 'Лапша / Мясо', '해산물 / 오션뷰': 'Морепродукты / Вид на море', '국밥 / 한식': 'Суп с рисом / Корейская кухня', '전골 / 면류': 'Суп-жаровня / Лапша' }
  };

  const REASON_MAP = {
    en: {
      '제주 청정 자연에서 자란 두툼하고 육즙 가득한 명품 흑돼지': 'Thick, juicy premium black pork raised in Jeju\'s pristine nature.',
      '화창하고 더운 날씨에 열기를 식혀주는 시원한 원픽 면요리': 'Refreshing cold noodles to cool down the summer heat on sunny days.',
      '시원한 오션뷰와 어울리는 청정 해산물의 싱싱한 식감': 'Fresh ocean seafood texture perfect with a scenic sea view.',
      '추운 겨울철 몸을 온화하고 따스하게 녹여주는 깊은 풍미의 대표 국밥': 'Rich, comforting hot soup rice that warms your body in cold weather.',
      '겨울철 동해/남해 해산물의 얼큰함과 깊은 육수가 일품인 탕 요리': 'Spicy, rich seafood stew made with fresh coastal catches.'
    },
    ja: {
      '제주 청정 자연에서 자란 두툼하고 육즙 가득한 명품 흑돼지': '済州の清らかな大自然で育った、肉汁あふれる極上黒豚。',
      '화창하고 더운 날씨에 열기를 식혀주는 시원한 원픽 면요리': '晴れた暑い日の熱気を冷ましてくれる冷んやり名物麺料理。',
      '시원한 오션뷰와 어울리는 청정 해산물의 싱싱한 식감': '爽やかなオーシャンビューにぴったりの新鮮な海の幸。',
      '추운 겨울철 몸을 온화하고 따스하게 녹여주는 깊은 풍미의 대표 국밥': '寒い冬に体を芯から温めてくれる濃厚な深みのある絶品クッパ。',
      '겨울철 동해/남해 해산물의 얼큰함과 깊은 육수가 일품인 탕 요리': '冬の新鮮な海の幸의 旨味が染み出たピリ辛濃厚スープ料理。'
    },
    zh: {
      '제주 청정 자연에서 자란 두툼하고 육즙 가득한 명품 흑돼지': '在济州清净大自然中生长的厚实多汁特级黑猪肉。',
      '화창하고 더운 날씨에 열기를 식혀주는 시원한 원픽 면요리': '晴朗炎热天气里清凉解暑的首选面食。',
      '시원한 오션뷰와 어울리는 청정 해산물의 싱싱한 식감': '与爽朗海景完美搭配的清净新鲜海鲜口感。',
      '추운 겨울철 몸을 온화하고 따스하게 녹여주는 깊은 풍미의 대표 국밥': '寒冬里温暖全身的浓郁经典汤饭。',
      '겨울철 동해/남해 해산물의 얼큰함과 깊은 육수가 일품인 탕 요리': '融入冬季新鲜海鲜与浓郁高汤的香辣锅物。'
    },
    zht: {
      '제주 청정 자연에서 자란 두툼하고 육즙 가득한 명품 흑돼지': '在濟州清淨大自然中生長厚實多汁特級黑豬肉。',
      '화창하고 더운 날씨에 열기를 식혀주는 시원한 원픽 면요리': '晴朗炎熱天氣裏清涼解暑的首選麵食。',
      '시원한 오션뷰와 어울리는 청정 해산물의 싱싱한 식감': '與爽朗海景完美搭配的清淨新鮮海鮮口感。',
      '추운 겨울철 몸을 온화하고 따스하게 녹여주는 깊은 풍미의 대표 국밥': '寒冬裡溫暖全身的濃鬱經典湯飯。',
      '겨울철 동해/남해 해산물의 얼큰함과 깊은 육수가 일품인 탕 요리': '融入冬季新鮮海鮮與濃鬱高湯的香辣鍋物。'
    }
  };

  const nameMap = FOOD_NAME_MAP[lang] || FOOD_NAME_MAP.en;
  const catMap = FOOD_CAT_MAP[lang] || FOOD_CAT_MAP.en;
  const reasonMap = REASON_MAP[lang] || REASON_MAP.en;

  let transName = nameMap[food.name] || food.name;
  let transCat = catMap[food.category] || food.category;
  let transReason = food.reason || '';

  // Extract date prefix like [2026-08-07 ~ 2026-08-10]
  const dateMatch = transReason.match(/^(\[\d{4}-\d{2}-\d{2}\s*~\s*\d{4}-\d{2}-\d{2}\])\s*(.*)/);
  if (dateMatch) {
    const datePrefix = dateMatch[1];
    const rawReason = dateMatch[2];
    const translatedReasonText = reasonMap[rawReason] || (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(rawReason) ? romanizeHangul(rawReason) : rawReason);
    transReason = `${datePrefix} ${translatedReasonText}`;
  } else {
    transReason = reasonMap[transReason] || (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(transReason) ? romanizeHangul(transReason) : transReason);
  }

  if (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(transName)) transName = romanizeHangul(transName);
  if (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(transCat)) transCat = romanizeHangul(transCat);

  return {
    ...food,
    name: transName,
    category: transCat,
    reason: transReason
  };
}

export function getTranslatedOutfit(outfit, lang = 'ko') {
  if (!outfit) return outfit;
  if (lang === 'ko') return outfit;

  const OUTFIT_TITLE_MAP = {
    en: {
      '남녀공용 시티 캐주얼 레이어드 룩': 'Unisex City Casual Layered Look',
      '시원한 린넨 & 아웃도어 트래블 룩': 'Cool Linen & Outdoor Travel Look',
      '남성 캐주얼 레이어드 트래블 룩': 'Men\'s Casual Layered Travel Look',
      '남성 시원한 린넨 & 숏팬츠 룩': 'Men\'s Cool Linen & Shorts Look',
      '여성 트렌디 레이어드 캐주얼 룩': 'Women\'s Trendy Layered Casual Look',
      '여성 시원한 원피스 & 리조트 룩': 'Women\'s Cool One-piece & Resort Look',
      '남성 헤비다운 패딩 & 슬림 롱비니 룩': 'Men\'s Heavy Down Padding & Beanie Look',
      '여성 숏 숏패딩 & 뽀글이 플리스 룩': 'Women\'s Short Puffer & Fleece Look'
    },
    ja: {
      '남녀공용 시티 캐주얼 레이어드 룩': 'ユニセックス シティカジュアルレイヤード',
      '시원한 린넨 & 아웃도어 트래블 룩': '涼しいリネン ＆ アウトドアトラ벨',
      '남성 캐주얼 레이어드 트래블 룩': 'メンズ カジュアルレイヤードトラベル',
      '남성 시원한 린넨 & 숏팬츠 룩': 'メンズ 清涼リネン ＆ ショートパンツ',
      '여성 트렌디 레이어드 캐주얼 룩': 'ウィメンズ ト렌디レイヤードカジュアル',
      '여성 시원한 원피스 & 리조트 룩': 'ウィメンズ 涼しいワンピース ＆ リゾート',
      '남성 헤비다운 패딩 & 슬림 롱비니 룩': 'メンズ ヘビーダウン ＆ ニット帽',
      '여성 숏 숏패딩 & 뽀글이 플리스 룩': 'ウィメンズ 숏ダウン ＆ ボアフリース'
    },
    zh: {
      '남녀공용 시티 캐주얼 레이어드 룩': '男女通穿 都市休闲叠穿',
      '시원한 린넨 & 아웃도어 트래블 룩': '凉爽亚麻 & 户外旅行穿搭',
      '남성 캐주얼 레이어드 트래블 룩': '男士休闲叠穿旅行装',
      '남성 시원한 린넨 & 숏팬츠 룩': '男士清凉亚麻短裤穿搭',
      '여성 트렌디 레이어드 캐주얼 룩': '女士时尚叠穿休闲装',
      '여성 시원한 원피스 & 리조트 룩': '女士清凉连衣裙度假穿搭',
      '남성 헤비다운 패딩 & 슬림 롱비니 룩': '男士保暖防寒羽绒服穿搭',
      '여성 숏 숏패딩 & 뽀글이 플리스 룩': '女士短款羽绒服 & 羊羔绒外套'
    },
    zht: {
      '남녀공용 시티 캐주얼 레이어드 룩': '男女通穿 都市休閒疊穿',
      '시원한 린넨 & 아웃도어 트래블 룩': '涼爽亞麻 & 戶外旅行穿搭',
      '남성 캐주얼 레이어드 트래블 룩': '男士休閒疊穿旅行裝',
      '남성 시원한 린넨 & 숏팬츠 룩': '男士清涼亞麻短褲穿搭',
      '여성 트렌디 레이어드 캐주얼 룩': '女士時尚疊穿休閒裝',
      '여성 시원한 원피스 & 리조트 룩': '女士清涼連衣裙度假穿搭',
      '남성 헤비다운 패딩 & 슬림 롱비니 룩': '男士保暖防寒羽絨服穿搭',
      '여성 숏 숏패딩 & 뽀글이 플리스 룩': '女士短款羽絨服 & 羊羔絨外套'
    }
  };

  const OUTFIT_SEASON_MAP = {
    en: { '봄/가을 (18°C ~ 24°C)': 'Spring/Autumn (18°C ~ 24°C)', '여름 / 햇살 강한 날': 'Summer / Sunny Days', '여름 (28°C ~ 33°C)': 'Summer (28°C ~ 33°C)', '겨울 (한파 / 영하 기온)': 'Winter (Freezing Cold)' },
    ja: { '봄/가을 (18°C ~ 24°C)': '春・秋 (18°C ~ 24°C)', '여름 / 햇살 강한 날': '夏 / 晴れた日', '여름 (28°C ~ 33°C)': '夏 (28°C ~ 33°C)', '겨울 (한파 / 영하 기온)': '冬 (極寒・氷点下)' },
    zh: { '봄/가을 (18°C ~ 24°C)': '春秋 (18°C ~ 24°C)', '여름 / 햇살 강한 날': '夏季 / 阳光强烈', '여름 (28°C ~ 33°C)': '夏季 (28°C ~ 33°C)', '겨울 (한파 / 영하 기온)': '冬季 (严寒 / 零下)' },
    zht: { '봄/가을 (18°C ~ 24°C)': '春秋 (18°C ~ 24°C)', '여름 / 햇살 강한 날': '夏季 / 陽光強烈', '여름 (28°C ~ 33°C)': '夏季 (28°C ~ 33°C)', '겨울 (한파 / 영하 기온)': '冬季 (嚴寒 / 零下)' }
  };

  const OUTFIT_REASON_MAP = {
    en: {
      '무난하고 세련된 남녀공용 캐주얼 스타일': 'Neat and stylish unisex casual travel style.',
      '땀 배출이 쉽고 자외선으로부터 피부를 보호하는 아웃도어 룩': 'Breathable outdoor style protecting skin from UV rays.',
      '활동성이 뛰어난 댄디 남성 스타일': 'Dandy men\'s style with great mobility.',
      '인생샷 촬영과 활동성을 모두 잡은 스타일': 'Stylish look ideal for taking great photos and active touring.'
    },
    ja: {
      '무난하고 세련된 남녀공용 캐주얼 스타일': 'シンプルで洗練されたユニセックスカジュアルスタイル。',
      '땀 배출이 쉽고 자외선으로부터 피부를 보호하는 아웃도어 룩': '通気性に優れ、紫外線から肌を守る機能性アウトドア。',
      '활동성이 뛰어난 댄디 남성 스타일': '動きやすさとスマートさを兼ね備えた男性スタイル。',
      '인생샷 촬영과 활동성을 모두 잡은 스타일': '映え写真撮影と動きやすさを両立したスタイリッシュスタイル。'
    },
    zh: {
      '무난하고 세련된 남녀공용 캐주얼 스타일': '大方得体的都市通用休闲风格。',
      '땀 배출이 쉽고 자외선으로부터 피부를 보호하는 아웃도어 룩': '透气吸汗并有效防护紫外线的户外装。',
      '활동성이 뛰어난 댄디 남성 스타일': '活动便利且利落优雅的男士穿搭。',
      '인생샷 촬영과 활동성을 모두 잡은 스타일': '兼顾美照拍摄与便利舒适度的时尚穿搭。'
    },
    zht: {
      '무난하고 세련된 남녀공용 캐주얼 스타일': '大方得體的都市通用休閒風格。',
      '땀 배출이 쉽고 자외선으로부터 피부를 보호하는 아웃도어 룩': '透氣吸汗並有效防護紫外線的戶外裝。',
      '활동성이 뛰어난 댄디 남성 스타일': '活動便利且利落優雅的男士穿搭。',
      '인생샷 촬영과 활동성을 모두 잡은 스타일': '兼顧美照拍攝與便利舒適度的時尚穿搭。'
    }
  };

  const ITEM_MAP = {
    en: {
      '오버핏 셔츠': 'Overfit Shirt', '편안한 슬랙스/데님': 'Comfy Slacks/Denim', '러닝 스니커즈': 'Running Sneakers', '에코백': 'Eco Canvas Tote Bag',
      '통기성 반팔 셔츠': 'Breathable Short Sleeve Shirt', '자외선 차단 모자': 'UV Protection Sun Hat', '트레킹 샌들': 'Trekking Sandals', '선글라스': 'Sunglasses',
      '린넨/옥스퍼드 셔츠': 'Linen/Oxford Shirt', '치노 팬츠/데님': 'Chino Pants/Denim', '편안한 스니커즈': 'Comfortable Sneakers', '슬림 백팩': 'Slim Backpack',
      '가벼운 카디건/크롭 셔츠': 'Light Cardigan/Crop Shirt', '하이웨이스트 슬랙스': 'High-waist Slacks', '쿠션 스니커즈': 'Cushioned Sneakers', '미니 크로스백': 'Mini Crossbody Bag'
    },
    ja: {
      '오버핏 셔츠': 'オーバーサイズシャツ', '편안한 슬랙스/데님': '快適スラックス/デニム', '러닝 스니커즈': 'ランニングスニーカー', '에코백': 'エコバッグ',
      '통기성 반팔 셔츠': '通気性Tシャツ', '자외선 차단 모자': 'UVカット帽子', '트레킹 샌들': 'トレッキングサンダル', '선글라스': 'サングラス',
      '린넨/옥스퍼드 셔츠': 'リネン/オックスフォードシャツ', '치노 팬츠/데님': 'チノパン/デニム', '편안한 스니커즈': '快適スニーカー', '슬림 백팩': 'ス림バックパック',
      '가벼운 카디건/크롭 셔츠': 'カーディガン/クロップドシャツ', '하이웨이스트 슬랙스': 'ハイウエストスラックス', '쿠션 스니커즈': 'クッションスニーカー', '미니 크로스백': 'ミニクロスバッグ'
    },
    zh: {
      '오버핏 셔츠': '宽松衬衫', '편안한 슬랙스/데님': '舒适西裤/牛仔裤', '러닝 스니커즈': '跑步慢跑鞋', '에코백': '帆布环保袋',
      '통기성 반팔 셔츠': '透气短袖衬衫', '자외선 차단 모자': '防晒遮阳帽', '트레킹 샌들': '户外徒步凉鞋', '선글라스': '太阳镜/墨镜',
      '린넨/옥스퍼드 셔츠': '亚麻/牛津纺衬衫', '치노 팬츠/데님': '工装裤/牛仔裤', '편안한 스니커즈': '舒适休闲鞋', '슬림 백팩': '便携双肩包',
      '가벼운 카디건/크롭 셔츠': '针织开衫/短款衬衫', '하이웨이스트 슬랙스': '高腰西装裤', '쿠션 스니커즈': '减震运动鞋', '미니 크로스백': '迷你斜挎包'
    },
    zht: {
      '오버핏 셔츠': '鬆身襯衫', '편안한 슬랙스/데님': '舒適西褲/牛仔褲', '러닝 스니커즈': '跑步慢跑鞋', '에코백': '帆布環保袋',
      '통기성 반팔 셔츠': '透氣短袖襯衫', '자외선 차단 모자': '防曬遮陽帽', '트레킹 샌들': '戶外徒步涼鞋', '선글라스': '太陽鏡/墨鏡',
      '린넨/옥스퍼드 셔츠': '亞麻/牛津紡襯衫', '치노 팬츠/데님': '工裝褲/牛仔褲', '편안한 스니커즈': '舒適休閒鞋', '슬림 백팩': '便攜雙肩包',
      '가벼운 카디건/크롭 셔츠': '針織開衫/短款襯衫', '하이웨이스트 슬랙스': '高腰西裝褲', '쿠션 스니커즈': '減震運動鞋', '미니 크로스백': '迷你斜挎包'
    }
  };

  const titleMap = OUTFIT_TITLE_MAP[lang] || OUTFIT_TITLE_MAP.en;
  const seasonMap = OUTFIT_SEASON_MAP[lang] || OUTFIT_SEASON_MAP.en;
  const reasonMap = OUTFIT_REASON_MAP[lang] || OUTFIT_REASON_MAP.en;
  const itemMap = ITEM_MAP[lang] || ITEM_MAP.en;

  let transTitle = titleMap[outfit.title] || outfit.title;
  let transSeason = seasonMap[outfit.season] || outfit.season;
  let transReason = outfit.reason || '';

  // Extract date / region prefix like 2026-08-07 ~ 2026-08-10
  const dateMatch = transReason.match(/^(\d{4}-\d{2}-\d{2}\s*~\s*\d{4}-\d{2}-\d{2}\s*\(.*?\))\s*(.*)/) || transReason.match(/^(\d{4}-\d{2}-\d{2}\s*~\s*\d{4}-\d{2}-\d{2})\s*(.*)/);
  if (dateMatch) {
    const datePrefix = dateMatch[1];
    const rawReason = dateMatch[2];
    const translatedReasonText = reasonMap[rawReason] || (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(rawReason) ? romanizeHangul(rawReason) : rawReason);
    transReason = `${datePrefix} ${translatedReasonText}`;
  } else {
    transReason = reasonMap[transReason] || (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(transReason) ? romanizeHangul(transReason) : transReason);
  }

  if (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(transTitle)) transTitle = romanizeHangul(transTitle);
  if (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(transSeason)) transSeason = romanizeHangul(transSeason);

  const transItems = Array.isArray(outfit.items)
    ? outfit.items.map(i => itemMap[i] || (lang !== 'ko' && /[\uAC00-\uD7A3]/.test(i) ? romanizeHangul(i) : i))
    : outfit.items;

  return {
    ...outfit,
    title: transTitle,
    season: transSeason,
    reason: transReason,
    items: transItems
  };
}