/**
 * VORA AI Daily Autonomous Knowledge Batch Runner (일일 무인 지식 증류 배치 러너)
 * 
 * 🤖 Execution Modes:
 * 1. Scheduled Cron: Runs automatically every midnight at 00:00 KST via GitHub Actions.
 * 2. Manual Trigger: Runs on-demand via GitHub Actions 'Run workflow' button or local Node.js.
 */

const fs = require('fs');
const path = require('path');

const CLOUD_API_URL = process.env.VORA_CLOUD_API_URL || 'https://travelkorea-dev.pages.dev/api/qna';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      unansweredList = Array.isArray(data) ? data : (data.questions || []);
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
  console.log(`🧠 Gemini 2.5 Flash 일괄 지식 증류 시작 (질문 수: ${unansweredList.length}개)...`);
  const newKnowledgeList = [];

  for (let i = 0; i < unansweredList.length; i++) {
    const q = unansweredList[i];
    const rawQuery = q.rawQuery || q.query || '';
    if (!rawQuery.trim()) continue;

    console.log(`⚡ [${i + 1}/${unansweredList.length}] "${rawQuery}" 증류 중...`);

    const ctx = q.context || {};
    const ctxSummary = [
      q.targetCity || ctx.city ? `목적지: ${q.targetCity || ctx.city}` : null,
      ctx.days ? `여행일수: ${ctx.days}일` : null,
      ctx.companion ? `동행: ${ctx.companion}` : null,
      ctx.themes?.length ? `테마: ${ctx.themes.join(', ')}` : null
    ].filter(Boolean).join(' | ');

    const promptText = `당신은 대한민국 여행 전문 AI 'VORA(보라)'의 최고 수석 지식 설계자입니다.
사용자 질문: "${rawQuery}" (${ctxSummary || '목적지: 전국'})

[핵심 지식 증류 필수 원칙]:
1. 동음이의어 또는 전국에 여러 곳이 존재하는 지명/명소(예: 옥녀봉, 남산, 미륵산, 용두산, 관음도, 비렁길 등) 질문 시:
   - 전국에서 관광객/등산객에게 가장 유명하고 인지도가 압도적인 대표 1등 명소(예: 통영 사량도 옥녀봉·출렁다리, 서울 청계산 옥녀봉, 거제 옥녀봉 등)를 1순위로 반드시 가장 먼저 언급할 것!
2. 답변은 여행자가 모바일에서 편하게 읽을 수 있도록 군더더기 없이 친절하고 정갈한 2~3문장으로 핵심을 요약할 것.
3. suggestedChips에는 사용자가 다음 행동으로 누를 만한 전국 대표 1등 명소 버튼(예: "통영 사량도 옥녀봉", "청계산 옥녀봉", "논산 옥녀봉", "사량도 가는 법")을 우선순위로 3~4개 추천할 것.

다음 JSON 포맷으로만 즉시 출력하세요:
{
  "id": "qna_auto_${Date.now()}_${i}",
  "title": "${rawQuery}",
  "category": "DYNAMIC_KNOWLEDGE",
  "targetCity": "${q.targetCity || ctx.city || 'all'}",
  "season": "all",
  "questionVariations": ["${rawQuery}"],
  "intentKeywords": ["${rawQuery}"],
  "geminiAnswer": {
    "ko": "친절하고 정확한 2~3문장 한국어 핵심 맞춤 답변 (전국 1등 대표 명소 최우선 안내)",
    "en": "Accurate 2-3 sentence English travel guide for Korea",
    "ja": "韓国旅行の正確で親切な日本語回答",
    "zh": "韩国旅游亲切准确的中文核心解答"
  },
  "followUp": "다음 제안 질문?",
  "suggestedChips": ["대표명소1", "대표명소2", "대표명소3"]
}`;

    let success = false;
    let rawOutput = '';

    // Primary & Fallback Models
    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash'
    ];

    for (const modelName of modelsToTry) {
      if (success) break;
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
          console.warn(`⏳ [Rate Limit / High Demand] ${modelName} 3초 대기 후 다음 모델 전환...`);
          await sleep(3000);
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
    console.log(`💾 생성된 ${newKnowledgeList.length}개 지식을 마스터 볼트 파일에 병합 중...`);
    const vaultFilePath = path.join(__dirname, '..', 'src', 'data', 'voraQnaVault.js');

    try {
      let fileContent = fs.readFileSync(vaultFilePath, 'utf8');

      // Export array parsing
      const arrayMatch = fileContent.match(/export const VORA_QNA_VAULT = (\[[\s\S]*?\]);/);
      if (arrayMatch) {
        const currentVault = eval(arrayMatch[1]);
        const norm = (s) => (s || '').trim().toLowerCase().replace(/[\s\-_?!.~,()[\]]/g, '');
        const map = new Map();

        currentVault.forEach(item => {
          const key = norm(item.title || item.questionVariations?.[0] || item.id);
          if (key) map.set(key, item);
        });

        newKnowledgeList.forEach(item => {
          const key = norm(item.title || item.questionVariations?.[0] || item.id);
          if (key) map.set(key, item);
        });

        const mergedList = Array.from(map.values());
        const updatedArrayString = JSON.stringify(mergedList, null, 2);
        const updatedContent = fileContent.replace(
          /export const VORA_QNA_VAULT = \[[\s\S]*?\];/,
          `export const VORA_QNA_VAULT = ${updatedArrayString};`
        );

        fs.writeFileSync(vaultFilePath, updatedContent, 'utf8');
        console.log(`🎉 voraQnaVault.js 업데이트 완료 (총 ${mergedList.length}개 지식 보유)`);
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
