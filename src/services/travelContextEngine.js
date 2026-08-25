/**
 * KoreaTravel Travel Context Engine (🧩 여행 컨텍스트 엔진)
 * 
 * 6 Key Context Variables:
 * 1. Target City & Active Day
 * 2. Time Slot (morning, lunch, afternoon, dinner, night)
 * 3. Real-time Weather (rain, hot, cold, clear)
 * 4. Companions (kids, elderly/parents, couple, solo, friends)
 * 5. Current Day Spots & Schedule
 * 6. Travel Preferences & Vibe (minimal walking, cafes/foodie, photo/instagram, shopping, nature)
 * 
 * Architecture:
 * - Stateful Session Memory: Remembers conditions across conversation turns
 * - Dynamic Overrides & Interactive Chips: Users can inspect and dismiss conditions with [✕]
 * - Concise 3-Layer Response Framework: [1. Empathy (only on new change) -> 2. Logical Reason -> 3. Actionable Next Step]
 */

/**
 * Updates persistent session context from user prompt
 */
export function updateSessionContext(prevContext = {}, userPrompt = '') {
  const clean = (userPrompt || '').toLowerCase();
  let hasNewCondition = false;

  // Companion analysis with dynamic overwrite
  let companion = prevContext.companion || { isKids: false, isElder: false, isCouple: false, isSolo: false, type: '일반' };
  
  if (/(아이|어린이|유아|아기|키즈|초등)/.test(clean)) {
    if (!companion.isKids) hasNewCondition = true;
    companion = { isKids: true, isElder: false, isCouple: false, isSolo: false, type: '아이 동반' };
  } else if (/(어르신|부모님|시니어|효도|할머니|할아버지)/.test(clean)) {
    if (!companion.isElder) hasNewCondition = true;
    companion = { isKids: false, isElder: true, isCouple: false, isSolo: false, type: '부모님 동반' };
  } else if (/(커플|연인|데이트|로맨틱|신혼)/.test(clean)) {
    if (!companion.isCouple) hasNewCondition = true;
    companion = { isKids: false, isElder: false, isCouple: true, isSolo: false, type: '커플/데이트' };
  } else if (/(혼자|나홀로|솔로|1인)/.test(clean)) {
    if (!companion.isSolo) hasNewCondition = true;
    companion = { isKids: false, isElder: false, isCouple: false, isSolo: true, type: '나홀로 여행' };
  }

  // Preferences analysis
  const prevPrefs = prevContext.preferences || {};
  const isMinimalWalking = /(걷기 싫|다리 아|많이 안 걷|편하게|유모차|안 걸)/.test(clean) || prevPrefs.isMinimalWalking || false;
  const isFoodie = /(맛집|미식|먹방|푸드|맛있는)/.test(clean) || prevPrefs.isFoodie || false;
  const isCafe = /(카페|디저트|베이커리|커피)/.test(clean) || prevPrefs.isCafe || false;
  const isPhoto = /(사진|인생샷|포토존|뷰|인스타)/.test(clean) || prevPrefs.isPhoto || false;
  const isShopping = /(쇼핑|패션|백화점|아울렛|소품샵)/.test(clean) || prevPrefs.isShopping || false;
  const isHealing = /(힐링|휴식|자연|숲|바다|산책)/.test(clean) || prevPrefs.isHealing || false;

  // Weather override
  const isRainQuery = /(비|우천|비오는|폭우|실내)/.test(clean);
  if (isRainQuery && !prevContext.isRainQuery) {
    hasNewCondition = true;
  }

  return {
    ...prevContext,
    companion,
    preferences: {
      isMinimalWalking,
      isFoodie,
      isCafe,
      isPhoto,
      isShopping,
      isHealing
    },
    isRainQuery: isRainQuery || prevContext.isRainQuery || false,
    lastUpdatedPrompt: userPrompt,
    hasNewCondition
  };
}

/**
 * Removes a specific context chip when user taps [✕]
 */
export function removeContextChip(prevContext = {}, chipId = '') {
  const updated = { ...prevContext };
  if (chipId === 'kids') updated.companion = { ...updated.companion, isKids: false, type: '일반' };
  if (chipId === 'elder') updated.companion = { ...updated.companion, isElder: false, type: '일반' };
  if (chipId === 'couple') updated.companion = { ...updated.companion, isCouple: false, type: '일반' };
  if (chipId === 'solo') updated.companion = { ...updated.companion, isSolo: false, type: '일반' };
  if (chipId === 'rain') updated.isRainQuery = false;
  if (chipId === 'minimal_walking' && updated.preferences) updated.preferences.isMinimalWalking = false;
  if (chipId === 'foodie' && updated.preferences) updated.preferences.isFoodie = false;
  if (chipId === 'cafe' && updated.preferences) updated.preferences.isCafe = false;
  if (chipId === 'photo' && updated.preferences) updated.preferences.isPhoto = false;
  return updated;
}

/**
 * Toggles a context condition on or off
 */
export function toggleContextChip(prevContext = {}, chipId = '') {
  const updated = { ...prevContext, preferences: { ...(prevContext.preferences || {}) } };
  const comp = updated.companion || { isKids: false, isElder: false, isCouple: false, isSolo: false, type: '일반' };

  if (chipId === 'kids') {
    updated.companion = { ...comp, isKids: !comp.isKids, type: !comp.isKids ? '아이 동반' : '일반' };
  } else if (chipId === 'elder') {
    updated.companion = { ...comp, isElder: !comp.isElder, type: !comp.isElder ? '부모님 동반' : '일반' };
  } else if (chipId === 'couple') {
    updated.companion = { ...comp, isCouple: !comp.isCouple, type: !comp.isCouple ? '커플/데이트' : '일반' };
  } else if (chipId === 'solo') {
    updated.companion = { ...comp, isSolo: !comp.isSolo, type: !comp.isSolo ? '나홀로 여행' : '일반' };
  } else if (chipId === 'rain') {
    updated.isRainQuery = !updated.isRainQuery;
  } else if (chipId === 'minimal_walking') {
    updated.preferences.isMinimalWalking = !updated.preferences.isMinimalWalking;
  } else if (chipId === 'cafe') {
    updated.preferences.isCafe = !updated.preferences.isCafe;
  } else if (chipId === 'foodie') {
    updated.preferences.isFoodie = !updated.preferences.isFoodie;
  } else if (chipId === 'photo') {
    updated.preferences.isPhoto = !updated.preferences.isPhoto;
  }

  return updated;
}

/**
 * Returns active context chips for UI display
 */
export function getActiveContextChips(sessionContext = {}, lang = 'ko') {
  const chips = [];
  const comp = sessionContext.companion;
  const prefs = sessionContext.preferences || {};

  if (comp?.isKids) chips.push({ id: 'kids', label: lang === 'en' ? '👨‍👩‍👧 With Kids' : '👨‍👩‍👧 아이 동반', color: '#ec4899' });
  if (comp?.isElder) chips.push({ id: 'elder', label: lang === 'en' ? '🌿 With Parents' : '🌿 부모님 동반', color: '#10b981' });
  if (comp?.isCouple) chips.push({ id: 'couple', label: lang === 'en' ? '💖 Couple' : '💖 커플/데이트', color: '#f43f5e' });
  if (comp?.isSolo) chips.push({ id: 'solo', label: lang === 'en' ? '🍃 Solo Trip' : '🍃 나홀로 여행', color: '#06b6d4' });

  if (sessionContext.isRainQuery) chips.push({ id: 'rain', label: lang === 'en' ? '☔ Rainy/Indoor' : '☔ 비/실내 선호', color: '#3b82f6' });
  if (prefs.isMinimalWalking) chips.push({ id: 'minimal_walking', label: lang === 'en' ? '🚶 Minimal Walking' : '🚶 걷기 적게', color: '#8b5cf6' });
  if (prefs.isCafe) chips.push({ id: 'cafe', label: lang === 'en' ? '☕ Cafe Tour' : '☕ 감성 카페', color: '#f59e0b' });
  if (prefs.isFoodie) chips.push({ id: 'foodie', label: lang === 'en' ? '🍴 Gourmet Food' : '🍴 로컬 맛집', color: '#ef4444' });
  if (prefs.isPhoto) chips.push({ id: 'photo', label: lang === 'en' ? '📸 Photo Spots' : '📸 인생샷/뷰', color: '#14b8a6' });

  return chips;
}

/**
 * Builds real-time runtime context snapshot
 */
export function buildTravelContext({
  targetCity = '서울',
  activeDay = 1,
  currentItinerary = null,
  userPrompt = '',
  weatherData = null,
  sessionContext = {}
}) {
  const now = new Date();
  const currentHour = now.getHours();

  // 1. Time Slot Analysis
  let timeSlot = 'afternoon';
  let timeSlotLabel = '오후';
  if (currentHour >= 6 && currentHour < 11) {
    timeSlot = 'morning';
    timeSlotLabel = '오전';
  } else if (currentHour >= 11 && currentHour < 14) {
    timeSlot = 'lunch';
    timeSlotLabel = '점심';
  } else if (currentHour >= 14 && currentHour < 17) {
    timeSlot = 'afternoon';
    timeSlotLabel = '오후';
  } else if (currentHour >= 17 && currentHour < 21) {
    timeSlot = 'dinner';
    timeSlotLabel = '저녁';
  } else {
    timeSlot = 'night';
    timeSlotLabel = '야간';
  }

  // 2. Weather Context (Live Weather + Session Override)
  const isRainy = weatherData?.condition?.includes('비') || 
                  weatherData?.condition?.includes('rain') || 
                  /(비|우천|비오는|폭우|실내)/i.test(userPrompt) ||
                  sessionContext.isRainQuery;

  const isHot = (weatherData?.temp && weatherData.temp >= 30) || /(더위|폭염|더운)/i.test(userPrompt);
  const isCold = (weatherData?.temp && weatherData.temp <= 0) || /(추위|한파|추운)/i.test(userPrompt);

  // 3. Companion Context (Session Stateful)
  const companion = sessionContext.companion || { isKids: false, isElder: false, isCouple: false, isSolo: false, type: '일반' };
  const preferences = sessionContext.preferences || {};

  // 4. Current Day Spots Extraction
  const daySchedule = currentItinerary?.dailySchedules?.find(s => s.day === activeDay);
  const existingSpots = daySchedule?.spots || [];
  const existingSpotNames = existingSpots.map(s => s.title);

  return {
    targetCity,
    activeDay,
    currentTime: `${String(currentHour).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    timeSlot,
    timeSlotLabel,
    weather: {
      isRainy,
      isHot,
      isCold,
      summary: isRainy ? '우천 (실내 추천)' : isHot ? '폭염 (실내/카페 추천)' : isCold ? '한파 (따뜻한 실내 추천)' : '쾌적'
    },
    companion,
    preferences,
    existingSpotNames,
    totalSpotsToday: existingSpots.length,
    hasNewCondition: sessionContext.hasNewCondition
  };
}

/**
 * 3-Layer Response Generator (Concise Diet Version):
 * Layer 1: Empathy (Only shown when new condition is updated to prevent repetitive spam)
 * Layer 2: Logical Judgement & Reason
 * Layer 3: Actionable Next Step
 */
export function generateContextualAdvice(context, lang = 'ko') {
  const { targetCity, activeDay, timeSlotLabel, weather, companion, preferences, hasNewCondition } = context;

  // Layer 1: Empathy Intro (Only show on new turn or first question)
  let layer1 = '';
  if (hasNewCondition) {
    if (companion.isKids) {
      layer1 = `아이와 함께하는 **${targetCity}** 여행이시군요 🎈\n`;
    } else if (companion.isElder) {
      layer1 = `부모님·어르신을 모시는 **${targetCity}** 힐링 여행이시군요 🌿\n`;
    } else if (companion.isCouple) {
      layer1 = `두 분만의 로맨틱한 **${targetCity}** 데이트 코스네요 💖\n`;
    } else if (companion.isSolo) {
      layer1 = `나홀로 여유롭게 즐기는 **${targetCity}** 힐링 여행이시군요 🍃\n`;
    }
  }

  // Layer 2: Logical Judgement based on Weather & Preferences
  let layer2 = `${targetCity} ${activeDay}일차 ${timeSlotLabel} 동선에 어울리는 맞춤 명소예요.`;
  if (weather.isRainy && companion.isKids) {
    layer2 = `비 소식이 있고 아이와 함께 이동해야 하니, 유모차 진입이 편하고 날씨 걱정 없는 **대형 실내 아쿠아리움 및 어린이 체험관** 위주로 골랐어요 ☔`;
  } else if (weather.isRainy) {
    layer2 = `비 오는 날 쾌적하게 즐길 수 있는 **지하 직통 복합문화공간과 감성 실내 핫플** 위주로 골랐어요 ☔☕`;
  } else if (preferences.isMinimalWalking && companion.isElder) {
    layer2 = `계단과 긴 보행을 줄이고 편안하게 쉴 수 있는 **고즈넉한 평지 정원과 정갈한 보양 한식 명소**로 맞췄어요 🚶‍♂️❌`;
  } else if (companion.isKids) {
    layer2 = `아이들이 마음껏 보고 만질 수 있는 **오감 발달 체험 명소와 쾌적한 안심 동선**으로 준비했어요 ✨`;
  } else if (preferences.isCafe || preferences.isFoodie) {
    layer2 = `현지인들이 줄 서는 **대표 시그니처 미식과 감성 로컬 카페**를 콕 집어 모았어요 🍴☕`;
  }

  // Layer 3: Action Prompt
  const layer3 = lang === 'en'
    ? `Tap **[ ＋ Add to Day ${activeDay} ]** on any spot below to add it directly!`
    : `원하시는 장소 아래 **[ ＋ ${activeDay}일차 일정에 추가 ]**를 누르시면 내 일정표에 바로 쏙 들어갑니다! 😊`;

  if (lang === 'en') {
    let enIntro = hasNewCondition ? `Traveling with ${companion.type} in **${targetCity}**! ✨\n` : '';
    let enReason = weather.isRainy 
      ? `Since it's rainy today, I picked comfortable indoor cultural spots and cozy cafes! ☔`
      : `Here are the top curated spots optimized for Day ${activeDay} (${timeSlotLabel}).`;

    return `${enIntro}${enReason}\n\n${layer3}`;
  }

  return `${layer1}${layer2}\n\n${layer3}`;
}
