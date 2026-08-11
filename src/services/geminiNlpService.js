// Gemini 1.5 Flash Zero-Shot Natural Language Itinerary Intent Structuring Engine
// 100% Free Tier (1,500 requests/day, $0 cost)

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6JRJRbb-EKn4ph3v1Z0O1viIaOrIs8-kgAAJiAbJgcu8w';

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
      maxOutputTokens: 300,
      responseMimeType: "application/json"
    }
  };

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
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

      return {
        region: parsed.region || '경기',
        days: parseInt(parsed.days, 10) || 2,
        keyword: parsed.keyword || '',
        nightKeyword: parsed.nightKeyword || '',
        day2Keyword: parsed.day2Keyword || '',
        userLandmarks: Array.isArray(parsed.userLandmarks) ? parsed.userLandmarks : [],
        rainyMode: !!parsed.rainyMode,
        raw: rawPrompt,
        isLlmParsed: true
      };
    }
  } catch (err) {
    console.warn('Gemini LLM NLP endpoint unavailable, seamlessly falling back to local engine:', err);
  }

  // Zero-Failure Fallback: Use local parser if Gemini API key missing or offline
  return fallbackParser ? fallbackParser(rawPrompt) : null;
}
