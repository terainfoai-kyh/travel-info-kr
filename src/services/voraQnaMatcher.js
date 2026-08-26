/**
 * VORA High-Speed Q&A Runtime Matcher Engine (보라 초고속 지식 매칭 엔진)
 * 
 * Performance: < 0.5ms Execution Time
 * Features:
 * 1. Multi-tier Semantic Pattern Matching (Variations > Keyword Intersections)
 * 2. Dynamic Korean Particle Interpolation (은/는, 이/가, 으로/로)
 * 3. Fallback Logging to Unanswered Queue (Active Learning Data Loop)
 */

import { VORA_QNA_VAULT } from '../data/voraQnaVault.js';
import { interpolateTemplate } from '../utils/koreanParticles.js';

// Local In-Memory Unanswered Queue
let unansweredQueueCache = [];

/**
 * Log unseen questions to local queue for next batch Gemini distillation
 */
export function logUnansweredQuestion(rawQuery, targetCity = null, tripContext = null) {
  if (!rawQuery || typeof rawQuery !== 'string') return;
  const clean = rawQuery.trim();
  if (clean.length < 3) return;

  // 🛡️ 1. 단순 단편어 & 키워드 & 수락어는 질문 큐 저장에서 필터링!
  const isSimpleCityOnly = /^(서울|부산|제주|경주|강릉|수원|인천|전주|여수|대구|대전|광주|포항|통영|거제|춘천|속초|안동|한국|korea|seoul|busan|jeju)$/i.test(clean);
  const isSimpleDuration = /^(\d+\s*일|\d+\s*박\s*\d+\s*일|\d+\s*박|당일치기|하루|이틀|사흘|\d+\s*days?)$/i.test(clean);
  const isSimpleCompanion = /^(혼자|커플|가족|친구|아이|부모님|아이\s*동반|부모님\s*동반|아이랑|부모님이랑|친구랑|연인이랑)$/i.test(clean);
  const isSimpleActionOrAccept = /^(짜줘|맞춰줘|해줘|잡아줘|추천해줘|만들어줘|일정\s*생성|생성해줘|설계해줘|준비해줘|정해줘|응|어|네|예|좋아|좋아요|오케이|ok|콜|그래|부탁해|이대로|시작|가자|가보자)$/i.test(clean);
  const isSimpleThemeOnly = /^(맛집|카페|관광지|쇼핑|자연|야경|힐링|인생샷|덜\s*걷기|비\/실내|실내|비오는날)$/i.test(clean);

  if (isSimpleCityOnly || isSimpleDuration || isSimpleCompanion || isSimpleActionOrAccept || isSimpleThemeOnly) {
    return; // 단순 상태 조건은 큐에 저장하지 않음!
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
      
      // 🛡️ 2. 질문 정규화 (공백/특수문자 제거 후 비교)
      const normClean = clean.replace(/[\s\?\.\!\,\~\-]/g, '').toLowerCase();
      const existingIndex = existing.findIndex(item => 
        (item.rawQuery || item.question || '').replace(/[\s\?\.\!\,\~\-]/g, '').toLowerCase() === normClean
      );

      // 이미 존재하면 count만 증가시켜 랭킹 집계!
      if (existingIndex >= 0) {
        existing[existingIndex].count = (existing[existingIndex].count || 1) + 1;
        existing[existingIndex].lastSeen = new Date().toISOString();
        localStorage.setItem('vora_unanswered_qna', JSON.stringify(existing));
        return;
      }

      // 🛡️ 3. 전후 여행 문맥(Context) 번들링
      const bundledContext = {
        city: targetCity || tripContext?.targetCity || tripContext?.city || null,
        days: tripContext?.requestedDays || tripContext?.days || null,
        companion: tripContext?.companion || null,
        themes: tripContext?.themes || []
      };

      const entry = {
        id: `unans-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        rawQuery: clean,
        targetCity: targetCity || tripContext?.targetCity || null,
        context: bundledContext,
        count: 1,
        timestamp: new Date().toISOString()
      };

      existing.push(entry);
      // Keep last 100 entries
      localStorage.setItem('vora_unanswered_qna', JSON.stringify(existing.slice(-100)));
    }
  } catch (err) {
    // Silent fail for storage limits
  }
}

// Common Typo & Slang Normalization Dictionary
const TYPO_RULES = [
  { pattern: /(거재도|거재)/gi, replacement: '거제' },
  { pattern: /(부싼|부샨)/gi, replacement: '부산' },
  { pattern: /(재주도|재주|쩨주)/gi, replacement: '제주' },
  { pattern: /(서율|서을)/gi, replacement: '서울' },
  { pattern: /(수원시|수언)/gi, replacement: '수원' },
  { pattern: /(맛짚|맞집|맜집|맛잇는집|맛나는집)/gi, replacement: '맛집' },
  { pattern: /(일쩡|알정|일죵)/gi, replacement: '일정' },
  { pattern: /(호탤)/gi, replacement: '호텔' },
  { pattern: /(추천해죠|추천점|추천좀|추처)/gi, replacement: '추천' },
  { pattern: /(겨을|겨율)/gi, replacement: '겨울' },
  { pattern: /(티머늬|티모니)/gi, replacement: '티머니' },
  { pattern: /(바버|바뷰|멍청)/gi, replacement: '바보' },
  { pattern: /(넌누구|너누구|누구니|누구새요|너사람)/gi, replacement: '넌누구니' },
  { pattern: /(뭘할수|뭐할수|뭘할수있|기능이뭐)/gi, replacement: '여기서뭘할수있지' }
];

function normalizeTypos(str) {
  let res = str;
  for (const rule of TYPO_RULES) {
    res = res.replace(rule.pattern, rule.replacement);
  }
  return res;
}

function calcLevenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Match user query against VORA Q&A Knowledge Vault (with Typo & Fuzzy Matching)
 * @param {string} query User raw query string
 * @param {string|null} targetCity Selected city or null
 * @param {object} context Travel context session state
 * @param {string} lang Language code (ko, en, ja, zh)
 * @returns {object|null} Matched Q&A object or null
 */
export function matchVoraQna(query = '', targetCity = null, context = {}, lang = 'ko') {
  if (!query || typeof query !== 'string') return null;
  const clean = query.trim().toLowerCase();
  const typoFixed = normalizeTypos(clean);
  const normalizedQuery = typoFixed.replace(/[\s\-_?!.~,]/g, '');
  if (normalizedQuery.length < 2) return null;

  const displayCity = targetCity || (lang === 'en' ? 'Korea' : '대한민국');
  const activeSeason = context.tripMemory?.season || (/(겨울|가을|봄|여름)/.test(clean) ? clean.match(/(겨울|가을|봄|여름)/)[1] : '사계절');

  let combinedVault = [...VORA_QNA_VAULT];
  try {
    if (typeof localStorage !== 'undefined') {
      const customVault = JSON.parse(localStorage.getItem('vora_custom_qna_vault') || '[]');
      if (Array.isArray(customVault) && customVault.length > 0) {
        combinedVault = [...customVault, ...combinedVault];
      }
    }
  } catch (e) {}

  let bestMatch = null;
  let highestScore = 0;

  for (const item of combinedVault) {
    let score = 0;

    // 1. City Relevance Check
    const cityMatches = (item.targetCity === 'all') || (targetCity && item.targetCity === targetCity);
    if (!cityMatches && item.targetCity !== 'all') {
      continue; // Skip items specific to other cities
    }

    // 2. Exact, Substring & Fuzzy Variation Match (Level 1 - Score: 75~100)
    for (const variation of item.questionVariations) {
      const normVar = variation.toLowerCase().replace(/[\s\-_?!.~,]/g, '');
      if (normalizedQuery === normVar) {
        score = Math.max(score, 100);
        break;
      }
      if (normalizedQuery.includes(normVar) || (normVar.length >= 4 && normVar.includes(normalizedQuery))) {
        score = Math.max(score, 85);
      } else if (normVar.length >= 3 && Math.abs(normVar.length - normalizedQuery.length) <= 1) {
        // Fuzzy edit distance for typo tolerance (e.g. 거재도 vs 거제도)
        const dist = calcLevenshtein(normVar, normalizedQuery);
        if (dist === 1) {
          score = Math.max(score, 80);
        }
      }
    }

    // 3. Intent Keywords Intersection Match (Level 2 - Score: 50~80)
    if (score < 80 && item.intentKeywords && item.intentKeywords.length > 0) {
      let matchedKwCount = 0;
      for (const kw of item.intentKeywords) {
        const normKw = kw.toLowerCase().replace(/[\s\-_]/g, '');
        if (normalizedQuery.includes(normKw)) {
          matchedKwCount++;
        }
      }

      if (matchedKwCount >= 2) {
        const kwRatio = matchedKwCount / Math.min(item.intentKeywords.length, 3);
        const kwScore = 50 + (kwRatio * 30); // 50 to 80
        score = Math.max(score, kwScore);
      } else if (matchedKwCount === 1 && normalizedQuery.length <= 4) {
        score = Math.max(score, 55); // Short queries like "겨울에", "아이동반"
      }
    }

    if (score > highestScore && score >= 50) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // If match found with confidence threshold >= 50
  if (bestMatch && highestScore >= 50) {
    const rawAnswer = (bestMatch.geminiAnswer && bestMatch.geminiAnswer[lang]) 
      || bestMatch.geminiAnswer.ko 
      || bestMatch.geminiAnswer.en;

    const templateVars = {
      city: displayCity,
      season: activeSeason,
      hotel: context.tripMemory?.hotelArea || (lang === 'en' ? 'Hotel' : '숙소'),
      gateway: context.tripMemory?.gateway || (lang === 'en' ? 'Airport' : '공항/역')
    };

    const reply = interpolateTemplate(rawAnswer, templateVars);
    const followUp = interpolateTemplate(bestMatch.followUp || '', templateVars);

    return {
      matched: true,
      id: bestMatch.id,
      category: bestMatch.category,
      reply,
      followUp,
      suggestedChips: bestMatch.suggestedChips || [],
      isTikitaka: true,
      score: highestScore
    };
  }

  // Not matched in vault -> Log to unanswered queue for future Gemini batch training!
  logUnansweredQuestion(query, targetCity, context);
  return null;
}
