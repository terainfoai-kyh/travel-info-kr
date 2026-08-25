/**
 * KoreaTravel Travel Context Engine (🧩 여행 컨텍스트 엔진 2.0)
 * 
 * Architecture (3-Tier State Manager with Patch Updates):
 * 1. Trip Memory: Long-term trip identity (destination, days, companions, preferences)
 * 2. Current Context: Real-time runtime environment (currentCity, activeDay, timeSlot, weather)
 * 3. Patch Update Logic: Specific fields are patched incrementally without wipeouts (User Input > Previous Memory)
 * 4. Distinct Intent Router: Classifies user intent cleanly before routing to POI DB or Gemini.
 */

export const INITIAL_TRAVEL_STATE = {
  tripMemory: {
    destination: '서울',
    days: 3,
    companion: { isKids: false, isElder: false, isCouple: false, isSolo: false, type: '일반' },
    preferences: {
      isMinimalWalking: false,
      isFoodie: false,
      isCafe: false,
      isPhoto: false,
      isShopping: false,
      isHealing: false
    },
    isRainPreferred: false
  },
  currentContext: {
    currentCity: '서울',
    activeDay: 1,
    timeSlot: 'lunch',
    timeSlotLabel: '점심',
    weather: { isRainy: false, isHot: false, isCold: false, summary: '쾌적' }
  },
  lastIntent: 'INITIAL',
  lastUpdatedPrompt: '',
  hasNewCondition: false
};

/**
 * 🎯 Intent Classification
 */
export function classifyUserIntent(userPrompt = '', currentState = INITIAL_TRAVEL_STATE) {
  const clean = (userPrompt || '').trim().toLowerCase();

  // 1. Explicit Full Itinerary Build Intent
  const isExplicitBuild = /(전체\s*일정표\s*(만들|짜|생성|보기)|일정\s*(확정|완성|생성해줘|만들어줘|짜줘)|일정표\s*(보여줘|만들어줘)|이\s*조건으로\s*전체\s*일정)/.test(clean);
  if (isExplicitBuild) {
    return 'REGENERATE_ITINERARY';
  }

  // 2. Days / Duration Change Intent ("4일로 변경해줘", "2박으로 바꿔줘")
  const isDaysChange = /(\d+일|\d+박|하루|이틀|사흘|나흘).*(바꿔|변경|늘려|수정|할래|해줘)/.test(clean);
  if (isDaysChange) {
    return 'ADD_OR_PATCH_CONDITION';
  }

  // 3. Destination Switch Intent ("서울로 갈래", "부산으로 바꿔줘")
  const isDestChange = /(으?로\s*(바꿔|변경|갈래|가자|수정|할래)|대신\s*)/.test(clean) && !/(일정|코스|날짜|기간)/.test(clean);
  if (isDestChange) {
    return 'UPDATE_DESTINATION';
  }

  // 4. Question / Verification / Chit-Chat Intent
  const isQuestion = /(\?|왜|바꿨|맞아|어때|얼마|뭐야|누구|안녕|감사|고마워)/.test(clean);
  if (isQuestion || clean.endsWith('?') || clean.endsWith('네') || clean.endsWith('요')) {
    return 'CONFIRM_OR_QUERY';
  }

  // 4. Condition / Preference / Destination Setup
  return 'ADD_OR_PATCH_CONDITION';
}

/**
 * 🧩 Patch-Update State Transition (User Input > Previous Memory)
 */
export function patchTravelState(prevState = INITIAL_TRAVEL_STATE, userPrompt = '', detectedCity = null, parsedDays = null) {
  const clean = (userPrompt || '').toLowerCase();
  const intent = classifyUserIntent(userPrompt, prevState);
  let hasNewCondition = false;

  const prevTrip = prevState.tripMemory || INITIAL_TRAVEL_STATE.tripMemory;
  const prevPrefs = prevTrip.preferences || INITIAL_TRAVEL_STATE.tripMemory.preferences;
  const prevComp = prevTrip.companion || INITIAL_TRAVEL_STATE.tripMemory.companion;

  // 1. Patch Destination & Days
  let nextDestination = prevTrip.destination || '서울';
  if (detectedCity) {
    nextDestination = detectedCity;
    if (detectedCity !== prevTrip.destination) {
      hasNewCondition = true;
    }
  }

  let nextDays = prevTrip.days || 3;
  if (parsedDays && parsedDays > 0) {
    nextDays = parsedDays;
  }

  // 2. Patch Companions (Incremental update, respects user overrides)
  let nextCompanion = { ...prevComp };
  if (/(아이|어린이|유아|아기|키즈|초등)/.test(clean)) {
    if (!nextCompanion.isKids) hasNewCondition = true;
    nextCompanion = { isKids: true, isElder: false, isCouple: false, isSolo: false, type: '아이 동반' };
  } else if (/(어르신|부모님|시니어|효도|할머니|할아버지)/.test(clean)) {
    if (!nextCompanion.isElder) hasNewCondition = true;
    nextCompanion = { isKids: false, isElder: true, isCouple: false, isSolo: false, type: '부모님 동반' };
  } else if (/(커플|연인|데이트|로맨틱|신혼)/.test(clean)) {
    if (!nextCompanion.isCouple) hasNewCondition = true;
    nextCompanion = { isKids: false, isElder: false, isCouple: true, isSolo: false, type: '커플/데이트' };
  } else if (/(혼자|나홀로|솔로|1인)/.test(clean)) {
    if (!nextCompanion.isSolo) hasNewCondition = true;
    nextCompanion = { isKids: false, isElder: false, isCouple: false, isSolo: true, type: '나홀로 여행' };
  }

  // 3. Patch Preferences (Supports both activation and removal/negation)
  let nextPrefs = { ...prevPrefs };

  // Minimal walking
  if (/(걷기 싫|다리 아|많이 안 걷|편하게|유모차|안 걸)/.test(clean)) {
    nextPrefs.isMinimalWalking = true;
    hasNewCondition = true;
  } else if (/(걷는 건 괜찮|많이 걸어도|도보 좋아)/.test(clean)) {
    nextPrefs.isMinimalWalking = false;
  }

  // Foodie
  if (/(맛집|미식|먹방|푸드|맛있는)/.test(clean)) {
    nextPrefs.isFoodie = true;
    hasNewCondition = true;
  }

  // Cafe
  if (/(카페|디저트|베이커리|커피)/.test(clean)) {
    nextPrefs.isCafe = true;
    hasNewCondition = true;
  }

  // Photo
  if (/(사진|인생샷|포토존|뷰|인스타)/.test(clean)) {
    nextPrefs.isPhoto = true;
    hasNewCondition = true;
  }

  // Shopping
  if (/(쇼핑|패션|백화점|아울렛|소품샵)/.test(clean)) {
    nextPrefs.isShopping = true;
    hasNewCondition = true;
  }

  // Healing
  if (/(힐링|휴식|자연|숲|바다|산책)/.test(clean)) {
    nextPrefs.isHealing = true;
    hasNewCondition = true;
  }

  // Rain preference
  let nextRain = prevTrip.isRainPreferred || false;
  if (/(비|우천|비오는|폭우|실내)/.test(clean)) {
    nextRain = true;
    hasNewCondition = true;
  }

  // Next State Assembly
  const nextState = {
    tripMemory: {
      destination: nextDestination,
      days: nextDays,
      companion: nextCompanion,
      preferences: nextPrefs,
      isRainPreferred: nextRain
    },
    currentContext: {
      ...prevState.currentContext,
      currentCity: nextDestination
    },
    lastIntent: intent,
    lastUpdatedPrompt: userPrompt,
    hasNewCondition
  };

  // 📋 Console State Transition Log (Debugging Transparency)
  console.log('[VORA STATE TRANSITION]', {
    BEFORE: { destination: prevTrip.destination, companion: prevComp.type },
    INTENT: intent,
    AFTER: { destination: nextDestination, companion: nextCompanion.type, hasNewCondition }
  });

  return nextState;
}

/**
 * Removes a specific context chip when user taps [✕]
 */
export function removeContextChip(prevState = INITIAL_TRAVEL_STATE, chipId = '') {
  const trip = prevState.tripMemory || INITIAL_TRAVEL_STATE.tripMemory;
  const comp = { ...(trip.companion || {}) };
  const prefs = { ...(trip.preferences || {}) };
  let isRain = trip.isRainPreferred;

  if (chipId === 'kids') comp.isKids = false;
  if (chipId === 'elder') comp.isElder = false;
  if (chipId === 'couple') comp.isCouple = false;
  if (chipId === 'solo') comp.isSolo = false;
  if (chipId === 'rain') isRain = false;
  if (chipId === 'minimal_walking') prefs.isMinimalWalking = false;
  if (chipId === 'foodie') prefs.isFoodie = false;
  if (chipId === 'cafe') prefs.isCafe = false;
  if (chipId === 'photo') prefs.isPhoto = false;

  return {
    ...prevState,
    tripMemory: {
      ...trip,
      companion: comp,
      preferences: prefs,
      isRainPreferred: isRain
    }
  };
}

/**
 * Toggles a context chip on or off
 */
export function toggleContextChip(prevState = INITIAL_TRAVEL_STATE, chipId = '') {
  const trip = prevState.tripMemory || INITIAL_TRAVEL_STATE.tripMemory;
  const comp = { ...(trip.companion || {}) };
  const prefs = { ...(trip.preferences || {}) };
  let isRain = trip.isRainPreferred;

  if (chipId === 'kids') comp.isKids = !comp.isKids;
  if (chipId === 'elder') comp.isElder = !comp.isElder;
  if (chipId === 'couple') comp.isCouple = !comp.isCouple;
  if (chipId === 'solo') comp.isSolo = !comp.isSolo;
  if (chipId === 'rain') isRain = !isRain;
  if (chipId === 'minimal_walking') prefs.isMinimalWalking = !prefs.isMinimalWalking;
  if (chipId === 'cafe') prefs.isCafe = !prefs.isCafe;
  if (chipId === 'foodie') prefs.isFoodie = !prefs.isFoodie;
  if (chipId === 'photo') prefs.isPhoto = !prefs.isPhoto;

  return {
    ...prevState,
    tripMemory: {
      ...trip,
      companion: comp,
      preferences: prefs,
      isRainPreferred: isRain
    }
  };
}

/**
 * Returns active context chips for UI display
 */
export function getActiveContextChips(travelState = INITIAL_TRAVEL_STATE, lang = 'ko') {
  const chips = [];
  const trip = travelState.tripMemory || travelState;
  const comp = trip.companion;
  const prefs = trip.preferences || {};

  if (comp?.isKids) chips.push({ id: 'kids', label: lang === 'en' ? '👨‍👩‍👧 With Kids' : '👨‍👩‍👧 아이 동반', color: '#ec4899' });
  if (comp?.isElder) chips.push({ id: 'elder', label: lang === 'en' ? '🌿 With Parents' : '🌿 부모님 동반', color: '#10b981' });
  if (comp?.isCouple) chips.push({ id: 'couple', label: lang === 'en' ? '💖 Couple' : '💖 커플/데이트', color: '#f43f5e' });
  if (comp?.isSolo) chips.push({ id: 'solo', label: lang === 'en' ? '🍃 Solo Trip' : '🍃 나홀로 여행', color: '#06b6d4' });

  if (trip.isRainPreferred || travelState.isRainQuery) chips.push({ id: 'rain', label: lang === 'en' ? '☔ Rainy/Indoor' : '☔ 비/실내 선호', color: '#3b82f6' });
  if (prefs.isMinimalWalking) chips.push({ id: 'minimal_walking', label: lang === 'en' ? '🚶 Minimal Walking' : '🚶 걷기 적게', color: '#8b5cf6' });
  if (prefs.isCafe) chips.push({ id: 'cafe', label: lang === 'en' ? '☕ Cafe Tour' : '☕ 감성 카페', color: '#f59e0b' });
  if (prefs.isFoodie) chips.push({ id: 'foodie', label: lang === 'en' ? '🍴 Gourmet Food' : '🍴 로컬 맛집', color: '#ef4444' });
  if (prefs.isPhoto) chips.push({ id: 'photo', label: lang === 'en' ? '📸 Photo Spots' : '📸 인생샷/뷰', color: '#14b8a6' });

  return chips;
}

/**
 * Builds real-time runtime context snapshot for recommendation / advice
 */
export function buildTravelContext({
  targetCity = '서울',
  activeDay = 1,
  currentItinerary = null,
  userPrompt = '',
  weatherData = null,
  sessionState = INITIAL_TRAVEL_STATE
}) {
  const now = new Date();
  const currentHour = now.getHours();

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

  const trip = sessionState.tripMemory || sessionState;
  const isRainy = weatherData?.condition?.includes('비') || 
                  weatherData?.condition?.includes('rain') || 
                  /(비|우천|비오는|폭우|실내)/i.test(userPrompt) ||
                  trip.isRainPreferred ||
                  sessionState.isRainQuery;

  const isHot = (weatherData?.temp && weatherData.temp >= 30) || /(더위|폭염|더운)/i.test(userPrompt);
  const isCold = (weatherData?.temp && weatherData.temp <= 0) || /(추위|한파|추운)/i.test(userPrompt);

  const companion = trip.companion || { isKids: false, isElder: false, isCouple: false, isSolo: false, type: '일반' };
  const preferences = trip.preferences || {};

  const daySchedule = currentItinerary?.dailySchedules?.find(s => s.day === activeDay);
  const existingSpots = daySchedule?.spots || [];
  const existingSpotNames = existingSpots.map(s => s.title);

  return {
    targetCity: targetCity || trip.destination || '서울',
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
    hasNewCondition: sessionState.hasNewCondition,
    userPrompt: userPrompt || sessionState.lastUpdatedPrompt || ''
  };
}

/**
 * 3-Layer Response Generator (Concise Diet Version - Dynamically adapts to latest user prompt)
 */
export function generateContextualAdvice(context, lang = 'ko') {
  const { targetCity, activeDay, timeSlotLabel, weather, companion, preferences, hasNewCondition, userPrompt } = context;
  const cleanPrompt = (userPrompt || '').toLowerCase();

  // 1. Immediate Prompt Trigger Detection
  const isWalkingQuery = /(걷기 싫|다리 아|많이 안 걷|편하게|유모차|안 걸)/i.test(cleanPrompt);
  const isKidsTrigger = /(아이|어린이|유아|아기|키즈|초등)/i.test(cleanPrompt);
  const isElderTrigger = /(어르신|부모님|시니어|효도|할머니|할아버지)/i.test(cleanPrompt);
  const isCoupleTrigger = /(커플|연인|데이트|로맨틱|신혼)/i.test(cleanPrompt);
  const isSoloTrigger = /(혼자|나홀로|솔로|1인)/i.test(cleanPrompt);
  const isCafeTrigger = /(카페|디저트|베이커리|커피)/i.test(cleanPrompt);
  const isFoodieTrigger = /(맛집|미식|먹방|푸드|맛있는)/i.test(cleanPrompt);
  const isRainTrigger = /(비|우천|비오는|폭우|실내)/i.test(cleanPrompt);

  // Layer 1: Empathy Intro
  let layer1 = '';
  if (isKidsTrigger) {
    layer1 = `아이와 함께하는 **${targetCity}** 여행이시군요 🎈\n`;
  } else if (isElderTrigger) {
    layer1 = `부모님·어르신을 모시는 **${targetCity}** 힐링 여행이시군요 🌿\n`;
  } else if (isCoupleTrigger) {
    layer1 = `두 분만의 로맨틱한 **${targetCity}** 데이트 코스네요 💖\n`;
  } else if (isSoloTrigger) {
    layer1 = `나홀로 여유롭게 즐기는 **${targetCity}** 힐링 여행이시군요 🍃\n`;
  }

  // Layer 2: Logical Judgement based on specific prompt trigger & preferences
  let layer2 = `${targetCity} ${activeDay}일차 ${timeSlotLabel} 동선에 어울리는 맞춤 명소예요.`;
  if (isWalkingQuery || preferences.isMinimalWalking) {
    layer2 = `이동 부담 없이 편안하게 즐기실 수 있도록 **도보 거리가 짧고 뷰와 휴식이 뛰어난 명소** 위주로 맞췄어요 🚶‍♂️❌`;
  } else if (isRainTrigger || weather.isRainy) {
    layer2 = `비 오는 날 쾌적하게 즐길 수 있는 **실내 명소와 감성 실내 핫플** 위주로 골랐어요 ☔☕`;
  } else if (isKidsTrigger || companion.isKids) {
    layer2 = `아이들이 마음껏 보고 만질 수 있는 **오감 발달 체험 명소와 쾌적한 안심 동선**으로 준비했어요 ✨`;
  } else if (isCafeTrigger || isFoodieTrigger || preferences.isCafe || preferences.isFoodie) {
    layer2 = `현지인들이 줄 서는 **대표 시그니처 미식과 감성 로컬 카페**를 콕 집어 모았어요 🍴☕`;
  }

  // Layer 3: Action Prompt
  const layer3 = lang === 'en'
    ? `Tap **[ ＋ Add to Day ${activeDay} ]** on any spot below to add it directly!`
    : `원하시는 장소 아래 **[ ＋ ${activeDay}일차 일정에 추가 ]**를 누르시면 내 일정표에 바로 쏙 들어갑니다! 😊`;

  if (lang === 'en') {
    let enReason = isWalkingQuery
      ? `Picked spots with minimal walking and relaxed scenic views! 🚶‍♂️❌`
      : weather.isRainy
      ? `Since it's rainy today, I picked comfortable indoor cultural spots and cozy cafes! ☔`
      : `Here are the top curated spots optimized for Day ${activeDay} (${timeSlotLabel}).`;

    return `${enReason}\n\n${layer3}`;
  }

  return `${layer1}${layer2}\n\n${layer3}`;
}
