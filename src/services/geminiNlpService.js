/**
 * Vora AI Core NLP & Official Google Generative AI SDK Integration Service
 * Uses official @google/generative-ai SDK with clean environment variable binding
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

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

export function getActiveGeminiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_FREE_KEY || '';
}

export function isValidGeminiKey() {
  const key = getActiveGeminiKey();
  return !!(key && key !== 'YOUR_GEMINI_API_KEY' && key.length > 5);
}

export function isCasualChatQuery(text) {
  if (!text || typeof text !== 'string') return false;
  return /(오늘\s*뭐해|심심해|놀자|안녕|반가워|하이|hello|hi|넌\s*누구|너\s*누구)/i.test(text.trim());
}

export function extractLocationKeyword(text) {
  if (!text || typeof text !== 'string') return '전국';
  const clean = text.trim();
  for (const city of VALID_KOREAN_CITIES) {
    if (clean.includes(city)) {
      return city;
    }
  }
  return '전국';
}

export function isGreetingQuery(text) {
  if (!text || typeof text !== 'string') return false;
  return /(안녕|반가워|하이|hello|hi|반갑습니다)/i.test(text.trim());
}

export function isAffirmativeYes(text) {
  if (!text || typeof text !== 'string') return false;
  return /^(응|네|좋아|오케이|ok|yes|보여줘|짜줘|확인)/i.test(text.trim());
}

/**
 * 100% Pure Official Google Generative AI SDK Concierge Generator
 */
export async function geminiGenerateFullItinerary(rawPrompt, lang = 'ko') {
  const targetCity = extractLocationKeyword(rawPrompt);
  let days = 3;
  if (/(2일|2박|2d)/i.test(rawPrompt)) days = 2;
  if (/(1일|1박|당일)/i.test(rawPrompt)) days = 1;
  if (/(4일|4박|4d)/i.test(rawPrompt)) days = 4;

  let theme = '힐링/자연';
  if (/(맛집|미식|먹방|음식)/i.test(rawPrompt)) theme = '미식/맛집';
  if (/(사랑|연인|커플|데이트|야경)/i.test(rawPrompt)) theme = '커플/데이트';
  if (/(역사|문화|유적|한옥)/i.test(rawPrompt)) theme = '역사/문화';
  if (/(카페|오션뷰|해변|바다)/i.test(rawPrompt)) theme = '오션뷰/카페';

  const apiKey = getActiveGeminiKey();
  let lastApiError = null;

  // Supported model candidates for @google/generative-ai SDK
  const candidateModelNames = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'];

  if (apiKey && apiKey.length > 5) {
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of candidateModelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const promptText = `You are Vora AI, an empathetic Korean Travel Concierge for global travelers. Answer prompt: '${rawPrompt}' in a warm, polite 1:1 conversational tone in Korean. Address user respectfully as '선배님'. Target city: ${targetCity}, duration: ${days} days, theme: ${theme}. Keep response clear and concise (under 200 words).`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: promptText }] }]
        });
        const responseText = result?.response?.text();

        if (responseText) {
          return {
            targetCity,
            days,
            theme,
            tripTitle: `'${targetCity}' ${days}일 맞춤 대화 코스`,
            aiRecommendationSummary: responseText,
            success: true
          };
        }
      } catch (err) {
        lastApiError = err?.message || String(err);
        console.warn(`[Google SDK Model Exception - ${modelName}]`, err);
      }
    }
  } else {
    lastApiError = 'API key missing in VITE_GEMINI_API_KEY environment variable';
  }

  // Pure Gemini SDK Mode Error Reporting
  return {
    targetCity,
    days,
    theme,
    tripTitle: `'${targetCity}' 여행`,
    aiRecommendationSummary: `⚠️ 구글 Gemini SDK 통신 오류 (${lastApiError || 'SDK initialization failed'})`,
    success: false,
    apiError: lastApiError
  };
}
