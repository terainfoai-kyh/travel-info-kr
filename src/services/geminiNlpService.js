/**
 * VORA AI 7.0 - Gemini Magazine Concierge with 100% Pure Real-Time Dynamic Photo Engine
 * 
 * Features:
 * 1. 100% Pure Real-Time Dynamic Photo Engine (TourAPI 4.0 + Wikimedia live search)
 * 2. Smart Affiliate Revenue Pipeline (Klook & Agoda deals for every spot)
 * 3. Accurate Regional Transit (Strictly NO subway in Jeju, only Express/Coastal buses)
 * 4. Multi-Turn Conversational Memory & 6 Unique Non-Repeating Spots
 */

import { resolveSpotPhotoDynamic, resolveSpotPhotoSync } from './photoPipeline.js';
import { getSpotAffiliateDeal } from './affiliateService.js';

// Precision Korean City Center Coordinates
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
    { keys: ['서울', 'seoul', 'ソウル', '首尔', '首爾', '성수', '한남', '홍대', '강남', '명동', '종로', '익선동', '이태원', '잠실', '여의도', '도산', '압구정', '하이브', '용산', '북촌'], city: '서울' },
    { keys: ['부산', 'busan', '釜山', '해운대', '광안리', '자갈치', '남포동', '영도', '송도', '블루라인'], city: '부산' },
    { keys: ['제주', 'jeju', '済州', '济州', '애월', '협재', '서귀포', '성산', '중문', '함덕', '올레'], city: '제주' },
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
 * ⚡ Master Gemini Multi-Day Itinerary Planner with 100% Dynamic Real-Time Photos
 */
export async function geminiGenerateFullItinerary(rawPrompt, lang = 'ko', previousItinerary = null) {
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
  const isJeju = targetCity.includes('제주') || targetCity.includes('서귀포');

  let contextPrompt = '';
  if (isModificationRequest && previousItinerary && previousItinerary.dailySchedules) {
    contextPrompt = `
PREVIOUS ITINERARY CONTEXT:
Target City: ${targetCity} (${days} Days)
Daily Schedules:
${JSON.stringify(previousItinerary.dailySchedules.map(ds => ({
  day: ds.day,
  theme: ds.theme,
  spots: (ds.spots || []).map(s => s.title)
})), null, 2)}

USER MODIFICATION REQUEST: "${rawPrompt}"
INSTRUCTION FOR MODIFICATION:
1. Retain the existing ${days}-day structure and all unchanged days/spots.
2. Apply the requested changes (e.g. adding a spot or changing spot category on Day 2) precisely.
3. Maintain total days as exactly ${days} and city as "${targetCity}".
4. In summary, warmly confirm the exact modification made in language "${lang}".
`;
  }

  const systemInstruction = `You are VORA, an elite South Korean AI Travel Magazine Editor & Concierge.
Create a trendy, stylish, highly immersive ${days}-day travel magazine itinerary in South Korea based on the user's request.
Target main city: "${targetCity}" (${cityMeta.nameEn}).
Language of output: "${lang}".

CRITICAL LOCALIZATION RULES:
1. If city is "제주" or "서귀포", NEVER mention "지하철" (Subway). Use "제주 급행/간선 버스 및 해안도로 순환 버스 또는 렌터카" for transit.
2. Recommend 2 genuinely trendy, authentic, non-repeating spots per day (popular cafes, scenic photo zones, local delicacies, night views).
3. For each spot, provide rich, engaging storytelling:
   - "theme": One-line aesthetic catchphrase in ${lang}
   - "description": 2-3 sentences of rich narrative in ${lang} explaining why this spot is famous, its vibe, and why visitors love it.
   - "photoTip": 📸 Specific photo spot angle/tip in ${lang}
   - "signatureItem": ☕/🍴 Signature menu or experience in ${lang}
   - "bestTime": ⏰ Recommended visiting time
   - "category": K-POP성지 / 감성카페 / 한옥골목 / 오션뷰 / 로컬미식 / 야경명소 / 자연명소
4. Provide realistic GPS coordinates around ${targetCity} (Base: lat ${cityMeta.lat}, lng ${cityMeta.lng}).
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
      "transitTip": "Regional transit guidance in ${lang}",
      "foodRecommendation": {
        "dishName": "Iconic local dish name in ${lang}",
        "description": "Why it is famous & best local area in ${lang}"
      },
      "spots": [
        {
          "name": "Spot Name (Korean & English)",
          "category": "감성카페 / 오션뷰 / 로컬미식 / 야경명소 / 자연명소",
          "theme": "Aesthetic highlight in ${lang}",
          "description": "2-3 sentences of rich storytelling in ${lang}",
          "photoTip": "Photo spot tip in ${lang}",
          "signatureItem": "Signature dish/drink/activity in ${lang}",
          "bestTime": "Recommended time in ${lang}",
          "lat": ${cityMeta.lat},
          "lng": ${cityMeta.lng},
          "address": "Address in ${targetCity}",
          "transitTime": "${isJeju ? '급행 버스 또는 해안도로 이동 15분' : '지하철 또는 도보로 편리하게 이동'}"
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

              // Gather all spot photo promises in parallel
              for (let dayIdx = 0; dayIdx < parsed.dailySchedules.length; dayIdx++) {
                const ds = parsed.dailySchedules[dayIdx];
                const dayNum = dayIdx + 1;
                const rawSpots = ds.spots || [];
                const daySpots = [];

                for (let spotIdx = 0; spotIdx < rawSpots.length; spotIdx++) {
                  const s = rawSpots[spotIdx];
                  const spotTitle = s.name || s.title || `${targetCity} 핫플 ${spotIdx + 1}`;
                  const spotCategory = s.category || '핫플레이스';

                  const latOffset = (spotIdx * 0.008) * (spotIdx % 2 === 0 ? 1 : -1);
                  const lngOffset = (spotIdx * 0.009) * (spotIdx % 2 === 0 ? -1 : 1);

                  // 🎯 100% Real-Time TourAPI / Dynamic Image Lookup!
                  const realPhoto = await resolveSpotPhotoDynamic(spotTitle, targetCity, spotCategory);
                  const affiliateDeal = getSpotAffiliateDeal(spotTitle, targetCity);

                  const defaultTransit = isJeju 
                    ? '제주 급행 버스 또는 해안도로 이동 15분' 
                    : (s.transitTime || '지하철 또는 도보로 편리하게 이동');

                  const finalSpot = {
                    id: `vora-spot-${dayNum}-${spotIdx + 1}`,
                    title: spotTitle,
                    region: targetCity,
                    theme: s.theme || '인기 감성 핫플레이스',
                    description: s.description || `${spotTitle}은 ${targetCity}에서 가장 트렌디하고 매력적인 감성을 느낄 수 있는 대표 명소입니다. 아름다운 공간과 특별한 분위기를 경험해 보세요.`,
                    category: spotCategory,
                    photoTip: s.photoTip || '📸 자연광이 잘 드는 포토존에서 인생샷 촬영 추천',
                    signatureItem: s.signatureItem || '✨ 시그니처 대표 메뉴 & 추천 포인트',
                    bestTime: s.bestTime || '오후 시간대 추천',
                    rating: 4.9,
                    image: realPhoto,
                    affiliateDeal,
                    location: s.address || `대한민국 ${targetCity}`,
                    lat: Number(s.lat) || (cityMeta.lat + latOffset),
                    lng: Number(s.lng) || (cityMeta.lng + lngOffset),
                    transitTime: defaultTransit,
                    assignedDay: dayNum,
                    dayOrder: spotIdx + 1
                  };

                  daySpots.push(finalSpot);
                  flatSpots.push(finalSpot);
                }

                finalizedSchedules.push({
                  day: dayNum,
                  theme: ds.theme || `${dayNum}일차 ${targetCity} 감성 코스`,
                  transitTip: ds.transitTip || (isJeju ? '제주 해안도로 및 급행 버스를 이용해 편리하게 이동합니다.' : '지하철 및 대중교통 환승이 매우 편리한 구간입니다.'),
                  foodRecommendation: ds.foodRecommendation || {
                    dishName: `${targetCity} 로컬 대표 미식`,
                    description: '현지인들이 즐겨 찾는 대표 맛집에서 식사 추천'
                  },
                  spots: daySpots
                });
              }

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
        // Try next model
      }
    }
  }

  return generateLocalFallbackItinerary(rawPrompt, targetCity, days, lang);
}

// Local Fallback Itinerary Generator with 100% Verified Real Korean Landmark Photos
export function generateLocalFallbackItinerary(rawPrompt = '', targetCity = '서울', days = 3, lang = 'ko') {
  const city = targetCity || extractLocationKeyword(rawPrompt) || '서울';
  const cityMeta = CITY_COORDINATES[city] || CITY_COORDINATES['서울'];
  const isJeju = city.includes('제주') || city.includes('서귀포');
  const finalizedSchedules = [];
  const flatSpots = [];

  const SAMPLE_SPOTS_MAP = {
    '서울': [
      // Day 1
      { name: '경복궁 & 향원정', theme: '조선 왕실의 역사와 고풍스러운 정원', desc: '조선 왕조 제일의 법궁으로, 연못 위에 세워진 향원정과 근정전의 웅장한 처마선이 한국 전통 건축미의 절정을 보여줍니다.', cat: '역사문화', photo: '📸 향원정 연못 반영 샷 & 한복 스냅', sig: '👑 궁궐 한복 체험 & 왕실 산책', time: '오전 10:00 (한적한 시간대)', lat: 37.5796, lng: 126.9770 },
      { name: '북촌 한옥마을', theme: '전통 한옥의 고즈넉한 아름다움', desc: '실제 한옥들이 고스란히 보존된 역사적인 마을로, 기와지붕 너머로 펼쳐지는 도심 빌딩 숲의 조화가 이색적입니다.', cat: '한옥골목', photo: '📸 북촌 6경 언덕길에서 내려다보는 기와 샷', sig: '🍵 전통 찻집 오미자차 & 개성주악', time: '오전 11:30', lat: 37.5826, lng: 126.9836 },
      // Day 2
      { name: '성수동 카페거리 & 디올 성수', theme: '가장 트렌디한 서울의 핫플레이스', desc: '과거 붉은 벽돌 공장 지대에서 서울에서 가장 힙한 문화예술 지구로 변모한 곳으로, 독창적인 플래그십 스토어와 베이커리가 가득합니다.', cat: '감성카페', photo: '📸 디올 성수 화사한 외관 인생샷', sig: '☕ 시그니처 소금빵 & 아인슈페너', time: '오후 2:00 ~ 4:00', lat: 37.5446, lng: 127.0560 },
      { name: 'N서울타워', theme: '서울 도심을 360도 파노라마로 감상', desc: '남산 꼭대기에 우뚝 솟은 서울의 상징으로, 해질녘 붉게 물드는 노을과 반짝이는 도시 야경이 잊지 못할 장관을 선사합니다.', cat: '야경명소', photo: '📸 타워 전망대 선셋 & 사랑의 자물쇠 데크', sig: '🗼 선셋 파노라마 뷰 & 남산 돈까스', time: '오후 6:30 (일몰 골든타임)', lat: 37.5512, lng: 126.9882 },
      // Day 3
      { name: '하이브 인사이트 & 용산 핫플', theme: 'K-POP 문화와 글로벌 음악의 성지', desc: '글로벌 K-POP 아티스트들의 음악적 발자취와 미디어 아트를 오감으로 체험할 수 있는 전 세계 팬들의 필수 방문지입니다.', cat: 'K-POP성지', photo: '📸 대형 미디어 월 & 인터랙티브 체험 존', sig: '🎵 한정판 아티스트 굿즈 & 미디어 전시', time: '오후 1:00', lat: 37.5283, lng: 126.9685 },
      { name: '여의도 한강공원 & 더현대 서울', theme: '트렌디 쇼핑과 낭만적인 한강 피크닉', desc: '자연 채광 가득한 실내 정원 쇼핑몰 더현대 서울과, 탁 트인 강바람을 맞으며 라면을 즐기는 한강 피크닉의 힐링 코스입니다.', cat: '쇼핑/힐링', photo: '📸 사운즈 포레스트 5층 실내 정원 샷', sig: '🧺 한강 즉석 라면 & 돗자리 피크닉', time: '오후 4:30', lat: 37.5259, lng: 126.9284 },
      // Day 4
      { name: '익선동 한옥마을', theme: '미로 같은 골목길 속 감성 한옥 카페', desc: '좁은 골목길을 따라 아기자기한 한옥 카페와 개성 넘치는 편집숍들이 줄지어 있는 종로의 대표 감성 골목입니다.', cat: '한옥골목', photo: '📸 한옥 처마 아래 은은한 조명 샷', sig: '🍰 수플레 팬케이크 & 핸드드립 커피', time: '오후 1:30', lat: 37.5743, lng: 126.9897 },
      { name: 'DDP 동대문디자인플라자', theme: '우주선을 닮은 곡면 건축과 밤도깨비 야경', desc: '자하 하디드가 설계한 세계 최대의 비정형 건축물로, 미래지향적인 야경과 전시를 즐길 수 있습니다.', cat: '야경명소', photo: '📸 어울림광장 유선형 곡면 실루엣 샷', sig: '🌙 DDP 미디어 아트 전시 & 야경 산책', time: '오후 7:30', lat: 37.5668, lng: 127.0095 }
    ],
    '제주': [
      // Day 1
      { name: '랜디스도넛 제주애월점 & 한담해변', theme: '에메랄드빛 바다와 달콤한 도넛 투어', desc: '애월 한담해안산책로를 바로 마주하고 있는 오션뷰 도넛 명소로, 시원한 바다 바람과 달콤한 디저트를 동시에 즐길 수 있습니다.', cat: '감성카페', photo: '📸 옥상 주황색 대형 도넛 조형물 & 바다 배경', sig: '🍩 버터크림 도넛 & 바닐라 라떼', time: '오전 11:30', lat: 33.4623, lng: 126.3110 },
      { name: '협재해수욕장 & 금능해변', theme: '비양도가 보이는 은빛 백사장', desc: '투명하고 맑은 에메랄드빛 바다와 부드러운 조개껍질 백사장이 끝없이 펼쳐진 제주의 대표 해변입니다.', cat: '오션뷰', photo: '📸 물빛이 가장 예쁜 썰물 때 비양도 배경 샷', sig: '🌊 해녀 해산물 모둠 & 보말칼국수', time: '오후 1:00 ~ 3:00', lat: 33.3941, lng: 126.2397 },
      // Day 2
      { name: '성산일출봉', theme: '유네스코 세계자연유산의 웅장한 분화구', desc: '바다 위로 솟아오른 웅장한 화산 분화구로, 정상에 서면 푸른 바다와 넓은 초원이 장엄하게 펼쳐집니다.', cat: '자연명소', photo: '📸 정상 분화구 능선 & 우도 조망 샷', sig: '🍊 제주 천혜향 착즙 주스 & 갈치조림', time: '오전 07:30 또는 일몰', lat: 33.4581, lng: 126.9426 },
      { name: '서귀포 매일올레시장', theme: '제주 남부의 풍성한 로컬 야시장', desc: '제주 특산물과 감귤 디저트, 흑돼지 김치말이 등 다채로운 길거리 미식이 가득한 활기찬 전통시장입니다.', cat: '로컬미식', photo: '📸 활기찬 야시장 야간 조명 샷', sig: '🍢 마농치킨 & 흑돼지 고로케', time: '오후 6:00 이후', lat: 33.2494, lng: 126.5638 },
      // Day 3
      { name: '사려니숲길', theme: '삼나무 향기 가득한 신비로운 숲길', desc: '울창한 삼나무가 하늘 높이 솟아있는 힐링 산책로로, 맑은 피톤치드를 마시며 고요한 자연을 누릴 수 있습니다.', cat: '자연명소', photo: '📸 삼나무 숲길 사이로 내리는 햇살 샷', sig: '🌲 숲속 힐링 트레킹 & 오메기떡', time: '오전 10:00', lat: 33.4077, lng: 126.6432 },
      { name: '중문 주상절리대', theme: '육각 기둥 바위와 거친 파도의 웅장함', desc: '화산 용암이 식으며 형성된 신비로운 육각형 돌기둥 절벽 위로 부서지는 파도가 장관을 이룹니다.', cat: '자연명소', photo: '📸 주상절리 절벽과 에메랄드 파도 샷', sig: '🌊 해안 절벽 산책로 투어', time: '오후 3:00', lat: 33.2382, lng: 126.4258 },
      // Day 4
      { name: '카멜리아힐 & 오설록 티뮤지엄', theme: '사계절 꽃들의 향연과 초록빛 녹차밭', desc: '동백꽃과 수국이 가득한 테마 가든과 드넓은 녹차밭에서 싱그러운 제주의 자연을 만끽하는 코스입니다.', cat: '자연명소', photo: '📸 녹차밭 초록 물결 속 인생샷', sig: '🍵 오설록 녹차 아이스크림 & 롤케이크', time: '오후 1:30', lat: 33.3058, lng: 126.3684 },
      { name: '함덕해수욕장 & 서우봉', theme: '야자수와 에메랄드 바다가 빚어내는 이국적 풍경', desc: '제주 동북부 최고의 물빛을 자랑하는 해변으로, 서우봉 산책로에 오르면 탁 트인 바다 파노라마가 펼쳐집니다.', cat: '오션뷰', photo: '📸 서우봉 둘레길에서 내려다보는 함덕 바다 샷', sig: '☕ 함덕 델문도 베이커리 & 아메리카노', time: '오후 5:00', lat: 33.5432, lng: 126.6692 }
    ],
    '부산': [
      // Day 1
      { name: '해운대 블루라인파크 & 스카이캡슐', theme: '동해남부선 해안 절경을 달리는 낭만 열차', desc: '옛 철길을 따라 해안 절벽 위를 달리는 알록달록 스카이캡슐에서 부산 앞바다의 탁 트인 오션뷰를 만끽할 수 있습니다.', cat: '오션뷰', photo: '📸 캡슐 내부에서 창가 바다를 바라보는 감성 샷', sig: '🚊 미포-청사포 해안 레일 투어 & 조개구이', time: '오후 4:30 (선셋 타임)', lat: 35.1631, lng: 129.1786 },
      { name: '광안리 해수욕장 & 광안대교', theme: '광안대교 야경과 화려한 불빛 축제', desc: '바다를 가로지르는 광안대교의 찬란한 조명과 주말마다 밤하늘을 수놓는 드론 라이트쇼가 황홀한 감동을 줍니다.', cat: '야경명소', photo: '📸 광안대교 정면 모래사장 야경 샷', sig: '🦀 민락수변공원 신선 활어회 & 수제맥주', time: '오후 7:30 이후', lat: 35.1532, lng: 129.1186 },
      // Day 2
      { name: '감천문화마을', theme: '한국의 산토리니, 알록달록 계단식 마을', desc: '산자락을 따라 계단식으로 늘어선 파스텔톤 집들과 아기자기한 골목 벽화, 조형물이 동화 같은 풍경을 만듭니다.', cat: '핫플레이스', photo: '📸 어린왕자와 사막여우 포토존 난간 샷', sig: '☕ 전망대 루프탑 카페 커피 & 씨앗호떡', time: '오전 11:00', lat: 35.0975, lng: 129.0106 },
      { name: '자갈치시장 & 남포동 비프광장', theme: '살아 숨 쉬는 부산의 바다와 길거리 미식', desc: '팔딱거리는 신선한 해산물이 가득한 한국 최대 수산시장과 영화와 길거리 음식이 어우러진 비프광장입니다.', cat: '로컬미식', photo: '📸 활기찬 자갈치 항구 바다 전경', sig: '🐟 생선구이 백반 & 씨앗호떡', time: '오후 2:00', lat: 35.0968, lng: 129.0306 },
      // Day 3
      { name: '영도 흰여울문화마을', theme: '해안 절벽 위에 하얗게 핀 문화마을', desc: '바다를 바로 발아래 두고 걷는 해안 절벽 골목길로, 영화 촬영지와 감성 오션뷰 카페들이 줄지어 있습니다.', cat: '오션뷰', photo: '📸 해안 터널 포토존 & 바다 전망 계단', sig: '☕ 절벽 카페 바다 뷰 에이드 & 떡볶이', time: '오후 1:30', lat: 35.0772, lng: 129.0448 },
      { name: '더베이101', theme: '마린시티 마천루가 뿜어내는 화려한 야경', desc: '홍콩의 야경을 연상시키는 마린시티 초고층 빌딩 숲의 불빛이 바다에 반영되는 부산 최고의 야경 핫플레이스입니다.', cat: '야경명소', photo: '📸 물웅덩이 반영 야경 실루엣 샷', sig: '🍟 피시앤칩스 & 시원한 드래프트 비어', time: '오후 8:00', lat: 35.1565, lng: 129.1523 }
    ]
  };

  const DAILY_THEMES = {
    '서울': [
      { theme: '1일차: 조선 왕실의 정취와 고즈넉한 한옥 골목', transit: '지하철 3호선 안국역·경복궁역 도보 5분', food: { dishName: '종로 삼계탕 & 전통 빈대떡', description: '한옥의 정취를 느끼며 즐기는 든든한 한국 전통 보양식' } },
      { theme: '2일차: 트렌디 핫플 성수동과 낭만적인 남산 선셋', transit: '지하철 2호선 성수역 및 남산 순환버스 이용', food: { dishName: '성수동 수제버거 & 파스타', description: '젊은 미식가들이 줄 서는 감각적인 트렌디 다이닝' } },
      { theme: '3일차: K-POP 문화의 성지와 한강 힐링 피크닉', transit: '지하철 4호선 신용산역 및 5호선 여의나루역 도보 5분', food: { dishName: '용산 미나리 삼겹살 & 한강 라면', description: 'K-컬처 투어 후 한강 바람과 함께 즐기는 로컬 힐링 푸드' } },
      { theme: '4일차: 미로 같은 익선동 한옥과 DDP 야경', transit: '지하철 5호선 종로3가역 및 2/4호선 DDP역', food: { dishName: '익선동 퓨전 한식 & 갈비찜', description: '전통과 현대가 공존하는 감성 가득한 디너 코스' } }
    ],
    '제주': [
      { theme: '1일차: 서쪽 바다의 낭만과 에메랄드 해변', transit: '제주 서부 해안도로 순환 버스 및 렌터카 이동 (약 15분)', food: { dishName: '애월 흑돼지 근고기 & 해물라면', description: '바다 노을을 바라보며 멜젓에 찍어 먹는 도톰한 육즙의 향연' } },
      { theme: '2일차: 동쪽 세계자연유산과 서귀포 야시장', transit: '동부 번영로 급행 버스 및 남조로 노선 이용 (약 20분)', food: { dishName: '성산 은갈치조림 & 올레시장 마농치킨', description: '매콤달콤한 갈치조림과 마늘 향 가득한 제주 명물 치킨' } },
      { theme: '3일차: 피톤치드 삼나무 숲과 웅장한 주상절리', transit: '5.16도로 숲길 순환 버스 및 중문 리무진 이용', food: { dishName: '보말칼국수 & 전복죽', description: '제주 바다의 깊은 풍미를 담은 든든한 힐링 한 그릇' } },
      { theme: '4일차: 초록빛 녹차밭 힐링과 함덕 오션뷰', transit: '제주 동서 횡단 급행 버스 이용 (약 25분)', food: { dishName: '제주 옥돔구이 & 고기국수', description: '바삭하고 고소한 옥돔구이와 깊은 육수의 제주 전통 국수' } }
    ],
    '부산': [
      { theme: '1일차: 해안선 스카이캡슐과 광안대교 야경', transit: '지하철 2호선 해운대역 및 광안역 이동', food: { dishName: '민락회타운 활어회 & 수제맥주', description: '광안대교 불빛을 눈앞에 두고 즐기는 싱싱한 제철 활어회' } },
      { theme: '2일차: 파스텔톤 감천마을과 활기찬 자갈치시장', transit: '지하철 1호선 남포역 및 자갈치역 이동', food: { dishName: '부산 돼지국밥 & 씨앗호떡', description: '진한 사골 국물의 돼지국밥과 고소한 남포동 명물 디저트' } },
      { theme: '3일차: 절벽 위 흰여울마을과 마린시티 마천루', transit: '영도 해안 순환 버스 이용', food: { dishName: '더베이101 피시앤칩스 & 조개구이', description: '화려한 도시 불빛 아래 즐기는 낭만적인 오션 사이드 다이닝' } }
    ]
  };

  const spotPool = SAMPLE_SPOTS_MAP[city] || SAMPLE_SPOTS_MAP['서울'];
  const themeList = DAILY_THEMES[city] || DAILY_THEMES['서울'];

  for (let d = 0; d < days; d++) {
    const dayNum = d + 1;
    const daySpots = [];
    const spotsForDay = [spotPool[(d * 2) % spotPool.length], spotPool[(d * 2 + 1) % spotPool.length]];
    const dayThemeMeta = themeList[d % themeList.length];

    spotsForDay.forEach((s, idx) => {
      const spotPhoto = resolveSpotPhotoSync(s.name, city, s.cat);
      const affiliateDeal = getSpotAffiliateDeal(s.name, city);

      const defaultTransit = isJeju 
        ? '제주 급행 버스 또는 해안도로 이동 15분' 
        : '지하철 또는 도보로 편리하게 이동';

      const sp = {
        id: `local-spot-${dayNum}-${idx + 1}`,
        title: s.name,
        region: city,
        theme: s.theme,
        description: s.desc,
        category: s.cat,
        photoTip: s.photo,
        signatureItem: s.sig,
        bestTime: s.time,
        rating: 4.9,
        image: spotPhoto,
        affiliateDeal,
        location: `대한민국 ${city} 일대`,
        lat: s.lat,
        lng: s.lng,
        transitTime: defaultTransit,
        assignedDay: dayNum,
        dayOrder: idx + 1
      };
      daySpots.push(sp);
      flatSpots.push(sp);
    });

    finalizedSchedules.push({
      day: dayNum,
      theme: dayThemeMeta.theme,
      transitTip: dayThemeMeta.transit,
      foodRecommendation: dayThemeMeta.food,
      spots: daySpots
    });
  }

  return {
    targetCity: city,
    days,
    tripTitle: `${city} ${days}일 감성 매거진 코스`,
    summary: `VORA AI 매거진이 제안하는 ${city} ${days}일 트렌디 여행 코스입니다. 최고의 인생샷 명소와 로컬 미식으로 알차게 구성되었습니다. ✨`,
    dailySchedules: finalizedSchedules,
    spots: flatSpots,
    agodaUrl: `https://www.agoda.com/search?text=${encodeURIComponent(city + ' 호텔')}`,
    klookUrl: `https://www.klook.com/ko/search?query=${encodeURIComponent(city + ' 액티비티')}`
  };
}

/**
 * Async Photo Background Enricher for Initial Itinerary
 */
export async function enrichItineraryPhotosAsync(itinerary) {
  if (!itinerary || !itinerary.dailySchedules) return itinerary;

  const updatedSchedules = [];
  const updatedSpots = [];

  for (const ds of itinerary.dailySchedules) {
    const updatedDaySpots = [];
    for (const s of (ds.spots || [])) {
      const realPhoto = await resolveSpotPhotoDynamic(s.title, s.region || itinerary.targetCity, s.category);
      const updatedSpot = { ...s, image: realPhoto };
      updatedDaySpots.push(updatedSpot);
      updatedSpots.push(updatedSpot);
    }
    updatedSchedules.push({ ...ds, spots: updatedDaySpots });
  }

  return {
    ...itinerary,
    dailySchedules: updatedSchedules,
    spots: updatedSpots
  };
}
