/**
 * VORA AI 3.0 - Gemini-First Intelligent Multi-Day Itinerary Engine
 * Generates rich, realistic travel itineraries with accurate GPS coordinates,
 * geographic clustering (no bouncing map starting points), transit tips, and local food guides.
 */

import { fetchPinpointLandmarkSpots } from './tourApi';

// Precision Korean City Center Coordinates (Prevents 0,0 or Suwon coordinate bouncing)
export const CITY_COORDINATES = {
  '서울': { lat: 37.5665, lng: 126.9780, nameEn: 'Seoul' },
  '부산': { lat: 35.1796, lng: 129.0756, nameEn: 'Busan' },
  '제주': { lat: 33.4996, lng: 126.5312, nameEn: 'Jeju' },
  '서귀포': { lat: 33.2541, lng: 126.5601, nameEn: 'Seogwipo' },
  '경주': { lat: 35.8562, lng: 129.2247, nameEn: 'Gyeongju' },
  '강릉': { lat: 37.7519, lng: 128.8761, nameEn: 'Gangneung' },
  '전주': { lat: 35.8242, lng: 127.1480, nameEn: 'Jeonju' },
  '여수': { lat: 34.7604, lng: 127.6622, nameEn: 'Yeosu' },
  '속초': { lat: 38.2070, lng: 128.5918, nameEn: 'Sokcho' },
  '거제': { lat: 34.8806, lng: 128.6211, nameEn: 'Geoje' },
  '수원': { lat: 37.2636, lng: 127.0286, nameEn: 'Suwon' },
  '인천': { lat: 37.4563, lng: 126.7052, nameEn: 'Incheon' },
  '대구': { lat: 35.8714, lng: 128.6014, nameEn: 'Daegu' },
  '대전': { lat: 36.3504, lng: 127.3845, nameEn: 'Daejeon' },
  '광주': { lat: 35.1595, lng: 126.8526, nameEn: 'Gwangju' },
  '울산': { lat: 35.5384, lng: 129.3114, nameEn: 'Ulsan' },
  '가평': { lat: 37.8315, lng: 127.5096, nameEn: 'Gapyeong' },
  '춘천': { lat: 37.8813, lng: 127.7298, nameEn: 'Chuncheon' },
  '안동': { lat: 36.5684, lng: 128.7294, nameEn: 'Andong' },
  '포항': { lat: 36.0190, lng: 129.3435, nameEn: 'Pohang' },
  '통영': { lat: 34.8544, lng: 128.4332, nameEn: 'Tongyeong' }
};

// Verified Gemini API Key Pool
export const GEMINI_KEY_POOL = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_FREE_KEY,
  import.meta.env.VITE_GEMINI_PAID_KEY,
  import.meta.env.VITE_GEMINI_KEY,
  'AQ.Ab8RN6KwKIdJmZ8x8OgJtXcdCFJnvw6lusi3ZiuWAwFLdqsexg',
  'AQ.Ab8RN6LhKxJi5EUjbuDedS3vLY8v5UFd6QnV4dCzQy2anZ9-QQ'
].filter(k => k && typeof k === 'string' && k.trim().length > 5);

export function getActiveGeminiKey() {
  return GEMINI_KEY_POOL[0] || 'AQ.Ab8RN6KwKIdJmZ8x8OgJtXcdCFJnvw6lusi3ZiuWAwFLdqsexg';
}

export function sanitizeGeminiOutput(text) {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/```json/gi, '').replace(/```/g, '').trim();
}

// Extract City Keyword from raw text
export function extractLocationKeyword(text) {
  if (!text || typeof text !== 'string') return '서울';
  const clean = text.toLowerCase();

  const CITY_MAP = [
    { keys: ['서울', 'seoul', 'ソウル', '首尔', '首爾', '성수', '한남', '홍대', '강남', '명동', '종로', '익선동', '이태원', '잠실', '여의도'], city: '서울' },
    { keys: ['부산', 'busan', '釜山', '해운대', '광안리', '자갈치', '남포동', '영도', '송도'], city: '부산' },
    { keys: ['제주', 'jeju', '済州', '济州', '애월', '협재', '서귀포', '성산', '중문', '함덕'], city: '제주' },
    { keys: ['경주', 'gyeongju', '慶州', '황리단길', '불국사', '보문', '첨성대', '동궁과월지'], city: '경주' },
    { keys: ['강릉', 'gangneung', '江陵', '안목', '경포대', '초당', '주문진', '정동진'], city: '강릉' },
    { keys: ['전주', 'jeonju', '全州', '한옥마을', '객리단길'], city: '전주' },
    { keys: ['여수', 'yeosu', '麗水', '돌산', '오동도', '낭만포차', '해상케이블카'], city: '여수' },
    { keys: ['속초', 'sokcho', '束草', '설악산', '아바이마을', '중앙시장', '동명항'], city: '속초' },
    { keys: ['거제', 'geoje', '巨済', '바람의언덕', '매미성', '외도', '구조라'], city: '거제' },
    { keys: ['수원', 'suwon', '水原', '행궁동', '화성행궁', '광교', '방화수류정'], city: '수원' },
    { keys: ['인천', 'incheon', '仁川', '송도', '차이나타운', '월미도', '개항장'], city: '인천' },
    { keys: ['가평', 'gapyeong', '남이섬', '자라섬', '아침고요수목원'], city: '가평' },
    { keys: ['춘천', 'chuncheon', '소양강', '닭갈비골목', '레고랜드'], city: '춘천' },
    { keys: ['안동', 'andong', '하회마을', '월영교', '도산서원'], city: '안동' },
    { keys: ['포항', 'pohang', '호미곶', '스페이스워크', '영일대'], city: '포항' },
    { keys: ['통영', 'tongyeong', '동피랑', '이순신공원', '디피랑'], city: '통영' }
  ];

  for (const item of CITY_MAP) {
    if (item.keys.some(k => clean.includes(k))) {
      return item.city;
    }
  }
  return '서울';
}

// Generate Google Maps Directions Full Day Route URL
export function generateGoogleMapsRouteUrl(spots = []) {
  if (!spots || spots.length === 0) return 'https://www.google.com/maps';
  if (spots.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spots[0].title + ' ' + (spots[0].region || ''))}`;
  }

  const origin = encodeURIComponent(spots[0].title + ' ' + (spots[0].region || ''));
  const destination = encodeURIComponent(spots[spots.length - 1].title + ' ' + (spots[spots.length - 1].region || ''));
  
  let waypointsParam = '';
  if (spots.length > 2) {
    const waypoints = spots.slice(1, spots.length - 1).map(s => encodeURIComponent(s.title + ' ' + (s.region || ''))).join('|');
    waypointsParam = `&waypoints=${waypoints}`;
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}&travelmode=transit`;
}

// Generate Individual Place Map Links
export function getGooglePlaceSearchUrl(spotTitle, city = '') {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spotTitle + ' ' + city)}`;
}

export function getKakaoMapSearchUrl(spotTitle, city = '') {
  return `https://map.kakao.com/link/search/${encodeURIComponent(spotTitle + ' ' + city)}`;
}

/**
 * ⚡ Master Gemini Multi-Day Itinerary Planner
 */
export async function geminiGenerateFullItinerary(rawPrompt, lang = 'ko', daysCount = 3) {
  const targetCity = extractLocationKeyword(rawPrompt);
  const cityMeta = CITY_COORDINATES[targetCity] || CITY_COORDINATES['서울'];

  let days = daysCount || 3;
  if (/(5일|4박\s*5일|5박|5d|5\s*days)/i.test(rawPrompt)) days = 5;
  else if (/(4일|3박\s*4일|4박|4d|4\s*days)/i.test(rawPrompt)) days = 4;
  else if (/(3일|2박\s*3일|3박|3d|3\s*days)/i.test(rawPrompt)) days = 3;
  else if (/(2일|1박\s*2일|2박|2d|2\s*days)/i.test(rawPrompt)) days = 2;
  else if (/(1일|당일|1박|1d|1\s*day)/i.test(rawPrompt)) days = 1;

  const systemInstruction = `You are VORA, an elite South Korean AI Travel Concierge.
Plan an engaging, authentic ${days}-day itinerary in South Korea based on the user's prompt.
Target main city: "${targetCity}" (${cityMeta.nameEn}).
Language of output: "${lang}".

CRITICAL ROUTE & GEOGRAPHIC PROXIMITY RULES:
1. Cluster spots geographically for each day so travelers can walk or take a quick subway/bus between spots (no zigzag cross-town traveling).
2. Recommend 2 to 3 authentic, iconic, or trendy spots per day (e.g. popular cafes, cultural landmarks, night views, local markets).
3. Provide realistic latitude and longitude around ${targetCity} (Base coordinates: lat ${cityMeta.lat}, lng ${cityMeta.lng}).
4. Include transit tips (e.g. "Subway Line 2, 8 mins", "5 min walk") and local food recommendations.
5. In summary, write a warm, friendly concierge narrative in language "${lang}" with clear day breakdowns.

Return ONLY valid JSON matching this exact schema:
{
  "tripTitle": "Engaging title in ${lang}",
  "targetCity": "${targetCity}",
  "days": ${days},
  "summary": "Warm concierge overview in ${lang} followed by day-by-day highlights",
  "dailySchedules": [
    {
      "day": 1,
      "theme": "Theme of Day 1 in ${lang}",
      "transitTip": "Public transit or walking guidance in ${lang}",
      "foodRecommendation": {
        "dishName": "Iconic local dish name in ${lang}",
        "description": "Why it is famous & best local area in ${lang}"
      },
      "spots": [
        {
          "name": "Spot Name (Korean & English)",
          "category": "Cafe / Landmark / Shopping / Nature / Culture",
          "theme": "Brief attraction highlight in ${lang}",
          "lat": ${cityMeta.lat},
          "lng": ${cityMeta.lng},
          "address": "Approximate address in ${targetCity}",
          "transitTime": "e.g. 5 min walk / 10 min subway"
        }
      ]
    }
  ]
}`;

  const promptText = `User Request: "${rawPrompt}". Target city: ${targetCity}, duration: ${days} days, language: ${lang}. Create a smooth, realistic, trendy itinerary.`;

  const candidateKeys = GEMINI_KEY_POOL;
  const modelName = 'gemini-3.1-flash-lite';

  for (const apiKey of candidateKeys) {
    try {
      const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\n${promptText}` }] }]
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleanText = sanitizeGeminiOutput(rawText);
          const parsed = JSON.parse(cleanText);

          if (parsed && parsed.dailySchedules && Array.isArray(parsed.dailySchedules)) {
            // Collect spot names for TourAPI high-res photo enrichment
            const allSpotNames = parsed.dailySchedules.flatMap(ds => (ds.spots || []).map(s => s.name || s.title)).filter(Boolean);
            const tourApiSpots = allSpotNames.length > 0
              ? await fetchPinpointLandmarkSpots(allSpotNames, lang, targetCity).catch(() => [])
              : [];

            const flatSpots = [];
            const finalizedSchedules = [];

            parsed.dailySchedules.forEach((ds, dayIdx) => {
              const dayNum = dayIdx + 1;
              const rawSpots = ds.spots || [];
              const daySpots = [];

              rawSpots.forEach((s, spotIdx) => {
                const spotTitle = s.name || s.title || `${targetCity} 명소 ${spotIdx + 1}`;
                const matchedTourSpot = tourApiSpots.find(ts => 
                  ts.title && (ts.title.includes(spotTitle) || spotTitle.includes(ts.title))
                );

                // Small geographic jitter if coordinates are identical to prevent marker stacking
                const latOffset = (spotIdx * 0.008) * (spotIdx % 2 === 0 ? 1 : -1);
                const lngOffset = (spotIdx * 0.009) * (spotIdx % 2 === 0 ? -1 : 1);

                const finalSpot = {
                  id: matchedTourSpot?.id || `vora-spot-${dayNum}-${spotIdx + 1}`,
                  contentId: matchedTourSpot?.contentId || null,
                  title: matchedTourSpot?.title || spotTitle,
                  region: targetCity,
                  theme: s.theme || s.category || '추천 명소',
                  category: s.category || '관광지',
                  rating: 4.9,
                  image: matchedTourSpot?.image || getFallbackCityImage(targetCity, spotIdx),
                  location: matchedTourSpot?.location || s.address || `대한민국 ${targetCity}`,
                  lat: Number(matchedTourSpot?.lat) || Number(s.lat) || (cityMeta.lat + latOffset),
                  lng: Number(matchedTourSpot?.lng) || Number(s.lng) || (cityMeta.lng + lngOffset),
                  transitTime: s.transitTime || '도보 또는 지하철 이동',
                  assignedDay: dayNum,
                  dayOrder: spotIdx + 1
                };

                daySpots.push(finalSpot);
                flatSpots.push(finalSpot);
              });

              finalizedSchedules.push({
                day: dayNum,
                theme: ds.theme || `${dayNum}일차 ${targetCity} 추천 코스`,
                transitTip: ds.transitTip || '지하철 및 버스 환승이 매우 편리한 구간입니다.',
                foodRecommendation: ds.foodRecommendation || {
                  dishName: `${targetCity} 로컬 대표 미식`,
                  description: '현지인들이 즐겨 찾는 대표 맛집 거리에서 식사 추천'
                },
                spots: daySpots
              });
            });

            return {
              targetCity,
              days: parsed.days || days,
              tripTitle: parsed.tripTitle || `${targetCity} ${days}일 맞춤 여행 코스`,
              summary: parsed.summary || `${targetCity}의 대표적인 핫플레이스와 감성 명소를 엄선한 맞춤 일정입니다. ✨`,
              dailySchedules: finalizedSchedules,
              spots: flatSpots,
              agodaUrl: `https://www.agoda.com/search?text=${encodeURIComponent(targetCity + ' 호텔')}`,
              klookUrl: `https://www.klook.com/ko/search?query=${encodeURIComponent(targetCity + ' 액티비티')}`
            };
          }
        }
      }
    } catch (e) {
      console.warn('[Gemini API Attempt]', e);
    }
  }

  // Fallback Local Generator in case of offline/network failure
  return generateLocalFallbackItinerary(rawPrompt, targetCity, days, lang);
}

// Authentic High-Quality Curated Korea Images for zero-blank rendering
export function getFallbackCityImage(city, index = 0) {
  const SEOUL_IMAGES = [
    'https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=800&q=80', // Gyeongbokgung
    'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80', // N Seoul Tower
    'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80', // Bukchon
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80'  // Han River
  ];

  const BUSAN_IMAGES = [
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80', // Haeundae
    'https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&w=800&q=80'  // Gamcheon
  ];

  const JEJU_IMAGES = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', // Ocean
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'  // Mountain
  ];

  if (city.includes('부산')) return BUSAN_IMAGES[index % BUSAN_IMAGES.length];
  if (city.includes('제주')) return JEJU_IMAGES[index % JEJU_IMAGES.length];
  return SEOUL_IMAGES[index % SEOUL_IMAGES.length];
}

// Local Fallback Itinerary Generator (Guarantees 100% 200 OK Uptime)
export function generateLocalFallbackItinerary(rawPrompt, targetCity = '서울', days = 3, lang = 'ko') {
  const cityMeta = CITY_COORDINATES[targetCity] || CITY_COORDINATES['서울'];
  const finalizedSchedules = [];
  const flatSpots = [];

  const SAMPLE_SPOTS_MAP = {
    '서울': [
      { name: '경복궁 & 국립민속박물관', theme: '조선 왕실의 역사와 전통미', cat: '역사문화', lat: 37.5796, lng: 126.9770 },
      { name: '성수동 카페거리 & 디올 성수', theme: '가장 트렌디한 서울의 핫플레이스', cat: '감성카페', lat: 37.5446, lng: 127.0560 },
      { name: 'N서울타워 & 남산 야경', theme: '서울 도심을 360도 파노라마로 감상', cat: '야경명소', lat: 37.5512, lng: 126.9882 },
      { name: '북촌한옥마을 & 삼청동길', theme: '고즈넉한 한옥 골목길 산책', cat: '힐링골목', lat: 37.5826, lng: 126.9836 },
      { name: '더현대 서울 & 여의도 한강공원', theme: '쇼핑과 피크닉을 동시에 즐기는 코스', cat: '쇼핑/힐링', lat: 37.5259, lng: 126.9284 },
      { name: '홍대 걷고싶은거리 & 연남동', theme: 'K-컬처와 버스킹, 젊음의 거리', cat: '젊음/문화', lat: 37.5575, lng: 126.9245 }
    ],
    '제주': [
      { name: '애월 한담해변 산책로', theme: '에메랄드빛 바다와 카페 투어', cat: '바다뷰', lat: 33.4623, lng: 126.3110 },
      { name: '협재해수욕장 & 금능해변', theme: '비양도가 보이는 은빛 백사장', cat: '자연힐링', lat: 33.3941, lng: 126.2397 },
      { name: '성산일출봉', theme: '유네스코 세계자연유산의 웅장한 분화구', cat: '세계유산', lat: 33.4581, lng: 126.9426 },
      { name: '서귀포 매일올레시장', theme: '제주 로컬 먹거리와 감귤 디저트', cat: '전통시장', lat: 33.2494, lng: 126.5638 }
    ],
    '부산': [
      { name: '해운대 블루라인파크 (해변열차)', theme: '동해남부선 해안 절경을 달리는 낭만 열차', cat: '해안관광', lat: 35.1631, lng: 129.1786 },
      { name: '광안리 해수욕장 & 드론쇼', theme: '광안대교 야경과 화려한 드론 라이트쇼', cat: '야경명소', lat: 35.1532, lng: 129.1186 },
      { name: '감천문화마을', theme: '알록달록 파스텔톤 계단식 마을', cat: '문화체험', lat: 35.0975, lng: 129.0106 },
      { name: '자갈치시장 & 남포동 BIFF거리', theme: '부산의 활기를 만끽하는 해산물 미식', cat: '미식투어', lat: 35.0968, lng: 129.0306 }
    ]
  };

  const spotPool = SAMPLE_SPOTS_MAP[targetCity] || SAMPLE_SPOTS_MAP['서울'];

  for (let d = 0; d < days; d++) {
    const dayNum = d + 1;
    const daySpots = [];
    const spotsForDay = [spotPool[(d * 2) % spotPool.length], spotPool[(d * 2 + 1) % spotPool.length]];

    spotsForDay.forEach((s, idx) => {
      const sp = {
        id: `local-spot-${dayNum}-${idx + 1}`,
        title: s.name,
        region: targetCity,
        theme: s.theme,
        category: s.cat,
        rating: 4.9,
        image: getFallbackCityImage(targetCity, idx),
        location: `대한민국 ${targetCity} 일대`,
        lat: s.lat,
        lng: s.lng,
        transitTime: '지하철 또는 도보로 편리하게 이동',
        assignedDay: dayNum,
        dayOrder: idx + 1
      };
      daySpots.push(sp);
      flatSpots.push(sp);
    });

    finalizedSchedules.push({
      day: dayNum,
      theme: `${dayNum}일차 ${targetCity} 핵심 힐링 투어`,
      transitTip: '지하철 2호선 및 대중교통으로 환승 없이 10분 내 이동 가능합니다.',
      foodRecommendation: {
        dishName: `${targetCity} 대표 미식`,
        description: '현지 로컬 감성을 그대로 느낄 수 있는 추천 요리'
      },
      spots: daySpots
    });
  }

  return {
    targetCity,
    days,
    tripTitle: `${targetCity} ${days}일 맞춤 여행 코스`,
    summary: `VORA AI가 제안하는 ${targetCity} ${days}일 여행 코스입니다. 가장 인기 있는 명소와 이동이 편리한 최적의 동선으로 구성되었습니다. ✨`,
    dailySchedules: finalizedSchedules,
    spots: flatSpots,
    agodaUrl: `https://www.agoda.com/search?text=${encodeURIComponent(targetCity + ' 호텔')}`,
    klookUrl: `https://www.klook.com/ko/search?query=${encodeURIComponent(targetCity + ' 액티비티')}`
  };
}
