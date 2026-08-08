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

// Travel time & distance estimator helper
export function calculateTravelEstimate(spotA, spotB) {
  if (!spotA || !spotB) return { distKm: '4.5', carMin: 15, transitMin: 25 };

  let lat1 = parseFloat(spotA.lat);
  let lng1 = parseFloat(spotA.lng);
  let lat2 = parseFloat(spotB.lat);
  let lng2 = parseFloat(spotB.lng);

  if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2) || lat1 === 0 || lat2 === 0) {
    const titleA = spotA.title || 'A';
    const titleB = spotB.title || 'B';
    const pseudoDist = Math.max(2.5, Math.min(15.0, (titleA.length + titleB.length) * 0.8 + 2.0));
    const carMin = Math.round(pseudoDist * 2.1 + 6);
    const transitMin = Math.round(pseudoDist * 3.4 + 10);
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

  const carMin = Math.max(6, Math.round(dist * 2.2 + 5));
  const transitMin = Math.max(10, Math.round(dist * 3.6 + 8));

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
    '제주': [
      { title: '성산일출봉', location: '제주특별자치도 서귀포시 성산읍', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['자연', '세계유산'] },
      { title: '협재 해수욕장 & 비양도', location: '제주특별자치도 제주시 한림읍', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['해변', '에메랄드빛'] },
      { title: '한라산 국립공원', location: '제주특별자치도 제주시 1100로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['등산', '인생샷'] },
      { title: '서귀포 매일올레시장', location: '제주특별자치도 서귀포시 중앙로62번길', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.7, tags: ['로컬미식', '야시장'] },
      { title: '섭지코지 & 유채꽃밭', location: '제주특별자치도 서귀포시 성산읍', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['해안산책', '포토존'] },
      { title: '중문관광단지 & 주상절리대', location: '제주특별자치도 서귀포시 이어도로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['주상절리', '경관'] }
    ],
    '서울': [
      { title: '경복궁 & 광화문 광장', location: '서울특별시 종로구 사직로 161', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['고궁', '한복체험'] },
      { title: 'N서울타워 & 남산공원', location: '서울특별시 용산구 남산공원길 105', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['야경', '랜드마크'] },
      { title: '북촌한옥마을 & 삼청동', location: '서울특별시 종로구 계동길', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['한옥', '감성카페'] },
      { title: '성수동 카페거리 & 서울숲', location: '서울특별시 성동구 서울숲2길', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.7, tags: ['핫플레이스', '쇼핑'] }
    ],
    '부산': [
      { title: '해운대 해수욕장 & 블루라인파크', location: '부산광역시 해운대구 달맞이길', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['해변', '스카이캡슐'] },
      { title: '광안리 해수욕장 & 드론쇼', location: '부산광역시 수영구 광안해변로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.9, tags: ['야경', '광안대교'] },
      { title: '감천문화마을', location: '부산광역시 사하구 감내2로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.8, tags: ['문화', '포토존'] },
      { title: '자갈치시장 & BIFF 광장', location: '부산광역시 중구 자갈치해안로', image: GYEONGBOKGUNG_FALLBACK_IMG, rating: 4.7, tags: ['해산물', '씨앗호떡'] }
    ]
  };

  const isMatchingRegion = (spot, targetRegion) => {
    if (!targetRegion || targetRegion === '전국' || targetRegion === '전체') return true;
    if (spot.region && (spot.region === targetRegion || spot.region.includes(targetRegion))) return true;

    const keywords = REGION_SYNONYMS[targetRegion] || [targetRegion];
    const locText = `${spot.location || ''} ${spot.addr1 || ''} ${spot.title || ''} ${spot.region || ''}`.toLowerCase();

    return keywords.some(kw => locText.includes(kw.toLowerCase()));
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

  // If pool is insufficient for specific region, mix in regional presets
  if (pool.length < 4 && region !== '전국') {
    const presets = REGION_PRESETS[region] || REGION_PRESETS['제주'];
    pool = [...pool, ...presets];
  } else if (pool.length === 0) {
    pool = spots;
  }

  const numDays = Math.min(Math.max(parseInt(days, 10) || 2, 1), 3);
  const itinerary = [];

  for (let d = 1; d <= numDays; d++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + (d - 1));
    const year = curDate.getFullYear();
    const month = String(curDate.getMonth() + 1).padStart(2, '0');
    const dateNum = String(curDate.getDate()).padStart(2, '0');
    const dayOfWeek = WEEKDAYS[curDate.getDay()];
    const formattedDate = `${year}.${month}.${dateNum} (${dayOfWeek})`;

    // Per-day time calculation
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
      const spotIdx = ((d - 1) * 4 + s + dSeed * 2) % (pool.length || 1);
      const targetSpot = pool[spotIdx] || {
        id: `gen-${d}-${s}`,
        title: `${region !== '전국' ? region : '대한민국'} 대표 명소 ${s + 1}`,
        image: GYEONGBOKGUNG_FALLBACK_IMG,
        location: `${region} 도심 위치`,
        rating: 4.8,
        tags: ['추천명소', '인생샷'],
        lat: 37.5665,
        lng: 126.9780
      };

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
        location: targetSpot.location || targetSpot.addr1 || `${region} 중심가`,
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
      dayTitle: `${d}일차 코스 · ${formattedDate} (${region !== '전국' ? region : '전국'} 동선)`,
      schedule: daySpots,
      pool: pool // Store pool for spot swapping
    });
  }

  return itinerary;
}
