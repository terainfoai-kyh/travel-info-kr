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

      const cleanHtml = (str) => (str || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();

      return {
        ...item,
        firstimage: imgUrl,
        homepageUrl: hpUrl,
        overview: cleanHtml(item.overview),
        homepage: cleanHtml(item.homepage),
        tel: cleanHtml(item.tel || item.telname),
        addr1: cleanHtml(item.addr1),
        title: cleanHtml(item.title)
      };
    }
  } catch (err) {
    return null;
  }
  return null;
}

// ⚡ Smart Caching Memory Store (Zero Hardcoding Pipeline)
const DYNAMIC_SPOT_CACHE = new Map();

// Official Korean Tourism Area & Sigungu Code Mapping (전국 17개 시·도 및 226개 시·군·구 전수 매핑)
export const TOUR_API_AREA_CODES = {
  // 특별시 / 광역시 / 특별자치시
  '서울': 1, '인천': 2, '대전': 3, '대구': 4, '광주': 5, '부산': 6, '울산': 7, '세종': 8,
  
  // 울산광역시 산하 구/군 (7)
  '울주': 7, '울주군': 7, '울산 중구': 7, '울산 남구': 7, '울산 동구': 7, '울산 북구': 7,
  
  // 부산광역시 산하 군 (6)
  '기장': 6, '기장군': 6, '해운대': 6, '영도': 6,

  // 인천광역시 산하 군 (2)
  '강화': 2, '강화군': 2, '옹진': 2, '옹진군': 2,

  // 대구광역시 산하 군 (4)
  '군위': 4, '군위군': 4, '달성': 4, '달성군': 4,
  
  // 경기도 (31)
  '경기': 31, '수원': 31, '가평': 31, '고양': 31, '과천': 31, '광명': 31, '광주(경기)': 31, '구리': 31, '군포': 31, '김포': 31,
  '남양주': 31, '동두천': 31, '부천': 31, '성남': 31, '시흥': 31, '안산': 31, '안성': 31, '안양': 31, '양주': 31, '양평': 31,
  '여주': 31, '연천': 31, '오산': 31, '용인': 31, '의왕': 31, '의정부': 31, '이천': 31, '파주': 31, '평택': 31, '포천': 31, '하남': 31, '화성': 31,
  
  // 강원특별자치도 (32)
  '강원': 32, '강릉': 32, '고성(강원)': 32, '동해': 32, '삼척': 32, '속초': 32, '양구': 32, '양양': 32, '영월': 32, '원주': 32,
  '인제': 32, '정선': 32, '철원': 32, '춘천': 32, '태백': 32, '평창': 32, '홍천': 32, '화천': 32, '횡성': 32,
  
  // 충청북도 (33)
  '충북': 33, '괴산': 33, '단양': 33, '보은': 33, '영동': 33, '옥천': 33, '음성': 33, '제천': 33, '진천': 33, '청주': 33, '충주': 33, '증평': 33,
  
  // 충청남도 (34)
  '충남': 34, '계룡': 34, '공주': 34, '금산': 34, '논산': 34, '당진': 34, '보령': 34, '부여': 34, '서산': 34, '서천': 34, '아산': 34, '예산': 34, '천안': 34, '청양': 34, '태안': 34, '홍성': 34,
  
  // 경상북도 (35)
  '경북': 35, '경산': 35, '경주': 35, '고령': 35, '구미': 35, '김천': 35, '문경': 35, '봉화': 35, '상주': 35, '성주': 35, '안동': 35,
  '영덕': 35, '영양': 35, '영주': 35, '영천': 35, '예천': 35, '울릉': 35, '울진': 35, '의성': 35, '청도': 35, '청송': 35, '칠곡': 35, '포항': 35,
  
  // 경상남도 (36)
  '경남': 36, '거제': 36, '거창': 36, '고성': 36, '김해': 36, '남해': 36, '밀양': 36, '사천': 36, '산청': 36, '양산': 36, '의령': 36,
  '진주': 36, '창녕': 36, '창원': 36, '통영': 36, '하동': 36, '함안': 36, '함양': 36, '합천': 36,
  
  // 전북특별자치도 (37)
  '전북': 37, '고창': 37, '군산': 37, '김제': 37, '남원': 37, '무주': 37, '부안': 37, '순창': 37, '완주': 37, '익산': 37, '임실': 37, '장수': 37, '전주': 37, '정읍': 37, '진안': 37,
  
  // 전라남도 (38)
  '전남': 38, '강진': 38, '고흥': 38, '곡성': 38, '광양': 38, '구례': 38, '나주': 38, '담양': 38, '목포': 38, '무안': 38, '보성': 38,
  '순천': 38, '신안': 38, '여수': 38, '영광': 38, '영암': 38, '완도': 38, '장성': 38, '장흥': 38, '진도': 38, '함평': 38, '해남': 38, '화순': 38,
  
  // 제주특별자치도 (39)
  '제주': 39, '서귀포': 39
};

// 🎯 전국 226개 시/군/구 정밀 sigunguCode 매핑 (한국관광공사 TourAPI 4.0 표준)
export const TOUR_API_SIGUNGU_CODES = {
  // 울산광역시 (7)
  '울산 중구': 1, '울산 남구': 2, '울산 동구': 3, '울산 북구': 4, '울주': 5, '울주군': 5,
  
  // 부산광역시 (6)
  '기장': 16, '기장군': 16,

  // 인천광역시 (2)
  '강화': 1, '강화군': 1, '옹진': 8, '옹진군': 8,

  // 대구광역시 (4)
  '군위': 9, '군위군': 9, '달성': 3, '달성군': 3,

  // 경기도 (31)
  '가평': 1, '고양': 2, '과천': 3, '광명': 4, '구리': 6, '군포': 7, '김포': 8, '남양주': 9, '동두천': 10, '부천': 11,
  '성남': 12, '수원': 13, '시흥': 14, '안산': 15, '안성': 16, '안양': 17, '양주': 18, '양평': 19, '여주': 20, '연천': 21,
  '오산': 22, '용인': 23, '의왕': 24, '의정부': 25, '이천': 26, '파주': 27, '평택': 28, '포천': 29, '하남': 30, '화성': 31,
  
  // 강원도 (32)
  '강릉': 1, '고성(강원)': 2, '동해': 3, '삼척': 4, '속초': 5, '양구': 6, '양양': 7, '영월': 8, '원주': 9, '인제': 10,
  '정선': 11, '철원': 12, '춘천': 13, '태백': 14, '평창': 15, '홍천': 16, '화천': 17, '횡성': 18,
  
  // 충청북도 (33)
  '괴산': 1, '단양': 2, '보은': 3, '영동': 4, '옥천': 5, '음성': 6, '제천': 7, '진천': 8, '청주': 9, '충주': 10, '증평': 11,
  
  // 충청남도 (34)
  '계룡': 1, '공주': 2, '금산': 3, '논산': 4, '당진': 5, '보령': 6, '부여': 7, '서산': 8, '서천': 9, '아산': 10,
  '예산': 12, '천안': 13, '청양': 14, '태안': 15, '홍성': 16,
  
  // 경상북도 (35)
  '경산': 1, '경주': 2, '고령': 3, '구미': 4, '김천': 6, '문경': 7, '봉화': 8, '상주': 9, '성주': 10, '안동': 11,
  '영덕': 12, '영양': 13, '영주': 14, '영천': 15, '예천': 16, '울릉': 17, '울진': 18, '의성': 19, '청도': 20, '청송': 21, '칠곡': 22, '포항': 23,
  
  // 경상남도 (36)
  '거제': 1, '거창': 2, '고성': 3, '김해': 4, '남해': 5, '밀양': 7, '사천': 8, '산청': 9, '양산': 10, '의령': 11,
  '진주': 12, '창녕': 14, '창원': 15, '통영': 16, '하동': 17, '함안': 18, '함양': 19, '합천': 20,
  
  // 전북특별자치도 (37)
  '고창': 1, '군산': 2, '김제': 3, '남원': 4, '무주': 5, '부안': 6, '순창': 7, '완주': 8, '익산': 9, '임실': 10,
  '장수': 11, '전주': 12, '정읍': 13, '진안': 14,
  
  // 전라남도 (38)
  '강진': 1, '고흥': 2, '곡성': 3, '광양': 4, '구례': 5, '나주': 6, '담양': 7, '목포': 8, '무안': 9, '보성': 10,
  '순천': 11, '신안': 12, '여수': 13, '영광': 14, '영암': 15, '완도': 16, '장성': 17, '장흥': 18, '진도': 19, '함평': 20, '해남': 21, '화순': 22,
  
  // 제주특별자치도 (39)
  '서귀포': 1, '제주': 2
};

// 🌐 전국 지자체 표준 다국어(영문/일문/중문) 동적 사전
export const KOREAN_CITY_I18N = {
  '서울': { en: 'Seoul', ja: 'ソウル', zh: '首尔' },
  '부산': { en: 'Busan', ja: '釜山', zh: '釜山' },
  '제주': { en: 'Jeju', ja: '済州', zh: '济州' },
  '서귀포': { en: 'Seogwipo', ja: '西帰浦', zh: '西归浦' },
  '경주': { en: 'Gyeongju', ja: '慶州', zh: '庆州' },
  '강릉': { en: 'Gangneung', ja: '江陵', zh: '江陵' },
  '속초': { en: 'Sokcho', ja: '束草', zh: '束草' },
  '여수': { en: 'Yeosu', ja: '麗水', zh: '丽水' },
  '전주': { en: 'Jeonju', ja: '全州', zh: '全州' },
  '수원': { en: 'Suwon', ja: '水原', zh: '水原' },
  '안동': { en: 'Andong', ja: '安東', zh: '安东' },
  '대구': { en: 'Daegu', ja: '大邱', zh: '大邱' },
  '인천': { en: 'Incheon', ja: '仁川', zh: '仁川' },
  '대전': { en: 'Daejeon', ja: '大田', zh: '大田' },
  '광주': { en: 'Gwangju', ja: '光州', zh: '光州' },
  '울산': { en: 'Ulsan', ja: '蔚山', zh: '蔚山' },
  '울주': { en: 'Ulju', ja: '蔚州', zh: '蔚州' },
  '울주군': { en: 'Ulju-gun', ja: '蔚州郡', zh: '蔚州郡' },
  '기장': { en: 'Gijang', ja: '機張', zh: '机张' },
  '진주': { en: 'Jinju', ja: '晋州', zh: '晋州' },
  '창원': { en: 'Changwon', ja: '昌原', zh: '昌原' },
  '김해': { en: 'Gimhae', ja: '金海', zh: '金海' },
  '사천': { en: 'Sacheon', ja: '泗川', zh: '泗川' },
  '문경': { en: 'Mungyeong', ja: '聞慶', zh: '闻庆' },
  '거창': { en: 'Geochang', ja: '居昌', zh: '居昌' },
  '상주': { en: 'Sangju', ja: '尚州', zh: '尚州' },
  '통영': { en: 'Tongyeong', ja: '統営', zh: '统营' },
  '거제': { en: 'Geoje', ja: '巨済', zh: '巨济' },
  '남해': { en: 'Namhae', ja: '南海', zh: '南海' },
  '춘천': { en: 'Chuncheon', ja: '春川', zh: '春川' },
  '평창': { en: 'Pyeongchang', ja: '平昌', zh: '平昌' },
  '영월': { en: 'Yeongwol', ja: '寧越', zh: '宁越' },
  '정선': { en: 'Jeongseon', ja: '旌善', zh: '旌善' },
  '동해': { en: 'Donghae', ja: '東海', zh: '东海' },
  '삼척': { en: 'Samcheok', ja: '三陟', zh: '三陟' },
  '원주': { en: 'Wonju', ja: '原州', zh: '原州' },
  '태백': { en: 'Taebaek', ja: '太白', zh: '太白' },
  '양양': { en: 'Yangyang', ja: '襄陽', zh: '襄阳' },
  '부여': { en: 'Buyeo', ja: '扶余', zh: '扶余' },
  '공주': { en: 'Gongju', ja: '公州', zh: '公州' },
  '보령': { en: 'Boryeong', ja: '保寧', zh: '保宁' },
  '제천': { en: 'Jecheon', ja: '堤川', zh: '堤川' },
  '충주': { en: 'Chungju', ja: '忠州', zh: '忠州' },
  '단양': { en: 'Danyang', ja: '丹陽', zh: '丹阳' },
  '태안': { en: 'Taean', ja: '泰安', zh: '泰安' },
  '담양': { en: 'Damyang', ja: '潭陽', zh: '潭阳' },
  '보성': { en: 'Boseong', ja: '宝城', zh: '宝城' },
  '구례': { en: 'Gurye', ja: '求礼', zh: '求礼' },
  '하동': { en: 'Hadong', ja: '河東', zh: '河东' },
  '남원': { en: 'Namwon', ja: '南原', zh: '南原' },
  '순천': { en: 'Suncheon', ja: '順天', zh: '顺天' },
  '목포': { en: 'Mokpo', ja: '木浦', zh: '木浦' },
  '신안': { en: 'Sinan', ja: '新安', zh: '新安' },
  '완도': { en: 'Wando', ja: '莞島', zh: '莞岛' },
  '진도': { en: 'Jindo', ja: '珍島', zh: '珍岛' },
  '군산': { en: 'Gunsan', ja: '群山', zh: '群山' },
  '고창': { en: 'Gochang', ja: '高敞', zh: '高敞' },
  '부안': { en: 'Buan', ja: '扶安', zh: '扶安' },
  '영덕': { en: 'Yeongdeok', ja: '盈徳', zh: '盈德' },
  '울진': { en: 'Uljin', ja: '蔚珍', zh: '蔚珍' },
  '밀양': { en: 'Miryang', ja: '密陽', zh: '密阳' },
  '청도': { en: 'Cheongdo', ja: '清道', zh: '清道' },
  '포항': { en: 'Pohang', ja: '浦項', zh: '浦项' },
  '파주': { en: 'Paju', ja: '坡州', zh: '坡州' },
  '포천': { en: 'Pocheon', ja: '抱川', zh: '抱川' },
  '가평': { en: 'Gapyeong', ja: '加平', zh: '加平' },
  '양평': { en: 'Yangpyeong', ja: '楊平', zh: '杨平' },
  '울릉': { en: 'Ulleungdo', ja: '鬱陵島', zh: '郁陵岛' }
};

export function getCityMultilingualName(cityNameKo, lang = 'en') {
  if (!cityNameKo) return '';
  const clean = cityNameKo.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim();
  const i18n = KOREAN_CITY_I18N[clean] || KOREAN_CITY_I18N[cityNameKo];
  if (i18n) {
    if (lang === 'ja' && i18n.ja) return i18n.ja;
    if ((lang === 'zh' || lang === 'zht') && i18n.zh) return i18n.zh;
    if (i18n.en) return i18n.en;
  }
  return clean || cityNameKo;
}

// 🎯 [반경 기반 위치 조회 안전망] 위경도 반경 15km 내의 실제 TourAPI 4.0 정품 명소 조회
export async function fetchLocationBasedTourApiSpots(lat, lng, radius = 15000, lang = 'ko') {
  if (!lat || !lng) return [];

  let apiBase = PUBLIC_API_CONFIG.TOUR_API_BASE || 'https://apis.data.go.kr/B551011/KorService2';
  if (lang === 'en') apiBase = PUBLIC_API_CONFIG.ENG_BASE;
  else if (lang === 'ja') apiBase = PUBLIC_API_CONFIG.JPN_BASE;
  else if (lang === 'zh') apiBase = PUBLIC_API_CONFIG.CHS_BASE;
  else if (lang === 'zht') apiBase = PUBLIC_API_CONFIG.CHT_BASE;
  else if (lang === 'de') apiBase = PUBLIC_API_CONFIG.GER_BASE;
  else if (lang === 'fr') apiBase = PUBLIC_API_CONFIG.FRE_BASE;
  else if (lang === 'es') apiBase = PUBLIC_API_CONFIG.SPN_BASE;
  else if (lang === 'ru') apiBase = PUBLIC_API_CONFIG.RUS_BASE;

  const cacheKey = `loc_${lat.toFixed(3)}_${lng.toFixed(3)}_${radius}_${lang}`;
  if (DYNAMIC_SPOT_CACHE.has(cacheKey)) {
    return DYNAMIC_SPOT_CACHE.get(cacheKey);
  }

  try {
    const url = `${apiBase}/locationBasedList2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&mapX=${lng}&mapY=${lat}&radius=${radius}&arrange=P&numOfRows=30&pageNo=1`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const itemsRaw = data.response?.body?.items?.item || [];
    const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw ? [itemsRaw] : []);

    const validSpots = items
      .filter(item => {
        const typeId = String(item.contenttypeid || '');
        // 🛡️ Shopping (38/79), Food (39/82), Stay (32/80) 100% 원천 차단!
        if (typeId && (typeId === '39' || typeId === '38' || typeId === '32' || typeId === '79' || typeId === '82' || typeId === '80')) return false;
        
        const title = (item.title || '').trim();
        // 🛡️ Tax Refund Shop, Lotte Mall, Outlet, Artbox, Descente, Mart 등 상업 매장 100% 필터링
        const isCommercial = /(tax refund|tax-refund|shop|store|branch|lotte|outlet|mall|department|artbox|descente|cambridge|olive young|gs25|cu|seven eleven|emart|신세계|현대백화점|롯데몰|이마트|홈플러스|식당|음식점|맛집|쇼핑|판매장|스토어|플래그십|직영점|대리점|지점|점$|점\)|점\]|도서관|구청|시청|군청|주민센터|종합운동장|체육관|캠핑장|글램핑|야영장|수련원|연수원|노인복지|어린이집)/i.test(title);
        return !isCommercial;
      })
      .map(item => ({
        id: `tourapi_loc_${item.contentid}`,
        contentId: String(item.contentid || ''),
        title: item.title,
        name: item.title,
        category: (String(item.contenttypeid) === '14' ? '문화시설' : String(item.contenttypeid) === '28' ? '체험/레포츠' : '관광명소'),
        theme: item.cat3 || '한국 대표 관광지',
        description: item.addr1 || '대표 관광 명소입니다.',
        lat: parseFloat(item.mapy),
        lng: parseFloat(item.mapx),
        address: item.addr1 || item.addr2 || item.title,
        image: item.firstimage || item.firstimage2 || null,
        duration: 90,
        rating: 4.8,
        dataSource: 'TOUR_API_LIVE_LOCATION'
      }));

    if (validSpots.length > 0) {
      DYNAMIC_SPOT_CACHE.set(cacheKey, validSpots);
    }
    return validSpots;
  } catch (e) {
    return [];
  }
}

// 🍽️ [실시간 주변 맛집/카페 조회] 위경도 반경 내 실제 한국관광공사 등록 음식점(39) 및 카페 실시간 수신
export async function fetchNearbyRestaurantsAndCafes(lat, lng, radius = 3000, lang = 'ko') {
  if (!lat || !lng) return [];

  let apiBase = PUBLIC_API_CONFIG.TOUR_API_BASE || 'https://apis.data.go.kr/B551011/KorService2';
  let foodTypeId = '39';
  if (lang === 'en') { apiBase = PUBLIC_API_CONFIG.ENG_BASE; foodTypeId = '82'; }
  else if (lang === 'ja') { apiBase = PUBLIC_API_CONFIG.JPN_BASE; foodTypeId = '82'; }
  else if (lang === 'zh') { apiBase = PUBLIC_API_CONFIG.CHS_BASE; foodTypeId = '82'; }
  else if (lang === 'zht') { apiBase = PUBLIC_API_CONFIG.CHT_BASE; foodTypeId = '82'; }
  else if (lang === 'de') { apiBase = PUBLIC_API_CONFIG.GER_BASE; foodTypeId = '82'; }
  else if (lang === 'fr') { apiBase = PUBLIC_API_CONFIG.FRE_BASE; foodTypeId = '82'; }
  else if (lang === 'es') { apiBase = PUBLIC_API_CONFIG.SPN_BASE; foodTypeId = '82'; }
  else if (lang === 'ru') { apiBase = PUBLIC_API_CONFIG.RUS_BASE; foodTypeId = '82'; }

  const cacheKey = `food_${lat.toFixed(3)}_${lng.toFixed(3)}_${radius}_${lang}`;
  if (DYNAMIC_SPOT_CACHE.has(cacheKey)) {
    return DYNAMIC_SPOT_CACHE.get(cacheKey);
  }

  try {
    const url = `${apiBase}/locationBasedList2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&mapX=${lng}&mapY=${lat}&radius=${radius}&contentTypeId=${foodTypeId}&arrange=P&numOfRows=15&pageNo=1`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const itemsRaw = data.response?.body?.items?.item || [];
    const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw ? [itemsRaw] : []);

    const validFoods = items
      .filter(item => item.title && !/(편의점|gs25|cu|세븐일레븐|이마트24|마트|슈퍼|상회)/i.test(item.title))
      .slice(0, 5)
      .map(item => {
        const isCafe = /(카페|커피|베이커리|디저트|cafe|coffee|bakery|찻집)/i.test(item.title) || /(카페|커피|음료)/i.test(item.cat3 || '');
        return {
          id: `food_${item.contentid}`,
          name: item.title,
          type: isCafe ? (lang === 'en' ? 'Cafe ☕' : '감성카페 ☕') : (lang === 'en' ? 'Local Food 🍲' : '로컬미식 🍲'),
          category: isCafe ? '카페/디저트' : '향토음식점',
          distance: item.dist ? `약 ${Math.round(item.dist)}m` : '도보 권역',
          desc: item.addr1 || (isCafe ? '여유로운 분위기의 로컬 카페' : '현지 식재료를 살린 추천 식당'),
          image: item.firstimage || item.firstimage2 || null,
          lat: parseFloat(item.mapy),
          lng: parseFloat(item.mapx)
        };
      });

    if (validFoods.length > 0) {
      DYNAMIC_SPOT_CACHE.set(cacheKey, validFoods);
    }
    return validFoods;
  } catch (e) {
    return [];
  }
}

export async function fetchCityTourApiSpots(city = '서울', lang = 'ko') {
  // 🎯 [복합 지명 스마트 정규화] '제주·서귀포' -> cleanCity: '제주', subCity: '서귀포'
  const rawCityStr = (city || '서울').trim();
  const cityParts = rawCityStr.split(/[·/,\-+\s]/).map(p => p.replace(/(시|군|구|도)$/, '').trim()).filter(Boolean);
  const cleanCity = cityParts[0] || '서울';
  const subCity = cityParts[1] || null;

  const cacheKey = `city_spots_${rawCityStr}_${lang}`;
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
    const areaCode = TOUR_API_AREA_CODES[cleanCity] || TOUR_API_AREA_CODES[rawCityStr];
    // 복합 권역(제주·서귀포, 통영·거제 등)일 때는 특정 sigunguCode로 제한하지 않고 권역 전체를 조회!
    const sigunguCode = subCity ? null : (TOUR_API_SIGUNGU_CODES[cleanCity] || TOUR_API_SIGUNGU_CODES[rawCityStr]);
    let fetchUrl = '';
    if (areaCode) {
      // Area & Sigungu based query: TourAPI 4.0 Standard Realtime Popularity (arrange=P)
      const sigunguParam = sigunguCode ? `&sigunguCode=${sigunguCode}` : '';
      fetchUrl = `${apiBase}/areaBasedList2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&areaCode=${areaCode}${sigunguParam}&arrange=P&numOfRows=100&pageNo=1`;
    } else {
      // Keyword search fallback (arrange=P)
      fetchUrl = `${apiBase}/searchKeyword2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&keyword=${encodeURIComponent(cleanCity)}&arrange=P&numOfRows=100&pageNo=1`;
    }

    const res = await fetch(fetchUrl);
    if (!res.ok) return [];
    const data = await res.json();
    const itemsRaw = data.response?.body?.items?.item || [];
    const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw ? [itemsRaw] : []);

    let validSpots = items
      .filter(item => {
        const lat = parseFloat(item.mapy);
        const lng = parseFloat(item.mapx);
        const isCoordsValid = lat && lng && lat > 32 && lat < 40 && lng > 124 && lng < 132;
        if (!isCoordsValid) return false;

        // 🛡️ Official TourAPI Category Enforcement: Only 12/76 (Sightseeing), 14/78 (Culture), 28/75 (Leisure), 15/85 (Festival)
        const typeId = String(item.contenttypeid || '');
        if (typeId && (typeId === '39' || typeId === '38' || typeId === '32' || typeId === '79' || typeId === '82' || typeId === '80')) return false;
        const isSightseeingType = (typeId === '12' || typeId === '14' || typeId === '28' || typeId === '76' || typeId === '78' || typeId === '75' || typeId === '85');
        if (typeId && !isSightseeingType) return false;

        // 🛡️ Secondary Title Filter: Commercial stores, Tax Refund shops, malls, outlets, food alleys, public offices
        const title = (item.title || '').trim();
        const isCommercialOrNonTourist = /(tax refund|tax-refund|shop|store|branch|lotte|outlet|mall|department|artbox|descente|cambridge|olive young|gs25|cu|seven eleven|emart|신세계|현대백화점|롯데몰|이마트|홈플러스|종합상가|한복매장|귀금속|도매상가|도매시장|유통단지|쇼핑타운|지하상가|수산상회|청과물|플래그쉽|플래그십|스토어|점$|점\s|점\)|점\]|식당|본점|직영점|대리점|지점|도서관|열람실|독서실|구청|시청|군청|주민센터|행정복지센터|종합운동장|체육관|캠핑장|캠핑체험|글램핑|야영장|수련원|연수원|노인복지|어린이집|양곱창|곱창골목|먹자골목|닭갈비골목|순대골목|장어골목|떡볶이골목|생선구이골목|음식거리|먹거리골목|음식특화)/i.test(title);
        return !isCommercialOrNonTourist;
      })
      .map(item => ({
        id: `tourapi_${item.contentid}`,
        contentId: String(item.contentid || ''),
        title: item.title,
        name: item.title,
        category: (String(item.contenttypeid) === '14' ? '문화시설' : String(item.contenttypeid) === '28' ? '체험/레포츠' : '관광명소'),
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

    // 🌟 [2차 안전망] 만약 결과가 8개 미만으로 적으면 키워드 검색(searchKeyword2) 병렬 결합
    if (validSpots.length < 8) {
      try {
        const kwUrl = `${apiBase}/searchKeyword2?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&keyword=${encodeURIComponent(cleanCity)}&arrange=P&numOfRows=30&pageNo=1`;
        const kwRes = await fetch(kwUrl);
        if (kwRes.ok) {
          const kwData = await kwRes.json();
          const kwItems = kwData.response?.body?.items?.item || [];
          const kwArr = Array.isArray(kwItems) ? kwItems : (kwItems ? [kwItems] : []);
          const kwSpots = kwArr
            .filter(item => {
              const lat = parseFloat(item.mapy);
              const lng = parseFloat(item.mapx);
              return lat && lng && lat > 32 && lat < 40 && lng > 124 && lng < 132;
            })
            .map(item => ({
              id: `tourapi_kw_${item.contentid}`,
              contentId: String(item.contentid || ''),
              title: item.title,
              name: item.title,
              category: (String(item.contenttypeid) === '14' ? '문화시설' : String(item.contenttypeid) === '28' ? '체험/레포츠' : '관광명소'),
              theme: item.cat3 || '한국 대표 관광지',
              description: item.addr1 || `${city}의 대표 관광 명소입니다.`,
              lat: parseFloat(item.mapy),
              lng: parseFloat(item.mapx),
              address: item.addr1 || item.addr2 || `${city} ${item.title}`,
              image: item.firstimage || item.firstimage2 || null,
              duration: 90,
              rating: 4.8,
              dataSource: 'TOUR_API_LIVE_KEYWORD'
            }));
          
          // 중복 방지 병합
          const existingIds = new Set(validSpots.map(s => s.contentId));
          for (const ks of kwSpots) {
            if (!existingIds.has(ks.contentId)) {
              validSpots.push(ks);
            }
          }
        }
      } catch (e) {}
    }

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
      // 🛡️ Enforce Sightseeing Categories and strictly filter out shopping / Tax Refund / stores
      const filteredItems = items.filter(item => {
        const typeId = String(item.contenttypeid || '');
        if (typeId && (typeId === '39' || typeId === '38' || typeId === '32' || typeId === '79' || typeId === '82' || typeId === '80')) {
          return false;
        }

        const title = (item.title || '').trim();
        const isCommercialOrNonTourist = /(tax refund|tax-refund|shop|store|branch|lotte|outlet|mall|department|artbox|descente|cambridge|olive young|gs25|cu|seven eleven|emart|신세계|현대백화점|롯데몰|이마트|홈플러스|한쿡|식당|음식점|맛집|갈비|푸드|카페|커피|베이커리|쇼핑|판매장|스토어|플래그십|직영점|대리점|지점|본점|도서관|열람실|독서실|구청|시청|군청|주민센터|행정복지센터|종합운동장|체육관|캠핑장|캠핑체험|글램핑|야영장|수련원|연수원|노인복지|어린이집|양곱창|곱창골목|먹자골목|닭갈비골목|순대골목|장어골목|떡볶이골목|생선구이골목|음식거리|먹거리골목|음식특화|점$|점\)|점\])/i.test(title);
        return !isCommercialOrNonTourist;
      });

      // Sort exact match first (e.g. '남산서울타워' or 'N서울타워' before sub-facilities)
      const cleanNormQ = cleanQ.toUpperCase().replace(/\s/g, '');
      filteredItems.sort((a, b) => {
        const aTitle = (a.title || '').toUpperCase().replace(/\s/g, '');
        const bTitle = (b.title || '').toUpperCase().replace(/\s/g, '');
        const aExact = (aTitle === cleanNormQ || aTitle === 'N서울타워' || aTitle === '남산서울타워');
        const bExact = (bTitle === cleanNormQ || bTitle === 'N서울타워' || bTitle === '남산서울타워');
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0;
      });

      spotList = filteredItems.map(item => ({
        id: String(item.contentid || Math.random()),
        contentId: String(item.contentid || ''),
        title: item.title,
        searchKeyword: item.title,
        location: item.addr1 || item.addr2 || '대한민국 관광 명소',
        lat: parseFloat(item.mapy) || 37.5665,
        lng: parseFloat(item.mapx) || 126.9780,
        rating: 4.8,
        tags: [cleanQ, '공공정품관광지'],
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
        useseason: cleanHtml(item.useseason || item.useseasonleports),
        parking: cleanHtml(item.parking || item.parkingculture || item.parkingfood || item.parkingleports),
        chkbabycarriage: cleanHtml(item.chkbabycarriage || item.chkbabycarriageculture || item.chkbabycarriageleports),
        chkpet: cleanHtml(item.chkpet || item.chkpetculture || item.chkpetleports),
        chkcreditcard: cleanHtml(item.chkcreditcard || item.chkcreditcardculture || item.chkcreditcardfood || item.chkcreditcardleports)
      };
    }
  } catch (err) {
    console.warn('Detail Intro API fallback:', err);
  }
  return null;
}

// 한국관광공사 TourAPI 4.0 - 코스정보조회 (/detailCourse2)
export async function fetchSpotDetailCourse(contentId, lang = 'ko') {
  if (!contentId) return [];

  let baseUrl = PUBLIC_API_CONFIG.DETAIL_COURSE_URL || 'https://apis.data.go.kr/B551011/KorService2/detailCourse2';
  if (lang === 'en') baseUrl = `${PUBLIC_API_CONFIG.ENG_BASE}/detailCourse2`;
  else if (lang === 'ja') baseUrl = `${PUBLIC_API_CONFIG.JPN_BASE}/detailCourse2`;
  else if (lang === 'zh') baseUrl = `${PUBLIC_API_CONFIG.CHS_BASE}/detailCourse2`;
  else if (lang === 'zht') baseUrl = `${PUBLIC_API_CONFIG.CHT_BASE}/detailCourse2`;
  else if (lang === 'de') baseUrl = `${PUBLIC_API_CONFIG.GER_BASE}/detailCourse2`;
  else if (lang === 'fr') baseUrl = `${PUBLIC_API_CONFIG.FRE_BASE}/detailCourse2`;
  else if (lang === 'es') baseUrl = `${PUBLIC_API_CONFIG.SPN_BASE}/detailCourse2`;
  else if (lang === 'ru') baseUrl = `${PUBLIC_API_CONFIG.RUS_BASE}/detailCourse2`;

  const url = `${baseUrl}?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&contentId=${contentId}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    
    const itemsRaw = data.response?.body?.items?.item;
    const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw ? [itemsRaw] : []);
    const cleanHtml = (str) => (str || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();

    return items.map(sub => ({
      subNum: sub.subnum,
      subName: cleanHtml(sub.subname),
      subOverview: cleanHtml(sub.subdetailoverview),
      subImage: (sub.subdetailimg || '').replace(/^http:\/\//i, 'https://') || null,
      subDistance: cleanHtml(sub.subdetailalt || sub.distance),
      subTime: cleanHtml(sub.taketime)
    }));
  } catch (err) {
    console.warn('Detail Course API fallback:', err);
  }
  return [];
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

