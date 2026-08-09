import { PUBLIC_API_CONFIG, REGION_META, THEME_META } from './apiConfig';
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

      let imgUrl = (item.firstimage || item.firstimage2 || '').replace(/^http:\/\//i, 'https://');
      const lowerImg = imgUrl.toLowerCase();
      if (!imgUrl || lowerImg.includes('japan') || lowerImg.includes('fuji') || lowerImg.includes('tokyo') || lowerImg.includes('kyoto') || lowerImg.includes('osaka') || lowerImg.includes('photo-1549693578') || lowerImg.includes('photo-1578637387939')) {
        imgUrl = '/default-spot.png';
      }

      return {
        overview: item.overview ? item.overview.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') : '',
        homepage: hpUrl,
        homepageRaw: rawHp,
        tel: item.tel || '',
        addr1: item.addr1 || '',
        title: item.title || '',
        firstimage: imgUrl
      };
    }
  } catch (err) {
    console.warn('Detail common API fallback:', err);
  }
  return null;
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

  const url = `${baseUrl}?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&contentId=${contentId}&imageYN=Y&subImageYN=Y`;

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
  arrange = 'O',
  apiServiceType = 'area',
  startDate = '',
  lang = 'ko'
}) {
  const regionMeta = REGION_META[region] || REGION_META['서울'];
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

  // Convert app arrange filter to official TourAPI 4.0 arrange code
  let apiArrange = 'B';
  if (arrange === 'A') apiArrange = 'B';      // 추천순 -> TourAPI 'B' (조회수/인기순)
  else if (arrange === 'O') apiArrange = 'A'; // 명칭순 -> TourAPI 'A' (제목순)
  else if (arrange === 'Q') apiArrange = 'C'; // 수정일순 -> TourAPI 'C' (수정일순)
  else if (arrange === 'R') apiArrange = 'D'; // 등록일순 -> TourAPI 'D' (등록일순)
  else apiArrange = arrange;

  let url = '';
  if (cleanKw) {
    url = `${apiBase}/searchKeyword2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=${apiArrange}&keyword=${encodeURIComponent(kwNoSpace)}`;
    if (regionMeta && regionMeta.areaCode) url += `&areaCode=${regionMeta.areaCode}`;
    if (contentTypeId) url += `&contentTypeId=${contentTypeId}`;
  } else if (apiServiceType === 'location') {
    url = `${apiBase}/locationBasedList2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=${apiArrange}&mapX=${regionMeta.lng}&mapY=${regionMeta.lat}&radius=20000`;
    if (contentTypeId) url += `&contentTypeId=${contentTypeId}`;
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
    if (contentTypeId) url += `&contentTypeId=${contentTypeId}`;
  }

  try {
    let res = await fetch(url);

    if (!res.ok) throw new Error(`TourAPI response not OK: status ${res.status}`);
    const data = await res.json();
    let items = data.response?.body?.items?.item || [];

    // Fallback search with original cleanKw if kwNoSpace yielded zero items from TourAPI
    if (items.length === 0 && cleanKw && kwNoSpace !== cleanKw && apiServiceType !== 'location' && apiServiceType !== 'festival' && apiServiceType !== 'stay') {
      const fallbackUrl = `${PUBLIC_API_CONFIG.SEARCH_KEYWORD_URL}?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=${apiArrange}&keyword=${encodeURIComponent(cleanKw)}`;
      const fbRes = await fetch(fallbackUrl);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        items = fbData.response?.body?.items?.item || [];
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

        if (arrange === 'O') {
          const titleA = String(a.title || a.crsNm || a.themeNm || a.spotNm || '');
          const titleB = String(b.title || b.crsNm || b.themeNm || b.spotNm || '');
          return titleA.localeCompare(titleB, 'ko-KR');
        }

        if (arrange === 'A' || arrange === 'B') {
          const hasImgA = !!(a.firstimage || a.firstimage2);
          const hasImgB = !!(b.firstimage || b.firstimage2);
          if (hasImgA && !hasImgB) return -1;
          if (!hasImgA && hasImgB) return 1;

          const countA = parseInt(a.readcount || 0, 10);
          const countB = parseInt(b.readcount || 0, 10);
          if (countA !== countB) return countB - countA;
        }

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
        const rawLat = parseFloat(item.mapy);
        const rawLng = parseFloat(item.mapx);

        return {
          id: item.contentid || item.crsIdx || `api-${idx}`,
          title: titleClean,
          region: region === '전국' ? '한국' : region,
          theme: theme === '전체' ? '관광' : theme,
          image: validImage,
          location: item.addr1 || item.sigun || item.createdtime || preset.loc,
          lat: (!isNaN(rawLat) && rawLat > 0) ? rawLat : preset.lat,
          lng: (!isNaN(rawLng) && rawLng > 0) ? rawLng : preset.lng,
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

      return filtered;
    }
  } catch (err) {
    console.warn('TourAPI Fallback triggered:', err);
  }

  // Fallback & Filter Mock Data with space-insensitive matching & image sanitization
  return TRAVEL_SPOTS.filter(spot => {
    const matchRegion = region === '전국' || spot.region === region;
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
      spotLocNoSpace.includes(kwNoSpace.toLowerCase());

    return matchRegion && matchTheme && matchAge && matchGender && matchKeyword;
  }).map(spot => {
    let img = spot.image;
    if (spot.title.includes('수원화성박물관') || img.includes('photo-1549693578') || img.includes('794101_image2_1.jpg')) {
      img = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%231e293b'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='%2338bdf8' font-size='32' font-weight='bold' font-family='sans-serif'%3E🏛️ 대한민국 대표 관광지%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='20' font-family='sans-serif'%3E(한국관광공사 정품 이미지 동기화 중)%3C/text%3E%3C/svg%3E";
    }
    return { ...spot, image: img };
  });
}
