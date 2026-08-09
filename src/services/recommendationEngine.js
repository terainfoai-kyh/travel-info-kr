export function getRecommendedFoodAndOutfit({ weather, region, theme, age, gender, keyword = '' }) {
  const isSunny = weather?.weatherText?.includes('맑음');
  const isRainy = weather?.weatherText?.includes('비') || weather?.weatherText?.includes('흐림');
  const temp = parseInt(weather?.temperature || '24', 10);
  const kw = keyword.trim().toLowerCase();

  // Extract Season from travel forecastDate (e.g. 2026-12-14 ~ 2026-12-18 or current date)
  let travelMonth = new Date().getMonth() + 1; // Default current month
  if (weather?.forecastDate) {
    const match = weather.forecastDate.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match && match[2]) {
      travelMonth = parseInt(match[2], 10);
    }
  }

  let seasonName = 'summer'; // 'spring', 'summer', 'autumn', 'winter'
  if (travelMonth === 12 || travelMonth === 1 || travelMonth === 2) {
    seasonName = 'winter';
  } else if (travelMonth >= 3 && travelMonth <= 5) {
    seasonName = 'spring';
  } else if (travelMonth >= 6 && travelMonth <= 8) {
    seasonName = 'summer';
  } else {
    seasonName = 'autumn';
  }

  // Expanded Master Food Catalog tagged with season, region, and weather
  const MASTER_FOODS = [
    {
      id: 'f-winter-1',
      name: '뜨끈한 뚝배기 국밥 & 쫄깃 수육',
      category: '국밥 / 한식',
      regions: ['전국', '부산', '서울', '경기', '인천', '제주', '강원'],
      weatherType: 'all',
      seasons: ['winter', 'autumn'],
      targetAge: ['10대', '20대', '30대', '40대', '50대이상', '전체'],
      targetGender: ['남성', '여성', '무관'],
      keywords: ['국밥', '수육', '돼지국밥', '설렁탕', '곰탕'],
      image: '/default-spot.png',
      reason: '추운 겨울철 몸을 온화하고 따스하게 녹여주는 깊은 풍미의 대표 국밥'
    },
    {
      id: 'f-winter-2',
      name: '제주 청정 흑돼지 구이 & 멜젓',
      category: '구이 / 제주특산',
      regions: ['제주', '전국'],
      weatherType: 'all',
      seasons: ['winter', 'spring', 'summer', 'autumn'],
      targetAge: ['20대', '30대', '40대', '50대이상', '전체'],
      targetGender: ['남성', '여성', '무관'],
      keywords: ['제주', '흑돼지', '돼지', '삼겹살'],
      image: '/default-spot.png',
      reason: '제주 청정 자연에서 자란 두툼하고 육즙 가득한 명품 흑돼지'
    },
    {
      id: 'f-winter-3',
      name: '얼큰한 해물 뚝배기 전골 & 칼국수',
      category: '전골 / 면류',
      regions: ['전국', '제주', '부산', '강원', '인천'],
      weatherType: 'all',
      seasons: ['winter', 'autumn'],
      targetAge: ['10대', '20대', '30대', '40대', '50대이상', '전체'],
      targetGender: ['남성', '여성', '무관'],
      keywords: ['전골', '해물탕', '칼국수', '뚝배기'],
      image: '/default-spot.png',
      reason: '겨울철 동해/남해 해산물의 얼큰함과 깊은 육수가 일품인 탕 요리'
    },
    {
      id: 'f-summer-1',
      name: '시원한 살얼음 물냉면 & 숯불고기',
      category: '면류 / 육류',
      regions: ['전국', '서울', '경기', '인천', '강원', '부산', '대구'],
      weatherType: 'sunny',
      seasons: ['summer', 'spring'],
      targetAge: ['10대', '20대', '30대', '40대', '50대이상', '전체'],
      targetGender: ['남성', '여성', '무관'],
      keywords: ['냉면', '물냉면', '비빔냉면', '면', '고기'],
      image: '/default-spot.png',
      reason: '화창하고 더운 날씨에 열기를 식혀주는 시원한 원픽 면요리'
    },
    {
      id: 'f-summer-2',
      name: '제주 해산물 물회 & 싱싱 전복죽',
      category: '해산물 / 오션뷰',
      regions: ['제주', '부산', '강원', '인천', '전국'],
      weatherType: 'sunny',
      seasons: ['summer', 'spring'],
      targetAge: ['20대', '30대', '40대', '50대이상', '전체'],
      targetGender: ['남성', '여성', '무관'],
      keywords: ['물회', '해산물', '전복', '생선'],
      image: '/default-spot.png',
      reason: '시원한 오션뷰와 어울리는 청정 해산물의 싱싱한 식감'
    }
  ];

  // Multi-Condition Scoring Function for Foods
  let scoredFoods = MASTER_FOODS.map(food => {
    let score = 0;
    if (food.seasons.includes(seasonName)) score += 50; // High seasonal score
    if (region === '전국' || food.regions.includes(region)) score += 30;
    if (gender === '무관' || food.targetGender.includes(gender)) score += 10;
    if (age === '전체' || food.targetAge.includes(age)) score += 10;
    return { ...food, score };
  });

  scoredFoods.sort((a, b) => b.score - a.score);

  const selectedFoods = scoredFoods.slice(0, 3).map(f => ({
    name: f.name,
    category: f.category,
    image: f.image,
    reason: `${weather?.forecastDate ? `[${weather.forecastDate}] ` : ''}${f.reason}`
  }));

  // Season & Gender-aware Outfit Recommendations Engine
  const isMale = gender === '남성';
  const isFemale = gender === '여성';

  let outfitList = [];

  if (seasonName === 'winter') {
    // WINTER OUTFITS
    if (isMale) {
      outfitList = [
        {
          title: '남성 헤비다운 패딩 & 슬림 롱비니 룩',
          season: '겨울 (한파 / 영하 기온)',
          image: '/default-spot.png',
          items: ['방한 구스다운 롱패딩', '기모 목폴라 니트', '방한 방수 장갑', '보온 방한화'],
          reason: `${weather?.forecastDate || '겨울 여행 기간'} 칼바람을 완벽 방어하고 체온을 지켜주는 스타일`
        },
        {
          title: '남성 댄디 울 코트 & 목도리 스타일',
          season: '겨울 (실내/도시 야경 투어)',
          image: '/default-spot.png',
          items: ['오버핏 롱 울 코트', '울 머플러(목도리)', '슬림 스니커즈', '핫팩'],
          reason: '박물관/전시관 실내 관람 및 도심 야경 촬영에 어울리는 포근하고 클래식한 룩'
        }
      ];
    } else if (isFemale) {
      outfitList = [
        {
          title: '여성 숏 숏패딩 & 뽀글이 플리스 룩',
          season: '겨울 (한파 대비 / 레저)',
          image: '/default-spot.png',
          items: ['볼륨 숏패딩/플리스', '기모 울 니트', '캐시미어 머플러', '방한 미들부츠'],
          reason: `${weather?.forecastDate || '겨울 여행'} 인생샷과 완벽한 방한 보온성을 갖춘 겨울 룩`
        },
        {
          title: '여성 클래식 롱코트 & 울 베레모 룩',
          season: '겨울 (카페 / 스냅 촬영)',
          image: '/default-spot.png',
          items: ['핸드메이드 롱코트', '울 베레모', '가죽 방한 장갑', '앵클 부츠'],
          reason: '겨울 감성 사진을 더욱 돋보이게 하는 포근하고 감성적인 스타일'
        }
      ];
    } else {
      outfitList = [
        {
          title: '남녀공용 헤비 패딩 & 워머 룩',
          season: '겨울 (한파 / 영하 기온)',
          image: '/default-spot.png',
          items: ['롱/숏 방한 패딩', '기모 맨투맨/후드', '방한 장갑/귀마개', '윈터 스니커즈'],
          reason: `${weather?.forecastDate || '겨울 여행'} 따뜻하고 편안한 보온 위주 남녀공용 스타일`
        },
        {
          title: '남녀공용 오버핏 울코트 룩',
          season: '겨울 (실내 & 도시 산책)',
          image: '/default-spot.png',
          items: ['오버핏 울 코트', '체크 목도리', '방한 장갑', '보온 워커'],
          reason: '겨울 도시 여행 및 관광명소 탐방 시 세련된 연출이 가능한 룩'
        }
      ];
    }
  } else {
    // SPRING / SUMMER / AUTUMN OUTFITS
    if (isMale) {
      outfitList = [
        {
          title: '남성 캐주얼 레이어드 트래블 룩',
          season: `${seasonName === 'summer' ? '여름 (28°C ~ 33°C)' : '봄/가을 (18°C ~ 24°C)'}`,
          image: '/default-spot.png',
          items: ['린넨/옥스퍼드 셔츠', '치노 팬츠/데님', '편안한 스니커즈', '슬림 백팩'],
          reason: `${weather?.forecastDate || '여행 기간'} (${region !== '전국' ? region : '여행지'}) 활동성이 뛰어난 댄디 남성 스타일`
        },
        {
          title: isSunny ? '남성 시원한 린넨 & 숏팬츠 룩' : '남성 아웃도어 윈드브레이커 룩',
          season: isSunny ? '여름 / 햇살 강한 날' : '흐림 / 비 소식 준비',
          image: '/default-spot.png',
          items: isSunny ? ['반팔 린넨 셔츠', '이지 반바지', '볼캡 모자', '선글라스'] : ['기능성 경량 점퍼', '방수 트레킹화', '휴대용 우산'],
          reason: isSunny ? '야외 활동 시 땀 배출이 원활하고 스타일리시한 시원한 스타일' : '갑작스러운 비나 바람에 철저히 대비하는 스포츠 룩'
        }
      ];
    } else if (isFemale) {
      outfitList = [
        {
          title: '여성 트렌디 레이어드 캐주얼 룩',
          season: `${seasonName === 'summer' ? '여름 (28°C ~ 33°C)' : '봄/가을 (18°C ~ 24°C)'}`,
          image: '/default-spot.png',
          items: ['가벼운 카디건/크롭 셔츠', '하이웨이스트 슬랙스', '쿠션 스니커즈', '미니 크로스백'],
          reason: `${weather?.forecastDate || '여행 기간'} (${region !== '전국' ? region : '여행지'}) 인생샷 촬영과 활동성을 모두 잡은 스타일`
        },
        {
          title: isSunny ? '여성 시원한 원피스 & 리조트 룩' : '여성 바람막이 & 케이프 룩',
          season: isSunny ? '여름 / 햇살 강한 날' : '흐림 / 비 소식 준비',
          image: '/default-spot.png',
          items: isSunny ? ['통기성 린넨 원피스', '챙 넓은 라피아 햇', '플랫 샌들', '양산'] : ['경량 바람막이', '레인 코트', '방수 샌들'],
          reason: isSunny ? '햇살 강한 야외에서 화사하고 자외선 차단에 우수한 리조트 스타일' : '비바람에도 편안하고 감각적인 스타일'
        }
      ];
    } else {
      outfitList = [
        {
          title: '남녀공용 시티 캐주얼 레이어드 룩',
          season: '봄/가을 (18°C ~ 24°C)',
          image: '/default-spot.png',
          items: ['오버핏 셔츠', '편안한 슬랙스/데님', '러닝 스니커즈', '에코백'],
          reason: `${weather?.forecastDate || '여행 기간'} 무난하고 세련된 남녀공용 캐주얼 스타일`
        },
        {
          title: isSunny ? '시원한 린넨 & 아웃도어 트래블 룩' : '경량 아웃도어 바람막이 룩',
          season: isSunny ? '여름 / 햇살 강한 날' : '흐림 / 비 소식 준비',
          image: '/default-spot.png',
          items: isSunny ? ['통기성 반팔 셔츠', '자외선 차단 모자', '트레킹 샌들', '선글라스'] : ['방풍 점퍼', '접이식 우산', '미끄럼 방지 신발'],
          reason: isSunny ? '땀 배출이 쉽고 자외선으로부터 피부를 보호하는 아웃도어 룩' : '날씨 변화에 민첩하게 대응할 수 있는 기능성 스타일'
        }
      ];
    }
  }

  return { foods: selectedFoods, outfits: outfitList };
}

// Postal Code Prefix Mapping (5-digit Korean Zipcode Rules)
export const ZIPCODE_PROVINCE_MAP = [
  { range: [1, 9], key: '서울' },
  { range: [10, 20], key: '경기' },
  { range: [21, 23], key: '인천' },
  { range: [24, 26], key: '강원' },
  { range: [27, 29], key: '충북' },
  { range: [30, 30], key: '세종' },
  { range: [31, 33], key: '충남' },
  { range: [34, 35], key: '대전' },
  { range: [36, 40], key: '경북' },
  { range: [41, 43], key: '대구' },
  { range: [44, 45], key: '울산' },
  { range: [46, 49], key: '부산' },
  { range: [50, 53], key: '경남' },
  { range: [54, 56], key: '전북' },
  { range: [57, 60], key: '전남' },
  { range: [61, 62], key: '광주' },
  { range: [63, 63], key: '제주' }
];

// AreaCode Mapping (TourAPI official AreaCodes)
export const AREA_CODE_MAP = {
  '1': '서울',
  '2': '인천',
  '3': '대전',
  '4': '대구',
  '5': '광주',
  '6': '부산',
  '7': '울산',
  '8': '세종',
  '31': '경기',
  '32': '강원',
  '33': '충북',
  '34': '충남',
  '35': '경북',
  '36': '경남',
  '37': '전북',
  '38': '전남',
  '39': '제주'
};

// 1st-Level Administrative Province Address Starters
export const PROVINCE_ADDR_PREFIXES = [
  { prefix: '서울특별시', key: '서울' },
  { prefix: '서울', key: '서울' },
  { prefix: '제주특별자치도', key: '제주' },
  { prefix: '제주', key: '제주' },
  { prefix: '부산광역시', key: '부산' },
  { prefix: '부산', key: '부산' },
  { prefix: '강원특별자치도', key: '강원' },
  { prefix: '강원도', key: '강원' },
  { prefix: '강원', key: '강원' },
  { prefix: '전북특별자치도', key: '전북' },
  { prefix: '전라북도', key: '전북' },
  { prefix: '전북', key: '전북' },
  { prefix: '전라남도', key: '전남' },
  { prefix: '전남', key: '전남' },
  { prefix: '경상북도', key: '경북' },
  { prefix: '경북', key: '경북' },
  { prefix: '경상남도', key: '경남' },
  { prefix: '경남', key: '경남' },
  { prefix: '인천광역시', key: '인천' },
  { prefix: '인천', key: '인천' },
  { prefix: '경기도', key: '경기' },
  { prefix: '경기', key: '경기' },
  { prefix: '충청북도', key: '충북' },
  { prefix: '충북', key: '충북' },
  { prefix: '충청남도', key: '충남' },
  { prefix: '충남', key: '충남' },
  { prefix: '대구광역시', key: '대구' },
  { prefix: '대구', key: '대구' },
  { prefix: '대전광역시', key: '대전' },
  { prefix: '대전', key: '대전' },
  { prefix: '광주광역시', key: '광주' },
  { prefix: '광주', key: '광주' },
  { prefix: '울산광역시', key: '울산' },
  { prefix: '울산', key: '울산' },
  { prefix: '세종특별자치시', key: '세종' },
  { prefix: '세종', key: '세종' }
];

export function getSpotProvinceKey(spot) {
  if (!spot) return '서울';

  // Layer 1: Check 5-digit Korean Zipcode (zipcode)
  if (spot.zipcode) {
    const zipNum = parseInt(String(spot.zipcode).trim().substring(0, 2), 10);
    if (!isNaN(zipNum)) {
      const matched = ZIPCODE_PROVINCE_MAP.find(m => zipNum >= m.range[0] && zipNum <= m.range[1]);
      if (matched) return matched.key;
    }
  }

  // Layer 2: Check TourAPI Official AreaCode (areaCode)
  if (spot.areaCode && AREA_CODE_MAP[String(spot.areaCode)]) {
    return AREA_CODE_MAP[String(spot.areaCode)];
  }

  // Layer 3: Check 1st-level administrative address prefix (location / addr1 / region)
  const locStr = `${spot.location || ''} ${spot.addr1 || ''}`.trim();
  if (locStr) {
    for (const item of PROVINCE_ADDR_PREFIXES) {
      if (locStr.startsWith(item.prefix) || locStr.includes(item.prefix)) {
        return item.key;
      }
    }
  }

  // Layer 4: Specific landmark title fallback (Strictly full city names, avoiding ambiguous sub-districts like '성산')
  const title = (spot.title || '').toLowerCase();
  if (title.includes('서울') || title.includes('경복궁') || title.includes('광화문') || title.includes('남산타워') || title.includes('북촌한옥')) return '서울';
  if (title.includes('제주') || title.includes('한라산') || title.includes('성산일출봉') || title.includes('섭지코지') || title.includes('서귀포')) return '제주';
  if (title.includes('부산') || title.includes('해운대') || title.includes('광안리') || title.includes('감천문화') || title.includes('자갈치')) return '부산';
  if (title.includes('강릉') || title.includes('속초') || title.includes('설악산') || title.includes('정동진') || title.includes('양양')) return '강원';
  if (title.includes('전주') || title.includes('전주한옥') || title.includes('경기전') || title.includes('덕진공원')) return '전북';
  if (title.includes('경주') || title.includes('불국사') || title.includes('첨성대') || title.includes('황리단길')) return '경북';

  return spot.region || '서울';
}

// Travel time & distance estimator helper
export function calculateTravelEstimate(spotA, spotB) {
  if (!spotA || !spotB) return { distKm: '4.5', carMin: 15, transitMin: 25 };

  const provA = getSpotProvinceKey(spotA);
  const provB = getSpotProvinceKey(spotB);

  // If different administrative provinces (e.g. Seoul vs Jeonbuk, Seoul vs Jeju, Jeju vs Busan)
  if (provA !== provB) {
    return {
      distKm: '220',
      carMin: 150,
      transitMin: 210,
      isLongDistance: true,
      longDistanceNote: '✈️ KTX / 고속버스 이동 (약 2.5시간)'
    };
  }

  let lat1 = parseFloat(spotA.lat);
  let lng1 = parseFloat(spotA.lng);
  let lat2 = parseFloat(spotB.lat);
  let lng2 = parseFloat(spotB.lng);

  if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2) || lat1 === 0 || lat2 === 0) {
    const titleA = spotA.title || 'A';
    const titleB = spotB.title || 'B';
    const pseudoDist = Math.max(1.8, Math.min(8.5, (titleA.length + titleB.length) * 0.4 + 1.2));
    const carMin = Math.round(pseudoDist * 2.0 + 5);
    const transitMin = Math.round(pseudoDist * 3.2 + 8);
    return { distKm: pseudoDist.toFixed(1), carMin, transitMin };
  }

  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = Math.max(0.8, R * c);

  if (dist > 45) {
    const hours = (dist / 70 + 0.3).toFixed(1);
    return {
      distKm: dist.toFixed(0),
      carMin: Math.round(dist * 1.2),
      transitMin: Math.round(dist * 1.8),
      isLongDistance: true,
      longDistanceNote: `✈️ KTX / 고속버스 (약 ${hours}시간)`
    };
  }

  const carMin = Math.max(5, Math.round(dist * 2.0 + 4));
  const transitMin = Math.max(8, Math.round(dist * 3.2 + 6));

  return {
    distKm: dist.toFixed(1),
    carMin,
    transitMin
  };
}

// AI Smart Itinerary Generator Engine
export function generateSmartItinerary({
  region = '서울',
  theme = '전체',
  days = 2,
  startDate = '',
  startTime = '09:30',
  endTime = '20:00',
  dayTimes = {},
  daySeeds = {},
  rainyMode = false,
  refreshSeed = 0,
  spots = []
}) {
  const GYEONGBOKGUNG_FALLBACK_IMG = '/default-spot.png';
  
  // Base date parsing
  let baseDate = new Date();
  if (startDate) {
    const parsed = new Date(startDate);
    if (!isNaN(parsed.getTime())) baseDate = parsed;
  }

  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

  // Parse hour float helper
  const parseHourMin = (timeStr, defaultHour) => {
    if (!timeStr) return defaultHour;
    const parts = timeStr.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h)) return defaultHour;
    return h + (isNaN(m) ? 0 : m / 60);
  };

  const formatTimeSlot = (hFloat) => {
    const totalMins = Math.round(hFloat * 60);
    const h = Math.floor(totalMins / 60) % 24;
    const m = totalMins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Region synonym dictionary for accurate geo-matching
  const REGION_SYNONYMS = {
    '제주': ['제주', '서귀포', '제주시', '우도', '성산', '한라산', '애월', '중문', '협재', '섭지코지'],
    '서울': ['서울', '강남', '홍대', '명동', '이태원', '종로', '잠실', '성수', '경복궁', '남산'],
    '부산': ['부산', '해운대', '광안리', '남포동', '서면', '영도', '기장', '태종대', '감천'],
    '강원': ['강원', '강릉', '속초', '양양', '평창', '동해', '삼척', '춘천', '설악산', '정동진'],
    '경주': ['경주', '보문', '불국사', '첨성대', '황리단길', '안압지', '동궁'],
    '전주': ['전주', '한옥마을', '덕진'],
    '인천': ['인천', '송도', '영종도', '차이나타운', '월미도'],
    '경기': ['경기', '수원', '용인', '파주', '가평', '양평'],
    '충청': ['충청', '공주', '부여', '단양', '제천', '천안'],
    '전라': ['전라', '여수', '순천', '목포', '담양', '보성'],
    '경상': ['경상', '통영', '거제', '남해', '안동', '포항']
  };

  const REGION_PRESETS = {
    '서울': [
      { title: '경복궁 & 광화문 광장', location: '서울특별시 종로구 사직로 161', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['고궁', '한복체험'], lat: 37.5796, lng: 126.9770 },
      { title: 'N서울타워 & 남산공원', location: '서울특별시 용산구 남산공원길 105', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['야경', '랜드마크'], lat: 37.5512, lng: 126.9882 },
      { title: '북촌한옥마을 & 삼청동', location: '서울특별시 종로구 계동길', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['한옥', '감성카페'], lat: 37.5826, lng: 126.9831 },
      { title: '성수동 카페거리 & 서울숲', location: '서울특별시 성동구 서울숲2길', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.7, tags: ['핫플레이스', '쇼핑'], lat: 37.5445, lng: 127.0441 }
    ],
    '제주': [
      { title: '성산일출봉 & 광치기해변', location: '제주특별자치도 서귀포시 성산읍', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['유네스코', '일출명소'], lat: 33.4581, lng: 126.9426 },
      { title: '한라산 국립공원', location: '제주특별자치도 제주시 1100로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['등산', '인생샷'], lat: 33.3617, lng: 126.5332 },
      { title: '서귀포 매일올레시장', location: '제주특별자치도 서귀포시 중앙로62번길', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.7, tags: ['로컬미식', '야시장'], lat: 33.2494, lng: 126.5638 },
      { title: '섭지코지 & 유채꽃밭', location: '제주특별자치도 서귀포시 성산읍', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['해안산책', '포토존'], lat: 33.4243, lng: 126.9288 }
    ],
    '부산': [
      { title: '해운대 해수욕장 & 블루라인파크', location: '부산광역시 해운대구 달맞이길', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['해변', '스카이캡슐'], lat: 35.1601, lng: 129.1923 },
      { title: '광안리 해수욕장 & 드론쇼', location: '부산광역시 수영구 광안해변로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['야경', '광안대교'], lat: 35.1532, lng: 129.1189 },
      { title: '감천문화마을', location: '부산광역시 사하구 감내2로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['문화', '포토존'], lat: 35.0975, lng: 129.0106 },
      { title: '자갈치시장 & BIFF 광장', location: '부산광역시 중구 자갈치해안로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.7, tags: ['해산물', '씨앗호떡'], lat: 35.0967, lng: 129.0305 }
    ],
    '전북': [
      { title: '전주 한옥마을 & 경기전', location: '전북특별자치도 전주시 완산구 기린대로 99', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['한옥', '전통문화'], lat: 35.8147, lng: 127.1526 },
      { title: '전주 덕진공원 & 연꽃지', location: '전북특별자치도 전주시 덕진구 권삼득로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['공원', '산책'], lat: 35.8471, lng: 127.1245 },
      { title: '한국도로공사 전주수목원', location: '전북특별자치도 전주시 덕진구 번영로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['수목원', '포토존'], lat: 35.8705, lng: 127.0583 },
      { title: '전주 남부시장 & 청년몰', location: '전북특별자치도 전주시 완산구 풍남문2길', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.7, tags: ['야시장', '콩나물국밥'], lat: 35.8123, lng: 127.1472 }
    ],
    '강원': [
      { title: '설악산 국립공원 권금성', location: '강원특별자치도 속초시 설악산로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['단풍', '케이블카'], lat: 38.1194, lng: 128.4656 },
      { title: '강릉 경포대 & 경포해변', location: '강원특별자치도 강릉시 경포로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['오션뷰', '카페거리'], lat: 37.7951, lng: 128.8966 },
      { title: '양양 서피비치', location: '강원특별자치도 양양군 현북면', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['서핑', '핫플'], lat: 38.0264, lng: 128.7181 },
      { title: '정동진역 & 해돋이공원', location: '강원특별자치도 강릉시 강동면', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.7, tags: ['일출', '바다열차'], lat: 37.6915, lng: 129.0326 }
    ],
    '경북': [
      { title: '경주 동궁과 월지 (안압지)', location: '경상북도 경주시 원화로 102', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['야경', '신라역사'], lat: 35.8341, lng: 129.2266 },
      { title: '경주 첨성대 & 대릉원', location: '경상북도 경주시 첨성로 140', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['유네스코', '산책'], lat: 35.8347, lng: 129.2190 },
      { title: '황리단길 카페거리', location: '경상북도 경주시 포석로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['감성카페', '황남빵'], lat: 35.8362, lng: 129.2104 },
      { title: '불국사 & 석굴암', location: '경상북도 경주시 불국로 385', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['사찰', '세계유산'], lat: 35.7901, lng: 129.3323 }
    ]
  };

  const isMatchingRegion = (spot, targetRegion) => {
    if (!targetRegion || targetRegion === '전국' || targetRegion === '전체') return true;
    const targetKey = getSpotProvinceKey({ region: targetRegion, location: targetRegion });
    const spotKey = getSpotProvinceKey(spot);
    return spotKey === targetKey;
  };

  // Filter pool strictly by target region
  let pool = spots.filter(s => isMatchingRegion(s, region));

  // Indoor rainy mode filtering
  if (rainyMode) {
    const indoorKeywords = ['박물관', '미술관', '몰', '카페', '실내', '아쿠아리움', '전시관', '백화점', '쇼핑', '시장', '온천', '공연장', '체험관'];
    const indoorPool = pool.filter(s => {
      const fullTxt = `${s.title || ''} ${s.location || ''} ${s.tags?.join(' ') || ''}`.toLowerCase();
      return indoorKeywords.some(kw => fullTxt.includes(kw));
    });
    if (indoorPool.length >= 3) {
      pool = indoorPool;
    }
  }

  // If theme filter is specified, prioritize theme matching within the region
  if (theme && theme !== '전체') {
    const themePool = pool.filter(s => s.theme === theme || s.tags?.includes(theme));
    if (themePool.length >= 2) {
      pool = themePool;
    }
  }

  if (pool.length < 4 && region !== '전국' && region !== '전체') {
    const targetKey = getSpotProvinceKey({ region, location: region });
    const presets = REGION_PRESETS[targetKey] || REGION_PRESETS['서울'];
    pool = [...pool, ...presets];
  } else if (pool.length === 0) {
    pool = spots;
  }

  const ALL_PROVINCES = ['서울', '제주', '부산', '전북', '강원', '경북', '전남', '경남', '인천', '경기'];
  const numDays = Math.min(Math.max(parseInt(days, 10) || 2, 1), 5);
  const itinerary = [];

  for (let d = 1; d <= numDays; d++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + (d - 1));
    const year = curDate.getFullYear();
    const month = String(curDate.getMonth() + 1).padStart(2, '0');
    const dateNum = String(curDate.getDate()).padStart(2, '0');
    const dayOfWeek = WEEKDAYS[curDate.getDay()];
    const formattedDate = `${year}.${month}.${dateNum} (${dayOfWeek})`;

    let targetProvince = region;
    if (region === '전국' || region === '전체') {
      targetProvince = ALL_PROVINCES[(d - 1 + refreshSeed) % ALL_PROVINCES.length];
    } else {
      targetProvince = getSpotProvinceKey({ region, location: region });
    }

    // Filter spots belonging STRICTLY to targetProvince
    let provincePool = pool.filter(s => getSpotProvinceKey(s) === targetProvince);

    // If province pool has fewer than 4 items, fill from REGION_PRESETS[targetProvince]!
    const presets = REGION_PRESETS[targetProvince] || REGION_PRESETS['서울'];
    if (provincePool.length < 4) {
      const existingTitles = new Set(provincePool.map(s => s.title));
      const extraPresets = presets.filter(p => !existingTitles.has(p.title));
      provincePool = [...provincePool, ...extraPresets];
    }

    const dStartTime = dayTimes[d]?.start || startTime || '09:30';
    const dEndTime = dayTimes[d]?.end || endTime || '20:00';
    const dSeed = (daySeeds[d] || 0) + refreshSeed;

    const dStartH = parseHourMin(dStartTime, 9.5);
    const dEndH = parseHourMin(dEndTime, 20.0);
    const dDuration = Math.max(3, dEndH - dStartH);
    const dStep = dDuration / 3;

    const dayTimeSlots = [
      { time: formatTimeSlot(dStartH), slotName: '오전 명소 & 상쾌한 출발', icon: 'Sun' },
      { time: formatTimeSlot(dStartH + dStep), slotName: '낮 일정 & 핵심 랜드마크', icon: 'MapPin' },
      { time: formatTimeSlot(dStartH + dStep * 2), slotName: '오후 관광 & K-컬처 체험', icon: 'Camera' },
      { time: formatTimeSlot(dEndH), slotName: '야경 탐방 & 도심 산책', icon: 'Moon' }
    ];

    const daySpots = [];
    for (let s = 0; s < 4; s++) {
      const spotIdx = (s + dSeed) % (provincePool.length || 1);
      const targetSpot = provincePool[spotIdx] || presets[s % presets.length];

      let img = targetSpot.image || GYEONGBOKGUNG_FALLBACK_IMG;
      if (img.toLowerCase().includes('japan') || img.toLowerCase().includes('fuji') || img.toLowerCase().includes('tokyo') || img.toLowerCase().includes('kyoto') || img.toLowerCase().includes('osaka')) {
        img = GYEONGBOKGUNG_FALLBACK_IMG;
      }

      daySpots.push({
        time: dayTimeSlots[s].time,
        slotName: dayTimeSlots[s].slotName,
        spotId: targetSpot.id,
        title: targetSpot.title,
        image: img,
        location: targetSpot.location || targetSpot.addr1 || `${targetProvince} 중심가`,
        rating: targetSpot.rating || 4.8,
        tags: targetSpot.tags || ['포토존', '핫플레이스'],
        lat: targetSpot.lat,
        lng: targetSpot.lng
      });
    }

    // Calculate travel estimates between consecutive spots
    for (let i = 0; i < daySpots.length - 1; i++) {
      daySpots[i].nextTravel = calculateTravelEstimate(daySpots[i], daySpots[i + 1]);
    }

    itinerary.push({
      day: d,
      dateStr: formattedDate,
      dayTitle: `${d}일차 코스 · ${formattedDate} (${targetProvince} 동선)`,
      schedule: daySpots,
      pool: provincePool
    });
  }

  return itinerary;
}
