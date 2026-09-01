/**
 * VORA AI Daily Autonomous Knowledge Batch Runner (일일 무인 지식 증류 배치 러너)
 * 
 * 🤖 Execution Modes:
 * 1. Scheduled Cron: Runs automatically every midnight at 00:00 KST via GitHub Actions.
 * 2. Manual Trigger: Runs on-demand via GitHub Actions 'Run workflow' button or local Node.js.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLOUD_API_URL = process.env.VORA_CLOUD_API_URL || 'https://travelkorea-dev.pages.dev/api/qna';
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const VORA_MASTER_VAULT_KEY = 'VORA_AI_MASTER_KEY_2026_SECRET';

function encryptVoraPayload(plain) {
  try {
    const jsonStr = typeof plain === 'string' ? plain : JSON.stringify(plain);
    const buf = Buffer.from(jsonStr, 'utf-8');
    const key = Buffer.from(VORA_MASTER_VAULT_KEY, 'utf-8');
    const shifted = Buffer.alloc(buf.length);
    for (let i = 0; i < buf.length; i++) {
      shifted[i] = buf[i] ^ key[i % key.length] ^ 0x5A;
    }
    return shifted.toString('base64');
  } catch (e) {
    console.error('Encryption failed:', e.message);
    return '';
  }
}

function decryptVoraPayload(cipher) {
  if (!cipher || typeof cipher !== 'string') return null;
  try {
    const buf = Buffer.from(cipher, 'base64');
    const key = Buffer.from(VORA_MASTER_VAULT_KEY, 'utf-8');
    const unshifted = Buffer.alloc(buf.length);
    for (let i = 0; i < buf.length; i++) {
      unshifted[i] = buf[i] ^ 0x5A ^ key[i % key.length];
    }
    const plainStr = unshifted.toString('utf-8');
    return JSON.parse(plainStr);
  } catch (e) {
    console.error('Decryption failed:', e.message);
    return null;
  }
}

async function runBatch() {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n======================================================`);
  console.log(`[${timestamp}] 🚀 VORA AI 일일 무인 지식 증류 배치 프로세스 시작`);
  console.log(`======================================================`);

  if (!GEMINI_API_KEY) {
    console.warn(`⚠️ [경고] GEMINI_API_KEY 환경변수가 설정되지 않았습니다. GitHub Secrets를 확인하세요.`);
    // 키가 없더라도 스크립트가 크래시되지 않고 안전하게 종료
    process.exit(0);
  }

  // 1. Fetch Unanswered Questions Queue from Cloud
  console.log(`☁️ Cloudflare Pages 중앙 큐(${CLOUD_API_URL})에서 미답변 질문 수신 중...`);
  let unansweredList = [];
  try {
    const res = await fetch(CLOUD_API_URL);
    if (res.ok) {
      const data = await res.json();
      unansweredList = Array.isArray(data) ? data : (data.list || data.questions || []);
      console.log(`📋 수신 완료: 총 ${unansweredList.length}건의 미답변 질문 대기 중`);
    } else {
      console.warn(`⚠️ 클라우드 큐 응답 실패: ${res.status}`);
    }
  } catch (err) {
    console.warn(`⚠️ 클라우드 큐 접속 오류: ${err.message}`);
  }

  if (unansweredList.length === 0) {
    console.log(`✨ 학습할 미답변 질문이 없습니다. 일일 배치를 정상 완료합니다.`);
    console.log(`======================================================\n`);
    process.exit(0);
  }

  // 2. Gemini Knowledge Distillation Loop with 1.2s Throttle Delay
  console.log(`🧠 Gemini Flash 일괄 지식 증류 시작 (질문 수: ${unansweredList.length}개)...`);
  const newKnowledgeList = [];

  for (let i = 0; i < unansweredList.length; i++) {
    const q = unansweredList[i];
    const rawQuery = q.rawQuery || q.question || '';
    if (!rawQuery.trim()) continue;

    console.log(`⚡ [${i + 1}/${unansweredList.length}] "${rawQuery}" 증류 중...`);

    const ctx = q.context || {};
    const themesSummary = Array.isArray(ctx.themes) && ctx.themes.length
      ? `테마: ${ctx.themes.join(', ')}`
      : (typeof ctx.themes === 'string' && ctx.themes.trim() ? `테마: ${ctx.themes.trim()}` : null);

    const ctxSummary = [
      q.targetCity || ctx.city ? `목적지: ${q.targetCity || ctx.city}` : null,
      ctx.days ? `여행일수: ${ctx.days}일` : null,
      ctx.companion ? `동행: ${ctx.companion}` : null,
      themesSummary
    ].filter(Boolean).join(' | ');

    const promptText = `당신은 대한민국 여행 전문 AI 'VORA(보라)'의 최고 수석 지식 설계자입니다.
사용자 질문: "${rawQuery}" (${ctxSummary || '목적지: 전국'})

[핵심 지식 증류 필수 원칙]:
1. 대상 도시(targetCity) 자동 판별:
   - 질문이나 답변 내용이 특정 도시(예: 경주, 부산, 제주, 서울, 강릉, 여수 등)에 국한된 꿀팁이라면 "targetCity"에 해당 도시명(예: "경주")을 반드시 지정하세요. (전국 공통 여행 질문이면 "all")
2. 트리거 유사 질문(questionVariations) 100% 자동 다각화 (4~6개):
   - 사용자의 원본 질문("${rawQuery}")을 1순위로 포함하고,
   - 특정 도시 지식인 경우 반드시 "[도시명] [질문]" 형태의 자연스러운 변형 질문들(예: targetCity가 '경주'이고 질문이 '걷기 싫어'인 경우 ➔ ["걷기 싫어", "경주 걷기 싫어", "경주 걷기 편한 곳", "경주 효도 여행", "경주 부모님 여행"])을 4~6개 풍성하게 생성할 것!
3. 동음이의어 또는 전국에 여러 곳이 존재하는 지명/명소(예: 옥녀봉, 남산, 미륵산, 용두산, 관음도 등) 질문 시:
   - 전국에서 관광객/등산객에게 가장 유명하고 인지도가 압도적인 대표 1등 명소(예: 통영 사량도 옥녀봉·출렁다리, 서울 청계산 옥녀봉 등)를 1순위로 반드시 가장 먼저 언급할 것!
4. 답변은 여행자가 모바일에서 편하게 읽을 수 있도록 군더더기 없이 친절하고 정갈한 2~3문장으로 핵심을 요약할 것.
5. suggestedChips에는 사용자가 다음 행동으로 누를 만한 유용한 핫플/체험 버튼을 3~4개 추천할 것.

다음 JSON 포맷으로만 즉시 출력하세요:
{
  "id": "qna_auto_${Date.now()}_${i}",
  "title": "${rawQuery}",
  "category": "DYNAMIC_KNOWLEDGE",
  "targetCity": "${q.targetCity || ctx.city || 'all'}",
  "season": "all",
  "questionVariations": ["${rawQuery}", "도시명 결합 유사질문1", "도시명 결합 유사질문2"],
  "intentKeywords": ["${rawQuery}"],
  "geminiAnswer": {
    "ko": "친절하고 정확한 2~3문장 한국어 핵심 맞춤 답변",
    "en": "Accurate 2-3 sentence English travel guide for Korea",
    "ja": "韓国旅行の正確で親切な日本語回答",
    "zh": "韩国旅游亲切准确的中文核心解答"
  },
  "followUp": "다음 제안 질문?",
  "suggestedChips": ["추천버튼1", "추천버튼2", "추천버튼3"]
}`;

    let success = false;
    let rawOutput = '';

    // Primary & Fallback Models (100% 검증된 구글 공식 정품 고속 Flash 패밀리)
    const modelsToTry = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-1.5-pro'
    ];

    for (const modelName of modelsToTry) {
      if (success) break;
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
            })
          }
        );

        if (geminiRes.ok) {
          const resJson = await geminiRes.json();
          rawOutput = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (rawOutput) success = true;
        } else if (geminiRes.status === 429 || geminiRes.status === 503) {
          console.warn(`⏳ [Rate Limit / High Demand] ${modelName} 2초 대기 후 다음 모델 전환...`);
          await sleep(2000);
        }
      } catch (callErr) {
        console.warn(`⚠️ ${modelName} 호출 에러: ${callErr.message}`);
      }
    }

    if (success && rawOutput) {
      try {
        const cleanedJson = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);
        parsed.id = parsed.id || `custom_${Date.now()}_${i}`;
        parsed.title = parsed.title || parsed.questionVariations?.[0] || rawQuery;
        parsed.targetCity = parsed.targetCity || q.targetCity || 'all';
        newKnowledgeList.push(parsed);
        console.log(`✅ "${rawQuery}" ➔ 다국어 지식 생성 성공!`);
      } catch (parseErr) {
        console.warn(`⚠️ JSON 파싱 오류: ${parseErr.message}`);
      }
    }

    // ⏱️ 1.2초 지능형 안전 텀 (RPM 속도 초과 방지)
    if (i < unansweredList.length - 1) {
      await sleep(1200);
    }
  }

  // 3. Merge with Master Knowledge Vault file (src/data/voraQnaVault.js)
  if (newKnowledgeList.length > 0) {
    console.log(`💾 생성된 ${newKnowledgeList.length}개 지식을 암호화 마스터 볼트 파일에 병합 중...`);
    const vaultFilePath = path.join(__dirname, '..', 'src', 'data', 'voraQnaVault.js');

    try {
      let fileContent = fs.readFileSync(vaultFilePath, 'utf8');

      // Extract existing Encrypted Payload safely
      const prefix = 'export const VORA_ENCRYPTED_VAULT_PAYLOAD = "';
      const startIdx = fileContent.indexOf(prefix);
      let currentQnaVault = [];
      let currentCityKnowledge = {};

      if (startIdx !== -1) {
        const payloadStart = startIdx + prefix.length;
        const endIdx = fileContent.indexOf('";', payloadStart);
        if (endIdx !== -1) {
          const rawCipher = fileContent.slice(payloadStart, endIdx);
          const decrypted = decryptVoraPayload(rawCipher);
          if (decrypted && decrypted.qnaVault) {
            currentQnaVault = Array.isArray(decrypted.qnaVault) ? decrypted.qnaVault : [];
            currentCityKnowledge = decrypted.cityKnowledge || {};
          } else if (Array.isArray(decrypted)) {
            currentQnaVault = decrypted;
          }
        }
      }

      const norm = (s) => (s || '').trim().toLowerCase().replace(/[\s\-_?!.~,()[\]]/g, '');
      const map = new Map();

      currentQnaVault.forEach(item => {
        const key = norm(item.title || item.questionVariations?.[0] || item.id);
        if (key) map.set(key, item);
      });

      newKnowledgeList.forEach(item => {
        const key = norm(item.title || item.questionVariations?.[0] || item.id);
        if (key) map.set(key, item);
      });

      const mergedQnaList = Array.from(map.values());
      const masterPayload = {
        qnaVault: mergedQnaList,
        cityKnowledge: currentCityKnowledge
      };

      const encryptedPayload = encryptVoraPayload(masterPayload);

      if (encryptedPayload && startIdx !== -1) {
        const payloadStart = startIdx + prefix.length;
        const endIdx = fileContent.indexOf('";', payloadStart);
        const updatedContent = fileContent.slice(0, payloadStart) + encryptedPayload + fileContent.slice(endIdx);
        fs.writeFileSync(vaultFilePath, updatedContent, 'utf8');
        console.log(`🎉 voraQnaVault.js 업데이트 완료 (총 ${mergedQnaList.length}개 Q&A + ${Object.keys(currentCityKnowledge).length}개 도시 지식 단일 암호화 보유)`);
      } else {
        console.error(`❌ 볼트 암호화 또는 위치 파싱 실패`);
      }
    } catch (fsErr) {
      console.error(`❌ 파일 저장 오류: ${fsErr.message}`);
    }

    // 4. Clear Cloud Queue
    console.log(`🧹 Cloudflare Pages 중앙 큐 비우기 실행...`);
    try {
      await fetch(CLOUD_API_URL, { method: 'DELETE' });
      console.log(`✅ 클라우드 대기 큐 비우기 완료!`);
    } catch (delErr) {
      console.warn(`⚠️ 큐 비우기 실패: ${delErr.message}`);
    }
  }

  console.log(`======================================================`);
  console.log(`🎉 VORA AI 일일 무인 지식 증류 배치 성공 완료! ✨`);
  console.log(`======================================================\n`);
}

runBatch().catch(err => {
  console.error(`💥 배치 실행 중 치명적 오류: ${err.message}`);
  process.exit(1);
});
