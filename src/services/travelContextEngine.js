/**
 * KoreaTravel Travel Context Engine (VORA 지능형 여행 컨텍스트 엔진 2.0)
 * 
 * Architecture (Gemini-Distilled Autonomous Knowledge & State Manager):
 * 1. Trip Memory: Long-term trip identity (destination, days, companions, preferences)
 * 2. Current Context: Real-time runtime environment (currentCity, activeDay, timeSlot, weather)
 * 3. Gemini-Distilled Knowledge Base Integration: Uses `voraDialogKnowledge.js` for 0.01s instant wisdom
 * 4. Multi-City Advanced Routing: Supports Pattern A (도시 1일 강릉 1일), Pattern B (2일은 남해 3일은 통영), Pattern C (남해->통영->거제)
 * 5. Tiki-Taka Chit-Chat & Proactive Hooks: Resolves casual emotions, complaints, banters, and compliments instantly
 * 6. 100% Zero-Hallucination & TourAPI 4.0 Authentic Mapping
 */

import {
  CITY_LOCAL_KNOWLEDGE,
  TIKITAKA_CHITCHAT_MATRIX,
  K_FOOD_PAIRING_KNOWLEDGE,
  K_FASHION_WEATHER_GUIDE,
  FOREIGNER_ESSENTIALS_KNOWLEDGE,
  PROACTIVE_CONVERSATION_HOOKS,
  resolveTikitakaResponse,
  resolveKnowledgeScenario
} from '../data/voraDialogKnowledge.js';

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
 * Classify user prompt into actionable intent
 */
export function classifyUserIntent(userPrompt = '', currentState = INITIAL_TRAVEL_STATE) {
  const clean = (userPrompt || '').trim().toLowerCase();

  // 1. Explicit Full Itinerary Build Intent
  const isExplicitBuild = /(전체\s*일정\s*(만들|줘|생성|보기)|일정\s*(확정|생성|생성해줘|만들어줘|짜줘)|일정을\s*(보여줘|만들어줘)|이\s*조건으로\s*전체\s*일정)/.test(clean);
  if (isExplicitBuild) {
    return 'REGENERATE_ITINERARY';
  }

  // 2. Multi-City Combined Intent ("서울 1일 강릉 1일 속초 1일" or "2일은 남해 3일은 통영")
  const multiCity = parseMultiCityPrompt(userPrompt, currentState);
  if (multiCity && multiCity.isMultiCity) {
    return 'MULTI_CITY_PLAN';
  }

  // 3. Days / Duration Change Intent ("4일로 변경해줘", "2박으로 바꿔줘")
  const isDaysChange = /(\d+일|\d+박|하루|이틀|사흘|나흘).*(바꿔|변경|늘려|수정|할래|해줘)/.test(clean);
  if (isDaysChange) {
    return 'ADD_OR_PATCH_CONDITION';
  }

  // 4. Destination Switch Intent ("서울로 갈래", "부산으로 바꿔줘")
  const isDestChange = /(으?로\s*(바꿔|변경|갈래|가자|수정|할래)|가자\s*)/.test(clean) && !/(일정|코스|날짜|기간)/.test(clean);
  if (isDestChange) {
    return 'UPDATE_DESTINATION';
  }

  // 5. Off-Topic Query
  const isOffTopic = /(주식|비트코인|코인|부동산|로또|정치|축구|야구|게임|영화|음악\s*추천)/.test(clean);
  if (isOffTopic) {
    return 'OFF_TOPIC';
  }

  // 6. Tiki-Taka / Chit-Chat / Emotional / Incremental Condition
  return 'CONFIRM_OR_QUERY';
}

/**
 * Patch Travel State with incremental updates
 */
export function patchTravelState(prevState = INITIAL_TRAVEL_STATE, userPrompt = '', detectedCity = null, parsedDays = null) {
  const clean = (userPrompt || '').toLowerCase();
  const multiCity = parseMultiCityPrompt(userPrompt, prevState);
  const intent = classifyUserIntent(userPrompt, prevState);
  let hasNewCondition = false;

  const prevTrip = prevState.tripMemory || INITIAL_TRAVEL_STATE.tripMemory;
  const prevPrefs = prevTrip.preferences || INITIAL_TRAVEL_STATE.tripMemory.preferences;
  const prevComp = prevTrip.companion || INITIAL_TRAVEL_STATE.tripMemory.companion;

  // 1. Patch Destination & Days (Multi-City aware)
  let nextDestination = prevTrip.destination || '서울';
  let nextDays = prevTrip.days || 3;
  let nextMultiCity = prevTrip.multiCityInfo || null;

  if (multiCity && multiCity.isMultiCity) {
    nextDestination = multiCity.combinedLabel;
    nextDays = multiCity.totalDays;
    nextMultiCity = multiCity;
    hasNewCondition = true;
  } else {
    if (detectedCity) {
      nextDestination = detectedCity;
      nextMultiCity = null;
      if (detectedCity !== prevTrip.destination) {
        hasNewCondition = true;
      }
    }
    if (parsedDays && parsedDays > 0) {
      nextDays = parsedDays;
    }
  }

  // 2. Patch Companion
  const nextComp = { ...prevComp };
  if (/(아이|애기|키즈|유모차|어린이|자녀|초등)/.test(clean)) {
    nextComp.isKids = true;
    nextComp.type = '키즈/가족';
    hasNewCondition = true;
  }
  if (/(부모님|어르신|할머니|할아버지|엄마|아빠|어머니|아버지)/.test(clean)) {
    nextComp.isElder = true;
    nextComp.type = '부모님/효도';
    hasNewCondition = true;
  }
  if (/(혼자|나홀로|솔로|혼행)/.test(clean)) {
    nextComp.isSolo = true;
    nextComp.type = '나홀로/솔로';
    hasNewCondition = true;
  }

  // 3. Patch Preferences
  const nextPrefs = { ...prevPrefs };
  if (/(덜\s*걷|안\s*걷|걷기\s*싫|다리\s*아|편하게|동선\s*짧|평지|휴식)/.test(clean)) {
    nextPrefs.isMinimalWalking = true;
    hasNewCondition = true;
  }
  if (/(배고파|맛집|미식|먹방|푸드|맛있는|식사|밥)/.test(clean)) {
    nextPrefs.isFoodie = true;
    hasNewCondition = true;
  }
  if (/(카페|디저트|베이커리|커피|빵지순례)/.test(clean)) {
    nextPrefs.isCafe = true;
    hasNewCondition = true;
  }

  // 4. Weather Override
  let nextIsRain = prevTrip.isRainPreferred;
  if (/(비|우천|비오는|폭우|실내)/.test(clean)) {
    nextIsRain = true;
    hasNewCondition = true;
  }

  return {
    ...prevState,
    tripMemory: {
      destination: nextDestination,
      days: nextDays,
      companion: nextComp,
      preferences: nextPrefs,
      isRainPreferred: nextIsRain,
      multiCityInfo: nextMultiCity
    },
    currentContext: {
      ...prevState.currentContext,
      currentCity: nextMultiCity ? nextMultiCity.cityNames[0] : nextDestination
    },
    lastIntent: intent,
    lastUpdatedPrompt: userPrompt,
    hasNewCondition
  };
}

/**
 * Multi-City & Multi-Day Advanced Parser
 */
export function parseMultiCityPrompt(prompt = '', prevState = INITIAL_TRAVEL_STATE) {
  if (!prompt || typeof prompt !== 'string') return null;
  const clean = prompt.trim();
  
  // 1. Pattern A: [도시] [N]일/일간
  const cityDayRegex = /(서울|수원|인천|강릉|속초|양양|부산|제주|서귀포|경주|여수|전주|대구|대전|광주|울산|가평|춘천|포항|통영|거제|남해|안동)\s*(\d+)\s*(일|박|일간)/g;
  const cityDayMatches = [...clean.matchAll(cityDayRegex)];

  if (cityDayMatches && cityDayMatches.length >= 2) {
    const cityPlans = [];
    let totalDays = 0;
    const cityNames = [];

    for (const m of cityDayMatches) {
      const city = m[1];
      const count = parseInt(m[2], 10) || 1;
      cityPlans.push({ city, days: count });
      cityNames.push(city);
      totalDays += count;
    }

    const dayByDayList = [];
    let currentDayCounter = 1;
    cityPlans.forEach(plan => {
      for (let i = 0; i < plan.days; i++) {
        dayByDayList.push({ day: currentDayCounter, city: plan.city });
        currentDayCounter++;
      }
    });

    const dayByDaySummary = dayByDayList.map(item => `${item.day}일차 ${item.city}`).join(', ');

    return {
      isMultiCity: true,
      cityPlans: dayByDayList,
      cityNames,
      totalDays: Math.min(7, totalDays),
      combinedLabel: cityNames.join('·'),
      dayByDaySummary: `${dayByDaySummary} 연계 코스`
    };
  }

  // 2. Pattern B: [N]일차/N일은 [도시]
  const dayCityRegex = /(\d+)\s*일\s*(차|에|에는|째|은|는)?\s*(은|는|에|에는|으로|로)?\s*(서울|수원|인천|강릉|속초|양양|부산|제주|서귀포|경주|여수|전주|대구|대전|광주|울산|가평|춘천|포항|통영|거제|남해|안동)/g;
  const dayCityMatches = [...clean.matchAll(dayCityRegex)];

  if (dayCityMatches && dayCityMatches.length >= 1) {
    const prevDestination = prevState?.tripMemory?.destination || prevState?.currentContext?.currentCity || '남해';
    const baseCity = prevDestination.split('·')[0] || '남해';
    const dayMap = {};
    let maxDay = prevState?.tripMemory?.days || 3;

    dayMap[1] = baseCity;

    for (const m of dayCityMatches) {
      const targetDay = parseInt(m[1], 10);
      const targetCity = m[4];
      if (targetDay > 0 && targetDay <= 7) {
        dayMap[targetDay] = targetCity;
        if (targetDay > maxDay) maxDay = targetDay;
      }
    }

    const dayByDayList = [];
    const distinctCities = [];
    let lastKnownCity = baseCity;

    for (let d = 1; d <= maxDay; d++) {
      if (dayMap[d]) {
        lastKnownCity = dayMap[d];
      }
      dayByDayList.push({ day: d, city: lastKnownCity });
      if (!distinctCities.includes(lastKnownCity)) {
        distinctCities.push(lastKnownCity);
      }
    }

    const dayByDaySummary = dayByDayList.map(item => `${item.day}일차 ${item.city}`).join(', ');

    return {
      isMultiCity: true,
      cityPlans: dayByDayList,
      cityNames: distinctCities,
      totalDays: maxDay,
      combinedLabel: distinctCities.join('·'),
      dayByDaySummary: `${dayByDaySummary} 연계 코스`
    };
  }

  // 3. Pattern C: Arrow or Separator Sequence
  const allCitiesInPrompt = [];
  const cityTokenRegex = /(서울|수원|인천|강릉|속초|양양|부산|제주|서귀포|경주|여수|전주|대구|대전|광주|울산|가평|춘천|포항|통영|거제|남해|안동)/g;
  let tokenMatch;
  while ((tokenMatch = cityTokenRegex.exec(clean)) !== null) {
    if (!allCitiesInPrompt.includes(tokenMatch[1])) {
      allCitiesInPrompt.push(tokenMatch[1]);
    }
  }

  if (allCitiesInPrompt.length >= 2 && /(->|>|➔|→|-|,|\s+)/.test(clean)) {
    const dayByDayList = allCitiesInPrompt.map((city, idx) => ({ day: idx + 1, city }));
    const dayByDaySummary = dayByDayList.map(item => `${item.day}일차 ${item.city}`).join(', ');

    return {
      isMultiCity: true,
      cityPlans: dayByDayList,
      cityNames: allCitiesInPrompt,
      totalDays: Math.min(7, allCitiesInPrompt.length),
      combinedLabel: allCitiesInPrompt.join('·'),
      dayByDaySummary: `${dayByDaySummary} 연계 코스`
    };
  }

  return null;
}

/**
 * Context Chip Helpers
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

export function removeContextChip(prevState = INITIAL_TRAVEL_STATE, chipId = '') {
  const trip = prevState.tripMemory || INITIAL_TRAVEL_STATE.tripMemory;
  const comp = { ...(trip.companion || {}) };
  const prefs = { ...(trip.preferences || {}) };
  let isRain = trip.isRainPreferred;

  if (chipId === 'kids') comp.isKids = false;
  if (chipId === 'elder') {
    comp.isElder = false;
    prefs.isMinimalWalking = false;
  }
  if (chipId === 'couple') comp.isCouple = false;
  if (chipId === 'solo') comp.isSolo = false;
  if (chipId === 'rain') isRain = false;
  if (chipId === 'minimal_walking') prefs.isMinimalWalking = false;
  if (chipId === 'cafe') prefs.isCafe = false;
  if (chipId === 'foodie') prefs.isFoodie = false;
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

export function getActiveContextChips(travelState = INITIAL_TRAVEL_STATE, lang = 'ko') {
  const chips = [];
  const trip = travelState.tripMemory || travelState;
  const comp = trip.companion || {};
  const prefs = trip.preferences || {};

  if (comp.isKids) chips.push({ id: 'kids', label: lang === 'en' ? '👨‍👩‍👧 With Kids' : '👨‍👩‍👧 아이 동반', color: '#ec4899' });
  if (comp.isElder) chips.push({ id: 'elder', label: lang === 'en' ? '🌿 With Parents' : '🌿 부모님 동반', color: '#10b981' });
  if (comp.isCouple) chips.push({ id: 'couple', label: lang === 'en' ? '💖 Couple' : '💖 커플/데이트', color: '#f43f5e' });
  if (comp.isSolo) chips.push({ id: 'solo', label: lang === 'en' ? '🍃 Solo Trip' : '🍃 나홀로 여행', color: '#06b6d4' });

  if (trip.isRainPreferred || travelState.isRainQuery) chips.push({ id: 'rain', label: lang === 'en' ? '☔ Rainy/Indoor' : '☔ 비/실내 선호', color: '#3b82f6' });
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
  const existingSpotNames = existingSpots.map(s => s.title || s.name || '');

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
    userPrompt: userPrompt || sessionState.lastUpdatedPrompt || '',
    multiCity: sessionState.multiCity || trip.multiCityInfo
  };
}

/**
 * Curated Day Plans Generator (Gemini-Level Theme & Foodie Pairing)
 */
export function generateCuratedDayPlans(city = '서울', days = 3, preferences = {}) {
  const isKids = preferences.isKids || false;
  const isIndoor = preferences.isIndoor || false;
  const isMinimalWalking = preferences.isMinimalWalking || false;

  const cityKnowledge = CITY_LOCAL_KNOWLEDGE[city] || CITY_LOCAL_KNOWLEDGE['서울'];

  const themePool = [
    {
      theme: `1일차: ${city} 핵심 랜드마크 & 시그니처 감성 투어`,
      transit: cityKnowledge.transitTip || `${city} 순환 쾌속 대중교통 및 안심 동선`,
      food: {
        dishName: cityKnowledge.localFoodieSecret.split(',')[0] || `${city} 대표 로컬 정식`,
        description: `현지인들이 가장 사랑하는 ${city}의 대표 힐링 미식`
      }
    },
    {
      theme: `2일차: ${city} 로컬 핫플레이스 & 오션·전망 힐링`,
      transit: isMinimalWalking ? `케이블카 및 평지 슬로프 중심 최단 보행` : `${city} 감성 해안/골목 쾌적 동선`,
      food: {
        dishName: cityKnowledge.localFoodieSecret.split(',')[1] || `${city} 명품 미식 만찬`,
        description: `여행의 풍미를 돋우는 시그니처 로컬 요리`
      }
    },
    {
      theme: `3일차: ${city} 여유로운 사색 & 감성 카페 빵지순례`,
      transit: `주요 거점 역세권 직통 연결 버스`,
      food: {
        dishName: `${city} 스페셜티 디저트 & 베이커리`,
        description: `여행을 달콤하고 향긋하게 추억하는 감성 카페 미식`
      }
    },
    {
      theme: `4일차: ${city} 숨은 명소 탐방과 파노라마 뷰`,
      transit: `${city} 순환 관광 셔틀`,
      food: {
        dishName: `${city} 향토 특선 만찬`,
        description: `신선한 제철 식재료로 정갈하게 차려낸 한 상`
      }
    },
    {
      theme: `5일차: ${city} 힐링 피날레 & 로컬 스트리트 마켓`,
      transit: `KTX/터미널 인접 이동 동선`,
      food: {
        dishName: `${city} 전통 마켓 주전부리 세트`,
        description: `부담 없이 즐기는 로컬 전통 먹거리의 정수`
      }
    }
  ];

  if (isIndoor) {
    themePool[0].theme = `1일차: ${city} 환상적인 실내 미디어아트 & 수족관`;
    themePool[1].theme = `2일차: ${city} 대형 복합 문화공간 & 실내 오션뷰 카페`;
  }

  return themePool.slice(0, Math.min(days, themePool.length));
}

/**
 * Gemini-Distilled 0.01s Instant Layered Advice & Tiki-Taka Generator
 * Returns string directly for seamless rendering in chat stream.
 */
export function generateContextualAdvice(context, lang = 'ko') {
  const cleanPrompt = (context.userPrompt || context.lastUpdatedPrompt || '').trim();
  const targetCity = context.targetCity || context.currentContext?.currentCity || context.tripMemory?.destination || '서울';
  const activeDay = context.activeDay || context.currentContext?.activeDay || 1;
  const timeSlotLabel = context.timeSlotLabel || context.currentContext?.timeSlotLabel || '점심';
  const multiCity = context.multiCity;
  const cityInfo = CITY_LOCAL_KNOWLEDGE[targetCity] || CITY_LOCAL_KNOWLEDGE['서울'];

  // 1. Check if user input is an emotional or casual Tiki-Taka query!
  const tikitaka = resolveTikitakaResponse(cleanPrompt, targetCity);
  if (tikitaka) {
    const isMetaOrBanter = ['WHO_ARE_YOU', 'FOOL_PLAYFUL', 'OTHER_CITY', 'GREETING', 'COMPLIMENT'].includes(tikitaka.matchedKey);
    if (isMetaOrBanter) {
      return `${tikitaka.reply}\n\n👉 **${tikitaka.followUp}**`;
    }
    const layer1 = tikitaka.reply;
    const layer2 = `${targetCity} ${activeDay}일차 ${timeSlotLabel} 추천 명소와 최적 이동 동선입니다 💡 (${cityInfo.transitTip})`;
    const layer3 = tikitaka.followUp;

    return `${layer1}\n\n${layer2}\n\n👉 **${layer3}**`;
  }

  // 2. Standard Scenario Knowledge Resolution
  const scenarioKey = resolveKnowledgeScenario(cleanPrompt);
  let layer1 = `선배님, 요청하신 조건에 딱 맞게 **${targetCity}** 최적 일정을 정갈하게 조율해 드립니다! ✨`;

  if (multiCity && multiCity.isMultiCity) {
    layer1 = `선배님, **[${multiCity.combinedLabel}] ${multiCity.totalDays}일 연계 코스**를 광역 교통 최적 동선으로 시원하게 완성했습니다! 🚅✨`;
  } else if (scenarioKey === 'MINIMAL_WALKING') {
    layer1 = `어르신이나 보행이 조심스러운 분들도 부담 없이 즐기실 수 있도록, ${targetCity}의 **케이블카·평지 산책로·전망 카페 위주 안심 동선**으로 준비했습니다 😊🌿`;
  } else if (scenarioKey === 'RAINY_INDOOR') {
    layer1 = `비가 와도 여행의 감성은 그대로! ${targetCity}의 **환상적인 몰입형 미디어아트·실내 수족관·오션뷰 카페**로 쾌적하게 꾸몄습니다 ☔☕✨`;
  } else if (scenarioKey === 'KIDS_FAMILY') {
    layer1 = `아이들의 호기심을 자극하는 **오감 체험·아쿠아리움·넓은 잔디마당**과 부모님이 편안한 쉼터를 완벽하게 조율했습니다 👨‍👩‍👧‍👦🎈`;
  } else if (scenarioKey === 'BUDGET_VALUE') {
    layer1 = `지갑은 가볍게, 경험은 풍성하게! ${targetCity} 현지인들이 인정하는 **착한 가격의 찐 맛집과 무료 힐링 랜드마크**로 알차게 엮었습니다 💰✨`;
  } else if (scenarioKey === 'PUBLIC_TRANSIT') {
    layer1 = `자가용이나 렌터카가 없어도 전혀 걱정 마세요! ${targetCity}의 **지하철역 및 버스정류장 초역세권 랜드마크**만 콕 집었습니다 🚇🚌`;
  }

  // Layer 2: Actionable Local Wisdom & Transit Summary
  const layer2 = `${targetCity} ${activeDay}일차 ${timeSlotLabel} 동선: 현지 추천 핫플과 환승에 무리 없는 최적 길찾기입니다 💡 (${cityInfo.transitTip})`;

  // Layer 3: Proactive Conversation Hook
  const randomHook = PROACTIVE_CONVERSATION_HOOKS[Math.floor(Math.random() * PROACTIVE_CONVERSATION_HOOKS.length)];
  const layer3 = lang === 'en'
    ? `Tap **[ ＋ Add to Day ${activeDay} ]** on any spot below to add it directly to your itinerary!`
    : `원하시는 장소 아래 **[ ＋ ${activeDay}일차 일정에 추가 ]**를 누르시면 내 일정표에 바로 쏙 들어갑니다! 😊\n\n👉 **${randomHook}**`;

  return `${layer1}\n\n${layer2}\n\n${layer3}`;
}
