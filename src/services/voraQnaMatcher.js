/**
 * VORA High-Speed Q&A Runtime Matcher Engine (보라 초고속 지식 매칭 엔진)
 * 
 * Performance: < 0.5ms Execution Time
 * Features:
 * 1. Multi-tier Semantic Pattern Matching (Variations > Keyword Intersections)
 * 2. Dynamic Korean Particle Interpolation (은/는, 이/가, 으로/로)
 * 3. Fallback Logging to Unanswered Queue (Active Learning Data Loop)
 */

import { getVoraQnaVault } from '../data/voraQnaVault.js';
import { CITY_LOCAL_KNOWLEDGE } from '../data/voraDialogKnowledge.js';
import { KOREA_TRAVEL_POI_DB } from '../data/koreaTravelPoiDatabase.js';
import { interpolateTemplate } from '../utils/koreanParticles.js';
import { pushQuestionToCloud } from './voraCloudQnaService.js';
import { isSystemActionOrCourseDirective } from '../utils/qnaFilter.js';

export { isSystemActionOrCourseDirective };

// Local In-Memory Unanswered Queue
let unansweredQueueCache = [];

/**
 * Log unseen questions to local queue for next batch Gemini distillation
 */
export function logUnansweredQuestion(rawQuery, targetCity = null, tripContext = null) {
  if (!rawQuery || typeof rawQuery !== 'string') return;
  const clean = rawQuery.trim();
  if (clean.length < 3) return;

  // 🛡️ 1. 단순 단편어 & 키워드 & 수락어 & 버튼 칩 텍스트 & 코스 생성 지시어는 질문 큐 저장에서 100% 필터링!
  if (isSystemActionOrCourseDirective(clean)) {
    return;
  }

  // 🛡️ 2. POI 명소명 단독 입력 필터링 (e.g. 남산 서울타워, 경복궁, DDP 등은 질문이 아니라 명소 탐색임!)
  const cleanNorm = clean.replace(/[\s\-\_\.]/g, '').toLowerCase();
  const isPoiName = (KOREA_TRAVEL_POI_DB || []).some(poi => {
    const poiNorm = poi.title.replace(/[\s\-\_\.]/g, '').toLowerCase();
    return cleanNorm.includes(poiNorm) || poiNorm.includes(cleanNorm);
  });

  if (isPoiName) {
    return; // 명소명 단독 입력은 큐에 저장하지 않음
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
        pushQuestionToCloud(existing[existingIndex]);
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

      // 🌐 4. 클라우드 DB 실시간 비동기 전송
      pushQuestionToCloud(entry);
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

  // 🛡️ 사용자 구체적 여행 조건 입력 (예: "2박 3일 커플 여행, 테마: 맛집, 카페", "도착이고", "숙소는")은 일반 Q&A 가로채기 100% 방지!
  const isTripConfigDirective = /(\d+\s*박|\d+\s*일|당일치기|커플\s*여행|가족\s*여행|친구\s*여행|혼자\s*여행|테마:\s*|\d{1,2}시\s*도착|도착이고|도착이야|도착해서|숙소는|호텔은|제공항|제주공항|김포공항|인천공항|부산역|서울역)/i.test(clean);
  if (isTripConfigDirective) {
    return null;
  }

  const baseVault = getVoraQnaVault() || [];
  let combinedVault = Array.isArray(baseVault) ? [...baseVault] : [];
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

    // 1. Exact, Substring & Fuzzy Variation Match (Level 1 - Score: 75~100)
    for (const variation of (item.questionVariations || [])) {
      const normVar = (variation || '').toLowerCase().replace(/[\s\-_?!.~,]/g, '');
      if (!normVar) continue;
      if (normalizedQuery === normVar) {
        score = Math.max(score, 100);
        break;
      }
      if (normalizedQuery.includes(normVar) || (normVar.length >= 3 && normVar.includes(normalizedQuery))) {
        score = Math.max(score, 85);
      } else if (normVar.length >= 3 && Math.abs(normVar.length - normalizedQuery.length) <= 1) {
        // Fuzzy edit distance for typo tolerance (e.g. 욕지도 vs 욕지)
        const dist = calcLevenshtein(normVar, normalizedQuery);
        if (dist === 1) {
          score = Math.max(score, 80);
        }
      }
    }

    // 🌟 1-2. Title & Multilingual Alias Match (e.g. 'gwanggyosan' <-> '광교산', '光教山')
    const itemTitle = (item.title || item.questionVariations?.[0] || '').trim();
    if (score < 85 && itemTitle) {
      const normTitle = itemTitle.toLowerCase().replace(/[\s\-_?!.~,]/g, '');
      if (normalizedQuery === normTitle) {
        score = Math.max(score, 100);
      } else if (normalizedQuery.includes(normTitle) || (normTitle.length >= 3 && normTitle.includes(normalizedQuery))) {
        score = Math.max(score, 85);
      }
      
      // Check answers text in target language for title keyword mentions
      const enAnswer = (item.answers?.en || item.geminiAnswer?.en || '').toLowerCase();
      if (enAnswer && enAnswer.includes(normalizedQuery) && normalizedQuery.length >= 4) {
        score = Math.max(score, 85);
      }
    }

    // 2. City Relevance Check (질문 자체에 높은 점수(>=75)로 매칭된 경우 도시 제한 프리패스!)
    const cityMatches = (item.targetCity === 'all') || !targetCity || (item.targetCity === targetCity) || (score >= 75);
    if (!cityMatches && item.targetCity !== 'all') {
      continue; // Skip generic items specific to other cities
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
    const rawAnswer = (bestMatch.answers && (bestMatch.answers[lang] || (lang === 'zht' && bestMatch.answers.zh)))
      || (bestMatch.geminiAnswer && (bestMatch.geminiAnswer[lang] || (lang === 'zht' && bestMatch.geminiAnswer.zh)))
      || bestMatch.answers?.ko 
      || bestMatch.geminiAnswer?.ko 
      || bestMatch.answers?.en 
      || bestMatch.geminiAnswer?.en || '';

    const templateVars = {
      city: displayCity,
      season: activeSeason,
      hotel: context.tripMemory?.hotelArea || (lang === 'en' ? 'Hotel' : lang === 'ja' ? 'ホテル' : (lang === 'zh' || lang === 'zht') ? '酒店' : '숙소'),
      gateway: context.tripMemory?.gateway || (lang === 'en' ? 'Airport' : lang === 'ja' ? '空港・駅' : (lang === 'zh' || lang === 'zht') ? '机场/车站' : '공항/역')
    };

    let reply = interpolateTemplate(rawAnswer, templateVars);
    let followUp = interpolateTemplate(bestMatch.followUp || '', templateVars);
    let baseChips = bestMatch.suggestedChips || [];

    // 🏨 [지능형 호텔/숙소 큐레이션 엔진] 내륙 vs 해안 도시별 제미나이 정품 숙소 답변 장착!
    const isHotelQuery = bestMatch.category === 'HOTEL' || /(호텔|숙소|리조트|펜션|스테이|hotel|stay)/i.test(bestMatch.id) || /(호텔|숙소|리조트|펜션|스테이|호캉스|게스트하우스|게하|hotel|stay|resort)/i.test(query);
    if (isHotelQuery) {
      const cityKnowledge = CITY_LOCAL_KNOWLEDGE[targetCity || '서울'] || CITY_LOCAL_KNOWLEDGE['서울'];
      const hotelList = cityKnowledge?.signatureHotels || [];
      const hotelType = cityKnowledge?.hotelType || 'inland';

      if (hotelList.length > 0) {
        const hotelLines = hotelList.map((h, i) => `${i + 1}. **${h.name}** (${h.type})\n   - ${h.desc}`).join('\n');
        reply = (lang === 'en')
          ? `Here are top curated hotel picks for **${displayCity}**! 🏨✨\n\n${hotelLines}\n\n💡 *Let me know your preferred area or style (luxury, budget, ocean view, hanok stay)!* 😊`
          : (lang === 'ja')
          ? `**${displayCity}**で評価と立地が抜群のおすすめ宿泊施設です！🏨✨\n\n${hotelLines}\n\n💡 *ご希望のエリアやスタイル（コスパ、ラグジュアリーホテル、韓屋ステイ）をお知らせください！😊*`
          : (lang === 'zh' || lang === 'zht')
          ? `为您精选 **${displayCity}** 口碑与地理位置绝佳的优质酒店与住宿！🏨✨\n\n${hotelLines}\n\n💡 *如您有偏好的区域或住宿风格（高性价比、海景轻奢、传统韩屋），随时告诉我！😊*`
          : `**${displayCity}**에서 평점과 접근성이 가장 뛰어난 추천 숙소 큐레이션이에요! 🏨✨\n\n${hotelLines}\n\n💡 *원하시는 권역이나 스타일(가성비, 럭셔리 호캉스, 감성 한옥)을 말씀해 주시면 딱 맞춰 드릴게요! 😊*`;
        
        followUp = (lang === 'en')
          ? `Shall I include this accommodation into your ${displayCity} itinerary?`
          : (lang === 'ja')
          ? `この宿泊先を拠点に${displayCity}の旅程を作成しましょうか？🚀`
          : (lang === 'zh' || lang === 'zht')
          ? `是否将此住宿设为据点为您规划${displayCity}专属行程？🚀`
          : `이 숙소를 거점으로 ${displayCity} 일정을 바로 잡아드릴까요? 🚀`;

        if (hotelType === 'coastal') {
          baseChips = [
            (lang === 'en' ? '🌊 Ocean View Luxury' : lang === 'ja' ? '🌊 オーシャンビュー 高級ホテル' : (lang === 'zh' || lang === 'zht') ? '🌊 海景轻奢酒店' : '🌊 오션뷰 럭셔리 호텔'),
            (lang === 'en' ? '🏖️ Ocean View Pool Villa' : lang === 'ja' ? '🏖️ オーシャンビュー プールヴィラ' : (lang === 'zh' || lang === 'zht') ? '🏖️ 海景独栋泳池别墅' : '🏖️ 오션뷰 감성 풀빌라'),
            (lang === 'en' ? '🏨 Value Top Hotel' : lang === 'ja' ? '🏨 コスパ人気ホテル' : (lang === 'zh' || lang === 'zht') ? '🏨 高性价比人气酒店' : '🏨 가성비 인기 호텔')
          ];
        } else if (hotelType === 'heritage') {
          baseChips = [
            (lang === 'en' ? '🏮 Traditional Hanok Stay' : lang === 'ja' ? '🏮 伝統韓屋ステイ' : (lang === 'zh' || lang === 'zht') ? '🏮 传统韩屋特色住宿' : '🏮 전통 한옥 스테이'),
            (lang === 'en' ? '🏨 Lake View Resort' : lang === 'ja' ? '🏨 レイクビュー リゾート' : (lang === 'zh' || lang === 'zht') ? '🏨 湖景度假村' : '🏨 호수/전경 뷰 리조트'),
            (lang === 'en' ? '🏢 Downtown Hotel' : lang === 'ja' ? '🏢 市内中心部ホテル' : (lang === 'zh' || lang === 'zht') ? '🏢 市中心便利酒店' : '🏢 도심 가성비 호텔')
          ];
        } else {
          baseChips = [
            (lang === 'en' ? '🏙️ Luxury City Staycation' : lang === 'ja' ? '🏙️ シティホカンス＆夜景' : (lang === 'zh' || lang === 'zht') ? '🏙️ 城市景观奢华度假' : '🏙️ 럭셔리 호캉스 & 전망'),
            (lang === 'en' ? '🏮 Private Hanok Stay' : lang === 'ja' ? '🏮 北村・韓屋ステイ' : (lang === 'zh' || lang === 'zht') ? '🏮 北村特色韩屋' : '🏮 북촌/감성 한옥 스테이'),
            (lang === 'en' ? '🏨 Shopping & Transit Hotel' : lang === 'ja' ? '🏨 ショッピング・駅近ホテル' : (lang === 'zh' || lang === 'zht') ? '🏨 购物地段近地铁酒店' : '🏨 쇼핑 & 역세권 호텔')
          ];
        }
      }
    }

    // 🌃 [지능형 야경 큐레이션 엔진] 도시별 제미나이 정품 야경 명소 답변 장착!
    const isNightQuery = bestMatch.category === 'NIGHT_VIEW' || /(야경|night|밤야경|야경명소|야경맛집|야간명소)/i.test(bestMatch.id) || /(야경|밤\s*야경|야경\s*맛집|야경\s*명소|야간\s*명소|밤에\s*갈|나이트뷰)/i.test(query);
    if (isNightQuery) {
      const cityKnowledge = CITY_LOCAL_KNOWLEDGE[targetCity || '서울'] || CITY_LOCAL_KNOWLEDGE['서울'];
      const nightList = cityKnowledge?.nightHighlights || [];
      if (nightList.length > 0) {
        const nightLines = nightList.map((n, i) => `${i + 1}. **${n.name}**\n   - ${n.desc}`).join('\n');
        reply = (lang === 'en')
          ? `Here are the most breathtaking night view spots in **${displayCity}**! 🌃✨\n\n${nightLines}\n\n💡 *Would you like me to add these night spots to your evening schedule (after 17:00)?* 😊`
          : (lang === 'ja')
          ? `**${displayCity}**で最もロマンチックな代表的夜景スポットです！🌃✨\n\n${nightLines}\n\n💡 *夕方以降（17:00〜）の日程に夜景コースを組み込みましょうか？🚀*`
          : (lang === 'zh' || lang === 'zht')
          ? `为您呈现 **${displayCity}** 最具魅力的绝美夜景观赏胜地！🌃✨\n\n${nightLines}\n\n💡 *是否将心仪的夜景名胜直接加入今晚的行程（17:00以后）？🚀*`
          : `**${displayCity}**에서 가장 아름다운 대표 야경 & 나이트 명소 큐레이션이에요! 🌃✨\n\n${nightLines}\n\n💡 *이 중 마음에 드는 야경 명소를 오늘 저녁 코스(17:00 이후)에 바로 쏙 넣어드릴까요? 🚀*`;
        
        followUp = (lang === 'en')
          ? `Shall I add this night view into your ${displayCity} evening course?`
          : (lang === 'ja')
          ? `この夜景スポットを夕方の日程に反映させましょうか？🚀`
          : (lang === 'zh' || lang === 'zht')
          ? `是否将此夜景名胜加入${displayCity}晚间行程？🚀`
          : `이 야경 명소를 저녁 일정에 바로 반영해 드릴까요? 🚀`;

        baseChips = [
          (lang === 'en' ? '🚀 Add to Evening Plan' : lang === 'ja' ? '🚀 夜景コースに追加' : (lang === 'zh' || lang === 'zht') ? '🚀 加入晚间夜景' : '🚀 저녁 야경 코스에 추가'),
          nightList[0]?.name ? `🗼 ${nightList[0].name.split('&')[0].trim()}` : '🗼 대표 야경 스팟',
          nightList[1]?.name ? `🌌 ${nightList[1].name.split('&')[0].trim()}` : '🌌 감성 성곽/해변'
        ];
      }
    }

    // ☕ [지능형 감성 카페 큐레이션 엔진] 도시별 대표 카페거리 답변 장착!
    const isCafeQuery = /(카페|디저트|cafe|커피)/i.test(bestMatch.id) || /(카페|감성\s*카페|카페거리|디저트|베이커리|커피)/i.test(query);
    if (isCafeQuery && !isHotelQuery && !isNightQuery) {
      const cityKnowledge = CITY_LOCAL_KNOWLEDGE[targetCity || '서울'] || CITY_LOCAL_KNOWLEDGE['서울'];
      const cafeList = cityKnowledge?.cafeHighlights || [];
      if (cafeList.length > 0) {
        const cafeLines = cafeList.map((c, i) => `${i + 1}. **${c.name}**\n   - ${c.desc}`).join('\n');
        reply = (lang === 'en')
          ? `Here are top curated aesthetic cafe trails in **${displayCity}**! ☕🍰\n\n${cafeLines}\n\n💡 *Shall I weave a relaxing cafe break into your afternoon itinerary?* 😊`
          : (lang === 'ja')
          ? `**${displayCity}**で雰囲気も味も大人気のおすすめカフェ通りです！☕🍰\n\n${cafeLines}\n\n💡 *午後のひと休み（14:00〜16:00）にカフェ時間を追加しましょうか？😊*`
          : (lang === 'zh' || lang === 'zht')
          ? `精选 **${displayCity}** 环境绝美且咖啡醇香的人气咖啡街区！☕🍰\n\n${cafeLines}\n\n💡 *是否在午后行程（14:00~16:00）中加入惬意的咖啡时光？😊*`
          : `**${displayCity}**에서 분위기와 커피 맛이 검증된 대표 감성 카페거리 큐레이션이에요! ☕🍰\n\n${cafeLines}\n\n💡 *나른한 오후 일정(14:00~16:00)에 감성 카페 쉼표를 쏙 넣어드릴까요? 😊*`;

        followUp = (lang === 'en')
          ? `Shall I include this cafe into your afternoon itinerary?`
          : (lang === 'ja')
          ? `このカフェを午後の行程に追加しましょうか？🚀`
          : (lang === 'zh' || lang === 'zht')
          ? `是否将该咖啡馆加入您的午后行程？🚀`
          : `이 감성 카페를 오후 일정에 바로 넣어드릴까요? 🚀`;

        baseChips = [
          (lang === 'en' ? '🚀 Add Cafe to Itinerary' : lang === 'ja' ? '🚀 午後カフェを追加' : (lang === 'zh' || lang === 'zht') ? '🚀 加入午后咖啡' : '🚀 오후 카페 일정에 추가'),
          cafeList[0]?.name ? `☕ ${cafeList[0].name.split('/')[0].trim()}` : '☕ 핫플 카페거리',
          cafeList[1]?.name ? `🍰 ${cafeList[1].name.split('/')[0].trim()}` : '🍰 감성 디저트'
        ];
      }
    }

    const actionChip = (lang === 'en' ? '🚀 Build Itinerary Now' : lang === 'ja' ? '🚀 今すぐ日程を作成' : (lang === 'zh' || lang === 'zht') ? '🚀 立即生成行程' : '🚀 바로 일정 만들기');
    // 중복 제거 및 [바로 일정 만들기] 0번 배치
    const cleanChips = baseChips.filter(c => !c.includes('일정 생성') && !c.includes('바로 일정') && !c.includes('일정 짜줘') && !c.includes('Build Itinerary') && !c.includes('日程を作成') && !c.includes('生成行程'));
    const chipsWithAction = [actionChip, ...cleanChips];

    return {
      matched: true,
      id: bestMatch.id,
      category: bestMatch.category,
      reply,
      followUp,
      suggestedChips: chipsWithAction,
      isTikitaka: true,
      score: highestScore
    };
  }

  // Not matched in vault -> Log to unanswered queue for future Gemini batch training!
  logUnansweredQuestion(query, targetCity, context);
  return null;
}
