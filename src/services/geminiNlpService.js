/**
 * VORA AI 3.0 - Gemini-First Intelligent Multi-Day Travel Magazine Engine
 * Features:
 * 1. Plan B High-Resolution Curated K-Travel Photo Library (zero dull/missing images)
 * 2. Magazine Editorial Intelligence: Photo tips (📸), Signature menus/items (☕/🍴), and transit guidance
 * 3. Precision City Coordinates & Route Directions (Google Maps Platform)
 * 4. Multi-Turn Conversational Memory (preserves multi-day plan when refining)
 */

import { getCuratedSpotImage } from '../data/curatedImages';

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

export function sanitizeGeminiOutput(text) {
  if (!text || typeof text !== 'string') return '';
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return match[0];
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
 * ⚡ Master Gemini Multi-Day Itinerary Planner with Plan B Magazine Editorial Engine
 */
export async function geminiGenerateFullItinerary(rawPrompt, lang = 'ko', previousItinerary = null) {
  // Check if this is an incremental modification request
  const isModificationRequest = previousItinerary && (
    /(추가|변경|바꿔|수정|빼줘|대신|넣어|바꿔줘|일정 수정|2일차|1일차|3일차|4일차|5일차|식당으로|맛집으로|카페로|실내로)/i.test(rawPrompt) &&
    !/(1박\s*2일|2박\s*3일|3박\s*4일|4박\s*5일|새로운\s*여행|다른\s*도시)/i.test(rawPrompt)
  );

  let targetCity = '서울';
  let days = 3;

  if (isModificationRequest && previousItinerary) {
    targetCity = previousItinerary.targetCity || extractLocationKeyword(rawPrompt);
    days = previousItinerary.days || (previousItinerary.dailySchedules ? previousItinerary.dailySchedules.length : 3);
  } else {
    targetCity = extractLocationKeyword(rawPrompt);
    if (/(5일|4박\s*5일|5박|5d|5\s*days)/i.test(rawPrompt)) days = 5;
    else if (/(4일|3박\s*4일|4박|4d|4\s*days)/i.test(rawPrompt)) days = 4;
    else if (/(3일|2박\s*3일|3박|3d|3\s*days)/i.test(rawPrompt)) days = 3;
    else if (/(2일|1박\s*2일|2박|2d|2\s*days)/i.test(rawPrompt)) days = 2;
    else if (/(1일|당일|1박|1d|1\s*day)/i.test(rawPrompt)) days = 1;
    else if (previousItinerary && previousItinerary.days) days = previousItinerary.days;
  }

  const cityMeta = CITY_COORDINATES[targetCity] || CITY_COORDINATES['서울'];

  let contextPrompt = '';
  if (isModificationRequest && previousItinerary && previousItinerary.dailySchedules) {
    contextPrompt = `
PREVIOUS ITINERARY CONTEXT (User already has this ${days}-day plan):
Target City: ${targetCity} (${days} Days)
Daily Schedules:
${JSON.stringify(previousItinerary.dailySchedules.map(ds => ({
  day: ds.day,
  theme: ds.theme,
  spots: (ds.spots || []).map(s => s.title || s.name)
})), null, 2)}

USER MODIFICATION REQUEST: "${rawPrompt}"
CRITICAL INSTRUCTION FOR MODIFICATION:
1. Retain the existing ${days}-day structure and all unchanged days/spots.
2. Apply the requested changes (e.g. adding a food/cafe stop or changing spot category on Day 2) precisely.
3. Maintain total days as exactly ${days} and city as "${targetCity}".
4. In summary, warmly confirm the exact modification made in language "${lang}".
`;
  }

  const systemInstruction = `You are VORA, an elite South Korean AI Travel Magazine Editor & Concierge.
Create a trendy, stylish, highly practical ${days}-day travel magazine itinerary in South Korea based on the user's request.
Target main city: "${targetCity}" (${cityMeta.nameEn}).
Language of output: "${lang}".

EDITORIAL MAGAZINE RULES:
1. Recommend 2 to 3 genuinely trendy, authentic, and famous spots per day (popular cafes, scenic photo zones, local delicacies, night views).
2. For each spot, write an aesthetic highlight "theme", an essential photo tip "photoTip" (e.g. "📸 Sunset terrace view"), and a signature recommendation "signatureItem" (e.g. "☕ Cream Croffle & Einspanner").
3. Provide realistic GPS coordinates around ${targetCity} (Base: lat ${cityMeta.lat}, lng ${cityMeta.lng}).
4. Include transit guidance (e.g. "🚇 Subway Line 2, 7 mins walk") and iconic local dishes.
5. In summary, write an inspiring, warm concierge narrative in language "${lang}".

Return ONLY valid JSON matching this exact schema:
{
  "tripTitle": "Catchy Magazine Title in ${lang}",
  "targetCity": "${targetCity}",
  "days": ${days},
  "summary": "Warm editorial overview in ${lang}",
  "dailySchedules": [
    {
      "day": 1,
      "theme": "Day 1 Theme in ${lang}",
      "transitTip": "Public transit or walking guidance in ${lang}",
      "foodRecommendation": {
        "dishName": "Iconic local dish name in ${lang}",
        "description": "Why it is famous & best local area in ${lang}"
      },
      "spots": [
        {
          "name": "Spot Name (Korean & English)",
          "category": "감성카페 / 오션뷰 / 야경명소 / 로컬맛집 / 핫플레이스 / 역사문화",
          "theme": "Aesthetic highlight in ${lang}",
          "photoTip": "Photo spot tip in ${lang}",
          "signatureItem": "Signature dish/drink/activity in ${lang}",
          "lat": ${cityMeta.lat},
          "lng": ${cityMeta.lng},
          "address": "Address in ${targetCity}",
          "transitTime": "e.g. 도보 5분 / 지하철 10분"
        }
      ]
    }
  ]
}`;

  const promptText = contextPrompt 
    ? `${contextPrompt}\n\nLanguage: ${lang}. Return updated JSON.` 
    : `User Request: "${rawPrompt}". Target city: ${targetCity}, duration: ${days} days, language: ${lang}. Create a vibrant, trendy itinerary.`;

  const candidateKeys = GEMINI_KEY_POOL;
  const modelCandidates = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-3.1-flash-lite'];

  for (const apiKey of candidateKeys) {
    for (const model of modelCandidates) {
      try {
        const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

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
            let parsed = null;
            try {
              parsed = JSON.parse(cleanText);
            } catch (jsonErr) {
              const match = rawText.match(/\{[\s\S]*\}/);
              if (match) {
                try { parsed = JSON.parse(match[0]); } catch (e) {}
              }
            }

            if (parsed && parsed.dailySchedules && Array.isArray(parsed.dailySchedules)) {
              const flatSpots = [];
              const finalizedSchedules = [];

              parsed.dailySchedules.forEach((ds, dayIdx) => {
                const dayNum = dayIdx + 1;
                const rawSpots = ds.spots || [];
                const daySpots = [];

                rawSpots.forEach((s, spotIdx) => {
                  const spotTitle = s.name || s.title || `${targetCity} 핫플 ${spotIdx + 1}`;
                  const spotCategory = s.category || '핫플레이스';

                  // Small geographic jitter if coordinates are identical
                  const latOffset = (spotIdx * 0.008) * (spotIdx % 2 === 0 ? 1 : -1);
                  const lngOffset = (spotIdx * 0.009) * (spotIdx % 2 === 0 ? -1 : 1);

                  // 🎨 Plan B: Curated High-Res Vibrant Photo Mapping (Zero blank/dull images)
                  const curatedImage = getCuratedSpotImage(spotTitle, targetCity, spotCategory, spotIdx);

                  const finalSpot = {
                    id: `vora-spot-${dayNum}-${spotIdx + 1}`,
                    title: spotTitle,
                    region: targetCity,
                    theme: s.theme || '인기 감성 핫플레이스',
                    category: spotCategory,
                    photoTip: s.photoTip || '📸 자연광이 잘 드는 포토존에서 인생샷 촬영 추천',
                    signatureItem: s.signatureItem || '✨ 시그니처 대표 메뉴 & 추천 포인트',
                    rating: 4.9,
                    image: curatedImage,
                    location: s.address || `대한민국 ${targetCity}`,
                    lat: Number(s.lat) || (cityMeta.lat + latOffset),
                    lng: Number(s.lng) || (cityMeta.lng + lngOffset),
                    transitTime: s.transitTime || '도보 또는 지하철 이동',
                    assignedDay: dayNum,
                    dayOrder: spotIdx + 1
                  };

                  daySpots.push(finalSpot);
                  flatSpots.push(finalSpot);
                });

                finalizedSchedules.push({
                  day: dayNum,
                  theme: ds.theme || `${dayNum}일차 ${targetCity} 감성 코스`,
                  transitTip: ds.transitTip || '지하철 및 대중교통 환승이 매우 편리한 구간입니다.',
                  foodRecommendation: ds.foodRecommendation || {
                    dishName: `${targetCity} 로컬 대표 미식`,
                    description: '현지인들이 즐겨 찾는 대표 맛집에서 식사 추천'
                  },
                  spots: daySpots
                });
              });

              return {
                targetCity,
                days: parsed.days || days,
                tripTitle: parsed.tripTitle || `${targetCity} ${days}일 감성 매거진 코스`,
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
        // Try next model or key
      }
    }
  }

  // Guaranteed instant 0-second local fallback itinerary
  return generateLocalFallbackItinerary(rawPrompt, targetCity, days, lang);
}

// Local Fallback Itinerary Generator (Guarantees 100% 200 OK Uptime with Plan B Curated Visuals)
export function generateLocalFallbackItinerary(rawPrompt = '', targetCity = '서울', days = 3, lang = 'ko') {
  const city = targetCity || extractLocationKeyword(rawPrompt) || '서울';
  const cityMeta = CITY_COORDINATES[city] || CITY_COORDINATES['서울'];
  const finalizedSchedules = [];
  const flatSpots = [];

  const SAMPLE_SPOTS_MAP = {
    '서울': [
      { name: '경복궁 & 향원정', theme: '조선 왕실의 역사와 고풍스러운 정원', cat: '역사문화', photo: '📸 경회루 연못 반영 샷 추천', sig: '👑 한복 대여 & 왕실 정원 산책', lat: 37.5796, lng: 126.9770 },
      { name: '성수동 카페거리 & 디올 성수', theme: '가장 트렌디한 서울의 핫플레이스', cat: '감성카페', photo: '📸 디올 성수 외관 인생샷', sig: '☕ 시그니처 소금빵 & 아인슈페너', lat: 37.5446, lng: 127.0560 },
      { name: 'N서울타워 & 남산 야경', theme: '서울 도심을 360도 파노라마로 감상', cat: '야경명소', photo: '📸 전망대 야경 파노라마', sig: '🗼 사랑의 자물쇠 & 선셋 뷰', lat: 37.5512, lng: 126.9882 },
      { name: '북촌한옥마을 & 삼청동길', theme: '고즈넉한 한옥 골목길 산책', cat: '감성골목', photo: '📸 북촌 6경 골목길 전경', sig: '🍵 전통 찻집 오미자차 & 약과', lat: 37.5826, lng: 126.9836 },
      { name: '더현대 서울 & 여의도 한강공원', theme: '트렌디 쇼핑과 한강 피크닉', cat: '쇼핑/힐링', photo: '📸 사운즈 포레스트 실내 정원', sig: '🧺 한강 라면 & 텐트 피크닉', lat: 37.5259, lng: 126.9284 }
    ],
    '제주': [
      { name: '랜디스도넛 제주애월점 & 한담해변', theme: '에메랄드빛 바다와 달콤한 도넛 투어', cat: '감성카페', photo: '📸 주황색 도넛 조형물 & 바다 배경', sig: '🍩 버터크림 도넛 & 바닐라 라떼', lat: 33.4623, lng: 126.3110 },
      { name: '협재해수욕장 & 금능해변', theme: '비양도가 보이는 은빛 백사장', cat: '오션뷰', photo: '📸 에메랄드 물빛 백사장 샷', sig: '🌊 해녀 해산물 모둠 & 보말칼국수', lat: 33.3941, lng: 126.2397 },
      { name: '성산일출봉', theme: '유네스코 세계자연유산의 웅장한 분화구', cat: '자연명소', photo: '📸 정상 분화구 파노라마', sig: '🍊 제주 천혜향 주스 & 갈치조림', lat: 33.4581, lng: 126.9426 },
      { name: '서귀포 매일올레시장', theme: '제주 로컬 먹거리와 감귤 디저트', cat: '로컬미식', photo: '📸 올레시장 야시장 활기', sig: '🍢 마농치킨 & 흑돼지 김치말이', lat: 33.2494, lng: 126.5638 }
    ],
    '부산': [
      { name: '해운대 블루라인파크 (스카이캡슐)', theme: '동해남부선 해안 절경을 달리는 낭만 열차', cat: '오션뷰', photo: '📸 알록달록 스카이캡슐 창가 샷', sig: '🚊 미포-청사포 해안 레일 투어', lat: 35.1631, lng: 129.1786 },
      { name: '광안리 해수욕장 & 드론 라이트쇼', theme: '광안대교 야경과 화려한 드론 쇼', cat: '야경명소', photo: '📸 광안대교 점등 오션뷰 샷', sig: '🦀 민락수변공원 활어회 & 생맥주', lat: 35.1532, lng: 129.1186 },
      { name: '감천문화마을', theme: '알록달록 파스텔톤 계단식 마을', cat: '핫플레이스', photo: '📸 어린왕자와 사막여우 포토존', sig: '☕ 계단식 루프탑 카페 뷰', lat: 35.0975, lng: 129.0106 }
    ]
  };

  const spotPool = SAMPLE_SPOTS_MAP[city] || SAMPLE_SPOTS_MAP['서울'];

  for (let d = 0; d < days; d++) {
    const dayNum = d + 1;
    const daySpots = [];
    const spotsForDay = [spotPool[(d * 2) % spotPool.length], spotPool[(d * 2 + 1) % spotPool.length]];

    spotsForDay.forEach((s, idx) => {
      const sp = {
        id: `local-spot-${dayNum}-${idx + 1}`,
        title: s.name,
        region: city,
        theme: s.theme,
        category: s.cat,
        photoTip: s.photo || '📸 자연광이 예쁜 포토존 촬영 추천',
        signatureItem: s.sig || '☕ 대표 시그니처 메뉴 추천',
        rating: 4.9,
        image: getCuratedSpotImage(s.name, city, s.cat, idx),
        location: `대한민국 ${city} 일대`,
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
      theme: `${dayNum}일차 ${city} 감성 매거진 코스`,
      transitTip: '지하철 및 대중교통으로 환승 없이 10분 내 이동 가능합니다.',
      foodRecommendation: {
        dishName: `${city} 대표 미식`,
        description: '현지 로컬 감성을 그대로 느낄 수 있는 추천 요리'
      },
      spots: daySpots
    });
  }

  return {
    targetCity: city,
    days,
    tripTitle: `${city} ${days}일 감성 매거진 코스`,
    summary: `VORA AI 매거진이 제안하는 ${city} ${days}일 트렌디 여행 코스입니다. 가장 인기 있는 핫플레이스와 인생샷 명소로 구성되었습니다. ✨`,
    dailySchedules: finalizedSchedules,
    spots: flatSpots,
    agodaUrl: `https://www.agoda.com/search?text=${encodeURIComponent(city + ' 호텔')}`,
    klookUrl: `https://www.klook.com/ko/search?query=${encodeURIComponent(city + ' 액티비티')}`
  };
}
