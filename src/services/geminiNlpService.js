/**
 * Vora AI Core NLP & Official Google Generative AI Service
 * Features Multi-Key Auto-Fallback, Dynamic Multilingual (ko/en/ja/zh),
 * Regex Output Sanitization, & 1~5 Day Complete Bullet Itineraries.
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

export const VERIFIED_FREE_TIER_KEY = 'AQ.Ab8RN6KwKIdJmZ8x8OgJtXcdCFJnvw6lusi3ZiuWAwFLdqsexg';

export function getActiveGeminiKey() {
  const envKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_GEMINI_FREE_KEY ||
    import.meta.env.VITE_GEMINI_KEY ||
    import.meta.env.GEMINI_API_KEY;

  if (envKey && envKey.trim().length > 5) {
    return envKey.trim();
  }

  return VERIFIED_FREE_TIER_KEY;
}

export function isValidGeminiKey() {
  const key = getActiveGeminiKey();
  return !!(key && key !== 'YOUR_GEMINI_API_KEY' && key.length > 5);
}

export function isCasualChatQuery(text) {
  if (!text || typeof text !== 'string') return false;
  return /(오늘\s*뭐해|심심해|놀자|안녕|반가워|하이|hello|hi|넌\s*누구|너\s*누구)/i.test(text.trim());
}

export function isMetaHelpQuery(text) {
  if (!text || typeof text !== 'string') return false;
  return /(여기서\s*뭘|뭐할\s*수|무슨\s*기능|어떻게\s*사용|사용법|도움말|help|what\s*can\s*i|how\s*to\s*use)/i.test(text.trim());
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
 * Clean & Sanitize AI Output to remove any English meta/thought leakage
 */
export function sanitizeGeminiOutput(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\*Self-Correction[^*]*\*/gi, '')
    .replace(/\*Internal Note[^*]*\*/gi, '')
    .replace(/Drafting Notes?:?[^\n]*/gi, '')
    .replace(/^[\s\n\r]+/, '')
    .trim();
}

/**
 * Dynamic Multilingual Gemini AI Generator
 * Supports 1 to 5 days itinerary, maxOutputTokens: 1500, temperature: 0.5,
 * Strict multilingual system instructions, and Sanitization Filter.
 */
export async function geminiGenerateFullItinerary(rawPrompt, lang = 'ko') {
  const isHelp = isMetaHelpQuery(rawPrompt);
  const targetCity = extractLocationKeyword(rawPrompt);
  let days = 3;
  if (/(5일|5박|5d)/i.test(rawPrompt)) days = 5;
  else if (/(4일|4박|4d)/i.test(rawPrompt)) days = 4;
  else if (/(2일|2박|2d)/i.test(rawPrompt)) days = 2;
  else if (/(1일|1박|당일)/i.test(rawPrompt)) days = 1;

  let theme = '힐링/자연';
  if (/(맛집|미식|먹방|음식)/i.test(rawPrompt)) theme = '미식/맛집';
  if (/(사랑|연인|커플|데이트|야경)/i.test(rawPrompt)) theme = '커플/데이트';
  if (/(역사|문화|유적|한옥)/i.test(rawPrompt)) theme = '역사/문화';
  if (/(카페|오션뷰|해변|바다)/i.test(rawPrompt)) theme = '오션뷰/카페';

  const primaryKey = getActiveGeminiKey();
  const candidateKeys = Array.from(new Set([primaryKey, VERIFIED_FREE_TIER_KEY])).filter(k => k && k.length > 5);

  // Dynamic Multilingual System Instructions (Rule 5 & 9)
  let langInstruction = 'ALWAYS respond in 100% complete, natural, polite Korean ending with proper Korean periods (.). NEVER output English thought notes or meta commentary.';
  let greetingPrefix = '안녕하세요! 여행 컨시어지 보라입니다. 😊';

  if (lang === 'en') {
    langInstruction = 'ALWAYS respond in 100% polite, natural English ending with proper punctuation. NEVER output internal thought notes or meta commentary.';
    greetingPrefix = 'Hello! I am Vora, your Korean Travel Concierge.';
  } else if (lang === 'ja') {
    langInstruction = 'ALWAYS respond in 100% polite, natural Japanese ending with proper Japanese punctuation (。). NEVER output internal thought notes or meta commentary.';
    greetingPrefix = 'こんにちは！旅行アシスタントのボラです。';
  } else if (lang === 'zh') {
    langInstruction = 'ALWAYS respond in 100% polite, natural Chinese ending with proper Chinese punctuation (。). NEVER output internal thought notes or meta commentary.';
    greetingPrefix = '您好！我是您的韩国旅行助手 Vora。';
  }

  const systemInstruction = `You are Vora AI, an empathetic Korean Travel Concierge for global travelers visiting Korea.
ALWAYS start your response warmly with: "${greetingPrefix}"
${langInstruction}
Do NOT output any markdown headers starting with "*Self-Correction*" or internal notes.
If the user asks general usage questions (e.g., "여기서는 뭘 할 수 있지?", "what can I do here?"), introduce your 4 core services warmly:
1. 1:1 맞춤 여행 일정 추천 (1일~5일 코스 지원)
2. 한국관광공사 정품 명소 & 지도 GPS 좌표
3. 최저가 숙소 (아고다) & 액티비티 (클룩) 연동
4. 다국어 지원 (영어/일본어/중국어)
If the user asks for travel recommendations, provide a concise course for ${days} days using clean 1-line bullet points for each day (e.g., 1일차: ..., 2일차: ..., 3일차: ..., etc.). Ensure every single day from 1 to ${days} is fully covered and ends with a proper period.`;

  const promptText = `User input: '${rawPrompt}'. Target city: ${targetCity}, duration: ${days} days, theme: ${theme}. Write a concise ${days}-day itinerary.`;

  const modelCandidates = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
  let lastApiError = null;

  for (const apiKey of candidateKeys) {
    // 1. Official Google SDK
    for (const modelName of modelCandidates) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction,
          generationConfig: {
            maxOutputTokens: 1500,
            temperature: 0.5
          }
        });
        const result = await model.generateContent(promptText);
        const text = result?.response?.text();
        const cleanText = sanitizeGeminiOutput(text);

        if (cleanText) {
          return {
            targetCity,
            days,
            theme,
            isHelpQuery: isHelp,
            tripTitle: isHelp ? '보라 AI 안내' : `'${targetCity}' ${days}일 맞춤 대화 코스`,
            aiRecommendationSummary: cleanText,
            success: true
          };
        }
      } catch (err) {
        lastApiError = err?.message || String(err);
      }
    }

    // 2. Direct REST API (v1 / v1beta) fallback
    for (const ver of ['v1', 'v1beta']) {
      for (const modelName of modelCandidates) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/${ver}/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemInstruction}\n\n${promptText}` }] }],
              generationConfig: {
                maxOutputTokens: 1500,
                temperature: 0.5
              }
            })
          });
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          const cleanText = sanitizeGeminiOutput(text);

          if (res.ok && cleanText) {
            return {
              targetCity,
              days,
              theme,
              isHelpQuery: isHelp,
              tripTitle: isHelp ? '보라 AI 안내' : `'${targetCity}' ${days}일 맞춤 대화 코스`,
              aiRecommendationSummary: cleanText,
              success: true
            };
          } else if (data?.error?.message) {
            lastApiError = data.error.message;
          }
        } catch (err) {
          lastApiError = err?.message || String(err);
        }
      }
    }
  }

  return {
    targetCity,
    days,
    theme,
    isHelpQuery: isHelp,
    tripTitle: `'${targetCity}' 여행`,
    aiRecommendationSummary: `${greetingPrefix}\n\n⚠️ 통신 연결이 일시적으로 지연되었습니다. 궁금하신 여행지를 편하게 말씀해 주세요!`,
    success: false,
    apiError: lastApiError
  };
}
