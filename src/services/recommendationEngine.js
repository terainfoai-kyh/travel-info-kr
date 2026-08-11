import { TRAVEL_SPOTS } from '../data/travelData';

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
  const locStr = `${spot.location || ''} ${spot.addr1 || ''} ${spot.region || ''}`.trim().toLowerCase();
  if (locStr) {
    if (locStr.includes('seoul')) return '서울';
    if (locStr.includes('jeju')) return '제주';
    if (locStr.includes('busan')) return '부산';
    if (locStr.includes('gangwon')) return '강원';
    if (locStr.includes('gyeonggi')) return '경기';
    if (locStr.includes('jeonbuk')) return '전북';
    if (locStr.includes('gyeongbuk')) return '경북';
    if (locStr.includes('jeonnam')) return '전남';
    if (locStr.includes('gyeongnam')) return '경남';
    if (locStr.includes('incheon')) return '인천';
    if (locStr.includes('daegu')) return '대구';
    if (locStr.includes('daejeon')) return '대전';
    if (locStr.includes('gwangju')) return '광주';
    if (locStr.includes('ulsan')) return '울산';
    if (locStr.includes('sejong')) return '세종';

    for (const item of PROVINCE_ADDR_PREFIXES) {
      if (locStr.includes(item.prefix.toLowerCase())) {
        return item.key;
      }
    }
  }

  // Layer 4: Specific landmark title fallback (Strictly full city names, avoiding ambiguous sub-districts like '성산')
  const title = (spot.title || '').toLowerCase();
  if (title.includes('서울') || title.includes('경복궁') || title.includes('광화문') || title.includes('남산타워') || title.includes('북촌한옥') || title.includes('seoul')) return '서울';
  if (title.includes('제주') || title.includes('한라산') || title.includes('성산일출봉') || title.includes('섭지코지') || title.includes('서귀포') || title.includes('jeju')) return '제주';
  if (title.includes('부산') || title.includes('해운대') || title.includes('광안리') || title.includes('감천문화') || title.includes('자갈치') || title.includes('busan')) return '부산';
  if (title.includes('강릉') || title.includes('속초') || title.includes('설악산') || title.includes('정동진') || title.includes('양양') || title.includes('gangwon')) return '강원';
  if (title.includes('전주') || title.includes('전주한옥') || title.includes('경기전') || title.includes('덕진공원') || title.includes('jeonbuk')) return '전북';
  if (title.includes('경주') || title.includes('불국사') || title.includes('첨성대') || title.includes('황리단길') || title.includes('gyeongbuk')) return '경북';

  return spot.region || '서울';
}

// Travel time & distance estimator helper
export function calculateTravelEstimate(spotA, spotB) {
  if (!spotA || !spotB) return { distKm: '4.5', carMin: 15, transitMin: 25 };

  const provA = getSpotProvinceKey(spotA);
  const provB = getSpotProvinceKey(spotB);

  // If different administrative provinces (e.g. Seoul vs Jeonbuk, Seoul vs Jeju, Jeju vs Busan)
  if (provA !== provB) {
    const isJejuTrip = provA === '제주' || provB === '제주';
    const noteText = isJejuTrip 
      ? '✈️ 비행기 / 연안여객선 (약 3.5시간)' 
      : '🚄 KTX / 고속버스 (약 2.5시간)';
    return {
      distKm: isJejuTrip ? '450' : '220',
      carMin: 150,
      transitMin: 210,
      isLongDistance: true,
      longDistanceNote: noteText
    };
  }

  let lat1 = parseFloat(spotA.lat || spotA.mapy);
  let lng1 = parseFloat(spotA.lng || spotA.mapx);
  let lat2 = parseFloat(spotB.lat || spotB.mapy);
  let lng2 = parseFloat(spotB.lng || spotB.mapx);

  // Geo-Coordinate Safety Guard: Fix known landmarks if coordinates are missing or out of bounds
  const getSpotName = (s) => `${s?.title || ''} ${s?.location || ''}`.toLowerCase();
  if (getSpotName(spotA).includes('명동') || getSpotName(spotA).includes('myeongdong')) { lat1 = 37.5610; lng1 = 126.9860; }
  if (getSpotName(spotB).includes('명동') || getSpotName(spotB).includes('myeongdong')) { lat2 = 37.5610; lng2 = 126.9860; }
  if (getSpotName(spotA).includes('화성행궁') || getSpotName(spotA).includes('방화수류정')) { lat1 = 37.2858; lng1 = 127.0145; }
  if (getSpotName(spotB).includes('화성행궁') || getSpotName(spotB).includes('방화수류정')) { lat2 = 37.2858; lng2 = 127.0145; }

  if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2) || lat1 < 33 || lat1 > 39 || lat2 < 33 || lat2 > 39) {
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

  // Long-distance threshold raised to 75km (Metropolitan commute 30-75km uses express subway/bus 50-75 mins)
  if (dist > 75) {
    const hours = (dist / 70 + 0.3).toFixed(1);
    const isJejuTrip = provA === '제주' || provB === '제주';
    const noteText = isJejuTrip 
      ? '✈️ 비행기 / 연안여객선 (약 3.5시간)' 
      : `🚄 KTX / 고속버스 (약 ${hours}시간)`;
    return {
      distKm: dist.toFixed(0),
      carMin: Math.round(dist * 1.2),
      transitMin: Math.round(dist * 1.8),
      isLongDistance: true,
      longDistanceNote: noteText
    };
  }

  const carMin = Math.max(5, Math.round(dist * 1.3 + 5));
  const transitMin = Math.max(8, Math.round(dist * 1.5 + 10));

  let transitRouteNote = '';
  let transitType = 'transit';

  if (dist < 1.5) {
    transitType = 'walk';
    transitRouteNote = `🚶 도보 약 ${Math.round(dist * 14 + 3)}분 (${dist.toFixed(1)}km)`;
  } else if (dist < 7.0) {
    transitType = 'subway';
    transitRouteNote = `🚇 지하철 / 🚌 시내버스 (약 ${transitMin}분)`;
  } else {
    transitType = 'transit';
    transitRouteNote = `🚇 지하철 환승 / 🚌 대중교통 (약 ${transitMin}분)`;
  }

  return {
    distKm: dist.toFixed(1),
    carMin,
    transitMin,
    transitType,
    transitRouteNote
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
  nightKeyword = '',
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

  // Province presets dictionary
  const REGION_PRESETS = {
    '서울': [
      { id: 'p-1', title: '경복궁 & 향원정', location: '서울특별시 종로구 사직로 161', rating: 4.9, tags: ['역사탐방', '궁궐', '포토존'], lat: 37.5796, lng: 126.9770, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-2', title: 'N서울타워 & 남산공원', location: '서울특별시 용산구 남산공원길 105', rating: 4.8, tags: ['야경명소', '전망대', '데이트'], lat: 37.5512, lng: 126.9882, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-3', title: '북촌한옥마을', location: '서울특별시 종로구 계동길 37', rating: 4.7, tags: ['한옥', '전통문화', '골목길'], lat: 37.5826, lng: 126.9831, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-4', title: 'DDP 동대문디자인플라자', location: '서울특별시 중구 을지로 281', rating: 4.6, tags: ['건축', '전시', '쇼핑'], lat: 37.5665, lng: 127.0092, image: GYEONGBOKGUNG_FALLBACK_IMG }
    ],
    '제주': [
      { id: 'p-5', title: '성산일출봉', location: '제주특별자치도 서귀포시 성산읍 일출로 284-12', rating: 4.9, tags: ['유네스코', '세계자연유산', '일출'], lat: 33.4581, lng: 126.9426, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-6', title: '협재해수욕장', location: '제주특별자치도 제주시 한림읍 한림로 329', rating: 4.8, tags: ['에메랄드바다', '석양', '힐링'], lat: 33.3940, lng: 126.2397, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-7', title: '한라산 국립공원', location: '제주특별자치도 제주시 1100로 2070-61', rating: 4.9, tags: ['등산', '백록담', '자연탐방'], lat: 33.3617, lng: 126.5292, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-8', title: '섭지코지', location: '제주특별자치도 서귀포시 성산읍 섭지코지로 107', rating: 4.7, tags: ['해안산책', '유채꽃', '드라마촬영지'], lat: 33.4244, lng: 126.9312, image: GYEONGBOKGUNG_FALLBACK_IMG }
    ],
    '부산': [
      { id: 'p-9', title: '해운대해수욕장 & 엘시티 X더스카이', location: '부산광역시 해운대구 달맞이길 30', rating: 4.9, tags: ['해변', '오션뷰', '야경'], lat: 35.1587, lng: 129.1604, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-10', title: '감천문화마을', location: '부산광역시 사하구 감내2로 203', rating: 4.8, tags: ['어린왕자', '벽화마을', '포토존'], lat: 35.0975, lng: 129.0106, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-11', title: '광안리해수욕장 & 광안대교', location: '부산광역시 수영구 광안해변로 219', rating: 4.9, tags: ['드론쇼', '카페거리', '야경명소'], lat: 35.1532, lng: 129.1189, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-12', title: '태종대 유원지', location: '부산광역시 영도구 전망로 24', rating: 4.7, tags: ['기암괴석', '순환열차', '해안절경'], lat: 35.0531, lng: 129.0872, image: GYEONGBOKGUNG_FALLBACK_IMG }
    ],
    '강원': [
      { id: 'p-13', title: '강릉 경포대 & 경포호수', location: '강원특별자치도 강릉시 경포로 365', rating: 4.8, tags: ['호수', '동해바다', '자전거'], lat: 37.7950, lng: 128.8964, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-14', title: '속초관광수산시장', location: '강원특별자치도 속초시 중앙로147번길 16', rating: 4.7, tags: ['닭강정', 'K-푸드', '전통시장'], lat: 38.2045, lng: 128.5905, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-15', title: '설악산 국립공원 (권금성 케이블카)', location: '강원특별자치도 속초시 설악산로 1085', rating: 4.9, tags: ['단풍명소', '케이블카', '명산'], lat: 38.1194, lng: 128.4656, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-16', title: '정동진역 & 조각공원', location: '강원특별자치도 강릉시 강동면 정동역길 17', rating: 4.7, tags: ['해돋이', '바다열차', '감성'], lat: 37.6914, lng: 129.0326, image: GYEONGBOKGUNG_FALLBACK_IMG }
    ],
    '전북': [
      { id: 'p-17', title: '전주한옥마을 & 경기전', location: '전북특별자치도 전주시 완산구 기린대로 99', rating: 4.9, tags: ['한복체험', 'K-푸드', '한옥미학'], lat: 35.8147, lng: 127.1526, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-18', title: '덕진공원 연화교', location: '전북특별자치도 전주시 덕진구 권삼득로 390', rating: 4.7, tags: ['연꽃', '도서관', '야경'], lat: 35.8471, lng: 127.1215, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-19', title: '군산 근대화거리 & 초원사진관', location: '전북특별자치도 군산시 구영2길 12-1', rating: 4.6, tags: ['레트로', '근대역사', '영화촬영지'], lat: 35.9872, lng: 126.7061, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-20', title: '마이산 도립공원', location: '전북특별자치도 진안군 진안읍 마이산로 130', rating: 4.8, tags: ['탑사', '기암괴석', '미스테리'], lat: 35.7621, lng: 127.4285, image: GYEONGBOKGUNG_FALLBACK_IMG }
    ],
    '경기': [
      { id: 'p-21', title: '수원 화성 & 방화수류정', location: '경기도 수원시 팔달구 정조로 825', rating: 4.9, tags: ['유네스코', '세계문화유산', '야경명소', '수원'], lat: 37.2858, lng: 127.0145, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-22', title: '수원 행궁동 카페거리 & 화성행궁', location: '경기도 수원시 팔달구 신풍로23번길 61', rating: 4.8, tags: ['카페거리', '데이트', 'K-드라마', '수원'], lat: 37.2825, lng: 127.0122, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-23', title: '광명동굴 & 미디어아트', location: '경기도 광명시 가학로85번길 142', rating: 4.7, tags: ['동굴탐험', '와인동굴', '실내코스'], lat: 37.4262, lng: 126.8661, image: GYEONGBOKGUNG_FALLBACK_IMG },
      { id: 'p-24', title: '파주 헤이리 예술마을 & 프로방스', location: '경기도 파주시 탄현면 헤이리마을길 70-21', rating: 4.7, tags: ['예술', '박물관', '드라이브'], lat: 37.7891, lng: 126.6983, image: GYEONGBOKGUNG_FALLBACK_IMG }
    ]
  };

  // Helper function to match region against spot object using the 3-Layer engine
  const isMatchingRegion = (spot, targetRegion) => {
    if (!targetRegion || targetRegion === '전국' || targetRegion === '전체') return true;
    const spotProvKey = getSpotProvinceKey(spot);
    const targetProvKey = getSpotProvinceKey({ region: targetRegion, location: targetRegion });
    return spotProvKey === targetProvKey;
  };

  // Filter pool strictly by target region
  let pool = spots.filter(s => isMatchingRegion(s, region));

  // If specific search keyword is provided (e.g. "수원"), prioritize spots matching the keyword
  const keywordClean = (spots.keyword || '').trim().toLowerCase();
  if (keywordClean && keywordClean.length >= 2) {
    const kwMatchedPool = pool.filter(s => {
      const txt = `${s.title || ''} ${s.location || ''} ${s.tags?.join(' ') || ''}`.toLowerCase();
      return txt.includes(keywordClean);
    });
    if (kwMatchedPool.length >= 1) {
      pool = kwMatchedPool;
    }
  }

  // Indoor rainy mode filtering
  if (rainyMode) {
    const indoorKeywords = ['박물관', '미술관', '몰', '카페', '실내', '아쿠아리움', '전시관', '백화점', '쇼핑', '시장', '온천', '공연장', '체험관'];
    const indoorPool = pool.filter(s => {
      const fullTxt = `${s.title || ''} ${s.location || ''} ${s.tags?.join(' ') || ''}`.toLowerCase();
      return indoorKeywords.some(kw => fullTxt.includes(kw));
    });
    if (indoorPool.length >= 1) {
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

  const ALL_PROVINCES = ['서울', '제주', '부산', '전북', '강원', '경북', '전남', '경남', '인천', '경기'];
  const numDays = Math.min(Math.max(parseInt(days, 10) || 2, 1), 5);
  const itinerary = [];
  const globalUsedTitles = new Set();

  for (let d = 1; d <= numDays; d++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + (d - 1));
    const year = curDate.getFullYear();
    const month = String(curDate.getMonth() + 1).padStart(2, '0');
    const dateNum = String(curDate.getDate()).padStart(2, '0');
    const dayOfWeek = WEEKDAYS[curDate.getDay()];
    const formattedDate = `${year}.${month}.${dateNum} (${dayOfWeek})`;

    let targetProvince = region;
    let provincePool = pool;

    if (region === '전국' || region === '전체') {
      const firstSpotRegion = spots[0] ? getSpotProvinceKey(spots[0]) : '';
      if (firstSpotRegion && firstSpotRegion !== '전국' && firstSpotRegion !== '한국') {
        targetProvince = firstSpotRegion;
        provincePool = spots;
      } else {
        targetProvince = ALL_PROVINCES[(d - 1) % ALL_PROVINCES.length];
        const matchedProvinceSpots = spots.filter(s => getSpotProvinceKey(s) === targetProvince);
        if (matchedProvinceSpots.length >= 3) {
          provincePool = matchedProvinceSpots;
        } else {
          const targetProvKey = getSpotProvinceKey({ region: targetProvince, location: targetProvince });
          provincePool = REGION_PRESETS[targetProvKey] || REGION_PRESETS['서울'];
        }
      }
    } else {
      targetProvince = getSpotProvinceKey({ region, location: region });
    }

    const dStartTime = dayTimes[d]?.start || startTime || '09:30';
    const dEndTime = dayTimes[d]?.end || endTime || '20:00';
    const dSeed = (daySeeds[d] || 0) + refreshSeed;

    const dStartH = parseHourMin(dStartTime, 9.5);
    const dEndH = parseHourMin(dEndTime, 20.0);
    const dDuration = Math.max(3, dEndH - dStartH);

    const fallbackPreset = REGION_PRESETS[targetProvince] || REGION_PRESETS['경기'] || REGION_PRESETS['서울'];
    let activeSearchSpots = (Array.isArray(spots) && spots.length > 0) ? spots : [];
    if (rainyMode) {
      const indoorKeywords = ['박물관', '미술관', '몰', '카페', '실내', '아쿠아리움', '전시관', '백화점', '쇼핑', '시장', '온천', '공연장', '체험관'];
      const indoorActiveSearch = activeSearchSpots.filter(s => {
        const fullTxt = `${s.title || ''} ${s.location || ''} ${s.tags?.join(' ') || ''}`.toLowerCase();
        return indoorKeywords.some(kw => fullTxt.includes(kw));
      });
      if (indoorActiveSearch.length >= 1) {
        activeSearchSpots = indoorActiveSearch;
      }
    }
    const combinedCandidates = [...activeSearchSpots, ...provincePool, ...fallbackPreset, ...(REGION_PRESETS['서울'] || [])];

    // Determine dynamic target slots count based on departure start time (dStartH)
    // Morning start (< 11.5): 4 slots
    // Afternoon start (11.5 ~ 15.5): 3 slots
    // Evening start (>= 15.5): 2 slots
    let targetSlotsCount = 4;
    if (dStartH >= 15.5) {
      targetSlotsCount = 2;
    } else if (dStartH >= 11.5) {
      targetSlotsCount = 3;
    }

    const dStep = targetSlotsCount > 1 ? dDuration / (targetSlotsCount - 1) : 0;
    const dayTimeSlots = [];
    for (let i = 0; i < targetSlotsCount; i++) {
      const slotH = dStartH + (dStep * i);
      let slotName = '명소 탐방';
      let icon = 'MapPin';
      if (i === 0) { slotName = '오전 명소 & 상쾌한 출발'; icon = 'Sun'; }
      else if (i === targetSlotsCount - 1) { slotName = '야경 탐방 & 코스 마무리'; icon = 'Moon'; }
      else if (i === 1) { slotName = '낮 일정 & 핵심 랜드마크'; icon = 'Camera'; }
      else { slotName = '오후 관광 & K-컬처 체험'; icon = 'Camera'; }

      dayTimeSlots.push({ time: formatTimeSlot(slotH), slotName, icon });
    }

    const daySpots = [];

    for (let s = 0; s < targetSlotsCount; s++) {
      let targetSpot = null;

      // Separate activeSearchSpots into daytime vs night/hotel spots
      const isNightSlot = (s === targetSlotsCount - 1);
      const isNightSpot = (spot) => {
        if (!spot || !spot.title) return false;
        const txt = `${spot.title} ${spot.location || ''}`.toLowerCase();
        return (nightKeyword && txt.includes(nightKeyword.toLowerCase())) || txt.includes('명동') || txt.includes('myeongdong') || txt.includes('서울타워');
      };

      if (d === 1) {
        if (isNightSlot) {
          // Night slot (slot 4): Pick nightSpot first
          const nightSpot = activeSearchSpots.find(sp => isNightSpot(sp)) || combinedCandidates.find(c => isNightSpot(c));
          if (nightSpot && !globalUsedTitles.has(nightSpot.title.toLowerCase().replace(/\s+/g, ''))) {
            targetSpot = nightSpot;
            globalUsedTitles.add(targetSpot.title.toLowerCase().replace(/\s+/g, ''));
          }
        } else {
          // Daytime slots (slots 1, 2, 3): Pick non-night daytime spots from main region first
          const daytimeActiveSpots = activeSearchSpots.filter(sp => !isNightSpot(sp));
          if (daytimeActiveSpots[s] && daytimeActiveSpots[s].title) {
            targetSpot = daytimeActiveSpots[s];
            globalUsedTitles.add(targetSpot.title.toLowerCase().replace(/\s+/g, ''));
          }
        }
      }

      if (!targetSpot) {
        // Find first candidate that hasn't been used yet across the entire itinerary
        for (let cIdx = 0; cIdx < combinedCandidates.length; cIdx++) {
          const candidateIdx = ((d - 1) * 4 + s + dSeed + cIdx) % combinedCandidates.length;
          const candidate = combinedCandidates[candidateIdx];
          if (candidate && candidate.title && !globalUsedTitles.has(candidate.title.toLowerCase().replace(/\s+/g, ''))) {
            targetSpot = candidate;
            globalUsedTitles.add(candidate.title.toLowerCase().replace(/\s+/g, ''));
            break;
          }
        }
      }

      if (!targetSpot) {
        targetSpot = combinedCandidates[s % combinedCandidates.length] || fallbackPreset[s % fallbackPreset.length];
      }

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

// TSP Nearest-Neighbor & Province-Isolated Route Optimizer for User-Selected Spots
export function generateCustomPickedItinerary({
  pickedSpots = [],
  days = 1,
  startDate = '',
  startTime = '09:30',
  endTime = '20:00',
  rainyMode = false,
  allSpots = []
}) {
  if (!pickedSpots || pickedSpots.length === 0) return [];

  const GYEONGBOKGUNG_FALLBACK_IMG = '/default-spot.png';

  // 1. Group picked spots strictly by province first so islands/mainlands are isolated into clean separate days!
  const provinceGroups = {};
  for (const spot of pickedSpots) {
    const prov = getSpotProvinceKey(spot);
    if (!provinceGroups[prov]) provinceGroups[prov] = [];
    provinceGroups[prov].push(spot);
  }

  // 2. Sort spots inside each province group using TSP Nearest-Neighbor
  const daysByProvince = [];
  for (const prov of Object.keys(provinceGroups)) {
    const group = provinceGroups[prov];
    const unvisited = [...group];
    const sortedGroup = [];

    let current = unvisited.shift();
    sortedGroup.push(current);

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      const lat1 = parseFloat(current.lat) || 37.5665;
      const lng1 = parseFloat(current.lng) || 126.9780;

      for (let i = 0; i < unvisited.length; i++) {
        const candidate = unvisited[i];
        const lat2 = parseFloat(candidate.lat) || 37.5665;
        const lng2 = parseFloat(candidate.lng) || 126.9780;

        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const dist = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      current = unvisited.splice(nearestIdx, 1)[0];
      sortedGroup.push(current);
    }

    // Chunk sortedGroup into day blocks (max 4 spots per day per province)
    for (let i = 0; i < sortedGroup.length; i += 4) {
      daysByProvince.push({
        province: prov,
        spots: sortedGroup.slice(i, i + 4)
      });
    }
  }

  // 3. Build multi-day schedule
  const totalDays = Math.min(Math.max(daysByProvince.length, parseInt(days, 10) || 1), 5);
  const itinerary = [];

  let baseDate = new Date();
  if (startDate) {
    const parsed = new Date(startDate);
    if (!isNaN(parsed.getTime())) baseDate = parsed;
  }

  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

  for (let d = 1; d <= totalDays; d++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + (d - 1));
    const year = curDate.getFullYear();
    const month = String(curDate.getMonth() + 1).padStart(2, '0');
    const dateNum = String(curDate.getDate()).padStart(2, '0');
    const dayOfWeek = WEEKDAYS[curDate.getDay()];
    const formattedDate = `${year}.${month}.${dateNum} (${dayOfWeek})`;

    const dayGroup = daysByProvince[d - 1] || daysByProvince[0];
    const dayProv = dayGroup.province;
    const dayPicked = [...dayGroup.spots];

    // If dayPicked has fewer than 4 spots, auto-fill with nearby spots from allSpots in the SAME province!
    if (dayPicked.length > 0 && dayPicked.length < 4 && allSpots.length > 0) {
      const existingIds = new Set(dayPicked.map(s => s.id));
      let candidateSpots = allSpots;
      if (rainyMode) {
        const indoorKeywords = ['박물관', '미술관', '몰', '카페', '실내', '아쿠아리움', '전시관', '백화점', '쇼핑', '시장', '온천', '공연장', '체험관'];
        const indoorCandidateSpots = allSpots.filter(s => {
          const fullTxt = `${s.title || ''} ${s.location || ''} ${s.tags?.join(' ') || ''}`.toLowerCase();
          return indoorKeywords.some(kw => fullTxt.includes(kw));
        });
        if (indoorCandidateSpots.length >= 1) candidateSpots = indoorCandidateSpots;
      }
      const nearbyExtra = candidateSpots.filter(s => getSpotProvinceKey(s) === dayProv && !existingIds.has(s.id));

      for (let extra of nearbyExtra) {
        if (dayPicked.length >= 4) break;
        dayPicked.push(extra);
        existingIds.add(extra.id);
      }
    }

    const startH = parseHourMin(startTime, 9.5);
    const endH = parseHourMin(endTime, 20.0);
    const duration = Math.max(3, endH - startH);
    const step = dayPicked.length > 1 ? duration / (dayPicked.length - 1) : 0;

    const dayTimeSlots = dayPicked.map((_, sIdx) => {
      const slotH = startH + (step * sIdx);
      let slotName = '추천 관광';
      let icon = 'MapPin';
      if (sIdx === 0) { slotName = '오전 명소 & 상쾌한 출발'; icon = 'Sun'; }
      else if (sIdx === dayPicked.length - 1) { slotName = '야경 탐방 & 도심 산책'; icon = 'Moon'; }
      else if (sIdx === 1) { slotName = '낮 일정 & 핵심 랜드마크'; icon = 'MapPin'; }
      else { slotName = '오후 관광 & K-컬처 체험'; icon = 'Camera'; }
      return { time: formatTimeSlot(slotH), slotName, icon };
    });

    const daySpots = dayPicked.map((spot, sIdx) => ({
      time: dayTimeSlots[sIdx]?.time || '10:00',
      slotName: dayTimeSlots[sIdx]?.slotName || '추천 관광',
      spotId: spot.id,
      title: spot.title,
      image: spot.image || GYEONGBOKGUNG_FALLBACK_IMG,
      location: spot.location || spot.addr1 || `${dayProv} 중심가`,
      rating: spot.rating || 4.8,
      tags: spot.tags || ['직접선택', '맞춤코스'],
      lat: spot.lat,
      lng: spot.lng
    }));

    // Calculate travel estimates between consecutive spots
    for (let i = 0; i < daySpots.length - 1; i++) {
      daySpots[i].nextTravel = calculateTravelEstimate(daySpots[i], daySpots[i + 1]);
    }

    itinerary.push({
      day: d,
      dateStr: formattedDate,
      dayTitle: `${d}일차 코스 · ${formattedDate} (${dayProv} 최적 동선)`,
      schedule: daySpots,
      pool: dayPicked
    });
  }

  return itinerary;
}
