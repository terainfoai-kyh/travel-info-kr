/**
 * VORA AI 2.0 - Gemini Offline Knowledge Harvester & Ingestion Script
 * 
 * Usage:
 *   node scripts/syncGeminiKnowledge.js [optional: city_name]
 * 
 * Purpose:
 *   Periodically queries Gemini API (Free Tier Quota) to synthesize rich local tourism wisdom,
 *   themes, walking-friendly spots, and witty dialog responses, updating VORA's local knowledge base.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read API Key from environment or local .env
function getApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;

  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/VITE_GEMINI_API_KEY\s*=\s*(.+)/);
      if (match && match[1]) {
        return match[1].trim().replace(/['"]/g, '');
      }
    }
  } catch (e) {
    // Ignore env parse error
  }
  return null;
}

async function harvestCityKnowledge(cityName, apiKey) {
  console.log(`\n🔍 [VORA Harvester] Harvesting Gemini Wisdom for: ${cityName}...`);

  const prompt = `당신은 대한민국 최고의 관광 여행 전문가이자 AI '스승'입니다.
도시 [${cityName}]에 대해 아래 5개 카테고리별 핵심 지식을 JSON 형태로 정결하게 생성해주세요:
1. badge: 해당 도시를 대표하는 매력적인 한 줄 수식어
2. rainyHotspots: 비 오는 날 가기 좋은 대표 실내 명소 4곳
3. walkingMinimized: 어르신/보행 약자를 위한 도보 최소화 힐링 명소 4곳
4. localFoodieSecret: 현지인들이 인정하는 시그니처 미식 및 대표 음식
5. transitTip: 대중교통/KTX/버스 이용 꿀팁 1줄

응답은 오직 아래 형식의 순수 JSON 문자열로만 반환하세요:
{
  "badge": "...",
  "rainyHotspots": ["...", "...", "...", "..."],
  "walkingMinimized": ["...", "...", "...", "..."],
  "localFoodieSecret": "...",
  "transitTip": "..."
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini API Error (HTTP ${res.status}): ${errBody}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);
    console.log(`✅ [VORA Harvester] Successfully acquired knowledge for ${cityName}:`, parsed);
    return parsed;
  } catch (err) {
    console.error(`❌ [VORA Harvester] Failed for ${cityName}:`, err.message);
    return null;
  }
}

async function main() {
  const apiKey = getApiKey();
  if (!apiKey || apiKey.startsWith('AQ.')) {
    console.log(`
ℹ️  [VORA Harvester Notice]
현재 표준 Google AI Studio API 키(AIzaSy...)가 설정되지 않았습니다.
프론트엔드 실시간 서비스는 이미 내장된 'VORA 지능형 지식 DB(voraDialogKnowledge.js)'로 100% 정상 작동합니다.

추후 정기적인 자동 지식 수집을 실행하시려면:
1. https://aistudio.google.com/ 에서 무료 API Key (AIzaSy...) 발급
2. .env 파일에 VITE_GEMINI_API_KEY=AIzaSy... 입력 후
3. 다시 'node scripts/syncGeminiKnowledge.js'를 실행하시면 됩니다!
`);
    return;
  }

  const targetCity = process.argv[2] || '서울';
  await harvestCityKnowledge(targetCity, apiKey);
}

main();
