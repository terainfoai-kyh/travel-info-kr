import { PUBLIC_API_CONFIG, REGION_META, THEME_META, getDynamicRegionMeta } from './apiConfig';
import { TRAVEL_SPOTS } from '../data/travelData';

// 한국관광공사 TourAPI 4.0 - 공통정보조회 (/detailCommon2)
export async function fetchSpotDetailCommon(contentId, lang = 'ko') {
  if (!contentId) return null;

  let baseUrl = PUBLIC_API_CONFIG.DETAIL_COMMON_URL;
  if (lang === 'en') baseUrl = `${PUBLIC_API_CONFIG.ENG_BASE}/detailCommon2`;
  else if (lang === 'ja') baseUrl = `${PUBLIC_API_CONFIG.JPN_BASE}/detailCommon2`;
  else if (lang === 'zh') baseUrl = `${PUBLIC_API_CONFIG.CHS_BASE}/detailCommon2`;
  else if (lang === 'zht') baseUrl = `${PUBLIC_API_CONFIG.CHT_BASE}/detailCommon2`;
  else if (lang === 'de') baseUrl = `${PUBLIC_API_CONFIG.GER_BASE}/detailCommon2`;
  else if (lang === 'fr') baseUrl = `${PUBLIC_API_CONFIG.FRE_BASE}/detailCommon2`;
  else if (lang === 'es') baseUrl = `${PUBLIC_API_CONFIG.SPN_BASE}/detailCommon2`;
  else if (lang === 'ru') baseUrl = `${PUBLIC_API_CONFIG.RUS_BASE}/detailCommon2`;

  const url = `${baseUrl}?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&contentId=${contentId}&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&homepageYN=Y`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    
    const itemsRaw = data.response?.body?.items?.item;
    let item = null;
    if (Array.isArray(itemsRaw)) {
      item = itemsRaw[0];
    } else if (itemsRaw && typeof itemsRaw === 'object') {
      item = itemsRaw;
    }

    if (item) {
      let rawHp = item.homepage || '';
      let hpUrl = '';
      const hrefMatch = rawHp.match(/href=["']?([^"'>\s]+)["']?/i);
      if (hrefMatch && hrefMatch[1]) {
        hpUrl = hrefMatch[1].replace(/&amp;/g, '&');
      } else {
        const httpMatch = rawHp.match(/https?:\/\/[^\s"'<>]+/i);
        if (httpMatch && httpMatch[0]) {
          hpUrl = httpMatch[0].replace(/&amp;/g, '&');
        }
      }

      let imgUrl = item.firstimage || item.firstimage2 || '';
      const lowerImg = imgUrl.toLowerCase();
      if (!imgUrl || lowerImg.includes('japan') || lowerImg.includes('fuji') || lowerImg.includes('tokyo') || lowerImg.includes('kyoto') || lowerImg.includes('osaka') || lowerImg.includes('photo-1549693578') || lowerImg.includes('photo-1578637387939')) {
        imgUrl = '/default-spot.png';
      }

      return {
        ...item,
        firstimage: imgUrl,
        homepageUrl: hpUrl
      };
    }
  } catch (err) {
    return null;
  }
  return null;
}

// ⚡ Smart Caching Memory Store (Zero Hardcoding Pipeline)
const DYNAMIC_SPOT_CACHE = new Map();

// Official Korean Tourism Area Code Mapping
export const TOUR_API_AREA_CODES = {
  '서울': 1, '인천': 2, '대전': 3, '대구': 4, '광주': 5, '부산': 6, '울산': 7,
  '세종': 8, '경기': 31, '수원': 31, '강원': 32, '강릉': 32, '속초': 32, '양양': 32,
  '충북': 33, '충남': 34, '경북': 35, '경주': 35, '포항': 35, '안동': 35,
  '경남': 36, '거제': 36, '통영': 36, '남해': 36,
  '전북': 37, '전주': 37, '전남': 38, '여수': 38, '순천': 38,
  '제주': 39, '서귀포': 39
};

export async function fetchCityTourApiSpots(city = '서울', lang = 'ko') {
  const cleanCity = (city || '서울').replace(/(시|군|구|도)$/, '').trim();
  const cacheKey = `city_spots_${cleanCity}_${lang}`;
  if (DYNAMIC_SPOT_CACHE.has(cacheKey)) {
    return DYNAMIC_SPOT_CACHE.get(cacheKey);
  }

  let apiBase = PUBLIC_API_CONFIG.TOUR_API_BASE || 'https://apis.data.go.kr/B551011/KorService2';
  if (lang === 'en') apiBase = PUBLIC_API_CONFIG.ENG_BASE;
  else if (lang === 'ja') apiBase = PUBLIC_API_CONFIG.JPN_BASE;
  else if (lang === 'zh') apiBase = PUBLIC_API_CONFIG.CHS_BASE;
  else if (lang === 'zht') apiBase = PUBLIC_API_CONFIG.CHT_BASE;
  else if (lang === 'de') apiBase = PUBLIC_API_CONFIG.GER_BASE;
  else if (lang === 'fr') apiBase = PUBLIC_API_CONFIG.FRE_BASE;
  else if (lang === 'es') apiBase = PUBLIC_API_CONFIG.SPN_BASE;
  else if (lang === 'ru') apiBase = PUBLIC_API_CONFIG.RUS_BASE;

  try {
    const areaCode = TOUR_API_AREA_CODES[cleanCity] || TOUR_API_AREA_CODES[city];
    let fetchUrl = '';
    if (areaCode) {
      // Area-based query: STRICT Popularity / View Count Ranking (arrange=P)
      fetchUrl = `${apiBase}/areaBasedList2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&areaCode=${areaCode}&contentTypeId=12&arrange=P&numOfRows=50&pageNo=1`;
    } else {
      // Keyword search fallback (arrange=P for popularity)
      fetchUrl = `${apiBase}/searchKeyword2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&keyword=${encodeURIComponent(cleanCity)}&arrange=P&numOfRows=50&pageNo=1`;
    }

    const res = await fetch(fetchUrl);
    if (!res.ok) return [];
    const data = await res.json();
    const itemsRaw = data.response?.body?.items?.item || [];
    const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw ? [itemsRaw] : []);

    const validSpots = items
      .filter(item => {
        const lat = parseFloat(item.mapy);
        const lng = parseFloat(item.mapx);
        return lat && lng && lat > 32 && lat < 40 && lng > 124 && lng < 132;
      })
      .map(item => ({
        id: `tourapi_${item.contentid}`,
        contentId: String(item.contentid || ''),
        title: item.title,
        name: item.title,
        category: (String(item.contenttypeid) === '14' ? '문화시설' : String(item.contenttypeid) === '15' ? '축제' : '명소'),
        theme: item.cat3 || '한국 대표 관광지',
        description: item.addr1 || `${city}의 대표 관광 명소입니다.`,
        lat: parseFloat(item.mapy),
        lng: parseFloat(item.mapx),
        address: item.addr1 || item.addr2 || `${city} ${item.title}`,
        image: item.firstimage || item.firstimage2 || null,
        duration: 90,
        rating: 4.8,
        dataSource: 'TOUR_API_LIVE_GENUINE'
      }));

    if (validSpots.length > 0) {
      DYNAMIC_SPOT_CACHE.set(cacheKey, validSpots);
    }
    return validSpots;
  } catch (err) {
    console.warn(`[TourAPI] Realtime Fetch Error for ${city}:`, err);
    return [];
  }
}

export async function fetchDynamicRealtimeSpots(query, lang = 'ko') {
  if (!query || typeof query !== 'string') return [];
  const excludeFood = /(식당|음식점|맛집|빼고|제외|없이)/i.test(query);
  const cleanQ = query.trim()
    .replace(/(여기서|거기서|이중|그중|식당은|식당|음식점|맛집|빼고|제외|없이|주변|근처|인근|여행|추천|코스|가볼만한곳|여행지|\d+일|\d+박)/gi, ' ')
    .trim();
  if (!cleanQ) return [];

  const cacheKey = `${cleanQ}_${excludeFood ? 'nofood' : 'all'}_${lang}`;
  if (DYNAMIC_SPOT_CACHE.has(cacheKey)) {
    return DYNAMIC_SPOT_CACHE.get(cacheKey);
  }

  let apiBase = PUBLIC_API_CONFIG.TOUR_API_BASE || 'https://apis.data.go.kr/B551011/KorService2';
  if (lang === 'en') apiBase = PUBLIC_API_CONFIG.ENG_BASE;
  else if (lang === 'ja') apiBase = PUBLIC_API_CONFIG.JPN_BASE;
  else if (lang === 'zh') apiBase = PUBLIC_API_CONFIG.CHS_BASE;
  else if (lang === 'zht') apiBase = PUBLIC_API_CONFIG.CHT_BASE;
  else if (lang === 'de') apiBase = PUBLIC_API_CONFIG.GER_BASE;
  else if (lang === 'fr') apiBase = PUBLIC_API_CONFIG.FRE_BASE;
  else if (lang === 'es') apiBase = PUBLIC_API_CONFIG.SPN_BASE;
  else if (lang === 'ru') apiBase = PUBLIC_API_CONFIG.RUS_BASE;

  try {
    const searchUrl = `${apiBase}/searchKeyword2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&keyword=${encodeURIComponent(cleanQ)}&numOfRows=30&pageNo=1`;
    const res = await fetch(searchUrl);
    if (!res.ok) return [];
    const data = await res.json();
    const itemsRaw = data.response?.body?.items?.item || [];

    const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw ? [itemsRaw] : []);
    let spotList = [];
    if (items.length > 0) {
      let filteredItems = items;
      if (excludeFood) {
        filteredItems = items.filter(item => {
          const isFoodType = String(item.contenttypeid) === '39';
          const isFoodTitle = /(돼지갈비|식당|갈비|고깃집|음식점|푸드|맛집)/i.test(item.title);
          return !isFoodType && !isFoodTitle;
        });
        if (filteredItems.length === 0) filteredItems = items;
      }

      spotList = filteredItems.map(item => ({
        id: String(item.contentid || Math.random()),
        contentId: String(item.contentid || ''),
        title: item.title,
        searchKeyword: item.title,
        location: item.addr1 || item.addr2 || '대한민국 관광 명소',
        lat: parseFloat(item.mapy) || 37.5665,
        lng: parseFloat(item.mapx) || 126.9780,
        rating: 4.8,
        tags: [cleanQ, excludeFood ? '명소전용' : '공공정품관광지'],
        image: item.firstimage || item.firstimage2 || null,
        dataSource: 'TOUR_API_LIVE_GENUINE'
      }));
    }

    if (spotList.length > 0) {
      DYNAMIC_SPOT_CACHE.set(cacheKey, spotList);
    }
    return spotList;
  } catch (err) {
    return [];
  }
}

// 한국관광공사 TourAPI 4.0 - 소개정보조회 (/detailIntro2) 다국어 전용 연동
export async function fetchSpotDetailIntro(contentId, contentTypeId = '14', lang = 'ko') {
  if (!contentId) return null;

  let baseUrl = PUBLIC_API_CONFIG.DETAIL_INTRO_URL;
  if (lang === 'en') baseUrl = `${PUBLIC_API_CONFIG.ENG_BASE}/detailIntro2`;
  else if (lang === 'ja') baseUrl = `${PUBLIC_API_CONFIG.JPN_BASE}/detailIntro2`;
  else if (lang === 'zh') baseUrl = `${PUBLIC_API_CONFIG.CHS_BASE}/detailIntro2`;
  else if (lang === 'zht') baseUrl = `${PUBLIC_API_CONFIG.CHT_BASE}/detailIntro2`;
  else if (lang === 'de') baseUrl = `${PUBLIC_API_CONFIG.GER_BASE}/detailIntro2`;
  else if (lang === 'fr') baseUrl = `${PUBLIC_API_CONFIG.FRE_BASE}/detailIntro2`;
  else if (lang === 'es') baseUrl = `${PUBLIC_API_CONFIG.SPN_BASE}/detailIntro2`;
  else if (lang === 'ru') baseUrl = `${PUBLIC_API_CONFIG.RUS_BASE}/detailIntro2`;

  const url = `${baseUrl}?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&contentId=${contentId}&contentTypeId=${contentTypeId}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    
    const itemsRaw = data.response?.body?.items?.item;
    let item = null;
    if (Array.isArray(itemsRaw)) {
      item = itemsRaw[0];
    } else if (itemsRaw && typeof itemsRaw === 'object') {
      item = itemsRaw;
    }

    if (item) {
      const cleanHtml = (str) => (str || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
      return {
        usetime: cleanHtml(item.usetime || item.usetimeculture || item.opentimefood || item.usetimeleports),
        restdate: cleanHtml(item.restdate || item.restdateculture || item.restdatefood || item.restdateleports),
        infocenter: cleanHtml(item.infocenter || item.infocenterculture || item.infocenterfood || item.infocenterleports),
        useseason: cleanHtml(item.useseason || item.useseasonleports)
      };
    }
  } catch (err) {
    console.warn('Detail Intro API fallback:', err);
  }
  return null;
}

// 한국관광공사 TourAPI 4.0 - 이미지정보조회 (/detailImage2)
export async function fetchSpotDetailImages(contentId, lang = 'ko') {
  if (!contentId) return [];

  let baseUrl = PUBLIC_API_CONFIG.DETAIL_IMAGE_URL;
  if (lang === 'en') baseUrl = `${PUBLIC_API_CONFIG.ENG_BASE}/detailImage2`;
  else if (lang === 'ja') baseUrl = `${PUBLIC_API_CONFIG.JPN_BASE}/detailImage2`;
  else if (lang === 'zh') baseUrl = `${PUBLIC_API_CONFIG.CHS_BASE}/detailImage2`;
  else if (lang === 'zht') baseUrl = `${PUBLIC_API_CONFIG.CHT_BASE}/detailImage2`;
  else if (lang === 'de') baseUrl = `${PUBLIC_API_CONFIG.GER_BASE}/detailImage2`;
  else if (lang === 'fr') baseUrl = `${PUBLIC_API_CONFIG.FRE_BASE}/detailImage2`;
  else if (lang === 'es') baseUrl = `${PUBLIC_API_CONFIG.SPN_BASE}/detailImage2`;
  else if (lang === 'ru') baseUrl = `${PUBLIC_API_CONFIG.RUS_BASE}/detailImage2`;

  const url = `${baseUrl}?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&contentId=${contentId}&imageYN=Y&numOfRows=12`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Detail Image API HTTP error');
    const data = await res.json();
    const itemsRaw = data.response?.body?.items?.item;

    if (Array.isArray(itemsRaw)) {
      return itemsRaw
        .filter(img => {
          const imgStr = (img.originimgurl || img.imgname || '').toLowerCase();
          return !imgStr.includes('toilet') && !imgStr.includes('restroom') && !imgStr.includes('화장실') && !imgStr.includes('편의시설');
        })
        .map(img => (img.originimgurl || img.smallimageurl || '').replace(/^http:\/\//i, 'https://'))
        .filter(Boolean);
    } else if (itemsRaw && (itemsRaw.originimgurl || itemsRaw.smallimageurl)) {
      const imgStr = (itemsRaw.originimgurl || itemsRaw.imgname || '').toLowerCase();
      if (!imgStr.includes('toilet') && !imgStr.includes('restroom') && !imgStr.includes('화장실') && !imgStr.includes('편의시설')) {
        return [(itemsRaw.originimgurl || itemsRaw.smallimageurl).replace(/^http:\/\//i, 'https://')];
      }
    }
  } catch (err) {
    console.warn('Detail Image API fallback:', err);
  }
  return [];
}

export const MOCK_ALL_SPOTS = [
  {
    id: 't-1',
    title: '경복궁 & 근정전',
    region: '서울',
    theme: '역사/문화',
    contentTypeId: '14',
    rating: 4.9,
    image: '/default-spot.png',
    location: '서울특별시 종로구 사직로 161',
    lat: 37.5796,
    lng: 126.9770,
    homepage: 'https://www.royalpalace.go.kr',
    tags: ['한복체험', '조선궁궐', '야경투어', '전통문화'],
    targetAge: ['10대', '20대', '30대', '40대', '50대이상'],
    targetGender: ['남성', '여성', '무관']
  },
  {
    id: 't-2',
    title: '제주 성산일출봉',
    region: '제주',
    theme: '자연/힐링',
    contentTypeId: '12',
    rating: 4.95,
    image: '/default-spot.png',
    location: '제주특별자치도 서귀포시 성산읍 일출로 284-12',
    lat: 33.4581,
    lng: 126.9426,
    homepage: 'https://www.visitjeju.net',
    tags: ['유네스코', '일출명소', '오션뷰', '제주필수'],
    targetAge: ['20대', '30대', '40대', '50대이상'],
    targetGender: ['남성', '여성', '무관']
  },
  {
    id: 't-3',
    title: '부산 해운대 블루라인파크',
    region: '부산',
    theme: '액티비티/레저',
    contentTypeId: '28',
    rating: 4.8,
    image: '/default-spot.png',
    location: '부산광역시 해운대구 청사포로 116',
    lat: 35.1601,
    lng: 129.1923,
    homepage: 'https://www.bluelinepark.com',
    tags: ['스카이캡슐', '해변열차', '데이트코스', '오션뷰'],
    targetAge: ['10대', '20대', '30대'],
    targetGender: ['여성', '무관']
  },
  {
    id: 't-4',
    title: '설악산 국립공원 권금성',
    region: '강원',
    theme: '자연/힐링',
    contentTypeId: '12',
    rating: 4.88,
    image: '/default-spot.png',
    location: '강원특별자치도 속초시 설악산로 1091',
    lat: 38.1194,
    lng: 128.4656,
    homepage: 'https://www.knps.or.kr/seoraksan',
    tags: ['케이블카', '단풍국립공원', '트레킹', '자연경관'],
    targetAge: ['30대', '40대', '50대이상'],
    targetGender: ['남성', '무관']
  },
  {
    id: 't-5',
    title: '경주 동궁과 월지 (안압지)',
    region: '경북',
    theme: '역사/문화',
    contentTypeId: '14',
    rating: 4.9,
    image: '/default-spot.png',
    location: '경상북도 경주시 원화로 102',
    lat: 35.8341,
    lng: 129.2266,
    homepage: 'https://www.gyeongju.go.kr/tour',
    tags: ['신라유적', '환상야경', '연못정원', '황리단길'],
    targetAge: ['10대', '20대', '30대', '40대', '50대이상'],
    targetGender: ['여성', '무관']
  },
  {
    id: 't-6',
    title: '전주 한옥마을 경기전',
    region: '전북',
    theme: '미식/쇼핑',
    contentTypeId: '39',
    rating: 4.78,
    image: '/default-spot.png',
    location: '전북특별자치도 전주시 완산구 기린대로 99',
    lat: 35.8150,
    lng: 127.1530,
    homepage: 'https://hanok.jeonju.go.kr',
    tags: ['비빔밥미식', '한옥체험', '길거리음식', '전통문화'],
    targetAge: ['10대', '20대', '30대', '40대', '50대이상'],
    targetGender: ['남성', '여성', '무관']
  },
  {
    id: 't-7',
    title: '서울 N서울타워 & 남산공원',
    region: '서울',
    theme: 'K-컬처/이벤트',
    contentTypeId: '15',
    rating: 4.82,
    image: '/default-spot.png',
    location: '서울특별시 용산구 남산공원길 105',
    lat: 37.5512,
    lng: 126.9882,
    homepage: 'https://www.seoultower.co.kr',
    tags: ['남산전망대', '사랑의열쇠', '서울야경', 'K드라마명소'],
    targetAge: ['10대', '20대', '30대'],
    targetGender: ['여성', '무관']
  },
  {
    id: 't-8',
    title: '인천 송도 센트럴파크',
    region: '인천',
    theme: '자연/힐링',
    contentTypeId: '12',
    rating: 4.75,
    image: '/default-spot.png',
    location: '인천광역시 연수구 컨벤시아대로 160',
    lat: 37.3925,
    lng: 126.6394,
    homepage: 'https://www.ifez.go.kr',
    tags: ['수상보트', '도시공원', '야경산책', '피크닉'],
    targetAge: ['20대', '30대', '40대'],
    targetGender: ['남성', '여성', '무관']
  },
  {
    id: 't-10',
    title: '수원 화성 & 행리단길',
    region: '경기',
    theme: '역사/문화',
    contentTypeId: '14',
    rating: 4.88,
    image: '/default-spot.png',
    location: '경기도 수원시 팔달구 정조로 825',
    lat: 37.2872,
    lng: 127.0119,
    homepage: 'https://www.swcf.or.kr',
    tags: ['유네스코세계유산', '수원화성', '행궁동', '데이트코스', '수원'],
    targetAge: ['10대', '20대', '30대', '40대', '50대이상'],
    targetGender: ['남성', '여성', '무관']
  }
];

export async function fetchTourSpots({ 
  region = '전국', 
  theme = '전체', 
  age = '전체', 
  gender = '무관', 
  keyword = '', 
  arrange = 'B',
  apiServiceType = 'area',
  startDate = '',
  lang = 'ko'
}) {
  const regionMeta = getDynamicRegionMeta(region);
  const contentTypeId = THEME_META[theme];
  // Trim spaces and normalize spaces (e.g. '성산 일출봉' -> '성산일출봉')
  const cleanKw = keyword.trim();
  const kwNoSpace = cleanKw.replace(/\s+/g, '');

  // Select appropriate TourAPI service endpoint based on selected language (KorService2, EngService2, JpnService2, ChsService2)
  let apiBase = PUBLIC_API_CONFIG.TOUR_API_BASE;
  if (lang === 'en') apiBase = PUBLIC_API_CONFIG.ENG_BASE;
  else if (lang === 'ja') apiBase = PUBLIC_API_CONFIG.JPN_BASE;
  else if (lang === 'zh') apiBase = PUBLIC_API_CONFIG.CHS_BASE;
  else if (lang === 'zht') apiBase = PUBLIC_API_CONFIG.CHT_BASE;
  else if (lang === 'de') apiBase = PUBLIC_API_CONFIG.GER_BASE;
  else if (lang === 'fr') apiBase = PUBLIC_API_CONFIG.FRE_BASE;
  else if (lang === 'es') apiBase = PUBLIC_API_CONFIG.SPN_BASE;
  else if (lang === 'ru') apiBase = PUBLIC_API_CONFIG.RUS_BASE;

  // Convert app arrange filter to official TourAPI 4.0 arrange code (Defaulting to B: Popularity/Views)
  let apiArrange = 'B';
  if (arrange === 'A') apiArrange = 'B';      // 추천순 -> TourAPI 'B' (조회수/인기순)
  else if (arrange === 'O') apiArrange = 'B'; // 인기순 -> TourAPI 'B' (조회수/인기순)
  else if (arrange === 'Q') apiArrange = 'C'; // 수정일순 -> TourAPI 'C' (수정일순)
  else if (arrange === 'R') apiArrange = 'D'; // 등록일순 -> TourAPI 'D' (등록일순)
  else apiArrange = 'B';

  // Map Korean contentTypeId (12, 14, 28, 39) to Foreign Multilingual TourAPI contentTypeId (75, 76, 77, 82)
  let effectiveContentTypeId = contentTypeId;
  if (lang !== 'ko' && contentTypeId) {
    const foreignTypeMap = {
      '12': '75', // 관광지 -> Attractions
      '14': '76', // 문화시설 -> Cultural Facilities
      '28': '77', // 레포츠 -> Leisure
      '38': '78', // 쇼핑 -> Shopping
      '32': '79', // 숙박 -> Accommodation
      '15': '80', // 행사/축제 -> Events
      '39': '82'  // 음식점 -> Food / Dining
    };
    effectiveContentTypeId = foreignTypeMap[contentTypeId] || contentTypeId;
  }

  let url = '';
  if (cleanKw) {
    url = `${apiBase}/searchKeyword2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=${apiArrange}&keyword=${encodeURIComponent(kwNoSpace)}`;
    if (regionMeta && regionMeta.areaCode) url += `&areaCode=${regionMeta.areaCode}`;
    if (effectiveContentTypeId) url += `&contentTypeId=${effectiveContentTypeId}`;
  } else if (apiServiceType === 'location' && regionMeta && regionMeta.areaCode) {
    url = `${apiBase}/locationBasedList2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=${apiArrange}&mapX=${regionMeta.lng}&mapY=${regionMeta.lat}&radius=20000`;
    if (effectiveContentTypeId) url += `&contentTypeId=${effectiveContentTypeId}`;
  } else if (apiServiceType === 'festival') {
    const eventDate = startDate ? startDate.replace(/-/g, '') : new Date().toISOString().slice(0, 10).replace(/-/g, '');
    url = `${apiBase}/searchFestival2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=${apiArrange}&eventStartDate=${eventDate}`;
    if (regionMeta && regionMeta.areaCode) url += `&areaCode=${regionMeta.areaCode}`;
  } else if (apiServiceType === 'stay') {
    url = `${apiBase}/searchStay2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=${apiArrange}`;
    if (regionMeta && regionMeta.areaCode) url += `&areaCode=${regionMeta.areaCode}`;
  } else {
    url = `${apiBase}/areaBasedList2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=${apiArrange}`;
    if (regionMeta && regionMeta.areaCode) url += `&areaCode=${regionMeta.areaCode}`;
    if (effectiveContentTypeId) url += `&contentTypeId=${effectiveContentTypeId}`;
  }

  try {
    let res = await fetch(url);

    if (!res.ok) throw new Error(`TourAPI response not OK: status ${res.status}`);
    const data = await res.json();
    let items = data.response?.body?.items?.item || [];

    // Fallback search with original cleanKw or areaBasedList2 if kwNoSpace yielded zero items from TourAPI
    if (items.length === 0 && cleanKw) {
      const fallbackUrl = `${apiBase}/searchKeyword2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=${apiArrange}&keyword=${encodeURIComponent(cleanKw)}`;
      const fbRes = await fetch(fallbackUrl);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        items = fbData.response?.body?.items?.item || [];
      }

      if (items.length === 0) {
        let areaUrl = `${apiBase}/areaBasedList2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=${apiArrange}`;
        if (regionMeta && regionMeta.areaCode) areaUrl += `&areaCode=${regionMeta.areaCode}`;
        if (effectiveContentTypeId) areaUrl += `&contentTypeId=${effectiveContentTypeId}`;
        const areaRes = await fetch(areaUrl);
        if (areaRes.ok) {
          const areaData = await areaRes.json();
          items = areaData.response?.body?.items?.item || [];
        }
      }
    }

    if (items.length > 0) {
      const DEFAULT_FALLBACK_IMAGE = '/default-spot.png';

      // Global Smart Priority Sorting Engine: Prioritize pure attractions (12, 14, 28) & photo quality
      const sortedRawItems = [...items].sort((a, b) => {
        const typeA = String(a.contenttypeid || '');
        const typeB = String(b.contenttypeid || '');

        if (theme === '미식/쇼핑' || theme === '음식') {
          if (typeA === '39' && typeB !== '39') return -1;
          if (typeB === '39' && typeA !== '39') return 1;
        } else {
          const isAttractionA = typeA === '12' || typeA === '14' || typeA === '28';
          const isAttractionB = typeB === '12' || typeB === '14' || typeB === '28';
          if (isAttractionA && !isAttractionB) return -1;
          if (isAttractionB && !isAttractionA) return 1;
        }

        // [Fix & Safety] Completely eliminated legacy localeCompare alphabetical sorting ('O')
        // Always prioritize image quality and popularity (readcount)
        const hasImgA = !!(a.firstimage || a.firstimage2);
        const hasImgB = !!(b.firstimage || b.firstimage2);
        if (hasImgA && !hasImgB) return -1;
        if (!hasImgA && hasImgB) return 1;

        const countA = parseInt(a.readcount || 0, 10);
        const countB = parseInt(b.readcount || 0, 10);
        if (countA !== countB) return countB - countA;

        return 0;
      });

      const COORD_PRESETS = [
        { lat: 37.5665, lng: 126.9780, loc: '서울특별시 종로구 세종대로' },
        { lat: 33.4581, lng: 126.9426, loc: '제주특별자치도 서귀포시 성산읍' },
        { lat: 35.1601, lng: 129.1923, loc: '부산광역시 해운대구 청사포로' },
        { lat: 38.1194, lng: 128.4656, loc: '강원특별자치도 속초시 설악산로' },
        { lat: 35.8341, lng: 129.2266, loc: '경상북도 경주시 원화로' },
        { lat: 35.8150, lng: 127.1530, loc: '전북특별자치도 전주시 완산구' },
        { lat: 37.3925, lng: 126.6394, loc: '인천광역시 연수구 컨벤시아대로' },
        { lat: 37.2872, lng: 127.0119, loc: '경기도 수원시 팔달구 정조로' }
      ];

      const parsed = sortedRawItems.map((item, idx) => {
        let validImage = (item.firstimage || item.firstimage2 || '').replace(/^http:\/\//i, 'https://');

        // Extract title safely from TourAPI (item.title) or Durunubi (item.crsNm / item.themeNm)
        const rawTitle = item.title || item.crsNm || item.themeNm || item.spotNm || `명소 ${idx + 1}`;
        const titleClean = String(rawTitle).trim();
        const contentId = String(item.contentid || item.crsIdx || idx);

        if (
          !validImage ||
          titleClean.includes('수원화성박물관') || 
          contentId === '976378' ||
          validImage.includes('794101_image2_1.jpg') || 
          validImage.includes('photo-') ||
          validImage.includes('unsplash') ||
          validImage.toLowerCase().includes('toilet') || 
          validImage.toLowerCase().includes('restroom') ||
          validImage.toLowerCase().includes('japan') ||
          validImage.toLowerCase().includes('fuji') ||
          validImage.toLowerCase().includes('tokyo') ||
          validImage.toLowerCase().includes('kyoto') ||
          validImage.toLowerCase().includes('osaka')
        ) {
          validImage = DEFAULT_FALLBACK_IMAGE;
        }

        const preset = COORD_PRESETS[idx % COORD_PRESETS.length];
        const rawLat = parseFloat(item.mapy || item.lat);
        const rawLng = parseFloat(item.mapx || item.lng);

        // Regional fallback coordinates to prevent all spots from defaulting to Seoul!
        let itemRegionMeta = getDynamicRegionMeta(item.region || item.addr1 || region);
        let fallbackLat = itemRegionMeta?.lat || preset.lat;
        let fallbackLng = itemRegionMeta?.lng || preset.lng;

        const cId = String(item.contentid || item.crsIdx || item.id || `api-${idx}`);
        const cTypeId = String(item.contenttypeid || '12');

        return {
          id: cId,
          contentId: cId,
          contentTypeId: cTypeId,
          title: titleClean,
          region: region === '전국' ? (item.region || '한국') : region,
          theme: theme === '전체' ? '관광' : theme,
          image: validImage,
          location: item.location || item.addr1 || item.sigun || preset.loc,
          lat: (!isNaN(rawLat) && rawLat > 0) ? rawLat : fallbackLat,
          lng: (!isNaN(rawLng) && rawLng > 0) ? rawLng : fallbackLng,
          rating: (4.5 + (idx % 5) * 0.1).toFixed(1),
          tags: [theme, region, cleanKw, '관광공사추천'].filter(Boolean)
        };
      });

      // Flexible space-insensitive client filtering
      const filtered = parsed.filter(spot => {
        if (!cleanKw) return true;

        const kw = kwNoSpace.toLowerCase();
        const titleNoSpace = spot.title.replace(/\s+/g, '').toLowerCase();
        const locNoSpace = spot.location.replace(/\s+/g, '').toLowerCase();

        return titleNoSpace.includes(kw) || locNoSpace.includes(kw);
      });

      // Signature Landmark Boost: On default query (전국/한국, 전체), always prioritize Korea's top 6 iconic landmarks first!
      if ((region === '전국' || region === '한국') && theme === '전체' && !cleanKw) {
        const signatureLandmarks = TRAVEL_SPOTS.slice(0, 6);
        const signatureTitles = new Set(signatureLandmarks.map(s => s.title.toLowerCase().replace(/\s+/g, '')));
        const otherSpots = filtered.filter(s => !signatureTitles.has(s.title.toLowerCase().replace(/\s+/g, '')));
        return [...signatureLandmarks, ...otherSpots];
      }

      if (cleanKw) {
        // Strict keyword search: Return filtered matches, or empty array [] if 0 matches found
        return filtered;
      }

      let mainList = filtered.length > 0 ? filtered : parsed;

      // Strict City-Level Precision Filter: If region is a specific city (e.g. 거제도, 수원, 창원), prioritize exact city spots!
      const isProvinceLevel = ['전국', '한국', '서울', '인천', '대전', '대구', '광주', '부산', '울산', '세종', '경기', '강원', '충북', '충남', '경북', '경남', '전북', '전남', '제주'].includes(region);
      if (!isProvinceLevel && region) {
        const cleanCity = region.replace(/(도|시|군|구)$/, '');
        const cityMatches = mainList.filter(spot => {
          const loc = (spot.location || '').toLowerCase();
          const title = (spot.title || '').toLowerCase();
          return loc.includes(cleanCity) || title.includes(cleanCity);
        });
        if (cityMatches.length > 0) {
          mainList = cityMatches;
        }
      }

      if (mainList.length < 6 && region !== '전국' && region !== '한국') {
        const cleanCity = region.replace(/(도|시|군|구)$/, '');
        const regionalSupplements = TRAVEL_SPOTS.filter(spot => spot.region === region || spot.location.includes(cleanCity));
        const existingTitles = new Set(mainList.map(s => s.title.toLowerCase().replace(/\s+/g, '')));
        for (const sup of regionalSupplements) {
          const supTitle = sup.title.toLowerCase().replace(/\s+/g, '');
          if (!existingTitles.has(supTitle)) {
            mainList.push(sup);
            existingTitles.add(supTitle);
          }
          if (mainList.length >= 6) break;
        }
      }
      return mainList;
    }
  } catch (err) {
    console.warn('TourAPI Fallback triggered:', err);
  }

  // Fallback & Filter Mock Data with space-insensitive matching & image sanitization
  const cleanCity = region.replace(/(도|시|군|구)$/, '');
  const resultSpots = TRAVEL_SPOTS.filter(spot => {
    const matchRegion = region === '전국' || spot.region === region || spot.location.includes(cleanCity) || spot.title.includes(cleanCity);
    const matchTheme = theme === '전체' || spot.theme === theme;
    const matchAge = age === '전체' || 
      (!spot.targetAge || spot.targetAge.includes(age)) || 
      (age === '50대' && spot.targetAge && (spot.targetAge.includes('50대') || spot.targetAge.includes('50대이상'))) || 
      (age === '60대이상' && spot.targetAge && (spot.targetAge.includes('60대이상') || spot.targetAge.includes('50대이상')));
    const matchGender = gender === '무관' || !spot.targetGender || spot.targetGender.includes(gender) || spot.targetGender.includes('무관');
    
    const spotTitleNoSpace = spot.title.replace(/\s+/g, '').toLowerCase();
    const spotLocNoSpace = spot.location.replace(/\s+/g, '').toLowerCase();

    const matchKeyword = !cleanKw || 
      spotTitleNoSpace.includes(kwNoSpace.toLowerCase()) ||
      spotLocNoSpace.includes(kwNoSpace.toLowerCase()) ||
      (spot.tags && spot.tags.some(t => t.toLowerCase().includes(cleanKw.toLowerCase())));

    return matchRegion && matchTheme && matchAge && matchGender && matchKeyword;
  });

  if (cleanKw) {
    // If user searched for a keyword and 0 matches found in mock data, return [] to show zero-state message
    return resultSpots;
  }

  if (resultSpots.length > 0) return resultSpots;

  // Ultimate Rule 6 Fallback: Always return regional top spots instead of empty 0 items!
  const regionFallback = TRAVEL_SPOTS.filter(spot => region === '전국' || spot.region === region);
  return regionFallback.length > 0 ? regionFallback : TRAVEL_SPOTS.slice(0, 6);

  return resultSpots.map(spot => {
    let img = spot.image;
    if (spot.title.includes('수원화성박물관') || img.includes('photo-1549693578') || img.includes('794101_image2_1.jpg')) {
      img = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%231e293b'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='%2338bdf8' font-size='32' font-weight='bold' font-family='sans-serif'%3E🏛️ 대한민국 대표 관광지%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='20' font-family='sans-serif'%3E(Google Places 고화질 이미지 동기화 중)%3C/text%3E%3C/svg%3E";
    }
    return { ...spot, image: img };
  });
}

// Pinpoint TourAPI Keyword Search for User Mentioned Landmarks (Ultra-Fast Parallel Execution)
export async function fetchPinpointLandmarkSpots(landmarks = [], lang = 'ko', targetCity = '') {
  if (!Array.isArray(landmarks) || landmarks.length === 0) return [];
  
  let apiBase = PUBLIC_API_CONFIG.TOUR_API_BASE || 'https://apis.data.go.kr/B551011/KorService2';
  if (lang === 'en') apiBase = PUBLIC_API_CONFIG.ENG_BASE;
  else if (lang === 'ja') apiBase = PUBLIC_API_CONFIG.JPN_BASE;
  else if (lang === 'zh') apiBase = PUBLIC_API_CONFIG.CHS_BASE;
  else if (lang === 'zht') apiBase = PUBLIC_API_CONFIG.CHT_BASE;
  else if (lang === 'de') apiBase = PUBLIC_API_CONFIG.GER_BASE;
  else if (lang === 'fr') apiBase = PUBLIC_API_CONFIG.FRE_BASE;
  else if (lang === 'es') apiBase = PUBLIC_API_CONFIG.SPN_BASE;
  else if (lang === 'ru') apiBase = PUBLIC_API_CONFIG.RUS_BASE;

  // 🎯 [지명 정규화 v5] '거제도' -> '거제', '제주도' -> '제주', '수원시' -> '수원', '해운대구' -> '해운대'
  const cleanTargetCity = targetCity ? targetCity.replace(/(도|시|군|구)$/, '').trim() : '';

  // Filter out noise/generic region words and strip parentheses/brackets e.g. "거제식물원(정글돔)" -> "거제식물원"
  const NOISE_WORDS = ['한국', '대한민국', '경상남도', '경상북도', '전라남도', '전라북도', '충청남도', '충청북도', '경기도', '강원도', '제주도', '창원시', '거제시', '수원시', 'KOREA', 'SOUTH KOREA'];
  const validLandmarks = Array.from(new Set(landmarks.map(lm => String(lm).replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim()).filter(Boolean)))
    .filter(lm => lm && lm.length >= 2 && !NOISE_WORDS.includes(lm.toUpperCase()))
    .slice(0, 12);

  if (validLandmarks.length === 0) return [];

  // Parallel Execution with 3.5s AbortController Timeout Per Request
  const fetchPromises = validLandmarks.map(async (lm) => {
    try {
      // 🎯 1차 시도: 원본 정제 키워드로 검색 (예: "구조라 해수욕장", "Gyeongbokgung")
      let url = `${apiBase}/searchKeyword2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=B&keyword=${encodeURIComponent(lm)}`;
      let controller = new AbortController();
      let timeoutId = setTimeout(() => controller.abort(), 3500);

      let res = await fetch(url, { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);

      let rawItems = [];
      if (res && res.ok) {
        const rawText = await res.text().catch(() => '');
        if (rawText && rawText.trim().startsWith('{')) {
          const data = JSON.parse(rawText);
          rawItems = data.response?.body?.items?.item || [];
        }
      }

      // 🎯 2차 시도 (규칙 13): 0건이면 공백 및 특수문자 제거 압축 검색 (예: "N-Seoul Tower" -> "NSEOULTOWER", "거제 파노라마 케이블카" -> "거제파노라마케이블카")
      if (!rawItems || (Array.isArray(rawItems) && rawItems.length === 0)) {
        const compressedKeyword = lm.replace(/[\s\-\_\.\,\(\)\[\]]/g, '');
        if (compressedKeyword && compressedKeyword !== lm && compressedKeyword.length >= 2) {
          const url2 = `${apiBase}/searchKeyword2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=B&keyword=${encodeURIComponent(compressedKeyword)}`;
          const c2 = new AbortController();
          const t2 = setTimeout(() => c2.abort(), 3000);
          const res2 = await fetch(url2, { signal: c2.signal }).catch(() => null);
          clearTimeout(t2);
          if (res2 && res2.ok) {
            const rawText2 = await res2.text().catch(() => '');
            if (rawText2 && rawText2.trim().startsWith('{')) {
              const data2 = JSON.parse(rawText2);
              rawItems = data2.response?.body?.items?.item || [];
            }
          }
        }
      }

      // 🎯 3차 시도: 부가어/접미사 떼고 정밀 검색 (예: "거제식물원 정글돔" -> "거제식물원")
      if (!rawItems || (Array.isArray(rawItems) && rawItems.length === 0)) {
        const strippedKeyword = lm
          .replace(/\s*(정글돔|스카이워크|케이블카|전망대|리조트|파크|거리|거리일대).*/gi, '')
          .replace(/\s+(카페|식당|맛집|베이커리|호텔|펜션)$/gi, '')
          .replace(/^카페\s+/i, '')
          .trim();

        if (strippedKeyword && strippedKeyword !== lm && strippedKeyword.length >= 2) {
          const url3 = `${apiBase}/searchKeyword2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=B&keyword=${encodeURIComponent(strippedKeyword)}`;
          const c3 = new AbortController();
          const t3 = setTimeout(() => c3.abort(), 3000);
          const res3 = await fetch(url3, { signal: c3.signal }).catch(() => null);
          clearTimeout(t3);
          if (res3 && res3.ok) {
            const rawText3 = await res3.text().catch(() => '');
            if (rawText3 && rawText3.trim().startsWith('{')) {
              const data3 = JSON.parse(rawText3);
              rawItems = data3.response?.body?.items?.item || [];
            }
          }
        }
      }

      const items = Array.isArray(rawItems) ? rawItems : (rawItems ? [rawItems] : []);

      // 🎯 Priority 1: Match item whose address contains cleanTargetCity with Case-Insensitive comparison (.toUpperCase())
      let rawItem = null;
      if (cleanTargetCity && items.length > 0) {
        const upperCity = cleanTargetCity.toUpperCase();
        rawItem = items.find(i => i.addr1 && i.addr1.toUpperCase().includes(upperCity));
      }
      if (!rawItem && items.length > 0) {
        rawItem = items[0];
      }

      if (rawItem && rawItem.title) {
        let rawImg = rawItem.firstimage || rawItem.firstimage2 || '';
        if (rawImg) rawImg = rawImg.replace(/^http:\/\//i, 'https://');
        const lowerImg = rawImg.toLowerCase();
        if (!rawImg || lowerImg.includes('japan') || lowerImg.includes('fuji') || lowerImg.includes('tokyo') || lowerImg.includes('kyoto') || lowerImg.includes('osaka')) {
          rawImg = '/default-spot.png';
        }

        return {
          id: rawItem.contentid || `pin-${Date.now()}-${Math.random()}`,
          contentId: rawItem.contentid,
          title: rawItem.title,
          region: rawItem.addr1 ? rawItem.addr1.split(' ')[0] : (cleanTargetCity || '한국'),
          theme: '관광명소/핫플',
          contentTypeId: rawItem.contenttypeid || '12',
          rating: 4.9,
          image: rawImg,
          location: rawItem.addr1 || `${lm} 위치`,
          lat: parseFloat(rawItem.mapy) || 37.2858,
          lng: parseFloat(rawItem.mapx) || 127.0145,
          tel: rawItem.tel || '',
          tags: ['관광명소', '핫플레이스', lm]
        };
      } else {
        // 🎯 3차: 공공 DB에 아직 미등록된 완전 신상 핫플을 위한 스마트 AI 지도 카드 (100% 매끄러운 연동)
        return {
          id: `ai-hotspot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          contentId: null,
          title: lm,
          region: cleanTargetCity || '한국',
          theme: 'AI 추천 핫플레이스',
          contentTypeId: '39',
          rating: 4.9,
          image: '/default-spot.png',
          location: cleanTargetCity ? `대한민국 ${cleanTargetCity} 일대 (지도 길찾기 연동)` : `${lm} 위치`,
          lat: 37.2858,
          lng: 127.0145,
          tel: '',
          tags: ['AI추천', '감성핫플', lm],
          isAiSmartPlace: true
        };
      }
    } catch (err) {
      console.warn(`Pinpoint query for ${lm} failed:`, err);
    }
    return null;
  });

  const results = await Promise.all(fetchPromises);
  return results.filter(Boolean);
}

