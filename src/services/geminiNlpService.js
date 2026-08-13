/**
 * Vora AI Core NLP & Official Google Generative AI Service
 * Features Native Structured JSON Output Architecture, Non-Existent City Exception Handling,
 * Multi-Key Auto-Fallback, Dynamic Multilingual (ko/en/ja/zh), Clean Suffix Stripping for City Extraction.
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

/**
 * Clean & Accurate City Name Extraction
 * Strips suffixes like 주변/근처/인근 before matching to prevent "창원주변" matching "원주"!
 */
export function extractLocationKeyword(text) {
  if (!text || typeof text !== 'string') return '전국';
  let clean = text.trim();

  clean = clean.replace(/(주변|근처|인근|여행|추천|코스|맛집|가볼만한곳|여행지)/g, ' ').trim();

  for (const city of VALID_KOREAN_CITIES) {
    const regex = new RegExp(`(?:^|\\s)${city}(?:$|\\s)`, 'i');
    if (regex.test(clean)) {
      return city;
    }
  }

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
 * Gemini Native Structured JSON Output Generator
 */
export async function geminiGenerateFullItinerary(rawPrompt, lang = 'ko') {
  const isHelp = isMetaHelpQuery(rawPrompt);
  const targetCity = extractLocationKeyword(rawPrompt);

  let days = 3;
  if (/(5일|4박\s*5일|5박|5d)/i.test(rawPrompt)) days = 5;
  else if (/(4일|3박\s*4일|4박|4d)/i.test(rawPrompt)) days = 4;
  else if (/(3일|2박\s*3일|3박|3d)/i.test(rawPrompt)) days = 3;
  else if (/(2일|1박\s*2일|2박|2d)/i.test(rawPrompt)) days = 2;
  else if (/(1일|당일|1박)/i.test(rawPrompt)) days = 1;

  let theme = '힐링/자연';
  if (/(맛집|미식|먹방|음식)/i.test(rawPrompt)) theme = '미식/맛집';
  if (/(사랑|연인|커플|데이트|야경)/i.test(rawPrompt)) theme = '커플/데이트';
  if (/(역사|문화|유적|한옥)/i.test(rawPrompt)) theme = '역사/문화';
  if (/(카페|오션뷰|해변|바다)/i.test(rawPrompt)) theme = '오션뷰/카페';

  const primaryKey = getActiveGeminiKey();
  const candidateKeys = Array.from(new Set([primaryKey, VERIFIED_FREE_TIER_KEY])).filter(k => k && k.length > 5);

  let greetingPrefix = '안녕하세요! 여행 조력자 보라입니다. 😊';
  if (lang === 'en') greetingPrefix = 'Hello! I am Vora, your Korean Travel Concierge. 😊';
  else if (lang === 'ja') greetingPrefix = 'こんにちは！旅行アシスタANTのボラです。😊';
  else if (lang === 'zh') greetingPrefix = '您好！我是您的韩国旅行助手 Vora。😊';

  const systemInstruction = `You are Vora AI, an empathetic Korean Travel Concierge for global travelers visiting Korea.
Return your response as a valid JSON object matching this schema:
{
  "isUnknownPlace": boolean,
  "summary": "String",
  "targetCity": "${targetCity}",
  "dailyPlaces": [
    { "day": 1, "places": ["Place 1", "Place 2"] }
  ]
}

INSTRUCTIONS:
1. If user input is a gibberish/non-existent place (e.g. '징수', 'asdf'), set isUnknownPlace: true, dailyPlaces: [], and summary: "${greetingPrefix} 입력해 주신 여행지는 대한민국 관광지나 지명으로 확인되지 않았습니다. 혹시 전북 장수나 다른 여행지를 찾으시나요?".
2. Otherwise, set isUnknownPlace: false, provide a polite ${days}-day itinerary summary starting with "${greetingPrefix}", and list the exact landmark/cafe/spot names for each day in dailyPlaces.
3. Return ONLY valid JSON.`;

  const promptText = `User input: ${JSON.stringify(rawPrompt)}. Target city: ${targetCity}, duration: ${days} days, theme: ${theme}. Generate JSON output.`;

  const modelCandidates = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
  let lastApiError = null;

  for (const apiKey of candidateKeys) {
    for (const modelName of modelCandidates) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction,
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 1500,
            temperature: 0.3
          }
        });
        const result = await model.generateContent(promptText);
        const rawText = result?.response?.text();
        
        if (rawText) {
          const parsed = parseGeminiJsonResponse(rawText, greetingPrefix, targetCity, days);
          if (parsed && parsed.summary) {
            return {
              targetCity: parsed.targetCity || targetCity,
              days,
              theme,
              isHelpQuery: isHelp,
              isUnknownPlace: parsed.isUnknownPlace || false,
              tripTitle: isHelp ? '보라 AI 안내' : `'${parsed.targetCity || targetCity}' ${days}일 맞춤 대화 코스`,
              aiRecommendationSummary: parsed.summary,
              dailyPlaces: parsed.isUnknownPlace ? [] : (parsed.dailyPlaces || []),
              success: true
            };
          }
        }
      } catch (err) {
        lastApiError = err?.message || String(err);
      }
    }

    for (const ver of ['v1', 'v1beta']) {
      for (const modelName of modelCandidates) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(`https://generativelanguage.googleapis.com/${ver}/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemInstruction}\n\n${promptText}` }] }],
              generationConfig: {
                responseMimeType: "application/json",
                maxOutputTokens: 1500,
                temperature: 0.3
              }
            })
          });
          clearTimeout(timeoutId);

          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (res.ok && rawText) {
            const parsed = parseGeminiJsonResponse(rawText, greetingPrefix, targetCity, days);
            if (parsed && parsed.summary) {
              return {
                targetCity: parsed.targetCity || targetCity,
                days,
                theme,
                isHelpQuery: isHelp,
                isUnknownPlace: parsed.isUnknownPlace || false,
                tripTitle: isHelp ? '보라 AI 안내' : `'${parsed.targetCity || targetCity}' ${days}일 맞춤 대화 코스`,
                aiRecommendationSummary: parsed.summary,
                dailyPlaces: parsed.isUnknownPlace ? [] : (parsed.dailyPlaces || []),
                success: true
              };
            }
          } else if (data?.error?.message) {
            lastApiError = data.error.message;
          }
        } catch (err) {
          lastApiError = err?.message || String(err);
        }
      }
    }
  }

  // Graceful Fallback if API fails
  return {
    targetCity,
    days,
    theme,
    isHelpQuery: isHelp,
    isUnknownPlace: false,
    tripTitle: `'${targetCity}' 여행`,
    aiRecommendationSummary: `${greetingPrefix}\n\n1일차: ${targetCity} 대표 명소를 탐색하고 여유로운 휴식을 즐깁니다.\n2일차: ${targetCity} 유명 힐링 코스와 지역 맛집을 탐방합니다.\n3일차: ${targetCity} 아름다운 전망대에서 일정을 마무리합니다.`,
    dailyPlaces: [
      { day: 1, places: [`${targetCity} 명소`] },
      { day: 2, places: [`${targetCity} 힐링 코스`] },
      { day: 3, places: [`${targetCity} 전망대`] }
    ],
    success: false,
    apiError: lastApiError
  };
}

/**
 * Robust JSON Parser with Regex Fallback for Gemini Output
 */
function parseGeminiJsonResponse(rawText, greetingPrefix, defaultCity, defaultDays) {
  if (!rawText || typeof rawText !== 'string') return null;
  let cleanText = rawText.trim();
  cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();

  try {
    const json = JSON.parse(cleanText);
    const summary = sanitizeGeminiOutput(json.summary || cleanText);
    let dailyPlaces = Array.isArray(json.dailyPlaces) ? json.dailyPlaces : [];
    
    if (dailyPlaces.length === 0 && !json.isUnknownPlace) {
      dailyPlaces = fallbackExtractDailyPlaces(summary, defaultDays);
    }

    return {
      isUnknownPlace: !!json.isUnknownPlace,
      summary: summary || greetingPrefix,
      targetCity: json.targetCity || defaultCity,
      dailyPlaces
    };
  } catch (e) {
    const summary = sanitizeGeminiOutput(cleanText);
    return {
      isUnknownPlace: false,
      summary: summary || greetingPrefix,
      targetCity: defaultCity,
      dailyPlaces: fallbackExtractDailyPlaces(summary, defaultDays)
    };
  }
}

/**
 * Regex Fallback Spot Extractor if JSON parsing fails
 */
function fallbackExtractDailyPlaces(text, days) {
  if (!text || typeof text !== 'string') return [];
  const dailyPlaces = [];
  const lines = text.split('\n');
  let currentDay = 1;

  for (const line of lines) {
    const dayMatch = line.match(/([1-5])일차[:\s]/);
    if (dayMatch) {
      currentDay = parseInt(dayMatch[1], 10);
    }

    const cleanLine = line.replace(/^[0-9]일차[:\s]*/, '').trim();
    if (cleanLine.length > 0) {
      const parts = cleanLine.split(/[,·]/).map(p => p.trim()).filter(p => p.length >= 2);
      if (parts.length > 0) {
        let dayObj = dailyPlaces.find(d => d.day === currentDay);
        if (!dayObj) {
          dayObj = { day: currentDay, places: [] };
          dailyPlaces.push(dayObj);
        }
        for (const p of parts) {
          const cleanP = p.replace(/(에서|을|를|과|와|으로|로|방문|감상|산책|체험|힐링|투어|즐기기|인근|주변).*$/, '').trim();
          if (cleanP.length >= 2 && !dayObj.places.includes(cleanP)) {
            dayObj.places.push(cleanP);
          }
        }
      }
    }
  }

  return dailyPlaces;
}
