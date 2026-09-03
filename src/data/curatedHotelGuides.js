/**
 * curatedHotelGuides.js - Handcrafted 4-Language Top Hotel Recommendations
 * 
 * Connected to Agoda Official Affiliate Search / Direct Deep Links.
 * Supports: KO, EN, JA, ZH (Simplified / Traditional).
 */

const AGODA_CID = '1972217';

export function getAgodaHotelSearchUrl(cityName, hotelName) {
  const query = encodeURIComponent(`${cityName} ${hotelName}`);
  return `https://www.agoda.com/partners/partnersearch.aspx?cid=${AGODA_CID}&pcs=1&hl=en&searchText=${query}`;
}

export const CURATED_HOTELS = [
  // 1. Seoul - Myeongdong Top Pick
  {
    id: 'hotel_seoul_1',
    city: 'Seoul',
    regionTag: {
      ko: '서울 명동 / 쇼핑·미식 중심지',
      en: 'Myeongdong, Seoul / Shopping Hub',
      ja: 'ソウル 明洞 / ショッピング・グルメ中心',
      zh: '首尔 明洞 / 购物·美食中心'
    },
    names: {
      ko: 'L7 명동 바이 롯데',
      en: 'L7 Myeongdong by Lotte',
      ja: 'L7明洞 バイ ロッテ',
      zh: 'L7 明洞 乐天酒店'
    },
    rating: 4.8,
    reviewsCount: '3,450+',
    priceLevel: '₩₩ (가성비 럭셔리)',
    badge: {
      ko: '⭐ 명동 쇼핑거리 도보 1분',
      en: '⭐ 1-min Walk to Myeongdong Street',
      ja: '⭐ 明洞通り徒歩1分の好立地',
      zh: '⭐ 步行1分钟直达明洞购物街'
    },
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
    descriptions: {
      ko: '명동역 9번 출구 바로 앞에 위치하여 남산타워 뷰 루프탑 바와 트렌디한 디자인을 자랑하는 외국인 선호도 1위 라이프스타일 호텔.',
      en: 'Prime location right in front of Myeongdong Station (Exit 9), featuring a stylish rooftop bar with stunning N Seoul Tower views.',
      ja: '明洞駅9番出口の目の前。南山タワーを望むルーフトップバーと洗練されたデザインが世界中の旅行者に大人気のライフスタイルホテル。',
      zh: '位于明洞站9号出口正前方，拥有俯瞰南山塔美景的屋顶酒吧和充满设计感的现代客房，是赴韩游客的极佳首选。'
    },
    amenities: ['Free WiFi', 'Subway 1min', 'Rooftop Bar', 'Foreign Currency Exchange'],
    agodaUrl: getAgodaHotelSearchUrl('Seoul', 'L7 Myeongdong by Lotte')
  },

  // 2. Seoul - Gangnam Luxury
  {
    id: 'hotel_seoul_2',
    city: 'Seoul',
    regionTag: {
      ko: '서울 강남 / 코엑스·봉은사',
      en: 'Gangnam, Seoul / COEX Mall',
      ja: 'ソウル 江南 / COEX・奉恩寺',
      zh: '首尔 江南 / COEX·奉恩寺'
    },
    names: {
      ko: '그랜드 인터컨티넨탈 서울 파르나스',
      en: 'Grand InterContinental Seoul Parnas',
      ja: 'グランド インターコンチネンタル ソウル パルナス',
      zh: '首尔帕纳斯洲际大饭店'
    },
    rating: 4.9,
    reviewsCount: '2,890+',
    priceLevel: '₩₩₩ (5성급 럭셔리)',
    badge: {
      ko: '🏆 코엑스몰 & 삼성역 직결',
      en: '🏆 Connected to COEX & Subway',
      ja: '🏆 COEXモール＆地下鉄駅直結',
      zh: '🏆 直通COEX购物中心及地铁'
    },
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    descriptions: {
      ko: '삼성역 및 코엑스몰과 바로 연결되는 5성급 럭셔리 호텔로, 최고급 다이닝과 넓고 우아한 객실을 제공합니다.',
      en: 'Premier 5-star luxury directly connected to COEX Mall and Samseong Station, offering world-class dining and spacious guestrooms.',
      ja: '三成駅とCOEXモールに直結する最高級5つ星ホテル。洗練されたダイニングと広々とした優雅な空間を提供。',
      zh: '无缝连接三成站与COEX购物中心的顶级五星级奢华酒店，提供国际水准的高端餐饮与宽敞优雅的下榻体验。'
    },
    amenities: ['Indoor Pool', 'COEX Direct Access', 'Luxury Spa', 'Airport Bus Stop'],
    agodaUrl: getAgodaHotelSearchUrl('Seoul', 'Grand InterContinental Seoul Parnas')
  },

  // 3. Busan - Haeundae Ocean View
  {
    id: 'hotel_busan_1',
    city: 'Busan',
    regionTag: {
      ko: '부산 해운대 / 오션프론트',
      en: 'Haeundae, Busan / Oceanfront',
      ja: '釜山 海雲台 / オーシャンフロント',
      zh: '釜山 海云台 / 一线海景'
    },
    names: {
      ko: '시그니엘 부산',
      en: 'SIGNIEL Busan',
      ja: 'シグニエル 釜山',
      zh: '釜山喜格尼尔酒店'
    },
    rating: 4.9,
    reviewsCount: '2,150+',
    priceLevel: '₩₩₩ (해운대 랜드마크)',
    badge: {
      ko: '🌊 전 객실 파노라마 오션뷰 발코니',
      en: '🌊 Ocean View Balcony in All Rooms',
      ja: '🌊 全室パノラマオーシャンビュー',
      zh: '🌊 全客房均配备全景海景阳台'
    },
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
    descriptions: {
      ko: '해운대 엘시티 랜드마크 타워에 위치하여 푸른 동해 바다를 한눈에 조망할 수 있는 인피니티 풀과 최고급 스파를 갖춘 럭셔리 호텔.',
      en: 'Situated in the iconic LCT Tower, offering breathtaking ocean views from private balconies and an ultra-modern outdoor infinity pool.',
      ja: '海雲台のランドマークLCTタワー内に位置し、インフィニティプールから望む大海原の絶景と最高峰のおもてなしが魅力。',
      zh: '坐落于海云台LCT地标大厦内，拥有震撼的无边际泳池与全客房私人海景阳台，带来无与伦比的滨海度假享受。'
    },
    amenities: ['Infinity Pool', 'Private Balcony', 'Chantecaille Spa', 'Beachfront'],
    agodaUrl: getAgodaHotelSearchUrl('Busan', 'Signiel Busan')
  },

  // 4. Jeju - Seogwipo & Jungmun Resort
  {
    id: 'hotel_jeju_1',
    city: 'Jeju',
    regionTag: {
      ko: '제주 중문관광단지 / 휴양 리조트',
      en: 'Jungmun, Jeju / Luxury Resort',
      ja: '済州 中文観光団地 / リゾート',
      zh: '济州 中文旅游区 / 度假胜地'
    },
    names: {
      ko: '그랜드 조선 제주',
      en: 'Grand Josun Jeju',
      ja: 'グランド 朝鮮 済州',
      zh: '济州格兰德朝鲜酒店'
    },
    rating: 4.8,
    reviewsCount: '1,980+',
    priceLevel: '₩₩₩ (힐링 리조트)',
    badge: {
      ko: '🌴 사계절 온수풀 & 야자수 가든',
      en: '🌴 Year-Round Heated Pools & Palm Garden',
      ja: '🌴 オールシーズン温水プール＆ガーデン',
      zh: '🌴 四季温水泳池与椰林花园'
    },
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80',
    descriptions: {
      ko: '중문 바다의 이국적인 야자수 정원과 사계절 온수 루프탑 인피니티 풀에서 진정한 힐링을 선사하는 프리미엄 리조트 호텔.',
      en: 'A premier getaway nestled in lush tropical gardens with adult-only rooftop heated pools and family-friendly wellness amenities.',
      ja: '中文の豊かな自然とヤシの木に囲まれたリゾート。大人専用の屋上温水プールや多彩なダイニングで極上の癒やしを満喫。',
      zh: '置身于中文度假区的热带椰林怀抱中，拥有成人专属屋顶温水无边际泳池与丰富的亲子休闲设施，享受纯正的海岛假期。'
    },
    amenities: ['Heated Pool', 'Kids Club', 'Tropical Garden', 'Fine Dining'],
    agodaUrl: getAgodaHotelSearchUrl('Jeju', 'Grand Josun Jeju')
  }
];
