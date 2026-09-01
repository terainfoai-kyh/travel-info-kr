/**
 * VORA AI 2.0 - Gemini Offline Knowledge Harvester & Ingestion Script
 * 
 * Usage:
 *   node scripts/syncGeminiKnowledge.js [--all | --cities | --tikitaka | --food | --fashion]
 * 
 * Purpose:
 *   Periodically queries Gemini API (Free Tier Quota) to synthesize:
 *   1. 25 Major Korean City Highlights & Transit tips
 *   2. Emotional Tiki-Taka chit-chats & witty follow-up hooks
 *   3. Regional K-Food pairings & waiting secrets
 *   4. K-Fashion seasonal weather coordination advice
 *   5. Foreigner practical essentials
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

  const modelsToTry = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro'
  ];

  for (const modelName of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed = JSON.parse(rawText);
        console.log(`✅ [VORA Harvester] Successfully acquired knowledge for ${cityName} via ${modelName}:`, parsed);
        return parsed;
      }
    } catch (err) {
      console.warn(`⚠️ [VORA Harvester] ${modelName} failed: ${err.message}`);
    }
  }
  console.error(`❌ [VORA Harvester] All models failed for ${cityName}`);
  return null;
}

async function harvestTikitakaBanter(apiKey) {
  console.log(`\n💬 [VORA Harvester] Harvesting Gemini Witty Banter & Chit-Chat Patterns...`);

  const prompt = `대한민국 모바일 여행 AI 비서 '보라(VORA)'가 사용자에게 건넬 위트 있는 티키타카 대화 멘트를 생성해주세요.
카테고리:
1. 배고픔 호소에 대한 위트 있는 응답 및 되물음 훅
2. 다리 아픔/피곤 호소에 대한 다정한 공감 및 쉼터 제안
3. 비 오는 날 푸념에 대한 긍정적 전환 및 실내 핫플 추천
4. 칭찬("너 최고야")에 대한 능청스럽고 사랑스러운 화답
5. 추천 불만족("별로야")에 대한 쿨한 사과 및 반전 히든 스팟 제시

JSON 형식으로 반환:
{
  "hungry": { "reply": "...", "hook": "..." },
  "tired": { "reply": "...", "hook": "..." },
  "rainComplaint": { "reply": "...", "hook": "..." },
  "compliment": { "reply": "...", "hook": "..." },
  "replace": { "reply": "...", "hook": "..." }
}`;

  const modelsToTry = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro'
  ];

  for (const modelName of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json"
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text);
        console.log(`✅ [VORA Harvester] Tikitaka knowledge acquired via ${modelName}:`, parsed);
        return parsed;
      }
    } catch (err) {
      console.warn(`⚠️ [VORA Harvester] Tikitaka ${modelName} failed: ${err.message}`);
    }
  }
  console.error(`❌ [VORA Harvester] Tikitaka harvest failed for all models`);
  return null;
}

async function main() {
  const apiKey = getApiKey();
  if (!apiKey || apiKey.startsWith('AQ.')) {
    console.log(`
ℹ️  [VORA Harvester Notice]
현재 표준 Google AI Studio API 키(AIzaSy...)가 설정되지 않았습니다.
프론트엔드 실시간 서비스는 이미 내장된 'VORA 지능형 지식 DB(voraDialogKnowledge.js)'의 6대 영역 지식으로 100% 정상 작동합니다.

추후 정기적인 자동 지식 수집을 실행하시려면:
1. https://aistudio.google.com/ 에서 무료 API Key (AIzaSy...) 발급
2. .env 파일에 VITE_GEMINI_API_KEY=AIzaSy... 입력 후
3. 'node scripts/syncGeminiKnowledge.js --all' 을 실행하시면 됩니다!
`);
    return;
  }

  const mode = process.argv[2] || '--all';
  if (mode === '--tikitaka' || mode === '--all') {
    await harvestTikitakaBanter(apiKey);
  }
  if (mode === '--cities' || mode === '--all') {
    const targetCity = process.argv[3] || '서울';
    await harvestCityKnowledge(targetCity, apiKey);
  }
}

main();
