// Gemini 1.5 Flash Zero-Shot Natural Language Itinerary Intent Structuring Engine
// 100% Free Tier (1,500 requests/day, $0 cost)

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6JRJRbb-EKn4ph3v1Z0O1viIaOrIs8-kgAAJiAbJgcu8w';

function getProvinceFromCity(cityName) {
  if (!cityName) return '경기';
  if (cityName.includes('서울') || cityName.includes('명동') || cityName.includes('성수')) return '서울';
  if (cityName.includes('부산') || cityName.includes('해운대') || cityName.includes('광안리')) return '부산';
  if (cityName.includes('제주') || cityName.includes('서귀포')) return '제주';
  if (cityName.includes('인천') || cityName.includes('송도')) return '인천';
  if (cityName.includes('강릉') || cityName.includes('속초')) return '강원';
  if (cityName.includes('전주')) return '전북';
  if (cityName.includes('경주')) return '경북';
  if (cityName.includes('여수')) return '전남';
  return '경기';
}

export async function geminiParseNaturalPrompt(rawPrompt, lang = 'ko', fallbackParser = null) {
  if (!rawPrompt || rawPrompt.trim().length < 2) {
    return fallbackParser ? fallbackParser(rawPrompt) : null;
  }

  // System instruction to enforce structured JSON output across all 9 languages
  const systemInstruction = `You are a Korea Travel Itinerary Intent Classifier. Analyze the user prompt (written in Korean, English, Japanese, Chinese, German, French, Spanish, or Russian) and extract structured intent into valid JSON matching this EXACT schema:
{
  "days": number (1-5, default 2 unless specified),
  "region": string ("경기", "서울", "부산", "제주", "강원", "전북", "경북", "전남", "경남", "인천", or "전국"),
  "keyword": string (daytime main city/district/landmark, e.g. "수원", "성수동", "해운대", "강릉"),
  "nightKeyword": string (night/hotel stay city/district, e.g. "명동", "해운대", "서귀포"),
  "day2Keyword": string (day 2 return or next-day city/district, e.g. "파주", "수원", "부산"),
  "dailyRegions": [
    { "day": 1, "daytime": "수원", "night": "명동" },
    { "day": 2, "daytime": "수원", "night": "수원" },
    { "day": 3, "daytime": "인천", "night": "인천" }
  ],
  "userLandmarks": string[] (array of explicit landmark or place names mentioned),
  "rainyMode": boolean (true if indoor/rainy mode requested)
}
IMPORTANT: Output ONLY raw JSON without markdown backticks (\`\`\`json).`;

  const requestPayload = {
    contents: [
      {
        parts: [
          { text: systemInstruction },
          { text: `User Prompt: "${rawPrompt}"` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 500,
      responseMimeType: "application/json"
    }
  };

  const candidateModels = [
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro'
  ];

  for (const modelName of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (res.ok) {
        const data = await res.json();
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        const dailyRegions = Array.isArray(parsed.dailyRegions) ? parsed.dailyRegions : [];
        // Extract all unique landmarks across dailyRegions
        const extractedLandmarks = [...(Array.isArray(parsed.userLandmarks) ? parsed.userLandmarks : [])];
        dailyRegions.forEach(d => {
          if (d.daytime && !extractedLandmarks.includes(d.daytime)) extractedLandmarks.push(d.daytime);
          if (d.night && !extractedLandmarks.includes(d.night)) extractedLandmarks.push(d.night);
        });

        return {
          region: parsed.region || (dailyRegions[0]?.daytime ? getProvinceFromCity(dailyRegions[0].daytime) : '경기'),
          days: parseInt(parsed.days, 10) || Math.max(dailyRegions.length, 2),
          keyword: parsed.keyword || dailyRegions[0]?.daytime || '',
          nightKeyword: parsed.nightKeyword || dailyRegions[0]?.night || '',
          day2Keyword: parsed.day2Keyword || dailyRegions[1]?.daytime || '',
          dailyRegions,
          userLandmarks: extractedLandmarks,
          rainyMode: !!parsed.rainyMode,
          raw: rawPrompt,
          isLlmParsed: true
        };
      }
    } catch (err) {
      console.warn(`Gemini LLM model ${modelName} call failed, trying fallback:`, err);
    }
  }

  // Zero-Failure Fallback: Use local parser if Gemini API key missing or offline
  return fallbackParser ? fallbackParser(rawPrompt) : null;
}
