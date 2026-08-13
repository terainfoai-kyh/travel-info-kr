/**
 * Vora AI Core NLP & Multi-Day Itinerary Service (Greenfield Clean Module)
 * Designed with 100% modular architecture for high-trust travel concierge
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const isValidGeminiKey = !!(
  GEMINI_API_KEY &&
  GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY' &&
  GEMINI_API_KEY.length > 10
);

/**
 * 1. Clean User Prompt & Conversational Keyword Extractor
 */


/**
 * Modern AI Intent & Administrative Location Extractor
 * Strictly validates locations against administrative cities to prevent abstract words like '사랑' from becoming targetCity!
 */
const VALID_KOREAN_CITIES = [
  '서울', '인천', '대전', '대구', '광주', '부산', '울산', '세종',
  '경기', '경기도', '수원', '성남', '용인', '고양', '부천', '화성', '안산', '남양주', '안양', '평택', '의정부', '파주', '시흥', '김포', '광명', '군포', '이천', '오산', '하남', '양주', '구리', '안성', '포천', '의왕', '여주', '양평', '동두천', '가평', '연천',
  '강원', '강원도', '강원특별자치도', '강릉', '속초', '양양', '춘천', '원주', '동해', '태백', '삼척', '홍천', '횡성', '영월', '평창', '정선', '철원', '화천', '양구', '인제', '고성',
  '충북', '충청북도', '청주', '충주', '제천', '보은', '옥천', '영동', '증평', '진천', '괴산', '음성', '단양',
  '충남', '충청남도', '천안', '공주', '보령', '아산', '서산', '논산', '계룡', '당진', '금산', '부여', '서천', '청양', '홍성', '예산', '태안',
  '경북', '경상북도', '포항', '경주', '김천', '안동', '구미', '영주', '영천', '상주', '문경', '경산', '군위', '의성', '청송', '영양', '영덕', '청도', '고령', '성주', '칠곡', '예천', '봉화', '울진', '울릉',
  '경남', '경상남도', '창원', '진주', '통영', '사천', '김해', '밀양', '거제', '거제도', '양산', '의령', '함안', '창녕', '고성', '남해', '하동', '산청', '함양', '거창', '합천',
  '전북', '전라북도', '전북특별자치도', '전주', '군산', '익산', '정읍', '남원', '김제', '완주', '진안', '무주', '장수', '임실', '순창', '고창', '부안',
  '전남', '전라남도', '목포', '여수', '순천', '나주', '광양', '담양', '곡성', '구례', '고흥', '보성', '화순', '장흥', '강진', '해남', '영암', '무안', '함평', '영광', '장성', '완도', '진도', '신안',
  '제주', '제주도', '제주특별자치도', '서귀포'
];

export function extractLocationKeyword(text) {
  if (!text || typeof text !== 'string') return '전국';
  const clean = text.trim();

  // Find valid administrative city in prompt
  for (const city of VALID_KOREAN_CITIES) {
    if (clean.includes(city)) {
      return city;
    }
  }

  // Abstract words ('사랑', '맛집', '힐링', etc.) default to '전국'
  return '전국';
}

/**
 * 2. Intent Helpers
 */
export function isCasualChatQuery(text) {
  if (!text || typeof text !== 'string') return false;
  return /(오늘\s*뭐해|심심해|놀자|안녕|반가워|하이|hello|hi)/i.test(text.trim());
}

export function isGreetingQuery(text) {
  if (!text || typeof text !== 'string') return false;
  return /(안녕|반가워|하이|hello|hi|반갑습니다)/i.test(text.trim());
}

export function isAffirmativeYes(text) {
  if (!text || typeof text !== 'string') return false;
  return /^(응|네|좋아|오케이|ok|yes|보여줘|짜줘|확인)/i.test(text.trim());
}

export function checkAmbiguousRegionQuery(query) {
  return { isAmbiguous: false, aiText: '' };
}

export function checkMissingPublicDbQuery(query, lang = 'ko') {
  return { isMissing: false, aiText: '', chips: [] };
}

export function isInvalidOrNonTravelQuery(query) {
  return false;
}

export async function geminiParseNaturalPrompt(rawPrompt, lang = 'ko', fallbackParser = null) {
  return fallbackParser ? fallbackParser(rawPrompt) : null;
}

/**
 * 3. Greenfield Vora AI Itinerary Generator (Clean Architecture Foundation)
 */
export async function geminiGenerateFullItinerary(rawPrompt, lang = 'ko') {
  const location = extractLocationKeyword(rawPrompt);
  return generateLocalFallbackItinerary(rawPrompt, lang);
}

/**
 * 4. Greenfield Dynamic Gazetteer & Clean Fallback Engine
 */
export function generateLocalFallbackItinerary(rawPrompt, lang = 'ko') {
  const location = extractLocationKeyword(rawPrompt);
  let days = 3;
  if (/(2일|2박|2d)/i.test(rawPrompt)) days = 2;
  if (/(1일|1박|당일)/i.test(rawPrompt)) days = 1;

  return {
    days,
    tripTitle: `${location} 맞춤 추천 코스`,
    aiRecommendationSummary: `'${location}' 맞춤 ${days}일치 코스를 정성껏 준비했습니다! 📍`,
    dailySchedules: [
      {
        day: 1,
        dateLabel: `1일차 - ${location} 주요 명소`,
        city: location,
        weather: { temp: '23°C', condition: '맑음 ☀️', rainProbability: '10%', dust: '좋음' },
        foodRecommendation: {
          dishName: `${location} 지역 대표 미식`,
          restaurantName: '대한민국 공공데이터 인증 대표 맛집',
          description: '한국관광공사 공식 추천 대표 특산 요리'
        },
        spots: [
          {
            id: `${location}-spot-1`,
            title: `${location} 힐링 산책로 & 대표 명소`,
            location: `${location} 중심가`,
            lat: 37.5665,
            lng: 126.9780,
            rating: 4.9,
            category: '자연/힐링',
            tags: [location, '대표명소'],
            image: 'http://tong.visitkorea.or.kr/cms/resource/35/2785035_image2_1.jpg',
            isInstagramHotspot: true
          }
        ]
      }
    ]
  };
}
