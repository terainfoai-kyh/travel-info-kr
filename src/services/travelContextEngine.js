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
 * - Dynamic Overrides: Updates context when user changes mind (e.g. "Actually I'm going solo")
 * - 3-Layer Response Framework: [1. Empathy/Context Recognition -> 2. Logical Reason -> 3. Actionable Next Step]
 */

/**
 * Updates persistent session context from user prompt
 */
export function updateSessionContext(prevContext = {}, userPrompt = '') {
  const clean = (userPrompt || '').toLowerCase();

  // Companion analysis with dynamic overwrite
  let companion = prevContext.companion || { isKids: false, isElder: false, isCouple: false, isSolo: false, type: '일반' };
  
  if (/(아이|어린이|유아|아기|키즈|초등)/.test(clean)) {
    companion = { isKids: true, isElder: false, isCouple: false, isSolo: false, type: '아이 동반' };
  } else if (/(어르신|부모님|시니어|효도|할머니|할아버지)/.test(clean)) {
    companion = { isKids: false, isElder: true, isCouple: false, isSolo: false, type: '부모님 동반' };
  } else if (/(커플|연인|데이트|로맨틱|신혼)/.test(clean)) {
    companion = { isKids: false, isElder: false, isCouple: true, isSolo: false, type: '커플/데이트' };
  } else if (/(혼자|나홀로|솔로|1인)/.test(clean)) {
    companion = { isKids: false, isElder: false, isCouple: false, isSolo: true, type: '나홀로 여행' };
  }

  // Preferences analysis
  const prevPrefs = prevContext.preferences || {};
  const isMinimalWalking = /(걷기 싫|다리 아|많이 안 걷|편하게|유모차|안 걸)/.test(clean) || prevPrefs.isMinimalWalking;
  const isFoodie = /(맛집|미식|먹방|푸드|맛있는)/.test(clean) || prevPrefs.isFoodie;
  const isCafe = /(카페|디저트|베이커리|커피)/.test(clean) || prevPrefs.isCafe;
  const isPhoto = /(사진|인생샷|포토존|뷰|인스타)/.test(clean) || prevPrefs.isPhoto;
  const isShopping = /(쇼핑|패션|백화점|아울렛|소품샵)/.test(clean) || prevPrefs.isShopping;
  const isHealing = /(힐링|휴식|자연|숲|바다|산책)/.test(clean) || prevPrefs.isHealing;

  // Weather override
  const isRainQuery = /(비|우천|비오는|폭우|실내)/.test(clean);

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
    lastUpdatedPrompt: userPrompt
  };
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
    totalSpotsToday: existingSpots.length
  };
}

/**
 * 3-Layer Response Generator:
 * Layer 1: Empathy & Context Recognition
 * Layer 2: Logical Judgement & Reason
 * Layer 3: Actionable Next Step
 */
export function generateContextualAdvice(context, lang = 'ko') {
  const { targetCity, activeDay, timeSlotLabel, weather, companion, preferences } = context;

  // Layer 1: Empathy Intro
  let layer1 = `**${targetCity}** 여행 코스를 살펴보고 계시군요 😊`;
  if (companion.isKids) {
    layer1 = `아이와 함께하는 **${targetCity}** 여행이시군요 🎈`;
  } else if (companion.isElder) {
    layer1 = `부모님·어르신을 모시는 **${targetCity}** 힐링 여행이시군요 🌿`;
  } else if (companion.isCouple) {
    layer1 = `두 분만의 로맨틱한 **${targetCity}** 데이트 코스네요 💖`;
  } else if (companion.isSolo) {
    layer1 = `나홀로 여유롭게 즐기는 **${targetCity}** 힐링 여행이시군요 🍃`;
  }

  // Layer 2: Logical Judgement based on Weather & Preferences
  let layer2 = `${activeDay}일차 ${timeSlotLabel} 동선에 최적화된 추천 명소를 엄선했어요.`;
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
    ? `Tap **[ ＋ Add to Day ${activeDay} ]** on any spot below to seamlessly add it to your itinerary!`
    : `원하시는 장소 아래 **[ ＋ ${activeDay}일차 일정에 추가 ]**를 누르시면 내 일정표에 바로 쏙 들어갑니다! 😊`;

  if (lang === 'en') {
    let enIntro = `Planning your trip to **${targetCity}**! ✨`;
    if (companion.isKids) enIntro = `Traveling with kids in **${targetCity}**! 🎈`;
    else if (companion.isElder) enIntro = `A relaxing trip with parents in **${targetCity}**! 🌿`;
    
    let enReason = `Here are the top curated spots optimized for Day ${activeDay} (${timeSlotLabel}).`;
    if (weather.isRainy) enReason = `Since it's rainy today, I picked comfortable indoor cultural spots and cozy cafes! ☔`;

    return `${enIntro}\n${enReason}\n\n${layer3}`;
  }

  return `${layer1}\n${layer2}\n\n${layer3}`;
}
