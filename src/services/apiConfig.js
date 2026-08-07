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
