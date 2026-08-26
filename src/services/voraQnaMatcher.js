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
export function logUnansweredQuestion(rawQuery, targetCity = null) {
  if (!rawQuery || typeof rawQuery !== 'string') return;
  const clean = rawQuery.trim();
  if (clean.length < 2) return;

  const entry = {
    id: `unans-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    rawQuery: clean,
    targetCity: targetCity || null,
    timestamp: new Date().toISOString()
  };

  unansweredQueueCache.push(entry);

  try {
    if (typeof localStorage !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
      existing.push(entry);
      // Keep last 100 entries
      localStorage.setItem('vora_unanswered_qna', JSON.stringify(existing.slice(-100)));
    }
  } catch (err) {
    // Silent fail for storage limits
  }
}

/**
 * Match user query against VORA Q&A Knowledge Vault
 * @param {string} query User raw query string
 * @param {string|null} targetCity Selected city or null
 * @param {object} context Travel context session state
 * @param {string} lang Language code (ko, en, ja, zh)
 * @returns {object|null} Matched Q&A object or null
 */
export function matchVoraQna(query = '', targetCity = null, context = {}, lang = 'ko') {
  if (!query || typeof query !== 'string') return null;
  const clean = query.trim().toLowerCase();
  const normalizedQuery = clean.replace(/[\s\-_?!.~,]/g, '');
  if (normalizedQuery.length < 2) return null;

  const displayCity = targetCity || (lang === 'en' ? 'Korea' : '대한민국');
  const activeSeason = context.tripMemory?.season || (/(겨울|가을|봄|여름)/.test(clean) ? clean.match(/(겨울|가을|봄|여름)/)[1] : '사계절');

  let bestMatch = null;
  let highestScore = 0;

  for (const item of VORA_QNA_VAULT) {
    let score = 0;

    // 1. City Relevance Check
    const cityMatches = (item.targetCity === 'all') || (targetCity && item.targetCity === targetCity);
    if (!cityMatches && item.targetCity !== 'all') {
      continue; // Skip items specific to other cities
    }

    // 2. Exact or Substring Variation Match (Level 1 - Score: 100)
    for (const variation of item.questionVariations) {
      const normVar = variation.toLowerCase().replace(/[\s\-_?!.~,]/g, '');
      if (normalizedQuery === normVar) {
        score = Math.max(score, 100);
        break;
      }
      if (normalizedQuery.includes(normVar) || (normVar.length >= 4 && normVar.includes(normalizedQuery))) {
        score = Math.max(score, 85);
      }
    }

    // 3. Intent Keywords Intersection Match (Level 2 - Score: 50~80)
    if (score < 85 && item.intentKeywords && item.intentKeywords.length > 0) {
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
  logUnansweredQuestion(query, targetCity);
  return null;
}
