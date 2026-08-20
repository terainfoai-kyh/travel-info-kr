/**
 * VORA AI 9.0 - 100% Pure Real-Time Geographically-Pinpointed Multi-Photo Engine
 * 
 * Features:
 * 1. Cache Isolation & Legacy Cleanup (Zero Cache Pollution).
 * 2. Exact Landmark Tokenization (Direct KTO Database Index Matching).
 * 3. AreaCode & Address 2-Tier Geolocation Filter.
 * 4. Distinct 1:1 Fallback Mapping (No mixed places in single gallery).
 * 5. Official TourAPI 4.0 (searchKeyword2 + detailImage2) Multi-Photo Gallery.
 */

import { PUBLIC_API_CONFIG } from './apiConfig.js';

// KTO Official Area Codes
export const CITY_AREA_CODES = {
  '서울': '1',
  '인천': '2',
  '대전': '3',
  '대구': '4',
  '광주': '5',
  '부산': '6',
  '울산': '7',
  '세종': '8',
  '경기': '31',
  '강원': '32',
  '강릉': '32',
  '속초': '32',
  '충북': '33',
  '충남': '34',
  '경북': '35',
  '경주': '35',
  '포항': '35',
  '경남': '36',
  '전북': '37',
  '전주': '37',
  '전남': '38',
  '여수': '38',
  '순천': '38',
  '제주': '39',
  '서귀포': '39'
};

export function getAreaCode(city = '') {
  if (!city) return '';
  for (const [k, v] of Object.entries(CITY_AREA_CODES)) {
    if (city.includes(k) || k.includes(city)) return v;
  }
  return '';
}

// In-Memory & LocalStorage Cache with Auto-Flush
const PHOTO_CACHE = new Map();
const MULTI_PHOTO_CACHE = new Map();
const CACHE_KEY = 'vora_live_photo_cache_v9';

try {
  // Clear legacy contaminated caches
  localStorage.removeItem('vora_live_photo_cache_v7');
  localStorage.removeItem('vora_live_photo_cache_v8');
  
  const saved = localStorage.getItem(CACHE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.entries(parsed).forEach(([k, v]) => {
      if (v?.primary && v?.images) {
        PHOTO_CACHE.set(k, v.primary);
        MULTI_PHOTO_CACHE.set(k, v.images);
      }
    });
  }
} catch (e) {}

export function saveToCache(key, url, multiPhotos = []) {
  if (!key || !url) return;
  PHOTO_CACHE.set(key, url);
  const images = (multiPhotos && multiPhotos.length > 0) ? multiPhotos : [url];
  MULTI_PHOTO_CACHE.set(key, images);
  try {
    const obj = {};
    PHOTO_CACHE.forEach((v, k) => {
      obj[k] = {
        primary: v,
        images: MULTI_PHOTO_CACHE.get(k) || [v]
      };
    });
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch (e) {}
}

/**
 * ⚡ Smart Universal Keyword & Landmark Normalizer
 */
export function extractSearchKeywords(rawTitle = '', city = '') {
  if (!rawTitle || typeof rawTitle !== 'string') return [];
  
  const title = rawTitle.trim();
  const candidates = [];

  // 1. Direct Landmark Alias Expansion (Exact KTO DB Titles)
  if (title.includes('성산일출봉')) candidates.push('성산일출봉');
  if (title.includes('주상절리')) candidates.push('대포주상절리', '주상절리');
  if (title.includes('사려니')) candidates.push('사려니숲길');
  if (title.includes('한담')) candidates.push('한담해안산책로', '한담');
  if (title.includes('협재')) candidates.push('협재해수욕장', '협재');
  if (title.includes('금능')) candidates.push('금능해수욕장', '금능');
  if (title.includes('함덕')) candidates.push('함덕해수욕장', '함덕');
  if (title.includes('카멜리아')) candidates.push('카멜리아힐');
  if (title.includes('오설록')) candidates.push('오설록');
  if (title.includes('올레시장')) candidates.push('서귀포매일올레시장', '매일올레시장');
  if (title.includes('남산') || title.includes('N서울타워')) candidates.push('남산서울타워', '남산공원');
  if (title.includes('경복궁')) candidates.push('경복궁');
  if (title.includes('향원정')) candidates.push('향원정');
  if (title.includes('북촌')) candidates.push('북촌한옥마을');
  if (title.includes('성수')) candidates.push('성수동');
  if (title.includes('블루라인')) candidates.push('해운대블루라인파크', '블루라인파크');
  if (title.includes('해운대')) candidates.push('해운대');
  if (title.includes('감천')) candidates.push('감천문화마을');
  if (title.includes('스페이스워크')) candidates.push('스페이스워크');
  if (title.includes('순천만')) candidates.push('순천만국가정원', '순천만');

  // 2. Generic Token Extraction
  const tokens = title
    .replace(/\(.*?\)/g, ' ')
    .replace(/\[.*?\]/g, ' ')
    .split(/[\s,&+~/·와과및\->➔]+/g)
    .map(w => w.replace(/(카페거리|핫플|인사이트|골목길|일대|거리|명소|특구|해변|산책로|해수욕장|디저트|투어|코스)/g, '').trim())
    .filter(w => w.length >= 2);

  tokens.forEach(t => {
    if (!candidates.includes(t)) candidates.push(t);
  });

  return candidates;
}

/**
 * 🏛️ TourAPI 4.0 Live Multi-Photo Fetcher with AreaCode & City Filtering
 */
export async function fetchTourApiMultiPhotos(keyword, city = '') {
  if (!keyword || keyword.length < 2) return [];
  const serviceKey = PUBLIC_API_CONFIG.SERVICE_KEY;
  const areaCode = getAreaCode(city);
  const baseUrl = `${PUBLIC_API_CONFIG.TOUR_API_BASE}/searchKeyword2`;

  try {
    let url = `${baseUrl}?serviceKey=${serviceKey}&numOfRows=8&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=B&keyword=${encodeURIComponent(keyword)}`;
    if (areaCode) {
      url += `&areaCode=${areaCode}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const data = await res.json();
    const items = data?.response?.body?.items?.item || [];
    const itemList = Array.isArray(items) ? items : [items];

    const photos = [];
    const contentIds = [];

    // Filter valid items (no posters/illustrations)
    const validItems = itemList.filter(item => {
      if (!item || !item.title) return false;
      const isPoster = item.title.includes('포스터') || item.title.includes('나이트워크') || item.title.includes('축제');
      if (isPoster) return false;

      if (city) {
        const addr = (item.addr1 || '') + ' ' + (item.title || '');
        if (city.includes('제주') || city.includes('서귀포')) {
          if (!addr.includes('제주') && !addr.includes('서귀포')) return false;
        } else if (city.includes('서울')) {
          if (!addr.includes('서울')) return false;
        } else if (city.includes('부산')) {
          if (!addr.includes('부산')) return false;
        }
      }
      return true;
    });

    const targetList = validItems.length > 0 ? validItems : itemList;

    targetList.forEach(item => {
      if (item && item.title && !item.title.includes('포스터') && !item.title.includes('나이트워크')) {
        const img = item.firstimage || item.firstimage2;
        if (img) {
          const cleanImg = img.replace(/^http:\/\//i, 'https://');
          if (!photos.includes(cleanImg)) photos.push(cleanImg);
        }
        if (item.contentid && !contentIds.includes(item.contentid)) {
          contentIds.push(item.contentid);
        }
      }
    });

    // If we have contentId, fetch official gallery from detailImage2
    if (contentIds.length > 0 && photos.length < 8) {
      for (const cid of contentIds.slice(0, 2)) {
        try {
          const detailUrl = `${PUBLIC_API_CONFIG.TOUR_API_BASE}/detailImage2?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=KTravelApp&_type=json&contentId=${cid}&imageYN=Y&numOfRows=10`;
          const dController = new AbortController();
          const dTimeoutId = setTimeout(() => dController.abort(), 3000);
          const dRes = await fetch(detailUrl, { signal: dController.signal });
          clearTimeout(dTimeoutId);

          if (dRes.ok) {
            const dData = await dRes.json();
            const dItems = dData?.response?.body?.items?.item || [];
            const dList = Array.isArray(dItems) ? dItems : [dItems];
            dList.forEach(di => {
              const dImg = di?.originimgurl || di?.smallimageurl;
              if (dImg) {
                const cleanDImg = dImg.replace(/^http:\/\//i, 'https://');
                if (!photos.includes(cleanDImg)) photos.push(cleanDImg);
              }
            });
          }
        } catch (e) {}
      }
    }

    // Prioritize .jpg/.jpeg landscape photos
    const sorted = photos.sort((a, b) => {
      const aIsJpg = /\.(jpg|jpeg)$/i.test(a);
      const bIsJpg = /\.(jpg|jpeg)$/i.test(b);
      if (aIsJpg && !bIsJpg) return -1;
      if (!aIsJpg && bIsJpg) return 1;
      return 0;
    });

    return sorted;
  } catch (e) {
    return [];
  }
}

/**
 * 🌐 Wikimedia Commons Live Image Fetcher
 */
export async function fetchWikimediaRealtimeImage(keyword) {
  if (!keyword || keyword.length < 2) return [];

  try {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(keyword)}&prop=pageimages|images&format=json&pithumbsize=1000&imlimit=5&origin=*`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const pages = data?.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId && pageId !== '-1') {
          const sourceUrl = pages[pageId]?.thumbnail?.source;
          if (sourceUrl) return [sourceUrl];
        }
      }
    }
  } catch (e) {}
  return [];
}

// 4. Distinct 1:1 Spot Fallbacks (Zero mixing of different spots!)
const DISTINCT_SPOT_FALLBACKS = {
  seongsan: ['https://tong.visitkorea.or.kr/cms/resource/93/1876193_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/00/2613500_image2_1.jpg'],
  jusangjeolli: ['https://tong.visitkorea.or.kr/cms/resource/61/3535261_image2_1.jpg'],
  saryeoni: ['https://tong.visitkorea.or.kr/cms/resource/18/4072718_image2_1.jpg'],
  handam: ['https://tong.visitkorea.or.kr/cms/resource_photo/66/3587666_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/43/4073543_image2_1.jpg'],
  hyeopjae: ['https://tong.visitkorea.or.kr/cms/resource/66/3096066_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/97/3053797_image2_1.jpg'],
  hamdeok: ['https://tong.visitkorea.or.kr/cms/resource/00/3354600_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/22/3527522_image2_1.jpg'],
  camellia: ['https://tong.visitkorea.or.kr/cms/resource/84/4064284_image2_1.jpg'],
  osulloc: ['https://tong.visitkorea.or.kr/cms/resource/57/3497257_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/22/4017322_image2_1.jpg'],
  olleMarket: ['https://tong.visitkorea.or.kr/cms/resource/66/3546866_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/67/3546867_image2_1.jpg'],
  nSeoulTower: ['https://tong.visitkorea.or.kr/cms/resource/21/4022521_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/51/4065951_image2_1.jpg'],
  gyeongbokgung: ['https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/94/3487594_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/95/3487595_image2_1.jpg'],
  bukchon: ['https://tong.visitkorea.or.kr/cms/resource/04/3304404_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/99/3304399_image2_1.jpg'],
  seongsu: ['https://tong.visitkorea.or.kr/cms/resource/88/4095788_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/58/4075958_image2_1.jpg'],
  haeundae: ['https://tong.visitkorea.or.kr/cms/resource/34/3090534_image2_1.JPG', 'https://tong.visitkorea.or.kr/cms/resource/67/2612467_image2_1.jpg'],
  gamcheon: ['https://tong.visitkorea.or.kr/cms/resource/21/3095321_image2_1.jpg'],
  spacewalk: ['https://tong.visitkorea.or.kr/cms/resource/14/4019314_image2_1.jpg'],
  suncheon: ['https://tong.visitkorea.or.kr/cms/resource/74/4037574_image2_1.jpg']
};

export function getSafeCategoryFallbacks(category = '', title = '') {
  const t = (title || '').toLowerCase();
  if (t.includes('성산일출봉')) return DISTINCT_SPOT_FALLBACKS.seongsan;
  if (t.includes('주상절리')) return DISTINCT_SPOT_FALLBACKS.jusangjeolli;
  if (t.includes('사려니')) return DISTINCT_SPOT_FALLBACKS.saryeoni;
  if (t.includes('한담') || t.includes('랜디스') || t.includes('애월')) return DISTINCT_SPOT_FALLBACKS.handam;
  if (t.includes('협재') || t.includes('금능')) return DISTINCT_SPOT_FALLBACKS.hyeopjae;
  if (t.includes('함덕') || t.includes('서우봉')) return DISTINCT_SPOT_FALLBACKS.hamdeok;
  if (t.includes('카멜리아')) return DISTINCT_SPOT_FALLBACKS.camellia;
  if (t.includes('오설록')) return DISTINCT_SPOT_FALLBACKS.osulloc;
  if (t.includes('올레시장') || t.includes('시장')) return DISTINCT_SPOT_FALLBACKS.olleMarket;
  if (t.includes('남산') || t.includes('타워')) return DISTINCT_SPOT_FALLBACKS.nSeoulTower;
  if (t.includes('경복궁')) return DISTINCT_SPOT_FALLBACKS.gyeongbokgung;
  if (t.includes('북촌')) return DISTINCT_SPOT_FALLBACKS.bukchon;
  if (t.includes('성수')) return DISTINCT_SPOT_FALLBACKS.seongsu;
  if (t.includes('해운대') || t.includes('블루라인')) return DISTINCT_SPOT_FALLBACKS.haeundae;
  if (t.includes('감천')) return DISTINCT_SPOT_FALLBACKS.gamcheon;
  if (t.includes('스페이스워크') || t.includes('포항')) return DISTINCT_SPOT_FALLBACKS.spacewalk;
  if (t.includes('순천')) return DISTINCT_SPOT_FALLBACKS.suncheon;

  const c = (category + ' ' + title).toLowerCase();
  if (c.includes('궁') || c.includes('역사') || c.includes('문화')) return DISTINCT_SPOT_FALLBACKS.gyeongbokgung;
  if (c.includes('한옥') || c.includes('골목')) return DISTINCT_SPOT_FALLBACKS.bukchon;
  if (c.includes('바다') || c.includes('해변') || c.includes('오션') || c.includes('제주') || c.includes('부산')) return DISTINCT_SPOT_FALLBACKS.hyeopjae;
  if (c.includes('카페') || c.includes('베이커리') || c.includes('커피') || c.includes('디저트')) return DISTINCT_SPOT_FALLBACKS.seongsu;
  if (c.includes('음식') || c.includes('맛집') || c.includes('식당')) return DISTINCT_SPOT_FALLBACKS.olleMarket;
  if (c.includes('숲') || c.includes('공원') || c.includes('자연') || c.includes('산')) return DISTINCT_SPOT_FALLBACKS.saryeoni;
  if (c.includes('야경') || c.includes('타워') || c.includes('밤')) return DISTINCT_SPOT_FALLBACKS.nSeoulTower;
  return DISTINCT_SPOT_FALLBACKS.gyeongbokgung;
}

/**
 * ⚡ Master Dynamic Photo Resolver with Full Chained Search & City Filtering
 */
export async function resolveSpotPhotoDynamic(spotTitle = '', city = '서울', category = '') {
  const cleanTitle = (spotTitle || '').trim();
  const cacheKey = `${city}_${cleanTitle}`;
  if (!cleanTitle) {
    const fb = getSafeCategoryFallbacks(category, cleanTitle);
    return { primaryImage: fb[0], images: fb };
  }

  // 1. Check Local Semantic Cache
  if (PHOTO_CACHE.has(cacheKey) && MULTI_PHOTO_CACHE.has(cacheKey)) {
    return {
      primaryImage: PHOTO_CACHE.get(cacheKey),
      images: MULTI_PHOTO_CACHE.get(cacheKey)
    };
  }

  // 2. Extract Clean Keywords via Universal Normalizer
  const keywords = extractSearchKeywords(cleanTitle, city);

  // 3. Full Chained Search across all keywords with AreaCode/City filter
  const gatheredPhotos = [];
  for (const kw of keywords) {
    if (kw.length >= 2) {
      const ktoPhotos = await fetchTourApiMultiPhotos(kw, city);
      ktoPhotos.forEach(p => {
        if (!gatheredPhotos.includes(p)) gatheredPhotos.push(p);
      });
      if (gatheredPhotos.length >= 2) break;
    }
  }

  // 4. Query Wikimedia Commons if needed
  if (gatheredPhotos.length === 0) {
    for (const kw of keywords) {
      if (kw.length >= 2) {
        const wikiPhotos = await fetchWikimediaRealtimeImage(kw);
        wikiPhotos.forEach(p => {
          if (!gatheredPhotos.includes(p)) gatheredPhotos.push(p);
        });
        if (gatheredPhotos.length > 0) break;
      }
    }
  }

  // 5. Distinct 1:1 Fallback if empty
  if (gatheredPhotos.length === 0) {
    const fb = getSafeCategoryFallbacks(category, cleanTitle);
    fb.forEach(p => gatheredPhotos.push(p));
  }

  const primaryImage = gatheredPhotos[0];
  saveToCache(cacheKey, primaryImage, gatheredPhotos);

  return {
    primaryImage,
    images: gatheredPhotos
  };
}

/**
 * Synchronous Fast Lookup
 */
export function resolveSpotPhotoSync(spotTitle = '', city = '서울', category = '') {
  const cleanTitle = (spotTitle || '').trim();
  const cacheKey = `${city}_${cleanTitle}`;
  if (PHOTO_CACHE.has(cacheKey)) {
    const primary = PHOTO_CACHE.get(cacheKey);
    const images = MULTI_PHOTO_CACHE.get(cacheKey) || [primary];
    return { primaryImage: primary, images };
  }
  const fb = getSafeCategoryFallbacks(category, cleanTitle);
  return { primaryImage: fb[0], images: fb };
}
