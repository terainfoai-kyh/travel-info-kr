export const PUBLIC_API_CONFIG = {
  SERVICE_KEY: 'VAK23UX%2Bt67b9c5S67sgJm5o12DUbkAB5rnysV4bpaoUSIcPj%2FdGlqRQoFRQyrVX8yWZSuW2TqSEBRMqqLzrVQ%3D%3D',
  // 한국관광공사 TourAPI 4.0 - 국문 Service (KorService2)
  TOUR_API_BASE: 'https://apis.data.go.kr/B551011/KorService2',
  AREA_BASED_URL: 'https://apis.data.go.kr/B551011/KorService2/areaBasedList2',
  SEARCH_KEYWORD_URL: 'https://apis.data.go.kr/B551011/KorService2/searchKeyword2',
  DETAIL_COMMON_URL: 'https://apis.data.go.kr/B551011/KorService2/detailCommon2',
  DETAIL_INTRO_URL: 'https://apis.data.go.kr/B551011/KorService2/detailIntro2',
  DETAIL_INFO_URL: 'https://apis.data.go.kr/B551011/KorService2/detailInfo2',
  DETAIL_IMAGE_URL: 'https://apis.data.go.kr/B551011/KorService2/detailImage2',
  LOCATION_BASED_URL: 'https://apis.data.go.kr/B551011/KorService2/locationBasedList2',
  FESTIVAL_URL: 'https://apis.data.go.kr/B551011/KorService2/searchFestival2',
  STAY_URL: 'https://apis.data.go.kr/B551011/KorService2/searchStay2',

  // 한국관광공사 TourAPI 4.0 - 다국어 Service (Eng, Jpn, Chs, Cht, Ger, Fre, Spn, Rus)
  ENG_BASE: 'https://apis.data.go.kr/B551011/EngService2',
  JPN_BASE: 'https://apis.data.go.kr/B551011/JpnService2',
  CHS_BASE: 'https://apis.data.go.kr/B551011/ChsService2',
  CHT_BASE: 'https://apis.data.go.kr/B551011/ChtService2',
  GER_BASE: 'https://apis.data.go.kr/B551011/GerService2',
  FRE_BASE: 'https://apis.data.go.kr/B551011/FreService2',
  SPN_BASE: 'https://apis.data.go.kr/B551011/SpnService2',
  RUS_BASE: 'https://apis.data.go.kr/B551011/RusService2',

  // 한국관광공사 두드림 (두루누비) 다국어 관광정보 API
  DURUNUBI_BASE: 'https://apis.data.go.kr/B551011/Durunubi',

  // Google Maps Platform API Key
  GOOGLE_MAPS_KEY: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) || 'AIzaSyCZCfdgYBXPMDbB7N2EhiEY-7DmaCrPh0k',

  // 기상청 단기 & 중기 예보 Endpoints
  WEATHER_SHORT_BASE: 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0',
  WEATHER_MID_BASE: 'https://apis.data.go.kr/1360000/MidFcstInfoService'
};

// Region metadata for TourAPI areaCode and Weather grid coordinates
export const REGION_META = {
  '전국': { areaCode: '', nx: 60, ny: 127, lat: 37.5665, lng: 126.9780, regIdLand: '11B00000', regIdTa: '11B10101', stnId: '108' },
  '서울': { areaCode: '1', nx: 60, ny: 127, lat: 37.5665, lng: 126.9780, regIdLand: '11B00000', regIdTa: '11B10101', stnId: '108' },
  '인천': { areaCode: '2', nx: 55, ny: 124, lat: 37.4563, lng: 126.7052, regIdLand: '11B00000', regIdTa: '11B20201', stnId: '108' },
  '대전': { areaCode: '3', nx: 67, ny: 100, lat: 36.3504, lng: 127.3845, regIdLand: '11C20000', regIdTa: '11C20101', stnId: '133' },
  '대구': { areaCode: '4', nx: 89, ny: 90, lat: 35.8714, lng: 128.6014, regIdLand: '11H10000', regIdTa: '11H10701', stnId: '143' },
  '광주': { areaCode: '5', nx: 58, ny: 74, lat: 35.1595, lng: 126.8526, regIdLand: '11F20000', regIdTa: '11F20501', stnId: '156' },
  '부산': { areaCode: '6', nx: 98, ny: 76, lat: 35.1796, lng: 129.0756, regIdLand: '11H20000', regIdTa: '11H20201', stnId: '159' },
  '울산': { areaCode: '7', nx: 102, ny: 84, lat: 35.5384, lng: 129.3114, regIdLand: '11H20000', regIdTa: '11H20101', stnId: '159' },
  '세종': { areaCode: '8', nx: 66, ny: 103, lat: 36.4800, lng: 127.2890, regIdLand: '11C20000', regIdTa: '11C20401', stnId: '133' },
  '경기': { areaCode: '31', nx: 60, ny: 120, lat: 37.2750, lng: 127.0094, regIdLand: '11B00000', regIdTa: '11B20601', stnId: '108' },
  '강원': { areaCode: '32', nx: 73, ny: 134, lat: 37.8854, lng: 127.7298, regIdLand: '11D10000', regIdTa: '11D10101', stnId: '105' },
  '충북': { areaCode: '33', nx: 69, ny: 107, lat: 36.6358, lng: 127.4914, regIdLand: '11C10000', regIdTa: '11C10301', stnId: '131' },
  '충남': { areaCode: '34', nx: 68, ny: 100, lat: 36.5184, lng: 126.8000, regIdLand: '11C20000', regIdTa: '11C20301', stnId: '133' },
  '경북': { areaCode: '35', nx: 89, ny: 91, lat: 36.5760, lng: 128.5056, regIdLand: '11H10000', regIdTa: '11H10501', stnId: '143' },
  '경남': { areaCode: '36', nx: 91, ny: 77, lat: 35.2383, lng: 128.6924, regIdLand: '11H20000', regIdTa: '11H20301', stnId: '159' },
  '전북': { areaCode: '37', nx: 63, ny: 89, lat: 35.8242, lng: 127.1480, regIdLand: '11F10000', regIdTa: '11F10201', stnId: '146' },
  '전남': { areaCode: '38', nx: 51, ny: 67, lat: 34.8161, lng: 126.4629, regIdLand: '11F20000', regIdTa: '11F20501', stnId: '156' },
  '제주': { areaCode: '39', nx: 52, ny: 38, lat: 33.4996, lng: 126.5312, regIdLand: '11G00000', regIdTa: '11G00201', stnId: '184' }
};

// Dynamic Region Normalizer (0% Hardcode Risk, Nationwide Fallback)
export function getDynamicRegionMeta(rawRegion = '') {
  if (!rawRegion || typeof rawRegion !== 'string') {
    return REGION_META['전국'];
  }
  const clean = rawRegion.trim();
  if (REGION_META[clean]) return REGION_META[clean];

  if (clean.includes('강원')) return REGION_META['강원'];
  if (clean.includes('경기')) return REGION_META['경기'];
  if (clean.includes('충북') || clean.includes('충청북')) return REGION_META['충북'];
  if (clean.includes('충남') || clean.includes('충청남')) return REGION_META['충남'];
  if (clean.includes('경북') || clean.includes('경상북')) return REGION_META['경북'];
  if (clean.includes('경남') || clean.includes('경상남')) return REGION_META['경남'];
  if (clean.includes('전북') || clean.includes('전라북')) return REGION_META['전북'];
  if (clean.includes('전남') || clean.includes('전라남')) return REGION_META['전남'];
  if (clean.includes('제주')) return REGION_META['제주'];
  if (clean.includes('서울')) return REGION_META['서울'];
  if (clean.includes('인천')) return REGION_META['인천'];
  if (clean.includes('부산')) return REGION_META['부산'];
  if (clean.includes('대구')) return REGION_META['대구'];
  if (clean.includes('대전')) return REGION_META['대전'];
  if (clean.includes('광주')) return REGION_META['광주'];
  if (clean.includes('울산')) return REGION_META['울산'];
  if (clean.includes('세종')) return REGION_META['세종'];

  if (['수원', '성남', '용인', '고양', '부천', '화성', '안산', '남양주', '안양', '평택', '의정부', '파주', '시흥', '김포', '광명', '광주', '군포', '이천', '오산', '하남', '양주', '구리', '안성', '포천', '의왕', '여주', '양평', '동두천', '가평', '연천'].some(c => clean.includes(c))) {
    return REGION_META['경기'];
  }
  if (['강릉', '속초', '양양', '춘천', '원주', '동해', '태백', '삼척', '홍천', '횡성', '영월', '평창', '정선', '철원', '화천', '양구', '인제', '고성'].some(c => clean.includes(c))) {
    return REGION_META['강원'];
  }
  if (['창원', '진주', '통영', '사천', '김해', '밀양', '거제', '양산', '의령', '함안', '창녕', '고성', '남해', '하동', '산청', '함양', '거창', '합천'].some(c => clean.includes(c))) {
    return REGION_META['경남'];
  }
  if (['포항', '경주', '김천', '안동', '구미', '영주', '영천', '상주', '문경', '경산', '군위', '의성', '청송', '영양', '영덕', '청도', '고령', '성주', '칠곡', '예천', '봉화', '울진', '울릉'].some(c => clean.includes(c))) {
    return REGION_META['경북'];
  }
  if (['전주', '군산', '익산', '정읍', '남원', '김제', '완주', '진안', '무주', '장수', '임실', '순창', '고창', '부안'].some(c => clean.includes(c))) {
    return REGION_META['전북'];
  }
  if (['목포', '여수', '순천', '나주', '광양', '담양', '곡성', '구례', '고흥', '보성', '화순', '장흥', '강진', '해남', '영암', '무안', '함평', '영광', '장성', '완도', '진도', '신안'].some(c => clean.includes(c))) {
    return REGION_META['전남'];
  }

  // Safe Nationwide Fallback (NOT Seoul!)
  return REGION_META['전국'];
}

export const THEME_META = {
  '전체': '',
  '자연/힐링': '12', // 관광지
  '역사/문화': '14', // 문화시설
  '미식/쇼핑': '39', // 음식점
  '액티비티/레저': '28', // 레포츠
  'K-컬처/이벤트': '15', // 축제공연행사
  '숙박/호텔': '32', // 숙박
  '쇼핑/명소': '38'  // 쇼핑
};

export const API_SERVICE_TYPES = [
  { id: 'all', name: '전체 (모든 정보 서비스)' },
  { id: 'area', name: '지역기반 관광 정보' },
  { id: 'location', name: '위치기반 주변 관광 (내주변/반경)' },
  { id: 'festival', name: '행사/축제 정보' },
  { id: 'stay', name: '숙박/호텔 정보' }
];

export const AGODA_CITY_MAP = {
  '서울': { id: 14690, slug: 'seoul-kr' },
  '제주': { id: 16901, slug: 'jeju-island-kr' },
  '부산': { id: 17172, slug: 'busan-kr' },
  '인천': { id: 17171, slug: 'incheon-kr' },
  '대구': { id: 16894, slug: 'daegu-kr' },
  '대전': { id: 17176, slug: 'daejeon-kr' },
  '광주': { id: 17175, slug: 'gwangju-kr' },
  '경주': { id: 17174, slug: 'gyeongju-si-kr' },
  '강원': { id: 17216, slug: 'gangneung-si-kr' },
  '강릉': { id: 17216, slug: 'gangneung-si-kr' },
  '속초': { id: 17217, slug: 'sokcho-si-kr' },
  '전주': { id: 17177, slug: 'jeonju-si-kr' },
  '세종': { id: 32174, slug: 'sejong-kr' },
  '울산': { id: 17173, slug: 'ulsan-kr' },
  '여수': { id: 17300, slug: 'yeosu-si-kr' },
  '충북': { id: 17176, slug: 'daejeon-kr' },
  '충남': { id: 17176, slug: 'daejeon-kr' },
  '전북': { id: 17177, slug: 'jeonju-si-kr' },
  '전남': { id: 17300, slug: 'yeosu-si-kr' },
  '경북': { id: 17174, slug: 'gyeongju-si-kr' },
  '경남': { id: 17172, slug: 'busan-kr' }
};

export function buildAgodaDeepLink(regionOrTitle, checkIn, checkOut, extraLocation = '') {
  let finalCheckIn = checkIn;
  let finalCheckOut = checkOut;

  if (!finalCheckIn || !finalCheckOut) {
    const today = new Date();
    const nextTwoDays = new Date(today);
    nextTwoDays.setDate(today.getDate() + 2);

    finalCheckIn = today.toISOString().split('T')[0];
    finalCheckOut = nextTwoDays.toISOString().split('T')[0];
  }

  const startMs = new Date(finalCheckIn).getTime();
  const endMs = new Date(finalCheckOut).getTime();
  const los = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)));

  // Combine title, region and location to build the most accurate search query
  const rawTarget = `${regionOrTitle || ''} ${extraLocation || ''}`.trim();
  const cleanTarget = rawTarget
    .replace(/^(\d+[\.\s\-\:]+|Day\s*\d+[\s\-\:]+|\[\d+일차\])/gi, '')
    .replace(/\(.*?\)/g, '')
    .trim() || '대한민국';

  return `https://www.agoda.com/partners/partnersearch.aspx?cid=1972217&searchText=${encodeURIComponent(cleanTarget)}&checkin=${finalCheckIn}&checkout=${finalCheckOut}&los=${los}&rooms=1&adults=2`;
}

export function buildKKdayDeepLink(query) {
  const cleanQuery = encodeURIComponent((query || '한국 여행').trim());
  return `https://www.kkday.com/ko?cid=26248&keyword=${cleanQuery}`;
}

export function buildKlookDeepLink(query, checkIn, checkOut) {
  const cleanQuery = encodeURIComponent((query || '한국 여행').trim());
  let dateParams = '';
  if (checkIn && checkOut) {
    dateParams = `&start_date=${checkIn}&end_date=${checkOut}`;
  }
  return `https://www.klook.com/ko/search/result/?query=${cleanQuery}${dateParams}&aid=130249&af_wid=31000`;
}
